// Carimbo de `agency` no create de negocios (Fase 1, §2 — CRÍTICO).
//
// O `owner` é definido pelo createRule (owner = @request.auth.id). O hook lê o
// owner do registro sendo criado, busca em `agency_members` um vínculo com
// status = 'ativo' E termo_aceito_em preenchido, e carimba `agency` com o
// agency desse vínculo. Se o cliente enviar `agency`, o set() abaixo
// SOBRESCREVE — valor vindo do cliente nunca é confiável (critério 7). Sem
// vínculo ou sem termo -> agency vazio (autônomo; comportamento inalterado).
//
// É hook de MODELO (onRecordCreate): dispara em TODO create (API ou
// programático) e não depende de contexto HTTP — o owner já está no registro.
// O carimbo é servidor, nunca do frontend.
onRecordCreate((e) => {
  var ownerId = e.record.getString('owner')
  if (!ownerId) {
    e.next()
    return
  }

  var agencyId = ''
  try {
    var links = $app.findRecordsByFilter(
      'agency_members',
      "member = {:m} && status = 'ativo' && termo_aceito_em != ''",
      '-created',
      1,
      0,
      { m: ownerId },
    )
    if (links && links.length > 0) {
      agencyId = links[0].getString('agency')
    }
  } catch (err) {
    $app.logger().error('negocio_agency_stamp: busca de vinculo falhou', 'error', String(err))
  }

  // Sobrescreve SEMPRE qualquer valor enviado pelo cliente.
  e.record.set('agency', agencyId)
  e.next()
}, 'negocios')
