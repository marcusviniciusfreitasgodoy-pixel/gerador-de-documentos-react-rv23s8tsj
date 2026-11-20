// Somente do harness de teste local: colecoes do Skip que as migracoes do repo supoem ja existir.
migrate((app) => {
  var users = app.findCollectionByNameOrId('users')
  users.fields.add(new BoolField({ name: 'isAdmin' }))
  app.save(users)
  var base = ['expert_support_requests', 'chamados', 'expert_proposals', 'app_templates']
  for (var i = 0; i < base.length; i++) {
    var c = new Collection({ name: base[i], type: 'base', fields: [{ name: 'user', type: 'text' }, { name: 'status', type: 'text' }, { name: 'attachments', type: 'file', maxSelect: 1, maxSize: 1000000 }] })
    app.save(c)
  }
}, (app) => {})
