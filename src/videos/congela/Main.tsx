import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES, Room, CityNight, Hospital} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 63;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|congel|muert|cero|hielo|cristal|bedford|rana|nadie|mueres/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const F = 'Montserrat';
const DARK = <rect width={1920} height={1080} fill="#0A1422" />;

/** laboratorio criogenico de fondo */
const Lab: React.FC<{red?: number}> = ({red = 0}) => (
  <g>
    <rect width={1920} height={1080} fill="#0F2233" />
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={i * 220} y={0} width={14} height={1080} fill="#16344d" />)}
    {[300, 640, 1280, 1620].map((x, i) => <g key={i}><rect x={x - 70} y={380} width={140} height={520} rx={60} fill="#33536c" /><rect x={x - 40} y={440} width={80} height={200} rx={30} fill="#7fd3ff" opacity={0.25} /></g>)}
    <rect y={GY} width={1920} height={180} fill="#0b1824" />
    {red > 0 && <rect width={1920} height={1080} fill="#ff1f3d" opacity={red * 0.35} />}
  </g>
);

/** capsula criogenica con persona dentro */
const Capsule: React.FC<{t: number; x?: number; y?: number; s?: number; frost?: number; crack?: number; label?: string; empty?: boolean; glow?: string}> = ({t, x = 960, y = 560, s = 1, frost = 0.6, crack = 0, label, empty, glow = '#7fd3ff'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={340} rx={210} ry={30} fill="#000" opacity={0.4} />
    <rect x={-170} y={-330} width={340} height={660} rx={150} fill="#cfd8e3" stroke="#111" strokeWidth={8} />
    <rect x={-150} y={-310} width={300} height={620} rx={135} fill="#8fa1b3" />
    <rect x={-105} y={-250} width={210} height={430} rx={100} fill="#0d2a40" stroke="#111" strokeWidth={6} />
    {!empty && <g>
      <circle cx={0} cy={-130} r={58} fill="#a9c9e6" />
      <path d="M -24 -132 q 10 6 18 0 M 6 -132 q 10 6 18 0" stroke="#3a5a78" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M -80 -50 Q 0 -90 80 -50 L 90 180 L -90 180 Z" fill="#1d5fa8" />
    </g>}
    <rect x={-105} y={-250} width={210} height={430} rx={100} fill={glow} opacity={0.18 + 0.06 * Math.sin(t * 3)} />
    <rect x={-105} y={-250} width={210} height={430} rx={100} fill="#eaf6ff" opacity={frost * 0.75} />
    {Array.from({length: 18}).map((_, i) => <path key={i} d={`M ${-90 + rnd(i) * 180} ${-230 + rnd(i + 1) * 400} l 14 0 m -7 -7 l 0 14 m -5 -5 l 10 10 m 0 -10 l -10 10`} stroke="#fff" strokeWidth={3} opacity={frost} />)}
    {crack > 0 && <g stroke="#fff" strokeWidth={5} fill="none" opacity={Math.min(1, crack * 2)}>
      {Array.from({length: 7}).map((_, i) => { const a = (i / 7) * Math.PI * 2 + 0.3; const L = 60 + 160 * crack * (0.6 + rnd(i) * 0.6); return <polyline key={i} points={`0,-40 ${Math.cos(a) * L * 0.5 + 10},${-40 + Math.sin(a) * L * 0.5} ${Math.cos(a) * L},${-40 + Math.sin(a) * L}`} />; })}
    </g>}
    <rect x={-60} y={220} width={120} height={50} rx={10} fill="#111" />
    <circle cx={-30} cy={245} r={9} fill={Math.sin(t * 6) > 0 ? '#2CFF8A' : '#0a4a2a'} /><circle cx={0} cy={245} r={9} fill="#FFD23F" opacity={0.8} /><circle cx={30} cy={245} r={9} fill={glow} />
    {label && <text x={0} y={-275} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill="#111">{label}</text>}
    {Array.from({length: 6}).map((_, i) => { const p = (t * 0.5 + i / 6) % 1; return <ellipse key={i} cx={-150 + i * 60 + Math.sin(t + i) * 20} cy={330 - p * 80} rx={70 + p * 60} ry={22 + p * 14} fill="#e8f6ff" opacity={(1 - p) * 0.45} />; })}
  </g>
);

/** termometro con numero gigante */
const Thermo: React.FC<{val: number; x?: number}> = ({val, x = 960}) => {
  const k = Math.max(0, Math.min(1, (val + 200) / 240));
  const c = val < -100 ? '#7fd3ff' : val < 0 ? '#9bdcff' : '#FF4D6D';
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={-50} y={250} width={100} height={420} rx={50} fill="#eef4fa" stroke="#111" strokeWidth={8} />
      <circle cx={0} cy={700} r={80} fill={c} stroke="#111" strokeWidth={8} />
      <rect x={-26} y={270 + 400 * (1 - k)} width={52} height={400 * k + 40} rx={26} fill={c} />
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={50} y1={290 + i * 90} x2={80} y2={290 + i * 90} stroke="#fff" strokeWidth={5} />)}
      <text x={110} y={560} fontFamily={F} fontWeight={900} fontSize={110} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke" transform="translate(-260 -150)">{`${Math.round(val)}°C`}</text>
    </g>
  );
};

