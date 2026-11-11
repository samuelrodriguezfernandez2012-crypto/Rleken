import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LW, LH, GY, Cine, CText, DayTag, Flash, shots, kb, ramp, easeOut, rnd, pop, CF} from '../futuro/kit';
import {Hero, NPC, POSES, Suit, CityNight, Room, Door, Screen, PhoneV, School} from '../futuro/props';
import {Kitchen, Table, Bedroom, Street, Car, Crowd, Yard, Cat} from '../largo1/props';
import {Hallway, Office, Egg, Bus, Bridge, Sign, Drawing, Cake, HospitalRoom, Well, Fence, Lamp} from './props';
import wordsJson from './words.json';
import startsJson from '../../../assets/fuerte/starts.json';

type Wd = {text: string; start_ms: number; end_ms: number};
export const WORDS = wordsJson as Wd[];
export const STARTS = (startsJson as {start: number}[]).map((s) => s.start);
export const TOTAL = WORDS[WORDS.length - 1].end_ms / 1000;
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
const BY: Wd[][] = STARTS.map(() => []);
WORDS.forEach((w) => { let c = 0; STARTS.forEach((s, i) => { if (w.start_ms / 1000 >= s - 0.3) c = i; }); BY[c].push(w); });
const W = (c: number, word: string, n = 1): number => {
  const k = norm(word);
  let i = 0;
  for (const w of BY[c]) if (norm(w.text) === k && ++i === n) return w.start_ms / 1000;
  throw new Error(`palabra no encontrada: ${c} ${word} ${n}`);
};
const CS = (c: number) => STARTS[c];

type F = React.FC<{t: number}>;
const MOM = '#E07A5F', MARCOS = '#E76F51', LADY = '#B5838D', FIRE = '#D62828', DIR = '#6C757D', GIRL = '#FFB703';

