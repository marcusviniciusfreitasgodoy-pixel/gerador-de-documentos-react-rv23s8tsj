migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('broker_profile')
    const nameField = col.fields.getByName('name')
    if (nameField) {
      nameField.required = false
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('broker_profile')
    const nameField = col.fields.getByName('name')
    if (nameField) {
      nameField.required = true
      app.save(col)
    }
  },
)
