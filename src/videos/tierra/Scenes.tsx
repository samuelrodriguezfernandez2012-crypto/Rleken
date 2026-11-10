import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stickman, POSES, Pose, runPose} from '../../Stickman';
import {W, H, FONT, BigText, Bubble, Sparkles, Flash, Dust, SpeedLines, pop, ramp, easeOut, easeInOut, sumShake, rnd} from '../../fx';
import {Cam, World, poseSeq, Shadow, HERO, GROUND, blinkAt, EndCard, City, Cloud} from '../../common';

// ---------- piezas ----------
const Stars: React.FC<{n?: number; seed?: number}> = ({n = 70, seed = 0}) => (
  <g>
    {Array.from({length: n}).map((_, i) => (
      <circle key={i} cx={rnd(i + seed) * W} cy={rnd(i * 3 + seed + 1) * H} r={1.5 + rnd(i + 9) * 3.5} fill="#fff" opacity={0.4 + rnd(i + 4) * 0.6} />
    ))}
  </g>
);

// continentes: manchas que se desplazan para simular el giro
const LANDS = [
  'M -120 -80 Q -60 -150 20 -110 Q 70 -60 30 0 Q -10 60 -70 40 Q -140 10 -120 -80 Z',
  'M -60 60 Q 0 30 50 80 Q 70 150 10 190 Q -50 170 -60 60 Z',
  'M 40 -180 Q 120 -200 160 -140 Q 150 -90 90 -100 Q 40 -120 40 -180 Z',
];

export const Globe: React.FC<{cx: number; cy: number; r: number; rot: number; ocean?: number; id: string; arrow?: number}> = ({cx, cy, r, rot, ocean = 0, id, arrow = 0}) => {
  const period = 2.4 * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.1} fill="#6EC8FF" opacity={0.25} filter="url(#blurGlow)" />
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={ocean > 0.5 ? '#C9A26B' : '#2E86DE'} />
      <g clipPath={`url(#${id})`}>
        {ocean > 0 && ocean <= 0.5 && <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} fill="#C9A26B" opacity={ocean * 2} />}
        {ocean < 0.5 &&
          [0, 1].map((k) =>
            LANDS.map((d, i) => {
              const x = cx - r + (((rot * r * 0.8 + i * period * 0.37 + k * period) % (period * 2)) - period * 0.5);
              return <path key={`${k}-${i}`} d={d} transform={`translate(${x} ${cy}) scale(${r / 230})`} fill="#3FB950" stroke="#111" strokeWidth={6} />;
            }),
          )}
        {ocean > 0 && (
          <g>
            {/* el agua se va a los polos */}
            <rect x={cx - r} y={cy - r} width={2 * r} height={r * (0.2 + 0.45 * (1 - Math.min(1, ocean)))} fill="#2E86DE" />
            <rect x={cx - r} y={cy + r - r * (0.2 + 0.45 * (1 - Math.min(1, ocean)))} width={2 * r} height={r} fill="#2E86DE" />
            {ocean > 0.6 && <path d={`M ${cx - r} ${cy - 20} Q ${cx} ${cy - 60} ${cx + r} ${cy - 10} L ${cx + r} ${cy + 40} Q ${cx} ${cy + 70} ${cx - r} ${cy + 30} Z`} fill="#3FB950" opacity={(ocean - 0.6) * 2.5} stroke="#111" strokeWidth={5} />}
          </g>
        )}
        <ellipse cx={cx + r * 0.35} cy={cy + r * 0.1} rx={r * 0.9} ry={r * 1.1} fill="#000" opacity={0.25} />
        <ellipse cx={cx - r * 0.4} cy={cy - r * 0.45} rx={r * 0.25} ry={r * 0.15} fill="#fff" opacity={0.35} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#111" strokeWidth={10} />
      {arrow !== 0 && (
        <g transform={`translate(${cx} ${cy + r + 70})`}>
          <path d={arrow > 0 ? 'M -150 0 L 120 0 L 120 -30 L 180 15 L 120 60 L 120 30 L -150 30 Z' : 'M 150 0 L -120 0 L -120 -30 L -180 15 L -120 60 L -120 30 L 150 30 Z'} fill={arrow > 0 ? '#3DDC84' : '#FF3B5C'} stroke="#111" strokeWidth={7} />
        </g>
      )}
    </g>
  );
};

