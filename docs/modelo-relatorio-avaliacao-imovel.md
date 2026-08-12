# Modelo de Relatório de Avaliação de Imóvel: Godoy Prime Realty

> **O que é este arquivo.** Um molde replicável para produzir laudos de avaliação com o
> mesmo padrão de qualidade e defensabilidade. Reúne a **estrutura** (seções), os **campos
> a preencher** (placeholders `{{ }}`) e o **método** (como chegar aos números).
>
> Normas de referência: **NBR 14.653 (ABNT)** e diretrizes do **COFECI**.
> Método principal: **Comparativo Direto de Dados de Mercado**, validado por **transações
> oficiais (ITBI)**.

**Versão 2 (11/08/2026).** A v1 foi extraída do laudo da Av. Geremário Dantas, 472
(casa, Pechincha). A v2 incorpora as calibrações do segundo caso real: Av. Lúcio Costa,
3.606 (apartamento, Barra da Tijuca). O histórico de mudanças está no fim do arquivo.

---

## 📥 PARTE A: Checklist de insumos (coletar antes de escrever)

Sem estes dados o laudo não fecha. Marcar conforme obtém:

### A.1 Registral
- [ ] **Matrícula / RGI:** nº, ofício, área do terreno, testada, área edificada averbada, habite-se, averbações (AV/R), proprietário atual.
- [ ] **Cadeia de preços da matrícula:** todo registro de compra e venda (R-x) traz o preço e a data. Anotar **os dois ou três últimos**. É insumo de cálculo, não curiosidade (ver Passo B.8).
- [ ] **Ônus vigentes:** hipoteca, penhora, usufruto, indisponibilidade. Anotar também os já baixados, com a averbação que os baixou.
- [ ] **Mudanças de denominação de logradouro** averbadas. Afetam a busca de comparáveis e de ITBI.

### A.2 Físico
- [ ] **Características gerais:** tipo, pavimentos, quartos e suítes, banheiros, vagas, lazer e dependências, estado de conservação.
- [ ] **Se for apartamento:** andar, posição solar, vista, fração ideal, idade da edificação, **valor do condomínio**.
- [ ] **Se for casa ou terreno:** testada, topografia, recuos, taxa de ocupação, fatores de terreno.
- [ ] **IPTU anual.**
- [ ] **Área privativa confirmada em duas fontes.** Se a matrícula não averba área (comum em incorporações antigas, que descrevem só a fração ideal), registrar isso como ressalva: todo o cálculo é proporcional à área.

### A.3 Comercial
- [ ] **O imóvel está anunciado?** Pergunta binária, feita antes das outras duas. Ela decide qual ramo do Passo B.9 se aplica.
- [ ] **Preço pretendido pelo proprietário.** Existe sempre, mesmo em imóvel nunca anunciado. É o número que a conversa precisa endereçar (Passo B.13).
- [ ] **Preço atual de divulgação.** Só existe se o imóvel estiver anunciado. **Não confundir com o pretendido:** um é o que o mercado já viu, o outro é o que o proprietário quer.
- [ ] **Tempo de exposição:** meses no mercado sem venda (Passo B.9, ramo 1).
- [ ] **Histórico de reduções de preço**, se houver.
- [ ] **Custo de aquisição do proprietário:** preço pago, ITBI recolhido e despesas de escritura e registro. Sai da matrícula e do próprio cliente. Insumo do ponto de equilíbrio (Passo B.13).

### A.4 Mercado
- [ ] **Comparáveis:** mínimo de 6 anúncios da região, com endereço, valor, área, quartos, vagas, data e fonte.
- [ ] **Transações oficiais (ITBI):** contagem por ano e mín/mediana/máx de valor unitário da zona de influência, no quinquênio.
- [ ] **Fontes automatizadas consultadas:** anotar **todas**, com o resultado de cada uma. Se houver mais de uma, elas precisam ser reconciliadas por escrito (Passo B.2).

### A.5 Vistoria e contexto
- [ ] **Registro fotográfico:** fachada **e interior**. Sem foto interna não se sustenta ajuste por reforma ou conservação.
- [ ] **Fatores especiais:** curso d'água, ruído, umidade, faixa não edificável, etc.
- [ ] **Contexto locacional:** via (arterial x interna), comércio, transporte público, escolas, acessibilidade.

