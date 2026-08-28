// Gestão de usuários no /admin: a lista e as duas ações do piloto.
//
// Nasceu para a fase de convites fechados: o admin precisa ver quem se
// cadastrou, quem confirmou o e-mail, em que pé está o teste de cada um, e
// executar as duas ações que hoje exigem abrir o painel do PocketBase:
// estender o teste e carimbar plano. Só isso, de propósito: bloquear ou
// excluir conta não tem caso de uso hoje e só aumentaria a superfície de
// risco de um painel que escreve em produção.
//
// SOBRE PII: diferente do admin_overview, que só devolve agregados, este
// endpoint devolve registro individual de `users` (e-mail, nome, estado de
// plano). É deliberado: é a mesma informação que o admin já vê no painel do
// PocketBase, e gestão de conta não existe sem identificar a conta. O que
// NUNCA sai daqui é dado de cliente final (CPF, RG, endereço), que mora em
// `negocios` e não é tocado por este arquivo.
//
// As escritas usam $app.save (programáticas), então NÃO passam pelo pipeline
// de request e não disparam trial_carimbo/plano_carimbo. É o comportamento
// certo: aquelas guardas existem para desfazer escrita de NÃO-admin, e aqui
// só chega admin (gate no topo de cada rota, mesmo padrão do admin_overview).

// ── Lista ────────────────────────────────────────────────────────────────────
routerAdd(
  'GET',
  '/backend/v1/admin/usuarios',
  (e) => {
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    try {
      // Teto de 500: hoje são meia dúzia de contas e o piloto adiciona dezenas.
      // Quando isso apertar, o certo é paginar, não subir o número.
      var users = $app.findRecordsByFilter('users', "id != ''", '-created', 500, 0)

      var lista = []
      for (var i = 0; i < users.length; i++) {
        var u = users[i]
        lista.push({
          id: u.id,
          email: u.email(),
          name: u.getString('name'),
          verified: u.verified(),
          isAdmin: u.getBool('isAdmin'),
          created: u.getString('created'),
          trial_expira_em: u.getString('trial_expira_em'),
          plano: u.getString('plano'),
          plano_renova_em: u.getString('plano_renova_em'),
          negocios_no_mes: u.getInt('negocios_no_mes'),
          contador_mes: u.getString('contador_mes'),
          plano_limite_negocios: u.getInt('plano_limite_negocios'),
        })
      }
      return e.json(200, { usuarios: lista })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha ao listar', 'error', String(err))
      return e.json(500, { error: 'Não foi possível carregar os usuários.' })
    }
  },
  $apis.requireAuth(),
)