const Car: React.FC<{c?: string}> = ({c = '#E63946'}) => (
  <g>
    <rect x={-110} y={-50} width={220} height={60} rx={20} fill={c} stroke="#111" strokeWidth={7} />
    <path d="M -60 -50 L -40 -95 L 50 -95 L 75 -50 Z" fill={c} stroke="#111" strokeWidth={7} />
    <rect x={-35} y={-85} width={40} height={30} fill="#BDE0FE" stroke="#111" strokeWidth={4} />
    <circle cx={-60} cy={12} r={26} fill="#222" stroke="#111" strokeWidth={6} />
    <circle cx={60} cy={12} r={26} fill="#222" stroke="#111" strokeWidth={6} />
  </g>
);
const House: React.FC<{c?: string}> = ({c = '#FFD6A5'}) => (
  <g>
    <rect x={-110} y={-120} width={220} height={170} fill={c} stroke="#111" strokeWidth={7} />
    <path d="M -135 -115 L 0 -220 L 135 -115 Z" fill="#C1121F" stroke="#111" strokeWidth={7} />
    <rect x={-30} y={-20} width={60} height={70} fill="#8B5A3C" stroke="#111" strokeWidth={5} />
    <rect x={-90} y={-90} width={45} height={45} fill="#BDE0FE" stroke="#111" strokeWidth={5} />
    <rect x={45} y={-90} width={45} height={45} fill="#BDE0FE" stroke="#111" strokeWidth={5} />
  </g>
);
const Tree: React.FC = () => (
  <g>
    <rect x={-14} y={-120} width={28} height={130} fill="#8B5A3C" stroke="#111" strokeWidth={5} />
    <circle cx={0} cy={-160} r={70} fill="#3FB950" stroke="#111" strokeWidth={6} />
  </g>
);

const Clock: React.FC<{x: number; y: number; r?: number; h: number; m: number}> = ({x, y, r = 120, h, m}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#fff" stroke="#111" strokeWidth={10} />
    {Array.from({length: 12}).map((_, i) => (
      <line key={i} x1={Math.sin((i * Math.PI) / 6) * r * 0.8} y1={-Math.cos((i * Math.PI) / 6) * r * 0.8} x2={Math.sin((i * Math.PI) / 6) * r * 0.92} y2={-Math.cos((i * Math.PI) / 6) * r * 0.92} stroke="#111" strokeWidth={6} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke="#111" strokeWidth={12} strokeLinecap="round" transform={`rotate(${h * 30 + m * 0.5})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.75} stroke="#E0002A" strokeWidth={8} strokeLinecap="round" transform={`rotate(${m * 6})`} />
    <circle r={10} fill="#111" />
  </g>
);

// ---------------- T1: gancho en el espacio ----------------
export const T1Hook: React.FC<{t: number}> = ({t}) => {
  const r = 420;
  const s = 1.3 - 0.3 * easeOut(ramp(t, 0, 0.6)) + 0.05 * ramp(t, 0.6, 5);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 70%, #1B2A6B, #02030F 70%)'}} />
      <Cam s={s} oy={1300} x={sumShake(t, [[0.3, 0.4, 25]]).x}>
        <World>
          <Stars />
          <Globe cx={540} cy={1500} r={r} rot={t * 1.6} id="g1" />
          {/* el heroe corre encima del planeta */}
          <Stickman x={540} y={1500 - r + 4} scale={1.1} color={HERO} pose={{...runPose(t, 1.6), lean: -12}} eyes="happy" mouth="grin" />
          {/* lineas curvas de giro */}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M ${200 - i * 60} ${1100 - i * 60} A ${r + 80 + i * 60} ${r + 80 + i * 60} 0 0 1 ${880 + i * 60} ${1100 - i * 60}`} stroke="#fff" strokeWidth={6} fill="none" strokeDasharray="30 30" strokeDashoffset={-t * 300} opacity={0.5} />
          ))}
        </World>
      </Cam>
      <BigText t={t} at={0.3} until={4.95} text="+1.000 KM/H" y={290} size={150} maxWidth={1040} />
      <BigText t={t} at={1.1} until={4.95} text="ESTÁS GIRANDO AHORA MISMO" y={450} size={66} color="#fff" rotate={2} />
      <BigText t={t} at={3.8} until={4.95} text="Y NO LO NOTAS" y={580} size={100} color="#6EF0FF" />
      <Flash t={t} at={0.3} dur={0.2} />
    </AbsoluteFill>
  );
};

