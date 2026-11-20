// Passe avulso: o dossiê só vale para o imóvel do passe, e só até o fim dos 30 dias (pedido 1133, item C).
//
// O QUE ESTE ARQUIVO FAZ
//
// Quando o plano da conta é `avulso` e a plataforma carimbou os imóveis do passe (`users.avulso_imoveis`, migração
// 1900000040), o servidor só aceita um `negocio` (dossiê) cujo imóvel seja um desses imóveis, e só enquanto o passe vale:
//
//   - criar negócio: bloqueado com o passe vencido. Com o passe vigente, só se o endereço do imóvel casar com um imóvel
//     do passe. Negócio criado SEM endereço ainda passa (o corretor abre o dossiê e preenche depois); quem barra é a
//     gravação do endereço, logo abaixo;
//   - gravar o imóvel de um negócio: o endereço novo tem de casar com um imóvel do passe vigente. Gravar outra coisa no
//     negócio (partes, título) não é barrado: depois do vencimento a pessoa continua vendo e corrigindo o que já tem.
//
// Avulso SEM `avulso_imoveis` (carimbo manual do admin, ou os que já existiam) não é tocado por nada aqui: é o mesmo
// comportamento de antes.
//
// O QUE ESTE ARQUIVO NÃO PODE FAZER (e por que isso está escrito aqui)
//
// O arquivo .docx é montado no NAVEGADOR, a partir do formulário, e baixado antes de o negócio existir (veja
// `negocioAutomatico.ts` e o `negocio_limite.js`). O servidor nunca vê o documento nem o endereço digitado no
// formulário, então nenhum hook de servidor consegue impedir um download. O que o servidor controla, e este arquivo
// fecha: o dossiê (histórico e contagem da operação), a validação de minuta (`validar_minuta.js`, que continua a travar
// o avulso) e a validade do plano (a tela de "geração" já fica bloqueada quando o plano vence, `Layout.tsx`). Travar a
// geração por imóvel DENTRO dos formulários exigiria alterar os nove formulários de documento; está registrado em
// `docs/INTEGRACAO-PRIME-CIRCLE-1133.md` como decisão pendente.
//
// COMO O IMÓVEL É RECONHECIDO
//
// O endereço do dossiê é texto livre (`imovel.endereco`), digitado pelo corretor. Comparar texto inteiro falharia por
// "Rua X, 12" contra "R. X nº 12 apto 3". A regra é a mesma ideia do `identificadoresDoImovel`, só que mais tolerante: o
// endereço do dossiê precisa conter TODAS as palavras do nome da rua (sem o tipo: rua, av., travessa...) e o NÚMERO do
// imóvel como número inteiro (12 não casa com 120). Se o passe e o dossiê trazem cidade, ela também precisa bater. A
// matrícula não entra: a plataforma não a guarda.
//
// JSVM: as constantes e as funções ficam DENTRO de cada handler, que é uma ilha (armadilha que já custou um bug no
// `trial_carimbo.js`). Por isso a mesma regra aparece nos dois handlers; se mudar um, mude o outro.