// ── Estender o teste ─────────────────────────────────────────────────────────
// Carimba trial_expira_em = agora + dias. Serve para o piloto (30 dias de
// cortesia) e para reabrir o teste de quem pediu mais prazo.
routerAdd(
  'POST',
  '/backend/v1/admin/usuarios/trial',
  (e) => {
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    // Dentro do handler, como sempre: o JSVM não enxerga escopo de módulo.
    var DIAS_MIN = 1
    var DIAS_MAX = 90

    try {
      var body = e.requestInfo().body || {}
      var userId = String(body.user_id || '')
      var dias = parseInt(String(body.dias || ''), 10)

      if (!userId) return e.json(400, { error: 'user_id é obrigatório.' })
      if (!Number.isFinite(dias) || dias < DIAS_MIN || dias > DIAS_MAX) {
        return e.json(400, {
          error: 'dias precisa estar entre ' + DIAS_MIN + ' e ' + DIAS_MAX + '.',
        })
      }

      var user = $app.findRecordById('users', userId)
      var novaData = new Date(Date.now() + dias * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace('T', ' ')
      user.set('trial_expira_em', novaData)
      $app.save(user)

      return e.json(200, { ok: true, trial_expira_em: novaData })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha ao estender teste', 'error', String(err))
      return e.json(500, { error: 'Não foi possível estender o teste.' })
    }
  },
  $apis.requireAuth(),
)

// ── Carimbar plano ───────────────────────────────────────────────────────────
// O caminho manual de assinatura: o admin combinou o pagamento (ou o benefício
// da família Prime Circle) e registra o plano. Plano vazio limpa tudo e a
// conta volta à régua do teste.
routerAdd(
  'POST',
  '/backend/v1/admin/usuarios/plano',
  (e) => {
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    // Espelho da tabela do negocio_limite.js. Se um dia divergirem, o limite
    // que vale no fim é o de lá, porque é recarimbado a cada operação; este
    // aqui só evita a janela entre o carimbo do plano e a primeira operação.
    var LIMITES = {
      avulso: 1,
      corretor: 10,
      profissional: 30,
      imobiliaria: 30,
    }
    var MESES_VALIDOS = { 1: true, 12: true }

    try {
      var body = e.requestInfo().body || {}
      var userId = String(body.user_id || '')
      var plano = String(body.plano || '')
      var meses = parseInt(String(body.meses || '1'), 10)

      if (!userId) return e.json(400, { error: 'user_id é obrigatório.' })

      var user = $app.findRecordById('users', userId)

      if (plano === '') {
        user.set('plano', '')
        user.set('plano_renova_em', '')
        user.set('plano_limite_negocios', 0)
        $app.save(user)
        return e.json(200, { ok: true, plano: '' })
      }

      if (!Object.prototype.hasOwnProperty.call(LIMITES, plano)) {
        return e.json(400, { error: 'Plano desconhecido: ' + plano })
      }
      if (!MESES_VALIDOS[meses]) {
        return e.json(400, { error: 'meses precisa ser 1 (mensal) ou 12 (anual).' })
      }
      // Avulso de 12 meses não existe: ele é uma compra única, com prazo de um
      // mês para usar. Deixar passar criaria um plano que a página de preços
      // não vende e que ninguém saberia explicar depois.
      if (plano === 'avulso' && meses !== 1) {
        return e.json(400, { error: 'O avulso é de um mês. Para 12 meses, use um plano.' })
      }

      // Mês de CALENDÁRIO, não bloco de 30 dias. Com 30 dias fixos, o plano
      // anual venceria em 360 dias: o corretor pagaria o ano e perderia cinco
      // dias, e ainda por cima na data em que ele mais confere, a da renovação.
      // Detalhe pequeno que só aparece para quem paga, que é exatamente o
      // público em que não se pode errar. Virou visível quando o anual passou a
      // ser o preço em destaque na página de planos.
      var dataRenova = new Date()
      dataRenova.setMonth(dataRenova.getMonth() + meses)
      var renova = dataRenova.toISOString().replace('T', ' ')
      user.set('plano', plano)
      user.set('plano_renova_em', renova)
      user.set('plano_limite_negocios', LIMITES[plano])
      // Zera o contador de validação do avulso a cada carimbo. Ele NÃO pode ser
      // o contador mensal: o avulso dura 30 dias e atravessa a virada de mês, e
      // com o mensal quem comprasse dia 28 e validasse dia 29 ganharia outra
      // validação no dia 1º. Aqui o marco é a compra, que é o que foi vendido.
      // Zerar em todo carimbo, e não só no do avulso, é de propósito: assim um
      // corretor que sai do plano e volta para um avulso começa limpo.
      user.set('avulso_validacoes', 0)
      $app.save(user)

      return e.json(200, { ok: true, plano: plano, plano_renova_em: renova })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha ao carimbar plano', 'error', String(err))
      return e.json(500, { error: 'Não foi possível registrar o plano.' })
    }
  },
  $apis.requireAuth(),
)

// ── Prévia da exclusão ───────────────────────────────────────────────────────
// Diz o que seria apagado e se a exclusão pode acontecer. O painel chama isto
// ANTES de mostrar a confirmação: excluir conta é irreversível e o admin
// precisa ver o tamanho do estrago antes de digitar o e-mail.
routerAdd(
  'GET',
  '/backend/v1/admin/usuarios/previa-exclusao',
  (e) => {
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    try {
      var userId = String((e.requestInfo().query || {}).user_id || '')
      if (!userId) return e.json(400, { error: 'user_id é obrigatório.' })

      var conta = function (col, campo, id) {
        try {
          var row = new DynamicModel({ c: 0 })
          $app
            .db()
            .newQuery('SELECT COUNT(*) as c FROM ' + col + ' WHERE ' + campo + ' = {:id}')
            .bind({ id: id })
            .one(row)
          return row.c
        } catch (err) {
          return 0
        }
      }

      var user = $app.findRecordById('users', userId)

      // A trava. A imobiliária É um usuário neste projeto (não existe coleção
      // `agencies`), então apagar a conta de uma casa com equipe vinculada
      // deixaria os corretores órfãos. Antes de excluir, desvincule a equipe.
      var ehImobiliaria = false
      try {
        var perfis = $app.findRecordsByFilter('broker_profile', 'user = {:id}', '', 1, 0, {
          id: userId,
        })
        ehImobiliaria = perfis.length > 0 && perfis[0].getString('tipo_perfil') === 'imobiliaria'
      } catch (perr) {
        $app.logger().error('admin_usuarios: perfil nao lido na previa', 'error', String(perr))
      }

      var membros = conta('agency_members', 'agency', userId)
      var convites = conta('agency_invites', 'agency', userId)
      var bloqueio = ''
      if (auth.id === userId) {
        bloqueio = 'Você não pode excluir a própria conta.'
      } else if (ehImobiliaria && (membros > 0 || convites > 0)) {
        bloqueio =
          'Esta conta é uma imobiliária com ' +
          membros +
          ' vínculo(s) e ' +
          convites +
          ' convite(s). Desvincule a equipe e cancele os convites antes de excluir.'
      }

      return e.json(200, {
        email: user.email(),
        pode_excluir: bloqueio === '',
        bloqueio: bloqueio,
        contagens: {
          negocios: conta('negocios', 'owner', userId),
          validacoes: conta('validation_logs', 'user', userId),
          chamados: conta('chamados', 'user', userId),
          suporte: conta('expert_support_requests', 'user', userId),
          vinculos_como_membro: conta('agency_members', 'member', userId),
        },
      })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha na previa de exclusao', 'error', String(err))
      return e.json(500, { error: 'Não foi possível montar a prévia.' })
    }
  },
  $apis.requireAuth(),
)

// ── Excluir conta ────────────────────────────────────────────────────────────
// Apaga a conta e o que é DELA. Nunca toca no que é da agência.
//
// Esta separação é a lição da migração 1900000035, que foi neutralizada por
// misturar as duas coisas: `negocios.agency`, `agency_members.agency`,
// `agency_invites.agency` e `legal_knowledge.agency` apontam para o usuário
// quando ele é uma imobiliária, e apagá-los destruiria os negócios dos
// corretores da equipe, com CPF e RG de clientes reais. Aqui esses campos são
// deixados intactos: ficam como referência pendurada, que é inofensiva, e a
// trava da prévia impede o caso em que isso importaria.
routerAdd(
  'POST',
  '/backend/v1/admin/usuarios/excluir',
  (e) => {
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    // Dentro do handler: o JSVM não enxerga escopo de módulo.
    // A ORDEM IMPORTA: filhos antes dos pais.
    var RELACOES_DO_USUARIO = [
      ['rate_limits', 'user'],
      ['access_logs', 'user'],
      ['validation_audit', 'user_id'],
      ['validation_logs', 'user'],
      ['chamados', 'user'],
      ['agency_members', 'member'],
      ['agency_invites', 'member'],
      ['broker_profile', 'user'],
    ]
    var TETO_LOTES = 40

    try {
      var body = e.requestInfo().body || {}
      var userId = String(body.user_id || '')
      var confirmacao = String(body.email_confirmacao || '')
      if (!userId) return e.json(400, { error: 'user_id é obrigatório.' })

      if (auth.id === userId) {
        return e.json(400, { error: 'Você não pode excluir a própria conta.' })
      }

      var user = $app.findRecordById('users', userId)
      if (user.email() !== confirmacao) {
        return e.json(400, { error: 'O e-mail digitado não confere com o da conta.' })
      }

      // A trava da prévia é reconferida aqui: o painel pode estar desatualizado,
      // e a checagem que vale é a do momento da escrita.
      var ehImobiliaria = false
      try {
        var perfis = $app.findRecordsByFilter('broker_profile', 'user = {:id}', '', 1, 0, {
          id: userId,
        })
        ehImobiliaria = perfis.length > 0 && perfis[0].getString('tipo_perfil') === 'imobiliaria'
      } catch (perr) {
        $app.logger().error('admin_usuarios: perfil nao lido na exclusao', 'error', String(perr))
      }
      if (ehImobiliaria) {
        var vinc = $app.findRecordsByFilter('agency_members', 'agency = {:id}', '', 1, 0, {
          id: userId,
        })
        var conv = $app.findRecordsByFilter('agency_invites', 'agency = {:id}', '', 1, 0, {
          id: userId,
        })
        if (vinc.length > 0 || conv.length > 0) {
          return e.json(400, {
            error: 'Imobiliária com equipe ou convites. Desvincule antes de excluir.',
          })
        }
      }

      var apagarTudo = function (col, campo, id) {
        for (var lote = 0; lote < TETO_LOTES; lote++) {
          var regs = $app.findRecordsByFilter(col, campo + ' = {:id}', '', 200, 0, { id: id })
          if (!regs || regs.length === 0) return
          for (var i = 0; i < regs.length; i++) $app.delete(regs[i])
        }
      }

      // Filhos que dependem dos negócios e dos pedidos de suporte, antes deles.
      var negs = $app.findRecordsByFilter('negocios', 'owner = {:id}', '', 500, 0, { id: userId })
      for (var n = 0; n < negs.length; n++) {
        apagarTudo('access_logs', 'negocio', negs[n].id)
      }
      var reqs = $app.findRecordsByFilter('expert_support_requests', 'user = {:id}', '', 500, 0, {
        id: userId,
      })
      for (var r = 0; r < reqs.length; r++) {
        apagarTudo('expert_proposals', 'request', reqs[r].id)
      }
      for (var r2 = 0; r2 < reqs.length; r2++) $app.delete(reqs[r2])
      for (var n2 = 0; n2 < negs.length; n2++) $app.delete(negs[n2])

      for (var k = 0; k < RELACOES_DO_USUARIO.length; k++) {
        apagarTudo(RELACOES_DO_USUARIO[k][0], RELACOES_DO_USUARIO[k][1], userId)
      }

      var emailApagado = user.email()
      $app.delete(user)
      $app
        .logger()
        .info(
          'admin_usuarios: conta excluida',
          'email',
          emailApagado,
          'por',
          auth.email(),
          'negocios',
          negs.length,
        )
      return e.json(200, { ok: true, email: emailApagado, negocios_apagados: negs.length })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha ao excluir conta', 'error', String(err))
      return e.json(500, { error: 'Não foi possível excluir a conta.' })
    }
  },
  $apis.requireAuth(),
)

// ── Tornar admin, ou tirar ───────────────────────────────────────────────────
routerAdd(
  'POST',
  '/backend/v1/admin/usuarios/admin',
  (e) => {
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    try {
      var body = e.requestInfo().body || {}
      var userId = String(body.user_id || '')
      var valor = body.is_admin === true
      if (!userId) return e.json(400, { error: 'user_id é obrigatório.' })

      // Sem isto, um admin se rebaixa sozinho e ninguém mais entra no painel.
      if (auth.id === userId && valor === false) {
        return e.json(400, { error: 'Você não pode remover o próprio acesso de admin.' })
      }

      var user = $app.findRecordById('users', userId)
      user.set('isAdmin', valor)
      $app.save(user)
      $app
        .logger()
        .info('admin_usuarios: isAdmin alterado', 'email', user.email(), 'valor', String(valor))
      return e.json(200, { ok: true, is_admin: valor })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha ao alterar isAdmin', 'error', String(err))
      return e.json(500, { error: 'Não foi possível alterar o acesso de admin.' })
    }
  },
  $apis.requireAuth(),
)
