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
    # 2b) ajustes de layout pedidos pelo dono em 01/11/2026
    def troca(t, a, b, nome):
        assert t.count(a) == 1, 'trecho do design mudou: ' + nome
        return t.replace(a, b)
    # menu hambúrguer no celular
    t = troca(t, '<header style="position:sticky;', '<header class="pc-hdr" style="position:sticky;', 'header')
    t = troca(t, '</a>\n<nav style="display:flex;gap:0 24px;flex:1;flex-wrap:wrap;justify-content:center">',
              '</a>\n<input type="checkbox" id="pc-menu" class="pc-menu-chk" aria-label="Abrir o menu">'
              '<label for="pc-menu" class="pc-burger" aria-hidden="true"><span></span><span></span><span></span></label>\n'
              '<nav class="pc-nav" aria-label="Seções" style="display:flex;gap:0 24px;flex:1;flex-wrap:wrap;justify-content:center">', 'nav')
    t = troca(t, '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">\n<sc-if value="{{ showArea }}"',
              '<div class="pc-acoes" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">\n<sc-if value="{{ showArea }}"', 'acoes')
    # conversa de exemplo fora da imagem no celular
    t = troca(t, '<div style="flex:1 1 300px;min-width:0;max-width:460px;position:relative;padding-bottom:120px">',
              '<div class="pc-hero-vis" style="flex:1 1 300px;min-width:0;max-width:460px;position:relative;padding-bottom:120px">', 'hero-vis')
    t = troca(t, '<div style="position:absolute;left:clamp(-40px,-3vw,0px);right:16px;bottom:0;',
              '<div class="pc-chat" style="position:absolute;left:clamp(-40px,-3vw,0px);right:16px;bottom:0;', 'chat')
    # uma imagem só da Sônia: sai a da seção "Orquestradora do time"
    t = troca(t, '<div style="flex:1 1 280px;max-width:400px;aspect-ratio:4 / 5;border-radius:10px;overflow:hidden;background:#E8E0CC">\n'
                 '<div role="img" aria-label="{{ sonia.nome }}" style="{{ soniaBg }}"></div>\n</div>\n', '', 'imagem-orquestradora')
    # habilidades da Sônia em duas colunas no computador (pedido de 01/11/2026)
    t = troca(t, '<div style="max-width:640px;border-bottom:1px solid rgba(14,14,14,0.22)">\n<sc-for list="{{ soniaSkills }}"',
              '<div class="pc-skills" style="max-width:640px;border-bottom:1px solid rgba(14,14,14,0.22)">\n<sc-for list="{{ soniaSkills }}"', 'habilidades')
    t = troca(t, '<p style="margin:0;font-size:16px;line-height:1.65;color:#2a2722;max-width:640px;text-wrap:pretty">{{ sonia.resumo }}</p>',
              '<p class="pc-orq-resumo" style="margin:0;font-size:16px;line-height:1.65;color:#2a2722;max-width:640px;text-wrap:pretty">{{ sonia.resumo }}</p>', 'resumo-orquestradora')
    # botões da abertura: no celular, largura total e mesma altura (pedido de 01/11/2026)
    t = troca(t, '<div style="display:flex;gap:12px;flex-wrap:wrap">\n<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" as="a" href="{{ c.hero.botao_principal.link }}"',
              '<div class="pc-hero-btns" style="display:flex;gap:12px;flex-wrap:wrap">\n<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" as="a" href="{{ c.hero.botao_principal.link }}"', 'botoes-abertura')
    # demais botões de ação seguem o mesmo padrão no celular (pedido de 01/11/2026)
    t = troca(t, '<div style="position:relative;display:flex;gap:12px;flex-wrap:wrap;padding-top:8px">\n<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" as="a" href="{{ c.final.botao.link }}"',
              '<div class="pc-hero-btns" style="position:relative;display:flex;gap:12px;flex-wrap:wrap;padding-top:8px">\n<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" as="a" href="{{ c.final.botao.link }}"', 'botao-final')
    t = troca(t, '<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center">\n<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" type="submit"',
              '<div class="pc-hero-btns" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center">\n<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" type="submit"', 'botao-enviar')
    # vídeo de apresentação da Sônia no lugar da foto da abertura (pedido de 02/11/2026)
    t = troca(t, '<div style="aspect-ratio:4 / 5;border:1px solid rgba(245,241,230,0.10);border-radius:10px;overflow:hidden;background:var(--pc-surface-2)">\n'
                 '<div role="img" aria-label="{{ sonia.nome }}" style="{{ soniaBg }}"></div>\n</div>',
              '<div class="pc-hero-foto" style="aspect-ratio:4 / 5;border:1px solid rgba(245,241,230,0.10);border-radius:10px;overflow:hidden;background:var(--pc-surface-2)">\n'
              '<video class="pc-hero-video" poster="assets/video/sonia-apresentacao.webp" '
              'autoplay muted loop playsinline preload="auto" aria-label="Vídeo de apresentação da Sônia">'
              '<source src="assets/video/sonia-apresentacao.mp4" type="video/mp4">'
              '<source src="assets/video/sonia-apresentacao.webm" type="video/webm"></video>\n'
              '<button type="button" class="pc-som" aria-pressed="false"><span class="pc-som-ico" aria-hidden="true"></span><span class="pc-som-txt">Ouvir a Sônia</span></button>\n</div>', 'video-abertura')
    css = """<style>
.pc-menu-chk{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);border:0;white-space:nowrap}
.pc-burger{display:none}
@media (max-width:900px){
  .pc-hdr{justify-content:space-between}
  .pc-burger{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:44px;height:44px;margin-left:auto;border:1px solid rgba(245,241,230,.22);border-radius:8px;cursor:pointer}
  .pc-burger span{display:block;width:20px;height:2px;border-radius:2px;background:#F5F1E6;transition:transform .2s,opacity .2s}
  .pc-nav,.pc-acoes{display:none!important}
  .pc-menu-chk:checked~.pc-nav{display:flex!important;flex-direction:column;flex:1 1 100%;gap:0!important;padding:4px 0;border-top:1px solid rgba(245,241,230,.10)}
  .pc-menu-chk:checked~.pc-nav a{padding:14px 0!important;border-bottom:1px solid rgba(245,241,230,.06)}
  .pc-menu-chk:checked~.pc-acoes{display:flex!important;flex:1 1 100%;padding:8px 0 12px}
  .pc-menu-chk:checked~.pc-acoes>*{flex:1 1 0}
  .pc-menu-chk:checked+.pc-burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  .pc-menu-chk:checked+.pc-burger span:nth-child(2){opacity:0}
  .pc-menu-chk:checked+.pc-burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  .pc-menu-chk:focus-visible+.pc-burger{outline:2px solid #C9A84C;outline-offset:2px}
  .pc-hero-vis{padding-bottom:0!important}
  .pc-chat{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;margin-top:16px}
}
@media (min-width:1000px){
  .pc-orq-resumo{max-width:880px!important}
  .pc-skills{max-width:none!important;column-count:2;column-gap:clamp(40px,5vw,80px)}
  .pc-skills>sc-for{display:contents}
  .pc-skills>*,.pc-skills>sc-for>*{break-inside:avoid}
}
@media (max-width:600px){
  .pc-hero-btns{flex-direction:column!important;align-items:stretch!important}
  .pc-hero-btns a,.pc-hero-btns button{display:flex!important;width:100%!important;justify-content:center!important;box-sizing:border-box;min-height:52px}
}
.pc-hero-foto{position:relative}
.pc-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#161513}
.pc-som{position:absolute;left:12px;top:12px;z-index:2;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid rgba(245,241,230,.35);background:rgba(14,14,14,.72);color:#F5F1E6;font:600 14px/1 var(--pc-font-sans,system-ui);cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.pc-som:hover{border-color:#C9A84C}
.pc-som:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pc-som-ico{width:16px;height:16px;background:#C9A84C;-webkit-mask:var(--pc-ico) center/contain no-repeat;mask:var(--pc-ico) center/contain no-repeat;--pc-ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 4V5L7 9H3z'/%3E%3Cpath d='M16 8.5a5 5 0 0 1 0 7' stroke='black' stroke-width='2' fill='none'/%3E%3Cpath d='M18.5 6a8.5 8.5 0 0 1 0 12' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E")}
.pc-som[aria-pressed="true"] .pc-som-ico{--pc-ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 4V5L7 9H3z'/%3E%3Cpath d='M16 9l6 6M22 9l-6 6' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E")}
@media (prefers-reduced-motion:reduce){.pc-burger span{transition:none}}
</style>
"""
    t = troca(t, '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">\n',
              '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">\n' + css, 'css')
    return json.dumps(t).replace('</', '<\\/')
