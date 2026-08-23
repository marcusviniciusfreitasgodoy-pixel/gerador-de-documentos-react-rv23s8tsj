// Trilha de acesso LGPD (Fase 1, §4).
//
// Quando o gestor da imobiliária ABRE um negócio que NÃO é dele (agency =
// @request.auth.id mas owner != @request.auth.id), registra o evento em
// `access_logs` (quem, qual negócio, quando). Sem tela — só o registro, para
// responder a um eventual questionamento.
//
// Hook de REQUEST (onRecordViewRequest): precisa de e.auth para saber quem
// abriu. O dono abrindo o próprio negócio não conta; admin/superuser não
// conta; negócio sem agency (autônomo) não tem gestor para logar.
onRecordViewRequest((e) => {
  var auth = e.auth
  if (!auth || auth.collection().name !== 'users') {
    e.next()
    return
  }
  // Admin/superuser não conta (não é gestor de imobiliária).
  if (auth.getBool('isAdmin') === true) {
    e.next()
    return
  }

  var rec = e.record
  if (!rec) {
    e.next()
    return
  }
  var ownerId = rec.getString('owner')
  var agencyId = rec.getString('agency')

  // Sem agency -> autônomo: não há gestor para logar.
  if (!agencyId) {
    e.next()
    return
  }
  // Só loga o GESTOR da casa (agency = auth). Outro corretor não passa pela
  // viewRule (agency != auth && owner != auth) e nem chega aqui.
  if (agencyId !== auth.id) {
    e.next()
    return
  }
  // Dono abrindo o próprio não conta.
  if (ownerId === auth.id) {
    e.next()
    return
  }

  // Dedupe 60s: evita inundar a trilha com reaberturas seguidas do mesmo
  // negócio pela mesma pessoa.
  try {
    var cutoff = new Date(Date.now() - 60 * 1000).toISOString().replace('T', ' ')
    var recent = $app.findRecordsByFilter(
      'access_logs',
      'user = {:u} && negocio = {:n} && created >= {:c}',
      '-created',
      1,
      0,
      { u: auth.id, n: rec.id, c: cutoff },
    )
    if (recent && recent.length > 0) {
      e.next()
      return
    }
  } catch (_) {}

  try {
    var col = $app.findCollectionByNameOrId('access_logs')
    var logRec = new Record(col)
    logRec.set('user', auth.id)
    logRec.set('negocio', rec.id)
    $app.saveNoValidate(logRec)
  } catch (err) {
    $app.logger().error('negocio_access_log: falhou ao registrar acesso', 'error', String(err))
  }

  e.next()
}, 'negocios')
