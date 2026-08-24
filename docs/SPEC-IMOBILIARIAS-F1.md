# Fase 1 — Camada de equipe (imobiliárias)

Especificação para implementação. Cria o vínculo entre uma conta de
imobiliária e os corretores dela, sobre a identidade de imobiliária que **já
existe** no sistema. Não altera o comportamento do corretor autônomo.

---

## 0. Ponto de partida (não recriar)

`broker_profile.tipo_perfil` já aceita `corretor_autonomo` e `imobiliaria`, e o
perfil já carrega os campos de PJ: `razao_social`, `cnpj`, `creci_juridico`,
`responsavel_nome`, `responsavel_cpf`, `responsavel_creci`.

**A conta de imobiliária já é uma conta de usuário normal** (registro em `users`
cujo `broker_profile` tem `tipo_perfil = 'imobiliaria'`). Esta fase só adiciona
a camada de equipe.

---

## 1. Schema

### 1.1 Coleção nova: `agency_members`

| Campo | Tipo | Nota |
|---|---|---|
| `agency` | relation → **`users`**, required, maxSelect 1 | A conta PJ. Validar no hook que o `broker_profile` dela tem `tipo_perfil = 'imobiliaria'`. |
| `member` | relation → **`users`**, required, maxSelect 1 | O corretor vinculado. |
| `status` | select: `ativo`, `removido` | Default `ativo`. **Nunca deletar a linha** — remover = marcar `removido`, preservando histórico. |
| `termo_aceito_em` | date, opcional | Consentimento LGPD. **Vazio = vínculo não vale** (ver §4). |
| `created` / `updated` | autodate | Padrão. |

**Regras de integridade:**
- Índice único em (`agency`, `member`) — não duplicar vínculo.
- Um corretor pertence a **uma** imobiliária por vez: ao criar vínculo com
  `status = ativo`, recusar se já existir outro `ativo` para o mesmo `member`.

> **Por que a relation aponta para `users` e não para `broker_profile`:** o dono
> de um `negocio` é um `users.id` (campo `owner`), e as regras de acesso comparam
> com `@request.auth.id`, que também é um `users.id`. Apontar para
> `broker_profile` obrigaria um join em toda regra. O `broker_profile` é o
> *perfil* da conta, não a identidade dela.

### 1.2 Campo novo: `negocios.agency`

Relation → **`users`**, **opcional**, maxSelect 1, sem valor por padrão.

Carimba o negócio com a imobiliária do corretor **no momento da criação**.
Vazio = negócio de autônomo (comportamento atual, inalterado).

> **Por que carimbar em vez de resolver o vínculo a cada leitura:** se a
> permissão dependesse de consultar `agency_members` em toda consulta, um
> corretor que sai da imobiliária levaria o histórico junto, e o gestor perderia
> acesso a negócios que a casa intermediou. O carimbo também mantém a regra de
> acesso simples e rápida.

---

## 2. O carimbo é feito no SERVIDOR (crítico)

`createNegocio()` em `src/lib/negocios.ts` roda no **cliente** e envia `owner` a
partir do `authStore`. Se o `agency` também viesse do front, um corretor poderia
**forjar o carimbo**: enfiar um negócio na imobiliária de outro, ou tirar o
próprio negócio da vista do gestor.

**Implementar como hook de backend**, em `onRecordCreate` de `negocios`:

1. Ler o `owner` do registro sendo criado.
2. Buscar em `agency_members` um vínculo com `member = owner`, `status = ativo`
   **e** `termo_aceito_em` preenchido.
3. Se encontrar, gravar `agency` = o `agency` do vínculo. Se não, deixar vazio.
4. **Se o cliente enviar `agency`, ignorar/sobrescrever** — valor vindo do
   cliente nunca é confiável.

---

## 3. Regras de acesso

### 3.1 `negocios`

```
listRule / viewRule / updateRule:
  @request.auth.id != "" && (
    owner = @request.auth.id
    || agency = @request.auth.id
    || @request.auth.isAdmin = true
  )

createRule:  (INALTERADA — manter a que já está no ar)

deleteRule:  (mais restrita que a leitura, de propósito)
  @request.auth.id != "" && (
    owner = @request.auth.id || @request.auth.isAdmin = true
  )
```