sub_script('template', tpl)

FECHA_MENU = r'''<script>
document.addEventListener("click", function (e) {
  var alvo = e.target.closest && e.target.closest(".pc-nav a, .pc-acoes a");
  var chk = document.getElementById("pc-menu");
  if (alvo && chk) chk.checked = false;
});
// vídeo da abertura: começa mudo (regra dos navegadores) e o botão liga o som do início.
// O design pode recriar o <video>; por isso cada vídeo novo é preparado de novo.
(function () {
  var semMov = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var somLigado = false, jaOuviu = false;
  function preparar(v) {
    if (v.dataset.pronto) return;
    v.dataset.pronto = "1";
    v.muted = !somLigado;
    v.defaultMuted = true;
    if (semMov && !somLigado) { v.removeAttribute("autoplay"); v.autoplay = false; v.pause(); }
    else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function varrer() { document.querySelectorAll(".pc-hero-video").forEach(preparar); }
  new MutationObserver(varrer).observe(document, { childList: true, subtree: true });
  // o design reaplica as propriedades do <video> a cada redesenho e pode tirar o mudo:
  // enquanto a pessoa não pedir som, o vídeo volta a ficar mudo e segue tocando
  function manterMudo(e) {
    var v = e.target;
    if (!v.classList || !v.classList.contains("pc-hero-video") || somLigado) return;
    if (!v.muted) v.muted = true;
  }
  document.addEventListener("volumechange", manterMudo, true);
  document.addEventListener("play", manterMudo, true);
  document.addEventListener("loadedmetadata", function (e) {
    var v = e.target;
    if (!v.classList || !v.classList.contains("pc-hero-video")) return;
    v.muted = !somLigado;
    if (!(semMov && !somLigado)) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }, true);
  varrer();
  function botao(b) {
    b.setAttribute("aria-pressed", somLigado ? "true" : "false");
    var txt = b.querySelector(".pc-som-txt");
    if (txt) txt.textContent = somLigado ? "Desligar o som" : "Ouvir a Sônia";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".pc-som");
    if (!b) return;
    var v = document.querySelector(".pc-hero-video");
    if (!v) return;
    somLigado = !somLigado;
    if (somLigado && !jaOuviu) { v.currentTime = 0; jaOuviu = true; }
    v.muted = !somLigado;
    if (somLigado) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    botao(b);
  });
})();
document.addEventListener("keydown", function (e) {
  var chk = document.getElementById("pc-menu");
  if (e.key === "Escape" && chk && chk.checked) chk.checked = false;
});
</script>
'''

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
s = s.replace('<title>Bundled Page</title>', '<title>' + html.escape(seo.get('titulo', 'SONIA')) + '</title>\n' + previa + FECHA_MENU, 1)
assert 'sonia-editor-rascunho' in s
open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s), 'conteudo removido:', uuid_conteudo)
