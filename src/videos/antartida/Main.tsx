import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Sea, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 63;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|antártida|nieve|piel|viento|desierto|agua|hielo|lago|vostok|millones/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const F = 'Montserrat';

/** paisaje helado */
const Ice: React.FC<{t: number; storm?: number}> = ({t, storm = 0}) => (
  <g>
    <rect width={1920} height={1080} fill={storm > 0.5 ? '#9fb7cc' : '#bfe0f5'} />
    <path d={`M 0 ${GY - 220} L 260 ${GY - 380} L 520 ${GY - 250} L 820 ${GY - 420} L 1100 ${GY - 260} L 1420 ${GY - 400} L 1920 ${GY - 240} L 1920 1080 L 0 1080 Z`} fill="#e8f4ff" />
    <path d={`M 0 ${GY - 60} L 1920 ${GY - 90} L 1920 1080 L 0 1080 Z`} fill="#ffffff" />
    {Array.from({length: Math.round(40 + storm * 120)}).map((_, i) => { const x = ((rnd(i) * 2200 - t * (200 + storm * 1400)) % 2200 + 2200) % 2200 - 140; const y = (rnd(i + 5) * 1080 + t * (90 + rnd(i) * 60)) % 1080; return <line key={i} x1={x} y1={y} x2={x + 10 + storm * 60} y2={y + 6} stroke="#fff" strokeWidth={4 + rnd(i + 1) * 4} strokeLinecap="round" opacity={0.85} />; })}
  </g>
);
/** termometro */
const Thermo: React.FC<{val: number}> = ({val}) => {
  const k = Math.max(0, Math.min(1, (val + 100) / 130));
  return (
    <g transform="translate(960 0)" fontFamily={F} fontWeight={900}>
      <rect x={-50} y={260} width={100} height={420} rx={50} fill="#eef4fa" stroke="#111" strokeWidth={8} />
      <circle cx={0} cy={710} r={80} fill="#4CC9F0" stroke="#111" strokeWidth={8} />
      <rect x={-26} y={280 + 400 * (1 - k)} width={52} height={400 * k + 40} rx={26} fill="#4CC9F0" />
      <text x={0} y={990} textAnchor="middle" fontSize={100} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{`${Math.round(val)} °C`}</text>
    </g>
  );
};
/** agua hirviendo que se convierte en nieve */
const BoilSnow: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const lt = t - t0;
  return (
    <g transform="translate(180 0)">
      <g transform="translate(720 700) rotate(-35)"><rect x={-70} y={-50} width={140} height={100} rx={14} fill="#adb5bd" stroke="#111" strokeWidth={6} /><rect x={60} y={-20} width={90} height={18} rx={8} fill="#495057" /></g>
      {lt > 0.2 && Array.from({length: 60}).map((_, i) => { const s = Math.min(1.6, lt - 0.2 - rnd(i) * 0.3); if (s < 0) return null; const x = 760 + s * (300 + rnd(i + 1) * 250), y = 640 - s * 420 + s * s * 140 + (rnd(i + 2) - 0.5) * 80 * s; const snow = s > 0.5; return <circle key={i} cx={x} cy={y} r={snow ? 6 + rnd(i) * 6 : 10} fill={snow ? '#fff' : '#7FD3FF'} opacity={0.95} />; })}
      {lt > 0.6 && <ellipse cx={1150} cy={360} rx={220 * Math.min(1, lt - 0.6)} ry={110 * Math.min(1, lt - 0.6)} fill="#fff" opacity={0.6} />}
    </g>
  );
};
/** valles secos */
const DryValley: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#c9d6df" />
    <path d={`M 0 ${GY - 300} L 400 ${GY - 120} L 960 ${GY - 60} L 1500 ${GY - 140} L 1920 ${GY - 320} L 1920 1080 L 0 1080 Z`} fill="#7a6a58" />
    <path d={`M 0 ${GY - 40} L 1920 ${GY - 40} L 1920 1080 L 0 1080 Z`} fill="#8d7b65" />
    {Array.from({length: 18}).map((_, i) => <ellipse key={i} cx={rnd(i) * 1920} cy={GY + rnd(i + 2) * 160} rx={30 + rnd(i + 1) * 50} ry={10} fill="#5c4d3c" />)}
    <path d="M 0 140 L 1920 140" stroke="#fff" strokeWidth={0} />
  </g>
);
/** gota con el 70% */
const Drop: React.FC<{k: number}> = ({k}) => (
  <g transform="translate(960 560)" fontFamily={F} fontWeight={900}>
    <path d="M 0 -260 C 120 -100 200 0 200 90 A 200 200 0 1 1 -200 90 C -200 0 -120 -100 0 -260 Z" fill="#0d3b66" stroke="#fff" strokeWidth={8} />
    <clipPath id="dc"><path d="M 0 -260 C 120 -100 200 0 200 90 A 200 200 0 1 1 -200 90 C -200 0 -120 -100 0 -260 Z" /></clipPath>
    <rect clipPath="url(#dc)" x={-210} y={290 - 550 * 0.7 * k} width={420} height={550} fill="#4CC9F0" />
    <text y={140} textAnchor="middle" fontSize={110} fill="#fff" stroke="#111" strokeWidth={6} paintOrder="stroke">{Math.round(70 * k)}%</text>
  </g>
);
/** corte del hielo con el lago debajo */
const Section: React.FC<{t: number; k: number; glow: number}> = ({t, k, glow}) => (
  <g fontFamily={F} fontWeight={900}>
    <rect width={1920} height={1080} fill="#06121f" />
    <rect x={0} y={160} width={1920} height={560} fill="#a9d6f5" />
    {Array.from({length: 14}).map((_, i) => <line key={i} x1={0} y1={200 + i * 38} x2={1920} y2={196 + i * 38 + Math.sin(i) * 6} stroke="#d6ecfb" strokeWidth={4} opacity={0.6} />)}
    <rect x={0} y={130} width={1920} height={30} fill="#fff" />
    <g opacity={k}>
      <path d="M 560 720 Q 960 640 1360 720 Q 1300 820 960 830 Q 620 820 560 720 Z" fill="#1d6fa3" />
      <ellipse cx={960} cy={740} rx={360 * glow} ry={60 * glow} fill="#4CC9F0" opacity={0.4 + 0.2 * Math.sin(t * 3)} />
    </g>
    <path d={`M 1300 160 L 1300 ${160 + 560 * Math.min(1, k * 1.5)}`} stroke="#FFD23F" strokeWidth={8} strokeDasharray="20 14" />
    <text x={1330} y={460} fontSize={60} fill="#FFD23F" opacity={Math.min(1, k * 2)}>4 KM</text>
    <rect y={830} width={1920} height={250} fill="#3b2a1f" />
  </g>
);

