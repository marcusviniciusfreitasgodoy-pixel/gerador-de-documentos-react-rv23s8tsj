# Vídeo da proposta: roteiro e script para o HeyGen

Versão em vídeo do doc "Conselho Executivo SONIA: proposta para aprovação da Avalanche". Escrito em 04/11/2026.

- **Para quem:** o time da Avalanche, que vai analisar e autorizar o adicional.
- **Duração:** cerca de 3 minutos e 40 segundos, em 11 cenas. Os tempos de cada cena são estimativa, a cerca de 160 palavras por minuto; o HeyGen dá o tempo exato depois de gerar as falas.
- **Formato:** horizontal, 1920 x 1080, para assistir no computador ou numa reunião.
- **A ideia:** em vez de explicar o produto em tópicos, o vídeo mostra uma reunião do Conselho acontecendo, com a confeitaria fictícia dos exemplos das skills. Os números de negócio só aparecem depois que a Avalanche já viu o Conselho funcionando.

## Elenco

| Personagem | Como fazer no HeyGen | Voz |
|---|---|---|
| Sônia, a narradora | Photo Avatar a partir de `landing-sonia/assets/agentes/avatar-sonia.webp` | feminina, calma e segura |
| Otávio, operações e equipe | Photo Avatar de `otavio-operacoes.webp` | masculina, madura e prática |
| Lívia, marketing e vendas | Photo Avatar de `livia-marketing-vendas.webp` | feminina, enérgica |
| Fernando, finanças | Photo Avatar de `fernando-financas.webp` | masculina, pausada e precisa |
| Nina, tecnologia, dados e IA | Photo Avatar de `nina-tecnologia.webp` | feminina, jovem e direta |
| Carla, dona da confeitaria | sem avatar: aparece como mensagens de WhatsApp na tela | sem voz |

Os retratos estão em `landing-sonia/assets/agentes/`. Os quatro conselheiros têm 480 x 480 pixels e a Sônia 640 x 640, pouco para um avatar em tela cheia. Antes de criar os avatares, gere versões de pelo menos 1024 x 1024 pelo mesmo caminho dos retratos originais, o Gemini na VPS, para os rostos continuarem iguais aos da landing.

Use uma voz diferente para cada personagem, todas em português do Brasil. Se preferir as vozes do ElevenLabs, o HeyGen permite conectá-las.

## Visual

