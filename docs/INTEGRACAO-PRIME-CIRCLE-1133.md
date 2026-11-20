# Integração Prime Circle + Docs: pedido 1133 (cartão #1133)

Este documento registra o que foi investigado, o desenho e o que mudou nos dois lados para três itens do pedido 1133 que
dependem do Docs. Ele mora no espelho do Docs (este repositório) e não é colado no Skip.

Resumo em uma linha por item:

- **A. Cota única:** feito nos dois lados. A validação de minuta do Docs desconta 1 da cota `document_analysis` do plano do
  Prime Circle (sem assinatura, das 5 análises do passe), com reserva, confirmação, estorno e idempotência.
- **B. Limite do Plano CRECI no Docs:** não precisa mudar nada. O CRECI usa o plano `corretor` do Docs, que já tem
  10 operações por mês. Nenhum plano `creci` foi criado.
- **C. Passe avulso:** feito no que o servidor controla (carimbo com validade exata e imóvel, dossiê só do imóvel, validação
  fora das 5 do passe sai da trava local). Uma parte depende de decisão do cliente: o `.docx` é montado no navegador, e travar
  o download por imóvel exige alterar nove formulários. Está em "Decisões que faltam".

---

## 1. Como o Docs funciona hoje (o que importa para os três itens)

- O `.docx` é montado **no navegador**, a partir do formulário, e baixado antes de qualquer coisa chegar ao servidor
  (`negocioAutomatico.ts`: o dossiê só é criado depois que o documento saiu). O servidor nunca vê o arquivo gerado nem o
  endereço digitado no formulário, e o Docs **não guarda os arquivos gerados**. O que existe no servidor é o dossiê
  (`negocios`: partes e imóvel), o log de validações (30 dias, LGPD) e os contadores em `users`.
- O que o servidor controla de verdade: a criação e a edição do dossiê, a rota de validação de minuta (custo de IA) e a
  validade do plano. A tela de geração já fica bloqueada quando o plano vence (`Layout.tsx`, `acessoBloqueado`).
- A IA do Docs na validação de minuta é o `$ai.chat({ model: 'fast' })` do Skip. **Não dá para escolher o modelo por plano**
  ali (o alias é do Skip). A rota do Prime Circle devolve o `modelo` do plano mesmo assim, para o dia em que a validação
  chamar a Anthropic direto, como já faz o `extrair_dados.js` com `ANTHROPIC_API_KEY`.
- O Prime Circle só falava com o Docs pelas rotas de admin (`/backend/v1/admin/usuarios*`) com uma conta de integração.

---

## 2. Item A: cota única de análise de documento

### Estado antes

- Plataforma: a análise de documento gasta da cota `document_analysis` (`usage_counters`, mês de São Paulo), contada pelo
  gatilho `sync_ai_usage_log_to_counters` a cada uso de IA com sucesso; sem assinatura, as 5 análises do passe
  (`avulso_passes.usado_analise`). O modelo da análise vem do plano (`agente-analise-plano.ts`).
- Docs: a validação de minuta tinha um contador só para exibição (`ia_contador.js`, `validacoes_no_mes`) e uma trava local
  para o avulso (uma validação). Nada ligava as duas cotas, então o mesmo corretor tinha duas contas separadas.

### Desenho

Três chamadas do Docs ao Prime Circle, todas servidor a servidor e assinadas, todas idempotentes pela `chave`:

| Chamada | Quando | Efeito |
| --- | --- | --- |
| `POST /api/v1/integracoes/docs/analises/reservar` | antes de chamar a IA | descobre quem é o usuário, confere o saldo e **desconta 1**; devolve saldo, modelo do plano e, se não pode, a mensagem com o link dos planos |
| `POST .../analises/confirmar` | a IA entregou | a reserva vira definitiva |
| `POST .../analises/estornar` | a IA falhou | devolve o 1 (no mesmo mês em que foi descontado) |

