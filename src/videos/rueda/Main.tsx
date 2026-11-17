import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Flash} from '../futuro/kit';
import {VBig, makeCaps, ramp, easeOut} from '../futuro/vkit';
import {Guy, Stage, Tree, House} from '../td/kit3d';
import words from './words.json';

export const DURATION_S = 35;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|rueda|cuadrada|triangular|pinchos|redonda|barro|años/i);
const I1 = T('intento'), I2 = T('intento', 2), I3 = T('intento', 3), I4 = T('intento', 4), CUR = T('y'), ANT = T('y', 2), END = T('qué');

type Shape = 'square' | 'tri' | 'spike' | 'round';
const N: Record<Shape, number> = {square: 4, tri: 3, spike: 8, round: 64};
const R = 0.55;
/** altura del eje de una rueda poligonal que rueda una distancia d */
const axle = (shape: Shape, d: number) => {
  const n = N[shape];
  if (shape === 'round' || shape === 'spike') return R;
  const rc = R / Math.cos(Math.PI / n);
  const th = d / R, seg = (2 * Math.PI) / n;
  const a = (((th % seg) + seg) % seg) - seg / 2;
  return rc * Math.cos(a);
};
const Wheel: React.FC<{shape: Shape; angle: number}> = ({shape, angle}) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    <group rotation={[0, -angle, 0]}>
      {shape === 'square' && <mesh castShadow rotation={[0, Math.PI / 4, 0]}><boxGeometry args={[R * 1.414, 0.22, R * 1.414]} /><meshStandardMaterial color="#8d99ae" /></mesh>}
      {shape === 'tri' && <mesh castShadow><cylinderGeometry args={[R / Math.cos(Math.PI / 3), R / Math.cos(Math.PI / 3), 0.22, 3]} /><meshStandardMaterial color="#e76f51" /></mesh>}
      {shape === 'spike' && <><mesh castShadow><cylinderGeometry args={[R * 0.7, R * 0.7, 0.22, 16]} /><meshStandardMaterial color="#6c757d" /></mesh>{Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * R * 0.85, 0, Math.sin(a) * R * 0.85]} rotation={[0, -a, -Math.PI / 2]} castShadow><coneGeometry args={[0.1, 0.45, 8]} /><meshStandardMaterial color="#adb5bd" metalness={0.6} roughness={0.3} /></mesh>; })}</>}
      {shape === 'round' && <><mesh castShadow><cylinderGeometry args={[R, R, 0.22, 48]} /><meshStandardMaterial color="#8b5a2b" /></mesh>{[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.12, 0]} rotation={[0, (i * Math.PI) / 3, 0]}><boxGeometry args={[R * 1.9, 0.03, 0.08]} /><meshStandardMaterial color="#5e3a1a" /></mesh>)}</>}
    </group>
  </group>
);
const Cart: React.FC<{x: number; shape: Shape; d: number; tilt?: number; sink?: number}> = ({x, shape, d, tilt = 0, sink = 0}) => {
  const h = axle(shape, d) - sink;
  const ang = d / R;
  return (
    <group position={[x, 0, 0]} rotation={[0, 0, tilt]}>
      {[-0.85, 0.85].map((wx) => [-0.7, 0.7].map((wz) => <group key={`${wx}${wz}`} position={[wx, h, wz]}><Wheel shape={shape} angle={ang} /></group>))}
      <mesh position={[0, h + 0.35, 0]} castShadow><boxGeometry args={[2.3, 0.3, 1.3]} /><meshStandardMaterial color="#c9a227" /></mesh>
      {[0.6, -0.4].map((bx, i) => <mesh key={i} position={[bx, h + 0.75, 0.1 * i]} castShadow><boxGeometry args={[0.6, 0.5, 0.6]} /><meshStandardMaterial color={i ? '#e9c46a' : '#f4a261'} /></mesh>)}
    </group>
  );
};
const Scenery: React.FC<{from: number}> = ({from}) => (
  <>
    {Array.from({length: 14}).map((_, i) => <Tree key={i} p={[from + i * 4.2, 0, -5 - (i % 3) * 1.5]} s={0.9 + (i % 2) * 0.3} />)}
    {Array.from({length: 6}).map((_, i) => <House key={i} p={[from + 3 + i * 9, 0, -9]} color={['#ffd166', '#a8dadc', '#f4a261'][i % 3]} />)}
    <mesh position={[from + 30, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[120, 2.6]} /><meshStandardMaterial color="#c2a878" /></mesh>
  </>
);

/** plano generico: carrito empujado */
const PushShot: React.FC<{t: number; t0: number; shape: Shape; speed: number; fall?: number; sink?: number; zoom?: number}> = ({t, t0, shape, speed, fall = 1e9, sink = 0, zoom = 0}) => {
  const lt = t - t0;
  const d = Math.min(lt, fall - t0) * speed + Math.max(0, lt - (fall - t0)) * 0;
  const fallen = t > fall;
  const h = axle(shape, d);
  const tilt = shape === 'tri' ? -(h - R) * 0.6 : shape === 'square' ? -(h - R) * 0.4 : 0;
  const bump = (h - R) * 1.4;
  return (
    <Stage cam={[d + 0.6, 2.6 + bump * 0.3, 12 - zoom * 3]} look={[d + 0.6, 3.4, 0]} fov={42}>
      <Scenery from={-10} />
      <Cart x={d + 1.6} shape={shape} d={d} tilt={tilt} sink={sink} />
      <Guy position={[d - 0.4, fallen ? 0.05 : Math.max(0, bump * 0.6), fallen ? 0.9 : 0]} rotY={Math.PI / 2} pose={{reach: fallen ? 0.2 : 1.45, walk: fallen ? 0 : Math.sin(t * 9) * 0.5, lean: fallen ? 1.4 : 0.25}} eyes={fallen ? 'x' : shape === 'square' && bump > 0.08 ? 'wide' : 'normal'} mouth={fallen ? 'o' : 'flat'} squash={fallen ? 0.3 : 0} />
    </Stage>
  );
};
const RoundShot: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const lt = t - t0, go = T('funciona') - t0;
  const d = lt < go ? lt * 1.2 : go * 1.2 + (lt - go) ** 2 * 5;
  const guyX = lt < go ? d - 0.4 : go * 1.2 - 0.4 + (lt - go) * 3.2;
  const crashAt = T('bien') - t0 + 0.1, crashed = lt > crashAt, cx = go * 1.2 + (crashAt - go) ** 2 * 5;
  const houseX = cx + 2.9;
  return (
    <Stage cam={[crashed ? houseX - 2 : (d + guyX) / 2 + 0.6, 2.6, crashed ? 14 : 12 + Math.max(0, lt - go) * 1.2]} look={[crashed ? houseX - 2 : (d + guyX) / 2 + 0.6, 3.4, 0]} fov={42}>
      <Scenery from={-10} />
      <House p={[houseX, 0, 0]} color="#a8dadc" s={1.3} />
      {!crashed && <Cart x={d + 1.6} shape="round" d={d} />}
      {crashed && Array.from({length: 14}).map((_, i) => { const s = lt - crashAt; const vx = -1 - (i % 4) * 0.9, vy = 3 + (i % 5) * 1.2, vz = ((i % 7) - 3) * 0.6; const y = Math.max(0.2, 1 + vy * s - 4.9 * s * s); return <mesh key={i} position={[houseX - 1.4 + vx * s, y, vz * s]} rotation={[s * 5 + i, s * 3, i]} castShadow><boxGeometry args={[0.35, 0.35, 0.35]} /><meshStandardMaterial color={['#c9a227', '#f4a261', '#e9c46a', '#8b5a2b'][i % 4]} /></mesh>; })}
      <Guy position={[Math.min(guyX, houseX - 3.5), 0, 0.3]} rotY={Math.PI / 2} pose={{reach: lt < go ? 1.45 : 2.6, walk: Math.sin(t * (lt < go ? 9 : 16)) * (lt < go ? 0.5 : 0.9), lean: lt < go ? 0.25 : 0.35}} eyes={lt < go ? 'normal' : 'wide'} mouth={lt < go ? 'flat' : 'o'} />
    </Stage>
  );
};
const PotteryShot: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const lt = t - t0;
  return (
    <Stage cam={[0.6, 2.8, 7.5]} look={[-0.3, 1.4, 0]} fov={42} sky="#f1e3c1" ground="#d4b483">
      <mesh position={[0, 0.45, 0]} castShadow><cylinderGeometry args={[0.5, 0.6, 0.9, 24]} /><meshStandardMaterial color="#6b4226" /></mesh>
      <group position={[0, 0.95, 0]} rotation={[0, lt * 6, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.8, 0.8, 0.1, 48]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
        <mesh position={[0, 0.06, 0.6]}><boxGeometry args={[0.1, 0.02, 0.2]} /><meshStandardMaterial color="#5e3a1a" /></mesh>
        <mesh position={[0, 0.45, 0]} castShadow scale={[1, 0.6 + easeOut(ramp(lt, 0.5, 4)) * 0.8, 1]}><sphereGeometry args={[0.38, 32, 24]} /><meshStandardMaterial color="#c56b3c" roughness={0.9} /></mesh>
      </group>
      <Guy position={[-1.3, 0, 0.2]} rotY={1.2} pose={{reach: 1.2}} eyes="normal" mouth="smile" />
    </Stage>
  );
};
const MuseumShot: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const lt = t - t0;
  return (
    <Stage cam={[Math.sin(lt * 0.4) * 2.5, 2.2, 5.2]} look={[0, 1.6, 0]} fov={40} sky="#1b1b2f" ground="#2b2d42">
      <spotLight position={[0, 6, 2]} angle={0.5} penumbra={0.6} intensity={60} castShadow />
      <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1.2, 1, 1.2]} /><meshStandardMaterial color="#e9ecef" /></mesh>
      <group position={[0, 1.65, 0]} rotation={[0, lt * 0.5, 0]}>
        <group rotation={[0, 0, 0]}><mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.65, 0.65, 0.12, 40]} /><meshStandardMaterial color="#5e3a1a" roughness={0.95} /></mesh>{[0, 1].map((i) => <mesh key={i} position={[0, 0, 0.07]} rotation={[0, 0, (i * Math.PI) / 2]}><boxGeometry args={[1.25, 0.12, 0.03]} /><meshStandardMaterial color="#3d2510" /></mesh>)}</group>
      </group>
    </Stage>
  );
};
const HookShot: React.FC<{t: number}> = ({t}) => {
  const d = 4 + t * 7;
  return (
    <Stage cam={[d - 0.6, 2.4, 11]} look={[d - 0.6, 3.2, 0]} fov={42}>
      <Scenery from={-10} />
      <Cart x={d + 1.6} shape="round" d={d} />
      <Guy position={[d - 1.4 - t * 0.6, 0, 0.3]} rotY={Math.PI / 2} pose={{reach: 2.6, walk: Math.sin(t * 18) * 0.9, lean: 0.35}} eyes="wide" mouth="o" />
    </Stage>
  );
};
const EndShot: React.FC<{t: number; t0: number}> = ({t, t0}) => (
  <Stage cam={[0.3, 2.4, 9]} look={[0.3, 2.9, 0]} fov={42}>
    <Scenery from={-12} />
    <group position={[1.3, 0.55, 0.5]} rotation={[0, 0.4, 0]}><Wheel shape="round" angle={t * 2} /></group>
    <Guy position={[-0.4, 0, 0]} rotY={0.3} pose={{armL: 2.6, armR: 0.4}} eyes="normal" mouth="smile" />
  </Stage>
);

