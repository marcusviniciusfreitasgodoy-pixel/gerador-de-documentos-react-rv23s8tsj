---
description: Entrega os arquivos pendentes para colar no chat do Skip e confere cada um por diff
---

Este comando carrega o estado da entrega e o método. Leia a tabela, veja o que
está pendente, e conduza dali.

## Como o código entra no Skip (não invente outro caminho)

O painel "Editar Código" do Skip é **somente leitura** (`readOnly: true` no
textarea do Monaco, cursor escondido). Quem grava os arquivos é o agente do
próprio Skip, pelo **chat**. É por isso que o `.skip.config.json` mantém uma
lista `preventAI`.

O ciclo é: o dono do projeto copia o arquivo do GitHub (botão **Raw**, no
navegador), cola no chat do Skip com o pedido, aplica, e depois **baixa o
projeto e diffa** contra esta branch.

**Nunca automatize esse paste pelo navegador, e nunca use a área de
transferência do sistema.** A regra de ouro do projeto (`COMO_RETOMAR.md`, no
repositório `gerador-documentos-artefatos`) registra que o clipboard corrompeu
o arquivo em **2 de 6** tentativas, com mojibake do `pbcopy` e uma corrida que
trocou o arquivo por três linhas aleatórias. Pior: `pbcopy | pbpaste` **passa
falso**, porque os dois erram na mesma direção. Copiar da página Raw, dentro do
navegador, não toca no clipboard do sistema.

**A contagem de linhas que o Skip informa não vale como conferência.** Ele já
relatou 1.047 para um arquivo de 1.050 que estava íntegro. Não peça o número e
não decida por ele. O diff é a única prova.

## Estado

### Fase 3 das imobiliárias: COMPLETA

Os 12 arquivos foram aplicados e conferidos byte a byte contra o download do
Skip, e a árvore baixada compila (`tsc -b` 0 erros, `oxlint` 18 avisos, build
passando).

### Teste de 15 dias: COMPLETO

Os 8 arquivos foram conferidos contra o download de 25/08/2026 e estão
**idênticos** à branch, inclusive o `trial_carimbo.js`, que já esteve marcado
para recolar. Os três hashes WebP do `Signup.tsx` conferem no arquivo que veio
do Skip: `['40b6f0b3af', '40b6f0b3af', '582241ca47']`.

### O que o download PROVA, e o que ele não prova

Correção importante de uma afirmação anterior deste arquivo: **o download do
Skip carrega, sim, as regras de API.** Elas vêm em
`src/lib/pocketbase/schema.json`, que é um dump do banco com `apiRules`,
campos e índices por coleção. Não é preciso abrir o painel para conferir regra.

Já conferido por esse caminho, no dump de 25/08/2026:

- `agency_invites` com `create`, `update` e `delete` em `null`, ou seja,
  bloqueados a superuser. É o que impede um corretor de forjar convite para si
  mesmo.
- `users.trial_expira_em` presente, com o índice `idx_users_trial_expira_em`.

Continua aberto só o que schema nenhum prova, porque é comportamento e não
estrutura:

- **Carimbo do teste**: cadastrar conta nova e conferir no banco que
  `trial_expira_em` nasceu 15 dias à frente, e que uma conta antiga continua com
  o campo vazio.
- **Aceite de ponta a ponta**: convidar, aceitar, e conferir **no banco** que o
  `agency_members` nasceu com `termo_aceito_em` preenchido e que o negócio
  seguinte nasceu com `agency` carimbado.

### Negócio automático na geração (B2): COMPLETO

Os 9 arquivos foram conferidos byte a byte contra o download de 26/08/2026, e a
árvore baixada do Skip compila: `tsc -b` 0 erros, `oxlint` 18 avisos, build
passando. Os hashes WebP do `Signup.tsx` continuam íntegros.

Cria o dossiê no ato da geração nos sete documentos que definem uma operação
(à vista, dação, FGTS, financiada, distrato, permuta, reserva/proposta). Os
acessórios (checklist, termo de chaves, termo de posse, compromisso) não criam
negócio de propósito.

**Duas lições desta leva, que valem para as próximas.**

O `PromessaFinanciadaForm.tsx` estourou o limite de 50.000 caracteres do chat do
Skip (52.696). Confira o tamanho em CARACTERES antes de prometer que um arquivo
vai inteiro; linha não serve de proxy. Para o que passa, a instrução de busca e
substituição com âncora única funcionou byte a byte.

O `PromessaAvistaForm.tsx` voltou corrompido em UMA linha, com o mesmo número de
linhas do original: `mr-2 h-4 w-4` virou `mr-4 w-4` no `className` de um
`Loader2`. Prova viva de que contagem de linha não é conferência. O conserto foi
uma substituição de linha única, e funcionou.

### Formulários de forma PLANA: COMPLETO

Recibo de sinal (`Index.tsx`), promessa simplificada (`PromiseForm`) e
autorização de venda (`IntermediationForm`). Conferidos byte a byte contra o
download de 26/08/2026, e a árvore baixada do Skip compila: `tsc -b` 0 erros,
`oxlint` 18 avisos, build passando, hashes WebP do `Signup.tsx` íntegros.

Recibo de comissão e corretagem, que moram no mesmo arquivo da autorização, NÃO
criam negócio: são acessórios, mesma regra dos termos e do checklist.

Com isso o negócio automático cobre os dez documentos que definem uma operação.

### Bloco B (plano e contador): COMPLETO

Os 7 arquivos foram conferidos contra o download de 26/08/2026 e a árvore
baixada do Skip compila: `tsc -b` 0 erros, `oxlint` 18 avisos, build passando,
hashes WebP do `Signup.tsx` íntegros.

