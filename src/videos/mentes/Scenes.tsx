import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stickman, POSES, Pose, runPose} from '../../Stickman';
import {W, H, FONT, BigText, Bubble, Burst, Sparkles, Flash, Dust, SpeedLines, pop, ramp, easeOut, easeInOut, sumShake, rnd, clamp} from '../../fx';
import {Cam, World, poseSeq, Shadow, HERO, GROUND, blinkAt, EndCard, Thought, City} from '../../common';

const GRAY = '#7D8597';
const PSY = '#C77DFF';

const mix = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k)).toString(16).padStart(2, '0'));
  return `#${c.join('')}`;
};

// ondas psiquicas alrededor de la cabeza
const Waves: React.FC<{t: number; x: number; y: number; inward?: boolean; o?: number}> = ({t, x, y, inward, o = 1}) => (
  <g opacity={o}>
    {Array.from({length: 4}).map((_, i) => {
      let k = (t * 0.9 + i / 4) % 1;
      if (inward) k = 1 - k;
      return <circle key={i} cx={x} cy={y} r={60 + k * 520} fill="none" stroke={PSY} strokeWidth={10 * (1 - k) + 2} opacity={1 - k} />;
    })}
  </g>
);

// mini nubes de pensamiento (sin texto) que flotan
const MiniThoughts: React.FC<{t: number; n: number; cx: number; cy: number; r?: number; shrink?: number}> = ({t, n, cx, cy, r = 380, shrink = 0}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const a = rnd(i) * Math.PI * 2 + t * (0.3 + rnd(i + 2) * 0.5);
      const d = (r * (0.6 + rnd(i + 5) * 0.5)) * (1 - shrink);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.8;
      const s = (0.5 + rnd(i + 8) * 0.6) * (1 - shrink);
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M -70 20 Q -80 -15 -45 -20 Q -38 -55 0 -45 Q 30 -65 55 -35 Q 85 -35 80 5 Q 85 28 60 28 L -55 28 Q -75 28 -70 20 Z" fill="#fff" stroke="#111" strokeWidth={6} />
          <circle cx={-10 + rnd(i) * 20} cy={0} r={6} fill="#111" />
          <circle cx={12} cy={0} r={6} fill="#111" />
          <circle cx={34} cy={0} r={6} fill="#111" opacity={rnd(i + 1) > 0.5 ? 1 : 0} />
        </g>
      );
    })}
  </g>
);

const Dog: React.FC<{x: number; y: number; s?: number; t: number; jump?: number; flip?: boolean}> = ({x, y, s = 1, t, jump = 0, flip}) => {
  const tail = Math.sin(t * 18) * 25;
  return (
    <g transform={`translate(${x} ${y - jump}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <g stroke="#111" strokeWidth={9} strokeLinecap="round">
        <line x1={-60} y1={-40} x2={-66} y2={0} />
        <line x1={-30} y1={-40} x2={-24} y2={0} />
        <line x1={40} y1={-40} x2={34} y2={0} />
        <line x1={66} y1={-40} x2={72} y2={0} />
      </g>
      <path d={`M 80 -90 Q ${120 + tail} -140 ${110 + tail} -170`} stroke="#111" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M 80 -90 Q ${120 + tail} -140 ${110 + tail} -170`} stroke="#B07940" strokeWidth={7} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-75} rx={95} ry={50} fill="#B07940" stroke="#111" strokeWidth={7} />
      <ellipse cx={-10} cy={-60} rx={45} ry={22} fill="#E3B47A" />
      <g transform="translate(-95 -125)">
        <ellipse cx={-6} cy={-6} rx={22} ry={44} fill="#7A4E26" stroke="#111" strokeWidth={6} transform="rotate(20)" />
        <circle r={52} fill="#B07940" stroke="#111" strokeWidth={7} />
        <ellipse cx={-38} cy={18} rx={34} ry={24} fill="#E3B47A" stroke="#111" strokeWidth={6} />
        <ellipse cx={-62} cy={8} rx={12} ry={9} fill="#111" />
        <ellipse cx={-6} cy={-12} rx={12} ry={14} fill="#fff" />
        <circle cx={-10} cy={-10} r={6} fill="#111" />
        <ellipse cx={22} cy={-12} rx={12} ry={14} fill="#fff" />
        <circle cx={18} cy={-10} r={6} fill="#111" />
        <ellipse cx={30} cy={-20} rx={20} ry={40} fill="#7A4E26" stroke="#111" strokeWidth={6} transform="rotate(-25 30 -20)" />
      </g>
    </g>
  );
};

