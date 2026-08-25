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
passando). Nada a fazer aqui.

Falta apenas o que só o painel e o banco provam:

- **Regras de acesso da coleção `agency_invites`**: `create`, `update` e
  `delete` têm de estar **em branco** (só superuser). Nenhum download carrega
  regras de API, então só se confirma olhando o painel. É o que impede um
  corretor de forjar convite para si mesmo.
- **Aceite de ponta a ponta**: convidar, aceitar, e conferir **no banco** que o
  `agency_members` nasceu com `termo_aceito_em` preenchido e que o negócio
  seguinte nasceu com `agency` carimbado.

### Teste de 15 dias: PENDENTE, 8 arquivos

| #   | Arquivo                                               | Linhas |            |
| --- | ----------------------------------------------------- | ------ | ---------- |
| 1   | `pocketbase/migrations/1900000033_users_add_trial.js` | 45     | APLICADO   |
| 2   | `pocketbase/hooks/trial_carimbo.js`                   | 71     | RECOLAR    |
| 3   | `pocketbase/hooks/validar_minuta.js`                  | 1269   | APLICADO   |
| 4   | `pocketbase/hooks/extrair_dados.js`                   | 1152   | substituir |
| 5   | `src/hooks/use-auth.tsx`                              | 119    | substituir |
| 6   | `src/components/Layout.tsx`                           | 635    | substituir |
| 7   | `src/pages/Signup.tsx`                                | 1045   | substituir |
| 8   | `MELHORIAS.md`                                        | 450    | substituir |

**A migration (1) vem primeiro:** sem o campo `users.trial_expira_em`, o hook
do (2) grava em coisa que não existe.

**Cuidado especial com o (7).** O `Signup.tsx` tem três imagens WebP em base64,
~200 KB. Truncar ali apaga a arte da landing. Depois de aplicar, confira os
hashes:

```bash
python3 -c "
import re,hashlib
b=open('src/pages/Signup.tsx',encoding='utf-8').read()
print([hashlib.sha256(x.encode()).hexdigest()[:10] for x in re.findall(r'data:image/webp;base64,[A-Za-z0-9+/=]+',b)])"
# esperado: ['40b6f0b3af', '40b6f0b3af', '582241ca47']
```

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
