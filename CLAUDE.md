# Canal chiki (@chiki2225) — reglas para los Shorts nuevos

Shorts verticales 1080x1920, 40-75 s, animación stickman en español, hechos con Remotion.
Temas: "¿Qué pasaría si...?" y poderes imposibles, con peligro, escalada y giro final.

## Personaje (desde noviembre 2026)
- Usar **`StickmanV2`** (`src/StickmanV2.tsx`): cara seria, chaqueta azul ajustada, capucha bajada.
- **No tocar** `src/Stickman.tsx` ni los videos ya hechos (`src/videos/mentiras|reflejo|mentes|tierra`).
- Los personajes no hablan: solo bocadillos de texto. Sangre solo de dibujos.

## Gancho: los primeros 3 segundos (lo más importante)
El espectador tiene que quedar enganchado desde el primer fotograma:
1. **Frame 0 = acción en marcha.** Nada de intro ni presentación: explosión, caída, persecución o algo rompiéndose ya en pantalla, con golpe de sonido en el frame 0.
2. **Avance del clímax primero.** Enseñar 1 s del momento más loco del video (flash-forward) y luego cortar a "¿cómo he llegado aquí?" o similar.
3. **Primera frase de impacto de 1-1,5 s**: una amenaza, un dato brutal o una pregunta imposible ("Tienes 3 segundos antes de que...", "Esto te pasa ahora mismo y no lo sabes").
4. **Texto gigante antes del frame 6** (0,2 s) con el dato clave.
5. **Cortes muy rápidos en el gancho**: un cambio visual cada 0,5-0,8 s los primeros 3 s (zoom, flash, sacudida, cambio de plano).
6. **Bucle abierto**: dejar una promesa sin resolver ("y lo peor llegó al final...") que solo se cierra con el giro.
7. **Subtítulos karaoke desde el frame 0.**
8. Si se puede, **final que enlaza con el principio** para que el Short se repita en bucle.

## Resto del video
- Un cambio visual cada 1-2 s, textos grandes con los datos clave y escalada constante.
- Final con pregunta para comentarios + flecha hacia los comentarios.
- Voz Speko con este formato exacto:
  `{"text":"...","intent":{"language":"es"},"voice":"Adrian","constraints":{"allowedProviders":{"tts":["soniox"]}}}`
- Tiempos de cada palabra: `audio.transcribe` de Speko con `word_timestamps`.
- Música y efectos sintetizados por código (`scripts/audio.py`), sin copyright. Mezcla a -14 LUFS.

## Publicar
- Render: `scripts/final.sh <video> <Composicion> <Miniatura>`; revisar con `scripts/preview.sh`.
- Subir a Cloudinary (`sign-upload` + `scripts/upload.sh`) y programar en Metricool (blogId 7977063, Europe/Madrid, YouTube Short, categoría FILM_ANIMATION, `madeForKids: false`).
- La mejor hora suele ser el miércoles a las 16:00 (consultar `getBestTimeToPostByNetwork`).
- Entregar: MP4, miniatura, título, descripción, etiquetas y comentario para fijar (en `PUBLICAR.md`).

## Estilo nuevo (desde el 11 nov 2026): CINE
- Referencia: canal Ifverse ("What If Your Reaction Time Was 10x Faster?").
- Todo (Shorts y largos) con el kit de cine `src/videos/futuro/kit.tsx`: fondo desenfocado, luz suave, partículas, viñeta, letra Montserrat, subtítulos limpios.
- Los Shorts verticales reutilizan las escenas apaisadas dentro de un marco vertical (marco `V` en `src/videos/nivel0/Main.tsx`).
- Ideas con gancho fuerte: número que escala ("Día 1… Día 30"), protagonista débil que resulta ser el más peligroso, dilemas imposibles, un rival que siempre va un paso por delante.
- Cada idea: Short (50-60 s) + vídeo largo (8-10 min).
- Miniaturas de los vídeos largos: en INGLÉS.
- Nada de temas de "dato curioso" sin historia (el usuario los ha borrado por aburridos).
- No todos los vídeos necesitan personajes: si sale un personaje, es StickmanV2; pero también valen vídeos sin personas (espacio, planetas, mapas, objetos, animales, máquinas, datos visuales...).

## Formato favorito (desde el 13 nov 2026): CURIOSO QUE TE HACE PENSAR
- Lo que más le gusta: "Si paras el tiempo, mueres" y "11 días sin dormir". Informan y atraen a la vez.
- Fórmula: algo que parece genial o normal → datos REALES que lo dan la vuelta (paso a paso: 1, 2, 3… o Día 1… Día 11) → giro final inquietante → pregunta que haga pensar.
- Siempre ciencia o hechos reales, con algún dato concreto (cifras, fechas, casos reales).
- Se puede mezclar con más acción y tensión en el gancho, pero lo principal es que sea curioso.
- NO: finales tipo truco para niños ("no escribas X en los comentarios"), historias tontas de poderes sin ciencia (el de "mi nombre" no gustó), ni temas que solo describen sin sorprender (el de océanos no pareció curioso).
