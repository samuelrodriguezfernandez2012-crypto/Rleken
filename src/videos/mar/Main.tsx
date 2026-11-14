import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 65;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|metro|oídos|borracho|pulmones|oscuridad|marianas|tonelada|agrietado/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;

/** agua que se oscurece con la profundidad d (0 superficie, 1 abismo) */
export const Deep: React.FC<{t: number; d: number; fish?: boolean}> = ({t, d, fish}) => (
  <g>
    <rect width={1920} height={1080} fill={mix([46, 134, 222], [2, 4, 12], Math.min(1, d))} />
    {d < 0.5 && Array.from({length: 9}).map((_, i) => <path key={i} d={`M ${i * 230 + Math.sin(t + i) * 30} -20 L ${i * 230 + 160 + Math.sin(t + i) * 30} 1100`} stroke="#E0F4FF" strokeWidth={40} opacity={0.08 * (1 - d * 2)} />)}
    {Array.from({length: 26}).map((_, i) => { const p = (t * 0.08 + rnd(i)) % 1; return <circle key={i} cx={rnd(i + 3) * 1920} cy={1080 - p * 1100} r={3 + rnd(i) * 4} fill="#BDE0FE" opacity={0.5 * (1 - d * 0.7)} />; })}
    {fish && Array.from({length: 5}).map((_, i) => { const x = 300 + i * 340 + Math.sin(t * 0.7 + i) * 60, y = 300 + rnd(i + 9) * 500; return <g key={i}><circle cx={x} cy={y} r={40} fill="#7CF4FF" opacity={0.25 * (0.6 + 0.4 * Math.sin(t * 3 + i))} filter="url(#blurGlow)" /><circle cx={x} cy={y} r={8} fill="#E0FFFF" /></g>; })}
  </g>
);
const Gauge: React.FC<{t: number; m: number}> = ({t, m}) => (
  <g transform="translate(1210 120)">
    <rect x={-10} y={0} width={20} height={760} rx={10} fill="rgba(255,255,255,0.25)" />
    <circle cx={0} cy={760 * Math.min(1, Math.log10(1 + m) / Math.log10(11001))} r={22} fill="#FFD23F" stroke="#111" strokeWidth={5} />
  </g>
);
const DepthTag: React.FC<{t: number; m: number}> = ({t, m}) => (
  <div style={{position: 'absolute', left: 0, right: 0, margin: '0 auto', width: 'fit-content', top: 1560, padding: '10px 24px', borderRadius: 16, background: 'rgba(11,10,26,0.75)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#7CF4FF'}}>-{Math.round(m).toLocaleString('es-ES')} m</div>
);
const Diver: React.FC<{t: number; y?: number; pose?: any; eyes?: any; mouth?: any; s?: number}> = ({t, y = 860, pose = POSES.idle, eyes = 'wide', mouth = 'flat', s = 1.4}) => (
  <g transform={`translate(0 ${Math.sin(t * 1.3) * 14})`}><Hero x={960} y={y} s={s} t={t} pose={pose} eyes={eyes} mouth={mouth} /><Bub t={t} x={960} y={y - 300 * s / 1.4} /></g>
);
const Bub: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => (
  <g>{Array.from({length: 6}).map((_, i) => { const p = (t * 0.9 + i / 6) % 1; return <circle key={i} cx={x + 30 + Math.sin(i * 2 + t * 3) * 20} cy={y - p * 300} r={8 + p * 10} fill="none" stroke="#E0F4FF" strokeWidth={4} opacity={1 - p} />; })}</g>
);
const Lung: React.FC<{k: number}> = ({k}) => (
  <g transform={`translate(960 520) scale(${1 - 0.75 * k})`}>
    {[-1, 1].map((d) => <path key={d} d={`M ${d * 30} -160 Q ${d * 250} -140 ${d * 230} 120 Q ${d * 130} 220 ${d * 40} 140 Z`} fill="#F4A7B9" stroke="#111" strokeWidth={10} />)}
    <rect x={-14} y={-260} width={28} height={110} fill="#E5989B" stroke="#111" strokeWidth={6} />
  </g>
);
const Trieste: React.FC<{t: number; crack: number}> = ({t, crack}) => (
  <g transform="translate(960 460)">
    <rect x={-380} y={-170} width={760} height={190} rx={95} fill="#ADB5BD" stroke="#111" strokeWidth={8} />
    <rect x={-60} y={-230} width={120} height={70} rx={10} fill="#6C757D" stroke="#111" strokeWidth={6} />
    <line x1={0} y1={20} x2={0} y2={90} stroke="#111" strokeWidth={14} />
    <circle cx={0} cy={180} r={110} fill="#495057" stroke="#111" strokeWidth={10} />
    <circle cx={60} cy={190} r={30} fill="#FFE8A3" stroke="#111" strokeWidth={6} />
    {crack > 0 && <path d={`M 45 175 l 12 10 l -6 12 l 16 6 M 60 190 l -14 14`} stroke="#111" strokeWidth={4} fill="none" opacity={crack} />}
    <circle cx={60} cy={190} r={90} fill="#FFE8A3" opacity={0.15} filter="url(#blurGlow)" />
  </g>
);
const Press: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g opacity={k}>{Array.from({length: 12}).map((_, i) => { const a = (i / 12) * Math.PI * 2, r = 380 - Math.sin(t * 4 + i) * 20; return <g key={i} transform={`translate(${960 + Math.cos(a) * r} ${540 + Math.sin(a) * r}) rotate(${(a * 180) / Math.PI + 180})`}><path d="M 0 -18 L 70 -18 L 70 -40 L 120 0 L 70 40 L 70 18 L 0 18 Z" fill="#FF4D6D" /></g>; })}</g>
);