// ---------------- M1: gancho ----------------
export const M1Hook: React.FC<{t: number}> = ({t}) => {
  const n = Math.round(easeOut(ramp(t, 0.2, 1.2)) * 6000);
  const heroPose = poseSeq(t, [[0, POSES.headHold], [2.6, {...POSES.headHold, head: 0}], [3.8, POSES.armsUp]]);
  const s = 1.25 - 0.25 * easeOut(ramp(t, 0, 0.6)) + 0.1 * ramp(t, 0.6, 5.4);
  const sh = sumShake(t, [[0.2, 0.4, 30], [3.8, 0.4, 20]]);
  return (
    <AbsoluteFill>
      <Burst t={t} c1="#240046" c2="#3C096C" speed={t > 2.6 ? 50 : 15} />
      <Cam s={s} oy={900} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#10002B" />
          {t > 2.6 && <Waves t={t} x={540} y={GROUND - 1.55 * 308} />}
          <MiniThoughts t={t} n={Math.min(10, Math.floor(t * 4))} cx={540} cy={GROUND - 560} r={360} />
          <Shadow x={540} />
          <Stickman x={540} y={GROUND} scale={1.55} color={HERO} pose={heroPose} eyes={t > 2.6 ? 'psychic' : 'wide'} mouth={t > 3.8 ? 'grin' : 'o'} />
        </World>
      </Cam>
      <BigText t={t} at={0.2} until={3.7} text={`+${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`} y={300} size={240} />
      <BigText t={t} at={1.2} until={3.7} text="PENSAMIENTOS AL DÍA" y={480} size={86} color="#fff" rotate={3} />
      <BigText t={t} at={3.8} text={'¡PODÍA OÍRLOS\nTODOS!'} y={330} size={130} color={PSY} wiggle />
      <Flash t={t} at={0.2} dur={0.18} />
      <Flash t={t} at={2.6} dur={0.25} color={PSY} max={0.6} />
    </AbsoluteFill>
  );
};

// ---------------- M2: el perro ----------------
export const M2Dog: React.FC<{t: number}> = ({t}) => {
  const lunge = 8.0;
  const dogX = t < lunge ? 780 : 780 - easeOut(ramp(t, lunge, lunge + 0.35)) * 360;
  const jump = t > lunge && t < lunge + 0.5 ? Math.sin(((t - lunge) / 0.5) * Math.PI) * 140 : 0;
  const heroJump = t > lunge + 0.2 ? Math.abs(Math.sin((t - lunge - 0.2) * 9)) * 120 : 0;
  const heroPose = poseSeq(t, [[5.5, POSES.idle], [6.4, {...POSES.shrug, head: 8}], [lunge + 0.2, POSES.scared]]);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.08 * ramp(t, 5.5, 9.1)} oy={1000} x={sumShake(t, [[lunge, 0.3, 20]]).x}>
        <World>
          <rect width={W} height={GROUND} fill="#FFD6A5" />
          {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 140} y={0} width={60} height={GROUND} fill="#000" opacity={0.04} />)}
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#A0522D" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {/* zapatillas */}
          <g transform={`translate(260 ${GROUND - 14})`}>
            <path d="M -40 0 L -40 -30 Q -10 -40 10 -24 L 50 -14 Q 60 0 50 6 L -40 6 Z" fill="#fff" stroke="#111" strokeWidth={5} />
            <path d="M -40 2 L 52 2" stroke="#E63946" strokeWidth={6} />
          </g>
          <Shadow x={300} />
          <Stickman x={300} y={GROUND - heroJump} scale={1.45} color={HERO} pose={heroPose} eyes={t < lunge ? 'psychic' : 'wide'} mouth={t < lunge ? 'smile' : 'open'} look={1} />
          <Shadow x={dogX} w={110} />
          <Dog x={dogX} y={GROUND} t={t} jump={jump} />
        </World>
      </Cam>
      <Thought t={t} at={6.2} until={8.4} text="¿Y SI ME COMO SU ZAPATILLA?" x={720} y={780} w={520} tailX={700} tailY={1080} />
      <BigText t={t} at={lunge} text="¡GUAU!" y={330} size={200} />
      <Sparkles t={t} at={6.2} cx={720} cy={700} n={10} spread={300} color={PSY} />
    </AbsoluteFill>
  );
};

