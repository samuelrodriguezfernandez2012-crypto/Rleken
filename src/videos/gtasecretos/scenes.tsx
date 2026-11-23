import React from 'react';
import {GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {Sea, Stars, ramp, easeOut} from '../futuro/vkit';
import {PINK, CYAN, YEL, F} from '../gtakit';

const EGG = ['#FF4FA3', '#3DF5FF', '#FFD23F', '#7BF59A', '#B983FF'];

/** torre de comunicaciones con el heroe trepando (k = progreso 0..1) */
export const Tower: React.FC<{t: number; k: number; label?: string}> = ({t, k, label = 'MIN'}) => {
  const top = 120, bot = 1000, hy = bot - 40 - (bot - top - 160) * k;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2a1d5c" />
      <rect y={620} width={1920} height={460} fill="#FF7B54" opacity={0.35} />
      <Stars t={t} n={50} />
      {[0, 1, 2].map((i) => <rect key={i} x={400 + i * 500} y={760 - i * 40} width={180} height={320} fill="#1a1238" />)}
      <path d={`M 860 ${bot} L 935 ${top} L 985 ${top} L 1060 ${bot} Z`} fill="none" stroke="#c9c2e8" strokeWidth={10} />
      {Array.from({length: 14}).map((_, i) => { const y0 = top + i * 63, y1 = y0 + 63; const w0 = 25 + (y0 - top) * 0.085, w1 = 25 + (y1 - top) * 0.085; return <path key={i} d={`M ${960 - w0} ${y0} L ${960 + w1} ${y1} M ${960 + w0} ${y0} L ${960 - w1} ${y1} M ${960 - w1} ${y1} L ${960 + w1} ${y1}`} stroke="#c9c2e8" strokeWidth={5} />; })}
      <circle cx={960} cy={top - 10} r={14} fill={Math.sin(t * 6) > 0 ? '#FF4D6D' : '#5a1a2a'} />
      <g transform={`translate(${960 + Math.sin(t * 8) * 6} ${hy})`}><Hero x={0} y={0} s={0.55} t={t} pose={POSES.cheer} eyes="wide" mouth="o" /></g>
      <g transform="translate(1180 230)" fontFamily={F} fontWeight={900}>
        <rect x={-100} y={-60} width={200} height={120} rx={20} fill="#0B0620" stroke={YEL} strokeWidth={6} />
        <text y={20} textAnchor="middle" fontSize={56} fill={YEL}>{Math.min(7, Math.floor(k * 7.99))}:{String(Math.floor((t * 60) % 60)).padStart(2, '0')}</text>
        <text y={95} textAnchor="middle" fontSize={30} fill="#fff">{label}</text>
      </g>
    </g>
  );
};

/** nido con huevos de colores */
export const Nest: React.FC<{t: number; k: number; glow?: boolean}> = ({t, k, glow}) => (
  <g>
    <rect width={1920} height={1080} fill="#3b2a78" />
    <Stars t={t} n={60} />
    <g transform={`translate(960 640) scale(${0.6 + 0.4 * k})`}>
      {EGG.map((c, i) => { const x = (i - 2) * 90, y = -60 - Math.abs(i - 2) * -8 + Math.sin(t * 3 + i) * 4; return (
        <g key={i} transform={`translate(${x} ${y})`} style={{filter: glow ? `drop-shadow(0 0 22px ${c})` : undefined}}>
          <ellipse rx={48} ry={64} fill={c} stroke="#111" strokeWidth={6} />
          <path d="M -46 -5 L -25 -20 L -5 -5 L 15 -20 L 35 -5 L 46 -15" stroke="#fff" strokeWidth={8} fill="none" />
          <circle cx={-15} cy={25} r={9} fill="#fff" /><circle cx={18} cy={30} r={7} fill="#fff" />
        </g>
      ); })}
      <ellipse cx={0} cy={10} rx={300} ry={80} fill="#8a5a2b" stroke="#111" strokeWidth={8} />
      {Array.from({length: 22}).map((_, i) => <path key={i} d={`M ${-290 + i * 27} ${-10 + rnd(i) * 20} q 20 ${40 + rnd(i + 3) * 30} 50 ${10}`} stroke="#5c3a17" strokeWidth={6} fill="none" />)}
    </g>
  </g>
);

