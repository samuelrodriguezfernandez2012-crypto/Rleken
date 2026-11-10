import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LW, LH, GY, W, CS, CE, Big, Bub, LFlash, shakeL, seqPose, pick, Hero, NPC, POSES, ramp, easeOut, pop, rnd, LWorld} from './kit';
import {Scene, shots} from './scene';
import {Kitchen, Table, WallClock, Glass, Bedroom, Notebook, Classroom, Desk, Yard, Street, Truck, Cat, Studio, Crowd, Mirror, Bathroom, Plaza, Rain, Birds, PocketWatch, Phone} from './props';
import {SpeedLines, Sparkles} from '../../fx';

const BRO = '#06D6A0', BULLY = '#E63946', GIRL = '#F72585', GRAY = '#8D99AE';

// ---------------- capitulo 0: gancho (dia 100) ----------------
const frozenPlaza = (t: number, heroX: number, cam = {}, extra?: React.ReactNode, age = 60) => (
  <Scene
    t={t} frozen cam={cam}
    bg={<><Plaza storm /><Birds t={t} frozen /><Rain t={t} frozen /></>}
    npc={<>{[300, 560, 1250, 1700].map((x, i) => <NPC key={i} x={x} s={1.05} color={['#E63946', '#FFB703', '#8338EC', '#F72585'][i]} pose={i % 2 ? POSES.point : POSES.idle} flip={i > 1} />)}</>}
    hero={<><Hero x={heroX} s={1.25} age={age} t={t} cane pose={{...POSES.idle, legL: [Math.sin(t * 5) * 18, 6], legR: [-Math.sin(t * 5) * 18, -6]}} eyes="normal" />{extra}</>}
  />
);

