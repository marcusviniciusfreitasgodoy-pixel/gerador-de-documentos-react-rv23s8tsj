# Spec: gerador de Estudo de Mercado no Skip

> Documento para orientar a construção do app. A **Parte 9** traz os prompts prontos para colar
> no Skip, um por fase. As partes anteriores existem para você decidir e para eu ter referência.

---

## PARTE 1 · Duas decisões de arquitetura

### 1.1 Onde construir: dentro do Gerador de Documentos, não em app novo

O app `gerador-de-documentos-react` já tem autenticação, PocketBase, perfil do corretor com CRECI
e a lista de documentos. Um app novo duplicaria tudo isso e obrigaria o corretor a manter dois
logins. **Recomendação: novo módulo no app existente**, na rota `/estudo-mercado`.

Uma ressalva importante: os geradores atuais seguem `Form → Helpers → Template → Docx` e produzem
`.docx` a partir de placeholders. **O estudo de mercado não cabe nesse pipeline.** Ele tem cálculo
estatístico, gráficos e layout A4 fechado. O pipeline dele é:

```
Form.tsx → Helpers.ts (Zod) → engine.ts (cálculo) → Report.tsx (HTML/A4) → PDF
```

Isso é adição, não quebra: os oito geradores existentes continuam como estão.

### 1.2 Como gerar o PDF: impressão do navegador, não biblioteca

A tentação é usar `jsPDF` ou `pdfmake`. **Não use.** O layout aprovado já existe em HTML e CSS,
com fontes Adobe, tabelas e SVG, e foi validado em 13 páginas. Reconstruir isso em jsPDF é semanas
de trabalho e o resultado é pior.

**Caminho certo:** renderizar o relatório como componente React com o mesmo CSS de impressão
(`@page { size: A4; margin: 0 }`, `.page` com 210×297mm, `break-after: page`) e chamar
`window.print()`. O usuário salva como PDF. É o mesmo motor que já gera o documento hoje.

Se depois quiser PDF no servidor, uma edge function com Puppeteer resolve, **mas não comece por aí**.

---

## PARTE 2 · Faseamento

Construir em três fases, cada uma entregando algo usável.

| Fase | Entrega | Por que nessa ordem |
|---|---|---|
| **1** | Formulário + motor de cálculo + relatório em tela e impressão, com **todos os dados digitados à mão** | Valida o cálculo e o layout sem depender de integração. Já economiza horas por estudo |
| **2** | **Apuração automática do ITBI e do IPTU** por edge function | É o maior ganho de tempo e o maior diferencial. Depende da fase 1 pronta |
| **3** | Importação de comparáveis por colagem ou CSV, e a **nota interna** confidencial | Refinamento. A colagem manual da fase 1 já funciona |

---

## PARTE 3 · Modelo de dados

Coleção PocketBase `estudos_mercado`, com RLS por `user`.

```
// identificação
endereco, numero, condominio, bairro, cidade, cl_logradouro
area_privativa (number), area_fonte (select: iptu|convencao|anuncio|matricula)
pavimento, total_pavimentos, quartos, suites, banheiros, vagas
idade_edificacao, solicitante

// atributos: array de strings, sem pesos visíveis no documento
atributos (json)

// vistoria — define o que o documento pode declarar
vistoria_tipo (select: presencial|video|fotos|nenhuma)

// comercial
anunciado (bool), preco_divulgacao, meses_exposicao, preco_pretendido
condominio_mensal, iptu_mensal, custo_ocupacao_estimado (bool)
comissao_pct (number, default 5)

// apurado automaticamente (fase 2)
itbi_serie (json), iptu_estoque (json), entorno (json)

// amostra de mercado
comparaveis (json: [{endereco, valor, area, quartos, vagas, data, fonte}])

// resultados do motor
resultado (json: {valor_provavel, teto, divulgacao, fechamento, piso, estatisticas, estratos, convergencia})

// confidencial — nunca renderizado no documento do cliente
tem_documento_confidencial (bool)
nota_interna (json)

status (select: rascunho|calculado|emitido)
```