/** monitor del corazon */
const Monitor: React.FC<{t: number; flat: number}> = ({t, flat}) => {
  const pts = Array.from({length: 60}).map((_, i) => { const x = i * 8; const ph = (i + t * 30) % 20; const beat = ph > 8 && ph < 12 ? (ph < 10 ? -1 : 1) * 70 : 0; return `${x},${beat * (1 - flat)}`; }).join(' ');
  return (
    <g transform="translate(700 470)">
      <rect x={-20} y={-120} width={520} height={260} rx={20} fill="#06110b" stroke="#111" strokeWidth={10} />
      <polyline points={pts} fill="none" stroke={flat > 0.5 ? '#FF4D6D' : '#2CFF8A'} strokeWidth={6} />
      <text x={470} y={-80} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={36} fill={flat > 0.5 ? '#FF4D6D' : '#2CFF8A'}>{flat > 0.5 ? '0' : '72'}</text>
    </g>
  );
};

/** documento legal con sello */
const LawDoc: React.FC<{stamp: number}> = ({stamp}) => (
  <g transform="translate(960 470) scale(0.85)">
    <rect x={-250} y={-300} width={500} height={600} rx={10} fill="#f4efe1" stroke="#111" strokeWidth={8} />
    <text x={0} y={-220} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill="#111">LEY</text>
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={-190} y={-170 + i * 44} width={i % 3 === 2 ? 240 : 380} height={14} rx={7} fill="#b9b2a0" />)}
    {stamp > 0 && <g transform={`rotate(-14) scale(${1 + (1 - stamp) * 1.6})`} opacity={stamp}>
      <rect x={-230} y={120} width={460} height={130} rx={12} fill="none" stroke="#E63946" strokeWidth={12} />
      <text x={0} y={180} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#E63946">SOLO SI ESTÁS</text>
      <text x={0} y={232} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#E63946">MUERTO</text>
    </g>}
  </g>
);

/** bolsa de anticongelante */
const IVBag: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g transform="translate(1000 320)">
    <line x1={0} y1={-60} x2={0} y2={0} stroke="#ccc" strokeWidth={8} />
    <rect x={-70} y={0} width={140} height={200} rx={30} fill="#eef8ff" stroke="#111" strokeWidth={6} />
    <rect x={-58} y={20 + 160 * k} width={116} height={170 - 160 * k} rx={22} fill="#35a7ff" />
    <text x={0} y={120} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={22} fill="#111">ANTI</text>
    <path d={`M 0 200 C 0 320, -120 300, -150 420`} stroke="#35a7ff" strokeWidth={10} fill="none" strokeDasharray="20 14" strokeDashoffset={-t * 120} />
  </g>
);