- **Fundo:** o escuro da seção do Conselho na landing (#0E0E0E), com o dourado da marca (#C8A24A) nos destaques e nos números.
- **Letras:** as mesmas da landing.
- **Reunião:** os quatro conselheiros em quadros lado a lado, como numa chamada de vídeo. Quem fala acende em dourado, e os outros ficam um pouco apagados.
- **Mensagens da Carla:** balões de WhatsApp entrando de baixo para cima, com o som de notificação.
- **Diretriz:** um cartão de documento que muda de selo: PENDENTE, EM EXECUÇÃO, REVISÃO.
- **Movimento:** cortes secos entre as falas e um zoom leve nos números. Nada de transição giratória.

## Roteiro e script

Na coluna "Fala", os números estão escritos por extenso, do jeito que a voz deve ler. Cole a fala no HeyGen exatamente como está. Nos textos de tela, use algarismos.

### Cena 1. A decisão de sexta à noite (0:00 a 0:14)
- **Quem aparece:** Sônia, em plano médio.
- **Na tela:** três cartões entram um a um ao lado dela: "Contrato mais um?", "Dou desconto?", "Assino 36 meses?".
- **Fala:**

```
Toda semana, o dono de uma empresa pequena toma sozinho uma decisão que pesa o ano inteiro. Contratar alguém. Dar desconto. Assinar um contrato longo. Quase sempre à noite, com a planilha aberta.
```

### Cena 2. O que falta hoje (0:14 a 0:34)
- **Quem aparece:** Sônia, com o time de agentes da landing em miniatura ao fundo.
- **Na tela:** a seta "pedido do dono → time entrega" e, embaixo, um "resultado?" piscando.
- **Fala:**

```
A SONIA já tem um time que executa. O dono pede, eu distribuo, e os especialistas entregam. O problema é quando o pedido está errado. Ele pede mais posts quando o que trava a venda é o preço. O time faz com capricho, e o resultado não vem.
```

### Cena 3. O Conselho (0:34 a 0:56)
- **Quem aparece:** Sônia. No fim da fala, os quatro quadros dos conselheiros acendem atrás dela.
- **Na tela:** título "Conselho Executivo SONIA" e, embaixo, "pensar antes de mandar fazer".
- **Fala:**

```
Por isso criamos o Conselho Executivo. Os agentes da plataforma até conseguem, cada um na sua área, fazer parte desse trabalho. Só que o cliente não enxerga isso. O Conselho dá forma a essa capacidade: quatro conselheiros com nome, uma reunião que junta os quatro olhares e uma decisão escrita que o time executa.
```

### Cena 4. Os quatro (0:56 a 1:28)
- **Quem aparece:** cada conselheiro em tela cheia, cerca de 7 segundos cada.
- **Na tela:** nome e área no rodapé; na hora da fala, um ícone da área (prancheta, megafone, gráfico, cadeado).
- **Falas, uma por avatar:**

Otávio:
```
Sou o Otávio, de operações e equipe. Meu trabalho é tirar o dono da operação sem a empresa desandar.
```
Lívia:
```
Sou a Lívia, de marketing e vendas. Eu descubro para quem vender e como vender de novo para quem já comprou.
```
Fernando:
```
Sou o Fernando, de finanças. Antes do sim, eu mostro a semana em que o caixa aperta.
```
Nina:
```
Sou a Nina, de tecnologia, dados e inteligência artificial. Eu cuido dos sistemas, da segurança e da LGPD.
```

### Cena 5. Chega um pedido (1:28 a 1:43)
- **Quem aparece:** tela de celular com a conversa da Carla. A Sônia aparece pequena, num círculo no canto.
- **Na tela:** selo "empresa fictícia, para exemplo". Balão da Carla: "Me ofereceram um quiosque no shopping. Contrato de 36 meses. Eu abro?"
- **Fala (Sônia):**

```
Veja como funciona, com uma confeitaria de exemplo. A Carla quer abrir um quiosque no shopping, com contrato de trinta e seis meses. Isso é decisão pesada, difícil de desfazer. Então eu chamo os quatro.
```

### Cena 6. A reunião (1:43 a 2:18)
- **Quem aparece:** os quatro quadros lado a lado. Acende quem fala.
- **Na tela:** cada número aparece em dourado na hora em que é falado: "R$ 36.800 por mês", "bolo de festa", "nenhuma tarde livre".
- **Falas:**

Fernando:
```
O quiosque precisa vender trinta e seis mil e oitocentos reais por mês só para se pagar. E hoje a confeitaria já fecha o mês no vermelho.
```
Lívia:
```
No shopping, o que vende é doce de impulso. O forte da casa é bolo de festa por encomenda.
```
Otávio:
```
E a Carla ainda não consegue tirar uma tarde de folga. Com dois pontos, quem segura a produção?
```
Nina:
```
Se abrir, o quiosque precisa de caixa e estoque ligados aos da loja desde o primeiro dia.
```

### Cena 7. O pré-mortem (2:18 a 2:36)
- **Quem aparece:** Sônia, com os quatro quadros menores atrás.
- **Na tela:** um calendário avança seis meses. Aparece "deu errado. Por quê?" e depois o sinal em destaque: "atraso de entrega na loja".
- **Fala:**

```
Antes de recomendar, a gente imagina que já se passaram seis meses e deu errado. O motivo mais provável? A Carla dividida entre dois pontos, e a encomenda de festa perdendo qualidade. O sinal que avisa cedo é atraso de entrega na loja.
```

### Cena 8. A recomendação e o sim da dona (2:36 a 2:53)
- **Quem aparece:** de novo a tela de celular.
- **Na tela:** mensagem da Sônia com "Recomendação: ainda não. Primeiro, um estande de fim de semana." Embaixo, o botão "Aprova assim?", que a Carla toca. Em seguida, o cartão da diretriz entra com o selo PENDENTE e troca para EM EXECUÇÃO.
- **Fala (Sônia):**

```
A recomendação é ainda não. Primeiro, um teste num estande de fim de semana, sem contrato longo. A decisão é sempre da dona. Ela aprova, eu escrevo a diretriz e o time começa. Na data marcada, eu volto e mostro se funcionou.
```

### Cena 9. Onde o Conselho para (2:53 a 3:06)
- **Quem aparece:** Sônia.
- **Na tela:** três linhas com ícones: "Imposto → contador", "Contrato → advogado", "Investimento → profissional habilitado".
- **Fala:**

```
O Conselho também sabe onde parar. Imposto vai para o contador. Contrato, para o advogado. Investimento, para um profissional habilitado. E nada sai sem a aprovação do dono.
```

### Cena 10. Testado e com conta fechada (3:06 a 3:28)
- **Quem aparece:** Sônia de um lado, a tabela do outro.
- **Na tela:**
  - primeiro, "12 casos de teste · 12 aprovados · depois de 3 rodadas de correção";
  - depois, a tabela: Starter e Elite com "+ R$ 1.997 por ano", Magnata com "incluído" e "30% de cada venda para a Avalanche".
- **Fala:**

```
Antes de chegar até vocês, rodamos doze casos de teste num ambiente próprio. Os doze passaram, depois de três rodadas de correção. No Starter e no Elite, o Conselho é um adicional de mil novecentos e noventa e sete reais por ano. No Magnata, vem incluído. E a Avalanche recebe trinta por cento de cada venda.
```

### Cena 11. O pedido (3:28 a 3:43)
- **Quem aparece:** Sônia, com os quatro conselheiros acesos atrás.
- **Na tela:** "Conselho Executivo SONIA · proposta para aprovação" e, embaixo, "4 conselheiros · 10 skills · 8 pontos para validar".
- **Fala:**

```
Os arquivos dos quatro conselheiros e das dez skills vão junto com a proposta. Precisamos da análise de vocês e da resposta a oito pontos. Com isso, o Conselho entra para a venda.
```

## Antes de gerar

1. **Créditos.** Na última checagem, em 26/08/2026, a conta HeyGen estava no plano gratuito, sem créditos. Avatar a partir de foto usa a faixa mais cara: cerca de 20 créditos por minuto, então este vídeo deve pedir de 70 a 80 créditos. Confira o saldo antes.
2. **Imagens.** Gere os retratos em resolução maior, como explicado em "Elenco".
3. **Pronúncia.** Ouça a prévia de cada fala. Atenção a "LGPD", "SONIA" e "Avalanche". Se a voz ler errado, escreva do jeito que se fala, por exemplo "éle gê pê dê".
4. **Legendas.** Ligue as legendas automáticas e confira os números escritos nelas.
5. **Prévia.** Revise o vídeo inteiro antes de mandar. A cena 10 cita os testes, e o texto tem de continuar dizendo "num ambiente próprio": o teste no painel da Avalanche ainda não foi feito.

## Versão curta para clientes

Para vender o Conselho na landing ou no Instagram, as cenas 4 a 9 formam um vídeo de pouco mais de 2 minutos, sem a parte da Avalanche. Para isso, troque a última fala da cena 9 por um convite:

```
Quer ver o Conselho trabalhando na sua empresa? Fale com a gente.
```

Para Reels e Stories, refaça o enquadramento em 1080 x 1920 e coloque um conselheiro por vez na tela, sem os quadros lado a lado.
