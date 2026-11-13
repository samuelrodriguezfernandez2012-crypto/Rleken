import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES, Room} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 60;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|agua|litros|sangre|corazón|riñones|alucinaciones|récord|días/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

const Desert: React.FC<{t: number; heat?: number; mirage?: boolean}> = ({t, heat = 0.5, mirage}) => (
  <g>
    <rect width={1920} height={1080} fill="#F4A261" />
    <circle cx={1500} cy={200} r={110 + heat * 40} fill="#FFE24A" />
    <circle cx={1500} cy={200} r={220 + heat * 80} fill="#FFE24A" opacity={0.25} filter="url(#blurGlow)" />
    <rect y={GY - 100} width={1920} height={400} fill="#D4A373" />
    {Array.from({length: 26}).map((_, i) => <path key={i} d={`M ${rnd(i) * 1920} ${GY - 60 + rnd(i + 3) * 260} l 50 -14 l 30 26 l 60 -18`} stroke="#9C6B3C" strokeWidth={5} fill="none" />)}
    {mirage && <ellipse cx={500 + Math.sin(t) * 30} cy={GY - 60} rx={260} ry={34} fill="#7CC6FE" opacity={0.35 + 0.25 * Math.sin(t * 3)} />}
    {Array.from({length: 6}).map((_, i) => <path key={i} d={`M ${250 + i * 280} ${GY - 160} q 20 -40 0 -80 q -20 -40 0 -80`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.35 * heat * Math.abs(Math.sin(t * 2 + i))} />)}
  </g>
);
const Bottle: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-260} width={140} height={360} rx={30} fill="#E0F4FF" stroke="#111" strokeWidth={8} opacity={0.9} />
    <rect x={-62} y={92 - 340 * k} width={124} height={340 * k} rx={22} fill="#4EA8DE" />
    <rect x={-34} y={-310} width={68} height={56} rx={10} fill="#1D3557" />
  </g>
);
const Vessel: React.FC<{t: number; thick: number}> = ({t, thick}) => (
  <g>
    <rect width={1920} height={1080} fill="#3A0A10" />
    <rect x={0} y={330} width={1920} height={420} fill="#7A1020" />
    {Array.from({length: 40}).map((_, i) => { const sp = 260 * (1 - thick * 0.8); const x = ((rnd(i) * 2200 + t * sp) % 2200) - 140; return <ellipse key={i} cx={x} cy={380 + rnd(i + 2) * 320} rx={48} ry={22} fill="#E63946" stroke="#9D0208" strokeWidth={5} />; })}
  </g>
);
const Heart: React.FC<{t: number; bpm: number}> = ({t, bpm}) => {
  const beat = 1 + 0.12 * Math.max(0, Math.sin(t * (bpm / 60) * Math.PI * 2)) ** 8;
  return <g transform={`translate(960 520) scale(${3 * beat})`}><path d="M 0 40 C -90 -20 -60 -100 0 -60 C 60 -100 90 -20 0 40 Z" fill="#E63946" stroke="#111" strokeWidth={5} /></g>;
};
const Bars: React.FC<{t: number; at: number}> = ({t, at}) => {
  const a = easeOut(ramp(t, at, at + 1.2)), b = easeOut(ramp(t, at + 1.4, at + 2.2));
  return (
    <g fontFamily="Montserrat" fontWeight={900}>
      <rect x={740} y={880 - 560 * a} width={170} height={560 * a} rx={20} fill="#F4A261" />
      <text x={825} y={950} textAnchor="middle" fontSize={70}>🍞</text>
      <text x={825} y={860 - 560 * a} textAnchor="middle" fontSize={44} fill="#F4A261" opacity={a}>3 SEMANAS</text>
      <rect x={1010} y={880 - 80 * b} width={170} height={80 * b} rx={20} fill="#4EA8DE" />
      <text x={1095} y={950} textAnchor="middle" fontSize={70}>💧</text>
      <text x={1095} y={860 - 80 * b} textAnchor="middle" fontSize={44} fill="#7CF4FF" opacity={b}>3 DÍAS</text>
    </g>
  );
};
const Cell: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#4A4E69" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 250} y={0} width={244} height={GY} fill="#5C6079" stroke="#3A3D52" strokeWidth={6} />)}
    <rect y={GY} width={1920} height={200} fill="#2B2D42" />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={1250 + i * 60} y={200} width={18} height={500} fill="#22223B" />)}
    {Array.from({length: 18}).map((_, i) => { const p = (t * 0.3 + rnd(i)) % 1; return <ellipse key={i} cx={100 + rnd(i + 1) * 1000} cy={120 + p * 700} rx={7} ry={11} fill="#BDE0FE" opacity={0.8} />; })}
  </g>
);

