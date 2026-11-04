# Análise: carolinamenezes.ia.br x sonia.primecircle.app.br

Feita em 04/11/2026, com as duas páginas abertas no navegador e o HTML da Carolina baixado (130 KB, autocontido). Pedido do Marcus: ver o que a página dela tem de bom que vale trazer para a nossa.

## O que é a página dela

É uma revendedora da mesma plataforma (Avalanche). A agente dela se chama Cora, "Coordenadora Operacional de Raciocínio e Ação", com os mesmos 21 especialistas e os mesmos três planos. Preços dela: Starter R$ 5.000 (5 agentes, 5 rotinas), Elite R$ 9.000 (16 agentes, 20 rotinas), Magnata R$ 15.000 (22 agentes, 50 rotinas). Os nossos: R$ 4.997, R$ 7.997 e R$ 15.997. Ou seja, concorrente direta, vendendo o mesmo produto com outra embalagem.

Tecnicamente: página única feita à mão, GSAP + ScrollTrigger, Bebas Neue + Barlow, 11 seções numeradas, três temas de cor por variáveis CSS, narração em áudio por seção, chat de voz com a Cora (Gemini Live via um worker próprio) e formulário com qualificação.

## O que ela tem e nós não

### 1. "Quem está por trás da Cora" (a seção que o Marcus destacou)

Como é: foto grande da Carolina ocupando a metade esquerda da tela, bio em primeira pessoa (nutricionista, fundou três empresas, MBA em IA), três contadores que sobem quando entram na tela (+20 anos como empresária, +200 empresários treinados, 3 empresas fundadas), cartão do Instagram, e logo abaixo "A Cora em operação": a loja física dela em BH, com foto da fachada, endereço e link do mapa, dizendo que a Cora atende os clientes dela todos os dias. Fecha com formação (Saint Paul, Harvard, Stanford, DeepLearning.AI) e "produtos que criei com o mesmo método".

Por que funciona: a plataforma é a mesma para todos os revendedores. O que o comprador está escolhendo é quem implanta. Ela responde isso com rosto, história e uma prova de que usa o produto no próprio negócio.

A nossa página não tem rosto nenhum. Nenhuma pessoa, nenhuma empresa, nenhuma história. O rodapé tem CNPJ e só.

O que colocar na nossa (tudo verdadeiro, já existe):
- Foto do Marcus e bio curta em primeira pessoa: corretor, dono da Godoy Prime Realty, criador da Prime Circle.
- "A Sônia em operação": a imobiliária como prova. A Sofia roda na operação dele (Telegram, VPS) desde meados de 2026; o Gerador de Documentos está em produção com clientes reais; o Índice da Barra carregou a cidade inteira (330 mil escrituras). São três provas concretas, melhores que "+200 empresários treinados".
- Contadores só com número que se sustenta (anos de mercado imobiliário, documentos gerados, escrituras na base). Sem inventar.
- Cuidado: os contadores dela de "1.240 fatos aprendidos" e "8.730 conversas lembradas" na seção do cérebro são números fixos no HTML (`data-alvo`), não vêm da plataforma. Não copiar esse padrão: o nosso LEIA-ME já proíbe número de plataforma sem autorização da Avalanche.

### 2. Movimento ao rolar

Como é: os títulos entram palavra por palavra e a segunda metade da frase "acende" conforme a rolagem; blocos com a classe `revela` sobem e aparecem; contadores contam até o alvo quando ficam visíveis; faixa deslizante de selos no hero ("24 horas por dia · sem férias · sem atestado · sem turnover"); relógio ao vivo "Agora são 15:02:44"; na seção "Você no comando", um escritório que apaga a luz às 22h e contadores de "conversas atendidas enquanto você dorme"; índice de pontos à direita que marca a seção atual.

A nossa página: zero animação de entrada (nenhum IntersectionObserver no bundle, só 4 keyframes de toast e fade). Tudo aparece de uma vez. Está correta, mas parada.

O que colocar, por ordem de retorno:
- Aparecer ao rolar nos cards (gargalos, time, conselho, planos, FAQ) e nos títulos. É um IntersectionObserver e uma classe CSS: barato.
- Contagem nos números da Economia (R$ 141.034 por mês, R$ 1.692.409 por ano) e no "21" do hero. É o número que mais convence e hoje ele não chama atenção.
- Faixa deslizante com os três selos do hero (já existem no conteudo.json).
- Índice lateral de seções: opcional, só se a página continuar longa.
- Não trazer: relógio ao vivo e simulação da madrugada. Bonito, mas é enfeite e a nossa linha é editorial e sóbria.