/** celula vista al microscopio: el agua se convierte en hielo y la rompe */
const Cell: React.FC<{t: number; ice: number; crack: number}> = ({t, ice, crack}) => {
  const sw = 1 + ice * 0.09;
  return (
    <g transform={`translate(960 520) scale(${sw})`}>
      <circle r={300} fill="#ffb3c7" opacity={0.9} stroke="#c9184a" strokeWidth={14} />
      <circle cx={60} cy={-40} r={80} fill="#9d4edd" opacity={0.85} />
      {Array.from({length: 26}).map((_, i) => { const a = rnd(i) * Math.PI * 2, r = 60 + rnd(i + 1) * 200; const x = Math.cos(a) * r + Math.sin(t * 2 + i) * 6 * (1 - ice), y = Math.sin(a) * r + Math.cos(t * 2 + i) * 6 * (1 - ice); return ice < rnd(i + 7) ? <circle key={i} cx={x} cy={y} r={12} fill="#4cc9f0" /> : <g key={i} transform={`translate(${x} ${y}) rotate(${i * 20}) scale(${0.6 + ice})`}>{[0, 60, 120].map((r) => <rect key={r} x={-34} y={-5} width={68} height={10} fill="#e8fbff" stroke="#7fd3ff" strokeWidth={2} transform={`rotate(${r})`} />)}</g>; })}
      {crack > 0 && <g stroke="#111" strokeWidth={8} fill="none">
        {Array.from({length: 6}).map((_, i) => { const a = (i / 6) * Math.PI * 2; const L = 320 * crack; return <polyline key={i} points={`${Math.cos(a) * 200},${Math.sin(a) * 200} ${Math.cos(a + 0.1) * (200 + L * 0.5)},${Math.sin(a + 0.1) * (200 + L * 0.5)} ${Math.cos(a - 0.05) * (200 + L)},${Math.sin(a - 0.05) * (200 + L)}`} />; })}
      </g>}
    </g>
  );
};

/** fila de tanques (California 1979) */
const Tanks: React.FC<{t: number; warm: number}> = ({t, warm}) => (
  <g>
    {[740, 960, 1180].map((x, i) => (
      <g key={i} transform={`translate(${x} 0)`}>
        <rect x={-90} y={330} width={180} height={560} rx={40} fill="#9aa7b4" stroke="#111" strokeWidth={8} />
        <ellipse cx={0} cy={340} rx={90} ry={26} fill="#cfd8e3" stroke="#111" strokeWidth={6} />
        <rect x={-60} y={420} width={120} height={60} rx={10} fill={warm > 0.3 ? '#FF4D6D' : '#2CFF8A'} opacity={0.7 + 0.3 * Math.sin(t * 8 + i)} />
        {warm > 0.2 && Array.from({length: 3}).map((_, j) => { const p = (t * 0.8 + j / 3 + i * 0.2) % 1; return <ellipse key={j} cx={-40 + j * 40} cy={520 + p * 360} rx={8} ry={14} fill="#7fd3ff" opacity={(1 - p) * warm} />; })}
        <ellipse cx={0} cy={895} rx={110 * warm} ry={14 * warm} fill="#7fd3ff" opacity={0.5} />
      </g>
    ))}
  </g>
);

/** 500 capsulas apareciendo */
const Grid500: React.FC<{k: number}> = ({k}) => (
  <g>
    {Array.from({length: 500}).map((_, i) => { const c = i % 20, r = Math.floor(i / 20); if (i / 500 > k) return null; return <rect key={i} x={680 + c * 28} y={340 + r * 20} width={18} height={15} rx={6} fill={rnd(i) > 0.97 ? '#FFD23F' : '#7fd3ff'} />; })}
  </g>
);

/** rana: congelada en hielo, se descongela y salta */
const Frog: React.FC<{t: number; melt: number; jump: number}> = ({t, melt, jump}) => {
  const jy = -Math.sin(Math.min(1, jump) * Math.PI) * 300, jx = 0;
  return (
    <g>
      <g transform={`translate(${960 + jx} ${720 + jy}) rotate(${jump > 0 && jump < 1 ? -15 : 0})`}>
        <ellipse cx={0} cy={0} rx={150} ry={95} fill={melt > 0.5 ? '#52b788' : '#7aa6a0'} stroke="#111" strokeWidth={8} />
        <circle cx={-70} cy={-80} r={42} fill={melt > 0.5 ? '#52b788' : '#7aa6a0'} stroke="#111" strokeWidth={8} /><circle cx={70} cy={-80} r={42} fill={melt > 0.5 ? '#52b788' : '#7aa6a0'} stroke="#111" strokeWidth={8} />
        <circle cx={-70} cy={-84} r={18} fill="#111" opacity={melt > 0.5 ? 1 : 0.3} /><circle cx={70} cy={-84} r={18} fill="#111" opacity={melt > 0.5 ? 1 : 0.3} />
        {melt <= 0.5 && <><line x1={-88} y1={-84} x2={-52} y2={-84} stroke="#111" strokeWidth={7} /><line x1={52} y1={-84} x2={88} y2={-84} stroke="#111" strokeWidth={7} /></>}
        <path d="M -60 10 Q 0 50 60 10" stroke="#111" strokeWidth={7} fill="none" />
        <ellipse cx={-140} cy={70} rx={60} ry={24} fill="#40916c" stroke="#111" strokeWidth={6} /><ellipse cx={140} cy={70} rx={60} ry={24} fill="#40916c" stroke="#111" strokeWidth={6} />
      </g>
      {melt < 1 && <g opacity={1 - melt}>
        <rect x={760} y={540} width={400} height={320} rx={30} fill="#cdefff" opacity={0.55} stroke="#eafaff" strokeWidth={8} />
        <path d="M 800 580 L 870 600 M 1080 570 L 1120 640 M 820 800 L 900 760" stroke="#fff" strokeWidth={6} />
      </g>}
      {melt > 0 && melt < 1 && Array.from({length: 10}).map((_, i) => { const p = (t * 1.2 + i / 10) % 1; return <ellipse key={i} cx={780 + i * 40} cy={860 + p * 30} rx={10} ry={14} fill="#7fd3ff" opacity={(1 - p) * 0.8} />; })}
    </g>
  );
};

