// Fase 3 — Convite por e-mail e aceite do termo in-app (imobiliárias).
//
// A fase 1 vinculava corretor à imobiliária pelo painel /admin, com a data do
// termo digitada pelo admin da plataforma. Funcionava, mas quem afirmava o
// consentimento era o admin, não o corretor. Aqui o gestor convida por e-mail,
// e quem aceita é o próprio corretor, dentro do app, com a hora carimbada pelo
// servidor.
//
// TRÊS PONTOS QUE SUSTENTAM A SEGURANÇA DISTO:
//
// 1. O token do link NÃO é credencial. O aceite é autorizado comparando o
//    e-mail do convite com o e-mail da conta autenticada (sem diferenciar
//    maiúsculas). Um token vazado, sozinho, não vincula ninguém: quem clicar
//    precisa estar logado naquela conta.
//
// 2. `agency_members` continua FECHADA na API (create/update só admin, fase 1,
//    critério 6). O aceite grava com $app.saveNoValidate, que roda com
//    privilégio de aplicação. O corretor nunca escreve na coleção pela API, e
//    o `termo_aceito_em` sai do relógio do servidor, nunca do cliente.
//
// 3. O corpo do e-mail é FIXO. O gestor informa só o endereço de destino; não
//    existe campo de recado livre. Sem isso, o convite viraria um canal de
//    envio de texto arbitrário para endereços arbitrários, assinado pelo
//    domínio da Prime Circle.
//
// Handlers do JSVM são isolados: não enxergam função declarada fora deles. Por
// isso os helpers (achar perfil, montar e-mail, ler data) aparecem repetidos
// dentro de cada rota. É a mesma razão da duplicação em validar_minuta.js.

