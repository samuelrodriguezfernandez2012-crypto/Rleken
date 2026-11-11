import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {StickmanV2, BLUE} from './StickmanV2';
import {POSES, Pose, SvgDefs, lerpPose} from './Stickman';
import {W, H, FPS, FONT, Wipe, Burst, pop, ramp, easeOut} from './fx';
import {Captions, Word} from './Captions';
import {loadFonts} from './fonts';

// Kit comun para los Shorts verticales con el personaje nuevo (StickmanV2)
export const GROUND = 1300;

export const VWorld: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <SvgDefs />
    {children}
  </svg>
);
export const VCam: React.FC<{s?: number; ox?: number; oy?: number; x?: number; y?: number; r?: number; filter?: string; children: React.ReactNode}> = ({s = 1, ox = W / 2, oy = H / 2, x = 0, y = 0, r = 0, filter, children}) => (
  <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, transformOrigin: `${ox}px ${oy}px`, filter}}>{children}</AbsoluteFill>
);
export const vseq = (t: number, keys: [number, Pose][], d = 0.22): Pose => {
  let p = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t >= keys[i][0]) p = lerpPose(p, keys[i][1], easeOut(ramp(t, keys[i][0], keys[i][0] + d)));
  return p;
};
const blink = (t: number, o = 0) => ((t + o) * 1000) % 3500 < 110;

export const V2: React.FC<{x: number; y?: number; s?: number; pose?: Pose; eyes?: any; mouth?: any; t: number; look?: number; flip?: boolean; glow?: string; rotate?: number; color?: string; shadow?: boolean; noBlink?: boolean}> = ({
  x, y = GROUND, s = 1.5, pose = POSES.idle, eyes = 'normal', mouth = 'flat', t, look = 0, flip, glow, rotate = 0, color = BLUE, shadow = true, noBlink,
}) => (
  <g>
    {glow && <circle cx={x} cy={y - 200 * s} r={240 * s} fill={glow} opacity={0.25 + 0.1 * Math.sin(t * 7)} filter="url(#blurGlow)" />}
    {shadow && rotate === 0 && <ellipse cx={x} cy={y + 4} rx={95 * s} ry={14 * s} fill="#000" opacity={0.22} />}
    <StickmanV2 x={x} y={y} scale={s} color={color} pose={pose} eyes={eyes} mouth={mouth} look={look} flip={flip} rotate={rotate} blink={!noBlink && eyes !== 'closed' && blink(t, x / 400)} />
  </g>
);

/** instante de la n-esima aparicion de una palabra */
export const makeT = (words: Word[]) => (w: string, n = 1) => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-záéíóúüñ0-9]/g, '');
  let k = 0;
  for (const x of words) if (norm(x.text) === norm(w) && ++k === n) return x.start_ms / 1000;
  throw new Error('palabra no encontrada: ' + w + ' ' + n);
};

export const EndV2: React.FC<{t: number; at: number; question: string; c1?: string; c2?: string; children?: React.ReactNode}> = ({t, at, question, c1 = '#003049', c2 = '#00507A', children}) => {
  const cta = at + 1.4;
  return (
    <AbsoluteFill>
      <Burst t={t} c1={c1} c2={c2} speed={20} />
      <VWorld>
        {children}
        <V2 x={460} t={t} pose={t > cta ? {...POSES.point, armR: [60, -10]} : POSES.shrug} s={1.45} />
        {t > cta && (
          <g transform={`translate(${860 + Math.sin(t * 8) * 12} ${1060 + Math.sin(t * 8) * 12}) scale(${pop(t, cta)}) rotate(-40)`}>
            <path d="M -24 -120 L 24 -120 L 24 0 L 62 0 L 0 80 L -62 0 L -24 0 Z" fill="#FFE24A" stroke="#111" strokeWidth={9} strokeLinejoin="round" />
          </g>
        )}
      </VWorld>
      <div style={{position: 'absolute', left: 40, width: W - 80, top: 330, textAlign: 'center', transform: `translateY(-50%) scale(${pop(t, at)}) rotate(-2deg)`, fontFamily: FONT, fontSize: 104, lineHeight: 1.02, color: '#fff', WebkitTextStroke: '12px #111', paintOrder: 'stroke fill', textShadow: '0 8px 0 #111', whiteSpace: 'pre-line'}}>{question}</div>
      {t > cta && (
        <div style={{position: 'absolute', left: 0, width: W, top: 600, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, cta) * (1 + Math.sin(t * 8) * 0.06)})`}}>
          <div style={{background: '#FF3B5C', border: '8px solid #111', borderRadius: 40, padding: '12px 40px', fontFamily: FONT, fontSize: 80, color: '#fff', WebkitTextStroke: '9px #111', paintOrder: 'stroke fill', boxShadow: '0 12px 0 #111'}}>¡COMÉNTALO!</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const ShellV2: React.FC<{name: string; words: Word[]; keys: RegExp; scenes: [number, React.FC<{t: number}>][]; overlay?: React.FC<{t: number}>}> = ({name, words, keys, scenes, overlay: O}) => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let idx = 0;
  for (let i = 0; i < scenes.length; i++) if (t >= scenes[i][0]) idx = i;
  const S = scenes[idx][1];
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Audio src={staticFile(`${name}/mezcla.wav`)} />
      <S t={t} />
      {scenes.slice(1).map(([c], i) => <Wipe key={i} t={t} at={c} />)}
      {O && <O t={t} />}
      <Captions t={t} words={words} keys={keys} />
    </AbsoluteFill>
  );
};

export const ThumbTitle: React.FC<{a: string; b: string; pill: string}> = ({a, b, pill}) => (
  <>
    <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', transform: 'rotate(-4deg)'}}>
      <div style={{fontFamily: FONT, fontSize: 150, lineHeight: 1, color: '#FFE24A', WebkitTextStroke: '18px #111', paintOrder: 'stroke fill', textShadow: '0 14px 0 #111'}}>{a}</div>
      <div style={{fontFamily: FONT, fontSize: 112, lineHeight: 1.1, color: '#fff', WebkitTextStroke: '16px #111', paintOrder: 'stroke fill', textShadow: '0 12px 0 #111'}}>{b}</div>
    </div>
    <div style={{position: 'absolute', bottom: 230, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{background: '#FF3B5C', border: '10px solid #111', borderRadius: 30, padding: '10px 40px', fontFamily: FONT, fontSize: 100, color: '#fff', WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', transform: 'rotate(3deg)', boxShadow: '0 14px 0 #111'}}>{pill}</div>
    </div>
  </>
);

export {POSES, W, H, FONT, BLUE};
export type {Pose};
