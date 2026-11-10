import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stickman, POSES, Pose, Eyes, Mouth} from '../../Stickman';
import {W, H, FONT, BigText, Bubble, Sparkles, Flash, Dust, SpeedLines, pop, ramp, easeOut, easeInOut, sumShake, rnd} from '../../fx';
import {Cam, World, poseSeq, Shadow, HERO, GROUND, blinkAt, EndCard} from '../../common';

// ---- geometria del baño ----
const MX0 = 560, MX1 = 1010, MY0 = 430, MY1 = 1230; // marco del espejo
const MCX = (MX0 + MX1) / 2;
const REF_X = 790; // posicion del reflejo

const waveArm = (t: number, base: Pose, amp = 35, speed = 10): Pose => ({...base, armR: [base.armR[0] + Math.sin(t * speed) * amp, base.armR[1]]});

// cabeza grande (para pantallas): se recorta la cabeza de un Stickman
export const Face: React.FC<{cx: number; cy: number; s: number; eyes?: Eyes; mouth?: Mouth; color?: string; id: string; look?: number}> = ({cx, cy, s, eyes = 'evil', mouth = 'grin', color = HERO, id, look = 0}) => (
  <g>
    <defs>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={60 * s} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <Stickman x={cx} y={cy + 308 * s} scale={s} color={color} pose={POSES.idle} eyes={eyes} mouth={mouth} look={look} />
    </g>
  </g>
);

const Tiles: React.FC<{dark?: boolean}> = ({dark}) => (
  <g>
    <rect width={W} height={H} fill={dark ? '#1d2a3a' : '#BFE3EA'} />
    {Array.from({length: 12}).map((_, i) => (
      <line key={'v' + i} x1={i * 100} y1={0} x2={i * 100} y2={GROUND} stroke={dark ? '#0f1824' : '#9CCBD5'} strokeWidth={5} />
    ))}
    {Array.from({length: 14}).map((_, i) => (
      <line key={'h' + i} x1={0} y1={i * 100} x2={W} y2={i * 100} stroke={dark ? '#0f1824' : '#9CCBD5'} strokeWidth={5} />
    ))}
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill={dark ? '#2b2233' : '#E9D6B9'} />
    <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
  </g>
);

// espejo con contenido recortado dentro
const Mirror: React.FC<{children?: React.ReactNode; tint?: string; fog?: number; crack?: number; id?: string}> = ({children, tint = '#9ED8FF', fog = 0, crack = 0, id = 'mclip'}) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} rx={30} />
      </clipPath>
    </defs>
    <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} rx={30} fill={tint} />
    <g clipPath={`url(#${id})`}>
      {/* reflejo de los azulejos */}
      {Array.from({length: 6}).map((_, i) => (
        <line key={i} x1={MX0 + i * 90} y1={MY0} x2={MX0 + i * 90} y2={MY1} stroke="#fff" strokeOpacity={0.25} strokeWidth={4} />
      ))}
      {children}
      {fog > 0 && <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} fill="#F4FBFF" opacity={fog * 0.78} />}
      <path d={`M ${MX0 + 40} ${MY0 + 120} L ${MX0 + 140} ${MY0 + 20}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${MX0 + 50} ${MY0 + 200} L ${MX0 + 210} ${MY0 + 40}`} stroke="#fff" strokeOpacity={0.4} strokeWidth={8} strokeLinecap="round" />
      {crack > 0 && <Cracks k={crack} cx={MCX + 20} cy={790} />}
    </g>
    <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} rx={30} fill="none" stroke="#111" strokeWidth={22} />
    <rect x={MX0} y={MY0} width={MX1 - MX0} height={MY1 - MY0} rx={30} fill="none" stroke="#C9A227" strokeWidth={11} />
  </g>
);

