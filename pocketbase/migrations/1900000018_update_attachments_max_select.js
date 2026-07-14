migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('expert_support_requests')
    col.fields.removeByName('attachments')
    col.fields.add(
      new FileField({
        name: 'attachments',
        maxSelect: 10,
        maxSize: 10485760,
        mimeTypes: [
          'application/pdf',
          'image/png',
          'image/jpeg',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      }),
    )
    app.save(col)
  },
  (app) => {
    var col = app.findCollectionByNameOrId('expert_support_requests')
    col.fields.removeByName('attachments')
    col.fields.add(new FileField({ name: 'attachments', maxSelect: 1 }))
    app.save(col)
  },
)
