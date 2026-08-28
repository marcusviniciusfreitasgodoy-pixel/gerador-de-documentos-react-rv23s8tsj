// Contador de avisos de vencimento: `users.avisos_plano`.
//
// Mesma ideia do `chamados.lembretes` (migração 1900000036) e pelo mesmo
// motivo: o aviso de assinatura vencendo escalona (7 dias, 3 dias, vencida) e
// alguém precisa lembrar o que já saiu, senão o corretor recebe o mesmo e-mail
// todo dia até renovar, que é o jeito mais rápido de ensinar alguém a ignorar
// os nossos e-mails.
//
// VALORES
//
// 0 (ou vazio) = nada enviado. 1 = já foi o de 7 dias. 2 = já foi o de 3 dias.
// 3 = já foi o de vencida, e não sai mais nada por esse ciclo.
//
// O CONTADOR SE ZERA SOZINHO NA RENOVAÇÃO
//
// Quando o admin empurra o `plano_renova_em`, a assinatura passa a vencer daqui
// a mais de 7 dias e o hook (`pocketbase/hooks/assinatura_aviso.js`) devolve
// este campo a 0. Sem isso, o contador ficaria travado em 3 para sempre e o
// corretor renovado nunca mais seria avisado. Por isso o hook varre TODOS os
// assinantes, e não só os que estão perto de vencer: a varredura larga é o que
// paga o reset.
//
// Campo do SERVIDOR: ninguém preenche pela tela e nada no front lê ele.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('avisos_plano')) {
      col.fields.add(new NumberField({ name: 'avisos_plano', required: false, onlyInt: true }))
      app.save(col)
    }
    app.logger().info('1900000037 users_add_avisos_plano applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    var f = col.fields.getByName('avisos_plano')
    if (f) {
      col.fields.remove(f)
      app.save(col)
    }
  },
)
