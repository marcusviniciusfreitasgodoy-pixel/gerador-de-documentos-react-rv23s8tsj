# CLAUDE.md — Guia do Projeto e Memória de Trabalho

> Este arquivo é lido automaticamente pelo Claude Code no início de **toda sessão**,
> em **qualquer máquina** (escritório, Mac de casa, etc.). Ele é a memória viva do
> projeto. Sempre que terminarmos um trabalho, atualizamos a seção **"Próximos passos"**
> e fazemos commit + push. Assim o contexto nunca se perde entre sessões.

---

## 📋 O que é o projeto

**Gerador de Documentos Imobiliários** — aplicação web para corretores/imobiliárias
gerarem documentos jurídicos imobiliários (promessas, compromissos, termos, etc.),
com validação de minutas e suporte de especialista (IA + humano).

## 🧱 Stack técnica

- **React 19** + **Vite** + **TypeScript**
- **Shadcn UI** + **Tailwind CSS** (componentes em `src/components/ui/`)
- **React Router** (rotas em `src/App.tsx`)
- **React Hook Form** + **Zod** (formulários e validação)
- **PocketBase** — backend/banco (`src/lib/pocketbase/`)
- **Skip AI** — recursos de IA (`src/lib/skipAi.ts`)
- Geração de `.docx` via helpers em `src/lib/`

## 🗺️ Rotas / páginas (`src/pages/`)

| Rota | Página | Função |
|------|--------|--------|
| `/login`, `/signup` | Login / Signup | Autenticação |
| `/` | Index | Home — seleção de documentos |
| `/validar` | ValidarMinuta | Validação de minuta de contrato |
| `/legal-knowledge` | LegalKnowledge | Base de conhecimento jurídico |
| `/especialista` | ExpertSupport | Lista de solicitações de suporte |
| `/especialista/nova` | ExpertSupportNew | Nova solicitação |
| `/especialista/:id` | ExpertSupportDetail | Detalhe (IA N1 + humano N2) |
| `/perfil` | MyProfile | Perfil do corretor |

Rotas protegidas por `ProtectedRoute`.

## 📄 Geradores de documentos (`src/components/*Form.tsx`)

Checklist · Compromisso · Intermediação (Proposta/Promise) · Promessa À Vista ·
Promessa FGTS · Promessa Financiada · Termo de Chaves · Termo de Posse.

Cada gerador segue o mesmo padrão:
`Form.tsx` (UI + react-hook-form) → `*Helpers.ts` (schema Zod + defaults) →
`*Template.ts` (mapeia dados → placeholders) → `*Docx.ts` (monta o `.docx`).

## 🗄️ Backend (PocketBase)

Coleções: `users`, `legal_knowledge`, `broker_profile`, `app_templates`,
`validation_logs`, `validation_audit`, `expert_support_requests`, `expert_proposals`.

Fluxo de suporte de especialista: `Recebida → Proposta Enviada → Aceita/Recusada → Concluída`.

## ⚙️ Comandos úteis

```bash
npm install        # instalar dependências (necessário em sessão nova)
npm run dev        # rodar localmente (http://localhost:5173)
npm run build      # build de produção
npm run lint       # oxlint
npm run format     # oxfmt
# Obs.: não há testes automatizados neste projeto.
```

---

## 🔄 Como manter a continuidade entre máquinas (IMPORTANTE)

O trabalho só "viaja" entre o escritório e o Mac de casa se estiver no **GitHub**.

- **A conversa/sessão** viaja sozinha pela conta Claude (basta logar em `claude.ai/code`
  com o mesmo usuário — as sessões aparecem em "Recentes").
- **O código** só persiste após **commit + push**. Ao terminar de trabalhar, peça:
  *"faz commit e push"*.
- **O contexto/próximos passos** persiste neste `CLAUDE.md` (commitado).

Ao começar em outra máquina: as dependências não vêm instaladas na sessão web —
rode `npm install` se for executar o app.

---

## ✅ Próximos passos (lista viva — atualizar a cada sessão)

_Última atualização: 2026-08-12_

**Estado atual:** projeto estável e funcional. Branch de trabalho:
`claude/last-contact-action-review-2oa1uz`. Sem PRs abertos. Sem trabalho pela metade
identificado no código.

**Última alteração real de código:** suporte a **FGTS na composição de preço** na
Promessa Financiada (`PromessaFinanciadaForm.tsx`) — verificado como completo
(formulário → validação Zod → template `.docx`).

### 🏠 Estudo de Mercado: padrão fechado em 12/08/2026

O modelo de avaliação foi calibrado com um segundo caso real (**Av. Lúcio Costa, 3.606,
Condomínio Beton, Barra da Tijuca**, um apartamento) e virou **padrão oficial de estrutura e
apresentação** para todos os estudos futuros.

**Documentação, em `docs/`:**
- 📄 `modelo-relatorio-avaliacao-imovel.md` — **v2 do método**, com 11 calibrações sobre a v1.
  As mais importantes: estratificação por faixa de área (fator de escala), remoção do
  auto-comparável, âncora dominial, reconciliação de fontes automatizadas e teste de
  viabilidade do preço pretendido.
- 📄 `estudo-de-mercado/PROTOCOLO-ESTUDO-DE-MERCADO.md` — **protocolo operacional**: perguntas
  de abertura, fontes públicas apuradas sem pedir ao cliente (ITBI e IPTU via API da Fazenda,
  entorno via OpenStreetMap), estrutura das 13 páginas, sistema de design, regras de
  confidencialidade e checklist de auditoria.
- 📄 `estudo-de-mercado/MODELO-estudo-de-mercado.html` — **documento aprovado**, A4, 13 páginas,
  autossuficiente, com logos em base64. Base para copiar. Gerar o PDF com Chrome headless.

**Decisões que valem para todos os estudos:**
- O documento se chama **Estudo de Mercado**, não "Relatório de Avaliação": evita a conotação de
  PTAM da NBR 14.653, coerente com as ressalvas que ele declara.
- **O valor só aparece na Seção 07**, ao final. A Seção 01 traz identificação e um roteiro.
- **Sem percentuais de ajuste por atributo** e sem número isolado para o valor de um atributo.
- **Todo preço é preço de venda com a comissão de 5% dentro**, sempre com a coluna de líquido.
- **Nada que só fonte confidencial forneça** entra no documento do cliente. Certidão gera uma
  nota interna separada, que **não é versionada** por conter dado pessoal.

### A fazer (preencher conforme surgir)
- [ ] Decidir se o estudo de mercado vira um **gerador no app**
      (`Form → Helpers → Template → Docx`), com cálculo automático (média, desvio, CV,
      estratificação, convergência) e saída no layout já aprovado — feature nova e faseada.
- [x] ~~Analisar o layout visual e replicar o design entregue ao cliente~~ — feito: o layout
      está implementado em `MODELO-estudo-de-mercado.html`.
- [x] ~~Testar o modelo com um novo imóvel real para calibrar o molde~~ — feito com o
      Av. Lúcio Costa 3.606; gerou 11 calibrações no método.

### Ideias / backlog
- [ ] Automatizar a apuração de ITBI e IPTU dentro do app, hoje feita por chamada direta à API
      ArcGIS da Fazenda do Rio (endpoints no protocolo).

> 💡 Dica: sempre que decidir "amanhã eu mexo em X", anote em **A fazer** acima e peça
> *"faz commit e push"*. Assim você retoma exatamente daqui, em qualquer máquina.