// ── POST /backend/v1/agencia/convites — o gestor convida um corretor ────────
//
// Quem pode: a conta-imobiliária convidando para a própria casa, ou o admin da
// plataforma passando `agency` no corpo (é assim que o bloco do /admin usa).
//
// O que NÃO é checado aqui, de propósito: se o convidado já pertence a OUTRA
// imobiliária. Responder isso ao gestor entregaria a ele um dado do corretor
// que não é dele. A checagem existe, mas no aceite, onde a resposta vai para o
// próprio corretor: "você já faz parte de X, saia de lá antes de aceitar".
routerAdd(
  'POST',
  '/backend/v1/agencia/convites',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }
    var isAdmin = auth.getBool('isAdmin') === true
    if (!isAdmin && !auth.getBool('verified')) {
      return e.json(403, { error: 'Confirme seu e-mail para liberar o acesso.' })
    }

    var body = e.requestInfo().body || {}
    var emailAlvo = String(body.email || '')
      .trim()
      .toLowerCase()
    if (!emailAlvo || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailAlvo)) {
      return e.json(400, { error: 'Informe um e-mail válido.' })
    }

    // O admin da plataforma convida em nome de uma imobiliária; o gestor
    // convida para a própria casa e não escolhe.
    var agencyId = isAdmin && body.agency ? String(body.agency) : auth.id

    // Gate: `agencyId` tem de ser uma conta-imobiliária de verdade.
    var agencyProfile = null
    try {
      var profs = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, {
        u: agencyId,
      })
      if (profs && profs.length > 0) agencyProfile = profs[0]
    } catch (gateErr) {
      $app.logger().error('agencia_convites: gate falhou', 'error', String(gateErr))
    }
    if (!agencyProfile || agencyProfile.getString('tipo_perfil') !== 'imobiliaria') {
      return e.json(403, { error: 'Acesso restrito a imobiliárias.' })
    }

    // ── Rate limit (janela fixa de 60s, fail-open) ────────────────────────
    // Aqui o limite é bem menor que o das rotas de IA: cada chamada dispara um
    // e-mail para um endereço escolhido por quem chama. Cinco por minuto cobre
    // o gestor cadastrando a equipe e fecha a porta do disparo em massa.
    try {
      var rlNowSec = Math.floor(Date.now() / 1000)
      var rlWindowStart = Math.floor(rlNowSec / 60) * 60
      var rlLimit = 5
      try {
        var rlStale = $app.findRecordsByFilter(
          'rate_limits',
          'window_start < {:cutoff}',
          '',
          200,
          0,
          {
            cutoff: rlWindowStart - 120,
          },
        )
        for (var rlPurgeI = 0; rlPurgeI < rlStale.length; rlPurgeI++) {
          try {
            $app.delete(rlStale[rlPurgeI])
          } catch (_) {}
        }
      } catch (rlCleanErr) {
        $app.logger().error('rate_limits: limpeza falhou', 'error', String(rlCleanErr))
      }

      var rlExisting = []
      try {
        rlExisting = $app.findRecordsByFilter(
          'rate_limits',
          'user = {:uid} && endpoint = {:ep} && window_start = {:ws}',
          '',
          1,
          0,
          { uid: auth.id, ep: 'agencia_convite', ws: rlWindowStart },
        )
      } catch (rlFindErr) {
        $app.logger().error('rate_limits: busca falhou', 'error', String(rlFindErr))
      }

      if (rlExisting && rlExisting.length > 0) {
        var rlRec = rlExisting[0]
        var rlCount = (rlRec.getInt('count') || 0) + 1
        rlRec.set('count', rlCount)
        $app.saveNoValidate(rlRec)
        if (rlCount > rlLimit) {
          var rlWaitSec = Math.max(1, rlWindowStart + 60 - rlNowSec)
          return e.json(429, {
            error: 'Muitos convites seguidos. Aguarde ' + rlWaitSec + ' segundos.',
          })
        }
      } else {
        var rlCol = $app.findCollectionByNameOrId('rate_limits')
        var rlNewRec = new Record(rlCol)
        rlNewRec.set('user', auth.id)
        rlNewRec.set('endpoint', 'agencia_convite')
        rlNewRec.set('window_start', rlWindowStart)
        rlNewRec.set('count', 1)
        $app.saveNoValidate(rlNewRec)
      }
    } catch (rlErr) {
      $app.logger().error('rate_limits: erro (fail-open)', 'error', String(rlErr))
    }

    // Conta do convidado, se já existir. Guardamos no convite o e-mail EXATO
    // da conta quando ela existe: assim a regra de leitura
    // (email = @request.auth.email) casa mesmo se ele se cadastrou com
    // maiúsculas. Sem conta, guardamos o endereço normalizado.
    var convidado = null
    try {
      convidado = $app.findAuthRecordByEmail('users', emailAlvo)
    } catch (_) {
      convidado = null
    }
    if (!convidado) {
      // Rede de segurança: se findAuthRecordByEmail não estiver disponível,
      // uma busca direta ainda acha a conta cadastrada em minúsculas, que é o
      // caso comum. Não achar não invalida nada: o convite continua valendo e
      // o link do e-mail passa a apontar para o cadastro.
      try {
        var achados = $app.findRecordsByFilter('users', 'email = {:e}', '', 1, 0, { e: emailAlvo })
        if (achados && achados.length > 0) convidado = achados[0]
      } catch (_) {}
    }
    var emailGravado = convidado ? convidado.email() : emailAlvo

    if (convidado && convidado.id === agencyId) {
      return e.json(400, { error: 'Esta é a conta da própria imobiliária.' })
    }

    // Já está na equipe desta casa? O gestor vê isso na tela, mas a checagem
    // evita convite inútil quando as duas telas estão abertas ao mesmo tempo.
    if (convidado) {
      try {
        var jaMembro = $app.findRecordsByFilter(
          'agency_members',
          "agency = {:a} && member = {:m} && status = 'ativo'",
          '',
          1,
          0,
          { a: agencyId, m: convidado.id },
        )
        if (jaMembro && jaMembro.length > 0) {
          return e.json(400, { error: 'Este corretor já faz parte da sua equipe.' })
        }
      } catch (_) {}
    }

    // Convite pendente já emitido por esta casa para este endereço.
    try {
      var pendentes = $app.findRecordsByFilter(
        'agency_invites',
        "agency = {:a} && email = {:e} && status = 'pendente'",
        '',
        1,
        0,
        { a: agencyId, e: emailGravado },
      )
      if (pendentes && pendentes.length > 0) {
        return e.json(400, {
          error: 'Já existe um convite pendente para este e-mail. Use "Reenviar" na lista.',
        })
      }
    } catch (_) {}

    var token = ''
    try {
      token = $security.randomString(40)
    } catch (tokErr) {
      $app.logger().error('agencia_convites: randomString falhou', 'error', String(tokErr))
      return e.json(500, { error: 'Não foi possível gerar o convite.' })
    }

    var agora = new Date()
    var expiraEm = new Date(agora.getTime() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')

    var convite = null
    try {
      var col = $app.findCollectionByNameOrId('agency_invites')
      convite = new Record(col)
      convite.set('agency', agencyId)
      convite.set('email', emailGravado)
      convite.set('convidado_por', auth.id)
      convite.set('status', 'pendente')
      convite.set('token', token)
      convite.set('expira_em', expiraEm)
      $app.saveNoValidate(convite)
    } catch (saveErr) {
      $app.logger().error('agencia_convites: falha ao gravar convite', 'error', String(saveErr))
      return e.json(500, { error: 'Não foi possível registrar o convite.' })
    }

    // ── E-mail do convite ─────────────────────────────────────────────────
    // Falha de envio NÃO invalida o convite: ele continua pendente e aparece
    // in-app para o corretor. Por isso o try/catch e o `email_enviado` na
    // resposta, que a tela usa para oferecer o reenvio.
    var emailEnviado = false
    try {
      var nomeCasa =
        agencyProfile.getString('razao_social') ||
        agencyProfile.getString('nome_fantasia') ||
        agencyProfile.getString('name') ||
        'uma imobiliária'
      var creciCasa = agencyProfile.getString('creci_juridico') || ''
      var meta = $app.settings().meta
      var baseUrl = ''
      try {
        baseUrl = String(meta.appURL || '')
      } catch (_) {
        baseUrl = ''
      }
      if (!baseUrl) baseUrl = 'https://www.documentos.primecircle.app.br'
      baseUrl = baseUrl.replace(/\/+$/, '')
      var link = convidado
        ? baseUrl + '/perfil?convite=' + token
        : baseUrl + '/signup?convite=' + token

      var chamada = convidado
        ? 'Entre na sua conta para ler o termo e decidir.'
        : 'Crie sua conta com este mesmo e-mail. O convite estará esperando por você lá dentro.'
      var rotulo = convidado ? 'Ver o convite' : 'Criar conta e ver o convite'

      var msg = new MailerMessage({
        from: { address: meta.senderAddress, name: meta.senderName },
        to: [{ address: emailGravado }],
        subject: nomeCasa + ' convidou você para a equipe | Prime Circle Documentos',
        html:
          '<div style="margin:0;padding:32px 16px;background:#0E0E0E;">' +
          '<div style="max-width:480px;margin:0 auto;background:#FAF6EE;border-radius:12px;overflow:hidden;">' +
          '<div style="padding:28px 32px 0 32px;">' +
          '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;color:#C9A84C;font-weight:bold;">PRIME CIRCLE</p>' +
          '<p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#8A8578;">D O C U M E N T O S</p>' +
          '</div>' +
          '<div style="padding:20px 32px 32px 32px;">' +
          '<h1 style="margin:0 0 12px 0;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:normal;color:#0E0E0E;">Convite para uma equipe</h1>' +
          '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;"><strong>' +
          nomeCasa +
          '</strong>' +
          (creciCasa ? ' (CRECI PJ ' + creciCasa + ')' : '') +
          ' convidou você para fazer parte da equipe dela no Prime Circle Documentos.</p>' +
          '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Aceitando, os negócios que você criar a partir daí passam a ficar visíveis para a imobiliária, e a régua jurídica da casa entra nas suas validações. Você decide: nada acontece antes do seu aceite, e você pode sair quando quiser.</p>' +
          '<p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">' +
          chamada +
          '</p>' +
          '<a href="' +
          link +
          '" target="_blank" rel="noopener" style="display:inline-block;background:#0E0E0E;color:#C9A84C;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;line-height:44px;padding:0 28px;border-radius:8px;">' +
          rotulo +
          '</a>' +
          '<p style="margin:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8578;">O convite vale por 14 dias. Se você não conhece esta imobiliária, ignore este e-mail: sem o seu aceite, ela não vê nada seu.</p>' +
          '</div>' +
          '<div style="padding:14px 32px;background:#F1EBDD;">' +
          '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8578;">Prime Circle Documentos</p>' +
          '</div>' +
          '</div>' +
          '</div>',
      })
      $app.newMailClient().send(msg)
      emailEnviado = true
    } catch (mailErr) {
      $app.logger().error('agencia_convites: envio do convite falhou', 'error', String(mailErr))
    }

    return e.json(200, {
      id: convite.id,
      email: emailGravado,
      status: 'pendente',
      expira_em: expiraEm,
      email_enviado: emailEnviado,
      conta_existente: !!convidado,
    })
  },
  $apis.requireAuth(),
)

