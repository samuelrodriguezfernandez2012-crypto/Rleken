import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd, DayTag} from '../futuro/kit';
import {Hero, POSES, Room} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 57;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|dormir|microsueños|sombras|real|récord|peligroso|despierto/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

export const Shadows: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g opacity={k}>
    {[[260, 1], [1660, -1], [1380, 1]].map(([x, d], i) => (
      <g key={i} transform={`translate(${x + Math.sin(t * 0.8 + i) * 40 * d} ${GY}) scale(${1.3 + i * 0.2})`} opacity={0.5 + 0.3 * Math.sin(t * 2 + i)}>
        <ellipse cx={0} cy={-330} rx={55} ry={65} fill="#000" />
        <path d="M -70 -260 Q -90 -100 -60 0 L 60 0 Q 90 -100 70 -260 Z" fill="#000" />
        <circle cx={-18} cy={-335} r={7} fill="#FF2D55" opacity={i === 1 ? 1 : 0} /><circle cx={18} cy={-335} r={7} fill="#FF2D55" opacity={i === 1 ? 1 : 0} />
      </g>
    ))}
  </g>
);
export const Brain: React.FC<{t: number; off: number}> = ({t, off}) => (
  <g transform="translate(960 520) scale(1.6)">
    <ellipse rx={170} ry={130} fill="#F4A7B9" stroke="#111" strokeWidth={6} />
    {Array.from({length: 14}).map((_, i) => {
      const x = -130 + (i % 5) * 65, y = -80 + Math.floor(i / 5) * 70, dark = rnd(i) < off;
      return <circle key={i} cx={x} cy={y} r={28} fill={dark ? '#2B2D42' : '#FFE24A'} opacity={dark ? 0.85 : 0.55 + 0.3 * Math.sin(t * 6 + i)} />;
    })}
    {[-90, -30, 30, 90].map((x) => <path key={x} d={`M ${x} -120 q 30 60 0 120 q -30 60 0 120`} stroke="#C9184A" strokeWidth={4} fill="none" opacity={0.5} />)}
  </g>
);
export const Clock: React.FC<{t: number; speed: number}> = ({t, speed}) => (
  <g transform="translate(1500 260)">
    <circle r={110} fill="#F1FAEE" stroke="#111" strokeWidth={8} />
    <line x1={0} y1={0} x2={Math.sin(t * speed) * 80} y2={-Math.cos(t * speed) * 80} stroke="#111" strokeWidth={8} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.sin(t * speed / 12) * 55} y2={-Math.cos(t * speed / 12) * 55} stroke="#E63946" strokeWidth={10} strokeLinecap="round" />
  </g>
);
export const Book: React.FC<{t: number; stamp: number}> = ({t, stamp}) => (
  <g transform="translate(960 520) scale(0.85)">
    <rect x={-330} y={-230} width={660} height={460} rx={14} fill="#1D3557" stroke="#111" strokeWidth={10} />
    <rect x={-300} y={-200} width={600} height={400} rx={8} fill="none" stroke="#FFD23F" strokeWidth={6} />
    <text x={0} y={-60} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#FFD23F">RÉCORDS</text>
    <text x={0} y={30} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={34} fill="#F1FAEE">MÁS TIEMPO SIN DORMIR</text>
    {stamp > 0 && <g transform={`rotate(-14) scale(${1 + (1 - stamp) * 1.5})`} opacity={stamp}><rect x={-260} y={60} width={520} height={110} rx={10} fill="none" stroke="#E63946" strokeWidth={12} /><text x={0} y={140} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#E63946">ELIMINADO</text></g>}
  </g>
);
export const Count: React.FC<{t: number; at: number}> = ({t, at}) => {
  const nums = ['100', '93', '86', '79', '72', '65', '…?'];
  const i = Math.min(6, Math.floor((t - at) / 0.55));
  if (i < 0) return null;
  const k = easeOut(ramp(t, at + i * 0.55, at + i * 0.55 + 0.2));
  return <g>{i > 0 && <text x={960} y={380} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={110} fill="#F1FAEE" opacity={0.3}>{nums[i - 1]}</text>}<text x={960} y={640} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={260 * k} fill={i === 6 ? '#FF4D6D' : '#F1FAEE'} stroke="#111" strokeWidth={10} paintOrder="stroke">{nums[i]}</text></g>;
};

const SHOTS: Shot[] = [
  // gancho: avance del dia 11 (sombras, reloj loco, cerebro apagandose)
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.4, 1.7, 0.6, 960, 420), ...shake(t, 7)}} bg={<Room night />} mid={<Shadows t={t} k={1} />} hero={<Hero x={960} s={1.4} t={t} eyes="wide" mouth="o" sweat />} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.3, 1.5, 0.6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Brain t={t} off={0.4 + lt} />} /></V>],
  [1.2, (lt, t) => <V fx={1500}><Cine t={t} mood="night" cam={{...kbV(lt, 1.5, 1.8, 0.6, 1500, 300), ...shake(t, 5)}} bg={<Room night />} hero={<Clock t={t} speed={40} />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.5, 1.2, 0.6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Count t={t} at={1.8} />} /></V>],
  // dias
  [2.4, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Room />} hero={<><Hero x={960} s={1.4} t={t} pose={POSES.shrug} eyes="normal" mouth="smile" /><Clock t={t} speed={3} /></>} /></V>],
  [T('día', 2), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Brain t={t} off={ramp(lt, 0.8, 5)} />} /></V>],
  [T('son'), (lt, t) => { const blink = [0.9, 2.6, 3.9].some((b) => lt > b && lt < b + 0.45); return <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.4, 5, 960, 400)} bg={<Room night />} hero={<><Hero x={960} s={1.4} t={t} eyes="wide" />{blink && <rect x={-200} y={-200} width={2400} height={1500} fill="#000" />}</>} /></V>; }],
  [T('día', 3), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 5)} bg={<Room night />} mid={<Shadows t={t} k={easeOut(ramp(lt, 0.8, 3))} />} hero={<Hero x={960} s={1.4} t={t} eyes="scared" look={-0.5} sweat />} /></V>],
  [T('día', 4), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 6), x: Math.sin(t * 3) * 30, y: 0}} bg={<g style={{filter: `hue-rotate(${Math.sin(t * 2) * 90}deg)`}}><Room night /></g>} mid={<Shadows t={t} k={0.6} />} hero={<><Hero x={960 + Math.sin(t * 5) * 14} s={1.4} t={t} pose={POSES.headHold} eyes="wide" mouth="o" /><g opacity={0.35}><Hero x={1010} s={1.4} t={t} pose={POSES.headHold} eyes="wide" /></g></>} /></V>],
  [T('día', 5), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.2, 1.5, 2)} bg={<Room night />} hero={<Hero x={960} s={1.4} t={t} pose={POSES.kneel} eyes="closed" />} /></V>],
  [T('1964'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 7)} bg={<g style={{filter: 'sepia(0.85)'}}><Room /></g>} hero={<g style={{filter: 'sepia(0.7)'}}><Hero x={960} s={1.4} t={t} eyes="wide" /><Clock t={t} speed={30} /></g>} /></V>],
  [T('al'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 8)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Count t={t} at={T('al') + 0.3} />} /></V>],
  [T('y', 4), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.25, 6)} bg={<rect width={1920} height={1080} fill="#1A0B10" />} hero={<Book t={t} stamp={easeOut(ramp(t, T('era') - 0.1, T('era') + 0.25))} />} /></V>],
  [T('cuántos'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 5)} bg={<Room night />} mid={<Shadows t={t} k={0.4} />} hero={<><Hero x={960} s={1.4} t={t} eyes="wide" /><Clock t={t} speed={8} /></>} /></V>],
];

