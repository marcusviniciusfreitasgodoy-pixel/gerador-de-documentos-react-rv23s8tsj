---
description: Aplica os arquivos da fase 3 no Skip pelo chat e confere cada um por diff
---

Você roda numa máquina com Chrome (extensão Claude in Chrome) e com esta branch
em disco. Isso te dá as três peças do ciclo: o arquivo, o navegador e o diff.
Faça o ciclo inteiro sozinho, arquivo por arquivo.

## Estado atual (atualize ao avançar)

| #   | Arquivo                                                     | Linhas | Situação                        |
| --- | ----------------------------------------------------------- | ------ | ------------------------------- |
| 1   | `pocketbase/migrations/1900000032_create_agency_invites.js` | 98     | aplicado, conferido byte a byte |
| 2   | `pocketbase/hooks/agencia_convites.js`                      | 1050   | aplicado, conferido byte a byte |
| 3   | `pocketbase/hooks/extrair_dados.js`                         | 1120   | aplicado, **falta conferir**    |
| 4   | `src/services/agencies.ts`                                  | 395    | pendente                        |
| 5   | `src/components/ConviteImobiliaria.tsx`                     | 508    | pendente                        |
| 6   | `src/components/Layout.tsx`                                 | 545    | pendente                        |
| 7   | `src/pages/MyProfile.tsx`                                   | 631    | pendente                        |
| 8   | `src/pages/Equipe.tsx`                                      | 971    | pendente                        |
| 9   | `src/components/admin/AgenciasBlock.tsx`                    | 785    | pendente                        |

Ordem obrigatória no frontend: o **5** importa do **4**; o **6** e o **7**
importam do **5**. Colar fora de ordem quebra o build.

Os arquivos 1, 2 e 5 são novos. A regra antiga "o Skip não cria arquivos novos"
valia até julho de 2026 e já não vale: a camada de imobiliárias entrou com
arquivos novos em agosto e eles estão no Skip.

`MELHORIAS.md` e `docs/SPEC-IMOBILIARIAS-F3.md` entram por último. (Correção de
uma versão anterior deste comando, que dizia que não iam para o Skip: vão. O
download fresco mostra os dois lá dentro.)

## Antes de tudo: veja se dá para não fazer

No menu `</>` do Skip existe **"Conectar GitHub"**, que ninguém investigou. Se
ela importar de um repositório, os arquivos restantes deixam de ser tarefa:
estão no GitHub, corretos e conferidos. **Abra, leia o que oferece e relate ao
usuário antes de habilitar qualquer coisa.** É integração no nível da conta e
muda como o código chega em produção: a decisão é dele.

## Três fatos apurados, para não redescobrir apanhando

1. **O painel "Editar Código" é somente leitura.** `readOnly: true` no textarea
   do Monaco, cursor escondido, sem menu de criar arquivo. Não tente escrever
   ali. Quem grava é o agente do próprio Skip, pelo chat.
2. **Não use a área de transferência do sistema.** A regra de ouro do projeto
   (`COMO_RETOMAR.md`, repositório `gerador-documentos-artefatos`) registra que
   o clipboard corrompeu arquivo em 2 de 6 tentativas, e a conferência passou
   falso nas duas. Digite pelo protocolo do navegador, que não passa por ele.
3. **A contagem de linhas que o Skip informa não vale como conferência.** Ele
   relatou 1.047 para um arquivo de 1.050 que estava íntegro. Não peça o número
   e não decida por ele. O diff é a única prova.

## O ciclo, por arquivo

1. Leia o arquivo do disco, nesta branch, na íntegra.
2. No Chrome, no chat do Skip, digite o conteúdo inteiro junto do pedido:

   > Substitua todo o conteúdo de `<caminho>` por este. Não reescreva, não
   > reformate, não resuma e não implemente nada por conta própria.

   (Para os arquivos novos, "Crie o arquivo `<caminho>` com exatamente este
   conteúdo" em vez de "Substitua".)

3. Espere aplicar.
4. Baixe o projeto pelo Skip (`</>` → Editar Código → ícone de download),
   descompacte e **diffe contra o arquivo do disco**.
5. Idêntico byte a byte: siga para o próximo, e atualize a tabela acima.
   Diferente: **pare** e mostre o diff ao usuário.

Depois do **1** (a migration), a coleção `agency_invites` precisa existir antes
de o hook do **2** conseguir gravar nela.

## O que o diff deve ignorar

Ao comparar a árvore inteira, estas diferenças são esperadas e não indicam
problema: `package.json` (versão), `.skip.config.json` (refs de build),
`src/lib/pocketbase/schema.json` (dump do banco) e os `.md` reformatados pelo
formatador do Skip (`*itálico*` vira `_itálico_`, tabelas realinhadas).

## Limites e quando parar

O chat pode ter limite de tamanho: o maior arquivo aqui tem 41 KB. E o agente
do Skip continua entre o texto e o arquivo, podendo reformatar. O diff cobre os
dois casos, e é por isso que ele é por arquivo e não no fim.

Se algo divergir, **pare e relate**: qual arquivo, o que esperava, o que veio.
Não tente consertar colando de novo por conta própria. É produção, com CPF e RG
de cliente real.

## Uma coisa que ainda não foi verificada

As regras de acesso da coleção `agency_invites` no painel. `create`, `update` e
`delete` têm de estar **em branco** (só superuser). Nenhum arquivo do download
carrega regras, então isso só se confirma olhando o painel. É o que impede um
corretor de forjar convite para si mesmo. Peça ao usuário para conferir.
