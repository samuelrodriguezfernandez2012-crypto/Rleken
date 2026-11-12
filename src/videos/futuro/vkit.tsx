import React from 'react';
import {AbsoluteFill} from 'remotion';
import {W as VW, H as VH} from '../../fx';
import {LW, GY, CF, pop, ramp, easeOut, rnd} from './kit';

// ---------- marco vertical: la escena apaisada llena 1080x1920, centrada en fx ----------
export const V: React.FC<{fx?: number; children: React.ReactNode}> = ({fx = 960, children}) => {
  const s = VH / 1080;
  const left = Math.min(0, Math.max(VW - LW * s, VW / 2 - fx * s));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0B0A1A'}}>
      <div style={{position: 'absolute', left, top: 0, width: LW, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>{children}</div>
    </AbsoluteFill>
  );
};

// ---------- texto grande vertical ----------
export const VBig: React.FC<{t: number; at: number; until?: number; a: string; b?: string; y?: number; size?: number; color?: string; color2?: string}> = ({t, at, until = 1e9, a, b, y = 170, size = 120, color = '#fff', color2 = '#FFD23F'}) => {
  if (t < at || t > until) return null;
  const k = easeOut(ramp(t, at, at + 0.15)) * (until < 1e9 ? 1 - ramp(t, until - 0.12, until) : 1);
  return (
    <div style={{position: 'absolute', left: 40, width: VW - 80, top: y, textAlign: 'center', opacity: k, transform: `scale(${1.15 - 0.15 * k})`, fontFamily: CF, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: -2, textShadow: '0 6px 34px rgba(0,0,0,0.85)'}}>
      <div style={{color}}>{a}</div>
      {b && <div style={{color: color2}}>{b}</div>}
    </div>
  );
};

// ---------- subtitulos verticales limpios ----------
type Wd = {text: string; start_ms: number; end_ms: number};
export const makeCaps = (words: Wd[], KEY: RegExp) => {
  const groups: Wd[][] = [];
  let cur: Wd[] = [];
  words.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= 3 || (prev && (w.start_ms - prev.end_ms > 300 || /[.,:!?…]$/.test(prev.text)))) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (i === words.length - 1) groups.push(cur);
  });
  const Caps: React.FC<{t: number}> = ({t}) => {
    const ms = t * 1000;
    let gi = -1;
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      const end = i + 1 < groups.length ? Math.min(groups[i + 1][0].start_ms, g[g.length - 1].end_ms + 700) : g[g.length - 1].end_ms + 700;
      if (ms >= g[0].start_ms - 60 && ms < end) gi = i;
    }
    if (gi < 0) return null;
    const g = groups[gi];
    return (
      <div style={{position: 'absolute', left: 60, width: VW - 120, top: 1360, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px', transform: `scale(${0.92 + 0.08 * pop(t, g[0].start_ms / 1000 - 0.06, 12, 260)})`}}>
        {g.map((w, i) => {
          const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
          return <span key={i} style={{fontFamily: CF, fontWeight: 900, fontSize: 84, lineHeight: 1.1, textTransform: 'uppercase', color: active ? (KEY.test(w.text) ? '#FF5C7A' : '#FFD23F') : ms >= w.start_ms ? '#fff' : 'rgba(255,255,255,0.55)', textShadow: '0 5px 22px rgba(0,0,0,0.95), 0 0 4px #000', display: 'inline-block', transform: `scale(${active ? 1 + 0.1 * pop(t, w.start_ms / 1000, 8, 300) : 1})`}}>{w.text}</span>;
        })}
      </div>
    );
  };
  return Caps;
};

export type Shot = [number, (lt: number, t: number) => React.ReactNode];
export const pick = (t: number, list: Shot[]) => {
  let idx = 0;
  for (let i = 0; i < list.length; i++) if (t >= list[i][0]) idx = i;
  return list[idx][1](t - list[idx][0], t);
};

