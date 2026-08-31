# Roteiro de colagem: hero hibrido

Base: **v0.0.818**, publicada em 29/08 20:30. O `Signup.tsx` dela tem 1.008
linhas. Confira a versao antes de comecar; se estiver mais nova, peca para
recalcular as ancoras.

Sao **tres substituicoes de UMA LINHA cada** (a terceira troca uma linha por 29).
Nenhuma chega perto do limite do chat.

## Ordem, e por que ela e essa

O passo 3 e so comentario. Vai por ultimo de proposito: se o agente do Skip
resolver aprontar, apronta no que nao afeta a tela, e voce ja tera os dois
passos que importam conferidos.

**Diffe o arquivo inteiro depois de CADA passo.** Na leva anterior o Skip apagou
o CTA final e um useEffect sem quebrar o build: exigir contagem de linhas nao
protege em substituicao de trecho, e o tsc nao pega.

---

## Passo 1: o H1

Apague a linha unica que comeca com `Todo negócio termina em documento.` e ponha
no lugar a linha unica do arquivo `hero-passo1-h1.txt`.

> No arquivo `src/pages/Signup.tsx`, substitua a linha unica que comeca com
> `Todo negócio termina em documento.` por esta linha unica. E substituicao de
> UMA linha por UMA linha. Nao mexa em mais nada do arquivo, nao reformate, nao
> remova comentario nenhum e nao implemente nada por conta propria.

## Passo 2: o subtitulo

Apague a linha unica que comeca com `Você apresenta um contrato à altura do
negócio` e ponha no lugar a linha unica do arquivo `hero-passo2-subtitulo.txt`.

> No arquivo `src/pages/Signup.tsx`, substitua a linha unica que comeca com
> `Você apresenta um contrato à altura do negócio` por esta linha unica. E
> substituicao de UMA linha por UMA linha. Nao mexa em mais nada do arquivo, nao
> reformate, nao remova comentario nenhum e nao implemente nada por conta
> propria.

## Passo 3: o comentario que registra a decisao

Apague a linha unica `// CORTE DE 29/08/2026: A PAGINA ESTAVA LONGA DEMAIS, E
ISSO FOI MEDIDO` e ponha no lugar as 29 linhas de `hero-passo3-comentario.txt`
(a ultima delas e a propria linha que voce apagou, entao ela nao se perde).

> No arquivo `src/pages/Signup.tsx`, substitua a linha unica
> `// CORTE DE 29/08/2026: A PAGINA ESTAVA LONGA DEMAIS, E ISSO FOI MEDIDO`
> pelas 29 linhas abaixo. Sao todas linhas de comentario e precisam entrar
> todas, na ordem, sem resumo. A ultima linha delas e identica a que voce
> apagou: isso e proposital. Nao mexa em mais nada do arquivo.

---

## Conferencia

Depois dos tres, baixe o projeto e diffe contra a `work`. Esperado: **236
arquivos** e nenhuma diferenca de codigo, fora `.gitignore`,
`.skip.config.json`, `package.json` e o carimbo do `schema.json`.

Hashes WebP esperados: `40b6f0b3af`, `40b6f0b3af`, `582241ca47`.

Abra a `/` no preview: o H1 tem de ler "A documentacao de uma grande
imobiliaria, na mao do corretor autonomo", com a segunda metade em italico
dourado, e nenhuma rolagem horizontal a 390.

Depois **publique**, e confirme que o `publishedAt` avancou.