/** huevo que cae a la carretera y se rompe (k = 0..1 caida) */
export const EggDrop: React.FC<{t: number; k: number}> = ({t, k}) => {
  const y = 120 + 700 * easeOut(Math.min(1, k * 1.3)) ** 2, broke = k > 0.75;
  return (
    <g>
      <rect width={1920} height={1080} fill="#1a1238" />
      <rect y={820} width={1920} height={260} fill="#2b2b3a" />
      {Array.from({length: 8}).map((_, i) => <rect key={i} x={((i * 280 - t * 300) % 2240) - 160} y={940} width={160} height={18} fill={YEL} />)}
      {!broke ? <g transform={`translate(960 ${y}) rotate(${k * 720})`}><ellipse rx={48} ry={64} fill={PINK} stroke="#111" strokeWidth={6} /><path d="M -46 -5 L -25 -20 L -5 -5 L 15 -20 L 35 -5 L 46 -15" stroke="#fff" strokeWidth={8} fill="none" /></g>
        : <g transform="translate(960 830)">
          {Array.from({length: 10}).map((_, i) => { const a = (i / 10) * Math.PI * 2, d = 60 + (k - 0.75) * 900; return <path key={i} d="M 0 0 l 20 -10 l 10 20 Z" fill={EGG[i % 5]} transform={`translate(${Math.cos(a) * d} ${Math.sin(a) * d * 0.4 - (k - 0.75) * 200})`} />; })}
          <ellipse rx={90} ry={22} fill="#FFD23F" />
          {Array.from({length: 16}).map((_, i) => { const a = (i / 16) * Math.PI * 2; return <line key={i} x1={0} y1={-30} x2={Math.cos(a) * 400 * (k - 0.6)} y2={-30 + Math.sin(a) * 400 * (k - 0.6)} stroke={CYAN} strokeWidth={6} opacity={1.2 - k} />; })}
        </g>}
    </g>
  );
};

/** perro en moto de agua con gafas y chaleco */
export const JetDog: React.FC<{t: number; x?: number}> = ({t, x = 960}) => {
  const bob = Math.sin(t * 5) * 10;
  return (
    <g>
      <rect width={1920} height={1080} fill="#7cc7ff" />
      <circle cx={1300} cy={220} r={90} fill="#FFE27A" />
      <Sea t={t} level={700} wave={1} />
      <g transform={`translate(${x} ${640 + bob}) rotate(${Math.sin(t * 5) * 3})`}>
        {Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={-240 - i * 50 - ((t * 400) % 50)} cy={70 + rnd(i) * 10} rx={40 - i * 5} ry={14} fill="#fff" opacity={0.8 - i * 0.12} />)}
        <path d="M -230 40 L 220 40 Q 260 40 240 80 L -200 90 Q -240 80 -230 40 Z" fill="#E63946" stroke="#111" strokeWidth={8} />
        <rect x={-120} y={10} width={200} height={34} rx={14} fill="#111" />
        <path d="M 90 30 L 140 -40" stroke="#111" strokeWidth={14} /><rect x={110} y={-60} width={70} height={18} rx={8} fill="#111" />
        {/* perro */}
        <g transform="translate(10 -40)">
          <ellipse cx={0} cy={0} rx={70} ry={58} fill="#E9B96E" stroke="#111" strokeWidth={6} />
          <path d="M -60 -30 L 60 -30 L 50 40 L -50 40 Z" fill="#FF8C1A" stroke="#111" strokeWidth={6} />
          <rect x={-58} y={-8} width={116} height={14} fill="#FFD23F" />
          <g transform="translate(60 -80)">
            <ellipse cx={0} cy={0} rx={52} ry={46} fill="#E9B96E" stroke="#111" strokeWidth={6} />
            <ellipse cx={52} cy={16} rx={34} ry={24} fill="#E9B96E" stroke="#111" strokeWidth={6} />
            <circle cx={82} cy={10} r={9} fill="#111" />
            <path d={`M -36 -20 Q -70 ${10 + Math.sin(t * 10) * 15} -50 40`} fill="#c98f45" stroke="#111" strokeWidth={6} />
            <rect x={-6} y={-22} width={64} height={30} rx={12} fill={CYAN} stroke="#111" strokeWidth={6} opacity={0.9} />
            <path d="M -40 -10 L -6 -8" stroke="#111" strokeWidth={6} />
            <path d={`M 60 38 q 8 ${18 + Math.sin(t * 9) * 4} 18 0`} fill="#FF6B8A" stroke="#111" strokeWidth={4} />
          </g>
        </g>
      </g>
    </g>
  );
};