// ---------------- M3: la profe ----------------
export const M3Class: React.FC<{t: number}> = ({t}) => {
  const bell = 11.8;
  const ring = t > bell ? Math.sin(t * 60) * 10 : 0;
  return (
    <AbsoluteFill>
      <Cam s={1.02 + 0.06 * ramp(t, 9.1, 12.6)} oy={1000} x={sumShake(t, [[bell, 0.6, 12]]).x}>
        <World>
          <rect width={W} height={GROUND} fill="#F1E3C6" />
          <rect x={80} y={560} width={720} height={420} rx={12} fill="#2F5D50" stroke="#8B5A3C" strokeWidth={18} />
          <text x={440} y={760} textAnchor="middle" fontFamily={FONT} fontSize={110} fill="#fff" opacity={0.9}>2 + 2 = ?</text>
          <text x={440} y={900} textAnchor="middle" fontFamily={FONT} fontSize={60} fill="#fff" opacity={0.6}>EXAMEN</text>
          {/* timbre */}
          <g transform={`translate(930 520) rotate(${ring})`}>
            <circle r={60} fill="#FFD23F" stroke="#111" strokeWidth={8} />
            <circle r={14} fill="#111" />
            {t > bell && [0, 1, 2].map((i) => <path key={i} d={`M ${80 + i * 22} -40 Q ${100 + i * 22} 0 ${80 + i * 22} 40`} stroke="#111" strokeWidth={7} fill="none" />)}
          </g>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#C49A6C" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          <Shadow x={820} />
          <Stickman x={820} y={GROUND} scale={1.45} color="#2EC4B6" pose={POSES.point} flip glasses eyes={t < bell ? 'normal' : 'happy'} mouth={t < bell ? 'frown' : 'grin'} look={1} blink={blinkAt(t, 1)} />
          {/* pupitre del heroe */}
          <Stickman x={300} y={GROUND + 120} scale={1.25} color={HERO} pose={POSES.idle} eyes="psychic" mouth="grin" look={1} />
          <rect x={150} y={1180} width={300} height={40} rx={6} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
          <rect x={170} y={1220} width={20} height={150} fill="#111" />
          <rect x={410} y={1220} width={20} height={150} fill="#111" />
        </World>
      </Cam>
      <Thought t={t} at={9.8} text="OJALÁ SUENE YA EL TIMBRE..." x={720} y={720} w={540} tailX={800} tailY={880} />
      <BigText t={t} at={bell} text="¡RIIIING!" y={300} size={170} wiggle />
    </AbsoluteFill>
  );
};

