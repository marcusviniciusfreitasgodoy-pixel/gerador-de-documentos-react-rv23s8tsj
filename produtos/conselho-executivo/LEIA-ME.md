# Conselho Executivo SONIA

Produto adicional da SONIA: quatro conselheiros que ajudam o dono a decidir, e seis skills que fazem o Conselho funcionar dentro do time do cliente. Criado em 03/11/2026 para substituir o C-Level Squad, que não pode ser vendido como estava (ver `pendencias/ANALISE-C-LEVEL-SQUAD.md`).

## O que a Avalanche confirmou (03/11/2026, pelo dono)

- O revendedor pode vender agentes adicionais com as respectivas skills.
- Cada adicional é submetido à aprovação da Avalanche antes de ir para venda.
- A Avalanche recebe 30% do valor de qualquer venda.
- O cliente pode trocar os agentes do plano, mas mantém a quantidade de agentes e de rotinas do plano.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `agentes/` | os quatro conselheiros, no formato de subagente |
| `skills/conselho-executivo/` | a Sônia reúne o Conselho, junta os pareceres e escreve a diretriz |
| `skills/dossie-da-empresa/` | a Sônia registra o essencial do negócio no onboarding |
| `skills/plano-de-90-dias/` | skill do Otávio |
| `skills/vender-para-a-carteira/` | skill da Lívia |
| `skills/raio-x-do-caixa/` | skill do Fernando |
| `skills/checkup-de-sistemas-e-dados/` | skill da Nina |
| `FICHA-DE-VENDA.md` | preço por plano, objetivos, benefícios, diferenças, para quem é e o que não prometer |
| `ROTEIRO-DE-VENDA.md` | perguntas de qualificação, apresentação, oferta por plano, objeções e mensagens prontas |
| `COPY-LANDING.md` | textos prontos para planos, "Por onde começar", seção nova e perguntas frequentes |
| `PACOTE-PARA-AVALANCHE.md` | o texto para mandar junto com os arquivos na submissão |
| `curriculos.json` | os quatro currículos no formato da seção "Time" do `conteudo.json`, com `visivel: false` |

## O que mudou em relação ao C-Level Squad

- **Tudo escrito do zero**, em português, para o dono de pequena e média empresa. Os arquivos antigos serviram só para listar o que corrigir.
- **Seis conselheiros viraram quatro.** CTO, CIO e CAIO viraram a Nina. O Vision Chief deixou de existir como agente: na SONIA quem fala com o dono é a Sônia, então ela coordena o Conselho pela skill `conselho-executivo`.
- **Entrou finanças.** O pacote antigo não tinha. Para o dono de empresa pequena, caixa e margem são o assunto mais urgente.
- **Dossiê da empresa** preenchido uma vez, lido por todos.
- **Saída padrão:** parecer de cada conselheiro e diretriz aprovada pelo dono.
- **Ligação com quem executa:** cada conselheiro sabe quais agentes da SONIA fazem o quê e confere quais estão ativos no cliente.
- **Limites escritos:** contador, advogado, nada de investimento, nada de garantia, nada sem aprovação.
- **Sem números sem fonte.** As regras de LGPD citam a norma.
- **Sem nome de pessoa real nem marca de terceiro.**

## Escolhas que você pode mudar

- **Nomes:** Otávio, Lívia, Fernando e Nina não colidem com nenhum dos 21 agentes da SONIA. Trocar é só editar os arquivos e o `curriculos.json`.
- **Preço (decidido em 03/11/2026):** R$ 1.997 por ano como adicional no Starter e no Elite. Incluído no Magnata como bônus e diferencial.
- **`model: inherit`:** o conselheiro usa a IA do plano do cliente. Se a plataforma pedir um modelo fixo, ajuste.

## Implantação (03/11/2026)

A seção foi ao ar em 04/11/2026 **antes** da aprovação da Avalanche. Em 03/11, o "está aprovado" do dono foi lido como aprovação da Avalanche, e não era. Em 04/11 o dono decidiu manter a seção no ar enquanto a Avalanche analisa a proposta (`PACOTE-PARA-AVALANCHE.md`). Já está feito:

- Os quatro avatares em `landing-sonia/assets/agentes/` (gerados com o Gemini, no estilo dos agentes atuais).
- Os textos do `COPY-LANDING.md` no `landing-sonia/conteudo.json`: linhas dos planos, selo do Magnata, quarto item de "Por onde começar", abertura, item "Conselho" no menu e duas perguntas frequentes.
- A seção nova "Conselho Executivo", logo depois do "Time", criada no `ferramentas/adaptar-design.py` e editável no `editor.html`.
- Conferido no navegador a 1440, 820 e 390 px: sem rolagem para o lado, imagens carregando, sem erro no console.

Falta:

- A aprovação da Avalanche e as respostas aos 8 pontos da proposta.
- Instalar os agentes e as skills no painel, como a Avalanche orientar.
- Link de checkout do adicional. Até lá, o botão da seção leva à demonstração.
- Respostas às perguntas 1, 2, 3, 4 e 6 do `PACOTE-PARA-AVALANCHE.md`.

## Próximos passos

1. Ler a ficha e o roteiro, e confirmar os nomes.
2. Testar na sua própria empresa: dossiê, uma reunião do Conselho, uma diretriz.
3. Gerar os quatro avatares no Google AI Studio, no estilo dos agentes atuais.
4. Submeter à Avalanche com o `PACOTE-PARA-AVALANCHE.md`.
5. Depois da aprovação: checkout do adicional, textos do `COPY-LANDING.md` na página e no painel, seção nova no gerador da landing.
