import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, CityNight, School, Room} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Eye} from '../presente/Main';
import {Brain, Clock} from '../insomnio/Main';
import words from './words.json';

export const DURATION_S = 53;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|año|parpade|anciano|ojos|arden|cerebro|apagarse/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

// parpadeos: cada uno suma un año
const BLINKS = [0.35, 0.95, 1.55, 2.1];
const P1 = T('parpadeo'), P5 = T('parpadeo', 2), P10 = T('parpadeo', 3);
const extra = [T('es') - 0.2, T('en', 3) - 0.2, T('tu', 4), T('cada', 2) - 0.2];
const blinkTimes = [...BLINKS, P1, P5, P10, ...extra];
const yearsAt = (t: number) => {
  if (t < P1) return Math.max(0, BLINKS.filter((b) => t >= b).length * 20);
  if (t < P5) return 1;
  if (t < P10) return 5;
  if (t < T('es')) return 10;
  if (t < T('en', 3)) return 10 + Math.round(15 * ramp(t, T('es'), T('años')));
  if (t < T('así')) return 25 + Math.round(50 * ramp(t, T('en', 3), T('anciano')));
  if (t < T('tu', 4)) return 75;
  return 76;
};
const ageAt = (t: number) => (t < P1 ? 12 + yearsAt(t) : 12 + yearsAt(t));

/** parpados que se cierran en cada parpadeo */
const Lids: React.FC<{t: number}> = ({t}) => {
  const b = blinkTimes.find((x) => t >= x - 0.08 && t < x + 0.14);
  if (b == null) return null;
  const k = 1 - Math.abs((t - (b + 0.03)) / 0.11);
  const h = Math.max(0, Math.min(1, k)) * 960;
  return <AbsoluteFill><div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h, background: '#000', borderBottomLeftRadius: '50% 30%', borderBottomRightRadius: '50% 30%'}} /><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: '#000', borderTopLeftRadius: '50% 30%', borderTopRightRadius: '50% 30%'}} /></AbsoluteFill>;
};
const YearTag: React.FC<{t: number}> = ({t}) => {
  if (t < P1 || t > T('y', 4)) return null;
  const y = yearsAt(t);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1600, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: y > 50 ? '#FF4D6D' : '#FFD23F', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>+{y} {y === 1 ? 'AÑO' : 'AÑOS'}</div>;
};
const OldPhone: React.FC<{x: number; y: number; t: number; k: number}> = ({x, y, t, k}) => (
  <g transform={`translate(${x} ${y}) rotate(-8) scale(0.75)`}>
    <rect x={-120} y={-220} width={240} height={440} rx={30} fill="#1B1B2F" stroke="#111" strokeWidth={8} />
    <rect x={-100} y={-190} width={200} height={380} rx={14} fill={k > 0.5 ? '#3A3A44' : '#4EA8DE'} />
    {k > 0.5 && <path d="M -60 -160 l 40 80 l -30 40 l 60 90 M 20 -80 l 50 -40" stroke="#ddd" strokeWidth={5} fill="none" />}
    {k > 0.5 && <text x={0} y={10} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#FF4D6D">SIN SOPORTE</text>}
  </g>
);
const Future: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#1B1040" />
    {Array.from({length: 9}).map((_, i) => { const x = 120 + i * 210, h = 400 + rnd(i) * 450; return <g key={i}><rect x={x} y={GY - h} width={160} height={h} fill="#2E2A6B" stroke="#7CF4FF" strokeWidth={3} />{Array.from({length: Math.floor(h / 70)}).map((_, j) => <rect key={j} x={x + 20} y={GY - h + 20 + j * 70} width={120} height={8} fill="#7CF4FF" opacity={0.5 + 0.5 * Math.sin(t * 2 + i + j)} />)}</g>; })}
    {[0, 1].map((i) => { const x = ((t * 300 + i * 900) % 2200) - 140; return <g key={i} transform={`translate(${x} ${260 + i * 120})`}><ellipse rx={70} ry={20} fill="#ADB5BD" /><ellipse cy={-12} rx={30} ry={16} fill="#7CF4FF" /></g>; })}
    <rect y={GY} width={1920} height={200} fill="#14102E" />
  </g>
);

