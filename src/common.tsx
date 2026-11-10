import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {SvgDefs, Pose, lerpPose, Stickman, POSES} from './Stickman';
import {W, H, FONT, FPS, BigText, Burst, Sparkles, Wipe, easeOut, ramp, pop, rnd} from './fx';
import {Captions, Word} from './Captions';
import {loadFonts} from './fonts';

export const HERO = '#FF7A1A';
export const GROUND = 1300;
export const blinkAt = (t: number, off = 0) => ((t + off) * 1000) % 3300 < 110;

export const Cam: React.FC<{s?: number; ox?: number; oy?: number; x?: number; y?: number; r?: number; children: React.ReactNode}> = ({
  s = 1, ox = W / 2, oy = H / 2, x = 0, y = 0, r = 0, children,
}) => (
  <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, transformOrigin: `${ox}px ${oy}px`}}>
    {children}
  </AbsoluteFill>
);

export const World: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, ...style}}>
    <SvgDefs />
    {children}
  </svg>
);

export const poseSeq = (t: number, keys: [number, Pose][], dur = 0.22): Pose => {
  let p = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [at, next] = keys[i];
    if (t >= at) p = lerpPose(p, next, easeOut(ramp(t, at, at + dur)));
  }
  return p;
};

// selecciona el valor del ultimo instante alcanzado
export function at<T>(t: number, keys: [number, T][]): T {
  let v = keys[0][1];
  for (const [k, val] of keys) if (t >= k) v = val;
  return v;
}

export const Shadow: React.FC<{x: number; y?: number; w?: number; o?: number}> = ({x, y = GROUND + 4, w = 120, o = 0.25}) => (
  <ellipse cx={x} cy={y} rx={w} ry={w * 0.16} fill="#000" opacity={o} />
);

