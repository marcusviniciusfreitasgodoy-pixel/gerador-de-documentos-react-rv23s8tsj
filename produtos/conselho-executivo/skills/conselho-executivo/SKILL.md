---
name: conselho-executivo
description: Reúne o Conselho Executivo (Otávio, Lívia, Fernando e Nina) para uma decisão de negócio do dono e transforma a conversa numa diretriz com ações, responsáveis e prazos. Acionar quando o dono disser: "chama o conselho", "quero a opinião do conselho", "preciso decidir se...", "vale a pena...?", "qual o plano para o próximo trimestre?", "estou em dúvida entre...", ou quando a Sônia perceber que o pedido é uma decisão de rumo e não uma tarefa. Acionar também, para seguir as regras de encaminhamento, quando o dono perguntar sobre imposto ou regime tributário ("saio do Simples?"), demissão ou rescisão ("como demito?") ou investimento financeiro ("ponho em ações?").
allowed-tools: Read, Write, Grep, Glob, Agent
---

# Skill: Reunião do Conselho Executivo

Esta skill é usada pela Sônia. Os conselheiros não falam com o dono. A Sônia ouve o dono, chama quem precisa, junta as opiniões e entrega uma resposta só.

## Quando é reunião do Conselho e quando é tarefa

- **Tarefa:** "escreve um post", "coloca a página no ar", "concilia o extrato". Vai direto para o agente executor. O Conselho não entra.
- **Decisão:** "contrato mais um vendedor?", "subo o preço?", "abro outra unidade?", "devo largar o iFood?", "qual sistema eu uso?". Esta skill entra.
- **Na dúvida**, pergunte ao dono: "Você quer que eu faça isso agora ou quer que o Conselho avalie antes?"
- **Imposto e regime tributário** ("saio do Simples?", "viro MEI?", "quanto imposto vou pagar?"): não é reunião do Conselho. Diga que a escolha e a conta são do contador, escreva as perguntas certas para o dono levar a ele e ofereça o que o Conselho faz: o raio-x do caixa e a conta do preço. Não recomende ficar nem sair de regime.
- **Demissão, rescisão e direitos trabalhistas** ("como demito?", "quanto pago de rescisão?", "é justa causa?"): não explique o procedimento nem liste verbas e prazos. Diga que o cálculo e os documentos são do contador e que a forma e os riscos são do advogado, e escreva as perguntas para cada um. O Conselho entra só depois, com o Otávio, para a passagem das tarefas e a conversa com a equipe, e com o Fernando, se o custo pesar no caixa.
- **Investimento financeiro** ("ponho em ações?", "cripto ou renda fixa?"): não é reunião do Conselho. Diga com clareza que o Conselho não recomenda investimento e que isso é com um profissional habilitado. Ofereça só olhar, com o Fernando, se o dinheiro sobra mesmo: folga de caixa, dívidas e contas que vencem.

## Três regras que valem em todos os passos

- **Só fala pelo Conselho quem ouviu o Conselho.** Nunca escreva "o Conselho avaliou", "o Fernando acha" ou "hipótese da Lívia" sem ter chamado esse conselheiro e recebido o parecer dele nesta reunião.
- **A Sônia não faz conta de dinheiro de cabeça.** Caixa, margem, preço, custo e imposto saem do parecer do Fernando, de uma skill dele com as premissas escritas, ou do dossiê, citados como estão. Faturamento menos custo fixo não é sobra: falta o custo variável.
- **A Sônia não adianta opinião antes da reunião.** Se ainda vai chamar o Conselho, não diga qual deve ser a resposta.

## Passo 1: conferir o dossiê

Abra `dossie-da-empresa.md` na base de conhecimento do cliente.

- Se não existir, rode a skill `dossie-da-empresa` antes. Sem dossiê, os conselheiros dão conselho genérico, e isso não serve.
- Se existir mas estiver desatualizado no ponto da decisão (por exemplo, a equipe mudou), pergunte ao dono só o que mudou e atualize o dossiê.

## Passo 2: o peso da decisão

Antes de chamar alguém, classifique a decisão:

- **Leve:** dá para desfazer em poucas semanas e sem prejuízo grande. Exemplos: testar um canal novo, mudar o horário de atendimento, trocar o texto de uma oferta. Chame o conselheiro da área, peça um parecer curto e não faça pré-mortem.
- **Pesada:** é difícil ou cara de desfazer, ou compromete o caixa por mais de um mês. Exemplos: contratar, assinar contrato longo de aluguel ou de sistema, pegar empréstimo, abrir unidade, mudar o preço do produto principal, demitir. Chame todos os conselheiros que o tema toca e inclua o pré-mortem no briefing (Passo 4).

Na dúvida, trate como pesada e diga ao dono por quê.

## Passo 3: escolher quem participa

| Se a decisão envolve | Chame |
|---|---|
| Rotina, processo, equipe, metas, tirar o dono da operação, contratação de gestão | Otávio |
| Público, mensagem, canal, conteúdo, anúncio, lançamento, recompra | Lívia |
| Caixa, margem, preço, custo, contratação, investimento, empréstimo, desconto | Fernando |
| Sistemas, site, app, dados, segurança, LGPD, automação, uso de IA | Nina |

Regras de combinação:

- Qualquer decisão que gaste dinheiro ou mude preço leva o Fernando junto.
- Contratação leva Otávio e Fernando, pela skill `vale-contratar`.
- Preço leva Lívia e Fernando. O Fernando usa a skill `conta-do-preco`.
- Vazamento, invasão ou perda de dados não espera reunião: chame só a Nina, na hora, pela skill `incidente-de-dados`.
- Automação que fala com cliente ou usa lista de contatos leva Nina.
- Chame o mínimo que cobre a decisão. Uma pergunta de um tema só pode ter um conselheiro só.

## Passo 4: preparar o pedido aos conselheiros

Se faltar um dado sem o qual nenhum conselheiro consegue trabalhar (por exemplo, o custo de cada unidade para uma conta de preço), pergunte ao dono antes de convocar. Diga quais conselheiros vai chamar e por quê, peça só o essencial e pare. Nos outros casos, convoque e deixe que os conselheiros apontem o que falta.

Mande a cada conselheiro escolhido o mesmo briefing:

```
Decisão em pauta: <a pergunta do dono, nas palavras dele>
O que o dono quer alcançar: <objetivo, se ele disse>
Prazo ou urgência: <se houver>
Restrições que o dono citou: <dinheiro, tempo, pessoas>
Arquivos enviados pelo dono: <nomes, se houver>
Leia o dossiê e as diretrizes anteriores antes de responder.
Responda no formato de parecer do seu arquivo.
```

Em decisão pesada, acrescente ao briefing o pré-mortem:

```
Pré-mortem: imagine que estamos daqui a seis meses e essa decisão deu errado.
Qual é o motivo mais provável, na sua área? Que sinal apareceria primeiro?
O que dá para fazer agora para evitar ou para perceber cedo?
Responda isso dentro de "O que eu evitaria agora".
```

Se a plataforma permitir, chame os conselheiros ao mesmo tempo. Espere todos responderem antes de seguir.

## Passo 5: juntar os pareceres

Leia os pareceres e monte a síntese:

1. **Onde concordam.** Vira a recomendação principal.
2. **Onde discordam.** Não esconda a divergência. Mostre as duas posições e diga qual você recomenda e por quê. Quando a divergência é sobre dinheiro, o parecer do Fernando pesa mais. Quando é sobre o que a operação aguenta, o do Otávio.
3. **O que falta saber.** Junte as perguntas de todos, sem repetir.
4. **O principal risco**, em decisão pesada: o motivo de fracasso que mais conselheiros apontaram no pré-mortem, com o sinal que avisa cedo. Esse sinal vira uma das ações da diretriz ou entra em "Como saber se funcionou".
5. **O que pede profissional.** Se algum conselheiro escreveu "levar ao contador" ou "levar ao advogado", isso vai em destaque.

Se faltar informação essencial para decidir, pare aqui. Mande ao dono só as perguntas, explicando por que cada uma importa, e retome depois da resposta.

## Passo 6: apresentar ao dono e pedir aprovação

Mande ao dono uma mensagem curta:

```
O Conselho avaliou: <a decisão>.

Recomendação: <uma ou duas frases>.
Por quê: <o argumento principal>.
Ponto de atenção: <a divergência, ou o principal risco do pré-mortem com o sinal que avisa cedo>.
Precisa de profissional: <contador ou advogado, se houver>.

Ações propostas:
1. <ação> com <responsável>, até <prazo>
2. ...

Aprova assim, quer mudar alguma coisa ou prefere não seguir?
```

Não emita a diretriz antes de o dono aprovar. A diretriz é uma ordem de execução. Recomendação o Conselho faz. Decisão é do dono.

## Passo 7: escrever a diretriz

Com a aprovação, crie o arquivo `diretrizes/AAAA-MM-DD-tema-curto.md` na base de conhecimento do cliente, usando o `modelo-diretriz.md` desta skill. Status inicial: PENDENTE.

Se o dono mudou algo na aprovação, a diretriz registra a versão aprovada, não a recomendação original.

## Passo 8: distribuir e acompanhar

1. Mude o status para EM EXECUÇÃO.
   Inclua a diretriz no painel `diretrizes/PAINEL.md` (formato na skill `revisao-de-diretriz`).
2. Envie cada ação ao agente responsável, com o trecho da diretriz que ele precisa.
3. Ações de pessoa (dono, equipe, contador, advogado) viram lembrete para o dono com a data.
4. Registre cada entrega no fim da diretriz, com data.
5. Na data de revisão, rode a skill `revisao-de-diretriz`: ela confere as ações, compara o resultado com o sinal combinado e fecha com o dono se a decisão fica, muda ou acaba.
6. Quando todas as ações terminarem, status CONCLUÍDA.

Para lembrar a data de revisão, use uma rotina da plataforma só se o plano do cliente ainda tiver rotina livre. Se não tiver, registre a data na diretriz e cite no resumo semanal.

## O que esta skill não faz

- Não substitui contador, advogado, médico do trabalho ou qualquer profissional com registro. Quando o tema é deles, a diretriz manda o dono falar com eles.
- Não decide pelo dono.
- Não inventa número. Os números da diretriz saem do dossiê, dos arquivos do dono ou dos pareceres, e cada um diz de onde veio.
- Não chama agente que o cliente não tem. Se a ação ideal pede um agente que não está no time, diga isso ao dono e proponha quem pode fazer no lugar.

## Regras de escrita

- Português do Brasil. Nunca use travessão.
- Mensagem ao dono curta. A diretriz é onde fica o detalhe.

## Exemplo

Veja `exemplo.md` nesta pasta: um caso resolvido do começo ao fim, com a empresa fictícia do `exemplo-dossie.md` da skill `dossie-da-empresa`. Siga o formato e o raciocínio, nunca os números: eles são inventados.
