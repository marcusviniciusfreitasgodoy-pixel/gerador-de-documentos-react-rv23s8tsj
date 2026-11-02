// Recebe os contatos do formulário da página da SONIA e grava na planilha.
// Instalação: ferramentas/planilha-leads/COMO-INSTALAR.md

var ABA = 'Leads';
var CABECALHO = ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Interesse', 'Consentimento', 'Página'];
var MESES_GUARDADOS = 12; // a política de privacidade promete apagar depois de 12 meses

function doPost(e) {
  var trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!d.nome || !d.email) return ContentService.createTextOutput('ignorado');
    var aba = pegarAba_();
    aba.appendRow([new Date(), limpa_(d.nome, 120), limpa_(d.email, 120), limpa_(d.whatsapp, 30),
                   limpa_(d.interesse, 120), limpa_(d.consentimento, 10), limpa_(d.pagina, 200)]);
    return ContentService.createTextOutput('ok');
  } finally {
    trava.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('ok');
}

// Rode uma vez por mês (gatilho mensal): apaga os contatos com mais de 12 meses.
function apagarAntigos() {
  var aba = pegarAba_();
  var limite = new Date();
  limite.setMonth(limite.getMonth() - MESES_GUARDADOS);
  for (var linha = aba.getLastRow(); linha >= 2; linha--) {
    var data = aba.getRange(linha, 1).getValue();
    if (data instanceof Date && data < limite) aba.deleteRow(linha);
  }
}

function pegarAba_() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
  if (aba.getLastRow() === 0) aba.appendRow(CABECALHO);
  return aba;
}

// Texto em uma linha, com tamanho máximo, e sem virar fórmula na planilha.
function limpa_(valor, max) {
  return String(valor || '').replace(/[\r\n\t]+/g, ' ').replace(/^[=+\-@]/, "'$&").slice(0, max || 200);
}
