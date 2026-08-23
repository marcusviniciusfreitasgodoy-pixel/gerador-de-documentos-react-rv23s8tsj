// Fase 1 — Camada de equipe (imobiliárias): trilha de acesso (LGPD).
//
// Quando o gestor da imobiliária abre um negócio que NÃO é dele (agency =
// @request.auth.id mas owner != @request.auth.id), o hook
// `negocio_access_log.js` registra o evento aqui: quem abriu, qual negócio,
// quando. Sem tela — só o registro, para responder a um eventual
// questionamento.
//
// Regras:
// - listRule/viewRule: só admin (o gestor vê os negócios, mas a trilha de
//   *quem acessou o quê* é auditoria interna da plataforma).
// - create via hook (saveNoValidate, que bypassa createRule) — mas deixamos
//   createRule null (superuser) mesmo assim: ninguém cria pela API.
// - update/delete: null (imutável, só se cria).
migrate(
  (app) => {
    var usersCollectionId = '_pb_users_auth_'
    var negociosCollectionId = app.findCollectionByNameOrId('negocios').id

    var collection = new Collection({
      name: 'access_logs',
      type: 'base',
      listRule: '@request.auth.isAdmin = true',
      viewRule: '@request.auth.isAdmin = true',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        {
          name: 'negocio',
          type: 'relation',
          required: true,
          collectionId: negociosCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_access_logs_user ON access_logs (user)',
        'CREATE INDEX idx_access_logs_negocio ON access_logs (negocio)',
        'CREATE INDEX idx_access_logs_created ON access_logs (created DESC)',
      ],
    })
    app.save(collection)
    app.logger().info('1900000029 create_access_logs applied')
  },
  (app) => {
    var collection = app.findCollectionByNameOrId('access_logs')
    app.delete(collection)
  },
)
