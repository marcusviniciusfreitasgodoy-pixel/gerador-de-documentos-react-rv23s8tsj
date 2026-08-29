---
description: Entrega os arquivos pendentes para colar no chat do Skip e confere cada um por diff
---

Este comando carrega o estado da entrega e o método. Leia a tabela, veja o que
está pendente, e conduza dali.

## Como o código entra no Skip (não invente outro caminho)

O painel "Editar Código" do Skip é **somente leitura** (`readOnly: true` no
textarea do Monaco, cursor escondido). Quem grava os arquivos é o agente do
próprio Skip, pelo **chat**. É por isso que o `.skip.config.json` mantém uma
lista `preventAI`.

O ciclo é: o dono do projeto copia o arquivo do GitHub (botão **Raw**, no
navegador), cola no chat do Skip com o pedido, aplica, e depois **baixa o
projeto e diffa** contra esta branch.

**Nunca automatize esse paste pelo navegador, e nunca use a área de
transferência do sistema.** A regra de ouro do projeto (`COMO_RETOMAR.md`, no
repositório `gerador-documentos-artefatos`) registra que o clipboard corrompeu
o arquivo em **2 de 6** tentativas, com mojibake do `pbcopy` e uma corrida que
trocou o arquivo por três linhas aleatórias. Pior: `pbcopy | pbpaste` **passa
falso**, porque os dois erram na mesma direção. Copiar da página Raw, dentro do
navegador, não toca no clipboard do sistema.

**A contagem de linhas que o Skip informa não vale como conferência.** Ele já
relatou 1.047 para um arquivo de 1.050 que estava íntegro. Não peça o número e
não decida por ele. O diff é a única prova.

## Onde estamos (29/08/2026, versão 0.0.803 do Skip)

**Pende de colagem: `src/pages/Planos.tsx`, e só ele.**

Preço do avulso: R$ 349 é o valor final, e R$ 149 é o que se cobra **até
31/12/2026**. A página mostra R$ 149 como preço, com selo "Preço de lançamento"
no cartão e a data em que muda escrita em três lugares. **Sem preço riscado, de
propósito:** R$ 349 nunca foi cobrado de ninguém, e "de R$ 349 por R$ 149" seria
desconto sobre preço que não existiu, que é a metade do dobro que este público
reconhece de olhos fechados.

Conferido antes de entregar: `tsc -b` 0 erros, `oxlint src` 16 avisos (baseline),
build passa, `oxfmt` aplicado, nenhum travessão. Renderizado em Chromium a 1440,
1024 e 390: o selo aparece nas três larguras, sem rolagem horizontal e sem cartão
desalinhado.

**O que muda em 31/12/2026, e ninguém além de você vai lembrar:** não existe
janela promocional no código. Trocar R$ 149 por R$ 349 é uma rodada de colagem
deste mesmo arquivo, em quatro pontos (a constante `PLANOS`, a nota do cartão, o
bloco "A partir do quinto negócio" e "A conta de referência"), mais tirar o selo.
O comentário de cabeçalho do arquivo lista os quatro. A data é compromisso de
gente, não cron.

Antes disso, o download anterior fechou com 219 arquivos comparados e nenhuma
diferença de código: as duas únicas divergências eram linha em branco, e a versão
do Skip foi adotada nas duas.

O que entrou hoje, em ordem: mensagens de erro em português, avisos de pendência
para o admin (o pedido de especialista não notificava ninguém), item do Painel no
menu, bloqueio do plano vencido com aviso de 7 e 3 dias, preço do avulso a
R$ 149 com o ano em destaque, abas mensal e anual, contadores de uso de IA, e o
avulso como plano de primeira classe.

**O que espera VOCÊ, não o Skip:**

1. **Testar o avulso ponta a ponta**, na conta de teste. É a primeira trava de
   verdade da plataforma: carimbar o Avulso no `/admin` (o botão é novo e é a
   única peça que não foi renderizada), validar uma minuta, tentar a segunda e
   ver a recusa, e deixar o prazo vencer para ver a tela "Seu avulso terminou".
2. **Testar a assinatura vencida**, que também nunca rodou contra registro real:
   `plano_renova_em` de ontem, e conferir que a TELA e o SERVIDOR barram juntos.
   Se a tela barra e o servidor deixa passar, a metade que importa não funciona.
3. **Login com senha errada** e os e-mails reais (redefinição de senha e convite
   de equipe), para ver as frases novas e a marca "DOCS".
4. **Medir o custo de uma validação** no log contra os tetos de 20 e 60. Agora
   existe contador; é o último item antes de cobrar.
5. **Limpar da fila os 6 itens de teste** e convidar os primeiros corretores.

**Duas promessas da página que o produto ainda não cumpre**, e é decisão, não
esquecimento: os tetos de 10 e 30 operações e as 20 e 60 validações são contados
e avisados, mas não barram. A recomendação é continuar assim enquanto os números
forem hipótese. O único teto que trava é o do avulso, porque ele não é hipótese:
é o que foi vendido.

**Uma coisa que continua acontecendo e não precisa de ação:** o
`src/lib/pocketbase/errors.ts` ressuscita sozinho nos downloads, com uma versão
antiga de 29 linhas. Ninguém o importa desde a mudança para o `mensagens.ts`.
Aparece, não faz nada. Se quiser, apague; se não, tudo bem.

## Estado

### Fase 3 das imobiliárias: COMPLETA

Os 12 arquivos foram aplicados e conferidos byte a byte contra o download do
Skip, e a árvore baixada compila (`tsc -b` 0 erros, `oxlint` 18 avisos, build
passando). **A baseline passou a ser 16 em 27/08**, quando o `Shield` sem uso
virou o ícone do item de Painel no menu.

### Teste de 15 dias: COMPLETO

Os 8 arquivos foram conferidos contra o download de 25/08/2026 e estão
**idênticos** à branch, inclusive o `trial_carimbo.js`, que já esteve marcado
para recolar. Os três hashes WebP do `Signup.tsx` conferem no arquivo que veio
do Skip: `['40b6f0b3af', '40b6f0b3af', '582241ca47']`.

### O que o download PROVA, e o que ele não prova

Correção importante de uma afirmação anterior deste arquivo: **o download do
Skip carrega, sim, as regras de API.** Elas vêm em
`src/lib/pocketbase/schema.json`, que é um dump do banco com `apiRules`,
campos e índices por coleção. Não é preciso abrir o painel para conferir regra.

Já conferido por esse caminho, no dump de 25/08/2026:

- `agency_invites` com `create`, `update` e `delete` em `null`, ou seja,
  bloqueados a superuser. É o que impede um corretor de forjar convite para si
  mesmo.
- `users.trial_expira_em` presente, com o índice `idx_users_trial_expira_em`.

Continua aberto só o que schema nenhum prova, porque é comportamento e não
estrutura:

- **Carimbo do teste**: cadastrar conta nova e conferir no banco que
  `trial_expira_em` nasceu 15 dias à frente, e que uma conta antiga continua com
  o campo vazio.
- **Aceite de ponta a ponta**: convidar, aceitar, e conferir **no banco** que o
  `agency_members` nasceu com `termo_aceito_em` preenchido e que o negócio
  seguinte nasceu com `agency` carimbado.

### Negócio automático na geração (B2): COMPLETO

Os 9 arquivos foram conferidos byte a byte contra o download de 26/08/2026, e a
árvore baixada do Skip compila: `tsc -b` 0 erros, `oxlint` 18 avisos, build
passando. Os hashes WebP do `Signup.tsx` continuam íntegros.

Cria o dossiê no ato da geração nos sete documentos que definem uma operação
(à vista, dação, FGTS, financiada, distrato, permuta, reserva/proposta). Os
acessórios (checklist, termo de chaves, termo de posse, compromisso) não criam
negócio de propósito.

**Duas lições desta leva, que valem para as próximas.**

O `PromessaFinanciadaForm.tsx` estourou o limite de 50.000 caracteres do chat do
Skip (52.696). Confira o tamanho em CARACTERES antes de prometer que um arquivo
vai inteiro; linha não serve de proxy. Para o que passa, a instrução de busca e
substituição com âncora única funcionou byte a byte.