// ---------------- T2: martes a las 15:00, se para ----------------
export const T2Stop: React.FC<{t: number}> = ({t}) => {
  const stop = 7.2;
  const min = Math.min(t, 6.9);
  const mm = 58 + (min - 5) * 1.0;
  const spin = t < stop ? (t - 5) * 1.6 : (stop - 5) * 1.6;
  const sh = sumShake(t, [[stop, 0.8, 50]]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#8ECAE6, #CDEFFF)'}} />
      <Cam s={1 + (t > stop ? 0.12 * easeOut(ramp(t, stop, stop + 0.3)) : 0)} oy={900} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <City />
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#6d7a8c" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          <Clock x={800} y={620} h={14} m={t < 6.0 ? 59 : 60} />
          {/* mini tierra */}
          <Globe cx={230} cy={600} r={130} rot={spin} id="g2" />
          <Shadow x={480} />
          <Stickman x={480} y={GROUND} scale={1.45} color={HERO} pose={t < stop ? POSES.idle : POSES.scared} eyes={t < stop ? 'normal' : 'wide'} mouth={t < stop ? 'smile' : 'open'} look={1} blink={blinkAt(t)} />
        </World>
      </Cam>
      <BigText t={t} at={5.3} until={7.15} text="MARTES 15:00" y={300} size={140} color="#fff" />
      <BigText t={t} at={stop} text={'¡LA TIERRA\nSE PARÓ!'} y={300} size={150} color="#FF3B5C" wiggle />
      <Flash t={t} at={stop} dur={0.3} />
    </AbsoluteFill>
  );
};

