import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Volcano, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 70;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|lava|grados|gases|azufre|carbono|cráter|nube|pompeya|ardiendo/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

/** interior del crater: paredes oscuras y lago de lava que burbujea */
const Crater: React.FC<{t: number; gas?: number; co2?: number}> = ({t, gas = 0, co2 = 0}) => (
  <g>
    <rect width={1920} height={1080} fill="#2B0A0A" />
    <path d="M 0 0 L 520 0 L 700 760 L 0 1080 Z" fill="#1A0F0F" stroke="#3A1A1A" strokeWidth={6} />
    <path d="M 1920 0 L 1400 0 L 1220 760 L 1920 1080 Z" fill="#1A0F0F" stroke="#3A1A1A" strokeWidth={6} />
    <ellipse cx={960} cy={900} rx={900} ry={220} fill="#FF5A1F" />
    <ellipse cx={960} cy={900} rx={900} ry={220} fill="#FFB703" opacity={0.25 + 0.15 * Math.sin(t * 3)} filter="url(#blurGlow)" />
    {Array.from({length: 22}).map((_, i) => { const x = 160 + rnd(i) * 1600, y = 830 + rnd(i + 2) * 150, p = (t * 0.8 + rnd(i + 4)) % 1; return <circle key={i} cx={x} cy={y - p * 30} r={10 + p * 20} fill="#FFD166" opacity={1 - p} />; })}
    {Array.from({length: 10}).map((_, i) => <path key={i} d={`M ${200 + i * 170} 860 q 20 -60 0 -120 q -20 -60 0 -120`} stroke="#FFB703" strokeWidth={5} fill="none" opacity={0.25 * Math.abs(Math.sin(t * 2 + i))} />)}
    {gas > 0 && <rect width={1920} height={1080} fill="#E9E26B" opacity={0.28 * gas} />}
    {gas > 0 && Array.from({length: 14}).map((_, i) => <ellipse key={i} cx={(rnd(i) * 2200 + t * 60) % 2200 - 140} cy={200 + rnd(i + 1) * 500} rx={220} ry={90} fill="#F1E8A0" opacity={0.25 * gas} />)}
    {co2 > 0 && <rect x={0} y={1080 - 520 * co2} width={1920} height={520 * co2} fill="#9FB3C8" opacity={0.22} />}
  </g>
);
const Nyos: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect width={1920} height={1080} fill="#0E1430" />
    <Stars t={t} n={100} />
    <path d="M 0 560 Q 500 420 900 540 T 1920 520 L 1920 1080 L 0 1080 Z" fill="#1B2A1E" />
    <ellipse cx={1700} cy={640} rx={420} ry={70} fill="#1D3557" />
    {[780, 980, 1180].map((x) => <g key={x}><rect x={x - 70} y={GY - 140} width={140} height={140} fill="#6B4226" stroke="#111" strokeWidth={5} /><path d={`M ${x - 90} ${GY - 140} L ${x} ${GY - 220} L ${x + 90} ${GY - 140} Z`} fill="#8B5A3C" stroke="#111" strokeWidth={5} /><rect x={x - 20} y={GY - 100} width={40} height={40} fill={k > 0.6 ? '#333' : '#FFE8A3'} /></g>)}
    <path d={`M ${1920 - 1300 * k} ${GY + 80} Q ${1700 - 1100 * k} ${GY - 320} ${1920} ${GY - 260} L 1920 ${GY + 80} Z`} fill="#C9D6DC" opacity={0.45} />
  </g>
);
const Pyro: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect width={1920} height={1080} fill="#4A2A1A" />
    <path d="M 1500 160 L 2300 900 L 700 900 Z" fill="#3B2A22" stroke="#111" strokeWidth={6} />
    <path d="M 1460 160 L 1540 160 L 1580 60 Q 1500 -40 1420 60 Z" fill="#555" />
    {Array.from({length: 16}).map((_, i) => { const p = Math.min(1, k * 1.3 - i * 0.03); if (p <= 0) return null; const x = 1500 - p * 760 + rnd(i) * 160, y = 200 + p * 620 + rnd(i + 1) * 80; return <circle key={i} cx={x} cy={y} r={130 + rnd(i + 2) * 90} fill={i % 2 ? '#6C757D' : '#8D99AE'} opacity={0.9} />; })}
    <rect y={GY} width={1920} height={200} fill="#A68A64" />
    {[740, 870, 1000, 1130].map((x) => <rect key={x} x={x} y={GY - 200} width={44} height={200} fill="#E9E2D0" stroke="#111" strokeWidth={4} />)}
    <rect x={720} y={GY - 230} width={470} height={34} fill="#E9E2D0" stroke="#111" strokeWidth={4} />
  </g>
);
const Thermo: React.FC<{x: number; y: number; label: string; k: number}> = ({x, y, label, k}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-30} y={-260} width={60} height={320} rx={30} fill="#F1FAEE" stroke="#111" strokeWidth={6} />
    <rect x={-16} y={60 - 300 * k} width={32} height={300 * k} fill="#E63946" />
    <circle cx={0} cy={80} r={50} fill="#E63946" stroke="#111" strokeWidth={6} />
    <text x={0} y={-290} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={56} fill="#fff">{label}</text>
  </g>
);

