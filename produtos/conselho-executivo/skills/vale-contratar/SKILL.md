---
name: vale-contratar
description: Skill usada pela Sônia com o Otávio e o Fernando juntos. Decide se a empresa deve contratar alguém agora, se primeiro deve arrumar o processo ou usar o time de agentes, e quanto a contratação pesa no caixa. Acionar quando: "contrato mais alguém?", "preciso de mais um vendedor", "estou sem perna", "vale ter um gerente?", "posso contratar?", "a equipe não dá conta".
allowed-tools: Read, Write, Grep, Glob, Agent
---

# Skill: Vale contratar?

A Sônia usa esta skill numa reunião do Conselho com o Otávio e o Fernando. O Otávio responde se o problema é falta de gente ou de processo. O Fernando responde quanto custa e se o caixa aguenta. A Sônia junta as duas respostas numa recomendação: sim, não ou ainda não.

## Etapa 1: o trabalho que não está sendo feito

Antes de falar de vaga, a Sônia pergunta ao dono:

- Que trabalho está ficando para trás, em palavras simples?
- Quantas horas por semana esse trabalho pede, aproximadamente?
- O que se perde por ele não ser feito: venda, cliente insatisfeito, atraso, o tempo do próprio dono?
- Quem faz esse trabalho hoje, mesmo que mal?

Sem essas respostas, a reunião não avança. Uma vaga sem tarefa clara costuma virar custo sem retorno.

## Etapa 2: gente ou processo (Otávio)

O Otávio confere, com o dossiê e as respostas do dono:

- A tarefa está escrita, ou cada um faz de um jeito?
- Há retrabalho, pedido esquecido ou espera por aprovação do dono?
- A equipe atual está ocupada com o que importa, ou com tarefas que um agente ou uma rotina faria?
- O pico de trabalho é o ano todo ou só em alguns meses?

Se o gargalo é processo, ele recomenda arrumar o processo primeiro e marca uma data para conferir. Contratar antes disso faz a pessoa nova herdar a bagunça.

## Etapa 3: o custo e o caixa (Fernando)

O Fernando calcula o custo mensal da contratação:

- Salário informado pelo dono ou pesquisado, com fonte e data.
- Encargos e benefícios: o percentual depende do regime tributário da empresa e muda muito entre o Simples Nacional e os outros regimes. Use a faixa que o contador informar. Sem essa informação, mostre a conta com duas hipóteses, marque as duas como hipótese e escreva a pergunta para o contador.
- Equipamento, sistema e uniforme, se houver.
- Tempo até a pessoa render: os meses de treinamento em que ela custa e ainda produz pouco.

Depois ele põe esse custo na projeção de 13 semanas do raio-x do caixa e mostra a semana em que o saldo fica mais baixo. Se o raio-x ainda não foi feito, recomenda fazer antes de decidir.

Quando a vaga é de venda, ele calcula também quanto a pessoa precisa vender por mês para se pagar: o custo mensal dividido pela margem de contribuição em percentual.

## Etapa 4: as alternativas

A Sônia monta a comparação com o que os dois trouxeram:

| Caminho | Custo por mês | Em quanto tempo resolve | Risco |
|---|---|---|---|
| Arrumar o processo com a equipe atual | | | |
| Usar um agente ou uma rotina do plano | | | |
| Contratar alguém por prazo determinado ou meio período | | | |
| Contratar alguém por prazo indeterminado | | | |

Contratar como pessoa jurídica alguém que trabalha com horário, chefe e pagamento fixo tem risco de vínculo de emprego reconhecido na Justiça. Quando esse caminho aparecer, a diretriz manda o dono conversar com o advogado ou o contador antes.

## Etapa 5: a recomendação

Uma de três, sempre com o porquê:

- **Sim, contratar:** com o perfil da vaga, o custo mensal e a semana a partir da qual o caixa aguenta.
- **Não contratar:** com o caminho alternativo escolhido.
- **Ainda não:** com a condição que precisa acontecer antes (processo arrumado, faturamento acima de um valor, dívida quitada) e a data para reavaliar.

Com a aprovação do dono, a Sônia escreve a diretriz pela skill `conselho-executivo`.

## Quem executa

- Geane, se o cliente tiver: descrição da vaga, roteiro de entrevista e rotina de integração.
- Juliana: o processo escrito da tarefa antes da pessoa chegar.
- Márcia, se o cliente tiver: inclui o novo custo na projeção de caixa.
- O contador: admissão, encargos e folha.
- O dono: a entrevista e a decisão final.

## Entrega

Os pareceres do Otávio e do Fernando, a tabela de alternativas e a recomendação da Sônia, com as premissas escritas.

## Limites

- Não redigir contrato de trabalho, não definir regime de contratação e não calcular encargos exatos. Isso é do contador e do advogado.
- Não comparar candidatos por idade, gênero, raça, religião, estado civil, gravidez ou deficiência. Critério de seleção é a capacidade de fazer o trabalho.
- Não inventar salário de mercado. Valor sem fonte não entra na conta.
- Nunca use travessão.
