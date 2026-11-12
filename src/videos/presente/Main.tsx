import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, POSES, CityNight} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Moon, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 51;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|pasado|luz|luna|sol|estrellas|fantasmas|cerebro|presente|retraso/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

const Sun: React.FC<{x: number; y: number; r: number; t: number; k?: number}> = ({x, y, r, t, k = 1}) => (
  <g opacity={k}>
    <circle cx={x} cy={y} r={r * 2.2} fill="#FFB703" opacity={0.18} filter="url(#blurGlow)" />
    {Array.from({length: 16}).map((_, i) => { const a = (i / 16) * Math.PI * 2 + t * 0.2; return <line key={i} x1={x + Math.cos(a) * r * 1.1} y1={y + Math.sin(a) * r * 1.1} x2={x + Math.cos(a) * r * (1.4 + 0.1 * Math.sin(t * 4 + i))} y2={y + Math.sin(a) * r * (1.4 + 0.1 * Math.sin(t * 4 + i))} stroke="#FFD166" strokeWidth={r * 0.08} strokeLinecap="round" />; })}
    <circle cx={x} cy={y} r={r} fill="#FFD23F" stroke="#F77F00" strokeWidth={r * 0.06} />
  </g>
);
const Eye: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 0 Q 0 -230 300 0 Q 0 230 -300 0 Z" fill="#F8F4EC" stroke="#111" strokeWidth={10} />
    <circle cx={Math.sin(t * 0.7) * 20} cy={0} r={120} fill="#2A6F97" stroke="#111" strokeWidth={8} />
    <circle cx={Math.sin(t * 0.7) * 20} cy={0} r={55} fill="#0B0A1A" />
    <circle cx={Math.sin(t * 0.7) * 20 + 30} cy={-35} r={20} fill="#fff" />
  </g>
);
/** pulso de luz que viaja de a hacia b */
const Beam: React.FC<{x0: number; y0: number; x1: number; y1: number; k: number; color?: string}> = ({x0, y0, x1, y1, k, color = '#FFF3B0'}) => {
  const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k;
  return (
    <g>
      <line x1={x0} y1={y0} x2={x} y2={y} stroke={color} strokeWidth={6} strokeDasharray="4 18" opacity={0.6} />
      <circle cx={x} cy={y} r={40} fill={color} opacity={0.35} filter="url(#blurGlow)" />
      <circle cx={x} cy={y} r={16} fill="#fff" />
    </g>
  );
};
const Timer: React.FC<{t: number; at: number; secs: number; speed?: number; y?: number}> = ({t, at, secs, speed = 1, y = 1500}) => {
  if (t < at) return null;
  const left = Math.max(0, secs - (t - at) * speed);
  const m = Math.floor(left / 60), s = Math.floor(left % 60);
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: '#FFD23F', WebkitTextStroke: '8px #0B0A1A', paintOrder: 'stroke'}}>{m}:{String(s).padStart(2, '0')}</div>;
};
const Film: React.FC<{t: number; y: number; speed?: number}> = ({t, y, speed = 260}) => (
  <g>
    <rect x={0} y={y - 120} width={1920} height={240} fill="#151320" />
    {Array.from({length: 12}).map((_, i) => {
      const x = ((i * 240 - t * speed) % 2880 + 2880) % 2880 - 480;
      return <g key={i}><rect x={x + 20} y={y - 90} width={200} height={180} fill={['#3D5A80', '#98C1D9', '#EE6C4D', '#293241'][i % 4]} stroke="#000" strokeWidth={4} />{[0, 1, 2, 3].map((j) => <rect key={j} x={x + 20 + j * 55} y={y - 112} width={30} height={14} rx={3} fill="#E0E0E0" />)}{[0, 1, 2, 3].map((j) => <rect key={j} x={x + 20 + j * 55} y={y + 98} width={30} height={14} rx={3} fill="#E0E0E0" />)}</g>;
    })}
  </g>
);
const Ball: React.FC<{x: number; y: number; ghost?: boolean}> = ({x, y, ghost}) => <circle cx={x} cy={y} r={45} fill={ghost ? 'none' : '#E63946'} stroke={ghost ? '#7CF4FF' : '#111'} strokeWidth={ghost ? 6 : 6} strokeDasharray={ghost ? '12 10' : undefined} />;

