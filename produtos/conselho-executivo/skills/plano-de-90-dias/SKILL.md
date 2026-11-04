---
name: plano-de-90-dias
description: Skill do Otávio. Mapeia o que o dono faz na semana, decide o que ele para de fazer, delega ou automatiza, e fecha um plano de 90 dias com até três metas e responsáveis. Acionar quando: "eu faço tudo", "quero sair da operação", "quero um plano para o trimestre", "preciso de metas", "não tenho tempo para pensar no negócio".
allowed-tools: Read, Write, Grep, Glob
---

# Skill: Plano de 90 dias

**Quem usa:** o subagente Otávio, chamado pela Sônia numa reunião do Conselho. Se a Sônia chegou a esta skill direto, ela não faz o trabalho sozinha: convoca o Otávio pela skill `conselho-executivo` e passa esta skill no briefing.

Usada pelo Otávio dentro de uma reunião do Conselho. O resultado vira parecer para a Sônia e, com a aprovação do dono, diretriz.

## Etapa 1: a semana real do dono

Peça à Sônia que pergunte ao dono, em linguagem simples:

- "Me conta o que você fez na última semana, dia por dia, do jeito que lembrar."
- "O que foi interrompido? Quem te chamou e para quê?"

Monte uma lista de tarefas com a frequência de cada uma (todo dia, toda semana, de vez em quando). Não precisa de hora exata.

## Etapa 2: separar em quatro grupos

| Grupo | Pergunta | Exemplo |
|---|---|---|
| Só o dono | Se outra pessoa fizer, a empresa perde algo que não volta? | negociar com o maior cliente, decidir preço |
| Delegar | Uma pessoa da equipe faria com um passo a passo? | conferir estoque, responder orçamento padrão |
| Agente ou rotina | É repetitivo, escrito e de baixo risco? | resumo de vendas da semana, lembrete de cobrança |
| Parar | Alguém sentiria falta se parasse? | relatório que ninguém lê |

Regra: o que fala com cliente em nome da empresa, mexe em dinheiro ou envolve contrato não vai para "agente ou rotina" sem uma pessoa revisando.

## Etapa 3: escolher as metas do trimestre

- No máximo três metas. Uma é melhor que três mal acompanhadas.
- Cada meta descreve um resultado observável com data. Exemplo do formato: "todo orçamento respondido no mesmo dia útil até AAAA-MM-DD".
- Pelo menos uma meta tira trabalho do dono.
- Se uma meta envolve gastar dinheiro ou contratar, avise no parecer que o Fernando precisa avaliar.

## Etapa 4: montar o plano

Para cada meta:

1. O passo a passo escrito (quem faz, o quê, quando).
2. O responsável pelo nome.
3. O agente que ajuda, se houver no time (Juliana para processo, Rafael para cronograma, Geane para papéis e vagas).
4. O sinal semanal que mostra se está andando.
5. A data de revisão.

Deixe folga. Se o plano ocupa toda a semana da equipe, corte.

## Etapa 5: a reunião semanal

Proponha uma conversa de poucos minutos, sempre no mesmo dia, com três perguntas: o que andou, o que travou, o que muda na semana que vem. Se o plano do cliente tiver rotina livre, a Sônia pode mandar o resumo da semana antes dessa conversa.

## Entrega

O parecer do Otávio, no formato do arquivo dele, com a lista dos quatro grupos em anexo.

## Limites

- Mudança de função, salário, jornada ou desligamento de funcionário: levar ao contador e ao advogado.
- Não inventar meta numérica. O número vem do dono ou do histórico que ele mostrar.
- Nunca use travessão.

## Exemplo

Veja `exemplo.md` nesta pasta: um caso resolvido do começo ao fim, com a empresa fictícia do `exemplo-dossie.md` da skill `dossie-da-empresa`. Siga o formato e o raciocínio, nunca os números: eles são inventados.
