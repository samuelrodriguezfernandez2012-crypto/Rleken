import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {LW, CF, Cine, pop, kb} from '../futuro/kit';
import {CHAPTERS, WORDS, STARTS, TOTAL} from './chapters';
import {Hero, NPC, POSES, CityNight} from '../futuro/props';
import {Bridge, Bus} from './props';

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
const KEY = /\d|monstruo|fuerte|héroe|puente|niños|madre|marcos|nadie|miedo/i;
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

export const FuerteLargo: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let ci = 0;
  STARTS.forEach((s, i) => { if (t >= s - 0.3) ci = i; });
  const C = CHAPTERS[ci];
  return (
    <AbsoluteFill style={{background: '#0B0A1A', overflow: 'hidden'}}>
      <Audio src={staticFile('fuerte/mezcla.wav')} />
      <C t={t} />
      <Captions t={t} />
    </AbsoluteFill>
  );
};

// miniatura en ingles 1280x720
export const FuerteThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(0.6667)', transformOrigin: '0 0', width: 1920, height: 1080}}>
        <Cine t={0.5} mood="night" cam={kb(0, 1.25, 1.25, 1, 1150, 560)} rain bg={<Bridge t={0} crack={1} bus={false} />} hero={<>
          <rect x={960} y={500} width={980} height={70} fill="#7D7F8C" stroke="#111" strokeWidth={6} />
          <Bus x={1250} y={502} s={0.75} />
          <Hero x={1030} y={900} s={1.1} t={0} pose={POSES.armsUp} eyes="angry" mouth="teeth" sweat glow />
        </>} />
        <AbsoluteFill style={{background: 'radial-gradient(circle at 62% 62%, rgba(255,200,80,0.35) 0%, transparent 25%)'}} />
        <div style={{position: 'absolute', left: 70, top: 60, fontFamily: CF, fontWeight: 900, fontSize: 170, lineHeight: 0.92, letterSpacing: -5, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>
          <div style={{color: '#fff'}}>100x</div>
          <div style={{color: '#FFD23F'}}>STRONGER</div>
        </div>
        <div style={{position: 'absolute', left: 80, bottom: 70, fontFamily: CF, fontWeight: 900, fontSize: 70, color: '#fff', textShadow: '0 6px 30px rgba(0,0,0,0.9)', lineHeight: 1}}>
          <div>THEY CALLED ME</div>
          <div style={{color: '#FF4D6D', fontSize: 110}}>A MONSTER.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