const Cracks: React.FC<{k: number; cx: number; cy: number; color?: string}> = ({k, cx, cy, color = '#fff'}) => (
  <g stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {Array.from({length: 11}).map((_, i) => {
      const a = (i / 11) * Math.PI * 2 + rnd(i) * 0.4;
      const L = (260 + rnd(i + 4) * 320) * Math.min(1, k * (1 + rnd(i + 9)));
      const mid = L * 0.5;
      const p1 = [cx + Math.cos(a) * mid, cy + Math.sin(a) * mid];
      const a2 = a + (rnd(i + 2) - 0.5) * 0.5;
      const p2 = [cx + Math.cos(a2) * L, cy + Math.sin(a2) * L];
      return <polyline key={i} points={`${cx},${cy} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} stroke="#111" strokeWidth={9} />;
    })}
    {Array.from({length: 11}).map((_, i) => {
      const a = (i / 11) * Math.PI * 2 + rnd(i) * 0.4;
      const L = (260 + rnd(i + 4) * 320) * Math.min(1, k * (1 + rnd(i + 9)));
      const mid = L * 0.5;
      const p1 = [cx + Math.cos(a) * mid, cy + Math.sin(a) * mid];
      const a2 = a + (rnd(i + 2) - 0.5) * 0.5;
      const p2 = [cx + Math.cos(a2) * L, cy + Math.sin(a2) * L];
      return <polyline key={'w' + i} points={`${cx},${cy} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} />;
    })}
    {k > 0.5 && [90, 170].map((r, i) => <circle key={i} cx={cx} cy={cy} r={r * Math.min(1, (k - 0.5) * 2)} strokeDasharray="60 40" />)}
  </g>
);