export const Cloud: React.FC<{x: number; y: number; s?: number; fill?: string}> = ({x, y, s = 1, fill = '#fff'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke="#111" strokeWidth={5}>
    <path d="M -90 20 Q -100 -20 -60 -25 Q -50 -65 -5 -55 Q 30 -85 65 -45 Q 105 -45 100 0 Q 110 25 80 28 L -70 28 Q -95 28 -90 20 Z" />
  </g>
);

export const City: React.FC<{dark?: boolean; y?: number; seed?: number}> = ({dark = false, y = GROUND, seed = 0}) => (
  <g>
    {Array.from({length: 9}).map((_, i) => {
      const w = 110 + rnd(i + seed) * 60;
      const h = 220 + rnd(i + 5 + seed) * 380;
      const x = i * 125 - 30;
      return (
        <g key={i}>
          <rect x={x} y={y - h} width={w} height={h} fill={dark ? '#2a2440' : '#5B6C9E'} stroke="#111" strokeWidth={5} />
          {Array.from({length: Math.floor(h / 70)}).map((__, j) => (
            <rect key={j} x={x + 22} y={y - h + 25 + j * 70} width={w - 44} height={26} rx={4} fill={dark ? (rnd(i * 9 + j) > 0.4 ? '#FFD35A' : '#3b3458') : '#BFE6FF'} opacity={0.9} />
          ))}
        </g>
      );
    })}
  </g>
);

// bocadillo de pensamiento (nube con burbujitas)
export const Thought: React.FC<{
  t: number; at: number; until?: number; text: string; x: number; y: number; w?: number; size?: number;
  tailX?: number; tailY?: number; color?: string; textColor?: string; dark?: boolean;
}> = ({t, at: a, until = 999, text, x, y, w = 560, size = 54, tailX, tailY, color = '#fff', textColor = '#111', dark}) => {
  if (t < a || t > until) return null;
  const s = pop(t, a, 10, 190) * (1 - ramp(t, until - 0.12, until));
  const bob = Math.sin(t * 3 + x) * 6;
  const tx = tailX ?? x, ty = tailY ?? y + 180;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: s > 0.05 ? 1 : 0}}>
        {[0.25, 0.5, 0.75].map((k, i) => (
          <circle key={i} cx={x + (tx - x) * (1 - k) * 0 + (tx - x) * k} cy={y + 40 + (ty - y - 40) * k + bob} r={(1 - k) * 22 * s + 6} fill={color} stroke="#111" strokeWidth={5} />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute', left: x - w / 2, top: y + bob, width: w,
          transform: `translateY(-100%) scale(${s})`, transformOrigin: '50% 100%',
        }}
      >
        <div
          style={{
            background: color, border: '7px solid #111', borderRadius: 999, padding: '34px 46px',
            fontFamily: FONT, fontSize: size, lineHeight: 1.05, textAlign: 'center', color: textColor,
            boxShadow: dark ? '0 0 40px rgba(199,125,255,0.9), 0 10px 0 #111' : '0 10px 0 #111',
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// tarjeta final con pregunta + boton de comentar + flecha
export const EndCard: React.FC<{t: number; start: number; question: string; cta: string; c1?: string; c2?: string; heroEyes?: any; children?: React.ReactNode}> = ({
  t, start, question, cta, c1 = '#2B1B5A', c2 = '#3B2A85', children,
}) => {
  const pulse = 1 + Math.sin(t * 8) * 0.06;
  const ctaAt = start + 1.6;
  const arrowK = pop(t, ctaAt);
  const heroPose = poseSeq(t, [
    [start, POSES.scared],
    [start + 0.6, POSES.shrug],
    [ctaAt, {...POSES.point, armR: [60, -10]}],
  ]);
  return (
    <AbsoluteFill>
      <Burst t={t} c1={c1} c2={c2} speed={20} />
      <Cam s={1.1 - 0.1 * easeOut(ramp(t, start, start + 0.5))} oy={1000}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#000" opacity={0.35} />
          <Shadow x={480} />
          <Stickman x={480} y={GROUND} scale={1.5} color={HERO} pose={heroPose} eyes={t < start + 0.6 ? 'wide' : 'normal'} mouth={t < start + 0.6 ? 'o' : 'smile'} look={0.6} blink={blinkAt(t, 0.7)} />
          {t > ctaAt && (
            <g transform={`translate(${860 + Math.sin(t * 8) * 12} ${1090 + Math.sin(t * 8) * 12}) scale(${arrowK}) rotate(-40)`}>
              <path d="M -24 -120 L 24 -120 L 24 0 L 62 0 L 0 80 L -62 0 L -24 0 Z" fill="#FFE24A" stroke="#111" strokeWidth={9} strokeLinejoin="round" />
            </g>
          )}
        </World>
      </Cam>
      {children}
      <BigText t={t} at={start + 0.1} text={question} y={360} size={96} color="#fff" rotate={-2} />
      {t > ctaAt && (
        <div style={{position: 'absolute', left: 0, width: W, top: 620, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, ctaAt) * pulse})`}}>
          <div style={{background: '#FF3B5C', border: '8px solid #111', borderRadius: 40, padding: '12px 40px', fontFamily: FONT, fontSize: 80, color: '#fff', WebkitTextStroke: '9px #111', paintOrder: 'stroke fill', boxShadow: '0 12px 0 #111'}}>
            {cta}
          </div>
        </div>
      )}
      <Sparkles t={t} at={start + 0.1} cx={540} cy={360} n={20} spread={500} />
    </AbsoluteFill>
  );
};

// carcasa comun de cada Short: audio + escenas + transiciones + subtitulos
export const ShortShell: React.FC<{
  name: string; scenes: [number, number, React.FC<{t: number}>][]; cuts: number[]; words: Word[]; keys?: RegExp;
  hideCaptions?: (t: number) => boolean; overlay?: React.FC<{t: number}>;
}> = ({name, scenes, cuts, words, keys, hideCaptions, overlay: Overlay}) => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Audio src={staticFile(`${name}/mezcla.wav`)} />
      {scenes.map(([a, b, S], i) => (t >= a && t < b ? <S key={i} t={t} /> : null))}
      {cuts.map((c) => (
        <Wipe key={c} t={t} at={c} />
      ))}
      {Overlay && <Overlay t={t} />}
      <Captions t={t} words={words} keys={keys} hidden={hideCaptions?.(t)} />
    </AbsoluteFill>
  );
};

export {W, H, FONT, FPS};