const AQUI = T('aquí'), P1 = T('paso'), P2 = T('paso', 2), VIENTO = T('y', 2), P3 = T('paso', 3), VALLE = T('en', 5), GUARDA = T('y', 3), MAR = T('si'), PERO = T('pero'), BAJO = T('a', 1), END = T('qué'), MAN = T('mañana');

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8 - lt * 10)}} bg={<Ice t={t} storm={1} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.scared} eyes="wide" mouth="o" />} fx={<rect width={1920} height={1080} fill="#cfe8ff" opacity={0.25} />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={<rect width={1920} height={1080} fill="#0a1a2a" />} hero={<Thermo val={-89} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.3, 0.8), ...shake(t, 5)}} bg={<Ice t={t} storm={0.6} />} hero={<BoilSnow t={t} t0={1.2} />} /></V>],
  [2.0, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 1.5)} bg={<Ice t={t} storm={0.3} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.idle} eyes="wide" />} /></V>],
  [AQUI, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 7.7)} bg={<rect width={1920} height={1080} fill="#0a1a2a" />} hero={<Thermo val={20 - 109 * easeOut(ramp(t, T('-89') - 1.2, T('-89') + 0.4))} />} fx={<g opacity={ramp(t, T('-89'), T('-89') + 0.5)}>{Array.from({length: 40}).map((_, i) => <circle key={i} cx={rnd(i) * 1920} cy={(rnd(i + 4) * 1080 + t * 120) % 1080} r={4} fill="#fff" />)}</g>} /></V>],
  [P1, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Ice t={t} storm={0.2} />} hero={<BoilSnow t={t} t0={T('tiras') + 0.3} />} /></V>],
  [P2, (lt, t) => { const f = easeOut(ramp(t, T('congela') - 0.4, T('minutos') + 0.6)); return <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.1, 1.35, 4.8, 960, 420), ...shake(t, 2)}} bg={<Ice t={t} storm={0.8} />} hero={<g style={{filter: `saturate(${1 - f * 0.8}) brightness(${1 + f * 0.4})`}}><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.headHold} eyes="closed" /></g>} fx={<rect width={1920} height={1080} fill="#dff3ff" opacity={f * 0.35} />} /></V>; }],
  [VIENTO, (lt, t) => <V><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.2, 3.8), ...shake(t, 6)}} bg={<Ice t={t} storm={1} />} hero={<text x={960} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={170} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{Math.round(300 * easeOut(ramp(t, T('300') - 0.5, T('300') + 0.8)))}</text>} /></V>],
  [P3, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 4.6)} bg={t > T('desierto') - 0.2 ? <DryValley /> : <Ice t={t} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.shrug} eyes="wide" mouth="o" />} /></V>],
  [VALLE, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 3.8)} bg={<DryValley />} hero={<text x={960} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={100} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{(Math.round(2000000 * easeOut(ramp(t, T('2') - 0.4, T('años') + 0.4)))).toLocaleString('es-ES')}</text>} /></V>],
  [GUARDA, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 4)} bg={<rect width={1920} height={1080} fill="#0a1a2a" />} hero={<Drop k={easeOut(ramp(t, T('70%') - 0.5, T('70%') + 0.6))} />} /></V>],
  [MAR, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.15, 3.8)} bg={<rect width={1920} height={1080} fill="#8ecae6" />} hero={<><g>{[700, 860, 1020, 1180].map((x, i) => <rect key={i} x={x} y={GY - 160 - i * 40} width={130} height={160 + i * 40} fill="#495057" stroke="#111" strokeWidth={5} />)}</g><Sea t={t} level={GY - 40 - 360 * easeOut(ramp(t, T('58') - 0.5, T('58') + 1.2))} wave={1} /><text x={960} y={330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">+{Math.round(58 * easeOut(ramp(t, T('58') - 0.5, T('58') + 1.2)))} m</text></>} /></V>],
  [PERO, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 2.4, 960, 420)} bg={<Ice t={t} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.pointDown} eyes="wide" mouth="o" />} /></V>],
  [BAJO, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 8)} bg={<rect width={1920} height={1080} fill="#06121f" />} hero={<Section t={t} k={easeOut(ramp(t, T('lago') - 0.6, T('líquida')))} glow={1} />} fx={t > T('15') - 0.3 ? <text x={960} y={960} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">{Math.round(15 * easeOut(ramp(t, T('15') - 0.3, T('años', 2) + 0.4)))} MILLONES DE AÑOS</text> : undefined} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.2, 1.5, 2, 960, 740)} bg={<rect width={1920} height={1080} fill="#06121f" />} hero={<><Section t={t} k={1} glow={1.1} /><text x={960} y={770} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={120} fill="#FFD23F" opacity={0.6 + 0.4 * Math.sin(t * 5)}>?</text></>} /></V>],
];

