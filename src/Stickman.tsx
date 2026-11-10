import React from 'react';

// Angulos en grados: 0 = hacia abajo, 90 = hacia la derecha de la pantalla, 180 = arriba.
export type Limb = [number, number]; // [angulo del tramo superior, angulo extra del tramo inferior]
export type Pose = {
  armL: Limb;
  armR: Limb;
  legL: Limb;
  legR: Limb;
  lean?: number; // inclinacion del torso
  head?: number; // inclinacion de la cabeza
};

export type Eyes = 'normal' | 'wide' | 'angry' | 'closed' | 'scared' | 'happy' | 'glow' | 'side' | 'evil' | 'psychic';
export type Mouth = 'none' | 'smile' | 'open' | 'frown' | 'o' | 'grin' | 'teeth';

export const POSES: Record<string, Pose> = {
  idle: {armL: [-12, 10], armR: [12, -10], legL: [-8, 4], legR: [8, -4]},
  hips: {armL: [-45, 110], armR: [45, -110], legL: [-12, 4], legR: [12, -4]},
  armsUp: {armL: [-150, -10], armR: [150, 10], legL: [-14, 4], legR: [14, -4]},
  cheer: {armL: [-135, -30], armR: [135, 30], legL: [-18, 10], legR: [18, -10]},
  fly: {armL: [-175, 0], armR: [170, 0], legL: [-6, 15], legR: [10, 30], lean: 0},
  scared: {armL: [-35, 120], armR: [35, -120], legL: [-22, 18], legR: [22, -18], lean: 0},
  point: {armL: [-15, 10], armR: [95, 0], legL: [-10, 4], legR: [10, -4]},
  pointDown: {armL: [-15, 10], armR: [45, -10], legL: [-10, 4], legR: [10, -4]},
  oath: {armL: [-20, 90], armR: [100, 80], legL: [-8, 4], legR: [8, -4]},
  fists: {armL: [-40, 140], armR: [40, -140], legL: [-20, 6], legR: [20, -6]},
  shout: {armL: [-60, -40], armR: [60, 40], legL: [-22, 6], legR: [22, -6], lean: 0},
  land: {armL: [-110, -20], armR: [110, 20], legL: [-35, 60], legR: [35, -60]},
  shrug: {armL: [-70, 110], armR: [70, -110], legL: [-8, 4], legR: [8, -4]},
  laugh: {armL: [-30, 130], armR: [30, -130], legL: [-10, 4], legR: [10, -4], lean: -8},
  brush: {armL: [-12, 10], armR: [30, -150], legL: [-8, 4], legR: [8, -4]},
  wave: {armL: [-12, 10], armR: [140, 20], legL: [-8, 4], legR: [8, -4]},
  headHold: {armL: [-60, 150], armR: [60, -150], legL: [-14, 6], legR: [14, -6]},
  kneel: {armL: [-60, 150], armR: [60, -150], legL: [-70, -100], legR: [30, -30], lean: 0},
  reach: {armL: [-15, 10], armR: [80, 10], legL: [-10, 4], legR: [10, -4], lean: -6},
  tug: {armL: [70, 10], armR: [80, 10], legL: [-30, 30], legR: [25, -10], lean: -28},
  bang: {armL: [-150, 40], armR: [150, -40], legL: [-10, 4], legR: [10, -4]},
  hands: {armL: [-110, 60], armR: [110, -60], legL: [-10, 4], legR: [10, -4]},
  push: {armL: [10, 0], armR: [20, 0], legL: [-80, 110], legR: [-60, 100], lean: 60},
  hang: {armL: [100, 0], armR: [95, 0], legL: [-80, 10], legR: [-95, 20], lean: 80},
  shh: {armL: [-12, 10], armR: [25, -160], legL: [-8, 4], legR: [8, -4]},
  phone: {armL: [-12, 10], armR: [40, -120], legL: [-8, 4], legR: [8, -4]},
};

export const lerpPose = (a: Pose, b: Pose, k: number): Pose => {
  const L = (x: number, y: number) => x + (y - x) * k;
  const LL = (x: Limb, y: Limb): Limb => [L(x[0], y[0]), L(x[1], y[1])];
  return {
    armL: LL(a.armL, b.armL),
    armR: LL(a.armR, b.armR),
    legL: LL(a.legL, b.legL),
    legR: LL(a.legR, b.legR),
    lean: L(a.lean ?? 0, b.lean ?? 0),
    head: L(a.head ?? 0, b.head ?? 0),
  };
};

