// Aviso de assinatura vencendo (decisão do Marcus, 2026-08-28).
//
// O PROBLEMA
//
// A data de renovação não anda sozinha: quem move o `plano_renova_em` é o admin,
// pelo painel. Enquanto a cobrança for manual isso está certo, mas até aqui
// NINGUÉM era avisado de que a data estava chegando: nem o corretor, nem o
// admin. O corretor descobria que a assinatura venceu quando a tela travava, o
// que é a pior hora possível para descobrir, e o admin descobria quando o
// corretor reclamava.
//
// TRÊS AVISOS, E DEPOIS SILÊNCIO
//
// 7 dias antes, 3 dias antes, e no dia em que vence. Nada mais. O contador
// `avisos_plano` (migração 1900000037) guarda o que já saiu, então um dia de
// cron perdido ATRASA o aviso, não manda dois de uma vez nem repete.
//
// Quem recebe o quê:
//
//   7 dias   -> só o corretor. É cortesia, e não exige nada de ninguém aqui.
//   3 dias   -> corretor e admin. É a hora de cobrar, e cobrar é ação sua.
//   vencida  -> corretor e admin. O acesso acabou de ser pausado.
//
// Mandar todos para o admin faria a caixa dele encher de aviso que não pede
// ação, e o resultado conhecido disso é o admin parar de ler os que pedem.
//
// POR QUE A VARREDURA É LARGA
//
// O cron olha TODOS os assinantes, não só os que estão perto de vencer. É o que
// permite zerar o contador de quem renovou: assinatura renovada volta a vencer
// daqui a mais de 7 dias, e aí o campo volta a 0 e o ciclo seguinte avisa de
// novo. Filtrar só quem está perto pareceria mais econômico e deixaria o
// contador travado em 3 para sempre, calado.
//
// JSVM: o handler abaixo é uma ilha, nada do escopo do módulo chega dentro
// dele. É a armadilha que já custou um bug no `trial_carimbo.js`.

