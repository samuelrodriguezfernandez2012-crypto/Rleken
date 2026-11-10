import React from 'react';
import {AbsoluteFill} from 'remotion';
import {StickmanV2, BLUE, MouthV2} from '../../StickmanV2';
import {POSES, Pose, Eyes, SvgDefs, lerpPose} from '../../Stickman';
import {FONT, pop, ramp, easeOut, rnd, clamp} from '../../fx';
import wordsJson from './words.json';
import chaptersJson from './chapters.json';

export const LW = 1920, LH = 1080, GY = 900; // suelo
export type Word = {text: string; start_ms: number; end_ms: number};
export const WORDS = wordsJson as Word[];
export const CHAPTERS = chaptersJson as {i: number; start: number; dur: number}[];

// ---------- anclas por palabra ----------
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
const chapterOf = (ms: number) => {
  let c = 0;
  for (const ch of CHAPTERS) if (ms / 1000 >= ch.start - 0.05) c = ch.i;
  return c;
};
const BY_CH: Word[][] = CHAPTERS.map(() => []);
WORDS.forEach((w) => BY_CH[chapterOf(w.start_ms)].push(w));
/** instante (s) de la n-esima aparicion de una palabra dentro de un capitulo */
export const W = (ch: number, word: string, n = 1): number => {
  const key = norm(word);
  let k = 0;
  for (const w of BY_CH[ch]) {
    if (norm(w.text) === key && ++k === n) return w.start_ms / 1000;
  }
  throw new Error(`palabra no encontrada: ${ch} ${word} ${n}`);
};
export const CS = (ch: number) => CHAPTERS[ch].start;
export const CE = (ch: number) => CHAPTERS[ch].start + CHAPTERS[ch].dur;

// ---------- utilidades ----------
export const LWorld: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={LW} height={LH} style={{position: 'absolute', inset: 0, ...style}}>
    <SvgDefs />
    {children}
  </svg>
);

export const LCam: React.FC<{s?: number; ox?: number; oy?: number; x?: number; y?: number; r?: number; children: React.ReactNode; filter?: string}> = ({s = 1, ox = LW / 2, oy = LH / 2, x = 0, y = 0, r = 0, children, filter}) => (
  <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, transformOrigin: `${ox}px ${oy}px`, filter}}>{children}</AbsoluteFill>
);

export const FREEZE_FILTER = 'grayscale(0.75) brightness(1.05) sepia(0.25) hue-rotate(175deg) saturate(1.6)';

// texto grande apaisado
export const Big: React.FC<{t: number; at: number; until?: number; text: string; x?: number; y?: number; size?: number; color?: string; rotate?: number; wiggle?: boolean; w?: number}> = ({
  t, at, until = 1e9, text, x = LW / 2, y = 170, size = 120, color = '#FFE24A', rotate = -3, wiggle, w = 1700,
}) => {
  if (t < at || t > until) return null;
  const s = pop(t, at) * (until < 1e9 ? 1 - ramp(t, until - 0.15, until) : 1);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, textAlign: 'center', transform: `translateY(-50%) scale(${s}) rotate(${rotate + (wiggle ? Math.sin(t * 9) * 2.5 : 0)}deg)`, fontFamily: FONT, fontSize: size, lineHeight: 1.02, color, WebkitTextStroke: `${Math.round(size / 9)}px #111`, paintOrder: 'stroke fill', textShadow: `0 ${Math.round(size / 14)}px 0 #111`, whiteSpace: 'pre-line'}}>
      {text}
    </div>
  );
};

