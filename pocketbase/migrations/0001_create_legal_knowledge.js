migrate(
  (app) => {
    const collection = new Collection({
      name: 'legal_knowledge',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '@request.auth.is_admin = true',
      updateRule: '@request.auth.is_admin = true',
      deleteRule: '@request.auth.is_admin = true',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'category', type: 'text' },
        { name: 'code', type: 'text' },
        { name: 'trigger_logic', type: 'text' },
        { name: 'content', type: 'text', required: true },
        { name: 'priority', type: 'number' },
        { name: 'version', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_legal_knowledge_category ON legal_knowledge (category)',
        'CREATE INDEX idx_legal_knowledge_code ON legal_knowledge (code)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('legal_knowledge')
    app.delete(collection)
  },
)
