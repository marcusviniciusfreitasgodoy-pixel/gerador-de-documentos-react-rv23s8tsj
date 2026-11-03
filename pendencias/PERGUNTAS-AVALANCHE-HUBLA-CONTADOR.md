# Pendências antes de vender a SONIA

Atualizado em 01/11/2026. Cada bloco está pronto para copiar e colar no WhatsApp ou no e-mail
de quem responde. ⚠️ marca o que **trava a venda** até ter resposta. Peça as respostas **por
escrito**: em caso de disputa por reembolso, "eles me disseram" não vale.

## O que já está resolvido (não precisa perguntar de novo)

| Assunto | Resposta | O que foi feito |
|---|---|---|
| Repasse | 30% do valor vendido para a Avalanche | Contas no relatório de preços |
| Conexão do Claude | Por assinatura (OAuth) | Claude retirado dos planos na página |
| Custo da IA | Pago pelo cliente, plano mínimo de US$ 20 | Aviso nos planos e no FAQ |
| Comunidade de estudos e grupo avançado | Não valem para os seus clientes | Retirados dos planos |
| Renomear planos no checkout e tirar "Comunidade Avalanche" | Dá para fazer | **Falta fazer** (conferido em 01/11: ainda aparece) |
| Checkout | **Asaas, pelo checkout da plataforma** (links `agentes.primecircle.app.br/assinar/...`). Hubla fora. | Falta ajustar os preços no painel |
| Como a Avalanche recebe os 30% | Divisão automática do Asaas, na sua conta Asaas (carteira final 33c4) | Nada a fazer |
| Quem recebe o dinheiro | A sua empresa, na sua conta Asaas | Nada a fazer |
| Garantia | 30 dias, em todos os planos | Na página e no FAQ |
| CNPJ | 58.409.058/0001-73, ativo | No rodapé e na política |
| Preço de revenda | Livre, desde que não fique abaixo do preço da Avalanche (R$ 1.497, 2.497 e 9.997) | Preços da SONIA acima do piso. **Peça por escrito** |
| Uso de nomes e conteúdos | Pode usar tudo da Avalanche (nomes, textos, conteúdos) em nome da Prime Circle · SONIA | Mantidos na página. **Peça por escrito**, incluindo imagens e números da plataforma |
| Alterar o preço dos planos no painel | A Avalanche vai liberar a alteração | **Aguardando a liberação** |
| Manual do cliente | O cliente vê o manual de cada tela no próprio painel; o Manual do Dono é só do revendedor | Página e Calendly ajustados |

---

## Lembretes do dono (anotados em 02/11/2026)

O que ficou com você depois da revisão da página. Risque conforme fizer.

- [ ] **E-mail de acesso.** A tela Marca mostra "E-mail saindo do seu domínio: ESPERANDO". Configure o
      DNS do Resend (Sua marca → Como configurar o Resend) e confirme numa compra de teste que o
      e-mail chega. É o primeiro passo prometido em "Depois que você paga".
- [ ] **Botão "Área do cliente".** Abra https://agentes.primecircle.app.br/ deslogado. Se mostrar a
      página de vendas com R$ 1.497, me avise: tiro o botão do topo ou aponto para a tela de login.
- [ ] **Benefícios dos planos no painel** (Sua marca → Marca, hoje vazios). Cole os textos abaixo.
- [ ] **Reunião com a Avalanche:** a pauta logo abaixo, na ordem.
- [ ] **Pixel e analytics** antes de anunciar. Quando decidir, eu coloco, com aviso de cookies e
      política atualizada.
- [ ] **Instalação do WhatsApp (Evolution API) como serviço pago da Prime Circle.** Defina se vai
      oferecer e por quanto.
- [ ] **Quem envia o link do onboarding** a cada venda (você à mão ou o e-mail da plataforma).
- [x] **Roteiro do onboarding de 60 min:** pronto em `operacao/ROTEIRO-ONBOARDING-SONIA.md`. Falta ensaiar com a sua conta.
- [ ] **Calendly:** marcar "SONIA: onboarding do cliente" como secreto e separar a agenda de
      horários da SONIA da agenda da Godoy Prime.
- [ ] **Reescrever os currículos dos agentes** (recomendação comercial: as frases idênticas levam
      o comprador à oferta de origem).
- [ ] **5 primeiros clientes com condição especial em troca de depoimento.**
- [ ] **Agente de atendimento no WhatsApp (21) 99901-2520 e no e-mail funcionando antes da primeira
      venda.** A página já promete resposta a qualquer hora em todos os planos.
- [x] **Atendimento humano do Magnata:** em dias úteis, das 9h às 18h (definido em 02/11/2026).
- [x] **Página na HostGator:** no ar em https://sonia.primecircle.app.br desde 02/11/2026, com HTTPS forçado pelo
      `.htaccess` e sem o selo da Netlify.
