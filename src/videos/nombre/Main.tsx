import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Room, CityNight, School, PhoneV} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 61;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|leo|euro|millón|todos|dormir|pensar|nombre/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

const Say: React.FC<{x: number; y: number; text: string; t: number; at: number; s?: number; red?: boolean}> = ({x, y, text, t, at, s = 1, red}) => {
  const k = easeOut(ramp(t, at, at + 0.2));
  if (k <= 0) return null;
  const w = text.length * 34 + 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <rect x={-w / 2} y={-70} width={w} height={110} rx={50} fill={red ? '#FF2D55' : '#fff'} stroke="#111" strokeWidth={7} />
      <path d="M -20 38 L 0 90 L 30 38 Z" fill={red ? '#FF2D55' : '#fff'} stroke="#111" strokeWidth={7} strokeLinejoin="round" />
      <rect x={-24} y={30} width={60} height={14} fill={red ? '#FF2D55' : '#fff'} />
      <text x={0} y={8} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={58} fill={red ? '#fff' : '#111'}>{text}</text>
    </g>
  );
};
const MoneyRain: React.FC<{t: number; k?: number; n?: number}> = ({t, k = 1, n = 40}) => (
  <g opacity={k}>
    {Array.from({length: n}).map((_, i) => {
      const p = (t * (0.35 + rnd(i) * 0.3) + rnd(i + 7)) % 1;
      const x = rnd(i + 1) * 1920 + Math.sin(t * 2 + i) * 40, y = -80 + p * 1240;
      return <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(t * 3 + i) * 40})`}><rect x={-46} y={-24} width={92} height={48} rx={6} fill="#7BC47F" stroke="#1E5631" strokeWidth={4} /><text x={0} y={14} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#1E5631">€</text></g>;
    })}
  </g>
);
const LeoSwarm: React.FC<{t: number; n: number; red?: boolean; cx?: number; cy?: number}> = ({t, n, red, cx = 960, cy = 520}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const a = rnd(i) * Math.PI * 2 + t * (0.4 + rnd(i + 2)), r = 160 + rnd(i + 3) * 700;
      return <text key={i} x={cx + Math.cos(a) * r} y={cy + Math.sin(a) * r * 0.6} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30 + rnd(i + 4) * 60} fill={red ? (i % 3 ? '#FF2D55' : '#fff') : '#FFD23F'} stroke="#111" strokeWidth={4} paintOrder="stroke" opacity={0.85}>LEO</text>;
    })}
  </g>
);
const Island: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={1920} height={1080} fill="#8EE3F5" />
    <circle cx={1500} cy={220} r={100} fill="#FFE24A" />
    <rect y={620} width={1920} height={460} fill="#1FA3C9" />
    {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${i * 170 + Math.sin(t + i) * 20} ${680 + (i % 3) * 120} q 40 -20 80 0`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} />)}
    <ellipse cx={960} cy={700} rx={520} ry={110} fill="#F4D58D" stroke="#111" strokeWidth={6} />
    <path d="M 1150 680 Q 1170 480 1120 380" stroke="#6B4226" strokeWidth={26} fill="none" />
    {[0, 60, 130, 200, 260].map((a) => <path key={a} d={`M 1120 380 q ${Math.cos(a / 57) * 120} ${-60 + Math.sin(a / 57) * 60} ${Math.cos(a / 57) * 240} ${Math.sin(a / 57) * 120}`} stroke="#2E8B57" strokeWidth={30} fill="none" strokeLinecap="round" />)}
  </g>
);
const Mansion: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#BDE0FE" />
    <rect y={GY} width={1920} height={200} fill="#6FA35A" />
    <rect x={560} y={GY - 400} width={800} height={400} fill="#F1FAEE" stroke="#111" strokeWidth={7} />
    <path d="M 520 520 L 960 300 L 1400 520 Z" fill="#C1440E" stroke="#111" strokeWidth={7} />
    {[620, 780, 1060, 1220].map((x) => <rect key={x} x={x} y={GY - 330} width={90} height={110} fill="#7CC6FE" stroke="#111" strokeWidth={5} />)}
    <rect x={910} y={GY - 160} width={100} height={160} fill="#6B4226" stroke="#111" strokeWidth={5} />
  </g>
);
const Car: React.FC<{x: number}> = ({x}) => (
  <g transform={`translate(${x} ${GY})`}>
    <path d="M -260 -40 L -200 -120 L 120 -120 L 220 -60 L 260 -40 L 260 0 L -260 0 Z" fill="#E63946" stroke="#111" strokeWidth={7} />
    <path d="M -170 -110 L 90 -110 L 160 -60 L -200 -60 Z" fill="#A8DADC" stroke="#111" strokeWidth={5} />
    {[-160, 160].map((dx) => <circle key={dx} cx={dx} cy={0} r={48} fill="#222" stroke="#111" strokeWidth={6} />)}
  </g>
);
const Bed: React.FC = () => (
  <g>
    <rect x={560} y={GY - 120} width={800} height={120} fill="#3D348B" stroke="#111" strokeWidth={6} />
    <rect x={560} y={GY - 200} width={40} height={200} fill="#6B4226" />
    <rect x={620} y={GY - 160} width={180} height={50} rx={20} fill="#F1FAEE" stroke="#111" strokeWidth={4} />
  </g>
);
const Counter: React.FC<{t: number; at: number; from: number; to: number; dur?: number; y?: number}> = ({t, at, from, to, dur = 0.8, y = 1500}) => {
  if (t < at) return null;
  const v = Math.round(from + (to - from) * easeOut(ramp(t, at, at + dur)));
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: '#7BF59A', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>{v.toLocaleString('es-ES')} €</div>;
};