---

## 🧮 PARTE B: O método (como chegar aos números)

### B.1 Referência oficial (ITBI)
Consultar a base da Fazenda para a zona de influência. Montar a tabela por ano (transações, mín, mediana, máx). Separar a mediana **geral** da mediana do **segmento** do imóvel (ex.: casas x apartamentos). Aplicar ajuste percentual por características para obter o valor de referência do modelo.

Verificar se o logradouro está **dividido entre bairros** no cadastro do ITBI. É frequente em vias de divisa e obriga a consolidar os dados, com ressalva explícita no laudo.

### B.2 Reconciliação de fontes automatizadas
Quando houver mais de uma ferramenta (modelo próprio sobre ITBI, portais de mercado, etc.), **nunca adotar a maior sem justificar**. Montar a tabela comparativa e escolher com critério declarado.

Regra de prioridade: **transação efetivada prevalece sobre preço pedido.** Anúncio é intenção; ITBI é negócio fechado.

Sinais de que uma fonte automatizada deve ser descartada como valor central:
- O resultado coincide com o **preço de aquisição** do proprietário atual (ancoragem no custo, não no mercado).
- O resultado não é o ponto médio da faixa que a própria ferramenta declara.
- O resultado supera o **máximo absoluto** já registrado no ITBI da via.

### B.3 Amostragem
Partir do universo de anúncios e selecionar os de maior semelhança.

### B.4 Remoção do auto-comparável ⚠️ passo obrigatório
Verificar se o **imóvel avaliado** está na amostra. Ferramentas de mercado varrem os mesmos portais onde ele está anunciado. Se estiver, **excluir**, sob pena de comparar o imóvel consigo mesmo e travar a avaliação no preço que se quer questionar.

Sinal de alerta: comparáveis no mesmo número, com a mesma área e a mesma configuração do avaliado.

### B.5 Depuração por duplicidade
Anúncios do mesmo imóvel divulgados por corretores diferentes inflam a amostra.

- **Duplicidade estrita:** endereço, valor e área idênticos. Manter 1.
- **Duplicidade por redução de preço:** mesmo endereço, mesma área, mesma configuração, **diferença de valor abaixo de 2%** e datas distintas. É o mesmo imóvel com corte de preço. Manter o anúncio **mais recente**.

Reportar a taxa de duplicidade. Acima de 25% é sinal de estoque concentrado e vale citar no laudo.

### B.6 Tratamento estatístico
Calcular média, mediana, desvio-padrão e **coeficiente de variação (CV)** dos valores unitários.

- **CV até ~15%:** a amostra é homogênea e a leitura por **R$/m² se sustenta**. Típico de apartamentos da mesma via e tipologia.
- **CV acima de ~15%:** não fixar R$/m² isolado; migrar para **leitura por preço total**. Típico de casas, que o mercado precifica por produto e não por metro.

### B.7 Estratificação por faixa de área (fator de escala) ⚠️ passo obrigatório
Mesmo com CV baixo, a **média simples dos unitários é enviesada**: o R$/m² cai à medida que a área cresce. Aplicar a média geral a um imóvel grande superestima o valor.

Separar a amostra em três estratos (menores, faixa do avaliado, maiores) e calcular a média de cada um. Se o gradiente for monotônico, o fator de escala está confirmado.

**Adotar o estrato da faixa do avaliado, não a média geral.** Reportar os três, para mostrar o gradiente.

**Estrato do próprio edifício ou condomínio.** Quando houver comparáveis no mesmo endereço, montar também esse recorte. Ele é um controle mais estrito que a faixa de área, porque fixa construção, idade, condomínio, vista e localização de uma vez. Se o estrato de área e o do edifício convergirem, a amostra está validada por dois cortes independentes, e isso é o argumento mais sólido da Seção 05. Se divergirem muito, investigar antes de prosseguir.

Registrar também o **maior preço pedido no edifício**: é o teto psicológico com que o cliente vai se comparar.

### B.8 Âncora dominial: o preço que o proprietário pagou ⚠️ passo novo
Extrair da matrícula o preço e a data da última compra e venda e comparar com a **mediana e o máximo do ITBI daquele ano**.

Isso responde a pergunta que decide a conversa com o cliente: *ele comprou dentro, abaixo ou acima do mercado?*

