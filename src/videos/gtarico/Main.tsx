import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut, Stars} from '../futuro/vkit';
import {Sunset, Car, Cal} from '../gta19/Main';
import {Trophy} from '../gtahoy/Main';
import {PINK, CYAN, YEL, F, DARK, shake, Stamp, ArrowPanel, Money} from '../gtakit';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 63.5;
const Caps = makeCaps(words as any, /\d|gta|rico|paso|moses|joyer|diamante|tesoro|kenton|mueres|dólares|truco|arriba|abajo|derecha|izquierda/i);

const P1 = T('paso', 3), CAP = T('el', 3), P2 = T('paso', 4), MOS = T('véndeselos'), SOLO = T('solo'), DORM = T('pero'), P3 = T('paso', 5), DIA = T('las'),
  P4 = T('paso', 6), TES = T('si', 2), OJO = T('ojo'), VEN = T('así', 2), PREM = T('premio'), COD = T('arriba'), END = T('cuánto');

/** contador de dinero */
const Cash: React.FC<{v: number; y?: number; c?: string}> = ({v, y = 230, c = '#7BF59A'}) => (
  <g transform={`translate(960 ${y})`} fontFamily={F} fontWeight={900}>
    <rect x={-290} y={-80} width={580} height={150} rx={30} fill="#0B0620" stroke={c} strokeWidth={8} />
    <text y={30} textAnchor="middle" fontSize={96} fill={c}>${Math.round(v).toLocaleString('es-ES')}</text>
  </g>
);
/** coches vendidos hoy (n de max) */
const CarsDay: React.FC<{n: number; max?: number; reset?: boolean}> = ({n, max = 4, reset}) => (
  <g transform="translate(960 540)" fontFamily={F} fontWeight={900}>
    {Array.from({length: max}).map((_, i) => <g key={i} transform={`translate(${(i - (max - 1) / 2) * 140} 0)`} opacity={i < n ? 1 : 0.25}>
      <rect x={-60} y={-30} width={120} height={50} rx={14} fill={i < n ? PINK : '#555'} stroke="#111" strokeWidth={5} />
      <path d="M -35 -30 L -20 -60 L 25 -60 L 40 -30 Z" fill={i < n ? PINK : '#555'} stroke="#111" strokeWidth={5} />
      <circle cx={-32} cy={22} r={16} fill="#111" /><circle cx={32} cy={22} r={16} fill="#111" />
      {i < n && <text y={110} textAnchor="middle" fontSize={44} fill="#7BF59A">✔</text>}
    </g>)}
    <text y={170} textAnchor="middle" fontSize={70} fill={reset ? CYAN : '#fff'} stroke="#111" strokeWidth={6} paintOrder="stroke">{n}/{max} {reset ? '↻' : 'HOY'}</text>
  </g>
);
/** dormir: luna y zzz */
const Sleep: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#0b1030" />
    <Stars t={t} n={120} />
    <circle cx={1120} cy={260} r={90} fill="#f1f3f5" /><circle cx={1160} cy={230} r={80} fill="#0b1030" />
    <rect x={700} y={720} width={520} height={110} rx={20} fill="#3d348b" stroke="#111" strokeWidth={6} />
    <rect x={700} y={660} width={130} height={80} rx={20} fill="#f1f3f5" stroke="#111" strokeWidth={6} />
    <ellipse cx={1000} cy={720} rx={230} ry={40} fill="#7678ed" stroke="#111" strokeWidth={6} />
    {[0, 1, 2].map((i) => { const p = (t * 0.6 + i / 3) % 1; return <text key={i} x={820 + p * 220} y={620 - p * 300} fontFamily={F} fontWeight={900} fontSize={60 + p * 40} fill="#fff" opacity={1 - p}>Z</text>; })}
  </g>
);
/** joyeria con icono de diamante */
const Jewel: React.FC<{t: number; glow: boolean}> = ({t, glow}) => (
  <g>
    <rect width={1920} height={1080} fill="#1a0b33" />
    <rect x={660} y={360} width={600} height={560} fill="#2d1b55" stroke="#111" strokeWidth={8} />
    <rect x={700} y={540} width={240} height={300} fill="#3DF5FF" opacity={0.25} stroke="#fff" strokeWidth={6} />
    <rect x={980} y={540} width={240} height={380} fill="#111" stroke="#fff" strokeWidth={6} />
    <rect x={690} y={400} width={540} height={100} rx={14} fill="#0B0620" stroke={PINK} strokeWidth={6} />
    <text x={960} y={472} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill={PINK}>JOYERÍA</text>
    {[760, 820, 880].map((x, i) => <path key={i} d={`M ${x} 700 l 18 -20 l 18 20 l -18 26 Z`} fill={YEL} opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />)}
    <g transform={`translate(960 210) scale(${glow ? 1 + 0.08 * Math.sin(t * 8) : 0.7})`} style={{filter: glow ? `drop-shadow(0 0 30px ${CYAN})` : undefined}} opacity={glow ? 1 : 0.4}>
      <path d="M -110 -40 L -60 -100 L 60 -100 L 110 -40 L 0 110 Z" fill={CYAN} stroke="#fff" strokeWidth={8} />
      <path d="M -110 -40 L 110 -40 M -60 -100 L -30 -40 L 0 110 L 30 -40 L 60 -100" stroke="#fff" strokeWidth={5} fill="none" />
    </g>
  </g>
);
/** buceo con tesoro */
const Dive: React.FC<{t: number; open: number}> = ({t, open}) => (
  <g>
    <rect width={1920} height={1080} fill="#063a5c" />
    <rect y={0} width={1920} height={300} fill="#0a5c8a" opacity={0.6} />
    {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${500 + i * 150} 0 L ${560 + i * 150} 0 L ${520 + i * 150 + Math.sin(t + i) * 60} 900 Z`} fill="#fff" opacity={0.05} />)}
    <path d="M 0 920 Q 400 860 960 900 Q 1500 940 1920 880 L 1920 1080 L 0 1080 Z" fill="#c2a878" />
    {Array.from({length: 20}).map((_, i) => { const p = (t * 0.3 + rnd(i)) % 1; return <circle key={i} cx={700 + rnd(i + 3) * 520 + Math.sin(t * 3 + i) * 10} cy={900 - p * 900} r={6 + rnd(i + 5) * 10} fill="none" stroke="#bde0fe" strokeWidth={3} opacity={1 - p} />; })}
    <g transform="translate(960 830)">
      <rect x={-130} y={-40} width={260} height={110} rx={10} fill="#8a5a2b" stroke="#111" strokeWidth={8} />
      {open > 0 && Array.from({length: 9}).map((_, i) => <circle key={i} cx={(i - 4) * 26} cy={-50 - open * 60 * Math.abs(Math.sin(t * 4 + i))} r={16} fill={YEL} stroke="#111" strokeWidth={3} />)}
      <g transform={`rotate(${-open * 50} -130 -40)`}><path d="M -130 -40 Q 0 -120 130 -40 Z" fill="#a0692f" stroke="#111" strokeWidth={8} /></g>
      <rect x={-20} y={-30} width={40} height={40} fill={YEL} stroke="#111" strokeWidth={4} />
    </g>
    <g transform={`translate(${880 + Math.sin(t) * 40} ${520 + Math.sin(t * 1.7) * 20}) rotate(-70)`}><Hero x={0} y={0} s={0.7} t={t} pose={POSES.cheer} eyes="wide" mouth="o" /></g>
  </g>
);
/** bolsas de dinero */
const Bags: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    {[-170, 0, 170].map((x, i) => <g key={i} transform={`translate(${960 + x} ${640 + (1 - k) * 0}) scale(${1 - k * 0.6})`} opacity={1 - k * 0.7}>
      <path d="M -80 0 Q -100 120 0 130 Q 100 120 80 0 Q 60 -30 30 -40 L 40 -70 L -40 -70 L -30 -40 Q -60 -30 -80 0 Z" fill="#7BC47F" stroke="#111" strokeWidth={8} />
      <text y={70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={80} fill="#1E5631">$</text>
    </g>)}
  </g>
);

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 9 - lt * 12)}} bg={DARK} hero={<><Money t={t} n={45} /><Cash v={250000} y={540} /></>} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={{...kbV(lt, 1.2, 1.4, 0.6), ...shake(t, 4)}} bg={<Jewel t={t} glow />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={<Sunset t={t} scroll={t * 260} />} hero={<Car x={960} t={t} color={PINK} />} /></V>],
  [1.8, (lt, t) => <V><Cine t={t} blur={1.2} mood="cold" cam={kbV(lt, 1.0, 1.25, 1.7)} bg={<Dive t={t} open={1} />} /></V>],
  [P1, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.15, CAP - P1)} bg={DARK} hero={<Cal x={960} y={520} top="CAPÍTULO" big="1" state={lt > 1.4 ? 'x' : ''} k={easeOut(ramp(lt, 0, 0.4))} />} /></V>],
  [CAP, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.15, P2 - CAP)} bg={DARK} hero={<><Money t={t} n={Math.round(lt * 12)} /><Cal x={960} y={520} top="CAPÍTULO" big="2" state="ok" k={easeOut(ramp(lt, 0, 0.4))} /></>} /></V>],
  [P2, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.2, MOS - P2)} bg={<Sunset t={t} scroll={t * 200} />} hero={<><Car x={960} t={t} color={CYAN} /><Hero x={960} y={GY - 70} s={0.6} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /></>} /></V>],
  [MOS, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.15, SOLO - MOS)} bg={<Sunset t={t} scroll={0} />} hero={<><Car x={960} t={0} color={CYAN} /><Cash v={1000 * easeOut(ramp(t, T('mil') - 0.3, T('mil') + 0.4))} y={400} /></>} /></V>],
  [SOLO, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.15, DORM - SOLO)} bg={DARK} hero={<CarsDay n={Math.min(4, Math.floor(ramp(t, T('tres') - 0.2, T('cuatro') + 0.3) * 4.99))} />} /></V>],
  [DORM, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.0, 1.2, P3 - DORM)} bg={<Sleep t={t} />} hero={t > T('reinicia') - 0.1 ? <g transform="translate(0 -320) scale(0.6)"><CarsDay n={0} reset /></g> : undefined} /></V>],
  [P3, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.0, 1.15, DIA - P3)} bg={<Jewel t={t} glow={false} />} /></V>],
  [DIA, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.15, 1.35, P4 - DIA, 960, 300)} bg={<Jewel t={t} glow />} hero={t > T('mucho') ? <Money t={t} n={25} /> : undefined} /></V>],
  [P4, (lt, t) => <V><Cine t={t} blur={1.2} mood="cold" cam={kbV(lt, 1.0, 1.15, TES - P4)} bg={<Dive t={t} open={0} />} /></V>],
  [TES, (lt, t) => <V><Cine t={t} blur={1.2} mood="cold" cam={kbV(lt, 1.0, 1.25, OJO - TES, 960, 800)} bg={<Dive t={t} open={easeOut(ramp(lt, 0.3, 1.2))} />} hero={<Cash v={40000 * easeOut(ramp(t, T('decenas') - 0.2, T('miles') + 0.6))} y={400} />} /></V>],
  [OJO, (lt, t) => <V><Cine t={t} blur={1.2} mood="red" cam={{...kbV(lt, 1.2, 1.0, VEN - OJO), ...shake(t, lt < 0.4 || (t > T('mueres') && t < T('mueres') + 0.5) ? 7 : 0)}} bg={DARK} hero={<><Bags t={t} k={easeOut(ramp(t, T('pierdes'), T('pierdes') + 0.5))} /><Stamp k={easeOut(ramp(t, T('pierdes'), T('pierdes') + 0.3))} txt="PERDIDO" y={380} /></>} /></V>],
  [VEN, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.15, PREM - VEN)} bg={DARK} hero={<Bags t={t} k={0} />} /></V>],
  [PREM, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.2, COD - PREM)} bg={DARK} hero={<><Money t={t} n={Math.round(lt * 10)} /><Trophy t={t} k={easeOut(ramp(lt, 0, 0.5))} /></>} /></V>],
  [COD, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.1, END - COD)} bg={DARK} hero={<Money t={t} n={20} />} /></V>],
  [END, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Money t={t} n={30} /><Hero x={960} y={GY + 20} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /></>} /></V>],
];

export const GtaRicoShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  const big = (at: number, until: number, a: string, b: string, size = 130, c = '#fff', c2 = '#FFD23F') => <VBig t={t} at={at} until={until - 0.05} a={a} b={b} size={size} color={c} color2={c2} />;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtarico/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      {big(0.03, 1.8, 'HAZTE RICO', 'EN GTA 6', 150, '#7BF59A', '#FFD23F')}
      {big(1.8, P1, 'PASO', 'A PASO', 150, '#fff', '#3DF5FF')}
      {big(P1, CAP, 'PASO 1', 'NO PIERDAS EL TIEMPO', 105, '#FFD23F')}
      {big(CAP, P2, 'EL DINERO', 'EMPIEZA EN EL 2', 115, '#fff', '#7BF59A')}
      {big(P2, MOS, 'PASO 2', 'ROBA COCHES', 125, '#FFD23F', '#FF4FA3')}
      {big(MOS, SOLO, 'MOSES PAGA', '~1.000 $ / COCHE', 110, '#fff', '#7BF59A')}
      {big(SOLO, DORM, 'LÍMITE', '3-4 AL DÍA', 135, '#fff', '#FF4D6D')}
      {big(DORM, P3, 'DUERME', 'Y SE REINICIA', 125, '#fff', '#3DF5FF')}
      {big(P3, DIA, 'PASO 3', 'JOYERÍAS', 135, '#FFD23F', '#FF4FA3')}
      {big(DIA, P4, 'BUSCA EL', 'ICONO 💎', 130, '#fff', '#3DF5FF')}
      {big(P4, TES, 'PASO 4', 'BUCEA CON KENTON', 110, '#FFD23F', '#3DF5FF')}
      {big(TES, OJO, 'TODOS LOS', 'TESOROS', 130, '#fff', '#FFD23F')}
      {big(OJO, VEN, 'OJO', 'SI MUERES…', 140, '#FF4D6D', '#fff')}
      {big(VEN, PREM, 'VENDE', 'RÁPIDO', 150, '#fff', '#7BF59A')}
      {big(PREM, COD, 'PREMIO FINAL', '250.000 $', 125, '#FFD23F', '#7BF59A')}
      {big(COD, END, 'TRUCO', '250.000 $', 130, '#FFD23F', '#7BF59A')}
      {big(END, 1e9, '¿CUÁNTO', 'DINERO TIENES?', 125, '#fff', '#7BF59A')}
      <ArrowPanel t={t} words={words as any} from={COD - 0.05} to={END - 0.05} title="AL ACABAR LA HISTORIA" />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaRicoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="future" cam={kbV(0, 1.2, 1.2, 1)} bg={DARK} hero={<><Money t={1} n={45} /><Cash v={250000} y={600} /></>} /></V>
      <VBig t={1} at={0} a="HAZTE RICO" b="GTA 6" size={175} y={150} color="#7BF59A" color2="#FFD23F" />
    </AbsoluteFill>
  );
};