/** coche deportivo naranja estilo 1997 con matricula */
export const FFCar: React.FC<{t: number; k: number; plate?: string}> = ({t, k, plate = 'DUDE, I ALMOST HAD YOU'}) => (
  <g>
    <rect width={1920} height={1080} fill="#1a0b33" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={((i * 190 - t * 900) % 2280) - 180} y={300 + rnd(i) * 200} width={8} height={2 + rnd(i) * 3} fill="#fff" opacity={0.5} transform={`scale(20 1)`} />)}
    <rect y={760} width={1920} height={320} fill="#2b2b3a" />
    <g transform={`translate(960 ${640 + Math.sin(t * 20) * 2}) scale(1.15)`}>
      <ellipse cx={0} cy={110} rx={330} ry={26} fill="#000" opacity={0.5} />
      <path d="M -320 70 L -300 0 Q -200 -20 -120 -30 Q -60 -95 40 -95 Q 150 -90 210 -25 L 320 -5 Q 345 30 330 80 Z" fill="#FF7A1A" stroke="#111" strokeWidth={8} />
      <path d="M -100 -35 Q -50 -85 40 -85 Q 120 -82 175 -30 Z" fill="#1d3557" stroke="#111" strokeWidth={6} />
      <path d="M -280 -10 Q 0 40 300 0" stroke="#111" strokeWidth={5} fill="none" opacity={0.6} />
      <path d="M -330 -5 L -250 -40 L -230 -40 L -250 -5 Z" fill="#111" />
      {[-200, 200].map((x) => <g key={x} transform={`translate(${x} 80) rotate(${t * 900})`}><circle r={58} fill="#111" /><circle r={30} fill="#adb5bd" /><rect x={-4} y={-30} width={8} height={60} fill="#555" /></g>)}
    </g>
    <g transform={`translate(960 470) scale(${(0.3 + 0.7 * k) * 0.9})`} opacity={k} fontFamily={F} fontWeight={900}>
      <rect x={-320} y={-90} width={640} height={180} rx={20} fill="#fff" stroke="#111" strokeWidth={10} />
      <text y={-42} textAnchor="middle" fontSize={30} fill={PINK}>LEONIDA</text>
      <text y={20} textAnchor="middle" fontSize={50} fill="#1B0B3A">{plate.split(',')[0]},</text>
      <text y={72} textAnchor="middle" fontSize={50} fill="#1B0B3A">{plate.split(',')[1]?.trim()}</text>
    </g>
  </g>
);

