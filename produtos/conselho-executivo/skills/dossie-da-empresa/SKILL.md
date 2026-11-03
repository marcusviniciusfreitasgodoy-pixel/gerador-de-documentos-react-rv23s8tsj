---
name: dossie-da-empresa
description: Monta e mantém o dossiê da empresa do cliente, o arquivo que todos os conselheiros leem antes de opinar. Acionar no onboarding do Conselho Executivo, quando o dono disser "quero atualizar os dados da empresa", "mudou a equipe", "mudei o preço", ou quando a skill conselho-executivo encontrar o dossiê ausente ou desatualizado.
allowed-tools: Read, Write, Grep, Glob
---

# Skill: Dossiê da empresa

O dossiê evita que cada conselheiro pergunte tudo de novo a cada conversa. Ele é preenchido uma vez, numa conversa com o dono, e atualizado quando algo muda.

## Onde fica

`dossie-da-empresa.md` na base de conhecimento do cliente, seguindo o `modelo-dossie.md` desta skill.

## Como conduzir a conversa

- Pergunte em blocos pequenos, um tema por mensagem. Não mande o questionário inteiro de uma vez.
- Aceite resposta aproximada. "Uns 80 mil por mês" serve. Anote como aproximado.
- Se o dono não souber, anote "não sabe" e siga. Isso é informação útil para o Fernando e para o Otávio.
- Se o dono preferir, ele pode mandar áudio. Transcreva e organize.
- Ao final, mostre o dossiê resumido e pergunte se está certo antes de salvar.

## Ordem dos blocos

1. **A empresa:** ramo, cidade, há quanto tempo existe, o que vende, como o cliente compra.
2. **O dono:** o que ele faz no dia a dia, o que gostaria de parar de fazer, o que quer para a empresa no próximo ano.
3. **Clientes:** quem compra, os melhores clientes, de onde vêm, se voltam.
4. **Concorrência:** com quem o cliente compara, por que escolhe esta empresa.
5. **Números:** faturamento mensal aproximado, custos fixos, prazo de recebimento e de pagamento, dívidas, se as contas da empresa e do dono são separadas.
6. **Equipe:** quantas pessoas, funções, quem decide o quê.
7. **Sistemas e dados:** o que usa para vender, agendar, emitir nota, guardar contato de cliente, quem tem acesso.
8. **Time SONIA:** plano contratado e quais agentes estão ativos hoje. Confira no painel ou pergunte ao dono, porque ele pode ter trocado agentes.
9. **Profissionais:** tem contador? tem advogado? como falar com eles?
10. **Dores e prioridades:** os três problemas que mais custam hoje.

## O que não entra no dossiê

- Senha, chave de acesso, token, número de cartão ou dado bancário completo. Se o dono mandar, não registre e oriente a trocar.
- Lista de clientes com nome, telefone ou CPF. O dossiê descreve o tipo de cliente, não as pessoas.
- Dado de saúde, religião, opinião política ou qualquer dado sensível de clientes ou funcionários.
- Salário individual com nome. Use o total da folha ou faixas por função.

## Quando atualizar

- O dono avisou que algo mudou.
- Uma reunião do Conselho dependia de um dado que estava velho.
- A cada três meses, pergunte ao dono se algo mudou nos números, na equipe ou no time de agentes. Use uma rotina da plataforma só se o plano tiver rotina livre.

Registre a data da última atualização no topo do arquivo.

## Regras de escrita

- Português do Brasil. Nunca use travessão.
- Escreva o que o dono disse, sem enfeitar. Onde for estimativa, marque "aproximado".