- Comprou **acima do máximo do ano**: pagou preço de topo. O mercado pode levar anos para alcançar. Este é o argumento central do laudo e explica a resistência a precificar mais baixo.
- Comprou **na mediana ou abaixo**: há folga. O laudo pode ser mais agressivo na recomendação.

Quando há promessa de compra e venda (R-x) anterior à escritura definitiva, **o preço é o da promessa e o ano de referência é o do acordo**, não o do registro. A diferença costuma ser de dois ou três anos e muda a leitura por completo.

### B.9 Âncora empírica: o teste de mercado
Dois ramos, conforme a resposta da Parte A.3.

**Ramo 1: o imóvel já está anunciado.** Se está há X meses sem vender no preço atual, isso **é prova** de desalinhamento entre preço e demanda. Evidência retrospectiva e direta. Usar como argumento de abertura.

**Ramo 2: o imóvel nunca foi anunciado.** Não há teste próprio, mas há o teste dos vizinhos. Levantar os **concorrentes diretos** (mesmo edifício, ou mesma via e mesma tipologia), com o preço pedido e há quanto tempo estão no mercado. Se eles não vendem, o mercado já respondeu à faixa de preço, e a resposta vale para o avaliado.

Registrar dois pontos que o cliente costuma não enxergar:
- **Não ter exposição é vantagem**, não lacuna: o imóvel entra limpo e pode ser posicionado certo na primeira tentativa.
- **Essa vantagem se queima** se ele entrar em um preço que o mercado já está rejeitando nos vizinhos. É uma munição de tiro único.

Nunca escrever "o teste já foi realizado" no ramo 2. O teste foi feito pelos concorrentes, e o laudo precisa dizer isso com precisão para não afirmar o que não aconteceu.

### B.10 Convergência
Comparar as referências principais em uma tabela única, todas projetadas para a área do avaliado. Declarar a **divergência percentual** entre os dois métodos principais. Quanto menor, mais sólido o valor provável.

Quando a mediana ITBI do ano corrente e a média dos unitários anunciados praticamente coincidem, o mercado tem pouca gordura entre pedido e fechado. Vale registrar: significa margem de negociação estreita.

### B.11 Três faixas de liquidez
- **↑ Maior liquidez:** venda rápida, absorção em ~90 dias.
- **● Valor provável de mercado:** o número central, base da recomendação.
- **↓ Menor liquidez / teto técnico:** venda sem urgência, prazo ampliado. **Limitar pelo máximo do ITBI do ano corrente**, que representa negócio excepcional e não patamar replicável.

### B.12 Recomendação de divulgação
Posicionar entre a mediana dos comparáveis e o teto absorvível. Definir a **margem de negociação** (reduzida para imóveis com exposição longa) e a **faixa esperada de fechamento**.

Fechar com o **líquido ao proprietário**, descontada a corretagem. É o número que ele realmente decide.

Se o imóvel entra no mercado **sem exposição prévia**, a margem de negociação pode ser mais larga que a usual: anúncio novo sustenta negociação mais ampla que anúncio desgastado. É o inverso da regra da exposição longa.

### B.13 Teste de viabilidade do preço pretendido ⚠️ passo novo
O proprietário chega com um número na cabeça. O laudo precisa endereçá-lo de frente, e não apenas apresentar o valor de mercado e esperar que a diferença se explique sozinha.

**Passo 1: confrontar.** Tabela do preço pretendido contra todas as referências apuradas (valor provável, modelo ITBI, estrato de área, estrato do edifício, maior anúncio do edifício, maior anúncio da amostra, preço pago pelo proprietário) e, sobretudo, contra o **máximo absoluto do ITBI da via**. Um preço acima desse teto exige um negócio superior a todos os já registrados no logradouro no período, e isso precisa ser dito com essas palavras.

**Passo 2: o ponto de equilíbrio.** É o cálculo que costuma faltar quando o proprietário fixa o preço pretendido. Montar a tabela bruto → líquido (descontada a corretagem) → resultado contra o custo de aquisição, para cada cenário. Depois inverter a conta e declarar **por quanto ele precisaria vender** para empatar, com e sem o ITBI da compra.

É comum descobrir que o preço pretendido não recupera o capital investido. Quando esse for o caso, dizer explicitamente: *não existe hoje um preço que seja simultaneamente vendável e capaz de recuperar o custo de aquisição.* Essa frase reposiciona a conversa inteira, e é honesta.