// ── POST /backend/v1/agencia/convites/reenviar ─────────────────────────────
// Reenvia o e-mail de um convite ainda pendente e renova o prazo. Existe
// porque a falha de envio não invalida o convite: sem o reenvio, o gestor
// ficaria olhando um convite pendente que nunca chegou na caixa de ninguém.
// O token NÃO é trocado: ele não é segredo, e trocar quebraria o link antigo
// se por acaso o primeiro e-mail tiver chegado.
routerAdd(
  'POST',
  '/backend/v1/agencia/convites/reenviar',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }
    var isAdmin = auth.getBool('isAdmin') === true

    var body = e.requestInfo().body || {}
    var conviteId = String(body.id || '')
    if (!conviteId) return e.json(400, { error: 'Convite não informado.' })

    var convite = null
    try {
      convite = $app.findRecordById('agency_invites', conviteId)
    } catch (_) {
      convite = null
    }
    if (!convite) return e.json(404, { error: 'Convite não encontrado.' })

    var agencyId = convite.getString('agency')
    if (!isAdmin && agencyId !== auth.id) {
      return e.json(403, { error: 'Este convite não é da sua imobiliária.' })
    }
    if (convite.getString('status') !== 'pendente') {
      return e.json(400, { error: 'Só dá para reenviar um convite pendente.' })
    }

    // Mesmo limite do envio: cada reenvio é um e-mail disparado.
    try {
      var rlNowSec = Math.floor(Date.now() / 1000)
      var rlWindowStart = Math.floor(rlNowSec / 60) * 60
      var rlExisting = []
      try {
        rlExisting = $app.findRecordsByFilter(
          'rate_limits',
          'user = {:uid} && endpoint = {:ep} && window_start = {:ws}',
          '',
          1,
          0,
          { uid: auth.id, ep: 'agencia_convite', ws: rlWindowStart },
        )
      } catch (rlFindErr) {
        $app.logger().error('rate_limits: busca falhou', 'error', String(rlFindErr))
      }
      if (rlExisting && rlExisting.length > 0) {
        var rlRec = rlExisting[0]
        var rlCount = (rlRec.getInt('count') || 0) + 1
        rlRec.set('count', rlCount)
        $app.saveNoValidate(rlRec)
        if (rlCount > 5) {
          var rlWaitSec = Math.max(1, rlWindowStart + 60 - rlNowSec)
          return e.json(429, {
            error: 'Muitos convites seguidos. Aguarde ' + rlWaitSec + ' segundos.',
          })
        }
      } else {
        var rlCol = $app.findCollectionByNameOrId('rate_limits')
        var rlNewRec = new Record(rlCol)
        rlNewRec.set('user', auth.id)
        rlNewRec.set('endpoint', 'agencia_convite')
        rlNewRec.set('window_start', rlWindowStart)
        rlNewRec.set('count', 1)
        $app.saveNoValidate(rlNewRec)
      }
    } catch (rlErr) {
      $app.logger().error('rate_limits: erro (fail-open)', 'error', String(rlErr))
    }

    var expiraEm = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ')
    try {
      convite.set('expira_em', expiraEm)
      $app.saveNoValidate(convite)
    } catch (saveErr) {
      $app.logger().error('agencia_convites: renovar prazo falhou', 'error', String(saveErr))
    }

    var emailGravado = convite.getString('email')
    var token = convite.getString('token')

    var agencyProfile = null
    try {
      var profs = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, {
        u: agencyId,
      })
      if (profs && profs.length > 0) agencyProfile = profs[0]
    } catch (_) {}

    var temConta = false
    try {
      temConta = !!$app.findAuthRecordByEmail('users', emailGravado)
    } catch (_) {
      temConta = false
    }

    var emailEnviado = false
    try {
      var nomeCasa = agencyProfile
        ? agencyProfile.getString('razao_social') ||
          agencyProfile.getString('nome_fantasia') ||
          agencyProfile.getString('name') ||
          'uma imobiliária'
        : 'uma imobiliária'
      var creciCasa = agencyProfile ? agencyProfile.getString('creci_juridico') || '' : ''
      var meta = $app.settings().meta
      var baseUrl = ''
      try {
        baseUrl = String(meta.appURL || '')
      } catch (_) {
        baseUrl = ''
      }
      if (!baseUrl) baseUrl = 'https://www.documentos.primecircle.app.br'
      baseUrl = baseUrl.replace(/\/+$/, '')
      var link = temConta
        ? baseUrl + '/perfil?convite=' + token
        : baseUrl + '/signup?convite=' + token
      var chamada = temConta
        ? 'Entre na sua conta para ler o termo e decidir.'
        : 'Crie sua conta com este mesmo e-mail. O convite estará esperando por você lá dentro.'
      var rotulo = temConta ? 'Ver o convite' : 'Criar conta e ver o convite'

      var msg = new MailerMessage({
        from: { address: meta.senderAddress, name: meta.senderName },
        to: [{ address: emailGravado }],
        subject: 'Lembrete: ' + nomeCasa + ' convidou você | Prime Circle Documentos',
        html:
          '<div style="margin:0;padding:32px 16px;background:#0E0E0E;">' +
          '<div style="max-width:480px;margin:0 auto;background:#FAF6EE;border-radius:12px;overflow:hidden;">' +
          '<div style="padding:28px 32px 0 32px;">' +
          '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;color:#C9A84C;font-weight:bold;">PRIME CIRCLE</p>' +
          '<p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#8A8578;">D O C U M E N T O S</p>' +
          '</div>' +
          '<div style="padding:20px 32px 32px 32px;">' +
          '<h1 style="margin:0 0 12px 0;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:normal;color:#0E0E0E;">Seu convite continua aberto</h1>' +
          '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;"><strong>' +
          nomeCasa +
          '</strong>' +
          (creciCasa ? ' (CRECI PJ ' + creciCasa + ')' : '') +
          ' convidou você para a equipe dela no Prime Circle Documentos e ainda espera sua resposta.</p>' +
          '<p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">' +
          chamada +
          '</p>' +
          '<a href="' +
          link +
          '" target="_blank" rel="noopener" style="display:inline-block;background:#0E0E0E;color:#C9A84C;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;line-height:44px;padding:0 28px;border-radius:8px;">' +
          rotulo +
          '</a>' +
          '<p style="margin:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8578;">O convite vale por mais 14 dias. Se você não conhece esta imobiliária, ignore este e-mail: sem o seu aceite, ela não vê nada seu.</p>' +
          '</div>' +
          '<div style="padding:14px 32px;background:#F1EBDD;">' +
          '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8578;">Prime Circle Documentos</p>' +
          '</div>' +
          '</div>' +
          '</div>',
      })
      $app.newMailClient().send(msg)
      emailEnviado = true
    } catch (mailErr) {
      $app.logger().error('agencia_convites: reenvio falhou', 'error', String(mailErr))
    }

    return e.json(200, { id: convite.id, expira_em: expiraEm, email_enviado: emailEnviado })
  },
  $apis.requireAuth(),
)

