import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {LW, CF, Cine, CText, Flash, kb, pop, GY, rnd} from '../futuro/kit';
import {Hero, POSES, Room, CityNight} from '../futuro/props';
import {pick, Shot, Stars, Earth, Sea, ramp, easeOut} from '../futuro/vkit';
import {Desert, Bottle, Vessel, Heart, Bars, Cell} from '../agua/Main';
import {Space, Float, Puff, Bubbles, Chamber} from '../espacio/Main';
import {Shadows, Brain, Clock, Book, Count} from '../insomnio/Main';
import {Lungs} from '../tiempo/Main';
import wordsJson from './words.json';
import startsJson from '../../../assets/limites/starts.json';

type Wd = {text: string; start_ms: number; end_ms: number};
const WORDS = wordsJson as Wd[];
const ST = (startsJson as {start: number}[]).map((s) => s.start);
const TOTAL = WORDS[WORDS.length - 1].end_ms / 1000;
export const DURATION_S = Math.ceil(TOTAL + 3);
const nm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
/** instante de la n-esima palabra `w` dentro del capitulo c */
const W = (c: number, w: string, n = 1) => {
  const a = ST[c] - 0.3, b = c + 1 < ST.length ? ST[c + 1] - 0.3 : 1e9;
  let k = 0;
  for (const x of WORDS) { const s = x.start_ms / 1000; if (s >= a && s < b && nm(x.text) === nm(w) && ++k === n) return s; }
  throw new Error(`palabra no encontrada: ${c} ${w} ${n}`);
};
const Wl = (c: number, w: string) => { let n = 1, last = -1; for (;;) { try { last = W(c, w, n++); } catch { return last; } } };
const kbL = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, s0, s1, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