**Passo 3: a alternativa de carregar.** Se recuperar o capital for condição inegociável, a única via é o tempo. Projetar, pela valorização histórica da via, em quanto tempo o mercado alcança o ponto de equilíbrio. Ressalvar sempre: a projeção não desconta custo de carrego (condomínio, IPTU, manutenção) nem custo de oportunidade, e valorização passada não garante valorização futura.

O objetivo deste passo não é convencer o cliente a baixar o preço. É converter uma discussão de opinião ("acho que vale mais") em uma decisão com dois cenários quantificados: vender agora com perda nominal conhecida, ou carregar por um prazo conhecido.

---

## 📄 PARTE C: Estrutura do documento (preencher)

### CAPA
- **Título:** RELATÓRIO DE AVALIAÇÃO: Valor de Mercado
- **Imóvel:** {{endereco_completo}} · {{bairro}} · {{cidade}}
- **Data:** {{data_emissao}}
- **Solicitante:** {{nome_solicitante}}
- **Avaliador:** {{nome_avaliador}} · CRECI {{creci_pf}} · Consultor de Avaliação
- **Empresa:** Godoy Prime Realty · CRECI {{creci_pj}} · {{endereco_empresa}} · {{telefone}} · {{site}}

### SEÇÃO 01: Identificação e resultado

**Características do imóvel.** Tabela com três colunas: Campo | Valor | **Fonte**.
A coluna de fonte não é enfeite: separa o que veio da matrícula do que veio do anúncio, e é o que sustenta o laudo em contestação.

| Campo | Valor | Fonte |
|---|---|---|
| Endereço | {{endereco}} | |
| Bairro | {{bairro}} | |
| Matrícula | {{matricula}} · {{oficio_rgi}} | |
| Inscrição municipal | {{inscricao_municipal}} | |
| Tipo | {{tipo_imovel}} | |
| Área privativa / edificada | {{area}} m² | |
| *(casa)* Área do terreno / testada | {{area_terreno}} m² / {{testada}} m | |
| *(apto)* Andar / fração ideal | {{andar}} / {{fracao_ideal}} | |
| Quartos | {{quartos}} (sendo {{suites}} suítes) | |
| Banheiros | {{banheiros}} | |
| Vagas de garagem | {{vagas}} | |
| Habite-se | {{habite_se}} | |
| Idade da edificação | {{idade}} anos | |
| Situação de mercado | {{anunciado_ou_nao}} | |
| Preço pretendido pelo proprietário | R$ {{preco_pretendido}} | |
| Preço atual de divulgação *(se anunciado)* | R$ {{preco_atual}} | |
| Tempo de exposição *(se anunciado)* | {{tempo_exposicao}} | |
| Condomínio mensal | R$ {{condominio}} | |
| IPTU anual | R$ {{iptu}} | |

**Resultado (tabela de destaque):**

| Faixa | Valor | R$/m² |
|---|---|---|
| ↑ Maior liquidez (absorção em ~90 dias) | R$ {{valor_maior_liquidez}} | R$ {{unit_maior}} |
| ● Valor provável de mercado | R$ {{valor_provavel}} | R$ {{unit_provavel}} |
| ↓ Menor liquidez (teto técnico) | R$ {{valor_menor_liquidez}} | R$ {{unit_menor}} |

**VALOR RECOMENDADO DE DIVULGAÇÃO: R$ {{valor_divulgacao}}** ({{rs_m2_divulgacao}}/m²).
Margem de negociação: {{margem_pct}}%. Fechamento esperado entre R$ {{fechamento_min}} e R$ {{fechamento_max}}.

> Se houver preço pretendido acima do recomendado, abrir aqui uma nota de uma linha com a diferença percentual e remeter à Seção 06. O leitor precisa ver o confronto na primeira página, não descobrir na sexta.

**Finalidade:** {{finalidade}}, em conformidade com a NBR 14.653/ABNT e as diretrizes do COFECI.

### SEÇÃO 02: O imóvel e seu estado de conservação

**Descrição:** {{descricao_fisica}}

**Tabela de atributos e ajustes.** Listar cada característica com o percentual aplicado e fechar com o ajuste líquido. Duas variantes conforme a tipologia:

