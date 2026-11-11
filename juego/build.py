"""Genera dist/index.html: el juego en un solo archivo, sin depender de internet para cargar
(three.js, supabase-js y las letras van dentro). Uso: python3 juego/build.py"""
import base64, os, re
D = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(D, 'index.html'), encoding='utf8').read()
rd = lambda f: open(os.path.join(D, 'vendor', f), encoding='utf8').read()
b64 = lambda f: base64.b64encode(open(os.path.join(D, 'vendor', f), 'rb').read()).decode()
# three.js
src = src.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>', '<script>' + rd('three.min.js') + '</script>')
# supabase-js (antes del script principal)
src = src.replace('<script src="https://cdnjs', '<script src="https://cdnjs')  # noop
i = src.rfind('<script>')
src = src[:i] + '<script src="data:text/javascript;base64,' + b64('supabase.js') + '"></script>\n' + src[i:]
# letras
faces = "@font-face{font-family:'Bungee';font-weight:400;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % b64('bungee-latin-400-normal.woff2')
for w in (500, 600, 700):
    faces += "@font-face{font-family:'Chakra Petch';font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % (w, b64('chakra-petch-latin-%d-normal.woff2' % w))
src = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', src)
src = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', '<style>' + faces + '</style>', src)
os.makedirs(os.path.join(D, 'dist'), exist_ok=True)
open(os.path.join(D, 'dist', 'index.html'), 'w', encoding='utf8').write(src)
print('dist/index.html', len(src) // 1024, 'KB')
