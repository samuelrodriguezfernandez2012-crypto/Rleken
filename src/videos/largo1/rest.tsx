import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LW, LH, GY, W, CS, CE, Big, Bub, LFlash, shakeL, Hero, NPC, POSES, ramp, easeOut, pop, rnd, pick} from './kit';
import {Scene, shots} from './scene';
import {
  Kitchen, Table, WallClock, Glass, Bedroom, Notebook, Bathroom, Mirror, Doctor, Paper, Studio, Crowd, Restaurant, Fire, BusInside, Plaza, Bench, Rain, Birds,
  PocketWatch, CityFrozen, Car, Calendar, Sofa, Diary, Piggy, Street,
} from './props';
import {SpeedLines, Sparkles} from '../../fx';

const MOM = '#9B5DE5', DOC = '#E8EEF5', BRO = '#06D6A0', RED = '#C1121F', HOST = '#6C757D';

const Relojera: React.FC<{x: number; y?: number; s?: number; t: number; pose?: any; eyes?: any; mouth?: any; flip?: boolean; watch?: boolean}> = ({x, y = GY, s = 1.15, t, pose = POSES.idle, eyes = 'normal', mouth = 'flat', flip, watch = true}) => (
  <g>
    <NPC x={x} y={y} s={s} color={RED} pose={pose} eyes={eyes} mouth={mouth} flip={flip} t={t} hairBun />
    {watch && <PocketWatch x={x} y={y - 205 * s} s={0.28 * s} t={t} />}
  </g>
);
const Dark: React.FC<{c?: string}> = ({c = '#1B0F2E'}) => <rect width={LW} height={LH} fill={c} />;
const Hourglass: React.FC<{x: number; y: number; s?: number; k: number}> = ({x, y, s = 1, k}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-200} width={220} height={24} rx={8} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <rect x={-110} y={176} width={220} height={24} rx={8} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <path d="M -90 -176 L 90 -176 L 10 0 L 90 176 L -90 176 L -10 0 Z" fill="#E0F4FF" stroke="#111" strokeWidth={7} />
    <path d={`M ${-80 * (1 - k)} ${-170 + 160 * k} L ${80 * (1 - k)} ${-170 + 160 * k} L 0 -6 Z`} fill="#FFD166" />
    <path d={`M -80 172 L 80 172 L ${80 - 70 * k} ${172 - 150 * k} L ${-80 + 70 * k} ${172 - 150 * k} Z`} fill="#FFD166" />
  </g>
);

// ---------------- capitulo 4: dia 15, el precio ----------------
const Ch4: React.FC<{t: number}> = ({t}) => {
  const c = 4;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => (
          <Scene t={t} cam={{s: 1.05 + lt * 0.03, oy: 400}} bg={<Bathroom />} npc={<Mirror x={960} y={470} w={780} h={740}><Hero x={960} y={1340} s={2.6} t={t} age={20} eyes="normal" mouth="frown" /></Mirror>} />
        )],
        [W(c, 'madre'), (lt) => {
          const glassesOff = t >= W(c, 'quito');
          return (
            <Scene t={t} bg={<Doctor />} npc={<><NPC x={1350} s={1.25} color={DOC} t={t} pose={glassesOff ? POSES.shrug : {...POSES.idle, armR: [120, 40]}} flip eyes={t > W(c, 'estos') ? 'wide' : 'normal'} /><NPC x={340} s={1.2} color={MOM} t={t} pose={POSES.hips} /></>}
              hero={<Hero x={760} s={1.0} t={t} age={20} pose={POSES.idle} eyes={t > W(c, 'alguien') ? 'scared' : 'normal'} mouth={t > W(c, 'alguien') ? 'o' : 'flat'} look={1} />}
              fx={t > W(c, 'alguien') ? <Paper x={1350} y={360} text="20 AÑOS" s={pop(t, W(c, 'alguien'))} /> : null} />
          );
        }],
        [W(c, 'esa'), (lt) => (
          <Scene t={t} bg={<Dark c="#2B3150" />} hero={<Notebook x={960} y={540} s={1.5} lines={['DÍA 1-15:', '~300 VECES PARADO', 'SEGUNDOS TOTALES: ???']} k={ramp(lt, 0.5, 6)} />} />
        )],
        [W(c, 'cada'), (lt) => (
          <Scene t={t} bg={<Dark />} hero={<g><Hourglass x={1450} y={560} s={1.1} k={(lt * 0.3) % 1} /><Hero x={600} s={1.3} t={t} age={20} eyes="scared" mouth="o" /></g>} />
        )],
        [W(c, '10'), (lt) => (
          <Scene t={t} bg={<Dark c="#240046" />} hero={<g>
            <g transform="translate(560 520) scale(1.4)"><circle r={150} fill="#F4A261" opacity={0.2} /></g>
            <text x={560} y={560} textAnchor="middle" fontFamily="Luckiest" fontSize={130} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">10 s</text>
            <text x={960} y={560} textAnchor="middle" fontFamily="Luckiest" fontSize={130} fill="#FFE24A" stroke="#111" strokeWidth={8} paintOrder="stroke">=</text>
            {t > W(c, 'horas') - 0.6 && <text x={1380} y={560} textAnchor="middle" fontFamily="Luckiest" fontSize={130} fill="#FF3B5C" stroke="#111" strokeWidth={8} paintOrder="stroke" transform={`translate(1380 520) scale(${pop(t, W(c, 'horas') - 0.6)}) translate(-1380 -520)`}>10 h</text>}
            {t > W(c, 'patatas') && <text x={960} y={800} textAnchor="middle" fontFamily="Luckiest" fontSize={90} fill="#FF3B5C" stroke="#111" strokeWidth={7} paintOrder="stroke">PATATAS = DÍAS ENTEROS</text>}
          </g>} />
        )],
        [W(c, 'mi', 4), (lt) => (
          <Scene t={t} bg={<Dark c={t > W(c, 'tentacion') ? '#3A0010' : '#1B0F2E'} />} hero={<Hero x={960} s={1.4} t={t} age={20} pose={t > W(c, 'tentacion') ? POSES.point : POSES.headHold} eyes={t > W(c, 'tentacion') ? 'angry' : 'closed'} mouth="frown" glow={t > W(c, 'tentacion')} />} />
        )],
      ])}
      <Big t={t} at={W(c, 'siete')} until={W(c, 'madre') - 0.05} text="7 PELOS BLANCOS" size={130} color="#fff" />
      <Big t={t} at={W(c, 'estos')} until={W(c, 'alguien') - 0.05} text={'«NO SON DE UN\nNIÑO DE 12 AÑOS»'} size={110} color="#fff" />
      <Big t={t} at={W(c, 'cada')} until={W(c, '10') - 0.05} text={'1 SEGUNDO =\n1 HORA DE VIDA'} size={150} color="#FF3B5C" wiggle />
      <Big t={t} at={W(c, 'gratis')} until={W(c, 'cobrando') - 0.05} text="NO ERA GRATIS" size={150} />
      <Big t={t} at={W(c, 'cobrando')} until={W(c, 'peor') - 0.05} text={'ME COBRABA LA VIDA\nA PLAZOS'} size={110} color="#FF3B5C" />
      <Big t={t} at={W(c, 'tentacion')} text="LA TENTACIÓN..." size={130} color="#FFE24A" />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 5: dias 20-40, la fama ----------------