// ── POST /backend/v1/agencia/convites/cancelar ─────────────────────────────
// Cancelar é marcar, nunca apagar: mesmo princípio da remoção de membro na
// fase 1. O histórico responde a "quem convidou quem, e quando" num eventual
// questionamento.
routerAdd(
  'POST',
  '/backend/v1/agencia/convites/cancelar',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }
    var isAdmin = auth.getBool('isAdmin') === true

    var body = e.requestInfo().body || {}
    var conviteId = String(body.id || '')
    if (!conviteId) return e.json(400, { error: 'Convite não informado.' })

    var convite = null
    try {
      convite = $app.findRecordById('agency_invites', conviteId)
    } catch (_) {
      convite = null
    }
    if (!convite) return e.json(404, { error: 'Convite não encontrado.' })

    if (!isAdmin && convite.getString('agency') !== auth.id) {
      return e.json(403, { error: 'Este convite não é da sua imobiliária.' })
    }
    if (convite.getString('status') !== 'pendente') {
      return e.json(400, { error: 'Este convite já foi respondido.' })
    }

    try {
      convite.set('status', 'cancelado')
      convite.set('respondido_em', new Date().toISOString().replace('T', ' '))
      $app.saveNoValidate(convite)
    } catch (saveErr) {
      $app.logger().error('agencia_convites: cancelar falhou', 'error', String(saveErr))
      return e.json(500, { error: 'Não foi possível cancelar o convite.' })
    }

    return e.json(200, { id: convite.id, status: 'cancelado' })
  },
  $apis.requireAuth(),
)

