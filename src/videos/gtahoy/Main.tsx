import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset, Car, Cal, Boxes} from '../gta19/Main';
import words from './words.json';

export const DURATION_S = 48;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|gta|españa|noche|récord|gigas|vice|city|pc|nada/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const PINK = '#FF4FA3', CYAN = '#3DF5FF', F = 'Montserrat';
const DARK = <rect width={1920} height={1080} fill="#140826" />;

/** reloj digital de medianoche */
export const MidClock: React.FC<{t: number; txt: string; glow?: boolean; y?: number; s?: number}> = ({t, txt, glow, y = 560, s = 1}) => (
  <g transform={`translate(960 ${y}) scale(${s})`}>
    <rect x={-270} y={-130} width={540} height={260} rx={36} fill="#0B0620" stroke={glow ? PINK : '#444'} strokeWidth={10} />
    <text y={50} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={140} fill={glow ? PINK : CYAN} opacity={glow ? 0.75 + 0.25 * Math.sin(t * 14) : 1} style={{filter: `drop-shadow(0 0 18px ${glow ? PINK : CYAN})`}}>{txt}</text>
  </g>
);
/** zonas horarias que se van desbloqueando */
const Zones: React.FC<{k: number}> = ({k}) => (
  <g fontFamily={F} fontWeight={900}>
    {['N. ZELANDA', 'JAPÓN', 'ESPAÑA', 'EE. UU.'].map((n, i) => { const on = k > (i + 1) / 5; const me = n === 'ESPAÑA'; return (
      <g key={n} transform={`translate(960 ${290 + i * 108})`} opacity={k > i / 5 ? 1 : 0.25}>
        <rect x={-290} y={-50} width={580} height={100} rx={20} fill={on ? (me ? PINK : '#2EC4B6') : '#2a1a44'} stroke="#111" strokeWidth={6} />
        <text x={-260} y={18} fontSize={46} fill="#fff">{n}</text>
        <text x={260} y={18} textAnchor="end" fontSize={46} fill="#fff">{on ? '✔' : '🔒'}</text>
      </g>
    ); })}
  </g>
);
/** barra de descarga */
const Download: React.FC<{k: number; label?: string}> = ({k, label = '212 GB'}) => (
  <g transform="translate(960 520)" fontFamily={F} fontWeight={900}>
    <rect x={-300} y={-210} width={600} height={420} rx={30} fill="#0B0620" stroke="#fff" strokeWidth={6} />
    <text y={-90} textAnchor="middle" fontSize={110} fill="#fff">{label}</text>
    <path d="M -40 -20 L 40 -20 L 40 30 L 80 30 L 0 100 L -80 30 L -40 30 Z" fill={CYAN} />
    <rect x={-250} y={130} width={500} height={34} rx={17} fill="#2a1a44" />
    <rect x={-250} y={130} width={500 * k} height={34} rx={17} fill={PINK} />
  </g>
);
/** trofeo de récord */
export const Trophy: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g transform={`translate(960 520) scale(${0.5 + 0.5 * k}) rotate(${Math.sin(t * 3) * 4})`}>
    <path d="M -150 -200 L 150 -200 L 120 20 Q 0 110 -120 20 Z" fill="#FFD23F" stroke="#111" strokeWidth={10} />
    <path d="M -150 -170 Q -260 -170 -220 -60 Q -190 0 -130 0" stroke="#FFD23F" strokeWidth={26} fill="none" />
    <path d="M 150 -170 Q 260 -170 220 -60 Q 190 0 130 0" stroke="#FFD23F" strokeWidth={26} fill="none" />
    <rect x={-40} y={80} width={80} height={90} fill="#E9A800" stroke="#111" strokeWidth={8} />
    <rect x={-130} y={170} width={260} height={60} rx={10} fill="#3A0CA3" stroke="#111" strokeWidth={8} />
    <text y={-70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={64} fill="#111">Nº1</text>
    {Array.from({length: 10}).map((_, i) => { const a = i / 10 * Math.PI * 2 + t; return <circle key={i} cx={Math.cos(a) * 330} cy={-60 + Math.sin(a) * 300} r={10} fill="#fff" opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />; })}
  </g>
);
/** multitud corriendo hacia Vice City */
const Crowd: React.FC<{t: number}> = ({t}) => (
  <g>{Array.from({length: 14}).map((_, i) => { const x = ((rnd(i) * 1600 + t * (260 + rnd(i + 2) * 200)) % 1700) + 100; return <g key={i} transform={`translate(${x} ${GY + 30 - rnd(i + 5) * 40}) scale(${0.55 + rnd(i + 1) * 0.3})`}><NPC x={0} y={0} s={1} t={t * 3 + i} color={[PINK, CYAN, '#FFD23F', '#7BF59A'][i % 4]} pose={POSES.cheer} eyes="happy" mouth="grin" /></g>; })}</g>
);

const UNO = T('uno'), DOS = T('dos'), PRE = T('la', 3), TRES = T('tres'), PC = T('en', 4), CUA = T('cuatro'), NOCHE2 = T('esta', 2), END = T('tú');

