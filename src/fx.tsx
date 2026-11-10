import React from 'react';
import {interpolate, spring, Easing} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const FONT = 'Luckiest, Impact, sans-serif';
export const FONT2 = 'Baloo, sans-serif';

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
export const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// rebote tipo muelle a partir de un instante (segundos)
export const pop = (t: number, at: number, damping = 9, stiffness = 170) =>
  t < at ? 0 : spring({frame: (t - at) * FPS, fps: FPS, config: {damping, stiffness, mass: 0.6}});

// sacudida pseudo-aleatoria que se apaga
export const shake = (t: number, at: number, dur = 0.5, amp = 30) => {
  if (t < at || t > at + dur) return {x: 0, y: 0, r: 0};
  const k = 1 - (t - at) / dur;
  const f = (t - at) * 60;
  return {
    x: Math.sin(f * 1.7) * amp * k,
    y: Math.cos(f * 2.3) * amp * k,
    r: Math.sin(f * 1.1) * amp * 0.06 * k,
  };
};

export const sumShake = (t: number, list: [number, number?, number?][]) =>
  list.reduce(
    (acc, [at, dur, amp]) => {
      const s = shake(t, at, dur, amp);
      return {x: acc.x + s.x, y: acc.y + s.y, r: acc.r + s.r};
    },
    {x: 0, y: 0, r: 0},
  );

// numero pseudo-aleatorio estable
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// texto grande con contorno y rebote
export const BigText: React.FC<{
  t: number;
  at: number;
  until?: number;
  text: string;
  x?: number;
  y: number;
  size?: number;
  color?: string;
  stroke?: string;
  rotate?: number;
  wiggle?: boolean;
  shadow?: string;
  maxWidth?: number;
}> = ({t, at, until = 999, text, x = W / 2, y, size = 140, color = '#FFE24A', stroke = '#111', rotate = -4, wiggle, shadow = '#111', maxWidth = 980}) => {
  if (t < at || t > until) return null;
  const s = pop(t, at);
  const out = until < 999 ? 1 - ramp(t, until - 0.15, until) : 1;
  const wg = wiggle ? Math.sin(t * 9) * 3 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - maxWidth / 2,
        top: y,
        width: maxWidth,
        textAlign: 'center',
        transform: `translateY(-50%) scale(${s * out}) rotate(${rotate + wg}deg)`,
        fontFamily: FONT,
        fontSize: size,
        lineHeight: 1.02,
        color,
        WebkitTextStroke: `${Math.round(size / 9)}px ${stroke}`,
        paintOrder: 'stroke fill',
        textShadow: `0 ${Math.round(size / 14)}px 0 ${shadow}`,
        letterSpacing: 2,
        whiteSpace: 'pre-line',
      }}
    >
      {text}
    </div>
  );
};

// bocadillo de texto (los personajes no hablan, solo bocadillos)
export const Bubble: React.FC<{
  t: number;
  at: number;
  until?: number;
  text: string;
  x: number;
  y: number;
  w?: number;
  tail?: 'left' | 'right' | 'down';
  size?: number;
  shout?: boolean;
  color?: string;
}> = ({t, at, until = 999, text, x, y, w = 520, tail = 'down', size = 56, shout, color = '#fff'}) => {
  if (t < at || t > until) return null;
  const s = pop(t, at, 10, 200) * (1 - ramp(t, until - 0.12, until));
  const jit = shout ? Math.sin(t * 50) * 4 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2 + jit,
        top: y,
        width: w,
        transform: `translateY(-100%) scale(${s})`,
        transformOrigin: tail === 'left' ? '15% 100%' : tail === 'right' ? '85% 100%' : '50% 100%',
      }}
    >
      <div
        style={{
          background: color,
          border: '7px solid #111',
          borderRadius: shout ? 20 : 48,
          padding: '22px 28px',
          fontFamily: FONT,
          fontSize: size,
          lineHeight: 1.05,
          textAlign: 'center',
          color: '#111',
          boxShadow: '0 10px 0 #111',
        }}
      >
        {text}
      </div>
      <svg
        width={80}
        height={60}
        style={{
          position: 'absolute',
          left: tail === 'left' ? 50 : tail === 'right' ? w - 130 : w / 2 - 40,
          top: '100%',
          marginTop: -8,
        }}
      >
        <path
          d={tail === 'left' ? 'M 10 0 L 0 56 L 60 0' : tail === 'right' ? 'M 20 0 L 80 56 L 70 0' : 'M 15 0 L 40 56 L 65 0'}
          fill={color}
          stroke="#111"
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <rect x={0} y={-6} width={80} height={11} fill={color} />
      </svg>
    </div>
  );
};

