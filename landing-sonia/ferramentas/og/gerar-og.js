// Gera assets/og-sonia.jpg (1200x630) a partir de ferramentas/og/og.html.
// Uso, dentro de landing-sonia:  node ferramentas/og/gerar-og.js
// Para mudar o texto, edite o <h1> e o <p> de og.html.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const html = path.resolve(__dirname, 'og.html');
  const saida = path.resolve(__dirname, '../../assets/og-sonia.jpg');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + html, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: saida, type: 'jpeg', quality: 85 });
  await b.close();
  console.log('ok', saida);
})();
