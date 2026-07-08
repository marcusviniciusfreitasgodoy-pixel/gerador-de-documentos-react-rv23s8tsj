migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('broker_profile')
    if (!col.fields.getByName('commission_rate')) {
      col.fields.add(new NumberField({ name: 'commission_rate', min: 0, max: 100, onlyInt: false }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('broker_profile')
    const field = col.fields.getByName('commission_rate')
    if (field) col.fields.remove(field)
    app.save(col)
  },
)
