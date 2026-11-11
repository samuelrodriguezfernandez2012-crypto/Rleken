import React from 'react';
import {AbsoluteFill} from 'remotion';
import {StickmanV2} from '../StickmanV2';
import {POSES, SvgDefs} from '../Stickman';
import {rnd} from '../fx';
import {loadFonts} from '../fonts';

// prueba de estilo "cinematico": luz suave, fondo desenfocado, particulas, viñeta
const LW = 1920, LH = 1080;
const Blur: React.FC<{b: number; children: React.ReactNode; o?: number}> = ({b, children, o = 1}) => (
  <AbsoluteFill style={{filter: `blur(${b}px)`, opacity: o}}>
    <svg width={LW} height={LH}>{children}</svg>
  </AbsoluteFill>
);

export const CinematicTest: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#0E1030 0%, #241A4A 55%, #3A2556 100%)', overflow: 'hidden'}}>
      {/* nubes y ciudad lejana desenfocadas */}
      <Blur b={14} o={0.55}>
        {[[700, 170, 330, 26], [1500, 240, 260, 20], [300, 300, 220, 18]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#C9A0B8" />)}
      </Blur>
      <Blur b={7} o={0.6}>
        {Array.from({length: 26}).map((_, i) => {
          const h = 80 + rnd(i) * 220;
          return <rect key={i} x={i * 76} y={760 - h} width={60} height={h + 400} fill="#2A1F45" />;
        })}
        {Array.from({length: 60}).map((_, i) => <rect key={i} x={rnd(i + 3) * LW} y={620 + rnd(i + 9) * 140} width={6} height={8} fill="#FFD9A0" opacity={0.6} />)}
      </Blur>
      <Blur b={3}>
        <rect x={0} y={860} width={LW} height={300} fill="#1A1330" />
      </Blur>
      {/* brillo calido detras de la bala */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 37% 54%, rgba(255,190,110,0.55) 0%, rgba(255,150,80,0.15) 12%, transparent 26%)'}} />
      <svg width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
        <SvgDefs />
        <defs>
          <linearGradient id="trail" x1="0" x2="1"><stop offset="0" stopColor="#FFB070" stopOpacity={0} /><stop offset="1" stopColor="#FFB070" stopOpacity={0.85} /></linearGradient>
          <linearGradient id="rim" x1="0" x2="1"><stop offset="0" stopColor="#8FB4FF" /><stop offset="1" stopColor="#8FB4FF" stopOpacity={0} /></linearGradient>
        </defs>
        {/* ondas del aire */}
        {[420, 560, 680].map((x, i) => <ellipse key={i} cx={x} cy={585} rx={36 + i * 8} ry={110 - i * 10} fill="none" stroke="#fff" strokeOpacity={0.35 - i * 0.07} strokeWidth={3} />)}
        <rect x={0} y={572} width={830} height={26} fill="url(#trail)" />
        <path d="M 810 566 L 960 566 Q 1010 585 960 604 L 810 604 Z" fill="#B8642E" stroke="#5A2A10" strokeWidth={4} />
        <rect x={820} y={572} width={110} height={6} fill="#FFD2A8" opacity={0.8} />
        {/* cristales */}
        {Array.from({length: 9}).map((_, i) => (
          <path key={i} transform={`translate(${200 + rnd(i) * 900} ${200 + rnd(i + 4) * 650}) rotate(${rnd(i + 2) * 360}) scale(${0.6 + rnd(i + 7)})`} d="M 0 -26 L 18 -6 L 8 24 L -16 10 Z" fill="#CFE3FF" fillOpacity={0.35} stroke="#fff" strokeOpacity={0.8} strokeWidth={2} />
        ))}
        {/* personaje grande, de perfil, con luz de borde */}
        <g style={{filter: 'drop-shadow(-6px -4px 0 #8FB4FF)'}}>
          <StickmanV2 x={1380} y={1080 + 308 * 2.6 - 560} scale={2.6} pose={POSES.idle} eyes="normal" mouth="flat" flip />
        </g>
        {/* lluvia fina */}
        {Array.from({length: 90}).map((_, i) => <rect key={i} x={rnd(i + 11) * LW} y={rnd(i + 13) * LH} width={2} height={10} fill="#fff" opacity={0.25 + rnd(i) * 0.4} />)}
      </svg>
      {/* parpados "aburridos" encima de los ojos */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)'}} />
      <div style={{position: 'absolute', left: 70, top: 90, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 190, lineHeight: 1.0, letterSpacing: -4, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>
        <div style={{color: '#fff'}}>DEMASIADO</div>
        <div style={{color: '#FFD23F'}}>LENTO.</div>
      </div>
    </AbsoluteFill>
  );
};