const SHOTS: Shot[] = [
  // gancho: la ventana se agrieta en el abismo
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.6, 1.9, 0.6, 1020, 650), ...shake(t, 9)}} bg={<Deep t={t} d={1} fish />} hero={<Trieste t={t} crack={ramp(lt, 0.1, 0.3)} />} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.2, 1.4, 0.6)} bg={<Deep t={t} d={0.9} />} hero={<><Lung k={0.7 + ramp(lt, 0, 0.6) * 0.2} /><Press t={t} k={1} /></>} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.4, 1.2, 0.6), ...shake(t, 5)}} bg={<Deep t={t} d={0.7} fish />} hero={<Diver t={t} eyes="scared" mouth="open" pose={POSES.headHold} />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.3, 1)} bg={<Deep t={t} d={0.2} />} hero={<Diver t={t} y={500 + lt * 500} pose={POSES.fly} eyes="wide" />} /></V>],
  // metro 10
  [T('metro'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Deep t={t} d={0.08} />} hero={<Diver t={t} pose={POSES.headHold} eyes="closed" />} /></V>],
  // metro 30
  [T('metro', 2), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.25, 9), x: Math.sin(t * 2) * 40, y: 0}} bg={<g style={{filter: `hue-rotate(${Math.sin(t * 1.5) * 40}deg)`}}><Deep t={t} d={0.2} /></g>} hero={<><Diver t={t} eyes="happy" mouth="grin" pose={POSES.laugh} /><g opacity={0.3} transform={`translate(${Math.sin(t * 3) * 40} 0)`}><Hero x={960} y={860} s={1.4} t={t} pose={POSES.laugh} eyes="happy" /></g></>} /></V>],
  // metro 100
  [T('metro', 3), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Deep t={t} d={0.35} />} hero={<><Lung k={easeOut(ramp(lt, 0.8, 3))} /><Press t={t} k={ramp(lt, 0.5, 1.5)} /></>} /></V>],
  [T('récord'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Deep t={t} d={0.4} />} hero={<><line x1={960} y1={-100} x2={960} y2={1200} stroke="#F1FAEE" strokeWidth={6} /><Diver t={t} y={700} pose={POSES.hang} eyes="closed" /></>} /></V>],
  // metro 1000
  [T('metro', 4), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 5)} bg={<Deep t={t} d={0.9} fish />} hero={<g opacity={0.25}><Diver t={t} eyes="wide" /></g>} /></V>],
  // 11000
  [T('metro', 5), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.3, 8), ...(lt > 3.5 ? shake(t, 3) : {})}} bg={<><Deep t={t} d={1} /><path d="M 0 700 L 700 760 L 860 1080 L 1060 1080 L 1220 760 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#111" /></>} hero={<><Press t={t} k={ramp(lt, 3.3, 4.3)} /><Hero x={960} y={760} s={1.1} t={t} eyes="scared" mouth="o" /></>} /></V>],
  // 1960 trieste
  [T('1960'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.35, 11, 1000, 600), ...(t > T('golpe') && t < T('golpe') + 0.5 ? shake(t, 12) : {})}} bg={<g style={{filter: 'sepia(0.35)'}}><Deep t={t} d={0.85 + ramp(lt, 0, 10) * 0.15} fish /></g>} hero={<g transform={`translate(0 ${Math.min(120, lt * 12)})`}><Trieste t={t} crack={ramp(t, T('una', 2), T('una', 2) + 0.3)} /></g>} /></V>],
  [T('tú'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 4)} bg={<Deep t={t} d={1} fish />} hero={<Trieste t={t} crack={1} />} /></V>],
];

