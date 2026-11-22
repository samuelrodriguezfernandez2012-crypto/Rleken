import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 66;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|júpiter|suelo|gas|kilos|mancha|tierra|galileo|minutos|cometa|protege/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const F = 'Montserrat';
const BANDS = ['#F1D2A3', '#C98B5A', '#E8C79A', '#B5651D', '#F5E1C0', '#A0522D', '#E9C99B', '#C98B5A'];

/** Jupiter con bandas, Gran Mancha Roja y marcas de impacto opcionales */
export const JupiterPlanet: React.FC<{x: number; y: number; r: number; t: number; scars?: number}> = ({x, y, r, t, scars = 0}) => (
  <g>
    <defs><clipPath id={`jc${r}`}><circle cx={x} cy={y} r={r} /></clipPath><radialGradient id="jsh" cx="35%" cy="30%"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></radialGradient></defs>
    <g clipPath={`url(#jc${r})`}>
      {BANDS.map((c, i) => <rect key={i} x={x - r} y={y - r + i * (2 * r / BANDS.length)} width={2 * r} height={2 * r / BANDS.length + 2} fill={c} />)}
      {Array.from({length: 8}).map((_, i) => <path key={i} d={`M ${x - r - 100 + ((t * 40 + i * 90) % 200)} ${y - r + (i + 0.5) * (2 * r / 8)} q ${r * 0.5} ${r * 0.04} ${r * 2.2} 0`} stroke="#fff" strokeWidth={r * 0.02} fill="none" opacity={0.25} />)}
      <ellipse cx={x + r * 0.3} cy={y + r * 0.35} rx={r * 0.22} ry={r * 0.13} fill="#C0392B" />
      <ellipse cx={x + r * 0.3} cy={y + r * 0.35} rx={r * 0.14} ry={r * 0.07} fill="#E74C3C" />
      {scars > 0 && [-0.3, -0.05, 0.2].map((dx, i) => <ellipse key={i} cx={x + r * dx} cy={y - r * 0.55} rx={r * 0.06 * scars} ry={r * 0.04 * scars} fill="#2b1a10" opacity={0.85} />)}
    </g>
    <circle cx={x} cy={y} r={r} fill="url(#jsh)" />
  </g>
);
/** cielo de Jupiter cayendo */
const JSky: React.FC<{t: number; dark?: number}> = ({t, dark = 0}) => (
  <g>
    {BANDS.map((c, i) => <rect key={i} x={0} y={i * 135} width={1920} height={136} fill={c} />)}
    {Array.from({length: 14}).map((_, i) => { const y = ((rnd(i) * 1400 - t * (700 + rnd(i + 2) * 500)) % 1400 + 1400) % 1400 - 200; return <ellipse key={i} cx={rnd(i + 1) * 1920} cy={y} rx={260} ry={70} fill="#fff8e7" opacity={0.45} />; })}
    {Array.from({length: 22}).map((_, i) => { const y = ((rnd(i + 30) * 1200 - t * 2600) % 1200 + 1200) % 1200 - 100; return <line key={i} x1={rnd(i) * 1920} y1={y} x2={rnd(i) * 1920} y2={y + 180} stroke="#fff" strokeWidth={4} opacity={0.5} />; })}
    {dark > 0 && <rect width={1920} height={1080} fill="#1a0a05" opacity={dark} />}
  </g>
);
/** bascula */
const Scale: React.FC<{kg: number}> = ({kg}) => (
  <g transform="translate(960 640)" fontFamily={F} fontWeight={900}>
    <rect x={-260} y={-40} width={520} height={110} rx={30} fill="#e9ecef" stroke="#111" strokeWidth={8} />
    <rect x={-150} y={-20} width={300} height={70} rx={12} fill="#0B0620" />
    <text y={36} textAnchor="middle" fontSize={60} fill={kg > 60 ? '#FF4D6D' : '#7BF59A'}>{Math.round(kg)} kg</text>
  </g>
);
/** tormenta gigante vs la Tierra */
const Storm: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <g transform={`translate(960 520) rotate(${t * 20})`}>
      <ellipse rx={330} ry={200} fill="#C0392B" />
      {[0.8, 0.6, 0.4].map((s, i) => <ellipse key={i} rx={330 * s} ry={200 * s} fill="none" stroke="#F1948A" strokeWidth={10} opacity={0.6} />)}
    </g>
    <g opacity={k}><Earth x={960 + 480 * (1 - k)} y={520} r={130} t={t} /></g>
  </g>
);
/** sonda Galileo con cronometro y presion */
const Probe: React.FC<{t: number; min: number; crush: number}> = ({t, min, crush}) => (
  <g fontFamily={F} fontWeight={900}>
    <g transform={`translate(960 ${680 + Math.sin(t * 3) * 10}) scale(${1 - crush * 0.6} ${1 - crush * 0.8})`}>
      <path d="M -120 -40 Q 0 -150 120 -40 L 120 30 L -120 30 Z" fill="#adb5bd" stroke="#111" strokeWidth={8} />
      <rect x={-90} y={30} width={180} height={50} rx={10} fill="#6c757d" stroke="#111" strokeWidth={6} />
      <circle cx={0} cy={-60} r={14} fill={crush > 0.5 ? '#FF4D6D' : '#2CFF8A'} />
    </g>
    <g transform="translate(960 460)">
      <rect x={-210} y={-60} width={420} height={120} rx={20} fill="#0B0620" stroke="#2CFF8A" strokeWidth={6} />
      <text y={28} textAnchor="middle" fontSize={76} fill="#2CFF8A">{Math.floor(min)} MIN</text>
    </g>
  </g>
);
/** cometa que va hacia la Tierra y Jupiter lo atrae */
const Comet: React.FC<{t: number; k: number}> = ({t, k}) => {
  const x = 1500 - k * 520, y = 200 + Math.sin(k * Math.PI) * 120 + k * 260;
  return (
    <g>
      <Earth x={1380} y={820} r={70} t={t} />
      <JupiterPlanet x={900} y={620} r={170} t={t} />
      <g transform={`translate(${x} ${y})`} opacity={k < 0.98 ? 1 : 0}>
        <path d="M 0 0 L 160 -60 L 150 -20 L 200 -10 Z" fill="#cdefff" opacity={0.7} />
        <circle r={22} fill="#fff" />
      </g>
      {k > 0.98 && <circle cx={900} cy={520} r={40 + (k - 0.98) * 3000} fill="#FFD23F" opacity={Math.max(0, 1 - (k - 0.98) * 40)} />}
    </g>
  );
};
/** gauges de presion y temperatura */
const Deep: React.FC<{k: number}> = ({k}) => (
  <g fontFamily={F} fontWeight={900}>
    {[['PRESIÓN', `×${Math.round(1 + k * 22)}`, '#7FD3FF', 835], ['CALOR', `${Math.round(-100 + k * 250)} °C`, '#FF6B3D', 1085]].map(([l, v, c, x], i) => (
      <g key={i} transform={`translate(${x} 560) scale(0.85)`}>
        <rect x={-120} y={-170} width={240} height={340} rx={30} fill="#0B0620" stroke="#fff" strokeWidth={6} />
        <text y={-100} textAnchor="middle" fontSize={36} fill={c as string}>{l as string}</text>
        <text y={30} textAnchor="middle" fontSize={70} fill="#fff">{v as string}</text>
      </g>
    ))}
  </g>
);