export const Ch0: React.FC<{t: number}> = ({t}) => {
  const c = 0;
  const flashes = [W(c, 'hace'), W(c, 'hace') + 0.9, W(c, 'hace') + 1.8, W(c, 'hace') + 2.7];
  return (
    <AbsoluteFill>
      {shots(t, [
        [0, (lt) => frozenPlaza(t, 900, {s: 1.9 - 0.5 * easeOut(ramp(lt, 0, 1.4)), ox: 900, oy: 560})],
        [W(c, 'el'), (lt) => frozenPlaza(t, 820 + lt * 60, {s: 1.15 - 0.1 * ramp(lt, 0, 2)})],
        [W(c, 'los'), (lt) => frozenPlaza(t, 900, {s: 2.2, ox: 900, oy: 250, x: -lt * 30})],
        [W(c, 'la'), (lt) => frozenPlaza(t, 950, {s: 1.8 + lt * 0.05, ox: 400, oy: 500})],
        [W(c, 'y'), (lt) => frozenPlaza(t, 600 + lt * 90, {s: 1.1, ox: 600 + lt * 90})],
        [W(c, 'tengo'), (lt) => frozenPlaza(t, 960, {s: 1.6 + lt * 0.04, ox: 960, oy: 560}, null)],
        [W(c, 'y', 2), (lt) => frozenPlaza(t, 960, {s: 2.4, ox: 960, oy: 520})],
        [flashes[0], () => (
          <Scene t={t} frozen bg={<Kitchen />} npc={<><Table x={960} /></>} hero={<><Hero x={760} s={1.15} t={t} eyes="wide" mouth="o" /><Glass x={1000} y={760} rot={30} drops={8} t={t} /></>} />
        )],
        [flashes[1], () => (
          <Scene t={t} frozen bg={<Street />} npc={<><Truck x={1500} /><Cat x={1000} y={830} scared /></>} hero={<Hero x={700} s={1.1} t={t} pose={POSES.fly} rotate={70} eyes="angry" />} />
        )],
        [flashes[2], () => <Scene t={t} bg={<Studio t={t} />} npc={<Crowd t={t} cheer />} hero={<Hero x={960} s={1.2} t={t} pose={POSES.cheer} age={25} />} />],
        [flashes[3], () => (
          <Scene t={t} bg={<Bathroom />} npc={<Mirror x={960} y={500} w={700} h={760}><Hero x={960} y={1300} s={2.6} t={t} age={20} eyes="wide" mouth="o" /></Mirror>} />
        )],
        [W(c, 'pero'), (lt) => {
          const age = 12 + 48 * easeOut(ramp(t, W(c, 'cada'), W(c, 'matando') + 0.4));
          return (
            <Scene t={t} bg={<rect width={LW} height={LH} fill="#1B0F2E" />} hero={
              <g>
                <g transform={`translate(960 470) rotate(${lt * 240})`}>
                  {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-330} x2={0} y2={-300} stroke="#FFE24A" strokeWidth={8} transform={`rotate(${i * 30})`} />)}
                </g>
                <Hero x={960} s={1.35} t={t} age={age} eyes={age > 40 ? 'scared' : 'normal'} mouth={age > 40 ? 'o' : 'flat'} cane={age > 50} sweat={age > 30} />
              </g>
            } />
          );
        }],
        [W(c, 'esta', 2), (lt) => (
          <Scene t={t} frozen bg={<><Plaza storm /><Rain t={t} frozen /></>} hero={<Hero x={1500} s={1.2} t={t} age={60} cane />} fx={<PocketWatch x={420} y={560} s={1.3} t={t} light={1} open />} />
        )],
      ])}
      <Big t={t} at={0.1} until={W(c, 'el') - 0.05} text="DÍA 100" size={230} y={560} />
      <Big t={t} at={W(c, 'congelado')} until={W(c, 'los') - 0.05} text="TODO CONGELADO" size={120} color="#BDF2FF" />
      <Big t={t} at={W(c, 'unico')} until={W(c, 'tengo') - 0.05} text={'SOY EL ÚNICO\nQUE SE MUEVE'} size={110} color="#fff" />
      <Big t={t} at={0} until={W(c, 'y', 2) - 0.05} text={(() => { const r = Math.max(0, 180 - Math.floor(t)); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; })()} size={240} color="#FF3B5C" y={180} />
      <Big t={t} at={W(c, 'siempre')} until={W(c, 'y', 2) - 0.05} text="...PARA SIEMPRE" size={90} color="#fff" y={950} />
      <Big t={t} at={W(c, 'culpa')} until={W(c, 'hace') - 0.05} text="LA CULPA ES MÍA" size={130} color="#FF3B5C" />
      <Big t={t} at={W(c, 'parar')} until={W(c, 'pero') - 0.05} text="¡PARAR EL TIEMPO!" size={140} />
      <Big t={t} at={W(c, 'trampa')} until={W(c, 'cada') - 0.05} text="PERO HABÍA UNA TRAMPA..." size={110} color="#FF3B5C" />
      <Big t={t} at={W(c, 'matando')} until={W(c, 'esta', 2) - 0.05} text="¡ME IBA MATANDO!" size={150} color="#FF3B5C" wiggle />
      <Big t={t} at={W(c, 'esta', 2) + 0.1} text={'SOBREVIVÍ 100 DÍAS\nCON UN PODER QUE ME IBA MATANDO'} size={86} y={190} />
      {flashes.map((f, i) => <LFlash key={i} t={t} at={f} dur={0.15} />)}
      <LFlash t={t} at={W(c, 'matando')} dur={0.3} color="#FF0030" max={0.6} />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 1: dia 1, el vaso de leche ----------------