const SHOTS: Shot[] = [
  // gancho: el Sol desaparece, ojo, estrella que muere, cerebro con retraso
  [0, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.6, 0.6), ...shake(t, 9)}} bg={<Stars t={t} />} hero={<><Sun x={960} y={540} r={220} t={t} k={1 - ramp(lt, 0.15, 0.5)} /><circle cx={960} cy={540} r={500 * ramp(lt, 0.1, 0.5)} fill="none" stroke="#fff" strokeWidth={30 * (1 - ramp(lt, 0.1, 0.6))} /></>} /></V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.6, 1.3, 0.6)} bg={<rect width={1920} height={1080} fill="#E9D8C4" />} hero={<Eye x={960} y={540} s={1.2} t={t} />} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={{...kbV(lt, 1.2, 1.5, 0.6), ...shake(t, 5)}} bg={<Stars t={t} n={260} />} hero={<><circle cx={960} cy={540} r={40} fill="#BDE0FE" opacity={1 - ramp(lt, 0.1, 0.5)} /><circle cx={960} cy={540} r={140} fill="#BDE0FE" opacity={0.3 * (1 - ramp(lt, 0.1, 0.5))} filter="url(#blurGlow)" /></>} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.4, 1.2, 0.6)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<Film t={t} y={540} speed={900} />} /></V>],
  // pasado
  [2.4, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 2)} bg={<CityNight />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" look={-0.3} />} /></V>],
  [T('luz'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Stars t={t} />} hero={<><Moon x={960} y={250} r={140} /><Eye x={960} y={850} s={0.6} t={t} /><Beam x0={960} y0={390} x1={960} y1={800} k={(lt * 0.8) % 1} /></>} /></V>],
  [T('luna'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Stars t={t} />} hero={<><Earth x={960} y={880} r={170} t={t} /><Moon x={960} y={220} r={90} /><Beam x0={960} y0={310} x1={960} y1={710} k={Math.min(1, lt / 1.3)} /></>} /></V>],
  [T('sol'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.15, 3)} bg={<Stars t={t} />} hero={<><Sun x={960} y={330} r={130} t={t} /><Earth x={960} y={900} r={110} t={t} /><Beam x0={960} y0={470} x1={960} y1={790} k={Math.min(1, lt / 2.6)} /></>} /></V>],
  [T('si'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Stars t={t} />} hero={<><Sun x={960} y={330} r={130} t={t} k={1 - ramp(lt, 0.4, 0.8)} /><circle cx={960} cy={330} r={130 + 500 * ramp(lt, 0.4, 1.2)} fill="none" stroke="#fff" strokeWidth={20 * (1 - ramp(lt, 0.4, 1.4))} /><Earth x={960} y={900} r={110} t={t} /><Beam x0={960} y0={470} x1={960} y1={790} k={Math.min(1, ramp(lt, 0.8, 6))} color="#FFD166" /></>} /></V>],
  [T('con'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 6)} bg={<Stars t={t} n={300} />} hero={<>{Array.from({length: 9}).map((_, i) => { const x = 620 + rnd(i) * 680, y = 220 + rnd(i + 4) * 640, dead = i % 3 === 0 && t > T('apagadas') - 0.3 + i * 0.1; return <g key={i}><circle cx={x} cy={y} r={60} fill="#BDE0FE" opacity={dead ? 0.03 : 0.25} filter="url(#blurGlow)" /><path d={`M ${x} ${y - 30} L ${x + 8} ${y - 8} L ${x + 30} ${y} L ${x + 8} ${y + 8} L ${x} ${y + 30} L ${x - 8} ${y + 8} L ${x - 30} ${y} L ${x - 8} ${y - 8} Z`} fill={dead ? '#444' : '#fff'} opacity={dead ? 0.4 : 1} /></g>; })}</>} /></V>],
  [T('estás', 2), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.1, 1.3, 2)} bg={<Stars t={t} n={200} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" look={-0.4} />} /></V>],
  [T('pero'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.9, 2.8, 960, 330)} bg={<CityNight />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="side" />} /></V>],
  [T('cerebro'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 4)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<><Eye x={600} y={540} s={0.45} t={t} />{Array.from({length: 6}).map((_, i) => <Beam key={i} x0={760} y0={540} x1={1250} y1={540} k={((lt * 0.7 + i / 6) % 1)} color="#7CF4FF" />)}<g transform="translate(1380 540)"><ellipse rx={150} ry={115} fill="#F4A7B9" stroke="#111" strokeWidth={8} />{[-80, -30, 20, 70].map((x) => <path key={x} d={`M ${x} -100 q 30 50 0 100 q -30 50 0 100`} stroke="#C9184A" strokeWidth={6} fill="none" opacity={0.6} />)}</g></>} /></V>],
  [T('así'), (lt, t) => { const bx = 300 + ((lt * 500) % 1400); return <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.15, 4)} bg={<rect width={1920} height={1080} fill="#8EC5E8" />} hero={<><rect y={GY} width={1920} height={200} fill="#6FA35A" /><Ball x={bx} y={GY - 300 - Math.sin(bx / 230) * 120} ghost /><Ball x={bx - 90} y={GY - 300 - Math.sin((bx - 90) / 230) * 120} /></>} /></V>; }],
  [T('película'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 4)} bg={<rect width={1920} height={1080} fill="#151320" />} hero={<><Film t={t} y={330} /><Hero x={960} y={GY + 40} s={1.3} t={t} eyes="wide" /></>} /></V>],
  [T('nunca'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.35, 4, 960, 400)} bg={<Stars t={t} n={120} />} hero={<Hero x={960} y={GY + 20} s={1.6} t={t} eyes="wide" look={0.2} />} /></V>],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 6)} bg={<Stars t={t} />} hero={<><Sun x={960} y={330} r={130} t={t} k={0.4 + 0.6 * Math.abs(Math.sin(t * 2))} /><Earth x={960} y={900} r={110} t={t} /><text x={960} y={560} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={200} fill="#fff" opacity={0.85}>?</text></>} /></V>],
];