const Ch5: React.FC<{t: number}> = ({t}) => {
  const c = 5;
  const appear = W(c, 'aparecí');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Scene t={t} bg={<Dark c="#003049" />} hero={<Hero x={960} s={1.4} t={t} age={20} pose={POSES.oath} eyes="closed" mouth="smile" />} />],
        [W(c, 'cumpli'), (lt) => <Scene t={t} bg={<Dark c="#003049" />} hero={<Hero x={960} s={1.4} t={t} age={20} pose={POSES.shrug} eyes="side" mouth="smile" look={1} />} />],
        [W(c, 'porque'), (lt) => (
          <Scene t={t} bg={<Dark c="#3A0CA3" />} hero={<g>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${240 + i * 360} ${520 + Math.sin(t * 3 + i) * 20}) scale(0.55) rotate(${(i - 2) * 6})`}><rect x={-170} y={-320} width={340} height={640} rx={40} fill="#222" stroke="#111" strokeWidth={10} /><rect x={-145} y={-290} width={290} height={580} rx={20} fill="#8ECAE6" /><text y={30} textAnchor="middle" fontFamily="Luckiest" fontSize={60} fill="#fff" stroke="#111" strokeWidth={6} paintOrder="stroke">VIRAL</text></g>)}</g>} />
        )],
        [W(c, '25') - 0.3, (lt) => {
          const frozen = t >= appear - 0.6 && t < appear;
          const behind = t >= appear;
          return (
            <Scene t={t} frozen={frozen} bg={<Studio t={t} />}
              npc={<><NPC x={900} s={1.2} color={HOST} t={t} pose={behind ? POSES.scared : POSES.point} eyes={behind ? 'wide' : 'normal'} /><Crowd t={t} cheer={t > W(c, 'publico')} y={LH + 90} /></>}
              hero={<Hero x={behind ? 1150 : 1500} s={1.2} t={t} age={22} pose={behind ? POSES.cheer : POSES.idle} eyes={behind ? 'happy' : 'normal'} mouth={behind ? 'grin' : 'flat'} />}
            />
          );
        }],
        [W(c, '30') - 0.3, (lt) => (
          <Scene t={t} bg={<Dark c="#FFB703" />} hero={<g>
            {Array.from({length: 18}).map((_, i) => {
              const y = ((lt * 300 + rnd(i) * 1200) % 1300) - 150;
              return <g key={i} transform={`translate(${rnd(i + 3) * LW} ${y}) rotate(${Math.sin(t * 3 + i) * 30})`}><rect x={-60} y={-30} width={120} height={60} rx={6} fill="#3DDC84" stroke="#111" strokeWidth={5} /><text y={12} textAnchor="middle" fontFamily="Luckiest" fontSize={34} fill="#fff">$</text></g>;
            })}
            <Hero x={960} s={1.4} t={t} age={25} pose={POSES.cheer} eyes="happy" mouth="grin" />
          </g>} />
        )],
        [W(c, 'pensaba') - 0.6, (lt) => <Scene t={t} bg={<Dark c="#2B3150" />} hero={<Hero x={760} s={1.4} t={t} age={27} pose={POSES.shrug} eyes="side" mouth="smile" look={1} />} fx={<Hourglass x={1450} y={540} s={0.9} k={0.3 + lt * 0.08} />} />],
        [W(c, '35'), (lt) => {
          const frozen = t > W(c, 'salve') && t < W(c, 'salve') + 1.6;
          return (
            <Scene t={t} frozen={frozen} bg={<Restaurant />} npc={<><Table x={1100} w={600} /><NPC x={1200} s={1.2} color="#FFB703" t={t} pose={frozen || t < W(c, 'salve') ? POSES.headHold : POSES.cheer} eyes={t < W(c, 'salve') + 1.6 ? 'scared' : 'happy'} mouth={t < W(c, 'salve') + 1.6 ? 'open' : 'smile'} flip /></>}
              hero={<Hero x={frozen ? 1060 : 620} s={1.2} t={t} age={28} pose={frozen ? POSES.reach : POSES.idle} eyes="angry" look={1} />} />
          );
        }],
        [W(c, '38'), (lt) => {
          const frozen = t > W(c, 'apague') && t < W(c, 'imparable');
          return (
            <Scene t={t} frozen={frozen} bg={<Kitchen />} npc={<>{t < W(c, 'imparable') && <Fire x={1250} y={520} s={1.2} t={frozen ? 0 : t} />}</>}
              hero={<Hero x={frozen ? 1050 : 650} s={1.2} t={t} age={29} pose={t >= W(c, 'imparable') ? POSES.cheer : POSES.reach} eyes={t >= W(c, 'imparable') ? 'happy' : 'angry'} mouth={t >= W(c, 'imparable') ? 'grin' : 'flat'} look={1} />} />
          );
        }],
        [W(c, 'pero'), (lt) => {
          const zoom = easeOut(ramp(t, W(c, 'tenia'), W(c, 'tenia') + 0.6));
          return <Scene t={t} cam={{s: 1 + zoom * 0.8, oy: 330}} bg={<Bathroom />} npc={<Mirror x={960} y={470} w={780} h={740}><Hero x={960} y={1340} s={2.6} t={t} age={32} eyes="wide" mouth="o" /></Mirror>} />;
        }],
        [W(c, 'amigos'), (lt) => (
          <Scene t={t} bg={<Kitchen night />} npc={<NPC x={1250} s={0.95} color={BRO} t={t} pose={POSES.shrug} flip eyes="wide" mouth="o" />} hero={<Hero x={650} s={1.25} t={t} age={32} pose={POSES.idle} eyes="side" mouth="frown" look={1} />} />
        )],
      ])}
      <Big t={t} at={W(c, 'emergencias')} until={W(c, 'cumpli') - 0.05} text="SOLO EMERGENCIAS" size={130} color="#fff" />
      <Big t={t} at={W(c, 'cumpli')} until={W(c, 'porque') - 0.05} text="...UNOS 3 DÍAS" size={130} />
      <Big t={t} at={W(c, 'tele')} until={appear - 0.6} text="¡EN LA TELE!" size={140} />
      <Big t={t} at={W(c, 'publico')} until={W(c, '30') - 0.35} text="¡¡OOOOH!!" size={170} wiggle />
      <Big t={t} at={W(c, '30', 2)} until={W(c, 'pensaba') - 0.65} text={'30 SEG AQUÍ\n1 MIN ALLÁ'} size={120} color="#fff" />
      <Big t={t} at={W(c, 'poquito')} until={W(c, '35') - 0.05} text="SOLO UN POQUITO MÁS..." size={100} color="#FFE24A" />
      <Big t={t} at={W(c, 'imparable')} until={W(c, 'pero') - 0.05} text="¡IMPARABLE!" size={170} wiggle />
      <Big t={t} at={W(c, 'arrugas')} until={W(c, 'amigos') - 0.05} text="ARRUGAS Y BARBA" size={120} color="#fff" />
      <Bub t={t} at={W(c, 'por', 2)} text="¿POR QUÉ PARECES EL TÍO DE PAPÁ?" x={1250} y={380} w={520} size={40} />
      <LFlash t={t} at={appear} dur={0.2} />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 6: dias 45-50, intenta parar ----------------
const Ch6: React.FC<{t: number}> = ({t}) => {
  const c = 6;
  const freeze = W(c, 'mundo');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Scene t={t} bg={<Doctor />} npc={<NPC x={1350} s={1.25} color={DOC} t={t} pose={POSES.point} flip eyes="angry" />} hero={<Hero x={700} s={1.1} t={t} age={35} eyes={t > W(c, 'corazon') ? 'scared' : 'normal'} mouth="frown" look={1} sweat={t > W(c, 'ritmo')} />} />],
        [W(c, 'esa'), (lt) => <Scene t={t} bg={<Dark c="#2B3150" />} hero={<Notebook x={960} y={540} s={1.5} lines={['SE ACABÓ.', 'NO MÁS PODER.', 'NUNCA MÁS.']} k={ramp(lt, 1.8, 6)} red />} />],
        [W(c, 'durante') - 0.2, (lt) => <Scene t={t} bg={<Bedroom night={false} />} hero={<Hero x={960} s={1.3} t={t} age={35} pose={POSES.fists} eyes="closed" mouth="teeth" />} fx={<Calendar x={1550} y={380} s={0.9} day={String(45 + Math.min(5, Math.floor(lt / 1.2)))} />} />],
        [W(c, 'cuando'), (lt) => (
          <Scene t={t} bg={<Kitchen />} npc={<><Table x={1000} w={600} /><Glass x={1200} y={Math.min(GY - 40, 690 + lt * lt * 600)} rot={Math.min(90, lt * 120)} /></>} hero={<Hero x={700} s={1.2} t={t} age={36} pose={POSES.fists} eyes="closed" mouth="teeth" />} />
        )],
        [W(c, 'cuando', 2), (lt) => <Scene t={t} bg={<Street />} npc={<NPC x={1200} y={640} s={1.0} color="#FFB703" t={t} pose={POSES.scared} rotate={Math.min(60, lt * 80)} eyes="wide" mouth="open" />} hero={<Hero x={700} y={640} s={1.0} t={t} age={36} pose={POSES.fists} eyes="closed" mouth="teeth" />} />],
        [W(c, 'era'), (lt) => <Scene t={t} bg={<Dark c="#370617" />} hero={<Hero x={960} s={1.4} t={t} age={36} pose={POSES.headHold} eyes="closed" mouth="teeth" sweat />} />],
        [W(c, 'pero'), (lt) => {
          const frozen = t >= freeze;
          const brake = W(c, 'freno');
          const sh = shakeL(t, [[brake, 0.7, 30]]);
          return (
            <Scene t={t} frozen={frozen} cam={{x: sh.x, y: sh.y, s: frozen ? 1.0 + 0.02 * (t - freeze) : 1.05}} bg={<BusInside />}
              npc={<>{[380, 1250, 1600].map((x, i) => <NPC key={i} x={x} s={1.05} color={['#E63946', '#FFB703', '#8338EC'][i]} t={t} pose={t > brake ? POSES.scared : POSES.idle} rotate={t > brake && !frozen ? 12 : t > brake ? 12 : 0} flip={i > 0} />)}</>}
              hero={<Hero x={850} s={1.2} t={t} age={37} pose={t > W(c, 'asuste') ? POSES.scared : POSES.idle} eyes={t > W(c, 'asuste') ? 'wide' : 'normal'} mouth={t > W(c, 'asuste') ? 'o' : 'flat'} />}
            />
          );
        }],
        [W(c, 'yo'), (lt) => (
          <Scene t={t} frozen cam={{s: 1.0 + lt * 0.01}} bg={<BusInside />} npc={<>{[380, 1250, 1600].map((x, i) => <NPC key={i} x={x} s={1.05} color={['#E63946', '#FFB703', '#8338EC'][i]} t={t} pose={POSES.scared} rotate={12} flip={i > 0} />)}</>}
            hero={<Hero x={850} s={1.2} t={t} age={37 + Math.min(1, ramp(t, W(c, '50', 4), CE(c))) * 1} pose={POSES.headHold} eyes="scared" mouth="o" sweat />} />
        )],
      ])}
      <Big t={t} at={W(c, 'corazon')} until={W(c, 'ritmo') - 0.05} text={'TU CORAZÓN\nTIENE 35 AÑOS'} size={120} color="#FF3B5C" />
      <Big t={t} at={W(c, 'ritmo')} until={W(c, 'esa') - 0.05} text="NO LLEGAS A FINAL DE AÑO" size={90} color="#fff" />
      <Big t={t} at={W(c, 'dificil')} until={W(c, 'cuando') - 0.05} text="LO MÁS DIFÍCIL" size={130} />
      <Big t={t} at={W(c, 'hambre')} until={W(c, 'pero') - 0.05} text="COMO TENER HAMBRE..." size={110} color="#fff" />
      <Big t={t} at={freeze} until={W(c, 'activado') - 0.05} text="¡SE ACTIVÓ SOLO!" size={140} color="#6EF0FF" />
      <Big t={t} at={W(c, 'fueron', 2)} until={W(c, '50', 4) - 0.05} text={`${String(Math.min(50, Math.floor((t - W(c, 'fueron', 2)) * 9))).padStart(2, '0')}:00 MIN`} size={170} color="#FF3B5C" />
      <Big t={t} at={W(c, '50', 4)} text={'50 DÍAS\nDE MI VIDA'} size={150} color="#FF3B5C" wiggle />
      <LFlash t={t} at={freeze} dur={0.3} color="#BDF2FF" />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 7: se activa solo, la Relojera ----------------
const Ch7: React.FC<{t: number}> = ({t}) => {
  const c = 7;
  const relo = W(c, 'gire');
  const frozenPlaza = (cam = {}, heroPose = POSES.idle, heroEyes: any = 'normal', relX = 1500, relPose = POSES.idle, extra: React.ReactNode = null) => (
    <Scene t={t} frozen cam={cam} bg={<><Plaza /><Birds t={t} frozen /></>}
      npc={<>{[250, 520, 1720].map((x, i) => <NPC key={i} x={x} s={1.05} color={['#E63946', '#FFB703', '#8338EC'][i]} t={t} pose={i === 1 ? POSES.point : POSES.idle} flip={i === 2} />)}</>}
      hero={<><Hero x={900} s={1.2} t={t} age={42} pose={heroPose} eyes={heroEyes} look={1} />{t >= relo && <Relojera x={relX} t={t} pose={relPose} flip />}{extra}</>}
    />
  );
  const walk = (k: number) => ({...POSES.idle, legL: [Math.sin(k * 6) * 18, 6] as [number, number], legR: [-Math.sin(k * 6) * 18, -6] as [number, number]});
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), () => <Scene t={t} bg={<Dark c="#14213D" />} hero={<Hero x={960} s={1.3} t={t} age={38} pose={POSES.scared} eyes="wide" mouth="o" />} />],
        [W(c, 'portazo') - 0.2, () => <Scene t={t} frozen bg={<Kitchen />} hero={<Hero x={960} s={1.2} t={t} age={38} pose={POSES.scared} eyes="wide" mouth="o" />} />],
        [W(c, 'claxon') - 0.2, () => <Scene t={t} frozen bg={<Street />} npc={<Car x={1300} y={820} c="#E63946" s={1.4} />} hero={<Hero x={700} y={640} s={1.0} t={t} age={39} pose={POSES.scared} eyes="wide" mouth="o" />} />],
        [W(c, 'trueno') - 0.2, () => <Scene t={t} frozen bg={<><Plaza storm /><Rain t={t} frozen /></>} hero={<Hero x={960} s={1.2} t={t} age={39} pose={POSES.scared} eyes="wide" mouth="o" />} />],
        [W(c, 'y'), (lt) => <Scene t={t} frozen cam={{s: 1.1 + lt * 0.03}} bg={<><Plaza storm /><Rain t={t} frozen n={160} /></>} hero={<Hero x={960} s={1.25} t={t} age={40} pose={POSES.hands} eyes="wide" mouth="o" />} />],
        [W(c, '60'), (lt) => frozenPlaza({s: 1.05})],
        [W(c, 'pasos'), (lt) => frozenPlaza({s: 1.4, ox: 900, oy: 520}, POSES.scared, 'wide')],
        [relo, (lt) => frozenPlaza({s: 1.1}, POSES.scared, 'wide', 1650 - lt * 60, walk(t))],
        [W(c, 'caminaba'), (lt) => frozenPlaza({s: 1.2, ox: 1300, oy: 600}, POSES.scared, 'wide', 1500 - lt * 70, walk(t))],
        [W(c, 'paro'), (lt) => frozenPlaza({s: 1.5, ox: 1060, oy: 520}, POSES.scared, 'wide', 1190, t > W(c, 'sonrio') + 0.8 ? {...POSES.reach, armR: [100, 0]} : POSES.idle)],
        [W(c, 'recorde'), (lt) => (
          <AbsoluteFill style={{filter: 'sepia(0.7) contrast(1.05)'}}>
            <Scene t={t} bg={<Street />} npc={<><rect x={1250} y={300} width={16} height={360} fill="#555" stroke="#111" strokeWidth={4} /><rect x={1180} y={260} width={160} height={70} rx={10} fill="#2A9D8F" stroke="#111" strokeWidth={5} /><text x={1260} y={308} textAnchor="middle" fontFamily="Luckiest" fontSize={34} fill="#fff">BUS</text><Relojera x={1080} y={640} s={0.95} t={t} pose={t > W(c, 'toco', 2) ? {...POSES.reach, armR: [100, 0]} : POSES.idle} flip /></>}
              hero={<Hero x={850} y={640} s={0.9} t={t} age={12} eyes={t > W(c, 'siento') ? 'side' : 'normal'} look={1} />} />
          </AbsoluteFill>
        )],
        [W(c, 'siguiente'), (lt) => <Scene t={t} frozen bg={<Kitchen />} npc={<Table x={960} />} hero={<><Hero x={720} s={1.15} t={t} age={12} eyes="wide" mouth="o" /><Glass x={980} y={780} rot={40} drops={8} t={t} /></>} />],
      ])}
      <Big t={t} at={W(c, 'asustaba')} until={W(c, 'portazo') - 0.25} text="SE ACTIVABA SOLO" size={130} color="#6EF0FF" />
      <Big t={t} at={W(c, 'portazo')} until={W(c, 'claxon') - 0.25} text="¡PORTAZO!" size={170} />
      <Big t={t} at={W(c, 'claxon')} until={W(c, 'trueno') - 0.25} text="¡PIIII!" size={170} />
      <Big t={t} at={W(c, 'trueno')} until={W(c, 'y') - 0.05} text="¡BRRRUM!" size={170} />
      <Big t={t} at={W(c, '55')} until={W(c, '60') - 0.05} text="2 HORAS CONGELADO" size={120} color="#BDF2FF" />
      <Big t={t} at={W(c, 'pasos')} until={relo - 0.05} text="...PASOS" size={150} color="#fff" rotate={0} />
      <Big t={t} at={W(c, 'anciana')} until={W(c, 'caminaba') - 0.05} text="¡ALGUIEN MÁS SE MOVÍA!" size={100} color="#FF3B5C" />
      <Bub t={t} at={W(c, 'vaya')} until={W(c, 'yo')} text="VAYA. TE HA DURADO MÁS DE LO QUE PENSABA" x={1190} y={420} w={560} size={40} />
      <Big t={t} at={W(c, 'cero')} until={W(c, 'parada') + 0.6} text="DÍA 0" size={170} color="#fff" />
      <Bub t={t} at={W(c, 'siento') - 0.2} until={W(c, 'siguiente')} text="LO SIENTO, CHAVAL" x={1080} y={330} w={420} size={42} />
      <LFlash t={t} at={W(c, 'recorde')} dur={0.3} color="#FFE8A3" />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 8: las reglas ----------------
const Rule: React.FC<{t: number; at: number; n: number; text: string; y: number}> = ({t, at, n, text, y}) =>
  t < at ? null : (
    <g transform={`translate(960 ${y}) scale(${pop(t, at)})`}>
      <rect x={-720} y={-62} width={1440} height={124} rx={30} fill="#fff" stroke="#111" strokeWidth={8} />
      <circle cx={-650} r={46} fill="#C1121F" stroke="#111" strokeWidth={6} />
      <text x={-650} y={18} textAnchor="middle" fontFamily="Luckiest" fontSize={56} fill="#fff">{n}</text>
      <text x={-570} y={20} fontFamily="Luckiest" fontSize={54} fill="#111">{text}</text>
    </g>
  );

const Ch8: React.FC<{t: number}> = ({t}) => {
  const c = 8;
  const vanish = W(c, 'entonces');
  const plaza = (cam = {}, relPose = POSES.idle, relEyes: any = 'normal', heroEyes: any = 'normal', heroPose = POSES.idle) => (
    <Scene t={t} frozen={t < vanish + 1.0} cam={cam} bg={<Plaza />}
      npc={<>{[250, 1720].map((x, i) => <NPC key={i} x={x} s={1.05} color={['#E63946', '#8338EC'][i]} t={t} flip={i === 1} />)}</>}
      hero={<><Hero x={760} s={1.2} t={t} age={45} pose={heroPose} eyes={heroEyes} look={1} />{(t < vanish + 1.0) && <Relojera x={1160} t={t} pose={relPose} eyes={relEyes} flip />}</>}
    />
  );
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), () => plaza({s: 1.6, ox: 1160, oy: 480})],
        [W(c, 'explico'), (lt) => (
          <Scene t={t} bg={<Dark c="#14213D" />} hero={<g>
            <Rule t={t} at={W(c, 'poder')} n={1} text="EL PODER VA PASANDO DE PERSONA EN PERSONA" y={300} />
            <Rule t={t} at={W(c, 'dura')} n={2} text="DURA EXACTAMENTE 100 DÍAS" y={480} />
            <Rule t={t} at={W(c, '100', 2)} n={3} text="EL DÍA 100: TOCAR A OTRO CON EL TIEMPO PARADO" y={660} />
          </g>} />
        )],
        [W(c, 'si'), (lt) => <Scene t={t} frozen bg={<Dark c="#0B1026" />} hero={<Hero x={960} s={1.2 - lt * 0.04} t={t} age={45} pose={POSES.headHold} eyes="scared" mouth="o" />} />],
        [W(c, 'diste'), () => plaza({s: 1.35, ox: 900, oy: 520}, POSES.idle, 'normal', 'angry', POSES.fists)],
        [W(c, 'porque'), () => plaza({s: 1.6, ox: 1160, oy: 480}, POSES.shrug, 'side')],
        [W(c, '40'), (lt) => plaza({s: 2.2, ox: 1160, oy: 560}, {...POSES.idle, armL: [-60, 150], armR: [60, -150]}, 'closed')],
        [W(c, 'todos'), (lt) => (
          <Scene t={t} bg={<Dark c="#240046" />} hero={<g>
            {Array.from({length: 6}).map((_, i) => (
              <g key={i} opacity={ramp(lt, i * 0.5, i * 0.5 + 0.3)}>
                <NPC x={220 + i * 300} s={0.8} color={['#8D99AE', '#E63946', '#FFB703', '#06D6A0', '#C1121F', '#3D6FB8'][i]} t={t} eyes="closed" />
                {i < 5 && <path d={`M ${300 + i * 300} 620 q 70 -60 140 0`} stroke="#FFE24A" strokeWidth={8} fill="none" />}
              </g>
            ))}
            <PocketWatch x={220 + Math.min(5, Math.floor(lt * 2)) * 300} y={380} s={0.4} t={t} />
          </g>} />
        )],
        [W(c, 'pregunte'), () => plaza({s: 1.25}, POSES.idle, 'closed', 'scared')],
        [vanish, (lt) => plaza({s: 1.2}, POSES.idle, 'normal', 'wide', POSES.scared)],
      ])}
      <Big t={t} at={CS(c) + 0.2} until={W(c, 'explico') - 0.05} text={'ELVIRA\n«LA RELOJERA»'} size={120} color="#fff" />
      <Big t={t} at={W(c, 'siempre')} until={W(c, 'diste') - 0.05} text={'EL TIEMPO SE PARA\nPARA SIEMPRE'} size={120} color="#FF3B5C" />
      <Big t={t} at={W(c, 'eternamente')} until={W(c, 'diste') - 0.05} text="ETERNAMENTE" size={120} color="#BDF2FF" y={900} />
      <Bub t={t} at={W(c, 'diste') - 0.4} until={W(c, 'porque') - 0.1} text="¿¡POR QUÉ ME LO DISTE A MÍ!?" x={760} y={380} w={520} size={44} shout />
      <Bub t={t} at={W(c, 'porque')} until={W(c, '40') - 0.1} text="NO QUERÍA QUEDARME ATRAPADA" x={1160} y={360} w={480} size={40} />
      <Big t={t} at={W(c, '40')} until={W(c, 'todos') - 0.05} text={'TENÍA 40 AÑOS...\nMÍRAME AHORA'} size={110} color="#fff" />
      <Big t={t} at={W(c, 'desconocido')} until={W(c, 'pregunte') - 0.05} text="A UN DESCONOCIDO" size={120} color="#FF3B5C" />
      <Bub t={t} at={W(c, 'pregunte') + 0.4} until={W(c, 'nadie', 2) - 0.1} text="¿HAY OTRA FORMA?" x={760} y={380} w={400} />
      <Bub t={t} at={W(c, 'nadie', 2)} until={vanish} text="NADIE LA HA ENCONTRADO NUNCA" x={1160} y={360} w={460} size={40} />
      {t > vanish + 1.0 && <Sparkles t={t} at={vanish + 1.0} cx={1160} cy={620} n={30} spread={400} color="#C1121F" />}
      <LFlash t={t} at={vanish + 1.0} dur={0.25} />
    </AbsoluteFill>
  );
};

// ---------------- capitulo 9: dias 70-95 ----------------
const Ch9: React.FC<{t: number}> = ({t}) => {
  const c = 9;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Scene t={t} bg={<Dark c="#003049" />} hero={<Hero x={960} s={1.4} t={t} age={45} pose={POSES.fists} eyes="angry" mouth="flat" />} />],
        [W(c, '70') - 0.3, (lt) => {
          const asleep = t >= W(c, 'acabe');
          return <Scene t={t} frozen={asleep} bg={<Bedroom night />} npc={<Sofa x={960} />} hero={<Hero x={960} y={asleep ? 780 : GY} s={1.1} t={t} age={47} pose={asleep ? POSES.idle : POSES.idle} rotate={asleep ? -80 : 0} eyes={asleep ? 'closed' : 'wide'} sweat={!asleep} />} />;
        }],
        [W(c, '75') - 0.3, (lt) => <Scene t={t} bg={<Dark c="#3D2B1F" />} hero={<Diary x={960} y={540} s={1.4} k={ramp(t, W(c, 'pagina'), W(c, 'guarda') + 0.4)} />} />],
        [W(c, '80') - 0.3, (lt) => (
          <Scene t={t} bg={<Dark c="#E8D5B5" />} npc={<>{Array.from({length: 6}).map((_, i) => <rect key={i} x={300 + i * 220} y={GY - (i + 1) * 70} width={240} height={(i + 1) * 70} fill="#B07940" stroke="#111" strokeWidth={6} />)}</>}
            hero={<Hero x={420 + Math.min(1, lt / 6) * 600} y={GY - 70 - Math.min(1, lt / 6) * 210} s={1.0} t={t} age={50} pose={{...POSES.idle, legL: [Math.sin(t * 3) * 20, 10], legR: [-Math.sin(t * 3) * 20, -10]}} eyes="closed" mouth="frown" cane sweat />} />
        )],
        [W(c, '85') - 0.3, (lt) => (
          <Scene t={t} frozen bg={<CityFrozen />} npc={<><Car x={500} y={880} c="#E63946" /><Car x={1450} y={880} c="#FFB703" />{[300, 1100, 1700].map((x, i) => <NPC key={i} x={x} y={700} s={0.85} color="#8D99AE" t={t} pose={i === 1 ? POSES.point : POSES.idle} />)}</>}
            hero={<Hero x={600 + lt * 70} y={700} s={0.9} t={t} age={53} pose={{...POSES.idle, legL: [Math.sin(t * 4) * 18, 6], legR: [-Math.sin(t * 4) * 18, -6]}} eyes="normal" mouth="frown" cane />} />
        )],
        [W(c, '90') - 0.3, (lt) => (
          <Scene t={t} bg={<Dark c="#240046" />} hero={<g>
            <Piggy x={960} y={520} s={1.6} />
            {Array.from({length: 10}).map((_, i) => {
              const k = ((lt * 0.4 + i / 10) % 1);
              return <g key={i} transform={`translate(${300 + i * 140} ${150 + k * 300}) scale(${0.18 * (1 - k)})`}><Hourglass x={0} y={0} k={0.5} /></g>;
            })}
            {t > W(c, 'romper', 2) - 0.2 && <circle cx={960} cy={520} r={260 + Math.sin(t * 6) * 15} fill="#FFE24A" opacity={0.25} filter="url(#blurGlow)" />}
          </g>} />
        )],
        [W(c, '95') - 0.3, (lt) => <Scene t={t} bg={<Dark c="#370617" />} hero={<Hero x={960} s={1.4} t={t} age={60} cane eyes="normal" mouth="frown" />} fx={<Calendar x={1550} y={400} s={0.9} day="95" />} />],
      ])}
      <Big t={t} at={CS(c) + 0.1} until={W(c, 'decidi') - 0.05} text="QUEDAN 40 DÍAS" size={150} color="#FF3B5C" />
      <Big t={t} at={W(c, 'maldicion')} until={W(c, '70') - 0.35} text="NO SE LO PASARÉ A NADIE" size={110} color="#fff" />
      <Big t={t} at={W(c, 'despierto')} until={W(c, 'acabe') - 0.05} text="3 DÍAS SIN DORMIR" size={130} />
      <Big t={t} at={W(c, 'acabe')} until={W(c, '75') - 0.35} text="6 HORAS CONGELADO" size={130} color="#BDF2FF" />
      <Big t={t} at={W(c, 'encontre')} until={W(c, 'pagina') - 0.05} text="UN DIARIO DE HACE 50 AÑOS" size={100} color="#fff" />
      <Big t={t} at={W(c, '40', 2) - 0.2} until={W(c, '85') - 0.35} text="40 AÑOS POR DENTRO" size={120} color="#FF3B5C" />
      <Big t={t} at={W(c, 'solo')} until={W(c, '90') - 0.35} text="MÁS SOLO QUE NUNCA" size={120} color="#fff" />
      <Big t={t} at={W(c, 'hucha')} until={W(c, '95') - 0.35} text="¡COMO UNA HUCHA!" size={160} wiggle />
      <Big t={t} at={W(c, '60')} text={'60 AÑOS\nQUEDAN 5 DÍAS'} size={140} color="#FF3B5C" />
    </AbsoluteFill>
  );
};

// ---------------- capitulos 10 y 11: dia 100 ----------------
const plaza100 = (t: number, cam = {}, heroX = 900, heroPose = POSES.idle, relWatch: React.ReactNode = null, eyes: any = 'normal') => (
  <Scene t={t} frozen cam={cam} bg={<><Plaza storm /><Birds t={t} frozen /><Rain t={t} frozen /></>}
    npc={<><Bench x={1300} />{[260, 1760].map((x, i) => <NPC key={i} x={x} s={1.05} color={['#E63946', '#8338EC'][i]} t={t} flip={i === 1} />)}<Relojera x={1300} y={860} s={1.05} t={t} watch={false} eyes="closed" /></>}
    hero={<><Hero x={heroX} s={1.25} t={t} age={60} cane pose={heroPose} eyes={eyes} />{relWatch}</>}
  />
);
const Ch10: React.FC<{t: number}> = ({t}) => {
  const c = 10;
  const run = (k: number) => ({...POSES.idle, legL: [Math.sin(k * 7) * 25, -10] as [number, number], legR: [-Math.sin(k * 7) * 25, -10] as [number, number]});
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => plaza100(t, {s: 1.2 - lt * 0.02}, 700)],
        [W(c, 'pajaros'), (lt) => plaza100(t, {s: 2.2, ox: 800, oy: 260})],
        [W(c, 'lluvia'), (lt) => plaza100(t, {s: 1.9, ox: 500, oy: 520})],
        [W(c, 'cronometro'), (lt) => plaza100(t, {s: 2.0, ox: 900, oy: 560}, 900, {...POSES.idle, armL: [-90, 120]}, null, 'wide')],
        [W(c, 'corri'), (lt) => plaza100(t, {s: 1.1}, 500 + lt * 180, run(t))],
        [W(c, 'entonces'), (lt) => plaza100(t, {s: 1.6, ox: 1300, oy: 600}, 1050, POSES.idle, <PocketWatch x={1300} y={700} s={0.4} t={t} open={t > W(c, 'abierto')} light={t > W(c, 'luz') ? 1 : 0} />, 'wide')],
        [W(c, 'abierto') - 0.9, (lt) => (
          <Scene t={t} frozen bg={<Dark c="#0B1026" />} hero={<PocketWatch x={960} y={560} s={2.6} t={t} open light={ramp(t, W(c, 'luz'), W(c, 'luz') + 0.5)} />} />
        )],
      ])}
      <Big t={t} at={CS(c) + 0.1} until={W(c, 'pajaros') - 0.05} text="DÍA 100 · 15:00" size={150} />
      <Big t={t} at={W(c, '3')} until={W(c, 'corri') - 0.05} text={(() => { const r = Math.max(0, 180 - Math.floor(t - W(c, '3'))); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; })()} size={240} color="#FF3B5C" />
      <Big t={t} at={W(c, 'siempre')} until={W(c, 'corri') - 0.05} text="...O PARA SIEMPRE" size={100} color="#fff" y={950} />
      <Big t={t} at={W(c, 'congelada')} until={W(c, 'abierto') - 0.95} text="LA RELOJERA" size={120} color="#fff" />
      <Big t={t} at={W(c, 'agujas')} until={W(c, 'luz') - 0.05} text="SIN AGUJAS..." size={120} color="#fff" />
      <Big t={t} at={W(c, 'hucha')} text="¡LA HUCHA!" size={190} wiggle />
    </AbsoluteFill>
  );
};

const Ch11: React.FC<{t: number}> = ({t}) => {
  const c = 11;
  const smash = W(c, 'estampe') + 0.4;
  const burst = W(c, 'cristal');
  const timer = (from: number, sec: number) => <Big t={t} at={from} until={from + 1.8} text={sec >= 60 ? `${sec / 60}:00` : `0:${String(sec).padStart(2, '0')}`} size={200} color="#FF3B5C" x={1640} y={160} w={500} rotate={6} />;
  return (
    <AbsoluteFill style={{transform: (() => { const s = shakeL(t, [[smash, 0.8, 45], [burst, 1.2, 25]]); return `translate(${s.x}px, ${s.y}px)`; })()}}>
      {shots(t, [
        [CS(c), (lt) => <Scene t={t} frozen bg={<Dark c="#0B1026" />} hero={<><PocketWatch x={1250} y={560} s={1.8} t={t} open light={1} /><Hero x={560} s={1.4} t={t} age={60} eyes="wide" mouth="o" look={1} /></>} />],
        [W(c, 'cogi'), (lt) => {
          const lift = easeOut(ramp(t, W(c, 'cogi'), W(c, 'pesaba')));
          const down = easeOut(ramp(t, W(c, 'estampe'), smash));
          const wy = 640 - lift * 300 + down * 520;
          return (
            <Scene t={t} frozen cam={{s: 1.2, oy: 600}} bg={<><Plaza storm /><Rain t={t} frozen /></>}
              hero={<><Hero x={960} s={1.35} t={t} age={60} pose={lift > 0.5 && down < 0.5 ? POSES.armsUp : POSES.reach} eyes="angry" mouth="teeth" /><PocketWatch x={960} y={Math.min(GY - 60, wy)} s={0.55} t={t} open light={1} broken={t > smash ? 1 : 0} /></>} />
          );
        }],
        [burst, (lt) => (
          <Scene t={t} frozen bg={<Dark c="#0B1026" />} hero={<g>
            {Array.from({length: 24}).map((_, i) => {
              const a = (i / 24) * Math.PI * 2;
              const L = 200 + lt * 700;
              return <line key={i} x1={960} y1={560} x2={960 + Math.cos(a) * L} y2={560 + Math.sin(a) * L} stroke="#FFE24A" strokeWidth={14} opacity={0.7} strokeLinecap="round" />;
            })}
            <circle cx={960} cy={560} r={120 + lt * 260} fill="#FFF3A0" opacity={0.8} filter="url(#blurGlow)" />
            <PocketWatch x={960} y={560} s={1.4} t={t} open light={1} broken={1} />
          </g>} />
        )],
        [W(c, '10'), (lt) => (
          <AbsoluteFill>
            <Scene t={t} bg={<Dark c="#FFE8A3" />} hero={<Hero x={960} s={1.4} t={t} age={60 - 48 * ramp(lt, 1, 4)} pose={POSES.armsUp} eyes="closed" mouth="smile" glow />} />
            <AbsoluteFill style={{background: '#fff', opacity: ramp(t, W(c, 'envolvio'), W(c, 'blanco') + 0.3)}} />
          </AbsoluteFill>
        )],
      ])}
      {timer(CS(c) + 0.05, 120)}
      <Big t={t} at={W(c, 'reloj')} until={W(c, 'y') - 0.05} text="¡EL PODER ESTÁ EN EL RELOJ!" size={110} />
      <Big t={t} at={W(c, 'guardiana')} until={W(c, '1') - 0.05} text="SOLO ERA LA GUARDIANA" size={110} color="#fff" />
      {timer(W(c, '1'), 60)}
      <Big t={t} at={W(c, 'anos')} until={smash - 0.1} text="MIL AÑOS DENTRO" size={110} color="#FFE24A" />
      <Big t={t} at={smash} until={burst - 0.05} text="¡CRAAASH!" size={200} wiggle />
      {timer(W(c, '30'), 30)}
      <Big t={t} at={W(c, 'robado')} until={W(c, '10') - 0.05} text="¡TODO EL TIEMPO ROBADO!" size={110} />
      {timer(W(c, '10'), 10)}
      <LFlash t={t} at={smash} dur={0.25} />
      <LFlash t={t} at={burst} dur={0.4} color="#FFE24A" />
    </AbsoluteFill>
  );
};

// ---------------- capitulos 12 y 13: dia 0 y el final ----------------
const Ch12: React.FC<{t: number}> = ({t}) => {
  const c = 12;
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => <Scene t={t} bg={<Kitchen />} npc={<><Table x={960} w={760} /><NPC x={1350} s={0.95} color={BRO} t={t} eyes="closed" mouth="open" flip /></>} hero={<><Hero x={620} s={1.15} t={t} age={12} eyes={t > W(c, 'mire') ? 'wide' : 'normal'} pose={t > W(c, 'mire') ? POSES.hands : {...POSES.idle, armR: [80, -10]}} mouth="o" look={1} />{t < W(c, 'mire') && <Glass x={760} y={640} s={0.7} />}</>} />],
        [W(c, 'corri'), (lt) => <Scene t={t} bg={<Bathroom />} npc={<Mirror x={960} y={470} w={780} h={740}><Hero x={960} y={1340} s={2.6} t={t} age={12} eyes="happy" mouth="grin" /></Mirror>} />],
        [W(c, 'calendario'), (lt) => <Scene t={t} bg={<Kitchen />} hero={<><Calendar x={1300} y={420} s={1.2} day="0" /><Hero x={600} s={1.3} t={t} age={12} pose={POSES.cheer} eyes="happy" mouth="grin" /></>} />],
        [W(c, 'esa'), (lt) => (
          <Scene t={t} bg={<Street />} npc={<><rect x={1250} y={300} width={16} height={360} fill="#555" stroke="#111" strokeWidth={4} /><rect x={1180} y={260} width={160} height={70} rx={10} fill="#2A9D8F" stroke="#111" strokeWidth={5} /><text x={1260} y={308} textAnchor="middle" fontFamily="Luckiest" fontSize={34} fill="#fff">BUS</text>
            <NPC x={t > W(c, 'fue') ? 1100 + (t - W(c, 'fue')) * 400 : 1100} y={640} s={0.95} color={RED} t={t} pose={t > W(c, 'fue') ? {...POSES.idle, legL: [Math.sin(t * 6) * 18, 6], legR: [-Math.sin(t * 6) * 18, -6]} : POSES.idle} eyes={t > W(c, 'miro') ? 'side' : 'normal'} flip={t < W(c, 'fue')} /></>}
            hero={<Hero x={800} y={640} s={0.95} t={t} age={12} look={1} />} />
        )],
        [W(c, 'todo', 2), (lt) => <Scene t={t} bg={<Street dusk />} hero={<Hero x={960} y={640} s={1.0 + lt * 0.05} t={t} age={12} pose={POSES.shrug} eyes={t > W(c, 'eso') ? 'side' : 'happy'} mouth={t > W(c, 'eso') ? 'flat' : 'smile'} />} />],
      ])}
      <Big t={t} at={W(c, 'nino')} until={W(c, 'corri') - 0.05} text="¡OTRA VEZ NIÑO!" size={150} wiggle />
      <Big t={t} at={W(c, 'arruga')} until={W(c, 'calendario') - 0.05} text="NI UNA ARRUGA" size={130} color="#fff" />
      <Big t={t} at={W(c, 'recuperado')} until={W(c, 'esa') - 0.05} text="¡RECUPERÉ MIS 100 DÍAS!" size={120} />
      <Big t={t} at={W(c, 'joven')} until={W(c, 'miro') - 0.05} text="MÁS JOVEN · SIN RELOJ" size={100} color="#fff" />
      <Big t={t} at={W(c, 'eso')} text="...O ESO PENSABA" size={120} color="#FF3B5C" rotate={0} />
    </AbsoluteFill>
  );
};

const Ch13: React.FC<{t: number}> = ({t}) => {
  const c = 13;
  const slip = W(c, 'resbalo');
  const end = W(c, 'dime');
  const floatG = t >= W(c, 'y');
  return (
    <AbsoluteFill>
      {shots(t, [
        [CS(c), (lt) => (
          <Scene t={t} frozen={floatG} bg={<Kitchen night />} npc={<Table x={960} />} hero={<><Hero x={700} s={1.15} t={t} age={12} eyes={floatG ? 'wide' : 'normal'} mouth={floatG ? 'o' : 'flat'} look={1} /><Glass x={920} y={t < slip ? 680 : Math.min(800, 680 + (t - slip) * 200)} rot={t < slip ? 0 : Math.min(40, (t - slip) * 60)} drops={floatG ? 8 : 0} t={t} /></>} />
        )],
        [W(c, 'cristal') - 0.4, (lt) => (
          <Scene t={t} frozen bg={<Kitchen night />} cam={{s: 2.2 + lt * 0.05, ox: 1470, oy: 330}} hero={<PocketWatch x={1470} y={330} s={0.7} t={t} light={ramp(lt, 0.5, 2)} />} />
        )],
        [W(c, 'y', 3), (lt) => <Scene t={t} frozen bg={<Dark c="#0B1026" />} hero={<><PocketWatch x={1450} y={480} s={1.6} t={t} light={1} /><Hero x={620} s={1.5} t={t} age={12} pose={POSES.point} eyes="normal" mouth="flat" /></>} />],
        [W(c, 'asi'), (lt) => <Scene t={t} frozen bg={<Dark c="#0B1026" />} hero={<><Glass x={960} y={500 + Math.sin(t * 2) * 10} s={2.2} drops={6} t={t} /></>} />],
        [end, (lt) => (
          <Scene t={t} bg={<Dark c="#14213D" />} hero={<g>
            <PocketWatch x={1450} y={500} s={1.5} t={t} light={1} />
            <Hero x={560} s={1.4} t={t} age={12} pose={{...POSES.point, armR: [60, -10]}} eyes="normal" mouth="smile" />
          </g>} />
        )],
      ])}
      <Big t={t} at={W(c, 'flotando')} until={W(c, 'cristal') - 0.45} text="¡FLOTANDO OTRA VEZ!" size={140} color="#BDF2FF" />
      <Big t={t} at={W(c, 'nuevo')} until={W(c, 'y', 3) - 0.05} text={'UN RELOJ NUEVO...\nESPERANDO A ALGUIEN'} size={110} />
      <Big t={t} at={W(c, 'podrias')} until={W(c, 'asi') - 0.05} text="...PODRÍAS SER TÚ" size={170} color="#FF3B5C" wiggle />
      <Big t={t} at={W(c, 'suelo', 2)} until={end - 0.05} text="YA SABES LO QUE SIGNIFICA" size={110} color="#fff" />
      <Big t={t} at={end} text={'¿PARA QUÉ USARÍAS TÚ\n100 DÍAS DE PODER?'} size={100} y={190} />
      {t > W(c, 'quieres') && (
        <div style={{position: 'absolute', left: 1120, top: 760, transform: `scale(${pop(t, W(c, 'quieres')) * (1 + Math.sin(t * 8) * 0.05)})`, background: '#E0002A', border: '8px solid #111', borderRadius: 24, padding: '14px 40px', fontFamily: 'Luckiest', fontSize: 70, color: '#fff', WebkitTextStroke: '7px #111', paintOrder: 'stroke fill', boxShadow: '0 10px 0 #111'}}>
          ¡SUSCRÍBETE!
        </div>
      )}
      {t > end + 0.8 && (
        <div style={{position: 'absolute', left: 1120, top: 600, transform: `scale(${pop(t, end + 0.8)})`, background: '#fff', border: '8px solid #111', borderRadius: 24, padding: '12px 34px', fontFamily: 'Luckiest', fontSize: 60, color: '#111', boxShadow: '0 10px 0 #111'}}>
          ¡COMÉNTALO!
        </div>
      )}
    </AbsoluteFill>
  );
};

export const CH_REST: React.FC<{t: number}>[] = [Ch4, Ch5, Ch6, Ch7, Ch8, Ch9, Ch10, Ch11, Ch12, Ch13];