const SHOTS: Shot[] = [
  // gancho: avance (flotando sobre la lava, nube ardiente, gas)
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.4, 1.7, 0.6, 960, 600), ...shake(t, 9)}} bg={<Crater t={t} />} hero={<Hero x={960} y={880} s={1.3} t={t} pose={POSES.armsUp} eyes="scared" mouth="open" />} /></V>],
  [0.6, (lt, t) => <V fx={1000}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.4, 0.6, 1000, 500), ...shake(t, 7)}} bg={<rect width={1920} height={1080} fill="#4A2A1A" />} hero={<Pyro t={t} k={0.6 + lt} />} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.4, 1.2, 0.6)} bg={<Crater t={t} gas={1} />} hero={<Hero x={960} y={760} s={1.3} t={t} pose={POSES.headHold} eyes="closed" />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 12)}} bg={<rect width={1920} height={1080} fill="#2B0A0A" />} hero={<Volcano x={960} t={t} s={1.6} />} /></V>],
  // no te hundes
  [T('olvida'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Crater t={t} />} hero={<Hero x={960} y={560 + Math.min(320, lt * lt * 300)} s={1.2} t={t} pose={POSES.fly} eyes="scared" mouth="open" />} /></V>],
  [T('la', 2), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.25, 6)} bg={<Crater t={t} />} hero={<g transform={`translate(0 ${Math.sin(t * 2) * 8})`}><Hero x={960} y={880} s={1.2} t={t} pose={POSES.armsUp} eyes="wide" mouth="o" /><ellipse cx={960} cy={700} rx={160} ry={260} fill="#FF6B00" opacity={0.35 * ramp(lt, 2, 4)} filter="url(#blurGlow)" /></g>} /></V>],
  // metro 10: calor
  [T('metro'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Crater t={t} />} hero={<><Hero x={960} y={760} s={1.2} t={t} pose={POSES.scared} eyes="wide" sweat /><Thermo x={1150} y={560} label="" k={easeOut(ramp(lt, 0.4, 2))} /></>} /></V>],
  // metro 50: gases
  [T('metro', 2), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Crater t={t} gas={easeOut(ramp(lt, 0.3, 2))} />} hero={<Hero x={960} y={760} s={1.2} t={t} pose={POSES.headHold} eyes="closed" mouth="o" />} /></V>],
  [T('y', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.25, 7)} bg={<Crater t={t} co2={easeOut(ramp(lt, 0.3, 4))} />} hero={<Hero x={960} y={760} s={1.2} t={t} pose={lt > 5 ? POSES.kneel : POSES.idle} eyes={lt > 5 ? 'closed' : 'normal'} />} /></V>],
  // 1986 lago Nyos
  [T('1986'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 10, 960, 650)} bg={<rect width={1920} height={1080} fill="#0E1430" />} hero={<Nyos t={t} k={easeOut(ramp(lt, 3, 9))} />} /></V>],
  // nube ardiente / Pompeya
  [T('y', 3), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.2, 9, 960, 500), ...shake(t, 2 + lt)}} bg={<rect width={1920} height={1080} fill="#4A2A1A" />} hero={<Pyro t={t} k={easeOut(ramp(lt, 1.5, 9))} />} /></V>],
  [T('así'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.5, 3, 960, 700), ...shake(t, 6)}} bg={<rect width={1920} height={1080} fill="#4A2A1A" />} hero={<g style={{filter: "sepia(0.4)"}}><Pyro t={t} k={1} /></g>} /></V>],
  [T('acercarías'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<rect width={1920} height={1080} fill="#4A2A1A" />} hero={<><Volcano x={1180} t={t} s={0.9} /><Hero x={820} y={GY + 20} s={1.3} t={t} pose={POSES.shrug} eyes="wide" /></>} /></V>],
];

