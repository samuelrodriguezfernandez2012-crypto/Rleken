import {continueRender, delayRender, staticFile} from 'remotion';

// carga de fuentes locales antes de renderizar (una sola vez)
let done = false;
export const loadFonts = () => {
  if (done || typeof window === 'undefined') return;
  done = true;
  const handle = delayRender('fuentes');
  const faces = [
    new FontFace('Luckiest', `url(${staticFile('luckiest.woff2')})`),
    new FontFace('Baloo', `url(${staticFile('baloo800.woff2')})`, {weight: '800'}),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
