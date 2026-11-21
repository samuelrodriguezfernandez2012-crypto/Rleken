import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Hospital} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset, Car, Cal, MapL, PlayCount} from '../gta19/Main';
import {PINK, CYAN, YEL, F, DARK, shake, Stamp, ArrowPanel, Pad, Lock} from '../gtakit';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 69;
const Caps = makeCaps(words as any, /\d|gta|trucos|l1|r1|lb|rb|infinita|recargar|blindaje|flecha|reto|medallas/i);
const REC = T('recuerda'), U1 = T('truco'), U2 = T('truco', 2), FIJ = T('te'), U3 = T('truco', 3), OJO = T('ojo'), MUN = T('la', 4), BLI = T('y', 4), END = T('qué');

/** lluvia de balas */
const Bullets: React.FC<{t: number; n?: number}> = ({t, n = 40}) => (
  <g>{Array.from({length: n}).map((_, i) => { const p = (t * (0.4 + rnd(i) * 0.4) + rnd(i + 7)) % 1; const x = rnd(i + 1) * 1920, y = -60 + p * 1200; return <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(t * 4 + i) * 60})`}><rect x={-12} y={-34} width={24} height={52} rx={4} fill="#E9A800" stroke="#111" strokeWidth={3} /><path d="M -12 -34 Q 0 -60 12 -34 Z" fill="#b08968" stroke="#111" strokeWidth={3} /></g>; })}</g>
);
/** contador de municion */
const Ammo: React.FC<{t: number; inf: boolean}> = ({t, inf}) => (
  <g transform="translate(960 480)" fontFamily={F} fontWeight={900}>
    <rect x={-260} y={-130} width={520} height={260} rx={30} fill="#0B0620" stroke={inf ? PINK : '#fff'} strokeWidth={8} />
    <text y={60} textAnchor="middle" fontSize={inf ? 200 : 150} fill={inf ? PINK : '#fff'} style={{filter: inf ? `drop-shadow(0 0 20px ${PINK})` : undefined}}>{inf ? '∞' : String(30 - (Math.floor(t * 12) % 31)).padStart(2, '0')}</text>
  </g>
);
/** barra de recarga */
const Reload: React.FC<{t: number; off: number}> = ({t, off}) => (
  <g transform="translate(960 500)" fontFamily={F} fontWeight={900}>
    <text y={-80} textAnchor="middle" fontSize={64} fill="#fff" opacity={1 - off}>RECARGANDO…</text>
    <rect x={-260} y={-30} width={520} height={60} rx={30} fill="#2a1a44" stroke="#fff" strokeWidth={5} opacity={1 - off} />
    <rect x={-255} y={-25} width={510 * ((t * 0.8) % 1)} height={50} rx={25} fill={YEL} opacity={1 - off} />
    {off > 0 && <g opacity={off} transform={`rotate(-10) scale(${1 + (1 - off) * 1.5})`}><rect x={-300} y={-80} width={600} height={160} rx={16} fill="none" stroke="#7BF59A" strokeWidth={14} /><text y={30} textAnchor="middle" fontSize={80} fill="#7BF59A">SIN RECARGAR</text></g>}
  </g>
);
/** escudo de blindaje */
const Shield: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g transform={`translate(960 520) scale(${0.85 + 0.15 * k})`}>
    <path d="M 0 -260 L 220 -180 L 200 60 Q 160 200 0 280 Q -160 200 -200 60 L -220 -180 Z" fill="#1d3557" stroke="#fff" strokeWidth={10} />
    <clipPath id="shc"><path d="M 0 -260 L 220 -180 L 200 60 Q 160 200 0 280 Q -160 200 -200 60 L -220 -180 Z" /></clipPath>
    <rect clipPath="url(#shc)" x={-230} y={280 - 540 * k} width={460} height={540} fill={CYAN} opacity={0.85} />
    <text y={40} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff" stroke="#111" strokeWidth={6} paintOrder="stroke">{Math.round(100 * k)}%</text>
    {k > 0.98 && Array.from({length: 8}).map((_, i) => { const a = i / 8 * Math.PI * 2 + t; return <circle key={i} cx={Math.cos(a) * 300} cy={Math.sin(a) * 300} r={10} fill="#fff" />; })}
  </g>
);
/** comparar dos combinaciones: solo cambia la ultima */
const Compare: React.FC<{t: number; at: number}> = ({t, at}) => {
  const a = ['↓', '↑', '→', '↓', '←', '←', '↑', '↓', '↓', '↓'], b = [...a.slice(0, 9), '↑'];
  const hl = t > at + 1.3;
  const row = (arr: string[], label: string, i: number) => (
    <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 26}}>
      <div style={{width: 110, fontFamily: F, fontWeight: 900, fontSize: 44, color: '#fff'}}>{label}</div>
      {arr.map((d, j) => { const last = j === 9; return <div key={j} style={{width: 78, height: 78, borderRadius: 16, background: last && hl ? (i ? '#7BF59A' : '#FF4D6D') : 'rgba(20,8,38,0.9)', border: `4px solid ${last && hl ? '#fff' : PINK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, fontWeight: 900, color: '#fff', opacity: hl && !last ? 0.35 : 1, transform: `scale(${last && hl ? 1.2 : 1})`}}>{d}</div>; })}
    </div>
  );
  return <div style={{position: 'absolute', left: 20, right: 20, top: 640}}>{row(a, '∞', 0)}{row(b, 'NO R', 1)}</div>;
};
/** medalla / contador de retos */
const Counter: React.FC<{k: number; n: number; icon: string; label: string; color: string}> = ({k, n, icon, label, color}) => (
  <g transform="translate(960 500) scale(0.9)" fontFamily={F} fontWeight={900}>
    <circle r={180} fill={color} stroke="#111" strokeWidth={10} />
    <text y={40} textAnchor="middle" fontSize={140}>{icon}</text>
    <text y={270} textAnchor="middle" fontSize={96} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">{Math.round(n * k)}/{n}</text>
  </g>
);

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8 - lt * 10)}} bg={DARK} hero={<><Bullets t={t} n={30} /><Ammo t={t} inf /></>} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={DARK} hero={<Shield t={t} k={1} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 4)}} bg={DARK} hero={<Pad t={t} up l1 r1 />} /></V>],
  [1.8, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 2, 960, 420)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.point} eyes="happy" mouth="grin" />} /></V>],
  [REC, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 10)} bg={DARK} hero={<Pad t={t} up={t > T('móvil') - 0.2} l1={t > T('l1') - 0.1} r1={t > T('r1') - 0.1} labels={t > T('lb') - 0.1 ? ['LB', 'RB'] : ['L1', 'R1']} />} /></V>],
  [U1, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 11)} bg={DARK} hero={<><Bullets t={t} n={16} /><g transform="translate(0 -60)"><Ammo t={t} inf={t > T('infinita') - 0.1} /></g></>} /></V>],
  [U2, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 11)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<g transform="translate(0 -80)"><Reload t={t} off={easeOut(ramp(t, T('recargar') - 0.2, T('recargar') + 0.3))} /></g>} /></V>],
  [FIJ, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.1, 3.5)} bg={DARK} hero={<Hero x={960} y={GY - 120} s={0.8} t={t} pose={POSES.point} eyes="wide" mouth="o" />} /></V>],
  [U3, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 11)} bg={DARK} hero={<g transform="translate(0 -80) scale(1)"><Shield t={t} k={easeOut(ramp(t, T('abajo', 10) - 0.3, T('abajo', 12) + 0.5))} /></g>} /></V>],
  [OJO, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.0, 1.2), ...shake(t, lt < 0.4 ? 6 : 0)}} bg={DARK} hero={<Lock k={easeOut(ramp(lt, 0, 0.4))} open={t > T('reto') + 0.2} />} /></V>],
  [MUN, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 4.7)} bg={DARK} hero={<Counter k={easeOut(ramp(t, T('25') - 0.3, T('tiro') + 0.3))} n={25} icon="🥈" label="CAMPO DE TIRO" color="#adb5bd" />} /></V>],
  [BLI, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3.1)} bg={DARK} hero={<Counter k={easeOut(ramp(t, T('100') - 0.3, T('entrenamientos') + 0.6))} n={100} icon="🏋️" label="ENTRENAMIENTOS" color="#FF6B3D" />} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.cheer} eyes="happy" mouth="grin" flip /></>} /></V>],
];

