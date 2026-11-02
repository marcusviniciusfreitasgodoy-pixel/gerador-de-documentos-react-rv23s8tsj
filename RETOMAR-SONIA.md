# Retomar o projeto da landing SONIA

Guia para uma sessão nova continuar de onde a anterior parou (02/11/2026).

> **Este trabalho não é o app de documentos.** O `CLAUDE.md` da raiz fala do app Prime Circle
> Documentos, que roda no Skip. A landing SONIA é um site estático separado, publicado na
> Netlify. As regras de escrita do `CLAUDE.md` (sem travessão, linguagem simples, nada de
> garantia que não se sustenta) valem também aqui.

## Onde está tudo

| O quê | Onde |
|---|---|
| Branch | `claude/busy-mayer-ypu8q0` (não está no `main`) |
| Site no ar | https://sonia-primecircle.netlify.app |
| Painel Netlify | https://app.netlify.com/projects/sonia-primecircle (site id `47374dbb-75f2-401c-9d79-26164ceb5a87`) |
| Landing (código e conteúdo) | `landing-sonia/` (leia `landing-sonia/LEIA-ME.md`) |
| Pendências e perguntas | `pendencias/PERGUNTAS-AVALANCHE-HUBLA-CONTADOR.md` (**é o arquivo atual**) |
| Análise de concorrência e preço | `analise-concorrencia/RELATORIO-PRECOS-SONIA.md` |
| Material de referência (Naia OS) | `referencia-landing-agentes/` |

## O negócio, em 10 linhas

- **SONIA** (Sistema Operacional de Negócios com Inteligência Artificial), da Prime Circle:
  revenda white label autorizada de uma plataforma de agentes de IA da Avalanche (a original se
  chama Naia OS). A Sônia é a orquestradora de até 21 especialistas.
- Público: donos de empresa de **qualquer segmento**. Uma página para o mercado imobiliário
  virá depois.
- Planos anuais: Starter R$ 4.997 (5 agentes), Elite R$ 7.997 (16), Magnata R$ 15.997 (22, com
  4 mentorias de 1 hora e suporte humano). Starter e Elite têm sessão coletiva semanal de
  implantação. Garantia de 30 dias em todos.
- A Avalanche fica com 30% de cada venda, pela **divisão automática do Asaas**. O pagamento é
  pelo **checkout da plataforma, na conta Asaas do dono**. A Hubla foi descartada.
- A assinatura da IA (ChatGPT, US$ 20 ou mais) é paga pelo cliente. **O Claude foi retirado
  dos planos**: a plataforma o conecta pela assinatura (OAuth), o que os termos da Anthropic
  proíbem em produtos de terceiros.
- Empresa: Marcus V F Godoy Assessoria Imobiliária, CNPJ 58.409.058/0001-73,
  atendimento@primecircle.app.br, WhatsApp (21) 99901-2520.

## Estado da página

- Visual do Claude Design, adaptado por `landing-sonia/ferramentas/adaptar-design.py`
  (menu hambúrguer, botões de largura total no celular, vídeo da Sônia com som opcional e
  legendas, habilidades em duas colunas). **Nunca edite `index.html` à mão**: mude o script e
  rode de novo.
- Todo texto, preço e plano vem de `landing-sonia/conteudo.json`. Campos que começam com `_`
  são anotações internas e **não podem ir ao ar**.
- Ajustes de 02/11/2026, depois de comparar com uma cópia da página antiga (preços velhos, Claude nos
  planos, links vazios: descartada): seção "Por trás do nome" desligada (`sigla.visivel`), selo
  "Mais escolhido" retirado (não há clientes ainda), idiomas do painel retirados (sem confirmação
  por escrito), Magnata como "A Sônia e os 21 especialistas", 6 especialistas no celular com botão
  "Ver os 21" e retrato por `srcset` (acabou o 404 de `{{ a.imagem }}`). Celular: 24.700 px para 15.500 px.
- Os botões "Assinar agora" levam ao formulário do WhatsApp, porque os links de checkout
  ainda cobram o preço antigo (R$ 1.497 / 2.497 / 9.997) e mostram "Comunidade Avalanche".

## Próximos passos (em ordem)

1. **Links de pagamento.** O dono ajusta preço e nome dos 3 planos no painel da plataforma.
   Depois: conferir os 3 links (`agentes.primecircle.app.br/assinar/...`) com Playwright e
   colar cada um em `planos.itens[].botao.link` do `conteudo.json`.
2. **Compra de teste no Pix com estorno.** Ela confirma se o estorno devolve os 30% da
   Avalanche, o que decide se a garantia de 30 dias se sustenta. A garantia está também na fala
   do vídeo.
3. **Domínio** `sonia.primecircle.app.br`, configurado na Netlify. O dono cria o registro DNS.
   Não use `agentes.primecircle.app.br`: é a área do cliente da plataforma.
4. Pendências com Avalanche, Asaas, contador e advogado: ver o arquivo de pendências.
5. Decisões em aberto do dono: "com juros" no parcelamento, mostrar a seção "Por que a Prime
   Circle", conferir a fonte dos salários do tráfego e dos SDRs, título do site no Google.

## Como publicar uma mudança

```bash
cd landing-sonia
# 1. se mudou o layout: python3 ferramentas/adaptar-design.py "design-original/SONIA - Prime Circle (Claude Design).html" index.html conteudo.json
# 2. monta a pasta pública (tira as anotações internas e confere menções ao fornecedor)
python3 ferramentas/montar-publicacao.py /tmp/sonia-dist
```

3. Teste a pasta com `python3 -m http.server` e Playwright, a 390, 820 e 1440 px. Confira que
   não há rolagem horizontal, que as imagens carregam, que o vídeo começa mudo e que a legenda
   acompanha a fala.
4. Publique pela ferramenta da Netlify (`deploy-site` com o site id acima). Ela devolve um
   comando `npx @netlify/mcp ...`: rode-o **dentro de `/tmp/sonia-dist`**.
5. Teste de novo no endereço publicado, faça o commit e o push.

Outras ferramentas:
- Imagem de compartilhamento: `node ferramentas/og/gerar-og.js` (o texto está em `ferramentas/og/og.html`).
- Legendas: `ferramentas/legendas/` (os tempos já medidos estão em `tempos-das-palavras.json`).
  Se o vídeo mudar, meça de novo com `reconhecer-fala.py` (faster-whisper).

## Regras que já custaram retrabalho

- Nada de travessão (— ou –) em texto visível.
- Nada que entregue o fornecedor: Avalanche, Naia, Denderson. O script de montagem barra isso.
- Não prometa o que o checkout não entrega: preço, nome e itens da página têm de bater com o
  link de pagamento.
- Exports do Claude Design trazem uma cópia própria do `conteudo.json`. O script de adaptação
  a remove. Se pular esse passo, o editor para de funcionar e voltam os dados antigos.
