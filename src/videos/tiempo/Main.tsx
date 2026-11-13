import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, CityNight} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 54;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|tiempo|ciego|negro|sonido|silencio|cemento|respirar|pulmones|minutos|peor/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

/** ciudad congelada: gente a mitad de paso, lluvia suspendida, pajaro quieto */
export const Frozen: React.FC<{t: number; dim?: number}> = ({t, dim = 0}) => (
  <g>
    <CityNight />
    {Array.from({length: 70}).map((_, i) => <line key={i} x1={rnd(i) * 1920} y1={rnd(i + 3) * 900} x2={rnd(i) * 1920 - 6} y2={rnd(i + 3) * 900 + 26} stroke="#BDE0FE" strokeWidth={3} opacity={0.6} />)}
    <NPC x={420} t={0} s={1.1} color="#E76F51" pose={POSES.fly} rotate={-10} />
    <NPC x={1500} t={0} s={1.1} color="#2A9D8F" pose={POSES.wave} />
    <g transform="translate(1180 300)"><path d="M -40 0 Q -20 -30 0 0 Q 20 -30 40 0" stroke="#111" strokeWidth={8} fill="none" /></g>
    <g transform="translate(700 520) rotate(30)"><rect x={-30} y={-24} width={60} height={48} rx={8} fill="#F4A261" stroke="#111" strokeWidth={5} /></g>
    {dim > 0 && <rect width={1920} height={1080} fill="#000" opacity={dim} />}
  </g>
);
export const Molecules: React.FC<{t: number; push?: number; big?: boolean}> = ({t, push = 0, big}) => (
  <g>
    {Array.from({length: big ? 60 : 160}).map((_, i) => {
      const x = (i % (big ? 10 : 16)) * (big ? 200 : 125) + 40 + rnd(i) * 40, y = Math.floor(i / (big ? 10 : 16)) * (big ? 190 : 110) + 40 + rnd(i + 2) * 30;
      return <circle key={i} cx={x} cy={y} r={big ? 34 : 14} fill="#7CF4FF" stroke="#0B3954" strokeWidth={big ? 6 : 3} opacity={0.75} transform={`translate(${Math.sin(t * 40 + i) * push} 0)`} />;
    })}
  </g>
);
export const Lungs: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g transform="translate(960 520)">
    {[-1, 1].map((d) => <path key={d} d={`M ${d * 30} -160 Q ${d * 250} -140 ${d * 230} 120 Q ${d * 130} 220 ${d * 40} 140 Z`} fill={k > 0.5 ? '#6C757D' : '#F4A7B9'} stroke="#111" strokeWidth={8} transform={`scale(${1 + Math.sin(t * 9) * 0.02 * (1 - k)})`} />)}
    <rect x={-14} y={-260} width={28} height={110} fill="#E5989B" stroke="#111" strokeWidth={6} />
  </g>
);
const Timer: React.FC<{t: number; at: number; until: number; secs: number; speed?: number}> = ({t, at, until, secs, speed = 1}) => {
  if (t < at || t > until) return null;
  const left = Math.max(0, secs - (t - at) * speed);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1640, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: '#FF4D6D', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>{Math.floor(left / 60)}:{String(Math.floor(left % 60)).padStart(2, '0')}</div>;
};
export const Wave: React.FC<{t: number; amp: number}> = ({t, amp}) => (
  <path d={Array.from({length: 97}).map((_, i) => `${i ? 'L' : 'M'} ${i * 20} ${540 + Math.sin(i * 0.4 + t * 8) * amp * Math.sin((i / 96) * Math.PI)}`).join(' ')} stroke="#7CF4FF" strokeWidth={10} fill="none" />
);

