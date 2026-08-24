# Fase 3 — Convite por e-mail e aceite do termo in-app

Substitui o vínculo manual da fase 1 pelo convite: a imobiliária convida por
e-mail, e quem aceita é o próprio corretor, dentro do app, depois de ler o que
a casa passa a ver.

Pré-requisitos: fases 1 e 2 no ar (`agency_members`, `negocios.agency`,
`legal_knowledge.agency`).

---

## 1. O problema que esta fase resolve

Na fase 1 o vínculo nascia no painel `/admin`: o administrador da plataforma
buscava o corretor, digitava a data do aceite do termo e criava a linha. O
carimbo em `negocios.agency` só valia com `termo_aceito_em` preenchido, então a
exigência de consentimento estava garantida pelo código.

Só que **quem afirmava o consentimento era o administrador**, não o titular dos
dados. A data representava um combinado contratual fechado fora do app. Isso
funciona enquanto há duas ou três imobiliárias e todas passam pela Prime
Circle; não funciona como base de consentimento de LGPD, e não escala.

Aqui o corretor lê o termo e aceita ele mesmo, e o servidor carimba a hora.

---

## 2. Schema

### 2.1 Coleção nova: `agency_invites`

| Campo           | Tipo                                                              | Nota                                                                                                          |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `agency`        | relation → `users`, required                                      | A conta PJ que convidou.                                                                                      |
| `email`         | email, required                                                   | Destino. Guardado com o e-mail **exato da conta** quando ela já existe; normalizado em minúsculas quando não. |
| `member`        | relation → `users`, opcional                                      | Preenchido na resposta. Antes disso o convidado pode nem ter conta.                                           |
| `convidado_por` | relation → `users`, opcional                                      | Gestor ou admin que emitiu. Auditoria.                                                                        |
| `status`        | select: `pendente`, `aceito`, `recusado`, `cancelado`, `expirado` |                                                                                                               |
| `token`         | text, required                                                    | Só para o link do e-mail achar o convite. **Não é credencial** (§3).                                          |
| `expira_em`     | date                                                              | 14 dias. Renovado no reenvio.                                                                                 |
| `respondido_em` | date                                                              |                                                                                                               |

**Índices:**

- `token` único.
- (`agency`, `email`) único **parcial** onde `status = 'pendente'`: a mesma casa
  não empilha convites pendentes para o mesmo endereço. Recusados e cancelados
  não bloqueiam um convite novo depois.

**Regras de acesso:**

```
listRule / viewRule:
  @request.auth.id != "" && (
    agency = @request.auth.id       // a casa vê o que emitiu
    || email = @request.auth.email  // o convidado vê o que é dele
    || @request.auth.isAdmin = true
  )

createRule / updateRule / deleteRule:  null   (só superuser)
```

Toda escrita passa pelos endpoints do §4. Mesmo princípio do carimbo da fase 1:
campo que decide permissão não se aceita do cliente.

### 2.2 O que NÃO muda

`agency_members` continua com `create/update/delete` **admin-only**. O aceite
grava com `$app.saveNoValidate`, que roda com privilégio de aplicação. O
critério 6 da fase 1 (corretor comum recebe 403 ao tentar escrever em
`agency_members`) segue valendo palavra por palavra.

Nada muda em `negocios`, `broker_profile`, `legal_knowledge`, `access_logs`,
`validation_logs`, `validation_audit`.

---

## 3. O token não é credencial (ponto crítico)

O link do e-mail carrega `?convite=<token>`. Ele serve para a tela abrir o
convite certo, e **não autoriza nada**.

A autorização do aceite é a comparação, no servidor, entre o e-mail do convite
e o e-mail da conta autenticada, sem diferenciar maiúsculas. Consequências:

- Token vazado (encaminhamento do e-mail, log de proxy, histórico do
  navegador) não vincula ninguém: quem clicar precisa estar logado naquela
  conta.
- Não existe fluxo de "aceitar sem conta". Sem conta, o link leva ao cadastro;
  o convite aparece in-app depois que o e-mail for confirmado.
