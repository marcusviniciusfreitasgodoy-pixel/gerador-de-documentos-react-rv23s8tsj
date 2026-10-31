# Brief para o Claude Design: landing SONIA

Use este arquivo se quiser explorar outro visual no Claude Design. A página funcional já
existe nesta pasta (`index.html` + `conteudo.json` + `editor.html`). O ideal é usar o Claude
Design para **o visual** e trazer o resultado de volta para cá, para manter a edição pelo
`conteudo.json`.

## O que anexar no Claude Design

1. Este arquivo.
2. `conteudo.json`: todo o texto da página, já revisado (versão sem as anotações internas).
3. A pasta `assets/agentes/` com os 22 retratos (`avatar-sonia.webp` é a orquestradora). São
   ilustrações 3D, 480x480, todas no mesmo escritório. O campo `imagem` de cada agente no
   `conteudo.json` aponta para o arquivo certo.
4. Os prints da versão atual (`prints/`), a 1440 px e a 390 px, como ponto de partida.

## Prompt (copie e cole)

> Crie uma landing page de vendas, em português do Brasil, para a **SONIA** (Sistema
> Operacional de Negócios com Inteligência Artificial), produto da **Prime Circle**.
>
> **O que é:** a Sônia é uma agente de IA que coordena um time de 21 especialistas de IA
> (copy, design, código, tráfego pago, vendas no WhatsApp, financeiro, tributário, jurídico
> e RH). O cliente pede em português, pelo painel ou pelo Telegram, e recebe o trabalho pronto.
>
> **Público:** donos de pequenas e médias empresas de qualquer segmento, sem conhecimento
> técnico, desconfiados de promessa de IA. Querem saber o que recebem e quanto custa.
>
> **Objetivo da página:** levar à assinatura de um dos 3 planos anuais ou ao formulário de
> contato (que abre conversa no WhatsApp).
>
> **Seções, nesta ordem** (todo o texto está no `conteudo.json` anexo; use exatamente esse
> texto):
> 1. Topo fixo: logo "SONIA" (o "IA" em dourado) com "por Prime Circle", menu, botões
>    "Área do cliente" e "Falar com o time".
> 2. Abertura: título com parte em destaque, texto, 2 botões, retrato da Sônia, um balão de
>    "Exemplo de conversa no Telegram" e 3 selos.
> 3. Sigla: as 5 letras S O N I A com a palavra de cada uma.
> 4. Como funciona: 4 passos numerados.
> 5. Time: a Sônia em destaque e uma grade de 21 cards (foto, área, nome, cargo, resumo,
>    "Ver currículo"). Cada card abre um modal com o currículo completo.
> 6. Economia: 2 totais grandes e uma tabela de 14 funções (salário, custo com encargos,
>    custo por hora, "24/7" na coluna "Com agente"), com fontes no rodapé.
> 7. Por que contratar com a Prime Circle: 4 cards (implantação ao vivo toda semana, mentoria e
>    suporte no Magnata, garantia de 30 dias, revenda autorizada).
> 8. Planos: Starter, Elite (destaque) e Magnata, com preço anual, parcelamento com juros, lista
>    de itens e, abaixo dos cards, o aviso do que não está incluído (assinatura da IA e
>    ferramentas conectadas). Esse aviso precisa ficar legível, não escondido.
> 9. Formulário: nome, e-mail, WhatsApp, interesse (opções), consentimento LGPD obrigatório.
> 10. Perguntas frequentes (acordeão).
> 11. Chamada final e rodapé com aviso legal, razão social, CNPJ, e-mail, WhatsApp e link para a
>     política de privacidade (`politica-de-privacidade.html`, que já existe).
>
> **Visual atual (pode evoluir):** blocos com borda escura de 2 px e sombra deslocada
> sólida; azul marinho `#13263b`, papel creme `#fbf7ef` / `#f3ead8`, dourado `#c8a24a`,
> botão coral `#e2574c`, tinta `#142030`. Títulos em Bricolage Grotesque, texto em DM Sans.
>
> **Regras obrigatórias:**
> - Nenhum travessão (— ou –) em texto visível. Use dois-pontos, vírgula ou ponto.
> - Nada de promessa de resultado garantido, números de clientes ou depoimentos inventados.
> - Não citar o Claude como IA dos planos: os planos funcionam com ChatGPT.
> - Ignore os campos do `conteudo.json` que começam com `_`: são anotações internas.
> - Nada de animação que esconda conteúdo (opacity 0) até rolar: a página tem de aparecer
>   inteira mesmo se o script falhar.
> - Responsiva de 390 px a 1440 px, sem rolagem horizontal. A tabela pode rolar dentro do card.
> - Contraste AA, botões com no mínimo 44 px de altura no celular.
> - Todo o texto deve vir de um único objeto de dados (a estrutura do `conteudo.json`), não
>   espalhado no HTML, para que os textos e preços possam ser editados sem mexer no layout.

## O que fica de fora do Claude Design

- **Editor** (`editor.html`), cálculo automático da economia, envio do formulário para o
  WhatsApp e prévia ao vivo: já funcionam aqui e não precisam ser refeitos.
- **Links de checkout:** ficam vazios até você criar os novos na Hubla (o botão leva ao formulário).
- **Política de privacidade:** já pronta, só precisa seguir o visual.