// ---------------- T3 + T4: todo sale disparado ----------------
export const T3Fly: React.FC<{t: number}> = ({t}) => {
  const items: [number, React.ReactNode, number, number][] = [
    // [instante, objeto, y, giro]
    [8.3, <Tree />, 900, 200],
    [8.9, <Car c="#4361EE" />, 700, -260],
    [9.6, <Tree />, 1200, 300],
    [10.3, <Car c="#FFB703" />, 1000, 240],
    [11.0, <House c="#BDE0FE" />, 600, -180],
    [12.6, <Car />, 900, 360],
    [13.2, <House />, 800, -220],
    [14.6, <Car c="#06D6A0" />, 500, 320],
  ];
  const wave = ramp(t, 13.9, 15.2);
  const heroK = ramp(t, 15.4, 16.3);
  const sh = sumShake(t, [[8.2, 8, 10]]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#FFB4A2, #FFE5D9)'}} />
      <World>
        <g transform={`translate(${sh.x} ${sh.y})`}>
          {/* ciudad que se arranca hacia el este */}
          <g transform={`translate(${easeOut(ramp(t, 8.2, 12)) * 300} 0)`} opacity={1 - ramp(t, 10, 12)}>
            <City />
          </g>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#6d7a8c" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {items.map(([at0, node, y, rot], i) => {
            if (t < at0 || t > at0 + 1.4) return null;
            const k = (t - at0) / 1.2;
            const x = -300 + k * (W + 600);
            return (
              <g key={i} transform={`translate(${x} ${y - Math.sin(k * Math.PI) * 120}) rotate(${k * rot}) scale(${i >= 5 ? 1.6 : 1.1})`}>
                {node}
              </g>
            );
          })}
          {/* ola gigante */}
          {t > 13.9 && (
            <g transform={`translate(${-1200 + wave * 2600} 0)`}>
              <path d={`M -400 ${H} L -400 700 Q 100 350 500 650 Q 620 760 560 860 Q 500 760 420 820 Q 520 980 700 ${H} Z`} fill="#2E86DE" stroke="#111" strokeWidth={10} />
              <path d="M -300 800 Q 100 520 420 720" stroke="#fff" strokeWidth={14} fill="none" opacity={0.7} strokeLinecap="round" />
            </g>
          )}
          {/* el heroe dando vueltas */}
          {t > 15.4 && (
            <Stickman x={-200 + heroK * 1500} y={900} scale={1.4} color={HERO} pose={POSES.scared} rotate={heroK * 720} eyes="scared" mouth="open" />
          )}
        </g>
      </World>
      <SpeedLines t={t} opacity={0.5} />
      <BigText t={t} at={11.4} until={12.55} text="¡SALIÓ DISPARADO!" y={300} size={120} color="#fff" />
      <BigText t={t} at={12.6} until={13.15} text="¡COCHES!" y={300} size={170} color="#FFE24A" />
      <BigText t={t} at={13.2} until={13.85} text="¡CASAS!" y={300} size={170} color="#FFE24A" />
      <BigText t={t} at={13.9} until={15.35} text={'¡EL AGUA\nDEL MAR!'} y={300} size={150} color="#6EF0FF" />
      <BigText t={t} at={15.4} text="¡Y YO!" y={300} size={200} color="#FF3B5C" wiggle />
    </AbsoluteFill>
  );
};

export const T4Boom: React.FC<{t: number}> = ({t}) => {
  const boom = 17.1;
  const bk = ramp(t, boom, boom + 0.8);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#5BC0FF, #CDEFFF)'}} />
      <World>
        {[0, 1, 2].map((i) => <Cloud key={i} x={W - (((t * 2600 + i * 500) % 1700) - 300)} y={400 + i * 380} s={1.2} />)}
        {t > boom && [0, 1, 2].map((i) => (
          <ellipse key={i} cx={520 - i * 60} cy={900} rx={120 + bk * 500 + i * 80} ry={(120 + bk * 500 + i * 80) * 0.75} fill="none" stroke="#fff" strokeWidth={14 - i * 4} opacity={1 - bk} />
        ))}
        {t > boom && <path d={`M 640 900 L ${200 - bk * 400} ${500 - bk * 200} L ${200 - bk * 400} ${1300 + bk * 200} Z`} fill="#fff" opacity={0.35 * (1 - bk * 0.5)} />}
        <Stickman x={560} y={1060} scale={1.5} color={HERO} pose={POSES.fly} rotate={90} eyes="scared" mouth="open" />
      </World>
      <SpeedLines t={t} opacity={0.7} />
      <BigText t={t} at={16.4} text={'¡MÁS RÁPIDO\nQUE EL SONIDO!'} y={300} size={130} wiggle />
      <Flash t={t} at={boom} dur={0.25} />
    </AbsoluteFill>
  );
};