// ---------------- M4: era increible... al principio ----------------
export const M4Fun: React.FC<{t: number}> = ({t}) => {
  const scratch = 14.2;
  const tf = Math.min(t, scratch);
  const frozen = t >= scratch;
  const hop = -Math.abs(Math.sin(tf * 8)) * 70;
  return (
    <AbsoluteFill style={{filter: frozen ? 'grayscale(0.85) contrast(1.1)' : undefined}}>
      <Burst t={tf} c1="#7B2CBF" c2="#9D4EDD" speed={40} />
      <World>
        <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#3C096C" />
        <Shadow x={540} />
        <MiniThoughts t={tf} n={8} cx={540} cy={GROUND - 520} r={420} />
        <Stickman x={540} y={GROUND + hop} scale={1.6} color={HERO} pose={{...POSES.cheer, armL: [-135 + Math.sin(tf * 8) * 20, -30], armR: [135 - Math.sin(tf * 8) * 20, 30]}} eyes={frozen ? 'wide' : 'happy'} mouth={frozen ? 'o' : 'grin'} />
      </World>
      <BigText t={t} at={12.8} until={14.15} text="¡ERA INCREÍBLE!" y={320} size={140} wiggle />
      <BigText t={t} at={14.25} text="...AL PRINCIPIO" y={320} size={130} color="#fff" rotate={0} />
      <Sparkles t={t} at={12.8} cx={540} cy={800} n={24} spread={600} />
    </AbsoluteFill>
  );
};

// ---------------- M5 + M6: demasiadas voces ----------------
const SNIPPETS = [
  '¿HE APAGADO EL GAS?', 'TENGO HAMBRE', 'QUÉ SUEÑO', 'ME PICA LA NARIZ', '¿Y SI LLUEVE?', 'LALALA', 'LLEGO TARDE',
  'ME DUELE EL PIE', 'PIZZA...', '¿ME QUIERE?', 'ODIO LOS LUNES', 'TENGO PIS', 'SE ME OLVIDÓ', '¿QUÉ HORA ES?',
  'QUIERO VACACIONES', '¿ESTO ES REAL?', 'MI WIFI...', 'CALOR', 'NO ME DA TIEMPO', '¿DÓNDE ESTÁN MIS LLAVES?',
];

const Crowd: React.FC<{t: number; n: number; bubbles: number; shake?: number}> = ({t, n, bubbles, shake = 0}) => (
  <>
    {Array.from({length: bubbles}).map((_, i) => {
      const x = 130 + rnd(i * 3 + 1) * 820 + Math.sin(t * 7 + i) * shake;
      const y = 260 + rnd(i * 5 + 2) * 900 + Math.cos(t * 6 + i) * shake;
      const s = pop(t, 15.5 + i * 0.18, 10, 220);
      const fs = 30 + rnd(i) * 16;
      return (
        <div key={i} style={{position: 'absolute', left: x - 170, top: y, width: 340, display: 'flex', justifyContent: 'center', transform: `scale(${s}) rotate(${(rnd(i + 7) - 0.5) * 16}deg)`}}>
          <div style={{background: '#fff', border: '5px solid #111', borderRadius: 999, padding: '12px 20px', fontFamily: FONT, fontSize: fs, color: '#111', boxShadow: '0 6px 0 #111', whiteSpace: 'nowrap'}}>{SNIPPETS[i % SNIPPETS.length]}</div>
        </div>
      );
    })}
  </>
);

const Metro: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={W} height={GROUND} fill="#D9DEE8" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={40 + i * 350} y={480} width={300} height={260} rx={30} fill="#1B263B" stroke="#111" strokeWidth={8} />
        <rect x={40 + i * 350} y={480} width={300} height={260} rx={30} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={4} />
        {Array.from({length: 3}).map((_, j) => {
          const x = 40 + i * 350 + (((t * 900 + j * 140) % 300));
          return <line key={j} x1={x} y1={500} x2={x - 60} y2={720} stroke="#FFD35A" strokeWidth={6} opacity={0.6} />;
        })}
      </g>
    ))}
    {[200, 540, 880].map((x) => <rect key={x} x={x - 8} y={300} width={16} height={1000} fill="#B8C4D0" stroke="#111" strokeWidth={4} />)}
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#5C677D" />
  </g>
);

const Hall: React.FC = () => (
  <g>
    <rect width={W} height={GROUND} fill="#FFE8A3" />
    {Array.from({length: 7}).map((_, i) => (
      <g key={i}>
        <rect x={20 + i * 150} y={620} width={130} height={680} fill={['#4361EE', '#F72585', '#06D6A0'][i % 3]} stroke="#111" strokeWidth={7} />
        <rect x={50 + i * 150} y={680} width={70} height={10} fill="#111" />
        <rect x={50 + i * 150} y={710} width={70} height={10} fill="#111" />
      </g>
    ))}
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#B5838D" />
  </g>
);

