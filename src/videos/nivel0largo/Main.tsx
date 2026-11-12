import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {LW, CF, Cine, pop, kb} from '../futuro/kit';
import {CHAPTERS, WORDS, STARTS, TOTAL, Lvl} from './chapters';
import {Hero, NPC, POSES, CityNight} from '../futuro/props';


export const DURATION_S = Math.ceil(TOTAL + 3);

const groups: (typeof WORDS)[] = [];
{
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= 5 || (prev && (w.start_ms - prev.end_ms > 300 || /[.,:!?…]$/.test(prev.text)))) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (i === WORDS.length - 1) groups.push(cur);
  });
}
const KEY = /\d|cero|nivel|vórtice|poder|dani|miedo|interruptor|arma/i;
const Captions: React.FC<{t: number}> = ({t}) => {
  const ms = t * 1000;
  let gi = -1;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const end = i + 1 < groups.length ? Math.min(groups[i + 1][0].start_ms, g[g.length - 1].end_ms + 800) : g[g.length - 1].end_ms + 800;
    if (ms >= g[0].start_ms - 60 && ms < end) gi = i;
  }
  if (gi < 0) return null;
  const g = groups[gi];
  return (
    <div style={{position: 'absolute', left: 140, width: LW - 280, top: 960, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', transform: `translateY(-50%) scale(${0.94 + 0.06 * pop(t, g[0].start_ms / 1000 - 0.06, 12, 260)})`}}>
      {g.map((w, i) => {
        const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
        return <span key={i} style={{fontFamily: CF, fontWeight: 800, fontSize: 58, lineHeight: 1.15, textTransform: 'uppercase', color: active ? (KEY.test(w.text) ? '#FF5C7A' : '#FFD23F') : ms >= w.start_ms ? '#fff' : 'rgba(255,255,255,0.55)', textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 3px #000', display: 'inline-block', transform: `scale(${active ? 1 + 0.08 * pop(t, w.start_ms / 1000, 8, 300) : 1})`}}>{w.text}</span>;
      })}
    </div>
  );
};

export const Nivel0Largo: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let ci = 0;
  STARTS.forEach((s, i) => { if (t >= s - 0.3) ci = i; });
  const C = CHAPTERS[ci];
  return (
    <AbsoluteFill style={{background: '#0B0A1A', overflow: 'hidden'}}>
      <Audio src={staticFile('nivel0largo/mezcla.wav')} />
      <C t={t} />
      <Captions t={t} />
    </AbsoluteFill>
  );
};

// miniatura en ingles 1280x720
export const Nivel0LargoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(0.6667)', transformOrigin: '0 0', width: 1920, height: 1080}}>
        <Cine t={0.5} mood="red" cam={kb(0, 1.35, 1.35, 1, 1000, 620)} rain bg={<CityNight />} hero={<>
          <Hero x={820} s={1.15} t={0} eyes="normal" mouth="flat" />
          <Lvl x={820} s={1.15} n={0} t={0} />
          <NPC x={1120} s={1.35} t={0} color="#C1121F" pose={POSES.push} eyes="wide" mouth="o" flip />
          <Lvl x={1120} s={1.35} n={99} t={0} />
        </>} />
        <div style={{position: 'absolute', left: 60, top: 50, fontFamily: CF, fontWeight: 900, fontSize: 130, lineHeight: 0.95, letterSpacing: -4, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>
          <div style={{color: '#fff'}}>MY POWER</div>
          <div style={{color: '#FFD23F'}}>LEVEL IS 0.</div>
        </div>
        <div style={{position: 'absolute', right: 60, bottom: 60, fontFamily: CF, fontWeight: 900, fontSize: 84, color: '#FF4D6D', textShadow: '0 6px 30px rgba(0,0,0,0.9)', transform: 'rotate(-3deg)', textAlign: 'right', lineHeight: 1}}>IT WAS NEVER<br/>ZERO. ∞</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
