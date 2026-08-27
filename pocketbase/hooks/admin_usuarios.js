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

      var renova = new Date(Date.now() + meses * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace('T', ' ')
      user.set('plano', plano)
      user.set('plano_renova_em', renova)
      user.set('plano_limite_negocios', LIMITES[plano])
      $app.save(user)

      return e.json(200, { ok: true, plano: plano, plano_renova_em: renova })
    } catch (err) {
      $app.logger().error('admin_usuarios: falha ao carimbar plano', 'error', String(err))
      return e.json(500, { error: 'Não foi possível registrar o plano.' })
    }
  },
  $apis.requireAuth(),
)
