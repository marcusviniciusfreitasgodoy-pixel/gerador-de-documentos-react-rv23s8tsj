---
name: vender-para-a-carteira
description: Skill da Lívia. Monta um plano para vender de novo a quem já comprou: separa a carteira em grupos, define a oferta e a mensagem de cada grupo, escolhe o canal e diz como medir. Acionar quando: "os clientes compram uma vez e somem", "quero vender mais sem gastar com anúncio", "tenho uma lista de clientes parada", "quero reativar clientes antigos", "como peço indicação?".
allowed-tools: Read, Write, Grep, Glob
---

# Skill: Vender para a carteira

**Quem usa:** o subagente Lívia, chamado pela Sônia numa reunião do Conselho. Se a Sônia chegou a esta skill direto, ela não faz o trabalho sozinha: convoca o Lívia pela skill `conselho-executivo` e passa esta skill no briefing.

Usada pela Lívia dentro de uma reunião do Conselho.

## Etapa 1: entender a carteira sem expor ninguém

Peça à Sônia que levante com o dono, ou com a Amanda se houver CRM organizado:

- Quantos clientes compraram no último ano, aproximadamente.
- Quantos compraram mais de uma vez.
- Há quanto tempo os outros não compram.
- O que cada grupo costuma comprar.

Trabalhe com contagens e grupos. Não copie nome, telefone ou e-mail de cliente para o parecer nem para a diretriz.

## Etapa 2: separar em grupos

| Grupo | Quem é | O que costuma funcionar |
|---|---|---|
| Fiéis | compram com frequência | atenção, novidade antes dos outros, pedido de indicação |
| Ocasionais | compraram mais de uma vez, com intervalo longo | lembrete no momento certo, oferta ligada ao que já compraram |
| Uma vez só | compraram e não voltaram | perguntar o que faltou, oferta simples de retorno |
| Parados | não compram há muito tempo | mensagem curta e honesta, sem insistir |

O que é "frequência" e "muito tempo" depende do ramo. Uma padaria e uma clínica de estética têm ciclos diferentes. Defina com o dono.

## Etapa 3: oferta e mensagem

Para cada grupo que valer a pena:

- Uma oferta que a operação consegue cumprir sem atropelo.
- Uma mensagem curta, no tom do dono, que diz por que a empresa está falando agora.
- Se houver desconto, o Fernando confere se a margem aguenta.

Nada de urgência falsa ("só hoje" quando não é), depoimento inventado ou promessa de resultado.

## Etapa 4: canal e permissão

- Use o canal em que o cliente já fala com a empresa.
- Fale só com quem forneceu o contato para a empresa e pode receber esse tipo de mensagem. Quem pediu para não receber fica fora.
- Envio em grande quantidade pelo WhatsApp tem risco de bloqueio do número, principalmente em conexão não oficial. Prefira lotes pequenos e conversa de verdade. Se o plano envolver muita gente, a Nina avalia.

## Etapa 5: quem executa

Confira quais agentes o cliente tem: Amanda organiza os grupos no CRM, Jonathan escreve as mensagens, o Clone do dono e o squad do Davi conduzem as respostas. Sem esses agentes, o dono ou alguém da equipe manda, com as mensagens prontas.

## Etapa 6: como medir

- Quantas mensagens foram enviadas por grupo.
- Quantas pessoas responderam.
- Quantas compraram, e quanto.

Uma planilha simples basta. Defina a data para olhar o resultado.

## Entrega

O parecer da Lívia, no formato do arquivo dela, com os grupos, as ofertas e os modelos de mensagem em anexo.

## Limites

- Não usar lista comprada nem contato de quem não é cliente.
- Não inventar taxa de resposta ou de conversão. O resultado é medido depois.
- Nunca use travessão.

## Exemplo

Veja `exemplo.md` nesta pasta: um caso resolvido do começo ao fim, com a empresa fictícia do `exemplo-dossie.md` da skill `dossie-da-empresa`. Siga o formato e o raciocínio, nunca os números: eles são inventados.
