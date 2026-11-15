import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Volcano, ramp, easeOut} from '../futuro/vkit';
import {Bubbles} from '../espacio/Main';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 59;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|marte|oxígeno|hervir|desmayas|frío|ríos|lagos|escudo|aire/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

export const MarsGround: React.FC<{t: number; night?: number}> = ({t, night = 0}) => (
  <g>
    <rect width={1920} height={1080} fill={night > 0.5 ? '#1B1030' : '#D9925B'} />
    <circle cx={1500} cy={220} r={60} fill="#FFF3D6" opacity={1 - night} />
    {night > 0.5 && <Stars t={t} n={120} />}
    <path d="M 0 650 Q 300 560 600 640 T 1300 600 T 1920 640 L 1920 1080 L 0 1080 Z" fill={night > 0.5 ? '#4A2340' : '#B5532F'} />
    <rect y={GY - 60} width={1920} height={300} fill={night > 0.5 ? '#3A1A30' : '#9C3D1F'} />
    {Array.from({length: 18}).map((_, i) => <ellipse key={i} cx={rnd(i) * 1920} cy={GY - 30 + rnd(i + 2) * 200} rx={20 + rnd(i + 3) * 50} ry={10 + rnd(i + 4) * 20} fill={night > 0.5 ? '#2A1224' : '#7A2E16'} />)}
    {Array.from({length: 30}).map((_, i) => { const x = ((rnd(i) * 2200 + t * 120) % 2200) - 140; return <circle key={i} cx={x} cy={300 + rnd(i + 5) * 600} r={3} fill="#F4C095" opacity={0.4 * (1 - night)} />; })}
    {night > 0.5 && <rect width={1920} height={1080} fill="#BDE0FE" opacity={0.08} />}
  </g>
);
export const Lander: React.FC<{x: number; s?: number}> = ({x, s = 1}) => (
  <g transform={`translate(${x} ${GY}) scale(${s})`}>
    <path d="M -160 -60 L -220 0 M 160 -60 L 220 0" stroke="#ADB5BD" strokeWidth={14} />
    <rect x={-170} y={-260} width={340} height={200} rx={30} fill="#E9ECEF" stroke="#111" strokeWidth={8} />
    <circle cx={0} cy={-170} r={50} fill="#4EA8DE" stroke="#111" strokeWidth={6} />
    <path d="M -100 -260 L 0 -360 L 100 -260 Z" fill="#E63946" stroke="#111" strokeWidth={8} />
  </g>
);
const Thin: React.FC<{t: number}> = ({t}) => (
  <g fontFamily="Montserrat" fontWeight={900}>
    <rect x={660} y={200} width={290} height={520} rx={30} fill="#4EA8DE" opacity={0.25} stroke="#fff" strokeWidth={6} />
    {Array.from({length: 90}).map((_, i) => <circle key={i} cx={690 + rnd(i) * 230 + Math.sin(t * 4 + i) * 6} cy={230 + rnd(i + 1) * 460 + Math.cos(t * 4 + i) * 6} r={8} fill="#BDE0FE" />)}
    <rect x={970} y={200} width={290} height={520} rx={30} fill="#E76F51" opacity={0.25} stroke="#fff" strokeWidth={6} />
    {[0, 1].map((i) => <circle key={i} cx={1060 + i * 110 + Math.sin(t * 4 + i) * 6} cy={400 + i * 140} r={8} fill="#F4C095" />)}
    <text x={805} y={270} textAnchor="middle" fontSize={50} fill="#fff">TIERRA</text>
    <text x={1115} y={270} textAnchor="middle" fontSize={50} fill="#fff">MARTE</text>
  </g>
);
const Shield: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    {Array.from({length: 30}).map((_, i) => { const y = 120 + rnd(i) * 840, x = ((t * 900 + rnd(i + 1) * 1920) % 1920); return <line key={i} x1={x} y1={y} x2={x + 140} y2={y} stroke="#FFD166" strokeWidth={5} opacity={0.6} />; })}
    {[1, 1.35, 1.7].map((r, i) => <ellipse key={i} cx={1100} cy={540} rx={330 * r} ry={250 * r} fill="none" stroke="#7CF4FF" strokeWidth={8} opacity={(1 - k) * 0.7} strokeDasharray="20 16" />)}
    {Array.from({length: 16}).map((_, i) => { const p = (t * 0.5 + i / 16) % 1; return <circle key={i} cx={1300 + p * 600} cy={420 + rnd(i) * 260} r={10 * (1 - p)} fill="#BDE0FE" opacity={k * (1 - p)} />; })}
  </g>
);

