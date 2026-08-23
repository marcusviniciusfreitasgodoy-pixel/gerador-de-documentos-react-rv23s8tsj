// Fase 2 — Régua jurídica própria por imobiliária: campo agency e regras em legal_knowledge.
//
// 1. Campo `agency`: Relation -> users (_pb_users_auth_), opcional, maxSelect 1.
//    - Vazio = regra global da Prime Circle (vale para todos).
//    - Preenchido = regra própria daquela imobiliária.
// 2. Índice em `agency`.
// 3. API Rules:
//    - listRule / viewRule:
//        @request.auth.isAdmin = true || (agency != '' && agency = @request.auth.id)
//    - createRule:
//        @request.auth.isAdmin = true || (@request.auth.id != "" && agency = @request.auth.id)
//    - updateRule / deleteRule:
//        @request.auth.isAdmin = true || (agency != '' && agency = @request.auth.id)

migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('legal_knowledge')
    var usersCollectionId = '_pb_users_auth_'

    if (!col.fields.getByName('agency')) {
      col.fields.add(
        new RelationField({
          name: 'agency',
          required: false,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        }),
      )
    }

    col.listRule = "@request.auth.isAdmin = true || (agency != '' && agency = @request.auth.id)"
    col.viewRule = "@request.auth.isAdmin = true || (agency != '' && agency = @request.auth.id)"
    col.createRule =
      '@request.auth.isAdmin = true || (@request.auth.id != "" && agency = @request.auth.id)'
    col.updateRule = "@request.auth.isAdmin = true || (agency != '' && agency = @request.auth.id)"
    col.deleteRule = "@request.auth.isAdmin = true || (agency != '' && agency = @request.auth.id)"

    col.addIndex('idx_legal_knowledge_agency', false, 'agency', '')

    app.save(col)
    app.logger().info('1900000030 legal_knowledge_add_agency applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('legal_knowledge')

    var agencyField = col.fields.getByName('agency')
    if (agencyField) col.fields.remove(agencyField)

    col.listRule = '@request.auth.isAdmin = true'
    col.viewRule = '@request.auth.isAdmin = true'
    col.createRule = '@request.auth.isAdmin = true'
    col.updateRule = '@request.auth.isAdmin = true'
    col.deleteRule = '@request.auth.isAdmin = true'

    try {
      col.removeIndex('idx_legal_knowledge_agency')
    } catch (_) {}

    app.save(col)
  },
)
