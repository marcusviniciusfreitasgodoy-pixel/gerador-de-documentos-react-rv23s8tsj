// NEUTRALIZADA EM 27/08/2026. Não restaure o conteúdo antigo.
//
// O QUE ESTE ARQUIVO ERA
//
// Uma migração que apagava, por e-mail fixo no código, a conta
// `marcus@personalshopperimobiliario.com.br` e tudo que estivesse ligado a
// ela. Nasceu de um pedido pontual ("exclua esse e-mail para eu recadastrar
// como conta de teste"), que é operação de dado e não mudança de schema.
//
// A exclusão em si JÁ ACONTECEU no banco de produção e não é desfeita aqui:
// a conta foi apagada e o e-mail ficou livre, que era o objetivo. O que este
// arquivo desarma é o que sobrou depois disso.
//
// POR QUE ELA NÃO PODIA FICAR
//
// 1. Era uma bomba-relógio contra o próprio objetivo. Migração aplicada fica
//    registrada em `_migrations` e não roda de novo NESTE banco. Mas em banco
//    novo, restaurado de backup ou recriado do zero, ela roda: procura aquele
//    e-mail e apaga quem estiver com ele. Ou seja, apagaria justamente a conta
//    de teste que o pedido queria criar, em silêncio, meses depois.
//
// 2. O alcance passava do usuário alvo. A lista de relações incluía
//    `negocios.agency`, `agency_members.agency`, `agency_invites.agency` e
//    `legal_knowledge.agency`. Não existe coleção `agencies` neste projeto: a
//    imobiliária É um usuário, e `agency` aponta para `users`. Se a conta
//    alvo fosse gestora de uma casa, a migração apagaria os NEGÓCIOS DOS
//    CORRETORES DA EQUIPE dela, que são dados de terceiros com CPF e RG de
//    clientes reais.
//
// 3. O fallback final era `DELETE FROM users WHERE id = {:id}` em SQL cru,
//    contornando qualquer proteção do PocketBase, e a reversão era vazia.
//
// COMO FAZER QUANDO PRECISAR DE NOVO
//
// Exclusão pontual de conta é operação de dado: faça no painel do PocketBase,
// no registro, com o olho no que está sendo apagado junto. Migração é para
// mudança de estrutura, que vale para todo banco em qualquer ambiente. Se um
// dia a exclusão em cascata virar necessidade recorrente, ela nasce como rota
// administrativa com gate `isAdmin` e confirmação, não como migração.
//
// O arquivo permanece com o mesmo nome de propósito: a entrada já gravada em
// `_migrations` continua batendo, e este texto explica a lacuna na numeração
// para quem vier depois.

migrate(
  (app) => {
    // Sem efeito, deliberadamente.
  },
  (app) => {
    // Sem efeito, deliberadamente.
  },
)