// ── GET /backend/v1/convites/meus — o que o corretor tem para decidir ──────
//
// Devolve os convites pendentes endereçados ao e-mail da conta e o vínculo
// ativo dele, se houver.
//
// Por que é endpoint e não leitura direta: as duas informações que fazem o
// convite significar alguma coisa (razão social e CRECI da imobiliária) moram
// em `broker_profile`, que é owner-scoped. O corretor não lê o perfil de
// ninguém. Aqui o $app busca e devolve SÓ nome, CNPJ e CRECI da casa que o
// convidou: o que ele precisa para saber quem está do outro lado.
//
// O expurgo de convites vencidos acontece aqui, na leitura, marcando
// `expirado`. Não vale um cron próprio: um convite vencido só atrapalha no
// momento em que alguém olha para ele.
routerAdd(
  'GET',
  '/backend/v1/convites/meus',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }

    var meuEmail = String(auth.email() || '')
    var meuEmailLower = meuEmail.toLowerCase()
    var agoraMs = Date.now()

    var lerData = function (v) {
      var s = String(v || '').trim()
      if (!s) return 0
      var t = new Date(s.replace(' ', 'T')).getTime()
      return t || 0
    }

    var perfilCache = {}
    var dadosDaCasa = function (uid) {
      if (!uid) return { nome: '', cnpj: '', creci: '' }
      if (perfilCache[uid]) return perfilCache[uid]
      var out = { nome: '', cnpj: '', creci: '' }
      try {
        var rows = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, { u: uid })
        if (rows && rows.length > 0) {
          var p = rows[0]
          out.nome =
            p.getString('razao_social') ||
            p.getString('nome_fantasia') ||
            p.getString('nome') ||
            p.getString('name') ||
            ''
          out.cnpj = p.getString('cnpj') || ''
          out.creci = p.getString('creci_juridico') || ''
        }
      } catch (_) {}
      perfilCache[uid] = out
      return out
    }

    // Duas buscas porque o convite pode ter sido gravado com o e-mail exato da
    // conta (quando ela já existia) ou normalizado em minúsculas (quando não
    // existia ainda). Deduplicamos por id logo abaixo.
    var candidatos = []
    var chaves = meuEmail === meuEmailLower ? [meuEmail] : [meuEmail, meuEmailLower]
    for (var ci = 0; ci < chaves.length; ci++) {
      try {
        var rows = $app.findRecordsByFilter(
          'agency_invites',
          "email = {:e} && status = 'pendente'",
          '-created',
          50,
          0,
          { e: chaves[ci] },
        )
        for (var ri = 0; ri < rows.length; ri++) candidatos.push(rows[ri])
      } catch (_) {}
    }

    var vistos = {}
    var convites = []
    for (var i = 0; i < candidatos.length; i++) {
      var c = candidatos[i]
      if (vistos[c.id]) continue
      vistos[c.id] = true

      // Cinto e suspensório: a busca já filtra por e-mail, mas a comparação
      // sem diferenciar maiúsculas é a mesma que autoriza o aceite. Manter as
      // duas iguais evita que a tela ofereça um convite que o aceite recusaria.
      if (String(c.getString('email') || '').toLowerCase() !== meuEmailLower) continue

      var prazo = lerData(c.getString('expira_em'))
      if (prazo && prazo < agoraMs) {
        try {
          c.set('status', 'expirado')
          $app.saveNoValidate(c)
        } catch (expErr) {
          $app.logger().error('convites_meus: marcar expirado falhou', 'error', String(expErr))
        }
        continue
      }

      var casa = dadosDaCasa(c.getString('agency'))
      convites.push({
        id: c.id,
        token: c.getString('token'),
        agency_id: c.getString('agency'),
        agency_nome: casa.nome,
        agency_cnpj: casa.cnpj,
        agency_creci: casa.creci,
        criado: c.getString('created'),
        expira_em: c.getString('expira_em'),
      })
    }

    var vinculo = null
    try {
      var links = $app.findRecordsByFilter(
        'agency_members',
        "member = {:m} && status = 'ativo'",
        '-created',
        1,
        0,
        { m: auth.id },
      )
      if (links && links.length > 0) {
        var l = links[0]
        var casaAtual = dadosDaCasa(l.getString('agency'))
        vinculo = {
          id: l.id,
          agency_id: l.getString('agency'),
          agency_nome: casaAtual.nome,
          agency_cnpj: casaAtual.cnpj,
          agency_creci: casaAtual.creci,
          termo_aceito_em: l.getString('termo_aceito_em') || '',
          desde: l.getString('created'),
        }
      }
    } catch (vErr) {
      $app.logger().error('convites_meus: busca de vinculo falhou', 'error', String(vErr))
    }

    return e.json(200, { convites: convites, vinculo: vinculo })
  },
  $apis.requireAuth(),
)

