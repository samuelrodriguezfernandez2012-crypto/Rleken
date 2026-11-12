import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 60;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|océano|agua|barcos|abismo|marianas|everest|sal|lluvia|marte|oxígeno/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

// corte del oceano: costa, plataforma, fondo y fosa. level = altura del agua (px)
const FLOOR = (x: number) => (x < 300 ? 520 : x < 700 ? 520 + (x - 300) * 0.55 : x < 1250 ? 740 + Math.sin(x / 90) * 18 : x < 1450 ? 760 + (x - 1250) * 1.4 : x < 1560 ? 1040 : x < 1760 ? 1040 - (x - 1560) * 1.3 : 780);
const Ocean: React.FC<{t: number; level: number; ship?: number; fish?: boolean; salt?: number}> = ({t, level, ship = -1, fish, salt = 0}) => {
  const pts = Array.from({length: 49}).map((_, i) => `${i * 40},${FLOOR(i * 40)}`).join(' ');
  const shipX = 900, shipY = ship < 0 ? level - 40 : Math.min(FLOOR(shipX) - 40, level - 40 + ship * ship * 900);
  return (
    <g>
      <rect width={1920} height={1080} fill="#8EC5E8" />
      <polygon points={`0,${level} 1920,${level} 1920,1080 0,1080`} fill="#1E6FB0" opacity={level < 1000 ? 0.92 : 0} />
      {level < 1000 && <path d={`M 0 ${level} ${Array.from({length: 25}).map((_, i) => `L ${i * 80} ${level + Math.sin(t * 2 + i) * 8}`).join(' ')}`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} />}
      <polygon points={`0,1080 ${pts} 1920,1080`} fill={salt > 0 ? `rgb(${200 + 40 * salt},${180 + 50 * salt},${150 + 80 * salt})` : '#C9A66B'} stroke="#111" strokeWidth={5} />
      <rect x={0} y={420} width={300} height={100} fill="#6FA35A" />
      {[60, 160, 240].map((x) => <rect key={x} x={x} y={300} width={50} height={120} fill="#B8C4D0" stroke="#111" strokeWidth={3} />)}
      {ship >= -0.5 && (
        <g transform={`translate(${shipX} ${shipY}) rotate(${ship > 0 ? Math.min(40, ship * 60) : 0})`}>
          <path d="M -110 0 L 110 0 L 80 50 L -80 50 Z" fill="#E63946" stroke="#111" strokeWidth={5} />
          <rect x={-40} y={-50} width={80} height={50} fill="#F1FAEE" stroke="#111" strokeWidth={4} />
          <rect x={10} y={-90} width={22} height={40} fill="#1D3557" />
        </g>
      )}
      {fish && Array.from({length: 18}).map((_, i) => { const fx = 320 + rnd(i) * 1500; return <ellipse key={i} cx={fx} cy={FLOOR(fx) - 8 - Math.abs(Math.sin(t * 6 + i)) * 10} rx={30} ry={13} fill="#F4A261" stroke="#111" strokeWidth={3} />; })}
    </g>
  );
};
const Ship: React.FC<{x: number; y: number; r?: number; s?: number}> = ({x, y, r = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -220 0 L 220 0 L 160 100 L -160 100 Z" fill="#E63946" stroke="#111" strokeWidth={8} />
    <rect x={-80} y={-100} width={160} height={100} fill="#F1FAEE" stroke="#111" strokeWidth={6} />
    <rect x={20} y={-180} width={44} height={80} fill="#1D3557" />
  </g>
);
const Abyss: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#8EC5E8" />
    <path d="M 0 520 L 900 560 L 1000 1080 L 0 1080 Z" fill="#E9D3A0" stroke="#111" strokeWidth={5} />
    <path d="M 900 560 L 1920 560 L 1920 1080 L 1000 1080 Z" fill="#0B1020" />
    <path d="M 900 560 L 1000 1080" stroke="#7A5C3A" strokeWidth={30} />
    {Array.from({length: 6}).map((_, i) => <path key={i} d={`M ${1100 + i * 140} ${560 + i * 20} l 60 ${200 + i * 40}`} stroke="#2A2A3A" strokeWidth={6} opacity={0.6} />)}
  </g>
);
const SaltDesert: React.FC<{t: number; heat?: number}> = ({t, heat = 0}) => (
  <g>
    <rect width={1920} height={1080} fill={heat > 0.5 ? '#F4A261' : '#BDE0FE'} />
    <circle cx={1500} cy={200} r={90 + heat * 60} fill="#FFE24A" opacity={0.95} />
    <circle cx={1500} cy={200} r={160 + heat * 120} fill="#FFE24A" opacity={0.25} filter="url(#blurGlow)" />
    <rect x={0} y={GY - 120} width={1920} height={1200} fill="#F5F1E6" />
    {Array.from({length: 30}).map((_, i) => <path key={i} d={`M ${rnd(i) * 1920} ${GY - 100 + rnd(i + 3) * 300} l 60 -10 l 40 30 l 70 -20`} stroke="#D8CFBF" strokeWidth={4} fill="none" />)}
    <path d="M 1100 780 L 1250 560 L 1380 780 Z" fill="#E9E2D0" stroke="#B8AE98" strokeWidth={4} />
    {heat > 0 && Array.from({length: 6}).map((_, i) => <path key={i} d={`M ${300 + i * 250} ${GY - 200} q 20 -40 0 -80 q -20 -40 0 -80`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.4 * heat * Math.abs(Math.sin(t * 2 + i))} />)}
  </g>
);
const Canyon: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#F4D58D" />
    <path d="M 0 400 L 1920 420 L 1920 1080 L 0 1080 Z" fill="#C9A66B" />
    <path d="M 700 420 Q 900 700 820 1080 L 1120 1080 Q 1040 700 1220 420 Z" fill="#8B5A3C" stroke="#111" strokeWidth={5} />
    <path d="M 900 700 Q 960 800 930 1080" stroke="#5E3A1A" strokeWidth={10} fill="none" />
    {[300, 1500, 1700].map((x) => <g key={x}><rect x={x - 6} y={300} width={12} height={120} fill="#5E3A1A" /><path d={`M ${x} 300 l -40 -30 M ${x} 320 l 40 -40`} stroke="#5E3A1A" strokeWidth={8} /></g>)}
  </g>
);

