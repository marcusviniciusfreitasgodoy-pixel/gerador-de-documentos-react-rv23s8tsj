---
name: revisao-de-diretriz
description: Skill da Sônia. Na data de revisão de uma diretriz do Conselho, confere se as ações foram feitas, compara o resultado com o sinal combinado e fecha com o dono um de três caminhos: manter, ajustar ou encerrar. Mantém o painel das decisões em aberto. Acionar quando chegar a data de revisar_em de uma diretriz, quando o dono perguntar "aquela decisão deu certo?", "o que o Conselho decidiu?", "o que está pendente?", ou no resumo semanal.
allowed-tools: Read, Write, Grep, Glob, Agent
---

# Skill: Revisão de diretriz

Usada pela Sônia. É o que fecha o ciclo do Conselho: toda decisão aprovada tem uma data para conferir se funcionou, e o aprendizado fica guardado para a próxima decisão.

## Quando rodar

- Na data de `revisar_em` de cada diretriz com status EM EXECUÇÃO.
- Quando o dono perguntar pelo resultado de uma decisão ou pelo que está pendente.
- No resumo semanal, só para listar as revisões da semana seguinte.

Para não esquecer a data, use uma rotina da plataforma só se o plano do cliente ainda tiver rotina livre. Sem rotina livre, consulte o painel no resumo semanal.

## Etapa 1: o painel

Mantenha `diretrizes/PAINEL.md` na base de conhecimento do cliente, atualizado a cada diretriz nova e a cada revisão:

| Diretriz | Tema | Status | Revisar em | Ações concluídas |
|---|---|---|---|---|
| 2026-11-10-contratar-vendedor | Contratar mais um vendedor? | EM EXECUÇÃO | 2027-01-10 | 2 de 4 |

Ordene pela data de revisão mais próxima.

## Etapa 2: o que foi feito

Abra a diretriz e confira cada ação:

- Feita, feita em parte ou não feita, com a data.
- Ação de agente: confira a entrega no registro de execução da diretriz.
- Ação de pessoa (dono, equipe, contador, advogado): pergunte ao dono.

Se a maioria das ações não foi feita, a revisão é sobre execução, não sobre a decisão. Diga isso ao dono antes de julgar o resultado.

## Etapa 3: o resultado

Leia a seção "Como saber se funcionou" e consiga o dado combinado, com o dono ou com o agente responsável. Classifique:

- **Funcionou:** o sinal chegou onde foi combinado.
- **Funcionou em parte:** melhorou, mas não chegou lá.
- **Não funcionou:** o sinal não mudou ou piorou.
- **Não dá para saber:** o dado não foi medido. Isso também é um resultado, e a correção é combinar como medir.

Nunca classifique sem o dado. Opinião do dono conta como opinião e vai escrita assim.

## Etapa 4: o caminho

Mostre ao dono o que foi feito, o resultado e uma recomendação. O dono escolhe:

- **Manter:** a decisão segue como está. Status CONCLUÍDA se as ações acabaram, ou nova data de revisão se é contínua.
- **Ajustar:** mudam ações, prazos ou a meta. Registre o que mudou e a nova data. Se o ajuste muda a decisão em si, chame de novo o conselheiro da área.
- **Encerrar:** a decisão não vale mais. Status CANCELADA, com o motivo.

Quando o resultado foi "não funcionou", ofereça uma nova reunião do Conselho sobre o tema, pela skill `conselho-executivo`. Ela já parte do que foi aprendido.

## Etapa 5: registrar

- Na diretriz, preencha a seção "Revisão": data, ações feitas, resultado com o dado, caminho escolhido pelo dono e o aprendizado em uma frase.
- No dossiê, na seção "Mudanças registradas", uma linha com a data, o tema e o aprendizado. É assim que os conselheiros levam em conta o que já deu certo e o que não deu.
- Atualize o painel.

## Mensagem ao dono

```
Revisão: <tema da diretriz>, decidida em <data>.

Feito: <x de y ações>.
Resultado: <funcionou, em parte, não funcionou ou não dá para saber>, porque <o dado>.
Minha recomendação: <manter, ajustar ou encerrar>, porque <motivo>.

Seguimos assim?
```

## Limites

- Não mudar o que foi decidido sem aprovação do dono. A revisão propõe, o dono escolhe.
- Não apagar nem reescrever o histórico da diretriz. Revisão nova é acrescentada embaixo.
- Não procurar culpado. A revisão olha o processo e o resultado, não a pessoa.
- Nunca use travessão.
