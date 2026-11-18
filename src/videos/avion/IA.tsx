import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Flash, rnd} from '../futuro/kit';
import {VBig, makeCaps, ramp, easeOut, Stars, Earth, Moon} from '../futuro/vkit';
import {Shot, SpeedLines, Dust, Impact} from '../rueda/IA';
import words from './words.json';

export const DURATION_S = 54;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|plumas|cartón|bici|lago|motor|vuelas|espalda|wright|boeing|luna/i);
const I1 = T('intento'), I2 = T('intento', 2), I3 = T('intento', 3), I4 = T('intento', 4);
const OJO = T('pero'), Y875 = T('en'), MIL = T('1000'), SEG = T('12'), MET = T('36'), MENOS = T('menos'), SOLO = T('y', 4), END = T('qué');
const FALL = T('piedra'), LAGO = T('lago'), ESP = T('espalda'), VUELA = T('vuelas');

const IMG = (n: string) => `ia3d/avion/${n}.jpg`;

/** grano de pelicula antigua */
const Grain: React.FC<{t: number; k?: number}> = ({t, k = 1}) => {
  const f = Math.floor(t * 24);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: k}}>
      <svg width={1080} height={1920}>
        {Array.from({length: 5}).map((_, i) => <line key={i} x1={rnd(f * 7 + i) * 1080} y1={0} x2={rnd(f * 7 + i) * 1080 + 6} y2={1920} stroke="#2b1d0e" strokeWidth={2} opacity={0.35 * rnd(f + i * 3)} />)}
        {Array.from({length: 40}).map((_, i) => <circle key={'d' + i} cx={rnd(f * 13 + i) * 1080} cy={rnd(f * 17 + i) * 1920} r={1 + rnd(f + i) * 3} fill="#1a1006" opacity={0.4} />)}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(30,18,6,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/** 1903: biplano sobre las dunas (dibujado, sepia) */
const Kitty: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const s = t - t0;
  const fly = easeOut(ramp(t, t0 + 1.2, t0 + 7));
  const px = 300 + fly * 380, py = 1120 - Math.min(1, fly * 2) * 220 + Math.sin(s * 5) * 6;
  const z = 1.05 + s * 0.012;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#e9d7b0, #cdb184 70%)', transform: `scale(${z})`}}>
      <svg width={1080} height={1920}>
        {[0, 1, 2].map((i) => <ellipse key={i} cx={200 + i * 380 - s * 8} cy={520 + i * 60} rx={220} ry={60} fill="#f3e6c8" opacity={0.6} />)}
        <path d="M0 1350 Q 270 1250 540 1330 T 1080 1300 L1080 1920 L0 1920Z" fill="#b8945f" />
        <path d="M0 1500 Q 300 1420 620 1490 T 1080 1470 L1080 1920 L0 1920Z" fill="#a07c48" />
        <line x1={60} y1={1345} x2={1000} y2={1325} stroke="#5a3e1b" strokeWidth={6} />
        {/* biplano */}
        <g transform={`translate(${px},${py}) scale(1.7) rotate(${-3 + Math.sin(s * 3) * 2})`}>
          <rect x={-170} y={-60} width={340} height={14} rx={6} fill="#3d2a12" />
          <rect x={-170} y={0} width={340} height={14} rx={6} fill="#3d2a12" />
          {[-150, -75, 0, 75, 150].map((x) => <line key={x} x1={x} y1={-48} x2={x} y2={2} stroke="#3d2a12" strokeWidth={4} />)}
          <rect x={-230} y={-34} width={70} height={10} fill="#3d2a12" />
          <rect x={170} y={-40} width={40} height={40} fill="#3d2a12" />
          <ellipse cx={-120} cy={-22} rx={8} ry={30 * Math.abs(Math.sin(s * 40))} fill="#3d2a12" />
          <ellipse cx={120} cy={-22} rx={8} ry={30 * Math.abs(Math.cos(s * 40))} fill="#3d2a12" />
          <circle cx={-10} cy={-6} r={14} fill="#2b1d0e" />
        </g>
        {/* hermano corriendo al lado */}
        {fly < 0.95 && <g transform={`translate(${px - 90 + Math.sin(s * 9) * 4},1310) scale(1.6)`}>
          <circle cx={0} cy={-90} r={16} fill="#2b1d0e" />
          <line x1={0} y1={-74} x2={0} y2={-30} stroke="#2b1d0e" strokeWidth={10} />
          <line x1={0} y1={-30} x2={-14 * Math.sin(s * 12)} y2={0} stroke="#2b1d0e" strokeWidth={9} />
          <line x1={0} y1={-30} x2={14 * Math.sin(s * 12)} y2={0} stroke="#2b1d0e" strokeWidth={9} />
          <line x1={0} y1={-64} x2={22} y2={-50 + 10 * Math.sin(s * 12)} stroke="#2b1d0e" strokeWidth={8} />
        </g>}
      </svg>
      <Grain t={t} />
    </AbsoluteFill>
  );
};

