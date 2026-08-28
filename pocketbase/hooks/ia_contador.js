// Contador de validações de minuta por mês (decisão do Marcus, 2026-08-28).
//
// POR QUE ELE NASCE ANTES DO PREÇO
//
// Os cartões de plano prometem "Validação de minuta, 20 por mês" e "60 por mês"
// desde que existem, e até aqui nada contava. O único freio nas rotas de IA é
// uma janela de 60 segundos contra rajada, e ela é `fail-open`. A pergunta que
// trouxe este arquivo era outra ("quanto cobrar por consulta de IA?"), e a
// resposta foi que não dá para cobrar nem para limitar o que não se mede.
//
// POR QUE AQUI, E NÃO DENTRO DA ROTA
//
// A rota `/backend/v1/validar-minuta` já cria um registro em `validation_logs`
// a cada chamada, com o dono e o status. Contar a partir desse registro deixa o
// `validar_minuta.js`, que tem 1.300 linhas, intocado: menos superfície para
// errar na entrega, e o contador acompanha o log em vez de duplicar a regra de
// quando a validação "aconteceu".
//
// FALHA NÃO CONTA
//
// `status = 'fail'` é tentativa que não devolveu nada ao corretor. O custo da
// chamada existe assim mesmo, mas o número que ele lê é "você usou 7 de 20", e
// cobrar dele uma tentativa frustrada seria errado. O custo real se apura nos
// próprios `validation_logs`, que guardam o status de cada chamada por 30 dias
// (a retenção da LGPD).
//
// A VIRADA DE MÊS ZERA OS DOIS CONTADORES
//
// `ia_mes_ref` é o mês de referência dos DOIS contadores, o de validação e o de
// consulta ao especialista. Então quem chegar primeiro no mês novo zera o outro
// também. Sem isso, um corretor que validasse em setembro sem consultar
// carregaria o `consultas_no_mes` de agosto para sempre. Mesmo desenho do
// `contador_mes` do `negocio_limite.js`: a virada acontece na primeira contagem
// do mês, sem cron e sem tarefa agendada para falhar em silêncio.
//
// JSVM: o handler é uma ilha. Nada do escopo do módulo chega dentro dele, e é a
// armadilha que já custou um bug no `trial_carimbo.js`.
onRecordAfterCreateSuccess((e) => {
  try {
    var log = e.record

    if (String(log.getString('status') || '').trim() === 'fail') {
      e.next()
      return
    }

    var userId = log.getString('user')
    if (!userId) {
      e.next()
      return
    }

    var user = $app.findRecordById('users', userId)
    if (!user) {
      e.next()
      return
    }

    // `2026-08`.
    var mesAtual = new Date().toISOString().slice(0, 7)
    var mesGuardado = user.getString('ia_mes_ref')
    var mesmoMes = mesGuardado === mesAtual

    var anterior = mesmoMes ? user.getInt('validacoes_no_mes') || 0 : 0
    if (!mesmoMes) {
      user.set('consultas_no_mes', 0)
    }
    user.set('ia_mes_ref', mesAtual)
    user.set('validacoes_no_mes', anterior + 1)

    // Escrita de sistema num registro de outra coleção: `saveNoValidate` para
    // não reprovar a contagem por causa de um campo do perfil que o corretor
    // ainda não preencheu. E é PROGRAMÁTICA de propósito: não passa pelo
    // pipeline de request, então não dispara o `onRecordUpdateRequest` do
    // `plano_carimbo.js` e não é desfeita por ele. Mesmo padrão do
    // `negocio_limite.js`.
    $app.saveNoValidate(user)
  } catch (err) {
    // Falhar aqui não pode quebrar nada: a validação já foi entregue ao
    // corretor e o log já está gravado. Sem contagem, ele ganha uma validação
    // de graça; com exceção propagada, o erro apareceria numa tela que deu
    // certo. A troca não é próxima.
    $app.logger().error('ia_contador: falha ao contar a validacao', 'error', String(err))
  }
  e.next()
}, 'validation_logs')