// ── POST /backend/v1/convites/responder — o aceite (ou a recusa) ───────────
//
// Corpo: { id?, token?, acao: 'aceitar' | 'recusar' }.
//
// A AUTORIZAÇÃO É O E-MAIL, não o token: o convite só responde a quem está
// autenticado com o mesmo endereço para o qual foi emitido. É por isso que o
// link do e-mail pode circular sem virar risco.
//
// No aceite, `termo_aceito_em` recebe a hora do RELÓGIO DO SERVIDOR. O cliente
// não manda data nenhuma. E a gravação usa $app.saveNoValidate, mantendo
// `agency_members` fechada na API como a fase 1 deixou.
routerAdd(
  'POST',
  '/backend/v1/convites/responder',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }
    if (!auth.getBool('verified') && !auth.getBool('isAdmin')) {
      return e.json(403, { error: 'Confirme seu e-mail para liberar o acesso.' })
    }

    var body = e.requestInfo().body || {}
    var acao = String(body.acao || '').trim()
    if (acao !== 'aceitar' && acao !== 'recusar') {
      return e.json(400, { error: 'Ação inválida.' })
    }

    var convite = null
    if (body.id) {
      try {
        convite = $app.findRecordById('agency_invites', String(body.id))
      } catch (_) {
        convite = null
      }
    }
    if (!convite && body.token) {
      try {
        var rows = $app.findRecordsByFilter('agency_invites', 'token = {:t}', '', 1, 0, {
          t: String(body.token),
        })
        if (rows && rows.length > 0) convite = rows[0]
      } catch (_) {}
    }
    if (!convite) return e.json(404, { error: 'Convite não encontrado.' })

    // A porta: e-mail do convite == e-mail da conta autenticada.
    var meuEmailLower = String(auth.email() || '').toLowerCase()
    if (String(convite.getString('email') || '').toLowerCase() !== meuEmailLower) {
      return e.json(403, { error: 'Este convite foi enviado para outro e-mail.' })
    }

    if (convite.getString('status') !== 'pendente') {
      return e.json(400, { error: 'Este convite já foi respondido.' })
    }

    var prazoStr = String(convite.getString('expira_em') || '').trim()
    if (prazoStr) {
      var prazo = new Date(prazoStr.replace(' ', 'T')).getTime()
      if (prazo && prazo < Date.now()) {
        try {
          convite.set('status', 'expirado')
          $app.saveNoValidate(convite)
        } catch (_) {}
        return e.json(400, { error: 'Este convite venceu. Peça um convite novo à imobiliária.' })
      }
    }

    var agoraIso = new Date().toISOString().replace('T', ' ')
    var agencyId = convite.getString('agency')

    var nomeDaCasa = function (uid) {
      try {
        var rows = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, { u: uid })
        if (rows && rows.length > 0) {
          return (
            rows[0].getString('razao_social') ||
            rows[0].getString('nome_fantasia') ||
            rows[0].getString('nome') ||
            rows[0].getString('name') ||
            'a imobiliária'
          )
        }
      } catch (_) {}
      return 'a imobiliária'
    }

    if (acao === 'recusar') {
      try {
        convite.set('status', 'recusado')
        convite.set('member', auth.id)
        convite.set('respondido_em', agoraIso)
        $app.saveNoValidate(convite)
      } catch (saveErr) {
        $app.logger().error('convites_responder: recusa falhou', 'error', String(saveErr))
        return e.json(500, { error: 'Não foi possível registrar a recusa.' })
      }
      return e.json(200, { status: 'recusado' })
    }

    // ── Aceite ────────────────────────────────────────────────────────────
    // Um corretor pertence a uma imobiliária por vez (regra da fase 1,
    // garantida por índice parcial). Checamos antes para dar a mensagem certa
    // a quem tem direito a ela: o próprio corretor, que sabe onde está.
    try {
      var ativos = $app.findRecordsByFilter(
        'agency_members',
        "member = {:m} && status = 'ativo'",
        '',
        1,
        0,
        { m: auth.id },
      )
      if (ativos && ativos.length > 0 && ativos[0].getString('agency') !== agencyId) {
        return e.json(409, {
          error:
            'Você já faz parte de ' +
            nomeDaCasa(ativos[0].getString('agency')) +
            '. Saia da imobiliária atual, no seu perfil, antes de aceitar este convite.',
        })
      }
    } catch (chkErr) {
      $app.logger().error('convites_responder: checagem de vinculo falhou', 'error', String(chkErr))
    }

    // Reativa a linha antiga em vez de criar outra: o índice único
    // (agency, member) da fase 1 barraria o INSERT duplicado.
    try {
      var existentes = $app.findRecordsByFilter(
        'agency_members',
        'agency = {:a} && member = {:m}',
        '',
        1,
        0,
        { a: agencyId, m: auth.id },
      )
      if (existentes && existentes.length > 0) {
        var vinculoRec = existentes[0]
        vinculoRec.set('status', 'ativo')
        vinculoRec.set('termo_aceito_em', agoraIso)
        $app.saveNoValidate(vinculoRec)
      } else {
        var col = $app.findCollectionByNameOrId('agency_members')
        var novo = new Record(col)
        novo.set('agency', agencyId)
        novo.set('member', auth.id)
        novo.set('status', 'ativo')
        novo.set('termo_aceito_em', agoraIso)
        $app.saveNoValidate(novo)
      }
    } catch (vincErr) {
      $app.logger().error('convites_responder: vinculo falhou', 'error', String(vincErr))
      return e.json(500, { error: 'Não foi possível concluir o aceite.' })
    }

    try {
      convite.set('status', 'aceito')
      convite.set('member', auth.id)
      convite.set('respondido_em', agoraIso)
      $app.saveNoValidate(convite)
    } catch (saveErr) {
      $app.logger().error('convites_responder: marcar aceito falhou', 'error', String(saveErr))
    }

    // Avisa o gestor. Falha de e-mail não desfaz o aceite.
    try {
      var gestor = $app.findRecordById('users', agencyId)
      var gestorEmail = gestor ? gestor.email() : ''
      if (gestorEmail) {
        var meta = $app.settings().meta
        var quem = auth.getString('name') || auth.email()
        var msg = new MailerMessage({
          from: { address: meta.senderAddress, name: meta.senderName },
          to: [{ address: gestorEmail }],
          subject: quem + ' aceitou o convite para a sua equipe',
          html:
            '<p><strong>' +
            quem +
            '</strong> aceitou o convite e agora faz parte da equipe da sua imobiliária no Prime Circle Documentos.</p>' +
            '<p>Os negócios que ele criar a partir de agora nascem carimbados com a imobiliária e aparecem na página Equipe. O aceite do termo ficou registrado com data e hora.</p>',
        })
        $app.newMailClient().send(msg)
      }
    } catch (mailErr) {
      $app.logger().error('convites_responder: aviso ao gestor falhou', 'error', String(mailErr))
    }

    return e.json(200, {
      status: 'aceito',
      agency_id: agencyId,
      agency_nome: nomeDaCasa(agencyId),
      termo_aceito_em: agoraIso,
    })
  },
  $apis.requireAuth(),
)