export const Bub: React.FC<{t: number; at: number; until?: number; text: string; x: number; y: number; w?: number; size?: number; shout?: boolean; color?: string; think?: boolean}> = ({t, at, until = 1e9, text, x, y, w = 480, size = 46, shout, color = '#fff', think}) => {
  if (t < at || t > until) return null;
  const s = pop(t, at, 10, 200) * (until < 1e9 ? 1 - ramp(t, until - 0.12, until) : 1);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translateY(-100%) scale(${s})`, transformOrigin: '50% 100%'}}>
      <div style={{background: color, border: '6px solid #111', borderRadius: think ? 999 : shout ? 16 : 40, padding: think ? '26px 36px' : '18px 24px', fontFamily: FONT, fontSize: size, lineHeight: 1.05, textAlign: 'center', color: '#111', boxShadow: '0 8px 0 #111'}}>{text}</div>
      {!think && (
        <svg width={60} height={46} style={{position: 'absolute', left: w / 2 - 30, top: '100%', marginTop: -7}}>
          <path d="M 10 0 L 30 44 L 50 0" fill={color} stroke="#111" strokeWidth={6} strokeLinejoin="round" />
          <rect x={0} y={-6} width={60} height={10} fill={color} />
        </svg>
      )}
      {think && (
        <svg width={80} height={70} style={{position: 'absolute', left: w / 2 - 40, top: '100%'}}>
          <circle cx={40} cy={18} r={14} fill={color} stroke="#111" strokeWidth={5} />
          <circle cx={30} cy={50} r={8} fill={color} stroke="#111" strokeWidth={4} />
        </svg>
      )}
    </div>
  );
};

export const LFlash: React.FC<{t: number; at: number; dur?: number; color?: string; max?: number}> = ({t, at, dur = 0.25, color = '#fff', max = 1}) =>
  t < at || t > at + dur ? null : <AbsoluteFill style={{background: color, opacity: max * (1 - (t - at) / dur)}} />;

export const shakeL = (t: number, list: [number, number, number][]) => {
  let x = 0, y = 0;
  for (const [at, dur, amp] of list) {
    if (t < at || t > at + dur) continue;
    const k = 1 - (t - at) / dur, f = (t - at) * 60;
    x += Math.sin(f * 1.7) * amp * k;
    y += Math.cos(f * 2.3) * amp * k;
  }
  return {x, y};
};

export const seqPose = (t: number, keys: [number, Pose][], dur = 0.25): Pose => {
  let p = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t >= keys[i][0]) p = lerpPose(p, keys[i][1], easeOut(ramp(t, keys[i][0], keys[i][0] + dur)));
  return p;
};
export function pick<T>(t: number, keys: [number, T][]): T {
  let v = keys[0][1];
  for (const [k, val] of keys) if (t >= k) v = val;
  return v;
}
export const blink = (t: number, o = 0) => ((t + o) * 1000) % 3700 < 110;

// ---------- heroe con marcas de edad ----------
export const AgeMarks: React.FC<{x: number; y: number; s: number; age: number; flip?: boolean; lean?: number}> = ({x, y, s, age, flip, lean = 0}) => {
  if (age < 13) return null;
  const th = (-lean * Math.PI) / 180;
  const hx = x + (flip ? -1 : 1) * 158 * s * Math.sin(-th) * -1, hy = y - 150 * s - 158 * s * Math.cos(th);
  const hairs = Math.min(14, Math.floor((age - 12) / 2.5));
  return (
    <g transform={`translate(${hx} ${hy}) rotate(${(flip ? 1 : -1) * lean}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      {/* pelos blancos */}
      {Array.from({length: hairs}).map((_, i) => {
        const a = -2.4 + (i / Math.max(1, hairs - 1)) * 1.7 + (rnd(i) - 0.5) * 0.15;
        const x1 = Math.cos(a) * 34, y1 = Math.sin(a) * 34 + 2;
        return <path key={i} d={`M ${x1} ${y1} q ${Math.cos(a) * 6 + 3} ${Math.sin(a) * 6 - 6} ${Math.cos(a) * 12} ${Math.sin(a) * 12}`} stroke="#F2F2F2" strokeWidth={3.2} fill="none" strokeLinecap="round" />;
      })}
      {age >= 18 && (
        <g stroke="#9AA3AD" strokeWidth={2.2} fill="none" strokeLinecap="round">
          <path d="M -21 9 Q -13 13 -5 9" />
          <path d="M 5 9 Q 13 13 21 9" />
        </g>
      )}
      {age >= 28 && Array.from({length: 16}).map((_, i) => <circle key={i} cx={-20 + (i % 8) * 5.5} cy={26 + Math.floor(i / 8) * 5 + Math.abs((i % 8) - 3.5) * -0.8} r={1.4} fill="#8D96A0" />)}
      {age >= 38 && (
        <g stroke="#9AA3AD" strokeWidth={2} fill="none" strokeLinecap="round">
          <path d="M -16 -22 Q 0 -26 16 -22" />
          <path d="M -12 -28 Q 0 -31 12 -28" />
        </g>
      )}
      {age >= 52 && <path d="M -26 16 Q -24 44 0 46 Q 24 44 26 16 Q 14 30 0 28 Q -14 30 -26 16 Z" fill="#EDEDED" stroke="#111" strokeWidth={3} />}
    </g>
  );
};