- [ ] **Pauta da Avalanche no site:** planilha "SONIA · Respostas da Avalanche" e script (versão 2, acesso
      Qualquer pessoa) prontos em 03/11. Falta subir a pasta `pauta-avalanche/`, fazer o teste real do item 2.10
      (uma linha só, "2.10" e não 2,1) e então mandar `https://sonia.primecircle.app.br/pauta-avalanche/` no WhatsApp.
- [ ] **Renovação do certificado:** o certificado vence em 02/12/2026. Confira no cPanel (Status SSL/TLS) que o AutoSSL
      está ligado para `sonia.primecircle.app.br`.
- [x] **Planilha de leads:** instalada e testada em 02/11/2026 (aba "Leads"). Página gravando desde 18:49 de 02/11. Script na
      versão 2 (WhatsApp num formato só) e acionador mensal `apagarAntigos` ligados.
- [ ] **Apagar as linhas de teste 2, 3 e 4** da aba "Leads".
- [ ] **Enviar um teste pelo celular** (consentimento, vídeo no Safari, WhatsApp abrindo no aparelho) e apagar a linha.
- [ ] **Apagar o `editor.html` do servidor** (Gerenciador de Arquivos). O pacote novo já não o traz; o editor roda no
      seu computador.
- [ ] **Testar no celular**, inclusive no iPhone (Safari).

### Benefícios para colar no painel (até 120 caracteres cada)

| Plano | Texto | Caracteres |
|---|---|---|
| Starter | Sônia e mais 4: Juliana, Paulo, Jonathan e o clone do dono. 5 rotinas, onboarding e suporte por WhatsApp e e-mail. | 114 |
| Elite | 16 agentes: os do Starter, mais projetos, vídeos virais, CRM, tráfego e squad de vendas. 20 rotinas e suporte. | 110 |
| Magnata | A Sônia e os 21, com financeiro, fiscal, jurídico e RH. 50 rotinas, 4 mentorias e suporte humano em dias úteis. | 111 |

## 0. Pauta da reunião com o time da Avalanche

> **Página de respostas para a Avalanche** (versão de 03/11/2026, a partir do .docx revisado pelo dono):
> https://claude.ai/artifact/Sy6rV96CvmkuCtTvaJCU5h · fonte em `pendencias/pauta-avalanche.html`. As respostas ficam na
> coleção `respostas` do banco da página.

> **Versão completa para levar à reunião** (26 entendimentos para confirmar e 24 perguntas): documento
> "SONIA: pauta e entendimentos para confirmar com a Avalanche", https://claude.ai/artifact/Kd8VqfM4KTLnfyguEoxrbF

Leve nesta ordem. As três primeiras travam a venda.

1. ⚠️ **Prazo para liberar a alteração do preço dos planos no painel.** Até lá os links cobram
   R$ 1.497, 2.497 e 9.997.
2. ⚠️ **O nome de vocês aparece para o meu cliente.** O bot do Telegram é @naia_os_bot; o
   diagnóstico chama a agente de "Sofia"; a tela Assinatura cita calls "com equipe Avalanche";
   o Starter é descrito como "pacote da imersão". Como deixo tudo com a marca SONIA (bot com o
   meu nome, agente "Sônia" em todas as telas, sem "Avalanche" e sem "imersão")? Em quanto tempo?
3. ⚠️ **Termos de uso:** hoje são da PROPULSOR DE VENDAS LTDA, "titular e operadora da plataforma
   Prime Circle Agentes". Preciso da Propulsor como operadora licenciante e da marca Prime
   Circle como minha.
4. Confirmar por escrito: preço livre acima do piso e uso de nomes, textos, imagens e números.
5. Estorno: os 30% de vocês voltam junto no reembolso da garantia?
6. WhatsApp pela Evolution API: quem instala, e quem responde se o número for bloqueado.
7. Claude e ChatGPT por OAuth: está dentro dos termos da Anthropic e da OpenAI?
8. Comissões: base do afiliado (mensal ou anual) e "50% da comissão" ou "50% da venda".
9. Meus clientes virando agência: posso desligar para a minha carteira?

## 1. Para a Avalanche

