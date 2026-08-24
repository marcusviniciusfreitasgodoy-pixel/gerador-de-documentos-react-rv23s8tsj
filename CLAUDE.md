# Prime Circle Documentos

Plataforma em produção, com clientes reais: https://documentos.primecircle.app.br
Gera os documentos da intermediação imobiliária em `.docx`, valida minutas de
terceiros com IA e centraliza os dados da operação num dossiê por negócio.

## Leia estes dois antes de começar

- **`DEV-README.md`** — stack, mapa do repositório, modelo de dados, convenções.
- **`MELHORIAS.md`** — o que foi feito em agosto de 2026 e **por quê**. A seção 7
  lista o que ficou em aberto. É o arquivo que evita você reconsertar algo já
  consertado.

Especificações da camada de imobiliárias em `docs/SPEC-IMOBILIARIAS-F1.md` e
`docs/SPEC-IMOBILIARIAS-F2.md`.

## Como o código chega em produção

O app **não** é buildado a partir daqui. Ele vive no [Skip](https://goskip.dev),
que tem editor web próprio. Este repositório é um **espelho de leitura**.

- **Push aqui não chega em produção.** Nenhum. Não existe CI/CD entre os dois.
- Mudança entra **colando o arquivo inteiro** no editor do Skip.
- **O Skip não cria arquivos novos.** Código novo tem de caber em arquivo que já
  existe. Por isso há componentes convivendo em arquivos que normalmente seriam
  separados. Não é desleixo, é a restrição da ferramenta.
- **Rode `npx oxfmt <arquivo>` antes de entregar.** O Skip reformata o que recebe
  e, sem isso, o dono do projeto vê um diff falso enorme.

Entregue o **arquivo completo**, formatado, pronto para colar. Um patch ou um
trecho não serve: ninguém aplica diff no editor do Skip.

## Trabalhe com dados de produção

O `.env` aponta para o PocketBase hospedado. Rodando local você está no **banco
de produção**, com CPF, RG e endereço de clientes reais.

- Nada de apagar registro para testar.
- Não exporte, não copie para ambiente de teste, não cole em ferramenta externa.
- Chaves de IA ficam nos secrets do Skip, lidas com `$secrets.get`. Nunca no
  código, nunca no `.env`, nunca em log.
- O expurgo de 30 dias dos logs de validação é compromisso de LGPD. Não desative.

## Verificação antes de entregar

```bash
npx tsc -b --force    # baseline em 24/08/2026: 0 erros
npx oxlint src        # baseline em 24/08/2026: 18 avisos
npm run build         # precisa passar
npx oxfmt <arquivos>  # obrigatório antes de entregar
```

Confira a baseline **antes** de mexer e não introduza item novo. `npx tsc
--noEmit` na raiz retorna 0 de forma enganosa; use `tsc -b`.

## Mexendo em `src/pages/Signup.tsx`

É a página de abertura, ~1.050 linhas, e tem armadilhas próprias:

- **Três imagens WebP em base64** dentro do `DESIGN_HTML`. É por isso que o
  arquivo tem ~200 KB. Nunca recorte, e confira os hashes depois de editar:

  ```bash
  python3 -c "
  import re,hashlib
  b=open('src/pages/Signup.tsx',encoding='utf-8').read()
  print([hashlib.sha256(x.encode()).hexdigest()[:10] for x in re.findall(r'data:image/webp;base64,[A-Za-z0-9+/=]+',b)])"
  # esperado: ['40b6f0b3af', '40b6f0b3af', '582241ca47']
  ```

- **Revisão de código não pega regressão de arte.** Renderize o `DESIGN_HTML` em
  Chromium (`/opt/pw-browsers/chromium`) a 1440, 820 e 390 px e confira três
  coisas: nenhuma seção presa em `opacity: 0`, nenhuma rolagem horizontal, e as
  imagens carregando. Já houve regressão que passou pela leitura do diff e só
  apareceu na tela.
- O reveal por scroll aplica `opacity: 0` **pelo JavaScript**, não pelo HTML, e
  tem timeout de segurança. Se você mexer nisso, mantenha a propriedade: com o
  script quebrado, a página aparece inteira em vez de sumir.

## Escrita (produto em português do Brasil)

- **Nada de travessão (— ou –) em texto visível ao usuário.** Use dois-pontos,
  vírgula ou ponto. Vale para rótulos, mensagens, e-mails e copy da landing; não
  vale para o corpo dos contratos gerados, onde a formatação jurídica é
  intencional.
- Linguagem para corretor, não para desenvolvedor: "o dono autoriza você a vender
  o imóvel", não "outorga de autorização de venda".
- O público é desconfiado por ofício. Não escreva garantia que não se sustenta:
  "nenhum outro corretor tem acesso" é verdade e verificável nas regras;
  "ninguém vê, nem nós" não é, porque administração de banco tem acesso.

## Segurança: dois padrões que já custaram bug

- **`$app.findRecordsByFilter` ignora as API rules.** Isolamento tem de estar no
  **filtro da consulta**, incluindo os fallbacks. Mudar a regra da coleção não
  filtra nada aqui.
- **Hooks de modelo (`onRecordCreate`) disparam em escrita programática**, onde o
  `httpContext` é nulo. Para ler o usuário autenticado use
  `onRecordCreateRequest` / `onRecordUpdateRequest` com `e.auth`, que é o padrão
  do projeto.

Campo carimbado pelo servidor só fica provado olhando o **registro criado no
banco**, não a intenção do código.