// ── POST /backend/v1/vinculo/sair — o corretor revoga o consentimento ──────
//
// Contrapartida do aceite in-app. Consentimento que só a outra parte consegue
// desfazer não é consentimento; se o corretor dá o aceite sozinho, ele precisa
// conseguir voltar atrás sozinho.
//
// O efeito é o MESMO da remoção pelo gestor (fase 1): status vira 'removido',
// a linha não é apagada, e os negócios já carimbados continuam com a casa que
// os intermediou. O que muda é daqui para frente: negócio novo nasce sem
// carimbo. A tela diz isso com todas as letras antes de confirmar.
routerAdd(
  'POST',
  '/backend/v1/vinculo/sair',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }

    var vinculo = null
    try {
      var links = $app.findRecordsByFilter(
        'agency_members',
        "member = {:m} && status = 'ativo'",
        '-created',
        1,
        0,
        { m: auth.id },
      )
      if (links && links.length > 0) vinculo = links[0]
    } catch (findErr) {
      $app.logger().error('vinculo_sair: busca falhou', 'error', String(findErr))
      return e.json(500, { error: 'Não foi possível ler o seu vínculo.' })
    }
    if (!vinculo) {
      return e.json(400, { error: 'Você não faz parte de nenhuma imobiliária.' })
    }

    var agencyId = vinculo.getString('agency')
    try {
      vinculo.set('status', 'removido')
      $app.saveNoValidate(vinculo)
    } catch (saveErr) {
      $app.logger().error('vinculo_sair: gravacao falhou', 'error', String(saveErr))
      return e.json(500, { error: 'Não foi possível sair da imobiliária.' })
    }

    try {
      var gestor = $app.findRecordById('users', agencyId)
      var gestorEmail = gestor ? gestor.email() : ''
      if (gestorEmail) {
        var meta = $app.settings().meta
        var quem = auth.getString('name') || auth.email()
        var msg = new MailerMessage({
          from: { address: meta.senderAddress, name: meta.senderName },
          to: [{ address: gestorEmail }],
          subject: quem + ' saiu da sua equipe',
          html:
            '<p><strong>' +
            quem +
            '</strong> saiu da equipe da sua imobiliária no Prime Circle Documentos.</p>' +
            '<p>Os negócios que ele já tinha criado pela casa continuam acessíveis na página Equipe. Os próximos negócios dele nascem sem o carimbo da imobiliária.</p>',
        })
        $app.newMailClient().send(msg)
      }
    } catch (mailErr) {
      $app.logger().error('vinculo_sair: aviso ao gestor falhou', 'error', String(mailErr))
    }

    return e.json(200, { status: 'removido' })
  },
  $apis.requireAuth(),
)

