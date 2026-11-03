---
name: conselho-executivo
description: Reúne o Conselho Executivo (Otávio, Lívia, Fernando e Nina) para uma decisão de negócio do dono e transforma a conversa numa diretriz com ações, responsáveis e prazos. Acionar quando o dono disser: "chama o conselho", "quero a opinião do conselho", "preciso decidir se...", "vale a pena...?", "qual o plano para o próximo trimestre?", "estou em dúvida entre...", ou quando a Sônia perceber que o pedido é uma decisão de rumo e não uma tarefa.
allowed-tools: Read, Write, Grep, Glob, Agent
---

# Skill: Reunião do Conselho Executivo

Esta skill é usada pela Sônia. Os conselheiros não falam com o dono. A Sônia ouve o dono, chama quem precisa, junta as opiniões e entrega uma resposta só.

## Quando é reunião do Conselho e quando é tarefa

- **Tarefa:** "escreve um post", "coloca a página no ar", "concilia o extrato". Vai direto para o agente executor. O Conselho não entra.
- **Decisão:** "contrato mais um vendedor?", "subo o preço?", "abro outra unidade?", "devo largar o iFood?", "qual sistema eu uso?". Esta skill entra.
- **Na dúvida**, pergunte ao dono: "Você quer que eu faça isso agora ou quer que o Conselho avalie antes?"

## Passo 1: conferir o dossiê

Abra `dossie-da-empresa.md` na base de conhecimento do cliente.

- Se não existir, rode a skill `dossie-da-empresa` antes. Sem dossiê, os conselheiros dão conselho genérico, e isso não serve.
- Se existir mas estiver desatualizado no ponto da decisão (por exemplo, a equipe mudou), pergunte ao dono só o que mudou e atualize o dossiê.

## Passo 2: escolher quem participa

| Se a decisão envolve | Chame |
|---|---|
| Rotina, processo, equipe, metas, tirar o dono da operação, contratação de gestão | Otávio |
| Público, mensagem, canal, conteúdo, anúncio, lançamento, recompra | Lívia |
| Caixa, margem, preço, custo, contratação, investimento, empréstimo, desconto | Fernando |
| Sistemas, site, app, dados, segurança, LGPD, automação, uso de IA | Nina |

Regras de combinação:

- Qualquer decisão que gaste dinheiro ou mude preço leva o Fernando junto.
- Contratação leva Otávio e Fernando.
- Preço leva Lívia e Fernando.
- Automação que fala com cliente ou usa lista de contatos leva Nina.
- Chame o mínimo que cobre a decisão. Uma pergunta de um tema só pode ter um conselheiro só.

## Passo 3: preparar o pedido aos conselheiros

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

Se a plataforma permitir, chame os conselheiros ao mesmo tempo. Espere todos responderem antes de seguir.

## Passo 4: juntar os pareceres

Leia os pareceres e monte a síntese:

1. **Onde concordam.** Vira a recomendação principal.
2. **Onde discordam.** Não esconda a divergência. Mostre as duas posições e diga qual você recomenda e por quê. Quando a divergência é sobre dinheiro, o parecer do Fernando pesa mais. Quando é sobre o que a operação aguenta, o do Otávio.
3. **O que falta saber.** Junte as perguntas de todos, sem repetir.
4. **O que pede profissional.** Se algum conselheiro escreveu "levar ao contador" ou "levar ao advogado", isso vai em destaque.

Se faltar informação essencial para decidir, pare aqui. Mande ao dono só as perguntas, explicando por que cada uma importa, e retome depois da resposta.

## Passo 5: apresentar ao dono e pedir aprovação

Mande ao dono uma mensagem curta:

```
O Conselho avaliou: <a decisão>.

Recomendação: <uma ou duas frases>.
Por quê: <o argumento principal>.
Ponto de atenção: <a divergência ou o risco, se houver>.
Precisa de profissional: <contador ou advogado, se houver>.

Ações propostas:
1. <ação> com <responsável>, até <prazo>
2. ...

Aprova assim, quer mudar alguma coisa ou prefere não seguir?
```

Não emita a diretriz antes de o dono aprovar. A diretriz é uma ordem de execução. Recomendação o Conselho faz. Decisão é do dono.

## Passo 6: escrever a diretriz

Com a aprovação, crie o arquivo `diretrizes/AAAA-MM-DD-tema-curto.md` na base de conhecimento do cliente, usando o `modelo-diretriz.md` desta skill. Status inicial: PENDENTE.

Se o dono mudou algo na aprovação, a diretriz registra a versão aprovada, não a recomendação original.

## Passo 7: distribuir e acompanhar

1. Mude o status para EM EXECUÇÃO.
2. Envie cada ação ao agente responsável, com o trecho da diretriz que ele precisa.
3. Ações de pessoa (dono, equipe, contador, advogado) viram lembrete para o dono com a data.
4. Registre cada entrega no fim da diretriz, com data.
5. Na data de "como saber se funcionou", avise o dono e mostre o resultado. Se não funcionou, ofereça nova reunião do Conselho sobre o mesmo tema.
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