const SHOTS: Shot[] = [
  // gancho: avance del climax (todo el mundo grita LEO) + lluvia de dinero
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.6, 0.6), ...shake(t, 10)}} bg={<CityNight />} mid={<LeoSwarm t={t} n={50} red />} hero={<Hero x={960} y={GY + 30} s={1.6} t={t} pose={POSES.headHold} eyes="scared" mouth="open" />} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.4, 1.2, 0.6)} bg={<Mansion />} hero={<><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /><MoneyRain t={t} /></>} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={{...kbV(lt, 1.2, 1.5, 1), ...shake(t, 6)}} bg={<Room night />} hero={<><Bed /><Hero x={1000} y={GY - 80} s={1.3} t={t} pose={POSES.headHold} eyes="wide" /><LeoSwarm t={t} n={30} red cx={1000} cy={400} /></>} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.5, 1.3, 1)} bg={<CityNight />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" />} /></V>],
  // me llamo Leo
  [T('me'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 2)} bg={<CityNight />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.wave} eyes="normal" mouth="smile" />} /></V>],
  [T('día'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 4)} bg={<Room />} hero={<><Hero x={1150} t={t} s={1.3} eyes="happy" mouth="smile" /><NPC x={720} t={t} s={1.3} color="#C0392B" hairBun pose={POSES.shout} mouth="open" /><Say x={960} y={330} text="¡LEO, A CENAR!" t={t} at={T('madre')} /></>} /></V>],
  [T('al'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 3)} bg={<School />} hero={<><NPC x={700} t={t} s={1.3} color="#2D6A4F" pose={POSES.point} /><Hero x={1180} t={t} s={1.2} pose={POSES.wave} eyes="happy" mouth="smile" /><Say x={860} y={360} text="¿LEO?" t={t} at={T('pasa')} /></>} /></V>],
  [T('mis'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={{...kbV(lt, 1.0, 1.2, 3), ...(t > T('200') ? shake(t, 4) : {})}} bg={<><rect width={1920} height={1080} fill="#8EC5E8" /><rect y={GY - 40} width={1920} height={300} fill="#4CAF50" /></>} hero={<><Hero x={960} t={t} s={1.3} pose={POSES.cheer} eyes="happy" mouth="grin" />{[560, 720, 1200, 1360].map((x, i) => <NPC key={x} x={x} t={t} s={1.1} color={['#E76F51', '#264653', '#F4A261', '#6A4C93'][i]} pose={POSES.cheer} mouth="open" flip={x > 960} />)}<Say x={960} y={300} text="¡LEO! ¡LEO!" t={t} at={T('gritan')} /></>} /></V>],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 2)} bg={<Room night />} hero={<><Hero x={960} t={t} s={1.4} pose={POSES.point} eyes="evil" mouth="grin" /><circle cx={960} cy={300} r={60 + Math.sin(t * 8) * 6} fill="#FFE24A" stroke="#111" strokeWidth={6} opacity={easeOut(ramp(lt, 0.4, 0.7))} /></>} /></V>],
  [T('subí'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 5)} bg={<Room night />} hero={<PhoneV x={960} y={560} s={1.1} t={t} views={t < T('millón') ? `${Math.round(easeOut(ramp(lt, 0, 3.5)) * 900)}K` : '1M'} />} /></V>],
  [T('todo'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.3, 4), ...(lt > 2 ? shake(t, 5) : {})}} bg={<CityNight />} mid={<LeoSwarm t={t} n={Math.round(8 + lt * 10)} />} hero={<>{Array.from({length: 9}).map((_, i) => <NPC key={i} x={300 + i * 165} t={t} s={0.9} color={['#E76F51', '#264653', '#F4A261', '#6A4C93', '#2A9D8F'][i % 5]} pose={POSES.cheer} mouth="open" flip={i > 4} />)}</>} /></V>],
  [T('10000'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.2, 1.4, 2)} bg={<rect width={1920} height={1080} fill="#1B4332" />} hero={<><MoneyRain t={t} n={60} /><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.armsUp} eyes="happy" mouth="grin" /></>} /></V>],
  [T('compré'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 2)} bg={<Mansion />} hero={<Hero x={1450} t={t} s={1.1} pose={POSES.cheer} eyes="happy" mouth="grin" />} /></V>],
  [T('un', 2), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.1, 1.25, 2)} bg={<><rect width={1920} height={1080} fill="#BDE0FE" /><rect y={GY} width={1920} height={200} fill="#555" /></>} hero={<><Car x={960 + (1 - easeOut(ramp(lt, 0, 0.6))) * 900} /><MoneyRain t={t} n={14} /></>} /></V>],
  [T('una', 3), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.3, 1.1, 2)} bg={<Island t={t} />} hero={<Hero x={900} y={680} s={1.1} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" />} /></V>],
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.35, 3, 960, 420)} bg={<Room night />} hero={<Hero x={960} t={t} s={1.5} eyes="side" mouth="flat" />} /></V>],
  [T('cada', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.2, 1.5, 3, 960, 380)} bg={<Room night />} hero={<><Hero x={960} t={t} s={1.5} pose={POSES.headHold} eyes="wide" mouth="o" /><Say x={600} y={260} text="leo" t={t} at={T('también')} s={0.6} /><Say x={1320} y={320} text="leo" t={t} at={T('oigo')} s={0.6} /></>} /></V>],
  [T('todos'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.6, 6), ...shake(t, 4 + lt * 2)}} bg={<CityNight />} mid={<LeoSwarm t={t} n={Math.round(40 + lt * 25)} red />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.headHold} eyes="scared" mouth="open" />} /></V>],
  [T('ya'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={{...kbV(lt, 1.1, 1.4, 3, 1000, 600), ...shake(t, 3)}} bg={<Room night />} hero={<><Bed /><Hero x={1000} y={GY - 80} s={1.3} t={t} pose={POSES.headHold} eyes="wide" sweat /><LeoSwarm t={t} n={24} red cx={1000} cy={380} /></>} /></V>],
  [T('solo'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.3, 4)} bg={<CityNight />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.kneel} eyes="closed" mouth="frown" />} /></V>],
  [T('así'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.4, 5, 960, 420)} bg={<CityNight />} hero={<><Hero x={960} y={GY + 20} s={1.6} t={t} pose={POSES.hands} eyes="scared" mouth="frown" sweat /><g transform={`translate(1500 ${820 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const NombreShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('nombre/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('me'), T('10000'), T('pero'), T('todos')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={T('me') - 0.05} a="CADA VEZ QUE DICEN" b="MI NOMBRE: +1 €" size={105} />
      <VBig t={t} at={T('me')} until={T('día') - 0.05} a="LEO" size={240} color="#FFD23F" />
      {t < T('1', 3) ? <Counter t={t} at={T('3')} from={1} to={4} /> : t < T('200') ? <Counter t={t} at={T('1', 3)} from={4} to={5} /> : t < T('entonces') ? <Counter t={t} at={T('200')} from={5} to={205} /> : null}
      <VBig t={t} at={T('millón')} until={T('todo') - 0.05} a="1.000.000" b="VISITAS" size={150} color2="#FF2D55" />
      <VBig t={t} at={T('10000')} until={T('compré') - 0.05} a="10.000 €" b="POR MINUTO" size={150} color="#7BF59A" />
      <VBig t={t} at={T('pero')} until={T('cada', 2) - 0.05} a="PERO…" size={170} />
      <VBig t={t} at={T('todos')} until={T('ya') - 0.05} a="LOS OIGO" b="A TODOS" size={150} color2="#FF2D55" />
      <VBig t={t} at={T('ya')} until={T('solo') - 0.05} a="NO PUEDO" b="DORMIR" size={150} />
      <VBig t={t} at={T('así')} a="NO ESCRIBAS" b="«LEO» AQUÍ 👇" size={125} color2="#FF2D55" />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const NombreThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="red" cam={kbV(0, 1.4, 1.4, 1)} bg={<CityNight />} mid={<LeoSwarm t={1} n={50} red />} hero={<Hero x={960} y={GY + 30} s={1.6} t={1} pose={POSES.headHold} eyes="scared" mouth="open" />} /></V>
      <VBig t={1} at={0} a="DICEN MI NOMBRE" b="= +1 €" size={120} y={180} />
    </AbsoluteFill>
  );
};
