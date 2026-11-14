import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES, CityNight} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Moon, ramp, easeOut} from '../futuro/vkit';
import {Shockwave, SpeedBurst, Debris, Aura} from '../nivel0largo/fight';
import words from './words.json';

export const DURATION_S = 71;
const T = makeT(words as any);
const D = (n: number) => T('día', n + 1);
const Caps = makeCaps(words as any, /\d|sonido|explosión|grados|espacio|luna|luz|bombas|peligroso/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

const Runner: React.FC<{t: number; x?: number; y?: number; s?: number; lines?: number; fire?: number; aura?: number; eyes?: any}> = ({t, x = 1090, y = GY + 20, s = 1.4, lines = 1, fire = 0, aura = 0, eyes = 'angry'}) => (
  <g>
    {Array.from({length: 14}).map((_, i) => { const yy = y - 60 - rnd(i) * 420 * s / 1.4, len = (200 + rnd(i + 2) * 500) * lines; const off = ((t * 3000 + i * 300) % 1600); return <line key={i} x1={x - 120 - off * 0.2} y1={yy} x2={x - 120 - len - off * 0.2} y2={yy} stroke="#fff" strokeWidth={6} opacity={0.6 * Math.min(1, lines)} strokeLinecap="round" />; })}
    {fire > 0 && <g opacity={fire}><ellipse cx={x - 60} cy={y - 220 * s / 1.4} rx={260} ry={190 * s / 1.4} fill="#FF6B00" opacity={0.35} filter="url(#blurGlow)" /><path d={`M ${x + 110} ${y - 380 * s / 1.4} Q ${x - 300} ${y - 220 * s / 1.4} ${x + 110} ${y - 40} Q ${x - 900} ${y - 200 * s / 1.4} ${x + 110} ${y - 380 * s / 1.4} Z`} fill="#FFB703" opacity={0.55 + 0.2 * Math.sin(t * 30)} /></g>}
    {aura > 0 && <Aura x={x} y={y} s={s * 0.9} t={t} k={aura} color="#7CF4FF" />}
    <g transform={`rotate(${-12} ${x} ${y})`}><Hero x={x} y={y} s={s} t={t} pose={POSES.push} eyes={eyes} mouth="flat" /></g>
  </g>
);
const Street: React.FC<{t: number; speed: number; broken?: number}> = ({t, speed, broken = 0}) => (
  <g>
    <CityNight noSky={false} />
    {Array.from({length: 7}).map((_, i) => { const x = ((i * 320 - t * speed) % 2240 + 2240) % 2240 - 160; return <g key={i}><rect x={x} y={GY - 360} width={240} height={360} fill="#2B2D42" stroke="#111" strokeWidth={5} />{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 30 + c * 110} y={GY - 330 + r * 110} width={70} height={70} fill={broken > 0 && rnd(i * 7 + r * 3 + c) < broken ? '#111' : '#FFE8A3'} stroke="#111" strokeWidth={4} />))}</g>; })}
    <rect y={GY} width={1920} height={200} fill="#3A3A44" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={((i * 260 - t * speed * 1.5) % 2600 + 2600) % 2600 - 200} y={GY + 80} width={120} height={14} fill="#FFD23F" />)}
  </g>
);
const Highway: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#8EC5E8" />
    <rect y={GY - 40} width={1920} height={300} fill="#555" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={((i * 260 - t * 1400) % 2600 + 2600) % 2600 - 200} y={GY + 70} width={120} height={14} fill="#fff" />)}
    {[0, 1, 2].map((i) => { const x = ((1700 + i * 600 - t * 500) % 2200 + 2200) % 2200 - 200; return <g key={i} transform={`translate(${x} ${GY + 10})`}><rect x={-110} y={-70} width={220} height={60} rx={18} fill={['#E63946', '#457B9D', '#F4A261'][i]} stroke="#111" strokeWidth={5} />{[-60, 60].map((d) => <circle key={d} cx={d} cy={-8} r={24} fill="#222" />)}</g>; })}
  </g>
);
const Glass: React.FC<{t: number; at: number}> = ({t, at}) => (
  <g>{t > at && Array.from({length: 26}).map((_, i) => { const s = t - at; const x = 300 + rnd(i) * 1300 + (rnd(i + 1) - 0.5) * 600 * s, y = 200 + rnd(i + 2) * 300 + 900 * s * s; return <path key={i} d={`M ${x} ${y} l 26 -10 l -8 30 Z`} fill="#BDE0FE" stroke="#fff" strokeWidth={2} opacity={Math.max(0, 1 - s / 1.6)} />; })}</g>
);
const Mach: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => (
  <g opacity={0.8}>{[0, 1, 2].map((i) => { const k = ((t * 2 + i / 3) % 1); return <path key={i} d={`M ${x + 120} ${y} Q ${x - 200 - k * 300} ${y - 400 - k * 200} ${x - 700 - k * 400} ${y - 500 - k * 300} M ${x + 120} ${y} Q ${x - 200 - k * 300} ${y + 400 + k * 200} ${x - 700 - k * 400} ${y + 500 + k * 300}`} stroke="#fff" strokeWidth={10 * (1 - k)} fill="none" opacity={1 - k} />; })}</g>
);
const Speedo: React.FC<{t: number}> = ({t}) => {
  const vals = [15, 150, 1500, 15000, 150000, 1500000, 15000000];
  let i = -1;
  for (let n = 1; n <= 7; n++) if (t >= D(n)) i = n - 1;
  if (i < 0 || t > T('entonces')) return null;
  const k = easeOut(ramp(t, D(i + 1), D(i + 1) + 0.6));
  const v = Math.round((i ? vals[i - 1] : 0) + (vals[i] - (i ? vals[i - 1] : 0)) * k);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1600, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: i >= 3 ? '#FF6B3D' : '#7BF59A', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>{v.toLocaleString('es-ES')} km/h</div>;
};

