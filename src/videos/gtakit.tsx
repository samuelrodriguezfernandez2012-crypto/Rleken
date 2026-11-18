import React from 'react';
import {GY, rnd} from './futuro/kit';
import {ramp, easeOut} from './futuro/vkit';

export const PINK = '#FF4FA3', CYAN = '#3DF5FF', YEL = '#FFD23F', F = 'Montserrat';
export const DARK = <rect width={1920} height={1080} fill="#140826" />;
export const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

/** tele de noticias con titular */
export const NewsTV: React.FC<{t: number; head: string; sub?: string; k?: number}> = ({t, head, sub = 'ÚLTIMA HORA', k = 1}) => (
  <g transform={`translate(960 500) scale(${0.9 + 0.1 * k})`} fontFamily={F} fontWeight={900}>
    <rect x={-300} y={-230} width={600} height={430} rx={26} fill="#111" stroke="#333" strokeWidth={10} />
    <rect x={-280} y={-210} width={560} height={390} rx={12} fill="#1f3c63" />
    <circle cx={0} cy={-60} r={90} fill="#2c5282" /><rect x={-130} y={30} width={260} height={150} rx={60} fill="#2c5282" />
    <rect x={-280} y={60} width={560} height={50} fill="#E63946" />
    <text x={-265} y={96} fontSize={30} fill="#fff">{sub}</text>
    <rect x={-280} y={110} width={560} height={70} fill="#fff" />
    <text x={0} y={158} textAnchor="middle" fontSize={head.length > 22 ? 26 : 34} fill="#111">{head}</text>
    <circle cx={240} cy={-170} r={12} fill="#E63946" opacity={Math.sin(t * 8) > 0 ? 1 : 0.2} />
    <rect x={-60} y={200} width={120} height={60} fill="#222" />
  </g>
);

/** movil con publicacion */
export const Phone: React.FC<{t: number; user: string; lines: string[]; live?: boolean; chat?: boolean}> = ({t, user, lines, live, chat}) => (
  <g transform="translate(960 560) scale(0.82)" fontFamily={F} fontWeight={900}>
    <rect x={-190} y={-330} width={380} height={680} rx={46} fill="#111" stroke="#444" strokeWidth={8} />
    <rect x={-170} y={-300} width={340} height={620} rx={30} fill="#1b1033" />
    <circle cx={-130} cy={-250} r={26} fill={PINK} />
    <text x={-95} y={-240} fontSize={24} fill="#fff">{user}</text>
    {live && <g><rect x={90} y={-268} width={70} height={34} rx={8} fill="#E63946" /><text x={125} y={-243} textAnchor="middle" fontSize={20} fill="#fff">LIVE</text></g>}
    <rect x={-150} y={-200} width={300} height={260} rx={16} fill="#3a2a5e" />
    {lines.map((l, i) => <text key={i} x={-150} y={110 + i * 40} fontSize={26} fill="#fff">{l}</text>)}
    {chat && Array.from({length: 4}).map((_, i) => { const p = (t * 0.8 + i / 4) % 1; return <g key={i} opacity={1 - p}><rect x={-150} y={250 - p * 180} width={200 + rnd(i) * 100} height={34} rx={17} fill="#fff" opacity={0.85} /><circle cx={-135} cy={267 - p * 180} r={10} fill={[PINK, CYAN, YEL, '#7BF59A'][i]} /></g>; })}
  </g>
);

