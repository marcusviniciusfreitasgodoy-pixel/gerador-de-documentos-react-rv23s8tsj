# Registro de Melhorias — Landing Page e Segurança

Trabalho conduzido em **agosto de 2026** sobre a Prime Circle Documentos
(`documentos.primecircle.app.br`), em quatro frentes: a **página de abertura**
(copy, arte e um bug de renderização), o **endurecimento de segurança** do
backend, o **painel administrativo** e a **camada de imobiliárias** (equipe,
régua própria e convite com aceite do corretor).

Estado no ar quando este registro foi fechado: **v0.0.675**.

Este documento é o registro do que mudou e por quê. Não altera o funcionamento
do app; serve de histórico versionado. O `README.md` (template do Skip) e o
`DEV-README.md` (contexto de desenvolvimento) seguem intactos.

---

## 1. Landing page

A página passou por três rodadas, e o que está no ar hoje é o resultado da
terceira. As duas primeiras ficam registradas porque explicam por que a terceira
tem a forma que tem.

### 1.1 Primeira rodada — conversão

A página convencia mas não conduzia à contratação. A revisão manteve a estrutura
e a voz, e ajustou ordem, promessa e provas.

- **§ 01 (O problema)** — de seis cards para cinco, com um card novo em primeiro
  lugar sobre o honorário pago por documento (o único que fala em dinheiro
  saindo). Duas dores viraram recurso no § 02, onde rendem mais.
