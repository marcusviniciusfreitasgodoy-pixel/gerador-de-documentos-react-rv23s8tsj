# Conselho Executivo SONIA

Produto adicional da SONIA: quatro conselheiros que ajudam o dono a decidir, e seis skills que fazem o Conselho funcionar dentro do time do cliente. Criado em 03/11/2026 para substituir o C-Level Squad, que não pode ser vendido como estava (ver `pendencias/ANALISE-C-LEVEL-SQUAD.md`).

## O que a Avalanche confirmou (03/11/2026, pelo dono)

- O revendedor pode vender agentes adicionais com as respectivas skills.
- Cada adicional é submetido à aprovação da Avalanche antes de ir para venda.
- A Avalanche recebe 30% do valor de qualquer venda.
- O cliente pode trocar os agentes do plano, mas mantém a quantidade de agentes e de rotinas do plano.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `agentes/` | os quatro conselheiros, no formato de subagente |
| `skills/conselho-executivo/` | a Sônia reúne o Conselho, junta os pareceres e escreve a diretriz |
| `skills/dossie-da-empresa/` | a Sônia registra o essencial do negócio no onboarding |
| `skills/plano-de-90-dias/` | skill do Otávio |
| `skills/vender-para-a-carteira/` | skill da Lívia |
| `skills/raio-x-do-caixa/` | skill do Fernando |
| `skills/checkup-de-sistemas-e-dados/` | skill da Nina |
| `FICHA-DE-VENDA.md` | o que é, para quem, limites, preço sugerido, argumentos e objeções |
| `PACOTE-PARA-AVALANCHE.md` | o texto para mandar junto com os arquivos na submissão |
| `curriculos.json` | os quatro currículos no formato da seção "Time" do `conteudo.json`, com `visivel: false` |

## O que mudou em relação ao C-Level Squad

- **Tudo escrito do zero**, em português, para o dono de pequena e média empresa. Os arquivos antigos serviram só para listar o que corrigir.
- **Seis conselheiros viraram quatro.** CTO, CIO e CAIO viraram a Nina. O Vision Chief deixou de existir como agente: na SONIA quem fala com o dono é a Sônia, então ela coordena o Conselho pela skill `conselho-executivo`.
- **Entrou finanças.** O pacote antigo não tinha. Para o dono de empresa pequena, caixa e margem são o assunto mais urgente.
- **Dossiê da empresa** preenchido uma vez, lido por todos.
- **Saída padrão:** parecer de cada conselheiro e diretriz aprovada pelo dono.
- **Ligação com quem executa:** cada conselheiro sabe quais agentes da SONIA fazem o quê e confere quais estão ativos no cliente.
- **Limites escritos:** contador, advogado, nada de investimento, nada de garantia, nada sem aprovação.
- **Sem números sem fonte.** As regras de LGPD citam a norma.
- **Sem nome de pessoa real nem marca de terceiro.**

## Escolhas que você pode mudar

- **Nomes:** Otávio, Lívia, Fernando e Nina não colidem com nenhum dos 21 agentes da SONIA. Trocar é só editar os arquivos e o `curriculos.json`.
- **Preço:** a ficha recomenda R$ 1.997 por ano. A decisão é sua.
- **`model: inherit`:** o conselheiro usa a IA do plano do cliente. Se a plataforma pedir um modelo fixo, ajuste.

## Próximos passos

1. Ler a ficha e decidir preço e nomes.
2. Testar na sua própria empresa: dossiê, uma reunião do Conselho, uma diretriz.
3. Gerar os quatro avatares no Google AI Studio, no estilo dos agentes atuais.
4. Submeter à Avalanche com o `PACOTE-PARA-AVALANCHE.md`.
5. Depois da aprovação: checkout, seção na landing a partir do `curriculos.json`, pergunta no FAQ.
