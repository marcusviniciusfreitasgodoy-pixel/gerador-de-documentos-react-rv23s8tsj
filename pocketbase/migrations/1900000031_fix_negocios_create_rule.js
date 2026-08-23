migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('negocios')
    col.createRule = '@request.auth.id != "" && owner = @request.auth.id'
    app.save(col)
    app.logger().info('1900000031 fix_negocios_create_rule applied')
  },
  (app) => {
    const col = app.findCollectionByNameOrId('negocios')
    col.createRule = 'owner = @request.auth.id'
    app.save(col)
  },
)
