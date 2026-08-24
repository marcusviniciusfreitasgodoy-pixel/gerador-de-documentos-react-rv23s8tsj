---
description: Prepara a entrega dos arquivos da fase 3 para o Skip e confere depois, por diff
---

## Leia isto antes de agir

Uma versão anterior deste comando mandava colar os arquivos **automatizando o
navegador**. Estava errada, e a correção vale mais que a instrução: o projeto já
tinha aprendido isso apanhando, e anotado em `COMO_RETOMAR.md` ("REGRAS DE
OURO"), no repositório `gerador-documentos-artefatos`:

> **Arquivo completo no chat, o Marcus cola. Não automatizar paste pelo
> navegador.** O clipboard falhou 2x em 6: mojibake e uma corrida que trocou o
> arquivo por 3 linhas aleatórias. Detalhe cruel: a verificação PASSA
> falsamente (os dois lados erram na mesma direção).

E o painel "Editar Código" do Skip é **somente leitura** (`readOnly: true` no
textarea do Monaco), então nem havia onde digitar. Quem grava é o agente do
próprio Skip, pelo chat.

**Portanto: você não cola nada. Nunca dirija o navegador para escrever no Skip.**

## O que você faz

### Antes: provar que a base não está velha

Snapshot velho regride produção. Confirme que os arquivos a tocar estão
idênticos entre o Skip sincronizado e esta branch:

```
git fetch --all
git diff --stat origin/main HEAD~1 -- \
  pocketbase/hooks/extrair_dados.js src/services/agencies.ts \
  src/components/Layout.tsx src/pages/MyProfile.tsx \
  src/pages/Equipe.tsx src/components/admin/AgenciasBlock.tsx
```

Saída vazia = base boa. Qualquer linha = **pare** e avise: o Skip andou desde
que a fase 3 foi escrita, e colar por cima apagaria trabalho.

### Durante: entregar um arquivo por vez

Mostre o conteúdo **completo** de um arquivo, para o dono do projeto colar no
chat do Skip. Um por vez, na ordem abaixo, e **espere ele confirmar** que
aplicou antes de passar ao próximo.

| #   | Arquivo                                                     | Linhas |
| --- | ----------------------------------------------------------- | ------ |
| 1   | `pocketbase/migrations/1900000032_create_agency_invites.js` | 98     |
| 2   | `pocketbase/hooks/agencia_convites.js`                      | 1050   |
| 3   | `pocketbase/hooks/extrair_dados.js`                         | 1120   |
| 4   | `src/services/agencies.ts`                                  | 395    |
| 5   | `src/components/ConviteImobiliaria.tsx`                     | 508    |
| 6   | `src/components/Layout.tsx`                                 | 545    |
| 7   | `src/pages/MyProfile.tsx`                                   | 631    |
| 8   | `src/pages/Equipe.tsx`                                      | 971    |
| 9   | `src/components/admin/AgenciasBlock.tsx`                    | 785    |

Depois do **1**, pare: a coleção `agency_invites` precisa existir antes de o
hook do **2** conseguir gravar nela.

Os arquivos 1, 2 e 5 são novos. A regra antiga "o Skip não cria arquivos novos"
não vale mais: a camada de imobiliárias entrou com arquivos novos em agosto e
eles estão no Skip hoje.

`MELHORIAS.md` e `docs/SPEC-IMOBILIARIAS-F3.md` **não** vão para o Skip.

### Depois: conferir por diff, não por tela

Quando os 9 estiverem aplicados e publicados, a conferência é **baixar o
projeto pelo Skip** (`</>` → Editar Código → ícone de download) e comparar com
esta branch. Peça a pasta descompactada ao dono e rode um diff arquivo a
arquivo. **Nunca** confira lendo o editor do Skip: a regra 2 das regras de ouro
existe porque isso já enganou antes.

Alternativa aceitável: o dono sincroniza o Skip e você compara `origin/main`
com esta branch.

## Se algo divergir

Pare e relate: qual arquivo, o que esperava, o que veio. Não tente consertar
sozinho colando de novo. É produção, com CPF e RG de cliente real.
