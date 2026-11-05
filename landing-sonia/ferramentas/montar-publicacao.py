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
import os, json, os, re, shutil, sys

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
destino = sys.argv[1] if len(sys.argv) > 1 else sys.exit('informe a pasta de destino')
# trava: a pasta de destino é APAGADA antes de montar. Nunca pode ser a pasta da landing nem conter o repositório.
_fonte = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_dest = os.path.abspath(destino)
if _dest == _fonte or _fonte.startswith(_dest + os.sep) or os.path.exists(os.path.join(_dest, 'ferramentas', 'montar-publicacao.py')) or _dest == os.path.abspath(os.getcwd()):
    sys.exit('destino inválido: ' + _dest + ' é a pasta da landing (ou a contém). Use uma pasta nova, por exemplo /tmp/sonia-publica. Em 05/11/2026 passar "." apagou a pasta inteira.')
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
if hostgator:
    # o .htaccess manda todo outro nome de domínio para o endereço oficial (seo.endereco)
    from urllib.parse import urlparse
    host = urlparse(c.get('seo', {}).get('endereco', 'https://sonia.primecircle.app.br/')).hostname
    assert host and re.fullmatch(r'[a-z0-9.-]+', host), host
    ht = os.path.join(destino, '.htaccess'); txt = open(ht, encoding='utf-8').read()
    assert txt.count('HOST_OFICIAL_RE') == 1 and txt.count('HOST_OFICIAL') == 2, 'marcadores do .htaccess'
    txt = txt.replace('HOST_OFICIAL_RE', re.escape(host)).replace('HOST_OFICIAL', host)
    open(ht, 'w', encoding='utf-8').write(txt)
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
