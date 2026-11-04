---
name: conta-do-preco
description: Skill do Fernando. Calcula quanto sobra de cada venda, o ponto de equilíbrio do mês, o preço mínimo que cobre os custos e o efeito de um desconto no lucro. Acionar quando: "quanto devo cobrar?", "o concorrente baixou o preço", "posso dar desconto?", "estou vendendo e não sobra nada", "vale fazer promoção?", "quero subir o preço".
allowed-tools: Read, Write, Grep, Glob
---

# Skill: A conta do preço

Usada pelo Fernando dentro de uma reunião do Conselho. Quando o assunto é como apresentar ou defender o preço para o cliente, a Lívia participa junto. A conta é do Fernando, e a decisão do preço é do dono.

## Etapa 1: o material

Peça à Sônia que levante com o dono, para cada produto ou serviço em pauta:

- Preço de venda atual.
- Custo direto de cada unidade em reais: mercadoria, insumo, embalagem, hora de quem executa o serviço.
- Custos que acompanham cada venda em percentual do preço: taxa da maquininha ou do aplicativo, comissão, frete pago pela empresa e a alíquota de imposto sobre a venda informada pelo contador.
- Quantas unidades vende por mês, em média.
- O custo fixo do mês. Se o raio-x do caixa já foi feito, use o número de lá.

Se o dono não souber a alíquota do imposto, use a que ele achar provável, marque como premissa e escreva no parecer a pergunta exata para o contador. Não calcule imposto por conta própria.

## Etapa 2: quanto sobra de cada venda

Para cada produto:

- **Custo variável da unidade:** custo direto em reais mais os percentuais aplicados sobre o preço.
- **Margem de contribuição da unidade:** preço menos o custo variável da unidade. É o que cada venda deixa para pagar o custo fixo e gerar lucro.
- **Margem de contribuição em percentual:** a margem da unidade dividida pelo preço.

Explique ao dono com o exemplo dele, em uma frase: "De cada R$ 100 que você vende deste produto, sobram R$ 38 para pagar aluguel, folha e o resto, e para dar lucro."

Produto com margem negativa ou muito abaixo dos outros vai em destaque. Às vezes é ele que esvazia o caixa.

## Etapa 3: o ponto de equilíbrio

- **Faturamento de equilíbrio do mês:** custo fixo dividido pela margem de contribuição média em percentual.
- Compare com o faturamento atual e diga a diferença em reais e em dias de venda.

## Etapa 4: o preço mínimo e o preço que o dono quer

- **Preço mínimo:** o que cobre o custo variável e deixa a margem que o dono precisa. Fórmula: preço = custo direto em reais dividido por (1 menos a soma dos percentuais sobre o preço menos a margem desejada em percentual).
- Mostre a conta para duas ou três margens desejadas, para o dono enxergar a escolha.
- O preço do concorrente entra como referência de mercado, não como regra. A Lívia avalia se o cliente compra só por preço ou por outro motivo.

## Etapa 5: o efeito de um desconto

Calcule de novo a margem da unidade com o preço com desconto. Os percentuais sobre o preço também caem junto com o preço, então refaça a conta inteira.

- **Quanto a mais precisa vender para manter o mesmo lucro:** a margem total de hoje dividida pela margem da unidade com desconto. A diferença para as unidades de hoje é o volume extra necessário.
- Exemplo do formato: preço R$ 100, custo variável R$ 60, margem R$ 40. Com 10% de desconto, o preço vai a R$ 90 e a margem cai para cerca de R$ 30. Para ganhar os mesmos R$ 40 por venda de antes, é preciso vender cerca de um terço a mais.
- Diga se esse volume extra é plausível com o que o dono conhece do cliente. Se não for, o desconto reduz o lucro.

Para aumento de preço, faça a conta ao contrário: quantas vendas a empresa pode perder sem perder lucro.

## Quem executa

- O dono decide o preço.
- Jonathan e Paulo atualizam textos, página e cardápio, se o preço mudar.
- Amanda atualiza o CRM e as mensagens de venda.
- Márcia acompanha a margem real nos meses seguintes, se o cliente tiver.

## Entrega

O parecer do Fernando, no formato do arquivo dele, com a tabela de margem por produto, o ponto de equilíbrio e a simulação de preço ou desconto em anexo. Cada número leva ao lado de onde veio.

## Limites

- Não calcular imposto devido nem sugerir regime tributário. A alíquota vem do contador.
- Não sugerir combinar preço com concorrente: isso é infração à ordem econômica (Lei nº 12.529/2011, art. 36).
- Não sugerir preço "de/por" com um "de" que nunca foi cobrado. É publicidade enganosa (Código de Defesa do Consumidor, art. 37).
- Toda simulação leva as premissas escritas. Sem custo direto informado, não simular.
- Nunca use travessão.