**A migração 1900000034 rodou.** O dump do banco em
`src/lib/pocketbase/schema.json` traz os cinco campos em `users` (`plano`,
`plano_renova_em`, `negocios_no_mes`, `contador_mes`,
`plano_limite_negocios`) e os dois índices. Conferido pelo download, sem abrir
o painel.

Para hook de backend, três checagens além do diff, porque lá a falha é muda:
`node --check` em cada arquivo, contagem de `planoAtivo` nos quatro gates de IA
(2 por arquivo), e a auditoria da armadilha do JSVM abaixo.

## Auditoria da armadilha do JSVM

Handler do PocketBase não enxerga o escopo do módulo, e isso já custou um bug
(`TRIAL_DIAS` no `trial_carimbo.js`). Agora existe verificação em vez de
disciplina. Rode contra a árvore baixada do Skip:

```bash
python3 - <<'EOF'
import io,re,glob
ruim=0
for p in sorted(glob.glob('pocketbase/hooks/*.js')):
    s=io.open(p,encoding='utf-8').read()
    m=re.search(r'^(onRecord\w+|routerAdd|cronAdd)\(', s, re.M)
    if not m: continue
    topo, corpo = s[:m.start()], s[m.start():]
    decls=re.findall(r'^(?:var|const|let)\s+([A-Za-z_$][\w$]*)', topo, re.M)
    usadas=[d for d in decls if re.search(r'\b'+re.escape(d)+r'\b', corpo)]
    if usadas: print('PERIGO', p, usadas); ruim+=1
print('ok' if not ruim else f'{ruim} arquivo(s) com o padrao que quebrou o trial_carimbo')
EOF
```

## O paste inteiro falhou duas vezes; a instrução, nenhuma

Placar até aqui, e ele deve guiar a escolha do método:

| método | entregas | falhas |
| ------ | -------- | ------ |
| arquivo inteiro colado | 18 | 2 |
| instrução de busca e substituição | 7 | 0 |

As duas falhas do paste inteiro foram MUDAS para contagem de linha:

1. `PromessaAvistaForm.tsx`: uma linha corrompida, `mr-2 h-4 w-4` virou
   `mr-4 w-4` num `className` de `Loader2`. **1314 linhas nos dois arquivos.**
2. `Index.tsx`: o agente do Skip apagou **48 linhas de comentário** espalhadas
   pelo arquivo e manteve o código intacto (`+48 / -0`). Resumiu, apesar de a
   instrução proibir. Some a memória do porquê, que é o que impede alguém de
   desfazer a decisão meses depois.

Daí duas regras práticas:

- **Meça em CARACTERES, nunca em linhas**, antes de prometer que um arquivo vai
  inteiro. O `PromessaFinanciadaForm.tsx` tem 52.696 e estourou o limite de
  50.000 do chat.
- **Para arquivo grande ou muito comentado, prefira a instrução de busca e
  substituição**, com âncora verificadamente única. Ela não dá ao agente do Skip
  a oportunidade de reescrever o que não foi pedido.

Quando precisar recolar inteiro, exija a contagem no pedido: "o arquivo tem N
linhas e o resultado precisa ter N linhas". Foi o que destravou o `Index.tsx`.

## Armadilha do JSVM (custou um bug nesta entrega)

**Handler do PocketBase não enxerga o escopo do módulo.** Uma `var` declarada no
topo do arquivo chega como `undefined` dentro de `onRecordCreate` e afins. Foi
exatamente o que aconteceu com o `TRIAL_DIAS` do `trial_carimbo.js`: a conta
viraria `NaN`, o `toISOString()` lançaria, o `catch` engoliria, e nenhuma conta
nova seria carimbada. Falha muda.

Constante e helper vão **dentro** de cada handler, repetidos se preciso. É a
razão da duplicação que já existe em `agencia_convites.js` e `validar_minuta.js`.

## O ciclo, por arquivo

1. Monte a URL do arquivo nesta branch e peça ao dono para abrir, clicar em
   **Raw** e copiar:
   `https://github.com/marcusviniciusfreitasgodoy-pixel/gerador-de-documentos-react-rv23s8tsj/blob/claude/imobiliarias-fase-3-a3sirm/<caminho>`
2. O pedido para colar junto, no chat do Skip:

   > Substitua todo o conteúdo de `<caminho>` por este. Não reescreva, não
   > reformate, não resuma e não implemente nada por conta própria.

   (Para arquivo novo: "Crie o arquivo `<caminho>` com exatamente este
   conteúdo".)

3. Aplicado, peça o download do projeto (`</>` → Editar Código → ícone de
   download), descompacte e **diffe contra o arquivo desta branch**.
4. Idêntico: siga. Diferente: **pare** e mostre o diff.

Em máquina Windows o checkout vem com CRLF e o download do Skip com LF: normalize
a quebra de linha antes de comparar, senão tudo parece divergir por exatamente
uma linha por byte.

Dá para agrupar de três em três nos arquivos de frontend, porque truncamento ali
quebra o build e aparece alto. Nos hooks de backend, confira um a um: lá a falha
é muda e só aparece semanas depois.

## Diferenças que o diff deve ignorar

`package.json` (versão), `.skip.config.json` (refs de build),
`src/lib/pocketbase/schema.json` (dump do banco), e `docs/SPEC-IMOBILIARIAS-F1.md`
e `F2.md`, que o formatador do Skip realinhou (`*itálico*` virou `_itálico_`).

## Se algo divergir

Pare e relate: qual arquivo, o que esperava, o que veio. Não tente consertar
colando de novo por conta própria. É produção, com CPF e RG de cliente real.