> Olá! Estou finalizando a página de vendas da minha revenda white label e preciso fechar
> alguns pontos antes de começar a vender. Podem me responder por escrito?
>
> **Pagamento e repasse**
> 1. ⚠️ Vou vender pelo checkout de vocês, na minha conta Asaas. Como eu altero o preço e o nome
>    dos meus 3 planos? Hoje os links cobram R$ 1.497, R$ 2.497 e R$ 9.997, e preciso de R$ 4.997,
>    R$ 7.997 e R$ 15.997, com os nomes "SONIA Starter", "SONIA Elite" e "SONIA Magnata", e sem a
>    "Comunidade Avalanche" no Elite.
> 2. ⚠️ Se o cliente pedir reembolso (na garantia de 30 dias ou nos 7 dias de arrependimento
>    do Código de Defesa do Consumidor), os 30% de vocês são estornados junto, ou o estorno
>    sai inteiro da minha parte?
> 3. Os 30% incidem sobre o valor com os juros do cartão ou sem?
> 4. O plano anual renova sozinho no fim dos 12 meses? Com qual preço? O cliente pode
>    cancelar antes, e com qual regra?
> 5. O contrato de revenda tem preço mínimo ou máximo, exclusividade ou território?
>
> **Página atual e domínio**
> 6. ⚠️ A página que roda hoje em https://agentes.primecircle.app.br/ ainda mostra os preços
>    de R$ 1.497, R$ 2.497 e R$ 9.997 e os links antigos. Dá para tirar essa página do ar, ou
>    trocar por um redirecionamento para a minha landing nova, mantendo o acesso dos clientes
>    à área do cliente?
> 7. Meus clientes entram por https://agentes.primecircle.app.br/? Posso usar outro domínio
>    meu para a área do cliente?
>
> **Produto**
> 8. ⚠️ Quais são os 5 agentes do Starter e os 16 do Elite? O cliente escolhe ou é fixo?
> 9. ⚠️ O Claude é conectado pela assinatura do cliente (OAuth). Desde fevereiro de 2026, os
>    termos de consumidor da Anthropic proíbem usar assinatura Claude Pro ou Max em produtos
>    de terceiros, e o bloqueio começou a ser aplicado em abril. Vocês pretendem passar para
>    chave de API? Se a conta Claude de um cliente meu for bloqueada, o que acontece com ele?
> 10. A conexão do ChatGPT também é pela assinatura? Ela é estável? Um plano de US$ 20 dá
>     conta de 16 ou 22 agentes rodando rotinas, ou o cliente vai bater no limite?
> 11. Existe algum outro custo para o cliente além da assinatura de IA: API oficial do
>     WhatsApp, número de telefone, armazenamento, limite de mensagens ou de rotinas?
>
> **Suporte, dados e marca**
> 12. Quando algo falha na plataforma, quem atende o meu cliente: vocês ou eu? Em quanto
>     tempo?
> 13. Pela LGPD, quem é o controlador e quem é o operador dos dados dos meus clientes dentro da
>     plataforma? Vocês têm um contrato de tratamento de dados para assinarmos?
> 14. Posso usar na minha página, por escrito, as imagens, os nomes e os currículos dos
>     agentes? Posso alterar as imagens (troquei o logo no moletom da Juliana)?
> 15. Posso citar os números da plataforma (+7.000 empresas, +253.000 tarefas) como números
>     da plataforma? Preciso dessa autorização por escrito.
> 16. Meus clientes podem revender para os clientes deles (sub-revenda)?
> 17. Se vocês encerrarem ou mudarem a plataforma, o que acontece com os meus clientes que já
>     pagaram o ano?
> 18. Vocês podem me mandar o contrato de revenda com esses pontos?

---

### 1b. Perguntas novas depois da auditoria do painel (02/11/2026)

> 19. ~~Alterar o preço dos planos no painel~~ (respondido: a Avalanche vai liberar; falta o prazo).
> 20. ⚠️ Os termos de uso que o meu cliente aceita são da PROPULSOR DE VENDAS LTDA, descrita como
>     "titular e operadora da plataforma Prime Circle Agentes". Preciso que os termos tragam a
>     Propulsor como operadora licenciante e deixem claro que a marca Prime Circle é minha.
> 21. ⚠️ O bot do Telegram é @naia_os_bot. O manual de parceiro diz que seria da minha marca. Como
>     coloco um bot com o meu nome?
> 22. ⚠️ O painel do cliente ainda mostra "Sofia" (no diagnóstico), "equipe Avalanche" (na
>     Assinatura) e "imersão" (no Starter). Quando isso sai?
> 23. O atendimento no WhatsApp usa a Evolution API, não a API oficial. Vocês instalam para o
>     cliente ou é por conta dele? Quem responde se o número for bloqueado?
> 24. A comissão de afiliado diz "25% de cada pagamento mensal", mas os planos são anuais. E a
>     agência recebe "50% da comissão" ou "50% de cada venda"? Por escrito, por favor.
> 25. Os meus clientes podem virar agência por R$ 6.000 por ano e revender o mesmo produto. Posso
>     desligar isso para a minha carteira?
> 26. ⚠️ O Claude e o ChatGPT entram pela assinatura do cliente, por OAuth. Vocês confirmam por
>     escrito que isso é permitido pelos termos da Anthropic e da OpenAI?
> 27. O painel mostra "Agentes na equipe: 19 de 22" e "Rotinas 6 de 50", mas a Equipe mostra 22 e
>     só 2 rotinas. Qual número vale?