// ---------------- T5: la antena ----------------
export const T5Antenna: React.FC<{t: number}> = ({t}) => {
  const grab = 18.5;
  const flap = Math.sin(t * 30) * 8;
  const hang: Pose = {armL: [-90 + flap * 0.3, 0], armR: [-95 + flap * 0.3, 0], legL: [-90 + flap, 10], legR: [-100 - flap, 20], lean: -80};
  const sh = sumShake(t, [[grab, 0.4, 30], [18.2, 5, 7]]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#FF9E80, #FFD6A5)'}} />
      <Cam s={1.05} x={sh.x} y={sh.y}>
        <World>
          {/* tejado */}
          <path d={`M 0 1150 L ${W} 1150 L ${W} ${H} L 0 ${H} Z`} fill="#8D5B4C" stroke="#111" strokeWidth={8} />
          {Array.from({length: 9}).map((_, i) => <line key={i} x1={i * 130} y1={1150} x2={i * 130 - 60} y2={H} stroke="#6B4135" strokeWidth={6} />)}
          {/* antena */}
          <rect x={290} y={560} width={22} height={600} fill="#B8C4D0" stroke="#111" strokeWidth={6} />
          {[640, 720, 800].map((y, i) => <rect key={i} x={170 + i * 20} y={y} width={260 - i * 40} height={14} rx={6} fill="#B8C4D0" stroke="#111" strokeWidth={5} transform={`rotate(${flap * 0.4} 300 ${y})`} />)}
          {/* trozos de asfalto */}
          {t > 21.2 &&
            Array.from({length: 14}).map((_, i) => {
              const k = ((t - 21.2) * (0.9 + rnd(i) * 0.6) + rnd(i + 3)) % 1;
              const x = -100 + k * (W + 300);
              const y = 300 + rnd(i + 8) * 1200;
              return <polygon key={i} points="0,0 60,-10 80,30 20,50" transform={`translate(${x} ${y}) rotate(${k * 600 + i * 30}) scale(${0.8 + rnd(i) * 1.2})`} fill="#4A4E69" stroke="#111" strokeWidth={5} />;
            })}
          {/* heroe colgando de la antena */}
          {t < grab ? (
            <Stickman x={-150 + easeOut(ramp(t, 18.2, grab)) * 500} y={800} scale={1.3} color={HERO} pose={POSES.fly} rotate={90} eyes="scared" mouth="open" />
          ) : (
            <Stickman x={420} y={720} scale={1.3} color={HERO} pose={hang} flip eyes="closed" mouth="teeth" sweat red={0.3} />
          )}
        </World>
      </Cam>
      <SpeedLines t={t} opacity={0.6} />
      <BigText t={t} at={grab} until={21.15} text="¡ME AGARRÉ A UNA ANTENA!" y={300} size={100} color="#fff" />
      <BigText t={t} at={21.3} text={'¡EL VIENTO\nARRANCABA EL ASFALTO!'} y={300} size={100} color="#FFE24A" wiggle />
    </AbsoluteFill>
  );
};

// ---------------- T6: el sol quieto ----------------
export const T6Sun: React.FC<{t: number}> = ({t}) => {
  const months = 27.4;
  const page = t > months ? Math.min(6, Math.floor((t - months) * 9)) : 0;
  const MESES = ['NOV', 'DIC', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY'];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#FFB703, #FB8500)'}} />
      <Cam s={1 + 0.05 * ramp(t, 23.1, 28.4)} oy={900}>
        <World>
          <circle cx={540} cy={430} r={200} fill="#FFE24A" opacity={0.4} filter="url(#blurGlow)" />
          <circle cx={540} cy={430} r={150} fill="#FFE24A" stroke="#111" strokeWidth={9} />
          {Array.from({length: 12}).map((_, i) => (
            <line key={i} x1={540 + Math.cos((i * Math.PI) / 6) * 175} y1={430 + Math.sin((i * Math.PI) / 6) * 175} x2={540 + Math.cos((i * Math.PI) / 6) * 230} y2={430 + Math.sin((i * Math.PI) / 6) * 230} stroke="#111" strokeWidth={10} strokeLinecap="round" />
          ))}
          {/* paisaje destrozado */}
          <path d={`M 0 ${GROUND} L 140 ${GROUND - 60} L 300 ${GROUND - 20} L 520 ${GROUND - 90} L 760 ${GROUND - 30} L ${W} ${GROUND - 70} L ${W} ${H} L 0 ${H} Z`} fill="#A0522D" stroke="#111" strokeWidth={8} />
          <Shadow x={330} y={GROUND - 30} />
          <Stickman x={330} y={GROUND - 30} scale={1.4} color={HERO} pose={{...POSES.idle, head: -15}} eyes="wide" mouth="o" look={0.6} blink={blinkAt(t)} />
          {/* calendario */}
          <g transform={`translate(810 ${GROUND - 330}) scale(${pop(t, 26.6)})`}>
            <rect x={-130} y={-150} width={260} height={300} rx={20} fill="#fff" stroke="#111" strokeWidth={8} />
            <rect x={-130} y={-150} width={260} height={80} rx={20} fill="#E0002A" stroke="#111" strokeWidth={8} />
            <text textAnchor="middle" y={-92} fontFamily={FONT} fontSize={54} fill="#fff">{MESES[page]}</text>
            <text textAnchor="middle" y={70} fontFamily={FONT} fontSize={130} fill="#111">10</text>
          </g>
        </World>
      </Cam>
      <BigText t={t} at={24.6} until={27.35} text={'EL SOL\nSE QUEDÓ QUIETO'} y={300} size={120} color="#fff" />
      <BigText t={t} at={27.4} text={'6 MESES'} y={330} size={210} color="#fff" wiggle />
    </AbsoluteFill>
  );
};