- O reenvio **não troca o token**, justamente porque ele não é segredo, e
  trocá-lo quebraria o primeiro link se por acaso ele tiver chegado.

O aceite também exige `verified`, como as rotas de IA.

---

## 4. Endpoints (`pocketbase/hooks/agencia_convites.js`)

| Rota                                         | Quem                                    | O que faz                                              |
| -------------------------------------------- | --------------------------------------- | ------------------------------------------------------ |
| `POST /backend/v1/agencia/convites`          | gestor (ou admin com `agency` no corpo) | Cria o convite e dispara o e-mail.                     |
| `POST /backend/v1/agencia/convites/reenviar` | dono do convite ou admin                | Reenvia e renova o prazo.                              |
| `POST /backend/v1/agencia/convites/cancelar` | dono do convite ou admin                | Marca `cancelado`.                                     |
| `GET /backend/v1/convites/meus`              | qualquer conta                          | Convites pendentes para o e-mail dela + vínculo ativo. |
| `POST /backend/v1/convites/responder`        | o convidado                             | `aceitar` ou `recusar`.                                |
| `POST /backend/v1/vinculo/sair`              | o corretor vinculado                    | Revoga o consentimento.                                |
| `POST /backend/v1/agencia/membros/remover`   | gestor ou admin                         | Encerra o vínculo de um membro.                        |

Quatro decisões que valem registrar:

- **`GET /convites/meus` é endpoint, não leitura direta.** Razão social e CRECI
  da imobiliária moram em `broker_profile`, que é owner-scoped: o corretor não
  lê o perfil de ninguém. Sem isso ele veria um convite de um id opaco. O
  endpoint devolve **só** nome, CNPJ e CRECI da casa que o convidou.
- **O "já está em outra imobiliária" é checado no ACEITE, não no convite.**
  Responder isso ao gestor entregaria a ele um dado do corretor que não é dele.
  No aceite a resposta vai para quem tem direito a ela: o próprio corretor, com
  o nome da casa onde ele está e o caminho para sair.
- **O corpo do e-mail é fixo.** Não existe campo de recado livre. Com ele, o
  convite viraria um canal de envio de texto arbitrário para endereços
  arbitrários, assinado pelo domínio da Prime Circle. Só o nome e o CRECI da
  imobiliária (lidos do perfil dela) entram no texto.
- **Rate limit de 5 por minuto** por conta, na mesma coleção `rate_limits` e no
  mesmo padrão fail-open das rotas de IA. É bem mais apertado que o das rotas
  de IA porque cada chamada aqui dispara um e-mail para um endereço escolhido
  por quem chama.

Falha de envio **não** invalida o convite: ele fica pendente e aparece in-app.
A resposta traz `email_enviado`, e a tela oferece o reenvio.

Convite vencido é marcado `expirado` na leitura de `/convites/meus`. Não vale um
cron próprio: um convite vencido só atrapalha no momento em que alguém olha
para ele.

---

## 5. O termo, e a revogação

O texto lido antes do aceite diz três coisas, nesta ordem:

1. **O que a imobiliária passa a ver:** os negócios criados a partir do aceite,
   com nome, CPF, RG e endereço das partes cadastradas neles; a contagem de
   negócios e de validações; e a régua da casa passa a valer nas validações.
2. **O que ela não vê:** os negócios anteriores ao aceite, o texto das minutas
   validadas (o endpoint da equipe devolve só números), e apagar continua sendo
   só do dono e do admin da plataforma.
3. **Que dá para sair a qualquer momento**, pelo perfil, sem pedir a ninguém.

A **revogação** (`POST /backend/v1/vinculo/sair`) é contrapartida do aceite
in-app, e não um extra: consentimento que só a outra parte consegue desfazer não
é consentimento. O efeito é idêntico ao da remoção pelo gestor (fase 1): status
vira `removido`, a linha não é apagada, os negócios já carimbados continuam com
a casa que os intermediou, e os novos nascem sem carimbo. **A tela diz isso
antes de confirmar**, porque a expectativa natural de quem clica em "sair" é que
o passado também suma.