---

## PARTE 4 · O formulário

Quatro passos, na ordem do protocolo. Bloquear o avanço se faltar item do passo 1.

**Passo 1 · Identificação** — endereço, condomínio, área e sua fonte, tipologia, pavimento e total
de pavimentos do prédio, solicitante.

**Passo 2 · Atributos e vistoria** — checkboxes dos atributos, e um select obrigatório de como o
estado de conservação foi verificado. **Este campo altera o texto do relatório**: `presencial`
libera a redação normal; `video` e `fotos` acionam o bloco de vistoria indireta declarada;
`nenhuma` desabilita o atributo de reforma e mostra um alerta.

**Passo 3 · Comercial** — preço pretendido, se está anunciado, condomínio e IPTU (com opção
"estimar por rateio"), percentual de comissão.

**Passo 4 · Mercado** — colagem dos comparáveis. Na fase 1, uma textarea que aceita tabela colada e
faz o parse. Mínimo de 6 elementos distintos após depuração, com aviso se ficar abaixo.

---

## PARTE 5 · O motor de cálculo (`engine.ts`)

Funções puras, testáveis, sem React. Esta é a parte que precisa estar certa.

```ts
// 1. Depuração por duplicidade
//    estrita: mesmo endereço + valor + área  → mantém 1
//    por redução: mesmo endereço + área + config, diferença de valor < 2% → mantém o mais recente
depurar(comparaveis) → { distintos, taxaDuplicidade }

// 2. Remoção do auto-comparável ⚠️ obrigatório
//    alerta se houver comparável com o mesmo endereço, área e configuração do avaliado
detectarAutoComparavel(distintos, imovel) → alerta[]

// 3. Estatística dos valores unitários
estatistica(distintos) → { media, mediana, desvioPadrao, cv }
//    cv <= 15% → leitura por R$/m² se sustenta
//    cv  > 15% → migrar para leitura por preço total

// 4. Estratificação por faixa de área (fator de escala)
//    3 faixas: abaixo, faixa do avaliado (±5%), acima
//    adotar SEMPRE o estrato da faixa do avaliado, nunca a média geral
estratificar(distintos, areaAvaliado) → estratos[]

// 5. Estrato do próprio condomínio, quando houver comparáveis no mesmo endereço
estratoCondominio(distintos, endereco) → { media, projecao }

// 6. Convergência
//    tabela com todas as referências projetadas para a área do avaliado
//    divergência % entre as duas principais
convergir(referencias, area) → { tabela, divergenciaPct }

// 7. Escala de preço
//    teto = min(máximo do ITBI × área, arredondado para baixo)
//    provável = referência central adotada, ajustada pelo julgamento do avaliador
//    fechamento, divulgação e piso derivam do provável e do teto
escalaDePreco({ provavel, teto, comissaoPct }) → degraus[] com bruto, comissão e líquido

// 8. Inversa: para líquido X, vender por X / (1 - comissão)
inversa(liquidoAlvo, comissaoPct) → { bruto, unitario }
```

**Regra de ouro do motor:** ele **sugere**, o avaliador **decide**. O valor provável e o teto vêm
pré-preenchidos pelo cálculo, mas são editáveis, e o relatório usa o valor confirmado. Avaliação é
ato profissional, não saída de função.

---

## PARTE 6 · Apuração automática (fase 2)

Edge function `apurar-mercado`, porque a API da Prefeitura **não tem CORS** e não pode ser chamada
do navegador.

**Entrada:** nome do logradouro e bairro.
**Saída:** série anual do ITBI, estoque do IPTU e o código CL.

