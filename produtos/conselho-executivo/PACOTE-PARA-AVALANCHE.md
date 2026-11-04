# Conselho Executivo: pacote para aprovação da Avalanche

Revendedor: Prime Circle (SONIA)
Data: 03/11/2026
Tipo: adicional pago no Starter e no Elite (R$ 1.997 por ano) e incluído no Magnata, sem cobrança à parte

Situação: aguardando aprovação. A proposta completa foi para a Avalanche em 04/11/2026, como documento: "Conselho Executivo SONIA: proposta para aprovação da Avalanche" (https://claude.ai/artifact/XrPZCnGeSH3QXBu8CBcBZC), com `conselho-executivo-arquivos.zip` (pastas `agentes/` e `skills/`). O documento tem 8 pontos para validar: os 6 daqui e mais dois (chamada entre agentes e rotinas).

## O que está sendo submetido

Quatro agentes adicionais e seis skills.

| Arquivo | Tipo | Usado por |
|---|---|---|
| `agentes/otavio-operacoes.md` | agente | Sônia chama na reunião do Conselho |
| `agentes/livia-marketing-vendas.md` | agente | idem |
| `agentes/fernando-financas.md` | agente | idem |
| `agentes/nina-tecnologia.md` | agente | idem |
| `skills/conselho-executivo/` | skill | Sônia: convoca, sintetiza, pede aprovação, escreve a diretriz |
| `skills/dossie-da-empresa/` | skill | Sônia: onboarding do Conselho |
| `skills/plano-de-90-dias/` | skill | Otávio |
| `skills/vender-para-a-carteira/` | skill | Lívia |
| `skills/raio-x-do-caixa/` | skill | Fernando |
| `skills/checkup-de-sistemas-e-dados/` | skill | Nina |

Os arquivos de agente seguem o formato de subagente com cabeçalho `name`, `description`, `tools` e `model`. As skills seguem o formato `SKILL.md`. Se o painel usa outro formato, adaptamos.

## Como funciona

1. O dono pede uma decisão à Sônia.
2. A Sônia lê o dossiê da empresa e chama só os conselheiros que o tema exige.
3. Cada conselheiro devolve um parecer escrito. Nenhum fala direto com o dono.
4. A Sônia junta os pareceres, mostra divergências e pede a aprovação do dono.
5. Com a aprovação, a Sônia escreve a diretriz e distribui as ações para os agentes ativos do cliente.

## Ferramentas e dados

- Os conselheiros só leem e escrevem arquivos na base de conhecimento do cliente. Lívia e Nina também pesquisam na internet para comparar concorrentes e ferramentas.
- Nenhum conselheiro executa comando, envia mensagem a terceiros ou movimenta dinheiro.
- Arquivos criados: `dossie-da-empresa.md` e a pasta `diretrizes/`, na base de conhecimento do próprio cliente.
- O dossiê não guarda senha, token, dado bancário completo, lista nominal de clientes nem dado sensível. As skills orientam o agente a não registrar isso.
- O modelo de IA é o do plano do cliente (`model: inherit`).

## Limites escritos nos agentes

- Imposto, folha, contrato de trabalho e regime tributário vão ao contador.
- Contrato, política de privacidade e incidente de segurança vão ao advogado.
- Nenhuma recomendação de investimento financeiro.
- Nenhuma garantia de faturamento ou venda.
- Nenhuma ação sem aprovação do dono.
- Nenhum número sem fonte ou premissa escrita.

## Origem do conteúdo

Texto escrito do zero pela Prime Circle para o dono de pequena e média empresa brasileira. Não reaproveita trechos de pacotes de agentes de terceiros e não usa nome de pessoa real nem marca de terceiro.

## O que precisamos confirmar com vocês

1. Os quatro conselheiros entram além da quantidade de agentes do plano, sem ocupar vaga?
2. Uma skill do adicional pode ser instalada na Sônia do cliente que comprou, como `conselho-executivo` e `dossie-da-empresa`?
3. Qual o caminho da base de conhecimento do cliente para o dossiê e as diretrizes?
4. O adicional ganha link próprio no checkout para o Starter e o Elite?
5. Podemos incluir o adicional no Magnata sem cobrança à parte? Nesse caso, a divisão de 30% fica só sobre o preço do Magnata?
6. Um cliente que já assinou o Starter ou o Elite pode comprar o adicional depois, no meio do ano?
