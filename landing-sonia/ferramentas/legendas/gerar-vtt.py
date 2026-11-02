import json,re,sys,unicodedata
W=json.load(open(sys.argv[1],encoding='utf-8'))
# (texto exibido, quantas palavras do áudio ele cobre), na ordem da fala
trechos=[
("Até 21 especialistas. Nenhum na folha.", "Até 21 especialistas, nenhuma folha."),
("Eu sou a Sônia.", "Eu sou a Sônia,"),
("Sistema Operacional de Negócios com Inteligência Artificial.", "Sistema Operacional de Negócios com Inteligência Artificial,"),
("Coordeno o time que atende no WhatsApp,", "coordeno o time que atende o WhatsApp,"),
("escreve, publica, organiza o financeiro e revisa contratos.", "escreve, publica, organiza o financeiro e revisa completos."),
("Você me pede por texto ou áudio,", "Você me pede por texto ou áudio,"),
("no Telegram ou no painel.", "no Telegram ou do painel."),
("Eu escolho o especialista certo para cada parte.", "Eu escolho o especialista certo para cada parte."),
("O time executa, e eu só te entrego depois de revisar.", "O time executa e eu só te entrego depois de revisar."),
("Feito por gente, o time completo custaria", "Feito por gente, o time completo custaria"),
("mais de R$ 141 mil por mês.", "mais de 141 mil reais por mês."),
("Comigo, você paga o plano", "Comigo você paga o plano"),
("e a assinatura da inteligência artificial.", "e é assinatura da inteligência artificial."),
("Quem manda é você:", "Quem manda é você."),
("fala comigo como falaria com um funcionário de confiança.", "Fala comigo como falaria com um funcionário de confiança."),
("Todos os planos têm garantia de 30 dias.", "Todos os planos têm garantia de trincadias."),
("Quer me ver trabalhando? Fale com o time no WhatsApp.", "Quer me ver trabalhando? Fale com o time no WhatsApp."),
]
norm=lambda s: unicodedata.normalize('NFC',re.sub(r'[^\w]','',s.lower()))
i=0; cues=[]
for texto,fala in trechos:
  n=len(fala.split()); ws=W[i:i+n]
  esperado=[norm(x) for x in fala.split()]; obtido=[norm(x['w']) for x in ws]
  assert esperado==obtido, (texto, esperado, obtido)
  cues.append([ws[0]['s'], ws[-1]['e'], texto]); i+=n
assert i==len(W), (i,len(W))
# cada legenda fica até a próxima começar (no máximo 0,8 s depois da última palavra)
for k in range(len(cues)):
  fim=cues[k][1]+0.8
  if k+1<len(cues): fim=min(fim,cues[k+1][0]-0.05)
  cues[k][1]=max(fim,cues[k][1])
  cues[k][0]=max(0,cues[k][0]-0.1)
ts=lambda t: '%02d:%02d:%06.3f'%(t//3600,(t%3600)//60,t%60)
out=['WEBVTT','']
for k,(a,b,t) in enumerate(cues,1): out+= [str(k), f'{ts(a)} --> {ts(b)}', t, '']
open(sys.argv[2],'w',encoding='utf-8').write('\n'.join(out))
for a,b,t in cues: print(f'{a:6.2f}-{b:6.2f}  {t}')
