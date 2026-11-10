import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stickman, POSES, lerpPose, SvgDefs, Pose} from '../../Stickman';
import {
  W, H, FONT, BigText, Bubble, Burst, SpeedLines, Sparkles, Flash, Dust,
  pop, ramp, easeOut, easeInOut, sumShake, rnd, clamp,
} from '../../fx';

export const HERO = '#FF7A1A';
const GROUND = 1300;
const blinkAt = (t: number, off = 0) => ((t + off) * 1000) % 3300 < 110;

// camara: zoom/desplazamiento alrededor de un punto
const Cam: React.FC<{s?: number; ox?: number; oy?: number; x?: number; y?: number; r?: number; children: React.ReactNode}> = ({
  s = 1, ox = W / 2, oy = H / 2, x = 0, y = 0, r = 0, children,
}) => (
  <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, transformOrigin: `${ox}px ${oy}px`}}>
    {children}
  </AbsoluteFill>
);

const World: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <SvgDefs />
    {children}
  </svg>
);

const poseSeq = (t: number, keys: [number, Pose][], dur = 0.22): Pose => {
  let p = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [at, next] = keys[i];
    if (t >= at) p = lerpPose(p, next, easeOut(ramp(t, at, at + dur)));
  }
  return p;
};

const Shadow: React.FC<{x: number; y?: number; w?: number; o?: number}> = ({x, y = GROUND + 4, w = 120, o = 0.25}) => (
  <ellipse cx={x} cy={y} rx={w} ry={w * 0.16} fill="#000" opacity={o} />
);

const Cloud: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" stroke="#111" strokeWidth={5}>
    <path d="M -90 20 Q -100 -20 -60 -25 Q -50 -65 -5 -55 Q 30 -85 65 -45 Q 105 -45 100 0 Q 110 25 80 28 L -70 28 Q -95 28 -90 20 Z" />
  </g>
);

const City: React.FC<{dark?: number}> = ({dark = 0}) => (
  <g>
    {Array.from({length: 9}).map((_, i) => {
      const w = 110 + rnd(i) * 60;
      const h = 220 + rnd(i + 5) * 380;
      const x = i * 125 - 30;
      return (
        <g key={i}>
          <rect x={x} y={GROUND - h} width={w} height={h} fill={dark > 0.5 ? '#2a2440' : '#5B6C9E'} stroke="#111" strokeWidth={5} />
          {Array.from({length: Math.floor(h / 70)}).map((__, j) => (
            <rect key={j} x={x + 22} y={GROUND - h + 25 + j * 70} width={w - 44} height={26} rx={4} fill={dark > 0.5 ? (rnd(i * 9 + j) > 0.4 ? '#FFD35A' : '#3b3458') : '#BFE6FF'} opacity={0.9} />
          ))}
        </g>
      );
    })}
  </g>
);

const Meteor: React.FC<{x: number; y: number; r: number; t: number}> = ({x, y, r, t}) => {
  const fl = (i: number) => 1 + Math.sin(t * 30 + i) * 0.08;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* llamas */}
      <g transform="rotate(-35)">
        <path d={`M ${-r * 0.95} 0 Q ${-r * 0.6} ${-r * 2.6 * fl(1)} 0 ${-r * 3.2 * fl(2)} Q ${r * 0.6} ${-r * 2.6 * fl(3)} ${r * 0.95} 0 Z`} fill="#FF4D1A" stroke="#111" strokeWidth={6} />
        <path d={`M ${-r * 0.7} 0 Q ${-r * 0.4} ${-r * 1.9 * fl(4)} 0 ${-r * 2.4 * fl(5)} Q ${r * 0.4} ${-r * 1.9 * fl(6)} ${r * 0.7} 0 Z`} fill="#FFB31A" />
        <path d={`M ${-r * 0.45} 0 Q 0 ${-r * 1.4 * fl(7)} ${r * 0.45} 0 Z`} fill="#FFF3A0" />
      </g>
      <circle r={r * 1.08} fill="#FF7A1A" opacity={0.35} filter="url(#blurGlow)" />
      <circle r={r} fill="#8B5A3C" stroke="#111" strokeWidth={7} />
      <g transform={`rotate(${t * 40})`}>
        <circle cx={-r * 0.35} cy={-r * 0.2} r={r * 0.22} fill="#6B4129" stroke="#111" strokeWidth={4} />
        <circle cx={r * 0.38} cy={r * 0.25} r={r * 0.16} fill="#6B4129" stroke="#111" strokeWidth={4} />
        <circle cx={r * 0.05} cy={r * 0.48} r={r * 0.1} fill="#6B4129" stroke="#111" strokeWidth={3} />
      </g>
      <path d={`M ${-r * 0.7} ${-r * 0.45} Q ${-r * 0.4} ${-r * 0.8} 0 ${-r * 0.85}`} stroke="#fff" strokeOpacity={0.4} strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ---------------- ESCENA 1: gancho ----------------
