import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {LW, LH, WORDS, Word, STARTS, TOTAL, CF, Cine, pop, kb} from './kit';
import {CHAPTERS} from './chapters';
import {Hero, Vera, POSES, CityNight, Clock2} from './props';

export const DURATION_S = Math.ceil(TOTAL + 3);

// subtitulos karaoke limpios (Montserrat, max 5 palabras)
const groups: Word[][] = [];
{
  let cur: Word[] = [];
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
const KEY = /\d|futuro|segundo|vera|nunca|siempre|ella|poder|sangr|central|luces|suelta|tú$/i;
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
  const enter = pop(t, g[0].start_ms / 1000 - 0.06, 12, 260);
  return (
    <div style={{position: 'absolute', left: 140, width: LW - 280, top: 960, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', transform: `translateY(-50%) scale(${0.94 + 0.06 * enter})`}}>
      {g.map((w, i) => {
        const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
        const said = ms >= w.start_ms;
        return (
          <span key={i} style={{fontFamily: CF, fontWeight: 800, fontSize: 58, lineHeight: 1.15, textTransform: 'uppercase', color: active ? (KEY.test(w.text) ? '#FF5C7A' : '#FFD23F') : said ? '#fff' : 'rgba(255,255,255,0.55)', textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 3px #000', display: 'inline-block', transform: `scale(${active ? 1 + 0.08 * pop(t, w.start_ms / 1000, 8, 300) : 1})`}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const FuturoLargo: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let ci = 0;
  STARTS.forEach((s, i) => { if (t >= s - 0.3) ci = i; });
  const C = CHAPTERS[ci];
  return (
    <AbsoluteFill style={{background: '#0B0A1A', overflow: 'hidden'}}>
      <Audio src={staticFile('futuro/mezcla.wav')} />
      <C t={t} />
      <Captions t={t} />
    </AbsoluteFill>
  );
};

// miniatura en ingles 1280x720
export const FuturoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(0.6667)', transformOrigin: '0 0', width: 1920, height: 1080}}>
        <Cine t={0.5} mood="night" cam={kb(0, 1, 1)} rain bg={<CityNight />} hero={<>
          <Clock2 x={1000} y={540} r={130} sec={50} />
          <Hero x={560} y={1500} s={2.4} t={0} eyes="glow" mouth="flat" pose={POSES.fists} />
          <Vera x={1500} y={1500} s={2.4} t={0} eyes="evil" mouth="grin" flip />
        </>} />
        <AbsoluteFill style={{background: 'radial-gradient(circle at 29% 40%, rgba(80,240,255,0.35) 0%, transparent 22%), radial-gradient(circle at 78% 40%, rgba(200,80,255,0.35) 0%, transparent 22%)'}} />
        <div style={{position: 'absolute', left: 70, top: 50, fontFamily: CF, fontWeight: 900, fontSize: 150, lineHeight: 0.95, letterSpacing: -4, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>
          <div style={{color: '#fff'}}>I SEE 10 SECONDS</div>
          <div style={{color: '#FFD23F'}}>INTO THE FUTURE.</div>
        </div>
        <div style={{position: 'absolute', right: 70, bottom: 60, fontFamily: CF, fontWeight: 900, fontSize: 96, color: '#E0AAFF', textShadow: '0 6px 30px rgba(0,0,0,0.9)', transform: 'rotate(-3deg)'}}>SHE SEES 11.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export {LH};
