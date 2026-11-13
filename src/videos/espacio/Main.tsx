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

export const DURATION_S = 63;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|espacio|pulmones|hervir|hierve|desmayas|oxígeno|nasa|sobrevivió/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

const Space: React.FC<{t: number}> = ({t}) => <g><Stars t={t} /><Earth x={1500} y={1150} r={520} t={t} /></g>;
const Float: React.FC<{t: number; s?: number; eyes?: any; mouth?: any; pose?: any; swell?: number; x?: number; y?: number}> = ({t, s = 1.4, eyes = 'wide', mouth = 'o', pose = POSES.fly, swell = 0, x = 960, y = 920}) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 1.2) * 20}) rotate(${Math.sin(t * 0.5) * 12}) scale(${1 + swell * 0.12}) translate(${-x} ${-y})`}>
    <Hero x={x} y={y} s={s} t={t} pose={pose} eyes={eyes} mouth={mouth} />
  </g>
);
const Puff: React.FC<{x: number; y: number; t: number; at: number}> = ({x, y, t, at}) => (
  <g>{Array.from({length: 14}).map((_, i) => { const p = Math.max(0, Math.min(1, (t - at - i * 0.03) / 1.2)); return <circle key={i} cx={x + (rnd(i) - 0.3) * 600 * p} cy={y - (rnd(i + 2) - 0.5) * 300 * p} r={20 + 30 * p} fill="#E0F4FF" opacity={(1 - p) * 0.7} />; })}</g>
);
const Bubbles: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g>{Array.from({length: 10}).map((_, i) => { const p = (t * 1.5 + i / 10) % 1; return <circle key={i} cx={x + Math.sin(i * 3 + t * 4) * 30} cy={y - p * 120} r={6 + p * 10} fill="none" stroke="#BDE0FE" strokeWidth={4} opacity={1 - p} />; })}</g>
);
const Chamber: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#4A4E69" />
    <rect y={GY} width={1920} height={200} fill="#22223B" />
    <rect x={460} y={140} width={1000} height={760} rx={80} fill="#8D99AE" stroke="#111" strokeWidth={10} />
    <circle cx={960} cy={480} r={260} fill="#14213D" stroke="#111" strokeWidth={14} />
    {[-1, 1].map((d) => <rect key={d} x={960 + d * 420 - 20} y={160} width={40} height={720} fill="#6C757D" />)}
    <circle cx={1350} cy={260} r={22} fill={Math.sin(t * 8) > 0 ? '#E63946' : '#5A0A10'} />
  </g>
);
const Timer: React.FC<{t: number; at: number; until: number}> = ({t, at, until}) => {
  if (t < at || t > until) return null;
  const s = Math.min(90, Math.floor((t - at) * 22));
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1640, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: s > 80 ? '#FF4D6D' : '#FFD23F', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>{s} s</div>;
};

const SHOTS: Shot[] = [
  // gancho: avance (desmayado flotando, saliva hirviendo, puerta que se abre)
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.4, 1.7, 0.6, 960, 420), ...shake(t, 8)}} bg={<Space t={t} />} hero={<><Float t={t} eyes="scared" mouth="open" /><Puff x={960} y={590} t={t} at={0.05} /></>} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.6, 1.9, 0.6, 960, 360)} bg={<Space t={t} />} hero={<><Float t={t} eyes="wide" mouth="open" /><Bubbles x={960} y={580} t={t} /></>} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={{...kbV(lt, 1.2, 1.5, 0.6), ...shake(t, 5)}} bg={<Chamber t={t} />} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.5, 1.2, 0.6)} bg={<Space t={t} />} hero={<Float t={t} eyes="closed" mouth="flat" />} /></V>],
  // mitos
  [T('olvida'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 5)} bg={<Space t={t} />} hero={<Float t={t} eyes="normal" mouth="flat" pose={POSES.shrug} />} /></V>],
  // segundo 1
  [T('segundo'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.35, 3, 960, 420), ...(lt > 1.4 && lt < 2 ? shake(t, 8) : {})}} bg={<Space t={t} />} hero={<><Float t={t} eyes="wide" mouth="open" /><Puff x={960} y={590} t={t} at={T('aire') + 0.1} /></>} /></V>],
  [T('si'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.3, 3)} bg={<rect width={1920} height={1080} fill="#2B0A10" />} hero={<g transform="translate(960 520)">{[-1, 1].map((d) => <path key={d} d={`M ${d * 30} -160 Q ${d * (250 + lt * 30)} -140 ${d * (230 + lt * 30)} 120 Q ${d * 130} 220 ${d * 40} 140 Z`} fill="#F4A7B9" stroke="#111" strokeWidth={8} />)}{lt > 1.6 && <path d="M -150 -40 l 40 30 l -20 20 l 40 30" stroke="#9D0208" strokeWidth={8} fill="none" />}</g>} /></V>],
  // segundo 10
  [T('segundo', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.3, 1.8, 4, 960, 380)} bg={<Space t={t} />} hero={<><Float t={t} eyes="wide" mouth="open" /><Bubbles x={960} y={580} t={t} /></>} /></V>],
  [T('sin', 2), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 3)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<g fontFamily="Montserrat" fontWeight={900}><rect x={900} y={180} width={120} height={600} rx={60} fill="#F1FAEE" stroke="#111" strokeWidth={8} /><rect x={920} y={520} width={80} height={240} rx={40} fill="#E63946" /><circle cx={960} cy={820} r={90} fill="#E63946" stroke="#111" strokeWidth={8} /><text x={1040} y={540} fontSize={72} fill="#fff">37°C</text><Bubbles x={960} y={480} t={t} /></g>} /></V>],
  [T('tu', 3), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Space t={t} />} hero={<Float t={t} eyes="wide" mouth="o" swell={easeOut(ramp(lt, 0.2, 1.5))} />} /></V>],
  // segundo 15
  [T('segundo', 3), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.4, 5, 960, 420)} bg={<Space t={t} />} hero={<><Float t={t} eyes={lt > 1.2 ? 'closed' : 'wide'} mouth="flat" pose={POSES.idle} /><rect width={1920} height={1080} fill="#000" opacity={0.5 * ramp(lt, 1, 2.5)} /></>} /></V>],
  // rescate antes de 90 s
  [T('y', 2), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 6)} bg={<Space t={t} />} hero={<><Float t={t} eyes="closed" mouth="flat" pose={POSES.idle} x={960 - easeOut(ramp(lt, 2.5, 5.5)) * 400} /><line x1={0} y1={360} x2={980 - easeOut(ramp(lt, 2.5, 5.5)) * 400} y2={520} stroke="#FFD23F" strokeWidth={8} opacity={ramp(lt, 1.6, 2)} /></>} /></V>],
  // 1966
  [T('1966'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.3, 8)} bg={<g style={{filter: 'sepia(0.6)'}}><Chamber t={t} /></g>} hero={<g style={{filter: 'sepia(0.4)'}}><g transform="translate(960 470) scale(0.55) translate(-960 -920)"><Float t={t} eyes={t > T('lo', 3) ? 'closed' : 'wide'} mouth="open" /></g></g>} /></V>],
  [T('sobrevivió'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Space t={t} />} hero={<Float t={t} eyes="wide" mouth="o" pose={POSES.cheer} />} /></V>],
];

export const EspacioShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('espacio/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('segundo'), T('segundo', 2), T('segundo', 3), T('1966')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <SerieTag t={t} ep={2} />
      <VBig t={t} at={0.03} until={T('olvida') - 0.05} a="¿CUÁNTO AGUANTARÍAS" b="EN EL ESPACIO?" size={98} color2="#7CF4FF" />
      <VBig t={t} at={T('olvida')} until={T('segundo') - 0.05} a="✗ EXPLOTAR" b={t > T('y') ? '✗ CONGELARTE' : undefined} size={130} color2="#FF4D6D" />
      <VBig t={t} at={T('segundo')} until={T('segundo', 2) - 0.05} a="SEGUNDO 1" b="SIN AIRE" size={140} color2="#7CF4FF" />
      <VBig t={t} at={T('segundo', 2)} until={T('segundo', 3) - 0.05} a="SEGUNDO 10" b="LA SALIVA HIERVE" size={120} color2="#FF4D6D" />
      <VBig t={t} at={T('segundo', 3)} until={T('y', 2) - 0.05} a="SEGUNDO 15" b="TE DESMAYAS" size={130} />
      <VBig t={t} at={T('si', 2)} until={T('1966') - 0.05} a="< 90 SEGUNDOS" b="SOBREVIVES" size={120} color2="#7BF59A" />
      <Timer t={t} at={T('si', 2)} until={T('1966') - 0.05} />
      <VBig t={t} at={T('1966')} until={T('cuántos') - 0.05} a="1966" b="NASA" size={170} color2="#FFD23F" />
      <VBig t={t} at={T('cuántos')} until={T('mañana') - 0.05} a="¿CUÁNTOS SEGUNDOS" b="AGUANTARÍAS?" size={110} />
      {t < T('mañana') && <Caps t={t} />}
      <FollowCard t={t} at={T('mañana')} ep={2} next="¿EN EL FONDO DEL MAR?"><svg viewBox="0 0 760 560" width={760} height={560}><rect width={760} height={560} fill="#0B3954" /><Sea t={t} level={80} night />{Array.from({length: 10}).map((_, i) => <circle key={i} cx={100 + i * 60} cy={500 - ((t * 60 + i * 50) % 420)} r={8} fill="none" stroke="#BDE0FE" strokeWidth={3} />)}<g transform="translate(380 470)"><Hero x={0} y={0} s={0.7} t={t} eyes="wide" mouth="o" /></g></svg></FollowCard>
    </AbsoluteFill>
  );
};

export const EspacioThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="cold" cam={kbV(0, 1.5, 1.5, 1, 960, 420)} bg={<Space t={1} />} hero={<><Float t={1} eyes="scared" mouth="open" /><Bubbles x={960} y={580} t={1} /></>} /></V>
      <VBig t={1} at={0} a="¿CUÁNTO AGUANTARÍAS" b="EN EL ESPACIO?" size={98} y={180} color2="#7CF4FF" />
    </AbsoluteFill>
  );
};
