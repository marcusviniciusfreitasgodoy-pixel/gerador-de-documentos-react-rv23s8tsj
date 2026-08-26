// Contador de operações do mês, carimbado pelo servidor.
//
// O QUE ELE NÃO FAZ: BLOQUEAR
//
// Passar do teto não impede nada. O negócio é criado do mesmo jeito, o contador
// sobe, e o app avisa. É decisão de produto, não descuido.
//
// O corretor está com o cliente na frente quando precisa do documento. Se o
// sistema recusar ali, ele abre o Word do contrato do mês passado e resolve por
// fora: você o empurrou para o comportamento que o teto existe para
// desestimular, e de graça. Há um segundo contorno, pior: se criar negócio é o
// que trava, o jeito óbvio de escapar é reaproveitar um dossiê antigo trocando
// as partes, e aí some a qualidade do dossiê, que é o ativo que segura o
// cliente.
//
// Tolerar custa quase nada e evita os dois. A cobrança do excedente, ou o
// convite ao upgrade, acontece na tela e na fatura, não na hora do trabalho.
//
// POR QUE O CONTADOR NÃO CONTA LINHAS
//
// A regra de `negocios` é `deleteRule: 'owner = @request.auth.id'`: o corretor
// apaga o próprio negócio. Contagem de linhas existentes viraria enfeite —
// cria, gera os documentos, apaga, a vaga volta. Aqui o número só sobe, e
// apagar o dossiê não devolve a vaga, que é o comportamento certo: a operação
// aconteceu.
//
// POR QUE `onRecordCreate`, E NÃO `onRecordCreateRequest`
//
// O `owner` já está no registro (vem do `createRule`), então não é preciso saber
// quem chamou. Hook de modelo pega também a escrita programática, e negócio
// criado por script tem de contar igual. É a mesma escolha do
// `negocio_agency_stamp.js`, que roda nesta mesma coleção.
//
// Os dois convivem sem depender de ordem: aquele mexe no registro de `negocios`
// que está sendo criado, este mexe no registro de `users` do dono.

onRecordCreate((e) => {
  // Constantes DENTRO do handler. Handler do JSVM não enxerga escopo de módulo:
  // um `var LIMITES` no topo do arquivo chegaria aqui como `undefined`, a
  // leitura lançaria, o catch abaixo engoliria, e nenhum negócio seria contado.
  // Falha muda, que só apareceria quando alguém fosse cobrar. É a mesma razão
  // de o `TRIAL_DIAS` morar dentro do handler em `trial_carimbo.js`.
  var LIMITES = {
    corretor: 10,
    profissional: 30,
    imobiliaria: 30,
  }
  // Plano vazio é conta em teste, e o teste é limitado por PRAZO, não por
  // volume: quem está avaliando a ferramenta precisa poder experimentar à
  // vontade nos 15 dias. Zero aqui significa SEM LIMITE, a mesma convenção do
  // `trial_expira_em` vazio.
  var SEM_LIMITE = 0

  var ownerId = e.record.getString('owner')
  if (!ownerId) {
    e.next()
    return
  }

  try {
    var user = $app.findRecordById('users', ownerId)
    if (!user) {
      e.next()
      return
    }

    // `2026-08`. A virada de mês acontece sozinha na primeira criação do mês
    // novo, sem cron e sem tarefa agendada para falhar em silêncio.
    var mesAtual = new Date().toISOString().slice(0, 7)
    var mesGuardado = user.getString('contador_mes')
    var anterior = mesGuardado === mesAtual ? user.getInt('negocios_no_mes') : 0

    var plano = user.getString('plano')
    var limite = Object.prototype.hasOwnProperty.call(LIMITES, plano) ? LIMITES[plano] : SEM_LIMITE

    user.set('contador_mes', mesAtual)
    user.set('negocios_no_mes', anterior + 1)
    // O teto é carimbado a cada operação, e não só quando o plano muda: assim o
    // app mostra "7 de 10" sem carregar uma tabela de preços no cliente, e uma
    // auditoria futura sabe qual teto valia naquele mês mesmo depois de a
    // tabela ter mudado.
    user.set('plano_limite_negocios', limite)

    // `saveNoValidate` porque isto é escrita de sistema num registro de outra
    // coleção: não faz sentido reprovar a contagem por causa de um campo do
    // perfil que o corretor ainda não preencheu.
    //
    // E é escrita PROGRAMÁTICA de propósito: ela não passa pelo pipeline de
    // request, então não dispara o `onRecordUpdateRequest` do
    // `plano_carimbo.js` e não é desfeita por ele.
    $app.saveNoValidate(user)
  } catch (err) {
    // Falhar aqui não pode impedir a criação do negócio. Sem contagem, o
    // corretor ganha uma operação de graça; com exceção propagada, ele perde o
    // documento que ia entregar ao cliente. A troca não é próxima.
    $app.logger().error('negocio_limite: falha ao contar a operacao', 'error', String(err))
  }

  e.next()
}, 'negocios')
