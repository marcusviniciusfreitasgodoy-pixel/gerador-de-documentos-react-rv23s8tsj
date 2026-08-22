// Painel admin (decisão do Marcus, 2026-08-22): a Fila de Atendimento do /admin
// precisa mostrar nome + CRECI do corretor por trás de cada solicitação/chamado.
// O `broker_profile` é owner-scoped, então o admin não enxergava o perfil dos
// outros corretores pela API. Abre list/view para admin sem tocar em
// create/update/delete (essas continuam só do dono). A proteção real do /admin
// está no hook admin_overview.js (isAdmin gate); aqui é só liberar a leitura do
// perfil para montar a fila.
migrate(
  (app) => {
    try {
      var col = app.findCollectionByNameOrId('broker_profile')
      col.listRule =
        '@request.auth.id != "" && (user = @request.auth.id || @request.auth.isAdmin = true)'
      col.viewRule =
        '@request.auth.id != "" && (user = @request.auth.id || @request.auth.isAdmin = true)'
      app.save(col)
      app.logger().info('1900000026 admin_read_broker_profile applied')
    } catch (err) {
      app.logger().error('1900000026: broker_profile not found', 'error', String(err))
    }
  },
  (app) => {
    try {
      var col = app.findCollectionByNameOrId('broker_profile')
      col.listRule = '@request.auth.id != "" && user = @request.auth.id'
      col.viewRule = '@request.auth.id != "" && user = @request.auth.id'
      app.save(col)
    } catch (err) {}
  },
)
