import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Shockwave, Debris} from '../nivel0largo/fight';
import words from './words.json';

export const DURATION_S = 44;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|paracaídas|paraguas|suelo|sábana|globo|garnerin|leonardo|vinci|funcionó/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

const Sky: React.FC<{t: number; ground?: boolean; old?: boolean}> = ({t, ground = true, old}) => (
  <g>
    <rect width={1920} height={1080} fill={old ? '#E9D8A6' : '#8EC5E8'} />
    {Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={(rnd(i) * 2200 + t * 30) % 2200 - 140} cy={140 + rnd(i + 2) * 420} rx={200} ry={60} fill="#fff" opacity={0.85} />)}
    {ground && <><rect y={GY} width={1920} height={200} fill="#6FA35A" /><rect y={GY} width={1920} height={14} fill="#4F7D3D" /></>}
  </g>
);
const Roof: React.FC = () => (
  <g><rect x={300} y={GY - 200} width={460} height={200} fill="#B5838D" stroke="#111" strokeWidth={6} />{[0, 1].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={350 + c * 220} y={GY - 170 + r * 90} width={140} height={60} fill="#BDE0FE" stroke="#111" strokeWidth={5} />))}</g>
);
/** cabeza vendada: tiritas en cruz segun numero de golpes */
const Bandage: React.FC<{x: number; y: number; s: number; n: number}> = ({x, y, s, n}) => (
  <g transform={`translate(${x} ${y - 455 * s / 1.5}) scale(${s / 1.5})`}>
    {n >= 1 && <rect x={-60} y={-14} width={120} height={28} rx={10} fill="#F1FAEE" stroke="#999" strokeWidth={3} transform="rotate(-25)" />}
    {n >= 2 && <rect x={-60} y={-14} width={120} height={28} rx={10} fill="#F1FAEE" stroke="#999" strokeWidth={3} transform="rotate(25)" />}
  </g>
);
const Umbrella: React.FC<{x: number; y: number; flip: number}> = ({x, y, flip}) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={0} y1={0} x2={0} y2={170} stroke="#111" strokeWidth={8} />
    <path d={`M -150 0 Q 0 ${-120 + flip * 240} 150 0 Z`} fill="#E63946" stroke="#111" strokeWidth={7} />
  </g>
);
const Sheet: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -70 0 Q 0 ${-40 + Math.sin(t * 20) * 14} 70 0 L 50 30 L -50 30 Z`} fill="#A8DADC" stroke="#111" strokeWidth={6} />
    <path d="M -50 30 L -20 140 M 50 30 L 20 140" stroke="#111" strokeWidth={4} />
  </g>
);
const Canopy: React.FC<{x: number; y: number; k?: number; old?: boolean}> = ({x, y, k = 1, old}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M -300 0 Q 0 -320 300 0 Q 150 -40 0 0 Q -150 -40 -300 0 Z" fill={old ? '#E9C46A' : '#F4A261'} stroke="#111" strokeWidth={8} />
    {[-300, -150, 0, 150, 300].map((dx) => <line key={dx} x1={dx} y1={0} x2={0} y2={300} stroke="#111" strokeWidth={3} />)}
  </g>
);
const Balloon: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={-260} rx={220} ry={260} fill="#E63946" stroke="#111" strokeWidth={8} />
    {[-120, 0, 120].map((dx) => <path key={dx} d={`M ${dx} -510 Q ${dx * 1.6} -260 ${dx * 0.4} 0`} stroke="#FFD166" strokeWidth={14} fill="none" />)}
    <path d="M -80 0 L -60 90 M 80 0 L 60 90" stroke="#111" strokeWidth={5} />
    <rect x={-80} y={90} width={160} height={90} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
  </g>
);
const Pyramid: React.FC<{x: number; y: number; draw?: number; ink?: boolean}> = ({x, y, draw = 1, ink}) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke={ink ? '#5E3A1A' : '#111'} strokeWidth={ink ? 5 : 8} strokeDasharray={ink ? 2400 : undefined} strokeDashoffset={ink ? 2400 * (1 - draw) : undefined}>
    {!ink && <path d="M 0 -300 L -260 0 L 260 0 Z" fill="#E9C46A" />}
    <path d="M 0 -300 L -260 0 L 260 0 Z M 0 -300 L 60 0" />
    <path d="M -260 0 L 0 240 M 260 0 L 0 240 M 60 0 L 0 240" strokeWidth={ink ? 3 : 4} />
  </g>
);

const SHOTS: Shot[] = [
  // gancho: avance del golpe y del exito
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={{...kbV(lt, 1.3, 1.6, 1), ...(lt > 0.9 ? shake(t, 12) : {})}} bg={<Sky t={t} />} hero={<><g transform={`translate(0 ${Math.min(1, lt / 0.9) ** 2 * 160})`}><Umbrella x={990} y={300} flip={1} /><Hero x={960} y={740} s={1.1} t={t} pose={POSES.armsUp} eyes="scared" mouth="open" /></g>{lt > 0.9 && <><Shockwave x={960} y={GY} t={t} at={0.9} max={900} /><Debris x={960} t={t} at={0.9} /></>}</>} /></V>],
  [1.4, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.2, 1.4, 0.7)} bg={<Sky t={t} ground={false} />} hero={<><Canopy x={960} y={260} /><Hero x={960} y={820} s={1.1} t={t} pose={POSES.armsUp} eyes="happy" mouth="grin" /></>} /></V>],
  // intento 1: paraguas
  [T('intento'), (lt, t) => { const fall = ramp(t, T('vuelta') - 0.2, T('al')); const y = 380 + fall * fall * 200; return <V fx={700}><Cine t={t} mood="day" cam={{...kbV(lt, 1.0, 1.15, 4, 700, 500), ...(t > T('al') && t < T('al') + 0.5 ? shake(t, 14) : {})}} bg={<><Sky t={t} /><Roof /></>} hero={<><g transform={`translate(${Math.min(1, ramp(lt, 0.8, 1.4)) * 200} ${t < T('vuelta') - 0.2 ? Math.max(0, lt - 1.2) * 60 : y - 380})`}><Umbrella x={570} y={GY - 570} flip={ramp(t, T('vuelta'), T('vuelta') + 0.2)} /><Hero x={540} y={GY - 200} s={1.0} t={t} pose={POSES.armsUp} eyes={t > T('vuelta') ? 'scared' : 'happy'} mouth={t > T('vuelta') ? 'open' : 'grin'} /></g>{t > T('al') && <><Shockwave x={740} y={GY} t={t} at={T('al')} max={700} /><Debris x={740} t={t} at={T('al')} /></>}</>} /></V>; }],
  [T('suelo') + 0.3, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.2, 1.3, 1)} bg={<Sky t={t} />} hero={<><Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.kneel} eyes="closed" mouth="frown" /><Bandage x={960} y={GY + 20} s={1.4} n={1} /></>} /></V>],
  // intento 2: sabana
  [T('intento', 2), (lt, t) => { const y = 640 + Math.min(1, ramp(t, T('demasiado'), T('suelo', 2))) ** 2 * 260; return <V fx={960}><Cine t={t} mood="day" cam={{...kbV(lt, 1.0, 1.2, 5), ...(t > T('suelo', 2) && t < T('suelo', 2) + 0.5 ? shake(t, 14) : {})}} bg={<Sky t={t} />} hero={<><Sheet x={960} y={y - 430} t={t} /><Hero x={960} y={y} s={1.0} t={t} pose={POSES.armsUp} eyes="scared" mouth="open" /><Bandage x={960} y={y} s={1.0} n={1} />{t > T('suelo', 2) && <Shockwave x={960} y={GY} t={t} at={T('suelo', 2)} max={700} />}</>} /></V>; }],
  // intento 3: el taller
  [T('intento', 3), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 4)} bg={<rect width={1920} height={1080} fill="#E9D8C4" />} hero={<><Hero x={790} y={GY + 20} s={1.1} t={t} pose={POSES.point} eyes="happy" mouth="smile" /><Bandage x={790} y={GY + 20} s={1.1} n={2} /><g opacity={ramp(t, T('tela') - 0.1, T('tela') + 0.2)}><Canopy x={1120} y={430} k={0.45} /></g><g opacity={ramp(t, T('cuerdas') - 0.1, T('cuerdas') + 0.2)}>{[-1, 1].map((d) => <path key={d} d={`M ${1120 + d * 130} 430 L ${1120 + d * 40} 620`} stroke="#111" strokeWidth={5} />)}</g><g opacity={ramp(t, T('cesta') - 0.1, T('cesta') + 0.2)}><rect x={1060} y={620} width={120} height={80} fill="#8B5A3C" stroke="#111" strokeWidth={6} /></g></>} /></V>],
  // globo
  [T('te'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Sky t={t} ground={lt < 1.2} />} hero={<g transform={`translate(0 ${-lt * 120})`}><Balloon x={960} y={700} /><Hero x={960} y={850} s={0.55} t={t} eyes="wide" /></g>} /></V>],
  // salto
  [T('saltas', 2), (lt, t) => { const open = ramp(lt, 0.4, 0.8); const y = 300 + Math.min(lt, 0.6) ** 2 * 400 + Math.max(0, lt - 0.6) * 40; return <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Sky t={t} ground={false} />} hero={<><g transform={`translate(0 ${-lt * 200})`}><Balloon x={1400} y={420} /></g><g transform={`translate(${Math.sin(t * 1.5) * 30} 0)`}>{open > 0 && <Canopy x={960} y={y - 300} k={open} />}<Hero x={960} y={y + 330} s={1.0} t={t} pose={POSES.armsUp} eyes={open > 0.5 ? 'happy' : 'scared'} mouth={open > 0.5 ? 'grin' : 'open'} /><Bandage x={960} y={y + 330} s={1.0} n={2} /></g></>} /></V>; }],
  // 1797
  [T('eso'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 6)} bg={<g style={{filter: 'sepia(0.85)'}}><Sky t={t} old /></g>} hero={<g style={{filter: 'sepia(0.7)'}}><Balloon x={1350} y={360} /><Canopy x={860} y={340 + lt * 30} k={0.8} old /><Hero x={860} y={640 + lt * 30} s={0.8} t={t} pose={POSES.armsUp} eyes="happy" /></g>} /></V>],
  // Leonardo
  [T('y', 3), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 6)} bg={<rect width={1920} height={1080} fill="#D4B483" />} hero={<><rect x={560} y={140} width={800} height={800} fill="#F1E3C1" stroke="#8B5A3C" strokeWidth={10} /><Pyramid x={960} y={540} draw={easeOut(ramp(lt, 0.8, 4))} ink />{Array.from({length: 6}).map((_, i) => <line key={i} x1={620} y1={820 + i * 20} x2={620 + 200 + rnd(i) * 300} y2={820 + i * 20} stroke="#8B5A3C" strokeWidth={3} opacity={ramp(lt, 2, 3)} />)}</>} /></V>],
  // 2000: funciona
  [T('en', 3), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 5)} bg={<Sky t={t} ground={false} />} hero={<g transform={`translate(${Math.sin(t * 1.3) * 25} ${lt * 30})`}><Pyramid x={960} y={420} /><Hero x={960} y={940} s={0.9} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /></g>} /></V>],
  [T('qué'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Sky t={t} />} hero={<><Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.shrug} eyes="happy" mouth="grin" /><Bandage x={960} y={GY + 20} s={1.4} n={2} /><g transform={`translate(1320 ${1080 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const InventaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('inventa/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[1.4, T('intento'), T('intento', 2), T('intento', 3), T('eso'), T('y', 3)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.12} max={0.4} />)}
      <VBig t={t} at={0.03} until={T('intento') - 0.05} a="ASÍ INVENTAS" b="EL PARACAÍDAS" size={110} color2="#F4A261" />
      <VBig t={t} at={T('intento')} until={T('intento', 2) - 0.05} a="INTENTO 1" b="PARAGUAS" size={140} color2="#E63946" />
      <VBig t={t} at={T('intento', 2)} until={T('intento', 3) - 0.05} a="INTENTO 2" b="SÁBANA" size={140} color2="#4EA8DE" />
      <VBig t={t} at={T('intento', 3)} until={T('eso') - 0.05} a="INTENTO 3" b={t > T('te') ? '1.000 METROS' : 'TELA + CUERDAS'} size={130} color2="#F4A261" />
      <VBig t={t} at={T('eso')} until={T('y', 3) - 0.05} a="1797" b="PRIMER SALTO" size={160} color2="#FFD23F" />
      <VBig t={t} at={T('y', 3)} until={T('en', 3) - 0.05} a="LEONARDO" b="DA VINCI · 1485" size={125} color2="#8B5A3C" />
      <VBig t={t} at={T('en', 3)} until={T('qué') - 0.05} a="AÑO 2000" b="✓ FUNCIONÓ" size={140} color2="#7BF59A" />
      <VBig t={t} at={T('qué')} a="¿QUÉ INVENTAMOS" b="AHORA?" size={115} color2="#FFD23F" />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const InventaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="day" cam={kbV(0, 1.3, 1.3, 1)} bg={<Sky t={1} />} hero={<><Umbrella x={980} y={300} flip={1} /><Hero x={960} y={760} s={1.3} t={1} pose={POSES.armsUp} eyes="scared" mouth="open" /><Bandage x={960} y={760} s={1.3} n={2} /></>} /></V>
      <VBig t={1} at={0} a="ASÍ INVENTAS" b="EL PARACAÍDAS" size={110} y={180} color2="#F4A261" />
    </AbsoluteFill>
  );
};
