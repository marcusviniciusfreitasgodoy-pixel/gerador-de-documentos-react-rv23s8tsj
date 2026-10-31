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