// ---------------- T7: medio año de dia, medio de noche ----------------
export const T7Split: React.FC<{t: number}> = ({t}) => {
  const night = 30.2;
  const split = 540;
  return (
    <AbsoluteFill>
      <World>
        <rect width={split} height={H} fill="#8ECAE6" />
        <rect x={split} width={W - split} height={H} fill="#0B1026" />
        <g transform={`translate(${split} 0)`}><Stars n={30} seed={4} /></g>
        <rect x={0} width={split} height={H} fill="#8ECAE6" />
        <circle cx={260} cy={560} r={110} fill="#FFE24A" stroke="#111" strokeWidth={8} />
        <circle cx={820} cy={560} r={90} fill="#F5F3CE" stroke="#111" strokeWidth={8} />
        <circle cx={850} cy={540} r={80} fill="#0B1026" />
        <rect x={0} y={GROUND} width={split} height={H - GROUND} fill="#5BD15B" />
        <rect x={split} y={GROUND} width={W - split} height={H - GROUND} fill="#1B3A1B" />
        <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
        <line x1={split} y1={0} x2={split} y2={H} stroke="#111" strokeWidth={10} />
        <Stickman x={split} y={GROUND} scale={1.45} color={HERO} pose={POSES.shrug} eyes="side" mouth="o" look={t < night ? -1 : 1} />
      </World>
      <BigText t={t} at={28.7} text={'MEDIO AÑO\nDE DÍA'} x={270} y={300} size={90} color="#FFE24A" maxWidth={520} rotate={-3} />
      <BigText t={t} at={night} text={'MEDIO AÑO\nDE NOCHE'} x={810} y={300} size={90} color="#6EF0FF" maxWidth={520} rotate={3} />
    </AbsoluteFill>
  );
};

// ---------------- T8: oceanos a los polos ----------------
export const T8Oceans: React.FC<{t: number}> = ({t}) => {
  const ok = easeInOut(ramp(t, 32.2, 36.3));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #1B2A6B, #02030F 70%)'}} />
      <Cam s={1 + 0.06 * ramp(t, 31.8, 37.9)} x={sumShake(t, [[36.3, 0.4, 20]]).x}>
        <World>
          <Stars seed={2} />
          <Globe cx={540} cy={1000} r={420} rot={0} ocean={0.01 + ok} id="g8" />
          {/* flechas del agua hacia los polos */}
          {t > 32.2 && t < 36.3 && [-1, 1].map((d) => (
            <path key={d} d={`M 540 ${1000 + d * 80} L 540 ${1000 + d * 330}`} stroke="#fff" strokeWidth={16} strokeLinecap="round" markerEnd="" opacity={0.8} strokeDasharray="30 22" strokeDashoffset={-t * 200 * d} />
          ))}
        </World>
      </Cam>
      <BigText t={t} at={32.1} until={36.25} text={'LOS OCÉANOS\nHUYEN A LOS POLOS'} y={300} size={105} color="#6EF0FF" />
      <BigText t={t} at={36.3} text={'¡UN CONTINENTE\nGIGANTE!'} y={300} size={125} color="#3DDC84" wiggle />
      <Flash t={t} at={36.3} dur={0.2} color="#3DDC84" max={0.4} />
    </AbsoluteFill>
  );
};