```
1. Descobrir o CL:
   ITBI camada 8, where UPPER(logradouro) LIKE '%NOME%'
   (sem o prefixo do tipo de via: buscar "LUCIO COSTA", não "AVENIDA LUCIO COSTA")

2. Puxar a série:
   where cl='<CL>', outFields com ano, mês, uso, tipologia, total_transações,
   média_percentual_transferido, média_área_construída, média_valor_transação

3. Filtrar: uso RESIDENCIAL, percentual transferido >= 90, área e valor não nulos

4. Consolidar TODOS os bairros em que o logradouro aparece (vias de divisa vêm repartidas)

5. Excluir valores atípicos antes de agregar

6. Agregar por ano: contagem, mediana ponderada e máximo de valor unitário

7. IPTU camada 5, where cl='<CL>' → total de imóveis e área construída
```

**Endpoints:**
```
https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Fazenda/ITBI/MapServer/8/query
https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Fazenda/IPTU/MapServer/5/query
```

⚠️ **A base é agregada por mês.** Cada linha é a média de um período, não um negócio individual. O
relatório precisa declarar isso, e o texto nunca pode afirmar que "nenhuma transação foi fechada
acima de X". O correto é "nenhum mês registrou valor médio acima de X".

---

## PARTE 7 · O relatório

Componente `<EstudoDeMercado dados={...} />` que renderiza as 13 páginas.

**Não reescreva o CSS.** Copie o do `MODELO-estudo-de-mercado.html` desta pasta: ele está validado.
Classes: `.page`, `.sec-head`, `.body`, `.label`, `.callout`, `.kpi`, `.ladder`, `.sintese`.

**Estrutura fixa das 13 páginas** conforme a Parte 3 do `PROTOCOLO-ESTUDO-DE-MERCADO.md`.

**Os dois gráficos são SVG com coordenadas calculadas**, não imagens:
- evolução da mediana do ITBI, barras por ano
- posicionamento na escala unitária, com marcadores escalonados em altura para não colidirem

**Logos** vêm do perfil do corretor ou de assets embutidos em base64.

---

## PARTE 8 · Regras inegociáveis

Estas não são preferências. Se o app as violar, o documento perde a função.

1. **O valor só aparece na Seção 07.** A Seção 01 traz identificação e roteiro, nunca números de avaliação.
2. **Nenhum percentual de ajuste por atributo** no documento. A lista de atributos aparece; os pesos não.
3. **Nenhum valor isolado para um atributo.** O impacto aparece por diferença entre colunas na tabela de condicionante.
4. **Todo preço já contém a comissão**, sempre com a coluna de líquido ao lado.
5. **Ressalvas montadas por tipologia**, nunca lista fixa. Cota de inundação e alagamento são de casa e terreno.
6. **Dois documentos separados** quando houver fonte confidencial: o estudo do cliente e a nota interna. Nada da certidão vaza para o primeiro.
7. **O documento não faz oferta comercial.** Nem proposta, nem condições, nem argumento de venda.
8. **Toda afirmação sobre o teto é em R$/m²**, nunca em preço total.

---

## PARTE 9 · Prompts para colar no Skip

### 🟢 Prompt 1 — Fase 1: formulário, motor e relatório

