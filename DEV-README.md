# Gerador de Documentos: guia para desenvolvedores

Plataforma web que gera contratos e documentos da intermediação imobiliária em Word (.docx),
valida minutas de terceiros com IA e centraliza os dados da operação. Em produção, com clientes
reais: https://documentos.primecircle.app.br

Este arquivo é o ponto de entrada para quem vai trabalhar no código. Leia até o fim antes do
primeiro commit: o fluxo de deploy aqui não é o convencional.

---

## 1. Antes de tudo: como o código chega em produção

O projeto **não** é buildado a partir deste repositório. Ele vive dentro do **Skip**
(https://goskip.dev), um construtor de apps com editor web próprio. Este repositório é um
**espelho de leitura**, atualizado quando alguém clica em "Sincronizar" no Skip.

```
   Skip (editor web)  ──── Aplicar ────>  app em produção
          │
          └──── Sincronizar (manual) ────>  este repositório (GitHub)
```

Consequências práticas, todas importantes:

- **Push aqui não chega em produção.** Um pull request aprovado ainda precisa ser colado, arquivo
  por arquivo, no editor do Skip. Não existe CI/CD ligando os dois lados.
- **O espelho pode estar atrasado.** Confira a data do último commit antes de assumir que é o
  estado atual. Em caso de dúvida, a fonte da verdade é o download do projeto pelo próprio Skip.
- **O Skip não cria arquivos novos.** Código novo precisa entrar em arquivo que já existe. Por isso
  há componentes convivendo em arquivos que, num projeto normal, seriam separados (a página
  `/ajuda` mora em `src/pages/ExpertSupport.tsx`, o `IntroPagina` e o `BotaoDadosTeste` moram em
  `src/components/Layout.tsx`). Não é desleixo, é a restrição da ferramenta.

Fluxo recomendado: proponha as mudanças aqui (branch + PR, com o arquivo **inteiro** já formatado),
combine a revisão, e quem tem acesso ao Skip cola e aplica.

---

## 2. Stack

| Camada      | O que é                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| Front-end   | React 19, TypeScript, Vite, React Router 7, Tailwind, shadcn/ui                |
| Formulários | react-hook-form + zod                                                          |
| Documentos  | docxtemplater (gera .docx a partir de templates)                               |
| Back-end    | PocketBase (banco + auth + rotas HTTP em JS) hospedado pelo Skip               |
| IA          | Chamada direta à API da Anthropic e do Gemini a partir dos hooks do PocketBase |
| Qualidade   | oxlint + oxfmt (não é ESLint/Prettier)                                         |

## 3. Mapa do repositório

```
src/
  pages/         15 telas (hub, negócios, validador, especialista, ajuda, perfil, login…)
  components/    23 componentes; os *Form.tsx são um por tipo de documento
  lib/           45 arquivos: geração de .docx, helpers por documento, cliente PocketBase
  services/      chamadas ao back-end agrupadas por domínio
  hooks/         use-auth (sessão e permissões), use-realtime
pocketbase/
  hooks/         2 arquivos JS que rodam no servidor: rotas de IA, e-mails, retenção LGPD
  migrations/    14 migrações de schema
```

**Uma convenção que economiza tempo:** cada tipo de documento tem o trio
`XForm.tsx` (tela) + `xHelpers.ts` (regras e cálculos) + `xDocx.ts` (montagem do arquivo Word).
Ao mexer num documento, os três costumam andar juntos.

## 4. Rodando local

```bash
npm install
npm run dev
```

O `.env` aponta o front para o PocketBase hospedado. Rodando local você usa o **banco de produção**,
com dados reais de clientes. Trate como produção: nada de apagar registros para testar.

Verificação antes de propor mudança (não há suíte de testes automatizados):

```bash
npx tsc -b --force    # baseline conhecida: 21 erros pré-existentes, não introduza novos
npx oxlint src        # baseline conhecida: 15 avisos
npm run build         # precisa passar
npx oxfmt <arquivos>  # rode antes de propor: o Skip reformata e gera diff falso
```

> `npx tsc --noEmit` na raiz retorna 0 erros de forma enganosa. Use `tsc -b`.

## 5. Modelo de dados (PocketBase)

| Coleção                                        | Papel                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `users`                                        | contas; `verified` libera o acesso, `isAdmin` marca administrador             |
| `negocios`                                     | dossiê da operação: partes e imóvel, reaproveitados por todos os documentos   |
| `broker_profile`                               | dados do corretor que saem impressos nos contratos                            |
| `legal_knowledge`                              | régua jurídica usada pelo validador. **Somente admin**, no front e nas regras |
| `validation_logs` / `validation_audit`         | histórico das validações. Expurgo automático em 30 dias (LGPD)                |
| `expert_support_requests` / `expert_proposals` | fluxo de suporte especializado e propostas                                    |
| `chamados`                                     | sugestões e chamados de suporte abertos pelos usuários                        |

As regras de acesso de cada coleção são a real camada de segurança. O padrão é
`dono ou admin`; nunca afrouxe para `@request.auth.id != ""` sem entender o que a coleção guarda.

## 6. Segurança: o que não pode ser quebrado

- **Acesso.** Conta nova nasce bloqueada e libera sozinha quando o usuário confirma o e-mail
  (`verified`). A checagem existe no front **e** no topo das 4 rotas de IA do servidor. Se mexer no
  fluxo de login, os dois lados precisam continuar de pé.
- **Chaves de IA.** Ficam nos secrets do Skip, lidas com `$secrets.get`. Nunca no código, nunca
  no `.env`, nunca em log.
- **Dados pessoais.** O banco tem CPF, RG e endereço de clientes reais. Não exporte, não copie
  para ambiente de teste, não cole em ferramenta externa.
- **Retenção.** O expurgo de 30 dias dos logs de validação é compromisso de LGPD assumido com os
  usuários. Não desative.

## 7. Convenções de escrita (produto em português do Brasil)

- **Nada de travessão (— ou –) em texto visível ao usuário.** Use dois-pontos, vírgula ou ponto.
  Vale para rótulos, mensagens, e-mails e textos de ajuda; não vale para o corpo dos contratos
  gerados, onde a formatação jurídica é intencional.
- Linguagem para corretor, não para desenvolvedor: prefira "o dono autoriza você a vender o imóvel"
  a "outorga de autorização de venda".
- Toda página de funcionalidade abre com um bloco `IntroPagina` explicando o que ela faz e para
  quem serve.

## 8. Onde está o contexto que o código não conta

O histórico de decisões, as armadilhas conhecidas do Skip e o estado de cada funcionalidade estão
no `HANDOFF.md`, no repositório privado `gerador-documentos-artefatos` (o topo do arquivo é sempre
o mais recente). Peça acesso: é a leitura que mais economiza tempo antes de tocar em qualquer coisa.