const SHOTS: Shot[] = [
  // gancho: avance (barco cayendo al vacio, tierra seca, fosa)
  [0, (lt, t) => <V fx={900}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.3, 1.6, 0.8, 900, 500), ...shake(t, 8)}} blur={1.5} bg={<Ocean t={t} level={1100} ship={0.4 + lt} />} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.4, 1.7, 1)} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={540} r={300} t={t} mars={0.9} dry={1} />} /></V>],
  [1.2, (lt, t) => <V fx={1500}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.2, 1.5, 1, 1500, 700), ...shake(t, 6)}} blur={1.5} bg={<Ocean t={t} level={1100} />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.5, 1.2, 1)} blur={2} bg={<SaltDesert t={t} heat={1} />} /></V>],
  // 71% agua
  [2.4, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 3)} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} />} /></V>],
  [T('y'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.15, 1.3, 3)} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} dry={easeOut(ramp(lt, 0.3, 2.5))} />} /></V>],
  [T('minuto'), (lt, t) => <V fx={900}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 7, 900, 600)} blur={1.5} bg={<Ocean t={t} level={420 + easeOut(ramp(lt, 0, 6)) * 680} ship={lt > 2.2 ? (lt - 2.2) * 0.9 : -0.2} />} /></V>],
  [T('minuto', 2), (lt, t) => <V fx={950}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.25, 6, 950, 600)} blur={1.5} bg={<Abyss t={t} />} hero={<Ship x={1350} y={1020} r={-30} s={0.5} />} /></V>],
  [T('minuto', 3), (lt, t) => <V fx={1500}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.3, 7, 1500, 800)} blur={1} bg={<Ocean t={t} level={1100} />} hero={<><line x1={1480} y1={560} x2={1480} y2={1040} stroke="#FF4D6D" strokeWidth={6} /><line x1={1440} y1={560} x2={1520} y2={560} stroke="#FF4D6D" strokeWidth={6} /><line x1={1440} y1={1040} x2={1520} y2={1040} stroke="#FF4D6D" strokeWidth={6} /></>} /></V>],
  [T('millones'), (lt, t) => <V fx={900}><Cine t={t} mood="day" cam={kbV(lt, 1.3, 1.5, 3, 900, 760)} blur={1.5} bg={<Ocean t={t} level={1100} fish />} /></V>],
  [T('una', 2), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 4)} blur={2} bg={<SaltDesert t={t} />} /></V>],
  [T('océanos'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 4)} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} dry={1} />} /></V>],
  [T('ríos'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.3, 3)} blur={2} bg={<Canyon />} /></V>],
  [T('calor'), (lt, t) => <V fx={1300}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 3, 1300, 400)} blur={2} bg={<SaltDesert t={t} heat={easeOut(ramp(lt, 0, 1.5))} />} /></V>],
  [T('tierra', 2), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.3, 4)} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={300} t={t} dry={1} mars={easeOut(ramp(t, T('tierra', 2), T('marte') + 0.3))} />} /></V>],
  [T('peor'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 5, 960, 500)} blur={1.5} bg={<rect width={1920} height={1080} fill="#0E3B5C" />} hero={<>{Array.from({length: 22}).map((_, i) => { const p = (lt * 0.35 + rnd(i)) % 1; return <g key={i} opacity={(1 - p) * (1 - ramp(lt, 2, 4))}><circle cx={700 + rnd(i + 2) * 520} cy={1000 - p * 900} r={24 + rnd(i + 3) * 26} fill="none" stroke="#BDE0FE" strokeWidth={5} /><text x={700 + rnd(i + 2) * 520} y={1010 - p * 900} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill="#BDE0FE">O₂</text></g>; })}</>} /></V>],
  [T('aguantarías'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.2, 5)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={900} y={600} r={220} t={t} dry={1} mars={0.6} /><g transform={`translate(1160 ${760 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const OceanosShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('oceanos/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, 2.4, T('minuto'), T('minuto', 2), T('minuto', 3), T('tierra', 2)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={2.35} a="¿Y SI LOS OCÉANOS" b="DESAPARECIERAN?" size={92} />
      <VBig t={t} at={2.4} until={T('y') - 0.05} a="71%" b="ES AGUA" size={170} color2="#7CF4FF" />
      <VBig t={t} at={T('y')} until={T('minuto') - 0.05} a="EN 1 HORA" size={160} />
      <VBig t={t} at={T('minuto')} until={T('minuto', 2) - 0.05} a="MINUTO 1" size={160} />
      <VBig t={t} at={T('minuto', 2)} until={T('minuto', 3) - 0.05} a="MINUTO 10" size={160} />
      <VBig t={t} at={T('minuto', 3)} until={T('millones') - 0.05} a="11 KM" b="MÁS QUE EL EVEREST" size={150} color2="#FF4D6D" />
      <VBig t={t} at={T('una', 2)} until={T('océanos') - 0.05} a="UN DESIERTO" b="DE SAL" size={140} />
      <VBig t={t} at={T('océanos')} until={T('ríos') - 0.05} a="SIN NUBES" b="SIN LLUVIA" size={140} color2="#7CF4FF" />
      <VBig t={t} at={T('marte')} until={T('peor') - 0.05} a="MARTE" size={200} color="#FF6B3D" />
      <VBig t={t} at={T('mitad')} until={T('aguantarías') - 0.05} a="50% DEL" b="OXÍGENO" size={150} color2="#7CF4FF" />
      <VBig t={t} at={T('aguantarías')} a="¿AGUANTARÍAS" b="UNA SEMANA?" size={120} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const OceanosThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={900}><Cine t={1} mood="cold" cam={kbV(0, 1.3, 1.3, 1, 900, 500)} blur={1.5} bg={<Ocean t={1} level={1100} ship={0.6} />} /></V>
      <VBig t={1} at={0} a="¿Y SI LOS OCÉANOS" b="DESAPARECIERAN?" size={92} y={180} />
    </AbsoluteFill>
  );
};