onRecordCreateRequest((e) => {
  var TIPOS = {
    rua: 1,
    r: 1,
    avenida: 1,
    av: 1,
    alameda: 1,
    al: 1,
    travessa: 1,
    tv: 1,
    estrada: 1,
    estr: 1,
    praca: 1,
    pca: 1,
    rodovia: 1,
    rod: 1,
    largo: 1,
    beco: 1,
    ladeira: 1,
  }
  function norm(v) {
    return String(v || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  }
  function casa(imovelDossie, doPasse) {
    var ruaTokens = norm(doPasse.logradouro)
      .split(' ')
      .filter(function (t) {
        return t && !TIPOS[t]
      })
    if (!ruaTokens.length) return false
    var texto = norm(imovelDossie.endereco)
    if (!texto) return false
    var tokens = texto.split(' ')
    for (var i = 0; i < ruaTokens.length; i++) {
      if (tokens.indexOf(ruaTokens[i]) === -1) return false
    }
    var numero = String(doPasse.numero || '').replace(/\D/g, '')
    if (numero && tokens.indexOf(numero) === -1) return false
    var cidadeDossie = norm(imovelDossie.cidade)
    var cidadePasse = norm(doPasse.cidade)
    if (cidadeDossie && cidadePasse && cidadeDossie !== cidadePasse) return false
    return true
  }
  // Devolve '' (pode) ou a mensagem do bloqueio. NÃO lança: o `instanceof` de erro do PocketBase não é confiável dentro
  // de try/catch, então quem lança é o handler, depois do try.
  function decidir(auth, imovel, antes, criando) {
    if (!auth || auth.collection().name !== 'users' || auth.getBool('isAdmin')) return ''
    if (String(auth.getString('plano') || '').trim() !== 'avulso') return ''
    var bruto = String(auth.getString('avulso_imoveis') || '').trim()
    if (!bruto) return ''

    if (!criando) {
      // O endereço (e a cidade) não mudou: é edição de outra coisa, e isso continua valendo depois do vencimento.
      if (
        norm(imovel.endereco) === norm(antes.endereco) &&
        norm(imovel.cidade) === norm(antes.cidade)
      )
        return ''
      // Esvaziar o endereço também não leva a outro imóvel.
      if (!norm(imovel.endereco)) return ''
    }

    var renova = String(auth.getString('plano_renova_em') || '').trim()
    var renovaMs = renova ? new Date(renova.replace(' ', 'T')).getTime() : 0
    if (!renovaMs || renovaMs <= Date.now()) {
      return criando
        ? 'O seu avulso terminou, então não dá para abrir um negócio novo. Os negócios que você já criou continuam aqui.'
        : 'O seu avulso terminou, então não dá para trocar o imóvel deste negócio. Você continua vendo os seus negócios.'
    }
    // Negócio novo sem endereço: o dossiê nasce vazio e o endereço é conferido quando for gravado.
    if (criando && !norm(imovel.endereco)) return ''

    var lista = []
    try {
      lista = JSON.parse(bruto) || []
    } catch (lErr) {
      // Lista ilegível: lado seguro é não trancar quem pagou. O erro fica no log para o admin carimbar de novo.
      $app
        .logger()
        .error('avulso_imovel: avulso_imoveis ilegivel', 'user', auth.id, 'error', String(lErr))
      return ''
    }
    var agora = Date.now()
    var ruas = []
    for (var i = 0; i < lista.length; i++) {
      var ate = lista[i].ate ? new Date(String(lista[i].ate)).getTime() : renovaMs
      if (ate && ate <= agora) continue
      ruas.push(String(lista[i].logradouro || '') + (lista[i].numero ? ', ' + lista[i].numero : ''))
      if (casa(imovel, lista[i])) return ''
    }
    return (
      'O seu avulso vale só para o imóvel do passe' +
      (ruas.length ? ' (' + ruas.join('; ') + ')' : '') +
      '. Confira o endereço do imóvel neste negócio.'
    )
  }

  var bloqueio = ''
  try {
    var imovel = {}
    try {
      imovel = JSON.parse(String(e.record.getString('imovel') || '{}')) || {}
    } catch (pErr) {
      imovel = {}
    }
    bloqueio = decidir(e.auth, imovel, {}, true)
  } catch (err) {
    // Falha inesperada na conferência não pode impedir quem pagou de trabalhar: o lado seguro é deixar passar e registrar.
    $app.logger().error('avulso_imovel: falha ao conferir o imovel (criacao)', 'error', String(err))
  }
  if (bloqueio) throw new ForbiddenError(bloqueio)
  e.next()
}, 'negocios')

onRecordUpdateRequest((e) => {
  var TIPOS = {
    rua: 1,
    r: 1,
    avenida: 1,
    av: 1,
    alameda: 1,
    al: 1,
    travessa: 1,
    tv: 1,
    estrada: 1,
    estr: 1,
    praca: 1,
    pca: 1,
    rodovia: 1,
    rod: 1,
    largo: 1,
    beco: 1,
    ladeira: 1,
  }
  function norm(v) {
    return String(v || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  }
  function casa(imovelDossie, doPasse) {
    var ruaTokens = norm(doPasse.logradouro)
      .split(' ')
      .filter(function (t) {
        return t && !TIPOS[t]
      })
    if (!ruaTokens.length) return false
    var texto = norm(imovelDossie.endereco)
    if (!texto) return false
    var tokens = texto.split(' ')
    for (var i = 0; i < ruaTokens.length; i++) {
      if (tokens.indexOf(ruaTokens[i]) === -1) return false
    }
    var numero = String(doPasse.numero || '').replace(/\D/g, '')
    if (numero && tokens.indexOf(numero) === -1) return false
    var cidadeDossie = norm(imovelDossie.cidade)
    var cidadePasse = norm(doPasse.cidade)
    if (cidadeDossie && cidadePasse && cidadeDossie !== cidadePasse) return false
    return true
  }
  // Devolve '' (pode) ou a mensagem do bloqueio. NÃO lança: o `instanceof` de erro do PocketBase não é confiável dentro
  // de try/catch, então quem lança é o handler, depois do try.
  function decidir(auth, imovel, antes, criando) {
    if (!auth || auth.collection().name !== 'users' || auth.getBool('isAdmin')) return ''
    if (String(auth.getString('plano') || '').trim() !== 'avulso') return ''
    var bruto = String(auth.getString('avulso_imoveis') || '').trim()
    if (!bruto) return ''

    if (!criando) {
      // O endereço (e a cidade) não mudou: é edição de outra coisa, e isso continua valendo depois do vencimento.
      if (
        norm(imovel.endereco) === norm(antes.endereco) &&
        norm(imovel.cidade) === norm(antes.cidade)
      )
        return ''
      // Esvaziar o endereço também não leva a outro imóvel.
      if (!norm(imovel.endereco)) return ''
    }

    var renova = String(auth.getString('plano_renova_em') || '').trim()
    var renovaMs = renova ? new Date(renova.replace(' ', 'T')).getTime() : 0
    if (!renovaMs || renovaMs <= Date.now()) {
      return criando
        ? 'O seu avulso terminou, então não dá para abrir um negócio novo. Os negócios que você já criou continuam aqui.'
        : 'O seu avulso terminou, então não dá para trocar o imóvel deste negócio. Você continua vendo os seus negócios.'
    }
    // Negócio novo sem endereço: o dossiê nasce vazio e o endereço é conferido quando for gravado.
    if (criando && !norm(imovel.endereco)) return ''

    var lista = []
    try {
      lista = JSON.parse(bruto) || []
    } catch (lErr) {
      // Lista ilegível: lado seguro é não trancar quem pagou. O erro fica no log para o admin carimbar de novo.
      $app
        .logger()
        .error('avulso_imovel: avulso_imoveis ilegivel', 'user', auth.id, 'error', String(lErr))
      return ''
    }
    var agora = Date.now()
    var ruas = []
    for (var i = 0; i < lista.length; i++) {
      var ate = lista[i].ate ? new Date(String(lista[i].ate)).getTime() : renovaMs
      if (ate && ate <= agora) continue
      ruas.push(String(lista[i].logradouro || '') + (lista[i].numero ? ', ' + lista[i].numero : ''))
      if (casa(imovel, lista[i])) return ''
    }
    return (
      'O seu avulso vale só para o imóvel do passe' +
      (ruas.length ? ' (' + ruas.join('; ') + ')' : '') +
      '. Confira o endereço do imóvel neste negócio.'
    )
  }

  var bloqueio = ''
  try {
    var novo = {}
    var antes = {}
    try {
      novo = JSON.parse(String(e.record.getString('imovel') || '{}')) || {}
      antes = JSON.parse(String(e.record.original().getString('imovel') || '{}')) || {}
    } catch (pErr) {
      novo = {}
      antes = {}
    }
    bloqueio = decidir(e.auth, novo, antes, false)
  } catch (err) {
    $app
      .logger()
      .error('avulso_imovel: falha ao conferir o imovel (atualizacao)', 'error', String(err))
  }
  if (bloqueio) throw new ForbiddenError(bloqueio)
  e.next()
}, 'negocios')
