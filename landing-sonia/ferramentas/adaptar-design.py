# Adapta o export do Claude Design para ler o conteudo.json do servidor (editável),
# com SEO no <head>, prévia ao vivo para o editor e validação extra no formulário.
import re, json, sys, html
src, dst, cont = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8').read()
c = json.load(open(cont, encoding='utf-8'))
seo = c.get('seo', {})
# endereço oficial da página (canonical, og:url, og:image); trocar só em seo.endereco
ENDERECO = seo.get('endereco', 'https://sonia.primecircle.app.br/').rstrip('/') + '/'

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
        '<link rel="canonical" href="' + ENDERECO + '">\n'
        '<meta property="og:url" content="' + ENDERECO + '">\n'
        '<meta property="og:image" content="' + ENDERECO + 'assets/og-sonia.jpg">\n'
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
              '<source src="assets/video/sonia-apresentacao.webm" type="video/webm">'
              '<track kind="captions" srclang="pt-BR" label="Português" src="assets/video/sonia-apresentacao.pt-BR.vtt" default></video>\n'
              '<div class="pc-legenda" aria-hidden="true"></div>\n'
              '<button type="button" class="pc-som" aria-pressed="false"><span class="pc-som-ico" aria-hidden="true"></span><span class="pc-som-txt">Ouvir a Sônia</span></button>\n</div>', 'video-abertura')
    # formulário: grava na planilha (endpoint) E abre o WhatsApp, em vez de um ou outro (02/11/2026).
    # Envio sem esperar resposta e em text/plain, o formato que o Google Apps Script aceita de outro site.
    t = troca(t, '''    if (ct.endpoint) {
      fetch(ct.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) })
        .then(() => this.setState({ enviado: true, erroForm: "" }))
        .catch(() => this.setState({ erroForm: "Não foi possível enviar. Tente de novo." }));
      return;
    }''',
    '''    if (ct.endpoint) {
      try {
        fetch(ct.endpoint, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(Object.assign({ pagina: location.href, consentimento: "sim" }, dados)) }).catch(function () {});
      } catch (e) {}
    }''', 'formulario-planilha')
    # retrato dos especialistas por srcset: antes de o conteúdo carregar, o navegador
    # descarta o valor "{{ a.imagem }}" (descritor inválido) em vez de pedi-lo ao servidor e
    # receber 404, como acontecia com src (corrigido em 02/11/2026)
    t = troca(t, '<img src="{{ a.imagem }}" alt="{{ a.nome }}" loading="lazy"',
              '<img srcset="{{ a.imagem }}" alt="{{ a.nome }}" loading="lazy"', 'img-especialista')
    # no celular a grade mostra 6 especialistas e um botão abre o resto (pedido de 02/11/2026)
    t = troca(t, '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:16px">\n<sc-for list="{{ agents }}"',
              '<div class="pc-esp-grade" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:16px">\n<sc-for list="{{ agents }}"', 'grade-especialistas')
    # tabela de economia no celular: só função e custo por mês, sem rolar para o lado (02/11/2026)
    t = troca(t, '<div style="overflow-x:auto">\n<sc-raw-table style="width:100%;min-width:880px;',
              '<div class="pc-eco" style="overflow-x:auto">\n<sc-raw-table style="width:100%;min-width:880px;', 'tabela-economia')
    # seção "Por onde começar" (gargalos), logo depois da abertura (02/11/2026)
    secao = ('<sc-if value="{{ show.gargalos }}" hint-placeholder-val="{{ true }}">\n'
      '<section id="por-onde-comecar" style="background:#F5F1E6;color:#0E0E0E;padding:clamp(56px,8vw,112px) clamp(20px,4vw,56px);display:grid;gap:40px">\n'
      '<div style="display:grid;gap:16px;max-width:860px">\n'
      '<span style="font-family:var(--pc-font-mono);font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#8B7340">{{ c.gargalos.etiqueta }}</span>\n'
      '<h2 style="margin:0;font-family:var(--pc-font-display);font-weight:500;font-size:var(--pc-fs-h1);line-height:1;letter-spacing:-0.01em;text-wrap:balance">{{ c.gargalos.titulo }}</h2>\n'
      '<p style="margin:0;font-size:17px;line-height:1.6;color:#2a2722;max-width:640px;text-wrap:pretty">{{ c.gargalos.texto }}</p>\n'
      '</div>\n'
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px">\n'
      '<sc-for list="{{ gargalos }}" as="g" hint-placeholder-count="3">\n'
      '<div style="display:grid;grid-template-rows:auto auto 1fr auto;gap:14px;padding:28px 24px;background:#FFFFFF;border:1px solid rgba(14,14,14,0.14);border-radius:10px">\n'
      '<span style="font-family:var(--pc-font-mono);font-size:11px;letter-spacing:0.2em;color:#8B7340">{{ g.n }}</span>\n'
      '<span style="font-family:var(--pc-font-display);font-weight:500;font-size:30px;line-height:1.05;text-wrap:balance">{{ g.titulo }}</span>\n'
      '<span style="font-size:15px;line-height:1.6;color:#2a2722;text-wrap:pretty">{{ g.texto }}</span>\n'
      '<span style="padding-top:14px;border-top:1px dashed rgba(14,14,14,0.22);font-size:13px;line-height:1.5;color:#4a463f"><span style="font-family:var(--pc-font-mono);font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:#8B7340">Quem cuida</span><br>{{ g.quem }}</span>\n'
      '</div>\n</sc-for>\n</div>\n</section>\n</sc-if>\n\n')
    t = troca(t, '<sc-if value="{{ show.sigla }}"', secao + '<sc-if value="{{ show.sigla }}"', 'secao-gargalos')
    # casca da seção "A Sônia responde" (vídeos); o miolo é montado pelo script da página
    t = troca(t, '<sc-if value="{{ show.sigla }}"',
              '<sc-if value="{{ show.videos }}" hint-placeholder-val="{{ true }}">\n<section id="sonia-responde" class="pc-vid" aria-label="Vídeos da Sônia"><div class="pc-vid-in" data-pc-vid></div></section>\n</sc-if>\n\n<sc-if value="{{ show.sigla }}"', 'secao-videos')
    t = troca(t, 'diferenciais: vis(c.diferenciais),', 'diferenciais: vis(c.diferenciais), gargalos: vis(c.gargalos), videos: vis(c.videos),', 'show-gargalos')
    t = troca(t, 'diferenciais: c.diferenciais.itens.map((w, i) => ({ ...w, n: pad(i + 1) })),',
              'diferenciais: c.diferenciais.itens.map((w, i) => ({ ...w, n: pad(i + 1) })),\n      gargalos: ((c.gargalos && c.gargalos.itens) || []).map((w, i) => ({ ...w, n: pad(i + 1) })),', 'lista-gargalos')
    # seção "Conselho Executivo", logo depois do "Time" (03/11/2026). Escura, para separar do Time e da Economia.
    secao_c = ('<sc-if value="{{ show.conselho }}" hint-placeholder-val="{{ true }}">\n'
      '<section id="conselho" style="background:#0E0E0E;color:#F5F1E6;padding:clamp(56px,8vw,112px) clamp(20px,4vw,56px);display:grid;gap:clamp(32px,4vw,56px)">\n'
      '<div style="display:grid;gap:16px;max-width:860px">\n'
      '<span style="font-family:var(--pc-font-mono);font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#C9A84C">{{ c.conselho.etiqueta }}</span>\n'
      '<h2 style="margin:0;font-family:var(--pc-font-display);font-weight:500;font-size:var(--pc-fs-h1);line-height:1;letter-spacing:-0.01em;text-wrap:balance">{{ c.conselho.titulo }}</h2>\n'
      '<p style="margin:0;font-size:17px;line-height:1.6;color:#C8C1B0;max-width:680px;text-wrap:pretty">{{ c.conselho.texto }}</p>\n'
      '</div>\n'
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:clamp(10px,2vw,16px)">\n'
      '<sc-for list="{{ conselheiros }}" as="k" hint-placeholder-count="4">\n'
      '<article style="display:grid;grid-template-rows:auto 1fr;min-width:0;background:var(--pc-surface-2);border:1px solid rgba(245,241,230,0.10);border-radius:10px;overflow:hidden">\n'
      '<div style="aspect-ratio:1 / 1;min-width:0;border-bottom:1px solid rgba(245,241,230,0.10);background:var(--pc-surface-3)">\n'
      '<img srcset="{{ k.imagem }}" alt="{{ k.nome }}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">\n'
      '</div>\n'
      '<div style="display:grid;align-content:start;gap:8px;padding:18px 18px 22px">\n'
      '<span style="font-family:var(--pc-font-mono);font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#C9A84C">{{ k.area }}</span>\n'
      '<h3 style="margin:0;font-family:var(--pc-font-display);font-weight:500;font-size:28px;line-height:1;letter-spacing:-0.01em">{{ k.nome }}</h3>\n'
      '<p style="margin:4px 0 0;font-size:14px;line-height:1.55;color:#B5AFA3;text-wrap:pretty">{{ k.texto }}</p>\n'
      '</div>\n</article>\n</sc-for>\n</div>\n'
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:clamp(24px,4vw,56px);align-items:start">\n'
      '<div style="display:grid;gap:16px">\n'
      '<span style="font-family:var(--pc-font-mono);font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#C9A84C">{{ c.conselho.rotulo_passos }}</span>\n'
      '<ol style="margin:0;padding:0;list-style:none;display:grid;border-top:1px solid rgba(245,241,230,0.14)">\n'
      '<sc-for list="{{ conselhoPassos }}" as="p" hint-placeholder-count="3">\n'
      '<li style="display:grid;grid-template-columns:44px 1fr;gap:12px;padding:16px 0;border-bottom:1px solid rgba(245,241,230,0.14)">'
      '<span style="font-family:var(--pc-font-mono);font-size:12px;letter-spacing:0.2em;color:#C9A84C;padding-top:3px">{{ p.n }}</span>'
      '<span style="font-size:16px;line-height:1.55;color:#E8E0CC;text-wrap:pretty">{{ p.texto }}</span></li>\n'
      '</sc-for>\n</ol>\n</div>\n'
      '<div style="display:grid;gap:16px;padding:28px 24px;border:1px solid rgba(201,168,76,0.35);border-radius:10px;background:rgba(201,168,76,0.06)">\n'
      '<span style="font-family:var(--pc-font-display);font-weight:500;font-size:26px;line-height:1.15;text-wrap:balance">{{ c.conselho.preco }}</span>\n'
      '<span style="font-size:14px;line-height:1.6;color:#C8C1B0;text-wrap:pretty">{{ c.conselho.limite }}</span>\n'
      '<div class="pc-hero-btns" style="display:flex;gap:12px;flex-wrap:wrap;padding-top:4px">\n'
      '<x-import component-from-global-scope="DesignSystem_0d6c1f.Button" as="a" href="{{ c.conselho.botao.link }}" size="lg" hint-size="180px,52px">{{ c.conselho.botao.texto }}</x-import>\n'
      '</div>\n</div>\n</div>\n</section>\n</sc-if>\n\n')
    t = troca(t, '<sc-if value="{{ show.economia }}"', secao_c + '<sc-if value="{{ show.economia }}"', 'secao-conselho')
    t = troca(t, 'gargalos: vis(c.gargalos),', 'gargalos: vis(c.gargalos), conselho: vis(c.conselho),', 'show-conselho')
    t = troca(t, "gargalos: ((c.gargalos && c.gargalos.itens) || []).map((w, i) => ({ ...w, n: pad(i + 1) })),",
              "gargalos: ((c.gargalos && c.gargalos.itens) || []).map((w, i) => ({ ...w, n: pad(i + 1) })),\n"
              "      conselheiros: ((c.conselho && c.conselho.conselheiros) || []),\n"
              "      conselhoPassos: ((c.conselho && c.conselho.passos) || []).map((x, i) => ({ texto: x, n: pad(i + 1) })),", 'lista-conselho')
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
.pc-legenda{position:absolute;left:12px;right:12px;bottom:12px;z-index:2;display:flex;justify-content:center;pointer-events:none}
.pc-legenda span{max-width:100%;padding:6px 12px;border-radius:8px;background:rgba(10,10,9,.78);color:#F5F1E6;font:600 15px/1.35 var(--pc-font-sans,system-ui);text-align:center;text-wrap:balance}
@media (min-width:901px){.pc-legenda span{font-size:16px}}
.pc-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#161513}
.pc-som{position:absolute;left:12px;top:12px;z-index:2;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid rgba(245,241,230,.35);background:rgba(14,14,14,.72);color:#F5F1E6;font:600 14px/1 var(--pc-font-sans,system-ui);cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.pc-som:hover{border-color:#C9A84C}
.pc-som:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pc-som-ico{width:16px;height:16px;background:#C9A84C;-webkit-mask:var(--pc-ico) center/contain no-repeat;mask:var(--pc-ico) center/contain no-repeat;--pc-ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 4V5L7 9H3z'/%3E%3Cpath d='M16 8.5a5 5 0 0 1 0 7' stroke='black' stroke-width='2' fill='none'/%3E%3Cpath d='M18.5 6a8.5 8.5 0 0 1 0 12' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E")}
.pc-som[aria-pressed="true"] .pc-som-ico{--pc-ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 9v6h4l5 4V5L7 9H3z'/%3E%3Cpath d='M16 9l6 6M22 9l-6 6' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E")}
@media (prefers-reduced-motion:reduce){.pc-burger span{transition:none}}
.pc-esp-mais{display:none}
.pc-vid{background:#0E0E0E;color:#F5F1E6;padding:clamp(56px,8vw,112px) clamp(20px,4vw,56px)}
.pc-vid-in{max-width:1180px;margin:0 auto;display:grid;gap:36px}
.pc-vid-head{display:grid;gap:14px;max-width:760px}
.pc-vid-eb{font-family:var(--pc-font-mono,monospace);font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#C9A84C}
.pc-vid-head h2{margin:0;font-family:var(--pc-font-display,serif);font-weight:500;font-size:var(--pc-fs-h1,44px);line-height:1;letter-spacing:-.01em;text-wrap:balance}
.pc-vid-head p{margin:0;font-size:16px;line-height:1.6;color:#C8C1B0}
.pc-vid-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:clamp(24px,4vw,56px);align-items:start}
.pc-vid-lista{list-style:none;margin:0;padding:0;display:grid;gap:8px;border-top:1px solid rgba(245,241,230,.14)}
.pc-vid-lista button{all:unset;box-sizing:border-box;width:100%;display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:4px 14px;padding:16px 14px;border-radius:10px;cursor:pointer;border:1px solid transparent}
.pc-vid-lista button:hover{background:#161513}
.pc-vid-lista button:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
.pc-vid-lista button[aria-pressed="true"]{background:#161513;border-color:rgba(201,168,76,.55)}
.pc-vid-n{font-family:var(--pc-font-mono,monospace);font-size:12px;color:#C9A84C;padding-top:6px}
.pc-vid-t{font-family:var(--pc-font-display,serif);font-weight:500;font-size:clamp(22px,2.2vw,28px);line-height:1.1}
.pc-vid-d{font-family:var(--pc-font-mono,monospace);font-size:12px;color:#8F897C;padding-top:6px}
.pc-vid-r{grid-column:2/4;font-size:14px;line-height:1.5;color:#B5AFA3}
.pc-vid-player{margin:0;display:grid;gap:10px;justify-items:center}
.pc-vid-tela{position:relative;width:100%;max-width:380px;aspect-ratio:9/16;border-radius:12px;overflow:hidden;background:#161513;border:1px solid rgba(245,241,230,.10)}
.pc-vid-tela video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#161513}
.pc-vid-leg{position:absolute;left:12px;right:12px;bottom:64px;display:flex;justify-content:center;pointer-events:none;z-index:2}
.pc-vid-leg span{max-width:100%;padding:6px 12px;border-radius:8px;background:rgba(10,10,9,.8);color:#F5F1E6;font:600 15px/1.35 var(--pc-font-sans,system-ui);text-align:center;text-wrap:balance}
.pc-vid-play{all:unset;position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:18%;box-sizing:border-box;cursor:pointer;z-index:3}
.pc-vid-play span{width:72px;height:72px;border-radius:999px;background:rgba(201,168,76,.92);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.4)}
.pc-vid-play span::before{content:"";margin-left:5px;border-style:solid;border-width:13px 0 13px 21px;border-color:transparent transparent transparent #0E0E0E}
.pc-vid-play:focus-visible span{outline:2px solid #F5F1E6;outline-offset:3px}
.pc-vid-nota{font-size:13px;line-height:1.5;color:#B5AFA3;text-align:center;max-width:380px}
@media (max-width:900px){
  .pc-vid-grid{grid-template-columns:minmax(0,1fr)}
  .pc-vid-lista{display:flex;overflow-x:auto;gap:8px;border-top:0;padding-bottom:6px;scroll-snap-type:x mandatory}
  .pc-vid-lista li{flex:0 0 auto;scroll-snap-align:start}
  .pc-vid-lista button{grid-template-columns:auto;padding:10px 14px;border:1px solid rgba(245,241,230,.22);border-radius:999px;width:auto}
  .pc-vid-n,.pc-vid-d,.pc-vid-r{display:none}
  .pc-vid-t{font-family:var(--pc-font-sans,system-ui);font-size:14px;font-weight:600;white-space:nowrap}
}
@media (max-width:600px){
  .pc-eco table{min-width:0!important}
  .pc-eco th:nth-child(2),.pc-eco td:nth-child(2),.pc-eco th:nth-child(3),.pc-eco td:nth-child(3),
  .pc-eco th:nth-child(5),.pc-eco td:nth-child(5),.pc-eco th:nth-child(6),.pc-eco td:nth-child(6){display:none!important}
  .pc-eco th:nth-child(4),.pc-eco td:nth-child(4){text-align:right!important}
}
@media (max-width:600px){
  html:not(.pc-esp-todos) .pc-esp-grade article:nth-of-type(n+7){display:none!important}
  .pc-esp-mais{display:flex;justify-content:center;align-items:center;width:100%;min-height:52px;padding:0 24px;border-radius:999px;border:1px solid rgba(245,241,230,.35);background:transparent;color:#F5F1E6;font:600 15px/1 var(--pc-font-sans,system-ui);cursor:pointer}
  .pc-esp-mais[hidden],html.pc-esp-todos .pc-esp-mais{display:none}
  .pc-esp-mais:focus-visible{outline:2px solid #C9A84C;outline-offset:2px}
}
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
    legendas(v);
  }
  // legendas desenhadas por cima do vídeo, iguais em qualquer navegador.
  // O arquivo .vtt é lido uma vez; a cada atualização de tempo mostra a frase do momento.
  var cues = null;
  fetch("assets/video/sonia-apresentacao.pt-BR.vtt").then(function (r) { return r.ok ? r.text() : ""; }).then(function (txt) {
    var seg = function (h) { var p = h.split(":").map(parseFloat); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; };
    cues = [];
    txt.replace(/\r/g, "").split("\n\n").forEach(function (bloco) {
      var linhas = bloco.split("\n"), i = linhas.findIndex(function (l) { return l.indexOf("-->") > -1; });
      if (i < 0) return;
      var t = linhas[i].split("-->");
      cues.push({ a: seg(t[0].trim()), b: seg(t[1].trim().split(" ")[0]), texto: linhas.slice(i + 1).join(" ").trim() });
    });
    atualizar();
  }).catch(function () {});
  var ultimo = null;
  function atualizar() {
    var v = document.querySelector(".pc-hero-video"), caixa = document.querySelector(".pc-legenda");
    if (!v || !caixa || !cues) return;
    if (v.textTracks && v.textTracks[0] && v.textTracks[0].mode !== "hidden") v.textTracks[0].mode = "hidden";
    var t = v.currentTime, texto = "";
    for (var k = cues.length - 1; k >= 0; k--) { if (t >= cues[k].a && t < cues[k].b) { texto = cues[k].texto; break; } }
    if (texto !== ultimo || !caixa.firstChild === !!texto) {
      ultimo = texto;
      caixa.innerHTML = "";
      if (texto) { var sp = document.createElement("span"); sp.textContent = texto; caixa.appendChild(sp); }
    }
    posicionar();
  }
  function legendas() { atualizar(); }
  ["timeupdate", "seeked", "loadedmetadata", "play"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.classList && e.target.classList.contains("pc-hero-video")) atualizar(); }, true);
  });
  // no computador a conversa de exemplo cobre a parte de baixo do vídeo: a legenda sobe
  function posicionar() {
    var foto = document.querySelector(".pc-hero-foto"), chat = document.querySelector(".pc-chat"), caixa = document.querySelector(".pc-legenda");
    if (!foto || !caixa) return;
    var f = foto.getBoundingClientRect(), extra = 12;
    if (chat && getComputedStyle(chat).position === "absolute") { var c = chat.getBoundingClientRect(); if (c.top < f.bottom && c.bottom > f.top) extra = Math.round(f.bottom - c.top) + 12; }
    var px = extra + "px";
    if (caixa.style.bottom !== px) caixa.style.bottom = px;
  }
  window.addEventListener("resize", posicionar);
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
// especialistas no celular: o botão "Ver todos" fica logo depois da grade. O design pode
// redesenhar a grade (filtros); por isso o botão é recolocado e a contagem refeita.
(function () {
  function montar() {
    var grade = document.querySelector(".pc-esp-grade");
    if (!grade) return;
    var b = grade.nextElementSibling;
    if (!b || !b.classList.contains("pc-esp-mais")) {
      b = document.createElement("button");
      b.type = "button";
      b.className = "pc-esp-mais";
      grade.insertAdjacentElement("afterend", b);
    }
    var n = grade.querySelectorAll("article").length;
    var txt = "Ver o time todo";
    if (b.textContent !== txt) b.textContent = txt;
    var esconder = n <= 6;
    if (b.hidden !== esconder) b.hidden = esconder;
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".pc-esp-mais")) document.documentElement.classList.add("pc-esp-todos");
  });
  new MutationObserver(montar).observe(document, { childList: true, subtree: true });
  montar();
})();
// "A Sônia responde": vídeos por assunto, depois de "Por onde começar" (03/11/2026).
// A casca está no design; aqui o miolo é montado a partir de conteudo.json. Cliques e eventos do vídeo são
// ouvidos na página inteira, para continuar funcionando se o design redesenhar ou copiar a seção.
(function () {
  var dados = null, atual = 0, cues = {};
  function el(t, c, txt) { var n = document.createElement(t); if (c) n.className = c; if (txt != null) n.textContent = txt; return n; }
  function itens() { return (dados && dados.videos && dados.videos.itens) || []; }
  function lerVtt(txt) {
    var seg = function (h) { var p = h.split(":").map(parseFloat); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; };
    var out = [];
    txt.replace(/\r/g, "").split("\n\n").forEach(function (b) {
      var l = b.split("\n"), i = l.findIndex(function (x) { return x.indexOf("-->") > -1; });
      if (i < 0) return;
      var t = l[i].split("-->");
      out.push({ a: seg(t[0].trim()), b: seg(t[1].trim().split(" ")[0]), texto: l.slice(i + 1).join(" ").trim() });
    });
    return out;
  }
  function preencher(box) {
    var v = dados.videos;
    box.textContent = "";
    var head = el("div", "pc-vid-head");
    head.appendChild(el("span", "pc-vid-eb", v.etiqueta || ""));
    head.appendChild(el("h2", "", v.titulo || ""));
    if (v.texto) head.appendChild(el("p", "", v.texto));
    var grid = el("div", "pc-vid-grid"), lista = el("ol", "pc-vid-lista");
    itens().forEach(function (it, i) {
      var li = el("li"), b = el("button", "pc-vid-item");
      b.type = "button"; b.dataset.i = i;
      b.appendChild(el("span", "pc-vid-n", String(i + 1).padStart(2, "0")));
      b.appendChild(el("span", "pc-vid-t", it.titulo));
      b.appendChild(el("span", "pc-vid-d", it.duracao || ""));
      if (it.resumo) b.appendChild(el("span", "pc-vid-r", it.resumo));
      li.appendChild(b); lista.appendChild(li);
    });
    var fig = el("figure", "pc-vid-player"), tela = el("div", "pc-vid-tela");
    var video = el("video", "pc-vid-video"); video.setAttribute("playsinline", ""); video.preload = "none";
    video.setAttribute("aria-label", "Vídeo da Sônia");
    var leg = el("div", "pc-vid-leg"); leg.setAttribute("aria-hidden", "true");
    var play = el("button", "pc-vid-play"); play.type = "button"; play.setAttribute("aria-label", "Assistir"); play.appendChild(el("span"));
    tela.appendChild(video); tela.appendChild(leg); tela.appendChild(play);
    fig.appendChild(tela); fig.appendChild(el("figcaption", "pc-vid-nota"));
    grid.appendChild(lista); grid.appendChild(fig);
    box.appendChild(head); box.appendChild(grid);
    box.dataset.pronto = "1";
    escolher(atual, false);
  }
  function caixa() { return document.querySelector("[data-pc-vid]"); }
  function escolher(i, iniciar) {
    var box = caixa(), it = itens()[i];
    if (!box || !it) return;
    atual = i;
    box.querySelectorAll(".pc-vid-item").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.i === i)); });
    var video = box.querySelector(".pc-vid-video"), play = box.querySelector(".pc-vid-play"), nota = box.querySelector(".pc-vid-nota");
    if (video.getAttribute("src") !== it.video) { video.pause(); video.poster = it.capa; video.src = it.video; }
    video.controls = false; play.hidden = false;
    box.querySelector(".pc-vid-leg").textContent = "";
    nota.textContent = it.nota || ""; nota.hidden = !it.nota;
    if (!cues[it.legenda]) { cues[it.legenda] = []; fetch(it.legenda).then(function (x) { return x.ok ? x.text() : ""; }).then(function (t) { cues[it.legenda] = lerVtt(t); }).catch(function () {}); }
    if (iniciar) tocar();
  }
  function tocar() {
    var box = caixa(); if (!box) return;
    var video = box.querySelector(".pc-vid-video"), play = box.querySelector(".pc-vid-play");
    var hero = document.querySelector(".pc-hero-video"), som = document.querySelector('.pc-som[aria-pressed="true"]');
    if (hero && som) som.click();
    play.hidden = true; video.controls = true; video.muted = false;
    var p = video.play(); if (p && p.catch) p.catch(function () { play.hidden = false; video.controls = false; });
  }
  function legenda(video) {
    var box = video.closest("[data-pc-vid]"), it = itens()[atual]; if (!box || !it) return;
    var c = cues[it.legenda] || [], t = video.currentTime, txt = "", leg = box.querySelector(".pc-vid-leg");
    for (var k = c.length - 1; k >= 0; k--) if (t >= c[k].a && t < c[k].b) { txt = c[k].texto; break; }
    if ((leg.textContent || "") !== txt) { leg.textContent = ""; if (txt) leg.appendChild(el("span", "", txt)); }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".pc-vid-item");
    if (b) { escolher(+b.dataset.i, true); return; }
    if (e.target.closest && e.target.closest(".pc-vid-play")) tocar();
  });
  ["timeupdate", "seeked"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.classList && e.target.classList.contains("pc-vid-video")) legenda(e.target); }, true);
  });
  document.addEventListener("ended", function (e) {
    var v = e.target; if (!v.classList || !v.classList.contains("pc-vid-video")) return;
    var box = v.closest("[data-pc-vid]"); v.controls = false; box.querySelector(".pc-vid-play").hidden = false; box.querySelector(".pc-vid-leg").textContent = "";
  }, true);
  function varrer() {
    if (!dados) return;
    document.querySelectorAll("[data-pc-vid]").forEach(function (box) { if (!box.dataset.pronto || !box.querySelector(".pc-vid-video")) preencher(box); });
  }
  fetch("conteudo.json").then(function (x) { return x.json(); }).then(function (c) { dados = c; varrer(); }).catch(function () {});
  new MutationObserver(varrer).observe(document, { childList: true, subtree: true });
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
