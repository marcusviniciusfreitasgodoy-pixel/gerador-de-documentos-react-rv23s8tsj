migrate(
  (app) => {
    var usersCollectionId = '_pb_users_auth_'

    var collection = new Collection({
      name: 'validation_logs',
      type: 'base',
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: false,
          collectionId: usersCollectionId,
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'document_text', type: 'text' },
        { name: 'document_type', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'parsed_result', type: 'text' },
        { name: 'raw_ai_response', type: 'text' },
        { name: 'error_message', type: 'text' },
        { name: 'error_code', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_validation_logs_user ON validation_logs (user)',
        'CREATE INDEX idx_validation_logs_created ON validation_logs (created DESC)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    var collection = app.findCollectionByNameOrId('validation_logs')
    app.delete(collection)
  },
)