```
Quero adicionar um novo módulo ao app: um gerador de Estudo de Mercado imobiliário.
Ele NÃO segue o pipeline dos geradores atuais (que produzem .docx a partir de
placeholders). Este tem cálculo estatístico, gráficos e layout A4 fechado.

ROTA: /estudo-mercado, protegida, com item no menu principal.

PIPELINE: Form.tsx → Helpers.ts (schema Zod) → engine.ts (cálculo puro) →
Report.tsx (HTML A4) → impressão do navegador.

IMPORTANTE sobre o PDF: não use jsPDF nem pdfmake. Renderize o relatório como
componente React com CSS de impressão (@page { size: A4; margin: 0 }, .page com
210mm x 297mm e break-after: page) e gere o PDF por window.print(). O layout já
está validado nesse formato.

COLEÇÃO POCKETBASE `estudos_mercado`, com acesso restrito ao próprio usuário:
- identificação: endereco, numero, condominio, bairro, cidade, cl_logradouro,
  area_privativa (number), area_fonte (select: iptu, convencao, anuncio, matricula),
  pavimento (number), total_pavimentos (number), quartos, suites, banheiros, vagas,
  idade_edificacao, solicitante
- atributos: json (array de strings)
- vistoria_tipo: select (presencial, video, fotos, nenhuma)
- comercial: anunciado (bool), preco_divulgacao, meses_exposicao, preco_pretendido,
  condominio_mensal, iptu_mensal, custo_ocupacao_estimado (bool), comissao_pct
  (number, default 5)
- comparaveis: json (array de {endereco, valor, area, quartos, vagas, data})
- itbi_serie: json, iptu_estoque: json
- resultado: json
- status: select (rascunho, calculado, emitido)

FORMULÁRIO em 4 passos, com validação Zod, bloqueando o avanço do passo 1 se faltar
campo obrigatório:
1. Identificação
2. Atributos (checkboxes) e vistoria. O campo vistoria_tipo é obrigatório e altera o
   relatório: "presencial" usa redação normal; "video" e "fotos" acionam um bloco de
   vistoria indireta declarada; "nenhuma" desabilita o atributo de reforma e exibe alerta.
3. Comercial
4. Comparáveis: textarea que aceita uma tabela colada e faz o parse em linhas com
   endereço, valor, área, quartos, vagas e data. Avisar se sobrarem menos de 6
   elementos distintos após a depuração.

MOTOR engine.ts, com funções puras e sem React:
- depurar(comparaveis): remove duplicidade estrita (mesmo endereço, valor e área) e
  duplicidade por redução de preço (mesmo endereço, área e configuração, com diferença
  de valor abaixo de 2%, mantendo o anúncio mais recente). Retorna os distintos e a taxa.
- detectarAutoComparavel(distintos, imovel): alerta se algum comparável tiver o mesmo
  endereço, área e configuração do imóvel avaliado.
- estatistica(distintos): média, mediana, desvio-padrão e coeficiente de variação dos
  valores unitários. Se o CV passar de 15%, sinalizar que a leitura deve migrar para
  preço total.
- estratificar(distintos, areaAvaliado): três faixas de área (abaixo, faixa do avaliado
  com tolerância de 5%, acima), com média de cada uma e projeção para a área do avaliado.
  A faixa do avaliado é a adotada, nunca a média geral.
- estratoCondominio(distintos, endereco): mesmo cálculo restrito ao mesmo endereço.
- convergir(referencias, area): tabela com todas as referências projetadas para a área
  do avaliado e a divergência percentual entre as duas principais.
- escalaDePreco({provavel, teto, comissaoPct}): cinco degraus (piso de absorção rápida,
  valor provável, fechamento recomendado, divulgação recomendada, teto), cada um com
  preço de venda, comissão e líquido ao proprietário.
- inversa(liquidoAlvo, comissaoPct): retorna o bruto necessário e o equivalente por m².

REGRA CENTRAL: o motor sugere, o avaliador decide. Valor provável e teto vêm
pré-preenchidos pelo cálculo mas são editáveis, e o relatório usa o valor confirmado.

TELA DE RESULTADO: mostra a estatística, os estratos, a convergência e a escala de
preço, com os campos de valor provável e teto editáveis, e um botão "Gerar relatório".
```

### 🟢 Prompt 2 — Fase 1b: o relatório

```
Agora o componente do relatório. Crie Report.tsx renderizando um documento A4 de 13
páginas a partir dos dados do estudo.

Vou colar o CSS e a estrutura HTML de referência já validados. Use exatamente esse CSS,
não reescreva: as classes são .page, .sec-head, .h-section, .body, .label, .caption,
.callout, .kpi, .ladder, .rung, .sintese, .result.

[COLE AQUI O CONTEÚDO DE MODELO-estudo-de-mercado.html]

Transforme cada página em um subcomponente que recebe os dados por props. Os textos
fixos permanecem; os números e listas vêm dos dados.

Dois gráficos em SVG inline, com coordenadas calculadas a partir dos dados, nunca imagem:
1. Evolução da mediana do ITBI: barras por ano, com o ano de pico em navy e o ano
   corrente em ouro.
2. Posicionamento na escala de valores unitários: eixo horizontal com marcadores para o
   estrato de área, o valor provável e a faixa do teto. Escalone a altura dos rótulos
   para que não colidam quando os valores forem próximos.

Botão "Imprimir / Salvar PDF" chamando window.print(), com todo o resto da interface
escondido em @media print.
```

