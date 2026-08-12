# Protocolo: Estudo de Mercado — Godoy Prime Realty

> **Gatilho.** Quando Marcus disser *"vamos preparar o estudo de mercado"* (ou pedir avaliação,
> laudo, parecer de valor de um imóvel), abrir por este arquivo, fazer as perguntas da Parte 1 e
> só depois começar. Não começar a produzir antes de ter os bloqueadores.
>
> **Padrão de referência:** `MODELO-estudo-de-mercado.html` nesta mesma pasta, que é o estudo do
> Av. Lúcio Costa 3.606 aprovado em 12/08/2026. Estrutura, design e linguagem daquele documento
> são o padrão. Copiar e substituir os dados.

---

## PARTE 1 · O que perguntar na abertura

Apresentar em três blocos. Os do bloco A bloqueiam o início; os demais podem chegar durante.

### 🔴 A · Bloqueadores

1. **Endereço completo**, com número, e o nome do condomínio ou edifício.
2. **Área privativa** em m², e de qual fonte veio (IPTU, convenção, anúncio, matrícula).
3. **Tipologia:** quartos, suítes, banheiros, vagas de garagem, pavimento e total de pavimentos do prédio.
4. **Atributos que diferenciam o imóvel:** vista, estado de conservação e reforma, lazer, posição solar, frente própria, portaria, dependência, elevador.
5. **Nome do solicitante**, para a capa.
6. **Como o estado de conservação foi verificado:** vistoria presencial, vídeo, fotos, ou nada.
   Isso define o que o documento pode declarar. Vídeo e fotos autorizam *vistoria indireta declarada*;
   sem nenhum, o atributo de reforma não pode ser creditado.

### 🟡 B · Importantes, com plano B se faltarem

7. **Comparáveis de mercado:** relatório de ferramenta (EEmovel ou similar) ou a lista de anúncios da região, com endereço, valor, área, quartos, vagas e data.
   *Sem isso o método comparativo não roda.*
8. **Preço pretendido pelo proprietário.** Não entra no documento, mas orienta a estratégia e o teto.
9. **O imóvel está anunciado?** Se sim, por quanto e há quanto tempo. Se não, é vantagem e o estudo diz isso.
10. **Condomínio e IPTU do imóvel.** Se não vier, estimo por rateio de área a partir de anúncio de outra unidade do mesmo condomínio, declarando a estimativa.
11. **Percentual de comissão acordado.** Padrão adotado: **5%**. Toda a escala de preço é apresentada com a comissão já contida, mais a coluna de líquido ao proprietário.

### 🔵 C · Enquadramento e confidencialidade

12. **Existe certidão do RGI, matrícula ou outro documento que o cliente não sabe que temos?**
    Pergunta obrigatória. Se sim, tudo que só aquela fonte fornece fica **fora** do documento do
    cliente e vai para uma nota interna separada. Ver Parte 5.
13. **Objetivo da conversa:** conduzir a um teto de divulgação, obter valor de mercado puro, subsidiar negociação em curso, ou outro.
14. **Prazo.**

---

## PARTE 2 · O que eu levanto sozinho, sem pedir

Nunca pedir estes dados a ele. São públicos e eu apuro.

| Dado | Fonte | Como |
|---|---|---|
| ITBI do logradouro, série anual | ArcGIS Fazenda RJ, serviço ITBI, camada 8 | `https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Fazenda/ITBI/MapServer/8/query` filtrando por `cl='<código>'` |
| Código CL do logradouro | mesma API | buscar por `UPPER(logradouro) LIKE '%NOME%'`, sem prefixo de tipo de via |
| Estoque e área média da via | ArcGIS Fazenda RJ, serviço IPTU, camada 5 | mesma lógica, `cl='<código>'` |
| Geolocalização do imóvel | Nominatim (OpenStreetMap) | geocodificar por CEP ou por referência local |
| Comércio, escolas, transporte, distâncias | Overpass API (OpenStreetMap) | consulta por bounding box, distâncias em linha reta |
| Identificação do condomínio e vizinhança | busca web | confirmar com ele antes de publicar |

**Regras da apuração de ITBI:**
- Filtrar `uso = RESIDENCIAL`, `média_percentual_transferido >= 90`, e área e valor não nulos.
- Consolidar **todos os bairros** em que o logradouro aparece. Vias de divisa aparecem repartidas.
- **Incluir o ano corrente** como linha parcial sinalizada. A ferramenta do Analytics o exclui por
  padrão, e foi justamente o ano corrente que revelou a virada do mercado no caso Lúcio Costa.
- **Não misturar séries de origens diferentes na mesma tabela.** Se as linhas antigas vierem da
  ferramenta (que apara outliers) e a nova da apuração direta (que não apara), ou se recalcula tudo
  na mesma base, ou se omite a coluna afetada. A coluna de mínimo é a mais sensível e raramente
  sustenta argumento: costuma ser melhor removê-la.

---

## PARTE 3 · Estrutura das 12 páginas

Ordem fixa. O princípio que a organiza: **o valor aparece só no fim.** O proprietário precisa
percorrer o método antes de ver o número, ou ele lê o preço e para.

