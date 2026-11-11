import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LW, LH, GY, W, CS, CE, Cine, FutureFX, CText, DayTag, Flash, shots, kb, ramp, easeOut, rnd, pop, CF} from './kit';
import {Hero, NPC, POSES, Vera, Suit, CityNight, Room, Library, LibTable, Fair, Booth, Roulette, Plush, Cup, Door, Bike, Ball, School, BlackCar, Alley, Bin, TrafficLight, PowerPlant, Rooftop, Panel, Cap, Note, Screen, PhoneV, Clock2, Tunnel, Hospital} from './props';
import {Kitchen, Table, Bedroom, Classroom, Desk, Yard, Street, Car, Crowd} from '../largo1/props';

type F = React.FC<{t: number}>;
const MOM = '#E07A5F', LEO = '#F4A261', COUSIN = '#2A9D8F', COP = '#1D3557';

// bocadillo limpio
const Say: React.FC<{t: number; at: number; until?: number; text: string; x: number; y: number; w?: number}> = ({t, at, until = 1e9, text, x, y, w = 560}) => {
  if (t < at || t > until) return null;
  const k = pop(t, at, 12, 260);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translate(0,-100%) scale(${k})`, transformOrigin: '50% 100%'}}>
      <div style={{background: 'rgba(255,255,255,0.95)', borderRadius: 26, padding: '20px 28px', fontFamily: CF, fontWeight: 800, fontSize: 40, color: '#14121F', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>{text}</div>
      <div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '22px solid rgba(255,255,255,0.95)'}} />
    </div>
  );
};
const Count: React.FC<{t: number; at: number; until: number; n: string; color?: string}> = ({t, at, until, n, color = '#fff'}) => {
  if (t < at || t > until) return null;
  const k = easeOut(ramp(t, at, at + 0.2));
  return <div style={{position: 'absolute', left: 0, width: LW, top: 330, textAlign: 'center', fontFamily: CF, fontWeight: 900, fontSize: 340 * (1.25 - 0.25 * k), color, opacity: k * (1 - ramp(t, until - 0.2, until)), textShadow: '0 0 60px rgba(255,60,90,0.6), 0 10px 40px rgba(0,0,0,0.8)'}}>{n}</div>;
};
const Red: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 0 q 10 18 0 30 q -10 -12 0 -30 Z" fill="#D90429" />;

// ---------------- 0: el tejado (gancho) ----------------
const roof = (t: number, cam: any, vEyes = 'happy', hEyes = 'angry', extra?: React.ReactNode) => (
  <Cine t={t} mood="night" cam={cam} rain bg={<Rooftop />} mid={<Panel x={1500} t={t} />} hero={<>
    <Hero x={640} y={760} s={1.1} t={t} pose={POSES.fists} eyes={hEyes as any} mouth="flat" />
    <Vera x={1260} y={760} s={1.1} t={t} pose={POSES.hips} eyes={vEyes} mouth="grin" flip />
    {extra}
  </>} />
);
export const Ch0: F = ({t}) => {
  const c = 0;
  return (
    <AbsoluteFill>
      {shots(t, [
        [0, (lt) => roof(t, kb(lt, 1.5, 1.2, 2.5, 960, 500))],
        [W(c, 'fallar'), (lt) => roof(t, kb(lt, 2.4, 2.6, 3, 640, 380))],
        [W(c, 'problema'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.1, 1.25, 4)} bg={<CityNight lights={lt < 1.6} />} hero={<Hero x={960} y={980} s={1.4} t={t} eyes="glow" />} />],
        [W(c, 'nueve'), (lt) => roof(t, kb(lt, 2.6, 2.8, 3, 1260, 380))],
        [W(c, 'ocho'), (lt) => roof(t, kb(lt, 1.3, 1.4, 3, 960, 560))],
        [W(c, 'siete'), (lt) => roof(t, kb(lt, 2.8, 3.0, 2, 640, 400))],
        [W(c, 'cuando'), (lt) => roof(t, kb(lt, 1.0, 1.15, 3))],
        [W(c, 'hace'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.15, 1.0, 3)} bg={<Classroom />} mid={<Desk x={1300} />} hero={<Hero x={600} s={1.1} t={t} pose={POSES.shrug} />} />],
        [W(c, 'llegaba'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1, 1.1, 3)} bg={<Street />} hero={<><Hero x={500 + lt * 260} s={1.0} t={t} pose={POSES.fly} rotate={10} eyes="wide" mouth="o" sweat /><Clock2 x={1550} y={260} r={100} sec={lt * 40} /></>} />],
        [W(c, 'perdia'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.2, 3, 900)} bg={<Yard />} hero={<><Hero x={800} s={1.0} t={t} pose={POSES.kneel} eyes="closed" mouth="frown" /><Ball x={300 + lt * 900} y={820 - Math.sin(lt * 3) * 200} /></>} />],
        [W(c, 'nunca'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.2, 1.3, 3)} bg={<Room />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.shrug} eyes="side" mouth="frown" />} />],
        [W(c, 'historia') - 0.4, (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.3, 1.0, 6)} bg={<CityNight />} hero={<><Clock2 x={960} y={620} r={150} sec={lt * 6} /><Hero x={960} y={1060} s={1.2} t={t} eyes="glow" /></>} />],
      ])}
      <FutureFX t={t} at={0} until={W(c, 'nueve') - 0.05} label="10 S" />
      <CText t={t} at={0.05} until={W(c, 'fallar') - 0.05} a="10 SEGUNDOS" b="PARA SALVAR LA CIUDAD" size={120} y={110} />
      <Count t={t} at={W(c, 'nueve')} until={W(c, 'ocho')} n="9" />
      <Count t={t} at={W(c, 'ocho')} until={W(c, 'siete')} n="8" />
      <Count t={t} at={W(c, 'siete')} until={W(c, 'cuando')} n="7" />
      <CText t={t} at={W(c, 'pero')} until={W(c, 'siete') - 0.05} a="ELLA VE" b="1 SEGUNDO MÁS" size={110} y={110} />
      <CText t={t} at={W(c, 'hace')} until={W(c, 'llegaba') - 0.05} a="30 DÍAS ANTES" size={110} y={120} />
      <CText t={t} at={W(c, 'historia') - 0.4} a="VEO 10 SEGUNDOS" b="DEL FUTURO" size={140} y={120} />
      {[W(c, 'nueve'), W(c, 'ocho'), W(c, 'siete'), W(c, 'hace')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.18} max={0.6} />)}
    </AbsoluteFill>
  );
};

// ---------------- 1: la taza ----------------
const kitchen = (t: number, cam: any, cup: React.ReactNode, hero: React.ReactNode, mood: any = 'day') => (
  <Cine t={t} mood={mood} cam={cam} bg={<Kitchen />} mid={<Table x={1000} />} hero={<>{cup}{hero}</>} />
);
export const Ch1: F = ({t}) => {
  const c = 1;
  const fall = W(c, 'resbalo'), seg = W(c, 'segundos');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => kitchen(t, kb(lt, 1, 1.15, 5), <Cup x={1000} y={700} />, <Hero x={800} t={t} s={1.15} />)],
        [W(c, 'vi'), (lt) => kitchen(t, kb(lt, 1.6, 1.8, 4, 1050, 700), lt < 1 ? <Cup x={1000 + lt * 120} y={700 + lt * lt * 200} rot={lt * 140} /> : <Cup x={1100} y={890} broken={Math.min(1, lt - 1 + 0.3)} />, <Hero x={800} t={t} s={1.15} />, 'future')],
        [W(c, 'pegue'), (lt) => kitchen(t, kb(lt, 1.2, 1.3, 3), <Cup x={1000} y={700} />, <Hero x={760 - easeOut(Math.min(1, lt * 3)) * 160} t={t} s={1.15} pose={POSES.scared} eyes="wide" mouth="o" />)],
        [W(c, 'pero'), (lt) => kitchen(t, kb(lt, 2.4, 2.6, 4, 1000, 660), <Cup x={1000} y={700} />, <Hero x={600} t={t} s={1.15} eyes="wide" />)],
        [seg, (lt) => {
          const k = ramp(t, W(c, 'codo'), fall + 0.6);
          return kitchen(t, kb(lt, 1.3, 1.5, 5, 1000, 700), k < 0.6 ? <Cup x={1000 + k * 200} y={700 + k * k * 300} rot={k * 200} /> : <Cup x={1100} y={890} broken={Math.min(1, (k - 0.6) * 3)} />, <Hero x={830} t={t} s={1.15} pose={POSES.reach} />);
        }],
        [W(c, 'exactamente'), (lt) => kitchen(t, kb(lt, 1.6, 1.7, 3, 1050, 820), <Cup x={1100} y={890} broken={1} />, <Hero x={800} t={t} s={1.15} eyes="wide" mouth="o" />)],
        [W(c, 'helado'), (lt) => kitchen(t, kb(lt, 2.6, 2.9, 4, 800, 380), <Cup x={1100} y={890} broken={1} />, <Hero x={800} t={t} s={1.15} eyes="wide" mouth="o" />, 'cold')],
        [W(c, 'luego'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.1, 1.2, 4)} bg={<Kitchen />} mid={<Door x={1500} open={Math.min(1, lt)} />} hero={<><NPC x={1500} t={t} s={1.15} color={MOM} pose={POSES.hips} hairBun={false} /><Hero x={700} t={t} s={1.15} /></>} />],
        [W(c, 'segundos', 2), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.25, 4, 1300)} bg={<Kitchen />} mid={<Door x={1500} open={Math.min(1, lt * 1.5)} />} hero={<><NPC x={1500} t={t} s={1.15} color={MOM} pose={POSES.hips} /><Hero x={700} t={t} s={1.15} eyes="wide" mouth="o" /></>} />],
        [W(c, 'entendi'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 2.2, 2.6, 6, 960, 420)} bg={<Kitchen />} hero={<Hero x={960} t={t} s={1.2} eyes={lt > 1.2 ? 'glow' : 'wide'} glow={lt > 1.2} />} />],
        [W(c, 'exactamente', 2), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.2, 1.0, 5)} bg={<CityNight />} hero={<><Clock2 x={960} y={640} r={190} sec={lt * 6} /></>} />],
      ])}
      <DayTag t={t} at={CS(c)} text="DÍA 1" />
      <FutureFX t={t} at={W(c, 'vi')} until={W(c, 'pegue')} />
      <FutureFX t={t} at={W(c, 'luego')} until={W(c, 'segundos', 2)} />
      <Say t={t} at={W(c, 'llegas')} until={W(c, 'segundos', 2) - 0.05} text="¡Llegas tarde!" x={1500} y={430} w={420} />
      <Say t={t} at={W(c, 'llegas', 2)} until={W(c, 'entendi') - 0.05} text="¡Llegas tarde!" x={1250} y={330} w={420} />
      <CText t={t} at={seg} until={W(c, 'codo') - 0.05} a="10 SEGUNDOS" b="DESPUÉS..." size={110} y={110} />
      <CText t={t} at={W(c, 'futuro')} until={W(c, 'exactamente', 2) - 0.05} a="ESTABA VIENDO" b="EL FUTURO" size={130} y={110} />
      <CText t={t} at={W(c, 'exactamente', 2)} a="10 SEGUNDOS." b="NI UNO MÁS." size={130} y={110} />
      <Flash t={t} at={fall + 0.3} dur={0.2} max={0.5} />
    </AbsoluteFill>
  );
};

// ---------------- 2: tonterias ----------------
const Hand: React.FC<{x: number; y: number; k: 'piedra' | 'papel' | 'tijera'; flip?: boolean}> = ({x, y, k, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    {k === 'piedra' && <circle r={70} fill="#F4D9B8" stroke="#111" strokeWidth={7} />}
    {k === 'papel' && <rect x={-60} y={-90} width={120} height={180} rx={30} fill="#F4D9B8" stroke="#111" strokeWidth={7} />}
    {k === 'tijera' && <g><circle r={55} fill="#F4D9B8" stroke="#111" strokeWidth={7} /><rect x={-34} y={-150} width={26} height={110} rx={12} fill="#F4D9B8" stroke="#111" strokeWidth={6} transform="rotate(-12)" /><rect x={8} y={-150} width={26} height={110} rx={12} fill="#F4D9B8" stroke="#111" strokeWidth={6} transform="rotate(12)" /></g>}
  </g>
);
export const Ch2: F = ({t}) => {
  const c = 2;
  const kinds = ['piedra', 'papel', 'tijera'] as const;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1, 1.1, 5)} bg={<Room />} hero={<><Hero x={620} t={t} s={1.15} pose={POSES.point} mouth="grin" /><NPC x={1300} t={t} s={1.15} color={LEO} flip /></>} />],
        [W(c, 'piedra'), (lt) => {
          const i = Math.floor(lt * 2.2);
          return <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.4, 4)} bg={<Room />} hero={<><Hand x={760} y={560} k={kinds[(i + 1) % 3]} /><Hand x={1160} y={560} k={kinds[i % 3]} flip /></>} />;
        }],
        [W(c, 'leo'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.2, 1.35, 4, 1300)} bg={<Room />} hero={<><Hero x={620} t={t} s={1.15} pose={POSES.laugh} eyes="happy" mouth="grin" /><NPC x={1300} t={t} s={1.15} color={LEO} pose={POSES.armsUp} eyes="angry" mouth="open" flip /></>} />],
        [W(c, 'patio'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.25, 5)} bg={<Yard />} mid={<rect x={1350} y={560} width={420} height={340} fill="none" stroke="#fff" strokeWidth={14} />} hero={<><Hero x={1560} t={t} s={1.05} pose={lt > 1.4 ? POSES.armsUp : POSES.hips} eyes="glow" /><NPC x={500} t={t} s={1.05} color={LEO} pose={POSES.reach} /><Ball x={640 + Math.min(1, lt / 1.4) * 900} y={820 - Math.sin(Math.min(1, lt / 1.4) * 3.14) * 280} /></>} />],
        [W(c, 'ganamos'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 4)} bg={<Yard />} hero={<><Crowd t={t} cheer n={10} /><Hero x={960} t={t} s={1.2} pose={POSES.cheer} eyes="happy" mouth="grin" /></>} />],
        [W(c, 'examen'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.2, 5)} bg={<Classroom />} mid={<Desk x={700} paper="?" />} hero={<><Hero x={700} t={t} s={1.0} eyes="side" look={1} /><NPC x={1400} t={t} s={1.2} color="#8D99AE" flip={lt < 2.5} pose={POSES.point} /></>} />],
        [W(c, 'videojuegos'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.3, 1.5, 5, 960, 480)} bg={<Room night />} hero={<><Screen x={960} y={420} s={0.9} glow="#7209B7"><text y={20} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={110} fill="#FFD23F">VICTORIA</text></Screen><Hero x={960} y={1100} s={1.1} t={t} eyes="glow" /></>} />],
        [W(c, 'sentia'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.2, 1.5, 5, 960, 500)} bg={<CityNight />} hero={<Hero x={960} t={t} s={1.3} pose={POSES.hips} eyes="happy" mouth="grin" glow />} />],
      ])}
      <CText t={t} at={W(c, 'gane')} until={W(c, 'leo') - 0.05} a="100 VICTORIAS" b="SEGUIDAS" size={120} y={110} />
      <CText t={t} at={W(c, 'ganamos')} until={W(c, 'examen') - 0.05} a="10 - 0" size={200} y={100} />
      <CText t={t} at={W(c, 'invencible')} until={W(c, 'ahi') - 0.05} a="INVENCIBLE" size={170} y={120} color="#FFD23F" />
      <CText t={t} at={W(c, 'ahi')} a="Y AHÍ EMPEZÓ" b="EL PROBLEMA" size={120} y={120} />
      <FutureFX t={t} at={W(c, 'vi')} until={W(c, 'ganamos') - 0.05} />
    </AbsoluteFill>
  );
};

// ---------------- 3: la ruleta ----------------
export const Ch3: F = ({t}) => {
  const c = 3;
  const s1 = W(c, 'siete', 3), s2 = W(c, '12', 2);
  const ang = (lt: number, stop: number, target: number) => {
    const k = Math.min(1, lt / stop);
    return (1 - Math.pow(1 - k, 3)) * (1440 + (360 - (target - 0.5) * 22.5));
  };
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.3, 1.1, 5)} bg={<Fair t={t} />} hero={<><Hero x={760} t={t} s={1.1} pose={POSES.hips} eyes="happy" mouth="grin" /><NPC x={1060} t={t} s={1.3} color={COUSIN} /></>} />],
        [W(c, 'ruleta'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1, 1.1, 5)} bg={<Fair t={t} />} mid={<Booth x={960} />} hero={<><Roulette x={960} y={480} angle={t * 200} /><NPC x={1360} y={900} t={t} s={1.0} color="#9C6644" /></>} />],
        [W(c, 'vi'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.4, 1.6, 4, 960, 480)} bg={<Fair t={t} />} mid={<Booth x={960} />} hero={<Roulette x={960} y={480} angle={ang(lt, 1.2, 7)} hi={lt > 1.2 ? 7 : undefined} />} />],
        [W(c, 'apostamos'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.5, 3, 960, 480)} bg={<Fair t={t} />} mid={<Booth x={960} />} hero={<Roulette x={960} y={480} angle={ang(lt, s1 - W(c, 'apostamos'), 7)} hi={t > s1 ? 7 : undefined} />} />],
        [W(c, 'volvimos'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.5, 1.7, 3, 960, 480)} bg={<Fair t={t} />} mid={<Booth x={960} />} hero={<Roulette x={960} y={480} angle={ang(lt, s2 - W(c, 'volvimos'), 12)} hi={t > s2 ? 12 : undefined} />} />],
        [W(c, 'ganamos'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1, 1.15, 5)} bg={<Fair t={t} />} hero={<><Plush x={760} y={900} s={1.4} /><Hero x={1100} t={t} s={1.1} pose={POSES.cheer} eyes="happy" mouth="grin" /><NPC x={1400} t={t} s={1.3} color={COUSIN} pose={POSES.cheer} mouth="grin" /></>} />],
        [W(c, 'hombre'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 2.0, 2.3, 4, 960, 420)} bg={<Fair t={t} />} mid={<Booth x={960} />} hero={<NPC x={960} t={t} s={1.2} color="#9C6644" pose={lt > 1.4 ? POSES.shout : POSES.idle} eyes={lt > 1.4 ? 'angry' : 'wide'} mouth={lt > 1.4 ? 'open' : 'o'} />} />],
        [W(c, 'esa'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.3, 7)} bg={<Bedroom />} hero={<><Plush x={1500} y={900} s={1.2} /><Hero x={900} y={760} s={1.1} t={t} rotate={-90} eyes="normal" /></>} />],
        [W(c, 'entonces'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 2.2, 2.6, 4, 960, 420)} bg={<Bedroom />} hero={<Hero x={960} t={t} s={1.2} pose={POSES.headHold} eyes="closed" mouth="teeth" />} />],
      ])}
      <FutureFX t={t} at={W(c, 'vi')} until={W(c, 'apostamos') - 0.05} />
      <CText t={t} at={s1} until={W(c, 'volvimos') - 0.05} a="7" size={260} y={60} color="#FFD23F" />
      <CText t={t} at={s2} until={W(c, 'ganamos') - 0.05} a="12" size={260} y={60} color="#FFD23F" />
      <CText t={t} at={W(c, 'mas', 2)} until={W(c, 'entonces') - 0.05} a="¿QUÉ MÁS" b="PUEDO HACER?" size={120} y={110} />
      <Flash t={t} at={W(c, 'pinchazo')} dur={0.35} color="#FF0030" max={0.5} />
      <CText t={t} at={W(c, 'pinchazo')} a="EL PRIMER" b="PINCHAZO" size={120} y={110} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------------- 4: el chico que llega antes ----------------
export const Ch4: F = ({t}) => {
  const c = 4;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1, 1.1, 4)} bg={<Street crosswalk />} hero={<><Bike x={400 + lt * 120} t={t} /><Hero x={400 + lt * 120} y={GY - 120} s={0.9} t={t} pose={POSES.fly} rotate={0} /></>} />],
        [W(c, 'nina'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.1, 1.3, 5, 1300, 700)} bg={<Street crosswalk />} hero={<><NPC x={1150 + lt * 60} y={930} s={0.7} color="#FFB703" pose={POSES.reach} /><Ball x={1260 + lt * 80} y={990} r={28} /><Car x={1900 - lt * 260} y={960} c="#9D0208" s={1.6} /></>} />],
        [W(c, 'pedalee'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.3, 1.5, 3, 900)} blur={9} bg={<Street crosswalk />} hero={<><Bike x={300 + lt * 500} t={t * 3} /><Hero x={300 + lt * 500} y={GY - 120} s={0.9} t={t} pose={POSES.fly} rotate={20} eyes="angry" sweat /></>} />],
        [W(c, 'llegue'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.5, 1.7, 3, 1250, 800)} bg={<Street crosswalk />} hero={<><Hero x={1200 - lt * 100} y={930} s={0.95} t={t} pose={POSES.tug} eyes="angry" /><NPC x={1330 - lt * 120} y={930} s={0.7} color="#FFB703" pose={POSES.scared} eyes="wide" /></>} />],
        [W(c, 'coche', 2), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.2, 3)} blur={7} bg={<Street crosswalk />} hero={<><Hero x={1000} y={760} s={0.95} t={t} pose={POSES.kneel} eyes="wide" /><NPC x={1130} y={760} s={0.7} color="#FFB703" pose={POSES.scared} eyes="wide" /><Car x={2200 - lt * 1400} y={960} c="#9D0208" s={1.6} />{lt > 1.2 && <g opacity={1 - (lt - 1.2)}>{Array.from({length: 8}).map((_, i) => <line key={i} x1={1300} y1={980} x2={1300 + Math.cos(i) * 120} y2={980 + Math.sin(i) * 60} stroke="#FF4D6D" strokeWidth={8} />)}</g>}</>} />],
        [W(c, 'nina', 2), (lt) => <Cine t={t} mood="day" cam={kb(lt, 2.0, 2.2, 4, 1050, 520)} bg={<Street />} hero={<><NPC x={1050} y={760} s={0.9} color="#FFB703" eyes="wide" mouth="o" /><Hero x={850} y={760} s={1.0} t={t} /></>} />],
        [W(c, 'gente'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.1, 4)} bg={<Street />} hero={<><Crowd t={t} cheer n={12} /><Hero x={960} y={800} s={1.1} t={t} pose={POSES.shrug} eyes="happy" /></>} />],
        [W(c, 'dia', 2), (lt) => {
          const v = Math.floor(easeOut(Math.min(1, lt / 2.5)) * 3000000);
          return <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.35, 5, 960, 500)} bg={<Room night />} hero={<PhoneV x={960} y={540} s={1.2} t={t} views={v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} />} />;
        }],
        [W(c, 'llamaban'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.3, 1.1, 5)} bg={<CityNight />} hero={<Hero x={960} s={1.3} t={t} pose={POSES.hips} eyes="glow" glow />} />],
        [W(c, 'maceta'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.3, 3, 960, 400)} bg={<Street />} hero={<><g transform={`translate(1000 ${120 + Math.min(1, lt / 1.2) * 480})`}><path d="M -50 0 L 50 0 L 38 80 L -38 80 Z" fill="#BC6C25" stroke="#111" strokeWidth={6} /><circle cx={0} cy={-20} r={40} fill="#52B788" stroke="#111" strokeWidth={5} /></g><Hero x={1000} y={760} s={1.0} t={t} pose={POSES.armsUp} eyes="glow" /></>} />],
        [W(c, 'siempre'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.8, 2.3, 6, 960, 420)} bg={<CityNight />} hero={<Hero x={960} s={1.2} t={t} eyes="glow" />} />],
      ])}
      <DayTag t={t} at={CS(c)} text="DÍA 8" />
      <FutureFX t={t} at={W(c, 'nina')} until={W(c, 'pedalee') - 0.05} />
      <CText t={t} at={W(c, 'millones')} until={W(c, 'llamaban') - 0.05} a="3.000.000" b="DE VISITAS" size={130} y={100} />
      <CText t={t} at={W(c, 'llamaban')} until={W(c, 'maceta') - 0.05} a="EL CHICO" b="QUE LLEGA ANTES" size={130} y={110} />
      <CText t={t} at={W(c, 'siempre', 2)} a="SIEMPRE." size={170} y={130} color="#FFD23F" />
    </AbsoluteFill>
  );
};

// ---------------- 5: el precio ----------------
export const Ch5: F = ({t}) => {
  const c = 5;
  const n = t < W(c, '12') ? 10 : t < W(c, '15') ? 12 : t < W(c, 'dia', 2) ? 15 : 30;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.6, 1.9, 4, 960, 420)} bg={<Room night />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.headHold} eyes="closed" mouth="teeth" />} />],
        [W(c, 'desperte'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.2, 1.4, 5, 900, 700)} bg={<Bedroom night={false} />} hero={<><rect x={560} y={700} width={360} height={90} rx={30} fill="#F8F9FA" stroke="#111" strokeWidth={6} /><ellipse cx={720} cy={740} rx={60} ry={22} fill="#D90429" opacity={0.85} /><Hero x={960} s={1.1} t={t} eyes="wide" mouth="o" /></>} />],
        [W(c, 'sangraba'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.6, 2.8, 3, 960, 400)} bg={<Bedroom night={false} />} hero={<><Hero x={960} s={1.1} t={t} eyes="wide" mouth="o" /><Red x={968} y={GY - 1.1 * 300} s={1.1} /></>} />],
        [W(c, 'apagarlo'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.2, 1.3, 4)} bg={<Street />} hero={<><g opacity={0.4} transform="translate(40 0)"><Hero x={960} s={1.2} t={t + 0.3} pose={POSES.point} /></g><Hero x={960} s={1.2} t={t} eyes="wide" /></>} />],
        [W(c, 'hablaba'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.2, 1.35, 4)} bg={<Room />} hero={<><Hero x={700} s={1.15} t={t} eyes="side" /><NPC x={1250} s={1.15} t={t} color={LEO} flip mouth="open" /><g opacity={0.35} transform="translate(30 -10)"><NPC x={1250} s={1.15} t={t} color={LEO} flip mouth="grin" /></g></>} />],
        [W(c, 'bajaba'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.1, 1.25, 4)} bg={<Room />} mid={<g>{Array.from({length: 6}).map((_, i) => <rect key={i} x={500 + i * 150} y={400 + i * 85} width={170} height={500} fill="#8B5A3C" stroke="#111" strokeWidth={5} />)}</g>} hero={<><g opacity={0.35}><Hero x={720 + Math.min(1, lt / 2) * 600 + 80} y={420 + Math.min(1, lt / 2) * 340 + 85} s={0.9} t={t} /></g><Hero x={720 + Math.min(1, lt / 2) * 600} y={420 + Math.min(1, lt / 2) * 340} s={0.9} t={t} /></>} />],
        [W(c, 'algo'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.0, 1.15, 8)} bg={<CityNight />} hero={<Clock2 x={960} y={640} r={190} sec={lt * 10} />} />],
        [W(c, 'poder'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.6, 2.3, 6, 960, 420)} bg={<CityNight />} hero={<><Hero x={960} s={1.25} t={t} eyes="glow" glow sweat /><path d={`M 900 ${GY - 1.25 * 330} l 30 40 l -20 30 l 35 40`} stroke="#fff" strokeWidth={5} fill="none" opacity={ramp(lt, 1, 3)} /></>} />],
      ])}
      <DayTag t={t} at={W(c, 'dia')} text="DÍA 14" />
      <CText t={t} at={W(c, 'peor')} until={W(c, 'apagarlo') - 0.05} a="Y ESO NO" b="ERA LO PEOR" size={110} y={110} />
      <CText t={t} at={W(c, 'apagarlo')} until={W(c, 'hablaba') - 0.05} a="YA NO PODÍA" b="APAGARLO" size={120} y={110} color2="#FF4D6D" />
      <CText t={t} at={W(c, 'segundos')} until={W(c, 'poder') - 0.05} a={`${n} SEGUNDOS`} size={170} y={110} color={n > 10 ? '#9FFCFF' : '#fff'} />
      <CText t={t} at={W(c, 'rompiendo')} a="ME ESTABA" b="ROMPIENDO" size={130} y={110} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------------- 6: los hombres de gris ----------------
export const Ch6: F = ({t}) => {
  const c = 6;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1, 1.1, 4)} bg={<School />} hero={<Hero x={500 + lt * 60} s={1.0} t={t} />} />],
        [W(c, 'coche'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.2, 1.4, 5, 1300, 700)} bg={<School />} hero={<><BlackCar x={1350} /><Suit x={1150} t={t} /><Suit x={1600} t={t} flip /></>} />],
        [W(c, 'segundos'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.6, 1.9, 4, 900, 500)} bg={<School />} hero={<><Hero x={900} s={1.1} t={t} eyes="wide" /><Suit x={1060} t={t} flip pose={POSES.reach} /></>} />],
        [W(c, 'asi'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.3, 3)} blur={9} bg={<Street dusk />} hero={<><Hero x={300 + lt * 500} s={1.0} t={t} pose={POSES.fly} rotate={15} eyes="angry" /><Suit x={-100 + lt * 420} t={t} /></>} />],
        [W(c, 'sabia'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1, 1.1, 4)} bg={<Alley />} hero={<><Hero x={960} s={1.0} t={t} eyes="glow" />{[0, 1, 2].map((i) => <path key={i} d={`M ${960} ${700} Q ${700 + i * 260} ${400} ${400 + i * 560} ${600}`} stroke="#9FFCFF" strokeWidth={5} strokeDasharray="14 12" fill="none" opacity={0.8} />)}</>} />],
        [W(c, 'escondi'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.35, 4, 900, 700)} bg={<Alley />} mid={<Suit x={1500 - lt * 300} t={t} />} hero={<><Hero x={820} y={GY} s={0.95} t={t} pose={POSES.kneel} eyes="wide" sweat /><Bin x={1000} /></>} />],
        [W(c, 'cruce'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.25, 4)} bg={<Street dusk />} hero={<><TrafficLight x={1400} red={lt > 0.8} /><Hero x={700 + lt * 250} s={1.0} t={t} pose={POSES.fly} rotate={10} /></>} />],
        [W(c, 'pero'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.3, 6, 960, 500)} rain bg={<Alley />} hero={<><Suit x={820} t={t} /><Suit x={1100} t={t} pose={lt > 2.6 ? POSES.phone : POSES.idle} flip /></>} />],
        [W(c, 'ella'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 2.2, 2.5, 4, 1100, 450)} rain bg={<Alley />} hero={<Suit x={1100} t={t} pose={POSES.phone} flip />} />],
      ])}
      <DayTag t={t} at={CS(c)} text="DÍA 21" />
      <FutureFX t={t} at={W(c, 'segundos')} until={W(c, 'asi') - 0.05} label="+30 S" />
      <FutureFX t={t} at={W(c, 'sabia')} until={W(c, 'escondi') - 0.05} label="+30 S" />
      <Say t={t} at={W(c, 'dejalo')} until={W(c, 'ella') + 1.6} text="Déjalo. Ella ya lo ha encontrado." x={1150} y={330} w={620} />
      <CText t={t} at={W(c, 'ella', 2)} a="¿ELLA?" size={200} y={150} color="#FFD23F" />
    </AbsoluteFill>
  );
};

// ---------------- 7: Vera ----------------
const lib = (t: number, cam: any, vera: React.ReactNode, hero: React.ReactNode, mood: any = 'night') => (
  <Cine t={t} mood={mood} cam={cam} bg={<Library />} mid={<LibTable x={960} />} hero={<>{vera}{hero}</>} />
);
export const Ch7: F = ({t}) => {
  const c = 7;
  const rps = W(c, 'jugamos');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => lib(t, kb(lt, 1.0, 1.15, 5), <Vera x={1150} y={GY} s={1.05} t={t} pose={POSES.hips} flip />, <Hero x={300 + Math.min(1, lt / 3) * 300} s={1.05} t={t} />)],
        [W(c, 'antes'), (lt) => lib(t, kb(lt, 1.4, 1.6, 5, 960, 450), <Vera x={1150} s={1.05} t={t} pose={POSES.hips} flip mouth="grin" />, <Hero x={700} s={1.05} t={t} eyes="wide" mouth="o" />)],
        [W(c, 'llamaba'), (lt) => lib(t, kb(lt, 2.6, 2.9, 4, 1150, 420), <Vera x={1150} s={1.05} t={t} pose={POSES.hips} flip mouth="grin" eyes="glow" />, null)],
        [W(c, 'pero'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1, 1.05, 6)} bg={<Library />} hero={<><Hero x={600} s={1.15} t={t} eyes="glow" /><Vera x={1320} s={1.15} t={t} eyes="glow" flip /></>} />],
        [rps, (lt) => {
          const i = Math.floor(lt * 2.6);
          return lib(t, kb(lt, 1.3, 1.45, 5), <><Vera x={1250} s={1.05} t={t} flip mouth="grin" pose={POSES.laugh} /><Hand x={1060} y={560} k={(['tijera', 'papel', 'piedra'] as const)[i % 3]} flip /></>, <><Hero x={650} s={1.05} t={t} eyes="angry" /><Hand x={860} y={560} k={(['papel', 'piedra', 'tijera'] as const)[i % 3]} /></>);
        }],
        [W(c, 'explico'), (lt) => lib(t, kb(lt, 1.0, 1.1, 5), <><Vera x={1050} s={1.05} t={t} flip /><Suit x={1450} t={t} flip /><Suit x={1700} t={t} flip /></>, <Hero x={500} s={1.05} t={t} eyes="wide" />)],
        [W(c, 'juntos'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 1.2, 1.0, 6)} bg={<CityNight />} hero={<><Screen x={960} y={430} s={1.0} glow="#E63946"><circle r={160} fill="#1D3557" /><path d="M -90 -60 q 40 -40 80 0 q 30 40 70 10 M -110 40 q 60 30 120 0" stroke="#52B788" strokeWidth={30} fill="none" /></Screen><Vera x={960} y={1120} s={1.1} t={t} eyes="evil" mouth="grin" /></>} />],
        [W(c, 'dije'), (lt) => lib(t, kb(lt, 2.4, 2.7, 4, 1100, 430), <Vera x={1100} s={1.05} t={t} flip mouth="grin" eyes="happy" />, null)],
      ])}
      <Say t={t} at={W(c, 'hola')} until={W(c, 'llamaba') - 0.05} text="Hola. Ibas a decir «hola»." x={1150} y={360} w={560} />
      <CText t={t} at={W(c, 'vera')} until={W(c, 'pero') - 0.05} a="VERA" size={210} y={120} color="#C77DFF" />
      <CText t={t} at={W(c, '30')} until={rps - 0.05} a="YO: 30 S" b="ELLA: 31 S" size={140} y={110} color2="#C77DFF" />
      <CText t={t} at={W(c, '100')} until={W(c, 'explico') - 0.05} a="0 - 100" size={200} y={100} color="#FF4D6D" />
      <CText t={t} at={W(c, 'eleccion')} until={W(c, 'dije') - 0.05} a="CUALQUIER ELECCIÓN." b="CUALQUIER GUERRA." size={100} y={110} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};

// ---------------- 8: la vision ----------------
export const Ch8: F = ({t}) => {
  const c = 8;
  const out = W(c, 'apagaban');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.4, 6)} bg={<Bedroom />} hero={<Hero x={900} y={760} s={1.1} t={t} rotate={-90} eyes="wide" />} />],
        [W(c, 'horrible'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 2.2, 2.6, 3, 960, 420)} bg={<Bedroom />} hero={<Hero x={960} s={1.2} t={t} eyes="closed" mouth="teeth" sweat />} />],
        [W(c, 'central'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.1, 1.25, 4)} bg={<PowerPlant t={t} />} hero={<><Panel x={1300} t={t} /><Vera x={1050} s={1.0} t={t} pose={POSES.reach} /></>} />],
        [out, (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.1, 3)} bg={<CityNight lights={lt < 0.6} />} hero={null} />],
        [W(c, 'semaforos'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.3, 1.4, 2, 1400, 400)} bg={<Street dusk />} hero={<TrafficLight x={1400} red={false} />} />],
        [W(c, 'hospitales'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.2, 2)} bg={<Hospital dark={1} />} />],
        [W(c, 'trenes'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.1, 1.2, 2)} bg={<Tunnel dark={1} />} />],
        [W(c, 'oscuridad'), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.6, 1.9, 5, 960, 450)} bg={<CityNight lights={false} />} hero={<Vera x={960} s={1.2} t={t} pose={POSES.phone} eyes="glow" mouth="grin" />} />],
        [W(c, 'abri'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 2.6, 2.4, 3, 960, 400)} bg={<Bedroom />} hero={<Hero x={960} s={1.2} t={t} eyes="wide" mouth="o" />} />],
        [W(c, 'unico'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.1, 1.35, 8, 960, 500)} bg={<CityNight />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.fists} eyes="angry" />} />],
        [W(c, 'como', 2), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.0, 1.2, 6)} bg={<CityNight />} hero={<><Hero x={650} s={1.15} t={t} eyes="glow" /><Vera x={1270} s={1.15} t={t} eyes="glow" flip mouth="grin" /></>} />],
      ])}
      <FutureFX t={t} at={W(c, 'horrible')} until={W(c, 'abri') - 0.05} label="+1 MIN" />
      <CText t={t} at={W(c, 'minuto')} until={W(c, 'horrible') - 0.05} a="1 MINUTO" b="DEL FUTURO" size={130} y={110} color="#9FFCFF" />
      <Say t={t} at={W(c, 'ahora')} until={W(c, 'abri') - 0.05} text="Ahora que nadie ve nada, nosotros lo vemos todo." x={1250} y={300} w={620} />
      <CText t={t} at={W(c, '9')} until={W(c, 'unico') - 0.05} a="MAÑANA" b="21:00" size={150} y={100} />
      <CText t={t} at={W(c, 'como', 2)} a="¿CÓMO GANAS A ALGUIEN" b="QUE VE TU SIGUIENTE PASO?" size={86} y={110} />
      <Flash t={t} at={out + 0.6} dur={0.3} color="#000" max={1} />
    </AbsoluteFill>
  );
};

// ---------------- 9: la gorra ----------------
export const Ch9: F = ({t}) => {
  const c = 9;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.1, 1.25, 6)} bg={<Room />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.headHold} eyes="side" />} />],
        [W(c, 'vera'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.0, 1.1, 6)} bg={<Room />} hero={<><Hero x={650} s={1.15} t={t} /><Vera x={1270} s={1.15} t={t} flip eyes="glow" /><path d="M 760 500 L 1150 500" stroke="#9FFCFF" strokeWidth={6} strokeDasharray="16 14" /></>} />],
        [W(c, 'asi'), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.3, 1.5, 5, 960, 650)} bg={<Room />} hero={<><Table x={960} />{Array.from({length: Math.min(6, Math.floor(lt * 2.5))}).map((_, i) => <Note key={i} x={700 + (i % 3) * 260} y={620 - Math.floor(i / 3) * 90} s={0.4} text={`PLAN ${i + 1}`} />)}</>} />],
        [W(c, 'meti'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.8, 2.0, 4, 960, 600)} bg={<Room />} hero={<Cap x={960} y={700} s={1.6} />} />],
        [W(c, 'fui'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1, 1.1, 4)} bg={<PowerPlant t={t} />} hero={<Hero x={400 + lt * 200} s={1.0} t={t} pose={POSES.fists} eyes="angry" />} />],
        [W(c, '859'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.1, 3)} rain bg={<Rooftop />} mid={<Panel x={1500} t={t} />} hero={<Vera x={1320} y={760} s={1.1} t={t} pose={POSES.reach} flip />} />],
        [W(c, 'vio'), (lt) => roof(t, kb(lt, 1.3, 1.45, 4, 1100, 450))],
        [W(c, 'ahi'), (lt) => roof(t, kb(lt, 1.0, 1.05, 3))],
        [W(c, 'nueve'), (lt) => roof(t, kb(lt, 2.4, 2.6, 2, 1260, 380))],
        [W(c, 'ocho'), (lt) => roof(t, kb(lt, 1.3, 1.4, 2))],
        [W(c, 'siete'), (lt) => roof(t, kb(lt, 2.6, 2.8, 2, 640, 400))],
        [W(c, 'meti', 2), (lt) => <Cine t={t} mood="night" cam={kb(lt, 2.0, 2.3, 4, 960, 600)} rain bg={<Rooftop />} hero={<><Cap x={960} y={700} s={1.6} /><rect x={900} y={500 + Math.max(0, 1 - lt) * 150} width={120} height={160} fill="#FFF8E7" stroke="#111" strokeWidth={5} /></>} />],
        [W(c, 'vera', 2), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.6, 2.8, 4, 960, 400)} rain bg={<Rooftop />} hero={<Vera x={960} y={760} s={1.1} t={t} eyes="wide" mouth="o" />} />],
      ])}
      <CText t={t} at={W(c, 'si')} until={W(c, 'asi') - 0.05} a="SI NO DECIDO NADA..." b="ELLA NO VE NADA" size={110} y={110} />
      <CText t={t} at={W(c, '20')} until={W(c, 'meti') - 0.05} a="20 PLANES" size={160} y={110} />
      <CText t={t} at={W(c, '859')} until={W(c, 'vio') - 0.05} a="20:59" size={200} y={100} color="#FF4D6D" />
      <Say t={t} at={W(c, 'te')} until={W(c, 'ahi') - 0.05} text="Te quedan 10 segundos." x={1260} y={300} w={460} />
      <CText t={t} at={W(c, 'ahi')} until={W(c, 'nueve') - 0.05} a="Y AQUÍ EMPEZÓ" b="ESTE VÍDEO" size={120} y={110} />
      <Count t={t} at={W(c, 'nueve')} until={W(c, 'ocho')} n="9" />
      <Count t={t} at={W(c, 'ocho')} until={W(c, 'siete')} n="8" />
      <Count t={t} at={W(c, 'siete')} until={W(c, 'meti', 2)} n="7" />
      <FutureFX t={t} at={W(c, 'vio')} until={W(c, 'meti', 2)} label="10 S" />
      <CText t={t} at={W(c, 'tampoco')} a="?? S" size={220} y={120} color="#9FFCFF" />
    </AbsoluteFill>
  );
};

// ---------------- 10: suelta ----------------
export const Ch10: F = ({t}) => {
  const c = 10;
  const pull = W(c, 'cable', 2);
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 2.6, 2.9, 4, 1260, 400)} rain bg={<Rooftop />} hero={<Vera x={1260} y={760} s={1.1} t={t} eyes="scared" mouth="o" flip />} />],
        [W(c, 'desdoble'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.6, 1.8, 3, 960, 540)} rain bg={<Rooftop />} hero={<Note x={960} y={540} s={1.5} text="SUELTA" k={easeOut(Math.min(1, lt * 1.5))} />} />],
        [W(c, 'asi'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.2, 1.35, 5, 900, 600)} rain bg={<Rooftop />} mid={<Panel x={1450} t={t} />} hero={<><Hero x={600} y={760} s={1.1} t={t} pose={lt > 0.8 ? POSES.armsUp : POSES.tug} eyes="angry" /><path d={`M 660 560 C 900 ${600 + (lt > 0.8 ? 120 : 0)} 1200 ${600} 1600 560`} stroke="#E9C46A" strokeWidth={8} fill="none" /></>} />],
        [pull, (lt) => <Cine t={t} mood="night" cam={{...kb(lt, 1.5, 1.7, 3, 1500, 520), x: Math.sin(t * 60) * 6 * (1 - Math.min(1, lt))}} rain bg={<Rooftop />} hero={<Panel x={1450} t={t} sparks={Math.min(1, lt * 2)} on={lt < 1.5} />} />],
        [W(c, 'vera'), (lt) => <Cine t={t} mood="red" cam={kb(lt, 2.4, 2.7, 3, 1260, 400)} rain bg={<Rooftop />} hero={<Vera x={1260} y={760} s={1.1} t={t} eyes="angry" mouth="open" pose={POSES.headHold} flip />} />],
        [W(c, 'luces'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.15, 5)} bg={<CityNight lights={lt > 1.6 || Math.floor(lt * 10) % 2 === 0} />} />],
        [W(c, 'seis'), (lt) => roof(t, kb(lt, 1.1, 1.2, 3), 'scared', 'normal')],
        [W(c, 'hombres'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.0, 1.1, 5)} rain bg={<Rooftop />} hero={<><Hero x={500} y={760} s={1.05} t={t} /><Vera x={1050} y={760} s={1.05} t={t} eyes="scared" flip /><Suit x={1450} y={760} t={t} flip /><NPC x={1700} y={760} s={1.1} t={t} color={COP} flip pose={POSES.point} /></>} />],
        [W(c, 'vera', 2), (lt) => <Cine t={t} mood="cold" cam={kb(lt, 1.8, 2.1, 5, 1100, 450)} rain bg={<Rooftop />} hero={<><Vera x={1100} y={760} s={1.1} t={t} eyes="evil" mouth="flat" /><NPC x={1350} y={760} s={1.1} t={t} color={COP} flip /></>} />],
      ])}
      <Say t={t} at={W(c, 'esto')} until={W(c, 'veo') - 0.05} text="Esto no ha terminado." x={1100} y={300} w={460} />
      <CText t={t} at={W(c, 'veo')} a="VEO MUY," b="MUY LEJOS." size={130} y={110} color2="#C77DFF" />
      <Count t={t} at={W(c, 'seis')} until={W(c, 'cinco')} n="6" />
      <Count t={t} at={W(c, 'cinco')} until={W(c, 'cuatro')} n="5" />
      <Count t={t} at={W(c, 'cuatro')} until={W(c, 'hombres')} n="4" />
      <Flash t={t} at={pull} dur={0.3} color="#FFE45C" max={0.8} />
    </AbsoluteFill>
  );
};

// ---------------- 11: tu ----------------
export const Ch11: F = ({t}) => {
  const c = 11;
  const n = t < W(c, 'hoy') ? '1 HORA' : '1 DÍA';
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Cine t={t} mood="day" cam={kb(lt, 1.0, 1.15, 6)} bg={<Room />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.hips} />} />],
        [W(c, 'ayer'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.0, 1.1, 5)} bg={<CityNight />} hero={<Clock2 x={960} y={640} r={190} sec={lt * 30} />} />],
        [W(c, 'anoche'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 1.8, 2.4, 6, 960, 420)} bg={<Bedroom />} hero={<Hero x={960} s={1.2} t={t} eyes="glow" glow />} />],
        [W(c, 'era', 4), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.6, 1.1, 4, 960, 480)} bg={<CityNight lights={false} />} hero={<Screen x={960} y={480} s={1.3} glow="#4CC9F0"><g opacity={easeOut(ramp(lt, 1, 2.2))}><circle cx={0} cy={-40} r={90} fill="#0B0A1A" /><path d="M -170 230 Q -170 60 0 60 Q 170 60 170 230 Z" fill="#0B0A1A" /></g></Screen>} />],
        [W(c, 'se'), (lt) => <Cine t={t} mood="night" cam={kb(lt, 2.4, 3.0, 8, 960, 400)} bg={<Bedroom />} hero={<Hero x={960} s={1.2} t={t} eyes="glow" mouth="flat" />} />],
        [W(c, 'comentarios'), (lt) => <Cine t={t} mood="dusk" cam={kb(lt, 1.1, 1.2, 6)} bg={<CityNight />} hero={<><Hero x={760} s={1.2} t={t} pose={POSES.pointDown} eyes="happy" mouth="grin" /><g transform={`translate(1300 ${720 + Math.sin(t * 6) * 20})`}><path d="M -40 -140 L 40 -140 L 40 0 L 100 0 L 0 120 L -100 0 L -40 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={8} strokeLinejoin="round" /></g></>} />],
        [W(c, 'porque'), (lt) => <Cine t={t} mood="future" cam={kb(lt, 1.3, 1.0, 5)} bg={<CityNight />} hero={<Hero x={960} s={1.25} t={t} eyes="glow" glow />} />],
      ])}
      <CText t={t} at={W(c, 'ayer')} until={W(c, 'anoche') - 0.05} a={n} b="DEL FUTURO" size={150} y={110} color="#9FFCFF" />
      <CText t={t} at={W(c, 'tu')} until={W(c, 'se') - 0.05} a="ESTABAS TÚ." size={150} y={110} color="#FFD23F" />
      <CText t={t} at={W(c, 'comentarios')} until={W(c, 'porque') - 0.05} a="¿QUÉ HARÍAS TÚ" b="CON 10 SEGUNDOS DEL FUTURO?" size={92} y={110} />
      <CText t={t} at={W(c, 'porque')} a="EL FUTURO SOLO PASA" b="SI ALGUIEN LO DECIDE" size={96} y={110} />
      <FutureFX t={t} at={W(c, 'se')} until={W(c, 'comentarios') - 0.05} label="+10 S" />
    </AbsoluteFill>
  );
};

export const CHAPTERS: F[] = [Ch0, Ch1, Ch2, Ch3, Ch4, Ch5, Ch6, Ch7, Ch8, Ch9, Ch10, Ch11];
export {CE};
