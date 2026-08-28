// Contadores de uso de IA: `users.validacoes_no_mes`, `users.consultas_no_mes`
// e `users.ia_mes_ref`.
//
// POR QUE ISTO EXISTE, E POR QUE ANTES DE QUALQUER PREÇO
//
// A página de planos promete "Validação de minuta, 20 por mês" e "60 por mês"
// desde que nasceu, e NINGUÉM contava. O único limite nas duas rotas de IA é
// uma janela de 60 segundos contra rajada, que ainda por cima é `fail-open`.
// Ou seja: número na página, sem régua atrás, igual ao teto de operações.
//
// A conversa que trouxe estes campos foi sobre vender consulta de IA avulsa ou
// em pacote. A resposta foi "ainda não", e o motivo é este: não dá para vender
// nem para limitar o que não se mede. Primeiro o contador, depois duas ou três
// semanas de dado real, e só então o preço. Vender antes seria a segunda
// promessa sem mecanismo na mesma página.
//
// OS DOIS CONTADORES SÃO COISAS DIFERENTES
//
// `validacoes_no_mes` conta a validação de minuta, que é o que os cartões
// prometem com número. `consultas_no_mes` conta a consulta de IA do
// especialista, que hoje não tem teto nenhum e é a que o pedido queria
// precificar. Separados porque um dia podem ter réguas diferentes, e juntar
// agora obrigaria a separar depois.
//
// `ia_mes_ref` guarda o mês corrente no formato `2026-08`. A virada acontece
// sozinha na primeira contagem do mês novo, sem cron e sem tarefa agendada para
// falhar em silêncio. É o mesmo desenho do `contador_mes` do
// `negocio_limite.js`, e de propósito: dois contadores de mês com regras
// diferentes seria um convite a bug.
//
// FALHA NÃO CONTA
//
// O `ia_contador.js` só soma quando a validação deu certo. O custo da chamada
// existe mesmo quando a IA falha, mas o número que o corretor lê é "você usou 7
// de 20", e cobrar dele uma tentativa que não devolveu nada seria errado. O
// custo real se apura nos `validation_logs`, que guardam o status de cada
// chamada por 30 dias.
//
// Campos do SERVIDOR. O `plano_carimbo.js` desfaz qualquer alteração vinda de
// quem não é admin, como já faz com `negocios_no_mes`.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('users')

    if (!col.fields.getByName('validacoes_no_mes')) {
      col.fields.add(new NumberField({ name: 'validacoes_no_mes', required: false, onlyInt: true }))
    }
    if (!col.fields.getByName('consultas_no_mes')) {
      col.fields.add(new NumberField({ name: 'consultas_no_mes', required: false, onlyInt: true }))
    }
    if (!col.fields.getByName('ia_mes_ref')) {
      col.fields.add(new TextField({ name: 'ia_mes_ref', required: false, max: 7 }))
    }

    app.save(col)
    app.logger().info('1900000038 users_add_contadores_ia applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    var nomes = ['validacoes_no_mes', 'consultas_no_mes', 'ia_mes_ref']
    for (var i = 0; i < nomes.length; i++) {
      var f = col.fields.getByName(nomes[i])
      if (f) col.fields.remove(f)
    }
    app.save(col)
  },
)