export const M5Voices: React.FC<{t: number}> = ({t}) => {
  const place = t < 18.4 ? 'calle' : t < 19.3 ? 'metro' : t < 20.0 ? 'calle2' : 'cole';
  const bubbles = Math.min(20, Math.max(0, Math.floor((t - 15.4) * 3.6)));
  const w = Math.sin(t * 6) * 40;
  const heroPose: Pose = {...POSES.headHold, legL: [w * 0.6, 10], legR: [-w * 0.6, 10]};
  const s = 1 + 0.04 * Math.sin(t * 3) + (t > 17.7 ? 0.1 * easeOut(ramp(t, 17.7, 18.0)) : 0);
  return (
    <AbsoluteFill>
      <Cam s={s} oy={900} x={sumShake(t, [[17.7, 0.4, 25], [18.4, 0.2, 15], [19.3, 0.2, 15], [20.0, 0.2, 15]]).x}>
        <World>
          {place === 'metro' ? <Metro t={t} /> : place === 'cole' ? <Hall /> : (
            <g>
              <rect width={W} height={H} fill={place === 'calle' ? '#8ECAE6' : '#FFB4A2'} />
              <City seed={place === 'calle' ? 0 : 4} />
              <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#6d7a8c" />
            </g>
          )}
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {/* gente */}
          {[90, 230, 850, 990].map((x, i) => (
            <Stickman key={i} x={x} y={GROUND} scale={1.1} color={['#E63946', '#4361EE', '#F72585', '#06D6A0'][(i + (place === 'metro' ? 1 : place === 'cole' ? 2 : 0)) % 4]} pose={POSES.idle} flip={x > 540} eyes="normal" look={x < 540 ? 1 : -1} blink={blinkAt(t, i)} />
          ))}
          <Shadow x={540} />
          <Stickman x={540} y={GROUND} scale={1.5} color={HERO} pose={heroPose} eyes="psychic" mouth="frown" sweat />
          <Waves t={t * 1.6} x={540} y={GROUND - 1.5 * 308} o={0.5} />
        </World>
      </Cam>
      <Crowd t={t} n={20} bubbles={bubbles} shake={t > 17.7 ? 8 : 2} />
      <BigText t={t} at={16.0} until={17.65} text="100 VOCES" y={240} size={150} color="#FFE24A" />
      <BigText t={t} at={17.7} text="¡1.000!" y={250} size={230} color="#FF3B5C" wiggle />
    </AbsoluteFill>
  );
};

export const M6Overload: React.FC<{t: number}> = ({t}) => {
  const sh = sumShake(t, [[21.0, 1.8, 18]]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#2A0010'}} />
      <Cam s={1.1} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#14000A" />
          <Waves t={t * 3} x={540} y={GROUND - 520} />
          <Stickman x={540} y={GROUND + 60} scale={1.5} color={HERO} pose={POSES.kneel} eyes="closed" mouth="teeth" red={0.4} sweat />
        </World>
      </Cam>
      <Crowd t={t + 5} n={20} bubbles={20} shake={20} />
      {Math.floor(t * 20) % 3 === 0 && <AbsoluteFill style={{background: 'rgba(255,255,255,0.08)'}} />}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(255,0,40,0.7)'}} />
      <BigText t={t} at={21.2} text={'¡NO PODÍA\nAPAGARLO!'} y={300} size={140} color="#fff" wiggle />
    </AbsoluteFill>
  );
};

