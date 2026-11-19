import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Hospital} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset, Car, Cal, MapL, PlayCount} from '../gta19/Main';
import {PINK, CYAN, YEL, F, DARK, shake, NewsTV, Phone, Stamp, ArrowPanel, Pad, Money, Lock, Safe, Clues} from '../gtakit';
import {Trophy} from '../gtahoy/Main';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 67;
const Caps = makeCaps(words as any, /\d|gta|trucos|l1|r1|lb|rb|dólares|trofeos|retos|historia/i);
const ACT = T('para'), DESP = T('después'), U1 = T('truco'), U2 = T('truco', 2), U3 = T('truco', 3), OJO = T('pero'), DIN = T('el', 3), TROF = T('si') - 0.1, END = T('cuál');

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 8 - lt * 10)}} bg={<Sunset t={t} scroll={t * 1000} night />} hero={<Car x={960} t={t} color={YEL} />} fx={<Money t={t} n={20} />} /></V>],
  [0.6, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={DARK} hero={<Pad t={t} up l1 r1 />} /></V>],
  [1.2, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.3, 0.6), ...shake(t, 4)}} bg={DARK} hero={<Money t={t} n={60} />} /></V>],
  [T('pues'), (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 2.8, 960, 420)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.point} eyes="happy" mouth="grin" />} /></V>],
  [ACT, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 9)} bg={DARK} hero={<Pad t={t} up={t > T('arriba') - 0.2} l1={t > T('l1') - 0.1} r1={t > T('r1') - 0.1} labels={t > T('lb') - 0.1 ? ['LB', 'RB'] : ['L1', 'R1']} />} /></V>],
  [DESP, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 2.4)} bg={DARK} hero={<Phone t={t} user="TRUCOS" lines={['Introduce', 'la combinación…']} />} /></V>],
  [U1, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.2, 11), ...shake(t, 2)}} bg={<Sunset t={t} scroll={t * (t > T('abajo', 2) ? 1400 : 500)} night />} hero={<Car x={960} t={t} color={CYAN} />} /></V>],
  [U2, (lt, t) => <V><Cine t={t} mood={t > T('derecha', 4) ? 'cold' : 'dusk'} rain={t > T('derecha', 4)} cam={kbV(lt, 1.0, 1.2, 9)} bg={<Sunset t={t} scroll={t * 60} night={t > T('derecha', 4)} />} hero={<Hero x={960} y={GY + 20} s={1.3} t={t} pose={t > T('derecha', 4) ? POSES.scared : POSES.idle} eyes="wide" />} /></V>],
  [U3, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 11)} bg={<rect width={1920} height={1080} fill="#1B4332" />} hero={<><Money t={t} n={40} /><text x={960} y={330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={120} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">${Math.round(250 * easeOut(ramp(lt, 0.8, 2.5)))}.000</text></>} /></V>],
  [OJO, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.0, 1.2), ...shake(t, lt < 0.4 ? 6 : 0)}} bg={DARK} hero={<Lock k={easeOut(ramp(lt, 0, 0.4))} open={t > T('retos')} />} /></V>],
  [DIN, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Money t={t} n={14} /><Stamp k={easeOut(ramp(t, T('historia') - 0.2, T('historia') + 0.1))} txt="FIN HISTORIA" y={520} /></>} /></V>],
  [TROF, (lt, t) => <V><Cine t={t} mood="red" cam={kbV(lt, 1.0, 1.2, 4)} bg={DARK} hero={<><Trophy t={t} k={1} /><path d="M 760 300 L 1160 760 M 1160 300 L 760 760" stroke="#E63946" strokeWidth={30} strokeLinecap="round" opacity={ramp(t, T('trofeos') - 0.2, T('trofeos'))} /></>} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.cheer} eyes="happy" mouth="grin" flip /></>} /></V>],
];

export const GtaTrucosShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtatrucos/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={T('pues') - 0.05} a="TRUCOS" b="DE GTA 6" size={160} color="#FFD23F" color2="#FF4FA3" />
      <VBig t={t} at={T('pues')} until={ACT - 0.05} a="GUARDA" b="ESTE VÍDEO" size={150} color2="#3DF5FF" />
      <VBig t={t} at={ACT} until={DESP - 0.05} a="CÓMO" b="ACTIVARLOS" size={150} color2="#FF4FA3" />
      <VBig t={t} at={DESP} until={U1 - 0.05} a="METE LA" b="COMBINACIÓN" size={140} color2="#FFD23F" />
      <VBig t={t} at={U1} until={U2 - 0.05} a="TRUCO 1" b="COCHE POTENTE" size={130} color="#FFD23F" />
      <VBig t={t} at={U2} until={U3 - 0.05} a="TRUCO 2" b="CAMBIAR CLIMA" size={130} color="#FFD23F" color2="#3DF5FF" />
      <VBig t={t} at={U3} until={OJO - 0.05} a="TRUCO 3" b="$250.000" size={150} color="#FFD23F" color2="#7BF59A" />
      <VBig t={t} at={OJO} until={DIN - 0.05} a="OJO" b="HAY QUE DESBLOQUEARLOS" size={95} color="#FF4D6D" />
      <VBig t={t} at={DIN} until={TROF - 0.05} a="EL DEL DINERO" b="AL ACABAR LA HISTORIA" size={95} color2="#FFD23F" />
      <VBig t={t} at={TROF} until={END - 0.05} a="SIN TROFEOS" b="GUARDA APARTE" size={125} color="#FF4D6D" />
      <VBig t={t} at={END} a="¿CUÁL PRUEBAS" b="PRIMERO?" size={130} color2="#FF4FA3" />
      <ArrowPanel t={t} words={words as any} from={T('abajo')} to={U2 - 0.05} />
      <ArrowPanel t={t} words={words as any} from={T('abajo', 4)} to={U3 - 0.05} />
      <ArrowPanel t={t} words={words as any} from={T('arriba', 6)} to={OJO - 0.05} />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaTrucosThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="dusk" cam={kbV(0, 1.2, 1.2, 1)} bg={<rect width={1920} height={1080} fill="#1B4332" />} hero={<Money t={1} n={50} />} /></V>
      <VBig t={1} at={0} a="TRUCOS" b="DE GTA 6" size={180} y={150} color="#FFD23F" color2="#FF4FA3" />
    </AbsoluteFill>
  );
};
