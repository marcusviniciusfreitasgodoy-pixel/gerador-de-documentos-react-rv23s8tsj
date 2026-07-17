migrate(
  (app) => {
    try {
      var col = app.findCollectionByNameOrId('legal_knowledge')
    } catch (err) {
      app.logger().error('1900000022: legal_knowledge collection not found', 'error', String(err))
      return
    }

    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    col.createRule = '@request.auth.isAdmin = true'
    col.updateRule = '@request.auth.isAdmin = true'
    col.deleteRule = '@request.auth.isAdmin = true'

    app.save(col)

    app
      .logger()
      .info('1900000022 fix_legal_knowledge_rules applied', 'collection', 'legal_knowledge')
  },
  (app) => {
    try {
      var col = app.findCollectionByNameOrId('legal_knowledge')
    } catch (err) {
      return
    }

    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    col.createRule = null
    col.updateRule = null
    col.deleteRule = null

    app.save(col)
  },
)
