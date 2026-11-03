# Retomar o projeto da landing SONIA

Guia para uma sessão nova continuar de onde a anterior parou (03/11/2026).

## Onde paramos (03/11/2026)

- **A página está pronta e no ar** em https://sonia.primecircle.app.br (HostGator). O formulário grava
  os leads na planilha do Google "SONIA · Leads da página" e abre o WhatsApp. Ainda **não vende**: os
  botões "Assinar agora" levam ao formulário até a Avalanche liberar a troca de preço no checkout.
- **A próxima etapa é a Avalanche responder a pauta, antes da reunião.** O dono só tem o WhatsApp deles,
  então a pauta vai no site, sem login:
  - **Página para eles:** `https://sonia.primecircle.app.br/pauta-avalanche/` (fonte
    `pendencias/pauta-avalanche-site/index.html`, zip entregue em 03/11). Cada resposta vai para a planilha
    Google **"SONIA · Respostas da Avalanche"**, aba "Respostas", uma linha por pessoa e item (atualizada se a
    pessoa responder de novo). Script: `pendencias/pauta-avalanche-site/planilha/Codigo.gs`, implantação
    versão 2 com acesso "Qualquer pessoa" (a versão 1 pedia login e não é usada).
  - **Falta (03/11):** subir a pasta `pauta-avalanche/` no cPanel e fazer o teste real do item 2.10 (na
    planilha: uma linha só, "2.10" e não 2,1, resposta nova). Só depois mandar o link no WhatsApp.
  - **Página para a reunião ao vivo** (o dono preenche): https://claude.ai/artifact/Sy6rV96CvmkuCtTvaJCU5h
    (fonte `pendencias/pauta-avalanche.html`, respostas na coleção `respostas` do banco da página, lidas com
    a ferramenta ArtifactData). As 5 perguntas da Parte 2 travam a venda.
- **Ao retomar com as respostas:** o dono cola aqui o conteúdo da planilha (ou exporta em CSV). Ler,
  resumir o que foi confirmado, corrigido e ficou sem resposta, ajustar a página da SONIA, colocar os links
  de checkout novos em `planos.itens[].botao.link` e montar o pacote da HostGator.
- Auditoria do painel (o que o produto entrega de fato): doc "Prime Circle Agentes: auditoria do painel
  Naia OS", https://claude.ai/artifact/1V43xv5uR1FMASANpBA3iH (Claude Docs).
- Roteiro de onboarding de 60 min pronto em `operacao/ROTEIRO-ONBOARDING-SONIA.md` (ensaiar antes).

> **Este trabalho não é o app de documentos.** O `CLAUDE.md` da raiz fala do app Prime Circle
> Documentos, que roda no Skip. A landing SONIA é um site estático separado, publicado na
> HostGator (antes, Netlify). As regras de escrita do `CLAUDE.md` (sem travessão, linguagem simples, nada de
> garantia que não se sustenta) valem também aqui.

## Onde está tudo

| O quê | Onde |
|---|---|
| Branch | `claude/busy-mayer-ypu8q0` (não está no `main`) |
| Site no ar | https://sonia.primecircle.app.br (HostGator, desde 02/11/2026). Reserva: https://sonia-primecircle.netlify.app |
| Painel Netlify | https://app.netlify.com/projects/sonia-primecircle (site id `47374dbb-75f2-401c-9d79-26164ceb5a87`) |
| Landing (código e conteúdo) | `landing-sonia/` (leia `landing-sonia/LEIA-ME.md`) |
| Pendências e perguntas | `pendencias/PERGUNTAS-AVALANCHE-HUBLA-CONTADOR.md` (**é o arquivo atual**) |
| Roteiro do onboarding (60 min) | `operacao/ROTEIRO-ONBOARDING-SONIA.md` |
| Análise de concorrência e preço | `analise-concorrencia/RELATORIO-PRECOS-SONIA.md` |
| Material de referência (Naia OS) | `referencia-landing-agentes/` |
| C-Level Squad como opcional (licença, origem, melhorias) | `pendencias/ANALISE-C-LEVEL-SQUAD.md` |
| Conselho Executivo (adicional pago que substitui o C-Level Squad): agentes, skills, ficha de venda, pacote para a Avalanche | `produtos/conselho-executivo/LEIA-ME.md` |

## O negócio, em 10 linhas

- **SONIA** (Sistema Operacional de Negócios com Inteligência Artificial), da Prime Circle:
  revenda white label autorizada de uma plataforma de agentes de IA da Avalanche (a original se
  chama Naia OS). A Sônia é a orquestradora de até 21 especialistas.
- Público: donos de empresa de **qualquer segmento**. Uma página para o mercado imobiliário
  virá depois.
- Planos anuais: Starter R$ 4.997 (5 agentes), Elite R$ 7.997 (16), Magnata R$ 15.997 (22, com
  4 mentorias de 1 hora e suporte humano). Todos têm uma sessão de onboarding
  e suporte por WhatsApp e e-mail com agente de atendimento a qualquer hora; atendimento humano
  em dias úteis, das 9h às 18h só no Magnata (sem sessões semanais ao vivo). Garantia de 30 dias em todos.
- A Avalanche fica com 30% de cada venda, pela **divisão automática do Asaas**. O pagamento é
  pelo **checkout da plataforma, na conta Asaas do dono**. A Hubla foi descartada.
