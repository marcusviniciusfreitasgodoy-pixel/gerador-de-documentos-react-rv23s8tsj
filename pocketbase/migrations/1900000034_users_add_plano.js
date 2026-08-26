// Bloco B: os campos que transformam o teste em assinatura.
//
// A doutrina é a mesma do `trial_expira_em` da migração 33, e de propósito:
// **vazio = sem limite**. Conta que já existe nasce sem nenhum destes campos e
// continua exatamente como está. Nada aqui liga cobrança retroativa em ninguém.
//
// Cinco campos, e cada um responde uma pergunta diferente:
//
// `plano`                   qual oferta o corretor assinou. Vazio significa que
//                           ele ainda está no teste de 15 dias, e quem manda
//                           então é o `trial_expira_em`.
//
// `plano_renova_em`         até quando o acesso pago vale. É o mesmo papel que
//                           o `trial_expira_em` cumpre no teste: o gate lê uma
//                           data, não um status de pagamento.
//
// `negocios_no_mes`         quantas operações o corretor abriu no mês corrente.
//
// `contador_mes`            o mês de referência daquele contador, no formato
//                           `2026-08`. É o que faz a virada de mês acontecer
//                           sozinha, sem cron: o hook compara e zera.
//
// `plano_limite_negocios`   o teto que valia quando o contador foi mexido pela
//                           última vez. Existe para o app mostrar "7 de 10" sem
//                           carregar uma tabela de preços no cliente, e para
//                           que uma auditoria futura saiba qual teto estava em
//                           vigor naquele mês, mesmo depois de a tabela mudar.
//
// POR QUE O CONTADOR NÃO CONTA LINHAS
//
// A regra de `negocios` é `deleteRule: 'owner = @request.auth.id'`: o corretor
// apaga o próprio negócio. Se o limite fosse uma contagem de linhas existentes,
// bastaria criar, gerar os documentos, apagar, e a vaga voltava. O teto viraria
// enfeite, e ninguém precisa ser esperto para descobrir isso — basta querer
// apagar um teste.
//
// Por isso o contador é um número que só sobe, guardado no `users` e carimbado
// pelo servidor. Apagar o dossiê não devolve a vaga, que é o comportamento
// certo: a operação aconteceu.
//
// QUEM ESCREVE
//
// Só o servidor, em `pocketbase/hooks/negocio_limite.js` (o contador) e
// `pocketbase/hooks/plano_carimbo.js` (a guarda). No PocketBase o usuário tem
// update do próprio registro em `users`, então sem a guarda qualquer corretor
// se daria o plano que quisesse com um PATCH. Mesmo princípio do `agency` na
// fase 1, do `termo_aceito_em` na fase 3 e do `trial_expira_em` na 33.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('users')

    if (!col.fields.getByName('plano')) {
      col.fields.add(new TextField({ name: 'plano', required: false, max: 40 }))
    }
    if (!col.fields.getByName('plano_renova_em')) {
      col.fields.add(new DateField({ name: 'plano_renova_em', required: false }))
    }
    if (!col.fields.getByName('negocios_no_mes')) {
      col.fields.add(new NumberField({ name: 'negocios_no_mes', required: false, onlyInt: true }))
    }
    if (!col.fields.getByName('contador_mes')) {
      col.fields.add(new TextField({ name: 'contador_mes', required: false, max: 7 }))
    }
    if (!col.fields.getByName('plano_limite_negocios')) {
      col.fields.add(
        new NumberField({ name: 'plano_limite_negocios', required: false, onlyInt: true }),
      )
    }

    // Mesmo motivo do índice da migração 33: o /admin precisa listar quem vence
    // nos próximos dias sem varrer a tabela inteira.
    col.addIndex('idx_users_plano_renova_em', false, 'plano_renova_em', '')
    col.addIndex('idx_users_plano', false, 'plano', '')

    app.save(col)
    app.logger().info('1900000034 users_add_plano applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    var nomes = [
      'plano',
      'plano_renova_em',
      'negocios_no_mes',
      'contador_mes',
      'plano_limite_negocios',
    ]
    for (var i = 0; i < nomes.length; i++) {
      var f = col.fields.getByName(nomes[i])
      if (f) col.fields.remove(f)
    }
    try {
      col.removeIndex('idx_users_plano_renova_em')
    } catch (_) {}
    try {
      col.removeIndex('idx_users_plano')
    } catch (_) {}
    app.save(col)
  },
)