### 🟢 Prompt 3 — Fase 2: apuração automática

```
Crie uma edge function `apurar-mercado` que apura os dados oficiais de um logradouro do
Rio de Janeiro. Precisa ser server-side porque a API da Prefeitura não tem CORS.

ENTRADA: { logradouro: string, bairro: string }
SAÍDA: { cl, serie_anual, estoque_iptu, avisos[] }

PASSOS:
1. Descobrir o código CL na camada 8 do ITBI, com
   where=UPPER(logradouro) LIKE '%NOME%'. Buscar SEM o prefixo do tipo de via:
   use "LUCIO COSTA", não "AVENIDA LUCIO COSTA".
2. Puxar todos os registros com where=cl='<CL>', trazendo ano_transação,
   mês_transação, bairro, uso, principais_tipologias, total_transações,
   média_percentual_transferido, média_área_construída e média_valor_transação.
3. Filtrar: uso RESIDENCIAL, média_percentual_transferido >= 90, área e valor não nulos.
4. Consolidar TODOS os bairros em que o logradouro aparecer. Vias de divisa vêm
   repartidas entre bairros e ignorar isso produz série incompleta.
5. Excluir valores atípicos antes de agregar, e devolver quantos foram excluídos no
   array de avisos.
6. Agregar por ano: total de transações, mediana ponderada por total_transações e
   máximo do valor unitário, sendo o unitário igual a
   média_valor_transação / média_área_construída.
7. INCLUIR o ano corrente como linha parcial sinalizada. Não omitir.
8. Na camada 5 do IPTU, mesmo CL, somar total de imóveis e área construída por
   tipologia, para calcular a área média do logradouro.

ENDPOINTS:
https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Fazenda/ITBI/MapServer/8/query
https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Fazenda/IPTU/MapServer/5/query

ATENÇÃO: a base é agregada por mês. Cada linha traz a média de um período, não um
negócio individual. Nomeie os campos de saída de forma a deixar isso claro, por exemplo
maior_valor_medio_mensal em vez de maior_transacao.

No formulário, um botão "Apurar dados oficiais" que chama essa função a partir do
endereço, preenche a série e mostra os avisos.
```

### 🟢 Prompt 4 — Fase 3: nota interna

```
Acrescente ao estudo um segundo documento, a nota interna confidencial, que nunca é
entregue ao cliente.

Campo tem_documento_confidencial (bool) e nota_interna (json) com: preço de aquisição,
data, proprietário, ônus, e observações de estratégia.

Quando marcado, exibir na tela de resultado um painel "Uso interno" com:
- o ponto de equilíbrio do proprietário: bruto necessário para liquidar o que ele pagou,
  considerando a comissão
- a comparação do preço pago com a mediana e o máximo do ITBI do ano da aquisição
- se o imóvel foi ocupado pelo proprietário, o benefício de moradia estimado no período

REGRA ABSOLUTA: nada desse painel pode aparecer no relatório do cliente. São dois
documentos com renderizações separadas, e a nota interna precisa de marca d'água
"USO INTERNO — NÃO ENTREGAR AO CLIENTE".
```

---

## PARTE 10 · O que não automatizar

Vale a pena registrar, porque a tentação é automatizar tudo.

- **O valor provável e o teto.** O motor sugere; a assinatura é sua. Avaliação é ato profissional.
- **A caracterização da região.** Distâncias podem vir de API, mas a leitura do trecho depende de
  conhecimento local.
- **A estratégia de conversa.** Fica na nota interna, escrita caso a caso.
- **A decisão sobre a vistoria.** O app registra o que foi feito; não decide se basta.