export const Hero: React.FC<{x: number; y?: number; s?: number; pose?: Pose; eyes?: Eyes; mouth?: MouthV2; look?: number; flip?: boolean; age?: number; t?: number; rotate?: number; sweat?: boolean; glow?: boolean; cane?: boolean}> = ({
  x, y = GY, s = 1.2, pose = POSES.idle, eyes = 'normal', mouth = 'flat', look = 0, flip, age = 12, t = 0, rotate = 0, sweat, glow, cane,
}) => {
  const stoop = age >= 50 ? {...pose, lean: (pose.lean ?? 0) + (flip ? -8 : 8)} : pose;
  const col = age >= 45 ? '#3D6FB8' : BLUE;
  return (
    <g>
      {glow && <circle cx={x} cy={y - 180 * s} r={230 * s} fill="#FFE24A" opacity={0.25 + 0.1 * Math.sin(t * 6)} filter="url(#blurGlow)" />}
      <ellipse cx={x} cy={y + 4} rx={95 * s} ry={14 * s} fill="#000" opacity={0.22} />
      {cane && <line x1={x + (flip ? -70 : 70) * s} y1={y} x2={x + (flip ? -60 : 60) * s} y2={y - 150 * s} stroke="#6B4226" strokeWidth={9 * s} strokeLinecap="round" />}
      <StickmanV2 x={x} y={y} scale={s} color={col} pose={stoop} eyes={eyes} mouth={mouth} look={look} flip={flip} blink={eyes !== 'closed' && blink(t, x / 500)} rotate={rotate} sweat={sweat} />
      {rotate === 0 && (stoop.head ?? 0) === 0 && <AgeMarks x={x} y={y} s={s} age={age} flip={flip} lean={stoop.lean ?? 0} />}
    </g>
  );
};

// personaje secundario (mismo estilo que el heroe)
export const NPC: React.FC<{x: number; y?: number; s?: number; color: string; pose?: Pose; eyes?: Eyes; mouth?: MouthV2; look?: number; flip?: boolean; t?: number; hairBun?: boolean; rotate?: number}> = ({
  x, y = GY, s = 1.2, color, pose = POSES.idle, eyes = 'normal', mouth = 'flat', look = 0, flip, t = 0, hairBun, rotate = 0,
}) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx={90 * s} ry={13 * s} fill="#000" opacity={0.2} />
    {hairBun && <circle cx={x + (flip ? 12 : -12) * s} cy={y - 352 * s} r={20 * s} fill="#E9E9E9" stroke="#111" strokeWidth={5} />}
    <StickmanV2 x={x} y={y} scale={s} color={color} pose={pose} eyes={eyes} mouth={mouth} look={look} flip={flip} blink={blink(t, x / 300)} rotate={rotate} />
    {hairBun && <path d={`M ${x - 32 * s} ${y - 318 * s} Q ${x} ${y - 352 * s} ${x + 32 * s} ${y - 318 * s}`} stroke="#E9E9E9" strokeWidth={10 * s} fill="none" strokeLinecap="round" />}
  </g>
);

export {POSES, FONT, pop, ramp, easeOut, rnd, clamp, lerpPose};
export type {Pose};
