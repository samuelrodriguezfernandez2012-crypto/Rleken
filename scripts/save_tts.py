"""Guarda el wav y la URL de resultados de Speko: save_tts.py <carpeta> <indice_inicial> <id1> <id2> ..."""
import json, re, shutil, sys, os
D = '/root/.claude/projects/-home-user-Rleken/d8d1172b-20df-526c-8b34-e6e60a572ee6/tool-results'
out, start = sys.argv[1], int(sys.argv[2])
os.makedirs(out, exist_ok=True)
for k, i in enumerate(sys.argv[3:]):
    d = json.load(open(f'{D}/mcp-Speko-audio_synthesize-{i}.txt'))
    blob = re.search(r'saved to (\S+\.wav)', d[0]['text']).group(1)
    n = start + k
    shutil.copy(blob, f'{out}/cap{n:02d}.wav')
    j = json.loads(d[1]['text'])
    open(f'{out}/cap{n:02d}.url', 'w').write(j['url'])
    print(n, j['duration_seconds'], j['provider'])
