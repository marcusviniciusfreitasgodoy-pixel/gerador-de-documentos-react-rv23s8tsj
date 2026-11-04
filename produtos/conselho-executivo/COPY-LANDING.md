# Conselho Executivo: textos para a página

Versão de 03/11/2026. **Aplicado no `landing-sonia/conteudo.json` e no gerador em 03/11/2026**, depois da aprovação da Avalanche informada pelo dono. Os trechos abaixo seguem a estrutura do `landing-sonia/conteudo.json`.

## 1. Planos (lista de cada plano)

Inserir antes do item "Garantia de 30 dias".

**Starter e Elite**

```json
"Conselho Executivo como adicional: 4 conselheiros para as suas decisões, por R$ 1.997 por ano"
```

**Magnata**

```json
"Conselho Executivo incluído: 4 conselheiros para decidir operação, vendas, finanças e tecnologia (R$ 1.997 por ano nos outros planos)"
```

Selo do Magnata, hoje "Com mentoria":

```json
"selo": "Com mentoria e Conselho"
```

## 2. Por onde começar (quarto item)

```json
{
  "titulo": "A decisão grande fica com você, sozinho",
  "texto": "Contratar mais alguém ou dar aquele desconto. Antes do sim, o Conselho Executivo confere se o caixa aguenta e se a operação dá conta, e te devolve uma recomendação só.",
  "quem": "Conselho Executivo: incluído no Magnata, adicional no Starter e no Elite."
}
```

## 3. Seção nova: Conselho Executivo

Lugar sugerido: logo depois da seção "Time". Exige mexer no `ferramentas/adaptar-design.py`, do mesmo jeito que foi feito com a seção "Por onde começar" em 02/11/2026. Os quatro avatares precisam existir antes.

```json
"conselho": {
  "visivel": false,
  "etiqueta": "Conselho Executivo",
  "titulo": "Para as decisões que você toma sozinho.",
  "texto": "O time executa o que você pede. Antes de contratar mais alguém ou de dar aquele desconto, conte a decisão para a Sônia. Ela chama os conselheiros que entendem do assunto, junta as opiniões e te devolve uma recomendação só, mostrando onde eles discordam. Se você aprovar, o time recebe as tarefas com prazo.",
  "conselheiros": [
    {"nome": "Otávio", "area": "Operação e equipe", "texto": "Mostra onde o trabalho trava e o que você pode parar de fazer.", "imagem": "assets/agentes/otavio-operacoes.webp"},
    {"nome": "Lívia", "area": "Marketing e vendas", "texto": "Decide com você para quem vender e o que dizer.", "imagem": "assets/agentes/livia-marketing-vendas.webp"},
    {"nome": "Fernando", "area": "Finanças", "texto": "Projeta o caixa e mostra se a decisão cabe nele.", "imagem": "assets/agentes/fernando-financas.webp"},
    {"nome": "Nina", "area": "Tecnologia e dados", "texto": "Escolhe o sistema mais simples e cuida da segurança dos dados dos seus clientes.", "imagem": "assets/agentes/nina-tecnologia.webp"}
  ],
  "passos": [
    "Você conta a decisão para a Sônia, por texto ou áudio.",
    "Ela chama os conselheiros certos e junta as opiniões numa recomendação.",
    "Você aprova, muda ou desiste. Aprovou, o time recebe as tarefas com prazo e uma data para conferir o resultado."
  ],
  "limite": "Imposto, folha e contrato continuam com o seu contador e o seu advogado. O Conselho diz o que perguntar a eles.",
  "preco": "Incluído no Magnata. No Starter e no Elite, adicional de R$ 1.997 por ano.",
  "botao": {"texto": "Ver o Conselho funcionando", "link": "https://calendly.com/marcus-godoyprime/sonia-ver-a-sonia-funcionando"}
}
```

## 4. Perguntas frequentes (dois itens novos)

```json
{
  "pergunta": "O que é o Conselho Executivo?",
  "resposta": "São quatro conselheiros, de operação e equipe, marketing e vendas, finanças, tecnologia e dados, para as decisões que mexem no caixa e na equipe. Você conta a decisão para a Sônia, ela reúne quem entende do assunto e te devolve uma recomendação só. Se você aprovar, o time recebe as tarefas. Está incluído no Magnata e custa R$ 1.997 por ano como adicional no Starter e no Elite."
}
```

```json
{
  "pergunta": "O Conselho substitui o meu contador ou o meu advogado?",
  "resposta": "Não. O Conselho ajuda você a decidir com os números e as informações da sua empresa. Imposto, folha, contrato e proteção de dados aplicada ao seu caso continuam com o contador e o advogado. Quando o assunto é deles, o Conselho diz o que perguntar."
}
```

## 5. Abertura da página (opcional)

O texto de hoje termina em "No Magnata, também organiza o financeiro e revisa contratos." Sugestão:

```json
"No Magnata, também organiza o financeiro, revisa contratos e traz o Conselho Executivo para as decisões grandes."
```

## Antes de publicar

1. Aprovação da Avalanche, inclusive para o adicional incluído no Magnata.
2. Link de checkout do adicional colocado no botão ou na página de planos.
3. Avatares em `assets/agentes/` com os nomes acima.
4. Os mesmos textos conferidos no painel e no checkout, para a página não prometer o que o checkout não vende.
