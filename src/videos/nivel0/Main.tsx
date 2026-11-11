import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS, W as VW, H as VH} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, FutureFX, Flash, CF, kb, ramp, easeOut, pop, rnd, GY, LW} from '../futuro/kit';
import {Hero, NPC, POSES, CityNight, Room, LibTable, Alley} from '../futuro/props';
import {Classroom, Desk, Yard, Street, Car, Crowd} from '../largo1/props';
import words from './words.json';

export const DURATION_S = 63.5;
const T = makeT(words as any);
const RED = '#C1121F', LEO = '#F4A261', GOLD = '#E9C46A';

// marco vertical: la escena apaisada se escala para llenar 1080x1920, centrada en fx
const V: React.FC<{fx?: number; children: React.ReactNode}> = ({fx = 960, children}) => {
  const s = VH / 1080;
  const left = Math.min(0, Math.max(VW - LW * s, VW / 2 - fx * s));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0B0A1A'}}>
      <div style={{position: 'absolute', left, top: 0, width: LW, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>{children}</div>
    </AbsoluteFill>
  );
};

// numero de nivel sobre la cabeza
const Lvl: React.FC<{x: number; y?: number; s?: number; n: number | string; t: number; dim?: boolean}> = ({x, y = GY, s = 1.1, n, t, dim}) => {
  const v = typeof n === 'number' ? n : 0;
  const col = n === 0 || n === '0' ? '#9AA0A6' : v >= 90 ? '#FF3B5C' : v >= 60 ? '#FFD23F' : '#7CF4FF';
  return (
    <g transform={`translate(${x} ${y - 470 * s + Math.sin(t * 2 + x) * 6})`} opacity={dim ? 0.55 : 1}>
      <text textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={92 * s} fill="none" stroke={col} strokeWidth={16} opacity={0.35} filter="url(#blurGlow)">{n}</text>
      <text textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={92 * s} fill={col} stroke="#0B0A1A" strokeWidth={4} paintOrder="stroke">{n}</text>
    </g>
  );
};
const Villain: React.FC<{x: number; t: number; s?: number; pose?: any; eyes?: any; mouth?: any; n?: number | string; flip?: boolean}> = ({x, t, s = 1.5, pose = POSES.fists, eyes = 'evil', mouth = 'grin', n = 99, flip = true}) => (
  <g>
    <circle cx={x} cy={GY - 220 * s} r={260 * s} fill="#FF2244" opacity={typeof n === 'number' ? (n / 99) * (0.18 + 0.06 * Math.sin(t * 8)) : 0} filter="url(#blurGlow)" />
    <NPC x={x} s={s} t={t} color={RED} pose={pose} eyes={eyes} mouth={mouth} flip={flip} />
    <Lvl x={x} s={s} n={n} t={t} />
  </g>
);
const Big: React.FC<{t: number; at: number; until?: number; a: string; b?: string; y?: number; size?: number; color?: string; color2?: string}> = ({t, at, until = 1e9, a, b, y = 170, size = 120, color = '#fff', color2 = '#FFD23F'}) => {
  if (t < at || t > until) return null;
  const k = easeOut(ramp(t, at, at + 0.15)) * (until < 1e9 ? 1 - ramp(t, until - 0.12, until) : 1);
  return (
    <div style={{position: 'absolute', left: 40, width: VW - 80, top: y, textAlign: 'center', opacity: k, transform: `scale(${1.15 - 0.15 * k})`, fontFamily: CF, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: -2, textShadow: '0 6px 34px rgba(0,0,0,0.85)'}}>
      <div style={{color}}>{a}</div>
      {b && <div style={{color: color2}}>{b}</div>}
    </div>
  );
};

// subtitulos verticales limpios
const groups: any[][] = [];
{
  let cur: any[] = [];
  (words as any[]).forEach((w, i, all) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= 3 || (prev && (w.start_ms - prev.end_ms > 300 || /[.,:!?…]$/.test(prev.text)))) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (i === all.length - 1) groups.push(cur);
  });
}
const KEY = /\d|cero|nivel|poder|nadie|99/i;
const Caps: React.FC<{t: number}> = ({t}) => {
  const ms = t * 1000;
  let gi = -1;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const end = i + 1 < groups.length ? Math.min(groups[i + 1][0].start_ms, g[g.length - 1].end_ms + 700) : g[g.length - 1].end_ms + 700;
    if (ms >= g[0].start_ms - 60 && ms < end) gi = i;
  }
  if (gi < 0) return null;
  const g = groups[gi];
  return (
    <div style={{position: 'absolute', left: 60, width: VW - 120, top: 1360, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px', transform: `scale(${0.92 + 0.08 * pop(t, g[0].start_ms / 1000 - 0.06, 12, 260)})`}}>
      {g.map((w, i) => {
        const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
        return <span key={i} style={{fontFamily: CF, fontWeight: 900, fontSize: 84, lineHeight: 1.1, textTransform: 'uppercase', color: active ? (KEY.test(w.text) ? '#FF5C7A' : '#FFD23F') : ms >= w.start_ms ? '#fff' : 'rgba(255,255,255,0.55)', textShadow: '0 5px 22px rgba(0,0,0,0.95), 0 0 4px #000', display: 'inline-block', transform: `scale(${active ? 1 + 0.1 * pop(t, w.start_ms / 1000, 8, 300) : 1})`}}>{w.text}</span>;
      })}
    </div>
  );
};

const people = (t: number, ns: (number | string)[], y = GY, s = 0.9) => ns.map((n, i) => {
  const x = 700 + i * (520 / Math.max(1, ns.length - 1));
  return <g key={i}><NPC x={x} y={y} s={s} t={t} color={['#2A9D8F', LEO, '#8D99AE', '#E76F51', '#6A4C93', '#457B9D'][i % 6]} flip={i % 2 === 1} /><Lvl x={x} y={y} s={s} n={n} t={t} /></g>;
});

const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540, dx = 0) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy, dx);
type Shot = [number, (lt: number, t: number) => React.ReactNode];
const pick = (t: number, list: Shot[]) => {
  let idx = 0;
  for (let i = 0; i < list.length; i++) if (t >= list[i][0]) idx = i;
  return list[idx][1](t - list[idx][0], t);
};

