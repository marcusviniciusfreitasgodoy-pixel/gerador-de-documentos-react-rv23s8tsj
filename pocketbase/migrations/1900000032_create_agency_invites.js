// Fase 3 — Convite por e-mail e aceite do termo in-app: coleção `agency_invites`.
//
// Fecha a distância que a fase 1 deixou aberta de propósito: lá o vínculo era
// criado pelo admin da plataforma, que digitava a data do aceite do termo. Ou
// seja, o admin AFIRMAVA o consentimento no lugar do corretor. Aqui o corretor
// dá o consentimento ele mesmo, dentro do app, e o servidor carimba a hora.
//
// Regras de acesso:
// - listRule/viewRule: a imobiliária vê os convites que emitiu; o convidado vê
//   os endereçados ao e-mail dele; o admin vê tudo.
// - create/update/delete: `null` (só superuser). TODA escrita passa pelos
//   endpoints de `pocketbase/hooks/agencia_convites.js`, que gravam com
//   $app.saveNoValidate. Mesmo princípio do carimbo da fase 1: campo que
//   decide permissão não se aceita do cliente.
//
// Sobre o `token`: ele NÃO é credencial. Serve só para o link do e-mail cair
// direto no convite certo. Quem aceita precisa estar autenticado com o mesmo
// e-mail do convite, e é essa comparação que autoriza o aceite no servidor.
// Token vazado, sozinho, não vincula ninguém.
//
// Índices:
// - `token` único: o link do e-mail resolve para um convite só.
// - (agency, email) único PARCIAL onde status = 'pendente': a mesma casa não
//   empilha convites pendentes para o mesmo endereço (e o botão "reenviar"
//   existe justamente para isso). Convites recusados/cancelados não bloqueiam
//   um convite novo depois.
migrate(
  (app) => {
    var usersCollectionId = '_pb_users_auth_'

    var collection = new Collection({
      name: 'agency_invites',
      type: 'base',
      listRule:
        '@request.auth.id != "" && (agency = @request.auth.id || email = @request.auth.email || @request.auth.isAdmin = true)',
      viewRule:
        '@request.auth.id != "" && (agency = @request.auth.id || email = @request.auth.email || @request.auth.isAdmin = true)',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'agency',
          type: 'relation',
          required: true,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        { name: 'email', type: 'email', required: true },
        // Preenchido no momento da resposta (aceite ou recusa). Antes disso o
        // convidado pode nem ter conta ainda.
        {
          name: 'member',
          type: 'relation',
          required: false,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        // Quem clicou em convidar: o gestor da casa ou o admin da plataforma
        // agindo em nome dela. Fica para auditoria.
        {
          name: 'convidado_por',
          type: 'relation',
          required: false,
          collectionId: usersCollectionId,
          maxSelect: 1,
          cascadeDelete: false,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pendente', 'aceito', 'recusado', 'cancelado', 'expirado'],
          maxSelect: 1,
        },
        { name: 'token', type: 'text', required: true },
        { name: 'expira_em', type: 'date' },
        { name: 'respondido_em', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_agency_invites_token ON agency_invites (token)',
        "CREATE UNIQUE INDEX idx_agency_invites_pendente ON agency_invites (agency, email) WHERE status = 'pendente'",
        'CREATE INDEX idx_agency_invites_email ON agency_invites (email)',
        'CREATE INDEX idx_agency_invites_agency ON agency_invites (agency)',
      ],
    })
    app.save(collection)
    app.logger().info('1900000032 create_agency_invites applied')
  },
  (app) => {
    var collection = app.findCollectionByNameOrId('agency_invites')
    app.delete(collection)
  },
)
