# Roteiro de colagem no Skip: landing enxuta

Branch `work`. Base conferida: **v0.0.811**, cujo `Signup.tsx` tem 1.085 linhas
e e byte a byte igual ao da v0.0.810. Os numeros de linha abaixo valem para ela.

## A ORDEM MUDOU, e o motivo importa

Antes o roteiro mandava colar o `Documentos.tsx` primeiro. **Estava errado.** O
`Documentos.tsx` importa `PaginaDesign`, que so passa a existir no bloco 3 do
`Signup.tsx`: criar ele antes deixa o projeto sem compilar por tres pastes
seguidos, e agente de IA que ve projeto quebrado tenta consertar sozinho.

Na ordem abaixo **os cinco passos compilam**, um por um. Testado: `tsc -b` roda
limpo depois de cada um dos cinco. Se o Skip acusar erro, o erro e real.

| passo | o que colar | o projeto compila depois? |
| ----- | ----------- | ------------------------- |
| 1 | `Signup.tsx` bloco 1 de 3 | sim |
| 2 | `Signup.tsx` bloco 2 de 3 | sim |
| 3 | `Signup.tsx` bloco 3 de 3 | sim |
| 4 | `Documentos.tsx` (arquivo novo, inteiro) | sim |
| 5 | `App.tsx` (inteiro) | sim |

---

## Passos 1 a 3: `src/pages/Signup.tsx`

O arquivo tem cerca de 200.000 caracteres contra o limite de 50.000 do chat:
**nao da para colar inteiro, e nao adianta pedir.** Vai por substituicao de
trecho, com numero de linha.

**O erro que o agente do Skip cometeu na primeira tentativa** foi ler o conteudo
colado como se fosse o arquivo inteiro, achar que estava truncado (porque a
template literal nao fecha dentro do trecho) e pedir o arquivo completo. O
conteudo NAO estava truncado. O texto do pedido abaixo ja diz isso de forma
explicita: use ele como esta.

### Passo 1: bloco 1 de 3

Conteudo: `https://raw.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/gerador-de-documentos-react-rv23s8tsj/work/.claude/entrega/signup-bloco-1.txt` (199 linhas)

Pedido para colar junto (o conteudo vai logo abaixo dele):

> No arquivo `src/pages/Signup.tsx`, que hoje tem 1085 linhas, apague as linhas
> 21 a 130 (110 linhas), que vao da linha
> `// O QUE MUDOU NESTA REVISAO (e por que):`
> ate a linha `</header>`, as duas inclusive, e ponha exatamente
> as 199 linhas abaixo no lugar delas.
>
> ATENCAO: isto e a substituicao de um TRECHO, nao o arquivo inteiro. O que vem
> abaixo nao e um arquivo completo e nao deve ser tratado como tal. E normal ele
> comecar e terminar no meio de uma estrutura. Nao complete, nao feche, nao
> conserte, nao reescreva, nao reformate, nao resuma e nao implemente nada por
> conta propria. Se algo parecer faltando, esta no resto do arquivo, que voce nao
> deve tocar. Todas as outras linhas ficam exatamente como estao.

### Passo 2: bloco 2 de 3

Conteudo: `https://raw.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/gerador-de-documentos-react-rv23s8tsj/work/.claude/entrega/signup-bloco-2.txt` (59 linhas)

Pedido para colar junto (o conteudo vai logo abaixo dele):

> No arquivo `src/pages/Signup.tsx`, que hoje tem 1085 linhas, apague as linhas
> 215 a 311 (97 linhas), que vao da linha
> `<p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Você não`
> ate a linha `<p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">A certidão`, as duas inclusive, e ponha exatamente
> as 59 linhas abaixo no lugar delas.
>
> ATENCAO: isto e a substituicao de um TRECHO, nao o arquivo inteiro. O que vem
> abaixo nao e um arquivo completo e nao deve ser tratado como tal. E normal ele
> comecar e terminar no meio de uma estrutura. Nao complete, nao feche, nao
> conserte, nao reescreva, nao reformate, nao resuma e nao implemente nada por
> conta propria. Se algo parecer faltando, esta no resto do arquivo, que voce nao
> deve tocar. Todas as outras linhas ficam exatamente como estao.

### Passo 3: bloco 3 de 3

Conteudo: `https://raw.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/gerador-de-documentos-react-rv23s8tsj/work/.claude/entrega/signup-bloco-3.txt` (517 linhas)

Pedido para colar junto (o conteudo vai logo abaixo dele):

> No arquivo `src/pages/Signup.tsx`, que hoje tem 1085 linhas, apague as linhas
> 343 a 987 (645 linhas), que vao da linha
> `<p data-anim style="margin:22px 0 0;max-width:600px;font-size:16px;line-heig`
> ate a linha `)`, as duas inclusive, e ponha exatamente
> as 517 linhas abaixo no lugar delas.
>
> ATENCAO: isto e a substituicao de um TRECHO, nao o arquivo inteiro. O que vem
> abaixo nao e um arquivo completo e nao deve ser tratado como tal. E normal ele
> comecar e terminar no meio de uma estrutura. Nao complete, nao feche, nao
> conserte, nao reescreva, nao reformate, nao resuma e nao implemente nada por
> conta propria. Se algo parecer faltando, esta no resto do arquivo, que voce nao
> deve tocar. Todas as outras linhas ficam exatamente como estao.

---

## Passo 4: `src/pages/Documentos.tsx` (arquivo NOVO)

Raw na branch `work`: `src/pages/Documentos.tsx` (199 linhas)

> Crie o arquivo `src/pages/Documentos.tsx` com exatamente este conteudo. Nao
> reescreva, nao reformate, nao resuma e nao implemente nada por conta propria.
> O arquivo tem 199 linhas e o resultado precisa ter 199 linhas.

## Passo 5: `src/App.tsx` (inteiro, 73 linhas)

> Substitua todo o conteudo de `src/App.tsx` por este. Nao reescreva, nao
> reformate, nao resuma e nao implemente nada por conta propria. O arquivo tem
> 73 linhas e o resultado precisa ter 73 linhas.

---

## Conferencia final

Baixe o projeto e diffe contra a `work`: **236 arquivos** e nenhuma diferenca de
codigo, fora `.gitignore`, `.skip.config.json`, `package.json` e o carimbo do
`schema.json`. Confira os tres hashes WebP:

```bash
python3 -c "
import re,hashlib
b=open('src/pages/Signup.tsx',encoding='utf-8').read()
print([hashlib.sha256(x.encode()).hexdigest()[:10] for x in re.findall(r'data:image/webp;base64,[A-Za-z0-9+/=]+',b)])"
# esperado: ['40b6f0b3af', '40b6f0b3af', '582241ca47']
```

Abra `/documentos` e `/imobiliarias` no preview: sao rotas novas.

Depois **publique**: producao esta na v0.0.807 e aplicar no chat nao publica.
Confirme que o `publishedAt` do `.skip.config.json` avancou.
