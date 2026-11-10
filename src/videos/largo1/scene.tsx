import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LW, LH, LWorld, LCam, FREEZE_FILTER, CHAPTERS, CS, FONT, ramp, rnd, pop, easeOut} from './kit';

type CamP = {s?: number; ox?: number; oy?: number; x?: number; y?: number; r?: number};

// escena por capas: fondo + secundarios (se congelan) y heroe encima (siempre en color)
export const Scene: React.FC<{t: number; frozen?: boolean; cam?: CamP; bg?: React.ReactNode; npc?: React.ReactNode; hero?: React.ReactNode; fx?: React.ReactNode; dust?: boolean}> = ({t, frozen, cam = {}, bg, npc, hero, fx, dust = true}) => (
  <AbsoluteFill>
    <LCam {...cam} filter={frozen ? FREEZE_FILTER : undefined}>
      <LWorld>
        {bg}
        {npc}
      </LWorld>
    </LCam>
    <LCam {...cam}>
      <LWorld>
        {hero}
        {fx}
      </LWorld>
    </LCam>
    {frozen && dust && <FrozenDust t={t} />}
    {frozen && <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(120,200,255,0.55)', pointerEvents: 'none'}} />}
  </AbsoluteFill>
);

export const FrozenDust: React.FC<{t: number}> = ({t}) => (
  <svg width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 40}).map((_, i) => (
      <circle key={i} cx={rnd(i) * LW + Math.sin(t * 0.3 + i) * 6} cy={rnd(i + 4) * LH + Math.cos(t * 0.3 + i) * 6} r={2 + rnd(i + 2) * 3} fill="#E0F4FF" opacity={0.7} />
    ))}
  </svg>
);

// eleccion de plano por anclas: [inicio, componente]
export function shots(t: number, list: [number, (lt: number) => React.ReactNode][]) {
  let idx = 0;
  for (let i = 0; i < list.length; i++) if (t >= list[i][0]) idx = i;
  return list[idx][1](t - list[idx][0]);
}

// ---------- contador de dia y edad ----------
const DAYS: [number, number][] = [];
const AGES: [number, number][] = [];
export const setHud = (days: [number, number][], ages: [number, number][]) => {
  DAYS.push(...days);
  AGES.push(...ages);
};
const interp = (keys: [number, number][], t: number) => {
  if (!keys.length) return 0;
  const k = [...keys].sort((a, b) => a[0] - b[0]);
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (t < k[i][0]) {
      const [t0, v0] = k[i - 1], [t1, v1] = k[i];
      // los saltos marcados con el mismo instante son instantaneos
      return v0 + (v1 - v0) * Math.min(1, (t - t0) / Math.max(0.001, t1 - t0)) * (v1 < v0 && i > 0 ? 1 : 1);
    }
  }
  return k[k.length - 1][1];
};
export const dayAt = (t: number) => Math.round(interp(DAYS, t));
export const ageAt = (t: number) => Math.round(interp(AGES, t));

export const Hud: React.FC<{t: number}> = ({t}) => {
  const d = dayAt(t), a = ageAt(t);
  const warn = a >= 30;
  return (
    <div style={{position: 'absolute', left: 36, top: 30, display: 'flex', gap: 18, alignItems: 'center'}}>
      <div style={{background: '#111', borderRadius: 18, padding: '10px 18px', border: '5px solid #fff', fontFamily: FONT, color: '#FFE24A', fontSize: 40, minWidth: 210}}>
        DÍA {d}
        <span style={{color: '#fff', fontSize: 26}}>/100</span>
        <div style={{height: 10, background: '#333', borderRadius: 5, marginTop: 6}}>
          <div style={{height: 10, width: `${Math.min(100, d)}%`, background: d > 90 ? '#FF3B5C' : '#FFE24A', borderRadius: 5}} />
        </div>
      </div>
      <div style={{background: warn ? '#9A031E' : '#111', borderRadius: 18, padding: '10px 18px', border: '5px solid #fff', fontFamily: FONT, color: '#fff', fontSize: 34}}>
        EDAD REAL: <span style={{color: warn ? '#FFE24A' : '#6EF0FF', fontSize: 42}}>{a}</span>
      </div>
    </div>
  );
};

// tarjeta entre capitulos
const CARDS: Record<number, string> = {1: 'DÍA 1', 2: 'DÍAS 2-9', 3: 'DÍA 10', 4: 'DÍA 15', 5: 'DÍAS 20-40', 6: 'DÍA 45', 7: 'DÍAS 50-60', 8: 'LAS REGLAS', 9: 'DÍAS 70-95', 10: 'DÍA 100', 12: 'DÍA 0'};
export const cardFor = (t: number): {text: string; k: number} | null => {
  for (const c of CHAPTERS) {
    const txt = CARDS[c.i];
    if (!txt) continue;
    const s = CS(c.i);
    if (t >= s - 2.3 && t < s) return {text: txt, k: (t - (s - 2.3)) / 2.3};
  }
  return null;
};

export const Card: React.FC<{t: number; text: string; k: number}> = ({t, text, k}) => {
  const s = pop(t, t - k * 2.3 + 0.15, 8, 160);
  return (
    <AbsoluteFill style={{background: '#0B1026', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${LW / 2} ${LH / 2})`}>
          {Array.from({length: 60}).map((_, i) => (
            <line key={i} x1={0} y1={-330} x2={0} y2={i % 5 ? -305 : -280} stroke="#FFE24A" strokeWidth={i % 5 ? 4 : 9} transform={`rotate(${i * 6})`} opacity={0.7} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-270} stroke="#FF3B5C" strokeWidth={10} strokeLinecap="round" transform={`rotate(${k * 720})`} />
        </g>
      </svg>
      <div style={{fontFamily: FONT, fontSize: 190, color: '#FFE24A', WebkitTextStroke: '20px #111', paintOrder: 'stroke fill', textShadow: '0 14px 0 #111', transform: `scale(${s * (1 + 0.04 * easeOut(ramp(k, 0, 1)))}) rotate(-3deg)`, opacity: 1 - ramp(k, 0.88, 1)}}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
