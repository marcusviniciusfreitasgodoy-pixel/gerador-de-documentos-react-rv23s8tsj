# Registro de Melhorias — Landing Page e Segurança

Trabalho conduzido em **agosto de 2026** sobre a Prime Circle Documentos
(`documentos.primecircle.app.br`), em quatro frentes: a **página de abertura**
(copy e um bug de renderização), o **endurecimento de segurança** do backend, o
**painel administrativo** e a **camada de imobiliárias** (equipe e régua
própria).

Este documento é o registro do que mudou e por quê. Não altera o funcionamento
do app; serve de histórico versionado. O `README.md` (template do Skip) e o
`DEV-README.md` (contexto de desenvolvimento) seguem intactos.

---

## 1. Landing page — copy e conversão

A página convencia mas não conduzia à contratação. A revisão manteve a estrutura
e a voz, e ajustou ordem, promessa e provas.

- **Hero** — mantida a headline original ("O contrato do seu negócio não devia
  começar num modelo do WhatsApp") e acrescentada a segunda batida sobre o custo
  que mais pesa no corretor autônomo: **"Nem terminar na conta do advogado."**
  Subheadline reescrita para prometer resultado, com "fundamentados no Código
  Civil" respondendo à objeção que a nova headline cria.
- **§ 01 (O problema)** — de seis cards para cinco, com um card novo em primeiro
  lugar sobre o honorário pago por documento (o único que fala em dinheiro
  saindo). Duas dores viraram recurso no § 02, onde rendem mais.
- **O dossiê** — ganhou momento próprio como diferencial ("Modelo de contrato
  qualquer um tem. O dossiê é a diferença"), em vez de ser um passo de lista.
- **Apoio de especialista** — de bullet escondido a banda própria, respondendo
  "e quando o caso foge do padrão?".
- **FAQ** — reordenado com o **preço em primeiro**, mais perguntas novas
  (tempo de cadastro, "substitui o advogado?", "serve para locação?" — que
  responde **não**, evitando cadastro frustrado).
- **Assinatura** — a seção "Como nasceu" e o rodapé passaram a trazer
  **Marcus V. F. Godoy Assessoria Imobiliária · CRECI PJ 11841**, dando
  credencial à única prova social da página.
- **Barra de CTA fixa** no celular, já que a página é longa e o botão do hero
  some ao rolar.

### Conserto do reveal por scroll

As nove seções do miolo tinham `data-reveal` e ficavam em `opacity: 0` até o
`IntersectionObserver` disparar. Com `threshold: 0.12`, **seis das nove seções
ficavam invisíveis para um leitor rolando no celular** (reproduzido em Chromium
a 390×844). Trocado por `threshold: 0` com `rootMargin` e uma rede de segurança
por timeout que revela tudo caso o observer não dispare — nenhum texto depende
de JavaScript para existir.

### Metatags de compartilhamento (`index.html`)

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

| Migration | O que faz |
|---|---|
| `1900000023_create_rate_limits` | Cria a coleção do rate limit |
| `1900000024_fix_validation_log_rules` | Amarra o dono no create dos logs |
| `1900000025_clear_document_text_pii` | Zera o PII dos 26 registros antigos |
| `1900000026_admin_read_broker_profile` | Perfil legível pelo dono ou admin |
| `1900000027_create_agency_members` | Vínculo entre imobiliária e corretores |
| `1900000028_negocios_add_agency` | Carimbo da imobiliária no negócio |
| `1900000029_create_access_logs` | Trilha de acesso do gestor (LGPD) |
| `1900000030_legal_knowledge_add_agency` | Régua própria por imobiliária |

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

A landing page prometia *"a régua jurídica é sua, sob controle do administrador
da conta"*, mas o sistema não tinha o conceito de equipe: uma imobiliária era só
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

Especificações completas em `docs/SPEC-IMOBILIARIAS-F1.md` e
`docs/SPEC-IMOBILIARIAS-F2.md`.

---

## 6. Uma nota sobre o método

Duas vezes um critério dado como "confirmado pelo código" não se sustentou ao
abrir o arquivo: o campo que o servidor grava só fica provado olhando o
**registro criado no banco**, não a intenção do código. Nos dois casos o problema
apareceu (ou teria aparecido) por essa via. Vale manter o hábito: para qualquer
regra de acesso ou campo carimbado pelo servidor, conferir o resultado, não a
descrição.

---

## 7. Próximos passos

### Verificações pendentes (rápidas, sem risco)

- **Regra da casa:** gestor cria uma regra e o `agency` tem de vir com o id dele,
  nunca vazio. Conferir o registro no banco.
- **`createRule` de `negocios`:** a migration `1900000028` reescreveu a regra
  perdendo o `@request.auth.id != ""`. Provavelmente inócuo, mas regra de acesso
  não é lugar para "provavelmente".
- **Taxa de falha do `/admin`:** confirmar que o validador grava
  `status = 'fail'`; se gravar outro valor, o número fica sempre zero.
- **Documento "Genérico":** confirmar que a validação ainda aponta arras, foro,
  LGPD e comissão — é o ponto cego do filtro por `trigger_logic`.

### Produto (quando quiser)

- **Fase 3 das imobiliárias** — convite por e-mail e aceite do termo in-app pelo
  próprio corretor, no lugar do vínculo manual. Faz sentido quando o número de
  imobiliárias crescer.
- **Home do corretor** — painel consolidado pessoal. Seguro e barato (lê só o
  que ele já pode ver), mas é polimento: ele já chega em tudo pelo menu.

### O que move a conversão, e não é código

- **Prova social** — depoimentos de corretor com nome e CRECI.
- **Ver o produto funcionando** — um vídeo curto de um documento sendo gerado, no
  lugar do print estático.
- **Um canal humano** — um WhatsApp de contato.

---

*Fluxo de deploy: este repositório é um espelho de leitura do
[Skip](https://goskip.dev), onde o app roda. Mudanças chegam em produção pelo
editor do Skip, não por push aqui. Ver `DEV-README.md`.*