const SHOTS: Shot[] = [
  // gancho: 00:00 en pantalla, persecucion, fecha
  [0, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8 - lt * 10)}} bg={DARK} hero={<MidClock t={t} txt="00:00" glow />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.3, 1.6, 0.7), ...shake(t, 5)}} bg={<Sunset t={t} scroll={t * 900} night />} hero={<Car x={960} t={t} />} /></V>],
  [1.3, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.3, 0.8), ...shake(t, 4)}} bg={DARK} hero={<Cal x={960} y={520} top="NOVIEMBRE" big="19" state="ok" k={1 + 0.1 * Math.sin(t * 12)} />} /></V>],
  [T('gta'), (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 3)} bg={<Sunset t={t} scroll={t * 120} night />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.fists} eyes="angry" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.point} eyes="angry" flip /></>} /></V>],
  [T('después'), (lt, t) => { const y = Math.round(2013 + 13 * easeOut(ramp(lt, 0.2, 1.4))); return <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.3, 2)} bg={DARK} hero={<text x={960} y={600} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={250} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{y}</text>} /></V>; }],
  [T('pero'), (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.4, 2.5, 960, 420)} bg={<Sunset t={t} scroll={t * 30} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" />} /></V>],
  // 1: hora local
  [UNO, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 6)} bg={DARK} hero={<Zones k={ramp(t, T('así') - 0.3, T('nosotros') + 0.3)} />} /></V>],
  // 2: 212 GB
  [DOS, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.2, 6), ...shake(t, t > T('eterna') - 0.1 && t < T('eterna') + 0.4 ? 5 : 0)}} bg={DARK} hero={<Download k={t < T('si') ? ramp(lt, 0, 1.2) : 0.04 + 0.01 * Math.sin(t)} />} /></V>],
  [PRE, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Sunset t={t} scroll={t * 40} />} hero={<Cal x={960} y={540} top="PRECARGA" big="10" state="ok" k={easeOut(ramp(lt, 0, 0.4))} />} /></V>],
  // 3: plataformas
  [TRES, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 4)} bg={DARK} hero={<Boxes t={t} k={lt} />} /></V>],
  [PC, (lt, t) => <V><Cine t={t} mood="red" cam={kbV(lt, 1.3, 1.5, 2)} bg={DARK} hero={<g transform={`translate(960 520) scale(1.5)`}><rect x={-100} y={-140} width={200} height={280} rx={16} fill="#555" stroke="#111" strokeWidth={7} /><text y={10} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#fff">PC</text><path d="M -110 -150 L 110 150 M 110 -150 L -110 150" stroke="#E63946" strokeWidth={22} strokeLinecap="round" opacity={ramp(t, T('nada') - 0.2, T('nada'))} /></g>} /></V>],
  // 4: record
  [CUA, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={DARK} hero={<Trophy t={t} k={easeOut(ramp(lt, 0, 0.6))} />} /></V>],
  // esta noche: todos a Vice City
  [NOCHE2, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 200} night />} hero={<Crowd t={t} />} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 20} night />} hero={<><MidClock t={t} y={330} s={0.7} txt={t < END + 1.6 ? '23:59' : '00:00'} glow={t >= END + 1.6} /><Hero x={960} y={GY + 20} s={1.2} t={t} pose={POSES.cheer} eyes={t >= END + 1.6 ? 'happy' : 'wide'} mouth="grin" /></>} /></V>],
];

const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;

export const GtaHoyShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtahoy/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={T('gta') - 0.05} a="GTA 6" b="ESTA NOCHE 00:00" size={130} color="#FF4FA3" color2="#3DF5FF" />
      <VBig t={t} at={T('gta')} until={T('después') - 0.05} a="SE DESBLOQUEA" b="EN ESPAÑA" size={115} color2="#FFD23F" />
      <VBig t={t} at={T('después')} until={T('pero') - 0.05} a="13 AÑOS" b="ESPERANDO" size={150} color2="#FF4FA3" />
      <VBig t={t} at={T('pero')} until={UNO - 0.05} a="LO QUE TIENES" b="QUE SABER" size={125} color2="#3DF5FF" />
      <VBig t={t} at={UNO} until={DOS - 0.05} a="1" b="HORA LOCAL" size={140} color="#FFD23F" />
      <VBig t={t} at={DOS} until={PRE - 0.05} a="2" b="212 GB" size={150} color="#FFD23F" />
      <VBig t={t} at={PRE} until={TRES - 0.05} a="PRECARGA" b="DESDE EL 10" size={130} color2="#3DF5FF" />
      <VBig t={t} at={TRES} until={CUA - 0.05} a="3" b={t > PC ? 'PC: NADA' : 'PS5 Y XBOX'} size={145} color="#FFD23F" />
      <VBig t={t} at={CUA} until={NOCHE2 - 0.05} a="4" b="RÉCORD DE RESERVAS" size={110} color="#FFD23F" />
      <VBig t={t} at={NOCHE2} until={END - 0.05} a="MILLONES" b="A LA VEZ" size={150} color2="#FF4FA3" />
      <VBig t={t} at={END} a="¿ESTARÁS DESPIERTO" b="A LAS 00:00?" size={105} color2="#FF4FA3" />
      <Arrow t={t} at={END + 1.8} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const GtaHoyThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="future" cam={kbV(0, 1.3, 1.3, 1)} bg={<Sunset t={1} scroll={100} night />} hero={<MidClock t={1.1} txt="00:00" glow />} /></V>
      <VBig t={1} at={0} a="GTA 6" b="ESTA NOCHE" size={170} y={150} color="#FF4FA3" color2="#3DF5FF" />
    </AbsoluteFill>
  );
};