const Snow: React.FC<{t: number; k?: number}> = ({t, k = 1}) => (
  <g opacity={k}>{Array.from({length: 50}).map((_, i) => <circle key={i} cx={(rnd(i) * 1920 + Math.sin(t + i) * 40) % 1920} cy={(rnd(i + 3) * 1080 + t * (60 + rnd(i) * 80)) % 1080} r={3 + rnd(i + 1) * 5} fill="#fff" opacity={0.7} />)}</g>
);

const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => {
  if (t < at) return null;
  return <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
};

// ---------- tiempos ----------
const P1 = T('paso'), LEY = T('sí'), P2 = T('paso', 2), N196 = T('196'), NIT = T('nitrógeno'), P3 = T('paso', 3), AGUA = T('agua'), CRIS = T('cristal');
const Y67 = T('en', 3), SIGUE = T('sigue'), Y79 = T('pero'), NADIE = T('sin'), HOY = T('hoy', 2), USD = T('cuesta'), CUANT = T('cuántas'), CERO = T('cero', 2), RANA = T('y', 5), PRIM = T('primavera'), END = T('te', 5);

const SHOTS: Shot[] = [
  // gancho: flash-forward, la capsula se agrieta en el año 3000
  [0, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.5, 1.8, 0.6, 960, 420), ...shake(t, 9 - lt * 8)}} bg={<Lab red={0.6 + 0.4 * Math.sin(t * 10)} />} hero={<Capsule t={t} crack={easeOut(ramp(lt, 0, 0.5))} frost={0.5} glow="#ff4d6d" />} fx={<Snow t={t} />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.4, 1.2, 0.6)} bg={DARK} hero={<Thermo val={-196} />} fx={<Snow t={t} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 1.6, 960, 500)} bg={<CityNight />} hero={<Hero x={960} s={1.4} t={t} pose={POSES.armsUp} eyes="wide" mouth="o" />} fx={<Snow t={t} k={1 - lt} />} /></V>],
  [T('parece'), (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 2)} bg={<Lab />} hero={<><Capsule t={t} x={1110} s={0.8} empty frost={0.2} /><Hero x={820} s={1.4} t={t} pose={POSES.point} eyes="happy" mouth="smile" /></>} /></V>],
  // paso 1: mueres
  [P1, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.3, 2.4, 960, 380)} bg={<Hospital />} hero={<><Monitor t={t} flat={ramp(t, T('mueres') - 0.1, T('mueres') + 0.3)} /><Hero x={1220} s={1.3} t={t} pose={POSES.idle} rotate={-90 * ramp(t, T('mueres') - 0.2, T('mueres') + 0.3)} eyes={t > T('mueres') ? 'closed' : 'normal'} /></>} /></V>],
  [LEY, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={DARK} hero={<LawDoc stamp={easeOut(ramp(t, T('muerto') - 0.2, T('muerto') + 0.15))} />} /></V>],
  // paso 2: anticongelante y -196
  [P2, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Lab />} hero={<><Hero x={1220} s={1.3} t={t} pose={POSES.idle} rotate={-90} eyes="closed" /><IVBag t={t} k={ramp(lt, 0.5, 3)} /></>} /></V>],
  [N196, (lt, t) => { const v = 20 - 216 * easeOut(ramp(lt, 0, 1.4)); return <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.1, 1.3, 2.4), ...shake(t, lt < 1.4 ? 3 : 0)}} bg={DARK} hero={<Thermo val={v} />} fx={<Snow t={t} k={ramp(lt, 0.6, 1.4)} />} /></V>; }],
  [NIT, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.15, 1.0, 2)} bg={<Lab />} hero={<Capsule t={t} frost={0.3 + ramp(lt, 0, 1.2) * 0.5} label="-196°C" />} fx={<Snow t={t} />} /></V>],
  // paso 3: el problema
  [P3, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.1, 1.5), ...shake(t, lt < 0.5 ? 6 : 0)}} bg={<Lab red={0.5} />} hero={<Capsule t={t} frost={0.8} glow="#ff4d6d" />} /></V>],
  [AGUA, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 5.5)} bg={<rect width={1920} height={1080} fill="#2a0f1f" />} hero={<Cell t={t} ice={ramp(t, T('9%') - 0.4, T('congelarse') + 0.6)} crack={easeOut(ramp(t, T('romper'), CRIS + 0.3))} />} /></V>],
  [CRIS, (lt, t) => <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.2, 1.4, 0.8), ...shake(t, Math.max(0, 10 - lt * 12))}} bg={<rect width={1920} height={1080} fill="#2a0f1f" />} hero={<Cell t={t} ice={1} crack={1} />} /></V>],
  // 1967 Bedford
  [Y67, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.25, 5)} bg={<g style={{filter: 'sepia(0.8)'}}><Lab /></g>} hero={<g style={{filter: 'sepia(0.6)'}}><Capsule t={t} frost={0.7} label="1967" /></g>} /></V>],
  [SIGUE, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.25, 1.0, 2.2)} bg={<Lab />} hero={<><Capsule t={t} y={640} s={0.9} frost={0.85} label="J. BEDFORD" /></>} /></V>],
  // 1979 California
  [Y79, (lt, t) => <V><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Lab red={0.3 + 0.3 * Math.sin(t * 6)} />} hero={<Tanks t={t} warm={ramp(t, T('descongelado') - 0.6, T('descongelado') + 0.5)} />} /></V>],
  [NADIE, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 2)} bg={<Lab />} hero={<><Tanks t={t} warm={1} /><g opacity={0.9}><rect x={560} y={0} width={800} height={1080} fill="#000" opacity={0.45} /></g></>} /></V>],
  // hoy
  [HOY, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.1, 3)} bg={DARK} hero={<Grid500 k={easeOut(ramp(lt, 0, 1.6))} />} /></V>],
  [USD, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.2, 1.0, 2)} bg={<Lab />} hero={<><Capsule t={t} s={0.85} y={600} frost={0.5} /><g transform={`translate(860 440) rotate(${-10 + Math.sin(t * 4) * 4}) scale(${easeOut(ramp(t, T('200.000') - 0.2, T('200.000') + 0.2))})`}><rect x={-10} y={-60} width={280} height={120} rx={16} fill="#FFD23F" stroke="#111" strokeWidth={8} /><text x={130} y={22} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill="#111">$200.000</text></g></>} /></V>],
  [CUANT, (lt, t) => { const n = t < CERO ? Math.floor(rnd(Math.floor(t * 14)) * 500) : 0; return <V><Cine t={t} mood={t < CERO ? 'night' : 'red'} cam={{...kbV(lt, 1.0, 1.3, 3), ...shake(t, t > CERO && t < CERO + 0.4 ? 9 : 0)}} bg={DARK} hero={<text x={960} y={640} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={t < CERO ? 240 : 380} fill={t < CERO ? '#fff' : '#FF4D6D'} stroke="#111" strokeWidth={12} paintOrder="stroke">{n}</text>} /></V>; }],
  // la rana
  [RANA, (lt, t) => <V><Cine t={t} mood={t < PRIM ? 'cold' : 'day'} cam={kbV(lt, 1.0, 1.2, 6, 960, 600)} bg={<g><rect width={1920} height={1080} fill={t < PRIM ? '#9fc4dd' : '#8fd18a'} /><rect y={GY - 40} width={1920} height={220} fill={t < PRIM ? '#eef6ff' : '#4f9d4a'} /></g>} hero={<Frog t={t} melt={ramp(t, PRIM - 0.4, PRIM + 0.4)} jump={ramp(t, T('saltar') - 0.2, T('saltar') + 0.6)} />} fx={t < PRIM ? <Snow t={t} /> : undefined} /></V>],
  // final: pregunta + bucle con la capsula
  [END, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.3, 3.5, 960, 460)} bg={<Lab />} hero={<><Capsule t={t} x={1120} s={0.8} empty frost={0.3} /><Hero x={830} s={1.4} t={t} pose={POSES.shrug} eyes="side" look={0.6} mouth="flat" /></>} fx={<Snow t={t} k={0.5} />} /></V>],
];