export const VolcanShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('volcan/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('olvida'), T('metro'), T('metro', 2), T('1986'), T('y', 3)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <SerieTag t={t} ep={5} />
      <VBig t={t} at={0.03} until={T('olvida') - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="DENTRO DE UN VOLCÁN?" size={92} color2="#FF6B3D" />
      <VBig t={t} at={T('la', 2)} until={T('metro') - 0.05} a="NO TE HUNDES" b="FLOTAS… ARDIENDO" size={115} color2="#FF6B3D" />
      <VBig t={t} at={T('metro')} until={T('metro', 2) - 0.05} a="METRO 10" b="+1.000 °C" size={150} color2="#FF4D6D" />
      <VBig t={t} at={T('metro', 2)} until={T('y', 2) - 0.05} a="METRO 50" b="GASES TÓXICOS" size={130} color2="#E9E26B" />
      <VBig t={t} at={T('y', 2)} until={T('1986') - 0.05} a="CO₂" b="NO HUELE A NADA" size={140} color2="#9FB3C8" />
      <VBig t={t} at={T('1986')} until={T('y', 3) - 0.05} a="1986 · CAMERÚN" b="+1.700 MUERTOS" size={110} color2="#FF4D6D" />
      <VBig t={t} at={T('y', 3)} until={T('así') - 0.05} a="NUBE ARDIENTE" b="+RÁPIDA QUE UN COCHE" size={105} color2="#FF6B3D" />
      <VBig t={t} at={T('así')} until={T('acercarías') - 0.15} a="POMPEYA" b="AÑO 79" size={160} color2="#FFD23F" />
      <VBig t={t} at={T('acercarías') - 0.1} until={T('mañana') - 0.05} a="¿TE ACERCARÍAS" b="A UN VOLCÁN?" size={125} />
      {t < T('mañana') && <Caps t={t} />}
      <FollowCard t={t} at={T('mañana')} ep={5} next="¿EN VENUS?"><svg viewBox="0 0 760 560" width={760} height={560}><Stars t={t} /><circle cx={380} cy={290} r={190} fill="#E9C46A" /><circle cx={380} cy={290} r={190} fill="#F4A261" opacity={0.5} />{[0, 1, 2].map((i) => <path key={i} d={`M 200 ${220 + i * 60} q 180 -40 360 0`} stroke="#FFF3D6" strokeWidth={14} fill="none" opacity={0.5} />)}</svg></FollowCard>
    </AbsoluteFill>
  );
};

export const VolcanThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.5, 1.5, 1, 960, 600)} bg={<Crater t={1} />} hero={<Hero x={960} y={880} s={1.3} t={1} pose={POSES.armsUp} eyes="scared" mouth="open" />} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="DENTRO DE UN VOLCÁN?" size={92} y={180} color2="#FF6B3D" />
    </AbsoluteFill>
  );
};
