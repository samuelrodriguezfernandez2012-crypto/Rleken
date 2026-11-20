import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Sea, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 66;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|venus|ácido|grados|plomo|presión|venera|récord|globo|tierra|año/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const F = 'Montserrat';

/** planeta Venus con bandas de nubes */
export const VenusPlanet: React.FC<{x: number; y: number; r: number; t: number}> = ({x, y, r, t}) => (
  <g>
    <defs><radialGradient id="vg" cx="40%" cy="35%"><stop offset="0" stopColor="#FFE8B0" /><stop offset="0.6" stopColor="#E9C46A" /><stop offset="1" stopColor="#B5651D" /></radialGradient><clipPath id="vc"><circle cx={x} cy={y} r={r} /></clipPath></defs>
    <circle cx={x} cy={y} r={r * 1.08} fill="#F4A261" opacity={0.25} />
    <circle cx={x} cy={y} r={r} fill="url(#vg)" />
    <g clipPath="url(#vc)">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${x - r * 1.5 + ((t * 30 + i * 70) % (r * 0.6))} ${y - r * 0.6 + i * r * 0.3} q ${r * 0.8} ${-r * 0.15} ${r * 2.4} 0`} stroke="#FFF3D6" strokeWidth={r * 0.08} fill="none" opacity={0.35} />)}</g>
  </g>
);
/** cielo de Venus a una altura dada (0 = suelo, 1 = 50 km) */
const VSky: React.FC<{t: number; h: number; acid?: number}> = ({t, h, acid = 0}) => {
  const top = h > 0.7 ? '#F6C177' : h > 0.3 ? '#C97B2D' : '#7A3B12';
  const bot = h > 0.7 ? '#FFE3A3' : h > 0.3 ? '#E39B3C' : '#B5541B';
  return (
    <g>
      <defs><linearGradient id={`vs${Math.round(h * 10)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bot} /></linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#vs${Math.round(h * 10)})`} />
      {Array.from({length: 9}).map((_, i) => <ellipse key={i} cx={((rnd(i) * 2200 + t * (30 + i * 8)) % 2400) - 240} cy={150 + rnd(i + 3) * 800} rx={320} ry={70} fill="#FFF1D0" opacity={0.25 + 0.2 * h} />)}
      {acid > 0 && <g opacity={acid}><rect width={1920} height={1080} fill="#C9D63A" opacity={0.35} />{Array.from({length: 40}).map((_, i) => { const y = ((rnd(i) * 1200 + t * 500) % 1200) - 60; return <ellipse key={i} cx={rnd(i + 5) * 1920} cy={y} rx={5} ry={14} fill="#E9F27B" opacity={0.8} />; })}</g>}
    </g>
  );
};
/** suelo de Venus */
const Ground: React.FC<{t: number}> = ({t}) => (
  <g>
    <path d={`M 0 ${GY - 40} L 300 ${GY - 90} L 620 ${GY - 30} L 980 ${GY - 110} L 1350 ${GY - 40} L 1700 ${GY - 100} L 1920 ${GY - 60} L 1920 1080 L 0 1080 Z`} fill="#6b3410" />
    {Array.from({length: 14}).map((_, i) => <ellipse key={i} cx={rnd(i) * 1920} cy={GY + 20 + rnd(i + 2) * 140} rx={40 + rnd(i + 1) * 60} ry={14} fill="#4a2209" />)}
    {Array.from({length: 10}).map((_, i) => { const p = (t * 0.6 + i / 10) % 1; return <path key={i} d={`M ${rnd(i) * 1920} ${GY - p * 400} q 20 -30 0 -60`} stroke="#ffb703" strokeWidth={5} fill="none" opacity={(1 - p) * 0.5} />; })}
  </g>
);
/** globo con cabina y personaje dentro */
const Balloon: React.FC<{t: number; y?: number}> = ({t, y = 0}) => (
  <g transform={`translate(0 ${y + 140 + Math.sin(t * 1.5) * 18})`}>
    <ellipse cx={960} cy={300} rx={170} ry={190} fill="#4CC9F0" stroke="#111" strokeWidth={8} />
    {[-90, 0, 90].map((dx) => <path key={dx} d={`M ${960 + dx * 0.4} 112 Q ${960 + dx} 300 ${960 + dx * 0.4} 488`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} />)}
    <text x={960} y={316} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill="#fff">AIRE</text>
    {[-80, 80].map((dx) => <line key={dx} x1={960 + dx} y1={470} x2={960 + dx * 0.7} y2={600} stroke="#111" strokeWidth={5} />)}
    <rect x={880} y={600} width={160} height={90} rx={12} fill="#8b5a3c" stroke="#111" strokeWidth={6} />
    <g transform="translate(960 640) scale(0.42)"><Hero x={0} y={0} s={1} t={t} pose={POSES.wave} eyes="happy" mouth="smile" /></g>
  </g>
);
/** altimetro + termometro */
const Gauges: React.FC<{km: number; temp: number}> = ({km, temp}) => (
  <g fontFamily={F} fontWeight={900}>
    <g transform="translate(835 560) scale(0.85)">
      <rect x={-110} y={-200} width={220} height={400} rx={30} fill="#0B0620" stroke="#fff" strokeWidth={6} />
      <text y={-130} textAnchor="middle" fontSize={34} fill="#3DF5FF">ALTURA</text>
      <text y={20} textAnchor="middle" fontSize={96} fill="#fff">{Math.round(km)}</text>
      <text y={90} textAnchor="middle" fontSize={44} fill="#3DF5FF">KM</text>
    </g>
    <g transform="translate(1085 560) scale(0.85)">
      <rect x={-110} y={-200} width={220} height={400} rx={30} fill="#0B0620" stroke="#fff" strokeWidth={6} />
      <text y={-130} textAnchor="middle" fontSize={34} fill="#FF6B3D">TEMP.</text>
      <text y={20} textAnchor="middle" fontSize={temp > 99 ? 84 : 96} fill={temp > 100 ? '#FF4D6D' : '#fff'}>{Math.round(temp)}</text>
      <text y={90} textAnchor="middle" fontSize={44} fill="#FF6B3D">°C</text>
    </g>
  </g>
);
/** plomo derritiendose */
const Lead: React.FC<{k: number}> = ({k}) => (
  <g transform="translate(960 640)" fontFamily={F} fontWeight={900}>
    <path d={`M -150 ${-120 + k * 100} L 150 ${-120 + k * 100} L ${150 + k * 120} 60 Q 0 ${80 + k * 40} ${-150 - k * 120} 60 Z`} fill="#8d99ae" stroke="#111" strokeWidth={6} />
    <text y={-10 + k * 60} textAnchor="middle" fontSize={56} fill="#2b2d42">Pb</text>
    {k > 0.3 && [0, 1, 2].map((i) => <ellipse key={i} cx={-200 + i * 200} cy={80 + k * 40} rx={30 + k * 40} ry={10} fill="#8d99ae" />)}
  </g>
);
/** sonda Venera en el suelo con cronometro */
const Probe: React.FC<{t: number; min: number}> = ({t, min}) => (
  <g fontFamily={F} fontWeight={900}>
    <g transform={`translate(960 ${GY - 80})`}>
      <ellipse cx={0} cy={60} rx={170} ry={24} fill="#4a2209" />
      <rect x={-120} y={-20} width={240} height={80} rx={12} fill="#adb5bd" stroke="#111" strokeWidth={6} />
      <circle cx={0} cy={-90} r={80} fill="#ced4da" stroke="#111" strokeWidth={6} />
      <rect x={-8} y={-230} width={16} height={70} fill="#6c757d" />
      <circle cx={0} cy={-240} r={16} fill={Math.sin(t * 6) > 0 ? '#2CFF8A' : '#0a4a2a'} />
      <text y={-80} textAnchor="middle" fontSize={34} fill="#111">13</text>
    </g>
    <g transform="translate(960 450)">
      <rect x={-210} y={-70} width={420} height={140} rx={20} fill="#0B0620" stroke="#2CFF8A" strokeWidth={6} />
      <text y={30} textAnchor="middle" fontSize={84} fill="#2CFF8A">{Math.floor(min)} MIN</text>
    </g>
  </g>
);
/** dia vs año */
const DayYear: React.FC<{k: number}> = ({k}) => (
  <g fontFamily={F} fontWeight={900}>
    {[['1 DÍA', 243, '#FF6B3D'], ['1 AÑO', 225, '#3DF5FF']].map(([l, d, c], i) => (
      <g key={i} transform={`translate(690 ${420 + i * 220})`}>
        <text x={0} y={-24} fontSize={48} fill="#fff">{l as string}</text>
        <rect x={0} y={0} width={(d as number) * 1.45 * k} height={90} rx={18} fill={c as string} />
        <text x={(d as number) * 1.45 * k + 20} y={62} fontSize={50} fill="#fff" opacity={k}>{d as number} días</text>
      </g>
    ))}
  </g>
);

