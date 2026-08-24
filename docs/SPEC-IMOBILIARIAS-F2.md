# Fase 2 — Régua jurídica própria por imobiliária

Permite que cada imobiliária tenha suas próprias regras em `legal_knowledge`,
usadas na validação de minutas dos corretores da casa. Entrega a promessa da
landing page: _"a régua jurídica é sua, sob controle do administrador da conta"_.

Pré-requisito: **fase 1 no ar** (`agency_members`, `negocios.agency`,
`docs/SPEC-IMOBILIARIAS-F1.md`).

---

## 1. O ponto crítico desta fase

`legal_knowledge` é carregada nos hooks com **`$app.findRecordsByFilter`**, que
roda com privilégio de aplicação e **ignora completamente as API rules da
coleção**.

> **Consequência:** mudar a `listRule` de `legal_knowledge` **não filtra nada**
> na validação. O isolamento entre imobiliárias tem que ser feito **no filtro de
> cada consulta**, dentro do hook. Não existe atalho por regra de acesso.

### 1.1 Os quatro pontos de carregamento

Em `pocketbase/hooks/validar_minuta.js` existem **quatro** consultas a
`legal_knowledge`, duas em cada rota:

| Rota             | Linha aprox. | Consulta                                              |
| ---------------- | ------------ | ----------------------------------------------------- |
| `validar-minuta` | ~213         | filtro por `trigger_logic` (quando há `documentType`) |
| `validar-minuta` | ~227         | **fallback `'1=1'`**                                  |
| `consultar-ia`   | ~743         | filtro por `trigger_logic`                            |
| `consultar-ia`   | ~756         | **fallback `'1=1'`**                                  |

**Os quatro precisam do filtro de escopo.** Se um só escapar, a régua vaza.

O **fallback `'1=1'` é o mais perigoso**: ele dispara sempre que o filtro por
tipo não retorna nada — exatamente o caso de uma imobiliária que ainda não tem
regra própria daquele tipo de documento. Sem escopo, ele carregaria a base
inteira de todas as imobiliárias.

---

## 2. Schema

### 2.1 Campo novo: `legal_knowledge.agency`

Relation → **`users`**, **opcional**, maxSelect 1.

- **Vazio** = regra **global** da Prime Circle. Vale para todos. É o
  comportamento de hoje, e todas as regras existentes continuam assim.
- **Preenchido** = regra **própria daquela imobiliária**. Só entra na validação
  dos corretores vinculados a ela.

Adicionar índice em `agency` (as consultas passam a filtrar por ele).

> Não criar coleção separada: mesma estrutura, mesmo formato de `code`,
> `trigger_logic` e `priority`. Uma coleção só mantém o carregamento simples e
> permite a mescla do §3.

---

## 3. Como a base é montada (regra de mescla)

Para cada validação, resolver a imobiliária do autor e montar a base assim:

1. Resolver `agencyId` = imobiliária do usuário autenticado, via
   `agency_members` (`member = auth.id`, `status = 'ativo'`,
   `termo_aceito_em != ''`). Sem vínculo → `agencyId` vazio.
2. Carregar as regras **globais** (`agency = ''`).
3. Se houver `agencyId`, carregar também as regras **daquela** imobiliária
   (`agency = {:agencyId}`).
4. **Mesclar por `code`, com a regra da imobiliária vencendo** a global de mesmo
   `code`. Assim a casa pode _sobrescrever_ uma cláusula padrão, não só somar.
5. Ordenar o resultado por `priority` decrescente e aplicar o teto atual (50
   registros / 50 KB, como já é hoje).

**Filtro de escopo, em todos os quatro pontos:**

```
(agency = '' || agency = {:agencyId})
```

Combinado com o filtro existente. Por exemplo, no ponto com `trigger_logic`:

```
(agency = '' || agency = {:agencyId}) && (trigger_logic ~ {:dt} || trigger_logic = {:todos})
```

E no fallback, que hoje é `'1=1'`:

```
(agency = '' || agency = {:agencyId})
```

Quando `agencyId` estiver vazio, o filtro deve resultar em **apenas as globais**
(`agency = ''`). Cuidado para não montar uma expressão que, com parâmetro vazio,
case com tudo.

---

## 4. Quem pode editar o quê

`legal_knowledge` hoje é `@request.auth.isAdmin = true` em todas as operações.
Passa a:

```
listRule / viewRule:
  @request.auth.isAdmin = true
  || (agency != '' && agency = @request.auth.id)

createRule:
  @request.auth.isAdmin = true
  || (@request.auth.id != "" && agency = @request.auth.id)

updateRule / deleteRule:
  @request.auth.isAdmin = true
  || (agency != '' && agency = @request.auth.id)
```

**Efeitos:**

- O gestor da imobiliária lê e edita **só as próprias** regras. Não vê nem toca
  nas globais, nem nas de outra imobiliária.
- A Prime Circle continua com controle total.
- O corretor comum **não** lê `legal_knowledge` pela API (segue como hoje) — ele
  recebe o efeito da régua através da validação, não a régua em si.

> **Atenção:** o `create` precisa impedir que o gestor crie regra com
> `agency = ''` (que viraria global) ou com o `agency` de outra imobiliária. A
> regra acima cobre (`agency = @request.auth.id`), mas **validar também no
> servidor**, num hook `onRecordCreate`/`onRecordUpdate` de `legal_knowledge`:
> se o autor não for admin da plataforma, forçar
> `agency = @request.auth.id`, sobrescrevendo o que vier do cliente — mesmo
> princípio do carimbo da fase 1.

---

## 5. Tela

Na rota `/equipe` (já criada na fase 1), aba ou seção nova: **"Régua da casa"**.

- Lista as regras próprias da imobiliária (`agency = auth.id`).
- Criar, editar e remover regra própria — mesmos campos de `legal_knowledge`
  (`title`, `category`, `code`, `trigger_logic`, `content`, `priority`).
- Deixar visível que **regras globais da Prime Circle continuam valendo**, e que
  uma regra da casa com o mesmo `code` **substitui** a global.
- Não listar nem permitir editar regras globais.

Pode reaproveitar os componentes da página `/legal-knowledge` que já existe.

---

## 6. Critérios de aceite

1. Corretor **sem** vínculo: validação usa **só** as regras globais — resultado
   idêntico ao de hoje.
2. Corretor da imobiliária A: validação usa globais **+** as regras de A.
3. Corretor da imobiliária A **nunca** recebe regra da imobiliária B — conferir
   nos **quatro** pontos de carregamento, incluindo os dois fallbacks.
4. Regra da casa com o mesmo `code` de uma global **substitui** a global (não
   duplica na base enviada à IA).
5. Gestor de A **não** lê nem edita regras globais nem as de B (403).
6. Gestor tentando criar regra com `agency` vazio ou com o id de B: o servidor
   **força** `agency = @request.auth.id`.
7. Teto de tamanho preservado: a base mesclada continua respeitando o limite de
   50 registros / 50 KB, sem reintroduzir o truncamento resolvido antes.

---

## 7. Entrega

- Migrations versionadas, seguindo o padrão de `pocketbase/migrations/`.
- **Nenhuma alteração** em `broker_profile`, `validation_logs`,
  `validation_audit`, `rate_limits`, `agency_members`, `access_logs`.
- Fase 3 (fora deste escopo): convite por e-mail e aceite do termo in-app pelo
  próprio corretor, substituindo o vínculo manual pelo admin.