/** comparativa: vuelo de 1903 vs alas de un 747 */
const Compare: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const k1 = easeOut(ramp(t, t0 - 1.1, t0 - 0.3)), k2 = easeOut(ramp(t, t0 + 0.2, t0 + 1.4));
  const PX = 11;
  const bar = (y: number, m: number, k: number, label: string, val: string, c: string) => (
    <g>
      <text x={120} y={y - 30} fill="#fff" fontFamily="Montserrat" fontWeight={800} fontSize={58}>{label}</text>
      <rect x={120} y={y} width={m * PX * k} height={90} rx={18} fill={c} />
      <text x={140 + m * PX * k} y={y + 64} fill="#fff" fontFamily="Montserrat" fontWeight={900} fontSize={64} opacity={k}>{val}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1f3c63, #08121f 75%)'}}>
      <svg width={1080} height={1920}>
        {bar(820, 36.5, k1, 'VUELO DE 1903', '36 m', '#FFD166')}
        {bar(1100, 64.4, k2, 'ALAS DE UN BOEING 747', '64 m', '#4CC9F0')}
        {k2 > 0.3 && <g opacity={k2} transform={`translate(${120 + 64.4 * PX / 2},1290)`}>
          <path d="M-400 0 L0 -26 L400 0 L0 20Z" fill="#4CC9F0" opacity={0.35} />
          <rect x={-30} y={-110} width={60} height={220} rx={30} fill="#cfe8ff" opacity={0.5} />
        </g>}
      </svg>
    </AbsoluteFill>
  );
};