const PRIM = T('primer'), BOLA = T('júpiter', 2), SEG = T('segundo'), SI = T('si'), TER = T('tercero'), MANCHA = T('gran'), SIGUE = T('y', 4), Y95 = T('en', 2), AGU = T('aguantó'), PERO = T('pero'), MUCHOS = T('muchos'), SU = T('su'), Y94 = T('en', 3), END = T('sabías'), MAN = T('mañana');

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8 - lt * 10)}} bg={<JSky t={t} />} hero={<Hero x={960} y={760} s={1.4} t={t} pose={POSES.fly} eyes="wide" mouth="o" rotate={Math.sin(t * 4) * 30} />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={<Stars t={t} />} hero={<JupiterPlanet x={960} y={540} r={340} t={t} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 0.8), ...shake(t, 5)}} bg={<rect width={1920} height={1080} fill="#2a0d05" />} hero={<Storm t={t} k={0} />} /></V>],
  [2.0, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 1)} bg={<Stars t={t} />} hero={<JupiterPlanet x={960} y={540} r={320} t={t} />} /></V>],
  [PRIM, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 2.8)} bg={<JSky t={t * 0.3} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={t > T('suelo') ? POSES.scared : POSES.idle} eyes="wide" mouth="o" rotate={t > T('suelo') ? 15 : 0} />} /></V>],
  [BOLA, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.25, 5), ...shake(t, 2)}} bg={<JSky t={t * (1 + lt * 0.3)} />} hero={<Hero x={960} y={720} s={1.3} t={t} pose={POSES.fly} eyes="wide" mouth="o" rotate={Math.sin(t * 3) * 30} />} /></V>],
  [SEG, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 6.5)} bg={<JSky t={t * 0.2} />} hero={<><Hero x={960} y={GY - 100} s={1.1 * (1 - 0.15 * ramp(t, T('125') - 0.3, T('125') + 0.5))} t={t} pose={t > T('125') ? POSES.kneel : POSES.idle} eyes="wide" sweat /><Scale kg={t < T('allí') ? 50 * Math.min(1, (t - SI) / 0.8 + 0.01) : 50 + 75 * easeOut(ramp(t, T('125') - 0.3, T('125') + 0.6))} /></>} /></V>],
  [TER, (lt, t) => <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.2, 4), ...shake(t, 4)}} bg={<JSky t={t * 2.5} />} hero={<text x={960} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={170} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{Math.round(600 * easeOut(ramp(t, T('600') - 0.4, T('600') + 0.8)))}</text>} /></V>],
  [MANCHA, (lt, t) => <V><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Stars t={t} />} hero={<Storm t={t} k={easeOut(ramp(t, T('tierra') - 0.3, T('tierra') + 0.6))} />} /></V>],
  [SIGUE, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.25, 3.8), ...shake(t, 2 + lt)}} bg={<JSky t={t * 2} dark={0.2 + 0.5 * ramp(lt, 0, 3.5)} />} hero={<Deep k={easeOut(ramp(lt, 0.5, 3.5))} />} /></V>],
  [Y95, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4.7)} bg={<JSky t={t} />} hero={<Probe t={t} min={0} crush={0} />} /></V>],
  [AGU, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 5), ...shake(t, t > T('desapareció') ? 8 : 1)}} bg={<JSky t={t} dark={0.5} />} hero={<Probe t={t} min={58 * easeOut(ramp(t, T('58') - 0.3, T('minutos') + 0.3))} crush={easeOut(ramp(t, T('aplastada') - 0.2, T('derretida') + 0.4))} />} /></V>],
  [PERO, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 1.7, 960, 420)} bg={<Stars t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.headHold} eyes="wide" mouth="o" />} /></V>],
  [MUCHOS, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Stars t={t} />} hero={<><JupiterPlanet x={960} y={500} r={260} t={t} /><Earth x={1180} y={790} r={55} t={t} /></>} /></V>],
  [SU, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3.7)} bg={<Stars t={t} />} hero={<Comet t={t} k={easeOut(ramp(lt, 0.3, 3.4))} />} /></V>],
  [Y94, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.3, 6), ...shake(t, t > T('estrelló') && t < T('estrelló') + 0.5 ? 8 : 0)}} bg={<Stars t={t} />} hero={<><JupiterPlanet x={960} y={540} r={330} t={t} scars={easeOut(ramp(t, T('estrelló'), T('marcas') + 0.5))} />{t > T('tierra', 2) - 0.3 && <Earth x={1180} y={800} r={40} t={t} />}</>} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Stars t={t} />} hero={<><JupiterPlanet x={860} y={500} r={240} t={t} /><Earth x={1200} y={820} r={70} t={t} /></>} /></V>],
];