export const Ch1: React.FC<{t: number}> = ({t}) => {
  const c = 1;
  const slip = W(c, 'resbalo'), freeze = W(c, 'golpe') + 0.3, touch = W(c, 'toque'), unfreeze = W(c, 'volvio'), crash = W(c, 'estrello');
  const fall = (tt: number) => {
    if (tt < slip) return {y: 690, rot: 0};
    if (tt < freeze) {
      const k = (tt - slip) / (freeze - slip);
      return {y: 690 + k * 150, rot: k * 60};
    }
    if (tt < unfreeze) return {y: 840, rot: 60};
    const k = Math.min(1, (tt - unfreeze) / 0.25);
    return {y: 840 + k * 30, rot: 60 + k * 30};
  };
  const frozen = t >= freeze && t < unfreeze;
  const g = fall(t);
  const broken = t >= unfreeze + 0.25;
  const kitchen = (cam = {}, heroEyes: any = 'closed', heroPose = POSES.idle) => (
    <Scene
      t={t} frozen={frozen} cam={cam}
      bg={<><Kitchen /><WallClock x={1000} y={230} sec={frozen ? 37 : 37 + (t - CS(c)) * 1} /></>}
      npc={<><Table x={960} w={760} /><NPC x={1350} s={0.95} color={BRO} pose={POSES.idle} flip t={t} eyes={t < crash ? 'closed' : 'wide'} mouth={t < crash ? 'open' : 'open'} /></>}
      hero={
        <g>
          <Hero x={620} s={1.15} t={t} pose={heroPose} eyes={heroEyes} mouth={t < freeze ? 'flat' : 'o'} look={1} />
          {!broken ? <Glass x={820} y={g.y} rot={g.rot} drops={frozen ? 10 : 0} t={t} /> : (
            <g>
              {Array.from({length: 9}).map((_, i) => <polygon key={i} points={`${760 + i * 22},${GY - 6} ${776 + i * 22},${GY - 26} ${790 + i * 22},${GY - 4}`} fill="#fff" stroke="#111" strokeWidth={3} />)}
              <ellipse cx={850} cy={GY - 2} rx={150} ry={16} fill="#fff" stroke="#111" strokeWidth={4} />
            </g>
          )}
        </g>
      }
    />
  );
  const sh = shakeL(t, [[crash, 0.4, 20]]);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      {shots(t, [
        [CS(c), (lt) => kitchen({s: 1.05 + lt * 0.01}, 'closed', {...POSES.idle, armR: [70, -40]})],
        [slip, () => kitchen({s: 1.35, ox: 800, oy: 700}, 'wide', {...POSES.idle, armR: [80, 0]})],
        [W(c, 'cerre'), () => kitchen({s: 1.5, ox: 650, oy: 450}, 'closed')],
        [W(c, 'abri'), () => kitchen({s: 1.5, ox: 650, oy: 450}, 'wide')],
        [W(c, 'flotando'), (lt) => kitchen({s: 2.4 + lt * 0.05, ox: 820, oy: 820}, 'wide')],
        [W(c, 'gotas'), (lt) => kitchen({s: 3.2, ox: 830, oy: 700, x: -lt * 20}, 'wide')],
        [W(c, 'reloj'), () => kitchen({s: 2.6, ox: 1000, oy: 240}, 'wide')],
        [W(c, 'hermano'), () => kitchen({s: 2.0, ox: 1350, oy: 560}, 'wide')],
        [touch, () => kitchen({s: 1.6, ox: 800, oy: 700}, 'normal', {...POSES.reach, armR: [100, 0]})],
        [W(c, 'mi', 2), () => kitchen({s: 1.1}, 'wide', POSES.scared)],
        [W(c, 'mirando'), (lt) => (
          <Scene t={t} bg={<rect width={LW} height={LH} fill="#FFE8A3" />} hero={<Hero x={960} y={1500} s={2.6} t={t} pose={POSES.hands} eyes="wide" mouth="o" />} />
        )],
        [W(c, 'esa'), () => (
          <Scene t={t} bg={<Bedroom />} hero={<Hero x={640} y={760} s={1.0} t={t} pose={{...POSES.idle, armL: [-60, 150], armR: [60, -150]}} eyes="wide" rotate={0} />} />
        )],
        [W(c, 'intente'), (lt) => {
          const pulse = Math.floor(lt * 1.6) % 2 === 0;
          return <Scene t={t} frozen={pulse} bg={<Bedroom />} hero={<Hero x={900} s={1.2} t={t} pose={pulse ? POSES.point : POSES.idle} eyes={pulse ? 'angry' : 'normal'} />} />;
        }],
        [W(c, 'apunte'), (lt) => (
          <Scene t={t} bg={<rect width={LW} height={LH} fill="#2B3150" />} hero={<Notebook x={960} y={560} s={1.5} lines={['DÍA 1: 1 SEGUNDO']} k={ramp(lt, 0.3, 2.5)} />} />
        )],
        [W(c, 'no', 2), (lt) => (
          <Scene t={t} bg={<rect width={LW} height={LH} fill="#1B0F2E" />} hero={<><Notebook x={960} y={560} s={1.5 + lt * 0.08} lines={['DÍA 1: 1 SEGUNDO']} /><WallClock x={1520} y={260} r={110} sec={-(lt * 20)} /></>} />
        )],
      ])}
      <Big t={t} at={W(c, 'leche')} until={slip - 0.05} text="UN VASO DE LECHE..." size={100} color="#fff" />
      <Big t={t} at={W(c, 'nunca')} until={W(c, 'abri') - 0.05} text="...NUNCA LLEGÓ" size={120} color="#BDF2FF" />
      <Big t={t} at={W(c, 'flotando')} until={W(c, 'gotas') - 0.05} text="¡FLOTANDO!" size={140} color="#BDF2FF" />
      <Big t={t} at={crash} until={W(c, 'mi', 2) + 1.2} text="¡CRASH!" size={170} />
      <Bub t={t} at={W(c, 'grito')} until={W(c, 'mirando')} text="¡AAAAH!" x={1350} y={430} w={300} size={60} shout />
      <Big t={t} at={W(c, 'parado', 2)} until={W(c, 'solo') - 0.05} text="¡PARÉ EL TIEMPO!" size={150} wiggle />
      <Big t={t} at={W(c, 'solo')} until={W(c, 'esa') - 0.05} text="1 SEGUNDO" size={180} color="#6EF0FF" />
      <Big t={t} at={W(c, 'cuenta')} text="UNA CUENTA ATRÁS..." size={110} color="#FF3B5C" />
      <LFlash t={t} at={freeze} dur={0.3} color="#BDF2FF" />
      <LFlash t={t} at={unfreeze} dur={0.2} />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 2: dias 2-9, tonterias ----------------
export const Ch2: React.FC<{t: number}> = ({t}) => {
  const c = 2;
  const tie0 = W(c, 'ate'), fallT = W(c, 'cayo') - 0.2, exam = W(c, 'examen') - 0.4, race = W(c, 'seis') - 0.4, fries = W(c, 'ocho') - 0.4, best = W(c, 'era'), mirror = W(c, 'porque');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => (
          <Scene t={t} bg={<rect width={LW} height={LH} fill="#2B3150" />} hero={<Notebook x={960} y={560} s={1.5} lines={['DÍA 1: 1 SEGUNDO', 'DÍA 2: 2 SEGUNDOS', 'DÍA 3: 3 SEGUNDOS']} k={0.34 + ramp(t, CS(c), W(c, 'tres', 2) + 0.5) * 0.66} />} />
        )],
        [W(c, 'cada'), (lt) => (
          <Scene t={t} bg={<rect width={LW} height={LH} fill="#1B263B" />} hero={<g>
            {Array.from({length: 9}).map((_, i) => <rect key={i} x={360 + i * 140} y={820 - (i + 1) * 60 * Math.min(1, ramp(lt, i * 0.3, i * 0.3 + 0.4))} width={100} height={(i + 1) * 60 * Math.min(1, ramp(lt, i * 0.3, i * 0.3 + 0.4))} rx={12} fill="#FFE24A" stroke="#111" strokeWidth={6} />)}
          </g>} />
        )],
        [W(c, 'y'), (lt) => <Scene t={t} bg={<Yard />} hero={<Hero x={960} s={1.3} t={t} pose={POSES.shrug} mouth="smile" eyes="side" look={1} />} />],
        [W(c, 'en'), (lt) => {
          const frozen = t >= tie0 && t < fallT;
          const fell = t >= fallT;
          return (
            <Scene t={t} frozen={frozen} cam={{s: 1.15, ox: 1100, oy: 700}}
              bg={<Yard />}
              npc={<NPC x={1250} s={1.45} color={BULLY} t={t} pose={fell ? POSES.scared : POSES.hips} rotate={fell ? -80 * easeOut(ramp(t, fallT, fallT + 0.4)) : 0} eyes={fell ? 'wide' : 'angry'} mouth={fell ? 'open' : 'smile'} flip />}
              hero={<Hero x={frozen ? 1150 : 700} s={1.2} t={t} pose={frozen ? POSES.kneel : POSES.idle} eyes={frozen ? 'angry' : 'side'} mouth={fell ? 'grin' : 'flat'} look={1} />}
            />
          );
        }],
        [exam, (lt) => {
          const frozen = t >= W(c, 'pare') && t < W(c, 'saque');
          return (
            <Scene t={t} frozen={frozen} bg={<Classroom />}
              npc={<><NPC x={1250} y={GY + 40} s={1.0} color={GIRL} t={t} pose={POSES.idle} eyes="closed" /><Desk x={1250} paper="10" /></>}
              hero={<><Hero x={frozen ? 1080 : 650} y={GY + 40} s={1.0} t={t} pose={frozen ? POSES.reach : POSES.idle} eyes={frozen ? 'side' : 'normal'} look={1} /><Desk x={650} paper={t >= W(c, 'saque') ? '10' : undefined} /></>}
            />
          );
        }],
        [race, (lt) => {
          const phase = Math.floor(lt * 2.2) % 2 === 0 && t > W(c, 'paraba') && t < W(c, 'todo');
          const hx = 300 + Math.min(1, ramp(t, W(c, 'gane'), W(c, 'todo'))) * 1300;
          return (
            <Scene t={t} frozen={phase} bg={<Yard track />}
              npc={<>{[0, 1].map((i) => <NPC key={i} x={250 + ramp(t, W(c, 'gane'), W(c, 'todo')) * (500 + i * 120)} y={GY + 30 + i * 30} s={0.9} color={['#FFB703', '#8338EC'][i]} t={t} pose={{...POSES.idle, legL: [Math.sin(t * 14) * 30, -20], legR: [-Math.sin(t * 14) * 30, -20]}} />)}<rect x={1650} y={500} width={14} height={420} fill="#fff" stroke="#111" strokeWidth={4} /></>}
              hero={<Hero x={hx} y={GY + 60} s={1.0} t={t} pose={phase ? POSES.idle : {...POSES.idle, legL: [Math.sin(t * 14) * 30, -20], legR: [-Math.sin(t * 14) * 30, -20]}} eyes="happy" mouth="smile" />}
              fx={t > W(c, 'todo') ? <Crowd t={t} cheer y={LH + 120} /> : null}
            />
          );
        }],
        [fries, (lt) => {
          const frozen = Math.floor(lt * 0.8) % 2 === 1;
          return (
            <Scene t={t} frozen={frozen} bg={<Kitchen />}
              npc={<><Table x={960} w={800} /><ellipse cx={1180} cy={694} rx={90} ry={18} fill="#fff" stroke="#111" strokeWidth={5} />{Array.from({length: 6 - Math.floor(lt / 1.3)}).map((_, i) => <rect key={i} x={1120 + i * 20} y={664} width={12} height={34} fill="#FFD166" stroke="#111" strokeWidth={3} transform={`rotate(${i * 12 - 30} ${1126 + i * 20} 680)`} />)}<NPC x={1320} s={0.95} color={BRO} pose={POSES.shrug} flip t={t} eyes={frozen ? 'normal' : 'side'} /></>}
              hero={<Hero x={frozen ? 1100 : 640} s={1.15} t={t} pose={frozen ? POSES.reach : POSES.idle} eyes="side" mouth="smile" look={1} />}
            />
          );
        }],
        [best, (lt) => {
          const doubt = t >= W(c, 'o');
          return (
            <AbsoluteFill style={{filter: doubt ? 'grayscale(0.8)' : undefined}}>
              <Scene t={t} bg={<rect width={LW} height={LH} fill="#FFB703" />} hero={<Hero x={960} s={1.4} t={t} pose={POSES.cheer} eyes={doubt ? 'side' : 'happy'} mouth={doubt ? 'flat' : 'grin'} />} />
            </AbsoluteFill>
          );
        }],
        [mirror, (lt) => {
          const zoom = t >= W(c, 'pelo') - 0.2 ? easeOut(ramp(t, W(c, 'pelo') - 0.2, W(c, 'pelo') + 0.4)) : 0;
          return (
            <Scene t={t} cam={{s: 1 + zoom * 1.6, ox: 960, oy: 330}} bg={<Bathroom />}
              npc={<Mirror x={960} y={470} w={760} h={720}><Hero x={960} y={1330} s={2.6} t={t} age={13} eyes={zoom > 0 ? 'wide' : 'normal'} mouth={t > W(c, 'rei') ? 'smile' : 'flat'} /></Mirror>}
              fx={zoom > 0 ? <circle cx={890} cy={300} r={60 + Math.sin(t * 8) * 6} fill="none" stroke="#FF3B5C" strokeWidth={8} /> : null}
            />
          );
        }],
      ])}
      <Big t={t} at={W(c, 'tonterias')} until={W(c, 'en') - 0.05} text="PARA TONTERÍAS" size={130} />
      <Big t={t} at={fallT} until={exam - 0.05} text="¡DE MORROS!" size={150} wiggle />
      <Big t={t} at={W(c, 'saque')} until={race - 0.05} text="¡UN 10!" size={190} color="#3DDC84" />
      <Big t={t} at={W(c, 'flipaba')} until={fries - 0.05} text="¡1º!" size={190} />
      <Bub t={t} at={W(c, 'todavia')} until={best} text="¿Y MIS PATATAS?" x={1320} y={380} w={360} />
      <Big t={t} at={best} until={W(c, 'o') - 0.05} text={'EL MEJOR PODER\nDEL MUNDO'} size={120} wiggle />
      <Big t={t} at={W(c, 'o')} until={mirror - 0.05} text="...O ESO PENSABA" size={110} color="#fff" rotate={0} />
      <Big t={t} at={W(c, 'pelo')} until={W(c, 'ojala') - 0.05} text="UN PELO BLANCO" size={130} color="#fff" />
      <Big t={t} at={W(c, 'ojala')} text={'OJALÁ NO ME\nHUBIERA REÍDO'} size={100} color="#FF3B5C" />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 3: dia 10, el gato y el camion ----------------
