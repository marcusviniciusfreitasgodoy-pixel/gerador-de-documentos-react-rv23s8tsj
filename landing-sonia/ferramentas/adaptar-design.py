# Adapta o export do Claude Design para ler o conteudo.json do servidor (editável),
# com SEO no <head>, prévia ao vivo para o editor e validação extra no formulário.
import re, json, sys, html
src, dst, cont = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8').read()
c = json.load(open(cont, encoding='utf-8'))
seo = c.get('seo', {})

def sub_script(tipo, fn):
    global s
    pat = re.compile(r'(<script type="__bundler/' + tipo + r'">)(.*?)(</script>)', re.S)
    m = pat.search(s); assert m, tipo
    novo = fn(m.group(2))
    s = s[:m.start(2)] + novo + s[m.end(2):]

# 1) conteudo.json deixa de vir embutido: o design busca o arquivo do servidor
uuid_conteudo = None
def ext(t):
    global uuid_conteudo
    lst = json.loads(t)
    for r in lst:
        if r['id'] == 'conteudo': uuid_conteudo = r['uuid']
    return json.dumps([r for r in lst if r['id'] != 'conteudo'])
sub_script('ext_resources', ext)
def man(t):
    d = json.loads(t); d.pop(uuid_conteudo, None); return json.dumps(d)
sub_script('manifest', man)

# 2) template: título, SEO, favicon e validação do formulário
def tpl(t):
    t = json.loads(t)
    head = (
        '<title>' + html.escape(seo.get('titulo', 'SONIA')) + '</title>\n'
        '<meta name="description" content="' + html.escape(seo.get('descricao', '')) + '">\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:title" content="' + html.escape(seo.get('titulo', '')) + '">\n'
        '<meta property="og:description" content="' + html.escape(seo.get('descricao', '')) + '">\n'
        '<meta property="og:image" content="https://sonia-primecircle.netlify.app/assets/og-sonia.jpg">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">\n')
    assert '<meta name="viewport"' in t
    t = t.replace('<meta name="viewport" content="width=device-width, initial-scale=1">',
                  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' + head, 1)
    a = 'if (!f.lgpd) return this.setState({ erroForm: "Marque o consentimento para enviar." });'
    b = (a + '\n    if (!f.nome.trim() || !/^\\S+@\\S+\\.\\S+$/.test(f.email) || f.whats.replace(/\\D/g, "").length < 10) '
         'return this.setState({ erroForm: "Preencha nome, e-mail e WhatsApp com DDD." });')
    assert t.count(a) == 1; t = t.replace(a, b)
    a2 = 'window.open(`https://wa.me/${ct.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");'
    b2 = 'window.open(`https://wa.me/${String(ct.whatsapp).replace(/\\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");'
    assert t.count(a2) == 1; t = t.replace(a2, b2)
    return json.dumps(t).replace('</', '<\\/')
sub_script('template', tpl)

# 3) prévia ao vivo: em ?previa=1, o conteudo.json vem do rascunho do editor
previa = r'''<script>
(function () {
  if (!/[?&]previa=1/.test(location.search)) return;
  var CHAVE = "sonia-editor-rascunho", atual = null, buscar = window.fetch.bind(window);
  window.fetch = function (u, o) {
    if (/conteudo\.json(\?|$)/.test(String(u))) {
      try {
        var r = JSON.parse(localStorage.getItem(CHAVE) || "null");
        if (r && r.conteudo) { atual = JSON.stringify(r.conteudo); return Promise.resolve(new Response(atual, { headers: { "Content-Type": "application/json" } })); }
      } catch (e) {}
      return buscar(u, o).then(function (res) { res.clone().json().then(function (j) { atual = JSON.stringify(j); }).catch(function () {}); return res; });
    }
    return buscar(u, o);
  };
  var t = null;
  window.addEventListener("message", function (e) {
    if (e.origin !== location.origin || !e.data || e.data.tipo !== "sonia-conteudo") return;
    if (atual === null || JSON.stringify(e.data.conteudo) === atual) return;
    clearTimeout(t);
    t = setTimeout(function () { location.reload(); }, 500);
  });
  window.addEventListener("load", function () {
    if (window.parent !== window) window.parent.postMessage({ tipo: "sonia-pronta" }, location.origin);
  });
})();
</script>
'''
s = s.replace('<title>Bundled Page</title>', '<title>' + html.escape(seo.get('titulo', 'SONIA')) + '</title>\n' + previa, 1)
assert 'sonia-editor-rascunho' in s
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s), 'conteudo removido:', uuid_conteudo)