// ---------------- M7: una voz mas fuerte ----------------
export const M7Voice: React.FC<{t: number}> = ({t}) => {
  const boom = 23.4;
  const loud = 25.6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: t < boom ? '#2A0010' : '#05000A'}} />
      <Cam s={1 + 0.15 * ramp(t, boom, 27.5)} oy={1100} x={sumShake(t, [[boom, 0.5, 30], [loud, 0.5, 25]]).x}>
        <World>
          <Stickman x={540} y={GROUND + 60} scale={1.5} color={HERO} pose={t < boom ? POSES.kneel : POSES.scared} eyes="wide" mouth="o" sweat={t > boom} />
          {t > loud && <circle cx={540} cy={500} r={500} fill={PSY} opacity={0.15 + 0.05 * Math.sin(t * 8)} filter="url(#blurGlow)" />}
        </World>
      </Cam>
      {t < boom && <Crowd t={t + 5} n={20} bubbles={20} shake={20} />}
      <BigText t={t} at={boom} until={25.5} text={'UNA VOZ MÁS\nFUERTE QUE TODAS'} y={330} size={110} color="#fff" />
      <Thought t={t} at={loud} text="SÉ QUE ME ESTÁS ESCUCHANDO" x={540} y={820} w={760} size={70} color="#1B0033" textColor="#FF3B5C" dark tailX={540} tailY={1000} />
      <Flash t={t} at={boom} dur={0.3} color="#000" />
      <Flash t={t} at={loud} dur={0.25} color={PSY} max={0.6} />
    </AbsoluteFill>
  );
};

// ---------------- M8: el hombre de gris ----------------
const ManInGray: React.FC<{t: number; x: number; y?: number; s?: number; reveal?: number; pose?: Pose; flip?: boolean; eyes?: any; mouth?: any}> = ({t, x, y = GROUND, s = 1.45, reveal = 0, pose = POSES.idle, flip = true, eyes, mouth}) => (
  <Stickman
    x={x} y={y} scale={s} color={mix(GRAY, HERO, reveal)} pose={pose} flip={flip}
    eyes={eyes ?? (reveal > 0 ? 'normal' : 'psychic')} mouth={mouth ?? (reveal > 0 ? 'smile' : 'none')}
    hood={reveal <= 0} mustache={reveal > 0} glasses={reveal > 0} look={1} blink={reveal > 0 && blinkAt(t, 0.3)}
  />
);

export const M8Man: React.FC<{t: number}> = ({t}) => {
  const turn = 27.7;
  const zoom = 29.6;
  const s = t < zoom ? 1 : 1 + 0.7 * easeInOut(ramp(t, zoom, zoom + 0.6));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#3A0CA3, #F72585 120%)'}} />
      <Cam s={s} ox={800} oy={900} x={sumShake(t, [[32.2, 0.4, 15]]).x}>
        <World>
          <City dark />
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#1c1630" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {/* farola */}
          <rect x={780} y={560} width={16} height={740} fill="#222" />
          <circle cx={788} cy={560} r={30} fill="#FFE8A3" />
          <path d={`M 788 580 L 640 ${GROUND} L 940 ${GROUND} Z`} fill="#FFE8A3" opacity={0.18} />
          <Shadow x={240} />
          <Stickman x={240} y={GROUND} scale={1.45} color={HERO} pose={t < turn ? POSES.headHold : POSES.scared} flip={t < turn} eyes={t < turn ? 'closed' : 'wide'} mouth="o" look={1} sweat={t > turn} />
          <Shadow x={800} w={90} />
          <ManInGray t={t} x={800} s={1.3} />
        </World>
      </Cam>
      <BigText t={t} at={28.8} until={31.0} text="UN HOMBRE DE GRIS" y={300} size={110} color="#fff" />
      <Thought t={t} at={31.6} text="NO ERES EL ÚNICO" x={540} y={760} w={600} size={70} color="#1B0033" textColor={PSY} dark tailX={760} tailY={900} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,0.6)'}} />
    </AbsoluteFill>
  );
};

