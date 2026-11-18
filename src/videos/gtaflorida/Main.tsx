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
export const DURATION_S = 50.5;
const Caps = makeCaps(words as any, /\d|gta|caimán|florida|leonida|verdad|vice|miami|wawa|tromba|traje/i);
const UNO = T('uno'), EN = T('en', 3), ROCK = T('rockstar'), DOS = T('dos'), PAR = T('parece'), TRES = T('tres'), ES = T('es', 1), POR = T('porque'), CUA = T('cuatro'), EXI = T('exige'), END = T('cuál');

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="day" cam={{...kbV(lt, 1.5, 1.2, 0.7), ...shake(t, 8 - lt * 10)}} bg={<Store />} hero={<Gator x={1200 - lt * 300} y={GY - 60} t={t} s={1.5} flip />} /></V>],
  [0.7, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.3, 1.1, 0.7)} bg={DARK} hero={<NewsTV t={t} head="UN HOMBRE DE LEONIDA..." />} /></V>],
  [1.4, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.2, 1.5, 1.6), ...shake(t, 3)}} bg={<Sunset t={t} scroll={t * 700} night />} hero={<Car x={960} t={t} />} /></V>],
  [T('pasó'), (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.3, 2)} bg={<Sunset t={t} scroll={t * 40} />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} eyes="wide" mouth="o" />} /></V>],
  [UNO, (lt, t) => <V><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 3)} bg={<Store />} hero={<Gator x={1450 - easeOut(ramp(lt, 0, 2.4)) * 450} y={GY - 60} t={t} s={1.5} flip />} /></V>],
  [EN, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4.5)} bg={DARK} hero={<NewsTV t={t} head="METE UN CAIMÁN EN UNA TIENDA" sub="FLORIDA · REAL" k={easeOut(ramp(lt, 0, 0.4))} />} /></V>],
  [ROCK, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.25, 2.3)} bg={<Store neon />} hero={<Gator x={1400 - easeOut(ramp(lt, 0, 2)) * 400} y={GY - 60} t={t} s={1.5} flip />} /></V>],
  [DOS, (lt, t) => <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.2, 3), ...shake(t, lt < 0.4 ? 6 : 0)}} bg={<Sunset t={t} scroll={0} />} hero={<g transform={`translate(0 -160) rotate(${180 * easeOut(ramp(lt, 0, 0.5))} 960 ${GY - 160})`}><Car x={960} t={0} color={CYAN} /></g>} /></V>],
  [PAR, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Store />} hero={<><Hero x={1300 - lt * 220} y={GY + 20} s={1.2} t={t * 3} pose={POSES.fly} eyes="wide" flip /><g transform="translate(960 400)"><rect x={-200} y={-50} width={400} height={100} rx={20} fill={YEL} stroke="#111" strokeWidth={6} /><text y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#111">¡SIN PAGAR!</text></g></>} /></V>],
  [TRES, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 5)} bg={DARK} hero={<Phone t={t} user="@PlanetLeonidaMan" lines={['Policía persigue a', 'un tío sin camiseta']} />} /></V>],
  [ES, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 5)} bg={DARK} hero={<NewsTV t={t} head={['FLORIDA MAN ROBA UN AVIÓN', 'FLORIDA MAN Y SU CAIMÁN', 'FLORIDA MAN ATACA CON PIZZA'][Math.floor(lt / 1.7) % 3]} sub="FLORIDA MAN" />} /></V>],
  [POR, (lt, t) => <V fx={1000}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.35, 3.5, 1050, 700)} bg={<rect width={1920} height={1080} fill="#0B4F6C" />} hero={<MapL t={t} k={ramp(t, T('vice') - 0.3, T('vice'))} />} /></V>],
  [CUA, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 5.5)} bg={<Spout t={t} />} hero={<g transform={`translate(${960 + Math.sin(t * 5) * 90} ${560 - easeOut(ramp(t, T('absorbido'), T('absorbido') + 1.5)) * 260}) rotate(${t * 300}) translate(-960 -${GY})`}><Hero x={960} y={GY} s={0.8} t={t} pose={POSES.scared} eyes="wide" mouth="o" /></g>} /></V>],
  [EXI, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.3, 3)} bg={<Sunset t={t} scroll={t * 30} />} hero={<><Hero x={960} y={GY + 60} s={1.2} t={t} pose={POSES.fists} eyes="angry" mouth="open" /><g transform="translate(960 360)"><rect x={-260} y={-55} width={520} height={110} rx={30} fill="#fff" stroke="#111" strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill="#111">¡QUIERO UN TRAJE!</text></g></>} /></V>],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={DARK} hero={<NewsTV t={t} head="¿Y LA TUYA?" sub="TU NOTICIA" />} /></V>],
];

export const GtaFloridaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtaflorida/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={T('pasó') - 0.05} a="GTA 6" b="ESTO FUE REAL" size={140} color="#FF4FA3" color2="#FFD23F" />
      <VBig t={t} at={T('pasó')} until={UNO - 0.05} a="PASÓ" b="DE VERDAD" size={150} color2="#3DF5FF" />
      <VBig t={t} at={UNO} until={EN - 0.05} a="1" b="EL CAIMÁN" size={150} color="#FFD23F" />
      <VBig t={t} at={EN} until={ROCK - 0.05} a="FLORIDA" b="CASO REAL" size={150} color2="#FF4FA3" />
      <VBig t={t} at={ROCK} until={DOS - 0.05} a="EN GTA 6" b="CASI IGUAL" size={140} color2="#3DF5FF" />
      <VBig t={t} at={DOS} until={TRES - 0.05} a="2" b="EL COCHE VOLCADO" size={120} color="#FFD23F" />
      <VBig t={t} at={TRES} until={POR - 0.05} a="3" b="FLORIDA MAN" size={150} color="#FFD23F" color2="#FF4FA3" />
      <VBig t={t} at={POR} until={CUA - 0.05} a="LEONIDA = FLORIDA" b="VICE CITY = MIAMI" size={95} color2="#3DF5FF" />
      <VBig t={t} at={CUA} until={END - 0.05} a="4" b="LA TROMBA MARINA" size={120} color="#FFD23F" />
      <VBig t={t} at={END} a="¿LA NOTICIA" b="MÁS LOCA?" size={140} color2="#FF4FA3" />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaFloridaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="day" cam={kbV(0, 1.3, 1.3, 1)} bg={<Store />} hero={<Gator x={1000} t={1} s={1.1} flip />} /></V>
      <VBig t={1} at={0} a="GTA 6" b="ESTO FUE REAL" size={150} y={150} color="#FF4FA3" color2="#FFD23F" />
    </AbsoluteFill>
  );
};