- **Quem é o usuário:** o e-mail da conta do Docs (o mesmo que a plataforma usou ao criar a conta), conferido em
  `prime_docs_contas`, mais o id da conta do Docs. O Prime Circle responde `vinculado:false` quando a conta do Docs não é da
  plataforma, ou quando o plano do Docs foi comprado direto no Docs (a plataforma não o carimbou): nesses casos o Docs segue a
  regra de sempre e nada é descontado de ninguém.
- **De onde sai a análise:** com assinatura, `consume_quota` do plano (atômico, soma os extras, não passa do limite). Sem
  assinatura e com passe vigente, 1 das 5 do passe (o passe que vence primeiro). Conta só para consulta (pagamento em atraso),
  plano sem análise (Essencial) ou sem plano: bloqueia com mensagem. `QUOTA_ENFORCEMENT` desligado: passa sem descontar, como
  no resto da plataforma.
- **Autenticação:** HMAC-SHA256 com segredo compartilhado. Cabeçalhos `x-docs-timestamp` (segundos) e `x-docs-assinatura`;
  mensagem assinada `timestamp.acao.chave.email`; tolerância de 5 minutos. No Prime Circle o segredo fica cifrado em
  `ai_provider_secrets`, provider `prime_circle_docs_cota` (como os outros segredos). No Docs é lido por `$secrets.get`
  (`PRIME_CIRCLE_COTA_SECRET`). Sem segredo cadastrado a porta fica fechada (503).
- **Idempotência:** a chave que o Docs manda é `val:<id do usuário>:<hash do documento>:<janela de 10 minutos>`. O hash impede
  que o texto da minuta saia do Docs (LGPD). Repetir a mesma validação na mesma janela devolve a reserva que já existe, sem
  descontar de novo. Pedidos simultâneos com a mesma chave são serializados (trava por chave): um desconto só. Se a primeira
  tentativa foi estornada e o corretor tenta de novo, a mesma linha é reaberta e desconta de novo.
- **Sem saldo:** o Docs responde 402 com `code: QUOTA_EXHAUSTED`, a mensagem do Prime Circle com o link
  `https://sistema.primecircle.app.br/planos` e **não chama a IA**.
- **Prime Circle fora do ar (decisão minha):** o Docs **não bloqueia o corretor**. Ele valida, e a falha vai para
  `prime_cota_pendencias` (`sem_reserva`) para conciliar. Motivos: o corretor costuma estar com o cliente na frente e a regra
  do produto (`negocio_limite.js`) já é não travar o trabalho por contador; o custo de uma validação é pequeno; e a cota é
  do Prime Circle, então o risco de uma queda é de contagem a menos, nunca de cobrança a mais. Confirmar e estornar que não
  chegam também ficam em `prime_cota_pendencias` e são repetidos na próxima validação do mesmo usuário (5 por vez, 5
  tentativas cada). O avulso, nesse caso, cai na regra local antiga (1 validação), que é a conservadora.
