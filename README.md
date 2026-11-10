# chiki shorts

Shorts verticales de animación stickman para el canal **chiki (@chiki2225)**, hechos con [Remotion](https://www.remotion.dev/).

## Estructura

- `src/Stickman.tsx` — el personaje (cabeza negra redonda, ojos blancos, sudadera con capucha y brillo) y sus poses.
- `src/Scenes.tsx` — las escenas de la historia.
- `src/Captions.tsx` + `src/words.json` — subtítulos karaoke palabra a palabra (tiempos sacados de la voz).
- `src/fx.tsx` — efectos: textos que rebotan, bocadillos, sacudidas, destellos, transiciones.
- `scripts/audio.py` — música y efectos sintetizados (sin copyright) y mezcla con la voz.
- `PUBLICAR.md` — título, descripción, etiquetas, hora y comentario fijado.

## Comandos

```bash
npm install
python3 scripts/audio.py        # regenera la mezcla de audio
npm run studio                  # editor visual
npx remotion render MentirasShort out/video.mp4 --browser-executable=<ruta a chrome-headless-shell>
npx remotion still Thumbnail out/miniatura.png --browser-executable=<ruta>
```

La voz se genera con Speko usando:
`{"text":"...","intent":{"language":"es"},"voice":"Adrian","constraints":{"allowedProviders":{"tts":["soniox"]}}}`