export const InsomnioShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('insomnio/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, 2.4, T('día', 2), T('día', 3), T('día', 4), T('día', 5), T('1964')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={2.35} a="11 DÍAS" b="SIN DORMIR" size={150} color2="#FF4D6D" />
      <VBig t={t} at={2.4} until={T('día', 2) - 0.05} a="DÍA 1" size={170} />
      <VBig t={t} at={T('día', 2)} until={T('día', 3) - 0.05} a="DÍA 2" b={t > T('son') ? 'MICROSUEÑOS' : undefined} size={112} color2="#7CF4FF" />
      <VBig t={t} at={T('día', 3)} until={T('día', 4) - 0.05} a="DÍA 3" b="ALUCINACIONES" size={100} color2="#FF4D6D" />
      <VBig t={t} at={T('día', 4)} until={T('día', 5) - 0.05} a="DÍA 5" b="¿QUÉ ES REAL?" size={140} />
      <VBig t={t} at={T('día', 5)} until={T('1964') - 0.05} a="DÍA 11" b="EL RÉCORD" size={160} color2="#FFD23F" />
      <VBig t={t} at={T('1964')} until={T('al') - 0.05} a="1964" b="17 AÑOS" size={170} />
      <VBig t={t} at={T('cuántos')} a="¿CUÁNTOS DÍAS" b="AGUANTARÍAS?" size={120} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const InsomnioThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.4, 1.4, 1, 960, 420)} bg={<Room night />} mid={<Shadows t={1} k={1} />} hero={<Hero x={960} s={1.4} t={1} eyes="wide" mouth="o" sweat />} /></V>
      <VBig t={1} at={0} a="11 DÍAS" b="SIN DORMIR" size={160} y={180} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};