**Repare no delete:** o gestor da imobiliária **lê e edita** os negócios da casa,
mas **não apaga** o de outro corretor. Apagar é destrutivo e assimétrico — fica
com o dono e com o admin da plataforma.

### 3.2 `agency_members`

```
listRule / viewRule:
  @request.auth.id != "" && (
    agency = @request.auth.id      // sou a imobiliaria: vejo minha equipe
    || member = @request.auth.id   // sou o corretor: vejo meu vinculo
    || @request.auth.isAdmin = true
  )

createRule / updateRule / deleteRule:
  @request.auth.isAdmin = true     // fase 1: so a Prime Circle vincula
```

### 3.3 Não alterar nesta fase

`broker_profile`, `validation_logs`, `validation_audit`, `legal_knowledge`,
`rate_limits`. A régua jurídica própria por imobiliária é a **fase 2**.

---

## 4. Termo de consentimento (bloqueante — LGPD)

O vínculo dá ao gestor acesso a **CPF, RG e endereço dos clientes** cadastrados
pelo corretor. Isso não pode ser implícito.

- O hook do §2 **só carimba** `agency` se o vínculo tiver `termo_aceito_em`
  preenchido. Sem aceite, o corretor opera como autônomo e o gestor não vê nada
  dele. A exigência é garantida pelo código, não pela lembrança de alguém.
- Na fase 1, o aceite é registrado pelo admin da plataforma no painel (com
  data), representando o combinado contratual com a imobiliária. Na fase 3 vira
  aceite in-app do próprio corretor.
- **Trilha de acesso:** quando o gestor abrir um negócio que não é dele,
  registrar o evento (quem, qual negócio, quando). Não precisa de tela — só o
  registro, para responder a um eventual questionamento.

---

## 5. Telas

### 5.1 No `/admin` (Prime Circle) — bloco novo "Imobiliárias"

Lista as contas com `tipo_perfil = 'imobiliaria'`. Ao abrir uma:
- membros atuais (`status = ativo`);
- **vincular corretor**: buscar por e-mail ou CRECI, marcar o aceite do termo
  com data, criar o vínculo;
- **remover**: marca `status = 'removido'` (não deleta a linha).

### 5.2 Nova rota `/equipe` — para o admin da imobiliária

Visível apenas quando o `broker_profile` do usuário tem
`tipo_perfil = 'imobiliaria'`. Mostra:
- membros da equipe (nome, CRECI, desde quando);
- por corretor: contagem de negócios da casa e de validações no período;
- lista dos negócios da imobiliária, levando ao detalhe já existente.

As contagens podem vir de leitura direta (as regras do §3.1 já permitem), sem
endpoint novo. Se preferir agregados, reaproveitar o padrão de
`pocketbase/hooks/admin_overview.js`, com gate próprio.

---

## 6. Critérios de aceite

Confirmar os sete ao final:

1. Corretor **sem** vínculo: nada muda — vê só os próprios negócios.
2. Corretor **com** vínculo e termo aceito: novo negócio nasce com `agency`
   preenchido **pelo servidor**.
3. Corretor com vínculo **sem** termo: negócio nasce **sem** `agency`; o gestor
   não vê.
4. Gestor da imobiliária A **não** vê nada da imobiliária B.
5. Gestor **não** consegue apagar negócio de um corretor da equipe.
6. Corretor comum **não** consegue criar nem editar `agency_members` (403).
7. Front enviando `agency` forjado no create: valor **ignorado** pelo servidor.

---

## 7. Entrega

- Tudo em **migrations versionadas** (padrão dos arquivos em
  `pocketbase/migrations/`).
- Fases seguintes, fora deste escopo: **fase 2** — régua jurídica própria por
  imobiliária (`legal_knowledge.agency` + filtro explícito no carregamento da
  base pelo validador, que usa `$app` e ignora as API rules); **fase 3** —
  convite por e-mail substituindo o vínculo manual.