/** caiman */
export const Gator: React.FC<{x: number; y?: number; t: number; s?: number; flip?: boolean}> = ({x, y = GY, t, s = 1, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -260 -40 Q -120 -90 120 -70 L 300 -60 Q 330 -40 300 -20 L 120 -10 Q -120 10 -260 -20 Z" fill="#3a7d44" stroke="#111" strokeWidth={7} />
    {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-200 + i * 45} -60 l 14 -22 l 14 22`} fill="#2d6a4f" stroke="#111" strokeWidth={4} />)}
    <circle cx={170} cy={-72} r={12} fill="#FFD23F" stroke="#111" strokeWidth={4} />
    <path d="M 200 -40 L 300 -40" stroke="#fff" strokeWidth={6} strokeDasharray="10 8" />
    {[-150, -40, 60, 150].map((lx, i) => <rect key={i} x={lx} y={-20} width={26} height={36 + Math.sin(t * 10 + i * 2) * 8} rx={8} fill="#2d6a4f" stroke="#111" strokeWidth={4} />)}
    <path d="M -260 -30 Q -330 -20 -380 -50" stroke="#3a7d44" strokeWidth={26} fill="none" strokeLinecap="round" />
  </g>
);

/** tienda de carretera */
export const Store: React.FC<{neon?: boolean}> = ({neon}) => (
  <g>
    <rect width={1920} height={1080} fill={neon ? '#1B0B3A' : '#87b8d8'} />
    <rect x={500} y={300} width={920} height={600} fill={neon ? '#2a1450' : '#e9e2cf'} stroke="#111" strokeWidth={8} />
    <rect x={500} y={300} width={920} height={110} fill="#E63946" />
    <text x={960} y={380} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={70} fill="#fff">24/7 STORE</text>
    <rect x={830} y={520} width={260} height={380} fill="#9ad0ec" stroke="#111" strokeWidth={8} opacity={0.85} />
    <rect x={560} y={500} width={220} height={200} fill="#9ad0ec" stroke="#111" strokeWidth={6} />
    <rect x={1140} y={500} width={220} height={200} fill="#9ad0ec" stroke="#111" strokeWidth={6} />
    <rect y={GY} width={1920} height={180} fill="#555" />
  </g>
);

/** tromba marina */
export const Spout: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#4a6278" />
    <rect y={760} width={1920} height={320} fill="#2b4a63" />
    {Array.from({length: 18}).map((_, i) => { const y = 120 + i * 36, w = 60 + i * 9; return <ellipse key={i} cx={960 + Math.sin(t * 4 + i * 0.5) * 30} cy={y} rx={w} ry={16} fill="none" stroke="#dfe8f0" strokeWidth={8} opacity={0.75} />; })}
    <ellipse cx={960} cy={790} rx={260} ry={40} fill="#dfe8f0" opacity={0.5} />
  </g>
);

/** vinilo girando */
export const Vinyl: React.FC<{t: number; label: string}> = ({t, label}) => (
  <g transform="translate(960 500)" fontFamily={F} fontWeight={900}>
    <g transform={`rotate(${t * 140})`}>
      <circle r={260} fill="#111" />
      {[200, 160, 120].map((r) => <circle key={r} r={r} fill="none" stroke="#333" strokeWidth={4} />)}
      <circle r={90} fill={PINK} /><circle r={10} fill="#111" />
      <rect x={-6} y={-88} width={12} height={40} fill="#fff" />
    </g>
    
    {Array.from({length: 5}).map((_, i) => { const p = (t * 0.6 + i / 5) % 1; return <text key={i} x={-300 + i * 150} y={-200 - p * 200} fontSize={70} fill={CYAN} opacity={1 - p}>♪</text>; })}
  </g>
);

/** carretera larga hasta el horizonte */
export const Road: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#F72585" /><rect width={1920} height={520} fill="#3A0CA3" />
    <circle cx={960} cy={520} r={200} fill="#FFD166" />
    <rect y={520} width={1920} height={560} fill="#140826" />
    <path d="M 900 520 L 1020 520 L 1700 1080 L 220 1080 Z" fill="#2b2b3a" />
    {Array.from({length: 8}).map((_, i) => { const p = ((t * 0.5 + i / 8) % 1); const y = 520 + p * p * 560, w = 6 + p * 30, h = 10 + p * 70; return <rect key={i} x={960 - w / 2} y={y} width={w} height={h} fill={YEL} />; })}
  </g>
);

/** radio antigua */
export const Radio: React.FC<{t: number; st: string}> = ({t, st}) => (
  <g transform="translate(960 520)" fontFamily={F} fontWeight={900}>
    <rect x={-280} y={-170} width={560} height={340} rx={30} fill="#6b4226" stroke="#111" strokeWidth={10} />
    <circle cx={-130} cy={30} r={100} fill="#3b2414" />
    {Array.from({length: 6}).map((_, i) => <circle key={i} cx={-130} cy={30} r={20 + i * 14} fill="none" stroke="#5a3a22" strokeWidth={4} />)}
    <rect x={20} y={-100} width={220} height={90} rx={10} fill="#0B0620" />
    <text x={130} y={-40} textAnchor="middle" fontSize={44} fill={CYAN}>{st}</text>
    <circle cx={80} cy={80} r={34} fill="#d4a373" /><circle cx={190} cy={80} r={34} fill="#d4a373" />
    {Array.from({length: 4}).map((_, i) => { const p = (t * 0.7 + i / 4) % 1; return <text key={i} x={-360 + i * 60} y={-200 - p * 160} fontSize={60} fill={YEL} opacity={1 - p}>♪</text>; })}
  </g>
);

/** matricula */
export const Plate: React.FC<{txt: string; k: number}> = ({txt, k}) => (
  <g transform={`translate(960 500) scale(${(0.4 + 0.6 * k) * 0.85})`} fontFamily={F} fontWeight={900}>
    <rect x={-280} y={-110} width={560} height={220} rx={20} fill="#fff" stroke="#111" strokeWidth={10} />
    <text y={-60} textAnchor="middle" fontSize={34} fill={PINK}>LEONIDA</text>
    <text y={55} textAnchor="middle" fontSize={96} fill="#1B0B3A">{txt}</text>
  </g>
);

/** letrero de club neon */
export const ClubSign: React.FC<{t: number; a: string; b: string}> = ({t, a, b}) => {
  const on = Math.sin(t * 9) > -0.7;
  return (
    <g transform="translate(960 470)" fontFamily={F} fontWeight={900}>
      <rect x={-290} y={-170} width={580} height={340} rx={30} fill="#0B0620" stroke={PINK} strokeWidth={8} />
      <text y={-20} textAnchor="middle" fontSize={84} fill={on ? PINK : '#5a1a3a'} style={{filter: on ? `drop-shadow(0 0 14px ${PINK})` : undefined}}>{a}</text>
      <text y={90} textAnchor="middle" fontSize={84} fill={on ? CYAN : '#1a4a5a'} style={{filter: on ? `drop-shadow(0 0 14px ${CYAN})` : undefined}}>{b}</text>
    </g>
  );
};

/** cuadricula de videos filtrados */
export const VidGrid: React.FC<{k: number; t: number}> = ({k, t}) => (
  <g>{Array.from({length: 90}).map((_, i) => { const c = i % 9, r = Math.floor(i / 9); if (i / 90 > k) return null; return <g key={i} transform={`translate(${680 + c * 64} ${240 + r * 52})`}><rect width={56} height={42} rx={6} fill={rnd(i) > 0.5 ? '#2c5282' : '#553c9a'} stroke="#000" strokeWidth={2} /><path d="M 22 12 L 36 21 L 22 30 Z" fill="#fff" /></g>; })}
    
  </g>
);

/** habitacion de hotel con tele, stick y movil */
export const Hotel: React.FC<{t: number; hack?: number}> = ({t, hack = 1}) => (
  <g>
    <rect width={1920} height={1080} fill="#2b2238" />
    <rect x={0} y={GY} width={1920} height={180} fill="#1b1424" />
    <rect x={460} y={700} width={520} height={200} rx={20} fill="#c9b8d8" stroke="#111" strokeWidth={6} />
    <rect x={460} y={660} width={160} height={70} rx={20} fill="#fff" stroke="#111" strokeWidth={6} />
    <rect x={1020} y={300} width={460} height={290} rx={14} fill="#111" stroke="#444" strokeWidth={10} />
    <rect x={1040} y={320} width={420} height={250} fill="#031a0b" />
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={1060} y={340 + i * 26} width={(80 + rnd(i + Math.floor(t * 6)) * 300) * hack} height={10} fill="#2CFF8A" opacity={0.8} />)}
    <rect x={1240} y={590} width={20} height={130} fill="#333" /><rect x={1160} y={720} width={180} height={18} fill="#333" />
    <rect x={1470} y={560} width={70} height={22} rx={6} fill="#ff9f1c" stroke="#111" strokeWidth={4} />
    <rect x={1400} y={GY - 150} width={260} height={150} fill="#5c4033" />
  </g>
);

/** mazo de juez */
export const Gavel: React.FC<{t: number; hit: number}> = ({t, hit}) => (
  <g transform="translate(860 520)">
    <rect x={-260} y={160} width={520} height={60} rx={10} fill="#5c3d2e" stroke="#111" strokeWidth={6} />
    <g transform={`rotate(${-40 + 40 * hit} 150 120)`}>
      <rect x={-60} y={-40} width={220} height={110} rx={18} fill="#8b5a3c" stroke="#111" strokeWidth={8} />
      <rect x={140} y={0} width={260} height={30} rx={10} fill="#a0522d" stroke="#111" strokeWidth={6} />
    </g>
    {hit > 0.95 && Array.from({length: 8}).map((_, i) => { const a = i / 8 * Math.PI; return <line key={i} x1={Math.cos(a) * 120} y1={150 - Math.sin(a) * 60} x2={Math.cos(a) * 220} y2={150 - Math.sin(a) * 130} stroke={YEL} strokeWidth={8} />; })}
  </g>
);

export const Stamp: React.FC<{k: number; txt: string; y?: number}> = ({k, txt, y = 520}) => k <= 0 ? null : (
  <g transform={`translate(960 ${y}) rotate(-12) scale(${1 + (1 - k) * 1.6})`} opacity={k} fontFamily={F} fontWeight={900}>
    <rect x={-270} y={-75} width={540} height={150} rx={14} fill="rgba(0,0,0,0.25)" stroke="#E63946" strokeWidth={14} />
    <text y={30} textAnchor="middle" fontSize={92} fill="#E63946">{txt}</text>
  </g>
);
export {ramp, easeOut};
