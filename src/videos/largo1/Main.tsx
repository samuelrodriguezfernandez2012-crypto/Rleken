import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {CHAPTERS, CS} from './kit';
import {Hud, setHud, cardFor, Card} from './scene';
import {LCaptions} from './captions';
import {Ch0, Ch1, Ch2, Ch3} from './ch0to3';
import {CH_REST} from './rest';
import {HUD_DAYS, HUD_AGES} from './hud';

export const DURATION_S = Math.ceil(CHAPTERS[CHAPTERS.length - 1].start + CHAPTERS[CHAPTERS.length - 1].dur + 4);
setHud(HUD_DAYS, HUD_AGES);

const CH: React.FC<{t: number}>[] = [Ch0, Ch1, Ch2, Ch3, ...CH_REST];

export const Largo1: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  const card = cardFor(t);
  let ci = 0;
  for (const c of CHAPTERS) if (t >= c.start - 0.001) ci = c.i;
  const C = CH[ci];
  const hudOn = !card && ci >= 1 && ci <= 11;
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Audio src={staticFile('largo1/mezcla.wav')} />
      {card ? <Card t={t} text={card.text} k={card.k} /> : <C t={t} />}
      {hudOn && <Hud t={t} />}
      <LCaptions t={t} hidden={!!card} />
    </AbsoluteFill>
  );
};
export {CS};
