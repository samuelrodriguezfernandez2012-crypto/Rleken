import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES, CityNight} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, ramp, easeOut} from '../futuro/vkit';
import {Shockwave, Debris} from '../nivel0largo/fight';
import words from './words.json';

export const DURATION_S = 70;
const T = makeT(words as any);
const D = (n: number) => T('día', n + 1);
const Caps = makeCaps(words as any, /\d|metro|km|nubes|negro|espacial|tierra|bajar|meteorito|caída/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, k)))).join(',')})`;

/** cielo segun altura: 0 suelo -> 1 espacio */
const Sky: React.FC<{t: number; k: number; clouds?: number; ground?: React.ReactNode; curve?: boolean}> = ({t, k, clouds = 0, ground, curve}) => (
  <g>
    <rect width={1920} height={1080} fill={mix([142, 197, 232], [3, 4, 18], k)} />
    {k > 0.5 && <g opacity={(k - 0.5) * 2}><Stars t={t} n={140} /></g>}
    {curve && <><ellipse cx={960} cy={1700} rx={1500} ry={900} fill="#1E6FB0" /><ellipse cx={960} cy={1700} rx={1500} ry={900} fill="none" stroke="#7CC6FE" strokeWidth={30} opacity={0.6} filter="url(#blurGlow)" /></>}
    {clouds > 0 && Array.from({length: 8}).map((_, i) => <ellipse key={i} cx={(rnd(i) * 2200 + t * 40) % 2200 - 140} cy={700 + rnd(i + 2) * 300} rx={260} ry={70} fill="#fff" opacity={0.85 * clouds} />)}
    {ground}
  </g>
);
const Houses: React.FC<{y?: number; s?: number}> = ({y = GY, s = 1}) => (
  <g transform={`translate(0 ${y}) scale(1 ${s})`}>
    <rect y={0} width={1920} height={400} fill="#6FA35A" />
    {[300, 760, 1260, 1700].map((x, i) => <g key={x}><rect x={x - 120} y={-240} width={240} height={240} fill={['#E9C46A', '#F4A261', '#E76F51', '#A8DADC'][i]} stroke="#111" strokeWidth={6} /><path d={`M ${x - 150} -240 L ${x} -360 L ${x + 150} -240 Z`} fill="#C1440E" stroke="#111" strokeWidth={6} /></g>)}
  </g>
);
const ISS: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-14} width={140} height={28} fill="#D9D9D9" stroke="#111" strokeWidth={3} />
    {[-170, -120, 120, 170].map((dx) => <rect key={dx} x={dx - 22} y={-80} width={44} height={160} fill="#1D3557" stroke="#9FB3C8" strokeWidth={3} />)}
    <line x1={-190} y1={0} x2={190} y2={0} stroke="#9FB3C8" strokeWidth={6} />
  </g>
);
const Alt: React.FC<{t: number}> = ({t}) => {
  const vals = ['0,5 m', '5 m', '50 m', '500 m', '5 km', '50 km', '500 km'];
  let i = -1;
  for (let n = 1; n <= 7; n++) if (t >= D(n)) i = n - 1;
  if (i < 0 || t > T('entonces')) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1600, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: i >= 4 ? '#7CF4FF' : '#7BF59A', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>↑ {vals[i]}</div>;
};
const Jumper: React.FC<{t: number; y: number; s?: number; fire?: number; eyes?: any; pose?: any}> = ({t, y, s = 1.3, fire = 0, eyes = 'happy', pose = POSES.armsUp}) => (
  <g>
    {fire > 0 && <g opacity={fire}><ellipse cx={960} cy={y - 220 * s / 1.3} rx={200} ry={300} fill="#FF6B00" opacity={0.4} filter="url(#blurGlow)" /><path d={`M 840 ${y - 420 * s / 1.3} Q 960 ${y - 1200} 1080 ${y - 420 * s / 1.3} Z`} fill="#FFB703" opacity={0.7 + 0.2 * Math.sin(t * 30)} /></g>}
    <Hero x={960} y={y} s={s} t={t} pose={pose} eyes={eyes} mouth={eyes === 'happy' ? 'grin' : 'o'} />
    {Array.from({length: 8}).map((_, i) => <line key={i} x1={860 + i * 28} y1={y + 30 + rnd(i) * 40} x2={860 + i * 28} y2={y + 160 + rnd(i) * 140} stroke="#fff" strokeWidth={5} opacity={0.5} />)}
  </g>
);

const SHOTS: Shot[] = [
  // gancho: avance (cae ardiendo como un meteorito, curva de la Tierra)
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.6, 0.6), ...shake(t, 9)}} bg={<Sky t={t} k={0.8} curve />} hero={<g transform="rotate(180 960 560)"><Jumper t={t} y={800} fire={1} eyes="scared" pose={POSES.fly} /></g>} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.2, 1.4, 0.6)} bg={<Sky t={t} k={1} curve />} hero={<><ISS x={960} y={300} s={1.2} /><Jumper t={t} y={850} s={1} eyes="wide" /></>} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={{...kbV(lt, 1.4, 1.2, 0.6), ...shake(t, 6)}} bg={<Sky t={t} k={0.1} clouds={1} />} hero={<Jumper t={t} y={900 - lt * 300} eyes="happy" />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 14)}} bg={<Sky t={t} k={0} ground={<Houses />} />} hero={<><Shockwave x={960} y={GY} t={t} at={1.8} max={1300} /><Debris x={960} t={t} at={1.8} power={1.4} /></>} /></V>],
  // dias
  [D(1), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Sky t={t} k={0} ground={<Houses />} />} hero={<Jumper t={t} y={GY + 20 - Math.abs(Math.sin(lt * 3)) * 60} pose={POSES.idle} eyes="normal" />} /></V>],
  [D(2), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 4, 960, 400)} bg={<Sky t={t} k={0} ground={<Houses />} />} hero={<Jumper t={t} y={GY + 20 - Math.sin(Math.min(Math.PI / 2, lt * 1.2)) * 400} />} /></V>],
  [D(3), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sky t={t} k={0.1} ground={<g transform={`translate(0 ${easeOut(ramp(lt, 0, 2)) * 300})`}><CityNight noSky /></g>} />} hero={<Jumper t={t} y={780} />} /></V>],
  [D(4), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 5)} bg={<Sky t={t} k={0.15} ground={<g transform="translate(960 1000) scale(0.4) translate(-960 -900)"><CityNight noSky /></g>} />} hero={<Jumper t={t} y={780} s={1.1} />} /></V>],
  [D(5), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.2, 8), ...shake(t, 2)}} bg={<Sky t={t} k={0.3} clouds={1} />} hero={<Jumper t={t} y={800} eyes="wide" pose={POSES.headHold} />} /></V>],
  [D(6), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 10)} bg={<Sky t={t} k={0.5 + ramp(lt, 0, 3) * 0.4} curve />} hero={<Jumper t={t} y={800} s={1.1} eyes="wide" pose={POSES.fly} />} /></V>],
  [D(7), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 7)} bg={<Sky t={t} k={1} curve />} hero={<><ISS x={960} y={880 + lt * 20} s={0.6} /><Jumper t={t} y={640} s={0.9} eyes="wide" pose={POSES.armsUp} /></>} /></V>],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.5, 4, 960, 400)} bg={<Sky t={t} k={1} curve />} hero={<Jumper t={t} y={700} s={1.3} eyes="scared" pose={POSES.idle} />} /></V>],
  [T('caigo'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 6), ...shake(t, 4 + lt * 3)}} bg={<Sky t={t} k={1 - ramp(lt, 0, 5) * 0.6} curve={lt < 2} clouds={ramp(lt, 3, 5)} />} hero={<g transform="rotate(180 960 560)"><Jumper t={t} y={800} fire={easeOut(ramp(lt, 1.5, 4))} eyes="scared" pose={POSES.fly} /></g>} /></V>],
  [T('mi', 2), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.25, 4), ...(lt < 0.8 ? shake(t, 14) : {})}} bg={<Sky t={t} k={0.05} ground={<Houses />} />} hero={<><Shockwave x={960} y={GY} t={t} at={T('mi', 2)} max={1400} /><Debris x={960} t={t} at={T('mi', 2)} power={1.6} /><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.land} eyes="angry" /></>} /></V>],
  [T('hasta'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Sky t={t} k={0} ground={<Houses />} />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.shrug} eyes="wide" /><g transform={`translate(1320 ${1080 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const SaltoShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('salto/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, D(1), D(2), D(3), D(4), D(5), D(6), D(7), T('caigo'), T('mi', 2)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={D(1) - 0.05} a="CADA DÍA SALTO" b="x10 MÁS ALTO" size={115} color2="#7CF4FF" />
      {[1, 2, 3, 4, 5, 6, 7].map((n) => <VBig key={n} t={t} at={D(n)} until={(n < 7 ? D(n + 1) : T('entonces')) - 0.05} a={`DÍA ${n}`} b={['', '', 'AL TEJADO', 'SOBRE LOS EDIFICIOS', 'MÁS QUE UN RASCACIELOS', 'SOBRE LAS NUBES', 'CIELO NEGRO', 'SOBRE LA ESTACIÓN ESPACIAL'][n]} size={n >= 6 ? 110 : 140} color2="#7CF4FF" />)}
      <VBig t={t} at={T('entonces')} until={T('caigo') - 0.05} a="SUBIR ES FÁCIL" b={t > T('el', 3) ? 'EL PROBLEMA ES BAJAR' : undefined} size={115} color2="#FF4D6D" />
      <VBig t={t} at={T('caigo')} until={T('mi', 2) - 0.05} a="10.000 km/h" b="ARDIENDO" size={140} color2="#FF6B3D" />
      <VBig t={t} at={T('mi', 2)} until={T('hasta') - 0.05} a="MI PODER NO ERA SALTAR" b={t > T('era', 2) ? 'ERA SOBREVIVIR' : undefined} size={95} color2="#FFD23F" />
      <VBig t={t} at={T('hasta')} a="¿HASTA QUÉ DÍA" b="SALTARÍAS TÚ?" size={125} />
      <Alt t={t} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const SaltoThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="night" cam={kbV(0, 1.2, 1.2, 1)} bg={<Sky t={1} k={1} curve />} hero={<><ISS x={960} y={880} s={0.7} /><Jumper t={1} y={620} s={1.1} eyes="wide" pose={POSES.armsUp} /></>} /></V>
      <VBig t={1} at={0} a="CADA DÍA SALTO" b="x10 MÁS ALTO" size={115} y={180} color2="#7CF4FF" />
    </AbsoluteFill>
  );
};
