migrate(
  (app) => {
    const collection = new Collection({
      name: 'validation_audit',
      type: 'base',
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
          maxSelect: 1,
        },
        { name: 'document_type', type: 'text' },
        { name: 'document_text', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'ai_raw_response', type: 'text' },
        { name: 'parsed_result', type: 'json', maxSize: 5242880 },
        { name: 'error_message', type: 'text' },
        { name: 'error_code', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_validation_audit_user ON validation_audit (user_id)',
        'CREATE INDEX idx_validation_audit_created ON validation_audit (created DESC)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('validation_audit')
    app.delete(collection)
  },
)
