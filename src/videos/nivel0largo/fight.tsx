import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {GY, rnd} from '../futuro/kit';

// ---------- utilidades de tiempo (Remotion interpolate + Easing, como recomiendan las skills) ----------
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lerpT = (t: number, a: number, b: number, from: number, to: number, ease = Easing.linear) =>
  interpolate(t, [a, b], [from, to], {...C, easing: ease});
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const SPRING = Easing.spring({damping: 12, mass: 0.8, stiffness: 180});
/** pausa en el golpe: el tiempo se congela `hold` segundos justo tras el impacto */
export const hitStop = (t: number, impact: number, hold = 0.12) => (t < impact ? t : t < impact + hold ? impact : t - hold);

// ---------- efectos ----------
/** fotograma de impacto: imagen en negativo alto contraste durante 2-3 frames */
export const impactFilter = (t: number, hits: number[], dur = 0.08) =>
  hits.some((h) => t >= h && t < h + dur) ? 'grayscale(1) contrast(5) invert(1)' : hits.some((h) => t >= h + dur && t < h + dur * 2) ? 'contrast(1.6) saturate(1.6) brightness(1.3)' : undefined;

export const Shockwave: React.FC<{x: number; y: number; t: number; at: number; max?: number; color?: string; dur?: number}> = ({x, y, t, at, max = 700, color = '#fff', dur = 0.7}) => {
  if (t < at || t > at + dur) return null;
  const k = lerpT(t, at, at + dur, 0, 1, EASE_OUT);
  return (
    <g opacity={1 - k}>
      <ellipse cx={x} cy={y} rx={max * k} ry={max * k * 0.32} fill="none" stroke={color} strokeWidth={26 * (1 - k) + 2} />
      <ellipse cx={x} cy={y} rx={max * 0.7 * k} ry={max * 0.7 * k * 0.32} fill="none" stroke={color} strokeWidth={10 * (1 - k) + 1} opacity={0.6} />
      <circle cx={x} cy={y - 120} r={max * 0.55 * k} fill={color} opacity={0.18 * (1 - k)} />
    </g>
  );
};
/** lineas de velocidad radiales estilo anime alrededor del golpe */
export const SpeedBurst: React.FC<{x: number; y: number; t: number; at: number; dur?: number; n?: number; color?: string}> = ({x, y, t, at, dur = 0.45, n = 26, color = '#fff'}) => {
  if (t < at || t > at + dur) return null;
  const k = lerpT(t, at, at + dur, 0, 1);
  return (
    <g opacity={1 - k}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i) * 0.2, r0 = 160 + rnd(i + 3) * 80 + k * 200, r1 = r0 + 260 + rnd(i + 5) * 340;
        return <path key={i} d={`M ${x + Math.cos(a) * r0} ${y + Math.sin(a) * r0} L ${x + Math.cos(a + 0.025) * r1} ${y + Math.sin(a + 0.025) * r1} L ${x + Math.cos(a - 0.025) * r1} ${y + Math.sin(a - 0.025) * r1} Z`} fill={color} />;
      })}
    </g>
  );
};
/** escombros que saltan con gravedad */
export const Debris: React.FC<{x: number; y?: number; t: number; at: number; n?: number; power?: number; color?: string}> = ({x, y = GY, t, at, n = 18, power = 1, color = '#4A4045'}) => {
  if (t < at || t > at + 2.2) return null;
  const s = t - at;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const vx = (rnd(i) - 0.5) * 1400 * power, vy = -(400 + rnd(i + 2) * 900) * power, g = 2200;
        const px = x + vx * s, py = Math.min(y + 30, y + vy * s + 0.5 * g * s * s), sz = 10 + rnd(i + 4) * 26;
        return <rect key={i} x={px - sz / 2} y={py - sz / 2} width={sz} height={sz * 0.7} fill={i % 3 ? color : '#7A6F66'} stroke="#111" strokeWidth={3} transform={`rotate(${s * 600 * (rnd(i + 6) - 0.5)} ${px} ${py})`} opacity={1 - Math.max(0, s - 1.6) / 0.6} />;
      })}
    </g>
  );
};
/** aura de energia que crepita alrededor de un cuerpo */
export const Aura: React.FC<{x: number; y?: number; s?: number; t: number; k?: number; color?: string}> = ({x, y = GY, s = 1.3, t, k = 1, color = '#FF2244'}) => {
  if (k <= 0.01) return null;
  const n = 18, cy = y - 200 * s;
  const pts = Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2, r = (150 + 45 * Math.abs(Math.sin(t * 9 + i * 1.7))) * s * Math.min(1.2, k);
    return `${x + Math.cos(a) * r * 0.62},${cy + Math.sin(a) * r * 1.25}`;
  }).join(' ');
  return (
    <g>
      <polygon points={pts} fill={color} opacity={0.14 * Math.min(1, k)} filter="url(#blurGlow)" />
      <polygon points={pts} fill="none" stroke={color} strokeWidth={6} opacity={0.5 * k} strokeLinejoin="round" />
      {Array.from({length: 8}).map((_, i) => {
        const p = (t * 1.4 + i / 8) % 1;
        return <circle key={i} cx={x + (rnd(i) - 0.5) * 300 * s} cy={y - p * 520 * s} r={6 + rnd(i + 2) * 8} fill={color} opacity={(1 - p) * k} />;
      })}
    </g>
  );
};
/** zona cero alrededor del heroe: anillo gris que vibra cuando apaga un poder */
export const ZeroZone: React.FC<{x: number; y?: number; t: number; r?: number; hits?: number[]}> = ({x, y = GY - 220, t, r = 330, hits = []}) => {
  const last = hits.filter((h) => t >= h).pop();
  const flash = last != null ? Math.max(0, 1 - (t - last) / 0.5) : 0;
  return (
    <g>
      <circle cx={x} cy={y} r={r * (1 + flash * 0.08)} fill="none" stroke="#C9D6DC" strokeWidth={3 + flash * 10} strokeDasharray="10 14" opacity={0.25 + flash * 0.6} transform={`rotate(${t * 20} ${x} ${y})`} />
      {flash > 0 && <circle cx={x} cy={y} r={r} fill="#E0F4FF" opacity={flash * 0.18} />}
    </g>
  );
};
/** bola de energia que viaja y se deshace al tocar la zona cero */
export const EnergyBall: React.FC<{x0: number; y0: number; x1: number; y1: number; t: number; at: number; dur?: number; color?: string}> = ({x0, y0, x1, y1, t, at, dur = 0.5, color = '#FF2244'}) => {
  if (t < at) return null;
  const k = lerpT(t, at, at + dur, 0, 1, EASE_IN), s = t - at - dur;
  const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k;
  if (s > 0) {
    if (s > 0.6) return null;
    const f = s / 0.6;
    return <g opacity={1 - f}>{Array.from({length: 10}).map((_, i) => { const a = rnd(i) * Math.PI * 2; return <circle key={i} cx={x1 + Math.cos(a) * 160 * f} cy={y1 + Math.sin(a) * 160 * f} r={10 * (1 - f) + 2} fill={color} />; })}</g>;
  }
  return (
    <g>
      {[0.12, 0.24, 0.36].map((d, i) => { const kk = Math.max(0, k - d); return <circle key={i} cx={x0 + (x1 - x0) * kk} cy={y0 + (y1 - y0) * kk} r={34 - i * 8} fill={color} opacity={0.35 - i * 0.1} />; })}
      <circle cx={x} cy={y} r={70} fill={color} opacity={0.35} filter="url(#blurGlow)" />
      <circle cx={x} cy={y} r={38} fill="#FFE0E6" stroke={color} strokeWidth={8} />
    </g>
  );
};
/** sacudida de camara con amortiguacion tras cada golpe */
export const quake = (t: number, hits: number[], amp = 26) => {
  let x = 0, y = 0;
  for (const h of hits) {
    const d = t - h;
    if (d >= 0 && d < 0.6) {
      const k = (1 - d / 0.6) ** 2;
      x += Math.sin(d * 90) * amp * k;
      y += Math.cos(d * 77) * amp * 0.6 * k;
    }
  }
  return {x, y};
};
export const ImpactOverlay: React.FC<{t: number; hits: number[]}> = ({t, hits}) => {
  const h = hits.find((x) => t >= x && t < x + 0.12);
  if (h == null) return null;
  return <AbsoluteFill style={{background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)', opacity: 1 - (t - h) / 0.12}} />;
};
