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
export const DURATION_S = 51;
const Caps = makeCaps(words as any, /\d|gta|tom|petty|cheetah|ch33tah|pole|vice|filtró|san|andreas/i);
const UNO = T('uno'), AMOR = T('el', 2), YTOM = T('y'), DOS = T('dos'), MAT = T('matrícula'), TRES = T('tres'), CUA = T('cuatro'), CIN = T('cinco'), END = T('qué');

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.5, 1.2, 0.7), ...shake(t, 7 - lt * 9)}} bg={<Sunset t={t} scroll={t * 900} night />} hero={<Car x={960} t={t} color={YEL} />} /></V>],
  [0.7, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.3, 1.1, 0.7)} bg={DARK} hero={<Plate txt="CH33TAH" k={1} />} /></V>],
  [1.4, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.2, 1.4, 1.2)} bg={<Sunset t={t} scroll={t * 60} night />} hero={<ClubSign t={t} a="POLE" b="POSITION" />} /></V>],
  [2.4, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.3, 1.6, 960, 420)} bg={<Sunset t={t} scroll={t * 30} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" />} /></V>],
  [UNO, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 7)} bg={DARK} hero={<Vinyl t={t} label={t > T('tom') ? 'TOM PETTY · 1989' : 'LA CANCIÓN'} />} /></V>],
  [AMOR, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4.6)} bg={<Road t={t} />} hero={<Car x={960} t={t} />} /></V>],
  [YTOM, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 3.6)} bg={DARK} hero={<Radio t={t} st="K-DST" />} /></V>],
  [DOS, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.0, 1.3, 4), ...shake(t, 2)}} bg={<Sunset t={t} scroll={t * 600} night />} hero={<Car x={960} t={t} color={YEL} />} /></V>],
  [MAT, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 2.6)} bg={DARK} hero={<Plate txt="CH33TAH" k={easeOut(ramp(lt, 0, 0.5))} />} /></V>],
  [TRES, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.25, 6)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<ClubSign t={t} a="POLE" b="POSITION" />} /></V>],
  [CUA, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 5)} bg={DARK} hero={<Phone t={t} user="@ViceCityLive" lines={['En directo desde', 'Vice City 🔴']} live chat />} /></V>],
  [CIN, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.2, 6), ...shake(t, t > T('filtró') && t < T('filtró') + 0.4 ? 7 : 0)}} bg={DARK} hero={<><PlayCount t={t} k={1} /><Stamp k={easeOut(ramp(t, T('filtró') - 0.1, T('filtró') + 0.2))} txt="FILTRADO" y={380} /></>} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.point} eyes="happy" mouth="grin" flip /></>} /></V>],
];

export const GtaEggsShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtaeggs/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={UNO - 0.05} a="GTA 6" b="5 DETALLES OCULTOS" size={120} color="#FF4FA3" color2="#3DF5FF" />
      <VBig t={t} at={UNO} until={AMOR - 0.05} a="1" b="LA CANCIÓN" size={150} color="#FFD23F" />
      <VBig t={t} at={AMOR} until={YTOM - 0.05} a="«UN CAMINO" b="LARGO»" size={140} color2="#FF4FA3" />
      <VBig t={t} at={YTOM} until={DOS - 0.05} a="YA SONÓ EN" b="SAN ANDREAS" size={130} color2="#3DF5FF" />
      <VBig t={t} at={DOS} until={TRES - 0.05} a="2" b="EL CHEETAH" size={150} color="#FFD23F" />
      <VBig t={t} at={TRES} until={CUA - 0.05} a="3" b="CLUB DE 2002" size={140} color="#FFD23F" color2="#FF4FA3" />
      <VBig t={t} at={CUA} until={CIN - 0.05} a="4" b="REDES EN DIRECTO" size={125} color="#FFD23F" />
      <VBig t={t} at={CIN} until={END - 0.05} a="5" b="SE FILTRÓ" size={150} color="#FFD23F" color2="#FF4D6D" />
      <VBig t={t} at={END} a="¿QUÉ DETALLE" b="VISTE TÚ?" size={130} color2="#3DF5FF" />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaEggsThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="future" cam={kbV(0, 1.2, 1.2, 1)} bg={<Sunset t={1} scroll={200} night />} hero={<Plate txt="CH33TAH" k={1} />} /></V>
      <VBig t={1} at={0} a="GTA 6" b="¿LO VISTE?" size={170} y={150} color="#FF4FA3" color2="#FFD23F" />
    </AbsoluteFill>
  );
};
