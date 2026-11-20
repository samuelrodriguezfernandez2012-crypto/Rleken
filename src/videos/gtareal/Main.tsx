import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Hospital} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset, Car, Cal, MapL, PlayCount} from '../gta19/Main';
import {PINK, CYAN, YEL, F, DARK, shake, Stamp} from '../gtakit';
import {Brain} from '../insomnio/Main';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 68;
const Caps = makeCaps(words as any, /\d|gta|km|piso|cerebro|cráneo|órganos|paracaídas|vulović|guinness|sobrevivió|hueso|semanas/i);
const P1 = T('paso'), CUER = T('tu'), P2 = T('paso', 2), ESC = T('es'), PARA = T('el', 2), ORG = T('pero', 2), P3 = T('paso', 3), DOCE = T('en', 3), AQUI = T('y', 5), Y72 = T('en', 4), TIENE = T('tiene'), BURG = T('pero', 3), REAL = T('en', 6), END = T('cuánto', 2);

/** edificio con pisos y alguien cayendo */
const Building: React.FC<{t: number; floors: number; k: number; hit?: number}> = ({t, floors, k, hit = 0}) => {
  const fh = Math.min(70, 640 / floors), top = GY - floors * fh;
  const y = top - 40 + (GY - top) * k * k;
  return (
    <g>
      <rect x={700} y={top} width={260} height={GY - top} fill="#2a1a44" stroke="#111" strokeWidth={6} />
      {Array.from({length: floors}).map((_, i) => <g key={i}><line x1={700} y1={top + i * fh} x2={960} y2={top + i * fh} stroke="#111" strokeWidth={3} /><rect x={730} y={top + i * fh + fh * 0.25} width={60} height={fh * 0.45} fill={i % 3 ? CYAN : YEL} opacity={0.6} /><text x={930} y={top + i * fh + fh * 0.7} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={Math.min(34, fh * 0.6)} fill="#fff">{floors - i}</text></g>)}
      <g transform={`translate(1060 ${Math.min(y, GY - 30)}) rotate(${k * 300})`}><circle r={26} fill="#111" /><rect x={-20} y={24} width={40} height={60} rx={10} fill="#1d5fa8" /></g>
      {hit > 0 && Array.from({length: 10}).map((_, i) => { const a = i / 10 * Math.PI; return <line key={i} x1={1060 + Math.cos(a) * 40} y1={GY - Math.sin(a) * 20} x2={1060 + Math.cos(a) * 140 * hit} y2={GY - Math.sin(a) * 90 * hit} stroke={YEL} strokeWidth={8} />; })}
    </g>
  );
};
/** velocimetro */
const Speedo: React.FC<{v: number; max?: number; label?: string}> = ({v, max = 220, label = 'KM/H'}) => {
  const a = -210 + 240 * Math.min(1, v / max);
  return (
    <g transform="translate(960 600) scale(0.82)" fontFamily={F} fontWeight={900}>
      <circle r={230} fill="#0B0620" stroke="#fff" strokeWidth={10} />
      {Array.from({length: 12}).map((_, i) => { const b = (-210 + i * 240 / 11) * Math.PI / 180; return <line key={i} x1={Math.cos(b) * 180} y1={Math.sin(b) * 180} x2={Math.cos(b) * 210} y2={Math.sin(b) * 210} stroke={i > 8 ? '#FF4D6D' : '#fff'} strokeWidth={8} />; })}
      <line x1={0} y1={0} x2={Math.cos(a * Math.PI / 180) * 170} y2={Math.sin(a * Math.PI / 180) * 170} stroke={PINK} strokeWidth={14} strokeLinecap="round" />
      <circle r={22} fill={PINK} />
      <text y={120} textAnchor="middle" fontSize={90} fill="#fff">{Math.round(v)}</text>
      <text y={175} textAnchor="middle" fontSize={40} fill={CYAN}>{label}</text>
    </g>
  );
};
/** cielo de caida libre */
const Sky: React.FC<{t: number; sepia?: boolean}> = ({t, sepia}) => (
  <g style={{filter: sepia ? 'sepia(0.85)' : undefined}}>
    <rect width={1920} height={1080} fill={sepia ? '#c9b48a' : '#4ea8de'} />
    {Array.from({length: 10}).map((_, i) => { const y = ((rnd(i) * 1400 - t * (500 + rnd(i + 2) * 400)) % 1400 + 1400) % 1400 - 200; return <ellipse key={i} cx={rnd(i + 1) * 1920} cy={y} rx={220} ry={60} fill="#fff" opacity={0.75} />; })}
    {Array.from({length: 18}).map((_, i) => { const y = ((rnd(i + 30) * 1200 - t * 2200) % 1200 + 1200) % 1200 - 100; return <line key={i} x1={600 + rnd(i) * 720} y1={y} x2={600 + rnd(i) * 720} y2={y + 160} stroke="#fff" strokeWidth={4} opacity={0.5} />; })}
  </g>
);
/** cuerpo con organos que siguen moviendose */
const Organs: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g transform="translate(960 600) scale(0.8)">
    <path d="M -110 -260 a 90 100 0 1 1 220 0 a 90 100 0 1 1 -220 0 Z" fill="none" stroke="#fff" strokeWidth={8} />
    <path d="M -150 -150 L 150 -150 L 120 300 L -120 300 Z" fill="none" stroke="#fff" strokeWidth={8} />
    <g transform={`translate(${k * 40} 0)`}>
      <ellipse cx={0} cy={-260} rx={70} ry={60} fill="#F4A7B9" stroke="#C9184A" strokeWidth={6} />
      <ellipse cx={-50} cy={-30} rx={45} ry={80} fill="#ff8fa3" /><ellipse cx={50} cy={-30} rx={45} ry={80} fill="#ff8fa3" />
      <path d="M -20 30 q 20 -30 40 0 q 0 40 -20 60 q -20 -20 -20 -60" fill="#E63946" />
      <ellipse cx={0} cy={170} rx={90} ry={60} fill="#e9a37b" />
    </g>
    {k > 0.5 && <path d="M 75 -310 l 30 20 l -20 20 l 30 20" stroke={YEL} strokeWidth={8} fill="none" />}
  </g>
);
/** libro de records */
const Record: React.FC<{k: number}> = ({k}) => (
  <g transform={`translate(960 520) scale(${0.6 + 0.4 * k})`} fontFamily={F} fontWeight={900}>
    <rect x={-300} y={-220} width={600} height={440} rx={14} fill="#1D3557" stroke="#111" strokeWidth={10} />
    <rect x={-270} y={-190} width={540} height={380} rx={8} fill="none" stroke={YEL} strokeWidth={6} />
    <text y={-100} textAnchor="middle" fontSize={64} fill={YEL}>RÉCORD</text>
    <text y={-20} textAnchor="middle" fontSize={34} fill="#fff">CAÍDA MÁS ALTA</text>
    <text y={30} textAnchor="middle" fontSize={34} fill="#fff">SIN PARACAÍDAS</text>
    <text y={130} textAnchor="middle" fontSize={84} fill={YEL}>10.160 m</text>
  </g>
);
/** barra de vida que se rellena con hamburguesa */
const Health: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g fontFamily={F} fontWeight={900}>
    <g transform={`translate(960 ${430 + Math.sin(t * 6) * 10})`}>
      <ellipse cy={-40} rx={150} ry={70} fill="#e9a03b" stroke="#111" strokeWidth={6} />
      <rect x={-160} y={-20} width={320} height={30} rx={10} fill="#5a2d0c" />
      <rect x={-165} y={10} width={330} height={20} rx={8} fill="#7BC47F" />
      <rect x={-150} y={30} width={300} height={40} rx={18} fill="#e9a03b" stroke="#111" strokeWidth={6} />
    </g>
    <rect x={710} y={660} width={500} height={50} rx={25} fill="#2a1a44" stroke="#fff" strokeWidth={5} />
    <rect x={715} y={665} width={490 * k} height={40} rx={20} fill="#7BF59A" />
    <text x={960} y={780} textAnchor="middle" fontSize={50} fill="#fff">{Math.round(100 * k)}%</text>
  </g>
);

