import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Earth, ramp, easeOut} from '../futuro/vkit';
import {SerieTag, FollowCard} from '../serie/kit';
import words from './words.json';

export const DURATION_S = 70;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|huracán|viento|patricia|tejados|agua|muro|katrina|harvey|litros|energía|electricidad|silencio|sol|ojo|trampa|pared|revés/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});
const F = 'Montserrat';

const P1 = T('paso'), REC = T('pero'), ESA = T('esa'), P2 = T('paso', 2), KAT = T('con'), HAR = T('y'), P3 = T('paso', 3), SIL = T('y', 2),
  OJO = T('estás'), GEN = T('mucha'), TRA = T('pero', 2), PAR = T('minutos') - 0.1, END = T('tú'), MAN = T('mañana');

/** cielo de tormenta con lluvia horizontal y palmeras dobladas (dir = sentido del viento) */
const Storm: React.FC<{t: number; k?: number; dir?: number; calm?: number}> = ({t, k = 1, dir = 1, calm = 0}) => (
  <g>
    <rect width={1920} height={1080} fill={calm > 0.5 ? '#7cc7ff' : '#2b3442'} />
    {calm > 0.5 && <circle cx={960} cy={200} r={90} fill="#FFE27A" opacity={calm} />}
    {calm < 0.5 && Array.from({length: 8}).map((_, i) => <ellipse key={i} cx={((i * 320 + t * 260 * dir) % 2400 + 2400) % 2400 - 240} cy={120 + rnd(i) * 160} rx={260} ry={70} fill="#3d4757" opacity={0.9} />)}
    <rect y={GY + 10} width={1920} height={200} fill="#3a5a40" />
    {[700, 1230].map((x, i) => { const b = (calm > 0.5 ? 0.05 : 0.5 + 0.12 * Math.sin(t * 9 + i)) * k * dir; return (
      <g key={i} transform={`translate(${x} ${GY + 10})`}>
        <path d={`M 0 0 Q ${b * 120} -200 ${b * 300} -380`} stroke="#6b4423" strokeWidth={26} fill="none" />
        {[-60, -20, 20, 60].map((a, j) => <path key={j} d={`M ${b * 300} -380 q ${80 * dir + a} ${-20 + j * 10} ${170 * (dir > 0 ? 1 : -1)} ${40 + j * 20}`} stroke="#2d6a4f" strokeWidth={22} fill="none" strokeLinecap="round" />)}
      </g>
    ); })}
    {calm < 0.5 && Array.from({length: Math.round(60 + 80 * k)}).map((_, i) => { const x = ((rnd(i) * 2300 + t * 1800 * dir) % 2300 + 2300) % 2300 - 190; const y = (rnd(i + 3) * 1080 + t * 700) % 1080; return <line key={i} x1={x} y1={y} x2={x + 70 * dir * k} y2={y + 25} stroke="#cfe3ff" strokeWidth={3} opacity={0.7} />; })}
  </g>
);
/** agua que sube */
const Flood: React.FC<{t: number; level: number}> = ({t, level}) => (
  <g>
    <path d={`M 0 ${level} ${Array.from({length: 25}).map((_, i) => `Q ${i * 80 + 40} ${level - 22 + Math.sin(t * 5 + i) * 10} ${(i + 1) * 80} ${level}`).join(' ')} L 1920 1080 L 0 1080 Z`} fill="#1d4e89" opacity={0.92} />
    <path d={`M 0 ${level} ${Array.from({length: 25}).map((_, i) => `Q ${i * 80 + 40} ${level - 22 + Math.sin(t * 5 + i) * 10} ${(i + 1) * 80} ${level}`).join(' ')}`} stroke="#e0f2ff" strokeWidth={8} fill="none" />
  </g>
);
/** casa a la que se le va el tejado (k 0..1) */
const House: React.FC<{t: number; k: number; dir?: number}> = ({t, k, dir = 1}) => (
  <g transform={`translate(960 ${GY + 10})`}>
    <rect x={-180} y={-230} width={360} height={230} fill="#f2e8cf" stroke="#111" strokeWidth={8} />
    <rect x={-40} y={-120} width={80} height={120} fill="#6b4423" stroke="#111" strokeWidth={6} />
    {[-130, 70].map((x) => <rect key={x} x={x} y={-190} width={60} height={50} fill="#9ad1ff" stroke="#111" strokeWidth={5} />)}
    <g transform={`translate(${k * 900 * dir} ${-k * 520}) rotate(${k * 260 * dir})`}><path d="M -220 -230 L 0 -380 L 220 -230 Z" fill="#bc4749" stroke="#111" strokeWidth={8} /></g>
  </g>
);
/** espiral vista desde arriba */
const Spiral: React.FC<{t: number; eye?: number}> = ({t, eye = 0}) => (
  <g>
    <rect width={1920} height={1080} fill="#0b2545" />
    <g transform={`translate(960 540) rotate(${-t * 40})`}>
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M 0 0 m ${-60 - i * 55} 0 a ${60 + i * 55} ${55 + i * 50} 0 1 1 ${120 + i * 110} 0`} stroke="#e0f2ff" strokeWidth={34 - i * 3} fill="none" opacity={0.85 - i * 0.09} transform={`rotate(${i * 50})`} />)}
      <circle r={48} fill="#0b2545" />
    </g>
    {eye > 0 && <circle cx={960} cy={540} r={48 + eye * 20} fill="none" stroke="#FFD23F" strokeWidth={8} opacity={0.6 + 0.4 * Math.sin(t * 8)} />}
  </g>
);
/** velocimetro */
const Gauge: React.FC<{v: number; max?: number}> = ({v, max = 360}) => {
  const a = -120 + 240 * Math.min(1, v / max);
  return (
    <g transform="translate(960 520)" fontFamily={F} fontWeight={900}>
      <circle r={230} fill="#0B0620" stroke="#fff" strokeWidth={10} />
      <path d="M -199 115 A 230 230 0 1 1 199 115" fill="none" stroke="#FF4D6D" strokeWidth={14} opacity={0.4} />
      <line x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 190} y2={-Math.cos((a * Math.PI) / 180) * 190} stroke="#FFD23F" strokeWidth={14} strokeLinecap="round" />
      <circle r={22} fill="#FFD23F" />
      <text y={150} textAnchor="middle" fontSize={96} fill="#fff">{Math.round(v)}</text>
      <text y={200} textAnchor="middle" fontSize={36} fill="#aaa">KM/H</text>
    </g>
  );
};
/** pluviometro */
const Rain: React.FC<{v: number}> = ({v}) => (
  <g transform="translate(960 0)" fontFamily={F} fontWeight={900}>
    <rect x={-90} y={330} width={180} height={420} rx={20} fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth={8} />
    <rect x={-82} y={742 - 404 * Math.min(1, v / 1500)} width={164} height={404 * Math.min(1, v / 1500)} rx={14} fill="#4CC9F0" />
    <text y={850} textAnchor="middle" fontSize={84} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">{Math.round(v).toLocaleString('es-ES')} L/m²</text>
  </g>
);
/** la Tierra frente a un enchufe x200 */
const Energy: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect width={1920} height={1080} fill="#05050F" />
    <Earth x={960} y={520} r={190} t={t} />
    {Array.from({length: 10}).map((_, i) => { const a = (i / 10) * Math.PI * 2 + t; return <path key={i} d={`M ${960 + Math.cos(a) * 210} ${520 + Math.sin(a) * 210} l ${Math.cos(a) * 40} ${Math.sin(a) * 40 - 20} l -10 25 l ${Math.cos(a) * 40} ${Math.sin(a) * 40}`} stroke="#FFD23F" strokeWidth={8} fill="none" opacity={k} />; })}
    <text x={960} y={880} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={150} fill="#FFD23F" stroke="#111" strokeWidth={10} paintOrder="stroke">x{Math.round(200 * k)}</text>
  </g>
);
/** pared del ojo que avanza (k 0..1) desde la derecha */
const Wall: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect x={1920 - k * 1300} y={0} width={1500} height={1080} fill="#2b3442" />
    {Array.from({length: 30}).map((_, i) => { const x = 1920 - k * 1300 + rnd(i) * 400; const y = (rnd(i + 2) * 1080 + t * 900) % 1080; return <line key={i} x1={x} y1={y} x2={x - 70} y2={y + 25} stroke="#cfe3ff" strokeWidth={4} />; })}
    <path d={`M ${1920 - k * 1300} 0 Q ${1880 - k * 1300} 540 ${1920 - k * 1300} 1080`} stroke="#e0f2ff" strokeWidth={20} fill="none" opacity={0.6} />
  </g>
);

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} blur={1.5} mood="night" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 9 - lt * 10)}} bg={<Storm t={t} />} hero={<><House t={t} k={0.25 + lt * 0.8} /><Hero x={1180} y={GY + 20} s={1.0} t={t} pose={POSES.scared} eyes="wide" mouth="o" rotate={-15} /></>} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} blur={1} mood="cold" cam={{...kbV(lt, 1.3, 1.1, 0.6), ...shake(t, 4)}} bg={<Spiral t={t * 3} />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} blur={1.5} mood="night" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 6)}} bg={<Storm t={t} />} hero={<><House t={t} k={0} /><Flood t={t} level={GY - 120 - lt * 200} /></>} /></V>],
  [1.8, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.1, 1.3, 2.1)} bg={<Storm t={t} calm={1} />} hero={<><Hero x={960} y={GY + 20} s={1.3} t={t} pose={POSES.idle} eyes="happy" mouth="smile" /><Wall t={t} k={0.45 + lt * 0.15} /></>} /></V>],
  [P1, (lt, t) => <V><Cine t={t} blur={1.5} mood="night" cam={kbV(lt, 1.0, 1.15, REC - P1)} bg={<Storm t={t} k={0.6} />} hero={<Gauge v={119 * easeOut(ramp(t, T('119') - 0.4, T('km/h') + 0.3))} />} /></V>],
  [REC, (lt, t) => <V><Cine t={t} blur={1.5} mood="red" cam={{...kbV(lt, 1.0, 1.2, ESA - REC), ...shake(t, t > T('345') ? 5 : 0)}} bg={<Storm t={t} />} hero={<Gauge v={119 + 226 * easeOut(ramp(t, T('345') - 0.4, T('km/h', 2) + 0.4))} />} /></V>],
  [ESA, (lt, t) => <V><Cine t={t} blur={1.5} mood="night" cam={{...kbV(lt, 1.0, 1.2, P2 - ESA), ...shake(t, 6)}} bg={<Storm t={t} />} hero={<House t={t} k={easeOut(ramp(t, T('arranca') - 0.1, T('enteros') + 0.5))} />} /></V>],
  [P2, (lt, t) => <V><Cine t={t} blur={1.5} mood="night" cam={kbV(lt, 1.0, 1.15, KAT - P2)} bg={<Storm t={t} />} hero={<><House t={t} k={0} /><Flood t={t} level={GY - 20 - 120 * easeOut(ramp(t, T('levanta') - 0.2, T('muro') + 0.4))} /></>} /></V>],
  [KAT, (lt, t) => { const k = easeOut(ramp(t, T('8') - 0.5, T('metros') + 0.5)); return <V><Cine t={t} blur={1.5} mood="night" cam={{...kbV(lt, 1.0, 1.2, HAR - KAT), ...shake(t, 3)}} bg={<Storm t={t} />} hero={<><House t={t} k={0} /><Flood t={t} level={GY - 20 - 440 * k} /><text x={960} y={470} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">+{Math.round(8 * k)} m</text></>} /></V>; }],
  [HAR, (lt, t) => <V><Cine t={t} blur={1.5} mood="cold" cam={kbV(lt, 1.0, 1.15, P3 - HAR)} bg={<Storm t={t} k={0.8} />} hero={<Rain v={1500 * easeOut(ramp(t, T('1.500') - 0.6, T('cuadrado') + 0.3))} />} /></V>],
  [P3, (lt, t) => <V><Cine t={t} blur={1} mood="cold" cam={kbV(lt, 1.0, 1.2, (T('normal') - 0.5) - P3)} bg={<Spiral t={t} />} /></V>],
  [(T('normal') - 0.5), (lt, t) => <V><Cine t={t} blur={1.5} mood="future" cam={kbV(lt, 1.0, 1.15, SIL - (T('normal') - 0.5))} bg={<rect width={1920} height={1080} fill="#05050F" />} hero={<Energy t={t} k={easeOut(ramp(t, T('200') - 0.4, T('veces') + 0.4))} />} /></V>],
  [SIL, (lt, t) => { const c = t > T('sale') - 0.1 ? 1 : 0; return <V><Cine t={t} mood={c ? 'day' : 'night'} cam={kbV(lt, 1.0, 1.2, OJO - SIL)} bg={<Storm t={t} calm={c} k={c ? 0 : 1 - ramp(t, SIL, T('silencio'))} />} hero={<Hero x={960} y={GY + 20} s={1.3} t={t} pose={c ? POSES.idle : POSES.headHold} eyes="wide" mouth="o" />} /></V>; }],
  [OJO, (lt, t) => <V><Cine t={t} blur={1} mood="cold" cam={kbV(lt, 1.0, 1.5, GEN - OJO)} bg={<Spiral t={t} eye={1} />} /></V>],
  [GEN, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, TRA - GEN)} bg={<Storm t={t} calm={1} />} hero={<><House t={t} k={0} /><Hero x={960 + lt * 60} y={GY + 20} s={1.0} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /></>} /></V>],
  [TRA, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.0, PAR - TRA), ...shake(t, lt < 0.4 ? 6 : 0)}} bg={<Storm t={t} calm={1} />} hero={<><House t={t} k={0} /><Hero x={1110} y={GY + 20} s={1.0} t={t} pose={POSES.scared} eyes="wide" mouth="o" /><Wall t={t} k={0.05 + lt * 0.08} /></>} /></V>],
  [PAR, (lt, t) => { const k = easeOut(ramp(t, PAR, T('pared') + 0.6)); return <V><Cine t={t} mood="night" cam={{...kbV(lt, 1.0, 1.2, END - PAR), ...shake(t, 4 + k * 4)}} bg={k > 0.95 ? <Storm t={t} dir={-1} /> : <Storm t={t} calm={1} />} hero={<><House t={t} k={easeOut(ramp(t, T('revés') - 0.3, T('revés') + 0.6))} dir={-1} /><Hero x={1110 - k * 200} y={GY + 20} s={1.0} t={t} pose={POSES.scared} eyes="wide" mouth="o" rotate={k * -20} />{k < 0.95 && <Wall t={t} k={0.15 + k * 0.85} />}</>} /></V>; }],
  [END, (lt, t) => <V><Cine t={t} blur={1.5} mood="night" cam={kbV(lt, 1.1, 1.3, 2, 960, 600)} bg={<Storm t={t} dir={-1} />} hero={<><House t={t} k={1} dir={-1} /><Hero x={960} y={GY + 20} s={1.2} t={t} pose={POSES.shrug} eyes="wide" mouth="o" /></>} /></V>],
];

export const HuracanShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('huracan/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <SerieTag t={t} ep={9} />
      <VBig t={t} at={0.03} until={P1 - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="DENTRO DE UN HURACÁN?" size={92} color2="#7FD3FF" />
      <VBig t={t} at={P1} until={REC - 0.05} a="PASO 1" b="EL VIENTO" size={140} color2="#7FD3FF" />
      <VBig t={t} at={REC} until={ESA - 0.05} a="RÉCORD · PATRICIA" b="345 KM/H" size={130} color2="#FF4D6D" />
      <VBig t={t} at={ESA} until={P2 - 0.05} a="ARRANCA" b="TEJADOS ENTEROS" size={120} color2="#FF4D6D" />
      <VBig t={t} at={P2} until={KAT - 0.05} a="PASO 2" b="UN MURO DE AGUA" size={125} color2="#4CC9F0" />
      <VBig t={t} at={KAT} until={HAR - 0.05} a="KATRINA 2005" b="+8 METROS" size={140} color2="#4CC9F0" />
      <VBig t={t} at={HAR} until={P3 - 0.05} a="HARVEY 2017" b="+1.500 L/m²" size={130} color2="#4CC9F0" />
      <VBig t={t} at={P3} until={T('normal') - 0.55} a="PASO 3" b="LA ENERGÍA" size={140} color2="#FFD23F" />
      <VBig t={t} at={T('normal') - 0.5} until={SIL - 0.05} a="x200" b="ELECTRICIDAD MUNDIAL" size={110} color2="#FFD23F" />
      <VBig t={t} at={SIL} until={OJO - 0.05} a="DE REPENTE…" b="SILENCIO" size={150} color2="#7FD3FF" />
      <VBig t={t} at={OJO} until={TRA - 0.05} a="ESTÁS EN" b="EL OJO" size={160} color2="#FFD23F" />
      <VBig t={t} at={TRA} until={END - 0.05} a="ES UNA" b="TRAMPA" size={170} color="#fff" color2="#FF4D6D" />
      <VBig t={t} at={END} until={MAN - 0.05} a="¿TÚ SALDRÍAS" b="DE CASA?" size={140} color2="#FFD23F" />
      {t < MAN && <Caps t={t} />}
      <FollowCard t={t} at={MAN} ep={9} next="¿EN LA CIMA DEL EVEREST?"><svg viewBox="0 0 760 560" width={760} height={560}><rect width={760} height={560} fill="#1d3557" /><path d="M 0 560 L 380 90 L 760 560 Z" fill="#6c757d" /><path d="M 300 190 L 380 90 L 460 190 L 420 175 L 380 210 L 340 175 Z" fill="#fff" />{Array.from({length: 30}).map((_, i) => <circle key={i} cx={(rnd(i) * 760 + t * 200) % 760} cy={(rnd(i + 3) * 560 + t * 60) % 560} r={4} fill="#fff" />)}</svg></FollowCard>
    </AbsoluteFill>
  );
};

export const HuracanThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="night" cam={kbV(0, 1.3, 1.3, 1, 960, 600)} bg={<Storm t={1} />} hero={<><House t={1} k={0.45} /><Hero x={1180} y={GY + 20} s={1.0} t={1} pose={POSES.scared} eyes="wide" mouth="o" rotate={-15} /></>} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN UN HURACÁN? #9" size={92} y={180} color2="#7FD3FF" />
    </AbsoluteFill>
  );
};
