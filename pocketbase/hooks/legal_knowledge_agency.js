// Hook server-side para integridade de legal_knowledge (Fase 2, §4 e ponto 3):
//
// No create e no update de legal_knowledge:
// Se o autor não for admin da plataforma, forçar agency = @request.auth.id no servidor,
// sobrescrevendo o que vier do cliente.
// Se for admin, pode definir agency como desejar (vazio para global ou o ID de uma imobiliária).
//
// Usa onRecordCreateRequest e onRecordUpdateRequest. Dispara em requests de inserções/atualizações de records.

onRecordCreateRequest((e) => {
  var auth = e.auth
  var isAdmin = auth ? auth.getBool('isAdmin') : false

  if (!isAdmin) {
    var authId = auth ? auth.id : ''
    // Força agency = auth.id
    e.record.set('agency', authId)
  }

  e.next()
}, 'legal_knowledge')

onRecordUpdateRequest((e) => {
  var auth = e.auth
  var isAdmin = auth ? auth.getBool('isAdmin') : false

  if (!isAdmin) {
    var authId = auth ? auth.id : ''
    // Força agency = auth.id (impede que remova o agency ou aponte para outra)
    e.record.set('agency', authId)
  }

  e.next()
}, 'legal_knowledge')