// ---------------- M9: persecucion ----------------
export const M9Chase: React.FC<{t: number}> = ({t}) => {
  const turnT = 35.9;
  const dir = t < turnT ? 1 : -1;
  const scroll = (t - 33.3) * 900 * (t < 34.8 ? 1 : t < turnT ? 0.15 : -1);
  const skid = t >= 34.7 && t < turnT;
  const pose = skid ? {...POSES.scared, lean: 20} : {...runPose(t, 1.4), lean: -12};
  const p1 = 34.7, p2 = 36.5;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#3A0CA3, #F72585 130%)'}} />
      <World>
        <g transform={`translate(${-((scroll % 1125) + 1125) % 1125} 0)`}>
          <City dark />
          <g transform="translate(1125 0)"><City dark seed={3} /></g>
        </g>
        <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#1c1630" />
        <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
        <Shadow x={540} />
        <Stickman x={540} y={GROUND} scale={1.45} color={HERO} pose={pose} flip={dir < 0} eyes={skid ? 'scared' : 'wide'} mouth="open" look={1} sweat />
        {t > p1 && t < turnT + 0.2 && <ManInGray t={t} x={880} s={1.45} />}
        {t > p2 && <ManInGray t={t} x={200} s={1.45} flip={false} />}
      </World>
      {!skid && <SpeedLines t={t} opacity={0.35} />}
      <Dust t={t} at={p1} x={880} y={GROUND} />
      <Dust t={t} at={p2} x={200} y={GROUND} />
      <Sparkles t={t} at={p1} cx={880} cy={900} n={16} spread={300} color={PSY} />
      <Sparkles t={t} at={p2} cx={200} cy={900} n={16} spread={300} color={PSY} />
      <Thought t={t} at={35.0} until={35.95} text="VA A GIRAR A LA IZQUIERDA" x={760} y={740} w={480} size={46} color="#1B0033" textColor={PSY} dark tailX={880} tailY={860} />
      <BigText t={t} at={33.5} until={34.6} text="¡CORRÍ!" y={300} size={170} />
      <BigText t={t} at={35.2} text={'¡SABÍA CADA\nPASO!'} y={300} size={130} color={PSY} wiggle />
      <Flash t={t} at={p1} dur={0.2} color={PSY} max={0.5} />
      <Flash t={t} at={p2} dur={0.2} color={PSY} max={0.5} />
    </AbsoluteFill>
  );
};

// ---------------- M10: el callejon ----------------
const Alley: React.FC<{light?: number}> = ({light = 0}) => (
  <g>
    <rect width={W} height={GROUND} fill={mix('#3D1A1A', '#B5654E', light)} />
    {Array.from({length: 16}).map((_, r) =>
      Array.from({length: 7}).map((__, c) => (
        <rect key={`${r}-${c}`} x={c * 170 - (r % 2) * 85} y={r * 82} width={160} height={72} rx={6} fill={mix('#5A2626', '#D27D5F', light)} stroke="#111" strokeWidth={4} />
      )),
    )}
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill={mix('#1a1010', '#6B5050', light)} />
    <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
    <rect x={60} y={1080} width={260} height={220} rx={10} fill="#2D6A4F" stroke="#111" strokeWidth={8} />
    <rect x={40} y={1060} width={300} height={40} rx={8} fill="#1B4332" stroke="#111" strokeWidth={7} />
  </g>
);

export const M10Alley: React.FC<{t: number}> = ({t}) => {
  const mx = 140 + easeOut(ramp(t, 37.8, 40.0)) * 380;
  const step = Math.sin(t * 8) * 18 * (t < 40 ? 1 : 0);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.12 * ramp(t, 37.6, 41.8)} ox={700} oy={950} x={sumShake(t, [[38.4, 0.3, 20]]).x}>
        <World>
          <Alley />
          <Shadow x={880} />
          <Stickman x={880} y={GROUND} scale={1.45} color={HERO} pose={POSES.scared} flip eyes="scared" mouth="open" look={1} sweat />
          <Shadow x={mx} />
          <ManInGray t={t} x={mx} flip={false} pose={{...POSES.idle, legL: [step, 4], legR: [-step, -4]}} />
        </World>
      </Cam>
      <BigText t={t} at={38.0} until={40.0} text="¡ME ACORRALÓ!" y={300} size={140} color="#FF3B5C" />
      <Thought t={t} at={40.1} text="TE ENSEÑARÉ A CONTROLARLO" x={480} y={760} w={620} size={62} color="#1B0033" textColor={PSY} dark tailX={mx} tailY={900} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 240px rgba(0,0,0,0.65)'}} />
    </AbsoluteFill>
  );
};

