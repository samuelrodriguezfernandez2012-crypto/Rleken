import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Flash, rnd} from '../futuro/kit';
import {VBig, makeCaps, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 35;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|rueda|cuadrada|triangular|pinchos|redonda|barro|años/i);
const I1 = T('intento'), I2 = T('intento', 2), I3 = T('intento', 3), I4 = T('intento', 4), CUR = T('y'), ANT = T('y', 2), END = T('qué');
const CRASH = T('bien') - 0.15;

/** imagen 3D a pantalla completa con camara (zoom/paneo), sacudidas y desenfoque de movimiento */
const Shot: React.FC<{src: string; t: number; t0: number; z0?: number; z1?: number; x0?: number; x1?: number; y0?: number; y1?: number; dur?: number; shake?: number; bump?: number; blur?: number; rot?: number}> = ({src, t, t0, z0 = 1.05, z1 = 1.2, x0 = 0, x1 = 0, y0 = 0, y1 = 0, dur = 4, shake = 0, bump = 0, blur = 0, rot = 0}) => {
  const k = easeOut(ramp(t, t0, t0 + dur));
  const z = z0 + (z1 - z0) * k;
  const sx = shake ? Math.sin(t * 63) * shake : 0, sy = shake ? Math.cos(t * 51) * shake * 0.7 : 0;
  const by = bump ? -Math.abs(Math.sin((t - t0) * Math.PI * 2.2)) * bump : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${x0 + (x1 - x0) * k + sx}px, ${y0 + (y1 - y0) * k + sy + by}px) scale(${z}) rotate(${rot * k}deg)`, filter: blur ? `blur(${blur}px)` : undefined}} />
    </AbsoluteFill>
  );
};
const SpeedLines: React.FC<{t: number; k?: number}> = ({t, k = 1}) => (
  <AbsoluteFill style={{opacity: k, pointerEvents: 'none'}}>
    <svg width={1080} height={1920}>{Array.from({length: 26}).map((_, i) => { const y = rnd(i) * 1920, off = ((t * 3200 + rnd(i + 3) * 1500) % 1700) - 300; return <line key={i} x1={1080 - off} y1={y} x2={1080 - off + 260 + rnd(i + 1) * 300} y2={y} stroke="#fff" strokeWidth={4 + rnd(i + 2) * 6} opacity={0.55} strokeLinecap="round" />; })}</svg>
  </AbsoluteFill>
);
const Dust: React.FC<{t: number; at: number}> = ({t, at}) => {
  if (t < at || t > at + 1.6) return null;
  const s = t - at;
  return <AbsoluteFill><svg width={1080} height={1920}>{Array.from({length: 30}).map((_, i) => { const a = rnd(i) * Math.PI * 2, v = 300 + rnd(i + 1) * 700; return <circle key={i} cx={540 + Math.cos(a) * v * s} cy={1250 + Math.sin(a) * v * s * 0.5 + 400 * s * s} r={12 + rnd(i + 2) * 24} fill={i % 3 ? '#c9b48a' : '#7a5c3a'} opacity={Math.max(0, 1 - s / 1.6)} />; })}</svg></AbsoluteFill>;
};
const Impact: React.FC<{t: number; at: number; text: string}> = ({t, at, text}) => {
  if (t < at || t > at + 0.9) return null;
  const k = easeOut(ramp(t, at, at + 0.15));
  return <div style={{position: 'absolute', left: 0, right: 0, top: 980, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 180, color: '#FFD23F', WebkitTextStroke: '10px #111', paintOrder: 'stroke', transform: `scale(${0.5 + k * 0.7}) rotate(-8deg)`, opacity: 1 - ramp(t, at + 0.6, at + 0.9)}}>{text}</div>;
};

export const RuedaIAShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  const trembleTri = t > T('peor') - 0.3 && t < T('peor') + 0.5 ? 18 : 0;
  let shot: React.ReactNode;
  if (t < I1) shot = <Shot src="ia3d/choque.jpg" t={t} t0={0} z0={1.5} z1={1.15} y0={-120} dur={1.6} shake={Math.max(0, 22 - t * 14)} />;
  else if (t < I2) shot = <Shot src="ia3d/cuadrada.jpg" t={t} t0={I1} z0={1.05} z1={1.25} y1={-60} dur={5} bump={t > T('avanza') ? 26 : 0} />;
  else if (t < I3) shot = <Shot src="ia3d/tri.jpg" t={t} t0={I2} z0={1.35} z1={1.12} x0={60} dur={3} shake={trembleTri} />;
  else if (t < I4) shot = <Shot src="ia3d/pinchos.jpg" t={t} t0={I3} z0={1.05} z1={1.3} y1={-80} dur={4} shake={3 + (t > T('mejor') ? 8 : 0)} />;
  else if (t < CRASH) shot = <Shot src="ia3d/redonda.jpg" t={t} t0={I4} z0={1.1} z1={1.35} x0={-40} x1={60} dur={4.5} shake={t > T('funciona') ? 6 : 0} />;
  else if (t < CUR) shot = <Shot src="ia3d/choque.jpg" t={t} t0={CRASH} z0={1.45} z1={1.1} dur={0.8} shake={Math.max(0, 26 - (t - CRASH) * 30)} />;
  else if (t < ANT) shot = <Shot src="ia3d/barro.jpg" t={t} t0={CUR} z0={1.25} z1={1.05} dur={6} rot={-1} />;
  else if (t < END) shot = <Shot src="ia3d/museo.jpg" t={t} t0={ANT} z0={1.05} z1={1.35} x1={-90} y1={40} dur={5} />;
  else shot = <Shot src="ia3d/cuadrada.jpg" t={t} t0={END} z0={1.3} z1={1.15} y0={-80} dur={1.5} />;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('rueda/mezcla.wav')} />
      {shot}
      {t > T('funciona') && t < CRASH && <SpeedLines t={t} k={ramp(t, T('funciona'), T('funciona') + 0.4)} />}
      <Dust t={t} at={T('peor') - 0.2} />
      <Dust t={t} at={CRASH} />
      <Impact t={t} at={T('peor') - 0.2} text="¡PUM!" />
      <Impact t={t} at={CRASH} text="¡CRASH!" />
      <Impact t={t} at={0.05} text="¡CRASH!" />
      {[I1, I2, I3, I4, CRASH, CUR, ANT, END].map((a, i) => <Flash key={i} t={t} at={a} dur={0.12} max={0.55} />)}
      <VBig t={t} at={0.03} until={I1 - 0.05} a="ASÍ INVENTAS" b="LA RUEDA" size={130} color2="#FFD166" />
      <VBig t={t} at={I1} until={I2 - 0.05} a="INTENTO 1" b="CUADRADA" size={140} color2="#E9ECEF" />
      <VBig t={t} at={I2} until={I3 - 0.05} a="INTENTO 2" b="TRIANGULAR" size={140} color2="#FF6B3D" />
      <VBig t={t} at={I3} until={I4 - 0.05} a="INTENTO 3" b="CON PINCHOS" size={140} color2="#ADB5BD" />
      <VBig t={t} at={I4} until={CUR - 0.05} a="INTENTO 4" b={t > T('funciona') ? 'DEMASIADO BIEN' : 'REDONDA'} size={140} color2="#7BF59A" />
      <VBig t={t} at={CUR} until={ANT - 0.05} a="LA 1ª RUEDA" b="ERA PARA BARRO" size={125} color2="#FFB86B" />
      <VBig t={t} at={ANT} until={END - 0.05} a="5.000 AÑOS" b="LA MÁS ANTIGUA" size={140} color2="#FFD166" />
      <VBig t={t} at={END} a="¿QUÉ INVENTAMOS" b="AHORA?" size={120} color2="#FFD166" />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const RuedaIAThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <Shot src="ia3d/tri.jpg" t={0} t0={0} z0={1.1} z1={1.1} />
      <VBig t={1} at={0} a="ASÍ INVENTAS" b="LA RUEDA" size={140} y={180} color2="#FFD166" />
    </AbsoluteFill>
  );
};