- **O dossiê** — ganhou momento próprio como diferencial ("Modelo de contrato
  qualquer um tem. O dossiê é a diferença"), em vez de ser um passo de lista.
- **Apoio de especialista** — de bullet escondido a banda própria, respondendo
  "e quando o caso foge do padrão?".
- **FAQ** — reordenado, com perguntas novas: tempo de cadastro, "substitui o
  advogado?" e "serve para locação?", que responde **não** e evita cadastro
  frustrado.
- **Barra de CTA fixa** no celular, já que a página é longa e o botão do hero
  some ao rolar.

A headline dessa rodada era _"O contrato do seu negócio não devia começar num
modelo do WhatsApp. Nem terminar na conta do advogado."_ Ela cumpria o papel de
nomear as duas contas que o corretor autônomo paga, mas partia de um lugar
negativo, apontando o erro do leitor antes de oferecer qualquer coisa. Foi
substituída na rodada seguinte.

### 1.2 Segunda rodada — a promessa e os seis argumentos

A headline passou a ser _"No fim, vale o que está no papel. Inclusive a sua
comissão."_, com o subtítulo prometendo o que o corretor apresenta ao cliente, e
não o que ele evita.

Na sequência, a copy inteira foi auditada contra seis argumentos que a página
precisava entregar a quem lesse até o fim: **autonomia, segurança jurídica para
todas as partes, profissionalismo, cobertura do início ao fim da transação,
preenchimento automático dos dados e o especialista em dois níveis**. Quatro
intervenções fecharam as lacunas encontradas:

- O pilar "Gerar" passou a dizer que o negócio entra uma vez e alimenta todos os
  documentos, em vez de só listar quantidade.
- O § 03 ganhou a frase que amarra os documentos ao dossiê ("nenhum deles começa
  em branco").
- Entrou uma banda nova sobre o documento como primeira prova do trabalho diante
  do cliente.
- O bloco do especialista passou a nomear explicitamente os dois níveis.

### 1.3 Terceira rodada — a estrutura que está no ar

Uma proposta de estrutura nova chegou do Skip e foi adotada, depois de auditada.
Ela trouxe quatro ganhos reais:

- **§ 06 · Preço, seção dedicada.** O item "Preço" do menu apontava para o FAQ:
  o visitante clicava em Preço e caía num acordeão de perguntas. Agora existe a
  seção, com "Grátis nesta fase" e o que está incluído.
- **Faixa de números** abaixo do hero (16 documentos, 1 cadastro por negócio, 3
  fases cobertas, 30 dias até o expurgo), animando de zero ao entrar na tela.
  Todos os quatro foram conferidos contra o conteúdo da própria página.
- **Cláusula de arras exibida na íntegra**, com a fundamentação nos artigos 417 a
  419 do Código Civil. É a prova mais concreta da página: o corretor lê o que sai
  do `.docx`.
- **CSS mais enxuto**, trocando breakpoints manuais por grades `auto-fit`.

A proposta perdia coisas que já estavam validadas em produção, e elas foram
repostas antes de ir ao ar:

- **As três telas reais da plataforma.** A arte do hero tinha virado um cartão de
  CSS vazio. Voltaram, com o parallax novo aplicado só nas camadas que não giram
  (o cartão do documento tem `rotate`, e um `translate3d` por cima o desalinharia).
- **A tela do documento preenchido** no § 02, ocupando a largura toda do painel
  escuro em vez de meia coluna.
- **O fecho da banda da prova**: _"É o que separa quem intermedeia de quem
  improvisa."_
- **O menu no celular.** A nav tinha virado rolagem horizontal e ficava cortada
  no meio do botão, sem indicação de que dava para arrastar. Voltou a sumir
  abaixo de 900 px, já que a barra fixa carrega Entrar e Criar conta.

Headline atual: _"Todo negócio termina em documento. O seu não devia terminar em
improviso."_ Seções: § 01 O problema, § 02 Como funciona, § 03 O que você gera,
§ 04 Validador de minuta, § 05 Para imobiliárias, § 06 Preço, § 07 Perguntas.

### 1.4 Assinatura e a desconfiança de dado

A página assinava **Marcus V. F. Godoy Assessoria Imobiliária · CRECI PJ 11841**,
o que dava credencial de ofício à única prova social existente. Foi trocada por
**Prime Circle · CNPJ 58.409.058/0001-73**, com o CRECI mantido no rodapé.

O motivo é de leitura de público, e é mais forte que o ganho de autoridade:
corretor e imobiliária desconfiam de concorrente. Um corretor que vê **outro
corretor** assinando a ferramenta não pensa "esse entende do ofício", pensa "esse
vai ver minha carteira de clientes". Tirar o nome pessoal remove o gatilho.

Remover o gatilho, porém, não responde à dúvida, e a resposta estava mal
colocada: o card "Dados tratados com regra" mora no § 05, que se chama "Para
imobiliárias" e o corretor autônomo pula; e a pergunta do FAQ era a oitava, atrás
de um acordeão fechado no fim da página. As duas diziam "acessível ao seu dono e
a mais ninguém", abstrato demais para quem quer ler que **outro corretor não vê**.

Duas alterações fecharam isso:

- A **resposta do FAQ** passou a nomear quem não vê (nenhum outro corretor,
  nenhuma imobiliária), o que não vê (cadastro de partes, negócios, documentos) e
  por que a garantia vale (regra por dono do registro, aplicada no servidor, não
  configuração de tela).
- A **mesma garantia, em uma frase, entrou no fim do § 02**, logo depois dos três
  cartões do dossiê. É ali que a dúvida nasce, no momento em que a página pede
  para cadastrar CPF e RG de cliente.

Uma escolha deliberada de redação: **não foi escrito "ninguém vê, nem nós"**. Não
seria verdade, porque administração de banco tem acesso, e um corretor que
descobre isso depois se sente enganado, o que custa mais do que a frase compra. A
afirmação que ficou é a que sustenta escrutínio, e as regras de acesso auditadas
entregam exatamente ela.

### 1.5 Conserto do reveal por scroll

As nove seções do miolo tinham `data-reveal` e ficavam em `opacity: 0` até o
`IntersectionObserver` disparar. Com `threshold: 0.12`, **seis das nove seções
ficavam invisíveis para um leitor rolando no celular** (reproduzido em Chromium
a 390×844). Trocado por `threshold: 0` com `rootMargin` e uma rede de segurança
por timeout que revela tudo caso o observer não dispare.

A estrutura atual melhorou isso de novo: cada elemento nasce com `opacity: 0`
aplicado **pelo próprio JavaScript**, e não pelo HTML. Se o script falhar, a
página aparece inteira em vez de sumir. Nenhum texto depende de JavaScript para
existir.

### 1.6 Metatags de compartilhamento (`index.html`)

O `og:image` era caminho relativo, que o robô do WhatsApp e do Facebook não
resolvem — o cartão saía sem imagem. Corrigido para URL absoluta, com
`og:title`, `og:description`, `og:url`, dimensões e o cartão do Twitter. O
público divulga por grupo de WhatsApp, então o preview do link é o cartão de
visita do produto.

---

## 2. Endurecimento de segurança

Partiu de uma revisão estática de código, cruzada com um pentest com acesso
**ao vivo** ao banco. Onde a leitura ao vivo divergiu das migrations do repo,
ela prevaleceu — e revelou que várias regras já estavam corretas no banco, só
não versionadas.

### Aplicado

- **Rate limiting** nas rotas de IA — coleção dedicada `rate_limits`, janela
  fixa de 60s, **fail-open**, limpeza automática, API rules `null` (só
  superuser). Persiste entre restarts (a versão anterior era em memória).
- **Truncamento (~20% de falha) resolvido** — a base jurídica inteira entrava no
  prompt e era cortada no meio, corrompendo o JSON. Passou a filtrar por
  `trigger_logic` compatível com o tipo de documento, com teto de 50 KB.
- **Sanitização de JSON unificada + retry** nas quatro rotas.
- **PII nos logs** — `document_text` **não é mais gravado** (sucesso ou falha);
  só `parsed_result`, `raw_ai_response`, `error_code`, `error_message`. E os 26
  registros antigos com PII completo foram **limpos do banco** (campo zerado,
  trilha de auditoria preservada), sem esperar a purga de 30 dias.
- **Criação dos logs amarrada ao dono** — `validation_logs` e
  `validation_audit` deixaram de aceitar create sem fixar o dono.

### Confirmado como já correto (ao vivo)

- Ownership isolando dados entre corretores em todas as coleções sensíveis.
- Gate de e-mail verificado no servidor, nas rotas de IA.
- Segredos via `$secrets.get`, nunca no código.
- LGPD com purga de 30 dias + cascade delete.
- `legal_knowledge` legível só por admin.
- `.docx` com escape de XML; sem vetores de XSS dinâmico.

### Decisão consciente (não aplicado)

- Adicionar `verified = true` às regras de **leitura** das coleções de dados.
  Os dois pentests concordaram que o ownership já isola — uma conta não
  verificada só alcançaria os próprios registros, nunca de terceiros. Defesa em
  profundidade, não brecha.

---

## 3. Higiene do repositório

Descobriu-se que as migrations do repo **divergiam do banco**: regras foram
apertadas no painel sem gravar migration. Uma reconstrução a partir das
migrations regrediria a segurança. As mudanças de segurança passaram a ser
gravadas como migrations (`1900000023`–`1900000025`), e o repositório foi
reconciliado para espelhar byte a byte a versão em produção.

### Migrations adicionadas

| Migration                               | O que faz                                     |
| --------------------------------------- | --------------------------------------------- |
| `1900000023_create_rate_limits`         | Cria a coleção do rate limit                  |
| `1900000024_fix_validation_log_rules`   | Amarra o dono no create dos logs              |
| `1900000025_clear_document_text_pii`    | Zera o PII dos 26 registros antigos           |
| `1900000026_admin_read_broker_profile`  | Perfil legível pelo dono ou admin             |
| `1900000027_create_agency_members`      | Vínculo entre imobiliária e corretores        |
| `1900000028_negocios_add_agency`        | Carimbo da imobiliária no negócio             |
| `1900000029_create_access_logs`         | Trilha de acesso do gestor (LGPD)             |
| `1900000030_legal_knowledge_add_agency` | Régua própria por imobiliária                 |
| `1900000031_fix_negocios_create_rule`   | Restaura o `@request.auth.id != ""` no create |
| `1900000032_create_agency_invites`      | Convite por e-mail com aceite do corretor     |
| `1900000033_users_add_trial`            | Prazo de teste por conta (vazio = sem limite) |

---

## 4. Painel administrativo (`/admin`)

O admin não tinha casa: a régua jurídica, a fila de especialista e os chamados
viviam dentro de páginas feitas para o corretor, ligados por `if (isAdmin)` no
meio do componente. Para saber "o que precisa da minha atenção hoje" era preciso
abrir três páginas e filtrar mentalmente.

Rota `/admin` (adminOnly) com quatro blocos: **fila de atendimento** (pedidos de
especialista e chamados pendentes, do mais antigo para o mais novo), **pulso da
operação**, **régua jurídica** e **saúde técnica**.

O ponto de arquitetura que sustentou tudo: as métricas vêm de um endpoint
(`GET /backend/v1/admin/overview`) que calcula agregados com privilégio de app e
devolve **só números**. Nenhuma regra de coleção foi afrouxada para o painel
existir — do contrário, dar ao admin "acesso a tudo" teria reaberto a exposição
de PII fechada na frente anterior.

---

## 5. Camada de imobiliárias

A landing page prometia _"a régua jurídica é sua, sob controle do administrador
da conta"_, mas o sistema não tinha o conceito de equipe: uma imobiliária era só
uma conta solo cujo perfil era uma empresa. Duas fases fecharam essa distância.

### Fase 1 — vínculo de equipe

Coleção `agency_members` liga a conta PJ aos corretores dela, e `negocios.agency`
carimba de qual imobiliária é cada negócio.

Três decisões que definiram a fase:

- **O carimbo é feito no servidor.** `createNegocio()` roda no cliente e envia o
  `owner` a partir do `authStore`; se o `agency` também viesse de lá, um corretor
  poderia forjá-lo — enfiar um negócio na imobiliária de outro, ou tirar o
  próprio da vista do gestor. Um hook `onRecordCreate` resolve o vínculo e grava
  o campo, sobrescrevendo o que o cliente mandar.
- **O gestor lê e edita, mas não apaga.** A `deleteRule` é mais restrita que a de
  leitura: apagar é destrutivo e assimétrico, então fica com o dono e com o admin
  da plataforma.
- **O termo de consentimento bloqueia o carimbo.** Sem `termo_aceito_em`
  preenchido, o hook não carimba e o gestor não vê nada daquele corretor. A
  exigência de LGPD é garantida pelo código, não pela lembrança de alguém.

Acrescenta ainda `access_logs` (trilha de quando o gestor abre negócio alheio,
admin-only) e a rota `/equipe` para o gestor.

### Fase 2 — régua jurídica própria

Campo `legal_knowledge.agency`: vazio = regra global da Prime Circle;
preenchido = regra daquela imobiliária. A base é montada mesclando as duas, **por
`code`, com a regra da casa vencendo a global** — a imobiliária pode sobrescrever
uma cláusula padrão, não só acrescentar.

O ponto crítico: `legal_knowledge` é carregada com `$app`, que **ignora as API
rules**. Mudar a regra da coleção não filtraria nada na validação — o isolamento
teve de entrar no filtro de **cada uma das quatro consultas** (duas por rota),
incluindo os fallbacks, que eram os mais perigosos por dispararem justamente
quando a imobiliária ainda não tem regra daquele tipo.

Um bug pego na auditoria dessa fase: o hook `legal_knowledge_agency.js` lia o
usuário por `e.httpContext.get('authRecord')`, e não pelo `e.auth` que é o padrão
do projeto. Em hooks de modelo o `httpContext` é nulo nas escritas
programáticas, então o campo `agency` seria zerado em toda regra gravada assim.
Corrigido para `onRecordCreateRequest` / `onRecordUpdateRequest` com `e.auth`.

### Fase 3 — convite por e-mail e aceite in-app

A fase 1 criava o vínculo pelo painel `/admin`: o administrador da plataforma
buscava o corretor e **digitava a data do aceite do termo**. O carimbo só valia
com essa data preenchida, então a exigência de consentimento estava garantida
pelo código. O que não estava garantido é quem afirmava o consentimento: era o
administrador, não o titular dos dados. A data representava um combinado
fechado fora do app.

Agora a imobiliária convida por e-mail (coleção `agency_invites`), e quem aceita
é o corretor, depois de ler o que a casa passa a ver. A hora do aceite sai do
relógio do servidor.

Quatro decisões que definiram a fase:

- **O token do link não é credencial.** A autorização do aceite é o e-mail do
  convite bater com o da conta autenticada. Token vazado, sozinho, não vincula
  ninguém, e por isso o reenvio nem troca o token. Sem conta, o link leva ao
  cadastro: não existe "aceitar sem conta".
- **`agency_members` continua fechada na API.** O aceite grava com
  `$app.saveNoValidate`, e não afrouxando a regra da coleção. O critério 6 da
  fase 1 (corretor comum recebe 403 ao escrever ali) segue valendo palavra por
  palavra. Vale a mesma lógica do painel `/admin`: a tela nova não foi motivo
  para abrir coleção nenhuma.
- **"Já está em outra imobiliária" é checado no aceite, não no convite.** Dizer
  isso ao gestor entregaria a ele um dado do corretor que não é dele. No aceite,
  a resposta vai para quem tem direito a ela: o próprio corretor, com o nome da
  casa onde ele está e o caminho para sair.
- **O corpo do e-mail é fixo, sem campo de recado.** Com texto livre, o convite
  viraria um canal de envio de mensagem arbitrária para endereço arbitrário,
  assinado pelo domínio da Prime Circle.

Entraram junto duas coisas que são consequência direta, não escopo extra. A
**revogação pelo próprio corretor** (`/vinculo/sair`), porque consentimento que
só a outra parte desfaz não é consentimento; e a **remoção pelo gestor**, porque
com o convite ele monta a equipe sem depender do admin, e "entra sozinho mas
precisa de chamado para sair" seria uma assimetria estranha. Nos dois casos o
efeito é o da fase 1: o vínculo vira `removido`, a linha não some, e os negócios
já carimbados continuam com a casa que os intermediou. A tela **diz isso antes
de confirmar**, porque a expectativa natural de quem clica em "sair" é que o
passado também suma.

O vínculo manual do `/admin` **não foi removido**. Ficou recolhido e rotulado
como exceção: é a única saída quando o e-mail não chega de jeito nenhum e a
imobiliária precisa operar hoje. Tirá-lo durante a transição deixaria a operação
sem rede.

**Um conserto que veio junto.** A exclusão de usuário em cascata não conhecia
`agency_members` nem `access_logs`, e as duas apontam para `users` com relação
obrigatória e sem cascade: o banco **recusava excluir** qualquer conta com
vínculo de equipe, e o painel mostrava "excluído" de forma enganosa. O mesmo
valia para `access_logs.negocio`, criada pelo _gestor_ e por isso invisível ao
filtro por usuário. Buraco aberto desde a fase 1, e apagar a conta é obrigação
de LGPD. Entrou aqui porque esta fase acrescentaria uma quarta relação ao mesmo
problema.

Especificações completas em `docs/SPEC-IMOBILIARIAS-F1.md`,
`docs/SPEC-IMOBILIARIAS-F2.md` e `docs/SPEC-IMOBILIARIAS-F3.md`.

---

## 6. Teste de 15 dias

A plataforma estava liberada "nesta fase", sem prazo, esperando o sistema ficar
pronto. Passa a ter teste de 15 dias para quem se cadastrar.

O ponto que definiu o desenho não foi técnico. A § 06 da landing prometia, com
todas as letras: _"Quando houver preço, você será avisado com antecedência e
decide se continua"_. Ligar um prazo retroativo em quem já estava dentro
quebraria essa frase, num público que este mesmo documento descreve como
desconfiado por ofício. Então **conta antiga não tem prazo**: o campo
`users.trial_expira_em` nasce vazio, e vazio significa sem limite. Só quem se
cadastra a partir daqui é carimbado.

Três decisões:

- **O carimbo é do servidor.** No PocketBase o usuário tem update do próprio
  registro em `users`, então prazo vindo do cliente seria prazo que o próprio
  corretor edita. O hook `trial_carimbo.js` grava na criação e desfaz qualquer
  alteração de quem não é admin. Mesma doutrina do `agency` na fase 1 e do
  `termo_aceito_em` na fase 3.
- **Vencido, param a geração e a validação; a leitura continua.** O corretor
  segue entrando, abrindo os negócios e vendo o cadastro das partes. Prender
  CPF e RG de cliente atrás de um bloqueio não é alavanca de venda, é problema
  de LGPD, e destrói a confiança que a § 05 tenta construir.
- **O bloqueio de tela é por rota, num lugar só.** Existem 10 pontos de
  download de `.docx` em 8 arquivos; o gate mora no `Layout.tsx`, numa lista de
  rotas. É conveniência de tela e dá para contornar, e por isso **o gate que
  vale é o do servidor**, no topo das quatro rotas de IA, que é onde está o
  custo. Gerar `.docx` roda no navegador, então ali não existe barreira de
  servidor para ter.

O erro de teste vencido devolve **402**, não 403, para a tela distinguir "seu
teste acabou" de "confirme seu e-mail".

Não há cobrança no sistema. Vencido, a tela aponta para a página de ajuda e o
admin estende à mão, mudando a data no painel. É o que dá para sustentar hoje, e
a copy não promete mais do que isso.

---

## 7. Lançamento: do dossiê automático ao preço

Agosto de 2026, depois da fase 3. O objetivo era sair de "liberado até o sistema
ficar pronto" para uma plataforma que sabe cobrar. Quatro blocos, nesta ordem.

### 7.1 O dossiê nasce sozinho (B2)

Até aqui, gerar documento nunca exigiu negócio: todo formulário travava só em
`hasBroker`, e o `CarregarDeNegocio` era conveniência opcional. Isso deixava dois
buracos ao mesmo tempo. Quem gerava avulso **perdia o histórico**, justamente o
corretor que ainda não entendeu o dossiê. E se o plano fosse medir por operação,
o caminho que escapa da contagem seria o caminho **padrão** do produto.

A saída não foi exigir negócio antes de gerar, o que meteria uma etapa no meio do
trabalho. É criar o negócio **no ato**: o corretor preenche e baixa, igual a
sempre, e o dossiê aparece com o que ele acabou de digitar.

Ligado nos dez documentos que **definem** uma operação. Checklist, termo de
chaves, termo de posse, compromisso, recibo de comissão e corretagem ficam de
fora de propósito: são acessórios de um negócio que já existe, e cobrar vaga por
eles puniria quem documenta direito. A regra fica dizível numa frase para o
corretor: _o limite é por operação, e termo de chaves não conta._

**Duas correções de desenho no caminho, e as duas importam.**

A primeira: eu tinha escrito uma regra própria de identidade de pessoa. O
`negocios.ts` já tem `mesclarPartes`, e o comentário dele diz por que não pode
haver duas. A minha divergia num ponto perigoso: `mesmaPessoa` devolve **false**
quando só um dos lados tem CPF, ou seja, se recusa a fundir na ambiguidade; a
minha casava por nome nesse caso, o que fundiria homônimos e misturaria dados de
clientes diferentes.

A segunda: a regra de reuso elegia uma **parte âncora**, com preferência pelo
comprador. Ela quebrava na sequência mais comum do mercado. A autorização de
venda é assinada quando o corretor pega a captação, semanas antes de existir
comprador: ela ancorava no vendedor e a promessa posterior no comprador, dando
duas chaves para a mesma operação. Hoje duas operações são a mesma quando tratam
do **mesmo imóvel** e têm **ao menos uma parte em comum**. As duas condições são
necessárias: só o imóvel fundiria a revenda a outro comprador anos depois; só a
pessoa fundiria os dois imóveis de um investidor.

E o identificador do imóvel é um **conjunto**, não um valor. A primeira tentativa
devolvia "matrícula se houver, senão endereço", e um teste pegou: a autorização
não coleta matrícula e a promessa coleta, então uma produzia `e:endereço` e a
outra `m:matrícula` e nunca se encontravam. Precedência só funciona quando os
dois lados coletam os mesmos campos.

_Limite conhecido:_ o recibo de sinal coleta matrícula e não coleta endereço; a
autorização faz o contrário. Os dois não têm token em comum e não se reconhecem.
Não há dado comparável entre as duas telas. A promessa tem os dois tokens e serve
de ponte assim que existe.

### 7.2 Plano e contador (bloco B)

Cinco campos em `users`, migração 1900000034, com a convenção herdada da 33:
**vazio significa sem limite**. `plano` e `plano_renova_em` guardam a assinatura;
`negocios_no_mes` e `contador_mes` guardam a contagem; `plano_limite_negocios`
guarda o teto que valia quando o contador foi mexido, para o app mostrar "7 de
10" sem carregar tabela de preço no cliente.

**O contador não conta linhas.** A regra de `negocios` é
`deleteRule: 'owner = @request.auth.id'`: o corretor apaga o próprio negócio.
Contagem de linhas existentes seria enfeite, porque bastaria criar, gerar os
documentos, apagar, e a vaga voltava. O número só sobe.

**E não bloqueia.** Passar do teto não impede nada. Se o sistema recusasse com o
cliente na frente, o corretor abriria o Word do mês passado, ou reaproveitaria um
dossiê antigo trocando as partes, o que estraga o ativo de retenção. Falha ao
contar também não impede: sem contagem ele ganha uma operação de graça, com
exceção propagada ele perde o documento que ia entregar.

**O bug latente que apareceu ao ligar isso.** O gate olhava só `trialExpirado`, e
teria **trancado o assinante no dia seguinte ao pagamento**, porque o prazo do
teste continua vencendo no banco. Entrou `acessoBloqueado` = não admin **e** sem
plano ativo **e** teste vencido. O mesmo defeito estava nos **quatro** gates de
IA do servidor, onde a falha seria muda e chegaria como "erro ao validar".

### 7.3 Página de planos (bloco D)

Quatro ofertas com preço visível, e o estado do corretor na própria página: qual
plano, quantos dias faltam, quantas operações no mês contra o teto.

**O botão abre um chamado, não um checkout.** O provedor de pagamento ainda não
foi escolhido. Até lá o pedido cai na fila que o admin já atende, com o nome do
plano na mensagem; o admin combina o pagamento e carimba `plano` e
`plano_renova_em` no painel. Não é remendo: para os primeiros assinantes, fechar
à mão é mais rápido que integrar e ensina qual objeção aparece de verdade. Quando
o provedor existir, muda a função `solicitar` do `Planos.tsx` e mais nada.

### 7.4 O produto vira Prime Circle Docs (bloco A)

Mudou o **nome do produto**, não a marca: "Prime Circle" sozinho ficou intacto.
O substantivo comum também: "16 documentos", "documentos em Word", a âncora
`#documentos`. Foram 20 ocorrências conferidas uma a uma, e um replace cego teria
estragado nove.

---

## 8. Uma nota sobre o método

Duas vezes um critério dado como "confirmado pelo código" não se sustentou ao
abrir o arquivo: o campo que o servidor grava só fica provado olhando o
**registro criado no banco**, não a intenção do código. Nos dois casos o problema
apareceu (ou teria aparecido) por essa via. Vale manter o hábito: para qualquer
regra de acesso ou campo carimbado pelo servidor, conferir o resultado, não a
descrição.

O mesmo hábito vale para a página. Toda alteração de copy ou de arte foi
conferida renderizando o `DESIGN_HTML` em Chromium a 1440, 820 e 390 px, olhando
três coisas: nenhuma seção presa em `opacity: 0`, nenhuma rolagem horizontal, e
os três hashes das imagens em base64 intactos. Uma regressão de arte já passou
por revisão de código sem ser notada e só apareceu na renderização.

**Isso deixou de valer só para a landing.** Numa página React comum, feita de
componentes do próprio design system, o render pegou o preço do plano de
imobiliária quebrando em duas linhas ("R$" em cima, "197" embaixo), porque a
unidade longa espremia o número. Diff nenhum pega, e numa grade de preços salta
aos olhos. Tela nova se renderiza antes de entregar, sempre.

**E a armadilha do JSVM virou verificação, não disciplina.** Handler do PocketBase
não enxerga o escopo do módulo, e isso já custou um bug silencioso. Hoje existe um
script que varre todos os hooks procurando handler que leia variável de fora
dele; está no comando `/colar-no-skip` e roda contra a árvore baixada do Skip.

---

## 9. Próximos passos

### Verificações pendentes (rápidas, sem risco)

- **Regra da casa:** gestor cria uma regra e o `agency` tem de vir com o id dele,
  nunca vazio. Conferir o registro no banco. Só faz diferença quando houver uma
  imobiliária real cadastrada.
- **Taxa de falha do `/admin`:** confirmar que o validador grava
  `status = 'fail'`; se gravar outro valor, o número fica sempre zero.
- **Documento "Genérico":** confirmar que a validação ainda aponta arras, foro,
  LGPD e comissão — é o ponto cego do filtro por `trigger_logic`.
- **Aceite do convite (fase 3):** um corretor aceita e o `agency_members` tem de
  nascer com `termo_aceito_em` preenchido pelo servidor, e o negócio seguinte
  dele com `agency` carimbado. Conferir os dois **no banco**, não no código: é
  exatamente o tipo de campo que a seção 6 diz para não dar por provado.
- **Envio do convite:** confirmar que o e-mail sai de fato pelo SMTP do Skip. O
  código trata a falha (o convite continua valendo in-app e a tela oferece
  reenvio), mas a primeira imobiliária real merece o caminho feliz.
- **Exclusão de conta:** apagar uma conta de teste **com** vínculo de equipe e
  confirmar que ela some. A cascata foi estendida para `agency_members`,
  `access_logs` e `agency_invites`; era um travamento silencioso desde a fase 1.

### O que ficou aberto do lançamento

- **A arte da landing contradiz o nome.** O mockup do app embutido na página de
  abertura é uma das imagens WebP em base64, e ainda mostra "Prime Circle /
  DOCUMENTOS" no cabeçalho, com "Documentos" como título e aba ativa. Depois do
  rename, a landing exibe uma imagem do produto que contradiz o nome do produto.
  Não dá para corrigir por código: precisa de quem faz a arte. Não quebra nada,
  mas aparece para todo visitante.
- **Os tetos de 10 e 30 operações são hipótese, não dado.** Saíram de uma conta,
  não de pesquisa. O `negocios_no_mes` começou a rodar em 26/08/2026, em cima do
  dossiê automático: em algumas semanas ele responde quantas operações um
  corretor abre de verdade por mês, e aí os planos se recortam em cima do real.
  **É a única premissa da proposta de preço que se resolve sozinha, só
  esperando.** Mudar valor é mexer em `PLANOS` no `Planos.tsx` e em `LIMITES` no
  `negocio_limite.js`, nesta ordem.
- **O provedor de pagamento.** Comparar taxa, conciliação e o que acontece quando
  o cartão falha. Enquanto isso o caminho manual funciona de ponta a ponta.
- **O avulso (bloco E)** é um segundo sistema de cobrança, transacional em vez de
  recorrente, com direito de uso amarrado a um negócio. Não construir antes de
  alguém pedir: na página de preços ele já cumpre metade da função só existindo,
  como âncora que faz a assinatura parecer óbvia a partir do segundo negócio.
- **Contador subindo**, a conferir no banco: criar um negócio e ver
  `negocios_no_mes` virar 1 e `contador_mes` virar o mês corrente. Se ficar
  zerado, o `catch` está engolindo algo e o log mostra
  `negocio_limite: falha ao contar a operacao`.
- **Carimbo do teste**, a conferir no banco: conta nova recebe
  `trial_expira_em` 15 dias à frente, e conta antiga continua com o campo vazio.

### Produto (quando quiser)

- **Home do corretor** — painel consolidado pessoal. Seguro e barato (lê só o
  que ele já pode ver), mas é polimento: ele já chega em tudo pelo menu.
- **Transferência de equipe** — hoje o corretor sai de uma casa e aceita a
  outra, em dois passos. Um passo só resolveria, mas só vale a pena quando
  houver rotatividade de verdade.

### O que move a conversão, e não é código

- **Prova social** — depoimentos de corretor com nome e CRECI. Segue sendo a
  maior lacuna da página: ela argumenta bem e não mostra ninguém que já usou.
- **Ver o produto funcionando** — um vídeo curto de um documento sendo gerado, no
  lugar do print estático.
- **Um canal humano** — um WhatsApp de contato.

---

_Fluxo de deploy: este repositório é um espelho de leitura do
[Skip](https://goskip.dev), onde o app roda. Mudanças chegam em produção pelo
editor do Skip, não por push aqui. Ver `DEV-README.md`._
