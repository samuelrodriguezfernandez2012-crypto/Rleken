import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Room, Door, CityNight} from '../futuro/props';
import {Street, Car} from '../largo1/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Moon, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 69.5;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|doble|metros|km|everest|tierra|luna|mitad/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

// regla de altura a la izquierda del personaje
const Ruler: React.FC<{x: number; top: number; bottom: number; label: string}> = ({x, top, bottom, label}) => (
  <g>
    <line x1={x} y1={top} x2={x} y2={bottom} stroke="#FFD23F" strokeWidth={5} />
    <line x1={x - 18} y1={top} x2={x + 18} y2={top} stroke="#FFD23F" strokeWidth={5} />
    <line x1={x - 18} y1={bottom} x2={x + 18} y2={bottom} stroke="#FFD23F" strokeWidth={5} />
    <text x={x - 26} y={(top + bottom) / 2} textAnchor="end" fontFamily="Montserrat" fontWeight={900} fontSize={44} fill="#FFD23F" stroke="#0B0A1A" strokeWidth={6} paintOrder="stroke">{label}</text>
  </g>
);
const House: React.FC<{x: number; s?: number}> = ({x, s = 1}) => (
  <g transform={`translate(${x} ${GY}) scale(${s})`}>
    <rect x={-90} y={-130} width={180} height={130} fill="#E9C46A" stroke="#111" strokeWidth={6} />
    <path d="M -110 -130 L 0 -210 L 110 -130 Z" fill="#C1440E" stroke="#111" strokeWidth={6} />
    <rect x={-20} y={-70} width={40} height={70} fill="#6B4226" />
  </g>
);
const Tank: React.FC<{x: number; s?: number}> = ({x, s = 1}) => (
  <g transform={`translate(${x} ${GY}) scale(${s})`}>
    <rect x={-60} y={-40} width={120} height={30} rx={8} fill="#4B5D3A" stroke="#111" strokeWidth={4} />
    <rect x={-30} y={-62} width={60} height={24} rx={6} fill="#5A6E45" stroke="#111" strokeWidth={4} />
    <rect x={20} y={-56} width={70} height={8} fill="#3A4A2C" transform="rotate(-25 20 -52)" />
    <rect x={-66} y={-14} width={132} height={14} rx={7} fill="#222" />
  </g>
);
const Mountains: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#8EC5E8" />
    {[[300, 520], [700, 380], [1150, 300], [1600, 460]].map(([x, h], i) => (
      <g key={i}><path d={`M ${x - 420} ${GY} L ${x} ${GY - h * 1.3} L ${x + 420} ${GY} Z`} fill={['#6C7A89', '#5D6D7E', '#4A5866', '#6C7A89'][i]} stroke="#111" strokeWidth={5} />
        <path d={`M ${x - 90} ${GY - h * 1.3 + 120} L ${x} ${GY - h * 1.3} L ${x + 90} ${GY - h * 1.3 + 120} Z`} fill="#fff" /></g>
    ))}
    <rect x={0} y={GY} width={1920} height={200} fill="#556B2F" />
  </g>
);
const ISS: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-12} width={120} height={24} fill="#D9D9D9" stroke="#111" strokeWidth={3} />
    {[-140, -100, 100, 140].map((dx) => <rect key={dx} x={dx - 18} y={-60} width={36} height={120} fill="#1D3557" stroke="#9FB3C8" strokeWidth={3} />)}
    <line x1={-160} y1={0} x2={160} y2={0} stroke="#9FB3C8" strokeWidth={5} />
  </g>
);

// gigante en el espacio junto a la Tierra
const space = (t: number, lt: number, earthR: number, moon = false) => (
  <Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 5)} blur={1} bg={<Stars t={t} />} hero={<>
    <Earth x={1180} y={760} r={earthR} t={t} />
    {moon && <Moon x={1020} y={430} r={60} />}
    <Hero x={820} y={1060} s={1.45} t={t} pose={moon ? POSES.reach : POSES.idle} eyes="wide" mouth="o" />
  </>} />
);

