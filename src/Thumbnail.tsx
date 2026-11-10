import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneMeteor} from './Scenes';
import {FONT} from './fx';
import './Main';

// Miniatura vertical: el momento del meteorito con texto grande
export const Thumbnail: React.FC = () => {
  const t = 31.0;
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: 'scale(1.08)', transformOrigin: '50% 60%'}}>
        <SceneMeteor t={t} noText />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6))'}} />
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', transform: 'rotate(-4deg)'}}>
        <div style={{fontFamily: FONT, fontSize: 150, lineHeight: 1, color: '#FFE24A', WebkitTextStroke: '18px #111', paintOrder: 'stroke fill', textShadow: '0 14px 0 #111'}}>
          MIS MENTIRAS
        </div>
        <div style={{fontFamily: FONT, fontSize: 118, lineHeight: 1.1, color: '#fff', WebkitTextStroke: '16px #111', paintOrder: 'stroke fill', textShadow: '0 12px 0 #111'}}>
          SE HACEN REALIDAD
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 260, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{background: '#FF3B5C', border: '10px solid #111', borderRadius: 30, padding: '10px 40px', fontFamily: FONT, fontSize: 110, color: '#fff', WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', transform: 'rotate(3deg)', boxShadow: '0 14px 0 #111'}}>
          ¡Y MENTÍ MAL!
        </div>
      </div>
    </AbsoluteFill>
  );
};