const SHOTS: Shot[] = [
  // gancho: avance del dia 3 + el record en la celda
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.4, 1.7, 0.6, 960, 420), ...shake(t, 8)}} bg={<Desert t={t} heat={1} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.kneel} eyes="wide" mouth="o" sweat />} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.3, 1.5, 0.6)} bg={<rect width={1920} height={1080} fill="#3A0A10" />} hero={<Heart t={t} bpm={180} />} /></V>],
  [1.2, (lt, t) => <V fx={700}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.5, 1.2, 0.6, 700, 450), ...shake(t, 4)}} bg={<Cell t={t} />} hero={<Hero x={700} y={GY + 20} s={1.4} t={t} pose={POSES.reach} eyes="wide" />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.2, 1.4, 0.6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Bottle x={960} y={600} k={1 - ramp(lt, 0, 0.5)} />} /></V>],
  // hora 1
  [T('hora'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Room />} hero={<Hero x={960} s={1.4} t={t} pose={POSES.shrug} eyes="normal" mouth="smile" />} /></V>],
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.3, 5, 960, 450)} bg={<Room />} hero={<><Hero x={960} s={1.4} t={t} eyes="normal" />{Array.from({length: 14}).map((_, i) => { const p = (lt * 0.5 + i / 14) % 1; return <ellipse key={i} cx={960 + Math.sin(i * 2.3) * 140 + Math.sin(t + i) * 10} cy={560 - p * 400} rx={12} ry={18} fill="#7CC6FE" opacity={1 - p} />; })}</>} /></V>],
  // hora 24
  [T('hora', 2), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Desert t={t} heat={0.4} />} hero={<><Hero x={1150} y={GY + 20} s={1.3} t={t} pose={POSES.headHold} eyes="closed" sweat /><Bottle x={720} y={640} k={1 - easeOut(ramp(lt, 0.8, 3))} /></>} /></V>],
  // dia 2: sangre espesa, corazon, riñones
  [T('día'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Vessel t={t} thick={easeOut(ramp(lt, 0.5, 3))} />} /></V>],
  [T('corazón'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 3)} bg={<rect width={1920} height={1080} fill="#3A0A10" />} hero={<Heart t={t} bpm={90 + lt * 30} />} /></V>],
  [T('riñones'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.1, 1.3, 2)} bg={<rect width={1920} height={1080} fill="#2B0A10" />} hero={<>{[-1, 1].map((d) => <ellipse key={d} cx={960 + d * 140} cy={520} rx={105} ry={190} fill={lt > 0.8 ? '#6C757D' : '#9D4E4E'} stroke="#111" strokeWidth={8} />)}</>} /></V>],
  // dia 3
  [T('día', 2), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 5), x: Math.sin(t * 2.5) * 40, y: 0}} bg={<g style={{filter: `hue-rotate(${Math.sin(t * 2) * 40}deg)`}}><Desert t={t} heat={1} mirage /></g>} hero={<><Hero x={1100 + Math.sin(t * 4) * 12} y={GY + 20} s={1.4} t={t} pose={POSES.reach} eyes="wide" sweat /><g opacity={0.3}><Hero x={1150} y={GY + 20} s={1.4} t={t} pose={POSES.reach} eyes="wide" /></g></>} /></V>],
  [T('puedes'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.1, 4)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Bars t={t} at={T('puedes') + 0.3} />} /></V>],
  // el record
  [T('y', 3), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Cell t={t} />} /></V>],
  [T('1979'), (lt, t) => <V fx={700}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.3, 8, 700, 450)} bg={<g style={{filter: 'sepia(0.5)'}}><Cell t={t} /></g>} hero={<Hero x={700} y={GY + 20} s={1.4} t={t} pose={t > T('sobrevivió') ? POSES.reach : POSES.idle} eyes="wide" />} /></V>],
  [T('cuántos'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Desert t={t} heat={0.6} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" />} /></V>],
];

export const AguaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('agua/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('hora'), T('hora', 2), T('día'), T('día', 2), T('1979')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <SerieTag t={t} ep={1} />
      <VBig t={t} at={0.03} until={T('hora') - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="SIN AGUA?" size={98} color2="#7CF4FF" />
      <VBig t={t} at={T('hora')} until={T('pero') - 0.05} a="HORA 1" size={170} />
      <VBig t={t} at={T('hora', 2)} until={T('día') - 0.05} a="HORA 24" b="-2 LITROS" size={150} color2="#7CF4FF" />
      <VBig t={t} at={T('día')} until={T('día', 2) - 0.05} a="DÍA 2" b={t > T('riñones') ? 'RIÑONES FALLANDO' : 'SANGRE ESPESA'} size={130} color2="#FF4D6D" />
      <VBig t={t} at={T('día', 2)} until={T('puedes') - 0.05} a="DÍA 3" b="ALUCINACIONES" size={110} color2="#FF4D6D" />
      <VBig t={t} at={T('1979')} until={T('cuántos') - 0.05} a="1979" b="18 DÍAS" size={170} color2="#FFD23F" />
      <VBig t={t} at={T('cuántos')} until={T('mañana') - 0.05} a="¿CUÁNTOS DÍAS" b="AGUANTARÍAS?" size={115} />
      {t < T('mañana') && <Caps t={t} />}
      <FollowCard t={t} at={T('mañana')} ep={1} next="¿EN EL ESPACIO SIN TRAJE?"><svg viewBox="0 0 760 560" width={760} height={560}><Stars t={t} /><Earth x={380} y={330} r={170} t={t} /><g transform="translate(560 160) rotate(20)"><Hero x={0} y={0} s={0.7} t={t} pose={POSES.fly} eyes="wide" mouth="o" /></g></svg></FollowCard>
    </AbsoluteFill>
  );
};

export const AguaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.4, 1.4, 1, 960, 420)} bg={<Desert t={1} heat={1} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={1} pose={POSES.kneel} eyes="wide" mouth="o" sweat />} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="SIN AGUA?" size={98} y={180} color2="#7CF4FF" />
    </AbsoluteFill>
  );
};
