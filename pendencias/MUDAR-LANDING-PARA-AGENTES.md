# Levar a landing da SONIA para agentes.primecircle.app.br

Decisão do dono em 04/11/2026: a página de venda passa a abrir em `agentes.primecircle.app.br`.

## Como está hoje

| Endereço | O que abre | Onde mora |
|---|---|---|
| `sonia.primecircle.app.br` | a landing (página de venda) | HostGator, pasta `/home2/marcu362/sonia.primecircle.app.br` |
| `agentes.primecircle.app.br` | a plataforma dos agentes: login, painel do cliente, checkout (`/assinar/...`) | servidor do fornecedor (o DNS é um CNAME para o servidor deles) |

O DNS de `primecircle.app.br` é da HostGator (ns1168/ns1169), então o dono troca os registros pelo
**Editor de Zona** do cPanel. A troca em si é rápida. O que exige cuidado é a plataforma, porque hoje
os clientes entram por `agentes`.

## A ordem que não derruba ninguém

1. **A plataforma ganha um endereço novo antes de tudo.** Sugestão: `painel.primecircle.app.br`.
   O dono cria no Editor de Zona o registro que o fornecedor indicar (hoje `agentes` é um CNAME para
   o servidor deles, então provavelmente é o mesmo CNAME com outro nome). O fornecedor cadastra o
   endereço novo na plataforma (a marca do painel é aplicada por endereço), emite o certificado e
   confirma que login, painel e checkout abrem por ele.
2. **O fornecedor atualiza o que aponta para o endereço antigo:** links de checkout, e-mails
   automáticos, retornos de pagamento (Asaas), conexões que usam endereço de retorno (WhatsApp,
   Google e outras) e o app instalado na tela do celular dos clientes.
3. **Os clientes atuais recebem o endereço novo** do painel, com alguns dias de antecedência.
4. **Véspera da troca, no repositório** (o Claude faz). Pacote pronto, **mas ainda não sobe**:
   - `conteudo.json`, `seo.endereco` passa a `https://agentes.primecircle.app.br/`;
   - o botão "Área do cliente" (`menu`, hoje `https://agentes.primecircle.app.br/`) passa ao
     endereço novo do painel, e os links de checkout dos planos também, quando houver;
   - regenerar o `index.html` (`ferramentas/adaptar-design.py`) e montar o pacote
     (`ferramentas/montar-publicacao.py <pasta> hostgator`).

   Por que não sobe antes: com esse pacote, o `.htaccess` manda quem abre `sonia` para `agentes`.
   Enquanto `agentes` ainda for a plataforma, o visitante da landing cairia no painel.
5. **Dia da troca, no cPanel, tudo na mesma sessão:**
   1. Editor de Zona: apagar o CNAME `agentes`.
   2. Domínios, Criar um domínio: `agentes.primecircle.app.br`, **desmarcar** "compartilhar a raiz
      do documento" e apontar a raiz para `sonia.primecircle.app.br` (a mesma pasta da landing).
      Assim os dois endereços servem a mesma pasta e não existe segunda cópia do site.
   3. SSL/TLS Status: clicar em **Executar AutoSSL** e esperar o cadeado de `agentes` ficar verde.
      A regra do `.htaccess` deixa a pasta `.well-known` de fora, então o certificado sai mesmo com
      o redirecionamento ligado. Se o AutoSSL falhar, esperar a propagação do DNS (o CNAME antigo
      tinha validade de cerca de 1 hora) e rodar de novo.
   4. **Só com o cadeado verde, subir o pacote do passo 4** na pasta `sonia.primecircle.app.br` e
      extrair. Antes disso, o pacote novo mandaria quem abre `sonia` para um `agentes` ainda sem
      certificado, e o navegador mostraria alerta de site inseguro.

   **O que esperar no meio do caminho:** entre o passo 5.2 e o 5.4, quem abre `agentes` é mandado
   para `sonia`, porque o pacote antigo ainda diz que o endereço oficial é `sonia`. Não é erro: a
   landing continua aparecendo, e a troca se completa quando o pacote novo sobe.
6. **Conferir no ar:** `agentes` abre a landing com cadeado; `sonia` redireciona para `agentes`
   (301, então links já divulgados continuam valendo); o painel abre no endereço novo.

## O que já ficou pronto no código (04/11/2026)

- O endereço oficial da página mora num campo só: `seo.endereco` no `conteudo.json`.
  O `adaptar-design.py` usa esse campo no canonical, no `og:url` e no `og:image`.
- O `.htaccess` manda todo outro nome de domínio para o endereço oficial (301). O
  `montar-publicacao.py` preenche o nome a partir de `seo.endereco`. Hoje o oficial é `sonia`,
  então a regra só junta variações do próprio nome (como `www.sonia`). No dia da troca, trocar o campo já faz `sonia` levar a `agentes`.
- Simulado em 04/11: com `seo.endereco` em `agentes`, o canonical, o `og:url` e o `og:image` saem
  com `agentes` e o `.htaccess` redireciona para `agentes`. A regra foi conferida na HostGator em
  04/11, com o pacote atual: um pedido por `www.sonia.primecircle.app.br` recebe 301 para
  `https://sonia.primecircle.app.br/`.

## Riscos

- **Fazer o passo 5 antes do 1 e do 2 tira os clientes do painel e quebra o checkout.**
- **Subir o pacote do passo 4 antes de criar o domínio `agentes` manda os visitantes da landing para
  o painel.** Ele só sobe no passo 5.4, com o cadeado de `agentes` já verde.
- O app instalado na tela do celular guarda o endereço antigo. O cliente vai precisar reinstalar
  pelo endereço novo.
- A marca Prime Circle é de outra empresa (INPI). Se o domínio mudar por causa da marca, esta
  troca vai ser refeita. Vale decidir as duas coisas juntas.

## Mensagem para o fornecedor (rascunho, o dono envia)

> Oi, pessoal. Quero usar `agentes.primecircle.app.br` para a página de venda da SONIA, e para isso
> a plataforma precisa ir para outro endereço. Pensei em `painel.primecircle.app.br`.
>
> Para eu não derrubar nenhum cliente, preciso de vocês em quatro pontos:
> 1. Qual registro de DNS eu crio para o endereço novo (o `agentes` hoje é um CNAME para o servidor
>    de vocês). Vocês cadastram o endereço na plataforma, com a marca e o certificado?
> 2. Login, painel e checkout (`/assinar/...`) passam a funcionar pelo endereço novo. Os links que
>    já mandei a clientes, pelo antigo, deixam de funcionar quando eu trocar o DNS. Dá para manter
>    algum redirecionamento do lado de vocês?
> 3. O que mais está amarrado ao `agentes`: e-mails automáticos, retorno de pagamento do Asaas,
>    conexão do WhatsApp e do Google, o app instalado no celular.
> 4. Quanto tempo vocês precisam, para eu combinar o dia da troca e avisar os clientes antes.
>
> Só mexo no DNS do `agentes` depois que vocês confirmarem que o endereço novo está funcionando.
