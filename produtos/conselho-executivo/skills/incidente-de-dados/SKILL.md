---
name: incidente-de-dados
description: Skill da Nina, para uso urgente. Guia o dono nas primeiras horas e nos primeiros dias depois de um vazamento, invasão ou perda de dados: conter, registrar, avaliar o risco, decidir com o advogado se é preciso comunicar a ANPD e os clientes, e preparar os rascunhos. Acionar quando: "vazou", "invadiram", "hackearam o Instagram", "clonaram o WhatsApp", "perdi o celular da empresa", "mandei a planilha para a pessoa errada", "o computador foi sequestrado", "um funcionário levou a lista de clientes".
allowed-tools: Read, Write, Grep, Glob
---

# Skill: Incidente de dados

Usada pela Nina. Aqui não há reunião completa do Conselho: a Sônia chama só a Nina, na hora, e a primeira mensagem ao dono sai em minutos. Se houver dinheiro envolvido, a Sônia chama o Fernando depois da contenção.

Esta skill organiza a resposta. Quem decide se comunica, e assina a comunicação, é o dono com o advogado da empresa.

## Etapa 1: conter, na primeira hora

Mande ao dono só o que precisa ser feito agora, em ordem, conforme o caso:

- Trocar a senha do acesso afetado e a do e-mail principal, e ativar a verificação em duas etapas.
- Encerrar as sessões abertas em outros aparelhos (Google, Instagram, WhatsApp e banco têm essa opção nas configurações de segurança).
- Retirar o acesso de quem não deveria ter, inclusive de ex-funcionário.
- Computador com vírus ou arquivos sequestrados: desconectar da internet. Não formatar e não apagar nada, porque isso apaga o que mostra o que aconteceu.
- Celular perdido: bloquear e apagar à distância pela conta do aparelho, e pedir à operadora o bloqueio do chip.
- Conta de rede social ou WhatsApp tomada: usar o caminho de recuperação da própria plataforma e avisar os clientes por outro canal que mensagens pedindo dinheiro são golpe.
- Dinheiro envolvido: ligar para o banco na hora.
- Avisar o advogado da empresa ainda hoje. Se o dossiê diz que a empresa não tem advogado, recomende procurar um hoje mesmo, de preferência com experiência em proteção de dados. A seccional da OAB da cidade indica nomes. Não espere a resposta das outras perguntas para isso.
- Dizer já na primeira mensagem que o prazo para comunicar, se for preciso, é de 3 dias úteis contados de quando o dono soube.

## Etapa 2: registrar

Abra `incidentes/AAAA-MM-DD-incidente.md` na base de conhecimento do cliente logo depois da primeira mensagem, com o que já se sabe, e complete conforme o dono responder. O registro tem:

- Quando aconteceu e quando o dono ficou sabendo, com data e hora. O prazo de comunicação conta a partir do conhecimento.
- O que aconteceu, em poucas frases.
- Quais tipos de dados foram atingidos: nome, telefone, CPF, endereço, dados de pagamento, senhas, dados de saúde e outros.
- Quantas pessoas, aproximadamente, e de que grupo (clientes, funcionários, crianças).
- O que já foi feito, com o horário de cada medida.

Não copie para o registro os dados que vazaram. O registro descreve, não reproduz.

A lei exige guardar o registro de todo incidente, inclusive do que não for comunicado, por pelo menos cinco anos, com a avaliação do risco e, se for o caso, o motivo de não comunicar (Resolução CD/ANPD nº 15/2024, art. 10). Ele fica nesta pasta.

## Etapa 3: avaliar o risco, com o advogado

A comunicação à ANPD e aos titulares é obrigatória quando o incidente pode causar risco ou dano relevante. Pela Resolução CD/ANPD nº 15/2024, art. 5º, isso acontece quando as duas condições aparecem juntas:

1. Pode afetar de forma significativa os interesses e direitos das pessoas: impedir que usem um serviço, causar dano material ou moral, discriminação, fraude financeira, roubo de identidade, dano à imagem.
2. Envolve pelo menos um destes: dados sensíveis (saúde, por exemplo); dados de crianças, adolescentes ou idosos; dados financeiros; senhas e dados de acesso a sistemas; dados protegidos por sigilo legal, judicial ou profissional; ou dados em larga escala.

A Nina prepara essa avaliação com o que está no registro e leva ao advogado. A decisão de comunicar ou não é do dono com o advogado, e o motivo vai escrito no registro.

## Etapa 4: os prazos

- **Prazo geral:** 3 dias úteis, contados de quando o dono soube que o incidente atingiu dados pessoais, para comunicar a ANPD e para comunicar os titulares (Resolução CD/ANPD nº 15/2024, arts. 6º e 9º).
- **Empresa de pequeno porte:** a Resolução manda contar os prazos em dobro, ou seja, 6 dias úteis (art. 6º, § 8º, e art. 9º, § 6º), nos termos do regulamento do pequeno porte (Resolução CD/ANPD nº 2/2022), que tem exceções. Trabalhe sempre com os 3 dias úteis como meta. Se o prazo dobra para esta empresa, quem confirma é o advogado.
- **Complemento:** as informações enviadas à ANPD podem ser completadas em até 20 dias úteis depois da comunicação.

Escreva no registro a data final de cada prazo assim que souber quando o dono tomou conhecimento.

## Etapa 5: os rascunhos

Se o advogado decidir comunicar, a Nina prepara os rascunhos para ele revisar:

- **À ANPD:** feita pelo formulário eletrônico indicado no site da ANPD. O rascunho reúne as informações do registro para o advogado preencher, e diz se a empresa é de pequeno porte.
- **Aos clientes atingidos:** em linguagem simples, de preferência direta para cada pessoa. Deve conter:
  - quais dados foram atingidos;
  - os riscos e o que pode acontecer com a pessoa;
  - as medidas tomadas e as que ainda serão tomadas;
  - a data em que a empresa soube do incidente;
  - o contato para tirar dúvidas;
  - o motivo da demora, se o prazo foi perdido.

Os rascunhos ficam no registro como rascunho. Nada é enviado sem o advogado.

## Etapa 6: depois da crise

Quando o incidente estiver contido e comunicado, ou decidido que não se comunica:

- A Nina roda a skill `checkup-de-sistemas-e-dados` para achar a causa e o que mudar.
- A Sônia leva o tema ao Conselho e, com a aprovação do dono, escreve a diretriz das correções.

## Quem executa

- O dono ou alguém da equipe: trocar senhas, encerrar sessões, falar com o banco e a operadora. Essas ações uma pessoa faz.
- Paulo ou Boris: revisar acessos e integrações, se o incidente passou por um sistema.
- Aline, se o cliente tiver: organizar os rascunhos para o advogado.
- O advogado: a decisão de comunicar, a comunicação e qualquer contato com a polícia ou com a ANPD.

## Limites

- Não dar parecer jurídico. A Nina organiza os fatos e os prazos; o advogado decide.
- Não pedir, guardar ou repetir senha. Se o dono mandar uma senha na conversa, oriente a trocar.
- Não abrir, copiar nem guardar os dados que vazaram.
- Não negociar nem pagar resgate de arquivos sequestrados sem o advogado e a polícia.
- Não prometer ao dono nem aos clientes que nada vazou ou que não vai acontecer de novo.
- Invasão de sistema é crime. O registro de ocorrência na polícia é decisão do dono com o advogado.
- Nunca use travessão.

## Exemplo

Veja `exemplo.md` nesta pasta: um caso resolvido do começo ao fim, com a empresa fictícia do `exemplo-dossie.md` da skill `dossie-da-empresa`. Siga o formato e o raciocínio, nunca os números: eles são inventados.