const punchScene = (t: number, lt: number, n: number | string, hit: boolean) => (
  <Cine t={t} mood="red" cam={{...kbV(lt, 1.5, 1.7, 0.6, 1000, 520), x: hit ? Math.sin(t * 70) * 14 : 0}} rain bg={<CityNight />} hero={<>
    <Hero x={880} s={1.0} t={t} eyes={hit ? 'normal' : 'angry'} mouth="flat" />
    <Lvl x={880} s={1.0} n={0} t={t} />
    <Villain x={1090} t={t} s={1.25} n={n} pose={hit ? POSES.push : POSES.fists} />
  </>} />
);

const SHOTS: Shot[] = [
  // gancho: avance del climax con cortes rapidos
  [0, (lt, t) => <V fx={985}>{punchScene(t, lt, 99, false)}</V>],
  [0.6, (lt, t) => <V fx={1000}>{punchScene(t, lt, 99, true)}</V>],
  [1.2, (lt, t) => <V fx={1000}>{punchScene(t, lt + 2, 50, true)}</V>],
  [1.8, (lt, t) => <V fx={1000}>{punchScene(t, lt + 2, 0, true)}</V>],
  [T('nivel'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.15, 1.0, 1.8)} bg={<Street dusk />} hero={<>{people(t, [12, 47, 71], GY, 0.85)}</>} /></V>],
  [T('profe'), (lt, t) => <V fx={1300}><Cine t={t} mood="day" cam={kbV(lt, 1.1, 1.2, 2, 1300, 500)} bg={<Classroom />} hero={<><NPC x={1300} s={1.2} t={t} color="#8D99AE" pose={POSES.point} flip /><Lvl x={1300} s={1.2} n={34} t={t} /></>} /></V>],
  [T('mejor'), (lt, t) => <V fx={960}><Cine t={t} mood="day" cam={kbV(lt, 1.1, 1.2, 2)} bg={<Yard />} hero={<><NPC x={960} s={1.2} t={t} color={LEO} pose={POSES.cheer} mouth="grin" /><Lvl x={960} s={1.2} n={61} t={t} /></>} /></V>],
  [T('chico'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.2, 1.35, 3, 960, 450)} bg={<Street />} hero={<><circle cx={960} cy={500} r={330} fill={GOLD} opacity={0.25} filter="url(#blurGlow)" /><NPC x={960} s={1.25} t={t} color={GOLD} pose={POSES.hips} mouth="grin" eyes="happy" /><Lvl x={960} s={1.25} n={88} t={t} /></>} /></V>],
  [T('yo'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.4, 1.6, 3, 960, 480)} bg={<CityNight />} hero={<><Hero x={960} s={1.25} t={t} eyes="side" /><Lvl x={960} s={1.25} n={lt > 0.9 ? 0 : '?'} t={t} /></>} /></V>],
  [T('nadie'), (lt, t) => <V fx={960}><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.1, 2)} bg={<Room />} mid={<LibTable x={960} />} hero={<><Hero x={760} s={1.0} t={t} eyes="side" /><Lvl x={760} s={1.0} n={0} t={t} dim />{[1060, 1200].map((x, i) => <g key={i}><NPC x={x} s={1.0} t={t} color={['#2A9D8F', LEO, '#E76F51'][i]} flip /><Lvl x={x} s={1.0} n={[42, 61, 37][i]} t={t} /></g>)}</>} /></V>],
  [T('nadie', 2), (lt, t) => <V fx={1500}><Cine t={t} mood="day" cam={kbV(lt, 1.1, 1.2, 2, 1500)} bg={<Yard />} hero={<><Hero x={1640} s={1.0} t={t} eyes="closed" mouth="frown" /><Lvl x={1640} s={1.0} n={0} t={t} dim /><NPC x={1360} s={0.95} t={t} color={LEO} pose={POSES.cheer} /><Lvl x={1360} s={0.95} n={72} t={t} /></>} /></V>],
  [T('era'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.3, 3, 960, 700)} bg={<CityNight />} hero={<><Hero x={960} s={0.7} t={t} /><Lvl x={960} s={0.7} n={0} t={t} /></>} /></V>],
  [T('hasta'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.3, 1.1, 1.4)} bg={<CityNight />} /></V>],
  [T('tipo'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.25, 3, 960, 400)} rain bg={<CityNight />} hero={<Villain x={960} t={t} s={1.6} pose={POSES.armsUp} flip={false} />} /></V>],
  [T('lanzaba'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.1, 2)} bg={<CityNight />} hero={<><Villain x={830} t={t} s={1.2} pose={POSES.push} flip={false} /><g transform={`translate(${1000 + lt * 250} ${620 - lt * 380}) rotate(${lt * 260})`}><Car x={0} y={0} c="#4361EE" s={1.6} /></g></>} /></V>],
  [T('los'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.1, 1.0, 3)} bg={<CityNight />} hero={<>{[0, 1, 2].map((i) => { const k = Math.min(1, Math.max(0, lt - i * 0.6) / 0.9); return <g key={i} transform={`translate(${(i - 1) * 170 + k * 320} ${-k * 700}) rotate(${k * 300} 960 ${GY - 200})`}><NPC x={960} s={0.95} t={t} color={['#457B9D', '#2A9D8F', '#6A4C93'][i]} pose={POSES.fly} /><Lvl x={960} s={0.95} n={90 + i * 3} t={t} /></g>; })}</>} /></V>],
  [T('yo', 2), (lt, t) => <V fx={760 + lt * 150}><Cine t={t} mood="night" cam={kbV(lt, 1.2, 1.3, 2)} blur={8} bg={<Alley />} hero={<><Hero x={760 + lt * 150} s={1.1} t={t} pose={POSES.scared} eyes="wide" mouth="o" sweat /><Lvl x={760 + lt * 150} s={1.1} n={0} t={t} /></>} /></V>],
  [T('pero'), (lt, t) => <V fx={975}><Cine t={t} mood="red" cam={kbV(lt, 1.2, 1.5, 3, 975, 600)} rain bg={<CityNight />} hero={<><Villain x={1110} t={t} s={1.25} pose={POSES.fists} /><NPC x={840} y={GY} s={0.7} t={t} color="#FFB703" pose={POSES.scared} eyes="wide" mouth="o" /></>} /></V>],
  [T('corrí'), (lt, t) => <V fx={700 + lt * 400}><Cine t={t} mood="night" cam={kbV(lt, 1.2, 1.3, 1)} blur={10} rain bg={<CityNight />} hero={<Hero x={700 + lt * 400} s={1.1} t={t} pose={POSES.fly} rotate={14} eyes="angry" />} /></V>],
  [T('vio') - 0.3, (lt, t) => <V fx={1100}><Cine t={t} mood="red" cam={kbV(lt, 2.0, 2.3, 2.5, 1100, 380)} rain bg={<CityNight />} hero={<Villain x={1100} t={t} s={1.3} pose={t > T('rió') ? POSES.laugh : POSES.idle} mouth={t > T('rió') ? 'open' : 'grin'} />} /></V>],
  [T('y', 1), (lt, t) => <V fx={1000}>{punchScene(t, lt, 99, lt > 0.5)}</V>],
  [T('no'), (lt, t) => <V fx={940}><Cine t={t} mood="cold" cam={kbV(lt, 2.2, 2.5, 2, 840, 400)} rain bg={<CityNight />} hero={<><Hero x={880} s={1.1} t={t} eyes="normal" mouth="flat" /><Lvl x={880} s={1.1} n={0} t={t} /><NPC x={1090} s={1.25} t={t} color={RED} pose={POSES.push} flip /></>} /></V>],
  [T('su', 2), (lt, t) => {
    const n = t < T('99', 2) ? 99 : t < T('50') ? 99 : t < T('10') ? 50 : t < T('cero', 3) ? 10 : 0;
    return <V fx={990}><Cine t={t} mood={n === 0 ? 'cold' : 'red'} cam={kbV(lt, 1.5, 1.8, 6, 1060, 420)} rain bg={<CityNight />} hero={<><Hero x={870} s={1.0} t={t} /><Villain x={1100} t={t} s={1.15} n={n} pose={n < 50 ? POSES.kneel : POSES.scared} eyes={n < 50 ? 'scared' : 'wide'} mouth="o" /></>} /></V>;
  }],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.6, 2.2, 3, 960, 420)} bg={<CityNight />} hero={<><Hero x={960} s={1.2} t={t} eyes="glow" glow /><Lvl x={960} s={1.2} n={0} t={t} /></>} /></V>],
  [T('no', 2), (lt, t) => {
    const r = ramp(t, T('nadie', 3), T('cerca') + 0.6);
    const ns = [72, 55, 90, 81, 64, 99];
    return <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 0.95, 4)} bg={<CityNight />} hero={<>
      <circle cx={960} cy={600} r={420 * r} fill="none" stroke="#9FFCFF" strokeWidth={10} opacity={0.6 * (1 - r * 0.5)} />
      {ns.map((n0, i) => { const x = [690, 790, 1130, 1230, 600, 1320][i]; const off = Math.abs(x - 960) < 420 * r; return <g key={i}><NPC x={x} s={0.7} t={t} color={['#2A9D8F', LEO, '#8D99AE', '#E76F51', '#6A4C93', GOLD][i]} eyes={off ? 'wide' : 'normal'} /><Lvl x={x} s={0.7} n={off ? 0 : n0} t={t} /></g>; })}
      <Hero x={960} s={1.0} t={t} eyes="glow" /><Lvl x={960} s={1.0} n={0} t={t} />
    </>} /></V>;
  }],
  [T('qué'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.2, 5)} bg={<CityNight />} hero={<><Hero x={880} s={1.05} t={t} pose={POSES.pointDown} eyes="happy" mouth="grin" /><Lvl x={880} s={1.05} n={0} t={t} /><g transform={`translate(1110 ${780 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const Nivel0Short: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#0B0A1A', overflow: 'hidden'}}>
      <Audio src={staticFile('nivel0/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0.6, 1.2, 1.8, T('nivel'), T('hasta'), T('y', 1) + 0.5, T('cero', 3)].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.7} />)}
      <Big t={t} at={0.03} until={T('nivel') - 0.05} a="NIVEL 0" b="VS NIVEL 99" size={140} y={1000} />
      <Big t={t} at={T('nivel')} until={T('profe') - 0.05} a="TODOS TIENEN" b="UN NIVEL" size={130} />
      <Big t={t} at={T('cero')} until={T('nadie') - 0.05} a="EL MÍO:" b="0" size={170} color2="#9AA0A6" />
      <Big t={t} at={T('único')} until={T('hasta') - 0.05} a="EL ÚNICO 0" b="DE LA CIUDAD" size={110} />
      <Big t={t} at={T('hasta')} until={T('tipo') - 0.05} a="HASTA EL" b="MARTES..." size={140} color2="#FF4D6D" />
      <Big t={t} at={T('99')} until={T('lanzaba') - 0.05} a="NIVEL 99" size={170} color="#FF3B5C" y={1050} />
      <Big t={t} at={T('nada')} until={T('su', 2) - 0.05} a="NO SENTÍ" b="NADA" size={150} />
      <Big t={t} at={T('significaba')} until={T('no', 2) - 0.05} a="MI 0 NO ERA" b="DEBILIDAD" size={120} />
      <Big t={t} at={T('nadie', 3)} until={T('qué') - 0.05} a="NADIE TIENE PODER" b="CERCA DE MÍ" size={100} color2="#9FFCFF" />
      <Big t={t} at={T('qué')} a="¿QUÉ NIVEL" b="TENDRÍAS TÚ?" size={130} />
      <FutureFX t={t} at={T('entonces')} until={T('no', 2)} label="0" />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const Nivel0Thumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={1000}>{punchScene(0.5, 3, 0, false)}</V>
      <Big t={1} at={0} a="NIVEL 0" b="VS NIVEL 99" size={170} y={160} />
    </AbsoluteFill>
  );
};
