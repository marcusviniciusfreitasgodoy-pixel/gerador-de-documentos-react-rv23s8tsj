# C-Level Squad como produto opcional da SONIA: o que pode ser vendido e o que melhorar

Análise de 03/11/2026 dos 6 arquivos em `Google Drive / 04 · IA & Projetos / IA & Agentes / c-level-squad/`
(o `c-level-squad.zip` tem exatamente os mesmos 6 arquivos, byte a byte).

## 1. De onde esses arquivos vieram

Os 6 agentes **não são originais**. São idênticos, byte a byte, aos do pacote público **Xquads**, publicado no
GitHub em `ohmyjahh/xquads-squads` (criado em 07/03/2026, 283 estrelas, instalável com um comando) e copiado em
pelo menos 10 outros repositórios públicos.

| O que foi conferido | O que diz |
|---|---|
| `c-level-squad/squad.yaml` do pacote | `author: "Synkra AIOS"`, `license: MIT` |
| README do pacote | "Xquads by Synkra · MIT" |
| Arquivo LICENSE no pacote | **Não existe.** O MIT só é declarado no README e no `squad.yaml` |
| Repositório oficial de squads da Synkra (`SynkraAI/aiox-squads`) | **Não traz o C-Level Squad** e também não tem LICENSE |
| Núcleo da Synkra (`SynkraAI/aiox-core`) | MIT, com copyright de BMad Code LLC (obra original) e SynkraAI Inc. (derivada). As marcas BMad **não** entram no MIT |

Não confirmei que a Synkra é de fato a autora: quem publica o pacote é uma conta pessoal, e o repositório oficial
da Synkra não tem esse squad. O que está escrito é "by Synkra · MIT".

## 2. Há impedimento para vender?

**Juridicamente, não há impedimento forte, mas há três condições.**

1. **A licença MIT permite vender, modificar e sublicenciar.** A condição é manter o aviso de copyright e o texto
   da licença em todas as cópias ou partes substanciais. Se você vender os arquivos como estão, o aviso tem de ir
   junto, e ele mostra a origem.
2. **Nomes de terceiros.** O Vision Chief cita um `hormozi-squad` e "Hormozi frameworks". Alex Hormozi é uma pessoa
   real e a marca é da empresa dele. Usar nome de pessoa em propaganda comercial sem autorização é vedado (Código
   Civil, art. 18). Tem de sair. Também não use "BMAD", "AIOS", "AIOX", "Synkra" nem "Xquads" na venda.
3. **A plataforma é da Avalanche.** ~~Antes de vender um opcional "na plataforma", é preciso saber se o revendedor
   pode subir agentes próprios.~~ **Resolvido em 03/11/2026** (ver a seção 5).

As citações de método (Technology Radar da ThoughtWorks, quadrante de dívida técnica de Martin Fowler, TOGAF, ITIL,
OKR) e os exemplos de marca (Google, P&G, Marriott) são uso didático com atribuição. Ideias e métodos não têm
proteção de direito autoral (Lei 9.610/98, art. 8º, I). Pode manter, desde que o produto não diga que é "TOGAF" ou
"ITIL" certificado, porque essas são marcas registradas.

## 3. O problema real é comercial

O mesmo squad está de graça no GitHub e se instala com uma linha. Um cliente que pesquise o nome "Vision Chief" ou
"CMO Architect", ou que leia uma frase do texto, acha a origem. É o mesmo risco já anotado para os currículos dos
agentes da SONIA: frases idênticas levam o comprador à oferta de origem.

Por isso a recomendação é **não vender esses arquivos**. Vender um conselho executivo **reescrito por você**, com
nomes próprios, em português, para o dono de pequena e média empresa brasileira, usando os de hoje só como
referência de estrutura. Feito assim, o produto passa a ser seu e a questão da licença deixa de existir na prática.

A versão que já roda na VPS (`/opt/AGENTE/boardroom`, junho de 2026) já é um passo nessa direção: está em português,
lê o contexto real da empresa e entrega uma diretriz escrita. Ela é o ponto de partida certo, não o zip.

## 4. O que melhorar nos agentes

**a) Público errado.** Os seis foram escritos para startup americana com investidor. Os termos de captação,
conselho, investidor, SOC2, HIPAA e M&A aparecem 31 vezes só no Vision Chief. O dono de empresa brasileira com 5 a
50 pessoas precisa de outra pauta: caixa e capital de giro, margem e preço, sócio e sucessão, contratar o primeiro
gerente, tirar o dono da operação, vender mais para quem já comprou.