// ---------------- M11: concentracion y silencio ----------------
export const M11Silence: React.FC<{t: number}> = ({t}) => {
  const silence = 45.6;
  const shrink = easeInOut(ramp(t, 43.3, silence));
  const white = t >= silence;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: white ? '#F8F7FF' : `radial-gradient(circle at 50% 45%, #5A189A, #10002B)`}} />
      <Cam s={1.15 + 0.1 * ramp(t, 41.8, 45.6)} oy={850}>
        <World>
          {!white && <Waves t={t * 1.3} x={540} y={GROUND - 1.5 * 308} inward />}
          {!white && <MiniThoughts t={t} n={14} cx={540} cy={GROUND - 470} r={480} shrink={shrink} />}
          <Stickman x={540} y={GROUND} scale={1.5} color={HERO} pose={{...POSES.idle, armL: [-35, 20], armR: [35, -20]}} eyes="closed" mouth={white ? 'smile' : 'frown'} />
        </World>
      </Cam>
      <BigText t={t} at={44.4} until={45.55} text="POR PRIMERA VEZ..." y={300} size={110} color="#fff" />
      {white && (
        <div style={{position: 'absolute', top: 360, width: W, textAlign: 'center', fontFamily: FONT, fontSize: 80, color: '#B8B8C8', letterSpacing: 18, opacity: ramp(t, silence, silence + 0.4)}}>
          silencio.
        </div>
      )}
      <Flash t={t} at={silence} dur={0.5} />
    </AbsoluteFill>
  );
};

// ---------------- M12: el giro ----------------
export const M12Reveal: React.FC<{t: number}> = ({t}) => {
  const open = 47.3, reveal = 48.4, yo = 49.1, plus = 50.4;
  const k = easeInOut(ramp(t, reveal, yo));
  return (
    <AbsoluteFill>
      <Cam s={1.05 + (t > yo ? 0.1 * easeOut(ramp(t, yo, yo + 0.3)) : 0)} oy={950} x={sumShake(t, [[reveal, 0.4, 20], [plus, 0.3, 20]]).x}>
        <World>
          <Alley light={0.6} />
          <Shadow x={760} />
          <Stickman x={760} y={GROUND} scale={1.45} color={HERO} pose={t < yo ? POSES.idle : POSES.scared} flip eyes={t < open ? 'closed' : 'wide'} mouth={t < yo ? 'none' : 'open'} look={1} blink={t > open && blinkAt(t)} />
          <Shadow x={330} />
          <ManInGray t={t} x={330} flip={false} reveal={k > 0 ? Math.max(0.01, k) : 0} pose={t > plus ? POSES.wave : POSES.idle} mouth={t > reveal ? 'smile' : undefined} />
        </World>
      </Cam>
      <BigText t={t} at={yo} until={50.3} text="¡ERA YO!" y={320} size={200} color="#FFE24A" wiggle />
      {t > plus && (
        <div style={{position: 'absolute', top: 230, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, plus, 8, 220)}) rotate(-8deg)`}}>
          <div style={{border: '14px solid #E0002A', borderRadius: 30, padding: '6px 40px', fontFamily: FONT, fontSize: 150, color: '#E0002A', background: 'rgba(255,255,255,0.9)'}}>+40 AÑOS</div>
        </div>
      )}
      <Thought t={t} at={50.8} text="HOLA, YO" x={330} y={720} w={360} size={60} tailX={330} tailY={860} />
      <Flash t={t} at={reveal} dur={0.3} />
    </AbsoluteFill>
  );
};

export const M13End: React.FC<{t: number}> = ({t}) => (
  <EndCard t={t} start={52.0} question={'¿QUÉ PENSAMIENTO TUYO\nNO QUERRÍAS QUE\nNADIE ESCUCHARA?'} cta="¡COMÉNTALO!" c1="#240046" c2="#3C096C" />
);