export const MarShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  const depth = t < T('metro') ? 0 : t < T('metro', 2) ? 10 : t < T('metro', 3) ? 30 : t < T('metro', 4) ? 100 + (t > T('récord') ? 114 * ramp(t, T('récord'), T('récord') + 2) : 0) : t < T('metro', 5) ? 1000 : 11000;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('mar/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('metro'), T('metro', 2), T('metro', 3), T('metro', 4), T('metro', 5), T('1960')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <SerieTag t={t} ep={3} />
      {t > T('metro') && t < T('1960') && <DepthTag t={t} m={depth} />}
      <VBig t={t} at={0.03} until={T('metro') - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="EN EL FONDO DEL MAR?" size={92} color2="#7CF4FF" />
      <VBig t={t} at={T('metro')} until={T('metro', 2) - 0.05} a="METRO 10" b="PRESIÓN x2" size={140} color2="#7CF4FF" />
      <VBig t={t} at={T('metro', 2)} until={T('metro', 3) - 0.05} a="METRO 30" b="'BORRACHO'" size={140} color2="#FFD23F" />
      <VBig t={t} at={T('metro', 3)} until={T('récord') - 0.05} a="METRO 100" b="PULMONES = PUÑO" size={120} color2="#FF4D6D" />
      <VBig t={t} at={T('récord')} until={T('metro', 4) - 0.05} a="RÉCORD" b="214 METROS" size={150} color2="#FFD23F" />
      <VBig t={t} at={T('metro', 4)} until={T('metro', 5) - 0.05} a="METRO 1.000" b="OSCURIDAD" size={130} />
      <VBig t={t} at={T('metro', 5)} until={T('1960') - 0.05} a="METRO 11.000" b={t > T('aquí', 2) ? '+1 TONELADA / cm²' : 'MARIANAS'} size={115} color2="#FF4D6D" />
      <VBig t={t} at={T('1960')} until={T('tú') - 0.05} a="1960" b={t > T('golpe') ? 'LA VENTANA SE AGRIETA' : 'TRIESTE'} size={110} color2="#FFD23F" />
      <VBig t={t} at={T('tú')} until={T('mañana') - 0.05} a="¿TÚ HABRÍAS" b="SEGUIDO?" size={140} />
      {t < T('mañana') && <Caps t={t} />}
      <FollowCard t={t} at={T('mañana')} ep={3} next="¿EN MARTE SIN TRAJE?"><svg viewBox="0 0 760 560" width={760} height={560}><Stars t={t} /><Earth x={380} y={290} r={190} t={t} dry={1} mars={1} /></svg></FollowCard>
    </AbsoluteFill>
  );
};

export const MarThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="cold" cam={kbV(0, 1.6, 1.6, 1, 1020, 650)} bg={<Deep t={1} d={1} fish />} hero={<Trieste t={1} crack={1} />} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN EL FONDO DEL MAR?" size={92} y={180} color2="#7CF4FF" />
    </AbsoluteFill>
  );
};
