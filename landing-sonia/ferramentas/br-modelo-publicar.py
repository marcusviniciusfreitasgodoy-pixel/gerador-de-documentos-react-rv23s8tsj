"""Gera o index.html do site oficial a partir de br-modelo/index.html (06/11/2026).

Uso:  python3 ferramentas/br-modelo-publicar.py saida.html

br-modelo/ é a versão na estrutura do modelo americano, em português. Para o ar: caminhos ../ viram
relativos à raiz, sai o noindex e entram endereço oficial e imagem de compartilhamento (de seo no
conteudo.json). A versão anterior (index.html gerado do Claude Design) fica guardada como reserva.
"""
import html, json, os, sys
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(AQUI, 'br-modelo', 'index.html'), encoding='utf-8').read()
seo = json.load(open(os.path.join(AQUI, 'conteudo.json'), encoding='utf-8'))['seo']
url = seo['endereco'].rstrip('/') + '/'
s = s.replace('"../assets/', '"assets/').replace('"../politica-de-privacidade.html', '"politica-de-privacidade.html')
robots = '<meta name="robots" content="noindex, nofollow">\n'
assert s.count(robots) == 1
tags = ('<link rel="canonical" href="' + url + '">\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:url" content="' + url + '">\n'
        '<meta property="og:title" content="' + html.escape(seo['titulo']) + '">\n'
        '<meta property="og:description" content="' + html.escape(seo['descricao']) + '">\n'
        '<meta property="og:image" content="' + url + 'assets/og-sonia.jpg">\n'
        '<meta name="twitter:card" content="summary_large_image">\n')
s = s.replace(robots, tags)
assert '../' not in s and 'noindex' not in s
open(sys.argv[1], 'w', encoding='utf-8').write(s)
print('ok', len(s))