export const RuedaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let scene: React.ReactNode;
  if (t < I1) scene = <HookShot t={t} />;
  else if (t < I2) scene = <PushShot t={t} t0={I1} shape="square" speed={1.4} />;
  else if (t < I3) scene = <PushShot t={t} t0={I2} shape="tri" speed={1.3} fall={T('peor') - 0.2} />;
  else if (t < I4) scene = <PushShot t={t} t0={I3} shape="spike" speed={0.15} sink={0.18} zoom={1} />;
  else if (t < CUR) scene = <RoundShot t={t} t0={I4} />;
  else if (t < ANT) scene = <PotteryShot t={t} t0={CUR} />;
  else if (t < END) scene = <MuseumShot t={t} t0={ANT} />;
  else scene = <EndShot t={t} t0={END} />;
  return (
    <AbsoluteFill style={{background: '#9fd3ff', overflow: 'hidden'}}>
      <Audio src={staticFile('rueda/mezcla.wav')} />
      {scene}
      {[I1, I2, I3, I4, CUR, ANT, END, T('bien') + 0.1].map((a, i) => <Flash key={i} t={t} at={a} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={I1 - 0.05} a="ASÍ INVENTAS" b="LA RUEDA" size={130} color2="#FFD166" />
      <VBig t={t} at={I1} until={I2 - 0.05} a="INTENTO 1" b="CUADRADA" size={140} color2="#8D99AE" />
      <VBig t={t} at={I2} until={I3 - 0.05} a="INTENTO 2" b="TRIANGULAR" size={140} color2="#E76F51" />
      <VBig t={t} at={I3} until={I4 - 0.05} a="INTENTO 3" b="CON PINCHOS" size={140} color2="#ADB5BD" />
      <VBig t={t} at={I4} until={CUR - 0.05} a="INTENTO 4" b={t > T('funciona') ? 'DEMASIADO BIEN' : 'REDONDA'} size={140} color2="#7BF59A" />
      <VBig t={t} at={CUR} until={ANT - 0.05} a="LA 1ª RUEDA" b="ERA PARA BARRO" size={125} color2="#C56B3C" />
      <VBig t={t} at={ANT} until={END - 0.05} a="5.000 AÑOS" b="LA MÁS ANTIGUA" size={140} color2="#FFD166" />
      <VBig t={t} at={END} a="¿QUÉ INVENTAMOS" b="AHORA?" size={120} color2="#FFD166" />
      <Caps t={t} top={820} />
    </AbsoluteFill>
  );
};

export const RuedaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <Stage cam={[1.2, 2.4, 10]} look={[1.2, 3.0, 0]} fov={42}>
        <Scenery from={-10} />
        <Cart x={2.2} shape="square" d={0.3} tilt={-0.1} />
        <Guy position={[0.2, 0, 0.3]} rotY={Math.PI / 2 - 0.4} pose={{reach: 1.45, lean: 0.25}} eyes="wide" mouth="o" />
      </Stage>
      <VBig t={1} at={0} a="ASÍ INVENTAS" b="LA RUEDA" size={130} y={180} color2="#FFD166" />
    </AbsoluteFill>
  );
};