- **Apartamento:** vista, andar, posição solar, reforma, lazer, portaria, vaga extra, elevador, dependência, frente própria.
- **Casa ou terreno:** conservação, fechamento, topografia, recuos, e **fatores especiais** (curso d'água, ruído, umidade, faixa não edificável). Indicar qual é o **de maior impacto** e se é **permanente** ou **removível**.

**Situação registral:** {{situacao_registral}}. Cobrir habite-se, ônus vigentes e baixados, continuidade da cadeia dominial, mudanças de denominação de logradouro e aptidão a financiamento.

**Proprietário atual:** {{proprietario}}. Se for pessoa jurídica, registrar que a apuração de ganho de capital segue o regime tributário da empresa e recomendar consulta à contabilidade antes de fixar o piso.

**Área:** se a matrícula não averba área privativa, dizer isso em texto corrido e explicar a consequência: o cálculo é proporcional à área, e divergência desloca o resultado.

### SEÇÃO 03: A região
- **Localização e via:** {{descricao_via}} (arterial x residencial interna).
- **Infraestrutura:** comércio, serviços, escolas → {{infraestrutura}}
- **Transporte e acessibilidade:** {{transporte}}
- **Perfil locacional:** conveniência x restrição de demanda para a tipologia → {{perfil_locacional}}
- **Observação cadastral:** {{ressalva_bairro_itbi}}, se o logradouro estiver dividido entre bairros no ITBI.

### SEÇÃO 04: Metodologia aplicada
- Método Comparativo Direto de Dados de Mercado, validado por transações oficiais (ITBI).
- **Tabela de transações oficiais por ano:** ano | transações | mín/m² | mediana/m² | máx/m². Total no quinquênio: {{total_transacoes}}.
- **Leitura da tabela:** liquidez da região, estabilidade do volume, tendência de preço em % ao ano, e destaque para saltos recentes.
- **Ressalva metodológica:** {{ressalva_itbi}}.
- **Reconciliação das referências automatizadas:** tabela com fonte | base de dados | resultado | divergência. Declarar qual foi adotada e **por quê**, com os motivos numerados.

### SEÇÃO 05: Amostragem de mercado
- Universo de {{universo}} anúncios → selecionados {{n_selecionados}} de maior semelhança.
- **Tabela de comparáveis:** endereço | valor | R$/m² | área | quartos | vagas | data.
- **Remoção do auto-comparável:** {{auto_comparavel}}.
- **Depuração por duplicidade:** tabela dos grupos repetidos. {{n_selecionados}} anúncios → **{{n_distintos}} elementos distintos**. Taxa de duplicidade: {{taxa_duplicidade}}%.
- **Estatística dos unitários:** média R$ {{media_unitaria}}, mediana R$ {{mediana_unitaria}}, desvio-padrão R$ {{desvio}}, **CV {{cv}}%**. Declarar a consequência: CV baixo sustenta R$/m²; CV alto obriga leitura por preço total.
- **Estratificação por faixa de área:** tabela com os três estratos (n, média R$/m², CV, projeção para a área do avaliado). Declarar o gradiente e **quanto a média geral superestimaria**. Adotar o estrato pertinente.
- **Estrato do próprio edifício** (quando houver comparáveis no mesmo endereço): tabela com área, pedido, R$/m² e **há quanto tempo cada unidade está no mercado**. Fechar com a média do edifício, a convergência contra o estrato de área e o maior preço pedido no prédio. Esta tabela serve duas vezes: valida a amostra aqui e vira a evidência do ramo 2 da Seção 06.

### SEÇÃO 06: Convergência e posicionamento
- **Tabela de convergência:** cada referência projetada para a área do avaliado, com a divergência percentual contra a referência adotada.
- **Divergência entre os dois métodos principais: {{divergencia_pct}}%.**
- **Histórico de aquisição do próprio imóvel:** preço e data dos últimos registros de compra e venda, e tabela comparando o unitário pago contra a mediana e o máximo do ITBI do ano do acordo. Fechar com a leitura: comprou dentro, abaixo ou acima do mercado.
- **Posicionamento:** escala de referência da amostra, onde o avaliado se situa e por quê, e o limite superior imposto pelo máximo do ITBI.
- **O teste de mercado**, no ramo que couber:
  - *Imóvel anunciado:* "o teste já foi realizado", com {{tempo_exposicao}} sem venda como evidência de desalinhamento.
  - *Imóvel não anunciado:* "o teste que os vizinhos já fizeram", com os concorrentes diretos, o preço de cada um e o tempo de mercado. Somar a nota de que a ausência de exposição é vantagem e que ela se queima em uma única entrada errada.
- **Teste de viabilidade do preço pretendido:** tabela do preço pretendido contra todas as referências e contra o máximo do ITBI da via.
- **Ponto de equilíbrio do proprietário:** tabela bruto → líquido → resultado contra o custo de aquisição, e os preços necessários para empatar com e sem o ITBI da compra.
- **Alternativa de manter o imóvel:** prazo estimado, pela valorização histórica, até o mercado alcançar o ponto de equilíbrio, com as ressalvas de carrego e de projeção.

### SEÇÃO 07: Conclusão
- **Valor provável de mercado:** R$ {{valor_provavel}} ({{rs_m2_provavel}}/m²), com a justificativa da posição em relação às referências.
- **Fatores de valorização:** {{lista_valorizacao}}
- **Fatores de desvalorização:** {{lista_desvalorizacao}}
- **Tabela de recomendação:** divulgar por | margem de negociação | fechamento esperado | teto técnico | piso de absorção rápida.
- **Comparação com o valor de aquisição:** redução percentual do preço de divulgação e do valor provável em relação ao que o proprietário pagou, e o **líquido estimado** descontada a corretagem.
- **Ressalvas de responsabilidade:** montar **conforme a tipologia**, não por lista fixa. Sempre entram: ausência de vistoria estrutural, ausência de verificação de regularidade documental, dados adotados de fonte secundária e a natureza do documento. Entram **apenas quando pertinentes**:
  - *Casa, terreno ou imóvel térreo:* análise urbanística, Faixa Marginal de Proteção, cota de inundação, histórico de alagamento, topografia e recuos.
  - *Apartamento:* área privativa não averbada, custo de ocupação estimado, convenção de condomínio não examinada.

  ⚠️ Ressalva impertinente **enfraquece** o documento: sinaliza formulário preenchido no automático em vez de análise do caso. Cota de inundação em apartamento de 2º pavimento é o exemplo típico. Cabe sempre ao interessado obter certidões atualizadas.
- **Assinatura:** {{nome_avaliador}} · CRECI {{creci_pf}} · Godoy Prime Realty · CRECI {{creci_pj}} · {{cidade}}, {{data_emissao}}.

### ⚠️ BLOCO DE PENDÊNCIAS (uso interno, remover antes de entregar)
Listar o que falta e **por que importa**. Todo laudo sai da primeira rodada com lacunas; o bloco impede que uma delas passe despercebida para o cliente.

Fechar com uma **nota de abordagem**: em uma frase, qual é o argumento de abertura da conversa com o proprietário. Nem sempre é o valor de mercado. Quando o preço pretendido não recupera o capital investido, abrir pelo ponto de equilíbrio costuma ser mais produtivo do que discutir a diferença percentual de avaliação.

---

## 🔁 PARTE D: Como usar este modelo

1. Preencher a **Parte A** (insumos) para o novo imóvel.
2. Rodar o **método da Parte B** na ordem, sem pular B.4, B.7, B.8 e B.13.
3. Copiar a **Parte C** e substituir todos os `{{placeholders}}`.
4. Preencher o bloco de pendências e resolvê-lo antes da entrega.
5. Revisar as ressalvas e assinar.

> 💡 Evolução possível: transformar isto num **gerador dentro do app** (padrão
> `Form.tsx → Helpers.ts → Template.ts → Docx.ts`), com os campos da Parte A virando
> formulário e o método da Parte B virando cálculo automático (depuração, CV,
> estratificação por área, convergência e faixas de liquidez).

---

## 📌 Histórico de versões

### v2 (11/08/2026): calibração pelo caso Av. Lúcio Costa, 3.606
Segundo caso real rodado no molde, e o primeiro apartamento. Sete correções:

1. **A regra do CV ganhou o segundo ramo.** A v1 só tratava CV alto. No caso do apartamento o CV foi 11,7% e o R$/m² se sustentou. A regra agora tem os dois lados, com a razão de cada um.
2. **Estratificação por faixa de área (B.7), nova.** Mesmo com CV baixo, a média simples dos unitários é enviesada pelo fator de escala. No caso concreto o gradiente foi de R$ 17.544/m² (186 m²) a R$ 14.509/m² (255 m²), e usar a média geral teria superestimado o imóvel em 4,1%.
3. **Depuração por duplicidade ganhou tolerância (B.5).** O critério estrito da v1 (valor idêntico) não pegava o mesmo imóvel reanunciado com corte de preço. Novo limiar: diferença abaixo de 2%, mantendo o anúncio mais recente.
4. **Remoção do auto-comparável (B.4), nova e obrigatória.** As ferramentas varrem os mesmos portais onde o imóvel avaliado está anunciado. Sem esse passo, o laudo compara o imóvel consigo mesmo.
5. **Âncora dominial (B.8), nova.** A v1 pedia a matrícula só para dados físicos e registrais. No caso concreto, o preço de aquisição registrado no R-21 foi o dado mais decisivo do laudo: revelou compra 33% acima da mediana do ITBI do ano do acordo. Passou a ser passo de cálculo, com a regra de usar a data da promessa e não a do registro.
6. **Reconciliação de fontes automatizadas (B.2), nova.** Duas ferramentas divergiram 12% no mesmo imóvel. O molde agora obriga tabela comparativa e critério declarado, com a regra de prioridade "transação efetivada prevalece sobre preço pedido" e três sinais de descarte.
7. **Parte A e Seção 02 ganharam variantes por tipologia.** Os fatores especiais da v1 (curso d'água, faixa não edificável) são de casa e terreno. Apartamento pede andar, vista, posição solar, reforma, condomínio e fração ideal. Condomínio e IPTU entraram na Parte A: custo de ocupação alto reduz liquidez.

Também entraram: coluna de **fonte** na tabela de características, tratamento da **área não averbada**, nota sobre **proprietário pessoa jurídica**, **líquido ao proprietário** na recomendação e o **bloco de pendências** de uso interno.

**Segunda rodada do mesmo caso**, depois de confirmado que o imóvel nunca foi anunciado e que o proprietário pretende R$ 4.200.000. Mais quatro correções:

8. **A âncora empírica ganhou o ramo 2 (B.9).** A v1 e a primeira versão da v2 assumiam imóvel já exposto e mandavam escrever "o teste já foi realizado". Em imóvel nunca anunciado essa frase é falsa. Novo ramo: usar os **concorrentes diretos** (mesmo edifício, mesma tipologia) e o tempo de mercado deles como evidência, mais a leitura de que ausência de exposição é vantagem de tiro único.
9. **Teste de viabilidade do preço pretendido (B.13), novo.** O molde produzia o valor de mercado e deixava o número do proprietário sem resposta. Agora confronta os dois de frente, calcula o **ponto de equilíbrio** (bruto → líquido → resultado contra o custo de aquisição) e projeta o **prazo de carrego** até o mercado alcançá-lo. No caso concreto isso revelou que os R$ 4.200.000 pretendidos, líquidos de corretagem, ficam R$ 52.000 abaixo do que a proprietária pagou: o preço não era ambicioso, era abaixo do ponto de equilíbrio, e ninguém tinha feito essa conta.
10. **Parte A separou preço pretendido de preço de divulgação.** São coisas distintas e o molde as tratava como uma só. O pretendido existe sempre; o de divulgação só se o imóvel estiver anunciado. Entrou também o **custo de aquisição** (preço, ITBI, escritura) como insumo obrigatório.
11. **Estrato do próprio edifício (B.7).** Quando há comparáveis no mesmo endereço, esse recorte controla construção, idade, condomínio e vista de uma vez, e é mais estrito que a faixa de área. No caso concreto os dois convergiram com diferença de 0,4%, o que virou a validação mais forte da amostra. A mesma tabela alimenta o ramo 2 da Seção 06.

Entrou ainda a regra de **margem de negociação mais larga para imóvel sem exposição prévia** (inverso da regra de exposição longa) e a **nota de abordagem** no bloco de pendências.

### v1 (11/08/2026): extração do caso Av. Geremário Dantas, 472
Molde original, extraído do relatório final de avaliação de uma casa na Pechincha (v5, 04/08/2026).