A **remoção pelo gestor** entrou junto pela mesma razão: com o convite, ele
monta a equipe sem depender do admin da plataforma, e "entra sozinho mas
precisa de chamado para sair" seria uma assimetria estranha. Também é endpoint,
e não regra de API: abrir `agency_members` para update do gestor colocaria
`termo_aceito_em` ao alcance de quem não é o titular do consentimento, que é
exatamente o que esta fase tirou das mãos dele.

---

## 6. Telas

- **`/equipe` (gestor):** bloco "Convites" com o campo de e-mail, a lista de
  pendentes (com prazo, reenviar e cancelar) e o histórico. Botão de remover em
  cada membro ativo.
- **Faixa de aviso (qualquer tela):** aparece quando há convite pendente e some
  no resto do tempo. Mora no `Layout`, **fora** do `ErrorBoundary`: se a tela de
  baixo quebrar, o corretor ainda vê e responde o convite. Um convite que só
  existisse no perfil seria um convite que ninguém vê.
- **`/perfil`:** bloco "Minha imobiliária" com o vínculo atual, a data do
  aceite, os convites pendentes e o botão de sair. Some para quem é autônomo e
  não foi convidado por ninguém.
- **`/admin`:** convite por e-mail em nome de qualquer imobiliária. O vínculo
  manual da fase 1 **continua**, recolhido atrás de "Vínculo manual (exceção)" e
  rotulado como tal: é a única saída quando o e-mail não chega de jeito nenhum e
  a casa precisa operar hoje. Tirá-lo deixaria a operação sem rede.

---

## 7. Critérios de aceite

1. Corretor sem convite e sem vínculo: nada muda, nenhuma faixa aparece.
2. Convite para e-mail **com** conta: chega o e-mail, e a faixa aparece in-app
   assim que ele entra.
3. Convite para e-mail **sem** conta: o link leva ao cadastro; depois de criar a
   conta com aquele e-mail e confirmar, o convite aparece.
4. Aceite: `agency_members` nasce (ou reativa) com `status = 'ativo'` e
   `termo_aceito_em` **preenchido pelo servidor**. Conferir no banco, não no
   código. O próximo negócio dele nasce com `agency` carimbado.
5. Conta logada em **outro** e-mail respondendo o convite (id ou token na mão):
   **403**.
6. Corretor já ativo na imobiliária A aceitando convite de B: **409**, com o
   nome de A e a instrução de sair primeiro.
7. Convite vencido: aceite recusado, e o registro passa a `expirado`.
8. Corretor comum tentando criar/editar `agency_invites` ou `agency_members`
   direto pela API: **403** (as regras de escrita são `null` e admin-only).
9. Gestor de A lendo convites de B: lista vazia.
10. Sair pelo perfil: vínculo vira `removido`, negócios já carimbados continuam
    visíveis ao gestor, o próximo negócio nasce sem `agency`.
11. Exclusão de conta com convites e vínculos: a conta **é excluída** (a cascata
    foi estendida, §8).

---

## 8. Um conserto que veio junto

A exclusão de usuário em cascata (`extrair_dados.js`) não conhecia
`agency_members`, `access_logs` nem, agora, `agency_invites`. As três apontam
para `users` com relação **obrigatória e sem cascade**, então o banco **recusava
excluir** qualquer conta com vínculo de equipe, e o painel mostrava "excluído"
de forma enganosa. O mesmo valia para `access_logs.negocio`: a linha é criada
pelo _gestor_, não pelo dono do negócio, então não saía pelo filtro por usuário
e travava a exclusão dos negócios.

É um buraco aberto desde a fase 1, e apagar a conta é obrigação de LGPD. Entrou
aqui porque esta fase acrescentaria uma quarta relação ao mesmo problema.

---

## 9. Entrega

- Migration `1900000032_create_agency_invites`.
- Hook novo `pocketbase/hooks/agencia_convites.js`.
- Front: `src/components/ConviteImobiliaria.tsx` (novo), e alterações em
  `Layout.tsx`, `MyProfile.tsx`, `Equipe.tsx`, `admin/AgenciasBlock.tsx` e
  `services/agencies.ts`.
