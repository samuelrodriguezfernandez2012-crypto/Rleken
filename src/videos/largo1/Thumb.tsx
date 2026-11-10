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
