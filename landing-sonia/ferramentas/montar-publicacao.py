"""Monta a pasta pública da landing, a partir de landing-sonia/.

Uso:  python3 ferramentas/montar-publicacao.py /caminho/da/pasta-publica [hostgator]

- Sem "hostgator": pasta para a Netlify (leva o netlify.toml).
- Com "hostgator": pasta para a HostGator (leva o .htaccess no lugar do netlify.toml e deixa o
  editor.html de fora).

- Copia só o que é público: index.html, editor.html, politica-de-privacidade.html,
  netlify.toml e a pasta assets/.
- Grava o conteudo.json SEM os campos que começam com "_" (anotações internas, que citam o
  fornecedor da plataforma e assuntos de contrato).
- Para com erro se encontrar o nome do fornecedor ou da Anthropic nos arquivos de texto.
"""
import json, os, re, shutil, sys

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
destino = sys.argv[1] if len(sys.argv) > 1 else sys.exit('informe a pasta de destino')
if os.path.exists(destino):
    shutil.rmtree(destino)
os.makedirs(destino)
hostgator = len(sys.argv) > 2 and sys.argv[2] == 'hostgator'
# na HostGator o editor fica de fora: ele roda no computador de quem edita (python3 -m http.server)
for f in (['index.html', 'politica-de-privacidade.html', '.htaccess'] if hostgator else ['index.html', 'editor.html', 'politica-de-privacidade.html', 'netlify.toml']):
    shutil.copy2(os.path.join(AQUI, f), destino)
shutil.copytree(os.path.join(AQUI, 'assets'), os.path.join(destino, 'assets'))

def limpa(o):
    if isinstance(o, dict):
        return {k: limpa(v) for k, v in o.items() if not k.startswith('_')}
    if isinstance(o, list):
        return [limpa(v) for v in o]
    return o

c = json.load(open(os.path.join(AQUI, 'conteudo.json'), encoding='utf-8'))
json.dump(limpa(c), open(os.path.join(destino, 'conteudo.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

proibido = re.compile(r'avalanche|naia\b|denderson|anthropic', re.I)
achados = []
for raiz, _, arquivos in os.walk(destino):
    for a in arquivos:
        if a.endswith(('.json', '.toml', '.vtt', '.css', '.htaccess')) or a in ('editor.html', 'politica-de-privacidade.html'):
            txt = open(os.path.join(raiz, a), encoding='utf-8', errors='ignore').read()
            if proibido.search(txt):
                achados.append(os.path.join(raiz, a))
if achados:
    sys.exit('PARE: menção ao fornecedor em ' + ', '.join(achados))
print('ok', destino)
