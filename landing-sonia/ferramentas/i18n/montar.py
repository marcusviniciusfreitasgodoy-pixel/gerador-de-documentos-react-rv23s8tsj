"""Monta as versões em espanhol e inglês da landing (06/11/2026).

Uso:
  python3 ferramentas/i18n/montar.py                 gera conteudo.es.json, conteudo.en.json e as legendas .es.vtt/.en.vtt
  python3 ferramentas/i18n/montar.py importar es arquivo.json
                                                     guarda uma tradução nova (formato de extrair.py, com os textos traduzidos)

As traduções ficam em ferramentas/i18n/<idioma>.json, cada texto junto do português que foi
traduzido. Se o português mudar depois (no editor ou à mão), aquele texto sai em português na
versão traduzida e entra na lista de pendentes que este script mostra. Para atualizar:
  python3 ferramentas/i18n/extrair.py /tmp/pt.json  ->  traduzir só os pendentes  ->  importar.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extrair import AQUI, textos, falas, legendas_pt

IDIOMAS = ('es', 'en')
TRACOS = ('—', '–')


def arq(lang):
    return os.path.join(AQUI, 'ferramentas', 'i18n', lang + '.json')


def importar(lang, caminho):
    c = json.load(open(os.path.join(AQUI, 'conteudo.json'), encoding='utf-8'))
    pt = dict(textos(c))
    novo = json.load(open(caminho, encoding='utf-8'))
    atual = json.load(open(arq(lang), encoding='utf-8')) if os.path.exists(arq(lang)) else {'conteudo': {}, 'legendas': {}, 'ui': {}}
    for k, tr in novo.get('conteudo', {}).items():
        assert k in pt, 'caminho que não existe no conteudo.json: ' + k
        atual['conteudo'][k] = {'pt': pt[k], 'tr': tr}
    for f, linhas in novo.get('legendas', {}).items():
        orig = [t for _, t in falas(os.path.join(AQUI, f))]
        assert len(orig) == len(linhas), f + ': número de falas diferente'
        atual['legendas'][f] = [{'pt': a, 'tr': b} for a, b in zip(orig, linhas)]
    atual['ui'].update(novo.get('ui', {}))
    ruins = [v for v in json.dumps(atual, ensure_ascii=False) if v in TRACOS]
    assert not ruins, 'tradução com travessão'
    json.dump(atual, open(arq(lang), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(lang, 'guardado:', len(atual['conteudo']), 'textos,', len(atual['legendas']), 'legendas,', len(atual['ui']), 'frases da interface')


def trocar(o, p, tr):
    if isinstance(o, dict):
        return {k: (trocar(v, p + (k,), tr)) for k, v in o.items() if not k.startswith('_')}
    if isinstance(o, list):
        return [trocar(v, p + (str(i),), tr) for i, v in enumerate(o)]
    if isinstance(o, str):
        return tr.get('/'.join(p), o)
    return o


def montar():
    c = json.load(open(os.path.join(AQUI, 'conteudo.json'), encoding='utf-8'))
    pt = dict(textos(c))
    for lang in IDIOMAS:
        if not os.path.exists(arq(lang)):
            print(lang, ': sem tradução, pulei'); continue
        t = json.load(open(arq(lang), encoding='utf-8'))
        ok = {k: v['tr'] for k, v in t['conteudo'].items() if k in pt and pt[k] == v['pt']}
        pendentes = [k for k in pt if k not in ok]
        json.dump(trocar(c, (), ok), open(os.path.join(AQUI, 'conteudo.' + lang + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        sem_leg = []
        for f in legendas_pt():
            blocos = falas(os.path.join(AQUI, f))
            lt = t['legendas'].get(f, [])
            if len(lt) != len(blocos) or any(a['pt'] != b for a, (_, b) in zip(lt, blocos)):
                sem_leg.append(f)  # sem arquivo traduzido: a página usa a legenda em português
                velho = os.path.join(AQUI, f.replace('.pt-BR.vtt', '.' + lang + '.vtt'))
                if os.path.exists(velho): os.remove(velho)
                continue
            corpo = 'WEBVTT\n\n' + '\n\n'.join(cab + '\n' + x['tr'] for (cab, _), x in zip(blocos, lt)) + '\n'
            open(os.path.join(AQUI, f.replace('.pt-BR.vtt', '.' + lang + '.vtt')), 'w', encoding='utf-8').write(corpo)
        print(lang, ':', len(ok), 'textos traduzidos,', len(pendentes), 'pendentes (saem em português),',
              len(legendas_pt()) - len(sem_leg), 'de', len(legendas_pt()), 'legendas')
        for k in pendentes[:40]:
            print('   pendente:', k, '=', pt[k][:70])
        for f in sem_leg:
            print('   legenda pendente:', f)


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'importar':
        importar(sys.argv[2], sys.argv[3])
    else:
        montar()