export const JupiterShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('jupiter/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <SerieTag t={t} ep={7} />
      <VBig t={t} at={0.03} until={PRIM - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="EN JÚPITER?" size={100} color2="#E9A04B" />
      <VBig t={t} at={PRIM} until={BOLA - 0.05} a="PROBLEMA 1" b="NO HAY SUELO" size={130} color2="#FF4D6D" />
      <VBig t={t} at={BOLA} until={SEG - 0.05} a="CAES" b="Y NO PARAS" size={150} color2="#E9A04B" />
      <VBig t={t} at={SEG} until={TER - 0.05} a="PROBLEMA 2" b={t > T('allí') ? '50 KG → 125 KG' : 'PESAS ×2,5'} size={115} color2="#FF4D6D" />
      <VBig t={t} at={TER} until={MANCHA - 0.05} a="PROBLEMA 3" b="VIENTO KM/H" size={125} color2="#7FD3FF" />
      <VBig t={t} at={MANCHA} until={SIGUE - 0.05} a="TORMENTA" b={t > T('150') - 0.2 ? '+150 AÑOS' : 'MÁS GRANDE QUE LA TIERRA'} size={t > T('150') - 0.2 ? 140 : 95} color2="#FF6B3D" />
      <VBig t={t} at={SIGUE} until={Y95 - 0.05} a="MÁS ABAJO" b="PRESIÓN Y CALOR" size={120} color2="#FF4D6D" />
      <VBig t={t} at={Y95} until={AGU - 0.05} a="1995" b="SONDA GALILEO" size={140} color2="#2CFF8A" />
      <VBig t={t} at={AGU} until={PERO - 0.05} a="58 MINUTOS" b={t > T('aplastada') - 0.2 ? 'APLASTADA' : undefined} size={140} color2="#FF4D6D" />
      <VBig t={t} at={PERO} until={MUCHOS - 0.05} a="PERO" b="ESPERA…" size={150} color2="#FFD23F" />
      <VBig t={t} at={MUCHOS} until={SU - 0.05} a="JÚPITER" b="NOS PROTEGE" size={140} color2="#7BF59A" />
      <VBig t={t} at={SU} until={Y94 - 0.05} a="ATRAE" b="COMETAS" size={150} color2="#7FD3FF" />
      <VBig t={t} at={Y94} until={END - 0.05} a="1994" b="MARCAS = TIERRA" size={125} color2="#FF6B3D" />
      <VBig t={t} at={END} until={MAN - 0.05} a="¿SABÍAS QUE" b="NOS CUIDABA?" size={125} color2="#7BF59A" />
      {t < MAN && <Caps t={t} />}
      <FollowCard t={t} at={MAN} ep={7} next="¿EN LA ANTÁRTIDA?"><svg viewBox="0 0 760 560" width={760} height={560}><rect width={760} height={560} fill="#cfe8ff" /><path d="M 0 380 L 140 260 L 260 330 L 400 200 L 560 320 L 760 240 L 760 560 L 0 560 Z" fill="#fff" /><path d="M 0 460 L 760 430 L 760 560 L 0 560 Z" fill="#e3f2fd" />{Array.from({length: 30}).map((_, i) => <circle key={i} cx={rnd(i) * 760} cy={(rnd(i + 3) * 560 + t * 80) % 560} r={4} fill="#fff" />)}</svg></FollowCard>
    </AbsoluteFill>
  );
};

export const JupiterThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="dusk" cam={kbV(0, 1.3, 1.3, 1)} bg={<JSky t={1} />} hero={<Hero x={960} y={760} s={1.4} t={1} pose={POSES.fly} eyes="wide" mouth="o" rotate={20} />} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN JÚPITER? #7" size={100} y={180} color2="#E9A04B" />
    </AbsoluteFill>
  );
};