const RARO = T('lo'), A50 = T('a'), AIRE = T('y', 2), GLOBO = T('un', 2), VIVIR = T('podrías'), BAJA = T('pero'), K48 = T('kilómetro'), K20 = T('kilómetro', 2), SUELO = T('y', 3), PLOMO = T('más'), PRES = T('y', 5), MAR = T('como', 4), SEG = T('aguantarías', 2), PROBE = T('la', 7), DIA = T('ah'), END = T('te', 2), MAN = T('mañana');

const SHOTS: Shot[] = [
  // gancho: caida a la superficie ardiente + planeta + calor
  [0, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8 - lt * 10)}} bg={<VSky t={t} h={0} />} mid={<Ground t={t} />} hero={<Hero x={960} y={GY - 40} s={1.3} t={t} pose={POSES.scared} eyes="wide" mouth="o" sweat />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={<Stars t={t} />} hero={<VenusPlanet x={960} y={540} r={330} t={t} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 5)}} bg={<rect width={1920} height={1080} fill="#2a0d05" />} hero={<Gauges km={0} temp={465} />} /></V>],
  [1.8, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 1.6)} bg={<Stars t={t} />} hero={<VenusPlanet x={960} y={540} r={300} t={t} />} /></V>],
  // arriba: el mejor sitio
  [RARO, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 4)} bg={<VSky t={t} h={1} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.shrug} eyes="wide" mouth="o" />} /></V>],
  [A50, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 6)} bg={<VSky t={t} h={1} />} hero={<Gauges km={50} temp={ramp(t, T('temperatura'), T('verano')) * 30 + 0} />} /></V>],
  [AIRE, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 4)} bg={<VSky t={t} h={1} />} hero={<g fontFamily={F} fontWeight={900}><g transform="translate(760 520)"><circle r={110} fill="#4CC9F0" /><text y={16} textAnchor="middle" fontSize={44} fill="#fff">AIRE</text><text y={170} textAnchor="middle" fontSize={34} fill="#fff">LIGERO</text></g><g transform="translate(1160 600)"><circle r={150} fill="#9a6b3a" /><text y={16} textAnchor="middle" fontSize={56} fill="#fff">CO₂</text><text y={220} textAnchor="middle" fontSize={34} fill="#fff">PESADO</text></g></g>} /></V>],
  [GLOBO, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.1, 1.0, 3)} bg={<VSky t={t} h={1} />} hero={<Balloon t={t} y={300 - easeOut(ramp(lt, 0, 1.6)) * 300} />} /></V>],
  [VIVIR, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 2)} bg={<VSky t={t} h={1} />} hero={<><g transform="translate(-420 120) scale(0.6)"><Balloon t={t + 1} /></g><Balloon t={t} /><g transform="translate(560 160) scale(0.55)"><Balloon t={t + 2} /></g></>} /></V>],
  // la bajada
  [BAJA, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.2, 1.6), ...shake(t, 2)}} bg={<VSky t={t * 3} h={0.8} />} hero={<Gauges km={50 - 2 * ramp(lt, 0, 1.6)} temp={30 + 20 * ramp(lt, 0, 1.6)} />} /></V>],
  [K48, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 3.8)} bg={<VSky t={t * 3} h={0.7} acid={easeOut(ramp(t, T('nubes'), T('nubes') + 0.6))} />} hero={<Hero x={960} y={GY + 20} s={1.3} t={t} pose={POSES.headHold} eyes="scared" mouth="o" sweat />} /></V>],
  [K20, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.2, 3), ...shake(t, 3)}} bg={<VSky t={t * 4} h={0.4} />} hero={<Gauges km={48 - 28 * ramp(lt, 0, 1)} temp={75 + 225 * easeOut(ramp(lt, 0.5, 2))} />} /></V>],
  [SUELO, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.0, 3.6), ...shake(t, lt < 0.4 ? 10 : 2)}} bg={<VSky t={t} h={0} />} mid={<Ground t={t} />} hero={<Gauges km={0} temp={300 + 165 * easeOut(ramp(t, T('465') - 0.2, T('465') + 1.2))} />} /></V>],
  [PLOMO, (lt, t) => <V><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.25, 3.8)} bg={<VSky t={t} h={0} />} mid={<Ground t={t} />} hero={<Lead k={easeOut(ramp(t, T('derretir') - 0.2, T('plomo') + 0.8))} />} /></V>],
  [PRES, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 3), ...shake(t, 2 + lt * 2)}} bg={<VSky t={t} h={0} />} mid={<Ground t={t} />} hero={<><Hero x={960} y={GY + 20} s={1.3 * (1 - 0.15 * ramp(lt, 0.5, 2.5))} t={t} pose={POSES.kneel} eyes="closed" /><text x={960} y={520} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={140} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">×{Math.round(92 * easeOut(ramp(t, T('92') - 0.3, T('92') + 0.6)))}</text></>} /></V>],
  [MAR, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 2.7)} bg={<rect width={1920} height={1080} fill="#03132a" />} hero={<><Sea t={t} level={100} night /><text x={960} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={140} fill="#7FD3FF" stroke="#111" strokeWidth={8} paintOrder="stroke">-{Math.round(900 * easeOut(ramp(lt, 0.2, 1.6)))} m</text></>} /></V>],
  [SEG, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.4, 2), ...shake(t, 4)}} bg={<VSky t={t} h={0} />} mid={<Ground t={t} />} hero={<Hero x={960} y={GY + 20} s={1.3} t={t} pose={POSES.kneel} eyes="closed" sweat />} /></V>],
  [PROBE, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 6.5)} bg={<VSky t={t} h={0} />} mid={<Ground t={t} />} hero={<Probe t={t} min={127 * easeOut(ramp(t, T('127') - 0.6, T('minutos') + 0.6))} />} /></V>],
  [DIA, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3.2)} bg={<Stars t={t} />} hero={<DayYear k={easeOut(ramp(lt, 0.4, 2))} />} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 3)} bg={<VSky t={t} h={1} />} hero={<Balloon t={t} />} /></V>],
];