/** bosque nocturno con Bigfoot visto por una camara */
export const Bigfoot: React.FC<{t: number; x?: number; rec?: boolean}> = ({t, x = 960, rec = true}) => {
  const step = Math.sin(t * 5);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0d1f1a" />
      {Array.from({length: 14}).map((_, i) => { const tx = i * 150 + 20, h = 600 + rnd(i) * 300; return <g key={i} opacity={0.5 + rnd(i + 2) * 0.5}><rect x={tx} y={1000 - h} width={26} height={h} fill="#1a1208" /><path d={`M ${tx - 90} ${1000 - h + 260} L ${tx + 13} ${1000 - h - 40} L ${tx + 116} ${1000 - h + 260} Z`} fill="#123b2a" /></g>; })}
      <rect y={960} width={1920} height={120} fill="#0a140f" />
      <g transform={`translate(${x} 960)`}>
        <path d={`M -70 -380 Q -110 -440 -60 -470 Q 0 -500 60 -470 Q 110 -440 70 -380 L 110 -180 L ${70 + step * 30} 0 L 30 0 L 10 -150 L -10 -150 L ${-30 - step * 30} 0 L ${-70 + step * 10} 0 L -110 -180 Z`} fill="#3a2414" stroke="#111" strokeWidth={6} />
        <path d={`M -100 -380 Q -170 -280 ${-150 + step * 30} -170`} stroke="#3a2414" strokeWidth={46} strokeLinecap="round" fill="none" />
        <path d={`M 100 -380 Q 170 -280 ${150 - step * 30} -170`} stroke="#3a2414" strokeWidth={46} strokeLinecap="round" fill="none" />
        <circle cx={-18} cy={-445} r={7} fill="#FFD23F" /><circle cx={18} cy={-445} r={7} fill="#FFD23F" />
      </g>
      <rect width={1920} height={1080} fill="#4cff7a" opacity={0.12} />
      {rec && <g fontFamily={F} fontWeight={900}>
        <path d="M 700 140 L 700 90 L 750 90 M 1170 90 L 1220 90 L 1220 140 M 700 900 L 700 950 L 750 950 M 1170 950 L 1220 950 L 1220 900" stroke="#fff" strokeWidth={8} fill="none" />
        {Math.sin(t * 6) > 0 && <circle cx={740} cy={190} r={16} fill="#FF2D2D" />}
        <text x={770} y={205} fontSize={44} fill="#fff">REC</text>
      </g>}
    </g>
  );
};

/** Monte Chiliad con el mural del misterio */
export const Chiliad: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect width={1920} height={1080} fill="#16213e" />
    <Stars t={t} n={80} />
    <path d="M 300 1080 L 960 260 L 1620 1080 Z" fill="#3a4a3f" stroke="#111" strokeWidth={8} />
    <path d="M 860 385 L 960 260 L 1060 385 L 1010 360 L 960 400 L 910 360 Z" fill="#e9ecef" />
    <g transform={`translate(${960 + Math.sin(t * 2) * 140} ${170 + Math.sin(t * 3) * 20}) scale(${k})`}>
      <ellipse rx={120} ry={30} fill="#adb5bd" stroke="#111" strokeWidth={6} />
      <ellipse cy={-22} rx={55} ry={34} fill={CYAN} stroke="#111" strokeWidth={6} opacity={0.85} />
      {[-80, -30, 20, 70].map((x, i) => <circle key={i} cx={x} cy={8} r={8} fill={Math.sin(t * 8 + i) > 0 ? YEL : '#555'} />)}
      <path d="M -40 30 L -120 450 L 120 450 L 40 30 Z" fill={YEL} opacity={0.12 + 0.08 * Math.sin(t * 6)} />
    </g>
    <text x={960} y={720} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={260} fill="#fff" opacity={0.85 * k} style={{filter: `drop-shadow(0 0 30px ${PINK})`}}>?</text>
  </g>
);

/** contador de anios que sube */
export const Years: React.FC<{k: number; from: number; to: number}> = ({k, from, to}) => (
  <g transform="translate(960 540)" fontFamily={F} fontWeight={900}>
    <rect x={-300} y={-150} width={600} height={300} rx={40} fill="#0B0620" stroke={PINK} strokeWidth={10} />
    <text y={70} textAnchor="middle" fontSize={190} fill="#fff">{Math.round(from + (to - from) * easeOut(k))}</text>
  </g>
);
export {ramp, easeOut, GY};