const MoonScene: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const s = t - t0;
  return (
    <AbsoluteFill style={{background: '#02030a', overflow: 'hidden'}}>
      <Stars t={t} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}><Earth x={760} y={620 - s * 10} r={150} t={t} /></svg>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${120 - easeOut(ramp(t, t0, t0 + 3)) * 120}px)`}}>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <Moon x={540} y={2300} r={1000} glow={0.4} />
        </svg>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          {Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={300 + i * 90} cy={1520 - i * 22} rx={20} ry={9} fill="#6b6b6b" opacity={ramp(t, t0 + 1.5 + i * 0.25, t0 + 1.7 + i * 0.25)} />)}
          <line x1={880} y1={1400} x2={880} y2={1150} stroke="#ddd" strokeWidth={8} opacity={ramp(t, t0 + 2.6, t0 + 3)} />
          <rect x={880} y={1150} width={130} height={80} fill="#fff" opacity={ramp(t, t0 + 2.6, t0 + 3)} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => {
  if (t < at) return null;
  const b = Math.sin((t - at) * 8) * 18;
  return <div style={{position: 'absolute', right: 80, top: 1500 + b, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
};

export const AvionIAShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let shot: React.ReactNode;
  if (t < I1) shot = <Shot src={IMG('carton')} t={t} t0={0} z0={1.5} z1={1.12} y0={-140} dur={1.6} shake={Math.max(0, 24 - t * 15)} />;
  else if (t < I2) shot = <Shot src={IMG('plumas')} t={t} t0={I1} z0={1.05} z1={1.25} y0={60} y1={t > FALL ? 260 : -40} dur={t > FALL ? 6.5 : 5} bump={t > T('aleteas') && t < FALL ? 30 : 0} shake={t > FALL - 0.1 && t < FALL + 0.5 ? 20 : 0} />;
  else if (t < I3) shot = <Shot src={IMG('carton')} t={t} t0={I2} z0={1.3} z1={1.08} x0={50} dur={3.5} shake={t > T('todavía') && t < T('todavía') + 0.6 ? 18 : 0} />;
  else if (t < I4) shot = <Shot src={IMG('bici')} t={t} t0={I3} z0={1.05} z1={1.3} y1={-60} dur={4.5} shake={t > LAGO - 0.2 && t < LAGO + 0.6 ? 22 : 2} />;
  else if (t < OJO) shot = <Shot src={IMG('vuela')} t={t} t0={I4} z0={1.1} z1={1.32} x0={-30} x1={40} dur={4.5} shake={t > VUELA ? 5 : 0} bump={t > VUELA ? 12 : 0} />;
  else if (t < Y875) shot = <div style={{position: 'absolute', inset: 0, filter: `saturate(${1 - ramp(t, OJO, OJO + 2.5) * 0.9})`}}><Shot src={IMG('vuela')} t={t} t0={OJO} z0={1.32} z1={1.0} dur={3} /></div>;
  else if (t < MIL) shot = <AbsoluteFill style={{filter: 'sepia(0.9) contrast(1.1) brightness(0.92)'}}><Shot src={IMG('plumas')} t={t} t0={Y875} z0={1.15} z1={1.35} y1={t > ESP ? 200 : -40} dur={t > ESP ? 7.5 : 6} shake={t > ESP - 0.2 && t < ESP + 0.6 ? 22 : 0} /><Grain t={t} /></AbsoluteFill>;
  else if (t < MENOS) shot = <Kitty t={t} t0={MIL} />;
  else if (t < SOLO) shot = <Compare t={t} t0={T('boeing')} />;
  else if (t < END) shot = <MoonScene t={t} t0={SOLO} />;
  else shot = <Shot src={IMG('vuela')} t={t} t0={END} z0={1.3} z1={1.12} y0={-60} dur={2} />;

  const meters = Math.round(36 * easeOut(ramp(t, MET - 0.3, MET + 0.8)));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Audio src={staticFile('avion/mezcla.wav')} />
      {shot}
      {t > VUELA - 0.3 && t < OJO && <SpeedLines t={t} k={ramp(t, VUELA - 0.3, VUELA + 0.2)} />}
      <Dust t={t} at={0.0} />
      <Dust t={t} at={FALL} />
      <Impact t={t} at={0.05} text="¡CRASH!" />
      <Impact t={t} at={FALL} text="¡PLOF!" />
      <Impact t={t} at={T('todavía')} text="¡CRACK!" />
      <Impact t={t} at={LAGO - 0.1} text="¡SPLASH!" />
      <Impact t={t} at={ESP} text="¡CRAC!" />
      {[I1, I2, I3, I4, OJO, Y875, MIL, MENOS, SOLO, END].map((a, i) => <Flash key={i} t={t} at={a} dur={0.12} max={0.55} />)}
      <VBig t={t} at={0.03} until={I1 - 0.05} a="ASÍ INVENTAS" b="EL AVIÓN" size={130} color2="#FFD166" />
      <VBig t={t} at={I1} until={I2 - 0.05} a="INTENTO 1" b="PLUMAS" size={140} color2="#E9ECEF" />
      <VBig t={t} at={I2} until={I3 - 0.05} a="INTENTO 2" b="CARTÓN" size={140} color2="#E0B070" />
      <VBig t={t} at={I3} until={I4 - 0.05} a="INTENTO 3" b="BICI CON ALAS" size={130} color2="#4CC9F0" />
      <VBig t={t} at={I4} until={OJO - 0.05} a="INTENTO 4" b={t > VUELA ? '¡VUELA!' : 'MOTOR'} size={140} color2="#7BF59A" />
      <VBig t={t} at={OJO} until={Y875 - 0.05} a="ESTO PASÓ" b="DE VERDAD" size={140} color2="#FF6B6B" />
      <VBig t={t} at={Y875} until={MIL - 0.05} a="AÑO 875" b={t > ESP ? 'ESPALDA ROTA' : 'ABBÁS IBN FIRNÁS'} size={115} color2="#FFB86B" />
      <VBig t={t} at={MIL} until={SEG - 0.05} a="1903" b="HERMANOS WRIGHT" size={115} color2="#FFD166" />
      <VBig t={t} at={SEG} until={MET - 0.05} a="SOLO" b="12 SEGUNDOS" size={140} color2="#FFD166" />
      <VBig t={t} at={MET} until={MENOS - 0.05} a="DISTANCIA" b={`${meters} METROS`} size={140} color2="#FFD166" />
      <VBig t={t} at={MENOS} until={SOLO - 0.05} a="MENOS QUE" b="LAS ALAS DE UN 747" size={105} color2="#4CC9F0" />
      <VBig t={t} at={SOLO} until={END - 0.05} a="66 AÑOS DESPUÉS" b="LA LUNA" size={120} color2="#E9ECEF" />
      <VBig t={t} at={END} a="¿QUÉ INVENTAMOS" b="AHORA?" size={120} color2="#FFD166" />
      <Arrow t={t} at={END + 0.6} />
      <Caps t={t} top={1360} />
    </AbsoluteFill>
  );
};

export const AvionIAThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <Shot src={IMG('plumas')} t={0} t0={0} z0={1.08} z1={1.08} />
      <VBig t={1} at={0} a="ASÍ INVENTAS" b="EL AVIÓN" size={140} y={140} color2="#FFD166" />
    </AbsoluteFill>
  );
};
