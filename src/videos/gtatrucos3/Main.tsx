import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY} from '../futuro/kit';
import {Hero, NPC, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset} from '../gta19/Main';
import {PINK, CYAN, YEL, F, DARK, shake, ArrowPanel, Pad} from '../gtakit';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 76;
const Caps = makeCaps(words as any, /\d|gta|trucos?|l1|r1|lb|rb|fuerza|balones|bulldozer|bomberos|estrellas|filtro|dorado|horas|arriba|abajo|derecha|izquierda/i);

const REC = T('recuerda'), U1 = T('truco'), U2 = T('truco', 2), MIS = T('es'), U3 = T('truco', 3), BOMB = T('si'), U4 = T('truco', 4), DES = T('para'),
  FIL = T('raro') - 0.4, END = T('cuál');

/** puñetazo que manda a volar a un NPC */
const Fling: React.FC<{t: number; lt: number}> = ({t, lt}) => {
  const p = (lt * 0.9) % 1;
  return (
    <g>
      <Hero x={780} y={GY + 20} s={1.2} t={t} pose={p < 0.15 ? POSES.push : POSES.fists} eyes="angry" mouth="grin" />
      <g transform={`translate(${880 + p * 700} ${GY + 20 - Math.sin(Math.PI * p) * 520})`}>
        <NPC x={0} y={0} s={1.0} t={t} color={CYAN} pose={POSES.fly} eyes="wide" mouth="o" rotate={p * 900} />
      </g>
      {p < 0.18 && <g transform="translate(900 640)">{Array.from({length: 10}).map((_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 140} y2={Math.sin(a) * 140} stroke={YEL} strokeWidth={10} />; })}</g>}
    </g>
  );
};
/** balon que explota */
const Ball: React.FC<{t: number; k: number}> = ({t, k}) => {
  const x = 700 + Math.min(1, k / 0.6) * 300, boom = k > 0.6, b = (k - 0.6) / 0.4;
  return (
    <g>
      <NPC x={1110} y={GY + 20} s={1.1} t={t} color={PINK} pose={boom ? POSES.fly : POSES.idle} eyes="wide" mouth="o" rotate={boom ? -40 * b : 0} />
      {!boom ? <g transform={`translate(${x} ${GY - 40 - Math.abs(Math.sin(k * 12)) * 120}) rotate(${k * 1200})`}>
        <circle r={50} fill="#fff" stroke="#111" strokeWidth={6} /><path d="M 0 -18 L 17 -6 L 11 15 L -11 15 L -17 -6 Z" fill="#111" />
        {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M 0 -50 L 0 -30" stroke="#111" strokeWidth={5} transform={`rotate(${a})`} />)}
      </g> : <g transform={`translate(1000 ${GY - 60}) scale(${0.4 + b * 1.6})`} opacity={1.2 - b}>
        <circle r={160} fill="#FF7A1A" /><circle r={110} fill={YEL} /><circle r={55} fill="#fff" />
        {Array.from({length: 12}).map((_, i) => <path key={i} d="M -20 -150 L 0 -260 L 20 -150 Z" fill="#FF4D6D" transform={`rotate(${i * 30})`} />)}
      </g>}
    </g>
  );
};
/** bulldozer */
const Dozer: React.FC<{t: number; x: number}> = ({t, x}) => (
  <g transform={`translate(${x} ${GY - 10})`}>
    <rect x={-200} y={-50} width={360} height={70} rx={30} fill="#333" stroke="#111" strokeWidth={6} />
    {[-160, -80, 0, 80, 120].map((dx) => <circle key={dx} cx={dx} cy={-15} r={22} fill="#666" stroke="#111" strokeWidth={4} transform={`rotate(${t * 300} ${dx} -15)`} />)}
    <rect x={-170} y={-170} width={260} height={120} rx={10} fill={YEL} stroke="#111" strokeWidth={6} />
    <rect x={-120} y={-260} width={150} height={95} rx={8} fill={YEL} stroke="#111" strokeWidth={6} />
    <rect x={-100} y={-245} width={110} height={60} fill="#9ad1ff" stroke="#111" strokeWidth={4} />
    <rect x={20} y={-230} width={20} height={70} fill="#555" />
    <path d="M 150 -150 L 260 -170 L 290 30 L 170 30 Z" fill="#c99700" stroke="#111" strokeWidth={6} />
    <path d="M 90 -110 L 170 -90" stroke="#111" strokeWidth={14} />
  </g>
);
/** camion de bomberos */
const FireTruck: React.FC<{t: number; x: number}> = ({t, x}) => (
  <g transform={`translate(${x} ${GY - 10})`}>
    <rect x={-300} y={-170} width={480} height={150} rx={12} fill="#E63946" stroke="#111" strokeWidth={6} />
    <path d="M 180 -170 L 270 -170 L 310 -90 L 310 -20 L 180 -20 Z" fill="#E63946" stroke="#111" strokeWidth={6} />
    <path d="M 195 -155 L 260 -155 L 290 -95 L 195 -95 Z" fill="#9ad1ff" stroke="#111" strokeWidth={4} />
    <g transform="translate(-280 -190) rotate(-6)"><rect width={430} height={26} fill="#ddd" stroke="#111" strokeWidth={4} />{Array.from({length: 10}).map((_, i) => <rect key={i} x={10 + i * 42} y={0} width={6} height={26} fill="#111" />)}</g>
    <rect x={200} y={-200} width={60} height={26} rx={8} fill={Math.sin(t * 14) > 0 ? '#4CC9F0' : '#FF2D2D'} />
    <rect x={-280} y={-120} width={440} height={14} fill="#fff" />
    {[-200, 0, 230].map((dx) => <g key={dx} transform={`translate(${dx} -10) rotate(${t * 500})`}><circle r={44} fill="#111" /><circle r={20} fill="#adb5bd" /><rect x={-3} y={-20} width={6} height={40} fill="#555" /></g>)}
  </g>
);
/** fondo de sirenas */
const Sirens: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill={Math.sin(t * 10) > 0 ? '#2a0b3a' : '#0b1a3a'} />
    <rect width={960} height={1080} fill="#FF2D2D" opacity={Math.max(0, Math.sin(t * 10)) * 0.3} />
    <rect x={960} width={960} height={1080} fill="#2D6BFF" opacity={Math.max(0, -Math.sin(t * 10)) * 0.3} />
  </g>
);
/** estrellas de busqueda */
const Stars5: React.FC<{t: number; n: number; y?: number; s?: number}> = ({t, n, y = 880, s = 1}) => (
  <g transform={`translate(960 ${y}) scale(${s})`}>
    {Array.from({length: 5}).map((_, i) => { const on = i < n; return (
      <g key={i} transform={`translate(${(i - 2) * 118} 0) scale(${on ? 1.05 + 0.08 * Math.sin(t * 8 + i) : 0.85})`}>
        <path d="M 0 -55 L 16 -17 L 57 -17 L 24 7 L 36 47 L 0 23 L -36 47 L -24 7 L -57 -17 L -16 -17 Z" fill={on ? YEL : '#444'} stroke="#111" strokeWidth={6} style={{filter: on ? `drop-shadow(0 0 16px ${YEL})` : undefined}} />
      </g>
    ); })}
  </g>
);
/** contador */
const Counter: React.FC<{k: number; n: number; icon: string; color: string}> = ({k, n, icon, color}) => (
  <g transform="translate(960 500) scale(0.9)" fontFamily={F} fontWeight={900}>
    <circle r={180} fill={color} stroke="#111" strokeWidth={10} />
    <text y={40} textAnchor="middle" fontSize={130}>{icon}</text>
    <text y={270} textAnchor="middle" fontSize={96} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">{Math.round(n * k)}/{n}</text>
  </g>
);
/** pareja de la mano al atardecer con filtro dorado */
const Golden: React.FC<{t: number; k: number; hrs: number}> = ({t, k, hrs}) => (
  <g>
    <Hero x={890} y={GY + 20} s={1.15} t={t} pose={POSES.hands} eyes="happy" mouth="smile" />
    <NPC x={1030} y={GY + 20} s={1.15} t={t} color={PINK} hairBun pose={POSES.hands} eyes="happy" mouth="smile" flip />
    <rect width={1920} height={1080} fill="#FFB703" opacity={0.35 * k} style={{mixBlendMode: 'overlay'}} />
    <rect width={1920} height={1080} fill="#FFD166" opacity={0.18 * k} />
    <g transform="translate(960 390)" fontFamily={F} fontWeight={900} opacity={k}>
      <rect x={-130} y={-60} width={260} height={110} rx={24} fill="#0B0620" stroke={YEL} strokeWidth={6} />
      <text y={22} textAnchor="middle" fontSize={64} fill={YEL}>{Math.min(4, hrs).toFixed(1)} H</text>
    </g>
  </g>
);
/** dos combinaciones casi iguales */
const Compare: React.FC<{t: number; hl: number; a: string[]; b: string[]; la: string; lb: string}> = ({t, hl, a, b, la, lb}) => {
  const on = t > hl;
  const row = (arr: string[], label: string, i: number) => (
    <div key={i} style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 26}}>
      <div style={{width: 120, fontFamily: F, fontWeight: 900, fontSize: 64, textAlign: 'center'}}>{label}</div>
      {arr.map((d, j) => { const last = j === arr.length - 1; return <div key={j} style={{width: 92, height: 92, borderRadius: 16, background: last && on ? (i ? '#7BF59A' : '#FF4D6D') : 'rgba(20,8,38,0.9)', border: `4px solid ${last && on ? '#fff' : PINK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, color: '#fff', opacity: on && !last ? 0.35 : 1, transform: `scale(${last && on ? 1.2 : 1})`}}>{d}</div>; })}
    </div>
  );
  return <div style={{position: 'absolute', left: 10, right: 10, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{row(a, la, 0)}{row(b, lb, 1)}</div>;
};

const ATK = ['↓', '↑', '←', '←', '→', '↓', '↓', '↑', '↓'], BAL = [...ATK.slice(0, 8), '→'];
const DOZ = ['←', '↑', '→', '↓', '←', '→', '→', '↓'], FIRE = [...DOZ.slice(0, 7), '↑'];

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 9 - lt * 12)}} bg={<Sunset t={t} scroll={t * 40} />} hero={<Fling t={t} lt={lt + 0.1} />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="day" cam={{...kbV(lt, 1.2, 1.4, 0.6), ...shake(t, 6)}} bg={<Sunset t={t} scroll={t * 40} />} hero={<Ball t={t} k={0.55 + lt * 0.7} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={<Sunset t={t} scroll={t * 300} />} hero={<FireTruck t={t} x={960} />} /></V>],
  [1.8, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 4)}} bg={<Sirens t={t} />} hero={<Stars5 t={t} n={5} y={540} s={1.0} />} /></V>],
  [2.4, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.3, 0.8)} bg={<Sunset t={t} scroll={0} />} hero={<Golden t={t} k={1} hrs={4} />} /></V>],
  [REC, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, U1 - REC)} bg={DARK} hero={<Pad t={t} up={t > T('móvil') - 0.2} l1={t > T('l1') - 0.1} r1={t > T('r1') - 0.1} labels={t > T('lb') - 0.1 ? ['LB', 'RB'] : ['L1', 'R1']} />} /></V>],
  [U1, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, U2 - U1)} bg={<Sunset t={t} scroll={t * 30} />} hero={<g transform={t > T('abajo') ? 'translate(0 160) scale(1)' : undefined}><Fling t={t} lt={lt} /></g>} /></V>],
  [U2, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, U3 - U2)} bg={<Sunset t={t} scroll={t * 30} />} hero={<g transform={t > MIS ? 'translate(0 200)' : undefined}><Ball t={t} k={(lt * 0.5) % 1} /></g>} /></V>],
  [U3, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, BOMB - U3)} bg={<Sunset t={t} scroll={t * 60} />} hero={<g transform="translate(0 130)"><Dozer t={t} x={980 + Math.sin(lt) * 40} /></g>} /></V>],
  [BOMB, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, U4 - BOMB)} bg={<Sunset t={t} scroll={t * 200} night />} hero={<g transform="translate(0 140)"><FireTruck t={t} x={960} /></g>} /></V>],
  [U4, (lt, t) => <V><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.1, DES - U4)} bg={<Sirens t={t} />} hero={<Stars5 t={t} n={Math.min(5, Math.floor(ramp(t, T('izquierda', 5), T('arriba', 6) + 0.2) * 5.99))} />} /></V>],
  [DES, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.0, FIL - DES), ...shake(t, lt < 0.4 ? 6 : 0)}} bg={DARK} hero={<Counter k={easeOut(ramp(t, T('escapar') - 0.2, T('veces') + 0.4))} n={50} icon="⭐" color="#FF4D6D" />} /></V>],
  [FIL, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.25, END - FIL, 960, 640)} bg={<Sunset t={t} scroll={0} />} hero={<Golden t={t} k={easeOut(ramp(t, T('dorado') - 0.2, T('dorado') + 0.5))} hrs={4 * ramp(t, T('pasando'), T('pareja'))} />} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Sunset t={t} scroll={t * 40} />} hero={<Fling t={t} lt={lt} />} /></V>],
];

export const GtaTrucos3Short: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtatrucos3/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={1.75} a="TRUCOS LOCOS" b="DE GTA 6" size={140} color="#FFD23F" color2="#FF4FA3" />
      <VBig t={t} at={1.8} until={REC - 0.05} a="5 TRUCOS" b="QUE NO CONOCÍAS" size={120} color2="#3DF5FF" />
      <VBig t={t} at={REC} until={U1 - 0.05} a="MÓVIL +" b={t > T('lb') - 0.1 ? 'LB + RB' : 'L1 + R1'} size={150} color2="#FF4FA3" />
      <VBig t={t} at={U1} until={U2 - 0.05} a="TRUCO 1" b="FUERZA DE ATAQUE" size={115} color="#FFD23F" />
      <VBig t={t} at={U2} until={U3 - 0.05} a="TRUCO 2" b="BALONES EXPLOSIVOS" size={110} color="#FFD23F" color2="#FF7A1A" />
      <VBig t={t} at={U3} until={BOMB - 0.05} a="TRUCO 3" b="BULLDOZER" size={140} color="#FFD23F" />
      <VBig t={t} at={BOMB} until={U4 - 0.05} a="ÚLTIMA ↑ =" b="CAMIÓN DE BOMBEROS" size={105} color2="#FF4D6D" />
      <VBig t={t} at={U4} until={DES - 0.05} a="TRUCO 4" b="+ ESTRELLAS" size={140} color="#FFD23F" color2="#FF4D6D" />
      <VBig t={t} at={DES} until={FIL - 0.05} a="ESCAPA DE ⭐⭐⭐" b="50 VECES" size={110} color2="#FF4D6D" />
      <VBig t={t} at={FIL} until={END - 0.05} a="TRUCO 5" b="FILTRO DORADO" size={130} color="#FFD23F" color2="#FFB703" />
      <VBig t={t} at={END} a="¿CUÁL VAS" b="A PROBAR?" size={135} color2="#FF4FA3" />
      <ArrowPanel t={t} words={words as any} from={T('abajo')} to={U2 - 0.05} />
      {t >= MIS && t < U3 && <Compare t={t} hl={T('derecha', 2)} a={ATK} b={BAL} la="👊" lb="⚽" />}
      <ArrowPanel t={t} words={words as any} from={T('izquierda', 3)} to={BOMB - 0.05} />
      {t >= BOMB && t < U4 && <Compare t={t} hl={T('arriba', 4)} a={DOZ} b={FIRE} la="🚜" lb="🚒" />}
      <ArrowPanel t={t} words={words as any} from={T('izquierda', 5)} to={DES - 0.05} />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaTrucos3Thumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="dusk" cam={kbV(0, 1.25, 1.25, 1)} bg={<Sunset t={1} scroll={40} />} hero={<Fling t={1} lt={0.45} />} /></V>
      <VBig t={1} at={0} a="TRUCOS #3" b="GTA 6" size={180} y={150} color="#FFD23F" color2="#FF4FA3" />
    </AbsoluteFill>
  );
};
