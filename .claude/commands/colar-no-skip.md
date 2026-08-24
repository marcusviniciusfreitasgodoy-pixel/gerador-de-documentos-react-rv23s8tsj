---
description: Cola no editor web do Skip, pelo Chrome, os arquivos da fase 3 das imobiliárias
---

Você está numa máquina que tem o Chrome com a extensão Claude in Chrome. Sua
tarefa é colar 9 arquivos desta branch no editor web do Skip, um por vez, e
conferir cada um antes de seguir.

## Contexto que já foi apurado, não precisa refazer

- Os 6 arquivos alterados estão **idênticos** entre o Skip atual (v0.0.676) e a
  base desta branch. Nenhum paste apaga trabalho de ninguém.
- `Signup.tsx` **não** está na lista e não deve ser tocado: ele tem três imagens
  WebP em base64 que qualquer recorte destrói.
- O Skip é a fonte da verdade do app em produção, com dados reais de cliente.
  Este repositório é espelho de leitura: push aqui não chega em produção.

## O risco real, e a única defesa contra ele

O editor do Skip é virtualizado (Monaco ou CodeMirror): só renderiza as linhas
visíveis. Automação de "selecionar tudo e digitar" nesse tipo de editor
**trunca em silêncio**. Um arquivo de 1.050 linhas colado pela metade não dá
erro, ele salva.

Por isso, **depois de cada arquivo**, confira a contagem de linhas na tela
contra a tabela abaixo. Se divergir, **pare imediatamente**, não tente
consertar sozinho, e avise o usuário dizendo qual arquivo e qual contagem
apareceu.

## A ordem, que é obrigatória

Backend primeiro. O 1 cria a coleção de que o 2 depende.

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

**Depois do arquivo 1, pare.** Confirme no painel do Skip que a coleção
`agency_invites` passou a existir. Só siga para o 2 depois disso. Se ela não
aparecer, avise o usuário: pode ser que o Skip não reinicie o PocketBase ao
aplicar, e aí a coleção precisa ser criada à mão pelo painel.

A ordem do frontend (4 a 9) é obrigatória por causa dos imports: o 5 importa do
4; o 6 e o 7 importam do 5. Colar fora de ordem quebra o build.

## O que NÃO vai para o Skip

`MELHORIAS.md` e `docs/SPEC-IMOBILIARIAS-F3.md`. São documentação do
repositório, e o histórico mostra que nunca entraram por sync do Skip.

## Como proceder

1. Leia o conteúdo de cada arquivo do disco, nesta branch, na íntegra.
2. Abra o editor do Skip no Chrome e navegue até o arquivo alvo.
3. Substitua o conteúdo inteiro pelo do disco. Arquivo novo (1, 2 e 5) precisa
   ser criado.
4. Confira a contagem de linhas. Só então passe para o próximo.
5. Ao terminar os 9, avise o usuário para clicar em Sincronizar.

Se algo sair do previsto em qualquer ponto, pare e pergunte. É preferível parar
no meio a deixar produção num estado que ninguém consegue reconstruir.