// ciclo de correr
export const runPose = (t: number, speed = 1): Pose => {
  const s = Math.sin(t * Math.PI * 2 * 2.2 * speed);
  return {
    armL: [-50 * s, 70],
    armR: [50 * s, -70],
    legL: [40 * s, -45 + Math.min(0, 40 * s)],
    legR: [-40 * s, -45 + Math.min(0, -40 * s)],
    lean: 10,
  };
};

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (x: number, y: number, a: number, l: number) => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];

const INK = '#111';

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
  return `rgb(${r},${g},${b})`;
};

const EyesG: React.FC<{type: Eyes; look: number; blink: boolean}> = ({type, look, blink}) => {
  const px = look * 4;
  if (type === 'closed' || blink) {
    return (
      <g stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M -21 -2 Q -13 4 -5 -2" />
        <path d="M 5 -2 Q 13 4 21 -2" />
      </g>
    );
  }
  if (type === 'happy') {
    return (
      <g stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M -21 0 Q -13 -10 -5 0" />
        <path d="M 5 0 Q 13 -10 21 0" />
      </g>
    );
  }
  if (type === 'evil') {
    return (
      <g>
        <ellipse cx={-13} cy={-4} rx={10} ry={12} fill="#fff" />
        <ellipse cx={13} cy={-4} rx={10} ry={12} fill="#fff" />
        <circle cx={-13 + px} cy={-1} r={4} fill="#E0002A" />
        <circle cx={13 + px} cy={-1} r={4} fill="#E0002A" />
        <g fill={INK}>
          <polygon points="-27,-22 -1,-4 -1,-24" />
          <polygon points="27,-22 1,-4 1,-24" />
        </g>
      </g>
    );
  }
  if (type === 'psychic') {
    return (
      <g>
        <ellipse cx={-13} cy={-4} rx={20} ry={22} fill="#C77DFF" opacity={0.6} filter="url(#blurGlow)" />
        <ellipse cx={13} cy={-4} rx={20} ry={22} fill="#C77DFF" opacity={0.6} filter="url(#blurGlow)" />
        <ellipse cx={-13} cy={-4} rx={10} ry={13} fill="#E9C8FF" />
        <ellipse cx={13} cy={-4} rx={10} ry={13} fill="#E9C8FF" />
      </g>
    );
  }
  const big = type === 'wide' || type === 'scared';
  const rx = big ? 11 : 9, ry = big ? 14 : 12;
  const pr = type === 'scared' ? 2.5 : type === 'glow' ? 0 : 4.2;
  const fill = type === 'glow' ? '#FFE24A' : '#fff';
  return (
    <g>
      {type === 'glow' && (
        <g opacity={0.6}>
          <ellipse cx={-13} cy={-4} rx={20} ry={22} fill="#FFE24A" filter="url(#blurGlow)" />
          <ellipse cx={13} cy={-4} rx={20} ry={22} fill="#FFE24A" filter="url(#blurGlow)" />
        </g>
      )}
      <ellipse cx={-13} cy={-4} rx={rx} ry={ry} fill={fill} />
      <ellipse cx={13} cy={-4} rx={rx} ry={ry} fill={fill} />
      {pr > 0 && (
        <>
          <circle cx={-13 + px + (type === 'side' ? 4 : 0)} cy={-2} r={pr} fill={INK} />
          <circle cx={13 + px + (type === 'side' ? 4 : 0)} cy={-2} r={pr} fill={INK} />
        </>
      )}
      {type === 'angry' && (
        <g fill={INK}>
          <polygon points="-26,-20 -2,-6 -2,-22" />
          <polygon points="26,-20 2,-6 2,-22" />
        </g>
      )}
    </g>
  );
};

