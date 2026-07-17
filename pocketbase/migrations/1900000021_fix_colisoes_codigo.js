migrate(
  (app) => {
    var corrigidos = 0

    function findByTitle(title) {
      var records = app.findRecordsByFilter('legal_knowledge', 'title = {:title}', '', 1, 0, {
        title: title,
      })
      if (records.length === 0) return null
      return records[0]
    }

    var updates = [
      { title: 'FIN003 - Restitui\u00e7\u00e3o', code: 'FIN009' },
      { title: 'FIN005 - Despesas Financiamento', code: 'FIN010' },
      { title: 'POS003 - Danos na Desocupa\u00e7\u00e3o', code: 'POS005' },
      { title: 'POS004 - Reten\u00e7\u00e3o de Valores', code: 'POS006' },
    ]

    for (var i = 0; i < updates.length; i++) {
      try {
        var rec = findByTitle(updates[i].title)
        if (!rec) continue
        rec.set('code', updates[i].code)
        app.save(rec)
        corrigidos++
      } catch (err) {
        app
          .logger()
          .error(
            '1900000021: code update failed for "' + updates[i].title + '"',
            'error',
            String(err),
          )
      }
    }

    app.logger().info('fix_colisoes_codigo', 'corrigidos', String(corrigidos))
  },
  (app) => {},
)