export const Ch3: React.FC<{t: number}> = ({t}) => {
  const c = 3;
  const stop = W(c, 'pare');
  const resume = W(c, 'tiempo', 2);
  const frozen = t >= stop + 0.3 && t < resume;
  const truckX = t < stop ? 2300 - (t - W(c, 'volvia')) * 120 : t < resume ? 2300 - (stop - W(c, 'volvia')) * 120 : 1300 - (t - resume) * 1600;
  const catSaved = t >= W(c, 'llevé') - 0.2;
  const girlSaved = t >= W(c, 'aparte');
  const heroX = pick(t, [[stop, 450], [W(c, 'corri'), 760], [W(c, 'cogi'), 980], [W(c, 'acera'), 560], [W(c, 'entonces'), 620], [W(c, 'cuatro'), 1200], [W(c, 'aparte'), 1000]]);
  const street = (cam = {}) => (
    <Scene t={t} frozen={frozen} cam={cam}
      bg={<Street />}
      npc={<>
        <Truck x={truckX} />
        {!catSaved && <Cat x={1000 + (frozen ? 0 : Math.min(0, (t - W(c, 'gato')) * 0))} y={820} scared={t > W(c, 'camion')} />}
        <NPC x={girlSaved ? 1000 : 1260} y={640} s={0.85} color={GIRL} t={t} pose={POSES.idle} flip eyes={t > W(c, 'la', 4) ? 'wide' : 'closed'} />
      </>}
      hero={<>
        <Hero x={heroX} y={t >= stop && t < resume ? 660 : 640} s={1.0} t={t} pose={frozen ? {...POSES.idle, legL: [Math.sin(t * 12) * 30, -20], legR: [-Math.sin(t * 12) * 30, -20], armR: catSaved && !girlSaved ? [60, -60] : [20, -10]} : POSES.idle} eyes={frozen ? 'angry' : 'normal'} age={14} look={1} />
        {catSaved && <Cat x={girlSaved ? 470 : heroX + 50} y={girlSaved ? 640 : 540} s={0.7} />}
      </>}
    />
  );
  const n = pick(t, [[0, 10], [(W(c, '10', 3) + W(c, 'ocho')) / 2, 9], [W(c, 'ocho'), 8], [W(c, 'siete'), 7], [W(c, 'siete') + 2, 6], [W(c, 'siete') + 4, 5], [W(c, 'cuatro'), 4], [W(c, 'tres'), 3], [W(c, 'tres') + 1.3, 2], [W(c, 'uno'), 1]]);
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Scene t={t} bg={<Street dusk={false} />} hero={<Hero x={500 + lt * 80} y={640} s={1.0} t={t} age={14} pose={{...POSES.idle, legL: [Math.sin(t * 6) * 20, 4], legR: [-Math.sin(t * 6) * 20, -4]}} />} />],
        [W(c, 'un'), () => street({s: 1.05})],
        [W(c, 'conductor'), (lt) => street({s: 2.6, ox: truckX + 150, oy: 680})],
        [stop, () => street({s: 1.1})],
        [W(c, 'corri'), (lt) => street({s: 1.25, ox: heroX, oy: 650})],
        [W(c, 'entonces'), () => street({s: 1.6, ox: 1260, oy: 520})],
        [W(c, 'cuatro'), (lt) => street({s: 1.2, ox: heroX, oy: 650})],
        [resume, (lt) => street({s: 1.05, x: Math.sin(t * 60) * 12 * (1 - ramp(lt, 0, 1))})],
        [W(c, 'la', 5), () => street({s: 1.8, ox: 900, oy: 520})],
        [W(c, 'alguien'), (lt) => (
          <Scene t={t} bg={<rect width={LW} height={LH} fill="#3A0CA3" />} hero={<Phone x={960} y={560} s={1.4} t={t} views={Math.round(Math.pow(Math.min(1, ramp(t, W(c, 'esa'), W(c, 'millon') + 0.3)), 2) * 1000000)} />} />
        )],
        [W(c, 'me', 2), (lt) => <Scene t={t} bg={<rect width={LW} height={LH} fill="#FFB703" />} hero={<Hero x={960} s={1.4} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" age={14} />} />],
        [W(c, 'pero'), (lt) => (
          <Scene t={t} bg={<Bedroom />} hero={<g>
            <Hero x={960} s={1.3} t={t} pose={{...POSES.idle, armR: [40, -130]}} eyes="closed" mouth="frown" age={14} sweat />
            <path d={`M 960 ${520} m -34 0 a 34 34 0 0 1 68 0 a 34 34 0 0 1 68 0 q 0 50 -68 90 q -68 -40 -68 -90 z`} transform={`translate(-34 -20) scale(${1 + Math.abs(Math.sin(t * 6)) * 0.15})`} fill="#E0002A" stroke="#111" strokeWidth={5} opacity={0.9} />
          </g>} />
        )],
      ])}
      <Big t={t} at={CS(c) + 0.1} until={W(c, 'volvia') - 0.05} text="10 SEGUNDOS" size={170} color="#6EF0FF" />
      <Big t={t} at={W(c, 'juego')} until={W(c, 'volvia') + 0.6} text="DEJÓ DE SER UN JUEGO" size={100} y={950} color="#fff" />
      <Big t={t} at={W(c, 'movil')} until={stop - 0.05} text="¡MIRA EL MÓVIL!" size={110} color="#FF3B5C" />
      {frozen && <Big t={t} at={stop + 0.3} until={resume} text={String(n)} size={260} color="#FF3B5C" x={1720} y={200} rotate={6} w={400} />}
      <Big t={t} at={resume} until={W(c, 'la', 5) - 0.05} text="¡RRRRUM!" size={170} wiggle />
      {t > resume && t < resume + 1.2 && <SpeedLines t={t} opacity={0.5} />}
      <Big t={t} at={W(c, 'teletransporta')} until={W(c, 'me', 2) - 0.05} text="EL CHICO QUE SE TELETRANSPORTA" size={80} y={980} color="#fff" />
      <Big t={t} at={W(c, 'superheroe')} until={W(c, 'pero') - 0.05} text="¡SUPERHÉROE!" size={170} wiggle />
      <Big t={t} at={W(c, 'pecho')} text="...ME DOLÍA EL PECHO" size={110} color="#FF3B5C" />
      <LFlash t={t} at={stop + 0.3} dur={0.3} color="#BDF2FF" />
      <LFlash t={t} at={resume} dur={0.2} />
    </AbsoluteFill>
  );
};