**b) Em inglês.** O cliente da SONIA fala português. Tradução sozinha não basta: os exemplos têm de ser de padaria,
clínica, imobiliária, escritório.

**c) Números sem fonte apresentados como regra.** Exemplos: "ADRs reduzem em 80% as conversas sobre por que fizemos
isso", "manutenção custa 2 a 3 vezes o desenvolvimento", "70% core, 20% adjacente, 10% transformacional", "decida com
70% da informação". São 16 ocorrências. O agente repete isso para o cliente como fato. Ou sai, ou vira "regra
prática, sem estudo por trás".

**d) Erros de LGPD no CIO.** Ele lista "registro na ANPD" como obrigação, e isso não existe. Diz que o encarregado é
obrigatório, mas o agente de pequeno porte é dispensado de indicar um (Resolução CD/ANPD nº 2/2022), desde que mantenha
um canal de contato. Falta o prazo de comunicação de incidente, que é de 3 dias úteis (Resolução CD/ANPD nº 15/2024).
O CAIO cita o artigo 22 do GDPR, e o equivalente brasileiro é o artigo 20 da LGPD (revisão de decisão automatizada).

**e) Referências quebradas.** O Vision Chief manda para `advisory-board` e `hormozi-squad`, que o cliente não terá.
Os comandos (`*vision`, `*fundraise`, `*okr` e outros) são só nomes: as tarefas e os fluxos que os executam ficaram no
pacote original (pastas `tasks`, `workflows`, `checklists`) e não vieram no zip.

**f) Pergunta tudo de novo a cada conversa.** Cada agente abre pedindo tamanho, faturamento e dor. O certo é um
dossiê da empresa preenchido uma vez no onboarding e lido por todos, como o `CONTEXTO-EMPRESA.md` da VPS.

**g) Sem entrega padronizada.** Eles prometem "levar a decisões", mas não há formato de saída. A diretriz da VPS
(objetivo, diagnóstico, decisões, ações com responsável e prazo, métrica) resolve e é o que o cliente leva embora.

**h) Sem ligação com quem executa.** Na SONIA o valor está em o conselho mandar trabalho para os agentes que o cliente
já tem: COO para a Juliana, CMO para o Jonathan e o Davi, CTO e CIO para o Paulo, Vision Chief para a Sônia. Os
arquivos de hoje só se conhecem entre si.

**i) Sem limites de responsabilidade.** Nenhum deles diz quando parar e chamar contador, advogado ou especialista em
segurança. Para um produto pago, isso tem de estar escrito, no mesmo tom do aviso do rodapé da página.

**j) O CIO e o CAIO têm pouco uso no começo.** Para o dono de pequena empresa, segurança, sistemas e IA cabem num só
conselheiro de tecnologia. Cinco conselheiros mais o coordenador pode virar quatro, mais fácil de explicar e de vender.

## 5. O que a Avalanche respondeu (03/11/2026, pelo dono)

- O revendedor pode vender agentes adicionais com as respectivas skills.
- Cada adicional é submetido à aprovação da Avalanche antes de ir para venda.
- A Avalanche recebe 30% do valor de qualquer venda.
- O cliente pode trocar os agentes do plano, mas mantém a quantidade de agentes e de rotinas do plano.

Ficaram abertas quatro perguntas de detalhe, listadas no fim de `produtos/conselho-executivo/PACOTE-PARA-AVALANCHE.md`.

## 5.1 Decisão

O dono aprovou a recomendação: não vender o squad e reescrever. O produto novo é o **Conselho Executivo SONIA**,
em `produtos/conselho-executivo/` (quatro conselheiros, dez skills desde 04/11/2026, ficha de venda e pacote para aprovação).
Uma conferência automática não encontrou nenhuma sequência de seis palavras em comum com os arquivos antigos,
nem com a versão em inglês nem com a versão em português da VPS.

## 6. Fontes conferidas

- Pacote Xquads: https://github.com/ohmyjahh/xquads-squads (arquivos `c-level-squad/agents/*.md`, `squad.yaml`, `README.md`)
- Squads oficiais da Synkra: https://github.com/SynkraAI/aiox-squads
- Licença do núcleo da Synkra: https://github.com/SynkraAI/aiox-core/blob/main/LICENSE