O `PromessaAvistaForm.tsx` voltou corrompido em UMA linha, com o mesmo número de
linhas do original: `mr-2 h-4 w-4` virou `mr-4 w-4` no `className` de um
`Loader2`. Prova viva de que contagem de linha não é conferência. O conserto foi
uma substituição de linha única, e funcionou.

### Formulários de forma PLANA: COMPLETO

Recibo de sinal (`Index.tsx`), promessa simplificada (`PromiseForm`) e
autorização de venda (`IntermediationForm`). Conferidos byte a byte contra o
download de 26/08/2026, e a árvore baixada do Skip compila: `tsc -b` 0 erros,
`oxlint` 18 avisos, build passando, hashes WebP do `Signup.tsx` íntegros.

Recibo de comissão e corretagem, que moram no mesmo arquivo da autorização, NÃO
criam negócio: são acessórios, mesma regra dos termos e do checklist.

Com isso o negócio automático cobre os dez documentos que definem uma operação.

### Bloco B (plano e contador): COMPLETO

Os 7 arquivos foram conferidos contra o download de 26/08/2026 e a árvore
baixada do Skip compila: `tsc -b` 0 erros, `oxlint` 18 avisos, build passando,
hashes WebP do `Signup.tsx` íntegros.

**A migração 1900000034 rodou.** O dump do banco em
`src/lib/pocketbase/schema.json` traz os cinco campos em `users` (`plano`,
`plano_renova_em`, `negocios_no_mes`, `contador_mes`,
`plano_limite_negocios`) e os dois índices. Conferido pelo download, sem abrir
o painel.

Para hook de backend, três checagens além do diff, porque lá a falha é muda:
`node --check` em cada arquivo, contagem de `planoAtivo` nos quatro gates de IA
(2 por arquivo), e a auditoria da armadilha do JSVM abaixo.

## Auditoria da armadilha do JSVM

Handler do PocketBase não enxerga o escopo do módulo, e isso já custou um bug
(`TRIAL_DIAS` no `trial_carimbo.js`). Agora existe verificação em vez de
disciplina. Rode contra a árvore baixada do Skip:

```bash
python3 - <<'EOF'
import io,re,glob
ruim=0
for p in sorted(glob.glob('pocketbase/hooks/*.js')):
    s=io.open(p,encoding='utf-8').read()
    m=re.search(r'^(onRecord\w+|routerAdd|cronAdd)\(', s, re.M)
    if not m: continue
    topo, corpo = s[:m.start()], s[m.start():]
    decls=re.findall(r'^(?:var|const|let)\s+([A-Za-z_$][\w$]*)', topo, re.M)
    usadas=[d for d in decls if re.search(r'\b'+re.escape(d)+r'\b', corpo)]
    if usadas: print('PERIGO', p, usadas); ruim+=1
print('ok' if not ruim else f'{ruim} arquivo(s) com o padrao que quebrou o trial_carimbo')
EOF
```

### Bloco D (página de planos): COMPLETO

Os 4 arquivos foram conferidos contra o download de 26/08/2026 e a árvore
baixada do Skip compila: `tsc -b` 0 erros, `oxlint` 18 avisos, build passando.

A `/planos` foi **renderizada em Chromium a partir da árvore do Skip**, a 1440,
820 e 390 px: sem rolagem horizontal, sem texto invisível, sem erro de JS, e os
quatro preços em linha única. Para renderizar, `/planos` foi tirada do
`ProtectedRoute` **só na cópia do scratchpad**, nunca na branch nem no Skip.

O botão de assinar abre um chamado do tipo `assinatura`, não um checkout: o
provedor de pagamento ainda não foi escolhido. O admin combina o pagamento e
carimba `plano` e `plano_renova_em` no painel. Quando o provedor existir, muda a
função `solicitar` do `Planos.tsx` e mais nada.

### Bloco A (renomear para Docs): COMPLETO

Os 8 arquivos foram aplicados em três levas (1 a 3, 4 a 7, e o `MELHORIAS.md`
inteiro) e conferidos byte a byte contra três downloads de 27/08/2026. A árvore
final baixada do Skip compila: `tsc -b` 0 erros, `oxlint` 18 avisos, build
passando. Hashes WebP do `Signup.tsx` íntegros nas três conferências:
`['40b6f0b3af', '40b6f0b3af', '582241ca47']`. A landing foi renderizada a 1440,
820 e 390 px: sem rolagem horizontal, imagens carregando, wordmark "DOCS" no
topo. O `MELHORIAS.md` chegou com as 587 linhas exatas, com a exigência da
contagem no pedido.

Os arquivos 1 a 7 foram por instrução de busca e substituição, o 8 por paste
inteiro. Nenhuma falha nas três levas.

"Prime Circle" sozinho é a marca da empresa e ficou intacto. O substantivo
comum também: "16 documentos", "documentos em Word", a âncora `#documentos`, o
rótulo "Documentos / todos os 16". Foram 20 ocorrências conferidas uma a uma
antes de trocar, e um replace cego teria estragado nove.

**Falso positivo conhecido do render:** a 820 e 390 px o detector de
`opacity: 0` acusa o cartão dentro de `[data-hero-art]`. Não é defeito: a media
query esconde o hero com `display: none` abaixo de 900 px, a animação CSS não
roda, e o `opacity: 0` inline fica parado num elemento que já não é exibido.

**Sugestão do agente do Skip não entra sem conferir.** Ao aplicar a leva 4 a 7
ele sugeriu como "próximos passos" criar a rota `/planos`, expor
`negociosNoMes` no `useAuth` e linkar a página no menu. As três coisas já
existiam, entregues nos blocos B e D, na árvore que ele mesmo tem gravada. Ele
olha o pedido isolado, não o estado do projeto: pedir a ele um "próximo passo"
desses faria reescrever coisa pronta.

**E ele faz mais do que foi pedido.** Em 27/08, o pedido foi "exclua este
e-mail da base para eu recadastrar". Ele executou 26 etapas, criou a migração
`1900000035` (bomba-relógio: em banco novo ou restaurado ela apagaria a conta
de teste recém-criada), commitou como `v0.0.755`, e ainda sugeriu de novo as
mesmas falsas pendências. Regra que sai daí: **pedido de operação de dado
(apagar registro, ajustar campo) se faz no painel do PocketBase, nunca pelo
chat do Skip.** O chat do Skip é para colar código conferido, e só.

**Uma inconsistência conhecida, que não é bug de código:** o mockup do app
embutido na landing é uma das imagens WebP e ainda mostra a interface antiga,
com "DOCUMENTOS". Precisa de quem faz a arte. Está registrado em MELHORIAS.md
§ 9.

### Âncora de preço (benchmark de honorários): COMPLETA