const SHOTS: Shot[] = [
  // gancho: avance (sin aire en Marte, saliva hirviendo, se desmaya)
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.5, 1.8, 0.6, 960, 420), ...shake(t, 8)}} bg={<MarsGround t={t} />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.headHold} eyes="scared" mouth="open" /><Bubbles x={960} y={GY - 430} t={t} /></>} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.3, 1.5, 0.6)} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} dry={1} mars={1} />} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.4, 1.2, 0.6), ...shake(t, 5)}} bg={<MarsGround t={t} night={1} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.kneel} eyes="closed" />} /></V>],
  [1.8, (lt, t) => <V fx={1100}><Cine t={t} mood="future" cam={kbV(lt, 1.2, 1.4, 0.6, 1100, 540)} bg={<Stars t={t} />} hero={<><Earth x={1100} y={540} r={300} t={t} dry={1} mars={1} /><Shield t={t} k={1} /></>} /></V>],
  // llegada
  [T('bajas'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3)} bg={<MarsGround t={t} />} hero={<><Lander x={1150} s={0.6} /><Hero x={820} y={GY + 20} s={1.4} t={t} pose={POSES.wave} eyes="happy" mouth="smile" /></>} /></V>],
  [T('puedes'), (lt, t) => { const h = Math.sin(Math.min(Math.PI, lt * 1.6)) * 300; return <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3)} bg={<MarsGround t={t} />} hero={<Hero x={960} y={GY + 20 - h} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" />} /></V>; }],
  // segundo 1
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.3, 3, 960, 420)} bg={<MarsGround t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.headHold} eyes="wide" mouth="o" />} /></V>],
  [T('aire'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Thin t={t} />} /></V>],
  // segundo 10 y 15
  [T('segundo', 2), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.3, 1.8, 5, 960, 380)} bg={<MarsGround t={t} />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} eyes="scared" mouth="open" /><Bubbles x={960} y={GY - 430} t={t} /></>} /></V>],
  [T('segundo', 3), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.25, 3)} bg={<MarsGround t={t} />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.kneel} eyes="closed" /><rect width={1920} height={1080} fill="#000" opacity={0.45 * ramp(lt, 0.5, 2)} /></>} /></V>],
  // frio
  [T('y', 4), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 5)} bg={<MarsGround t={t} night={1} />} hero={<><Lander x={1130} s={0.6} /><g transform="translate(800 560)"><rect x={-30} y={-260} width={60} height={320} rx={30} fill="#F1FAEE" stroke="#111" strokeWidth={6} /><rect x={-16} y={20} width={32} height={40} fill="#4EA8DE" /><circle cx={0} cy={80} r={50} fill="#4EA8DE" stroke="#111" strokeWidth={6} /></g></>} /></V>],
  // pasado con agua
  [T('lo', 2), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} dry={easeOut(ramp(t, T('pero', 2), T('así') + 0.3))} mars={0.5 + 0.5 * easeOut(ramp(t, T('pero', 2), T('así') + 0.3))} />} /></V>],
  [T('pero', 2), (lt, t) => <V fx={1100}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 6, 1100, 540)} bg={<Stars t={t} />} hero={<><Earth x={1100} y={540} r={300} t={t} dry={ramp(lt, 1, 5)} mars={0.5 + 0.5 * ramp(lt, 1, 5)} /><Shield t={t} k={ramp(lt, 0.3, 2.5)} /></>} /></V>],
  [T('viajarías'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<MarsGround t={t} />} hero={<><Lander x={1150} s={0.6} /><Hero x={820} y={GY + 20} s={1.4} t={t} eyes="wide" pose={POSES.shrug} /></>} /></V>],
];

export const MarteShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('marte/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('bajas'), T('pero'), T('segundo', 2), T('segundo', 3), T('lo', 2)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <SerieTag t={t} ep={4} />
      <VBig t={t} at={0.03} until={T('bajas') - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="EN MARTE?" size={98} color2="#FF6B3D" />
      <VBig t={t} at={T('pesas')} until={T('pero') - 0.05} a="-62% DE PESO" b="SALTAS x3" size={130} color2="#7BF59A" />
      <VBig t={t} at={T('pero')} until={T('segundo', 2) - 0.05} a="SEGUNDO 1" b={t > T('aire') ? 'AIRE x100 MÁS FINO' : 'SIN AIRE'} size={120} color2="#FF6B3D" />
      <VBig t={t} at={T('segundo', 2)} until={T('segundo', 3) - 0.05} a="SEGUNDO 10" b="LA SALIVA HIERVE" size={120} color2="#FF4D6D" />
      <VBig t={t} at={T('segundo', 3)} until={T('y', 4) - 0.05} a="SEGUNDO 15" b="TE DESMAYAS" size={130} />
      <VBig t={t} at={T('y', 4)} until={T('lo', 2) - 0.05} a="DE NOCHE" b="-70 °C" size={150} color2="#7CF4FF" />
      <VBig t={t} at={T('lo', 2)} until={T('pero', 2) - 0.05} a="MARTE TUVO" b="RÍOS Y LAGOS" size={130} color2="#7CF4FF" />
      <VBig t={t} at={T('pero', 2)} until={T('viajarías') - 0.05} a="PERDIÓ" b="SU ESCUDO" size={150} color2="#FF4D6D" />
      <VBig t={t} at={T('viajarías')} until={T('mañana') - 0.05} a="¿VIAJARÍAS" b="A MARTE?" size={140} />
      {t < T('mañana') && <Caps t={t} />}
      <FollowCard t={t} at={T('mañana')} ep={4} next="¿DENTRO DE UN VOLCÁN?"><svg viewBox="0 0 760 560" width={760} height={560}><rect width={760} height={560} fill="#2B0A10" /><g transform="translate(-580 -400) scale(1)"><Volcano x={960} t={t} s={1} /></g></svg></FollowCard>
    </AbsoluteFill>
  );
};

export const MarteThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.5, 1.5, 1, 960, 420)} bg={<MarsGround t={1} />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={1} pose={POSES.headHold} eyes="scared" mouth="open" /><Bubbles x={960} y={GY - 430} t={1} /></>} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN MARTE?" size={98} y={180} color2="#FF6B3D" />
    </AbsoluteFill>
  );
};