| Pág. | Seção | Conteúdo |
|---|---|---|
| 1 | Capa | Monograma branco, título, endereço, solicitante, avaliador com credencial |
| 2 | **01** Identificação do imóvel | Características, custo de ocupação, finalidade, **roteiro do estudo em 4 blocos**, base do estudo. **Sem nenhum valor de avaliação.** |
| 3 | **02** O imóvel e conservação | Descrição, atributos (lista, sem percentuais), o condomínio, o pavimento, base da vistoria, como a reforma foi tratada |
| 4 | **03** A região | Posicionamento na orla, KPIs de estoque, configuração urbana a favor e contra, comércio e transporte com distâncias, leitura para precificação |
| 5 | **04** Metodologia | Série do ITBI, gráfico da mediana, dois blocos de leitura, fontes consultadas **sem resultados** |
| 6 | **05** Amostragem | Universo, depuração por duplicidade, estatística, estratificação por área com gráfico |
| 7 | **05** A concorrência no condomínio | Unidades à venda, bloco do imóvel, concentração de oferta, referência do topo |
| 8 | **06** Convergência | Tabela de convergência e reconciliação das fontes divergentes |
| 9 | **06** Justificativa do teto | Três limites, gráfico de posicionamento na escala unitária |
| 10 | **07** Conclusão | Valor provável e teto, fatores de valorização e desvalorização, escala completa |
| 11 | **07** Recomendação | Tabela bruto → comissão → líquido, condicionante da vistoria, tabela inversa |
| 12 | Ressalvas | Seis ressalvas numeradas, assinatura, logo |

**Regras de conteúdo:**
- **Nada de percentuais de ajuste por atributo.** Lista os atributos, não abre a planilha.
- **Nenhum número isolado para o valor de um atributo.** O impacto aparece por diferença entre
  cenários, na tabela de condicionante.
- **Todo preço é preço de venda com a comissão dentro**, e sempre acompanhado do líquido.
- **Nada que só uma fonte confidencial forneça.**

---

## PARTE 4 · Sistema de design

| Elemento | Valor |
|---|---|
| Formato | A4, 210 × 297 mm, `data-canvas-width="794"` e `height="1123"` |
| Margens | 18 mm nas laterais e topo, 16 mm no rodapé |
| Navy | `#0C2340` |
| Ouro | `#D4AF37` |
| Texto | `#3a3f47`, rótulos `#8a9099` |
| Títulos | **Minion 3** (`minion-3`), serifada, peso 600 |
| Corpo e tabelas | **Acumin Pro** (`acumin-pro`), 8,8pt, entrelinha 1,48 |
| Kit Adobe Fonts | `<link rel="stylesheet" href="https://use.typekit.net/bye1efb.css">` |
| Logo capa | `godoy-logo-white.png`, monograma, 23 mm |
| Logo fechamento | `godoy-logo-pdf.png`, lettering horizontal, 56 mm |
| Rodapé | Duas linhas centralizadas, número da página à direita |

Logos em `godoy-prime-analytics-eb978de2`, pasta `src/assets/`, embutidos em base64.
⚠️ `~/Downloads/brand-assets/` é do **Prime Circle**, marca diferente. Não usar.

**Gerar o PDF:**
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-sandbox --virtual-time-budget=15000 --no-pdf-header-footer \
  --print-to-pdf="Estudo-de-Mercado-<imovel>.pdf" "file://<caminho>/<arquivo>.html"
```

---

## PARTE 5 · Confidencialidade

Quando houver documento que o cliente não sabe que temos, tipicamente a certidão do RGI:

1. **Listar tudo que só aquela fonte fornece**: preço de aquisição, proprietário, ônus, habite-se,
   número da unidade, fração ideal, cadeia dominial, inscrição municipal.
2. **Conferir item a item com `grep` no documento final.** De lista, não de memória.
3. **Produzir dois arquivos:** o estudo do cliente e uma **nota interna** com a inteligência, o
   ponto de equilíbrio do proprietário e a estratégia de conversa.
4. Na nota interna, marcar explicitamente **o que não pode partir de você** na reunião.

---

## PARTE 6 · Auditoria antes de entregar

Obrigatória. Entregar a **lista de achados**, nunca um "está pronto".

- [ ] **Procedência.** Cada afirmação classificada em: documento oficial, informado pelo cliente,
      dado público apurado, inferência minha. **Nada da quarta categoria entra sem rótulo de estimativa.**
- [ ] **Vazamento antecipado.** Varrer cada valor da escala de preço e confirmar que só aparece a
      partir da seção prevista.
- [ ] **Referências cruzadas.** Conferir cada "página anterior", "Seção XX" e "acima" contra a
      paginação real. Quebram sempre que uma seção é dividida.
- [ ] **Coerência entre seções.** Buscar afirmações contraditórias, principalmente entre a descrição
      do imóvel e os fatores de desvalorização.
- [ ] **Aritmética.** Recalcular percentuais, líquidos e projeções por m².
- [ ] **Transbordo.** Renderizar o PDF e olhar página a página. Conteúdo passando por baixo do rodapé
      é o defeito mais comum.
- [ ] **Origem dos arquivos de marca.** Confirmar que o logo é da Godoy Prime Realty.

---

## PARTE 7 · Caso de referência

**Av. Lúcio Costa 3.606, 2º andar, Condomínio Beton, Barra da Tijuca.** Estudo de 11/08/2026,
aprovado em 12/08. Arquivos nesta pasta:

- `MODELO-estudo-de-mercado.html` — o documento aprovado, base para os próximos
- `Estudo-de-Mercado-Lucio-Costa-3606.pdf` — saída final, 12 páginas
- `NOTA-INTERNA-lucio-costa-3606.md` — o par confidencial

Números do caso, úteis como calibração: valor provável R$ 3.550.000, teto R$ 4.000.000,
fechamento recomendado R$ 3.650.000, 1.631 transações de ITBI em seis anos, 18,75% do condomínio
simultaneamente à venda.