// 12:10 UTC é 09:10 em Brasília, dez minutos depois do lembrete de pendências,
// para os dois não disputarem o mesmo minuto na instância.
try {
  cronAdd('aviso_assinatura', '10 12 * * *', () => {
    try {
      var agora = Date.now()
      var UM_DIA = 24 * 60 * 60 * 1000

      var baseUrl = ''
      var meta = $app.settings().meta
      try {
        baseUrl = String(meta.appURL || '')
      } catch (_) {
        baseUrl = ''
      }
      if (!baseUrl) baseUrl = 'https://www.documentos.primecircle.app.br'
      baseUrl = baseUrl.replace(/\/+$/, '')
      var linkPlanos = baseUrl + '/planos'

      var admins = $app.findRecordsByFilter('users', 'isAdmin = true', '', 10, 0)

      for (var pagina = 0; pagina < 10; pagina++) {
        var assinantes = []
        try {
          assinantes = $app.findRecordsByFilter(
            'users',
            "plano != '' && plano_renova_em != ''",
            'plano_renova_em',
            200,
            pagina * 200,
          )
        } catch (errBusca) {
          $app
            .logger()
            .error('aviso_assinatura: busca falhou', 'pagina', pagina, 'error', String(errBusca))
          break
        }
        if (!assinantes.length) break

        for (var i = 0; i < assinantes.length; i++) {
          var u = assinantes[i]
          try {
            // Mesma leitura de data do resto do projeto: o PocketBase devolve
            // "2026-09-27 12:00:00.000Z" e o `replace` faz virar ISO.
            var renovaStr = String(u.getString('plano_renova_em') || '').trim()
            var renovaMs = renovaStr ? new Date(renovaStr.replace(' ', 'T')).getTime() : 0
            if (!renovaMs) continue

            var jaEnviados = u.getInt('avisos_plano') || 0
            var dias = Math.ceil((renovaMs - agora) / UM_DIA)

            // Renovou: zera e segue. É o reset que faz o ciclo seguinte avisar.
            if (dias > 7) {
              if (jaEnviados !== 0) {
                u.set('avisos_plano', 0)
                $app.saveNoValidate(u)
              }
              continue
            }

            var alvo = dias <= 0 ? 3 : dias <= 3 ? 2 : 1
            if (jaEnviados >= alvo) continue

            var quando =
              dias <= 0 ? 'venceu' : dias === 1 ? 'vence amanhã' : 'vence em ' + dias + ' dias'
            var assunto =
              dias <= 0
                ? 'Sua assinatura do Prime Circle Docs venceu'
                : 'Sua assinatura do Prime Circle Docs ' + quando

            var emailCorretor = u.email()
            if (emailCorretor) {
              var msg = new MailerMessage({
                from: { address: meta.senderAddress, name: meta.senderName },
                to: [{ address: emailCorretor }],
                subject: assunto,
                html:
                  '<p>Sua assinatura do Prime Circle Docs ' +
                  quando +
                  '.</p>' +
                  (dias <= 0
                    ? '<p>Gerar documento e validar minuta estão pausados por enquanto.</p>'
                    : '<p>No dia seguinte ao vencimento, gerar documento e validar minuta ficam pausados.</p>') +
                  // Esta frase não é enfeite: é a promessa da plataforma, e o
                  // momento em que o corretor mais precisa ouvir dela.
                  '<p>Seus negócios e o cadastro das partes continuam acessíveis do mesmo jeito. Nada é apagado, e nenhum dado de cliente fica preso aqui dentro.</p>' +
                  '<p><a href="' +
                  linkPlanos +
                  '">Renovar a assinatura</a></p>' +
                  '<p style="font-size:12px;color:#8A8578;">Se preferir resolver falando com a gente, use a página Ajuda e Suporte.</p>',
              })
              $app.newMailClient().send(msg)
            }

            // O admin entra a partir do aviso de 3 dias, que é quando a
            // renovação vira tarefa de alguém.
            if (alvo >= 2) {
              var nomeCorretor = (u.getString('name') || '') + ' (' + emailCorretor + ')'
              for (var a = 0; a < admins.length; a++) {
                var emailAdmin = admins[a].email()
                if (!emailAdmin) continue
                var msgAdmin = new MailerMessage({
                  from: { address: meta.senderAddress, name: meta.senderName },
                  to: [{ address: emailAdmin }],
                  subject:
                    (dias <= 0 ? 'Assinatura venceu: ' : 'Assinatura ' + quando + ': ') +
                    (u.getString('name') || emailCorretor),
                  html:
                    '<p>A assinatura de um corretor ' +
                    quando +
                    '.</p>' +
                    '<p><strong>Corretor:</strong> ' +
                    nomeCorretor +
                    '<br><strong>Plano:</strong> ' +
                    u.getString('plano') +
                    '<br><strong>Renovação:</strong> ' +
                    renovaStr +
                    '</p>' +
                    '<p style="font-size:12px;color:#8A8578;">Para estender, use o Painel, bloco de usuários, ação de carimbar plano. O contador de avisos se zera sozinho quando a data nova passar de 7 dias.</p>',
                })
                $app.newMailClient().send(msgAdmin)
              }
            }

            // Carimba DEPOIS do envio: e-mail que falha não sobe o contador, e o
            // aviso tenta de novo amanhã. Gravação de sistema, sem request, e é
            // programática de propósito: não passa pelo `onRecordUpdateRequest`
            // do `plano_carimbo.js`, então não é desfeita por ele. Mesmo padrão
            // do `negocio_limite.js`.
            u.set('avisos_plano', alvo)
            $app.saveNoValidate(u)
          } catch (errItem) {
            $app
              .logger()
              .error('aviso_assinatura: item falhou', 'id', u.id, 'error', String(errItem))
          }
        }

        if (assinantes.length < 200) break
      }
    } catch (err) {
      $app.logger().error('aviso_assinatura: falha geral', 'error', String(err))
    }
  })
} catch (cronErr) {
  $app.logger().error('aviso_assinatura: cronAdd indisponivel', 'error', String(cronErr))
}