const Say: React.FC<{t: number; at: number; until?: number; text: string; x: number; y: number; w?: number}> = ({t, at, until = 1e9, text, x, y, w = 520}) => {
  if (t < at || t > until) return null;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translate(0,-100%) scale(${pop(t, at, 12, 260)})`, transformOrigin: '50% 100%'}}>
      <div style={{background: 'rgba(255,255,255,0.95)', borderRadius: 26, padding: '20px 28px', fontFamily: CF, fontWeight: 800, fontSize: 40, color: '#14121F', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>{text}</div>
      <div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '22px solid rgba(255,255,255,0.95)'}} />
    </div>
  );
};
const shakeCam = (t: number, a: number, k = 12) => ({x: Math.sin(t * 55) * k * a, y: Math.cos(t * 47) * k * a * 0.6});

// ---------- 0: el puente (gancho) ----------
const holdBridge = (t: number, cam: any, strain = 1, kids = 0) => (
  <Cine t={t} mood="night" cam={cam} rain bg={<Bridge t={t} crack={1} bus={false} />} hero={<>
    <g transform={`translate(0 ${Math.sin(t * 30) * 2 * strain})`}>
      <rect x={960} y={500} width={980} height={70} fill="#7D7F8C" stroke="#111" strokeWidth={6} />
      <Bus x={1250} y={502} s={0.75} />
    </g>
    <Hero x={1030} y={900} s={1.1} t={t} pose={POSES.armsUp} eyes={strain > 0.5 ? 'closed' : 'angry'} mouth="teeth" sweat />
    {Array.from({length: kids}).map((_, i) => <NPC key={i} x={1500 - i * 50} y={500} s={0.35} t={t} color={['#FFB703', '#4CC9F0', '#F72585'][i % 3]} />)}
  </>} />
);
export const Ch0: F = ({t}) => {
  const c = 0;
  return (
    <AbsoluteFill>
      {shots(t, [
        [0, (lt) => holdBridge(t, {...kb(lt, 1.5, 1.2, 3, 1100, 600), ...shakeCam(t, 1 - Math.min(1, lt / 2), 10)})],
        [W(c, 'debajo'), (lt) => holdBridge(t, kb(lt, 2.2, 2.4, 3, 1250, 450))],
        [W(c, 'si'), (lt) => holdBridge(t, kb(lt, 2.6, 2.9, 3, 1030, 560))],
        [W(c, 'si', 2), (lt) => holdBridge(t, {...kb(lt, 1.1, 1.0, 3), ...shakeCam(t, 0.5)})],
        [W(c, 'hace'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.4, 1.8, 4, 968, 520)} bg={<Hallway graffiti="monstruo" />} />],
        [W(c, 'hoy'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.1, 4)} bg={<Bridge t={t} crack={1} bus={false} />} hero={<Crowd t={t} n={14} />} />],
        [W(c, 'todo'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.1, 1.3, 5)} bg={<Bedroom night={false} />} hero={<Hero x={900} y={760} s={1.1} t={t} rotate={-90} eyes="closed" />} />],
        [W(c, '100'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.8, 2.4, 4, 960, 420)} bg={<Bedroom night={false} />} hero={<Hero x={960} s={1.2} t={t} eyes="glow" glow pose={POSES.fists} />} />],
        [W(c, 'juro'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.3, 1.5, 4, 960, 450)} bg={<Bedroom night={false} />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.headHold} eyes="side" mouth="frown" />} />],
      ])}
      <CText t={t} at={0.05} until={W(c, 'debajo') - 0.05} a="4.000 TONELADAS" size={130} y={100} />
      <CText t={t} at={W(c, 'debajo')} until={W(c, 'si') - 0.05} a="32 NIÑOS" b="DENTRO" size={130} y={100} color2="#FF4D6D" />
      <CText t={t} at={W(c, 'hace')} until={W(c, 'hoy') - 0.05} a="HACE UN MES..." size={120} y={100} />
      <CText t={t} at={W(c, '100')} until={W(c, 'juro') - 0.05} a="100 VECES" b="MÁS FUERTE" size={150} y={100} />
      <CText t={t} at={W(c, 'peor')} a="LO PEOR QUE" b="ME HA PASADO" size={120} y={100} color2="#FF4D6D" />
      <Flash t={t} at={0} dur={0.25} max={0.8} />
      {[W(c, 'debajo'), W(c, 'si'), W(c, 'si', 2), W(c, 'hace')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.5} />)}
    </AbsoluteFill>
  );
};

// ---------- 1: todo se rompe ----------
const Clock: React.FC<{x: number; y: number; broken?: number}> = ({x, y, broken = 0}) => broken > 0 ? (
  <g>{Array.from({length: 8}).map((_, i) => <rect key={i} x={x + (rnd(i) - 0.5) * 260 * broken} y={y + rnd(i + 3) * 200 * broken} width={24} height={16} fill={i % 2 ? '#E63946' : '#ddd'} stroke="#111" strokeWidth={3} transform={`rotate(${rnd(i + 5) * 360} ${x} ${y})`} />)}</g>
) : (
  <g transform={`translate(${x} ${y})`}><rect x={-60} y={-50} width={120} height={80} rx={14} fill="#E63946" stroke="#111" strokeWidth={5} /><text textAnchor="middle" y={4} fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#fff">7:00</text></g>
);
export const Ch1: F = ({t}) => {
  const c = 1;
  const hit = W(c, 'golpecito') + 0.5;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.4, 1.6, 3, 1100, 600)} bg={<Bedroom night={false} />} mid={t < hit ? <rect x={1080} y={640} width={200} height={260} fill="#8B5A3C" stroke="#111" strokeWidth={6} /> : <path d="M 1080 900 L 1120 760 L 1180 880 L 1240 720 L 1280 900 Z" fill="#8B5A3C" stroke="#111" strokeWidth={6} />} hero={<><Clock x={1180} y={620} broken={t > hit ? Math.min(1, (t - hit) * 2) : 0} /><Hero x={850} y={760} s={1.1} t={t} rotate={t > hit ? 0 : -90} pose={t > hit ? POSES.scared : POSES.idle} eyes={t > hit ? 'wide' : 'closed'} mouth={t > hit ? 'o' : 'flat'} /></>} />],
        [W(c, 'madre'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.2, 4)} bg={<Bedroom night={false} />} mid={<Door x={1450} open={t > W(c, 'luego') ? 1 : 0} />} hero={<><Hero x={1250} s={1.1} t={t} pose={POSES.reach} eyes="wide" />{t > W(c, 'pomo') && t < W(c, 'luego') && <circle cx={1350} cy={GY - 1.1 * 190} r={16} fill="#FFD23F" stroke="#111" strokeWidth={4} />}{t > W(c, 'luego') && <rect x={1290} y={360} width={220} height={540} fill="#8B5A3C" stroke="#111" strokeWidth={6} transform="rotate(-8 1400 900)" />}<NPC x={1700} s={1.1} t={t} color={MOM} flip pose={POSES.scared} eyes="wide" mouth="o" /></>} />],
        [W(c, 'desayuno'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.6, 1.9, 4, 960, 650)} bg={<Kitchen />} mid={<Table x={960} />} hero={<><Hero x={800} s={1.1} t={t} eyes="wide" /><path d={`M 900 690 q 40 ${-20 - 60 * Math.min(1, lt)} 80 -40`} stroke="#BBB" strokeWidth={10} fill="none" strokeLinecap="round" /></>} />],
        [W(c, 'vaso'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 2.2, 2.5, 3, 960, 560)} bg={<Kitchen />} mid={<Table x={960} />} hero={<><Hero x={880} s={1.1} t={t} eyes="wide" mouth="o" pose={POSES.reach} />{lt < 0.6 ? <rect x={990} y={600} width={50} height={80} fill="#9ED8FF" stroke="#111" strokeWidth={4} opacity={0.8} /> : Array.from({length: 10}).map((_, i) => <path key={i} transform={`translate(${1010 + (rnd(i) - 0.5) * 300 * Math.min(1, lt - 0.6)} ${640 + (rnd(i + 2) - 0.5) * 240 * Math.min(1, lt - 0.6)})`} d="M 0 -10 L 10 0 L 0 10 L -8 2 Z" fill="#CFE8FF" stroke="#111" strokeWidth={2} />)}</>} />],
        [W(c, 'mire'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.4, 2.8, 5, 960, 520)} bg={<Kitchen />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.hands} eyes="side" />} />],
        [W(c, 'madre', 2), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.2, 1.35, 5)} bg={<Kitchen />} hero={<><Hero x={700} s={1.1} t={t} eyes="side" mouth="frown" /><NPC x={1250} s={1.1} t={t} color={MOM} flip pose={POSES.hips} /></>} />],
        [W(c, 'yo'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.5, 1.9, 6, 960, 450)} bg={<Room night />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.kneel} eyes="closed" mouth="frown" />} />],
      ])}
      <Say t={t} at={W(c, 'dijo')} until={W(c, 'yo') - 0.05} text="No toques nada." x={1250} y={330} w={420} />
      <CText t={t} at={W(c, 'pero')} until={W(c, 'madre', 2) - 0.05} a="TODO LO QUE TOCABA" b="SE ROMPÍA" size={110} y={100} color2="#FF4D6D" />
      <CText t={t} at={W(c, 'personas')} a="HACER DAÑO" b="A LAS PERSONAS" size={120} y={100} color2="#FF4D6D" />
      <Flash t={t} at={hit} dur={0.25} max={0.7} />
    </AbsoluteFill>
  );
};

// ---------- 2: Marcos y el monstruo ----------
export const Ch2: F = ({t}) => {
  const c = 2;
  const push = W(c, 'empujo'), bounce = W(c, 'reboto');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.15, 5)} bg={<Hallway />} hero={<><Hero x={850} s={1.1} t={t} /><NPC x={1150 - Math.min(1, ramp(t, push, push + 0.4)) * 120} s={1.2} t={t} color={MARCOS} flip pose={t > push ? POSES.push : POSES.hips} eyes="angry" mouth="grin" /></>} />],
        [W(c, 'primera'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.5, 1.7, 3, 960, 520)} bg={<Hallway />} hero={<><Hero x={850} s={1.1} t={t} eyes="normal" /><NPC x={1040 + easeOut(ramp(t, bounce, bounce + 0.4)) * 450} s={1.2} t={t} color={MARCOS} flip pose={t > bounce ? POSES.scared : POSES.push} eyes="wide" mouth="o" rotate={t > bounce ? 20 : 0} /></>} />],
        [W(c, 'todos'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 4)} bg={<Hallway />} hero={<><Crowd t={t} cheer n={12} /><Hero x={760} s={1.1} t={t} eyes="happy" mouth="grin" /><NPC x={1500} s={1.2} y={GY} t={t} color={MARCOS} pose={POSES.kneel} eyes="closed" /></>} />],
        [W(c, 'luego'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.8, 2.1, 4, 1150, 600)} bg={<Hallway />} hero={<><Hero x={1000} s={1.1} t={t} pose={POSES.reach} /><NPC x={1300} s={1.2} t={t} color={MARCOS} flip pose={POSES.reach} eyes={t > W(c, 'oi') ? 'wide' : 'normal'} mouth={t > W(c, 'oi') ? 'open' : 'flat'} /></>} />],
        [W(c, 'oi'), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 2.4, 2.6, 2, 1300, 420), ...shakeCam(t, 1 - Math.min(1, lt), 8)}} bg={<Hallway />} hero={<NPC x={1300} s={1.2} t={t} color={MARCOS} flip pose={POSES.headHold} eyes="closed" mouth="open" />} />],
        [W(c, 'director'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.15, 6)} bg={<Office />} hero={<><Hero x={700} s={1.0} t={t} eyes="side" mouth="frown" /><NPC x={960} s={1.15} t={t} color={DIR} pose={POSES.point} flip /><NPC x={1350} s={1.15} t={t} color={MOM} flip pose={POSES.headHold} /><NPC x={1550} s={1.2} t={t} color="#264653" flip /></>} />],
        [W(c, 'pasillo', 2), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.2, 4)} bg={<Hallway />} hero={<>{[300, 500, 1400, 1650].map((x, i) => <NPC key={i} x={x} s={1.05} t={t} color={['#2A9D8F', '#8D99AE', '#6A4C93', '#457B9D'][i]} flip={x > 960} eyes="wide" mouth="o" pose={POSES.scared} />)}<Hero x={960} s={1.1} t={t} eyes="side" /></>} />],
        [W(c, 'tarde'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.6, 2.4, 5, 968, 520)} bg={<Hallway graffiti="monstruo" />} />],
      ])}
      <CText t={t} at={W(c, 'primera')} until={W(c, 'todos') - 0.05} a="NO ME MOVÍ" size={150} y={100} />
      <CText t={t} at={W(c, 'roto')} until={W(c, 'director') - 0.05} a="2 DEDOS ROTOS" size={140} y={100} color="#FF4D6D" />
      <CText t={t} at={W(c, 'monstruo')} a="MONSTRUO" size={190} y={110} color="#FF2D2D" />
      <Flash t={t} at={bounce} dur={0.2} max={0.6} />
    </AbsoluteFill>
  );
};

// ---------- 3: las cuentas ----------
export const Ch3: F = ({t}) => {
  const c = 3;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.4, 5)} bg={<Room night />} hero={<><Hero x={960} s={1.1} t={t} pose={POSES.point} /><Screen x={1450} y={380} s={0.5} glow="#4CC9F0"><text textAnchor="middle" y={30} fontFamily="Montserrat" fontWeight={900} fontSize={120} fill="#fff">×100</text></Screen></>} />],
        [W(c, 'coche'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.15, 5)} bg={<Street dusk />} hero={<><Hero x={960} s={1.1} t={t} pose={POSES.armsUp} eyes="angry" />{Array.from({length: Math.min(4, 1 + Math.floor(lt * 1.5))}).map((_, i) => <Car key={i} x={960} y={GY - 1.1 * 420 - i * 120} c={['#4361EE', '#E63946', '#2A9D8F', '#FFB703'][i]} s={1.1} />)}</>} />],
        [W(c, 'persona', 2), (lt) => {
          const k = easeOut(Math.min(1, lt / 1.6));
          return <Cine t={t} mood="dusk" cam={kb(lt, 1.0, 1.1, 4, 960, 400)} bg={<Street dusk />} hero={<Hero x={600 + k * 700} y={GY - Math.sin(k * Math.PI) * 650 - (k > 0.9 ? 300 * (k - 0.9) * 10 : 0)} s={1.0} t={t} pose={POSES.fly} rotate={k < 1 ? -10 : 0} />} />;
        }],
        [W(c, 'corri'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.2, 1.3, 2)} blur={12} bg={<Yard track />} hero={<><Hero x={400 + Math.min(1, lt / 0.6) * 1100} s={1.1} t={t} pose={POSES.fly} rotate={20} eyes="angry" />{lt > 0.6 && Array.from({length: 5}).map((_, i) => <circle key={i} cx={1500 + i * 20} cy={GY - 20 - ((lt * 80 + i * 30) % 120)} r={20 + i * 6} fill="#999" opacity={0.4} />)}</>} />],
        [W(c, 'increible'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.6, 2.0, 5, 960, 450)} bg={<CityNight />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.hands} eyes="wide" mouth="o" />} />],
        [W(c, 'asi'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.2, 1.5, 6, 960, 650)} bg={<Kitchen />} mid={<Table x={960} />} hero={<>{Array.from({length: 18}).map((_, i) => <Egg key={i} x={760 + (i % 9) * 50} y={700 - Math.floor(i / 9) * 50} s={0.8} />)}<Hero x={600} s={1.1} t={t} pose={POSES.point} eyes="angry" /></>} />],
      ])}
      <CText t={t} at={W(c, 'persona')} until={W(c, 'yo') - 0.05} a="NORMAL: 100 KG" size={120} y={100} />
      <CText t={t} at={W(c, 'yo')} until={W(c, 'coche') - 0.05} a="YO: 10.000 KG" size={130} y={100} color="#FFD23F" />
      <CText t={t} at={W(c, 'podia')} until={W(c, 'persona', 2) - 0.05} a="10 COCHES" b="A LA VEZ" size={130} y={100} />
      <CText t={t} at={W(c, 'salte')} until={W(c, 'corri') - 0.05} a="SALTO: 50 M" size={140} y={100} />
      <CText t={t} at={W(c, 'corri')} until={W(c, 'increible') - 0.05} a="100 M" b="EN MENOS DE 1 S" size={130} y={100} />
      <CText t={t} at={W(c, 'problema', 2)} until={W(c, 'asi') - 0.05} a="NO SABÍA" b="CONTROLARLA" size={120} y={100} color2="#FF4D6D" />
      <CText t={t} at={W(c, 'compre')} a="400 HUEVOS" size={160} y={100} />
    </AbsoluteFill>
  );
};

// ---------- 4: los huevos ----------
export const Ch4: F = ({t}) => {
  const c = 4;
  const d = [W(c, 'dia'), W(c, 'dia', 2), W(c, 'dia', 3), W(c, 'dia', 4)];
  const broken = t < d[1] ? 398 : t < d[2] ? 200 : 0;
  const eggTable = (lt: number, ok: boolean) => <Cine t={t} mood="day" cam={kb(lt, 1.7, 2.0, 4, 960, 640)} bg={<Kitchen />} mid={<Table x={960} />} hero={<>{Array.from({length: 12}).map((_, i) => <Egg key={i} x={780 + (i % 6) * 70} y={700 - Math.floor(i / 6) * 40} s={0.8} broken={!ok || i % 3 !== 0} />)}<Hero x={1000} s={1.1} t={t} pose={POSES.reach} eyes={ok ? 'happy' : 'angry'} />{ok && <Egg x={1080} y={GY - 1.1 * 190} s={1.0} />}</>} />;
  return (
    <AbsoluteFill>
      {shots(t, [
        [d[0], (lt) => eggTable(lt, false)],
        [d[1], (lt) => eggTable(lt, false)],
        [W(c, 'aprendi'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 2.2, 2.6, 6, 960, 420)} bg={<Kitchen />} hero={<Hero x={960} s={1.2} t={t} eyes="closed" />} />],
        [d[2], (lt) => eggTable(lt, true)],
        [W(c, 'llore'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 2.4, 2.7, 3, 960, 420)} bg={<Kitchen />} hero={<><Hero x={960} s={1.2} t={t} eyes="happy" mouth="grin" /><circle cx={930} cy={GY - 1.2 * 290 + (lt * 40) % 60} r={7} fill="#9ED8FF" /></>} />],
        [d[3], (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.4, 1.7, 7, 960, 500)} bg={<Kitchen />} hero={<><Hero x={900} s={1.15} t={t} pose={POSES.reach} eyes="happy" /><NPC x={1040} s={1.1} t={t} color={MOM} flip pose={POSES.reach} eyes="happy" /></>} />],
        [W(c, 'pero'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.15, 4)} bg={<Street />} hero={<><Hero x={960} s={1.1} t={t} eyes="side" />{[400, 1500].map((x, i) => <NPC key={i} x={x} s={1.05} t={t} color={['#2A9D8F', '#8D99AE'][i]} flip={x > 960} pose={POSES.scared} eyes="wide" />)}</>} />],
        [W(c, 'alguien'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.25, 4)} bg={<Street />} hero={<><Hero x={900} s={1.1} t={t} pose={POSES.armsUp} /><Car x={900} y={GY - 1.1 * 420} c="#4361EE" s={1.2} /><Cat x={1050} y={GY - 10} /></>} />],
        [W(c, 'titulo'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.4, 6, 960, 520)} bg={<Room night />} hero={<PhoneV x={960} y={540} s={1.2} t={t} views={Math.floor(easeOut(Math.min(1, lt / 2)) * 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} />} />],
      ])}
      <DayTag t={t} at={d[0]} text="DÍA 1" />
      <CText t={t} at={d[0] + 0.4} until={W(c, 'aprendi') - 0.05} a={`${broken} ROTOS`} size={150} y={100} color="#FF4D6D" />
      <DayTag t={t} at={d[2]} text="DÍA 10" />
      <CText t={t} at={d[2] + 0.5} until={W(c, 'llore') - 0.05} a="0 ROTOS" size={160} y={100} color="#7CF4FF" />
      <DayTag t={t} at={d[3]} text="DÍA 12" />
      <CText t={t} at={W(c, 'titulo')} until={W(c, 'comentarios') - 0.05} a="«CHICO PELIGROSO»" size={110} y={100} color="#FF4D6D" />
      <CText t={t} at={W(c, 'comentarios')} a="QUE ME" b="ENCERRARAN" size={130} y={100} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------- 5: la madre ----------
export const Ch5: F = ({t}) => {
  const c = 5;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.3, 6, 960, 480)} bg={<Room night />} hero={<Screen x={960} y={460} s={1.1} glow="#E63946"><rect x={-390} y={150} width={780} height={70} fill="#E63946" /><text textAnchor="middle" y={200} fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">ÚLTIMA HORA: ¿UNA AMENAZA?</text><circle cx={0} cy={-40} r={60} fill="#111" /><path d="M -90 110 Q -90 30 0 30 Q 90 30 90 110 Z" fill="#2D6CDF" /></Screen>} />],
        [W(c, 'vecinos'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.1, 4)} bg={<Street />} hero={<><Hero x={800} s={1.05} t={t} pose={POSES.wave} /><NPC x={1250} s={1.05} t={t} color="#8D99AE" flip={false} pose={POSES.idle} /></>} />],
        [W(c, 'madre'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.6, 1.9, 4, 960, 450)} bg={<Kitchen night />} hero={<NPC x={960} s={1.15} t={t} color={MOM} pose={POSES.headHold} eyes="closed" mouth="frown" />} />],
        [W(c, 'noche'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.15, 5)} rain bg={<Street dusk />} hero={<><Suit x={1300} t={t} flip /><Suit x={1550} t={t} flip /><Door x={800} open={1} /></>} />],
        [W(c, 'madre', 2), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.4, 6, 960, 520)} rain bg={<Street dusk />} hero={<><Door x={700} open={1} /><Hero x={600} s={1.0} t={t} eyes="wide" /><NPC x={880} s={1.05} t={t} color={MOM} pose={POSES.hands} eyes="angry" /><Suit x={1300} t={t} flip /><Suit x={1550} t={t} flip /></>} />],
        [W(c, 'fueron'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.3, 3)} rain bg={<Street dusk />} hero={<><NPC x={880} s={1.05} t={t} color={MOM} pose={POSES.hips} /><Suit x={1300 + lt * 300} t={t} /><Suit x={1550 + lt * 300} t={t} /></>} />],
        [W(c, 'esa'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.6, 2.0, 8, 960, 450)} bg={<Kitchen night />} hero={<><Hero x={820} s={1.1} t={t} eyes="happy" /><NPC x={1100} s={1.05} t={t} color={MOM} flip eyes="happy" mouth="grin" /></>} />],
      ])}
      <CText t={t} at={W(c, 'decian')} until={W(c, 'vecinos') - 0.05} a="«UNA AMENAZA»" size={130} y={100} color="#FF4D6D" />
      <CText t={t} at={W(c, 'querian')} until={W(c, 'madre', 2) - 0.05} a="UN LABORATORIO" size={130} y={100} />
      <Say t={t} at={W(c, 'dijo')} until={W(c, 'fueron') - 0.05} text="Antes tendréis que pasar por encima de mí." x={880} y={330} w={560} />
      <CText t={t} at={W(c, 'ella', 2)} a="SIN NINGÚN PODER" b="Y MÁS VALIENTE QUE YO" size={96} y={100} />
    </AbsoluteFill>
  );
};

// ---------- 6: ayudar ----------
export const Ch6: F = ({t}) => {
  const c = 6;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.4, 1.1, 6, 960, 450)} bg={<CityNight />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.fists} eyes="angry" />} />],
        [W(c, 'empujar'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 3)} bg={<Street />} hero={<><Car x={1100 + lt * 200} y={GY} c="#6C757D" s={1.5} /><Hero x={850 + lt * 200} s={1.05} t={t} pose={POSES.push} /></>} />],
        [W(c, 'subir'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.2, 4)} bg={<Street />} hero={<><NPC x={1250} s={1.0} t={t} color={LADY} hairBun flip /><Hero x={900} s={1.05} t={t} pose={POSES.armsUp} />{Array.from({length: 6}).map((_, i) => <rect key={i} x={830 + (i % 3) * 50} y={GY - 1.05 * 420 - Math.floor(i / 3) * 60} width={46} height={56} rx={6} fill="#F1E3C6" stroke="#111" strokeWidth={4} />)}</>} />],
        [W(c, 'sacar'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.2, 1.35, 4)} bg={<Yard />} hero={<><Well x={960} /><Hero x={960} y={820} s={1.0} t={t} pose={POSES.tug} /><g transform={`translate(${1120} ${800 - Math.min(1, lt / 1.5) * 120})`}><ellipse cx={0} cy={0} rx={50} ry={30} fill="#B07940" stroke="#111" strokeWidth={5} /><circle cx={44} cy={-22} r={24} fill="#B07940" stroke="#111" strokeWidth={5} /></g></>} />],
        [W(c, 'arreglar'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 4)} bg={<School />} mid={<Fence fixed={Math.min(1, lt / 2)} />} hero={<Hero x={960} s={1.05} t={t} pose={POSES.reach} />} />],
        [W(c, 'nadie'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.15, 5)} bg={<Street />} hero={<><Hero x={800} s={1.05} t={t} eyes="side" /><NPC x={1300 + lt * 120} s={1.05} t={t} color="#8D99AE" /><NPC x={1550 + lt * 120} s={1.05} t={t} color="#6A4C93" /></>} />],
        [W(c, 'pero'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.5, 3, 1100, 500)} bg={<Street />} hero={<><Hero x={850} s={1.05} t={t} eyes="happy" /><NPC x={1200} s={1.0} t={t} color={LADY} hairBun flip pose={POSES.wave} mouth="grin" eyes="happy" /></>} />],
        [W(c, 'nina'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.6, 5, 960, 560)} bg={<Street />} hero={<><Hero x={820} s={1.1} t={t} eyes="happy" /><NPC x={1100} s={0.7} t={t} color={GIRL} flip pose={POSES.reach} mouth="grin" /><Drawing x={1020} y={560} s={0.6} /></>} />],
        [W(c, 'pegue'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.6, 2.0, 6, 960, 450)} bg={<Kitchen />} hero={<><rect x={760} y={180} width={400} height={720} rx={20} fill="#E9ECEF" stroke="#111" strokeWidth={8} /><Drawing x={960} y={420} s={0.9} /></>} />],
      ])}
      <CText t={t} at={W(c, 'no')} until={W(c, 'empece') - 0.05} a="NO IBA A" b="ESCONDERME" size={130} y={100} />
      <CText t={t} at={W(c, 'nadie')} until={W(c, 'pero') - 0.05} a="NADIE ME DABA" b="LAS GRACIAS" size={120} y={100} />
      <CText t={t} at={W(c, 'era')} a="LO PRIMERO BUENO" b="EN UN MES" size={110} y={100} />
    </AbsoluteFill>
  );
};

// ---------- 7: Marcos ----------
export const Ch7: F = ({t}) => {
  const c = 7;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.25, 4)} bg={<Hallway />} hero={<><Hero x={800} s={1.05} t={t} eyes="wide" /><NPC x={1300 - Math.min(1, lt / 2) * 200} s={1.15} t={t} color={MARCOS} flip /><rect x={1300 - Math.min(1, lt / 2) * 200 - 130} y={GY - 1.15 * 200} width={40} height={30} rx={8} fill="#fff" stroke="#111" strokeWidth={3} /></>} />],
        [W(c, 'pero'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.4, 1.6, 5, 960, 560)} bg={<Room />} mid={<Table x={960} w={700} />} hero={<><Hero x={820} s={1.05} t={t} eyes="side" /><NPC x={1100} s={1.1} t={t} color={MARCOS} flip /></>} />],
        [W(c, 'dije'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.2, 2.6, 8, 820, 420)} bg={<Room />} hero={<Hero x={820} s={1.05} t={t} eyes="closed" mouth="frown" />} />],
        [W(c, 'marcos', 2), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 2.0, 2.3, 4, 1100, 420)} bg={<Room />} hero={<NPC x={1100} s={1.1} t={t} color={MARCOS} flip eyes="side" mouth="frown" />} />],
        [W(c, 'yo'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.5, 4, 960, 520)} bg={<Room />} mid={<Table x={960} w={700} />} hero={<><Hero x={820} s={1.05} t={t} pose={POSES.reach} eyes="happy" /><NPC x={1100} s={1.1} t={t} color={MARCOS} flip pose={POSES.reach} eyes="happy" /></>} />],
        [W(c, 'desde'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.15, 5)} bg={<Yard />} hero={<><Hero x={820} s={1.05} t={t} pose={POSES.laugh} eyes="happy" mouth="grin" /><NPC x={1100} s={1.1} t={t} color={MARCOS} flip pose={POSES.laugh} eyes="happy" mouth="grin" /></>} />],
        [W(c, '3'), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.1, 2), ...shakeCam(t, Math.min(1, lt * 2), 18)}} bg={<CityNight />} />],
      ])}
      <Say t={t} at={W(c, 'duele')} until={W(c, 'dije') - 0.05} text="¿Te duele?" x={1100} y={330} w={320} />
      <CText t={t} at={W(c, 'solo')} until={W(c, 'marcos', 2) - 0.05} a="ESTAR SOLO" size={150} y={100} />
      <CText t={t} at={W(c, 'perdon')} until={W(c, 'desde') - 0.05} a="PERDÓN" size={170} y={100} />
      <CText t={t} at={W(c, 'temblo')} a="LA CIUDAD" b="TEMBLÓ" size={150} y={100} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------- 8: el terremoto ----------
export const Ch8: F = ({t}) => {
  const c = 8;
  const crack = ramp(t, W(c, 'puente'), W(c, 'puente') + 2);
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.1, 3), ...shakeCam(t, 1, 16)}} bg={<CityNight />} mid={<><Lamp x={500} fall={ramp(t, W(c, 'farolas'), W(c, 'farolas') + 1)} /><Lamp x={1400} fall={-ramp(t, W(c, 'farolas') + 0.3, W(c, 'farolas') + 1.3)} /></>} hero={<Crowd t={t} n={10} />} />],
        [W(c, 'gente'), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 1.1, 1.2, 3), ...shakeCam(t, 1, 12)}} blur={8} bg={<Street dusk />} hero={<>{Array.from({length: 6}).map((_, i) => <NPC key={i} x={(200 + i * 300 + lt * (i % 2 ? 300 : -300) + 1920) % 1920} s={0.95} t={t} color={['#2A9D8F', '#8D99AE', '#6A4C93', '#457B9D', '#E76F51', '#FFB703'][i]} pose={POSES.fly} rotate={i % 2 ? 10 : -10} flip={i % 2 === 0} />)}</>} />],
        [W(c, 'yo'), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.1, 4), ...shakeCam(t, 0.6, 10)}} bg={<Bridge t={t} crack={crack} shake={4} />} hero={<><Hero x={300} y={1000} s={0.9} t={t} eyes="wide" mouth="o" /><NPC x={150} y={1000} s={0.95} t={t} color={MARCOS} eyes="wide" mouth="o" /></>} />],
        [W(c, 'encima'), (lt) => <Cine t={t} mood="red" blur={1.5} cam={{...kb(lt, 1.4, 1.6, 4, 1250, 470), ...shakeCam(t, 0.5, 8)}} bg={<Bridge t={t} crack={1} shake={2} />} />],
        [W(c, 'bomberos'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.0, 1.1, 3)} bg={<Street dusk />} hero={<><rect x={1200} y={600} width={500} height={240} rx={20} fill="#D62828" stroke="#111" strokeWidth={7} /><rect x={1200} y={760} width={500} height={30} fill="#111" />{Array.from({length: 8}).map((_, i) => <rect key={i} x={0 + i * 150} y={880} width={140} height={60} rx={10} fill={['#6C757D', '#4361EE', '#E63946'][i % 3]} stroke="#111" strokeWidth={4} />)}</>} />],
        [W(c, 'marcos', 2), (lt) => <Cine t={t} mood="night" cam={kb(lt, 2.2, 2.4, 4, 960, 420)} bg={<Bridge t={t} crack={1} />} hero={<><NPC x={830} y={1000} s={1.0} t={t} color={MARCOS} eyes="wide" flip={false} /><Hero x={1080} y={1000} s={0.95} t={t} eyes="angry" flip /></>} />],
        [W(c, 'corri'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.2, 2)} blur={11} bg={<Bridge t={t} crack={1} />} hero={<Hero x={200 + Math.min(1, lt / 0.5) * 700} y={1000 - Math.max(0, lt - 0.5) * 300} s={0.95} t={t} pose={POSES.fly} rotate={25} eyes="angry" />} />],
        [W(c, 'ahi'), (lt) => holdBridge(t, kb(lt, 1.0, 1.15, 3))],
      ])}
      <CText t={t} at={W(c, 'terremoto')} until={W(c, 'gente') - 0.05} a="TERREMOTO" b="7,2" size={150} y={100} color2="#FF4D6D" />
      <CText t={t} at={W(c, 'encima')} until={W(c, 'bomberos') - 0.05} a="UN AUTOBÚS" b="LLENO DE NIÑOS" size={120} y={100} color2="#FFD23F" />
      <CText t={t} at={W(c, 'bomberos')} until={W(c, 'marcos', 2) - 0.05} a="NADIE LLEGABA" size={130} y={100} />
      <CText t={t} at={W(c, 'ahi')} a="Y AQUÍ EMPEZÓ" b="ESTE VÍDEO" size={120} y={100} />
    </AbsoluteFill>
  );
};

// ---------- 9: sujetar ----------
export const Ch9: F = ({t}) => {
  const c = 9;
  const kidsN = Math.floor(ramp(t, W(c, 'sacaron'), W(c, '32') + 1) * 10);
  const drop = W(c, 'desmaye');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => holdBridge(t, {...kb(lt, 1.3, 1.5, 5, 1050, 600), ...shakeCam(t, 0.4, 6)})],
        [W(c, 'sentia'), (lt) => holdBridge(t, {...kb(lt, 2.6, 2.9, 4, 1030, 520), ...shakeCam(t, 0.4, 5)})],
        [W(c, 'si'), (lt) => holdBridge(t, kb(lt, 1.6, 1.4, 6, 1100, 560))],
        [W(c, 'era'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.6, 1.9, 5, 960, 620)} bg={<Kitchen />} hero={<Egg x={960} y={640} s={4} />} />],
        [W(c, 'respire'), (lt) => holdBridge(t, kb(lt, 2.4, 2.6, 4, 1030, 440), 0.2)],
        [W(c, 'arriba'), (lt) => holdBridge(t, kb(lt, 1.2, 1.4, 6, 1250, 500), 0.3, kidsN)],
        [W(c, 'cuando'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.1, 1.0, 4)} rain bg={<Bridge t={t} crack={1} bus={false} />} hero={<Hero x={1030} y={900 + Math.max(0, t - drop) * 200} s={1.1} t={t} pose={t > drop ? POSES.idle : POSES.armsUp} rotate={t > drop ? 70 : 0} eyes="closed" />} />],
      ])}
      <CText t={t} at={CS(c) + 0.1} until={W(c, 'sentia') - 0.05} a="4.000 TONELADAS" size={130} y={100} />
      <CText t={t} at={W(c, 'era')} until={W(c, 'respire') - 0.05} a="UN HUEVO" b="DE 4.000 TONELADAS" size={110} y={100} />
      <CText t={t} at={W(c, 'sacaron')} until={W(c, 'cuando') - 0.05} a={`${Math.min(32, Math.round(ramp(t, W(c, 'sacaron'), W(c, '32') + 0.3) * 32))} / 32`} size={170} y={100} color="#7CF4FF" />
      <Flash t={t} at={drop + 0.4} dur={0.5} color="#fff" max={0.6} />
    </AbsoluteFill>
  );
};

// ---------- 10: respeto ----------
export const Ch10: F = ({t}) => {
  const c = 10;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.2, 1.35, 5)} bg={<HospitalRoom />} hero={<><Hero x={880} y={630} s={0.9} t={t} rotate={-90} eyes={lt > 1 ? 'normal' : 'closed'} /><NPC x={1350} s={1.05} t={t} color={MOM} flip eyes="happy" /><NPC x={1580} s={1.1} t={t} color={MARCOS} flip eyes="happy" mouth="grin" /></>} />],
        [W(c, 'fuera'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.0, 1.15, 6)} bg={<Street />} hero={<><Crowd t={t} cheer n={16} y={LH + 40} /><Sign x={600} y={620} text="GRACIAS" rot={-6} /><Sign x={1300} y={600} text="HÉROE" c="#FFD23F" rot={5} /><Sign x={960} y={660} text="♥" c="#FFADAD" /></>} />],
        [W(c, 'senora'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.4, 1.6, 4, 960, 560)} bg={<HospitalRoom />} hero={<><NPC x={1150} s={1.0} t={t} color={LADY} hairBun flip mouth="grin" eyes="happy" /><Cake x={940} y={620} /></>} />],
        [W(c, 'nina'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.5, 1.8, 4, 960, 520)} bg={<HospitalRoom />} hero={<><Drawing x={960} y={480} s={1.3} bridge /><NPC x={1250} s={0.7} t={t} color={GIRL} flip mouth="grin" eyes="happy" /></>} />],
        [W(c, 'mismas'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.3, 5, 960, 480)} bg={<Room night />} hero={<Screen x={960} y={460} s={1.1} glow="#2DC653"><rect x={-390} y={150} width={780} height={70} fill="#2DC653" /><text textAnchor="middle" y={200} fontFamily="Montserrat" fontWeight={900} fontSize={50} fill="#fff">EL HÉROE DEL PUENTE</text><circle cx={0} cy={-40} r={60} fill="#111" /><path d="M -90 110 Q -90 30 0 30 Q 90 30 90 110 Z" fill="#2D6CDF" /></Screen>} />],
        [W(c, 'taquilla'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.6, 2.6, 7, 968, 540)} bg={<Hallway graffiti={t > W(c, 'debajo') ? 'heroe' : 'monstruo'} />} />],
      ])}
      <CText t={t} at={W(c, 'mismas')} until={W(c, 'pero') - 0.05} a="DE «AMENAZA»..." b="A «HÉROE»" size={120} y={100} color2="#2DC653" />
      <CText t={t} at={W(c, 'nuestro')} a="NUESTRO HÉROE" size={150} y={110} color="#FFD23F" />
    </AbsoluteFill>
  );
};

// ---------- 11: x1000 ----------
export const Ch11: F = ({t}) => {
  const c = 11;
  const egg = W(c, 'esta');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.15, 6)} bg={<Street />} hero={<><Hero x={800} s={1.1} t={t} pose={POSES.wave} eyes="happy" /><NPC x={1150} s={1.0} t={t} color={LADY} hairBun flip pose={POSES.wave} eyes="happy" /><NPC x={1400} s={0.7} t={t} color={GIRL} flip pose={POSES.cheer} /></>} />],
        [W(c, 'fuerza'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.1, 6)} bg={<Bridge t={t} bus={false} />} hero={<Hero x={960} y={430} s={0.8} t={t} pose={POSES.hips} />} />],
        [W(c, 'abrazar'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.5, 1.7, 5, 960, 500)} bg={<Kitchen />} hero={<><Hero x={900} s={1.15} t={t} pose={POSES.reach} eyes="happy" /><NPC x={1040} s={1.1} t={t} color={MOM} flip pose={POSES.reach} eyes="happy" /></>} />],
        [W(c, 'aunque'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.5, 6, 960, 560)} bg={<Kitchen night />} mid={<Table x={960} />} hero={<><Hero x={850} s={1.1} t={t} pose={POSES.reach} eyes="side" /><Egg x={1000} y={700} s={1.3} broken={t > egg + 1.4} /></>} />],
        [W(c, 'apretar'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 2.0, 2.6, 6, 960, 420)} bg={<Kitchen night />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.fists} eyes="glow" glow />} />],
        [W(c, 'que', 2), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.1, 1.2, 5)} bg={<CityNight />} hero={<><Hero x={820} s={1.1} t={t} pose={POSES.pointDown} eyes="happy" mouth="grin" /><g transform={`translate(1150 ${760 + Math.sin(t * 7) * 18})`}><path d="M -40 -140 L 40 -140 L 40 0 L 100 0 L 0 120 L -100 0 L -40 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={8} strokeLinejoin="round" /></g></>} />],
      ])}
      <CText t={t} at={W(c, 'fuerza')} until={W(c, 'abrazar') - 0.05} a="SABER CUÁNDO" b="SOLTAR" size={140} y={100} />
      <CText t={t} at={W(c, '1000')} until={W(c, 'que', 2) - 0.05} a="×1000" size={260} y={90} color="#FF4D6D" />
      <CText t={t} at={W(c, 'que', 2)} a="¿QUÉ HARÍAS TÚ" b="100 VECES MÁS FUERTE?" size={100} y={100} />
    </AbsoluteFill>
  );
};

export const CHAPTERS: F[] = [Ch0, Ch1, Ch2, Ch3, Ch4, Ch5, Ch6, Ch7, Ch8, Ch9, Ch10, Ch11];