// ---------------- T9: empujar ----------------
export const T9Push: React.FC<{t: number}> = ({t}) => {
  const hands = 41.4, push1 = 43.7, nada = 44.9, push2 = 46.0, feel = 47.8;
  const strain = (t > push1 && t < nada) || t > push2;
  const heroPose = poseSeq(t, [
    [37.9, POSES.idle],
    [38.6, POSES.point],
    [40.1, POSES.fists],
    [hands, {armL: [70, 0], armR: [82, 0], legL: [70, -100], legR: [50, -80], lean: -55}],
  ]);
  const sh = sumShake(t, [[push1, 1.0, 10], [push2, 2.8, 14 + ramp(t, push2, feel) * 20], [feel, 1.1, 40]]);
  const s = 1 + 0.15 * easeInOut(ramp(t, hands, 46.0)) + (t > nada && t < push2 ? 0.05 : 0);
  const desat = t > nada && t < push2;
  return (
    <AbsoluteFill style={{filter: desat ? 'grayscale(0.7)' : undefined}}>
      <AbsoluteFill style={{background: 'linear-gradient(#0B1026, #3A0CA3)'}} />
      <Cam s={s} oy={1200} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <Stars n={40} seed={7} />
          {/* curva del planeta bajo sus pies */}
          <ellipse cx={540} cy={GROUND + 1400} rx={1600} ry={1400} fill="#C9A26B" stroke="#111" strokeWidth={10} />
          {t > feel &&
            Array.from({length: 6}).map((_, i) => (
              <polyline key={i} points={`${540 + (i - 2.5) * 40},${GROUND + 4} ${540 + (i - 2.5) * 90},${GROUND + 60} ${540 + (i - 2.5) * 150},${GROUND + 70 + rnd(i) * 60}`} stroke="#111" strokeWidth={6} fill="none" opacity={ramp(t, feel, feel + 0.3)} />
            ))}
          <Shadow x={540} />
          <Stickman
            x={480} y={GROUND + 90 * easeOut(ramp(t, hands, hands + 0.22))} scale={1.45} color={HERO} pose={heroPose}
            eyes={t < hands ? 'normal' : strain ? 'closed' : t > nada && t < push2 ? 'side' : 'angry'}
            mouth={strain ? 'teeth' : t < hands ? 'smile' : 'frown'} red={strain ? 0.5 : 0} sweat={t > push1}
          />
          {strain &&
            [0, 1, 2].map((i) => (
              <path key={i} d={`M ${460 - i * 40} ${GROUND - 300 - i * 40} l -40 -30`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={Math.abs(Math.sin(t * 12 + i))} />
            ))}
        </World>
      </Cam>
      <BigText t={t} at={38.1} until={40.05} text={'SOLO HABÍA UNA\nFORMA DE ARREGLARLO'} y={300} size={96} color="#fff" />
      <BigText t={t} at={40.1} until={41.35} text="¡EMPUJAR!" y={300} size={200} wiggle />
      <BigText t={t} at={push1} until={44.85} text="¡¡HMMMF!!" y={300} size={150} color="#FF7A1A" />
      <BigText t={t} at={nada} until={45.95} text="NADA." y={300} size={170} color="#B8B8C8" rotate={0} />
      <BigText t={t} at={push2} until={47.75} text="¡¡OTRA VEZ!!" y={300} size={150} color="#FF7A1A" wiggle />
      <BigText t={t} at={feel} text="¡SENTÍ ALGO!" y={300} size={150} color="#6EF0FF" wiggle />
      <Flash t={t} at={feel} dur={0.3} />
    </AbsoluteFill>
  );
};

// ---------------- T10: gira al reves ----------------
export const T10Reverse: React.FC<{t: number}> = ({t}) => {
  const start = 49.3;
  const spd = 1.6 * easeInOut(ramp(t, start, 50.6));
  const rot = -spd * (t - start);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #1B2A6B, #02030F 70%)'}} />
      <World>
        <Stars seed={5} />
        <Globe cx={540} cy={1000} r={400} rot={rot + 3} id="g10" arrow={t > 51.0 ? -1 : 0} />
      </World>
      <BigText t={t} at={49.3} until={50.85} text={'¡LA TIERRA\nEMPEZÓ A GIRAR!'} y={300} size={120} color="#3DDC84" />
      <BigText t={t} at={50.9} text={'...PERO AL\nREVÉS'} y={300} size={140} color="#FF3B5C" wiggle />
      <Flash t={t} at={50.9} dur={0.2} color="#FF3B5C" max={0.5} />
    </AbsoluteFill>
  );
};

