// Fase 1 — Camada de equipe (imobiliárias): carimba `negocios.agency`.
//
// Adiciona o campo `agency` (relation → users, opcional) à coleção `negocios`.
// Carimbado pelo hook `negocio_agency_stamp.js` no onRecordCreate: o corretor
// nunca envia `agency` (se enviar, o hook ignora/sobrescreve). Vazio =
// negócio de autônomo (comportamento atual, inalterado).
//
// Regras (§3.1):
// - listRule/viewRule/updateRule: owner OU agency OU admin.
//   O gestor da imobiliária LÊ e EDITA os negócios da casa.
// - createRule: INALTERADO — mantém "owner = @request.auth.id". Não mexer para
//   não mudar quem pode criar; o carimbo é servidor, não regra de criação.
// - deleteRule: MAIS RESTRITA que a leitura — só owner OU admin. O gestor NÃO
//   apaga negócio de outro corretor da equipe: apagar é destrutivo e
//   assimétrico, fica com o dono e com o admin da plataforma.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('negocios')
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

    // createRule inalterado: continua "owner = @request.auth.id" (a regra atual
    // em schema.json é exatamente essa — só conferimos e mantemos).
    if (!col.createRule || col.createRule !== 'owner = @request.auth.id') {
      col.createRule = 'owner = @request.auth.id'
    }

    col.listRule =
      '@request.auth.id != "" && (owner = @request.auth.id || agency = @request.auth.id || @request.auth.isAdmin = true)'
    col.viewRule =
      '@request.auth.id != "" && (owner = @request.auth.id || agency = @request.auth.id || @request.auth.isAdmin = true)'
    col.updateRule =
      '@request.auth.id != "" && (owner = @request.auth.id || agency = @request.auth.id || @request.auth.isAdmin = true)'
    col.deleteRule =
      '@request.auth.id != "" && (owner = @request.auth.id || @request.auth.isAdmin = true)'

    // Índice em agency para a consulta do gestor (lista de negócios da casa).
    col.addIndex('idx_negocios_agency', false, 'agency', '')

    app.save(col)
    app.logger().info('1900000028 negocios_add_agency applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('negocios')

    var agencyField = col.fields.getByName('agency')
    if (agencyField) col.fields.remove(agencyField)

    col.listRule = 'owner = @request.auth.id'
    col.viewRule = 'owner = @request.auth.id'
    col.updateRule = 'owner = @request.auth.id'
    col.deleteRule = 'owner = @request.auth.id'

    try {
      col.removeIndex('idx_negocios_agency')
    } catch (_) {}

    app.save(col)
  },
)