const SHOTS: Shot[] = [
  // gancho: caida libre, choque, edificio
  [0, (lt, t) => <V><Cine t={t} mood="day" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8)}} bg={<Sky t={t} />} hero={<Hero x={960} y={760} s={1.4} t={t} pose={POSES.fly} eyes="wide" mouth="o" rotate={20} />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.6, 0.6), ...shake(t, 12 - lt * 15)}} bg={<Sunset t={t} scroll={0} night />} hero={<><Car x={1000} t={0} color={CYAN} /><rect x={1240} y={500} width={80} height={400} fill="#555" stroke="#111" strokeWidth={6} /></>} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.2, 1.0, 1)} bg={<Sunset t={t} scroll={0} night />} hero={<Building t={t} floors={13} k={Math.min(1, lt / 0.9)} hit={lt > 0.9 ? 1 : 0} />} /></V>],
  [2.0, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 5)} bg={<Sunset t={t} scroll={t * 300} night />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t * 2} pose={POSES.cheer} eyes="happy" mouth="grin" /><Car x={1150} t={t} /></>} /></V>],
  [T('pero'), (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 3, 960, 420)} bg={<Sunset t={t} scroll={t * 30} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.shrug} eyes="wide" mouth="o" />} /></V>],
  // 1: saltar del coche a 50
  [P1, (lt, t) => { const jump = ramp(t, T('saltas', 2), T('saltas', 2) + 0.8); return <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.2, 4.6), ...shake(t, jump > 0.95 && lt < 3 ? 4 : 0)}} bg={<Sunset t={t} scroll={t * 700} />} hero={<><Car x={960} t={t} /><g transform={`translate(${-jump * 300} ${-Math.sin(jump * Math.PI) * 160 + jump * 140}) rotate(${jump * 200} 960 600)`}><Hero x={960} y={GY - 160} s={0.9} t={t} pose={POSES.scared} eyes="wide" /></g></>} fx={<Speedo v={50 * Math.min(1, lt / 1.5)} />} /></V>; }],
  [CUER, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 4)} bg={<Sunset t={t} scroll={0} night />} hero={<Building t={t} floors={3} k={Math.min(1, ramp(t, T('cayeras') - 0.3, T('piso') + 0.3))} hit={t > T('piso') + 0.3 ? 1 : 0} />} /></V>],
  // 2: choque a 100
  [P2, (lt, t) => { const hit = T('100') + 0.4; const x = t < hit ? 300 + (t - P2) / (hit - P2) * 720 : 1020; return <V><Cine t={t} mood={t < hit ? 'dusk' : 'red'} cam={{...kbV(lt, 1.0, 1.2, 4), ...shake(t, t > hit && t < hit + 0.6 ? 14 : 0)}} bg={<Sunset t={t} scroll={t < hit ? t * 900 : 0} />} hero={<><Car x={x} t={t < hit ? t : 0} color={CYAN} /><rect x={1270} y={480} width={90} height={420} fill="#555" stroke="#111" strokeWidth={6} /></>} fx={<Speedo v={t < hit ? 100 * Math.min(1, (t - P2) / 1.5) : 0} />} /></V>; }],
  [ESC, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 3)} bg={<Sunset t={t} scroll={0} night />} hero={<Building t={t} floors={13} k={Math.min(1, ramp(t, T('13') - 0.5, T('pisos') + 0.4))} hit={t > T('pisos') + 0.4 ? 1 : 0} />} /></V>],
  [PARA, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 5.6), ...shake(t, t > T('choca') && t < T('choca') + 0.5 ? 8 : 0)}} bg={DARK} hero={t < ORG ? <Brain t={t} off={0} /> : <Organs t={t} k={easeOut(ramp(t, ORG + 0.3, T('choca') + 0.2))} />} /></V>],
  // 3: avion
  [P3, (lt, t) => <V><Cine t={t} mood="day" cam={{...kbV(lt, 1.0, 1.15, 4), ...shake(t, 3)}} bg={<Sky t={t} />} hero={<Hero x={960} y={760} s={1.3} t={t} pose={POSES.fly} eyes="wide" mouth="o" rotate={Math.sin(t * 3) * 25} />} /></V>],
  [DOCE, (lt, t) => <V><Cine t={t} mood="day" cam={{...kbV(lt, 1.0, 1.1, 5), ...shake(t, 2 + lt)}} bg={<Sky t={t * (1 + lt * 0.4)} />} fx={<Speedo v={195 * easeOut(Math.min(1, lt / 3.5))} />} /></V>],
  [AQUI, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 2, 960, 420)} bg={DARK} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.headHold} eyes="wide" mouth="o" />} /></V>],
  [Y72, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 8)} bg={<Sky t={t * 0.4} sepia />} hero={<g style={{filter: 'sepia(0.7)'}}><g transform={`translate(${1300 - lt * 60} ${260 + lt * 20}) rotate(25)`}><rect x={-160} y={-24} width={320} height={48} rx={24} fill="#ddd" stroke="#111" strokeWidth={5} /><rect x={-40} y={-90} width={60} height={180} fill="#ddd" stroke="#111" strokeWidth={5} /></g><text x={960} y={700} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">{Math.round(10160 * (1 - ramp(t, T('10.000'), T('sobrevivió')))).toLocaleString('es-ES')} m</text></g>} /></V>],
  [TIENE, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 2)} bg={DARK} hero={<Record k={easeOut(ramp(lt, 0, 0.4))} />} /></V>],
  [BURG, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<Health t={t} k={0.15 + 0.85 * easeOut(ramp(t, T('hamburguesa') - 0.3, T('hamburguesa') + 0.4))} />} /></V>],
  [REAL, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 5)} bg={DARK} hero={<><Cal x={960} y={420} top="SEMANAS" big={t > T('8') ? '6-8' : '?'} k={0.8} /><Stamp k={easeOut(ramp(t, T('soldarse') - 0.2, T('soldarse') + 0.1))} txt="SIN CURAS" y={650} /></>} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.shrug} eyes="side" look={0.6} />} /></V>],
];

