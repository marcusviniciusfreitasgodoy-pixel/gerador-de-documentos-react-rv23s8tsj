// Guarda dos campos de plano e do contador de negócios.
//
// No PocketBase o usuário tem update do próprio registro em `users`. Sem esta
// guarda, qualquer corretor se dá o plano que quiser, empurra a data de
// renovação para 2040 e zera o próprio contador, tudo com um PATCH que o app
// nem precisa oferecer: basta a API. Os cinco campos voltam ao valor que já
// estava no banco em qualquer update que não venha de admin.
//
// É irmão do `trial_carimbo.js` e existe separado dele de propósito: aquele
// arquivo já foi aplicado e conferido byte a byte, e mexer nele para acrescentar
// campo custaria uma recolagem inteira de um arquivo verificado. Dois
// `onRecordUpdateRequest` na mesma coleção convivem: o PocketBase roda os dois,
// cada um chama `e.next()`, e eles tocam campos diferentes.
//
// POR QUE `onRecordUpdateRequest`, E NÃO `onRecordUpdate`
//
// Aqui é preciso saber QUEM está pedindo, e `e.auth` só existe no hook de
// request. Em hook de modelo o `httpContext` é nulo na escrita programática,
// armadilha que a fase 2 já pagou uma vez (ver MELHORIAS.md, seção 5).
//
// E há um segundo motivo, que é o que faz o contador funcionar: o
// `negocio_limite.js` grava o contador com `saveNoValidate`, ou seja,
// programaticamente. Escrita programática NÃO passa pelo pipeline de request,
// então não dispara este hook e não é desfeita por ele. Se esta guarda fosse
// `onRecordUpdate`, ela desfaria a própria contagem em silêncio, e o contador
// nunca sairia de zero. Não troque.

onRecordUpdateRequest((e) => {
  // As constantes ficam DENTRO do handler. Handlers do JSVM do PocketBase são
  // isolados e não enxergam o escopo do módulo: um `var` no topo do arquivo
  // chegaria aqui como `undefined`, o laço não iteraria e NENHUM campo seria
  // protegido. Falha muda, do tipo que só aparece quando alguém já se deu um
  // plano de graça. É a mesma razão de o `TRIAL_DIAS` morar dentro do handler
  // em `trial_carimbo.js` e de os helpers aparecerem repetidos em
  // `agencia_convites.js` e `validar_minuta.js`.
  var CAMPOS_PROTEGIDOS = [
    'plano',
    'plano_renova_em',
    'negocios_no_mes',
    'contador_mes',
    'plano_limite_negocios',
    // Carimbados pelo servidor depois desta lista nascer, e igualmente do
    // servidor: o contador de avisos de vencimento (`assinatura_aviso.js`) e os
    // contadores de uso de IA (`ia_contador.js` e a rota `consultar-ia`). Sem
    // entrar aqui, o próprio usuário zeraria o que o sistema conta, porque no
    // PocketBase ele tem update do próprio registro em `users`.
    'avisos_plano',
    'validacoes_no_mes',
    'consultas_no_mes',
    'ia_mes_ref',
  ]

  // Quais deles são número. A lista existe porque a restauração precisa saber
  // se lê o valor anterior com `getInt` ou com `getString`: devolver "0" como
  // texto num campo numérico é o tipo de erro que passa no diff e aparece na
  // conta do cliente.
  var CAMPOS_NUMERICOS = [
    'negocios_no_mes',
    'plano_limite_negocios',
    'avisos_plano',
    'validacoes_no_mes',
    'consultas_no_mes',
  ]

  try {
    var auth = e.auth
    var isAdmin = auth ? auth.getBool('isAdmin') === true : false

    // Superuser (painel do PocketBase) não passa por aqui como `users`, e o
    // admin da plataforma ajusta plano à mão quando precisa.
    if (!isAdmin) {
      var original = null
      try {
        original = e.record.original()
      } catch (origErr) {
        $app.logger().error('plano_carimbo: original() falhou', 'error', String(origErr))
      }

      for (var i = 0; i < CAMPOS_PROTEGIDOS.length; i++) {
        var campo = CAMPOS_PROTEGIDOS[i]
        // Sem o registro anterior, o lado seguro de errar é limpar: conta sem
        // plano cai no teste, e o admin ajusta. O contrário seria deixar passar
        // o valor que o cliente mandou, que é exatamente o que esta guarda
        // existe para impedir.
        if (!original) {
          e.record.set(campo, '')
          continue
        }
        if (CAMPOS_NUMERICOS.indexOf(campo) !== -1) {
          e.record.set(campo, original.getInt(campo))
        } else {
          e.record.set(campo, original.getString(campo))
        }
      }
    }
  } catch (err) {
    $app.logger().error('plano_carimbo: guarda de update falhou', 'error', String(err))
  }
  e.next()
}, 'users')
