import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SvgDefs} from '../../Stickman';
import {pop, ramp, easeOut, rnd} from '../../fx';
import wordsJson from './words.json';
import startsJson from '../../../assets/futuro/starts.json';

export const LW = 1920, LH = 1080, GY = 900;
export type Word = {text: string; start_ms: number; end_ms: number};
export const WORDS = wordsJson as Word[];
export const STARTS = (startsJson as {i: number; start: number}[]).map((s) => s.start);
export const TOTAL = WORDS[WORDS.length - 1].end_ms / 1000;
export const CF = 'Montserrat, sans-serif';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
const chOf = (ms: number) => {
  let c = 0;
  STARTS.forEach((s, i) => { if (ms / 1000 >= s - 0.3) c = i; });
  return c;
};
const BY: Word[][] = STARTS.map(() => []);
WORDS.forEach((w) => BY[chOf(w.start_ms)].push(w));
/** instante de la n-esima aparicion de una palabra en el capitulo c */
export const W = (c: number, word: string, n = 1): number => {
  const k = norm(word);
  let i = 0;
  for (const w of BY[c]) if (norm(w.text) === k && ++i === n) return w.start_ms / 1000;
  throw new Error(`palabra no encontrada: ${c} ${word} ${n}`);
};
export const CS = (c: number) => STARTS[c];
export const CE = (c: number) => (c + 1 < STARTS.length ? STARTS[c + 1] : TOTAL + 4);

export function shots(t: number, list: [number, (lt: number) => React.ReactNode][]) {
  let idx = 0;
  for (let i = 0; i < list.length; i++) if (t >= list[i][0]) idx = i;
  return list[idx][1](t - list[idx][0]);
}

type Cam = {s?: number; ox?: number; oy?: number; x?: number; y?: number};
const camStyle = ({s = 1, ox = LW / 2, oy = LH / 2, x = 0, y = 0}: Cam): React.CSSProperties => ({transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: `${ox}px ${oy}px`});

const Layer: React.FC<{cam: Cam; filter?: string; children: React.ReactNode}> = ({cam, filter, children}) => (
  <AbsoluteFill style={{...camStyle(cam), filter}}>
    <svg width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
      <SvgDefs />
      {children}
    </svg>
  </AbsoluteFill>
);

export type Mood = 'night' | 'dusk' | 'day' | 'cold' | 'red' | 'future';
const GRADE: Record<Mood, {tint: string; light: string; lx: number; ly: number; bg: string}> = {
  night: {tint: 'rgba(30,20,90,0.45)', light: 'rgba(255,190,120,0.35)', lx: 70, ly: 30, bg: 'brightness(0.62) saturate(0.85)'},
  dusk: {tint: 'rgba(120,40,90,0.30)', light: 'rgba(255,170,90,0.45)', lx: 80, ly: 25, bg: 'brightness(0.8) saturate(0.95)'},
  day: {tint: 'rgba(60,80,140,0.14)', light: 'rgba(255,240,200,0.35)', lx: 75, ly: 15, bg: 'brightness(0.95) saturate(0.85)'},
  cold: {tint: 'rgba(20,60,110,0.40)', light: 'rgba(150,210,255,0.35)', lx: 30, ly: 20, bg: 'brightness(0.7) saturate(0.6)'},
  red: {tint: 'rgba(120,0,30,0.40)', light: 'rgba(255,80,80,0.35)', lx: 50, ly: 40, bg: 'brightness(0.6) saturate(0.9)'},
  future: {tint: 'rgba(0,160,200,0.30)', light: 'rgba(120,255,255,0.35)', lx: 50, ly: 50, bg: 'brightness(0.75) saturate(0.4) hue-rotate(150deg)'},
};