const SHOTS: Shot[] = [
  // gancho: avance del final (sin aire, a oscuras) + cortes rapidos
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.4, 1.7, 0.6, 960, 420), ...shake(t, 8)}} bg={<Frozen t={t} dim={0.55} />} hero={<Hero x={960} y={GY + 20} s={1.6} t={t} pose={POSES.headHold} eyes="scared" mouth="open" sweat />} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.3, 1.5, 0.6)} bg={<rect width={1920} height={1080} fill="#0B0A1A" />} hero={<Molecules t={t} big />} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.5, 1.2, 0.6)} bg={<Frozen t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.push} eyes="angry" />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.4, 0.6), ...shake(t, 6)}} bg={<rect width={1920} height={1080} fill="#1A0B10" />} hero={<Lungs t={t} k={1} />} /></V>],
  // el poder
  [2.4, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Frozen t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.idle} eyes="wide" look={0.3} />} /></V>],
  [T('parece'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.1, 1.3, 3)} bg={<Frozen t={t} />} hero={<Hero x={960 + Math.sin(t * 3) * 60} y={GY + 20} s={1.5} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" />} /></V>],
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.6, 3.5, 960, 380)} bg={<Frozen t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="side" />} /></V>],
  [T('primero'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 2)} bg={<Frozen t={t} dim={easeOut(ramp(lt, 0, 1.4))} />} hero={<g opacity={1 - ramp(lt, 0.8, 1.4) * 0.8}><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.reach} eyes="wide" /></g>} /></V>],
  [T('luz'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.3, 3)} bg={<rect width={1920} height={1080} fill="#05050F" />} hero={<><circle cx={500} cy={300} r={60} fill="#FFE24A" />{Array.from({length: 8}).map((_, i) => <circle key={i} cx={580 + i * 90} cy={300 + i * 45} r={14} fill="#FFF3B0" />)}<text x={1350} y={720} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={60} fill="#FFF3B0">⏸</text><Hero x={1400} y={GY + 20} s={1.3} t={t} eyes="closed" /></>} /></V>],
  [T('todo', 2), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 2)} bg={<rect width={1920} height={1080} fill="#000" />} /></V>],
  [T('segundo', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 6)} bg={<rect width={1920} height={1080} fill="#0B1A2A" />} hero={<Wave t={t} amp={200 * (1 - easeOut(ramp(lt, 0.5, 2.2)))} />} /></V>],
  [T('silencio'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.25, 2)} bg={<Frozen t={t} dim={0.6} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.shout} eyes="scared" mouth="open" />} /></V>],
  [T('tercero'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.2, 4), ...shake(t, 2)}} bg={<rect width={1920} height={1080} fill="#0B1A2A" />} mid={<Molecules t={t} push={2} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.push} eyes="angry" sweat />} /></V>],
  [T('cada'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.4, 3)} bg={<rect width={1920} height={1080} fill="#0B1A2A" />} hero={<Molecules t={t} big push={1} />} /></V>],
  [T('es', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.1, 1.3, 2)} bg={<rect width={1920} height={1080} fill="#6C757D" />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.push} eyes="angry" sweat /><rect width={1920} height={1080} fill="#ADB5BD" opacity={0.45} /></>} /></V>],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.4, 2, 960, 400), ...shake(t, 4)}} bg={<Frozen t={t} dim={0.7} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" />} /></V>],
  [T('intentas', 2), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.25, 6), ...shake(t, 3)}} bg={<rect width={1920} height={1080} fill="#1A0B10" />} hero={<Lungs t={t} k={ramp(lt, 1.5, 3)} />} /></V>],
  [T('poder', 2), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.4, 6, 960, 420)} bg={<Frozen t={t} dim={0.75} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.kneel} eyes="closed" mouth="frown" />} /></V>],
  [T('seguirías'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 5)} bg={<Frozen t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.shrug} eyes="normal" />} /></V>],
];

export const TiempoShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('tiempo/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, 2.4, T('pero'), T('primero'), T('segundo', 2), T('tercero'), T('entonces')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={2.35} a="PARAR EL TIEMPO" b="TE MATARÍA" size={120} color2="#FF4D6D" />
      <VBig t={t} at={2.4} until={T('parece') - 0.05} a="⏸ TIEMPO" b="CONGELADO" size={130} color2="#7CF4FF" />
      <VBig t={t} at={T('primero')} until={T('segundo', 2) - 0.05} a="1. CIEGO" size={160} />
      <VBig t={t} at={T('segundo', 2)} until={T('tercero') - 0.05} a="2. SILENCIO" size={150} color="#7CF4FF" />
      <VBig t={t} at={T('tercero')} until={T('entonces') - 0.05} a="3. ATRAPADO" b={t > T('es', 2) ? 'EN CEMENTO' : undefined} size={140} />
      <VBig t={t} at={T('intentas', 2)} until={T('poder', 2) - 0.05} a="4. SIN AIRE" size={150} color="#FF4D6D" />
      <Timer t={t} at={T('quedan')} until={T('poder', 2)} secs={180} speed={30} />
      <VBig t={t} at={T('seguirías')} a="¿SEGUIRÍAS" b="QUERIÉNDOLO?" size={125} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const TiempoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.4, 1.4, 1, 960, 420)} bg={<Frozen t={1} dim={0.4} />} hero={<Hero x={960} y={GY + 20} s={1.6} t={1} pose={POSES.headHold} eyes="scared" mouth="open" sweat />} /></V>
      <VBig t={1} at={0} a="PARAR EL TIEMPO" b="TE MATARÍA" size={120} y={180} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};
