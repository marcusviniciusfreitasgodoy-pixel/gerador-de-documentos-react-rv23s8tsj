// Correção de segurança (instrução do Marcus, 2026-07-24):
// Amarrar o DONO na createRule dos logs de validação, para que um usuário
// autenticado não consiga forjar um log em nome de outro. Antes a createRule
// era só "@request.auth.id != ''" (qualquer auth podia criar em qualquer user);
// agora exige que o campo dono bata com quem está autenticado.
//
// Mexe APENAS na createRule. list/view/update/delete já estavam corretas
// (amarradas ao dono) e não são tocadas.
//
// A gravação automática pelo hook validar_minuta.js NÃO quebra: ela usa
// $app.saveNoValidate(), que ignora as API rules.
migrate(
  (app) => {
    // validation_logs → campo dono é "user"
    try {
      var logsCol = app.findCollectionByNameOrId('validation_logs')
      logsCol.createRule = "@request.auth.id != '' && user = @request.auth.id"
      app.save(logsCol)
    } catch (err) {
      app.logger().error('1900000024: validation_logs not found', 'error', String(err))
    }

    // validation_audit → campo dono é "user_id"
    try {
      var auditCol = app.findCollectionByNameOrId('validation_audit')
      auditCol.createRule = "@request.auth.id != '' && user_id = @request.auth.id"
      app.save(auditCol)
    } catch (err) {
      app.logger().error('1900000024: validation_audit not found', 'error', String(err))
    }

    app
      .logger()
      .info(
        '1900000024 fix_validation_log_rules applied',
        'collections',
        'validation_logs, validation_audit',
      )
  },
  (app) => {
    // Reverte a createRule ao estado anterior (auth-only, sem amarrar o dono).
    try {
      var logsCol = app.findCollectionByNameOrId('validation_logs')
      logsCol.createRule = "@request.auth.id != ''"
      app.save(logsCol)
    } catch (err) {}

    try {
      var auditCol = app.findCollectionByNameOrId('validation_audit')
      auditCol.createRule = "@request.auth.id != ''"
      app.save(auditCol)
    } catch (err) {}
  },
)