export const AntartidaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('antartida/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <SerieTag t={t} ep={8} />
      <VBig t={t} at={0.03} until={AQUI - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="EN LA ANTÁRTIDA?" size={95} color2="#7FD3FF" />
      <VBig t={t} at={AQUI} until={P1 - 0.05} a="RÉCORD" b="-89 °C" size={160} color2="#7FD3FF" />
      <VBig t={t} at={P1} until={P2 - 0.05} a="AGUA HIRVIENDO" b="= NIEVE" size={120} color2="#7FD3FF" />
      <VBig t={t} at={P2} until={VIENTO - 0.05} a="TU PIEL" b="SE CONGELA" size={140} color2="#7FD3FF" />
      <VBig t={t} at={VIENTO} until={P3 - 0.05} a="VIENTO" b="+300 KM/H" size={150} color2="#FF4D6D" />
      <VBig t={t} at={P3} until={VALLE - 0.05} a="LO MÁS RARO" b="ES UN DESIERTO" size={120} color2="#FFD23F" />
      <VBig t={t} at={VALLE} until={GUARDA - 0.05} a="SIN LLOVER" b="2 MILLONES DE AÑOS" size={105} color2="#FFD23F" />
      <VBig t={t} at={GUARDA} until={MAR - 0.05} a="70 %" b="DEL AGUA DULCE" size={140} color2="#4CC9F0" />
      <VBig t={t} at={MAR} until={PERO - 0.05} a="SI SE DERRITE" b="+58 METROS" size={130} color2="#FF4D6D" />
      <VBig t={t} at={PERO} until={BAJO - 0.05} a="LO MEJOR" b="ESTÁ DEBAJO" size={140} color2="#FFD23F" />
      <VBig t={t} at={BAJO} until={END - 0.05} a={t > T('vostok') - 0.2 ? 'LAGO VOSTOK' : 'UN LAGO'} b="BAJO 4 KM DE HIELO" size={105} color2="#4CC9F0" />
      <VBig t={t} at={END} until={MAN - 0.05} a="¿QUÉ VIVE" b="AHÍ ABAJO?" size={140} color2="#FFD23F" />
      {t < MAN && <Caps t={t} />}
      <FollowCard t={t} at={MAN} ep={8} next="¿DENTRO DE UN HURACÁN?"><svg viewBox="0 0 760 560" width={760} height={560}><rect width={760} height={560} fill="#1d3557" />{Array.from({length: 6}).map((_, i) => <path key={i} d={`M 380 280 m ${-40 - i * 40} 0 a ${40 + i * 40} ${30 + i * 30} 0 1 1 ${80 + i * 80} 0`} stroke="#e0f2ff" strokeWidth={14 - i} fill="none" opacity={0.8 - i * 0.1} transform={`rotate(${t * 120 + i * 30} 380 280)`} />)}<circle cx={380} cy={280} r={26} fill="#1d3557" /></svg></FollowCard>
    </AbsoluteFill>
  );
};

export const AntartidaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="cold" cam={kbV(0, 1.4, 1.4, 1, 960, 600)} bg={<Ice t={1} storm={1} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={1} pose={POSES.scared} eyes="wide" mouth="o" />} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN LA ANTÁRTIDA? #8" size={92} y={180} color2="#7FD3FF" />
    </AbsoluteFill>
  );
};