export const PresenteShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('presente/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, 2.4, T('sol'), T('si'), T('pero'), T('nunca')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
      <VBig t={t} at={0.03} until={2.35} a="ESTÁS VIENDO" b="EL PASADO" size={130} />
      <VBig t={t} at={T('luna')} until={T('sol') - 0.05} a="LUNA" b="HACE 1 SEGUNDO" size={130} color2="#7CF4FF" />
      <VBig t={t} at={T('sol')} until={T('si') - 0.05} a="SOL" b="HACE 8 MINUTOS" size={130} />
      {t < T('con') && <Timer t={t} at={T('si') + 0.8} secs={480} speed={80} y={1640} />}
      <VBig t={t} at={T('algunas')} until={T('estás', 2) - 0.05} a="SIGLOS" b="APAGADAS" size={150} color2="#7CF4FF" />
      <VBig t={t} at={T('80')} until={T('así') - 0.05} a="0,08 S" b="DE RETRASO" size={150} color2="#FF4D6D" />
      <VBig t={t} at={T('ya')} until={T('película') - 0.05} a="YA HA" b="PASADO" size={160} />
      <VBig t={t} at={T('presente')} until={T('entonces') - 0.05} a="NUNCA HAS VISTO" b="EL PRESENTE" size={115} color2="#FF4D6D" />
      <VBig t={t} at={T('qué')} a="¿QUÉ PASA" b="AHORA MISMO?" size={120} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const PresenteThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}><Cine t={1} mood="cold" cam={kbV(0, 1.5, 1.5, 1)} bg={<rect width={1920} height={1080} fill="#E9D8C4" />} hero={<Eye x={960} y={540} s={1.2} t={1} />} /></V>
      <VBig t={1} at={0} a="NUNCA HAS VISTO" b="EL PRESENTE" size={120} y={180} />
    </AbsoluteFill>
  );
};