// ── POST /backend/v1/agencia/membros/remover ───────────────────────────────
//
// Consequência direta desta fase: o gestor passou a montar a equipe sozinho,
// pelo convite, sem depender do admin da plataforma. Deixar a REMOÇÃO só no
// /admin criaria uma assimetria estranha (entra sozinho, mas para sair precisa
// abrir chamado), e o corretor já pode sair por conta própria.
//
// Efeito idêntico ao da remoção pelo /admin (fase 1): status vira 'removido',
// a linha NÃO é apagada, e os negócios já carimbados continuam com a casa. A
// `deleteRule` de `negocios` segue intocada: o gestor nunca apaga negócio de
// ninguém, aqui só se desfaz o vínculo daqui para frente.
//
// Por endpoint, e não por API rule: abrir `agency_members` para update do
// gestor deixaria também `termo_aceito_em` ao alcance dele, que é exatamente o
// campo que esta fase tirou das mãos de quem não é o titular do consentimento.
routerAdd(
  'POST',
  '/backend/v1/agencia/membros/remover',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito.' })
    }
    var isAdmin = auth.getBool('isAdmin') === true

    var body = e.requestInfo().body || {}
    var memberUserId = String(body.member || '')
    var agencyId = isAdmin && body.agency ? String(body.agency) : auth.id
    if (!memberUserId) return e.json(400, { error: 'Corretor não informado.' })

    var vinculo = null
    try {
      var links = $app.findRecordsByFilter(
        'agency_members',
        "agency = {:a} && member = {:m} && status = 'ativo'",
        '',
        1,
        0,
        { a: agencyId, m: memberUserId },
      )
      if (links && links.length > 0) vinculo = links[0]
    } catch (findErr) {
      $app.logger().error('membros_remover: busca falhou', 'error', String(findErr))
      return e.json(500, { error: 'Não foi possível ler o vínculo.' })
    }
    if (!vinculo) {
      return e.json(404, { error: 'Este corretor não está ativo na sua equipe.' })
    }

    try {
      vinculo.set('status', 'removido')
      $app.saveNoValidate(vinculo)
    } catch (saveErr) {
      $app.logger().error('membros_remover: gravacao falhou', 'error', String(saveErr))
      return e.json(500, { error: 'Não foi possível remover o corretor.' })
    }

    // Avisa o corretor: ele deu um consentimento e tem direito de saber que o
    // vínculo acabou, sem precisar descobrir sozinho pela tela.
    try {
      var membro = $app.findRecordById('users', memberUserId)
      var membroEmail = membro ? membro.email() : ''
      if (membroEmail) {
        var nomeCasa = 'a imobiliária'
        try {
          var profs = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, {
            u: agencyId,
          })
          if (profs && profs.length > 0) {
            nomeCasa =
              profs[0].getString('razao_social') ||
              profs[0].getString('nome_fantasia') ||
              profs[0].getString('name') ||
              'a imobiliária'
          }
        } catch (_) {}
        var meta = $app.settings().meta
        var msg = new MailerMessage({
          from: { address: meta.senderAddress, name: meta.senderName },
          to: [{ address: membroEmail }],
          subject: 'Seu vínculo com ' + nomeCasa + ' foi encerrado',
          html:
            '<p>O vínculo da sua conta com <strong>' +
            nomeCasa +
            '</strong> no Prime Circle Documentos foi encerrado.</p>' +
            '<p>Os negócios que você criar a partir de agora ficam só com você, como corretor autônomo. Os que a casa já tinha intermediado continuam visíveis para ela.</p>',
        })
        $app.newMailClient().send(msg)
      }
    } catch (mailErr) {
      $app.logger().error('membros_remover: aviso ao corretor falhou', 'error', String(mailErr))
    }

    return e.json(200, { status: 'removido' })
  },
  $apis.requireAuth(),
)