- A IA é paga pelo cliente. Starter: só ChatGPT. Elite e Magnata: ChatGPT ou outros modelos, à escolha
  do cliente (a confirmar com a Avalanche). A página não cita o Claude: a plataforma o conecta pela
  assinatura (OAuth), o que os termos da Anthropic proíbem em produtos de terceiros (pergunta 2.5).
- Revenda: preço livre acima do piso da Avalanche (R$ 1.497 / 2.497 / 9.997) e uso de nomes e conteúdos
  da plataforma autorizados pelo dono (pedir por escrito). A Avalanche vai liberar a troca de preço.
- Empresa: Marcus V F Godoy Assessoria Imobiliária (a página mostra só o CNPJ; a política de privacidade
  mantém o nome), CNPJ 58.409.058/0001-73,
  atendimento@primecircle.app.br, WhatsApp (21) 99901-2520 (número exclusivo da SONIA, não é o pessoal do
  dono: recebe os contatos do formulário e o suporte de todos os planos).

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
  Tabela de economia no celular só com função e custo por mês. Publicado e conferido no ar.
- A Netlify (plano gratuito) injetava um selo "Powered by Netlify": resolvido com a mudança para a HostGator.
- O circunflexo alto em "Sônia" e "Você" nos títulos é o desenho da fonte Cormorant, não defeito.
- Reposicionamento de 02/11/2026, depois de comparar com NeoCRM e Simbiose: seção nova "Por onde começar"
  (3 gargalos, `gargalos` no `conteudo.json`, injetada pelo `adaptar-design.py`), 6 vendedores dentro do
  cartão do Davi (15 cartões, 21 especialistas), economia com a conta realista de 3 funções antes do total,
  "Depois que você paga" (seção `diferenciais`), total do parcelamento, FAQ do WhatsApp, título no Google
  e botão do topo "Ver a Sônia funcionando". O editor ainda não tem campo para `gargalos`: edite à mão.
- Calendly (conta marcus-godoyprime, a mesma da Godoy Prime): "SONIA: ver a Sônia funcionando" (30 min,
  ligado ao botão do topo) e "SONIA: onboarding do cliente" (60 min, link só por e-mail ao cliente pagante).
- Pedidos à Sônia só pelo Telegram e pelo painel. No WhatsApp funcionam o atendimento e as respostas dos agentes.
- Auditoria do painel (02/11/2026, doc "Prime Circle Agentes: auditoria do painel Naia OS" no Claude Docs): agentes
  fixos por plano, WhatsApp por Evolution API (não oficial) com chaves de API pagas, termos da Propulsor de
  Vendas, bot @naia_os_bot, sem campo de preço no painel. A página foi corrigida; perguntas 19 a 27 no arquivo
  de pendências. `montar-publicacao.py` barra "anthropic" de propósito: não cite a marca na página.
- Os botões "Assinar agora" levam ao formulário do WhatsApp, porque os links de checkout
  ainda cobram o preço antigo (R$ 1.497 / 2.497 / 9.997) e mostram "Comunidade Avalanche".

> **Lembretes do dono:** a lista do que ficou com ele está no topo de
> `pendencias/PERGUNTAS-AVALANCHE-HUBLA-CONTADOR.md`, seção "Lembretes do dono".

## Próximos passos (em ordem)

1. **Reunião com a Avalanche** (página de respostas acima). Depois, ler as respostas e ajustar a página.
2. **Links de checkout** com preço e nome novos: conferir os 3 links e colar em `planos.itens[].botao.link`.
3. **Agente de atendimento** no WhatsApp (21) 99901-2520 e no e-mail funcionando: a página promete
   resposta a qualquer hora.
4. **Compra de teste no Pix com estorno**, para provar a garantia de 30 dias (também dita no vídeo).
5. Contador (nota fiscal e CNAE) e advogado (termos, Decreto 7.962 sobre razão social no rodapé, avisos
   do agente jurídico e tributário): ver o arquivo de pendências.
6. Lembretes do dono (certificado vence em 02/12/2026, teste no celular, linhas de teste da planilha):
   seção "Lembretes do dono" do arquivo de pendências.

## Como publicar uma mudança

**HostGator (endereço oficial, `sonia.primecircle.app.br`, pasta `/home2/marcu362/sonia.primecircle.app.br`):**
`python3 ferramentas/montar-publicacao.py /tmp/sonia-hostgator hostgator`, compacte o conteúdo da pasta
(com o `.htaccess`) e o dono sobe pelo Gerenciador de Arquivos do cPanel, extraindo por cima.
Não existe envio automático para a HostGator a partir desta sessão.
O pacote da HostGator não leva o `editor.html` (ele roda no computador de quem edita). O formulário grava
numa planilha do Google (`contato.endpoint`, ver `ferramentas/planilha-leads/`) e abre o WhatsApp.

**Netlify (reserva):**

```bash
cd landing-sonia
# 1. se mudou o layout: python3 ferramentas/adaptar-design.py "design-original/SONIA - Prime Circle (Claude Design).html" index.html conteudo.json
# 2. monta a pasta pública (tira as anotações internas e confere menções ao fornecedor)
python3 ferramentas/montar-publicacao.py /tmp/sonia-dist
```

Para testar qualquer pacote antes de subir:

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
