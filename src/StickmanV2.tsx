import React from 'react';
import {Limb, Pose, Eyes, Mouth} from './Stickman';

// Personaje v2: cara mas seria, chaqueta azul ajustada al cuerpo y capucha bajada.
// (El personaje original de Stickman.tsx no se toca.)

export const BLUE = '#2D6CDF';
const INK = '#111';

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (x: number, y: number, a: number, l: number) => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

export type MouthV2 = Mouth | 'flat';

// ojos con parpado: mirada seria por defecto
const EyesV2: React.FC<{type: Eyes; look: number; blink: boolean}> = ({type, look, blink}) => {
  const px = look * 3.5;
  if (type === 'closed' || blink) {
    return (
      <g stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round">
        <line x1={-20} y1={-2} x2={-6} y2={-2} />
        <line x1={6} y1={-2} x2={20} y2={-2} />
      </g>
    );
  }
  if (type === 'happy') {
    return (
      <g stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M -20 0 Q -13 -7 -6 0" />
        <path d="M 6 0 Q 13 -7 20 0" />
      </g>
    );
  }
  const wide = type === 'wide' || type === 'scared';
  const rx = wide ? 10 : 9, ry = wide ? 12 : 9;
  const pr = type === 'scared' ? 2.2 : 3.6;
  // parpado superior: plano (serio) o inclinado hacia dentro (enfadado / malvado)
  const lid = wide ? null : type === 'angry' || type === 'evil' ? 'angry' : 'flat';
  const pupil = type === 'evil' ? '#E0002A' : INK;
  return (
    <g>
      <ellipse cx={-13} cy={-2} rx={rx} ry={ry} fill="#fff" />
      <ellipse cx={13} cy={-2} rx={rx} ry={ry} fill="#fff" />
      <circle cx={-13 + px + (type === 'side' ? 3 : 0)} cy={0} r={pr} fill={pupil} />
      <circle cx={13 + px + (type === 'side' ? 3 : 0)} cy={0} r={pr} fill={pupil} />
      {lid === 'flat' && (
        <g fill={INK}>
          <rect x={-24} y={-14} width={22} height={9} />
          <rect x={2} y={-14} width={22} height={9} />
        </g>
      )}
      {lid === 'angry' && (
        <g fill={INK}>
          <polygon points="-25,-16 -1,-4 -1,-16" />
          <polygon points="25,-16 1,-4 1,-16" />
        </g>
      )}
    </g>
  );
};

const MouthV2G: React.FC<{type: MouthV2}> = ({type}) => {
  const s = {stroke: '#fff', strokeWidth: 4, fill: 'none', strokeLinecap: 'round' as const};
  switch (type) {
    case 'none':
    case 'flat':
      return <line x1={-7} y1={18} x2={7} y2={18} {...s} />;
    case 'smile':
      return <path d="M -8 17 Q 0 21 8 17" {...s} />;
    case 'grin':
      return <path d="M -11 15 Q 0 26 11 15 Z" fill="#fff" />;
    case 'open':
      return <ellipse cx={0} cy={19} rx={7} ry={7} fill="#fff" />;
    case 'o':
      return <ellipse cx={0} cy={19} rx={4} ry={5} fill="#fff" />;
    case 'frown':
      return <path d="M -8 20 Q 0 15 8 20" {...s} />;
    case 'teeth':
      return (
        <g>
          <rect x={-12} y={13} width={24} height={10} rx={3} fill="#fff" />
          <line x1={-12} y1={18} x2={12} y2={18} stroke={INK} strokeWidth={2} />
        </g>
      );
  }
};

export type StickV2Props = {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  pose: Pose;
  eyes?: Eyes;
  mouth?: MouthV2;
  look?: number;
  flip?: boolean;
  blink?: boolean;
  rotate?: number;
  sweat?: boolean;
  opacity?: number;
};