Onde mexer: o `index.html` é exportado do Claude Design e regenerado pelo `ferramentas/adaptar-design.py`. Qualquer script novo entra por ali, como as seções do Conselho e dos vídeos entraram, senão se perde na próxima regeneração.

### 3. Mudança de cor

Há duas leituras do que o Marcus viu:
- O botão "Mudar a cor" no topo: três temas (lilás claro, ameixa, noite), trocados por `data-tema` no `<html>` e guardados no `localStorage`. Custa pouco de fazer porque as cores já são variáveis, mas vale pouco: ninguém compra por causa de um seletor de tema. Deixar por último.
- A alternância de fundo por seção: aqui a nossa página já faz melhor que a dela. Nós alternamos preto (#0E0E0E) e marfim (#F5F1E6) a cada seção; a dela é um tom só do começo ao fim. O que falta na nossa é a transição: hoje a troca é um corte seco. Um degradê curto de 80 a 120 px na junção das seções, ou a cor do fundo mudando com a rolagem (o GSAP faz isso bem), dá a sensação de "página que muda de cor" sem trocar a identidade.

### 4. O cérebro ("Memória viva")

Como é: um `<canvas>` com uma esfera 3D de pontos girando (cinco tipos: agente, assunto, fato, conversa, documento) e ligações que acendem em pulsos. Ao lado, três argumentos: nada se perde na troca de pessoa, você vê o que ela sabe, treinou uma vez vale para todos. É desenhado em JavaScript, não é a tela da plataforma.

O Marcus comentou que o mapa de memória existe na plataforma dele. Isso é melhor do que o dela: podemos mostrar a tela real, em print ou em gravação de 10 segundos, com o selo "tela do painel". Prova real vale mais que animação. Se quisermos também a animação, a dela é um bloco de 60 linhas de canvas, fácil de refazer nas nossas cores (Ouro #C8A24A sobre Ink).

Antes de publicar print do painel: confirmar com a Avalanche se pode mostrar a interface. A regra escrita do LEIA-ME fala de números, não de telas, mas é melhor perguntar junto com os 8 pontos que já estão com eles.

Texto para a seção: o argumento "o funcionário vai embora e leva o que sabe; a Sônia fica e aprende" é o mais forte da página dela e nós não usamos. Cabe no "Por onde começar" ou numa seção própria de memória.

### 5. Calculadora interativa ("A conta")

Como é: chips com as funções (atendimento, social media, redator, designer, financeiro, assistente, gestor de tráfego); o visitante liga e desliga e vê o custo CLT do mês, o custo do time de agentes, a economia por ano e "48x mais barato". Mostra também "horas do mês cobertas: pessoas 30%, agentes 100%".

A nossa: tabela estática com 14 funções, fontes citadas e nota honesta. Mais rigorosa, menos envolvente. O melhor dos dois: manter a tabela e as fontes, e colocar em cima dela os chips para o visitante montar a conta da empresa dele. Os dados já estão no conteudo.json (`economia.linhas`).

Não copiar o "48x": a conta dela compara 6 CLT com o Elite mais R$ 500 de ferramentas, sem dizer que o Elite não faz o trabalho das 6 pessoas inteiras. O nosso texto da Economia já evita essa promessa; manter.

### 6. "Você no comando": zonas verde, amarela e vermelha

Três cartões: o que a Cora faz sozinha, o que prepara e espera o OK, o que nunca faz (expor senha, apagar dado, misturar informação entre clientes, inventar preço). É a resposta visual ao medo de "a IA vai fazer besteira em meu nome".

Nós falamos de aprovação no FAQ e no Conselho, mas sem um lugar só para isso. Vale uma seção curta com os três cartões. O conteúdo nós já temos escrito nas skills do Conselho (gatilhos de aprovação do dono) e no CLAUDE.md da Sofia.

### 7. "A realidade": dor com fonte

Quatro números de mercado: 80% dos empregadores com dificuldade de contratar (ManpowerGroup 2026), 3 em 5 contratados precisando de treino (CNI), 33,6% de rotatividade (Novo CAGED), 52% dos pequenos negócios já usando IA (Sebrae 2026). Cada um com a fonte embaixo.

Nós começamos pela solução ("Por onde começar") sem antes nomear o problema com dado. Quatro números com fonte, antes dos gargalos, dão o mesmo efeito. Conferir cada fonte antes de publicar; não copiar os dela sem checar.

### 8. Tour narrado ("Deixa a Cora te apresentar")

Dez áudios MP3 de 10 a 17 segundos, um por seção. Ao clicar, a página entra em modo apresentação: rola sozinha, mostra a legenda, barra de progresso, botões de pausar e pular, sai com Esc. É a página se vendendo sozinha, útil para quem não quer ler.

Nós temos os 8 vídeos "A Sônia responde", que fazem papel parecido com mais produção. E hoje à tarde validamos a voz da Sônia no HeyGen (Lucilene), então gerar 10 áudios de 15 segundos é rápido. Se for fazer, usar o ElevenLabs, que é o padrão de voz do Marcus, e manter o modo apresentação simples: áudio + rolagem + legenda.

### 9. Chat de voz com a Cora

Botão flutuante "Olá, eu sou a Cora" que abre conversa por texto e voz, ligada ao Gemini Live por um servidor dela. Oito minutos de limite por conversa. É o recurso mais ambicioso da página e o mais caro de manter (servidor, chave de API, custo por conversa, risco de a IA prometer coisa errada; ela mesma avisa "a Cora pode errar").

Para nós, hoje: não. O caminho certo é perguntar à Avalanche se existe widget de chat da plataforma para embutir; aí a conversa roda na infraestrutura deles e o lead já nasce dentro da Sônia do cliente. Enquanto isso, o "Ver a Sônia funcionando" (Calendly) e o WhatsApp cumprem o papel.

### 10. Formulário com qualificação

Ela pede nome, telefone, empresa, cargo, e-mail, faturamento mensal (faixas), número de funcionários e o que procura, com consentimento LGPD. O nosso pede nome, e-mail, WhatsApp e interesse. Acrescentar faturamento e funcionários (faixas) ajuda a separar quem é Starter de quem é Magnata antes da ligação. Custo baixo, o endpoint da planilha já recebe o que vier.

## O que a nossa tem e a dela não (para não jogar fora)

- "Por onde começar": entrada pelo gargalo, com o nome de quem resolve. Ela não tem.
- "A Sônia responde": 8 vídeos com legenda. Ela só tem áudio.
- Conselho Executivo: produto que só nós temos (aguardando aprovação).
- 21 especialistas com currículo e exemplos de pedido. Ela mostra a Cora e uma lista de nomes.
- Economia com tabela, 14 funções e fontes nomeadas.
- "Depois que você paga": onboarding, suporte, garantia de 30 dias. Ela não fala de pós-venda.
- FAQ com 11 perguntas, política de privacidade, área do cliente, parcelamento mostrado em 12x.
- Identidade: Cormorant + Manrope + marfim e ouro. Mais sóbria e mais adulta que o Bebas Neue roxo dela. Não trocar.

## Ordem sugerida

| # | O que | Valor | Esforço | Depende de |
|---|---|---|---|---|
| 1 | Seção "Quem está por trás" + "A Sônia em operação" (imobiliária como prova) | alto | baixo | foto e bio do Marcus |
| 2 | Aparecer ao rolar + contadores na Economia e no hero | alto | médio | mexer no adaptar-design.py |
| 3 | Calculadora com chips em cima da tabela da Economia | alto | médio | nada |
| 4 | "Você no comando" (3 zonas) e "A realidade" (4 números com fonte) | médio | baixo | conferir fontes |
| 5 | Memória da empresa com a tela real do painel | médio | baixo | ok da Avalanche para mostrar tela |
| 6 | Formulário com faturamento e funcionários | médio | baixo | nada |
| 7 | Transição de cor entre seções | baixo | baixo | nada |
| 8 | Tour narrado pela Sônia | médio | médio | 10 áudios no ElevenLabs |
| 9 | Seletor de tema ("Mudar a cor") | baixo | baixo | nada |
| 10 | Chat ao vivo | alto | alto | widget da Avalanche |

Os itens 1, 4 e 6 são só conteúdo e layout. Os itens 2, 3 e 7 são código no mesmo script. O 5 e o 10 esperam resposta da Avalanche. O 8 e o 9 ficam para depois.