export const GtaRealShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtareal/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={T('pero') - 0.05} a="GTA 6" b="EN LA VIDA REAL" size={130} color="#FF4FA3" color2="#3DF5FF" />
      <VBig t={t} at={T('pero')} until={P1 - 0.05} a="¿CUÁNTO" b="AGUANTARÍAS?" size={130} color2="#FFD23F" />
      <VBig t={t} at={P1} until={CUER - 0.05} a="PASO 1" b="SALTAS A 50" size={140} color="#FFD23F" />
      <VBig t={t} at={CUER} until={P2 - 0.05} a="= CAER DE UN" b="3er PISO" size={130} color2="#FF4D6D" />
      <VBig t={t} at={P2} until={ESC - 0.05} a="PASO 2" b="CHOQUE A 100" size={140} color="#FFD23F" />
      <VBig t={t} at={ESC} until={PARA - 0.05} a="= CAER" b="13 PISOS" size={150} color2="#FF4D6D" />
      <VBig t={t} at={PARA} until={P3 - 0.05} a="TUS ÓRGANOS" b="SIGUEN MOVIÉNDOSE" size={100} color2="#FF4D6D" />
      <VBig t={t} at={P3} until={DOCE - 0.05} a="PASO 3" b="SIN PARACAÍDAS" size={120} color="#FFD23F" />
      <VBig t={t} at={DOCE} until={AQUI - 0.05} a="12 SEGUNDOS" b="≈ 200 KM/H" size={130} color2="#3DF5FF" />
      <VBig t={t} at={AQUI} until={Y72 - 0.05} a="PERO" b="ESPERA…" size={150} color2="#FFD23F" />
      <VBig t={t} at={Y72} until={TIENE - 0.05} a="1972" b={t > T('sobrevivió') ? '¡SOBREVIVIÓ!' : 'CAYÓ 10 KM'} size={130} color2={t > T('sobrevivió') ? '#7BF59A' : '#FF4D6D'} />
      <VBig t={t} at={TIENE} until={BURG - 0.05} a="RÉCORD" b="GUINNESS" size={150} color="#FFD23F" />
      <VBig t={t} at={BURG} until={REAL - 0.05} a="EN GTA" b="TE CURA UNA BURGER" size={105} color2="#7BF59A" />
      <VBig t={t} at={REAL} until={END - 0.05} a="EN LA VIDA REAL" b="6-8 SEMANAS" size={110} color2="#FF4D6D" />
      <VBig t={t} at={END} a="¿CUÁNTO DURARÍAS" b="EN UN GTA REAL?" size={105} color2="#FF4FA3" />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaRealThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="day" cam={kbV(0, 1.3, 1.3, 1)} bg={<Sky t={1} />} hero={<Hero x={960} y={760} s={1.4} t={1} pose={POSES.fly} eyes="wide" mouth="o" rotate={20} />} /></V>
      <VBig t={1} at={0} a="GTA 6" b="EN LA VIDA REAL" size={140} y={150} color="#FF4FA3" color2="#3DF5FF" />
    </AbsoluteFill>
  );
};