- **Avulso vinculado:** a trava local de uma validação sai e vale o saldo de 5 do passe no Prime Circle ("a validação de
  minuta do passe sai das 5 análises do passe").
- **Quem entra:** só conta com plano carimbado e em dia. Teste de 15 dias, plano vencido e admin não chamam o Prime Circle.

### O que mudou

Prime Circle (`wt-1133d`):

- `apps/api/drizzle/0103_docs_analise_reservas.sql` (tabela `docs_analise_reservas`, idempotente, não aplicada);
- `apps/api/src/modules/prime-docs/docs-cota.service.ts` (reservar, confirmar, estornar);
- `apps/api/src/modules/prime-docs/docs-cota.routes.ts` (as três rotas e a assinatura), registrada em `app.ts`.

Docs (`docs-skip`):

- `pocketbase/hooks/validar_minuta.js`: pergunta e reserva antes da IA, confirma depois, estorna nas duas saídas de falha da
  IA, registra pendências; a trava local do avulso passou para depois da resposta do Prime Circle;
- `pocketbase/migrations/1900000041_create_prime_cota_pendencias.js` (coleção só de servidor, sem texto de minuta).

`ia_contador.js` não muda: o contador local continua existindo para a tela.

### Limites conhecidos do item A

- A mesma minuta repetida em até 10 minutos, com sucesso na primeira, não desconta a segunda. É o que "a mesma validação não
  desconta duas vezes" pede, e é um efeito colateral aceito.
- Reserva que ninguém confirma nem estorna (queda do Docs no meio da validação) fica descontada. É o lado conservador. Elas
  aparecem em `docs_analise_reservas` com `status = 'reservada'` e o índice `docs_analise_reservas_abertas_idx` as lista.
- A consulta ao especialista (`consultar-ia`) **não** entra: o pedido fala da validação de minuta.

---

## 3. Item B: limite do Docs no Plano CRECI

### Achado

- No Prime Circle, `docsPlanoPara` mapeia `corretor_creci` (e Start, Essencial) para o plano **`corretor`** do Docs.
- No Docs, `LIMITES` está duplicado em `negocio_limite.js` e `admin_usuarios.js`: `avulso: 1`, `corretor: 10`,
  `profissional: 30`, `imobiliaria: 30`. **O corretor CRECI tem 10 operações por mês no Docs, igual ao Start.**
- **O que conta:** uma operação nova, isto é, um dossiê (`negocios`) novo criado. Documentos da mesma operação (mesmo imóvel
  e ao menos uma parte em comum) reaproveitam o dossiê e não contam de novo; documentos acessórios (checklist, termo de
  chaves, termo de posse, compromisso) não criam dossiê. Apagar o dossiê não devolve a vaga (o contador só sobe).
- **Não bloqueia:** passar de 10 só acende o aviso de teto na tela (`AvisoDeTeto`). É decisão de produto registrada em
  `negocio_limite.js`.
- **Quando renova:** o contador zera na primeira operação do mês de calendário seguinte (`contador_mes`, formato `AAAA-MM`
  em UTC, sem cron). Já o plano é carimbado por um mês de calendário pela plataforma e recarimbado pela varredura diária
  enquanto o direito continua.
- Observação sem ação: o mês do contador é UTC, então uma operação aberta depois das 21h do último dia do mês (horário de
  Brasília) cai no mês seguinte. Não afeta o teto, que só avisa.
- A cota de validação de minuta do CRECI passa a ser a do plano no Prime Circle (20 análises de documento por mês, texto do
  convênio), via item A.

### Decisão

Nada muda no Docs para o CRECI e **nenhum plano `creci` foi criado**: o comportamento pedido (10 por mês) já é o do `corretor`.
Só valeria um plano próprio se o cliente quisesse um teto diferente do Start no Docs. Um teste cobre o que foi dito acima
(10 de teto, 12 operações criadas e nenhuma recusada).

---

## 4. Item C: passe avulso só para o imóvel, por 30 dias exatos

### Estado antes

- O passe do Prime Circle (R$ 97, 30 dias do pagamento, um imóvel em `avulso_passes.imovel_id`) carimbava no Docs o plano
  `corretor` por **um mês de calendário** (`stampPlan(..., meses: 1)`), para a conta inteira, sem imóvel.
- O Docs identifica "o mesmo imóvel" pelo dossiê: `identificadoresDoImovel` usa matrícula e/ou endereço normalizado
  (`imovel.endereco` + cidade, texto livre digitado pelo corretor) e duas operações são a mesma quando o imóvel casa e há ao
  menos uma parte em comum.

### Desenho

- **Carimbo:** o Prime Circle carimba o plano `avulso` do Docs mandando também `renova_em` (o fim exato do passe, 30 dias do
  pagamento) e `imoveis` (um item por passe vigente: id, título, rua, número, bairro, cidade, CEP e `ate`). O Docs guarda a
  data **exata** (não mais mês de calendário) em `plano_renova_em` e a lista em `users.avulso_imoveis`. Vários passes vigentes
  viram vários imóveis, com a validade do que vence por último.
- **Validade:** o `renova_em` precisa estar no futuro e a até 31 dias; senão, 400. Avulso carimbado à mão pelo admin (sem
  `renova_em`) continua como era: mês de calendário e sem restrição de endereço.
- **Dossiê só do imóvel:** o novo `avulso_imovel.js` confere, na criação e na edição do imóvel de um `negocio`, se o endereço
  casa com um imóvel do passe ainda vigente. A regra é a ideia do `identificadoresDoImovel`, mais tolerante: o endereço do
  dossiê precisa conter **todas as palavras do nome da rua** (sem o tipo: rua, av., travessa...) e o **número inteiro** (45 não
  casa com 450 nem com 4); se passe e dossiê trazem cidade, ela também precisa bater. Dossiê novo sem endereço passa e é
  conferido quando o endereço for gravado. O usuário não consegue mexer na lista (`plano_carimbo.js` a protege).
- **Depois do vencimento:** não cria dossiê novo (nem vazio), não troca o imóvel de um dossiê, e a validação de minuta é
  recusada (regra que já existia para plano vencido). **Continua vendo e corrigindo** o que já tem (partes, título): a leitura
  de `negocios` não muda. A varredura do Prime Circle **não limpa** o plano `avulso` vencido: ele vence pela própria data, que
  é o que bloqueia a geração; limpar devolveria uma conta antiga (sem teste) à régua "sem limite". Passe **estornado** antes de
  vencer é limpo, como antes.
- **Validação de minuta do passe:** sai das 5 análises do passe (item A).
- **Prime Circle:** `DOCS_PLANO_DO_PASSE` passou de `corretor` para `avulso`; o carimbo só é refeito quando muda o que o passe
  pede (validade ou imóveis), o que preserva o contador do avulso; a tela do módulo mostra "Docs do passe avulso, só para o
  imóvel do passe, pelos 30 dias do passe".

### O que mudou

Prime Circle: `prime-docs/docs.client.ts` (`stampPlan` com escopo), `prime-docs/docs-passe.ts` (novo: rua e número, escopo,
comparação do carimbo), `prime-docs/prime-docs.service.ts` (`abrir`, `liberarPasse`, `sweep`), `avulso/avulso.rules.ts`,
`apps/web/src/services/primeDocs.ts` e `PrimeCircleDocs.tsx` (plano `avulso` e texto).

Docs: `admin_usuarios.js` (aceita `renova_em` e `imoveis` no carimbo do avulso, devolve `avulso_imoveis` na lista),
`plano_carimbo.js` (protege o campo), `avulso_imovel.js` (novo), migração `1900000040_users_add_avulso_imoveis.js` (novo).

### O que o servidor NÃO consegue fazer (e por isso há uma decisão pendente)

O download do `.docx` acontece no navegador, antes de o dossiê existir. Nenhum hook do servidor pode impedir um download, e o
Docs não guarda os arquivos gerados. Consequências, ditas sem rodeio:

1. "Docs só para o imóvel do passe" está garantido para o **dossiê**, a **validação de minuta** e a **validade**; não está
   garantido para o **download de um documento de outro imóvel** feito no navegador. Quem sabe contornar gera o arquivo, mas
   não fica com dossiê, histórico, validação nem contagem.
2. "Depois do vencimento continua baixando o que já gerou": o Docs não tem arquivo guardado para baixar. O que continua é o
   dossiê (partes e imóvel), visível e corrigível. Rebaixar o documento depois do vencimento seria **gerar de novo**, que o
   pedido proíbe.
3. A geração (as telas de documento) já bloqueia sozinha quando o plano vence.

---

## 5. Decisões que faltam (com recomendação)

1. **Travar o download por imóvel nos formulários.** Exige alterar os nove formulários que geram `.docx` (um `if` antes de
   gerar, lendo o plano e a lista de imóveis do usuário), e o dono cola cada arquivo inteiro. Recomendação: **não fazer agora**;
   o risco é baixo (quem paga R$ 97 por um imóvel e gera para outro não leva dossiê nem validação) e cada arquivo colado a
   mais é risco de corrupção, já medido (2 de 6). Se o cliente quiser, vira uma entrega própria.
2. **Texto de venda do passe.** A landing e a oferta dizem "Prime Circle Docs por 1 mês" e os testes da web afirmam "sem
   prometer limite por imóvel". Passa a ser "só para o imóvel do passe, por 30 dias". Não alterei porque é promessa
   comercial do cliente; recomendo trocar junto com a publicação do Docs.
3. **Modelo de IA do plano na validação do Docs.** Hoje é o `fast` do Skip. Recomendação: se o cliente quiser o modelo do
   plano também no Docs, trocar a chamada por Anthropic direta (como `extrair_dados.js`) usando o `modelo` que a reserva
   devolve. Fica para depois da cota única estável.
4. **Plano `creci` próprio no Docs.** Só se o cliente quiser um teto diferente do Start. Recomendação: não.

---

## 6. Ordem segura de publicação

Qualquer ordem é segura:

- **Prime Circle primeiro:** carimba `avulso` com campos extras que o Docs antigo ignora (cai no mês de calendário, sem
  restrição) e as rotas novas ficam sem uso até o Docs chamar.
- **Docs primeiro:** as chamadas à cota falham (rota ainda não existe ou segredo ainda não cadastrado) e o Docs segue
  sem contar, registrando `sem_reserva`; nada bloqueia.

Sequência recomendada: (1) migração 0103 e o segredo no Prime Circle, publicar o Prime Circle; (2) no Skip, cadastrar o
segredo e colar migrações, `plano_carimbo.js`, `admin_usuarios.js`, `avulso_imovel.js` e por último `validar_minuta.js`;
(3) conferir baixando o projeto do Skip e fazendo diff contra este repositório (nunca pelo editor do Skip).

Segredo (o valor é o mesmo nos dois lados e nunca entra em Git, log ou mensagem):

- Skip, secrets: `PRIME_CIRCLE_COTA_SECRET` (obrigatório) e, opcional, `PRIME_CIRCLE_COTA_URL` (padrão
  `https://api.primecircle.app.br`).
- Prime Circle: `ai_provider_secrets`, provider `prime_circle_docs_cota`, gravado pelo `setProviderSecret` da API (cifrado
  com `AI_SECRETS_KEY`).

---

## 7. Como foi testado

- Prime Circle, vitest: 3 arquivos unitários (assinatura e corpo das rotas, escopo do passe, cliente do Docs) e 3 de
  integração em PostgreSQL com o esquema de produção (cota: reservar, confirmar, estornar, passe, idempotência e concorrência;
  passe: carimbo, validade exata, varredura e vencimento; ponta a ponta com o PocketBase local e os hooks reais). 6 mutantes
  do serviço de cota e 13 dos hooks foram mortos pelos testes.
- Docs, `pocketbase/tests/integracao-prime-circle.test.mjs`, 20 casos no PocketBase local (0.23.12) com dados fictícios e o
  Prime Circle falso: com saldo desconta 1; sem saldo bloqueia com a mensagem; repetição não desconta duas vezes; IA que falha
  estorna; Prime Circle fora não bloqueia e deixa pendência; confirmação atrasada é repetida; sem vínculo segue a regra do
  Docs; avulso vinculado e não vinculado; CRECI (10 operações, 12 criadas, nenhuma recusada); carimbo com validade exata;
  imóvel certo passa e outro, outro número e outra cidade não; passe vencido não cria nem troca e continua vendo e corrigindo;
  o usuário não mexe na própria lista. O README da pasta diz o que o harness troca (`$secrets`, `$ai`) e só isso.
