import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Hospital} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset, Car, Cal, MapL, PlayCount} from '../gta19/Main';
import {PINK, CYAN, YEL, F, DARK, shake, NewsTV, Phone, Gator, Store, Spout, Vinyl, Road, Radio, Plate, ClubSign, VidGrid, Hotel, Gavel, Stamp} from '../gtakit';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 52;
const Caps = makeCaps(words as any, /\d|gta|filtr|hotel|hospital|hackear|kurtaj|rockstar|fianza/i);
const SEP = T('en'), N90 = T('más'), FUE = T('fue'), CUL = T('el'), LOCO = T('y'), CAST = T('su'), JUEZ = T('un', 7), ROCK = T('rockstar', 2), HOY = T('y', 3), END = T('crees');

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.4, 1.2, 0.7, 960, 450), ...shake(t, 7 - lt * 9)}} bg={<Hotel t={t} />} hero={<Stamp k={easeOut(ramp(lt, 0.1, 0.4))} txt="FILTRADO" y={450} />} /></V>],
  [0.7, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.3, 1.1, 0.8)} bg={DARK} hero={<VidGrid k={1} t={t} />} /></V>],
  [1.5, (lt, t) => <V fx={1000}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.3, 4, 1000, 480)} bg={<Hotel t={t} />} hero={<Hero x={900} y={GY + 20} s={1.3} t={t} pose={POSES.phone} eyes="side" look={1} glow />} /></V>],
  [SEP, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 2)} bg={DARK} hero={<Cal x={960} y={540} top="SEPTIEMBRE" big="2022" k={0.85} />} /></V>],
  [N90, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 4)} bg={DARK} hero={<VidGrid k={easeOut(ramp(lt, 0, 2.5))} t={t} />} /></V>],
  [FUE, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.0, 3), ...shake(t, 3)}} bg={<rect width={1920} height={1080} fill={Math.sin(t * 8) > 0 ? '#3a0010' : '#140826'} />} hero={<NewsTV t={t} head="MAYOR FILTRACIÓN DE ROCKSTAR" sub="ÚLTIMA HORA" />} /></V>],
  [CUL, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 5, 960, 420)} bg={DARK} hero={<g style={{filter: t < T('arion') ? 'brightness(0)' : undefined}}><Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.idle} eyes="side" /></g>} /></V>],
  [LOCO, (lt, t) => <V fx={1150}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.3, 9, 1200, 460)} bg={<Hotel t={t} />} hero={<><Hero x={1080} y={GY + 20} s={1.2} t={t} pose={POSES.phone} eyes="side" look={1} />{t > T('amazon') && <g transform="translate(1300 640)"><rect x={-90} y={-40} width={180} height={50} rx={10} fill="#fff" stroke="#111" strokeWidth={4} /><text y={-6} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={24} fill="#111">FIRE STICK</text></g>}</>} /></V>],
  [CAST, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 1.4)} bg={DARK} hero={<Gavel t={t} hit={easeOut(ramp(lt, 0.4, 0.7))} />} /></V>],
  [JUEZ, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 6)} bg={<Hospital />} hero={<Hero x={960} y={GY + 20} s={1.3} t={t} pose={POSES.idle} eyes="closed" />} /></V>],
  [ROCK, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 3.5)} bg={<Sunset t={t} scroll={t * 80} night />} hero={<Car x={960} t={t} />} /></V>],
  [HOY, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.25, 3.5)} bg={<Sunset t={t} scroll={t * 60} />} hero={<Cal x={960} y={540} top="NOVIEMBRE" big="19" state="ok" k={1 + 0.08 * Math.sin(t * 10)} />} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 20} night />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.shrug} eyes="side" look={0.6} />} /></V>],
];

export const GtaLeakShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtaleak/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={SEP - 0.05} a="17 AÑOS" b="FILTRÓ GTA 6" size={140} color2="#FF4D6D" />
      <VBig t={t} at={SEP} until={N90 - 0.05} a="SEPTIEMBRE" b="2022" size={140} color2="#FFD23F" />
      <VBig t={t} at={N90} until={FUE - 0.05} a="+90 VÍDEOS" b="FILTRADOS" size={140} color2="#FF4D6D" />
      <VBig t={t} at={FUE} until={CUL - 0.05} a="LA MAYOR" b="FILTRACIÓN" size={140} color2="#FF4D6D" />
      <VBig t={t} at={CUL} until={LOCO - 0.05} a="EL CULPABLE" b={t > T('arion') ? '17 AÑOS' : '¿?'} size={140} color2="#FFD23F" />
      <VBig t={t} at={LOCO} until={CAST - 0.05} a="DESDE UN" b="HOTEL" size={150} color2="#3DF5FF" />
      <VBig t={t} at={CAST} until={ROCK - 0.05} a="SU CASTIGO" b={t > JUEZ ? 'HOSPITAL SEGURO' : undefined} size={120} color2="#FF4D6D" />
      <VBig t={t} at={ROCK} until={HOY - 0.05} a="ROCKSTAR" b="SIGUIÓ" size={150} color="#FF4FA3" />
      <VBig t={t} at={HOY} until={END - 0.05} a="Y HOY" b="POR FIN SALE" size={140} color2="#3DF5FF" />
      <VBig t={t} at={END} a="¿LE HIZO" b="DAÑO?" size={150} color2="#FF4D6D" />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaLeakThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="red" cam={kbV(0, 1.3, 1.3, 1, 960, 450)} bg={<Hotel t={1} />} hero={<Stamp k={1} txt="FILTRADO" y={450} />} /></V>
      <VBig t={1} at={0} a="17 AÑOS" b="FILTRÓ GTA 6" size={150} y={150} color2="#FF4D6D" />
    </AbsoluteFill>
  );
};
