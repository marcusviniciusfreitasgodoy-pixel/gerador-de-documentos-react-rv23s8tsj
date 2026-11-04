# Legenda .vtt a partir dos tempos das palavras (reconhecer-fala.py) e de um arquivo de trechos.
# Uso: python3 gerar-vtt-serie.py palavras.json serie/<id>.tsv saida.vtt
# Cada linha do .tsv: texto exibido<TAB>fala como o reconhecimento ouviu (mesma ordem do áudio).
import json,re,sys,unicodedata
W=json.load(open(sys.argv[1],encoding='utf-8'))
trechos=[l.rstrip('\n').split('\t') for l in open(sys.argv[2],encoding='utf-8') if l.strip()]
norm=lambda s: unicodedata.normalize('NFC',re.sub(r'[^\w]','',s.lower()))
i=0; cues=[]
for texto,fala in trechos:
  n=len(fala.split()); ws=W[i:i+n]
  esperado=[norm(x) for x in fala.split()]; obtido=[norm(x['w']) for x in ws]
  assert esperado==obtido, (texto, esperado, obtido)
  cues.append([ws[0]['s'], ws[-1]['e'], texto]); i+=n
assert i==len(W), (i,len(W))
for k in range(len(cues)):
  fim=cues[k][1]+0.8
  if k+1<len(cues): fim=min(fim,cues[k+1][0]-0.05)
  cues[k][1]=max(fim,cues[k][1])
  cues[k][0]=max(0,cues[k][0]-0.1)
ts=lambda t: '%02d:%02d:%06.3f'%(t//3600,(t%3600)//60,t%60)
out=['WEBVTT','']
for k,(a,b,t) in enumerate(cues,1): out+= [str(k), f'{ts(a)} --> {ts(b)}', t, '']
open(sys.argv[3],'w',encoding='utf-8').write('\n'.join(out))
for a,b,t in cues: print(f'{a:6.2f}-{b:6.2f}  {t}')
