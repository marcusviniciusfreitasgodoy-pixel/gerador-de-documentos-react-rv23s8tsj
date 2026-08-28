// Avisos de pendência para o admin (decisão do Marcus, 2026-08-27).
//
// O QUE ESTE ARQUIVO RESOLVE
//
// A plataforma recebe pedido do corretor por duas portas, e a fila do /admin
// junta as duas:
//
//   `chamados`                 sugestão, correção, dúvida, pedido de assinatura
//   `expert_support_requests`  pedido de análise por um especialista
//
// Até aqui só a PRIMEIRA avisava alguém: o `extrair_dados.js` manda e-mail para
// os admins quando nasce um chamado. A segunda, que é o pedido mais caro e mais
// urgente que chega, caía no banco em silêncio. Só se descobria abrindo o
// painel. É o buraco que o primeiro bloco deste arquivo fecha.
//
// O segundo buraco era o que vinha DEPOIS do aviso: nada. Se o e-mail passasse
// batido, o pedido ficava parado sem que ninguém fosse cutucado de novo. É o
// que o cron do segundo bloco resolve.
//
// POR QUE LEMBRETE ESCALONADO, E NÃO RESUMO DIÁRIO
//
// A opção óbvia era um e-mail por dia dizendo "3 pedidos abertos". Duas razões
// para não fazer assim:
//
// 1. E-mail diário que repete o mesmo número vira ruído. Com um admin e volume
//    baixo, dez manhãs iguais treinam a pessoa a arquivar sem ler, e aí o dia
//    em que forem oito também é arquivado.
// 2. Um resumo diário depende do cron ter rodado NAQUELE dia. Aqui isso não é
//    garantia: veja o comentário do expurgo LGPD no `validar_minuta.js`, que
//    roda em dois lugares de propósito porque o cron sozinho "cobre períodos
//    sem uso" e nada mais.
//
// Então o lembrete é POR PEDIDO, não por dia: um e-mail quando o pedido
// completa 24h sem resposta, outro quando completa 72h, e para. No máximo dois
// por pedido, cada um sobre um item específico e com link direto para a tela de
// resposta. Nunca repete, então nunca vira ruído.
//
// O controle está no campo `lembretes` (migração 1900000036), não no
// calendário: um dia de cron perdido atrasa o lembrete, não o cancela.
//
// O LEMBRETE NÃO REPETE O TEXTO DO PEDIDO
//
// O aviso da hora manda o conteúdo, porque é o que permite decidir na hora. O
// lembrete manda só tipo, autor, idade e link. Mensagem de corretor pode conter
// dado de cliente, e não há razão para multiplicar cópias disso em caixa de
// e-mail por um lembrete que só precisa dizer "isto aqui está parado".
//
// JSVM: cada handler abaixo é uma ilha. Nada de escopo de módulo chega dentro
// deles, então as constantes e os ajudantes estão repetidos DE PROPÓSITO em
// cada um. É a mesma armadilha que já custou um bug no `trial_carimbo.js`.

