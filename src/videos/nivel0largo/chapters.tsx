import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LW, GY, Cine, CText, Flash, shots, kb, ramp, easeOut, rnd, pop, CF} from '../futuro/kit';
import {Hero, NPC, POSES, Suit, CityNight, Room, Screen, PhoneV, Cup, Library, LibTable} from '../futuro/props';
import {Kitchen, Table, Classroom, Yard, Street, Car, Crowd, Bathroom, Mirror} from '../largo1/props';
import {Hallway, Bus, HospitalRoom, Sign} from '../fuerte/props';
import {lerpT, EASE_IN, EASE_OUT, SPRING, hitStop, impactFilter, Shockwave, SpeedBurst, Debris, Aura, ZeroZone, EnergyBall, quake, ImpactOverlay} from './fight';
import wordsJson from './words.json';
import startsJson from '../../../assets/nivel0largo/starts.json';

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
const RED = '#C1121F', DANI = '#E9C46A', VEC = '#2A9D8F', MOM = '#E07A5F', COP = '#1D3557';
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

// numero de nivel sobre la cabeza (acepta '∞' y giro)
export const Lvl: React.FC<{x: number; y?: number; s?: number; n: number | string; t: number; dim?: boolean; rot?: number}> = ({x, y = GY, s = 1.1, n, t, dim, rot = 0}) => {
  const v = typeof n === 'number' ? n : 0;
  const inf = n === '∞';
  const col = inf ? '#FFD23F' : n === 0 || n === '0' ? '#9AA0A6' : v >= 90 ? '#FF3B5C' : v >= 60 ? '#FFD23F' : '#7CF4FF';
  const fs = 92 * s * (inf ? 1.35 : 1);
  return (
    <g transform={`translate(${x} ${y - 470 * s + Math.sin(t * 2 + x) * 6}) rotate(${rot})`} opacity={dim ? 0.55 : 1}>
      <text textAnchor="middle" dominantBaseline="central" fontFamily="Montserrat" fontWeight={900} fontSize={fs} fill="none" stroke={col} strokeWidth={inf ? 30 : 16} opacity={inf ? 0.6 : 0.35} filter="url(#blurGlow)">{n}</text>
      <text textAnchor="middle" dominantBaseline="central" fontFamily="Montserrat" fontWeight={900} fontSize={fs} fill={col} stroke="#0B0A1A" strokeWidth={4} paintOrder="stroke">{n}</text>
    </g>
  );
};
const P: React.FC<{x: number; y?: number; s?: number; color: string; n: number | string; t: number; pose?: any; eyes?: any; mouth?: any; flip?: boolean; dim?: boolean}> = ({x, y = GY, s = 1.1, color, n, t, pose, eyes, mouth, flip, dim}) => (
  <g><NPC x={x} y={y} s={s} t={t} color={color} pose={pose} eyes={eyes} mouth={mouth} flip={flip} /><Lvl x={x} y={y} s={s} n={n} t={t} dim={dim} /></g>
);
const Me: React.FC<{x: number; y?: number; s?: number; t: number; pose?: any; eyes?: any; mouth?: any; flip?: boolean; n?: number | string; glow?: boolean}> = ({x, y = GY, s = 1.1, t, pose, eyes, mouth, flip, n = 0, glow}) => (
  <g><Hero x={x} y={y} s={s} t={t} pose={pose} eyes={eyes} mouth={mouth} flip={flip} glow={glow} /><Lvl x={x} y={y} s={s} n={n} t={t} /></g>
);
const Vortex: React.FC<{x: number; t: number; s?: number; pose?: any; eyes?: any; mouth?: any; n?: number | string; flip?: boolean}> = ({x, t, s = 1.3, pose = POSES.fists, eyes = 'evil', mouth = 'grin', n = 99, flip = true}) => (
  <g>
    <circle cx={x} cy={GY - 220 * s} r={260 * s} fill="#FF2244" opacity={typeof n === 'number' ? (n / 99) * (0.2 + 0.06 * Math.sin(t * 8)) : 0} filter="url(#blurGlow)" />
    <P x={x} s={s} t={t} color={RED} n={n} pose={pose} eyes={eyes} mouth={mouth} flip={flip} />
  </g>
);
const Say: React.FC<{t: number; at: number; until?: number; text: string; x: number; y: number; w?: number}> = ({t, at, until = 1e9, text, x, y, w = 520}) => {
  if (t < at || t > until) return null;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translate(0,-100%) scale(${pop(t, at, 12, 260)})`, transformOrigin: '50% 100%'}}>
      <div style={{background: 'rgba(255,255,255,0.95)', borderRadius: 26, padding: '20px 28px', fontFamily: CF, fontWeight: 800, fontSize: 40, color: '#14121F', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>{text}</div>
      <div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '22px solid rgba(255,255,255,0.95)'}} />
    </div>
  );
};
const HX = 820, VX0 = 1520, VXHIT = 1000, VXBACK = 1120;
// coreografia: carga con aura -> embestida con estela -> golpes en serie. hits en tiempo local
function villainX(tt: number, hits: number[]) {
  const first = hits[0];
  if (tt < first - 0.35) return VX0;
  if (tt < first) return lerpT(tt, first - 0.35, first, VX0, VXHIT, EASE_IN);
  for (let i = 1; i < hits.length; i++) {
    const prev = hits[i - 1], h = hits[i];
    if (tt < h - 0.25) return lerpT(tt, prev, h - 0.25, VXHIT, VXBACK, SPRING);
    if (tt < h) return lerpT(tt, h - 0.25, h, VXBACK, VXHIT, EASE_IN);
  }
  return lerpT(tt, hits[hits.length - 1], hits[hits.length - 1] + 0.6, VXHIT, VXBACK, SPRING);
}
const fight = (t: number, lt: number, o: {hits: number[]; n: number | string; crowd?: boolean; zoom?: [number, number]; heroEyes?: any}) => {
  const tt = o.hits.reduce((acc, h) => hitStop(acc, h, 0.1), lt);
  const vx = villainX(tt, o.hits);
  const dashing = o.hits.some((h) => tt > h - 0.35 && tt < h);
  const charge = lerpT(tt, 0, o.hits[0] - 0.35, 0.3, 1.2);
  const lastHit = o.hits.filter((h) => tt >= h).pop();
  const fist = {x: HX + 90, y: GY - 1.1 * 300};
  const [z0, z1] = o.zoom ?? [1.15, 1.4];
  const zoom = lastHit != null ? lerpT(tt, lastHit, lastHit + 0.5, z1, z0 + (z1 - z0) * 0.5, SPRING) : lerpT(tt, 0, o.hits[0], z0, z0 + 0.08);
  const q = quake(lt, o.hits, 30);
  const nn = o.n;
  return (
    <AbsoluteFill style={{filter: impactFilter(lt, o.hits)}}>
      <Cine t={t} mood={nn === 0 ? 'cold' : 'red'} cam={{s: zoom, ox: (HX + vx) / 2, oy: 520, x: q.x, y: q.y}} rain bg={<CityNight />} hero={<>
        {o.crowd && <Crowd t={t} n={14} cheer={nn === 0} />}
        <ZeroZone x={HX} t={lt} hits={o.hits} />
        <Me x={HX} t={t} eyes={o.heroEyes ?? 'normal'} />
        <Aura x={vx} s={1.3} t={t} k={typeof nn === 'number' ? (nn / 99) * charge : 0} />
        {dashing && [0.05, 0.1, 0.15].map((d, i) => <g key={i} opacity={0.3 - i * 0.09}><NPC x={villainX(tt - d, o.hits)} s={1.3} t={t} color={RED} pose={POSES.point} flip /></g>)}
        <Vortex x={vx} t={t} n={nn} pose={dashing || (lastHit != null && tt - lastHit < 0.3) ? POSES.point : POSES.fists} eyes={nn === 0 ? 'wide' : 'evil'} mouth={nn === 0 ? 'o' : 'teeth'} />
        {o.hits.map((h, i) => <g key={i}><SpeedBurst x={fist.x} y={fist.y} t={lt} at={h} /><Shockwave x={HX + 40} y={GY} t={lt} at={h} max={800} /><Debris x={HX + 60} t={lt} at={h} n={12} power={0.8} /></g>)}
      </>} />
      <ImpactOverlay t={lt} hits={o.hits} />
    </AbsoluteFill>
  );
};
const punch = (t: number, cam: any, n: number | string, hit: boolean, crowd = false) => fight(t, hit ? 0.7 : 99, {hits: [0.6], n, crowd, zoom: [cam.s ?? 1.2, (cam.s ?? 1.2) + 0.15]});

// ---------- 0: el punetazo (gancho) ----------
export const Ch0: F = ({t}) => {
  const c = 0;
  const n = t < W(c, '90') ? 99 : t < W(c, '70') ? 90 : t < W(c, '50') ? 70 : 50;
  return (
    <AbsoluteFill>
      {shots(t, [
        [0, (lt) => fight(t, lt, {hits: [0.75, 1.55, 2.3, 3.1], n: 99, zoom: [1.1, 1.45]})],
        [W(c, 'nivel'), (lt) => <AbsoluteFill style={{filter: impactFilter(lt, [0, 0.9])}}><Cine t={t} mood="red" cam={{...kb(lt, 2.3, 2.6, 2, 1080, 380), ...quake(lt, [0, 0.9, 1.8], 20)}} rain bg={<CityNight />} hero={<><Aura x={1080} s={1.3} t={t} k={n / 99} /><Vortex x={1080} t={t} n={n} pose={POSES.point} eyes="wide" mouth="teeth" /></>} /></AbsoluteFill>],
        [W(c, 'gente'), (lt) => fight(t, lt + 5, {hits: [0.4], n, crowd: true, zoom: [1.0, 1.05]})],
        [W(c, 'porque'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.0, 2.4, 5, 960, 420)} bg={<CityNight />} hero={<Me x={960} s={1.2} t={t} eyes="side" />} />],
        [W(c, 'hace'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.0, 5)} bg={<Hallway />} hero={<><Me x={960} t={t} eyes="closed" mouth="frown" />{[400, 600, 1350, 1550].map((x, i) => <P key={x} x={x} t={t} color={['#457B9D', '#6A4C93', DANI, '#E76F51'][i]} n={[54, 71, 88, 63][i]} pose={POSES.laugh} mouth="grin" eyes="happy" flip={x > 960} />)}</>} />],
        [(W(c, 'historia') - 0.4), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.3, 1.0, 8)} bg={<CityNight />} hero={<Me x={960} s={1.2} t={t} eyes="glow" glow n={lt > 7 ? '?' : 0} />} />],
      ])}
      <CText t={t} at={0.05} until={W(c, 'gente') - 0.05} a="NIVEL 0" b={`VS NIVEL ${n}`} size={140} y={100} color2="#FF4D6D" />
      <CText t={t} at={W(c, 'unico')} until={W(c, 'hace') - 0.05} a="EL ÚNICO 0" b="DE LA CIUDAD" size={120} y={100} />
      <CText t={t} at={W(c, 'chiste')} until={(W(c, 'historia') - 0.4) - 0.05} a="EL CHISTE" b="DEL INSTITUTO" size={120} y={100} />
      <CText t={t} at={W(c, 'empezo')} a="MI NÚMERO" b="EMPEZÓ A MOVERSE" size={110} y={100} color2="#7CF4FF" />
      {[0, W(c, 'nivel'), W(c, '90'), W(c, '70'), W(c, '50')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
    </AbsoluteFill>
  );
};

// ---------- 1: el dia de los numeros ----------
export const Ch1: F = ({t}) => {
  const c = 1;
  const appear = W(c, 'aparecio');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 5)} bg={<Street />} hero={<>{[300, 600, 960, 1300, 1620].map((x, i) => t > appear ? <P key={x} x={x} t={t} s={0.95} color={['#457B9D', VEC, '#8D99AE', '#E76F51', '#6A4C93'][i]} n={[23, 40, 0, 67, 12][i]} eyes="wide" mouth="o" /> : <NPC key={x} x={x} s={0.95} t={t} color={['#457B9D', VEC, '#2D6CDF', '#E76F51', '#6A4C93'][i]} />)}</>} />],
        [W(c, 'vecina'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.2, 1.35, 5)} bg={<Room />} hero={<><P x={800} t={t} color={VEC} n={40} pose={POSES.point} eyes="glow" /><g transform={`translate(1200 ${600 - Math.sin(lt * 2) * 80})`}><rect x={-60} y={-40} width={120} height={80} rx={10} fill="#8B5A3C" stroke="#111" strokeWidth={5} /></g></>} />],
        [W(c, 'profe'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.2, 3)} blur={10} bg={<Yard track />} hero={<P x={400 + Math.min(1, lt / 2) * 1100} t={t} color="#8D99AE" n={72} pose={POSES.fly} />} />],
        [W(c, 'noticias'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.25, 5, 960, 480)} bg={<Room night />} hero={<Screen x={960} y={460} s={1.1} glow="#E63946"><circle cx={0} cy={0} r={120} fill="#FF7A1A" opacity={0.7} /><text textAnchor="middle" y={-120} fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#FF3B5C">95</text><rect x={-390} y={150} width={780} height={70} fill="#E63946" /><text textAnchor="middle" y={200} fontFamily="Montserrat" fontWeight={900} fontSize={42} fill="#fff">JAPÓN: EL BOMBERO DE NIVEL 95</text></Screen>} />],
        [W(c, 'entonces'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.6, 2.2, 6, 960, 420)} bg={<Street />} hero={<><rect x={560} y={240} width={800} height={660} fill="#9ED8FF" opacity={0.25} stroke="#ddd" strokeWidth={10} /><Me x={960} s={1.2} t={t} eyes="wide" mouth="o" /></>} />],
      ])}
      <CText t={t} at={W(c, '12')} until={appear - 0.05} a="MARTES · 12:00" size={130} y={100} />
      <CText t={t} at={W(c, 'nivel')} until={W(c, 'vecina') - 0.05} a="NIVEL DE PODER" b="DEL 1 AL 100" size={120} y={100} />
      <CText t={t} at={W(c, 'cero')} a="MI NÚMERO:" b="0" size={150} y={100} color2="#9AA0A6" />
      <Flash t={t} at={appear} dur={0.3} max={0.8} />
    </AbsoluteFill>
  );
};

// ---------- 2: el instituto ----------
export const Ch2: F = ({t}) => {
  const c = 2;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 6)} bg={<Library />} mid={<><LibTable x={600} /><LibTable x={1500} /></>} hero={<>{[420, 600, 780].map((x, i) => <P key={x} x={x} t={t} s={0.95} color={['#457B9D', DANI, '#6A4C93'][i]} n={[81, 88, 76][i]} mouth="grin" eyes="happy" />)}<Me x={1500} s={0.95} t={t} eyes="side" mouth="frown" /></>} />],
        [W(c, 'llamaban'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.0, 2.4, 4, 960, 420)} bg={<Hallway graffiti="" />} hero={<Me x={960} s={1.2} t={t} eyes="closed" mouth="frown" />} />],
        [W(c, 'educacion'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.15, 5)} bg={<Yard />} hero={<><P x={500} y={GY - 300 - Math.sin(lt * 3) * 100} t={t} s={0.9} color="#457B9D" n={66} pose={POSES.fly} /><P x={1200} t={t} s={0.95} color={DANI} n={88} pose={POSES.armsUp} /><Car x={1200} y={GY - 0.95 * 420} c="#E63946" s={1.0} /></>} />],
        [W(c, 'portero'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.2, 1.35, 3, 1400, 600)} bg={<Yard />} mid={<rect x={1350} y={560} width={420} height={340} fill="none" stroke="#fff" strokeWidth={14} />} hero={<><Me x={1560} t={t} pose={POSES.scared} eyes="wide" mouth="o" /><circle cx={1500 + Math.min(1, lt / 0.8) * 60} cy={700 - Math.min(1, lt / 0.8) * 120} r={36} fill="#fff" stroke="#111" strokeWidth={6} /></>} />],
        [W(c, 'peor'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.6, 2.0, 6, 960, 450)} bg={<Room night />} hero={<><Me x={960} s={1.15} t={t} pose={POSES.kneel} eyes="closed" mouth="frown" /><rect x={1180} y={760} width={14} height={60} fill="#F1FAEE" /></>} />],
        [W(c, 'unico'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.4, 6, 960, 700)} bg={<CityNight />} hero={<Me x={960} s={0.55} t={t} />} />],
      ])}
      <CText t={t} at={W(c, 'llamaban')} until={W(c, 'educacion') - 0.05} a="«CERO»" size={200} y={110} color="#9AA0A6" />
      <CText t={t} at={W(c, 'razon')} until={W(c, 'unico') - 0.05} a="Y TENÍAN" b="RAZÓN" size={130} y={100} />
      <CText t={t} at={W(c, 'fallo')} a="EL ÚNICO FALLO" b="DEL SISTEMA" size={120} y={100} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------- 3: Dani ----------
export const Ch3: F = ({t}) => {
  const c = 3;
  const flick = t < W(c, '88', 2) + 0.4 && t > W(c, '88') ? (Math.floor(t * 4) % 2 ? 80 : 88) : 88;
  const grab = W(c, 'agarro');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 4)} bg={<Hallway />} hero={<><Me x={700} t={t} /><P x={1250} t={t} s={1.15} color={DANI} n={88} pose={POSES.hips} mouth="grin" flip /></>} />],
        [W(c, '88'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 2.2, 2.4, 3, 1150, 330)} bg={<Hallway />} hero={<><Me x={900} t={t} /><P x={1150} t={t} s={1.15} color={DANI} n={flick} flip /></>} />],
        [W(c, 'hasta'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.2, 1.35, 5)} bg={<Hallway />} hero={<><Crowd t={t} n={12} cheer /><Me x={880} t={t} eyes="wide" /><P x={1060} t={t} s={1.15} color={DANI} n={t > grab + 0.8 ? 12 : 88} pose={t > grab ? POSES.reach : POSES.laugh} mouth={t > grab + 0.8 ? 'o' : 'grin'} eyes={t > grab + 0.8 ? 'wide' : 'happy'} flip /></>} />],
        [W(c, 'sus'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.4, 2.7, 4, 1060, 360)} bg={<Hallway />} hero={<P x={1060} t={t} s={1.15} color={DANI} n={12} pose={POSES.hands} eyes="wide" mouth="o" flip />} />],
        [W(c, 'nadie'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.6, 2.2, 6, 1060, 380)} bg={<Hallway />} hero={<><Me x={820} t={t} /><P x={1100 + Math.min(1, lt) * 80} t={t} s={1.15} color={DANI} n={88} pose={POSES.scared} eyes="wide" mouth="o" flip /></>} />],
      ])}
      <CText t={t} at={W(c, 'dani')} until={W(c, '88') - 0.05} a="DANI" b="NIVEL 88" size={140} y={100} />
      <CText t={t} at={W(c, '12')} until={W(c, 'nadie') - 0.05} a="88 → 12" size={190} y={100} color="#FF4D6D" />
      <CText t={t} at={W(c, 'miedo')} a="MIEDO." size={200} y={110} color="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------- 4: el interruptor ----------
export const Ch4: F = ({t}) => {
  const c = 4;
  const d = t < W(c, 'acerque') ? 0 : t < W(c, 'toque') ? 1 : 2;
  const n = d === 2 && t > W(c, 'bajo') - 0.2 ? 0 : 40;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.25, 8)} bg={<Kitchen night />} mid={<Table x={1250} />} hero={<>
          <P x={800} t={t} color={VEC} n={n} pose={POSES.point} eyes={n ? 'glow' : 'wide'} />
          <Cup x={1250} y={d === 0 ? 520 + Math.sin(t * 3) * 40 : d === 1 ? 640 + Math.sin(t * 30) * 6 : 700} />
          <Me x={d === 0 ? 1650 : d === 1 ? 1050 : 920} t={t} pose={d === 2 ? POSES.reach : POSES.idle} />
        </>} />],
        [W(c, 'apuntamos'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.4, 6, 960, 560)} bg={<Kitchen night />} hero={<g transform="translate(960 520)">
          <rect x={-420} y={-260} width={840} height={520} fill="#FFF8E7" stroke="#111" strokeWidth={6} />
          {[['3 M', 'SE DEBILITAN', '#FFD23F'], ['1 M', 'CASI DESAPARECEN', '#FF8A3D'], ['TOCAR', 'SE APAGAN', '#FF3B5C']].map(([a, b, col], i) => (
            <g key={i} opacity={easeOut(ramp(t, W(c, 'apuntamos') + i * 2.2, W(c, 'apuntamos') + i * 2.2 + 0.4))}>
              <text x={-380} y={-140 + i * 150} fontFamily="Montserrat" fontWeight={900} fontSize={64} fill={col} stroke="#111" strokeWidth={3} paintOrder="stroke">{a}</text>
              <text x={-80} y={-140 + i * 150} fontFamily="Montserrat" fontWeight={800} fontSize={48} fill="#111">{b}</text>
            </g>
          ))}
        </g>} />],
        [W(c, 'vecina', 2), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.6, 2.0, 6, 960, 420)} bg={<Kitchen night />} hero={<><P x={760} t={t} color={VEC} n={40} eyes="wide" /><Me x={1160} t={t} eyes="glow" flip /></>} />],
      ])}
      <CText t={t} at={W(c, 'cero')} until={W(c, 'apuntamos') - 0.05} a="40 → 0" size={190} y={100} color="#7CF4FF" />
      <Say t={t} at={W(c, 'tu')} until={W(c, 'interruptor') + 0.3} text="Tú no eres un cero…" x={760} y={330} w={460} />
      <CText t={t} at={W(c, 'interruptor')} a="ERES UN" b="INTERRUPTOR" size={140} y={100} color2="#7CF4FF" />
    </AbsoluteFill>
  );
};

// ---------- 5: el arma ----------
export const Ch5: F = ({t}) => {
  const c = 5;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 5)} bg={<Hallway />} hero={<>{[300, 500, 1400, 1600].map((x, i) => <P key={x} x={x + (x < 960 ? -lt * 40 : lt * 40)} t={t} s={0.95} color={['#457B9D', '#6A4C93', DANI, '#E76F51'][i]} n={[54, 71, 88, 63][i]} pose={POSES.scared} eyes="wide" flip={x > 960} />)}<Me x={960} t={t} eyes="side" /></>} />],
        [W(c, 'periodista'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.25, 5, 960, 480)} bg={<Room night />} hero={<Screen x={960} y={460} s={1.1} glow="#E63946"><circle cx={0} cy={-40} r={60} fill="#111" /><path d="M -90 110 Q -90 30 0 30 Q 90 30 90 110 Z" fill="#2D6CDF" /><rect x={-390} y={150} width={780} height={70} fill="#E63946" /><text textAnchor="middle" y={200} fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">«EL APAGÓN HUMANO»</text></Screen>} />],
        [W(c, 'padres'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.3, 1.5, 6, 960, 560)} bg={<Kitchen />} mid={<Table x={960} />} hero={<>{Array.from({length: 8}).map((_, i) => <rect key={i} x={760 + (i % 4) * 110} y={640 - Math.floor(i / 4) * 30 + rnd(i) * 10} width={100} height={64} fill="#FFF8E7" stroke="#111" strokeWidth={3} transform={`rotate(${(rnd(i + 3) - 0.5) * 30} ${810 + (i % 4) * 110} 670)`} />)}<NPC x={600} t={t} s={1.1} color={MOM} pose={POSES.headHold} /></>} />],
        [W(c, 'otros'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.35, 4)} rain bg={<Street dusk />} hero={<><Me x={800} t={t} eyes="wide" /><Suit x={1150} t={t} flip pose={POSES.reach} /><g transform="translate(1250 600)"><rect x={-60} y={-40} width={120} height={80} rx={8} fill="#2D6A4F" stroke="#111" strokeWidth={4} /><text textAnchor="middle" y={18} fontFamily="Montserrat" fontWeight={900} fontSize={50} fill="#B7E4C7">€</text></g></>} />],
        [W(c, 'primera'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.6, 2.4, 6, 960, 420)} bg={<CityNight />} hero={<Me x={960} s={1.2} t={t} eyes="side" />} />],
      ])}
      <CText t={t} at={W(c, 'ciudad')} until={W(c, 'periodista') - 0.05} a="TODA LA CIUDAD" b="LO SABÍA" size={120} y={100} />
      <CText t={t} at={W(c, 'arma')} a="COMO A" b="UN ARMA" size={160} y={100} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------- 6: Vortice ----------
export const Ch6: F = ({t}) => {
  const c = 6;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.25, 4, 960, 450), ...shake(t, 3)}} rain bg={<CityNight />} hero={<Vortex x={960} t={t} s={1.4} pose={POSES.armsUp} flip={false} />} />],
        [W(c, 'tarde'), (lt) => <Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.1, 3), ...shake(t, 6)}} bg={<CityNight lights={false} />} hero={<><Vortex x={700} t={t} s={1.2} pose={POSES.point} flip={false} /><Aura x={700} s={1.2} t={t} /><g transform={`translate(${1000 + lt * 500} ${620 - lt * 280}) rotate(${lt * 200})`}><rect x={-160} y={-60} width={320} height={120} rx={14} fill="#D62828" stroke="#111" strokeWidth={6} /></g><Shockwave x={760} y={GY} t={lt} at={0.15} max={900} /><Debris x={760} t={lt} at={0.15} n={20} /></>} />],
        [W(c, 'heroes'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.1, 1.0, 3)} bg={<CityNight />} hero={<>{[0, 1, 2].map((i) => { const k = Math.min(1, Math.max(0, lt - i * 0.5) / 0.9); return <g key={i} transform={`translate(${(i - 1) * 260 + k * 800} ${-k * 600}) rotate(${k * 300} 960 ${GY - 200})`}><P x={960} t={t} s={0.95} color={['#457B9D', VEC, '#6A4C93'][i]} n={90 + i * 2} pose={POSES.fly} /></g>; })}</>} />],
        [W(c, 'tele'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.5, 6, 960, 460)} bg={<Room night />} hero={<Screen x={960} y={460} s={1.1} glow="#FF2244"><g transform="translate(0 -250) scale(0.55)"><Vortex x={0} t={t} s={1.1} flip={false} /></g></Screen>} />],
        [W(c, 'justo'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.4, 1.7, 6, 960, 450)} bg={<Room night />} hero={<><Me x={900} t={t} pose={POSES.phone} eyes="wide" /></>} />],
      ])}
      <CText t={t} at={W(c, 'vortice')} until={W(c, 'tarde') - 0.05} a="VÓRTICE" b="NIVEL 99" size={150} y={100} color="#FF4D6D" />
      <Say t={t} at={W(c, 'ciudad')} until={W(c, 'justo') - 0.05} text="La ciudad es mía. El número más alto manda." x={960} y={300} w={640} />
      <CText t={t} at={W(c, 'unico')} a="EL ÚNICO QUE" b="PUEDE ACERCARSE" size={110} y={100} />
    </AbsoluteFill>
  );
};

// ---------- 7: la decision ----------
export const Ch7: F = ({t}) => {
  const c = 7;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.0, 2.3, 4, 960, 420)} bg={<Room night />} hero={<Me x={960} s={1.2} t={t} pose={POSES.headHold} eyes="closed" mouth="frown" />} />],
        [(W(c, 'poder') - 0.5), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.0, 1.15, 5)} bg={<CityNight />} hero={<><Vortex x={960} t={t} s={1.3} /><text x={600} y={300} fontFamily="Montserrat" fontWeight={900} fontSize={200} fill="#fff" opacity={0.25}>?</text></>} />],
        [W(c, 'encerre'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.3, 6)} bg={<Room night />} hero={<><circle cx={1460} cy={300} r={140} fill="#FF7A1A" opacity={0.35 + 0.1 * Math.sin(t * 3)} filter="url(#blurGlow)" /><Me x={800} t={t} pose={POSES.kneel} eyes="side" /></>} />],
        [W(c, 'noticias'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.4, 5, 960, 480)} bg={<Room night />} hero={<Screen x={960} y={460} s={1.1} glow="#FF2244"><g transform="translate(-150 -200) scale(0.5)"><NPC x={0} t={t} s={1.0} color="#FFB703" pose={POSES.scared} eyes="wide" mouth="o" /></g><g transform="translate(150 -240) scale(0.5)"><Vortex x={0} t={t} s={1.2} /></g></Screen>} />],
        [W(c, 'madre'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.6, 6, 960, 450)} bg={<Room night />} hero={<><Me x={800} t={t} eyes="wide" /><NPC x={1150} t={t} s={1.1} color={MOM} flip eyes="happy" /></>} />],
        [W(c, 'cogi'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.3, 2)} blur={11} rain bg={<Street dusk />} hero={<Me x={500 + lt * 600} t={t} pose={POSES.fly} eyes="angry" />} />],
      ])}
      <CText t={t} at={W(c, 'miedo')} until={(W(c, 'poder') - 0.5) - 0.05} a="TENÍA MIEDO" size={150} y={100} />
      <CText t={t} at={(W(c, 'poder') - 0.5)} until={W(c, 'encerre') - 0.05} a="¿Y SI NO" b="FUNCIONA CON 99?" size={110} y={100} color2="#FF4D6D" />
      <Say t={t} at={W(c, 'tu')} until={W(c, 'cogi') - 0.05} text="Tú eliges qué significa tu número." x={1150} y={330} w={520} />
    </AbsoluteFill>
  );
};

// ---------- 8: acercarse ----------
export const Ch8: F = ({t}) => {
  const c = 8;
  const bus = W(c, 'autobus');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.0, 1.15, 5)} rain bg={<CityNight />} hero={<><Me x={500 + lt * 60} t={t} eyes="angry" />{[900, 1300].map((x, i) => <Car key={x} x={x} y={t > W(c, '100') + 0.6 ? GY : 400 + Math.sin(t * 2 + i) * 30} c={['#4361EE', '#2A9D8F'][i]} s={1.3} />)}</>} />],
        [W(c, '50'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.2, 1.3, 3)} rain bg={<CityNight />} hero={<>{[1000, 1250].map((x, i) => <g key={x}><NPC x={x} t={t} s={1.0} color={COP} flip />{lt < 0.8 && <circle cx={x - 60} cy={GY - 220} r={130} fill="#7CF4FF" opacity={0.3} />}</g>)}<Me x={600} t={t} /></>} />],
        [W(c, 'vortice'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 2.2, 2.4, 3, 1150, 380)} rain bg={<CityNight />} hero={<><Aura x={1150} s={1.3} t={t} /><Vortex x={1150} t={t} pose={t > W(c, 'rio') ? POSES.laugh : POSES.idle} mouth={t > W(c, 'rio') ? 'open' : 'grin'} /></>} />],
        [W(c, 'rio') + 0.5, (lt) => {
          const balls = [0.1, 0.45, 0.8];
          const hits = balls.map((b) => b + 0.5);
          return <Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.1, 3), ...quake(lt, hits, 10)}} rain bg={<CityNight />} hero={<><ZeroZone x={600} t={lt} hits={hits} /><Me x={600} t={t} eyes="wide" /><Aura x={1550} s={1.3} t={t} /><Vortex x={1550} t={t} pose={POSES.point} />{balls.map((b, i) => <EnergyBall key={i} x0={1420} y0={GY - 420} x1={760} y1={GY - 260 - i * 40} t={lt} at={b} dur={0.5} />)}</>} />;
        }],
        [bus, (lt) => {
          const fall = W(c, '10') - bus + 0.3;
          const k = lerpT(lt, 0, fall, 0, 1, EASE_IN);
          const bx = (kk: number) => 1650 - kk * 900, by = (kk: number) => 380 - Math.sin(kk * Math.PI) * 140;
          const dropped = lt > fall;
          const yDrop = dropped ? lerpT(lt, fall, fall + 0.35, by(1), GY, EASE_IN) : by(k);
          return <AbsoluteFill style={{filter: impactFilter(lt, [fall + 0.35])}}><Cine t={t} mood="red" cam={{...kb(lt, 1.0, 1.1, 3), ...quake(lt, [fall + 0.35], 34)}} rain bg={<CityNight />} hero={<>
            <ZeroZone x={600} t={lt} hits={[fall]} r={420} />
            <Me x={600} t={t} eyes="wide" mouth="o" />
            {!dropped && [0.06, 0.12, 0.18].map((d, i) => <g key={i} opacity={0.25 - i * 0.07}><Bus x={bx(Math.max(0, k - d))} y={by(Math.max(0, k - d))} s={1.1} rot={-10 - (k - d) * 40} /></g>)}
            <Bus x={dropped ? bx(1) : bx(k)} y={yDrop} s={1.1} rot={dropped ? lerpT(lt, fall, fall + 0.35, -50, 0) : -10 - k * 40} />
            <Shockwave x={bx(1)} y={GY} t={lt} at={fall + 0.35} max={900} />
            <Debris x={bx(1)} t={lt} at={fall + 0.35} n={22} power={1.1} />
            <Aura x={1700} s={1.3} t={t} /><Vortex x={1700} t={t} pose={POSES.point} />
          </>} /></AbsoluteFill>;
        }],
        [W(c, 'sonrisa'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.4, 2.6, 2, 1150, 380)} rain bg={<CityNight />} hero={<Vortex x={1150} t={t} eyes="wide" mouth="o" />} />],
        [W(c, 'corri'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.35, 4)} rain bg={<CityNight />} hero={<><Me x={700} t={t} pose={POSES.tug} eyes="angry" /><NPC x={850} t={t} s={0.65} color="#FFB703" pose={POSES.scared} eyes="wide" /></>} />],
        [W(c, 'cuando'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.3, 1.5, 3, 960, 480)} rain bg={<CityNight />} hero={<><ZeroZone x={820} t={lt} /><Me x={820} t={t} eyes="angry" /><Aura x={1080} s={1.3} t={t} /><Vortex x={1080} t={t} pose={POSES.fists} mouth="teeth" /></>} />],
      ])}
      <CText t={t} at={W(c, '100')} until={W(c, '50') - 0.05} a="100 M" size={180} y={100} />
      <CText t={t} at={W(c, '50')} until={W(c, 'vortice') - 0.05} a="50 M" size={180} y={100} />
      <CText t={t} at={W(c, '10')} until={W(c, 'sonrisa') - 0.05} a="10 M" size={180} y={100} color="#7CF4FF" />
    </AbsoluteFill>
  );
};

// ---------- 9: el punetazo ----------
export const Ch9: F = ({t}) => {
  const c = 9;
  const n = t < W(c, '99') ? 99 : t < W(c, '50') ? 99 : t < W(c, '10') ? 50 : t < W(c, 'cero') ? 10 : 0;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => fight(t, lt, {hits: [0.55, 1.35, 2.1], n: 99, zoom: [1.15, 1.5]})],
        [W(c, 'no'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.4, 2.6, 3, 820, 400)} rain bg={<CityNight />} hero={<><ZeroZone x={820} t={lt} /><Me x={820} t={t} eyes="normal" /><NPC x={1000} s={1.3} t={t} color={RED} pose={POSES.point} flip /></>} />],
        [W(c, 'su', 2), (lt) => {
          const drops = [W(c, '50'), W(c, '10'), W(c, 'cero')].map((x) => x - W(c, 'su', 2));
          return <AbsoluteFill style={{filter: impactFilter(lt, drops, 0.05)}}><Cine t={t} mood={n === 0 ? 'cold' : 'red'} cam={{...kb(lt, 1.5, 1.8, 6, 1060, 420), ...quake(lt, drops, 14)}} rain bg={<CityNight />} hero={<>
            <ZeroZone x={820} t={lt} hits={drops} />
            <Me x={820} t={t} />
            <Aura x={1050} s={1.3} t={t} k={n / 99} />
            {drops.map((d, i) => <Shockwave key={i} x={1050} y={GY - 260} t={lt} at={d} max={500} color="#9AA0A6" />)}
            <Vortex x={1050} t={t} n={n} pose={n < 50 ? POSES.kneel : POSES.scared} eyes={n < 50 ? 'scared' : 'wide'} mouth="o" />
          </>} /></AbsoluteFill>;
        }],
        [W(c, 'vortice'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.4, 2.7, 4, 1110, 420)} rain bg={<CityNight />} hero={<Vortex x={1110} t={t} n={0} pose={POSES.hands} eyes="wide" mouth="o" />} />],
        [W(c, 'policia'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.1, 4)} rain bg={<CityNight />} hero={<><Vortex x={1000 + lt * 80} t={t} n={0} pose={POSES.idle} eyes="side" mouth="frown" /><NPC x={1250 + lt * 80} t={t} color={COP} flip /><NPC x={780 + lt * 80} t={t} color={COP} /></>} />],
        [W(c, 'calle'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.0, 1.15, 6)} bg={<CityNight />} hero={<><Crowd t={t} n={16} cheer /><Me x={960} t={t} eyes="happy" mouth="grin" /></>} />],
        [W(c, 'dani'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.4, 1.6, 6, 960, 450)} bg={<CityNight />} hero={<><Me x={820} t={t} pose={POSES.reach} eyes="happy" /><P x={1100} t={t} s={1.15} color={DANI} n={88} pose={POSES.reach} eyes="happy" mouth="grin" flip /></>} />],
      ])}
      <CText t={t} at={W(c, 'nada')} until={W(c, 'su', 2) - 0.05} a="NO SENTÍ" b="NADA" size={150} y={100} />
      <CText t={t} at={W(c, 'su', 2)} until={W(c, 'vortice') - 0.05} a={`${n}`} size={240} y={80} color={n === 0 ? '#9AA0A6' : '#FF4D6D'} />
      <CText t={t} at={W(c, 'como')} until={W(c, 'policia') - 0.05} a="ERA COMO YO" size={150} y={100} />
      {[W(c, '50'), W(c, '10'), W(c, 'cero')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.6} />)}
    </AbsoluteFill>
  );
};

// ---------- 10: el regalo ----------
export const Ch10: F = ({t}) => {
  const c = 10;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 6)} bg={<Street />} hero={<><Me x={960} t={t} pose={POSES.wave} eyes="happy" />{[500, 1400].map((x, i) => <P key={x} x={x} t={t} s={0.95} color={['#457B9D', VEC][i]} n={[54, 40][i]} pose={POSES.wave} eyes="happy" flip={x > 960} />)}</>} />],
        [W(c, 'numero'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.0, 1.2, 6, 960, 420)} bg={<CityNight />} hero={<><Lvl x={760} y={1250} s={1.8} n={99} t={t} /><Lvl x={1160} y={1250} s={1.8} n={0} t={t} /><text x={960} y={430} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={90} fill="#fff">=</text></>} />],
        [W(c, 'ofrecieron'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.0, 1.15, 4)} bg={<Street />} hero={<><Me x={960} t={t} eyes="side" />{[[600, 'TV'], [1300, '★'], [1550, '€']].map(([x, s]) => <Sign key={String(x)} x={+x} y={560} text={String(s)} />)}</>} />],
        [W(c, 'hospital'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.3, 8)} bg={<HospitalRoom />} hero={<><Me x={1050} t={t} eyes="happy" /><NPC x={800} y={GY} s={0.65} t={t} color="#F72585" eyes="happy" mouth="grin" /><NPC x={1300} y={GY} s={0.6} t={t} color="#4CC9F0" eyes="happy" mouth="grin" /></>} />],
        [W(c, 'primera'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.4, 1.9, 6, 960, 420)} bg={<CityNight />} hero={<Me x={960} s={1.2} t={t} eyes="happy" glow />} />],
      ])}
      <CText t={t} at={W(c, 'puedes')} until={W(c, 'ofrecieron') - 0.05} a="LO QUE PUEDES HACER" b="≠ LO QUE DECIDES" size={96} y={100} />
      <CText t={t} at={W(c, 'regalo')} a="UN REGALO" size={170} y={110} color="#FFD23F" />
    </AbsoluteFill>
  );
};

// ---------- 11: el contador ----------
export const Ch11: F = ({t}) => {
  const c = 11;
  const tl = W(c, 'esta');
  const n: number | string = t < W(c, 'uno') ? 0 : t < W(c, '10') ? 1 : t < W(c, '100') ? 10 : t < tl ? 100 : t < W(c, 'tumbado') ? 0 : '∞';
  const rot = t < W(c, 'girado') ? 0 : t < W(c, 'tumbado') ? lerpT(t, W(c, 'girado'), W(c, 'tumbado'), 0, 90, SPRING) : 0;
  const boom = W(c, 'infinito');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.0, 1.15, 6)} bg={<Bathroom />} mid={<Mirror x={960} y={480} w={620} h={700}><Hero x={960} y={1260} s={2.2} t={t} /></Mirror>} />],
        [W(c, 'movio'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.8, 2.2, 6, 960, 380)} bg={<Bathroom />} hero={<Me x={960} s={1.2} t={t} eyes="wide" mouth="o" n={n} />} />],
        [W(c, 'cada', 2), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.15, 6)} bg={<CityNight />} hero={<>
          {[400, 650, 1270, 1520].map((x, i) => <g key={x}><P x={x} t={t} s={0.9} color={['#457B9D', VEC, DANI, '#6A4C93'][i]} n={[54, 40, 88, 71][i]} />
            {Array.from({length: 5}).map((_, j) => { const p = (lt * 0.8 + j / 5 + i * 0.13) % 1; return <circle key={j} cx={x + (960 - x) * p} cy={GY - 0.9 * 470 + (GY - 1.15 * 250 - (GY - 0.9 * 470)) * p - Math.sin(p * Math.PI) * 120} r={9} fill="#7CF4FF" opacity={0.8 * (1 - p * 0.5)} />; })}</g>)}
          <Me x={960} s={1.15} t={t} eyes="glow" n={n} />
        </>} />],
        [tl, (lt) => <Cine t={t} mood={t > W(c, 'tumbado') ? 'dusk' : 'cold'} cam={{...kb(lt, 1.0, 1.1, 8, 960, 600), ...quake(t, [W(c, 'tumbado')], 16)}} bg={<CityNight lights={false} />} hero={<>
          <Lvl x={960} y={1830} s={2.6} n={n} t={t} rot={rot} />
          <Shockwave x={960} y={600} t={t} at={W(c, 'tumbado')} max={900} color="#FFD23F" />
          <SpeedBurst x={960} y={600} t={t} at={W(c, 'tumbado')} color="#FFE8A3" />
        </>} />],
        [boom - 0.2, (lt) => <AbsoluteFill style={{filter: impactFilter(t, [boom])}}><Cine t={t} mood="dusk" cam={{...kb(lt, 1.4, 1.0, 3, 960, 420), ...quake(t, [boom], 34)}} bg={<CityNight lights={t > boom + 0.3} />} hero={<>
          <Aura x={960} s={1.4} t={t} k={lerpT(t, boom, boom + 0.8, 0, 1.3, EASE_OUT)} color="#FFD23F" />
          <Shockwave x={960} y={GY} t={t} at={boom} max={1500} color="#FFD23F" dur={1.2} />
          <SpeedBurst x={960} y={GY - 300} t={t} at={boom} color="#FFE8A3" dur={0.8} n={34} />
          <Debris x={960} t={t} at={boom} n={26} power={1.3} />
          <Me x={960} s={1.25} t={t} eyes="glow" glow n="∞" />
        </>} /></AbsoluteFill>],
        [W(c, 'que', 4), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.1, 1.2, 5)} bg={<CityNight />} hero={<><Aura x={800} s={1.1} t={t} k={0.6} color="#FFD23F" /><Me x={800} t={t} pose={POSES.pointDown} eyes="happy" mouth="grin" n="∞" /><g transform={`translate(1200 ${720 + Math.sin(t * 7) * 18})`}><path d="M -40 -140 L 40 -140 L 40 0 L 100 0 L 0 120 L -100 0 L -40 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={8} strokeLinejoin="round" /></g></>} />],
      ])}
      <CText t={t} at={W(c, '100')} until={tl - 0.05} a="1 → 10 → 100" size={130} y={100} color="#7CF4FF" />
      <CText t={t} at={W(c, 'girado')} until={W(c, 'tumbado') - 0.05} a="SE HA GIRADO…" size={130} y={100} />
      <CText t={t} at={W(c, 'tumbado')} until={boom - 0.25} a="NO ES UN 0" b="ES UN 8 TUMBADO" size={110} y={100} color2="#FFD23F" />
      <CText t={t} at={boom} until={W(c, 'que', 4) - 0.05} a="NIVEL" b="INFINITO" size={150} y={90} color="#fff" color2="#FFD23F" />
      <CText t={t} at={W(c, 'que', 4)} a="¿QUÉ NÚMERO" b="TENDRÍAS TÚ?" size={120} y={100} />
    </AbsoluteFill>
  );
};

export const CHAPTERS: F[] = [Ch0, Ch1, Ch2, Ch3, Ch4, Ch5, Ch6, Ch7, Ch8, Ch9, Ch10, Ch11];
