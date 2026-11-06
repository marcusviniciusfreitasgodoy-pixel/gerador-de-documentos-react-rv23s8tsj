"""Lista tudo o que precisa de tradução na landing (06/11/2026).

Uso:  python3 ferramentas/i18n/extrair.py saida.json

Gera {"conteudo": {caminho: texto}, "legendas": {arquivo.vtt: [falas]}} a partir do
conteudo.json e das legendas pt-BR. Campos que começam com "_" (anotações internas),
links, imagens, cores e identificadores ficam de fora.
"""
import glob, json, os, re, sys

AQUI = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
NAO_TRADUZ = {'id', 'cor', 'link', 'link_politica', 'email', 'imagem', 'video', 'legenda', 'secao',
              'whatsapp', 'whatsapp_exibicao', 'endereco', 'endpoint', 'letra', 'cnpj', 'razao_social',
              'poster', 'calendly', 'linkedin', 'foto', 'area_cliente', 'de'}
SEM_TEXTO = re.compile(r'^(https?:|mailto:|tel:|#|assets/|/|data:)|^#[0-9a-fA-F]{3,8}$|^[\d\s.,R$%+/:x×-]*$')


def textos(o, p=()):
    if isinstance(o, dict):
        for k, v in o.items():
            if not k.startswith('_') and k not in NAO_TRADUZ:
                yield from textos(v, p + (k,))
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from textos(v, p + (str(i),))
    elif isinstance(o, str) and o.strip() and not SEM_TEXTO.search(o.strip()):
        yield '/'.join(p), o


def falas(caminho):
    """Blocos do .vtt: [(cabeçalho com número e tempo, texto)]."""
    blocos = open(caminho, encoding='utf-8').read().strip().split('\n\n')[1:]
    out = []
    for b in blocos:
        linhas = b.split('\n')
        i = next(n for n, l in enumerate(linhas) if '-->' in l)
        out.append(('\n'.join(linhas[:i + 1]), '\n'.join(linhas[i + 1:])))
    return out


def legendas_pt():
    return sorted(os.path.relpath(f, AQUI) for f in glob.glob(os.path.join(AQUI, 'assets/video/**/*.pt-BR.vtt'), recursive=True))


if __name__ == '__main__':
    c = json.load(open(os.path.join(AQUI, 'conteudo.json'), encoding='utf-8'))
    saida = {'conteudo': dict(textos(c)),
             'legendas': {f: [t for _, t in falas(os.path.join(AQUI, f))] for f in legendas_pt()}}
    json.dump(saida, open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(saida['conteudo']), 'textos,', sum(len(v) for v in saida['legendas'].values()), 'falas em', len(saida['legendas']), 'legendas')