const Counter: React.FC = () => (
  <g>
    <rect x={MX0 - 40} y={1150} width={MX1 - MX0 + 80} height={60} rx={10} fill="#fff" stroke="#111" strokeWidth={7} />
    <rect x={MX0} y={1210} width={MX1 - MX0} height={90} fill="#E2E8F0" stroke="#111" strokeWidth={7} />
    <path d={`M ${MCX - 30} 1150 L ${MCX - 30} 1110 Q ${MCX - 30} 1090 ${MCX} 1090 L ${MCX + 40} 1090`} stroke="#111" strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d={`M ${MCX - 30} 1150 L ${MCX - 30} 1110 Q ${MCX - 30} 1090 ${MCX} 1090 L ${MCX + 40} 1090`} stroke="#B8C4D0" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

// ---------------- R1: gancho ----------------
export const R1Hook: React.FC<{t: number}> = ({t}) => {
  const freeze = 5.3;
  const heroPose = t < 5.8 ? waveArm(t, POSES.wave, 40, 12) : poseSeq(t, [[5.8, POSES.wave], [5.8, POSES.scared]]);
  const refPose = t < freeze ? heroPose : waveArm(freeze, POSES.wave, 40, 12);
  const s = 1.3 - 0.3 * easeOut(ramp(t, 0, 0.6)) + 0.06 * ramp(t, 0.6, 5.2) + (t > freeze ? 0.25 * easeOut(ramp(t, freeze, freeze + 0.4)) : 0);
  const sh = sumShake(t, [[0.2, 0.4, 30], [freeze, 0.5, 25]]);
  const evil = t > 5.6;
  return (
    <AbsoluteFill>
      <Cam s={s} ox={t > freeze ? REF_X : 540} oy={850} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <Tiles />
          <Mirror tint={evil ? '#E8A0A8' : '#9ED8FF'}>
            <Stickman x={REF_X} y={GROUND} scale={1.45} color={HERO} pose={refPose} flip eyes={evil ? 'evil' : 'normal'} mouth={evil ? 'grin' : 'smile'} look={1} blink={!evil && t < freeze && blinkAt(t)} />
          </Mirror>
          <Counter />
          <Shadow x={330} />
          <Stickman x={330} y={GROUND} scale={1.45} color={HERO} pose={heroPose} eyes={t < 5.8 ? 'normal' : 'wide'} mouth={t < 5.8 ? 'smile' : 'o'} look={1} blink={t < freeze && blinkAt(t)} sweat={t > 5.9} />
        </World>
      </Cam>
      {evil && <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(200,0,30,0.6)'}} />}
      <BigText t={t} at={0.2} until={3.5} text="0,000000003 s" y={300} size={130} />
      <BigText t={t} at={1.3} until={3.5} text="3 NANOSEGUNDOS DE RETRASO" y={440} size={70} color="#fff" rotate={2} maxWidth={1000} />
      <BigText t={t} at={3.7} until={5.25} text="PERO EL MÍO..." y={320} size={120} color="#fff" />
      <BigText t={t} at={5.6} text={'¡DEJÓ DE\nIMITARME!'} y={320} size={130} color="#FF3B5C" wiggle />
      <Flash t={t} at={0.2} dur={0.18} />
      <Flash t={t} at={freeze} dur={0.25} color="#FF0030" max={0.5} />
    </AbsoluteFill>
  );
};

// ---------------- R2: cepillo de dientes y sonrisa ----------------
export const R2Brush: React.FC<{t: number}> = ({t}) => {
  const raise = 10.2, smile = 11.6;
  const brush: Pose = {...POSES.brush, armR: [30 + Math.sin(t * 22) * 8, -150]};
  const heroPose = poseSeq(t, [[6.9, brush], [raise, {...POSES.wave, armR: [150, 10]}]], 0.25);
  const finalHero = t < raise ? brush : heroPose;
  const refPose = POSES.idle;
  let s = 1.12;
  let ox = 540;
  if (t > smile) {
    s = 1.12 + 0.8 * easeOut(ramp(t, smile, smile + 0.35));
    ox = REF_X;
  }
  const evil = t > smile;
  return (
    <AbsoluteFill>
      <Cam s={s} ox={ox} oy={t > smile ? 830 : 900} x={sumShake(t, [[smile, 0.4, 14]]).x}>
        <World>
          <Tiles />
          <Mirror tint={evil ? '#E8A0A8' : '#9ED8FF'}>
            <Stickman x={REF_X} y={GROUND} scale={1.45} color={HERO} pose={refPose} flip eyes={evil ? 'evil' : 'normal'} mouth={evil ? 'grin' : 'none'} look={1} />
          </Mirror>
          <Counter />
          <Shadow x={330} />
          <Stickman
            x={330} y={GROUND} scale={1.45} color={HERO} pose={finalHero} item={t < raise ? 'toothbrush' : null} foam={t < raise + 0.6}
            eyes={t < 8.6 ? 'normal' : t < smile ? 'side' : 'scared'} mouth={t < 8.6 ? 'none' : 'o'} look={1} sweat={t > 9}
          />
        </World>
      </Cam>
      {evil && <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(200,0,30,0.7)'}} />}
      <BigText t={t} at={8.7} until={10.1} text="NO SE MOVIÓ" y={320} size={130} color="#fff" />
      <BigText t={t} at={10.3} until={11.5} text="LEVANTÉ LA MANO..." y={320} size={110} color="#6EF0FF" />
      <BigText t={t} at={11.8} text="ÉL SONRIÓ" y={300} size={150} color="#FF3B5C" wiggle />
      <Flash t={t} at={smile} dur={0.2} color="#FF0030" max={0.5} />
    </AbsoluteFill>
  );
};

// ---------------- R3: mensaje en el vaho ----------------
export const R3Fog: React.FC<{t: number}> = ({t}) => {
  const fog = ramp(t, 12.9, 13.5);
  const write = ramp(t, 13.5, 16.3);
  const fingerX = MX0 + 60 + write * (MX1 - MX0 - 120);
  const refPose: Pose = {...POSES.reach, armR: [100, 0]};
  return (
    <AbsoluteFill>
      <Cam s={1.35} ox={MCX} oy={820} x={sumShake(t, [[15.8, 0.5, 25]]).x}>
        <World>
          <Tiles dark={t > 15.8} />
          <Mirror fog={fog} tint="#B9D9EA" id="mclip3">
            <Stickman x={REF_X + 30} y={GROUND} scale={1.45} color={HERO} pose={refPose} flip eyes="evil" mouth="grin" look={1} opacity={0.55 + 0.45 * (1 - fog)} />
            <defs>
              <clipPath id="writeClip">
                <rect x={MX0} y={MY0} width={(MX1 - MX0) * write} height={MY1 - MY0} />
              </clipPath>
            </defs>
            <g clipPath="url(#writeClip)" fontFamily={FONT} textAnchor="middle">
              <text x={MCX} y={760} fontSize={130} fill="#2E4756" opacity={0.95}>DÉJAME</text>
              <text x={MCX} y={900} fontSize={130} fill="#2E4756" opacity={0.95}>SALIR</text>
              {/* gotas */}
              {Array.from({length: 7}).map((_, i) => (
                <rect key={i} x={MX0 + 70 + i * 55} y={770} width={8} height={40 + rnd(i) * 120 * write} rx={4} fill="#2E4756" opacity={0.7} />
              ))}
            </g>
            {t < 16.3 && <circle cx={fingerX} cy={760 + Math.sin(t * 14) * 60} r={13} fill="#111" />}
          </Mirror>
          <Counter />
        </World>
      </Cam>
      <BigText t={t} at={15.8} text="¡DÉJAME SALIR!" y={300} size={140} color="#FF3B5C" wiggle />
      <Flash t={t} at={15.8} dur={0.25} color="#FF0030" max={0.6} />
    </AbsoluteFill>
  );
};

// ---------------- R4: salon, tele, ventana, movil ----------------
const Static: React.FC<{t: number; x: number; y: number; w: number; h: number}> = ({t, x, y, w, h}) => {
  const f = Math.floor(t * 30);
  return (
    <g>
      {Array.from({length: 18}).map((_, i) => (
        <rect key={i} x={x} y={y + (i / 18) * h} width={w} height={h / 18} fill={rnd(f * 31 + i) > 0.5 ? '#ddd' : '#555'} opacity={0.9} />
      ))}
    </g>
  );
};

export const R4Screens: React.FC<{t: number}> = ({t}) => {
  const run = t < 17.7;
  const hx = run ? -100 + easeOut(ramp(t, 17.0, 17.7)) * 400 : 300;
  const heroPose = run ? {...POSES.idle, armL: [-50 * Math.sin(t * 28), 70] as [number, number], armR: [50 * Math.sin(t * 28), -70] as [number, number], legL: [40 * Math.sin(t * 28), -30] as [number, number], legR: [-40 * Math.sin(t * 28), -30] as [number, number], lean: -10} : POSES.scared;
  if (t < 20.4) {
    const onTV = t > 18.6;
    return (
      <AbsoluteFill>
        <Cam s={1 + 0.15 * easeOut(ramp(t, 18.6, 19.0))} ox={800} oy={800} x={sumShake(t, [[18.6, 0.4, 20]]).x}>
          <World>
            <rect width={W} height={GROUND} fill="#3D3466" />
            <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#5A3E36" />
            <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
            {/* sofa */}
            <rect x={40} y={1080} width={360} height={170} rx={30} fill="#C44569" stroke="#111" strokeWidth={8} />
            {/* tele */}
            <rect x={560} y={640} width={460} height={300} rx={18} fill="#222" stroke="#111" strokeWidth={9} />
            {onTV ? (
              <g>
                <rect x={580} y={660} width={420} height={260} fill="#7A0016" />
                <Face cx={790} cy={790} s={2.0} id="tvface" />
              </g>
            ) : t > 18.2 ? (
              <Static t={t} x={580} y={660} w={420} h={260} />
            ) : (
              <rect x={580} y={660} width={420} height={260} fill="#1a1a2e" />
            )}
            <rect x={740} y={940} width={100} height={60} fill="#333" stroke="#111" strokeWidth={6} />
            <rect x={600} y={1000} width={380} height={30} rx={8} fill="#6B4F3A" stroke="#111" strokeWidth={6} />
            <Shadow x={hx} />
            <Stickman x={hx} y={GROUND} scale={1.4} color={HERO} pose={heroPose} eyes={onTV ? 'scared' : 'wide'} mouth="o" look={1} sweat={!run} />
          </World>
        </Cam>
        {run && <SpeedLines t={t} opacity={0.4} />}
        <BigText t={t} at={18.9} text={'¡TAMBIÉN EN\nLA TELE!'} y={330} size={120} color="#FF3B5C" />
        <Flash t={t} at={18.6} dur={0.2} color="#FF0030" max={0.4} />
      </AbsoluteFill>
    );
  }
  if (t < 21.7) {
    // ventana de noche con su cara
    return (
      <AbsoluteFill>
        <Cam s={1 + 0.06 * ramp(t, 20.4, 21.7)}>
          <World>
            <rect width={W} height={H} fill="#3D3466" />
            <rect x={140} y={360} width={800} height={1000} rx={16} fill="#0B1026" stroke="#111" strokeWidth={14} />
            {Array.from({length: 30}).map((_, i) => <circle key={i} cx={160 + rnd(i) * 760} cy={380 + rnd(i + 7) * 960} r={2 + rnd(i + 3) * 3} fill="#fff" opacity={0.7} />)}
            <circle cx={800} cy={500} r={60} fill="#F5F3CE" />
            <Face cx={540} cy={840} s={4.2} id="winface" />
            <rect x={140} y={360} width={800} height={1000} rx={16} fill="#9ED8FF" opacity={0.12} />
            <line x1={540} y1={360} x2={540} y2={1360} stroke="#111" strokeWidth={14} />
            <line x1={140} y1={860} x2={940} y2={860} stroke="#111" strokeWidth={14} />
            <rect x={140} y={360} width={800} height={1000} rx={16} fill="none" stroke="#8B5A3C" strokeWidth={8} />
          </World>
        </Cam>
        <BigText t={t} at={20.45} text="EN LA VENTANA" y={250} size={110} color="#fff" />
      </AbsoluteFill>
    );
  }
  // movil en la mano
  const k = easeOut(ramp(t, 21.7, 22.0));
  return (
    <AbsoluteFill>
      <World>
        <rect width={W} height={H} fill="#2A2050" />
        <g transform={`translate(540 ${1100 + (1 - k) * 600}) rotate(${-6 + Math.sin(t * 30) * 1.5})`}>
          {/* mano */}
          <ellipse cx={0} cy={420} rx={260} ry={160} fill="#111" />
          <rect x={-250} y={-520} width={500} height={980} rx={60} fill="#222" stroke="#111" strokeWidth={12} />
          <rect x={-215} y={-470} width={430} height={860} rx={30} fill="#7A0016" />
          <Face cx={0} cy={-60} s={3.2} id="phoneface" />
          <ellipse cx={-230} cy={60} rx={60} ry={40} fill="#111" />
          <ellipse cx={230} cy={0} rx={50} ry={34} fill="#111" />
        </g>
      </World>
      <BigText t={t} at={21.75} text="EN EL MÓVIL" y={250} size={120} color="#FF3B5C" />
    </AbsoluteFill>
  );
};

// ---------------- R5: cada cristal era una puerta ----------------
const TILE = [
  {k: 'tv', c: '#222'}, {k: 'win', c: '#8B5A3C'}, {k: 'phone', c: '#222'},
  {k: 'mirror', c: '#C9A227'}, {k: 'hero', c: '#fff'}, {k: 'laptop', c: '#888'},
  {k: 'spoon', c: '#B8C4D0'}, {k: 'glasses', c: '#111'}, {k: 'micro', c: '#ddd'},
];

export const R5Doors: React.FC<{t: number}> = ({t}) => {
  const door = 25.7;
  const s = 1 + 0.08 * ramp(t, 22.9, 26.9) + (t > door ? 0.1 * easeOut(ramp(t, door, door + 0.3)) : 0);
  const sh = sumShake(t, [[door, 0.6, 30]]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: t > door ? '#3a0010' : '#14101f'}} />
      <Cam s={s} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          {TILE.map((tile, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            const cx = 200 + col * 340, cy = 560 + row * 400;
            const appear = tile.k === 'hero' ? 22.9 : 23.0 + [0, 2, 4, 6, 0, 1, 3, 5, 7][i] * 0.32;
            const k = pop(t, appear);
            if (k <= 0) return null;
            const round = tile.k === 'spoon' || tile.k === 'glasses';
            return (
              <g key={i} transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
                {round ? (
                  <ellipse cx={cx} cy={cy} rx={140} ry={160} fill="#7A0016" stroke={tile.c} strokeWidth={18} />
                ) : (
                  <rect x={cx - 150} y={cy - 170} width={300} height={340} rx={24} fill={tile.k === 'hero' ? '#BFE3EA' : '#7A0016'} stroke={tile.c} strokeWidth={18} />
                )}
                {tile.k === 'hero' ? (
                  <Face cx={cx} cy={cy} s={2.0} eyes="scared" mouth="o" id={'hf' + i} />
                ) : (
                  <Face cx={cx} cy={cy} s={2.0} id={'tf' + i} look={t > door ? (cx < 540 ? 1 : cx > 540 ? -1 : 0) : 0} />
                )}
                <rect x={cx - 150} y={cy - 170} width={300} height={340} rx={24} fill="none" stroke="#111" strokeWidth={6} />
              </g>
            );
          })}
        </World>
      </Cam>
      {t > 23 && Math.floor(t * 15) % 4 === 0 && <AbsoluteFill style={{background: 'rgba(255,255,255,0.06)'}} />}
      <BigText t={t} at={door} text={'¡ERA UNA\nPUERTA!'} y={300} size={150} color="#FF3B5C" wiggle />
      <Flash t={t} at={door} dur={0.3} color="#FF0030" max={0.6} />
    </AbsoluteFill>
  );
};

// ---------------- R6 + R7: el espejo se rompe y me agarra ----------------
export const R6Grab: React.FC<{t: number}> = ({t}) => {
  const crackT = 27.8, armT = 30.0, grabT = 31.5, fallT = 35.3, landT = 36.3;
  const crack = easeOut(ramp(t, crackT, crackT + 0.5)) * 0.6 + easeOut(ramp(t, 28.8, 29.2)) * 0.4;
  const armK = easeOut(ramp(t, armT, armT + 0.6));
  const heroX = 380;
  const tug = t > 33.0 && t < fallT;
  const fell = t >= fallT;
  // brazo que sale del espejo hacia la muñeca del heroe
  const handX = MX0 + 20 - armK * (MX0 + 20 - (heroX + 120));
  const handY = 860;
  const heroPose: Pose = fell
    ? POSES.land
    : t > grabT
      ? {armL: [-40, 60], armR: [100 + Math.sin(t * 40) * 4, 0], legL: [-35, 35], legR: [20, -10], lean: tug ? 26 + Math.sin(t * 30) * 3 : 12}
      : t > armT
        ? POSES.scared
        : POSES.idle;
  const refPose: Pose = t > armT ? {...POSES.reach, armR: [-80, 0], lean: tug ? -10 : 0} : POSES.bang;
  const fallK = easeInOut(ramp(t, fallT, landT));
  const sh = sumShake(t, [[crackT, 0.4, 20], [28.8, 0.5, 30], [armT, 0.4, 25], [grabT, 0.3, 20], [33, 2.3, 8], [landT, 0.5, 45]]);
  const s = fell ? 1.0 : 1.08 + 0.15 * ramp(t, 27, 35);
  return (
    <AbsoluteFill>
      <Cam s={s} ox={600} oy={850} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <Tiles />
          <Mirror tint="#E8A0A8" crack={fell ? 1 : crack} id="mclip6">
            {!fell && (
              <Stickman x={REF_X - (tug ? 30 : 0)} y={GROUND} scale={1.45} color={HERO} pose={refPose} flip eyes="evil" mouth="teeth" look={1} />
            )}
          </Mirror>
          <Counter />
          {/* brazo atravesando el cristal */}
          {t > armT && !fell && (
            <g strokeLinecap="round">
              <line x1={MX0 + 30} y1={handY - 20} x2={handX} y2={handY} stroke="#111" strokeWidth={34} />
              <line x1={MX0 + 30} y1={handY - 20} x2={handX} y2={handY} stroke="#B85A10" strokeWidth={22} />
              <circle cx={handX} cy={handY} r={17} fill="#111" />
              {/* esquirlas */}
              {Array.from({length: 10}).map((_, i) => {
                const k = ramp(t, armT, armT + 1.4);
                const x = MX0 + 20 - rnd(i) * 200 * k;
                const y = handY - 60 + rnd(i + 3) * 120 + k * k * 500;
                return <polygon key={i} points={`${x},${y} ${x + 16},${y + 6} ${x + 4},${y + 22}`} fill="#E6F6FF" stroke="#111" strokeWidth={3} opacity={1 - k} />;
              })}
            </g>
          )}
          {/* caida de los dos */}
          {fell && (
            <>
              <Stickman x={heroX - 120 - fallK * 60} y={GROUND} scale={1.4} color={HERO} pose={POSES.scared} rotate={-80 * fallK} eyes="closed" mouth="o" />
              <Stickman x={heroX + 80 + (1 - fallK) * 300} y={GROUND} scale={1.4} color={HERO} pose={POSES.scared} rotate={85 * fallK} flip eyes="evil" mouth="grin" />
            </>
          )}
          {!fell && (
            <>
              <Shadow x={heroX} />
              <Stickman x={heroX} y={GROUND} scale={1.45} color={HERO} pose={heroPose} eyes={t > grabT ? 'angry' : t > crackT ? 'scared' : 'wide'} mouth={t > grabT ? 'teeth' : 'o'} look={1} sweat={t > crackT} red={tug ? 0.5 : 0} />
            </>
          )}
        </World>
      </Cam>
      {fell && <Sparkles t={t} at={fallT} cx={760} cy={820} n={40} spread={800} color="#BDF2FF" />}
      <Dust t={t} at={landT} x={430} y={GROUND} />
      <BigText t={t} at={28.8} until={29.95} text={'¡SE\nAGRIETÓ!'} y={300} size={140} color="#fff" />
      <BigText t={t} at={grabT} until={32.95} text="¡ME AGARRÓ!" y={300} size={140} color="#FF3B5C" wiggle />
      <BigText t={t} at={33.1} until={35.2} text="¡TIRÉ CON TODAS MIS FUERZAS!" y={300} size={96} color="#FFE24A" />
      <BigText t={t} at={35.6} text={'¡CAÍMOS\nLOS DOS!'} y={300} size={140} color="#fff" />
      <Flash t={t} at={armT} dur={0.2} />
      <Flash t={t} at={fallT} dur={0.35} />
    </AbsoluteFill>
  );
};

// ---------------- R8: todo al reves ----------------
const Mirrored: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{transform: 'scaleX(-1)'}}>{children}</AbsoluteFill>;