// ---------- escenas nuevas ----------
const Pool: React.FC<{t: number; o2: number}> = ({t, o2}) => (
  <g>
    <rect width={1920} height={1080} fill="#0B6E99" />
    {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${i * 180 + Math.sin(t + i) * 30} 0 L ${i * 180 + 120 + Math.sin(t + i) * 30} 1080`} stroke="#7CF4FF" strokeWidth={30} opacity={0.08} />)}
    <rect y={GY + 40} width={1920} height={200} fill="#E0F4FF" opacity={0.5} />
    <g transform="translate(1500 260)"><rect x={-40} y={0} width={80} height={500} rx={20} fill="#0B3954" stroke="#fff" strokeWidth={6} /><rect x={-30} y={490 - 480 * o2} width={60} height={480 * o2} rx={14} fill={o2 < 0.3 ? '#FF4D6D' : '#7BF59A'} /><text x={0} y={-20} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={50} fill="#fff">O₂</text></g>
  </g>
);
const IceLake: React.FC<{t: number; temp?: number}> = ({t, temp}) => (
  <g>
    <rect width={1920} height={1080} fill="#BDE0FE" />
    <rect y={420} width={1920} height={660} fill="#0B3954" />
    <rect y={400} width={1920} height={60} fill="#E0F4FF" stroke="#9FB3C8" strokeWidth={4} />
    <ellipse cx={960} cy={430} rx={220} ry={30} fill="#0B3954" />
    {Array.from({length: 14}).map((_, i) => <circle key={i} cx={900 + Math.sin(i * 2 + t * 2) * 80} cy={1000 - ((t * 80 + i * 60) % 560)} r={8} fill="none" stroke="#BDE0FE" strokeWidth={3} />)}
    {temp != null && <g transform="translate(1520 640)"><rect x={-30} y={-260} width={60} height={320} rx={30} fill="#F1FAEE" stroke="#111" strokeWidth={6} /><rect x={-16} y={60 - 300 * (temp / 37)} width={32} height={300 * (temp / 37)} fill="#4EA8DE" /><circle cx={0} cy={80} r={50} fill="#4EA8DE" stroke="#111" strokeWidth={6} /><text x={70} y={-80} fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#fff">{temp.toFixed(1).replace('.', ',')}°C</text></g>}
  </g>
);
const Sauna: React.FC<{t: number; temp: number}> = ({t, temp}) => (
  <g>
    <rect width={1920} height={1080} fill="#8B5A3C" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={0} y={i * 90} width={1920} height={86} fill={i % 2 ? '#A0522D' : '#9C6644'} />)}
    <rect x={200} y={GY - 160} width={1520} height={60} fill="#6B4226" stroke="#111" strokeWidth={5} />
    {Array.from({length: 8}).map((_, i) => <path key={i} d={`M ${250 + i * 200} ${GY - 200} q 30 -60 0 -120 q -30 -60 0 -120`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.25 * Math.abs(Math.sin(t * 1.5 + i))} />)}
    <g transform="translate(1650 300)"><circle r={110} fill="#F1FAEE" stroke="#111" strokeWidth={8} /><text y={25} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#E63946">{Math.round(temp)}°</text></g>
  </g>
);
const Table: React.FC<{t: number; day: number; kg?: number}> = ({t, day, kg}) => (
  <g>
    <Room />
    <rect x={560} y={GY - 260} width={800} height={30} fill="#6B4226" stroke="#111" strokeWidth={5} />
    <ellipse cx={960} cy={GY - 280} rx={170} ry={36} fill="#F1FAEE" stroke="#111" strokeWidth={6} />
    <g transform="translate(1520 230)"><rect x={-130} y={-110} width={260} height={230} rx={20} fill="#fff" stroke="#111" strokeWidth={8} /><rect x={-130} y={-110} width={260} height={60} rx={20} fill="#E63946" /><text y={-65} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#fff">DÍA</text><text y={80} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={110} fill="#111">{day}</text></g>
    {kg != null && <text x={960} y={560} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={110} fill="#E63946">{Math.round(kg)} kg</text>}
  </g>
);
/** escalera de resultados: se va llenando capitulo a capitulo */
const RES = ['15 S', '1 MIN', '1 HORA', 'HORAS', '3 DÍAS', 'DÍAS', '1-2 MESES'];
const NAMES = ['ESPACIO', 'SIN AIRE', 'AGUA HELADA', 'CALOR', 'SIN AGUA', 'SIN DORMIR', 'SIN COMER'];
const Ladder: React.FC<{t: number; upto: number; at: number; hi?: number}> = ({t, upto, at, hi}) => (
  <AbsoluteFill style={{background: 'rgba(5,5,15,0.82)', opacity: easeOut(ramp(t, at, at + 0.4)), alignItems: 'center', justifyContent: 'center'}}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: 1100}}>
      {NAMES.map((n, i) => {
        const show = i < upto, k = easeOut(ramp(t, at + 0.3 + i * 0.35, at + 0.6 + i * 0.35));
        return <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '14px 36px', borderRadius: 20, background: i === hi ? '#FFD23F' : 'rgba(255,255,255,0.08)', fontFamily: CF, fontWeight: 900, fontSize: 52, color: i === hi ? '#111' : '#fff', opacity: show ? k : 0.15, transform: `translateX(${(1 - k) * -60}px)`}}><span>#{7 - i} {n}</span><span>{show ? RES[i] : '???'}</span></div>;
      })}
    </div>
  </AbsoluteFill>
);
const ChapterCard: React.FC<{t: number; at: number; n: number; title: string}> = ({t, at, n, title}) => {
  if (t < at - 0.3 || t > at + 2.6) return null;
  const k = easeOut(ramp(t, at - 0.3, at + 0.2)) * (1 - ramp(t, at + 2.2, at + 2.6));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: `rgba(5,5,15,${0.55 * k})`}}>
      <div style={{fontFamily: CF, fontWeight: 900, fontSize: 260, color: '#FFD23F', lineHeight: 0.9, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, textShadow: '0 10px 40px rgba(0,0,0,0.8)'}}>#{n}</div>
      <div style={{fontFamily: CF, fontWeight: 900, fontSize: 110, color: '#fff', opacity: k, textShadow: '0 10px 40px rgba(0,0,0,0.8)'}}>{title}</div>
    </AbsoluteFill>
  );
};

// ---------- planos ----------
const SHOTS: Shot[] = [
  // 0 intro: avance rapido de todos los capitulos
  [0, (lt, t) => <Cine t={t} mood="cold" cam={{...kbL(lt, 1.15, 1.3, 1), ...shake(t, 6)}} bg={<Space t={t} />} hero={<><Float t={t} eyes="scared" mouth="open" /><Puff x={960} y={590} t={t} at={0.05} /></>} />],
  [1.2, (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.2, 1.35, 1)} bg={<IceLake t={t} />} />],
  [2.4, (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.1, 1.3, 1)} bg={<Sauna t={t} temp={110} />} hero={<Hero x={960} y={GY - 100} s={1.2} t={t} pose={POSES.headHold} eyes="wide" sweat />} />],
  [3.6, (lt, t) => <Cine t={t} mood="night" cam={kbL(lt, 1.0, 1.2, 4)} bg={<Room night />} mid={<Shadows t={t} k={0.8} />} hero={<Hero x={960} s={1.2} t={t} eyes="wide" sweat />} />],
  [W(0, 'siete'), (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.1, 6)} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} />} />],
  [W(0, 'en'), (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.15, 6)} bg={<Table t={t} day={Math.min(382, Math.round(lt * 90))} />} hero={<Hero x={380} s={1.1} t={t} eyes="wide" />} />],
  [W(0, 'vamos', 2), (lt, t) => <Cine t={t} mood="night" cam={kbL(lt, 1.0, 1.2, 3)} bg={<CityNight />} hero={<Hero x={960} s={1.3} t={t} pose={POSES.fists} eyes="angry" />} />],
  // 1 espacio
  [ST[1], (lt, t) => <Cine t={t} mood="night" cam={kbL(lt, 1.0, 1.15, 8)} bg={<Space t={t} />} hero={<Float t={t} eyes="normal" mouth="flat" pose={POSES.shrug} />} />],
  [W(1, 'primer') - 0.3, (lt, t) => <Cine t={t} mood="cold" cam={{...kbL(lt, 1.0, 1.4, 4, 960, 520), ...(lt > 0.8 && lt < 1.4 ? shake(t, 8) : {})}} bg={<Space t={t} />} hero={<><Float t={t} eyes="wide" mouth="open" /><Puff x={960} y={590} t={t} at={W(1, 'aire', 2) + 0.1} /></>} />],
  [W(1, 'si'), (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.2, 4)} bg={<rect width={1920} height={1080} fill="#2B0A10" />} hero={<Lungs t={t} k={0} />} />],
  [W(1, 'hacia'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.2, 1.6, 8, 960, 500)} bg={<Space t={t} />} hero={<><Float t={t} eyes="wide" mouth="open" /><Bubbles x={960} y={580} t={t} /></>} />],
  [W(1, 'hacia', 2), (lt, t) => <Cine t={t} mood="night" cam={kbL(lt, 1.0, 1.3, 6)} bg={<Space t={t} />} hero={<><Float t={t} eyes={lt > 1 ? 'closed' : 'wide'} mouth="flat" pose={POSES.idle} /><rect width={1920} height={1080} fill="#000" opacity={0.45 * ramp(lt, 1, 3)} /></>} />],
  [W(1, '1966'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.25, 12)} bg={<g style={{filter: 'sepia(0.6)'}}><Chamber t={t} /></g>} hero={<g style={{filter: 'sepia(0.4)'}}><g transform="translate(960 470) scale(0.55) translate(-960 -920)"><Float t={t} eyes={lt > 7 ? 'closed' : 'wide'} mouth="open" /></g></g>} />],
  // 2 sin aire
  [ST[2], (lt, t) => <Cine t={t} mood="day" cam={kbL(lt, 1.0, 1.2, 8)} bg={<Pool t={t} o2={1 - ramp(lt, 2, 14) * 0.85} />} hero={<Hero x={900} y={GY} s={1.3} t={t} eyes={lt > 8 ? 'wide' : 'closed'} mouth="flat" />} />],
  [W(2, 'por'), (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.2, 6)} bg={<rect width={1920} height={1080} fill="#2B0A10" />} hero={<Lungs t={t} k={ramp(lt, 1, 4)} />} />],
  [W(2, 'pero'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.15, 10)} bg={<Pool t={t} o2={1 - ramp(lt, 0, 20) * 0.6} />} hero={<Hero x={900} y={GY} s={1.3} t={t} eyes="closed" mouth="flat" pose={POSES.idle} />} />],
  [W(2, '2021'), (lt, t) => <Cine t={t} mood="future" cam={kbL(lt, 1.0, 1.2, 8)} bg={<Pool t={t} o2={0.3} />} hero={<Hero x={900} y={GY} s={1.3} t={t} eyes="closed" mouth="flat" />} />],
  // 3 agua helada
  [ST[3], (lt, t) => <Cine t={t} mood="cold" cam={{...kbL(lt, 1.0, 1.2, 6), ...(lt > 4 && lt < 4.6 ? shake(t, 10) : {})}} bg={<IceLake t={t} />} hero={<Hero x={960} y={460 + Math.sin(t * 3) * 8} s={1.0} t={t} pose={POSES.armsUp} eyes="scared" mouth="open" />} />],
  [W(3, 'unos') - 0.3, (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.25, 8)} bg={<IceLake t={t} />} hero={<Hero x={960} y={460} s={1.0} t={t} pose={POSES.reach} eyes={lt > 4 ? 'closed' : 'wide'} />} />],
  [W(3, 'pero'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.15, 6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Brain t={t} off={0} />} />],
  [W(3, '1999'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.25, 20)} bg={<IceLake t={t} temp={lt > 9 ? 13.7 : undefined} />} />],
  [W(3, 'ella'), (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.15, 6)} bg={<Room />} hero={<Hero x={960} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" />} />],
  // 4 calor
  [ST[4], (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.2, 10)} bg={<Desert t={t} heat={ramp(lt, 0, 10)} />} hero={<Hero x={960} y={GY + 20} s={1.3} t={t} eyes={lt > 6 ? 'wide' : 'normal'} sweat={lt > 4} />} />],
  [W(4, 'para'), (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.15, 8)} bg={<Desert t={t} heat={0.6} />} hero={<><Hero x={960} y={GY + 20} s={1.3} t={t} pose={POSES.headHold} eyes="closed" sweat />{Array.from({length: 10}).map((_, i) => <ellipse key={i} cx={900 + rnd(i) * 140} cy={500 + ((t * 120 + i * 40) % 300)} rx={8} ry={12} fill="#7CC6FE" />)}</>} />],
  [W(4, 'en', 2), (lt, t) => <Cine t={t} mood="red" cam={{...kbL(lt, 1.0, 1.25, 14), ...(t > W(4, 'murio') && t < W(4, 'murio') + 0.6 ? shake(t, 8) : {})}} bg={<Sauna t={t} temp={70 + easeOut(ramp(lt, 0, 6)) * 40} />} hero={<>{[760, 1160].map((x, i) => <Hero key={x} x={x} y={GY - 100} s={1.1} t={t} pose={POSES.idle} eyes={lt > 8 ? 'closed' : 'wide'} sweat flip={i === 1} />)}</>} />],
  // 5 sin agua
  [ST[5], (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.2, 10)} bg={<Desert t={t} heat={0.4} />} hero={<><Hero x={1150} y={GY + 20} s={1.2} t={t} eyes="normal" sweat={lt > 6} /><Bottle x={700} y={640} k={1 - easeOut(ramp(lt, 4, 14))} /></>} />],
  [W(5, 'el', 2), (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.15, 8)} bg={<Vessel t={t} thick={easeOut(ramp(lt, 0.5, 4))} />} />],
  [W(5, 'corazon'), (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.15, 4)} bg={<rect width={1920} height={1080} fill="#3A0A10" />} hero={<Heart t={t} bpm={100 + lt * 25} />} />],
  [W(5, 'tercer') - 0.2, (lt, t) => <Cine t={t} mood="red" cam={{...kbL(lt, 1.0, 1.2, 6), x: Math.sin(t * 2.5) * 30, y: 0}} bg={<g style={{filter: `hue-rotate(${Math.sin(t * 2) * 40}deg)`}}><Desert t={t} heat={1} mirage /></g>} hero={<Hero x={1100} y={GY + 20} s={1.3} t={t} pose={POSES.reach} eyes="wide" sweat />} />],
  [W(5, 'puedes', 2), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.1, 4)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Bars t={t} at={W(5, 'puedes', 2) + 0.3} />} />],
  [W(5, '1979'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.25, 16, 700, 500)} bg={<g style={{filter: 'sepia(0.5)'}}><Cell t={t} /></g>} hero={<Hero x={700} y={GY + 20} s={1.3} t={t} pose={lt > 10 ? POSES.reach : POSES.idle} eyes="wide" />} />],
  // 6 sin dormir
  [ST[6], (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.15, 4)} bg={<Room />} hero={<><Hero x={900} s={1.2} t={t} pose={POSES.shrug} eyes="normal" /><Clock t={t} speed={3} /></>} />],
  [W(6, 'el', 2), (lt, t) => { const blink = [4.2, 6.1].some((b) => lt > b && lt < b + 0.45); return <Cine t={t} mood="future" cam={kbL(lt, 1.0, 1.15, 10)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<><Brain t={t} off={ramp(lt, 0.5, 8)} />{blink && <rect x={-200} y={-200} width={2400} height={1500} fill="#000" />}</>} />; }],
  [W(6, 'tercer') - 0.2, (lt, t) => <Cine t={t} mood="night" cam={kbL(lt, 1.0, 1.25, 10)} bg={<Room night />} mid={<Shadows t={t} k={easeOut(ramp(lt, 0.5, 3))} />} hero={<Hero x={960} s={1.2} t={t} eyes="scared" look={-0.5} sweat />} />],
  [W(6, '1964'), (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.2, 8)} bg={<g style={{filter: 'sepia(0.85)'}}><Room /></g>} hero={<g style={{filter: 'sepia(0.7)'}}><Hero x={900} s={1.2} t={t} eyes="wide" /><Clock t={t} speed={30} /></g>} />],
  [W(6, 'al'), (lt, t) => <Cine t={t} mood="cold" cam={kbL(lt, 1.0, 1.1, 8)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Count t={t} at={W(6, 'al') + 0.4} />} />],
  [W(6, 'despues'), (lt, t) => <Cine t={t} mood="red" cam={kbL(lt, 1.0, 1.2, 8)} bg={<rect width={1920} height={1080} fill="#1A0B10" />} hero={<Book t={t} stamp={easeOut(ramp(t, W(6, 'era', 2) - 0.1, W(6, 'era', 2) + 0.25))} />} />],
  // 7 sin comer
  [ST[7], (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.15, 10)} bg={<Table t={t} day={1 + Math.floor(lt / 5)} />} hero={<Hero x={380} s={1.1} t={t} eyes="normal" />} />],
  [W(7, 'pero'), (lt, t) => <Cine t={t} mood="future" cam={kbL(lt, 1.0, 1.15, 10)} bg={<Table t={t} day={3 + Math.floor(lt * 2)} />} hero={<Hero x={380} s={1.1} t={t} eyes="wide" pose={POSES.shrug} />} />],
  [W(7, '1965'), (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.2, 20)} bg={<Table t={t} day={Math.min(382, Math.round(easeOut(ramp(lt, 2, 14)) * 382))} kg={207 - easeOut(ramp(lt, 2, 14)) * 125} />} hero={<Hero x={380} s={1.1 + 0.5 * (1 - easeOut(ramp(lt, 2, 14)))} t={t} eyes="normal" />} />],
  // 8 final
  [ST[8], (lt, t) => <Cine t={t} mood="night" cam={kbL(lt, 1.0, 1.1, 10)} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={260} t={t} />} />],
  [W(8, 'tu'), (lt, t) => <Cine t={t} mood="dusk" cam={kbL(lt, 1.0, 1.25, 10)} bg={<CityNight />} hero={<Hero x={960} s={1.4} t={t} eyes="normal" pose={POSES.fists} />} />],
];

const KEY = /\d|espacio|aire|helada|calor|agua|dormir|comer|récord/i;
const groups: Wd[][] = [];
{
  let cur: Wd[] = [];
  WORDS.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= 5 || (prev && (w.start_ms - prev.end_ms > 300 || /[.,:!?…]$/.test(prev.text)))) { groups.push(cur); cur = []; }
    cur.push(w);
    if (i === WORDS.length - 1) groups.push(cur);
  });
}
const Captions: React.FC<{t: number}> = ({t}) => {
  const ms = t * 1000;
  let gi = -1;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const end = i + 1 < groups.length ? Math.min(groups[i + 1][0].start_ms, g[g.length - 1].end_ms + 800) : g[g.length - 1].end_ms + 800;
    if (ms >= g[0].start_ms - 60 && ms < end) gi = i;
  }
  if (gi < 0) return null;
  const g = groups[gi];
  return (
    <div style={{position: 'absolute', left: 140, width: LW - 280, top: 960, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', transform: `translateY(-50%) scale(${0.94 + 0.06 * pop(t, g[0].start_ms / 1000 - 0.06, 12, 260)})`}}>
      {g.map((w, i) => {
        const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
        return <span key={i} style={{fontFamily: CF, fontWeight: 800, fontSize: 58, lineHeight: 1.15, textTransform: 'uppercase', color: active ? (KEY.test(w.text) ? '#FF5C7A' : '#FFD23F') : ms >= w.start_ms ? '#fff' : 'rgba(255,255,255,0.55)', textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 3px #000', display: 'inline-block'}}>{w.text}</span>;
      })}
    </div>
  );
};

const TITLES = ['', 'EL ESPACIO', 'SIN RESPIRAR', 'AGUA HELADA', 'CALOR EXTREMO', 'SIN AGUA', 'SIN DORMIR', 'SIN COMER'];
export const LimitesLargo: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  const ends = [1, 2, 3, 4, 5, 6, 7].map((c) => Wl(c, 'tu'));
  return (
    <AbsoluteFill style={{background: '#0B0A1A', overflow: 'hidden'}}>
      <Audio src={staticFile('limites/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[1.2, 2.4, 3.6, ...ST.slice(1)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.18} max={0.6} />)}
      <CText t={t} at={0.05} until={W(0, 'hoy') - 0.1} a="¿CUÁNTO AGUANTARÍAS?" size={120} />
      <CText t={t} at={W(0, 'siete')} until={W(0, 'en') - 0.1} a="7 LÍMITES" b="DEL CUERPO HUMANO" size={130} />
      <CText t={t} at={W(0, 'en', 2)} until={W(0, 'y') - 0.1} a="DE 15 SEGUNDOS…" b="…A 382 DÍAS" size={130} />
      {[1, 2, 3, 4, 5, 6, 7].map((c) => <ChapterCard key={c} t={t} at={ST[c]} n={8 - c} title={TITLES[c]} />)}
      <CText t={t} at={W(1, '90')} until={W(1, '1966') - 0.1} a="< 90 SEGUNDOS" b="PUEDES SOBREVIVIR" size={110} color2="#7BF59A" />
      <CText t={t} at={W(1, '1966')} until={ends[0] - 0.1} a="1966 · NASA" b="JIM LEBLANC" size={110} />
      <CText t={t} at={W(2, '3')} until={W(2, 'pero') - 0.1} a="3 MIN" b="DAÑO CEREBRAL" size={120} color2="#FF4D6D" />
      <CText t={t} at={W(2, '2021')} until={ends[1] - 0.1} a="24 MIN 37 S" b="BUDIMIR ŠOBAT" size={120} />
      <CText t={t} at={W(3, '10')} until={W(3, 'pero') - 0.1} a="10 MIN" b="NO PUEDES NADAR" size={120} color2="#7CF4FF" />
      <CText t={t} at={W(3, '1999')} until={ends[2] - 0.1} a="1999 · 80 MIN BAJO EL HIELO" b="ANNA BÅGENHOLM" size={90} color2="#7CF4FF" />
      <CText t={t} at={W(4, '42')} until={W(4, 'para') - 0.1} a="42 °C" b="SIN VUELTA ATRÁS" size={130} color2="#FF4D6D" />
      <CText t={t} at={W(4, 'en', 2)} until={ends[3] - 0.1} a="SAUNA A 110 °C" b="CAMPEONATO PROHIBIDO" size={100} color2="#FF4D6D" />
      <CText t={t} at={W(5, '1979')} until={ends[4] - 0.1} a="1979 · 18 DÍAS" b="ANDREAS MIHAVECZ" size={110} />
      <CText t={t} at={W(6, '1964')} until={W(6, 'al') - 0.1} a="1964 · 11 DÍAS" b="RANDY GARDNER" size={110} />
      <CText t={t} at={W(7, '1965')} until={ends[6] - 0.1} a="382 DÍAS SIN COMER" b="ANGUS BARBIERI" size={110} />
      {[1, 2, 3, 4, 5, 6, 7].map((c) => t >= ends[c - 1] && t < ST[c + 1] - 0.3 ? <Ladder key={c} t={t} upto={c} at={ends[c - 1]} hi={c - 1} /> : null)}
      {t >= W(8, 'asi') && t < W(8, 'tu') && <Ladder t={t} upto={7} at={W(8, 'asi')} />}
      <CText t={t} at={W(8, 'cual') - 0.2} a="¿EN CUÁL AGUANTARÍAS MÁS?" b="👇 COMENTARIOS" size={100} />
      <Captions t={t} />
    </AbsoluteFill>
  );
};

// miniatura en INGLES 1280x720
export const LimitesLargoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(0.6667)', transformOrigin: '0 0', width: 1920, height: 1080}}>
        <Cine t={1} mood="cold" cam={kb(0, 1.25, 1.25, 1, 1250, 560)} bg={<Space t={1} />} hero={<><Float t={1} eyes="scared" mouth="open" x={1250} /><Bubbles x={1250} y={580} t={1} /></>} />
        <div style={{position: 'absolute', left: 60, top: 60, fontFamily: CF, fontWeight: 900, fontSize: 140, lineHeight: 0.95, letterSpacing: -4, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>
          <div style={{color: '#fff'}}>HOW LONG</div>
          <div style={{color: '#fff'}}>WOULD YOU</div>
          <div style={{color: '#FFD23F'}}>LAST?</div>
        </div>
        <div style={{position: 'absolute', left: 60, bottom: 70, fontFamily: CF, fontWeight: 900, fontSize: 80, color: '#FF4D6D', textShadow: '0 6px 30px rgba(0,0,0,0.9)'}}>15 SEC → 382 DAYS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