// ---------------- T11: el sol sale por el oeste ----------------
export const T11West: React.FC<{t: number}> = ({t}) => {
  const rise = easeOut(ramp(t, 52.4, 55));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(#2B1B5A, ${rise > 0.5 ? '#FF9E80' : '#5A3E85'})`}} />
      <World>
        <circle cx={180} cy={GROUND - rise * 420} r={150} fill="#FFE24A" stroke="#111" strokeWidth={9} />
        <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#3a2d4f" />
        <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
        {/* cartel */}
        <rect x={811} y={950} width={18} height={350} fill="#8B5A3C" stroke="#111" strokeWidth={5} />
        <g transform="translate(820 1000)">
          <path d="M -260 -50 L 60 -50 L 60 50 L -260 50 L -310 0 Z" fill="#FFE24A" stroke="#111" strokeWidth={7} />
          <text x={-110} y={22} textAnchor="middle" fontFamily={FONT} fontSize={60} fill="#111">OESTE</text>
        </g>
        <g transform="translate(820 1120)">
          <path d="M -60 -40 L 240 -40 L 290 0 L 240 40 L -60 40 Z" fill="#fff" stroke="#111" strokeWidth={7} />
          <text x={100} y={18} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#111">ESTE</text>
        </g>
        <Shadow x={360} />
        <Stickman x={360} y={GROUND} scale={1.45} color={HERO} pose={t > 54.9 ? POSES.shh : POSES.idle} eyes={t > 54.9 ? 'side' : 'normal'} mouth={t > 54.9 ? 'o' : 'smile'} look={t > 54.9 ? 1 : -1} blink={blinkAt(t)} />
      </World>
      <BigText t={t} at={53.0} until={54.85} text={'EL SOL SALE\nPOR EL OESTE'} y={300} size={120} color="#FFE24A" />
      <BigText t={t} at={55.5} text={'Y SOLO YO\nSÉ POR QUÉ...'} y={300} size={120} color="#fff" />
      <Sparkles t={t} at={55.6} cx={360} cy={800} n={16} spread={300} />
    </AbsoluteFill>
  );
};

export const T12End: React.FC<{t: number}> = ({t}) => (
  <EndCard t={t} start={57.2} question={'¿QUÉ HARÍAS TÚ CON\n6 MESES DE NOCHE?'} cta="¡COMÉNTALO!" c1="#0B1026" c2="#1B2A6B">
    <World>
      <Stars n={40} seed={9} />
      <circle cx={900} cy={900} r={70} fill="#F5F3CE" stroke="#111" strokeWidth={7} />
      <circle cx={925} cy={885} r={62} fill="#0F1B33" />
    </World>
  </EndCard>
);