export const R8Reverse: React.FC<{t: number}> = ({t}) => {
  const up = easeOut(ramp(t, 37.4, 38.3));
  const heroPose = poseSeq(t, [[37.3, POSES.land], [38.3, POSES.scared], [40.3, POSES.idle]]);
  const look = t > 38.4 ? (Math.floor(t * 1.6) % 2 ? 1 : -1) : 0;
  return (
    <AbsoluteFill>
      <Mirrored>
        <AbsoluteFill style={{filter: 'hue-rotate(160deg) saturate(1.2)'}}>
          <Cam s={1.05} x={sumShake(t, [[37.4, 0.3, 15]]).x}>
            <World>
              <Tiles />
              <Mirror tint="#9ED8FF" crack={1} id="mclip8" />
              <Counter />
              {/* cartel BAÑO */}
              {t > 40.3 && (
                <g transform={`translate(240 600) scale(${pop(t, 40.3)})`}>
                  <rect x={-150} y={-70} width={300} height={140} rx={16} fill="#FFE24A" stroke="#111" strokeWidth={8} />
                  <text textAnchor="middle" y={30} fontFamily={FONT} fontSize={90} fill="#111">BAÑO</text>
                </g>
              )}
              {/* reloj */}
              {t > 41.2 && (
                <g transform={`translate(240 330) scale(${pop(t, 41.2)})`}>
                  <circle r={110} fill="#fff" stroke="#111" strokeWidth={10} />
                  {[12, 3, 6, 9].map((n, i) => (
                    <text key={n} x={Math.sin((i * Math.PI) / 2) * 75} y={-Math.cos((i * Math.PI) / 2) * 75 + 16} textAnchor="middle" fontFamily={FONT} fontSize={44} fill="#111">{n}</text>
                  ))}
                  <line x1={0} y1={0} x2={0} y2={-70} stroke="#111" strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 360})`} />
                  <line x1={0} y1={0} x2={45} y2={0} stroke="#E0002A" strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 40})`} />
                </g>
              )}
              <Shadow x={540} />
              <Stickman x={540} y={GROUND} scale={1.5} color={HERO} pose={heroPose} rotate={-80 * (1 - up)} eyes={t < 38.3 ? 'closed' : 'wide'} mouth="o" look={look} />
              {/* etiqueta con su nombre */}
              {t > 41.9 && (
                <g transform={`translate(540 ${GROUND - 1.5 * 200}) scale(${pop(t, 41.9)})`}>
                  <rect x={-90} y={-34} width={180} height={68} rx={12} fill="#fff" stroke="#111" strokeWidth={6} />
                  <text textAnchor="middle" y={22} fontFamily={FONT} fontSize={56} fill="#E0002A">CHIKI</text>
                </g>
              )}
            </World>
          </Cam>
        </AbsoluteFill>
        <BigText t={t} at={38.6} text={'TODO AL\nREVÉS'} y={300} size={150} color="#6EF0FF" wiggle />
      </Mirrored>
      <Flash t={t} at={37.3} dur={0.3} color="#BDF2FF" />
    </AbsoluteFill>
  );
};

