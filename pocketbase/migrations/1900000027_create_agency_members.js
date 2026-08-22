// Fase 1 — Camada de equipe (imobiliárias): coleção `agency_members`.
//
// Vínculo entre a CONTA de imobiliária (users cujo broker_profile tem
// tipo_perfil = 'imobiliaria') e um corretor (users). Aponta para `users`
// (não para `broker_profile`) porque o dono de um `negocio` é um users.id
// (campo `owner`) e as regras de acesso comparam com @request.auth.id,
// também users.id — qualquer join no broker_profile seria caro e inútil aqui.
//
// Regras:
// - agency, member, status, termo_aceito_em. created/updated autodate.
// - Índice único (agency, member) impede duplicar o vínculo.
// - "Um corretor por vez por imobiliária" é garantido por índice único PARCIAL
//   sobre (member) WHERE status = 'ativo' — só pode existir UM ativo por
//   member. O SQLite aceita índice parcial com WHERE.
// - Remoção = status = 'removido' (nunca deletar a linha).
// - listRule/viewRule: agency OU member OU admin. create/update/delete: só
//   admin (fase 1: a Prime Circle vincula pelo painel).
migrate(
  (app) => {
    var usersCollectionId = '_pb_users_auth_'

    var collection = new Collection({
      name: 'agency_members',
      type: 'base',
      listRule:
        '@request.auth.id != "" && (agency = @request.auth.id || member = @request.auth.id || @request.auth.isAdmin = true)',
      viewRule:
        '@request.auth.id != "" && (agency = @request.auth.id || member = @request.auth.id || @request.auth.isAdmin = true)',
      createRule: '@request.auth.isAdmin = true',
      updateRule: '@request.auth.isAdmin = true',
      deleteRule: '@request.auth.isAdmin = true',
      fields: [
        {
          name: 'agency',
          type: 'relation',
          required: true,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        {
          name: 'member',
          type: 'relation',
          required: true,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['ativo', 'removido'],
          maxSelect: 1,
        },
        { name: 'termo_aceito_em', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        // Não duplicar o mesmo vínculo (agency, member) — nem entre removidos,
        // para o histórico ficar limpo e a regra não depender de estado.
        'CREATE UNIQUE INDEX idx_agency_members_agency_member ON agency_members (agency, member)',
        // Um corretor ativo só pode existir UMA vez por vez: índice único
        // parcial. O segundo ativo para o mesmo member viola a unicidade e a
        // API devolve 400 — não depende de hook.
        "CREATE UNIQUE INDEX idx_agency_members_member_ativo ON agency_members (member) WHERE status = 'ativo'",
      ],
    })
    app.save(collection)
    app.logger().info('1900000027 create_agency_members applied')
  },
  (app) => {
    var collection = app.findCollectionByNameOrId('agency_members')
    app.delete(collection)
  },
)
