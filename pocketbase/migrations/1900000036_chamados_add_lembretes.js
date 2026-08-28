// Contador de lembretes: `chamados.lembretes` e `expert_support_requests.lembretes`.
//
// POR QUE UM CAMPO, E NÃO SÓ A DATA
//
// O lembrete de pendência (`pocketbase/hooks/chamados_aviso.js`) escalona: um
// e-mail quando o pedido completa 24h sem resposta, outro quando completa 72h,
// e para. Para não repetir, alguém precisa lembrar o que já foi enviado.
//
// A alternativa sem campo seria calcular pela idade: "manda quando estiver
// entre 24h e 48h". Só que isso assume que o cron rodou naquele dia, e essa
// premissa não se sustenta aqui. O expurgo LGPD do `validar_minuta.js` já
// nasceu duplicado (cron das 03:00 MAIS a rota do validador) justamente porque
// o cron diário "cobre períodos sem uso" e não dá garantia. Se a instância
// estiver dormindo ou reiniciando na hora marcada, a janela passa e o lembrete
// some sem ninguém saber que sumiu.
//
// Com o contador, o marcador é o estado do registro, não o calendário: um dia
// de cron perdido atrasa o lembrete, não o cancela.
//
// VALORES
//
// 0 (ou vazio) = nenhum lembrete enviado. 1 = já foi o de 24h. 2 = já foi o de
// 72h, e o hook não manda mais nada por esse pedido. Um item que passa dias sem
// o cron rodar recebe UM e-mail quando ele volta, o de 72h, e vai direto para 2:
// não se manda a fila atrasada de uma vez.
//
// O campo é do SERVIDOR. Ninguém preenche pela tela e nada no front lê ele: é
// controle interno do envio, e por isso não aparece em lugar nenhum para o
// corretor nem para o admin.
//
// SEM BACKFILL, DE PROPÓSITO
//
// Registro que já existia quando o campo nasceu fica sem valor ali. Isso seria
// um problema se o hook filtrasse por `lembretes < 2`: comparação com vazio no
// SQLite não devolve verdadeiro, e o filtro deixaria de fora justamente os
// pedidos antigos, calado. Então o hook NÃO filtra por este campo: ele lê com
// `getInt`, que devolve 0 para vazio, e decide em JavaScript. Assim a migração
// não precisa varrer nem reescrever registro nenhum, e não mexe no `updated`
// dos chamados que já estão na fila.
migrate(
  (app) => {
    var cols = ['chamados', 'expert_support_requests']
    for (var i = 0; i < cols.length; i++) {
      var col = app.findCollectionByNameOrId(cols[i])
      if (!col.fields.getByName('lembretes')) {
        col.fields.add(new NumberField({ name: 'lembretes', required: false, onlyInt: true }))
        app.save(col)
      }
    }
    app.logger().info('1900000036 chamados_add_lembretes applied')
  },
  (app) => {
    var cols = ['chamados', 'expert_support_requests']
    for (var i = 0; i < cols.length; i++) {
      try {
        var col = app.findCollectionByNameOrId(cols[i])
        var f = col.fields.getByName('lembretes')
        if (f) {
          col.fields.remove(f)
          app.save(col)
        }
      } catch (_) {}
    }
  },
)
