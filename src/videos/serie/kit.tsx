import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ramp, easeOut} from '../futuro/vkit';

/** Etiqueta fija de la serie arriba a la izquierda (todos los episodios iguales -> identidad de canal) */
export const SerieTag: React.FC<{t: number; ep: number}> = ({t, ep}) => (
  <div style={{position: 'absolute', left: 40, top: 40, padding: '14px 26px', borderRadius: 18, background: 'rgba(11,10,26,0.78)', border: '4px solid #FFD23F', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: '#fff', opacity: easeOut(ramp(t, 2.3, 2.7))}}>
    ¿CUÁNTO AGUANTARÍAS? <span style={{color: '#FFD23F'}}>#{ep}</span>
  </div>
);

/** Tarjeta final: siguiente episodio + boton de suscribirse que se pulsa solo */
export const FollowCard: React.FC<{t: number; at: number; ep: number; next: string; children?: React.ReactNode}> = ({t, at, ep, next, children}) => {
  if (t < at) return null;
  const k = easeOut(ramp(t, at, at + 0.35));
  const press = t > at + 1.6;
  const pk = easeOut(ramp(t, at + 1.6, at + 1.8));
  return (
    <AbsoluteFill style={{background: `rgba(5,5,15,${0.92 * k})`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#FFD23F', transform: `scale(${k})`}}>MAÑANA · EPISODIO #{ep + 1}</div>
      <div style={{width: 760, height: 560, borderRadius: 40, overflow: 'hidden', border: '8px solid #fff', transform: `scale(${k}) rotate(-2deg)`, position: 'relative', background: '#0B0A1A'}}>{children}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 86, color: '#fff', textAlign: 'center', lineHeight: 1.05, padding: '0 60px', transform: `scale(${k})`, WebkitTextStroke: '6px #0B0A1A', paintOrder: 'stroke'}}>{next}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, transform: `scale(${k * (1 - 0.08 * Math.sin(pk * Math.PI))})`}}>
        <div style={{padding: '30px 64px', borderRadius: 60, background: press ? '#3A3A44' : '#FF0033', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff'}}>{press ? 'SUSCRITO ✓' : 'SUSCRIBIRSE'}</div>
        {press && <div style={{fontSize: 90, transform: `rotate(${Math.sin(t * 25) * 20 * (1 - ramp(t, at + 1.8, at + 2.6))}deg)`}}>🔔</div>}
      </div>
      {!press && <div style={{position: 'absolute', bottom: 330, right: 300, fontSize: 110, transform: `translate(${(1 - ramp(t, at + 0.6, at + 1.5)) * 200}px, ${(1 - ramp(t, at + 0.6, at + 1.5)) * 200}px)`}}>👆</div>}
    </AbsoluteFill>
  );
};