// ---------- espacio ----------
export const Stars: React.FC<{t: number; n?: number}> = ({t, n = 160}) => (
  <g>
    <rect width={LW} height={1080} fill="#05050F" />
    {Array.from({length: n}).map((_, i) => <circle key={i} cx={rnd(i) * LW} cy={rnd(i + 7) * 1080} r={0.8 + rnd(i + 3) * 2.2} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(t * 0.8 + i))} />)}
    <ellipse cx={1400} cy={300} rx={700} ry={180} fill="#3A2A7A" opacity={0.18} transform="rotate(-20 1400 300)" />
  </g>
);
export const Earth: React.FC<{x: number; y: number; r: number; t: number; cracks?: number; rings?: number; fire?: number; dry?: number; mars?: number}> = ({x, y, r, t, cracks = 0, rings = 0, fire = 0, dry = 0, mars = 0}) => {
  const mix = (a: string, b: string, k: number) => { const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16)), pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16)); return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const c1 = mix(mix('6EC1FF', 'E8DCC8', dry), 'E9A07A', mars), c2 = mix(mix('1C5FB8', 'C9B28E', dry), 'C1440E', mars), c3 = mix(mix('0A1F4A', '5E4A32', dry), '5A1A0A', mars);
  const id = `e${Math.round(x)}${Math.round(y)}${Math.round(r)}`;
  const ring = (front: boolean) => rings > 0 && (
    <g opacity={rings}>
      <ellipse cx={x} cy={y} rx={r * 2.1} ry={r * 0.45} fill="none" stroke="#C9B79C" strokeWidth={r * 0.18} opacity={0.75} strokeDasharray={front ? undefined : undefined} clipPath={front ? `url(#${id}f)` : `url(#${id}b)`} />
      <ellipse cx={x} cy={y} rx={r * 1.7} ry={r * 0.36} fill="none" stroke="#8C7B66" strokeWidth={r * 0.08} opacity={0.7} clipPath={front ? `url(#${id}f)` : `url(#${id}b)`} />
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id={id}><circle cx={x} cy={y} r={r} /></clipPath>
        <clipPath id={`${id}f`}><rect x={x - r * 3} y={y} width={r * 6} height={r * 3} /></clipPath>
        <clipPath id={`${id}b`}><rect x={x - r * 3} y={y - r * 3} width={r * 6} height={r * 3} /></clipPath>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor={c1} /><stop offset="0.6" stopColor={c2} /><stop offset="1" stopColor={c3} /></radialGradient>
      </defs>
      {ring(false)}
      <circle cx={x} cy={y} r={r * 1.08} fill={mix('5AB8FF', 'E9A07A', Math.max(dry * 0.6, mars))} opacity={0.25} filter="url(#blurGlow)" />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id})`}>
        {[[-0.4, -0.2, 0.42, 0.3], [0.35, 0.15, 0.35, 0.42], [-0.1, 0.5, 0.3, 0.18], [0.5, -0.5, 0.22, 0.16]].map(([dx, dy, rx, ry], i) => (
          <ellipse key={i} cx={x + ((dx + t * 0.03) % 1.6 - 0.2) * r} cy={y + dy * r} rx={rx * r} ry={ry * r} fill={mix(mix('3E9B4F', 'A68A64', dry), '8E3A1A', mars)} opacity={0.9} />
        ))}
        {dry < 0.5 && [0.1, 0.45, 0.8].map((k, i) => <ellipse key={i} cx={x + ((k + t * 0.05) % 1.4 - 0.7) * r * 2} cy={y + (i - 1) * r * 0.5} rx={r * 0.5} ry={r * 0.08} fill="#fff" opacity={0.55} />)}
        {fire > 0 && Array.from({length: 14}).map((_, i) => <circle key={i} cx={x + (rnd(i) - 0.5) * r * 1.6} cy={y + (rnd(i + 4) - 0.5) * r * 1.6} r={r * 0.08 * (0.5 + rnd(i + 2))} fill="#FF7A1A" opacity={fire * (0.5 + 0.5 * Math.sin(t * 6 + i))} filter="url(#blurGlow)" />)}
        {cracks > 0 && Array.from({length: 6}).map((_, i) => <path key={i} d={`M ${x + (rnd(i) - 0.5) * r} ${y + (rnd(i + 2) - 0.5) * r} l ${r * 0.2} ${r * 0.1} l -${r * 0.08} ${r * 0.2} l ${r * 0.18} ${r * 0.08}`} stroke="#FF9A3C" strokeWidth={r * 0.025} fill="none" opacity={cracks} />)}
        <circle cx={x + r * 0.45} cy={y + r * 0.35} r={r * 1.05} fill="#000" opacity={0.35} />
      </g>
      {ring(true)}
    </g>
  );
};
export const Moon: React.FC<{x: number; y: number; r: number; crack?: number; glow?: number}> = ({x, y, r, crack = 0, glow = 0.3}) => {
  const id = `m${Math.round(x)}${Math.round(y)}${Math.round(r)}`;
  const craters = [[-0.3, -0.25, 0.18], [0.25, 0.1, 0.24], [-0.1, 0.4, 0.12], [0.4, -0.4, 0.1], [-0.5, 0.15, 0.09], [0.05, -0.05, 0.08]];
  if (crack > 0.5) {
    // en pedazos
    const k = (crack - 0.5) * 2;
    return (
      <g>
        {Array.from({length: 16}).map((_, i) => {
          const a = rnd(i) * Math.PI * 2, d = r * (0.2 + k * (0.6 + rnd(i + 3) * 1.5));
          return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.6} r={r * (0.12 + rnd(i + 5) * 0.18) * (1 - k * 0.3)} fill="#B9B4A8" stroke="#6E6A61" strokeWidth={3} />;
        })}
      </g>
    );
  }
  return (
    <g>
      <defs>
        <clipPath id={id}><circle cx={x} cy={y} r={r} /></clipPath>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F2EEE3" /><stop offset="0.7" stopColor="#B9B4A8" /><stop offset="1" stopColor="#6E6A61" /></radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 1.15} fill="#FFF8E0" opacity={glow} filter="url(#blurGlow)" />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id})`}>
        {craters.map(([dx, dy, cr], i) => <circle key={i} cx={x + dx * r} cy={y + dy * r} r={cr * r} fill="#8E8A80" opacity={0.55} />)}
        {crack > 0 && Array.from({length: 5}).map((_, i) => <path key={i} d={`M ${x} ${y} l ${Math.cos(i * 1.3) * r * 0.6} ${Math.sin(i * 1.3) * r * 0.6} l ${Math.cos(i * 1.3 + 0.5) * r * 0.4} ${Math.sin(i * 1.3 + 0.5) * r * 0.4}`} stroke="#3A2A1A" strokeWidth={r * 0.03 * crack * 2} fill="none" />)}
        <circle cx={x + r * 0.4} cy={y + r * 0.3} r={r * 1.05} fill="#000" opacity={0.3} />
      </g>
    </g>
  );
};
export const Meteors: React.FC<{t: number; n?: number; k?: number}> = ({t, n = 14, k = 1}) => (
  <g opacity={k}>
    {Array.from({length: n}).map((_, i) => {
      const p = ((t * (0.5 + rnd(i) * 0.6) + rnd(i + 9)) % 1);
      const x0 = rnd(i + 2) * LW * 1.2 - 100, y0 = -100;
      const x = x0 - p * 500, y = y0 + p * 1300;
      return (
        <g key={i}>
          <line x1={x} y1={y} x2={x + 140} y2={y - 360} stroke="#FFB347" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
          <circle cx={x} cy={y} r={14} fill="#FFF1C1" filter="url(#blurGlow)" />
        </g>
      );
    })}
  </g>
);
export const Sea: React.FC<{t: number; level: number; wave?: number; night?: boolean}> = ({t, level, wave = 0, night}) => (
  <g>
    <rect width={LW} height={1080} fill={night ? '#0D1530' : '#7EC8F0'} />
    <path d={`M 0 ${GY - 40} L 1920 ${GY - 120} L 1920 1080 L 0 1080 Z`} fill="#E9D3A0" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={1200 + i * 110} y={GY - 300 - rnd(i) * 200} width={80} height={400} fill={night ? '#1C2547' : '#B8C4D0'} stroke="#111" strokeWidth={4} />)}
    <path d={`M 0 ${level} ${Array.from({length: 25}).map((_, i) => `L ${i * 80} ${level + Math.sin(t * 2 + i * 0.7) * 14 - (wave > 0 ? Math.max(0, 1 - Math.abs(i * 80 - wave * 2400 + 400) / 500) * 520 : 0)}`).join(' ')} L 1920 1080 L 0 1080 Z`} fill={night ? '#173A6B' : '#1E7FC2'} opacity={0.95} />
    <path d={`M 0 ${level} ${Array.from({length: 25}).map((_, i) => `L ${i * 80} ${level + Math.sin(t * 2 + i * 0.7) * 14 - (wave > 0 ? Math.max(0, 1 - Math.abs(i * 80 - wave * 2400 + 400) / 500) * 520 : 0)}`).join(' ')}`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.6} />
  </g>
);
export const Volcano: React.FC<{x: number; t: number; s?: number}> = ({x, t, s = 1}) => (
  <g transform={`translate(${x} ${GY}) scale(${s})`}>
    <path d="M -380 0 L -60 -420 L 60 -420 L 380 0 Z" fill="#3B2A22" stroke="#111" strokeWidth={6} />
    <path d="M -60 -420 L -20 -300 L 10 -380 L 60 -420 Z" fill="#FF5A1F" />
    {Array.from({length: 10}).map((_, i) => {
      const p = (t * 0.8 + i * 0.1) % 1;
      return <circle key={i} cx={(rnd(i) - 0.5) * 300 * p} cy={-420 - p * 600} r={30 + p * 90} fill={i % 3 ? '#4A4045' : '#FF8A3D'} opacity={0.75 - p * 0.6} />;
    })}
  </g>
);
export {pop, ramp, easeOut, rnd};