const MouthG: React.FC<{type: Mouth}> = ({type}) => {
  const s = {stroke: '#fff', strokeWidth: 4.5, fill: 'none', strokeLinecap: 'round' as const};
  switch (type) {
    case 'smile':
      return <path d="M -10 16 Q 0 24 10 16" {...s} />;
    case 'grin':
      return <path d="M -14 14 Q 0 30 14 14 Z" fill="#fff" />;
    case 'open':
      return <ellipse cx={0} cy={20} rx={9} ry={8} fill="#fff" />;
    case 'o':
      return <ellipse cx={0} cy={21} rx={5} ry={6} fill="#fff" />;
    case 'frown':
      return <path d="M -10 22 Q 0 14 10 22" {...s} />;
    case 'teeth':
      return (
        <g>
          <rect x={-14} y={13} width={28} height={12} rx={4} fill="#fff" />
          <line x1={-14} y1={19} x2={14} y2={19} stroke={INK} strokeWidth={2} />
        </g>
      );
    default:
      return null;
  }
};

export type StickProps = {
  x: number;
  y: number; // posicion de los pies (suelo)
  scale?: number;
  color: string;
  pose: Pose;
  eyes?: Eyes;
  mouth?: Mouth;
  look?: number; // -1..1
  flip?: boolean;
  blink?: boolean;
  rotate?: number;
  sweat?: boolean;
  red?: number; // 0..1 cara roja de enfado (tinte en la sudadera)
  opacity?: number;
  mustache?: boolean;
  glasses?: boolean;
  item?: 'toothbrush' | 'phone' | null;
  foam?: boolean;
  hood?: boolean; // capucha puesta (true) o bajada
};

