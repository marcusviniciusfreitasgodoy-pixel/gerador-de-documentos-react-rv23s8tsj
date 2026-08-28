// Contador de validação do avulso: `users.avulso_validacoes`.
//
// POR QUE NÃO DEU PARA USAR O CONTADOR MENSAL
//
// O `validacoes_no_mes` (migração 1900000038) zera na virada do mês. O avulso
// dura 30 dias e atravessa essa virada quase sempre: comprado dia 28, validado
// dia 29, no dia 1º o contador volta a zero e o corretor ganharia uma segunda
// validação que ninguém vendeu.
//
// O marco deste contador é a COMPRA, não o calendário: ele é zerado toda vez
// que o admin carimba um plano (`admin_usuarios.js`), e sobe a cada validação
// bem sucedida de quem está no avulso (`ia_contador.js`).
//
// POR QUE ESTA É A ÚNICA TRAVA DO AVULSO
//
// O avulso vende uma operação e uma validação de minuta. A operação NÃO é
// travada, e isso é decisão registrada: o documento sai no navegador ANTES de o
// negócio existir (veja os formulários e o `negocio_limite.js`), então recusar
// a segunda operação só tiraria o dossiê de alguém que já baixou o arquivo. E
// sai barato deixar passar: quem abre a segunda operação num avulso pagou
// R$ 149 por um mês que valeria R$ 69, ou seja, pagou A MAIS. O aviso de teto
// na tela transforma o excesso em conversa de upgrade.
//
// A validação é diferente: ela é a única parte do avulso com custo real para a
// plataforma, porque é chamada de IA. Por isso ela trava, e o resto não.
//
// Campo do SERVIDOR, protegido pelo `plano_carimbo.js` como os outros
// contadores: sem isso o próprio usuário zeraria o que o sistema conta.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('avulso_validacoes')) {
      col.fields.add(new NumberField({ name: 'avulso_validacoes', required: false, onlyInt: true }))
      app.save(col)
    }
    app.logger().info('1900000039 users_add_avulso_validacoes applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    var f = col.fields.getByName('avulso_validacoes')
    if (f) {
      col.fields.remove(f)
      app.save(col)
    }
  },
)
