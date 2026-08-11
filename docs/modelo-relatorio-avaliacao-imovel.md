# Modelo de Relatório de Avaliação de Imóvel — Godoy Prime Realty

> **O que é este arquivo.** Um molde replicável extraído do relatório final da
> **Avenida Geremário Dantas, 472** (v5, 04/08/2026). Reúne a **estrutura** (seções),
> os **campos a preencher** (placeholders `{{ }}`) e o **método** (como chegar aos números).
> Objetivo: gerar novos laudos de avaliação com o mesmo padrão de qualidade e defensabilidade.
>
> Normas de referência: **NBR 14.653 (ABNT)** + diretrizes do **COFECI**.
> Método principal: **Comparativo Direto de Dados de Mercado**, validado por **transações oficiais (ITBI)**.

---

## 📥 PARTE A — Checklist de insumos (coletar antes de escrever)

Sem estes dados o laudo não fecha. Marcar conforme obtém:

- [ ] **Matrícula / RGI** — nº, ofício, área do terreno, testada, área edificada averbada, habite-se, averbações (AV/R), proprietário atual e forma de aquisição.
- [ ] **Características físicas** — tipo, pavimentos, quartos/suítes, vagas, lazer/dependências, estado de conservação.
- [ ] **Situação comercial** — preço atual de divulgação e **tempo de exposição** (meses no mercado sem venda).
- [ ] **Comparáveis de mercado** — mínimo de 6 anúncios da região (endereço, valor, área, quartos, vagas, data do anúncio, fonte).
- [ ] **Transações oficiais (ITBI)** — contagem por ano e medianas de valor unitário da zona de influência (Secretaria Municipal de Fazenda).
- [ ] **Vistoria fotográfica** — conservação, fechamento, e **fatores especiais** (curso d'água, ruído, umidade, faixa não edificável, etc.).
- [ ] **Contexto locacional** — via (arterial x interna), comércio, transporte público, escolas, acessibilidade.

---

## 🧮 PARTE B — O método (como chegar aos números)

1. **Referência oficial (ITBI).** Consultar a base da Fazenda para a zona. Separar a mediana **geral** (puxada por apartamentos) da mediana do **segmento** do imóvel (ex.: casas). Aplicar ajuste percentual por características → valor de referência do modelo estatístico.
2. **Amostragem de mercado.** Partir do universo de anúncios (ex.: 18) e selecionar os ~6 mais semelhantes.
3. **Depuração por duplicidade.** Anúncios com valor/área/valor unitário idênticos = **mesmo imóvel** divulgado por vários corretores. Manter só **elementos distintos** (frequentemente sobram 3).
4. **Tratamento estatístico.** Calcular média, desvio-padrão e **coeficiente de variação (CV)** dos valores unitários. CV alto (> ~15%) → não fixar R$/m² isolado; migrar para **leitura por preço total** (o submercado de casas precifica por produto, não por m²).
5. **Convergência.** Comparar a **média dos comparáveis distintos** com o **cenário de venda rápida do modelo oficial**. Quanto menor a divergência, mais sólido o valor provável de mercado.
6. **Três faixas de liquidez:**
   - **↓ Menor liquidez / teto técnico** — venda sem urgência, prazo ampliado.
   - **● Valor provável de mercado** — o número central, base da recomendação.
   - **↑ Maior liquidez** — venda rápida (absorção em ~90 dias).
7. **Recomendação de divulgação.** Posicionar entre a mediana dos comparáveis e o teto absorvível. Definir **margem de negociação** (reduzida para imóveis com exposição longa) e a **faixa esperada de fechamento**.
8. **Âncora empírica.** Se o imóvel está há X meses sem vender no preço atual, isso **é prova** de desalinhamento preço×demanda — usar como argumento central.

---

## 📄 PARTE C — Estrutura do documento (preencher)

### CAPA
- **Título:** RELATÓRIO DE AVALIAÇÃO — Valor de Mercado
- **Imóvel:** {{endereco_completo}} · {{bairro}} · {{cidade}}
- **Data:** {{data_emissao}}
- **Solicitante:** {{nome_solicitante}}
- **Avaliador:** {{nome_avaliador}} · CRECI {{creci_pf}} · Consultor de Avaliação
- **Empresa:** Godoy Prime Realty · CRECI {{creci_pj}} · {{endereco_empresa}} · {{telefone}} · {{site}}

### SEÇÃO 01 — Identificação e resultado
**Características do imóvel (tabela):**
| Campo | Valor |
|---|---|
| Endereço | {{endereco}} |
| Bairro | {{bairro}} |
| Matrícula | {{matricula}} · {{oficio_rgi}} |
| Tipo | {{tipo_imovel}} |
| Área do terreno | {{area_terreno}} m² |
| Testada | {{testada}} m |
| Área edificada averbada | {{area_edificada}} m² |
| Habite-se | {{habite_se}} |
| Pavimentos | {{pavimentos}} |
| Quartos | {{quartos}} (sendo {{suites}} suítes) |
| Vagas de garagem | {{vagas}} |
| Lazer e dependência | {{lazer}} |
| Preço atual de divulgação | R$ {{preco_atual}} |
| Tempo de exposição | {{tempo_exposicao}} |

**Resultado (destaque):**
- **VALOR RECOMENDADO DE DIVULGAÇÃO:** R$ {{valor_divulgacao}} ({{rs_m2_divulgacao}}/m²)
- ↑ **MAIOR LIQUIDEZ:** R$ {{valor_maior_liquidez}} — venda rápida, absorção ~90 dias.
- ↓ **MENOR LIQUIDEZ:** R$ {{valor_menor_liquidez}} — teto técnico, prazo ampliado.
- Redução de {{percentual_reducao}}% sobre o preço atual. Fechamento esperado entre R$ {{fechamento_min}} e R$ {{fechamento_max}}.

**Finalidade:** {{finalidade}} — em conformidade com a NBR 14.653/ABNT e as diretrizes do COFECI.

### SEÇÃO 02 — O imóvel e seu estado de conservação
- **Descrição do imóvel:** {{descricao_fisica}}
- **Situação registral:** {{situacao_registral}} — regularidade e impacto sobre financiamento.
- **Estado de conservação aparente:** {{conservacao}}
- **Fatores especiais** (se houver): {{fatores_especiais}} — indicar qual é o **de maior impacto** sobre o valor e se é **permanente** ou **removível**.

### SEÇÃO 03 — A região
- **Localização e via:** {{descricao_via}} (arterial x residencial interna).
- **Infraestrutura:** comércio, serviços, escolas → {{infraestrutura}}
- **Transporte e acessibilidade:** {{transporte}}
- **Perfil locacional:** conveniência x restrição de demanda para a tipologia → {{perfil_locacional}}

### SEÇÃO 04 — Metodologia aplicada
- Método Comparativo Direto de Dados de Mercado.
- **Transações oficiais na zona (tabela por ano):** {{tabela_itbi}} (total {{total_transacoes}} no quinquênio).
- **Ressalva metodológica:** {{ressalva_itbi}} (ex.: base sem série de valores unitários; logradouro dividido entre bairros).
- **Reconciliação de referências:** mediana geral R$ {{mediana_geral}}/m² vs. mediana do segmento R$ {{mediana_segmento}}/m² → adotada a do segmento, com ajuste de {{ajuste_pct}}% → valor de referência do modelo R$ {{valor_modelo}}.

### SEÇÃO 05 — Amostragem de mercado
- Universo de {{universo}} anúncios → selecionados {{n_selecionados}} de maior semelhança.
- **Tabela de comparáveis:** endereço | valor | R$/m² | área | quartos | vagas | data.
- **Depuração por duplicidade:** {{duplicidades}} → restam {{n_distintos}} elementos distintos.
- **Estatística:** média R$ {{media_unitaria}}/m², desvio-padrão R$ {{desvio}}, CV {{cv}}%.
- **Leitura por preço total** (se CV alto): valores {{precos_totais}} → média R$ {{media_total}}, mediana R$ {{mediana_total}}.

### SEÇÃO 06 — Convergência e posicionamento
- Média dos comparáveis distintos: R$ {{media_total}}.
- Cenário de venda rápida (modelo oficial): R$ {{modelo_venda_rapida}}.
- **Divergência entre os dois métodos: {{divergencia_pct}}%.**
- **Posicionamento do preço atual** (gráfico de barras, escala {{escala_min}}–{{escala_max}}): o preço de R$ {{preco_atual}} está {{pct_acima_media}}% acima da média e {{pct_acima_mediana}}% acima da mediana.
- **"O teste já foi realizado":** {{tempo_exposicao}} sem venda = evidência de desalinhamento.

### SEÇÃO 07 — Conclusão
- **Valor provável de mercado:** R$ {{valor_provavel}} ({{rs_m2_provavel}}/m²).
- **Fatores de valorização:** {{lista_valorizacao}}
- **Fatores de desvalorização:** {{lista_desvalorizacao}}
- **Recomendação:** divulgar por R$ {{valor_divulgacao}} (redução de {{percentual_reducao}}%); margem de negociação {{margem_pct}}%; fechamento esperado R$ {{fechamento_min}}–{{fechamento_max}}; teto técnico R$ {{teto}}.
- **Ressalvas de responsabilidade:** a avaliação não contempla vistoria estrutural, verificação de regularidade documental, análise urbanística, Faixa Marginal de Proteção, cota de inundação nem histórico de alagamento; cabe ao interessado obter certidões atualizadas.
- **Assinatura:** {{nome_avaliador}} · CRECI {{creci_pf}} · Godoy Prime Realty · CRECI {{creci_pj}} · {{cidade}}, {{data_emissao}}.

---

## 🔁 PARTE D — Como usar este modelo

1. Preencher a **Parte A** (insumos) para o novo imóvel.
2. Rodar o **método da Parte B** para produzir os valores.
3. Copiar a **Parte C** e substituir todos os `{{placeholders}}`.
4. Revisar as ressalvas e assinar.

> 💡 Evolução possível: transformar isto num **gerador dentro do app** (padrão
> `Form.tsx → Helpers.ts → Template.ts → Docx.ts`), com os campos da Parte A virando
> formulário e o método da Parte B virando cálculo automático.