export const Stickman: React.FC<StickProps> = ({
  x, y, scale = 1, color, pose, eyes = 'normal', mouth = 'none', look = 0, flip = false, blink = false,
  rotate = 0, sweat = false, red = 0, opacity = 1, mustache = false, glasses = false, item = null, foam = false, hood = true,
}) => {
  const lean = pose.lean ?? 0;
  const hip: [number, number] = [0, -150];
  const thigh = 72, shin = 72, upper = 58, fore = 56;

  const leg = (l: Limb) => {
    const k = pt(hip[0], hip[1], l[0], thigh);
    const f = pt(k[0], k[1], l[0] + l[1], shin);
    return {k, f};
  };
  const lL = leg(pose.legL), lR = leg(pose.legR);

  // los brazos se calculan en el marco del torso (que rota con lean)
  const sh = (side: -1 | 1): [number, number] => [side * 30, -112];
  const arm = (l: Limb, side: -1 | 1) => {
    const s = sh(side);
    const e = pt(s[0], s[1], l[0], upper);
    const h = pt(e[0], e[1], l[0] + l[1], fore);
    return {s, e, h};
  };
  const aL = arm(pose.armL, -1), aR = arm(pose.armR, 1);
  const hoodie = color;
  const dark = shade(color, 0.72);

  const Sleeve: React.FC<{a: ReturnType<typeof arm>}> = ({a}) => (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={a.e[0]} y1={a.e[1]} x2={a.h[0]} y2={a.h[1]} stroke={INK} strokeWidth={9} />
      <circle cx={a.h[0]} cy={a.h[1]} r={9} fill={INK} />
      <line x1={a.s[0]} y1={a.s[1]} x2={a.e[0]} y2={a.e[1]} stroke={INK} strokeWidth={30} />
      <line x1={a.s[0]} y1={a.s[1]} x2={a.e[0]} y2={a.e[1]} stroke={hoodie} strokeWidth={19} />
      <circle cx={a.e[0]} cy={a.e[1]} r={10} fill={dark} stroke={INK} strokeWidth={4} />
    </g>
  );

  const Item: React.FC<{a: ReturnType<typeof arm>}> = ({a}) => {
    if (!item) return null;
    const ang = (Math.atan2(a.h[1] - a.e[1], a.h[0] - a.e[0]) * 180) / Math.PI;
    if (item === 'toothbrush')
      return (
        <g transform={`translate(${a.h[0]} ${a.h[1]}) rotate(${ang - 90})`}>
          <rect x={-5} y={-4} width={10} height={58} rx={4} fill="#4CC9F0" stroke={INK} strokeWidth={3} />
          <rect x={-8} y={46} width={16} height={14} rx={3} fill="#fff" stroke={INK} strokeWidth={3} />
        </g>
      );
    return (
      <g transform={`translate(${a.h[0]} ${a.h[1]}) rotate(${ang - 90})`}>
        <rect x={-20} y={-6} width={40} height={68} rx={8} fill="#222" stroke={INK} strokeWidth={4} />
        <rect x={-15} y={1} width={30} height={52} rx={4} fill="#7BDFF2" />
      </g>
    );
  };

  const Leg: React.FC<{l: ReturnType<typeof leg>}> = ({l}) => (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points={`${hip[0]},${hip[1]} ${l.k[0]},${l.k[1]} ${l.f[0]},${l.f[1]}`} stroke={INK} strokeWidth={10} />
      <ellipse cx={l.f[0] + 8} cy={l.f[1] + 2} rx={15} ry={8} fill={INK} />
    </g>
  );

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${(flip ? -1 : 1) * scale} ${scale})`}
      opacity={opacity}
    >
      <Leg l={lL} />
      <Leg l={lR} />
      <g transform={`rotate(${-lean} ${hip[0]} ${hip[1]}) translate(0 ${hip[1]})`}>
        {/* brazo de atras */}
        <Sleeve a={aL} />
        {/* torso / sudadera */}
        <path
          d="M -34 -122 Q -42 -60 -32 4 Q 0 12 32 4 Q 42 -60 34 -122 Q 0 -132 -34 -122 Z"
          fill={hoodie}
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {red > 0 && (
          <path d="M -34 -122 Q -42 -60 -32 4 Q 0 12 32 4 Q 42 -60 34 -122 Q 0 -132 -34 -122 Z" fill="#ff1a1a" opacity={red * 0.45} />
        )}
        {/* bolsillo canguro */}
        <path d="M -20 -38 L 20 -38 L 26 -8 L -26 -8 Z" fill={dark} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {/* cordones */}
        <line x1={-8} y1={-118} x2={-10} y2={-88} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-118} x2={10} y2={-88} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        {/* brillo */}
        <path d="M -24 -110 Q -32 -80 -27 -52" stroke="#fff" strokeOpacity={0.55} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={-22} cy={-44} r={3.5} fill="#fff" opacity={0.5} />
        {/* cabeza con capucha */}
        <g transform={`translate(0 -160) rotate(${pose.head ?? 0})`}>
          {hood ? (
            <>
              <path d="M -50 22 Q -56 -44 0 -52 Q 56 -44 50 22 Q 30 44 0 44 Q -30 44 -50 22 Z" fill={dark} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
              <path d="M -38 -30 Q -20 -48 6 -46" stroke="#fff" strokeOpacity={0.45} strokeWidth={5} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <path d="M -46 40 Q -30 52 0 54 Q 30 52 46 40 L 40 30 Q 0 46 -40 30 Z" fill={dark} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          )}
          <circle cx={0} cy={2} r={36} fill={INK} />
          {red > 0 && <circle cx={0} cy={2} r={36} fill="#c00" opacity={red * 0.5} />}
          <g transform={`translate(${look * 5} 0)`}>
            <EyesG type={eyes} look={look} blink={blink} />
            <MouthG type={mouth} />
            {glasses && (
              <g fill="none" stroke="#fff" strokeWidth={3.5}>
                <circle cx={-13} cy={-4} r={14} />
                <circle cx={13} cy={-4} r={14} />
                <line x1={-1} y1={-5} x2={1} y2={-5} />
              </g>
            )}
            {mustache && <path d="M -20 14 Q -10 6 0 12 Q 10 6 20 14 Q 12 22 0 16 Q -12 22 -20 14 Z" fill="#EDEDED" stroke={INK} strokeWidth={2} />}
            {foam && (
              <g fill="#fff" stroke="#9ad" strokeWidth={1.5}>
                <circle cx={-8} cy={20} r={7} />
                <circle cx={4} cy={22} r={8} />
                <circle cx={14} cy={18} r={5} />
              </g>
            )}
          </g>
          {sweat && (
            <path d="M 40 -20 Q 50 -2 44 6 Q 36 10 34 0 Q 34 -8 40 -20 Z" fill="#6EC8FF" stroke={INK} strokeWidth={3} />
          )}
        </g>
        {/* brazo de delante */}
        <Sleeve a={aR} />
        <Item a={aR} />
      </g>
    </g>
  );
};

export const SvgDefs: React.FC = () => (
  <defs>
    <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.35" />
    </filter>
  </defs>
);
