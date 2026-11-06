"""Gera a simulação da página americana num arquivo só (06/11/2026).

Uso:  python3 ferramentas/us-arquivo-unico.py saida.html [pasta]   (pasta: us, padrão, ou br-modelo)

Embute em base64 as imagens, o vídeo (só o mp4) e a legenda que us/index.html busca em ../assets,
para o arquivo abrir em qualquer computador ou celular sem servidor.
"""
import base64, os, re, sys
AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(AQUI, sys.argv[2] if len(sys.argv) > 2 else 'us', 'index.html'), encoding='utf-8').read()
s = re.sub(r'\s*<source src="\.\./assets/video/sonia-apresentacao\.webm" type="video/webm">', '', s)
TIPOS = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.vtt': 'text/vtt'}
vistos = {}
def troca(m):
    rel = m.group(1); caminho = os.path.join(AQUI, rel[3:])
    ext = os.path.splitext(rel)[1]
    if rel not in vistos:
        vistos[rel] = 'data:' + TIPOS[ext] + ';base64,' + base64.b64encode(open(caminho, 'rb').read()).decode()
    return m.group(0).replace(rel, vistos[rel])
s = re.sub(r'"(\.\./assets/[^"]+)"', troca, s)
s = re.sub(r'<a class="lang"[^>]*>BR</a>', '', s)
s = s.replace('href="../politica-de-privacidade.html"', 'href="#"')
assert '../' not in s, 'sobrou caminho relativo'
open(sys.argv[1], 'w', encoding='utf-8').write(s)
print('ok', len(vistos), 'arquivos embutidos,', round(len(s) / 1e6, 1), 'MB')
