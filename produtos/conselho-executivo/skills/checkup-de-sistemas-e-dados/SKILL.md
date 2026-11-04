---
name: checkup-de-sistemas-e-dados
description: Skill da Nina. Faz o inventário das ferramentas e dos dados da empresa, confere a segurança básica e o essencial da LGPD, e avalia o que vale automatizar com agente ou rotina. Acionar quando: "quero organizar meus sistemas", "estou com medo de vazar dados", "o que eu preciso fazer de LGPD?", "o que dá para automatizar?", "uso ferramenta demais".
allowed-tools: Read, Write, Grep, Glob
---

# Skill: Checkup de sistemas e dados

Usada pela Nina dentro de uma reunião do Conselho.

## Etapa 1: inventário

Peça à Sônia que levante com o dono, ou com a Juliana se houver:

| Ferramenta | Para que serve | Quem usa | Quem é o responsável | Quanto custa | Como exportar os dados |
|---|---|---|---|---|---|

Inclua e-mail, banco, sistema de gestão, emissão de nota, agenda, CRM, redes sociais, WhatsApp, armazenamento de arquivos e a própria SONIA. Não registre senhas na tabela.

## Etapa 2: segurança básica

Para cada item, sim, não ou não sabe:

- O e-mail principal e o banco têm verificação em duas etapas?
- Cada pessoa tem o próprio acesso, ou a senha é compartilhada?
- Quem saiu da empresa teve os acessos retirados?
- Existe cópia de segurança dos arquivos importantes fora do computador principal?
- Alguém já testou recuperar essa cópia?
- O WhatsApp da empresa está num aparelho e num número da empresa?

Comece a recomendação pelo item mais fraco. Na maioria das vezes, é o e-mail sem verificação em duas etapas.

## Etapa 3: o essencial da LGPD

- Quais dados pessoais a empresa coleta (nome, telefone, endereço, CPF, dados de saúde) e para quê.
- Onde ficam e quem tem acesso.
- Por quanto tempo são guardados e quando são apagados.
- Existe um canal para o cliente pedir seus dados ou pedir exclusão? Pode ser um e-mail ou o próprio WhatsApp, desde que alguém responda.
- Existe política de privacidade no site ou na página de cadastro?
- Algum dado é sensível (saúde, por exemplo)? Se sim, o cuidado é maior e o enquadramento como pequeno porte pode não valer. Recomendar conversa com o advogado.

Explique ao dono com as regras do arquivo da Nina: não há registro na ANPD, o encarregado pode ser dispensado no pequeno porte mas o canal é obrigatório, e incidente com risco ao titular exige comunicação rápida e advogado no mesmo dia. Se o incidente já aconteceu, pare o checkup e use a skill `incidente-de-dados`.

## Etapa 4: o que automatizar

Para cada tarefa repetitiva que o Otávio ou o dono apontar:

| Pergunta | Se a resposta for sim |
|---|---|
| Um modelo de mensagem ou uma regra simples resolve? | não use IA, use o modelo |
| A tarefa fala com cliente em nome da empresa? | uma pessoa revisa antes de sair |
| Mexe em dinheiro, preço, contrato ou dado sensível? | uma pessoa revisa sempre |
| Decide algo sobre uma pessoa (aprova, recusa)? | a pessoa pode pedir revisão (LGPD, art. 20); garanta esse caminho |
| Alguém sabe desligar a automação? | se não, não ligue ainda |

Lembre que cada rotina automática conta no limite de rotinas do plano do cliente.

## Quem executa

Paulo ou Boris para integração e sistema, Amanda para CRM e automação de conversa, Juliana para a planilha de inventário e a rotina de revisão de acessos, Aline para a primeira leitura da política de privacidade. Trocar senha e ativar verificação em duas etapas é tarefa de uma pessoa.

## Entrega

O parecer da Nina, no formato do arquivo dela, com o inventário e o checklist em anexo, sem nenhuma senha.

## Limites

- Política de privacidade, contrato com fornecedor e resposta a incidente: o advogado redige ou revisa.
- Preço de ferramenta só com o endereço do fornecedor e a data da consulta.
- Nunca use travessão.

## Exemplo

Veja `exemplo.md` nesta pasta: um caso resolvido do começo ao fim, com a empresa fictícia do `exemplo-dossie.md` da skill `dossie-da-empresa`. Siga o formato e o raciocínio, nunca os números: eles são inventados.
