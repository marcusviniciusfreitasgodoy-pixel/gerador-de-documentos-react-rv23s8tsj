migrate(
  (app) => {
    const usersCollectionId = '_pb_users_auth_'

    const collection = new Collection({
      name: 'negocios',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: '@request.auth.id != "" && owner = @request.auth.id',
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'titulo', type: 'text', required: true },
        { name: 'partes', type: 'json', maxSize: 2097152 },
        { name: 'imovel', type: 'json', maxSize: 2097152 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_negocios_owner ON negocios (owner)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('negocios')
    app.delete(collection)
  },
)