// ============================================================================
// 1. Pedido de especialista novo -> avisa os admins na hora.
// ============================================================================
onRecordAfterCreateSuccess((e) => {
  try {
    var req = e.record

    var autorTxt = 'corretor não identificado'
    var autorId = req.getString('user')
    if (autorId) {
      autorTxt = autorId
      try {
        var autor = $app.findRecordById('users', autorId)
        autorTxt = (autor.getString('name') || '') + ' (' + autor.email() + ')'
      } catch (_) {}
    }

    var baseUrl = ''
    var meta = $app.settings().meta
    try {
      baseUrl = String(meta.appURL || '')
    } catch (_) {
      baseUrl = ''
    }
    if (!baseUrl) baseUrl = 'https://www.documentos.primecircle.app.br'
    baseUrl = baseUrl.replace(/\/+$/, '')
    var link = baseUrl + '/especialista/' + req.id

    var objetivo = req.getString('objective') || ''
    var tipoDoc = req.getString('document_type') || ''
    var descricao = req.getString('description') || ''
    var titulo = objetivo || tipoDoc || 'Solicitação de análise'

    var admins = $app.findRecordsByFilter('users', 'isAdmin = true', '', 10, 0)
    for (var i = 0; i < admins.length; i++) {
      var adminEmail = admins[i].email()
      if (!adminEmail) continue
      var msg = new MailerMessage({
        from: { address: meta.senderAddress, name: meta.senderName },
        to: [{ address: adminEmail }],
        subject: 'Pedido de especialista no Prime Circle Docs: ' + titulo,
        html:
          '<p>Um corretor pediu análise de um especialista.</p>' +
          '<p><strong>Assunto:</strong> ' +
          titulo +
          (tipoDoc && tipoDoc !== titulo ? '<br><strong>Documento:</strong> ' + tipoDoc : '') +
          '<br><strong>De:</strong> ' +
          autorTxt +
          '</p>' +
          (descricao
            ? '<p style="white-space:pre-wrap;border-left:3px solid #C9A84C;padding-left:12px;">' +
              descricao +
              '</p>'
            : '') +
          '<p><a href="' +
          link +
          '">Abrir o pedido para responder</a></p>' +
          '<p style="font-size:12px;color:#8A8578;">A fila completa fica no Painel, no menu do Prime Circle Docs.</p>',
      })
      $app.newMailClient().send(msg)
    }
  } catch (err) {
    $app.logger().error('email especialista: falha no envio', 'error', String(err))
  }
  e.next()
}, 'expert_support_requests')

