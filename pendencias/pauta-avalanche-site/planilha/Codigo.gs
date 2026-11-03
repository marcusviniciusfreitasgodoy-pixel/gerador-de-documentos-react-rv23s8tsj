// Recebe as respostas da pauta da Avalanche (sonia.primecircle.app.br/pauta-avalanche/) e grava na planilha.
// Uma linha por pessoa e item: se a pessoa responder o mesmo item de novo, a linha é atualizada.
// Instalação: COMO-INSTALAR.md, nesta mesma pasta.

var ABA = 'Respostas';
var CABECALHO = ['Atualizado em', 'Quem', 'Item', 'Situação', 'Resposta', 'Página'];

function doPost(e) {
  var trava = LockService.getScriptLock();
  trava.waitLock(15000);
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var itens = Array.isArray(d.itens) ? d.itens.slice(0, 80) : [];
    var aba = pegarAba_();
    var gravados = 0;
    itens.forEach(function (r) {
      var quem = limpa_(r.quem, 80), item = limpa_(r.item, 10);
      if (!quem || !/^\d\.\d{1,2}$/.test(item)) return;
      var linha = [new Date(), quem, item, limpa_(r.status, 20), limpa_(r.texto, 4000), limpa_(d.pagina, 200)];
      var existente = acharLinha_(aba, quem, item);
      if (existente) aba.getRange(existente, 1, 1, linha.length).setValues([linha]);
      else aba.appendRow(linha);
      gravados++;
    });
    return ContentService.createTextOutput(gravados ? 'ok' : 'ignorado');
  } finally {
    trava.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('ok');
}

function acharLinha_(aba, quem, item) {
  var n = aba.getLastRow();
  if (n < 2) return 0;
  var valores = aba.getRange(2, 2, n - 1, 2).getValues();
  for (var i = 0; i < valores.length; i++) {
    if (String(valores[i][0]) === quem && String(valores[i][1]).replace(/^'/, '') === item) return i + 2;
  }
  return 0;
}

function pegarAba_() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
  if (aba.getLastRow() === 0) { aba.appendRow(CABECALHO); aba.setFrozenRows(1); }
  return aba;
}

// Texto sem virar fórmula na planilha e com tamanho máximo.
function limpa_(valor, max) {
  return String(valor || '').replace(/\r/g, '').replace(/^[=+\-@]/, "'$&").slice(0, max || 200);
}
