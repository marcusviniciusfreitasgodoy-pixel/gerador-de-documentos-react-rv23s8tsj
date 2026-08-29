# Roteiro de colagem no Skip: landing enxuta

Branch: `work`, commit `e7a3592`. **Este roteiro substitui o anterior** (`ee4abb7`):
o § 02 mudou depois dele, e os blocos foram regerados. Use so este.

**Base conferida: v0.0.811** (download de 29/08 18:41). O `Signup.tsx` e o
`App.tsx` dessa versao sao byte a byte iguais aos da v0.0.810, entao as ancoras
valem. A v0.0.811 so subiu o numero de build: zero diferenca de codigo.

Se o Skip estiver numa versao mais nova que a 0.0.811 quando voce for colar,
pare e peca para recalcular: ancora que nao bate e onde o agente do Skip
inventa.

Ordem: os dois arquivos inteiros primeiro, os tres blocos do `Signup.tsx` depois,
**um por vez**. E o mesmo arquivo, e o diff so fecha no fim dos tres.

---

## 1. `src/pages/Documentos.tsx` (arquivo NOVO, 199 linhas)

Abra na branch `work`, botao **Raw**, copie tudo. No chat do Skip:

> Crie o arquivo `src/pages/Documentos.tsx` com exatamente este conteudo. Nao
> reescreva, nao reformate, nao resuma e nao implemente nada por conta propria.
> O arquivo tem 199 linhas e o resultado precisa ter o mesmo numero.

## 2. `src/App.tsx` (inteiro, 73 linhas)

> Substitua todo o conteudo de `src/App.tsx` por este. Nao reescreva, nao
> reformate, nao resuma e nao implemente nada por conta propria. O arquivo tem
> 73 linhas e o resultado precisa ter o mesmo numero.

---

## 3. `src/pages/Signup.tsx`: TRES substituicoes

**Este arquivo nao pode ser colado inteiro**: tem cerca de 200.000 caracteres
contra o limite de 50.000 do chat. Vai por substituicao ancorada, que e o metodo
com o melhor placar (29 entregas, 1 falha).

Foi provado antes de virar roteiro: aplicar os tres blocos no arquivo da
v0.0.810 reproduz o arquivo da branch **byte a byte**.

As tres base64 WebP ficam FORA dos tres blocos, de proposito. **Se um bloco que
voce colou contiver `data:image/webp`, pare: e o bloco errado.**

### Bloco 1 de 3 (14787 chars, arquivo `signup-bloco-1.txt`)

Substitua o trecho que **comeca** aqui:

```
// O QUE MUDOU NESTA REVISAO (e por que):
```

e **termina** aqui:

```
  </header>
```

O pedido para colar junto:

> Substitua, em `src/pages/Signup.tsx`, o trecho que comeca em
> `// O QUE MUDOU NESTA REVISAO (e por que):`
> e termina em `</header>` por este. Nao reescreva, nao
> reformate, nao resuma e nao implemente nada por conta propria. Nao toque em
> nenhuma outra parte do arquivo.

### Bloco 2 de 3 (7194 chars, arquivo `signup-bloco-2.txt`)

Substitua o trecho que **comeca** aqui:

```
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Você não tem departamento jurídico. Então ou usa um modelo de origem incerta, ou paga honorários por peça: no mercado, uma única minuta avulsa custa de R$ 800 a R$ 2.500, por um contrato que já é rotina na sua carreira. Sai do mesmo bolso de onde vem a comissão.</p>
```

e **termina** aqui:

```
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">A certidão sai amanhã, o estado civil ainda está em confirmação, o PIX vem depois. O negócio fica salvo pela metade e você volta nele quando o dado chegar.</p>
```

O pedido para colar junto:

> Substitua, em `src/pages/Signup.tsx`, o trecho que comeca em
> `<p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Vo`
> e termina em `<p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">A ce` por este. Nao reescreva, nao
> reformate, nao resuma e nao implemente nada por conta propria. Nao toque em
> nenhuma outra parte do arquivo.

### Bloco 3 de 3 (37966 chars, arquivo `signup-bloco-3.txt`)

Substitua o trecho que **comeca** aqui:

```
      <p data-anim style="margin:22px 0 0;max-width:600px;font-size:16px;line-height:1.75;color:#5A544C">Cada modelo é redigido para a operação brasileira, com a fundamentação do Código Civil e a cláusula de corretagem já no lugar. E nenhum deles começa em branco: todos puxam do dossiê do negócio.</p>
```

e **termina** aqui:

```
    </div>
  )
```

O pedido para colar junto:

> Substitua, em `src/pages/Signup.tsx`, o trecho que comeca em
> `<p data-anim style="margin:22px 0 0;max-width:600px;font-size:16px;lin`
> e termina em `)` por este. Nao reescreva, nao
> reformate, nao resuma e nao implemente nada por conta propria. Nao toque em
> nenhuma outra parte do arquivo.

---

## 4. Conferencia (a unica prova)

Baixe o projeto (`</>` -> Editar Codigo -> icone de download), descompacte e
diffe contra a branch `work`. O download da v0.0.811 tem **235 arquivos**, logo
o esperado depois da colagem e **236** (mais o `Documentos.tsx`) e nenhuma diferenca de codigo, fora as da lista de ignorar
(`.gitignore`, `.skip.config.json`, `package.json`, carimbo do `schema.json`).

No arquivo baixado, confira os tres hashes WebP:

```bash
python3 -c "
import re,hashlib
b=open('src/pages/Signup.tsx',encoding='utf-8').read()
print([hashlib.sha256(x.encode()).hexdigest()[:10] for x in re.findall(r'data:image/webp;base64,[A-Za-z0-9+/=]+',b)])"
# esperado: ['40b6f0b3af', '40b6f0b3af', '582241ca47']
```

E abra `/documentos` e `/imobiliarias` no preview: sao rotas novas.

Se qualquer coisa divergir, **pare e mostre o diff**. Nao recole por conta.