// ============================================================================
// 2. Cron diário: lembrete de pendência parada (24h e 72h).
// ============================================================================
//
// 12:00 UTC é 09:00 em Brasília: cai na caixa de manhã, e é horário em que a
// instância está de pé (o expurgo LGPD das 03:00 pode rodar de madrugada porque
// ninguém precisa ver o resultado; um lembrete, sim).
try {
  cronAdd('lembrete_pendencias', '0 12 * * *', () => {
    try {
      var agora = Date.now()
      var UMA_HORA = 60 * 60 * 1000
      var corte24 = new Date(agora - 24 * UMA_HORA).toISOString().replace('T', ' ')

      var baseUrl = ''
      var meta = $app.settings().meta
      try {
        baseUrl = String(meta.appURL || '')
      } catch (_) {
        baseUrl = ''
      }
      if (!baseUrl) baseUrl = 'https://www.documentos.primecircle.app.br'
      baseUrl = baseUrl.replace(/\/+$/, '')

      var admins = $app.findRecordsByFilter('users', 'isAdmin = true', '', 10, 0)
      if (!admins.length) return

      // As duas portas da fila, com o filtro IGUAL ao que a tela do /admin usa.
      // Se divergir, o e-mail cobra o que o painel não mostra (ou pior: deixa de
      // cobrar o que ele mostra).
      //
      // O `lembretes` NÃO entra no filtro de propósito. Registro anterior à
      // migração 1900000036 está vazio nesse campo, e comparação com vazio no
      // SQLite não devolve verdadeiro: `lembretes < 2` deixaria de fora
      // exatamente os pedidos antigos, sem erro nenhum no log. A conta é feita
      // aqui embaixo com `getInt`, que devolve 0 para vazio.
      var FONTES = [
        {
          col: 'chamados',
          filtro: "status != 'resolvido' && created < {:corte}",
          rota: '/chamados/',
          rotulo: 'Chamado',
          campoTitulo: 'tipo',
          campoResposta: 'resposta',
        },
        {
          col: 'expert_support_requests',
          filtro: "status != 'completed' && created < {:corte}",
          rota: '/especialista/',
          rotulo: 'Pedido de especialista',
          campoTitulo: 'objective',
          campoResposta: '',
        },
      ]

      for (var f = 0; f < FONTES.length; f++) {
        var fonte = FONTES[f]
        var pendentes = []
        try {
          // Do mais novo para o mais velho: se um dia a fila passar de 200
          // pendentes, os que interessam são os que acabaram de cruzar as 24h.
          // Os velhos já receberam os dois lembretes e não têm mais nada a
          // receber; ficar preso neles é que perderia os novos.
          pendentes = $app.findRecordsByFilter(fonte.col, fonte.filtro, '-created', 200, 0, {
            corte: corte24,
          })
        } catch (errBusca) {
          $app
            .logger()
            .error('lembrete_pendencias: busca falhou', 'col', fonte.col, 'error', String(errBusca))
          continue
        }

        for (var i = 0; i < pendentes.length; i++) {
          var rec = pendentes[i]
          try {
            // Mesma leitura de data do `agencia_convites.js`: o PocketBase
            // devolve "2026-08-27 20:34:12.123Z" e o `replace` faz virar ISO.
            var criadoStr = String(rec.getString('created') || '').trim()
            var criadoMs = criadoStr ? new Date(criadoStr.replace(' ', 'T')).getTime() : 0
            if (!criadoMs) continue
            var horas = (agora - criadoMs) / UMA_HORA
            if (!(horas >= 24)) continue

            // Nível pela idade: 72h já passou, manda o segundo e encerra; entre
            // 24h e 72h, manda o primeiro. Item muito atrasado (cron que não
            // rodou por dias) recebe UM e-mail, o de 72h, e vai direto para 2.
            var alvo = horas >= 72 ? 2 : 1
            var jaEnviados = rec.getInt('lembretes') || 0
            if (jaEnviados >= alvo) continue

            // Chamado com resposta escrita já foi atendido: só falta encerrar.
            // Cobrar resposta dele seria mentira, e mentira em aviso automático
            // é o começo do hábito de ignorar o aviso. O pedido de especialista
            // não tem campo equivalente (`ai_response` é resposta da IA, não
            // sua), então lá o status é o único sinal.
            if (fonte.campoResposta && String(rec.getString(fonte.campoResposta) || '').trim()) {
              continue
            }

            var autorTxt = 'corretor não identificado'
            var autorId = rec.getString('user')
            if (autorId) {
              autorTxt = autorId
              try {
                var autor = $app.findRecordById('users', autorId)
                autorTxt = (autor.getString('name') || '') + ' (' + autor.email() + ')'
              } catch (_) {}
            }

            var titulo = rec.getString(fonte.campoTitulo) || fonte.rotulo
            var dias = Math.floor(horas / 24)
            var idadeTxt = dias >= 2 ? 'há ' + dias + ' dias' : 'há mais de 24 horas'
            var link = baseUrl + fonte.rota + rec.id

            for (var a = 0; a < admins.length; a++) {
              var adminEmail = admins[a].email()
              if (!adminEmail) continue
              var msg = new MailerMessage({
                from: { address: meta.senderAddress, name: meta.senderName },
                to: [{ address: adminEmail }],
                subject: 'Sem resposta ' + idadeTxt + ': ' + fonte.rotulo.toLowerCase(),
                html:
                  '<p>Este pedido está na fila sem resposta ' +
                  idadeTxt +
                  '.</p>' +
                  '<p><strong>' +
                  fonte.rotulo +
                  ':</strong> ' +
                  titulo +
                  '<br><strong>De:</strong> ' +
                  autorTxt +
                  '</p>' +
                  '<p><a href="' +
                  link +
                  '">Abrir para responder</a></p>' +
                  '<p style="font-size:12px;color:#8A8578;">' +
                  (alvo === 2
                    ? 'Este é o último lembrete deste pedido. Ele continua na fila do Painel até você encerrar.'
                    : 'Se continuar parado, você recebe mais um lembrete em 72 horas. Depois disso, só a fila do Painel.') +
                  ' Se já resolveu por fora, encerre o item no Painel para os avisos pararem.' +
                  '</p>',
              })
              $app.newMailClient().send(msg)
            }

            // Carimba DEPOIS do envio: se o e-mail falhar, o contador não sobe e
            // o lembrete tenta de novo amanhã. Gravação de sistema, sem request:
            // saveNoValidate é o padrão do projeto para isso.
            rec.set('lembretes', alvo)
            $app.saveNoValidate(rec)
          } catch (errItem) {
            $app
              .logger()
              .error(
                'lembrete_pendencias: item falhou',
                'col',
                fonte.col,
                'id',
                rec.id,
                'error',
                String(errItem),
              )
          }
        }
      }
    } catch (err) {
      $app.logger().error('lembrete_pendencias: falha geral', 'error', String(err))
    }
  })
} catch (cronErr) {
  $app.logger().error('lembrete_pendencias: cronAdd indisponivel', 'error', String(cronErr))
}