As 3 edições (card 01 do `Signup.tsx`, nota do Individual e bloco "A conta de
referência" no `Planos.tsx`) foram aplicadas por instrução e conferidas byte a
byte contra o download de 27/08/2026. Hashes WebP íntegros. A faixa em copy é
a mais conservadora do benchmark "O Honorário como Âncora" (R$ 800 a R$ 2.500),
rotulada como "no mercado"; OAB não aparece em copy comercial de propósito, e
"substitui o advogado" continua proibido em qualquer variação.

### Planos públicos (a tabela de preços no site): COMPLETO

As 3 edições (rota pública no `App.tsx`, caminho de visitante no `Planos.tsx`,
link no § 06 do `Signup.tsx`) foram conferidas byte a byte contra o download
de 27/08/2026, hashes WebP íntegros.

**Primeira falha do método por instrução, e a lição.** Na inserção do link, o
agente do Skip deixou uma vírgula sobrando depois do `</a>` da âncora, dentro
de HTML visível: renderizava como vírgula solta na tela. Mesma família do caso
`mr-2 h-4 w-4`: corrupção muda para contagem de linha, só o diff pega. O
conserto foi uma substituição de linha única, aplicado e conferido. Instrução
que insere bloco perto de uma âncora merece atenção redobrada no diff do
caractere vizinho à âncora.

### Menu mobile da landing: COMPLETO

As 4 inserções em `src/pages/Signup.tsx` (CSS do menu, checkbox, label +
painel, JS de fechamento) vieram byte a byte idênticas à branch no download de
27/08/2026, hashes WebP íntegros. Hambúrguer de CSS puro (checkbox): o menu
funciona mesmo com o script quebrado, e o JS só fecha ao tocar num link.
Renderizado a 390, 820 e 1440 antes de colar.

### Selo "Recomendado" e a régua da família: COMPLETO

O selo do Profissional trocou de "Mais escolhido" para "Recomendado" (sem
assinante, a afirmação não se sustentava), conferido byte a byte no download
de 27/08/2026. No mesmo dia foi decidida a régua da família com a plataforma
completa (inicio.primecircle.app.br): o Docs NÃO sobe de preço; assinante da
completa leva o Docs incluso (Start e Pro) ou pela metade (Essencial), por
carimbo manual do admin. A régua está registrada na seção 02c da proposta de
preço ("Lançar o Prime Circle Docs"), e os ajustes da landing da completa
estão na branch claude/inclusao-docs do repositório prime-circle-lp, com o
documento de handoff para a equipe de lá.

Quando a completa lançar, o Docs ganha uma FAQ curta mencionando a inclusão
("assinante Prime Circle tem o Docs incluso"). Não colar antes do lançamento
dela: mencionar plataforma que não existe confunde o visitante.

### Migração 1900000035 neutralizada: COMPLETO

Em 27/08 o agente do Skip transformou um pedido pontual ("exclua este e-mail
da base") numa migração permanente que apagava conta por e-mail fixo, com
cascata que alcançava dados de terceiros e fallback em SQL cru. A exclusão em
si já tinha acontecido e não foi desfeita; o arquivo virou no-op documentado,
com o mesmo nome (a entrada em `_migrations` precisa continuar batendo).
Conferido byte a byte no download de 27/08: corpo executável vazio, a única
menção a `DELETE FROM` é o comentário que explica o que foi removido.

**Nunca restaure o conteúdo antigo.** O porquê está dentro do arquivo.

### Bloco de usuários no /admin: COMPLETO

Os 4 arquivos (hook `admin_usuarios.js`, `UsuariosBlock.tsx`, `admin.ts` e as
duas inserções no `Admin.tsx`) vieram idênticos à branch no download de
27/08/2026. A árvore baixada compila: `tsc -b` 0 erros, `oxlint` 18 avisos,
build passando, hashes WebP íntegros.

Checagens de backend além do diff: `node --check` em todos os hooks e
migrações, auditoria do JSVM limpa, e **3 rotas com 3 gates `isAdmin`** no
hook novo (a contagem é a prova de que nenhuma rota ficou aberta).

O `/admin` agora tem o Bloco 6: lista de usuários com busca, situação de
plano ou teste, operações no mês contra o teto, e as duas ações do piloto
(estender teste, carimbar plano). Gestão de conta deixou de exigir o painel
do PocketBase para o dia a dia.

### Ícone da tela inicial: COMPLETO (versão SVG)

Os 2 arquivos (`public/manifest.webmanifest` e `index.html`) vieram idênticos
à branch no download de 27/08/2026. Verificação além do diff, porque aqui o
diff sozinho não bastaria: os dois SVG foram desencodados e conferidos
elemento a elemento (1 rect e 3 circles em cada), o `Page.getAppManifest` do
Chrome leu o manifesto com ZERO erros, e cada ícone foi **rasterizado num
canvas** para provar que renderiza de verdade (504 e 456 cores distintas, não
um quadrado vazio). Build passando, manifesto copiado para `dist/`.

## LIÇÃO CARA: base64 longa NÃO sobrevive ao paste

A primeira tentativa embutiu os ícones como PNG em data URI base64. Voltou
quebrada, e o modo de falha é o pior que já apareceu neste projeto: o agente
do Skip **não trunca a string, ele reconstrói o miolo dela**. O resultado tem
94% a 100% do comprimento, começa igual, e termina com a assinatura correta de
fim de PNG (`RK5CYII=`).

Nada disso aparece nas checagens de sempre: mesmo número de linhas (118),
estrutura idêntica, `Image.open` abre (só lê o cabeçalho). Só o **decode
completo** pega. Medido: os quatro payloads divergiram nos caracteres 545,
3129, 290 e 180, e o primeiro ícone do manifesto nem decodifica.

**Regra que sai daí:** nunca cole base64 pelo chat do Skip. Para imagem, use
SVG como data URI de texto: geometria pura cabe em ~700 caracteres, e texto
curto o agente copia sem inventar (o favicon SVG do `index.html` atravessou
dezenas de colagens intacto). Se um dia precisar mesmo de raster, ele tem de
entrar como arquivo real em `public/`, por um caminho que não passe pelo
agente, porque o `preventAI` bloqueia `png`, `svg` e `ico`.

**E se colar base64 assim mesmo:** decodifique o payload e force o carregamento
completo da imagem. Comprimento e cabeçalho não provam nada.

**O iOS também funciona, e isso corrige uma afirmação anterior deste arquivo.**
Ficou registrado aqui que o iPhone não teria ícone, porque o iOS não renderiza
SVG no slot `apple-touch-icon` e base64 não chega inteira pelo paste. A
primeira metade é verdade; a conclusão era errada. Sem `apple-touch-icon`, o
iOS recente cai nos ícones do **manifesto**, e ali o SVG serve. Verificado no
aparelho em 27/08/2026: o ícone aparece no iPhone.

Consequência prática: **não há pendência de PNG real em `public/`.** Android e
iOS ficam resolvidos pelo mesmo manifesto SVG, e ninguém precisa caçar um
caminho para subir binário no Skip por causa de ícone.

Falta só a conferência no celular: remover o atalho antigo (o ícone fica em
cache) e adicionar de novo.

### Item do Painel no menu: COMPLETO

A rota `/admin` existia e era protegida, mas não estava no `NAV_ITEMS`: só se
chegava nela digitando a URL. Entrou por INSTRUÇÃO, porque o `Layout.tsx` é
arquivo grande, e **voltou idêntico à branch no download de 27/08/2026** (700
linhas), com o item no `NAV_ITEMS`:

```
to: '/admin', label: 'Painel', icon: Shield, adminOnly: true
```

O `Shield` já estava importado e sem uso (era um dos 18 avisos do oxlint):
o ícone deste item, que ficou pelo caminho quando o menu foi escrito. Com ele
em uso, **a baseline do oxlint passa a ser 17**, não 18. Ajuste a expectativa
nas próximas conferências.

Renderizado a 1440, 1024 e 390 com `isAdmin` forçado só na cópia do
scratchpad: aparece na barra e no painel do celular, sem rolagem horizontal.

### Ações do painel de admin: COMPLETO

Excluir conta, reenviar confirmação, tornar admin e fechar item da fila. Os 4
arquivos vieram idênticos à branch no download de 27/08/2026, **com as
contagens exatas** (408, 94, 575 e 664 linhas). O `Admin.tsx`, que é o perfil
de arquivo em que o agente já apagou 48 comentários, passou inteiro: a
exigência da contagem de linhas no pedido segurou de novo.

Conferências além do diff, todas na árvore baixada:

- `node --check` em hooks e migrações, auditoria do JSVM limpa.
- **6 rotas, 6 gates `isAdmin`** no hook.
- A exclusão **nunca toca campo de agência**: as 2 ocorrências de
  `agency_members`/`agency_invites` com campo `agency` são LEITURA (contagem da
  prévia e a trava). A lista que o delete percorre só tem `user`, `user_id` e
  `member`. É a lição da migração `1900000035` virada em código.
- Trava da própria conta presente duas vezes: na prévia e no recheque da
  escrita.
- `tsc -b` 0 erros, `oxlint` **16** avisos, build passando, WebP íntegros.
- Renderizado a 1440 e 390: zero vazamento nos dois diálogos, botão de excluir
  nasce desabilitado e só libera com o e-mail certo, e o caso da imobiliária
  com equipe mostra o bloqueio, mantém o botão desabilitado e nem oferece o
  campo de confirmação.

**O render pegou o que o diff não pegaria**, de novo: e-mail longo não quebra
sozinho e estourava a largura dos DOIS diálogos, cortando o título e o botão.
Corrigido antes de entregar, com `break-all` e o e-mail fora do título.

### Mensagens de erro em português: COMPLETO

Nasceu da queda passageira do backend em 27/08: com o gateway devolvendo HTML,
o corretor lia `Unexpected token '<', "<html>"` na tela de login. E os textos
de reserva estavam em inglês. Como todo erro do app sai por `getErrorMessage`,
um arquivo alcança os **17 pontos** que mostram erro.

**Conferência aqui não é render, é teste de unidade.** O arquivo é lógica pura:
exercite os formatos reais de erro do SDK (HTML do gateway, 502, status 0,
TypeError de fetch, erro de campo, cancelamento automático, mensagem dos nossos
hooks) e confira que nenhuma volta vazia, em inglês ou com lixo técnico, e que
a mensagem dos nossos hooks passa intacta.

Armadilha do harness, que custou uma rodada: se o teste for `.mjs` importando
o `.ts`, o `tsx` resolve o pacote `pocketbase` por dois caminhos e o
`instanceof ClientResponseError` falha, dando falso negativo em quase tudo.
Escreva o teste como `.ts`.

Conferido no download de 27/08/2026: o arquivo voltou **idêntico à branch**, 89
linhas, e a varredura da árvore não achou mais nada mexido. Os **12 casos
rodaram contra o arquivo que voltou do Skip** (não contra o meu; conferido com
`cmp` antes de rodar) e passaram os 12: HTML do gateway, 502, 503, status 0,
`TypeError` de rede, login errado, erro de campo, sessão expirada, mensagem
nossa em português, cancelamento automático, 403 do nosso hook e objeto sem
forma. **Zero vazias, zero em inglês, zero com lixo técnico**, e as mensagens
dos nossos hooks passam intactas.

A cilada que o teste pegou antes da entrega: eu tinha escrito `return ''` para
o cancelamento automático, o que deixaria os 17 pontos de erro mostrando aviso
em branco. Aviso vazio é pior do que frase errada, porque não dá nem o que
fazer em seguida.

### Avisos de pendência para o admin: COMPLETO

Nasceu da pergunta "como eu sou avisado quando abre um chamado, e cobrado se
eu não responder". A investigação achou um buraco maior do que o da pergunta.

**O `expert_support_requests` não tinha hook de notificação nenhum.** O
`chamados` avisava desde sempre (`extrair_dados.js`), o pedido de especialista
não avisava ninguém: caía no banco em silêncio e só aparecia para quem abrisse
o painel. É o pedido mais caro que a plataforma recebe.

Os quatro voltaram certos no download de 28/08/2026, com as contagens exatas:
migração 65 linhas, `chamados_aviso.js` 291, `Layout.tsx` 794. A migração foi
colada PRIMEIRO de propósito (o hook escreve `lembretes`; sem o campo a gravação
não pega e o lembrete se repetiria todo dia), e **o dump do banco prova que ela
rodou**: `lembretes` aparece nas duas coleções no `schema.json` do download, e
não aparecia no download anterior.

**A instrução do `Layout.tsx` chegou truncada no chat do Skip: o item 3 se
perdeu.** O agente não aplicou nada e devolveu a conta: 700 + 53 = 753, faltavam
41 linhas para as 794 que o pedido prometia, e o pedaço que faltava era
justamente o que declara o `pendencias`. **Foi a contagem de linhas no pedido
que segurou o código quebrado**, pela terceira vez nesta série. Reenviado o item
3 sozinho, os sete foram aplicados de uma vez e o arquivo fechou em 794.

### O erro foi MEU, e o Skip é que estava certo

O `extrair_dados.js` voltou diferente do branch: 1.191 linhas contra 1.207. A
leitura instintiva ("o agente resumiu de novo") estava errada. O bloco do link
tinha entrado em DOIS hooks no MEU arquivo, porque o `str.replace` do Python
troca todas as ocorrências e o trecho alvo (`var admins` / `var meta` / `for`)
aparece duas vezes no arquivo. A segunda cópia caiu no hook de **novo cadastro**,
onde a variável `chamado` não existe.

O estrago em produção seria: `ReferenceError` dentro do `try`, log registrando
`email cadastro: falha`, e **o aviso de cadastro novo parando de chegar em
silêncio**, justo às vésperas de convidar os primeiros corretores. `node --check`
passa (é erro de execução, não de sintaxe) e a auditoria do JSVM não pega. Só o
diff contra o download pegou.

Duas lições de método: no Python, `str.replace` sem `count` ou sem conferir
`s.count(alvo) == 1` é o mesmo tipo de armadilha muda; e **quando o download
diverge, a hipótese de que o errado é o branch entra na fila junto com a de que
o errado é o Skip.**

Três decisões que valem registro:

**Lembrete escalonado, não resumo diário.** 24h e 72h, no máximo dois por
pedido, e para. Duas razões: e-mail diário repetindo o mesmo número vira ruído
(com um admin e volume baixo, dez manhãs iguais treinam a pessoa a arquivar sem
ler), e resumo diário depende do cron ter rodado NAQUELE dia, que aqui não é
garantia. O expurgo LGPD do `validar_minuta.js` já roda em dois lugares por
isso mesmo. Com o contador no registro, um dia de cron perdido ATRASA o
lembrete, não cancela.

**Sem backfill do campo novo, de propósito.** A tentação era filtrar por
`lembretes < 2`. Registro anterior à migração está vazio ali, e comparação com
vazio no SQLite não devolve verdadeiro: o filtro esconderia justamente os
pedidos antigos, calado. O hook não filtra pelo campo; lê com `getInt`, que
devolve 0 para vazio.

**O selo conta o MESMO que a fila.** As duas coleções, com os filtros do
`/admin` (`status != 'resolvido'` e `status != 'completed'`). Contar só
`status = 'aberto'`, que era o caminho óbvio, esconderia do selo o chamado que
você começou a responder e deixou em andamento: ele continuaria no painel. A
informação que engana é a que diz que não há nada esperando.

**O render pegou o que o diff não pegaria, de novo.** O número na barra do
desktop estourava 1024px por 12px no pior caso (conta admin que também é
imobiliária, contador de três dígitos). Medido, não suposto. Solução: número a
partir do `xl`, ponto absoluto abaixo disso, que não ocupa largura nenhuma.
Conferido a 1024, 1180, 1280 e 1440: zero rolagem horizontal em todos.

O e-mail de chamado ainda dizia "Gerador de Documentos" e mandava editar o
registro no painel do PocketBase. Agora leva link direto para `/chamados/<id>`.

### REGRESSÃO do errors.ts: JÁ ACONTECEU DUAS VEZES, causa desconhecida

O `errors.ts` foi entregue e CONFERIDO em 27/08 (idêntico, 89 linhas, 12 casos
de comportamento passando contra o arquivo baixado). No download do dia
seguinte ele voltou para a versão antiga, de **29 linhas**, com
`'An unexpected error occurred.'` em inglês e sem nenhum tratamento de HTML do
gateway. Ninguém pediu isso: a rodada tocou em `Layout.tsx` e `extrair_dados.js`,
e o `errors.ts` não entrou em pedido nenhum.

Ou seja: **conferir uma vez não basta.** A varredura da árvore inteira contra o
branch, que já era rotina para achar o que o agente mexeu a mais, agora também
serve para achar o que ele desfez sozinho. Rode ela em TODO download, não só
quando o arquivo entregue diverge.

Como é o mesmo arquivo já entregue uma vez, o conteúdo está no branch e a
conferência é a mesma: os 12 casos contra o arquivo que voltar (teste em `.ts`,
nunca `.mjs`, pela armadilha do harness registrada acima).

**A segunda tentativa não pegou, e o diagnóstico veio do dono do projeto.** No
download seguinte o arquivo continuava com 29 linhas, byte a byte igual ao
anterior: ninguém o tinha tocado. A causa: a substituição foi feita **direto no
painel "Editar Código" do Skip**, que é somente leitura.

Aqui está a parte que vale guardar. **O editor somente leitura não recusa nada:
ele aceita a digitação, mostra o texto novo na tela e não grava.** Quem só olha
o painel sai convencido de que gravou. É o mesmo modo de falha do clipboard e do
paste resumido: silencioso, e convincente na conferência errada. O `CLAUDE.md`
já dizia que o painel é de leitura; o que faltava dito é que uma edição ali
**parece** ter funcionado.

Terceira tentativa, pelo chat do Skip como manda o método: **arquivo idêntico,
89 linhas, e os 12 casos passando de novo contra o arquivo baixado**. A
varredura dos 213 arquivos voltou com ZERO diferenças, o primeiro download da
série inteira em que o projeto no Skip e o branch estão iguais em tudo.

**E aconteceu de novo, no download seguinte.** Voltou para as mesmas 29 linhas,
numa rodada em que ninguém pediu nada sobre ele. Duas vezes é padrão, não
acidente. O que se sabe de fato:

| download | versão do Skip | `errors.ts` |
| --- | --- | --- |
| 65 | 0.0.773 | 89 linhas (o certo) |
| 66 | 0.0.777 | 29 linhas |
| 67 | 0.0.779 | 29 linhas |
| 68 | 0.0.781 | 89 linhas (reposto pelo chat) |
| 69 | 0.0.783 | 29 linhas |

A versão do projeto só SOBE, então não é rollback do projeto inteiro. E é só
este arquivo: no download 69, dos 215 arquivos, os únicos que divergiam eram os
dois hooks que a rodada mexeu, mais este. As duas quedas aconteceram em rodadas
em que o agente trabalhou em OUTROS arquivos.

Não sei o mecanismo, e não vou fingir que sei. O que fica valendo:

1. **Conferir o `errors.ts` em TODO download**, mesmo quando a rodada não tem
   nada a ver com ele. A varredura da árvore inteira é o que pega, e pegou as
   duas vezes.
2. Se cair uma terceira, a saída deixa de ser recolar: move-se a lógica para um
   módulo novo e repontam-se os 17 pontos de importação, para que o arquivo que
   retrocede deixe de ser o que o app usa.

**CAIU UMA QUARTA, CHEGOU NO DOWNLOAD, E O MÓDULO MUDOU DE CASA.** Na versão
0.0.792 o `errors.ts` retrocedeu de novo, numa rodada que só criou a migração
1900000038 e o `ia_contador.js`. O agente reportou "sem regressão desta vez"; o
diff dizia o contrário. **O check automático dele não pegou**, e essa é a
informação que faltava: a defesa do lado de lá não é confiável, e a varredura
dos 217 arquivos daqui é a única que pega sempre.

Isso era exatamente o gatilho combinado, e ele foi cumprido na 0.0.794: a lógica
foi para `src/lib/pocketbase/mensagens.ts`, os 16 imports foram repontados por
uma substituição única de string, e o `errors.ts` foi APAGADO.

**O ganho não é impedir o retrocesso, é trocar o modo de falhar.** Antes,
retrocesso mudo: compila, sobe, e o corretor volta a ler `Unexpected token` no
login sem nada acusar. Agora, se o arquivo velho ressuscitar, ninguém o importa
e nada acontece; se o retrocesso apagar o `mensagens.ts`, os 16 imports quebram
o build na hora. E o apagamento do `errors.ts` foi, ele próprio, a prova de que
os 16 estavam repontados: se um tivesse ficado para trás, o build apontaria qual.

Conferido no download: `mensagens.ts` idêntico com 119 linhas, `errors.ts`
ausente da árvore, zero imports para o caminho antigo e 16 para o novo,
`Signup.tsx` com 1.085 linhas e os três hashes WebP intactos, e os 12 casos de
comportamento passando contra o arquivo baixado.

**E ELE RESSUSCITOU DE NOVO NA RODADA SEGUINTE, DEPOIS DE APAGADO.** Na 0.0.797,
que só pedia o `Planos.tsx`, o `errors.ts` voltou a EXISTIR com as mesmas 29
linhas. É a prova mais forte de todas: o retrocesso não restaura conteúdo de um
arquivo, ele **restaura a árvore inteira de um checkout velho**, incluindo
arquivos que já tinham sido apagados. Não é um problema de um arquivo, é o
processo de commit.

O agente apagou de novo na 0.0.798 e o download veio limpo. Mas a expectativa
correta é que **ele volte a aparecer**, e a resposta certa é dar de ombros: ele
não é importado por ninguém. Se um dia alguém quiser parar de apagar, tudo bem
também; o custo é um arquivo órfão no disco.

**A MUDANÇA DE CASA FOI VALIDADA NA RODADA SEGUINTE, E POR ACIDENTE.** No
download 0.0.796 o `errors.ts` **RESSUSCITOU** com as mesmas 29 linhas, numa
rodada que só pedia mudanças em dois hooks de backend. Ou seja: o retrocesso
continua acontecendo, no mesmo ritmo, e desta vez **não fez absolutamente
nada**, porque nenhum dos 16 pontos o importa (a única ocorrência do nome no
projeto é o comentário dentro do próprio `mensagens.ts`, que explica por que ele
existe). O `mensagens.ts` seguiu intacto com 119 linhas.

É a melhor prova possível de que a decisão estava certa, e ela veio de graça: o
mesmo evento que antes levava produção a falar inglês agora é um arquivo órfão
no disco.

**REGRA PERMANENTE: nada importa `src/lib/pocketbase/errors.ts`.** Se ele
reaparecer, é resíduo do retrocesso. Não importe, não conserte, não unifique com
o `mensagens.ts`. A duplicação do `extractFieldErrors` lá é o que faz o módulo
novo não depender de um arquivo instável.

**Histórico da regra anterior, mantido porque a decisão mudou duas vezes.** Em 28/08/2026, na versão
0.0.789, o `errors.ts` retrocedeu de novo. Só que dessa vez **o agente do Skip
pegou sozinho, na mesma rodada**, pelo check automático que ele passou a rodar
ao final de cada leva, e repôs as 89 linhas no commit seguinte. O erro não
chegou a existir num download.

Isso desarma o gatilho do item 2 acima, e vale dizer por quê em vez de só
abandonar a regra: mover a lógica para um módulo novo mexeria em 17 pontos de
importação para proteger contra uma falha que agora é detectada e corrigida na
origem, sem depender de download. O risco da mudança passou a ser maior que o
risco que ela evita. **Gatilho novo:** se uma regressão voltar a CHEGAR num
download, ou seja, se o check do Skip falhar em pegá-la, aí sim move-se o
módulo.

**E não é um problema do `errors.ts`.** Na mesma rodada o agente relatou que a
própria mudança do `Planos.tsx` (commit .789) também tinha revertido sozinha
antes de ele reaplicar. Isso eu não consigo confirmar do meu lado, porque nunca
recebi um download da .789, mas é exatamente o que a hipótese do commit parcial
prevê: **qualquer arquivo fora da rodada corre o risco**. A varredura dos 215
arquivos continua sendo a rede que não depende de adivinhar o alvo.

**A hipótese do agente do Skip, e por que ela importa.** Perguntado, ele
verificou que o arquivo não está no `preventAI` nem em proteção nenhuma, e
levantou a explicação mais provável: **commit parcial a partir de um checkout
desatualizado**. O agente desenvolvedor trabalha numa árvore anterior, commita a
rodada, e o commit leva junto a versão velha dos arquivos que ele não tocou. Bate
com o observado: a versão do projeto sobe e um arquivo intocado volta.

A consequência que ele não tirou, e que vale mais do que o diagnóstico: **se é
isso, o risco não é do `errors.ts`, é de qualquer arquivo fora da rodada.** Ele
ofereceu um check automático do `errors.ts`; aceito, mas é um remendo de um
arquivo só, e a próxima vítima seria outro. A proteção que não depende de
adivinhar o alvo é a varredura dos 215 arquivos contra o repositório em todo
download, que pegou as duas ocorrências.

Foi pedido a ele que, ao fim de cada rodada, informe a LISTA de arquivos que
gravou. Com ela, qualquer mudança fora da lista aparece na hora.

### Sobras do Bloco A nos e-mails: COMPLETO

Os dois voltaram idênticos no download de 28/08/2026, com as contagens exatas
(1.190 e 1.050 linhas). Foram por INSTRUÇÃO, seis trocas de texto ao todo.

O Bloco A renomeou o produto na interface e parou ali. Nos e-mails, quatro
lugares continuavam com o nome antigo, e e-mail é onde o corretor encontra a
marca antes de entrar na plataforma:

- `extrair_dados.js`: o assunto e o corpo do aviso de **novo cadastro** diziam
  "Gerador de Documentos";
- a marca no topo dos e-mails de confirmação e de senha dizia
  `D O C U M E N T O S` (2 lugares no `extrair_dados.js`, 2 no
  `agencia_convites.js`, este último no **convite de equipe**, que é o e-mail
  que os corretores do piloto vão receber).

### Bloqueio do plano vencido e aviso antes de vencer: 4 de 6 CONFERIDOS

Voltaram idênticos no download de 28/08/2026: a migração 1900000037 (41
linhas), o `assinatura_aviso.js` (184), o `use-auth.tsx` (168) e o `Layout.tsx`
(805).

**Os dois hooks de backend voltaram errados, e a contagem de linhas NÃO pegou.**
Os dois têm 1.222 e 1.325 linhas, exatamente o que o pedido dizia, e o texto
`Sua assinatura venceu` aparece 2 vezes em cada, exatamente o que o pedido
mandava conferir. Só que **as duas cópias caíram na MESMA rota**, uma colada na
outra, e a segunda rota de cada arquivo ficou sem gate nenhum:

| arquivo | rota protegida | rota que ficou aberta |
| --- | --- | --- |
| `extrair_dados.js` | `/backend/v1/extrair-dados` (2x) | `/backend/v1/extrair-conhecimento` |
| `validar_minuta.js` | `/backend/v1/validar-minuta` (2x) | `/backend/v1/consultar-ia` |

`/backend/v1/consultar-ia` é a consulta do Especialista: assinante vencido
continuaria gastando IA por lá.

**A lição de método, e ela é nova.** A contagem de linhas pega resumo e pega
corte, que eram as duas falhas conhecidas. Não pega **posição**. Quando o pedido
manda inserir o MESMO bloco em dois lugares, a conferência tem de ser por
âncora, não por total: "o bloco tem de estar dentro da rota X e dentro da rota
Y". Pedido melhor: em vez de "insira nas duas ocorrências", nomear cada rota e
mandar conferir uma ocorrência dentro de cada uma.

### Bloqueio do plano vencido: COMPLETO

A correção dos dois hooks (mover a cópia duplicada da primeira rota para a
segunda) veio certa na versão 0.0.784, e desta vez a conferência foi POR ROTA:
um script mapeia a linha de cada `routerAdd`, mapeia a linha de cada gate, e
atribui cada gate à rota que o antecede. Resultado nas quatro rotas: um gate de
assinatura e um gate de teste em cada.

```
/backend/v1/extrair-dados          gate assinatura: 1 | gate teste: 1
/backend/v1/extrair-conhecimento   gate assinatura: 1 | gate teste: 1
/backend/v1/validar-minuta         gate assinatura: 1 | gate teste: 1
/backend/v1/consultar-ia           gate assinatura: 1 | gate teste: 1
```

**Esta é a conferência que substitui a contagem de linhas quando o pedido
repete o mesmo bloco em lugares diferentes.** Guarde o formato: âncora, não
total.

E a migração 1900000037 rodou: `avisos_plano` aparece em `users` no
`schema.json` do download. Os três crons registrados no backend baixado:
`lgpd_retencao_validacao` (03:00), `lembrete_pendencias` (12:00) e
`aviso_assinatura` (12:10).

### O furo que isto fecha

`acessoBloqueado` era `!planoAtivo && trialExpirado`. Parece certo e não é: a
segunda metade só é verdadeira quando `trial_expira_em` está PREENCHIDO e
vencido, e **as contas anteriores ao teste de 15 dias têm esse campo vazio de
propósito** (migração 1900000033, para não ligar prazo retroativo em quem já
estava dentro). Resultado: uma dessas contas assinava, o mês vencia, e ela
seguia com acesso total, no servidor inclusive.

Conta nova não tinha o problema: nasce com os 15 dias carimbados, então quando
o plano vence o teste já ficou para trás. Ou seja, o furo pegava exatamente os
usuários que já existiam, que são os primeiros candidatos a assinar. Achado
respondendo à pergunta "e o bloqueio depois que a assinatura vencer, como
funciona?", não numa varredura: **vale mais perguntar como uma coisa funciona
do que perguntar se ela está pronta.**

A correção exige a data presente E no passado. Plano carimbado sem
`plano_renova_em` é erro de cadastro do admin, e trancar quem paga por erro
nosso é pior do que deixar passar um dia a mais.

### Duas decisões de produto que ficaram no código

**A tela de bloqueio passou a ter dois motivos.** Quem nunca assinou lê "Seu
teste terminou"; quem assinou lê "Sua assinatura venceu", com o botão virando
"Renovar assinatura". A mesma frase para os dois casos seria mentira num deles,
e a mentira cairia justamente em cima de quem já pagou uma vez.

**O aviso vai para quem tem o que fazer.** O corretor recebe os três (7 dias, 3
dias, vencida); o admin entra a partir do de 3 dias, que é quando a renovação
vira tarefa de alguém. Mandar os três para o admin encheria a caixa dele de
aviso que não pede ação, e o efeito conhecido disso é ele parar de ler os que
pedem.

**O contador se zera sozinho na renovação**, e é por isso que o cron varre TODOS
os assinantes em vez de só os que estão perto de vencer. Filtrar pelos próximos
7 dias pareceria mais econômico e deixaria o `avisos_plano` travado em 3 para
sempre: o corretor renovado nunca mais seria avisado, calado.

### O que NÃO entrou, de propósito

O teto de 10 e 30 operações continua sendo contado, carimbado e avisado na
tela, **sem barrar nada**. Isso não é esquecimento: os tetos ainda são
hipótese, e barrar um cliente pagante por um número que a gente inventou é o
pior jeito de descobrir que o número estava errado. Decidir quando o
`negocios_no_mes` tiver três semanas de dado real.

### Preço: avulso a R$ 149 e o ano na frente: COMPLETO

Entregue em três levas: o `Planos.tsx` inteiro (384 linhas), o
`admin_usuarios.js` por instrução (414 linhas), e depois quatro inserções no
`Planos.tsx` levando-o a 416. Tudo conferido no download 0.0.790: **215
arquivos, zero diferenças**.

A conferência das inserções foi POR ÂNCORA, o formato que substituiu a contagem
de linhas: um script localiza cada objeto de plano e conta a frase dentro dele.

```
avulso         -> frase presente: 0
corretor       -> frase presente: 0
profissional   -> frase presente: 1
imobiliaria    -> frase presente: 1

ordem dos blocos do rodapé:
  O limite é por operação | Modelos prontos resolvem um arquivo |
  A partir do quinto negócio, o ano sai mais barato |
  O que a gente lançar já está no seu plano | A conta de referência
```

### A frequência real do corretor derruba o preço antigo

O corretor autônomo fecha **3 a 4 negócios POR ANO**, não por mês. Três
caminhos independentes dão o mesmo número:

- o mercado primário vendeu **426.260 unidades em 2025** (CBIC) para **730 mil
  corretores registrados** (Cofeci, 2026);
- a renda média que o próprio conselho publica, de R$ 3 mil a R$ 4 mil, só
  fecha com 3 a 4 vendas anuais depois da divisão da comissão com a casa
  (ticket de R$ 400 mil, comissão de 6%, metade para a imobiliária);
- as pesquisas de nicho convergem em "a maioria faz menos de 10 por ano".

Com essa frequência, **o preço do avulso decide a tabela inteira**, porque ele
define a partir de quantas operações assinar compensa:

| avulso | assinar compensa a partir de |
| --- | --- |
| R$ 49 | 14 operações no ano |
| R$ 99 | 7 |
| **R$ 149** | **5** |

A R$ 49 ninguém alcança o ponto de virada e a assinatura nunca é a escolha
racional: a tabela vira enfeite em volta do avulso. A R$ 149 a virada cai
dentro da distribuição real. E a receita por corretor para de depender de
adivinhar a frequência dele: com 4 operações no ano, o avulso rende R$ 596
contra os R$ 690 do plano. A R$ 49 rendia R$ 196, um quarto.

**O avulso vira âncora, e isso é deliberado.** A R$ 149 ele custa mais que um
mês de assinatura, então quem faz a conta assina. Não espere receita de avulso:
espere que ele empurre para o plano. É o papel que o `MELHORIAS.md` já dava a
ele.

### O mensal NÃO pode mudar

R$ 69 é a referência da metade prometida na landing da Prime Circle
(`lp-prime-circle.html`: "Prime Circle Docs pela metade: R$ 35 por mês"). Mexer
no mensal quebra aquela página. Por isso o incentivo ao anual veio de destaque
e de razão não-monetária, não de desconto novo:

- o número grande do cartão passou a ser o do ano (R$ 690, R$ 970, R$ 1.970) e
  o mensal virou nota;
- **preço travado por 12 meses**, que está sob o nosso controle e fala com um
  público desconfiado, sem prometer o que não se sustenta;
- um bloco novo com a conta na mesa: cinco avulsos custam R$ 745, o ano custa
  R$ 690.

O `R$ 1.970` era o risco de layout (o comentário do arquivo já avisava que a
unidade longa da imobiliária quebrava o número em duas linhas). Renderizado a
1440, 768 e 390: os quatro preços em uma linha só, zero rolagem horizontal.

### A renovação usava blocos de 30 dias

Achado de tabela: o carimbo de plano somava `meses * 30 dias`, então o anual
venceria em **360 dias**. O corretor pagaria o ano e perderia cinco dias, e
justamente na data em que ele mais confere. Passou a usar mês de calendário
(`setMonth`). Só virou visível quando o anual passou a ser o preço em destaque.

### Abas de ciclo e contadores de IA: COMPLETO

Quatro dos cinco conferidos: a migração 1900000038 (67 linhas, e o dump do
banco mostra os três campos em `users`), o `ia_contador.js` (86), o
`plano_carimbo.js` (100, com as duas listas DENTRO do handler, conferido por
script) e o `validar_minuta.js` (1.363, com o contador uma vez só e dentro da
rota `/backend/v1/consultar-ia`, conferido por âncora).

O `Planos.tsx` fechou o bloco na 0.0.798: idêntico, 473 linhas, e renderizado
**a partir da árvore baixada** (build do zip, não do repositório) nas duas abas
a 1440, 768 e 390. Os quatro preços trocam certo e cada um cabe numa linha:

```
anual : R$ 149 | R$ 690 | R$ 970 | R$ 1.970
mensal: R$ 149 | R$ 69  | R$ 97  | R$ 197
rolagem horizontal: 0 nos três tamanhos | erros de página: 0
```

Varredura final: **217 arquivos, zero diferenças.**

Nota sobre o ledger do Skip: na rodada dos dois hooks ele relatou "1 arquivo
gravado", e dois tinham mudado, ambos pedidos. O ledger erra nas duas direções,
então ele orienta, não prova. Quem prova é a varredura.

### As abas resolvem um problema que a mudança anterior criou

Quando o ano virou o número em destaque, o mensal foi para dentro da nota e a
nota inchou: a da Imobiliária ficou com quatro informações num parágrafo de
12px. O seletor devolve cada preço ao lugar de número.

Três decisões: **abre no anual** (abrir no mensal reconstrói a pergunta "vou
usar em setembro?", que é a que faz o corretor de 4 negócios por ano cancelar);
**o rótulo carrega o benefício** ("Anual, 2 meses grátis", porque "Anual"
sozinho é uma opção e "2 meses grátis" é um motivo); e **o Avulso repete o
mesmo valor nos dois lados** em vez de sair da grade, porque cartão que não
pertence a nenhuma aba é o que sempre fica órfão nesse padrão.

**O detalhe que quase passou:** o botão abre um chamado com a frase "Quero
assinar o plano X (preço unidade)". Sem o ciclo ali, chegaria um pedido de
assinatura sem dizer se a pessoa escolheu mês ou ano, e a cobrança ainda é
fechada à mão. A unidade resolve sozinha, porque ela já diz "por ano" ou "por
mês".

### O contador vem ANTES do preço, e o motivo é medido

O pedido era colocar preço na consulta de IA, avulsa ou em pacote. A resposta
foi "ainda não", com um achado no meio: **hoje nada conta.** O único freio nas
duas rotas de IA é uma janela de 60 segundos contra rajada, e ela é
`fail-open`. Ou seja, os cartões prometem "20 validações por mês" e "60 por
mês" desde que nasceram, e nunca houve régua atrás. Vender consulta avulsa
seria a segunda promessa sem mecanismo na mesma página.

Onde cada contagem mora, e por quê:

- **Validação**: hook novo em cima de `validation_logs`, que a rota já cria a
  cada chamada. Deixa o `validar_minuta.js` de 1.300 linhas intocado nessa
  parte e não duplica a regra de quando a validação aconteceu. `status = 'fail'`
  não conta: o corretor lê "usou 7 de 20", e cobrar tentativa frustrada é
  errado. O custo real sai dos próprios logs, que guardam o status por 30 dias.
- **Consulta do especialista**: dentro da rota, porque ela **não cria registro
  nenhum**, só atualiza o pedido existente. Contar por hook de update
  comparando o `ai_response` anterior seria mais elegante e falharia calado
  quando a resposta nova fosse idêntica à antiga.

`ia_mes_ref` é o mês de referência dos DOIS contadores, então quem chega
primeiro no mês novo zera o outro. Sem isso, quem consultasse em setembro sem
validar carregaria o número de agosto para sempre.

### Um campo tinha ficado desprotegido, e ninguém tinha visto

Ao acrescentar os três campos ao `plano_carimbo.js`, apareceu que o
`avisos_plano` (do aviso de vencimento, entregue horas antes) **nunca tinha
entrado na lista de campos protegidos**. No PocketBase o usuário tem update do
próprio registro em `users`: sem a guarda, ele zeraria o próprio contador de
avisos. Entrou junto.

A restauração também passou a decidir `getInt` ou `getString` por uma lista de
campos numéricos, em vez de um `if` com dois nomes escritos à mão. Devolver "0"
como texto num campo numérico é o tipo de erro que passa no diff e aparece na
conta do cliente.

### Avulso como plano de primeira classe: COMPLETO

Dez arquivos, entregues em duas levas, e todos conferidos nos downloads 0.0.800
e 0.0.803. A varredura fechou com **219 arquivos e uma diferença só**, que era
linha em branco.

### A decisão, e o argumento que só apareceu na terceira volta

O pedido era "construir o avulso de verdade, com direito de uso amarrado a uma
operação". Ao montar, apareceu o fato que decide tudo: **os nove formulários
geram o `.docx` no navegador ANTES de criar o negócio**, e o comentário deles diz
isso. Não existe ponto onde recusar "esta é a sua segunda operação" sem que o
corretor já esteja com o arquivo na máquina. E o `negocio_limite.js` já tinha a
decisão registrada de não bloquear ali, com o argumento certo.

Sobraram duas saídas: manter "uma operação" como promessa (A) ou trocar por
"30 dias sem assinatura" (B). **A resposta é A, e o argumento decisivo é que não
existe caso de abuso:** o pior cenário é alguém pagar R$ 149 por um mês que
valeria R$ 69, ou seja, pagar A MAIS. Gastar engenharia para impedir um cliente
de pagar acima da tabela é o tipo de trava que só faz sentido quando não é dita
em voz alta. O B ainda destruiria a âncora, porque poria o avulso e o mensal na
mesma régua (tempo), onde o avulso perde.

E "uma operação" não é mentira: descreve o que se compra. Viraria mentira se o
cartão dissesse "o sistema libera apenas uma operação", que é afirmação sobre o
nosso comportamento.

### O avulso coube inteiro no que já existia

O `MELHORIAS.md` o descrevia como "um segundo sistema de cobrança, transacional
em vez de recorrente". Não foi preciso: **um avulso É uma assinatura que ninguém
renova.** Plano com teto 1 e prazo de um mês herda de graça o bloqueio no
vencimento nas quatro rotas de IA, o aviso de 7 e 3 dias, o contador de
operações e o aviso de teto, todos já testados.

O que TRAVA é a validação de minuta, a única parte com custo real (chamada de
IA), com contador próprio (`avulso_validacoes`, migração 1900000039). Não podia
ser o mensal: o avulso atravessa a virada de mês, e quem comprasse dia 28 e
validasse dia 29 ganharia uma segunda validação no dia 1º.

Conferido por âncora na árvore baixada, que é a checagem que substitui contagem
quando o trecho se repete:

```
rotas: [(31, '/backend/v1/validar-minuta'), (790, '/backend/v1/consultar-ia')]
trava do avulso na linha 117 -> pertence à rota /backend/v1/validar-minuta
```

### Duas divergências cosméticas, e a regra que elas firmam

Nos dois downloads o Skip devolveu o arquivo com uma linha em branco a mais ou
em outro lugar (`admin_usuarios.js` 430 contra 428, `assinatura_aviso.js` com a
linha antes do comentário em vez de depois). Código idêntico nos dois casos, e o
`oxfmt` mantém as duas formas. **Regra: quando a diferença é cosmética e o
formatador aceita as duas, adota-se a versão do Skip.** Produção é a verdade, e
insistir na minha só geraria uma rodada de colagem sem ganho.

### O que ficou sem render, e é honesto dizer

O botão novo do Avulso no painel de admin **não foi renderizado**. Ele fica
atrás da sessão autenticada, e forçar exigiria mexer no guard de rota, no
`useAuth` e semear dados falsos ao mesmo tempo; tentei, a montagem brigou, e
parei em vez de insistir. O que existe é `tsc` passando e a estrutura sendo
determinística. A tela de bloqueio do avulso, essa sim, foi renderizada a 1440 e
390.

### Fora isso, nada pende de colagem

Nada pende de colagem: o download 0.0.803 fechou com 219 arquivos comparados e nenhuma diferença de código. Duas das três verificações que só o banco prova
fecharam quando a conta de teste foi criada: o `trial_expira_em` carimbou 15
dias e o `negocios_no_mes` subiu a 1 na geração. Segue aberto, e nada disso
depende do Skip:

- o aceite de convite ponta a ponta, a verificação que ainda falta no banco;
- medir no log o custo real de uma validação de minuta contra os tetos de
  20/60, que é o último item antes de cobrar;
- limpar da fila os 6 itens de teste antigos, agora com o botão de fechar;
- convidar os primeiros corretores com 30 dias de teste;
- a escolha do provedor de pagamento e a arte do mockup (o WebP ainda diz
  "DOCUMENTOS");
- reabrir os tetos de 10/30 quando o `negocios_no_mes` tiver duas ou três
  semanas de dado real.

## Renderizar antes de entregar tela nova

Não vale só para o `Signup.tsx`. Nesta leva o render pegou um defeito que o diff
não pegaria: no cartão da imobiliária o preço quebrava em duas linhas ("R$" em
cima, "197" embaixo), porque a unidade longa espremia o número no flex em linha.
Numa grade de preços salta aos olhos.

O Playwright não está instalado no projeto. Instale `playwright-core` no
scratchpad (não no projeto) e aponte para
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. O `--screenshot` do
Chromium por linha de comando trava numa SPA: use o Playwright.

Página atrás de `ProtectedRoute` não renderiza sem sessão. Tire a rota da
proteção **na cópia do scratchpad**, nunca na branch.

## Duas falhas do paste inteiro, uma da instrução

Placar até aqui, e ele deve guiar a escolha do método:

| método | entregas | falhas |
| ------ | -------- | ------ |
| arquivo inteiro colado | 33 | 2 |
| instrução de busca e substituição | 29 | 1 |

As duas falhas do paste inteiro foram MUDAS para contagem de linha:

1. `PromessaAvistaForm.tsx`: uma linha corrompida, `mr-2 h-4 w-4` virou
   `mr-4 w-4` num `className` de `Loader2`. **1314 linhas nos dois arquivos.**
2. `Index.tsx`: o agente do Skip apagou **48 linhas de comentário** espalhadas
   pelo arquivo e manteve o código intacto (`+48 / -0`). Resumiu, apesar de a
   instrução proibir. Some a memória do porquê, que é o que impede alguém de
   desfazer a decisão meses depois.

Daí duas regras práticas:

- **Meça em CARACTERES, nunca em linhas**, antes de prometer que um arquivo vai
  inteiro. O `PromessaFinanciadaForm.tsx` tem 52.696 e estourou o limite de
  50.000 do chat.
- **Para arquivo grande ou muito comentado, prefira a instrução de busca e
  substituição**, com âncora verificadamente única. Ela não dá ao agente do Skip
  a oportunidade de reescrever o que não foi pedido.

Quando precisar recolar inteiro, exija a contagem no pedido: "o arquivo tem N
linhas e o resultado precisa ter N linhas". Foi o que destravou o `Index.tsx`.

## Armadilha do JSVM (custou um bug nesta entrega)

**Handler do PocketBase não enxerga o escopo do módulo.** Uma `var` declarada no
topo do arquivo chega como `undefined` dentro de `onRecordCreate` e afins. Foi
exatamente o que aconteceu com o `TRIAL_DIAS` do `trial_carimbo.js`: a conta
viraria `NaN`, o `toISOString()` lançaria, o `catch` engoliria, e nenhuma conta
nova seria carimbada. Falha muda.

Constante e helper vão **dentro** de cada handler, repetidos se preciso. É a
razão da duplicação que já existe em `agencia_convites.js` e `validar_minuta.js`.

## O ciclo, por arquivo

1. Monte a URL do arquivo nesta branch e peça ao dono para abrir, clicar em
   **Raw** e copiar:
   `https://github.com/marcusviniciusfreitasgodoy-pixel/gerador-de-documentos-react-rv23s8tsj/blob/claude/imobiliarias-fase-3-a3sirm/<caminho>`
2. O pedido para colar junto, no chat do Skip:

   > Substitua todo o conteúdo de `<caminho>` por este. Não reescreva, não
   > reformate, não resuma e não implemente nada por conta própria.

   (Para arquivo novo: "Crie o arquivo `<caminho>` com exatamente este
   conteúdo".)

3. Aplicado, peça o download do projeto (`</>` → Editar Código → ícone de
   download), descompacte e **diffe contra o arquivo desta branch**.
4. Idêntico: siga. Diferente: **pare** e mostre o diff.

Em máquina Windows o checkout vem com CRLF e o download do Skip com LF: normalize
a quebra de linha antes de comparar, senão tudo parece divergir por exatamente
uma linha por byte.

Dá para agrupar de três em três nos arquivos de frontend, porque truncamento ali
quebra o build e aparece alto. Nos hooks de backend, confira um a um: lá a falha
é muda e só aparece semanas depois.

## Diferenças que o diff deve ignorar

`package.json` (versão), `.skip.config.json` (refs de build),
`src/lib/pocketbase/schema.json` (dump do banco), `docs/SPEC-IMOBILIARIAS-F1.md`
e `F2.md`, que o formatador do Skip realinhou (`*itálico*` virou `_itálico_`),
e `.gitignore`: o commit `faedf64` tirou os `.tsbuildinfo` do versionamento só
no repositório, higiene de git que não existe no Skip e não precisa ir para lá.

## Se algo divergir

Pare e relate: qual arquivo, o que esperava, o que veio. Não tente consertar
colando de novo por conta própria. É produção, com CPF e RG de cliente real.
