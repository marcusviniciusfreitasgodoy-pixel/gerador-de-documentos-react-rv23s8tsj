import json,sys
from faster_whisper import WhisperModel
m=WhisperModel(sys.argv[2],device="cpu",compute_type="int8")
import numpy as np
audio=np.fromfile(sys.argv[1],dtype=np.float32)
segs,info=m.transcribe(audio,language="pt",word_timestamps=True,vad_filter=False,beam_size=5)
out=[]
for s in segs:
  for w in s.words: out.append({"w":w.word.strip(),"s":round(w.start,2),"e":round(w.end,2)})
json.dump(out,open(sys.argv[3],"w",encoding="utf-8"),ensure_ascii=False)
print(info.duration, len(out)); print(" ".join(x["w"] for x in out))
