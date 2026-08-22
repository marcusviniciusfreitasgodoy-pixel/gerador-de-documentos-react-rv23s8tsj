// Painel administrativo: visão consolidada da operação.
// Devolve SÓ números, contagens e distribuições — nunca registro individual,
// CPF, RG, nome de corretor ou texto de minuta. A proteção real do /admin
// está aqui (isAdmin gate no topo); o item de menu no Layout é só UI.
//
// A Fila de Atendimento (Bloco 1 do /admin) NÃO passa por este endpoint: o
// front a lê direto das coleções expert_support_requests/chamados, que já são
// owner-ou-admin. Aqui ficam o Pulso (KPIs), a Régua jurídica e a Saúde técnica.
//
// Tudo é calculado com privilégio de app ($app) — NÃO afrouxa nenhuma regra
// de coleção. As de validation_logs/negocios continuam owner-scoped; o endpoint
// usa $app (privilégio total), não $apis, e devolve apenas agregados.
//
// Registro da rota no mesmo padrão das rotas de IA (validar_minuta, extrair_dados):
// routerAdd com middleware $apis.requireAuth() (garante auth) + gate isAdmin interno.
routerAdd(
  'GET',
  '/backend/v1/admin/overview',
  (e) => {
    // 1) Admin gate — espelha o pattern do 'verified' das rotas de IA, mas para
    // isAdmin. Sem admin, 403.
    var auth = e.auth
    if (!auth || auth.getBool('isAdmin') !== true) {
      return e.json(403, { error: 'Acesso restrito a administradores.' })
    }

    // ?scope= é aceito mas ignorado hoje (gancho para futuro multi-conta).
    // var scope = (e.requestInfo().query || {}).scope || ''

    try {
      // Janelas temporais no MESMO formato do purge de retenção (ISO com 'T'
      // trocado por espaço), para a comparação de string bater contra o `created`
      // do PocketBase (igual ao que o hook validar_minuta.js já usa).
      var nowMs = Date.now()
      var DAY = 24 * 60 * 60 * 1000
      var iso = function (ms) {
        return new Date(ms).toISOString().replace('T', ' ')
      }
      var cutoff7 = iso(nowMs - 7 * DAY)
      var cutoff14 = iso(nowMs - 14 * DAY)
      var cutoff30 = iso(nowMs - 30 * DAY)

      // Helper: COUNT(*) numa tabela com cláusula WHERE opcional e params nomeados.
      // (newQuery + DynamicModel + .one() é o padrão documentado do JSVM.)
      var countWhere = function (table, where, params) {
        var row = new DynamicModel({ c: 0 })
        var sql = 'SELECT COUNT(*) as c FROM ' + table
        if (where) sql += ' WHERE ' + where
        var q = $app.db().newQuery(sql)
        if (params) q = q.bind(params)
        q.one(row)
        return row.c
      }

      // ── Validações (validation_logs grava TODA chamada, sucesso ou falha) ──
      var last7 = countWhere('validation_logs', 'created >= {:cutoff}', { cutoff: cutoff7 })
      var prev7 = countWhere('validation_logs', 'created >= {:a} AND created < {:b}', {
        a: cutoff14,
        b: cutoff7,
      })
      var fails7 = countWhere('validation_logs', "created >= {:cutoff} AND status = 'fail'", {
        cutoff: cutoff7,
      })
      var failureRate = last7 > 0 ? Math.round((fails7 / last7) * 1000) / 10 : 0

      // ── Distribuição green/yellow/red ──
      // Vem do parsed_result do validation_audit (objeto JSON com campo `status`).
      // O volume é limitado pela retenção de 30d, então lemos os registros do
      // intervalo e contamos em JS — mais simples que json_extract no SQLite.
      var dist = { green: 0, yellow: 0, red: 0 }
      try {
        var audits = $app.findRecordsByFilter(
          'validation_audit',
          'created >= {:cutoff}',
          '',
          1000,
          0,
          { cutoff: cutoff7 },
        )
        for (var ai = 0; ai < audits.length; ai++) {
          var pr = audits[ai].get('parsed_result')
          var st = ''
          if (pr && typeof pr === 'object') {
            st = String(pr.status || '').toLowerCase()
          } else if (typeof pr === 'string' && pr) {
            try {
              st = String(JSON.parse(pr).status || '').toLowerCase()
            } catch (_) {}
          }
          if (st === 'green') dist.green++
          else if (st === 'yellow') dist.yellow++
          else if (st === 'red') dist.red++
        }
      } catch (distErr) {
        $app.logger().error('admin_overview: statusDistribution falhou', 'error', String(distErr))
      }

      // ── Cadastros (users) ──
      var signups7 = countWhere('users', 'created >= {:cutoff}', { cutoff: cutoff7 })
      var verified7 = countWhere('users', 'created >= {:cutoff} AND verified = 1', {
        cutoff: cutoff7,
      })

      // ── Corretores ──
      // total: todos os usuários cadastrados.
      var totalBrokers = countWhere('users', '', null)
      // ativos 30d: donos distintos com atividade em validation_logs OU negocios.
      var activeBrokers = 0
      try {
        var activeSet = {}
        try {
          var vl = $app.findRecordsByFilter(
            'validation_logs',
            'created >= {:cutoff}',
            '',
            1000,
            0,
            { cutoff: cutoff30 },
          )
          for (var vi = 0; vi < vl.length; vi++) {
            var u = vl[vi].getString('user')
            if (u) activeSet[u] = true
          }
        } catch (_) {}
        try {
          var ng = $app.findRecordsByFilter('negocios', 'created >= {:cutoff}', '', 1000, 0, {
            cutoff: cutoff30,
          })
          for (var ni = 0; ni < ng.length; ni++) {
            var o = ng[ni].getString('owner')
            if (o) activeSet[o] = true
          }
        } catch (_) {}
        for (var k in activeSet) {
          if (activeSet[k]) activeBrokers++
        }
      } catch (actErr) {
        $app.logger().error('admin_overview: brokers ativos falhou', 'error', String(actErr))
      }

      // ── Negócios abertos ──
      // A coleção `negocios` não tem campo de status (é um dossiê, sempre
      // "aberto"): todo negócio cadastrado conta como aberto.
      var openDeals = countWhere('negocios', '', null)

      // ── Régua jurídica (legal_knowledge) ──
      var totalRules = countWhere('legal_knowledge', '', null)
      var categories = 0
      var lastUpdated = ''
      try {
        var cats = arrayOf(new DynamicModel({ category: '' }))
        $app
          .db()
          .newQuery("SELECT DISTINCT category FROM legal_knowledge WHERE category != ''")
          .all(cats)
        categories = cats.length
      } catch (catErr) {
        $app.logger().error('admin_overview: categories falhou', 'error', String(catErr))
      }
      try {
        var lu = new DynamicModel({ m: '' })
        $app.db().newQuery('SELECT MAX(updated) as m FROM legal_knowledge').one(lu)
        lastUpdated = lu.m || ''
      } catch (luErr) {
        $app.logger().error('admin_overview: lastUpdated falhou', 'error', String(luErr))
      }

      // ── Saúde técnica: erros de IA agrupados por error_code (7d) ──
      var aiErrors = []
      try {
        var errs = arrayOf(new DynamicModel({ error_code: '', c: 0, last: '' }))
        $app
          .db()
          .newQuery(
            'SELECT error_code, COUNT(*) as c, MAX(created) as last ' +
              'FROM validation_audit ' +
              "WHERE created >= {:cutoff} AND error_code != '' " +
              'GROUP BY error_code ORDER BY c DESC LIMIT 20',
          )
          .bind({ cutoff: cutoff7 })
          .all(errs)
        for (var ei = 0; ei < errs.length; ei++) {
          aiErrors.push({
            errorCode: errs[ei].error_code || '',
            count: errs[ei].c || 0,
            lastOccurrence: errs[ei].last || '',
          })
        }
      } catch (aiErr) {
        $app.logger().error('admin_overview: aiErrors falhou', 'error', String(aiErr))
      }

      return e.json(200, {
        validations: { last7Days: last7, previous7Days: prev7 },
        statusDistribution: dist,
        failureRate: failureRate,
        signups: { last7Days: signups7, verified: verified7 },
        brokers: { active: activeBrokers, total: totalBrokers },
        openDeals: openDeals,
        legalKnowledge: {
          totalRules: totalRules,
          categories: categories,
          lastUpdated: lastUpdated,
        },
        aiErrors: aiErrors,
      })
    } catch (err) {
      $app.logger().error('admin_overview: erro inesperado', 'error', String(err))
      return e.json(500, { error: 'Não foi possível montar o resumo da operação.' })
    }
  },
  $apis.requireAuth(),
)