## 2. Para o suporte do Asaas (a Hubla saiu em 01/11/2026)

> Olá! Recebo cobranças na minha conta com divisão automática (split) de 30% para um parceiro.
> Preciso confirmar:
>
> 1. ⚠️ Se eu estornar uma cobrança com split, o valor da divisão do parceiro é estornado junto,
>    ou o estorno inteiro sai do meu saldo?
> 2. ⚠️ A chave de API que eu dei a uma plataforma parceira consegue fazer transferências ou
>    saques da minha conta? Como restrinjo as permissões dela (por exemplo, por IP)?
> 3. O Asaas pode emitir a nota fiscal de serviço automaticamente a cada pagamento? A nota sai
>    sobre o valor total ou só sobre a minha parte do split?
> 4. Quais são as taxas por venda no Pix e no cartão em 12x, e em quanto tempo o dinheiro fica
>    disponível?
> 5. Consigo dar desconto só para quem paga no Pix, numa cobrança que também aceita cartão?

### Teste antes de divulgar

Depois que os preços estiverem certos, faça **uma compra de teste** num dos links (no Pix,
que é estornável no mesmo dia) e confira:

1. o valor cobrado é o da landing;
2. o nome do plano é "SONIA ...";
3. a sua conta recebeu 70% e a Avalanche 30%;
4. o acesso do cliente foi liberado sozinho;
5. ao estornar, o que acontece com os 30% da Avalanche.

---

## 3. Para o seu contador

> Vou revender um software em assinatura anual, com repasse de 30% para o fornecedor
> (possivelmente descontado direto no pagamento, por split), e oferecer mentoria no plano mais
> caro. Preciso saber:
>
> 1. ⚠️ A minha nota fiscal é sobre o valor total da venda ou só sobre os meus 70%?
> 2. ⚠️ Meu CNPJ (58.409.058/0001-73) tem como atividade principal a corretagem de imóveis.
>    Preciso incluir CNAEs secundários para vender licença de software e mentoria (por exemplo
>    6203-1/00 e 8599-6/04)? Isso muda o anexo do Simples Nacional e a alíquota?
> 3. Faz diferença separar a mentoria do Magnata na nota?
> 4. Se o cliente pedir reembolso, como fica a nota (cancelamento ou devolução)?

---

## 4. Para um advogado (novo)

> Vou vender, com a minha marca, uma plataforma de agentes de IA para empresas. Entre os
> agentes há um "jurídico" (contratos, LGPD, marcas no INPI) e um "tributário" (notas,
> impostos). Preciso que você revise:
>
> 1. ⚠️ Os termos de uso e o contrato com o cliente: garantia de 30 dias, renovação, o fato de
>    a assinatura de IA ser paga pelo cliente, e limitação de responsabilidade pelo que os
>    agentes produzem.
> 2. ⚠️ Preciso de algum aviso de que o agente jurídico e o tributário não substituem advogado
>    e contador? Existe risco de exercício irregular da profissão?
> 3. A política de privacidade da página (rascunho pronto).
> 4. O anúncio de parcelas sem a palavra "juros", se eu decidir manter assim.

---

## 5. Decisões que são suas

| # | Decisão | Situação hoje | Minha recomendação |
|---|---|---|---|
| 1 | "com juros" no parcelamento | **Feito em 02/11:** total ao lado da parcela, "(total R$ 5.205,36)" | Voltar com "com juros" ou com o total, por exemplo "(total R$ 5.205,36)" |
| 2 | Seção "Por que contratar com a Prime Circle" | **Feito em 02/11:** ligada como "Depois que você paga" | Mostrar: é a resposta para "por que não compro direto da fonte" |
| 3 | Salários do tráfego pago (R$ 4.914,34) e dos SDRs (R$ 2.451,00) | Na página | Conferir a fonte antes de anunciar |
| 4 | Domínio | `sonia-primecircle.netlify.app` | Criar `sonia.primecircle.app.br` (eu passo o registro DNS) |
| 5 | Título do site no Google | **Feito em 02/11** | "SONIA · até 21 especialistas de IA na sua equipe, nenhum na folha" |
| 6 | Conversa de exemplo ("14 leads qualificados") | Na página | Manter como exemplo ou trocar por um caso real |
| 7 | Links de checkout | Vazios (botão leva ao formulário) | Ajustar preços e nomes no painel do Asaas da plataforma e me avisar: eu confiro e coloco na landing |
| 8 | Depoimentos | Seção desligada | Fechar os 5 primeiros clientes com condição especial em troca de depoimento |
