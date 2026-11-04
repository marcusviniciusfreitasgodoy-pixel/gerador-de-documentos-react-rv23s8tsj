# Landing SONIA

Página de vendas da SONIA (Sistema Operacional de Negócios com Inteligência Artificial),
da Prime Circle, para empresas de qualquer segmento. A versão para o mercado imobiliário
será uma página separada.

Esta pasta **não faz parte do app de documentos** (o que roda no Skip). É um site estático
independente: pode ser publicado em qualquer hospedagem (Vercel, Netlify, Hostinger,
Cloudflare Pages) arrastando a pasta inteira.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | A página. Não precisa mexer nela para trocar texto ou preço. |
| `conteudo.json` | **Todo o conteúdo**: textos, preços, planos, agentes, currículos, FAQ, cores, links. |
| `editor.html` | Editor visual do `conteudo.json`, com prévia ao vivo. |
| `assets/agentes/` | Retratos dos agentes (o primeiro da lista é a orquestradora). |
| `assets/og-sonia.jpg` | Imagem que aparece ao compartilhar o link (1200x630). |

## Como editar

1. Abra `https://SEU-DOMINIO/editor.html` (ou rode localmente, veja abaixo).
2. Escolha a seção no menu da esquerda e edite. A prévia da direita muda na hora.
3. O rascunho fica salvo **só no seu navegador**. Nada vai ao ar sozinho.
4. Clique em **Baixar conteudo.json** e substitua o arquivo na hospedagem. Pronto.

O quadro vermelho "Antes de publicar" lista o que ainda falta configurar.

Também dá para editar o `conteudo.json` à mão. Campos que começam com `_` são só avisos.
`"visivel": false` esconde a seção ou o agente sem apagar o conteúdo.

## Rodar localmente

O navegador bloqueia a leitura do `conteudo.json` quando a página é aberta com duplo clique.
Use um servidor simples dentro desta pasta:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000 (página) e http://localhost:8000/editor.html (editor).

## O que configurar antes de publicar

- **Formulário:** preencha `contato.whatsapp` (DDI + DDD + número, só dígitos). Sem ele o
  formulário avisa que não está configurado. Se preferir receber em CRM ou planilha, preencha
  `contato.endpoint` com a URL do webhook (Formspree, Make, n8n); nesse caso ele é usado no lugar
  do WhatsApp.
- **Links de pagamento:** os botões "Assinar agora" levam ao formulário (`#contato`). Troque o
  `link` de cada plano pelo checkout real.
- **Área do cliente:** o botão do topo aponta para `https://agentes.primecircle.app.br/`.
- **"Por que a Prime Circle":** só deixe o que a Prime Circle entrega de fato.

## Seções desligadas de propósito

| Seção | Por quê | Para ligar |
|---|---|---|
| Números | São números da plataforma (Avalanche), não da Prime Circle | Autorização por escrito, mantendo a atribuição "a plataforma" |
| Depoimentos | Ainda não há depoimentos de clientes Prime Circle | Clientes reais, com autorização |
| Agência | Revenda pelos seus clientes depende do seu contrato | Confirmar sub-revenda com a Avalanche |

## Regras de texto

- Nada de travessão (— ou –) em texto visível. Use dois-pontos, vírgula ou ponto. O editor avisa.
- Não prometa resultado garantido. O aviso do rodapé existe por isso.

## Sobre o editor em produção

O `editor.html` não grava nada no servidor e não tem senha: ele só edita um rascunho no
navegador de quem abre e gera um arquivo para download. Publicar continua exigindo acesso à
hospedagem. Se preferir que ele não fique público, não suba o `editor.html` e use-o localmente.

## Publicação (Netlify)

- **Site:** `sonia-primecircle` na sua conta Netlify (time `68925567d24a4aa2429b2c24`).
- **Endereço provisório:** https://sonia-primecircle.netlify.app
- **Painel:** https://app.netlify.com/projects/sonia-primecircle
- Publicado em 31/10/2026 a partir desta pasta, **sem** os documentos internos (`LEIA-ME.md`,
  `BRIEF-*`, `PROMPT-*`) e com o `conteudo.json` **sem os campos que começam com `_`**, que
  são anotações internas (mencionam o fornecedor da plataforma).

### Como publicar uma alteração de texto ou preço

1. Edite em `https://sonia-primecircle.netlify.app/editor.html` e clique em **Baixar conteudo.json**.
2. No painel da Netlify, aba **Deploys**, arraste uma pasta com `index.html`, `editor.html`,
   `politica-de-privacidade.html`, `netlify.toml`, a pasta `assets/` e o `conteudo.json` novo.

Ou mande o `conteudo.json` novo para quem mantém o site publicar.

### Domínio

`agentes.primecircle.app.br` **já está em uso** pela plataforma dos agentes (área do cliente e
checkout). Apontar esse domínio para a landing derruba o acesso dos clientes. Use outro
subdomínio (por exemplo `sonia.primecircle.app.br`) ou combine com o fornecedor antes.

**Decisão de 04/11/2026:** a landing vai para `agentes.primecircle.app.br`, depois que a plataforma
ganhar outro endereço. O passo a passo está em `pendencias/MUDAR-LANDING-PARA-AGENTES.md`. O endereço
oficial da página fica num campo só, `seo.endereco` do `conteudo.json`: ele vai para o canonical e para a
imagem de compartilhamento, e o `.htaccess` do pacote redireciona qualquer outro nome para ele.

## Visual do Claude Design (desde 01/11/2026)

- `index.html` é o export do Claude Design **adaptado** por `ferramentas/adaptar-design.py`:
  1. tira a cópia do `conteudo.json` que vem embutida no export, para a página ler o
     `conteudo.json` do servidor (é isso que mantém o editor funcionando);
  2. coloca título, descrição e imagem de compartilhamento no `<head>`;
  3. liga a prévia ao vivo do editor (`?previa=1` lê o rascunho do editor);
  4. reforça a validação do formulário (nome, e-mail e WhatsApp com DDD).
- O export original está em `design-original/`, e o projeto-fonte do Claude Design em
  `design-original/projeto/`.
- `index-classico.html` é a versão anterior, sem o visual novo. Fica como reserva e não é
  publicada.
- As imagens dos agentes vêm embutidas no `index.html`. Trocar uma imagem que já existe exige
  um export novo do Claude Design. Agente novo com imagem nova funciona pelo `conteudo.json`.

### Para publicar um export novo do Claude Design

```bash
python3 ferramentas/adaptar-design.py "design-original/<export>.html" index.html conteudo.json
```

Depois disso, confira se o `conteudo.json` desta pasta é o que você quer no ar, porque é ele que vale, e não a cópia embutida.
