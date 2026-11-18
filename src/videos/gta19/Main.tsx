import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 70;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|gta|noviembre|récord|millones|lucía|jason|leonida|florida|vice|city|retrasó|pc/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const PINK = '#FF4FA3', CYAN = '#3DF5FF';

/** atardecer neón con palmeras y edificios (dibujo propio) */
export const Sunset: React.FC<{t: number; scroll?: number; night?: boolean}> = ({t, scroll = 0, night}) => (
  <g>
    <defs><linearGradient id="sky19" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? '#120B3A' : '#3A0CA3'} /><stop offset="0.55" stopColor={night ? '#5B1A7A' : '#F72585'} /><stop offset="1" stopColor={night ? '#B5179E' : '#FFB703'} /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#sky19)" />
    <circle cx={960} cy={640} r={260} fill="#FFD166" opacity={night ? 0.35 : 0.95} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={680} y={560 + i * 34} width={560} height={10 + i * 2} fill={night ? '#5B1A7A' : '#F72585'} />)}
    {Array.from({length: 12}).map((_, i) => { const x = ((i * 190 - scroll) % 2280 + 2280) % 2280 - 180, h = 260 + rnd(i) * 380; return <g key={i}><rect x={x} y={GY - h} width={150} height={h} fill="#1B0B3A" />{Array.from({length: Math.floor(h / 60)}).map((_, j) => <rect key={j} x={x + 18} y={GY - h + 18 + j * 60} width={114} height={10} fill={j % 3 ? PINK : CYAN} opacity={0.55 + 0.4 * Math.sin(t * 3 + i + j)} />)}</g>; })}
    {[180, 520, 1420, 1760].map((px, i) => { const x = ((px - scroll * 1.6) % 2200 + 2200) % 2200 - 140; return <g key={i} transform={`translate(${x} ${GY})`}><path d="M 0 0 Q 18 -180 -10 -360" stroke="#0B0620" strokeWidth={22} fill="none" />{[0, 60, 130, 200, 260].map((a) => <path key={a} d={`M -10 -360 q ${Math.cos(a / 57) * 110} ${-40 + Math.sin(a / 57) * 50} ${Math.cos(a / 57) * 210} ${Math.sin(a / 57) * 110}`} stroke="#0B0620" strokeWidth={22} fill="none" strokeLinecap="round" />)}</g>; })}
    <rect y={GY} width={1920} height={200} fill="#140826" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={((i * 260 - scroll * 2) % 2600 + 2600) % 2600 - 200} y={GY + 80} width={120} height={12} fill="#FFD166" />)}
  </g>
);
export const Car: React.FC<{x: number; t: number; color?: string}> = ({x, t, color = PINK}) => (
  <g transform={`translate(${x} ${GY - 140})`}>
    <path d="M -250 -40 L -190 -110 L 110 -110 L 210 -60 L 260 -40 L 260 0 L -260 0 Z" fill={color} stroke="#111" strokeWidth={7} />
    <path d="M -160 -100 L 80 -100 L 150 -60 L -190 -60 Z" fill="#3DF5FF" opacity={0.8} stroke="#111" strokeWidth={5} />
    {[-160, 160].map((dx) => <g key={dx} transform={`translate(${dx} 0) rotate(${t * 900})`}><circle r={46} fill="#111" /><rect x={-6} y={-40} width={12} height={80} fill="#555" /></g>)}
    <ellipse cx={0} cy={50} rx={300} ry={14} fill={PINK} opacity={0.4} filter="url(#blurGlow)" />
  </g>
);
export const Cal: React.FC<{x: number; y: number; top: string; big: string; state?: 'x' | 'ok' | ''; k?: number}> = ({x, y, top, big, state = '', k = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-140} y={-150} width={280} height={300} rx={24} fill="#fff" stroke="#111" strokeWidth={8} />
    <rect x={-140} y={-150} width={280} height={80} rx={24} fill={state === 'ok' ? '#2EC4B6' : '#E63946'} />
    <text y={-95} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#fff">{top}</text>
    <text y={60} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={110} fill="#111">{big}</text>
    {state === 'x' && <path d="M -110 -120 L 110 130 M 110 -120 L -110 130" stroke="#E63946" strokeWidth={22} strokeLinecap="round" />}
  </g>
);
export const PlayCount: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g transform="translate(960 470)">
    <rect x={-300} y={-200} width={600} height={360} rx={40} fill="#111" stroke="#fff" strokeWidth={8} />
    <path d="M -50 -80 L 80 0 L -50 80 Z" fill="#fff" />
    <rect x={-260} y={120} width={520 * k} height={14} rx={7} fill="#E63946" />
    <text y={240} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={90} fill="#fff" stroke="#111" strokeWidth={6} paintOrder="stroke">{Math.round(90 * k)}M 👁️</text>
  </g>
);
export const MapL: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect width={1920} height={1080} fill="#0B4F6C" />
    {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${i * 180 + Math.sin(t + i) * 20} ${100 + (i % 4) * 230} q 40 -16 80 0`} stroke="#9AD0EC" strokeWidth={4} fill="none" opacity={0.5} />)}
    <path d="M 620 120 L 1380 120 L 1360 300 L 1210 380 L 1180 560 L 1120 760 L 1040 940 L 980 1000 L 930 900 L 900 700 L 820 520 L 700 380 L 600 280 Z" fill="#2EC4B6" stroke="#0B0620" strokeWidth={8} />
    <circle cx={1150} cy={800} r={30 + 8 * Math.sin(t * 4)} fill={PINK} opacity={k} />
    <circle cx={1150} cy={800} r={70} fill={PINK} opacity={0.3 * k} filter="url(#blurGlow)" />
    <text x={1150} y={720} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={54} fill="#fff" opacity={k} stroke="#0B0620" strokeWidth={6} paintOrder="stroke">VICE CITY</text>
  </g>
);
export const Boxes: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g fontFamily="Montserrat" fontWeight={900}>
    {[['PS5', '#2B59C3', true], ['XBOX', '#107C10', true], ['PC', '#555', false]].map(([l, c, ok], i) => (
      <g key={i} transform={`translate(${770 + i * 190} 560) scale(${0.8 * easeOut(ramp(k, i * 0.2, i * 0.2 + 0.3))})`}>
        <rect x={-100} y={-140} width={200} height={280} rx={16} fill={c as string} stroke="#111" strokeWidth={7} />
        <text y={10} textAnchor="middle" fontSize={50} fill="#fff">{l as string}</text>
        <text y={190} textAnchor="middle" fontSize={48} fill={ok ? '#7BF59A' : '#FFB703'}>{ok ? '19/11' : 'LUEGO'}</text>
      </g>
    ))}
  </g>
);

const SHOTS: Shot[] = [
  // gancho: persecución neon, cuenta atrás
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={{...kbV(lt, 1.3, 1.6, 0.8), ...shake(t, 6)}} bg={<Sunset t={t} scroll={t * 900} night />} hero={<Car x={960} t={t} />} /></V>],
  [0.8, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.4, 1.2, 0.8)} bg={<Sunset t={t} scroll={t * 200} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.fists} eyes="angry" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.point} eyes="angry" flip /></>} /></V>],
  [1.6, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.3, 0.8), ...shake(t, 4)}} bg={<rect width={1920} height={1080} fill="#140826" />} hero={<Cal x={960} y={520} top="NOVIEMBRE" big="19" state="ok" k={1 + 0.1 * Math.sin(t * 12)} />} /></V>],
  // la fecha
  [T('este'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.25, 5)} bg={<Sunset t={t} scroll={t * 60} />} hero={<Cal x={960} y={580} top="JUEVES" big="19" state="ok" k={easeOut(ramp(lt, 0, 0.4))} />} /></V>],
  [T('sale'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 4)} bg={<rect width={1920} height={1080} fill="#140826" />} hero={<Boxes t={t} k={lt} />} /></V>],
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.4, 2, 960, 420)} bg={<Sunset t={t} scroll={t * 30} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" />} /></V>],
  // 1 trailer
  [T('uno'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 10)} bg={<rect width={1920} height={1080} fill="#140826" />} hero={<PlayCount t={t} k={easeOut(ramp(t, T('90') - 0.5, T('horas') + 0.3))} />} /></V>],
  // 2 Lucia y Jason
  [T('dos'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 9)} bg={<Sunset t={t} scroll={t * 80} />} hero={<><NPC x={t < T('y', 2) ? 960 : 1080} y={GY + 20} s={1.4} t={t} color={PINK} hairBun pose={POSES.hips} eyes="angry" flip />{t >= T('y', 2) && <Hero x={830} y={GY + 20} s={1.4} t={t} pose={POSES.fists} eyes="angry" />}</>} /></V>],
  // 3 mapa
  [T('tres'), (lt, t) => <V fx={1000}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.35, 6, 1050, 700)} bg={<rect width={1920} height={1080} fill="#0B4F6C" />} hero={<MapL t={t} k={ramp(t, T('vice') - 0.3, T('vice'))} />} /></V>],
  // 4 retrasos
  [T('cuatro'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.15, 10)} bg={<rect width={1920} height={1080} fill="#140826" />} hero={<>{t > T('primero') && <Cal x={960} y={360} top="2025" big="?" state={t > T('2025') + 0.6 ? 'x' : ''} k={0.6} />}{t > T('luego') && <Cal x={960} y={620} top="MAYO" big="26" state={t > T('2026') + 0.6 ? 'x' : ''} k={0.6} />}{t > T('final') && <Cal x={960} y={880} top="NOVIEMBRE" big="19" state="ok" k={0.6 * (1 + 0.08 * Math.sin(t * 10))} />}</>} /></V>],
  // 5 ventas
  [T('cinco'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 5)} bg={<rect width={1920} height={1080} fill="#1B4332" />} hero={<>{Array.from({length: 40}).map((_, i) => { const p = (t * (0.3 + rnd(i) * 0.3) + rnd(i + 7)) % 1; return <rect key={i} x={rnd(i + 1) * 1920} y={-80 + p * 1240} width={90} height={46} rx={6} fill="#7BC47F" stroke="#1E5631" strokeWidth={4} transform={`rotate(${Math.sin(t * 3 + i) * 40} ${rnd(i + 1) * 1920} ${-80 + p * 1240})`} />; })}<text x={960} y={560} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={170} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{Math.round(200 * easeOut(ramp(lt, 0.8, 3)))}M</text></>} /></V>],
  [T('gta', 3), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.3, 5), ...shake(t, 2)}} bg={<Sunset t={t} scroll={t * 500} night />} hero={<Car x={960} t={t} color={CYAN} />} /></V>],
  [T('eso'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 3)} bg={<rect width={1920} height={1080} fill="#140826" />} hero={<Boxes t={t} k={1} />} /></V>],
  [T('vas', 2), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.cheer} eyes="happy" mouth="grin" flip /><g transform={`translate(1320 ${1080 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const Gta19Short: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gta19/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.8, 1.6, T('este'), T('uno'), T('dos'), T('tres'), T('cuatro'), T('cinco')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.5} />)}
      <VBig t={t} at={0.03} until={T('este') - 0.05} a="GTA 6" b="13 AÑOS DESPUÉS" size={150} color="#FFD166" color2={PINK} />
      <VBig t={t} at={T('este')} until={T('pero') - 0.05} a="JUEVES 19" b="DE NOVIEMBRE" size={115} color2={CYAN} />
      <VBig t={t} at={T('pero')} until={T('uno') - 0.05} a="5 COSAS QUE" b="CASI NADIE SABE" size={115} color2={PINK} />
      <VBig t={t} at={T('uno')} until={T('dos') - 0.05} a="1 · RÉCORD" b={t > T('ningún') ? 'NINGÚN VÍDEO ASÍ' : '90M EN 24 H'} size={120} color2={PINK} />
      <VBig t={t} at={T('dos')} until={T('tres') - 0.05} a="2 · LUCÍA" b={t > T('juega') ? '+ JASON = DÚO' : '1ª PROTAGONISTA'} size={100} color2={PINK} />
      <VBig t={t} at={T('tres')} until={T('cuatro') - 0.05} a="3 · LEONIDA" b="= FLORIDA" size={130} color2={CYAN} />
      <VBig t={t} at={T('cuatro')} until={T('cinco') - 0.05} a="4 · 2 RETRASOS" size={120} color2={PINK} />
      <VBig t={t} at={T('cinco')} until={T('gta', 3) - 0.05} a="5 · GTA 5" b="200 MILLONES" size={130} color2="#7BF59A" />
      <VBig t={t} at={T('gta', 3)} until={T('eso') - 0.05} a="¿EL MAYOR" b="LANZAMIENTO?" size={130} color2="#FFD166" />
      <VBig t={t} at={T('vas', 2)} a="¿LO JUEGAS" b="EL PRIMER DÍA?" size={130} color2="#FFD166" />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const Gta19Thumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="dusk" cam={kbV(0, 1.3, 1.3, 1)} bg={<Sunset t={1} scroll={100} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={1} pose={POSES.fists} eyes="angry" /><NPC x={1090} y={GY + 20} s={1.3} t={1} color={PINK} hairBun pose={POSES.point} eyes="angry" flip /></>} /></V>
      <VBig t={1} at={0} a="GTA 6" b="JUEVES 19 NOV" size={150} y={180} color="#FFD166" color2={PINK} />
    </AbsoluteFill>
  );
};