const SHOTS: Shot[] = [
  // gancho: envejece en 2 segundos, un parpadeo tras otro
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.4, 1.6, 2.4, 960, 430), ...shake(t, 4)}} bg={<Room night />} hero={<><Hero x={960} s={1.5} t={t} age={ageAt(t)} cane={ageAt(t) > 60} eyes="wide" mouth="o" /><Clock t={t} speed={60} /></>} /></V>],
  // parpadeo 1: movil viejo
  [P1, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Room />} hero={<><Hero x={840} s={1.3} t={t} pose={POSES.phone} eyes="wide" age={13} /><OldPhone x={1110} y={520} t={t} k={ramp(lt, 0.6, 0.8)} /></>} /></V>],
  // parpadeo 5: amigos ya no estan
  [P5, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 3)} bg={<School />} hero={<><Hero x={960} s={1.3} t={t} eyes="wide" age={17} look={-0.4} />{[620, 1300].map((x, i) => <g key={x} opacity={1 - ramp(lt, 0.3, 1.4)}><NPC x={x} s={1.2} t={t} color={['#E76F51', '#2A9D8F'][i]} pose={POSES.wave} flip={i === 1} /></g>)}</>} /></V>],
  // parpadeo 10: ciudad cambiada
  [P10, (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Future t={t} />} hero={<><Hero x={960} s={1.3} t={t} eyes="wide" mouth="o" age={22} />{[640, 1280].map((x, i) => <NPC key={x} x={x} s={1.1} t={t} color={['#7CF4FF', '#B388FF'][i]} flip={i === 0} look={i ? -0.6 : 0.6} />)}</>} /></V>],
  // 15 veces por minuto
  [T('y', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.25, 4)} bg={<rect width={1920} height={1080} fill="#E9D8C4" />} hero={<g transform={`translate(960 540) scale(1, ${(lt % 4) > 3.8 ? 0.05 : 1}) translate(-960 -540)`}><Eye x={960} y={540} s={1.1} t={t} /></g>} /></V>],
  [T('es'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 4), ...shake(t, 3)}} bg={<Room night />} hero={<><Hero x={960} s={1.4} t={t} age={ageAt(t)} cane={ageAt(t) > 60} eyes="wide" /><Clock t={t} speed={40} /></>} /></V>],
  [T('en', 3), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.35, 3, 960, 430)} bg={<Room night />} hero={<Hero x={960} s={1.4} t={t} age={ageAt(t)} cane={ageAt(t) > 55} pose={ageAt(t) > 60 ? POSES.kneel : POSES.idle} eyes={ageAt(t) > 70 ? 'closed' : 'wide'} />} /></V>],
  // no parpadear: ojos ardiendo
  [T('así'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.6, 6), ...shake(t, 2 + lt * 1.5)}} bg={<rect width={1920} height={1080} fill="#E9D8C4" />} hero={<><Eye x={960} y={540} s={1.2} t={t} />{Array.from({length: 10}).map((_, i) => <path key={i} d={`M ${640 + rnd(i) * 80} ${470 + rnd(i + 1) * 140} q 60 ${-20 + rnd(i + 2) * 40} 120 ${-10 + rnd(i + 3) * 20}`} stroke="#E63946" strokeWidth={5} fill="none" opacity={ramp(lt, 1.5, 4)} />)}<rect width={1920} height={1080} fill="#E63946" opacity={0.25 * ramp(lt, 2.5, 5)} /></>} /></V>],
  [T('tu', 4), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Room night />} hero={<Hero x={960} s={1.4} t={t} age={88} cane eyes="closed" />} /></V>],
  // lo real
  [T('y', 4), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 5)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Brain t={t} off={0} />} /></V>],
  [T('y', 5), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.3, 4)} bg={<CityNight />} hero={<><Hero x={960} s={1.4} t={t} eyes="wide" /><rect width={1920} height={1080} fill="#000" opacity={Math.max(0, Math.sin(lt * 3)) > 0.97 ? 0.95 : 0} /></>} /></V>],
  [T('cuántos'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.4, 4, 960, 430)} bg={<Room />} hero={<><Hero x={960} s={1.5} t={t} eyes="wide" look={0} /><g transform={`translate(1320 ${1080 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const AniosShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  const watched = Math.round((t / 60) * 15);
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('anios/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[P1, P5, P10, T('y', 2), T('así'), T('y', 4)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.12} max={0.4} />)}
      <VBig t={t} at={0.03} until={P1 - 0.05} a="1 PARPADEO" b="= 1 AÑO" size={125} color2="#FFD23F" />
      <VBig t={t} at={P1} until={P5 - 0.05} a="PARPADEO 1" b="MÓVIL VIEJO" size={130} color2="#7CF4FF" />
      <VBig t={t} at={P5} until={P10 - 0.05} a="PARPADEO 5" b="ADIÓS AMIGOS" size={130} color2="#7CF4FF" />
      <VBig t={t} at={P10} until={T('y', 2) - 0.05} a="PARPADEO 10" b="NADIE TE CONOCE" size={120} color2="#7CF4FF" />
      <VBig t={t} at={T('una')} until={T('es') - 0.05} a="15 PARPADEOS" b="POR MINUTO" size={130} color2="#FF4D6D" />
      <VBig t={t} at={T('es')} until={T('en', 3) - 0.05} a="1 MINUTO" b="= 15 AÑOS" size={150} color2="#FF4D6D" />
      <VBig t={t} at={T('en', 3)} until={T('así') - 0.05} a="5 MINUTOS" b="ANCIANO" size={150} color2="#FF4D6D" />
      <VBig t={t} at={T('así')} until={T('tu', 4) - 0.05} a="NO PARPADEES…" b={t > T('arden') ? 'LOS OJOS ARDEN' : undefined} size={125} color2="#FF4D6D" />
      <VBig t={t} at={T('y', 4)} until={T('cuántos') - 0.05} a="+1 HORA AL DÍA" b={t > T('cerebro') ? 'TU CEREBRO LO BORRA' : 'CON LOS OJOS CERRADOS'} size={110} color2="#7CF4FF" />
      <VBig t={t} at={T('cuántos')} a={`≈ ${watched} AÑOS`} b="MIENTRAS LO VES" size={140} color2="#FFD23F" />
      <YearTag t={t} />
      <Caps t={t} />
      <Lids t={t} />
    </AbsoluteFill>
  );
};

export const AniosThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="cold" cam={kbV(0, 1.4, 1.4, 1, 960, 430)} bg={<Room night />} hero={<><Hero x={820} s={1.4} t={1} age={13} eyes="wide" mouth="o" /><Hero x={1110} s={1.4} t={1} age={85} cane eyes="closed" /></>} /></V>
      <VBig t={1} at={0} a="1 PARPADEO" b="= 1 AÑO" size={125} y={180} color2="#FFD23F" />
    </AbsoluteFill>
  );
};