// fondo de rayos giratorios
export const Burst: React.FC<{t: number; c1: string; c2: string; cx?: number; cy?: number; speed?: number}> = ({t, c1, c2, cx = W / 2, cy = H * 0.42, speed = 12}) => {
  const n = 18;
  const rays = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = a0 + Math.PI / n;
    const R = 2600;
    rays.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} L ${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R} Z`}
        fill={c2}
      />,
    );
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <rect width={W} height={H} fill={c1} />
      <g transform={`rotate(${t * speed} ${cx} ${cy})`}>{rays}</g>
      <defs>
        <radialGradient id="vig" cx="50%" cy="45%" r="70%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vig)" />
    </svg>
  );
};

// lineas de velocidad
export const SpeedLines: React.FC<{t: number; opacity?: number; vertical?: boolean; color?: string}> = ({t, opacity = 0.7, vertical, color = '#fff'}) => {
  const lines = [];
  for (let i = 0; i < 26; i++) {
    const p = rnd(i);
    const sp = 2200 + rnd(i + 50) * 1800;
    const pos = ((t * sp + p * 4000) % 3200) - 600;
    const len = 180 + rnd(i + 9) * 360;
    if (vertical) {
      const x = rnd(i + 3) * W;
      lines.push(<line key={i} x1={x} y1={pos} x2={x} y2={pos + len} stroke={color} strokeWidth={4 + rnd(i) * 6} strokeLinecap="round" />);
    } else {
      const y = rnd(i + 3) * H;
      lines.push(<line key={i} x1={W - pos} y1={y} x2={W - pos + len} y2={y} stroke={color} strokeWidth={4 + rnd(i) * 6} strokeLinecap="round" />);
    }
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity}}>
      {lines}
    </svg>
  );
};

// destellos/estrellitas
export const Sparkles: React.FC<{t: number; at: number; dur?: number; cx: number; cy: number; n?: number; spread?: number; color?: string}> = ({t, at, dur = 1.2, cx, cy, n = 18, spread = 420, color = '#FFE24A'}) => {
  if (t < at || t > at + dur) return null;
  const k = (t - at) / dur;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const a = rnd(i + at) * Math.PI * 2;
        const d = easeOut(k) * spread * (0.4 + rnd(i * 3 + at) * 0.6);
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d;
        const s = (1 - k) * (14 + rnd(i * 7) * 22);
        return (
          <path
            key={i}
            transform={`translate(${x} ${y}) rotate(${k * 180 + i * 20}) scale(${s / 10})`}
            d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z"
            fill={i % 3 === 0 ? '#fff' : color}
            stroke="#111"
            strokeWidth={1.2}
          />
        );
      })}
    </svg>
  );
};

export const Flash: React.FC<{t: number; at: number; dur?: number; color?: string; max?: number}> = ({t, at, dur = 0.25, color = '#fff', max = 1}) => {
  if (t < at || t > at + dur) return null;
  return <div style={{position: 'absolute', inset: 0, background: color, opacity: max * (1 - (t - at) / dur)}} />;
};

// transicion de barrido entre escenas
export const Wipe: React.FC<{t: number; at: number; color?: string}> = ({t, at, color = '#111'}) => {
  const d = 0.28;
  if (t < at - d || t > at + d) return null;
  const k = (t - (at - d)) / (2 * d);
  const x = interpolate(k, [0, 1], [-1.3, 1.3], {easing: Easing.inOut(Easing.cubic)}) * W;
  return (
    <div
      style={{
        position: 'absolute',
        top: -200,
        left: x - 200,
        width: W + 400,
        height: H + 400,
        background: color,
        transform: 'skewX(-12deg)',
      }}
    />
  );
};

export const Dust: React.FC<{t: number; at: number; x: number; y: number}> = ({t, at, x, y}) => {
  if (t < at || t > at + 0.7) return null;
  const k = (t - at) / 0.7;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 10}).map((_, i) => {
        const dir = i < 5 ? -1 : 1;
        const dx = dir * (60 + rnd(i) * 260) * easeOut(k);
        const dy = -rnd(i + 4) * 80 * easeOut(k);
        return <circle key={i} cx={x + dx} cy={y + dy} r={(1 - k) * (24 + rnd(i + 2) * 30)} fill="#fff" stroke="#111" strokeWidth={4} />;
      })}
    </svg>
  );
};