// ---------------- R9: el giro: yo estoy dentro del espejo ----------------
export const R9Twist: React.FC<{t: number}> = ({t}) => {
  if (t < 46.9) {
    const pull = easeInOut(ramp(t, 43.2, 44.2));
    const s = 1.9 - 0.9 * pull;
    const refPose: Pose = t < 46.1 ? {...POSES.brush, armR: [30 + Math.sin(t * 22) * 8, -150]} : POSES.wave;
    const bang = t > 44.0 ? {...POSES.bang, armL: [-150 + Math.sin(t * 20) * 15, 40] as [number, number], armR: [150 - Math.sin(t * 20) * 15, -40] as [number, number]} : POSES.scared;
    return (
      <AbsoluteFill>
        <Cam s={s} ox={REF_X} oy={850} x={sumShake(t, [[45.6, 0.2, 10], [46.1, 0.2, 10]]).x}>
          <World>
            <Tiles />
            <Mirror tint="#7FB8E0" crack={0.35} id="mclip9">
              <Stickman x={REF_X} y={GROUND} scale={1.45} color={HERO} pose={bang} flip eyes="scared" mouth="open" look={1} sweat />
            </Mirror>
            <Counter />
            <Shadow x={330} />
            <Stickman x={330} y={GROUND} scale={1.45} color={HERO} pose={refPose} item={t < 46.1 ? 'toothbrush' : null} eyes="evil" mouth="grin" look={1} />
          </World>
        </Cam>
        <Bubble t={t} at={44.0} until={45.0} text="¡SÁCAME DE AQUÍ!" x={760} y={620} w={480} size={56} shout />
        <BigText t={t} at={45.1} text={'ÉL ME HABÍA\nMETIDO A MÍ'} y={300} size={120} color="#FF3B5C" />
        <AbsoluteFill style={{boxShadow: 'inset 0 0 200px rgba(0,0,0,0.6)'}} />
      </AbsoluteFill>
    );
  }
  // POV: estoy detras de TU pantalla
  const sway = Math.sin(t * 2.2) * 18;
  return (
    <AbsoluteFill>
      <World>
        <rect width={W} height={H} fill="#7FB8E0" />
        {Array.from({length: 6}).map((_, i) => (
          <line key={i} x1={i * 200} y1={0} x2={i * 200} y2={H} stroke="#fff" strokeOpacity={0.2} strokeWidth={6} />
        ))}
        <Stickman x={540 + sway} y={1750} scale={2.6} color={HERO} pose={POSES.hands} eyes="normal" mouth="none" look={0} blink={blinkAt(t)} />
        {/* vaho y brillos del cristal */}
        <ellipse cx={540} cy={1000} rx={300} ry={160} fill="#fff" opacity={0.15 + 0.1 * Math.sin(t * 3)} />
        <path d="M 60 300 L 300 60" stroke="#fff" strokeOpacity={0.5} strokeWidth={30} strokeLinecap="round" />
        <path d="M 60 460 L 460 60" stroke="#fff" strokeOpacity={0.3} strokeWidth={16} strokeLinecap="round" />
      </World>
      <BigText t={t} at={48.3} text={'AHORA TE IMITO...\nA TI'} y={300} size={110} color="#fff" />
      <Flash t={t} at={46.9} dur={0.3} />
    </AbsoluteFill>
  );
};

export const R10End: React.FC<{t: number}> = ({t}) => (
  <EndCard t={t} start={50.2} question={'¿TE HAS FIJADO BIEN\nEN TU REFLEJO HOY?'} cta="¡COMENTA SI TE ATREVES!" c1="#0F1B33" c2="#1B2E55">
    <World>
      <path d="M 60 300 L 300 60" stroke="#fff" strokeOpacity={0.25} strokeWidth={30} strokeLinecap="round" />
      <Cracks k={ramp(t, 52.0, 52.3)} cx={900} cy={1500} />
    </World>
  </EndCard>
);