export const SceneHook: React.FC<{t: number}> = ({t}) => {
  const land = 0.25;
  const fallY = t < land ? GROUND - 900 * Math.pow(1 - t / land, 2) : GROUND;
  const pose = poseSeq(t, [
    [0, POSES.fly],
    [land, POSES.land],
    [0.6, POSES.shrug],
    [1.6, {...POSES.shrug, head: -8}],
    [4.7, POSES.armsUp],
  ]);
  const zoomIn = 4.7;
  let s = 1.25 - 0.25 * easeOut(ramp(t, 0, 0.6)) + 0.08 * ramp(t, 0.6, 4.6);
  if (t >= zoomIn) s = 1.08 + 0.6 * easeOut(ramp(t, zoomIn, zoomIn + 0.35)) - 0.62 * easeOut(ramp(t, 6.7, 7.0));
  const sh = sumShake(t, [[land, 0.5, 40], [6.7, 0.4, 25]]);
  const glow = t >= zoomIn;
  return (
    <AbsoluteFill>
      <Burst t={t} c1="#2B1B5A" c2="#3B2A85" speed={glow ? 60 : 18} />
      <Cam s={s} oy={GROUND - 520} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#1a1238" />
          {glow && (
            <g transform={`translate(540 ${GROUND - 470}) rotate(${t * 120})`}>
              <circle r={260} fill="none" stroke="#FFE24A" strokeWidth={10} strokeDasharray="30 30" opacity={0.8} />
              <circle r={320} fill="none" stroke="#6EF0FF" strokeWidth={6} strokeDasharray="10 40" opacity={0.6} />
            </g>
          )}
          <Shadow x={540} w={130} o={t < land ? 0.1 : 0.3} />
          <Stickman
            x={540} y={fallY} scale={1.55} color={HERO} pose={pose}
            eyes={glow ? 'glow' : t > 0.6 ? 'side' : 'wide'} mouth={glow ? 'grin' : t > 0.6 ? 'smile' : 'open'}
            look={t > 0.6 && !glow ? 1 : 0} blink={!glow && blinkAt(t)}
          />
        </World>
        <Dust t={t} at={land} x={540} y={GROUND} />
      </Cam>
      {t < land + 0.2 && <SpeedLines t={t} vertical opacity={0.6} />}
      <BigText t={t} at={0.2} until={4.6} text="60%" y={330} size={300} />
      <BigText t={t} at={1.3} until={4.6} text="DE LA GENTE MIENTE" y={540} size={84} color="#fff" rotate={3} />
      <BigText t={t} at={3.0} until={4.6} text="¡EN SOLO 10 MINUTOS!" y={650} size={70} color="#6EF0FF" rotate={-2} />
      <BigText t={t} at={4.9} until={6.65} text="PERO MIS MENTIRAS..." y={330} size={110} color="#fff" />
      <BigText t={t} at={6.7} text={'¡SE HACEN\nREALIDAD!'} y={360} size={150} wiggle />
      <Sparkles t={t} at={5.1} cx={540} cy={800} n={22} spread={500} />
      <Sparkles t={t} at={6.7} cx={540} cy={400} n={26} spread={600} />
      <Flash t={t} at={0.2} dur={0.18} />
      <Flash t={t} at={6.7} dur={0.3} color="#FFE24A" max={0.8} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 2: la madre y el cuarto ----------------
const Mess: React.FC<{k: number}> = ({k}) => {
  // k: 1 = desordenado, 0 = limpio
  if (k <= 0) return null;
  const items = [
    {x: 120, y: 1290, c: '#E63946', w: 140, h: 50},
    {x: 470, y: 1330, c: '#4361EE', w: 120, h: 40},
    {x: 900, y: 1320, c: '#2EC4B6', w: 150, h: 46},
    {x: 640, y: 1360, c: '#FFB703', w: 90, h: 30},
    {x: 260, y: 1370, c: '#F72585', w: 110, h: 36},
  ];
  return (
    <g opacity={k} transform={`translate(0 ${(1 - k) * 40})`}>
      {items.map((it, i) => (
        <path
          key={i}
          d={`M ${it.x - it.w / 2} ${it.y} Q ${it.x - it.w / 3} ${it.y - it.h} ${it.x} ${it.y - it.h * 0.8} Q ${it.x + it.w / 3} ${it.y - it.h * 1.1} ${it.x + it.w / 2} ${it.y} Z`}
          fill={it.c}
          stroke="#111"
          strokeWidth={5}
        />
      ))}
      {/* caja de pizza */}
      <g transform="translate(760 1250) rotate(-12)">
        <rect x={-70} y={-14} width={140} height={28} fill="#E8B26A" stroke="#111" strokeWidth={5} />
        <rect x={-70} y={-30} width={140} height={16} fill="#D99A4E" stroke="#111" strokeWidth={5} />
      </g>
      {/* calcetin */}
      <path d="M 360 1240 L 380 1290 L 420 1290 L 420 1275 L 395 1272 L 385 1238 Z" fill="#fff" stroke="#111" strokeWidth={4} />
      {/* libros */}
      <rect x={60} y={1215} width={90} height={24} fill="#8338EC" stroke="#111" strokeWidth={4} transform="rotate(8 105 1227)" />
      <rect x={970} y={1240} width={80} height={22} fill="#FB5607" stroke="#111" strokeWidth={4} transform="rotate(-14 1010 1250)" />
    </g>
  );
};

export const SceneMom: React.FC<{t: number}> = ({t}) => {
  const zas = 11.2;
  const clean = t >= zas;
  const messK = 1 - ramp(t, zas, zas + 0.25);
  const heroPose = poseSeq(t, [
    [7.6, POSES.idle],
    [9.2, {...POSES.oath, head: 6}],
    [zas, POSES.scared],
    [12.0, POSES.cheer],
  ]);
  const momPose = poseSeq(t, [
    [7.6, POSES.hips],
    [zas, POSES.scared],
  ]);
  const camS = 1 + 0.12 * easeInOut(ramp(t, 9.2, 9.6)) - 0.12 * easeOut(ramp(t, zas, zas + 0.3));
  const camOx = t < zas ? 330 : 540;
  const sh = sumShake(t, [[zas, 0.45, 35]]);
  const hop = t > 12.0 ? -Math.abs(Math.sin((t - 12) * 9)) * 50 : 0;
  return (
    <AbsoluteFill>
      <Cam s={camS} ox={camOx} oy={1000} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          <rect width={W} height={GROUND} fill={clean ? '#FFE9C4' : '#EBC99A'} />
          {Array.from({length: 9}).map((_, i) => (
            <rect key={i} x={i * 130} y={0} width={50} height={GROUND} fill="#000" opacity={0.04} />
          ))}
          {/* ventana */}
          <g transform="translate(110 760)">
            <rect width={300} height={260} rx={10} fill="#8FD8FF" stroke="#111" strokeWidth={8} />
            <line x1={150} y1={0} x2={150} y2={260} stroke="#111" strokeWidth={7} />
            <line x1={0} y1={130} x2={300} y2={130} stroke="#111" strokeWidth={7} />
          </g>
          {/* poster */}
          <g transform={`translate(560 960) rotate(${clean ? 0 : 14}) scale(0.8)`}>
            <rect x={-90} y={-110} width={180} height={220} fill="#FF3B5C" stroke="#111" strokeWidth={7} />
            <circle r={45} fill="#FFE24A" stroke="#111" strokeWidth={5} />
          </g>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill={clean ? '#D9A06A' : '#B9814F'} />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {clean &&
            [200, 520, 860].map((x, i) => (
              <path key={i} d={`M ${x} ${GROUND + 60} l 60 -40 l 18 0 l -60 40 Z`} fill="#fff" opacity={0.6} />
            ))}
          <Mess k={messK} />
          <Shadow x={330} />
          <Shadow x={790} />
          <Stickman
            x={330} y={GROUND + hop} scale={1.45} color={HERO} pose={heroPose}
            eyes={t < 9.2 ? 'normal' : t < zas ? 'side' : t < 12 ? 'wide' : 'happy'}
            mouth={t < zas ? 'smile' : t < 12 ? 'o' : 'grin'} look={t < 9.2 ? 1 : -1}
            sweat={t > 10.0 && t < zas} blink={blinkAt(t, 0.4)}
          />
          <Stickman
            x={790} y={GROUND} scale={1.5} color="#9B5DE5" pose={momPose} flip
            eyes={t < zas ? 'angry' : 'wide'} mouth={t < zas ? 'frown' : 'open'} look={1}
          />
        </World>
      </Cam>
      <Bubble t={t} at={7.8} until={9.1} text="¿HAS ORDENADO TU CUARTO?" x={740} y={720} w={560} />
      <Bubble t={t} at={9.2} until={11.1} text="¡SÍ, YA LO HE ORDENADO!" x={360} y={720} w={560} />
      <BigText t={t} at={zas} until={12.15} text="¡ZAS!" y={380} size={280} />
      <BigText t={t} at={12.2} text="¡IMPECABLE!" y={380} size={150} color="#6EF0FF" wiggle />
      <Sparkles t={t} at={zas} cx={540} cy={1200} n={30} spread={700} />
      <Sparkles t={t} at={zas + 0.4} cx={300} cy={900} n={18} spread={400} color="#6EF0FF" />
      <Flash t={t} at={zas} dur={0.3} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 3: el amigo y volar ----------------
export const SceneFly: React.FC<{t: number}> = ({t}) => {
  const lift = 15.9;
  const up = easeOut(ramp(t, lift, 17.3)) * 560 + (t > lift ? Math.sin((t - lift) * 5) * 12 : 0);
  const heroPose = poseSeq(t, [
    [13.2, POSES.idle],
    [14.7, {...POSES.cheer, head: -6}],
    [lift, POSES.fly],
  ]);
  const friendPose = poseSeq(t, [
    [13.2, POSES.hips],
    [15.1, POSES.laugh],
    [lift + 0.2, POSES.scared],
  ]);
  const laughBob = t > 15.1 && t < lift + 0.2 ? Math.abs(Math.sin(t * 16)) * 12 : 0;
  const camY = up * 0.55;
  return (
    <AbsoluteFill>
      <World>
        <defs>
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5BC0FF" />
            <stop offset="1" stopColor="#CDEFFF" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky3)" />
        <g transform={`translate(0 ${camY * 0.3})`}>
          <circle cx={900} cy={330} r={90} fill="#FFE24A" stroke="#111" strokeWidth={7} />
          <Cloud x={((t - 13) * 40) % 1300 - 100} y={420} />
          <Cloud x={((t - 13) * 25 + 600) % 1300 - 100} y={620} s={0.8} />
        </g>
      </World>
      <Cam y={camY}>
        <World>
          {/* arboles */}
          {[90, 1000].map((x, i) => (
            <g key={i}>
              <rect x={x - 18} y={GROUND - 220} width={36} height={220} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
              <circle cx={x} cy={GROUND - 270} r={110} fill="#3FB950" stroke="#111" strokeWidth={7} />
            </g>
          ))}
          <rect x={0} y={GROUND} width={W} height={H} fill="#5BD15B" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          <Shadow x={330} w={120 * (1 - up / 900)} o={0.25 * (1 - up / 800)} />
          <Shadow x={770} />
          <Stickman
            x={330} y={GROUND - up} scale={1.45} color={HERO} pose={heroPose}
            eyes={t < lift ? 'normal' : t < 16.6 ? 'wide' : 'happy'}
            mouth={t < 14.7 ? 'smile' : t < lift ? 'grin' : t < 16.6 ? 'o' : 'grin'} look={1} blink={blinkAt(t, 1.1)}
          />
          <Stickman
            x={770} y={GROUND - laughBob} scale={1.45} color="#2EC4B6" pose={friendPose} flip
            eyes={t < 15.1 ? 'normal' : t < lift + 0.2 ? 'happy' : 'wide'}
            mouth={t < 15.1 ? 'smile' : t < lift + 0.2 ? 'grin' : 'open'} look={1}
            sweat={t > lift + 0.5}
          />
        </World>
      </Cam>
      {t > lift && <SpeedLines t={t} vertical opacity={0.5} />}
      <Bubble t={t} at={13.4} until={14.6} text="¿Y TÚ QUÉ SABES HACER?" x={740} y={760} w={540} />
      <Bubble t={t} at={14.7} until={15.85} text="¡SÉ VOLAR!" x={330} y={760} w={380} size={66} />
      <Bubble t={t} at={15.1} until={15.85} text="¡JA, JA! ¡MENTIRA!" x={780} y={600} w={420} size={50} />
      <BigText t={t} at={16.4} text="¡Y VOLÉ DE VERDAD!" y={300} size={112} />
      <Dust t={t} at={lift} x={330} y={GROUND + camY} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 4: millonario ----------------
export const SceneMoney: React.FC<{t: number}> = ({t}) => {
  const rain = 20.1;
  const heroPose = poseSeq(t, [
    [17.6, POSES.land],
    [17.85, POSES.idle],
    [18.4, POSES.point],
    [rain, POSES.cheer],
  ]);
  const jump = t > rain ? -Math.abs(Math.sin((t - rain) * 7)) * 90 : 0;
  const land = 17.6;
  const fall = t < land + 0.25 ? -500 * Math.pow(1 - ramp(t, land, land + 0.25), 2) : 0;
  const s = 1 + 0.1 * easeOut(ramp(t, 18.8, 19.0)) - 0.1 * ramp(t, 19.0, 21.6);
  return (
    <AbsoluteFill>
      <Burst t={t} c1="#FFB703" c2="#FFCB47" speed={25} />
      <Cam s={s} oy={1000} {...(() => { const k = sumShake(t, [[land + 0.25, 0.35, 30], [18.8, 0.3, 20]]); return {x: k.x, y: k.y}; })()}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#C77D00" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {/* monton de monedas */}
          {t > rain + 0.5 &&
            Array.from({length: 14}).map((_, i) => (
              <ellipse key={i} cx={120 + i * 64} cy={GROUND - 8 - (i % 3) * 12} rx={34} ry={12} fill="#FFD23F" stroke="#111" strokeWidth={4} opacity={ramp(t, rain + 0.5 + i * 0.05, rain + 0.7 + i * 0.05)} />
            ))}
          <Shadow x={540} w={130 + jump * 0.4} />
          <Stickman
            x={540} y={GROUND + jump + fall} scale={1.6} color={HERO} pose={heroPose}
            eyes={t < rain ? 'normal' : 'happy'} mouth={t < rain ? 'smile' : 'grin'} blink={blinkAt(t, 2)}
          />
          {/* gafas de sol de millonario */}
          {t > 18.8 && (
            <g transform={`translate(540 ${GROUND + jump + fall - 1.6 * 308}) scale(1.6)`} opacity={pop(t, 18.8)}>
              <rect x={-30} y={-12} width={26} height={16} rx={5} fill="#111" stroke="#FFE24A" strokeWidth={2.5} />
              <rect x={4} y={-12} width={26} height={16} rx={5} fill="#111" stroke="#FFE24A" strokeWidth={2.5} />
              <line x1={-4} y1={-6} x2={4} y2={-6} stroke="#FFE24A" strokeWidth={3} />
              <line x1={-22} y1={-8} x2={-14} y2={-8} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
            </g>
          )}
          {/* lluvia de billetes */}
          {t > rain &&
            Array.from({length: 46}).map((_, i) => {
              const sp = 500 + rnd(i) * 500;
              const y = -200 + ((t - rain) * sp + rnd(i + 7) * 300) - (i % 4) * 260;
              const x = rnd(i + 2) * W + Math.sin(t * 3 + i) * 40;
              if (y < -150 || y > H) return null;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(t * 4 + i) * 40 + i * 30}) scale(${0.8 + rnd(i + 3) * 0.6})`}>
                  <rect x={-55} y={-28} width={110} height={56} rx={6} fill="#3DDC84" stroke="#111" strokeWidth={5} />
                  <circle r={16} fill="#2BB36A" stroke="#111" strokeWidth={3} />
                  <text x={0} y={9} textAnchor="middle" fontFamily={FONT} fontSize={26} fill="#fff">$</text>
                </g>
              );
            })}
        </World>
      </Cam>
      <Bubble t={t} at={18.1} until={19.9} text="¡SOY MILLONARIO!" x={540} y={700} w={520} size={64} />
      <BigText t={t} at={18.8} until={20.05} text="$1.000.000" y={340} size={170} color="#3DDC84" />
      <BigText t={t} at={20.6} text="¡LLUEVE DINERO!" y={340} size={135} color="#fff" wiggle />
      <Sparkles t={t} at={18.8} cx={540} cy={340} n={20} spread={520} />
      <Flash t={t} at={rain} dur={0.2} color="#FFE24A" max={0.7} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 5: enfado ----------------
export const SceneAngry: React.FC<{t: number}> = ({t}) => {
  const anger = ramp(t, 22.4, 23.6);
  const shout = 23.9;
  const heroPose = poseSeq(t, [
    [21.7, {...POSES.idle, armL: [-60, 100], armR: [60, -100]}],
    [22.4, POSES.fists],
    [shout, POSES.shout],
  ]);
  const tremble = anger > 0 ? Math.sin(t * 70) * 5 * anger : 0;
  const sh = sumShake(t, [[shout, 1.4, 18], [24.8, 0.6, 50]]);
  const s = 1 + 0.25 * easeInOut(ramp(t, 22.4, 25.2));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(#3B1E54, ${anger > 0.5 ? '#7A1030' : '#241238'})`}} />
      <Cam s={s} oy={850} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          {/* tele con GAME OVER */}
          <g transform="translate(60 820)">
            <rect width={360} height={250} rx={18} fill="#222" stroke="#111" strokeWidth={8} />
            <rect x={20} y={20} width={320} height={210} rx={8} fill={Math.floor(t * 4) % 2 ? '#1a0010' : '#300018'} />
            <text x={180} y={115} textAnchor="middle" fontFamily={FONT} fontSize={64} fill="#FF3B5C">GAME</text>
            <text x={180} y={185} textAnchor="middle" fontFamily={FONT} fontSize={64} fill="#FF3B5C">OVER</text>
            <rect x={150} y={250} width={60} height={50} fill="#333" stroke="#111" strokeWidth={6} />
          </g>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#2a1630" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          <Shadow x={680} />
          <Stickman
            x={680 + tremble} y={GROUND} scale={1.6} color={HERO} pose={heroPose}
            eyes={anger > 0.1 ? 'angry' : 'wide'} mouth={t > shout ? 'teeth' : anger > 0.1 ? 'frown' : 'o'}
            red={anger} look={-1}
          />
          {/* vapor */}
          {anger > 0.3 &&
            Array.from({length: 8}).map((_, i) => {
              const k = ((t * 1.4 + i / 8) % 1);
              const side = i % 2 ? 1 : -1;
              return (
                <circle key={i} cx={680 + side * (60 + k * 90)} cy={GROUND - 560 - k * 260} r={20 + k * 40} fill="#fff" opacity={(1 - k) * 0.8} stroke="#111" strokeWidth={3} />
              );
            })}
          {/* simbolo de enfado */}
          {anger > 0.5 && (
            <g transform={`translate(800 ${GROUND - 600}) scale(${1 + Math.sin(t * 20) * 0.1})`} stroke="#FF1A1A" strokeWidth={12} strokeLinecap="round" fill="none">
              <path d="M -30 -10 Q -10 -10 -10 -30" />
              <path d="M 30 -10 Q 10 -10 10 -30" />
              <path d="M -30 10 Q -10 10 -10 30" />
              <path d="M 30 10 Q 10 10 10 30" />
            </g>
          )}
        </World>
      </Cam>
      {t > shout && <SpeedLines t={t} opacity={0.25} />}
      <BigText t={t} at={21.85} until={23.8} text="GAME OVER..." y={330} size={120} color="#FF3B5C" />
      <Bubble t={t} at={shout} text="¡ESTO ES EL FIN DEL MUNDO!" x={540} y={720} w={900} size={78} shout color="#FFE24A" />
      <Flash t={t} at={24.8} dur={0.3} color="#FF1A1A" max={0.6} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENAS 6 y 7: el cielo se parte y el meteorito ----------------
const crackPts = [
  [-40, 520], [150, 470], [240, 560], [380, 440], [500, 530], [620, 420], [760, 520], [880, 450], [1000, 540], [1120, 480],
];

export const SceneMeteor: React.FC<{t: number; noText?: boolean}> = ({t, noText}) => {
  const crackT = 26.5;
  const poofT = 35.9;
  const close = t >= 32.1; // segunda parte (primer plano)
  const red = ramp(t, 25.9, 27.0) * (1 - ramp(t, poofT, poofT + 0.4));
  const crackK = easeOut(ramp(t, crackT, crackT + 0.35));
  const crackW = 8 + 50 * ramp(t, crackT + 0.3, 27.5);
  const mK = ramp(t, 27.8, poofT);
  const gone = t >= poofT;
  const mx = 700 - 160 * mK;
  const my = 470 + (close ? -40 : 80 * mK);
  const mr = close ? 330 + 200 * ramp(t, 32.1, poofT) : 50 + 230 * Math.pow(ramp(t, 27.8, 32.1), 1.3);
  const burst = pop(t, poofT, 6, 200);
  const heroPose = poseSeq(t, [
    [25.6, POSES.idle],
    [26.5, POSES.scared],
    [32.2, {...POSES.idle, armL: [-30, 30], armR: [30, -30]}],
    [33.7, POSES.point],
    [poofT, POSES.cheer],
  ]);
  const heroEyes = t < 26.5 ? 'normal' : t < 32.2 ? 'scared' : t < 33.6 ? 'closed' : t < poofT ? 'angry' : 'happy';
  const breathe = t > 32.2 && t < 33.6 ? 1 + Math.sin((t - 32.2) * 4.5) * 0.03 : 1;
  const tremble = t > 26.5 && t < 32.2 ? Math.sin(t * 60) * 4 : 0;
  const sh = sumShake(t, [[crackT, 0.8, 35], [poofT, 0.5, 30], [28, 4, 6 * (1 - (close ? 1 : 0))]]);
  const heroScale = close ? 1.9 : 1.5;
  const heroY = close ? 1520 : GROUND;
  const s = close ? 1 + 0.06 * ramp(t, 32.1, poofT) : 1 + 0.05 * ramp(t, 25.6, 32.1);
  return (
    <AbsoluteFill>
      <World>
        <defs>
          <linearGradient id="skyM" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={red > 0.5 ? '#3B0A1E' : '#5BC0FF'} />
            <stop offset="1" stopColor={red > 0.5 ? '#FF5A1F' : '#CDEFFF'} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#skyM)" />
        {red > 0 && red < 1 && <rect width={W} height={H} fill="#FF3B1F" opacity={0.3 * Math.sin(red * Math.PI)} />}
      </World>
      <Cam s={s} oy={600} x={sh.x} y={sh.y} r={sh.r}>
        <World>
          {/* grieta en el cielo */}
          {t >= crackT && !gone && (
            <g>
              <polyline
                points={crackPts.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none" stroke="#111" strokeWidth={crackW + 14} strokeLinejoin="miter"
                strokeDasharray={3000} strokeDashoffset={3000 * (1 - crackK)}
              />
              <polyline
                points={crackPts.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none" stroke="#FFE7A0" strokeWidth={crackW} strokeLinejoin="miter"
                strokeDasharray={3000} strokeDashoffset={3000 * (1 - crackK)}
              />
              <polyline points={crackPts.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="#FFB31A" strokeWidth={crackW * 2.2} opacity={0.4 * crackK} filter="url(#blurGlow)" />
            </g>
          )}
          {/* piedras cayendo */}
          {t > 27 && !gone &&
            Array.from({length: 12}).map((_, i) => {
              const k = ((t - 27) * (0.5 + rnd(i) * 0.5) + rnd(i + 3)) % 1;
              return <circle key={i} cx={rnd(i + 11) * W} cy={480 + k * 900} r={8 + rnd(i) * 14} fill="#6B4129" stroke="#111" strokeWidth={3} />;
            })}
          {t >= 27.8 && !gone && <Meteor x={mx} y={my} r={mr} t={t} />}
          {gone && t < poofT + 0.5 && <circle cx={mx} cy={my} r={mr * (1 + burst * 0.8)} fill="#fff" opacity={1 - ramp(t, poofT, poofT + 0.5)} />}
          {!close && <City dark={red} />}
          {!close && <rect x={0} y={GROUND} width={W} height={H - GROUND} fill={red > 0.5 ? '#2a2438' : '#6d7a8c'} />}
          {!close && <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />}
          {!close && <Shadow x={540} />}
          <g transform={`translate(540 ${heroY}) scale(1 ${breathe}) translate(-540 ${-heroY})`}>
            <Stickman
              x={540 + tremble} y={heroY} scale={heroScale} color={HERO} pose={heroPose}
              eyes={heroEyes} mouth={t < 26.5 ? 'smile' : t < 32.2 ? 'o' : t < poofT ? 'frown' : 'grin'}
              look={t > 26.5 && t < 32.2 ? 0.6 : 0} sweat={t > 27 && t < poofT}
            />
          </g>
        </World>
      </Cam>
      {/* alarma roja */}
      {t > 28 && !gone && (
        <AbsoluteFill style={{boxShadow: `inset 0 0 ${180 + Math.sin(t * 10) * 60}px rgba(255,20,20,0.75)`}} />
      )}
      {!noText && (
        <>
      <BigText t={t} at={crackT} until={27.7} text={'¡EL CIELO\nSE PARTIÓ!'} y={260} size={110} color="#fff" />
      <BigText t={t} at={27.9} until={30.4} text={'METEORITO\nGIGANTE'} y={260} size={120} color="#FF7A1A" />
      <BigText t={t} at={30.5} until={32.1} text="3 SEGUNDOS" y={240} size={120} color="#FF3B5C" />
      <Bubble t={t} at={33.7} until={35.85} text="NO EXISTE NINGÚN METEORITO" x={540} y={860} w={700} size={62} />
      {/* cuenta atras */}
      {[['3', 31.2], ['2', 32.7], ['1', 34.2]].map(([n, at]) => (
        <BigText key={n as string} t={t} at={at as number} until={(at as number) + 1.45} text={n as string} x={900} y={ close ? 270 : 420} size={220} color="#fff" rotate={8} maxWidth={300} />
      ))}
        </>
      )}
      {gone && <Sparkles t={t} at={poofT} cx={mx} cy={my} n={50} spread={900} />}
      {gone && <Sparkles t={t} at={poofT + 0.15} cx={mx} cy={my} n={30} spread={700} color="#FF7A1A" />}
      <BigText t={t} at={poofT} text={'¡PUF!\nDESAPARECIÓ'} y={300} size={150} wiggle />
      <Flash t={t} at={crackT} dur={0.25} color="#FFE7A0" />
      <Flash t={t} at={poofT} dur={0.4} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 8: todos me miraban ----------------
const CROWD = [
  {x: 110, c: '#E63946'},
  {x: 290, c: '#4361EE'},
  {x: 790, c: '#F72585'},
  {x: 970, c: '#06D6A0'},
];

export const SceneCrowd: React.FC<{t: number}> = ({t}) => {
  const oath = 38.6;
  const heroPose = poseSeq(t, [
    [37.0, POSES.idle],
    [oath, POSES.oath],
  ]);
  const halo = pop(t, 39.7);
  const s = 1.05 - 0.05 * ramp(t, 37, 37.5) + 0.12 * easeInOut(ramp(t, oath, 41.4));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#5BC0FF, #CDEFFF)'}} />
      <Cam s={s} oy={900}>
        <World>
          <City />
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#6d7a8c" />
          <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
          {CROWD.map((p, i) => (
            <g key={i}>
              <Shadow x={p.x} y={GROUND - 36} w={80} />
              <Stickman
                x={p.x} y={GROUND - 40} scale={1.05} color={p.c} flip={p.x > 540}
                pose={t > 37.4 + i * 0.1 ? POSES.scared : POSES.idle}
                eyes={t > 37.2 ? 'wide' : 'normal'} mouth={t > 37.4 + i * 0.1 ? 'o' : 'none'}
                look={p.x < 540 ? 1 : -1} blink={blinkAt(t, i)}
              />
              {t > 37.6 + i * 0.12 && (
                <g transform={`translate(${p.x} ${GROUND - 470}) scale(${pop(t, 37.6 + i * 0.12)})`}>
                  <text textAnchor="middle" fontFamily={FONT} fontSize={110} fill="#FFE24A" stroke="#111" strokeWidth={10} paintOrder="stroke">!</text>
                </g>
              )}
            </g>
          ))}
          <Shadow x={540} />
          <Stickman
            x={540} y={GROUND + 30} scale={1.5} color={HERO} pose={heroPose}
            eyes={t < oath ? 'side' : 'closed'} mouth={t < oath ? 'o' : 'smile'} look={-1}
          />
          {t > 39.7 && (
            <g transform={`translate(540 ${GROUND + 30 - 1.5 * 375}) scale(${halo})`}>
              <ellipse rx={62} ry={16} fill="none" stroke="#111" strokeWidth={20} />
              <ellipse rx={62} ry={16} fill="none" stroke="#FFE24A" strokeWidth={11} />
            </g>
          )}
        </World>
      </Cam>
      <BigText t={t} at={37.2} until={39.6} text={'TODOS ME\nMIRABAN...'} y={300} size={120} color="#fff" />
      <Bubble t={t} at={39.7} text="¡NUNCA VOLVERÉ A MENTIR!" x={540} y={680} w={720} size={64} />
      <Sparkles t={t} at={39.7} cx={540} cy={720} n={16} spread={300} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 9: la paradoja y todo se congela ----------------
export const SceneTwist: React.FC<{t: number}> = ({t: realT}) => {
  const freezeT = 45.9;
  const t = Math.min(realT, freezeT);
  const frozen = realT >= freezeT;
  const glitchOn = t > 43.1 && !frozen;
  const g = (i: number) => (glitchOn && rnd(Math.floor(realT * 30) + i) > 0.6 ? (rnd(Math.floor(realT * 30) * 3 + i) - 0.5) * 80 : 0);
  const spin = ramp(t, 44.2, freezeT) * 18;
  const heroPose = poseSeq(t, [
    [41.5, POSES.oath],
    [41.8, POSES.scared],
    [44.2, {...POSES.scared, head: 12}],
  ]);
  const haloBreak = ramp(t, 43.1, 43.6);
  const content = (
    <AbsoluteFill style={{filter: glitchOn ? `hue-rotate(${g(1) * 3}deg) saturate(1.6)` : undefined, transform: `translateX(${g(2)}px) skewX(${g(3) / 8}deg)`}}>
      <Burst t={t} c1="#14061F" c2="#2A0F45" speed={-40 - spin * 6} />
      <Cam s={1.05 + 0.15 * ramp(t, 41.6, freezeT)} r={spin} oy={900} x={sumShake(t, [[41.6, 0.6, 40]]).x}>
        <World>
          <g transform={`translate(540 760) rotate(${t * 90})`} opacity={0.5}>
            {Array.from({length: 6}).map((_, i) => (
              <circle key={i} r={140 + i * 110} fill="none" stroke={i % 2 ? '#6EF0FF' : '#FF3B5C'} strokeWidth={6} strokeDasharray="40 50" />
            ))}
          </g>
          <Stickman
            x={540} y={GROUND + 30} scale={1.55} color={HERO} pose={heroPose}
            eyes={t < 41.8 ? 'closed' : 'wide'} mouth={t < 41.8 ? 'smile' : t < 44.2 ? 'o' : 'open'}
            sweat={t > 42.5} look={0}
          />
          {/* aureola que se rompe */}
          <g transform={`translate(540 ${GROUND + 30 - 1.55 * 375})`} opacity={1 - ramp(t, 43.6, 44.4)}>
            <g transform={`translate(${-haloBreak * 60} ${haloBreak * 90}) rotate(${-haloBreak * 30})`}>
              <path d="M -62 0 A 62 16 0 0 1 0 -16" fill="none" stroke="#FFE24A" strokeWidth={11} />
            </g>
            <g transform={`translate(${haloBreak * 60} ${haloBreak * 110}) rotate(${haloBreak * 40})`}>
              <path d="M 0 -16 A 62 16 0 1 1 -62 0" fill="none" stroke="#FFE24A" strokeWidth={11} />
            </g>
          </g>
        </World>
      </Cam>
      {glitchOn &&
        Array.from({length: 7}).map((_, i) => {
          const f = Math.floor(realT * 30);
          if (rnd(f + i * 13) < 0.5) return null;
          return (
            <div key={i} style={{position: 'absolute', left: 0, width: W, top: rnd(f + i) * H, height: 10 + rnd(f * 2 + i) * 60, background: i % 2 ? 'rgba(110,240,255,0.55)' : 'rgba(255,59,92,0.55)', transform: `translateX(${(rnd(f + i * 7) - 0.5) * 300}px)`}} />
          );
        })}
      <BigText t={t} at={41.8} until={42.45} text="PERO ESO..." y={320} size={130} color="#fff" />
      <BigText t={t} at={42.5} until={44.15} text={'¡TAMBIÉN ERA\nMENTIRA!'} y={320} size={125} color="#FF3B5C" wiggle />
      <BigText t={t} at={44.2} text="¡PARADOJA!" y={320} size={165} color="#6EF0FF" wiggle />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: frozen ? 'grayscale(0.7) brightness(1.15) sepia(0.2) hue-rotate(170deg) saturate(2.2)' : undefined}}>{content}</AbsoluteFill>
      {frozen && (
        <AbsoluteFill>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(255,255,255,0) 45%, rgba(220,245,255,0.95) 100%)', opacity: ramp(realT, freezeT, freezeT + 0.3)}} />
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            {[[0, 0], [W, 0], [0, H], [W, H]].map(([cx, cy], i) => {
              const k = easeOut(ramp(realT, freezeT, freezeT + 0.4));
              return (
                <g key={i} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.9}>
                  {Array.from({length: 4}).map((__, j) => {
                    const ang = ((j + 1) / 5) * (Math.PI / 2);
                    const len = (300 + rnd(i * 4 + j) * 300) * k;
                    const sx = cx === 0 ? 1 : -1, sy = cy === 0 ? 1 : -1;
                    const ex = cx + sx * Math.cos(ang) * len, ey = cy + sy * Math.sin(ang) * len;
                    const mxp = cx + sx * Math.cos(ang + 0.15) * len * 0.5, myp = cy + sy * Math.sin(ang + 0.15) * len * 0.5;
                    return <polyline key={j} points={`${cx},${cy} ${mxp},${myp} ${ex},${ey}`} />;
                  })}
                </g>
              );
            })}
          </svg>
          <BigText t={realT} at={freezeT + 0.05} text="CONGELADO" y={620} size={150} color="#BDF2FF" rotate={0} />
          <Flash t={realT} at={freezeT} dur={0.35} />
        </AbsoluteFill>
      )}
      <Flash t={realT} at={41.6} dur={0.25} color="#FF3B5C" max={0.7} />
    </AbsoluteFill>
  );
};

// ---------------- ESCENA 10: final con pregunta ----------------
export const SceneEnd: React.FC<{t: number}> = ({t}) => {
  const start = 46.9;
  const heroPose = poseSeq(t, [
    [start, {...POSES.scared}],
    [47.6, POSES.shrug],
    [49.2, {...POSES.point, armR: [60, -10]}],
  ]);
  const pulse = 1 + Math.sin(t * 8) * 0.06;
  const arrowK = pop(t, 49.2);
  return (
    <AbsoluteFill>
      <Burst t={t} c1="#2B1B5A" c2="#3B2A85" speed={20} />
      <Cam s={1.1 - 0.1 * easeOut(ramp(t, start, start + 0.5))} oy={1000}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#1a1238" />
          {/* trocitos de hielo cayendo */}
          {t < 48 &&
            Array.from({length: 14}).map((_, i) => {
              const k = ramp(t, start + rnd(i) * 0.3, start + 0.9 + rnd(i) * 0.3);
              return <rect key={i} x={380 + rnd(i + 2) * 320} y={700 + k * 600} width={22} height={22} fill="#BDF2FF" stroke="#111" strokeWidth={3} opacity={1 - k} transform={`rotate(${k * 200 + i * 20} ${390 + rnd(i + 2) * 320} ${710 + k * 600})`} />;
            })}
          <Shadow x={480} />
          <Stickman
            x={480} y={GROUND} scale={1.5} color={HERO} pose={heroPose}
            eyes={t < 47.6 ? 'wide' : 'normal'} mouth={t < 47.6 ? 'o' : 'smile'} look={0.6} blink={blinkAt(t, 0.7)}
          />
          {/* flecha hacia los comentarios */}
          {t > 49.2 && (
            <g transform={`translate(${860 + Math.sin(t * 8) * 12} ${1090 + Math.sin(t * 8) * 12}) scale(${arrowK}) rotate(-40)`}>
              <path d="M -24 -120 L 24 -120 L 24 0 L 62 0 L 0 80 L -62 0 L -24 0 Z" fill="#FFE24A" stroke="#111" strokeWidth={9} strokeLinejoin="round" />
            </g>
          )}
        </World>
      </Cam>
      <BigText t={t} at={47.0} text={'¿QUÉ MENTIRA\nHARÍAS REALIDAD TÚ?'} y={360} size={104} color="#fff" rotate={-2} />
      {t > 49.2 && (
        <div style={{position: 'absolute', left: 0, width: W, top: 610, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, 49.2) * pulse})`}}>
          <div style={{background: '#FF3B5C', border: '8px solid #111', borderRadius: 40, padding: '12px 40px', fontFamily: FONT, fontSize: 84, color: '#fff', WebkitTextStroke: '9px #111', paintOrder: 'stroke fill', boxShadow: '0 12px 0 #111'}}>
            ¡COMÉNTALO!
          </div>
        </div>
      )}
      <Sparkles t={t} at={47.0} cx={540} cy={360} n={20} spread={500} />
    </AbsoluteFill>
  );
};

export const _unused = clamp;