export const VenusShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('venus/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <SerieTag t={t} ep={6} />
      <VBig t={t} at={0.03} until={RARO - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="EN VENUS?" size={100} color2="#F4A261" />
      <VBig t={t} at={RARO} until={A50 - 0.05} a="EMPIEZAS EN" b="EL MEJOR SITIO" size={120} color2="#3DF5FF" />
      <VBig t={t} at={A50} until={AIRE - 0.05} a="A 50 KM" b="¡COMO LA TIERRA!" size={120} color2="#7BF59A" />
      <VBig t={t} at={AIRE} until={GLOBO - 0.05} a="EL AIRE" b="PESA MENOS" size={140} color2="#3DF5FF" />
      <VBig t={t} at={GLOBO} until={BAJA - 0.05} a="UN GLOBO" b="FLOTARÍA SOLO" size={130} color2="#7BF59A" />
      <VBig t={t} at={BAJA} until={K48 - 0.05} a="PERO" b="SI BAJAS…" size={150} color2="#FF6B3D" />
      <VBig t={t} at={K48} until={K20 - 0.05} a="KM 48" b="LLUEVE ÁCIDO" size={140} color2="#E9F27B" />
      <VBig t={t} at={K20} until={SUELO - 0.05} a="KM 20" b="300 °C" size={150} color2="#FF6B3D" />
      <VBig t={t} at={SUELO} until={PLOMO - 0.05} a="EL SUELO" b="465 °C" size={150} color2="#FF4D6D" />
      <VBig t={t} at={PLOMO} until={PRES - 0.05} a="DERRITE" b="EL PLOMO" size={150} color2="#FF4D6D" />
      <VBig t={t} at={PRES} until={MAR - 0.05} a="PRESIÓN" b="×92" size={150} color2="#FF4D6D" />
      <VBig t={t} at={MAR} until={SEG - 0.05} a="= 900 M" b="BAJO EL MAR" size={140} color2="#7FD3FF" />
      <VBig t={t} at={SEG} until={PROBE - 0.05} a="AGUANTARÍAS" b="SEGUNDOS" size={140} color2="#FF4D6D" />
      <VBig t={t} at={PROBE} until={DIA - 0.05} a="VENERA 13" b="127 MINUTOS" size={140} color2="#2CFF8A" />
      <VBig t={t} at={DIA} until={END - 0.05} a="1 DÍA" b="> 1 AÑO" size={160} color2="#FFD23F" />
      <VBig t={t} at={END} until={MAN - 0.05} a="¿VIVIRÍAS" b="EN LAS NUBES?" size={130} color2="#3DF5FF" />
      {t < MAN && <Caps t={t} />}
      <FollowCard t={t} at={MAN} ep={6} next="¿EN JÚPITER?"><svg viewBox="0 0 760 560" width={760} height={560}><Stars t={t} /><circle cx={380} cy={290} r={200} fill="#D9A066" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={170} y={160 + i * 55} width={420} height={22} rx={11} fill={i % 2 ? '#B5651D' : '#F1D2A3'} opacity={0.8} />)}<ellipse cx={450} cy={350} rx={50} ry={28} fill="#C0392B" /></svg></FollowCard>
    </AbsoluteFill>
  );
};

export const VenusThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="red" cam={kbV(0, 1.4, 1.4, 1, 960, 600)} bg={<VSky t={1} h={0} />} mid={<Ground t={1} />} hero={<Hero x={960} y={GY - 40} s={1.3} t={1} pose={POSES.scared} eyes="wide" mouth="o" sweat />} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN VENUS? #6" size={100} y={180} color2="#F4A261" />
    </AbsoluteFill>
  );
};
