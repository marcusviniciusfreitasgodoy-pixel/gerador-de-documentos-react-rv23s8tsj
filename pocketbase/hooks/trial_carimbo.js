// Teste de 15 dias: quem carimba e quem protege o prazo.
//
// DUAS COISAS, E AS DUAS PRECISAM SER DO SERVIDOR:
//
// 1. **Carimbar na criação.** Conta nova nasce com `trial_expira_em` = agora +
//    15 dias. Contas que já existiam não são tocadas: o campo fica vazio e
//    vazio significa sem limite. É assim que a promessa da § 06 da landing
//    ("você será avisado com antecedência") continua de pé.
//
// 2. **Impedir que o próprio usuário mexa.** No PocketBase a conta tem update
//    do próprio registro em `users`. Sem esta guarda, qualquer corretor se dá
//    dez anos de teste com um PATCH. O hook devolve o valor anterior em
//    qualquer update que não venha de admin, ignorando o que o cliente mandou.
//
// Por que `onRecordCreate` no item 1 e `onRecordCreateRequest` não: o cadastro
// entra pela API, mas conta criada pelo painel ou por script também precisa de
// prazo. Hook de modelo pega os dois, e aqui não é preciso saber quem chamou.
//
// Por que `onRecordUpdateRequest` no item 2, e não `onRecordUpdate`: aqui é
// preciso saber QUEM está pedindo, e `e.auth` só existe no hook de request. Em
// hook de modelo o httpContext é nulo na escrita programática, armadilha que a
// fase 2 já pagou uma vez (ver MELHORIAS.md, seção 5).

var TRIAL_DIAS = 15

onRecordCreate((e) => {
  try {
    var prazo = new Date(Date.now() + TRIAL_DIAS * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
    e.record.set('trial_expira_em', prazo)
  } catch (err) {
    // Falhar aqui não pode impedir o cadastro. Sem carimbo a conta fica sem
    // limite, que é o lado seguro de errar: o corretor entra, e o admin
    // ajusta depois. O contrário (bloquear quem acabou de se cadastrar) seria
    // perder o usuário na porta.
    $app.logger().error('trial_carimbo: falha ao carimbar', 'error', String(err))
  }
  e.next()
}, 'users')

onRecordUpdateRequest((e) => {
  try {
    var auth = e.auth
    var isAdmin = auth ? auth.getBool('isAdmin') === true : false

    // Superuser (painel do PocketBase) não passa por aqui como `users`, e o
    // admin da plataforma pode estender à mão. Todo o resto tem o campo
    // restaurado ao valor que já estava no banco.
    if (!isAdmin) {
      var anterior = ''
      try {
        anterior = e.record.original().getString('trial_expira_em')
      } catch (origErr) {
        $app.logger().error('trial_carimbo: original() falhou', 'error', String(origErr))
        anterior = ''
      }
      e.record.set('trial_expira_em', anterior)
    }
  } catch (err) {
    $app.logger().error('trial_carimbo: guarda de update falhou', 'error', String(err))
  }
  e.next()
}, 'users')
