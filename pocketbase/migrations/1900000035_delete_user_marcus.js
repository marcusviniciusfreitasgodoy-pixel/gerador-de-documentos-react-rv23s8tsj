migrate(
  (app) => {
    const targetEmail = 'marcus@personalshopperimobiliario.com.br'

    var userRecord = null
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', targetEmail)
    } catch (_) {
      try {
        userRecord = app.findFirstRecordByData('users', 'email', targetEmail)
      } catch (_) {
        // Já não existe
        return
      }
    }

    if (!userRecord) return
    var uid = userRecord.id

    // 1. Apagar propostas de suporte associadas a chamados/pedidos do usuário
    try {
      var reqs = app.findRecordsByFilter('expert_support_requests', 'user = {:id}', '', 500, 0, {
        id: uid,
      })
      for (var ri = 0; ri < reqs.length; ri++) {
        try {
          var props = app.findRecordsByFilter('expert_proposals', 'request = {:rid}', '', 500, 0, {
            rid: reqs[ri].id,
          })
          for (var pi = 0; pi < props.length; pi++) {
            app.delete(props[pi])
          }
        } catch (perr) {
          app.logger().error('migration 35: erro ao apagar expert_proposals', 'error', String(perr))
        }
        app.delete(reqs[ri])
      }
    } catch (rerr) {
      app
        .logger()
        .error('migration 35: erro ao buscar expert_support_requests', 'error', String(rerr))
    }

    // 2. Apagar access_logs associados aos negócios do usuário (mesmo criados por gestor)
    try {
      var userNegocios = app.findRecordsByFilter('negocios', 'owner = {:id}', '', 500, 0, {
        id: uid,
      })
      for (var ni = 0; ni < userNegocios.length; ni++) {
        try {
          var logsNeg = app.findRecordsByFilter('access_logs', 'negocio = {:nid}', '', 500, 0, {
            nid: userNegocios[ni].id,
          })
          for (var li = 0; li < logsNeg.length; li++) {
            app.delete(logsNeg[li])
          }
        } catch (lerr) {
          app
            .logger()
            .error('migration 35: erro ao apagar access_logs de negocio', 'error', String(lerr))
        }
      }
    } catch (nerr) {
      app.logger().error('migration 35: erro ao buscar negocios', 'error', String(nerr))
    }

    // 3. Apagar registros dependentes diretos do usuário em todas as coleções
    var relacoes = [
      ['validation_audit', 'user_id'],
      ['validation_logs', 'user'],
      ['access_logs', 'user'],
      ['rate_limits', 'user'],
      ['agency_invites', 'agency'],
      ['agency_invites', 'member'],
      ['agency_invites', 'convidado_por'],
      ['agency_members', 'agency'],
      ['agency_members', 'member'],
      ['broker_profile', 'user'],
      ['negocios', 'owner'],
      ['negocios', 'agency'],
      ['legal_knowledge', 'agency'],
      ['chamados', 'user'],
    ]

    for (var i = 0; i < relacoes.length; i++) {
      var colName = relacoes[i][0]
      var fieldName = relacoes[i][1]
      try {
        for (var loop = 0; loop < 20; loop++) {
          var records = app.findRecordsByFilter(colName, fieldName + ' = {:id}', '', 500, 0, {
            id: uid,
          })
          if (!records || records.length === 0) break
          for (var recIdx = 0; recIdx < records.length; recIdx++) {
            app.delete(records[recIdx])
          }
        }
      } catch (err) {
        app.logger().error('migration 35: erro ao limpar ' + colName, 'error', String(err))
      }
    }

    // 4. Deletar o registro do usuário
    try {
      app.delete(userRecord)
      app
        .logger()
        .info(
          '1900000035_delete_user_marcus applied: usuario ' + targetEmail + ' excluido com sucesso',
        )
    } catch (delErr) {
      // Fallback via SQL direto caso exista alguma constraint não capturada
      app.logger().error('migration 35: app.delete falhou, tentando SQL', 'error', String(delErr))
      app.db().newQuery('DELETE FROM users WHERE id = {:id}').bind({ id: uid }).execute()
    }
  },
  (app) => {
    // Reversão não é necessária / aplicável para exclusão pontual de usuário de teste
  },
)
