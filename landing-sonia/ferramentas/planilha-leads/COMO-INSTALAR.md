# Planilha de leads da SONIA

Cada envio do formulário da página grava uma linha numa planilha do Google **e** abre a conversa
no WhatsApp, como antes. Leva uns 10 minutos, uma vez só.

## 1. Criar a planilha

1. Entre no Google com a conta da Prime Circle e crie uma planilha nova em https://sheets.new
2. Dê o nome **"SONIA · Leads da página"**. Não compartilhe com ninguém fora do time.

## 2. Colar o script

1. Na planilha: **Extensões → Apps Script**.
2. Apague o que estiver no editor e cole todo o conteúdo do arquivo `Codigo.gs`.
3. Clique em **Salvar** (ícone de disquete).

## 3. Publicar como aplicativo da web

1. **Implantar → Nova implantação**.
2. Em "Selecionar tipo", escolha **App da Web**.
3. **Executar como:** Eu (a sua conta). **Quem pode acessar:** Qualquer pessoa.
4. **Implantar**. O Google pede para autorizar: escolha a sua conta, clique em "Avançado" e
   "Acessar (não seguro)". O aviso aparece porque o script é seu e não foi verificado pelo Google.
5. Copie a **URL do app da Web** (termina em `/exec`) e mande para quem mantém a página. Ela vai
   no campo `contato.endpoint` do `conteudo.json`.

"Qualquer pessoa" só deixa o formulário gravar linhas novas. Ninguém de fora consegue ler a planilha.

## 4. Apagar os antigos (LGPD)

A política de privacidade promete apagar os contatos de quem não contratou depois de 12 meses.

1. No Apps Script: **Acionadores** (ícone de relógio) → **Adicionar acionador**.
2. Função: **apagarAntigos** · Evento: **Baseado no tempo** · **Mensal**.
3. Salvar.

Quem virar cliente: copie para o seu controle de clientes antes de 12 meses.

## Se mudar o script

Depois de editar o `Codigo.gs`: **Implantar → Gerenciar implantações → editar → Nova versão**. A
URL continua a mesma.