export const GtaTrucos2Short: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtatrucos2/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={1.75} a="MÁS TRUCOS" b="DE GTA 6" size={150} color="#FFD23F" color2="#FF4FA3" />
      <VBig t={t} at={1.8} until={REC - 0.05} a="CASI NADIE" b="LOS CONOCE" size={140} color2="#3DF5FF" />
      <VBig t={t} at={REC} until={U1 - 0.05} a="MÓVIL +" b={t > T('lb') - 0.1 ? 'LB + RB' : 'L1 + R1'} size={150} color2="#FF4FA3" />
      <VBig t={t} at={U1} until={U2 - 0.05} a="TRUCO 1" b="MUNICIÓN INFINITA" size={110} color="#FFD23F" />
      <VBig t={t} at={U2} until={FIJ - 0.05} a="TRUCO 2" b="SIN RECARGAR" size={130} color="#FFD23F" color2="#7BF59A" />
      <VBig t={t} at={FIJ} until={U3 - 0.05} a="¿TE HAS FIJADO?" b="SOLO CAMBIA 1" size={115} color2="#FF4D6D" />
      <VBig t={t} at={U3} until={OJO - 0.05} a="TRUCO 3" b="BLINDAJE 100%" size={130} color="#FFD23F" color2="#3DF5FF" />
      <VBig t={t} at={OJO} until={MUN - 0.05} a="OJO" b="CADA UNO TIENE UN RETO" size={95} color="#FF4D6D" />
      <VBig t={t} at={MUN} until={BLI - 0.05} a="MUNICIÓN ∞" b="25 PLATAS" size={130} color2="#adb5bd" />
      <VBig t={t} at={BLI} until={END - 0.05} a="BLINDAJE" b="100 ENTRENOS" size={130} color2="#FF6B3D" />
      <VBig t={t} at={END} a="¿QUÉ TRUCO" b="QUIERES AHORA?" size={125} color2="#FF4FA3" />
      <ArrowPanel t={t} words={words as any} from={T('abajo')} to={U2 - 0.05} />
      <ArrowPanel t={t} words={words as any} from={T('abajo', 6)} to={FIJ - 0.05} />
      {t >= FIJ && t < U3 && <Compare t={t} at={FIJ} />}
      <ArrowPanel t={t} words={words as any} from={T('abajo', 10)} to={OJO - 0.05} />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaTrucos2Thumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="future" cam={kbV(0, 1.2, 1.2, 1)} bg={DARK} hero={<><Bullets t={1} n={30} /><Ammo t={1} inf /></>} /></V>
      <VBig t={1} at={0} a="TRUCOS #2" b="GTA 6" size={180} y={150} color="#FFD23F" color2="#FF4FA3" />
    </AbsoluteFill>
  );
};