const SHOTS: Shot[] = [
  // gancho: el gigante alcanza la Luna, la Tierra a sus pies (avance)
  [0, (lt, t) => <V fx={950}>{space(t, lt, 150, true)}</V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.5, 1), ...shake(t, 10)}} bg={<CityNight />} hero={<><Hero x={960} y={GY + 40} s={2.2} t={t} pose={POSES.fists} eyes="angry" />{[700, 1200].map((x) => <Tank key={x} x={x} s={0.6} />)}</>} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={{...kbV(lt, 1.0, 1.2, 1), ...shake(t, 6)}} bg={<Mountains />} hero={<Hero x={960} y={GY + 30} s={2.0} t={t} eyes="wide" />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.4, 1.2, 1)} bg={<Room />} hero={<Hero x={960} s={1.25} t={t} eyes="wide" mouth="o" />} /></V>],
  // dia 1: normal
  [2.4, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 4)} bg={<Room />} mid={<Door x={1350} />} hero={<><Hero x={960} s={1.2} t={t} /><Ruler x={820} top={GY - 1.2 * 365} bottom={GY} label="1,70 M" /></>} /></V>],
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.6, 1.9, 4, 960, 430)} bg={<Room night />} hero={<Hero x={1250} y={720} s={1.1} t={t} rotate={-90} eyes="closed" />} /></V>],
  [T('2'), (lt, t) => <V fx={1100}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.1, 4)} bg={<Room />} mid={<Door x={1300} />} hero={<><Hero x={1100} y={GY + 20} s={2.2} t={t} pose={POSES.headHold} eyes="wide" mouth="o" /><Ruler x={820} top={GY - 2.2 * 365 + 20} bottom={GY} label="3,40 M" /></>} /></V>],
  [T('5'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 5)} bg={<Street />} hero={<><House x={760} s={0.7} /><Hero x={1080} y={GY + 20} s={2.3} t={t} pose={POSES.shrug} eyes="side" /><Ruler x={900} top={GY - 2.3 * 365} bottom={GY} label="27 M" /></>} /></V>],
  [T('8'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.15, 5), ...shake(t, 3)}} bg={<CityNight />} hero={<><Hero x={960} y={GY + 30} s={2.4} t={t} pose={POSES.scared} eyes="wide" mouth="o" />{[620, 760, 1180, 1320].map((x, i) => <Tank key={x} x={x} s={0.35} />)}{Array.from({length: 6}).map((_, i) => <line key={i} x1={600 + i * 150} y1={GY - 20} x2={900 + i * 30} y2={GY - 600 + Math.sin(t * 9 + i) * 40} stroke="#FFB347" strokeWidth={3} opacity={0.6 * Math.abs(Math.sin(t * 7 + i))} />)}</>} /></V>],
  [T('10'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.1, 1.0, 3), ...shake(t, 10 * Math.abs(Math.sin(t * 3)))}} bg={<CityNight lights={false} />} hero={<><Hero x={960} y={GY + 40} s={2.2} t={t} pose={POSES.fly} eyes="angry" /><ellipse cx={960} cy={GY + 40} rx={600 * (0.5 + 0.5 * Math.abs(Math.sin(t * 3)))} ry={40} fill="none" stroke="#FFD23F" strokeWidth={6} opacity={0.6} /></>} /></V>],
  [T('14'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.1, 5)} bg={<Mountains />} hero={<><Hero x={960} y={GY + 200} s={2.4} t={t} pose={POSES.headHold} eyes="closed" mouth="o" sweat /><Ruler x={760} top={GY + 200 - 2.4 * 365} bottom={GY} label="14 KM" /></>} /></V>],
  [T('19'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 5, 960, 300)} blur={1} bg={<Stars t={t} />} hero={<><circle cx={960} cy={3200} r={2500} fill="#1C5FB8" /><circle cx={960} cy={3200} r={2520} fill="none" stroke="#6EC1FF" strokeWidth={30} opacity={0.4} /><Hero x={960} y={1060} s={2.3} t={t} eyes="wide" /><ISS x={1240} y={420} s={0.6} /></>} /></V>],
  [T('24'), (lt, t) => <V fx={950}>{space(t, lt, 150 - Math.min(1, lt / 3) * 30)}</V>],
  [T('29'), (lt, t) => <V fx={950}>{space(t, lt, 90, true)}</V>],
  // giro: ahora encoge
  [T('pero', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.6, 1.9, 4, 960, 430)} bg={<Room night />} hero={<Hero x={1250} y={720} s={1.1} t={t} rotate={-90} eyes="closed" />} /></V>],
  [T('desperté'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 5, 960, 800)} blur={2} bg={<g><rect width={1920} height={1080} fill="#9ED8FF" />{Array.from({length: 16}).map((_, i) => <path key={i} d={`M ${i * 130} ${GY} q 30 -${500 + rnd(i) * 300} 70 -${700 + rnd(i) * 200}`} stroke="#2D6A4F" strokeWidth={40} fill="none" />)}<rect y={GY} width={1920} height={200} fill="#40916C" /></g>} hero={<><g transform={`translate(1300 ${GY}) scale(3)`}><path d="M -160 0 L -160 -80 Q -150 -140 -60 -150 L 80 -150 Q 160 -140 170 -60 L 170 0 Z" fill="#E63946" stroke="#111" strokeWidth={4} /><rect x={-170} y={-10} width={350} height={14} fill="#fff" stroke="#111" strokeWidth={3} /></g><Hero x={760} y={GY} s={0.5} t={t} eyes="wide" mouth="o" /></>} /></V>],
  [T('porque'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.6, 2.4, 6, 960, 430)} bg={<Room night />} hero={<Hero x={960} s={1.2} t={t} eyes="glow" />} /></V>],
  [T('qué'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.2, 5)} bg={<Stars t={t} />} hero={<><Earth x={1150} y={780} r={120} t={t} /><Hero x={820} y={1060} s={1.3} t={t} pose={POSES.pointDown} eyes="happy" mouth="grin" /><g transform={`translate(1150 ${380 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const DobleShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('doble/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('2'), T('5'), T('8'), T('10'), T('14'), T('19'), T('24'), T('29'), T('desperté')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={2.35} a="×2 CADA DÍA" b="DÍA 29: LA LUNA" size={130} />
      <VBig t={t} at={T('pero')} until={T('2') - 0.05} a="CADA MAÑANA" b="EL DOBLE" size={140} />
      <VBig t={t} at={T('2')} until={T('5') - 0.05} a="DÍA 2" b="3,40 M" size={150} />
      <VBig t={t} at={T('5')} until={T('8') - 0.05} a="DÍA 5" b="27 M" size={150} />
      <VBig t={t} at={T('8')} until={T('10') - 0.05} a="DÍA 8" b="217 M" size={150} />
      <VBig t={t} at={T('10')} until={T('14') - 0.05} a="DÍA 10" b="1 KM" size={150} />
      <VBig t={t} at={T('14')} until={T('19') - 0.05} a="DÍA 14" b="14 KM" size={150} />
      <VBig t={t} at={T('19')} until={T('24') - 0.05} a="DÍA 19" b="445 KM" size={150} />
      <VBig t={t} at={T('24')} until={T('29') - 0.05} a="DÍA 24" b="> LA TIERRA" size={150} />
      <VBig t={t} at={T('29')} until={T('pero', 2) - 0.05} a="DÍA 29" b="TOCO LA LUNA" size={140} />
      <VBig t={t} at={T('mitad')} until={T('qué') - 0.05} a="AHORA ENCOJO" b="÷2 CADA DÍA" size={130} color2="#7CF4FF" />
      <VBig t={t} at={T('qué')} a="¿QUÉ HARÍAS" b="TÚ?" size={140} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const DobleThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={950}>{space(0.5, 0, 150, true)}</V>
      <VBig t={1} at={0} a="×2 CADA DÍA" b="DÍA 29: LA LUNA" size={140} y={180} />
    </AbsoluteFill>
  );
};