export const StickmanV2: React.FC<StickV2Props> = ({
  x, y, scale = 1, color = BLUE, pose, eyes = 'normal', mouth = 'flat', look = 0, flip = false, blink = false, rotate = 0, sweat = false, opacity = 1,
}) => {
  const lean = pose.lean ?? 0;
  const hip: [number, number] = [0, -150];
  const thigh = 72, shin = 72, upper = 56, fore = 54;
  const dark = shade(color, 0.7);
  const light = shade(color, 1.25);

  const leg = (l: Limb) => {
    const k = pt(hip[0], hip[1], l[0], thigh);
    const f = pt(k[0], k[1], l[0] + l[1], shin);
    return {k, f};
  };
  const lL = leg(pose.legL), lR = leg(pose.legR);
  const arm = (l: Limb, side: -1 | 1) => {
    const s: [number, number] = [side * 24, -110];
    const e = pt(s[0], s[1], l[0], upper);
    const h = pt(e[0], e[1], l[0] + l[1], fore);
    return {s, e, h};
  };
  const aL = arm(pose.armL, -1), aR = arm(pose.armR, 1);

  // manga ajustada entera (brazo y antebrazo) con puño
  const Sleeve: React.FC<{a: ReturnType<typeof arm>}> = ({a}) => {
    const cuff = pt(a.e[0], a.e[1], (Math.atan2(a.h[0] - a.e[0], a.h[1] - a.e[1]) * 180) / Math.PI, fore * 0.78);
    return (
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points={`${a.s[0]},${a.s[1]} ${a.e[0]},${a.e[1]} ${cuff[0]},${cuff[1]}`} stroke={INK} strokeWidth={23} />
        <polyline points={`${a.s[0]},${a.s[1]} ${a.e[0]},${a.e[1]} ${cuff[0]},${cuff[1]}`} stroke={color} strokeWidth={14} />
        <circle cx={cuff[0]} cy={cuff[1]} r={8} fill={dark} stroke={INK} strokeWidth={3.5} />
        <line x1={cuff[0]} y1={cuff[1]} x2={a.h[0]} y2={a.h[1]} stroke={INK} strokeWidth={8} />
        <circle cx={a.h[0]} cy={a.h[1]} r={8.5} fill={INK} />
      </g>
    );
  };
  const Leg: React.FC<{l: ReturnType<typeof leg>}> = ({l}) => (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points={`${hip[0]},${hip[1]} ${l.k[0]},${l.k[1]} ${l.f[0]},${l.f[1]}`} stroke={INK} strokeWidth={10} />
      <ellipse cx={l.f[0] + 8} cy={l.f[1] + 2} rx={15} ry={8} fill={INK} />
    </g>
  );

  const BODY = 'M -26 -120 Q -30 -60 -24 2 Q 0 8 24 2 Q 30 -60 26 -120 Q 0 -127 -26 -120 Z';

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${(flip ? -1 : 1) * scale} ${scale})`} opacity={opacity}>
      <Leg l={lL} />
      <Leg l={lR} />
      <g transform={`rotate(${-lean} ${hip[0]} ${hip[1]}) translate(0 ${hip[1]})`}>
        <Sleeve a={aL} />
        {/* chaqueta ajustada */}
        <path d={BODY} fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* bajo de la chaqueta */}
        <path d="M -25 -6 Q 0 0 25 -6 L 24 2 Q 0 8 -24 2 Z" fill={dark} stroke={INK} strokeWidth={3} />
        {/* cremallera */}
        <line x1={0} y1={-118} x2={0} y2={2} stroke={INK} strokeWidth={4} />
        <line x1={0} y1={-118} x2={0} y2={2} stroke={light} strokeWidth={1.5} strokeDasharray="3 4" />
        <rect x={-4} y={-92} width={8} height={14} rx={2} fill="#D9E2EC" stroke={INK} strokeWidth={2.5} />
        {/* bolsillos con cremallera */}
        <line x1={-20} y1={-44} x2={-8} y2={-36} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={20} y1={-44} x2={8} y2={-36} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* brillo */}
        <path d="M -18 -108 Q -24 -80 -20 -56" stroke="#fff" strokeOpacity={0.5} strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* capucha bajada (detras del cuello) */}
        <path d="M -38 -112 Q -42 -142 0 -146 Q 42 -142 38 -112 Q 22 -102 0 -108 Q -22 -102 -38 -112 Z" fill={dark} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        {/* cuello de la chaqueta */}
        <path d="M -16 -122 L 0 -104 L 16 -122 L 10 -128 L 0 -116 L -10 -128 Z" fill={light} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {/* cabeza */}
        <g transform={`translate(0 -160) rotate(${pose.head ?? 0})`}>
          <circle cx={0} cy={2} r={36} fill={INK} />
          <path d="M -24 -22 Q -14 -32 0 -33" stroke="#fff" strokeOpacity={0.22} strokeWidth={4} fill="none" strokeLinecap="round" />
          <g transform={`translate(${look * 5} 0)`}>
            <EyesV2 type={eyes} look={look} blink={blink} />
            <MouthV2G type={mouth} />
          </g>
          {sweat && <path d="M 40 -20 Q 50 -2 44 6 Q 36 10 34 0 Q 34 -8 40 -20 Z" fill="#6EC8FF" stroke={INK} strokeWidth={3} />}
        </g>
        <Sleeve a={aR} />
      </g>
    </g>
  );
};
