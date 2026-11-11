import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFonts} from '../../fonts';
import {FONT} from '../../fx';
import {LWorld, Hero, POSES} from './kit';
import {PocketWatch} from './props';

// miniatura 1280x720 (se dibuja a 1920x1080 y se escala)
export const Largo1Thumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#0B1026', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(0.6667)', transformOrigin: '0 0', width: 1920, height: 1080}}>
        <LWorld>
          <rect width={960} height={1080} fill="#2D6CDF" opacity={0.35} />
          <rect x={960} width={960} height={1080} fill="#9A031E" opacity={0.45} />
          <circle cx={960} cy={560} r={420} fill="#FFE24A" opacity={0.18} filter="url(#blurGlow)" />
          <PocketWatch x={960} y={560} s={2.1} open light={1} t={0.4} />
          <Hero x={420} y={1040} s={1.9} t={0} age={12} pose={POSES.idle} eyes="normal" mouth="flat" />
          <Hero x={1500} y={1040} s={1.9} t={0} age={60} cane pose={POSES.idle} eyes="scared" mouth="o" />
        </LWorld>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 30, textAlign: 'center', fontFamily: FONT, fontSize: 190, color: '#FFE24A', WebkitTextStroke: '22px #111', paintOrder: 'stroke fill', textShadow: '0 16px 0 #111', transform: 'rotate(-3deg)'}}>100 DÍAS</div>
        <div style={{position: 'absolute', left: 0, width: 1920, top: 250, textAlign: 'center', fontFamily: FONT, fontSize: 110, color: '#fff', WebkitTextStroke: '16px #111', paintOrder: 'stroke fill', textShadow: '0 12px 0 #111', transform: 'rotate(-3deg)'}}>CON UN PODER QUE ME MATABA</div>
        <div style={{position: 'absolute', left: 700, top: 880, background: '#E0002A', border: '10px solid #111', borderRadius: 26, padding: '6px 30px', fontFamily: FONT, fontSize: 90, color: '#fff', WebkitTextStroke: '9px #111', paintOrder: 'stroke fill', transform: 'rotate(5deg)', boxShadow: '0 12px 0 #111'}}>12 → 60 AÑOS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// portada v2: mas contraste, caras enormes, grieta y flecha
export const Largo1ThumbV2: React.FC = () => {
  loadFonts();
  const txt = (size: number, color: string, stroke = 22): React.CSSProperties => ({fontFamily: FONT, fontSize: size, color, WebkitTextStroke: `${stroke}px #111`, paintOrder: 'stroke fill', textShadow: `0 ${stroke * 0.7}px 0 #111`, lineHeight: 0.95});
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(0.6667)', transformOrigin: '0 0', width: 1920, height: 1080}}>
        <LWorld>
          <defs>
            <radialGradient id="tl" cx="30%" cy="55%" r="60%"><stop offset="0" stopColor="#4CC9F0" /><stop offset="1" stopColor="#0B1F5C" /></radialGradient>
            <radialGradient id="tr" cx="70%" cy="55%" r="60%"><stop offset="0" stopColor="#FF4D4D" /><stop offset="1" stopColor="#3A0008" /></radialGradient>
          </defs>
          <path d="M 0 0 L 1010 0 L 930 260 L 1040 420 L 920 640 L 1020 860 L 950 1080 L 0 1080 Z" fill="url(#tl)" />
          <path d="M 1010 0 L 1920 0 L 1920 1080 L 950 1080 L 1020 860 L 920 640 L 1040 420 L 930 260 Z" fill="url(#tr)" />
          <path d="M 1010 0 L 930 260 L 1040 420 L 920 640 L 1020 860 L 950 1080" stroke="#FFE24A" strokeWidth={26} fill="none" filter="url(#blurGlow)" />
          <path d="M 1010 0 L 930 260 L 1040 420 L 920 640 L 1020 860 L 950 1080" stroke="#fff" strokeWidth={10} fill="none" />
          <circle cx={975} cy={640} r={250} fill="#FFE24A" opacity={0.35} filter="url(#blurGlow)" />
          <Hero x={500} y={1800} s={3.6} t={0} age={12} pose={POSES.fists} eyes="angry" mouth="flat" />
          <Hero x={1400} y={1760} s={3.6} t={0} age={60} pose={POSES.scared} eyes="scared" mouth="teeth" sweat />
          <PocketWatch x={975} y={700} s={1.25} open light={1} t={0.4} />
        </LWorld>
        <div style={{position: 'absolute', left: 40, top: 70, transform: 'rotate(-5deg)', ...txt(250, '#FFE24A', 26)}}>100 DÍAS</div>
        <div style={{position: 'absolute', right: 40, top: 40, transform: 'rotate(4deg)', background: '#E0002A', border: '12px solid #111', borderRadius: 30, padding: '10px 34px', boxShadow: '0 14px 0 #111', ...txt(120, '#fff', 14)}}>ME MATA</div>
        <div style={{position: 'absolute', left: 80, bottom: 40, transform: 'rotate(-3deg)', ...txt(150, '#fff', 20)}}>12 AÑOS</div>
        <div style={{position: 'absolute', right: 40, bottom: 30, transform: 'rotate(3deg)', ...txt(150, '#FF3B5C', 20)}}>60 AÑOS</div>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <g transform="translate(1700 470) rotate(30)"><path d="M -30 -150 L 30 -150 L 30 0 L 80 0 L 0 100 L -80 0 L -30 0 Z" fill="#FFE24A" stroke="#111" strokeWidth={12} strokeLinejoin="round" /></g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
