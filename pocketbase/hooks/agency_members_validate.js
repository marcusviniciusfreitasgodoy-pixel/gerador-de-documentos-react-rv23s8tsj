// Validação de integridade (Fase 1, §1.1): ao criar um vínculo em
// `agency_members`, o `agency` precisa ser uma conta cujo `broker_profile`
// tem tipo_perfil = 'imobiliaria'. O admin UI já filtra só imobiliárias, mas
// o hook é a garantia real de integridade (ninguém vincula corretor a uma
// conta que não é imobiliária, nem bypassando o painel).
//
// Hook de modelo (onRecordCreate): lança Error antes do e.next() -> aborta o
// INSERT. Como createRule é admin-only, só o admin cria, e ele recebe o
// erro claro.
onRecordCreate((e) => {
  var agencyId = e.record.getString('agency')
  if (!agencyId) {
    e.next()
    return
  }

  var isImobiliaria = false
  try {
    var profiles = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, {
      u: agencyId,
    })
    if (profiles && profiles.length > 0) {
      isImobiliaria = profiles[0].getString('tipo_perfil') === 'imobiliaria'
    }
  } catch (err) {
    $app.logger().error('agency_members_validate: busca de perfil falhou', 'error', String(err))
  }

  if (!isImobiliaria) {
    throw new Error('A conta selecionada não é uma imobiliária.')
  }
  e.next()
}, 'agency_members')