/** escena cinematica: fondo desenfocado + medio + personajes nitidos + luz, particulas y viñeta */
export const Cine: React.FC<{t: number; mood?: Mood; cam?: Cam; bg?: React.ReactNode; mid?: React.ReactNode; hero?: React.ReactNode; fx?: React.ReactNode; blur?: number; dust?: boolean; rain?: boolean}> = ({
  t, mood = 'night', cam = {}, bg, mid, hero, fx, blur = 5, dust = true, rain,
}) => {
  const g = GRADE[mood];
  const bgCam = {...cam, s: 1 + ((cam.s ?? 1) - 1) * 0.6};
  return (
    <AbsoluteFill style={{background: '#0B0A1A', overflow: 'hidden'}}>
      {bg && <Layer cam={bgCam} filter={`blur(${blur}px) ${g.bg}`}>{bg}</Layer>}
      <AbsoluteFill style={{background: g.tint}} />
      {mid && <Layer cam={cam} filter={`blur(${Math.max(0, blur - 3.5)}px) brightness(0.85)`}>{mid}</Layer>}
      <AbsoluteFill style={{background: `radial-gradient(circle at ${g.lx}% ${g.ly}%, ${g.light} 0%, transparent 45%)`}} />
      {hero && <Layer cam={cam} filter="drop-shadow(0 0 1px rgba(0,0,0,0.4)) drop-shadow(-5px -3px 0 rgba(160,190,255,0.55))">{hero}</Layer>}
      {fx && <Layer cam={cam}>{fx}</Layer>}
      {dust && <Motes t={t} />}
      {rain && <RainFine t={t} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Motes: React.FC<{t: number; n?: number}> = ({t, n = 34}) => (
  <svg width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: n}).map((_, i) => (
      <circle key={i} cx={(rnd(i) * LW + t * (8 + rnd(i + 3) * 14)) % LW} cy={(rnd(i + 5) * LH - t * (4 + rnd(i + 1) * 8) + LH * 4) % LH} r={1.5 + rnd(i + 2) * 3} fill="#FFF3D6" opacity={0.18 + 0.25 * Math.abs(Math.sin(t * 0.7 + i))} />
    ))}
  </svg>
);
export const RainFine: React.FC<{t: number}> = ({t}) => (
  <svg width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 110}).map((_, i) => <rect key={i} x={(rnd(i + 11) * LW - t * 120) % LW + (rnd(i + 11) * LW - t * 120 < 0 ? LW : 0)} y={(rnd(i + 13) * LH + t * (900 + rnd(i) * 400)) % LH} width={2} height={14} fill="#fff" opacity={0.2 + rnd(i) * 0.35} />)}
  </svg>
);

/** efecto de "estoy viendo el futuro": tinte cian, lineas, marco y contador */
export const FutureFX: React.FC<{t: number; at: number; until: number; label?: string}> = ({t, at, until, label = '+10 S'}) => {
  if (t < at || t > until) return null;
  const k = Math.min(easeOut(ramp(t, at, at + 0.25)), 1 - ramp(t, until - 0.2, until));
  return (
    <AbsoluteFill style={{opacity: k, pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'rgba(0,200,255,0.16)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(150,255,255,0.07) 0px, rgba(150,255,255,0.07) 2px, transparent 2px, transparent 6px)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 160px rgba(80,240,255,0.65)', border: '6px solid rgba(140,255,255,0.6)'}} />
      <div style={{position: 'absolute', right: 60, top: 50, fontFamily: CF, fontWeight: 900, fontSize: 64, color: '#9FFCFF', textShadow: '0 0 24px rgba(0,230,255,0.9)', letterSpacing: 2}}>{label}</div>
    </AbsoluteFill>
  );
};

/** texto grande estilo cine (Montserrat, sombra suave) */
export const CText: React.FC<{t: number; at: number; until?: number; a: string; b?: string; x?: number; y?: number; size?: number; align?: 'left' | 'center'; color?: string; color2?: string}> = ({
  t, at, until = 1e9, a, b, x, y = 140, size = 130, align = 'center', color = '#fff', color2 = '#FFD23F',
}) => {
  if (t < at || t > until) return null;
  const k = easeOut(ramp(t, at, at + 0.3)) * (until < 1e9 ? 1 - ramp(t, until - 0.2, until) : 1);
  const left = align === 'left' ? (x ?? 90) : 0;
  return (
    <div style={{position: 'absolute', left, width: align === 'left' ? LW - left : LW, top: y, textAlign: align, opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.96 + 0.04 * k})`, fontFamily: CF, fontWeight: 900, fontSize: size, lineHeight: 1.0, letterSpacing: -2, textShadow: '0 6px 34px rgba(0,0,0,0.75)'}}>
      <div style={{color}}>{a}</div>
      {b && <div style={{color: color2}}>{b}</div>}
    </div>
  );
};

/** rotulo de capitulo: "DÍA 1" */
export const DayTag: React.FC<{t: number; at: number; text: string}> = ({t, at, text}) => {
  if (t < at || t > at + 3.2) return null;
  const k = Math.min(easeOut(ramp(t, at, at + 0.4)), 1 - ramp(t, at + 2.6, at + 3.2));
  return (
    <div style={{position: 'absolute', left: 90, top: 80, opacity: k, fontFamily: CF, fontWeight: 800, fontSize: 46, color: '#fff', letterSpacing: 10, textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
      <div style={{width: 80 * k, height: 5, background: '#FFD23F', marginBottom: 14}} />
      {text}
    </div>
  );
};

export const Flash: React.FC<{t: number; at: number; dur?: number; color?: string; max?: number}> = ({t, at, dur = 0.25, color = '#fff', max = 0.9}) =>
  t >= at && t < at + dur ? <AbsoluteFill style={{background: color, opacity: max * (1 - (t - at) / dur)}} /> : null;

export const kb = (lt: number, s0: number, s1: number, dur = 6, ox = LW / 2, oy = LH / 2, dx = 0): Cam => ({s: s0 + (s1 - s0) * Math.min(1, lt / dur), ox, oy, x: dx * Math.min(1, lt / dur)});
export {pop, ramp, easeOut, rnd};
