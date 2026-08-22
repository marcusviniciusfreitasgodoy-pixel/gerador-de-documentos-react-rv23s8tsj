migrate(
  (app) => {
    const usersCollectionId = '_pb_users_auth_'

    const collection = new Collection({
      name: 'rate_limits',
      type: 'base',
      // Coleção interna de rate limiting — só o backend (pb_hooks) lê/escreve
      // via $app (que bypassa as regras de API). Nenhum usuário do app deve
      // ler ou alterar contadores de rate limit, por isso todas as regras
      // ficam null (somente superuser).
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: false,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'endpoint', type: 'text' },
        { name: 'window_start', type: 'number', onlyInt: true },
        { name: 'count', type: 'number', onlyInt: true, min: 0 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_rate_limits_user_endpoint_window ON rate_limits (user, endpoint, window_start)',
        'CREATE INDEX idx_rate_limits_window_start ON rate_limits (window_start)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('rate_limits')
    app.delete(collection)
  },
)