export const CongelaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('congela/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={0.58} a="CONGELADO" b="HASTA EL AÑO 3000" size={120} color2="#7FD3FF" />
      <VBig t={t} at={1.2} until={T('parece') - 0.05} a="AÑO 3000" size={170} color="#7FD3FF" />
      <VBig t={t} at={T('parece')} until={P1 - 0.05} a="¿EL PLAN" b="PERFECTO?" size={140} color2="#FFD23F" />
      <VBig t={t} at={P1} until={LEY - 0.05} a="PASO 1" b={t > T('mueres') ? 'MUERES' : undefined} size={150} color2="#FF4D6D" />
      <VBig t={t} at={LEY} until={P2 - 0.05} a="ES LA LEY" size={150} />
      <VBig t={t} at={P2} until={N196 - 0.05} a="PASO 2" b="ANTICONGELANTE" size={92} color2="#7FD3FF" />
      <VBig t={t} at={NIT} until={P3 - 0.05} a="NITRÓGENO" b="LÍQUIDO" size={140} color2="#7FD3FF" />
      <VBig t={t} at={P3} until={AGUA - 0.05} a="PASO 3" b="EL PROBLEMA" size={140} color2="#FF4D6D" />
      <VBig t={t} at={AGUA} until={CRIS - 0.05} a="EL HIELO" b={t > T('9%') - 0.1 ? '+9 % DE VOLUMEN' : 'DENTRO DE TI'} size={115} color2="#7FD3FF" />
      <VBig t={t} at={CRIS} until={Y67 - 0.05} a="¡CRACK!" size={190} color="#FF4D6D" />
      <VBig t={t} at={Y67} until={SIGUE - 0.05} a="1967" b="EL PRIMER CONGELADO" size={120} color2="#FFD23F" />
      <VBig t={t} at={SIGUE} until={Y79 - 0.05} a="SIGUE AHÍ" b={`${59} AÑOS`} size={150} color2="#7FD3FF" />
      <VBig t={t} at={Y79} until={NADIE - 0.05} a="1979: 9 CUERPOS" b="DESCONGELADOS" size={100} color2="#FF4D6D" />
      <VBig t={t} at={NADIE} until={HOY - 0.05} a="Y NADIE" b="SE DIO CUENTA" size={140} color2="#FF4D6D" />
      <VBig t={t} at={HOY} until={USD - 0.05} a="500" b="CONGELADOS HOY" size={112} color2="#7FD3FF" />
      <VBig t={t} at={USD} until={CUANT - 0.05} a="PRECIO" b="200.000 $" size={150} color2="#FFD23F" />
      <VBig t={t} at={CUANT} until={RANA - 0.05} a="¿HAN DESPERTADO?" b={t > CERO ? 'NINGUNO' : undefined} size={105} color2="#FF4D6D" />
      <VBig t={t} at={RANA} until={END - 0.05} a={t < PRIM ? 'ESTA RANA' : '¡Y REVIVE!'} b={t < PRIM ? 'SE CONGELA ENTERA' : undefined} size={115} color={t < PRIM ? '#fff' : '#7BF59A'} color2="#7FD3FF" />
      <VBig t={t} at={END} a="¿TE CONGELARÍAS" b="TÚ?" size={125} color2="#7FD3FF" />
      <Arrow t={t} at={END + 0.6} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const CongelaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="red" cam={kbV(0, 1.5, 1.5, 1, 960, 450)} bg={<Lab red={0.8} />} hero={<Capsule t={1} crack={0.8} frost={0.5} glow="#ff4d6d" />} fx={<Snow t={1} />} /></V>
      <VBig t={1} at={0} a="CONGELADO" b="HASTA EL AÑO 3000" size={130} y={160} color2="#7FD3FF" />
    </AbsoluteFill>
  );
};