const SHOTS: Shot[] = [
  // gancho: avance (estela de fuego, explosion sonica, cristales, impacto)
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.6, 0.6), ...shake(t, 10)}} bg={<rect width={1920} height={1080} fill="#2B0A10" />} hero={<><Runner t={t} lines={2} fire={1} /><SpeedBurst x={960} y={600} t={t} at={0.02} /></>} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={{...kbV(lt, 1.2, 1.5, 0.6), ...shake(t, 12)}} bg={<Street t={t} speed={2000} broken={1} />} hero={<><Mach t={t} x={960} y={600} /><Glass t={t} at={0.6} /><Runner t={t} lines={2} /></>} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.4, 1.2, 0.6)} bg={<Stars t={t} />} hero={<><Earth x={960} y={560} r={260} t={t} /><circle cx={960 + Math.cos(t * 6) * 330} cy={560 + Math.sin(t * 6) * 330} r={18} fill="#7CF4FF" /><circle cx={960 + Math.cos(t * 6) * 330} cy={560 + Math.sin(t * 6) * 330} r={60} fill="#7CF4FF" opacity={0.3} filter="url(#blurGlow)" /></>} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 14)}} bg={<rect width={1920} height={1080} fill="#fff" opacity={1 - lt} />} hero={<Shockwave x={960} y={600} t={t} at={1.8} max={1200} />} /></V>],
  // dia 1
  [D(1), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 4)} bg={<Street t={t} speed={150} />} hero={<Runner t={t} lines={0.2} eyes="normal" />} /></V>],
  [D(2), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Highway t={t} />} hero={<Runner t={t} lines={0.8} eyes="happy" />} /></V>],
  [D(3), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={{...kbV(lt, 1.0, 1.25, 8), ...(t > T('rompo') && t < T('rompo') + 0.6 ? shake(t, 14) : {})}} bg={<Street t={t} speed={2500} broken={ramp(t, T('revienta'), T('revienta') + 0.4)} />} hero={<><Shockwave x={960} y={600} t={t} at={T('rompo')} max={1300} /><Mach t={t} x={960} y={600} /><Glass t={t} at={T('revienta')} /><Runner t={t} lines={1.6} /></>} /></V>],
  [D(4), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 10), ...shake(t, 3)}} bg={<rect width={1920} height={1080} fill="#3A1408" />} hero={<Runner t={t} lines={2} fire={easeOut(ramp(lt, 1.5, 4))} />} /></V>],
  [T('cruzo'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 2)} bg={<rect width={1920} height={1080} fill="#E9C46A" />} hero={<><path d="M 700 300 L 1250 280 L 1300 700 L 1050 840 L 680 760 L 640 500 Z" fill="#E76F51" stroke="#111" strokeWidth={8} /><line x1={660} y1={420} x2={660 + 620 * easeOut(ramp(lt, 0.2, 1.4))} y2={420 + 300 * easeOut(ramp(lt, 0.2, 1.4))} stroke="#FFD23F" strokeWidth={14} strokeLinecap="round" /></>} /></V>],
  [D(5), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 10)} bg={<Stars t={t} />} hero={<><Earth x={960} y={1300} r={760} t={t} /><g transform={`translate(0 ${-easeOut(ramp(t, T('salto'), T('salto') + 2)) * 500})`}><Runner t={t} y={560} s={1.0} lines={1} /></g></>} /></V>],
  [T('doy'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Stars t={t} />} hero={<><Earth x={960} y={560} r={260} t={t} /><path d={`M ${960 + 330} 560 A 330 330 0 ${lt > 1 ? 1 : 0} 1 ${960 + Math.cos(Math.min(6.2, lt * 3)) * 330} ${560 + Math.sin(Math.min(6.2, lt * 3)) * 330}`} stroke="#7CF4FF" strokeWidth={10} fill="none" /></>} /></V>],
  [D(6), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 5)} bg={<Stars t={t} />} hero={<><Earth x={760} y={820} r={160} t={t} /><Moon x={1180} y={240} r={80} /><line x1={820} y1={700} x2={820 + 330 * easeOut(ramp(t, T('llego'), T('llego') + 1.3))} y2={700 - 420 * easeOut(ramp(t, T('llego'), T('llego') + 1.3))} stroke="#7CF4FF" strokeWidth={10} strokeLinecap="round" /></>} /></V>],
  [D(7) - 0.1, (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.4, 7), ...shake(t, 4)}} bg={<rect width={1920} height={1080} fill="#05050F" />} hero={<>{Array.from({length: 60}).map((_, i) => { const a = rnd(i) * Math.PI * 2, r0 = 50 + ((t * 900 + i * 40) % 900); return <line key={i} x1={960 + Math.cos(a) * r0} y1={560 + Math.sin(a) * r0} x2={960 + Math.cos(a) * (r0 + 160)} y2={560 + Math.sin(a) * (r0 + 160)} stroke="#fff" strokeWidth={4} opacity={0.7} />; })}<Runner t={t} y={760} s={1.2} lines={0} aura={1} eyes="glow" /></>} /></V>],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 5), ...(t > T('libero') && t < T('libero') + 1 ? shake(t, 16) : {})}} bg={<Stars t={t} />} hero={<><Earth x={960} y={620} r={300} t={t} fire={ramp(t, T('libero'), T('libero') + 1.5)} /><Shockwave x={960} y={620} t={t} at={T('libero')} max={1400} color="#FFB703" /><circle cx={960} cy={620} r={600} fill="#fff" opacity={Math.max(0, 1 - Math.abs(t - T('libero') - 0.1) * 4)} /></>} /></V>],
  [T('ya', 4), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.5, 5, 960, 420)} bg={<CityNight />} hero={<><Aura x={960} y={GY + 20} s={1.4} t={t} k={1} color="#FF2244" /><Hero x={960} y={GY + 20} s={1.5} t={t} eyes="evil" mouth="flat" /></>} /></V>],
  [T('en', 6), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 4)} bg={<Street t={t} speed={60} />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" pose={POSES.shrug} /><g transform={`translate(1320 ${1080 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const RapidoShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('rapido/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, D(1), D(2), D(3), T('rompo'), D(4), D(5), D(6), D(7), T('libero')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={D(1) - 0.05} a="CADA DÍA CORRO" b="x10 MÁS RÁPIDO" size={110} color2="#7CF4FF" />
      {[1, 2, 3, 4, 5, 6, 7].map((n) => <VBig key={n} t={t} at={D(n)} until={(n < 7 ? (n === 4 ? T('cruzo') : D(n + 1)) : T('entonces')) - 0.05} a={`DÍA ${n}`} b={['', '', '', 'BARRERA DEL SONIDO', '+1.000 °C', 'AL ESPACIO', 'A LA LUNA', '1% VELOCIDAD DE LA LUZ'][n]} size={n === 7 ? 120 : 150} color2="#FF6B3D" />)}
      <VBig t={t} at={T('libero')} until={T('ya', 4) - 0.05} a="= 10 BOMBAS" b="ATÓMICAS" size={140} color2="#FF4D6D" />
      <VBig t={t} at={T('soy', 2)} until={T('en', 6) - 0.05} a="LO MÁS PELIGROSO" b="QUE EXISTE" size={120} color2="#FF4D6D" />
      <VBig t={t} at={T('en', 6)} a="¿EN QUÉ DÍA" b="TE PARARÍAS?" size={130} />
      <Speedo t={t} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const RapidoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.3, 1.3, 1)} bg={<Street t={1} speed={2000} broken={1} />} hero={<><Mach t={1} x={960} y={600} /><Runner t={1} lines={2} fire={0.7} /></>} /></V>
      <VBig t={1} at={0} a="CADA DÍA CORRO" b="x10 MÁS RÁPIDO" size={110} y={180} color2="#7CF4FF" />
    </AbsoluteFill>
  );
};
