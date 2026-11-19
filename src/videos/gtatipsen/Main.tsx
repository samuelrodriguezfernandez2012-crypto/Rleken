import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY, rnd} from '../futuro/kit';
import {Hero, NPC, POSES, Hospital} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {Sunset, Car, Cal, MapL, PlayCount} from '../gta19/Main';
import {PINK, CYAN, YEL, F, DARK, shake, NewsTV, Phone, Stamp, Pad, Money, Safe, Clues, Store} from '../gtakit';
import words from './words.json';

const T = makeT(words as any);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;
export const DURATION_S = 65;
const Caps = makeCaps(words as any, /\d|gta|focus|red|yellow|green|cops|cctv|banks|explode|random|switch|jason|lucia/i);
const ONE = T('one'), CLICK = T('click'), WALL = T('you', 2), TWO = T('two'), TRACK = T('they'), WEAR = T('wear'), THREE = T('three'), FOUR = T('four'), USE = T('use'), FIVE = T('and', 5), END = T('which');

/** escena en modo Focus: todo apagado y resaltados de colores */
const FocusScene: React.FC<{t: number; t0: number; walls?: boolean}> = ({t, t0, walls}) => {
  const r = t > T('red'), y = t > T('yellow'), g = t > T('green');
  return (
    <g>
      <g style={{filter: 'grayscale(1) brightness(0.55)'}}><Sunset t={t} scroll={t * 20} night /></g>
      <circle cx={960} cy={540} r={200 + (t - t0) * 600} fill="none" stroke="#fff" strokeWidth={6} opacity={Math.max(0, 0.6 - (t - t0) * 0.5)} />
      {walls && <rect x={860} y={420} width={420} height={480} fill="#555" opacity={0.6} stroke="#888" strokeWidth={8} />}
      <g style={{filter: r ? 'drop-shadow(0 0 16px #FF2D55)' : undefined}} opacity={r ? 1 : 0.3}><g style={{filter: r ? 'brightness(0) sepia(1) saturate(30) hue-rotate(-40deg)' : 'none'}}><NPC x={walls ? 1080 : 1150} y={GY + 20} s={1.1} t={t} color="#555" pose={POSES.fists} eyes="angry" /></g></g>
      {y && <g transform="translate(760 760)"><rect x={-60} y={-40} width={120} height={80} rx={10} fill={YEL} style={{filter: `drop-shadow(0 0 16px ${YEL})`}} /></g>}
      {g && <g transform="translate(930 830)"><rect x={-70} y={-24} width={140} height={48} rx={8} fill="#7BF59A" style={{filter: 'drop-shadow(0 0 16px #7BF59A)'}} /><text y={14} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#1E5631">$</text></g>}
    </g>
  );
};

const SHOTS: Shot[] = [
  [0, (lt, t) => <V><Cine t={t} mood="future" cam={{...kbV(lt, 1.5, 1.2, 0.7), ...shake(t, 8 - lt * 10)}} bg={DARK} hero={<FocusScene t={t + 14} t0={14} />} /></V>],
  [0.7, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.3, 1.5, 0.7), ...shake(t, 5)}} bg={<Sunset t={t} scroll={t * 900} night />} hero={<Car x={960} t={t} />} /></V>],
  [1.4, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.3, 1.1, 1)} bg={DARK} hero={<Safe t={t} spin />} /></V>],
  [T('these'), (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.1, 1.35, 3, 960, 420)} bg={<Sunset t={t} scroll={t * 40} night />} hero={<Hero x={960} y={GY + 20} s={1.5} t={t} pose={POSES.point} eyes="happy" mouth="grin" />} /></V>],
  [ONE, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.15, 4)} bg={DARK} hero={<Pad t={t} labels={['L3', 'R3']} l1={t > T('click')} r1={t > T('click')} />} /></V>],
  [T('enemies'), (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.2, 4.4)} bg={DARK} hero={<FocusScene t={t} t0={T('enemies')} />} /></V>],
  [WALL, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.1, 1.3, 2.6)} bg={DARK} hero={<FocusScene t={t} t0={WALL} walls />} /></V>],
  [TWO, (lt, t) => <V><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.2, 4.6), ...shake(t, 2)}} bg={<rect width={1920} height={1080} fill={Math.sin(t * 9) > 0 ? '#3a0010' : '#001a3a'} />} hero={<Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.scared} eyes="wide" mouth="o" sweat />} /></V>],
  [TRACK, (lt, t) => <V><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 10)} bg={DARK} hero={<Clues t={t} at={[T('face') - 0.2, T('outfit') - 0.2, T('car') - 0.2, T('cameras') - 0.2]} labels={['FACE', 'OUTFIT', 'CAR', 'CCTV']} ok={WEAR} />} /></V>],
  [THREE, (lt, t) => <V><Cine t={t} mood={t > T('explode') ? 'cold' : 'dusk'} cam={{...kbV(lt, 1.0, 1.25, 4), ...shake(t, t > T('explode') && t < T('explode') + 0.6 ? 9 : 0)}} bg={<Store />} hero={<>{t < T('explode') ? <Money t={t} n={16} /> : <circle cx={960} cy={600} r={120 + (t - T('explode')) * 500} fill="#3a86ff" opacity={Math.max(0, 0.85 - (t - T('explode')) * 0.5)} />}</>} fx={t > T('jammer') ? <g transform="translate(960 300)"><rect x={-200} y={-70} width={400} height={140} rx={20} fill="#fff" stroke="#111" strokeWidth={8} /><text y={25} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#111">CHAPTER 3</text></g> : undefined} /></V>],
  [FOUR, (lt, t) => <V><Cine t={t} mood="cold" cam={kbV(lt, 1.0, 1.2, 5)} bg={DARK} hero={<Safe t={t} spin={t < USE} />} /></V>],
  [USE, (lt, t) => <V><Cine t={t} mood="future" cam={kbV(lt, 1.1, 1.35, 3)} bg={DARK} hero={<g><g style={{filter: 'grayscale(1) brightness(0.5)'}}><Safe t={t} spin={false} /></g><g transform={`translate(1150 750) rotate(-8)`} style={{filter: `drop-shadow(0 0 18px ${YEL})`}}><rect x={-100} y={-70} width={200} height={140} fill="#fff8d6" stroke={YEL} strokeWidth={8} /><text y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#111">4 7 1 9</text></g></g>} /></V>],
  [FIVE, (lt, t) => { const sw = t > T('switch'); return <V><Cine t={t} mood="dusk" cam={{...kbV(lt, 1.0, 1.25, 8), ...shake(t, sw && t < T('switch') + 0.4 ? 6 : 0)}} bg={<Sunset t={t} scroll={t * (sw && t < T('switch') + 0.6 ? 3000 : 60)} />} hero={sw && t > T('jason') - 0.3 ? <><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.wave} eyes="happy" mouth="smile" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.wave} eyes="happy" mouth="smile" flip /></> : <Hero x={960} y={GY + 20} s={1.4} t={t} pose={POSES.idle} eyes="side" />} /></V>; }],
  [END, (lt, t) => <V><Cine t={t} mood="dusk" cam={kbV(lt, 1.0, 1.2, 4)} bg={<Sunset t={t} scroll={t * 40} />} hero={<><Hero x={840} y={GY + 20} s={1.3} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" /><NPC x={1090} y={GY + 20} s={1.3} t={t} color={PINK} hairBun pose={POSES.point} eyes="happy" mouth="grin" flip /></>} /></V>],
];

export const GtaTipsEnShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('gtatipsen/mezcla.wav')} />
      {pick(t, SHOTS)}
      {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
      <VBig t={t} at={0.03} until={T('these') - 0.05} a="GTA 6" b="5 SECRET TIPS" size={140} color="#FF4FA3" color2="#3DF5FF" />
      <VBig t={t} at={T('these')} until={ONE - 0.05} a="SAVE HOURS" b="WITH THESE" size={140} color2="#FFD23F" />
      <VBig t={t} at={ONE} until={TWO - 0.05} a="1" b={t > WALL ? 'SEE THROUGH WALLS' : 'FOCUS MODE'} size={t > WALL ? 105 : 140} color="#FFD23F" color2="#3DF5FF" />
      <VBig t={t} at={TWO} until={THREE - 0.05} a="2" b={t > WEAR ? 'HAT + BANDANA' : 'LOSE THE COPS'} size={130} color="#FFD23F" color2="#FF4D6D" />
      <VBig t={t} at={THREE} until={FOUR - 0.05} a="3" b="DON'T ROB BANKS YET" size={105} color="#FFD23F" color2="#FF4D6D" />
      <VBig t={t} at={FOUR} until={FIVE - 0.05} a="4" b={t > USE ? 'FIND THE NOTE' : 'SAFE CODES = RANDOM'} size={105} color="#FFD23F" color2="#7BF59A" />
      <VBig t={t} at={FIVE} until={END - 0.05} a="5" b="FREE FAST TRAVEL" size={120} color="#FFD23F" color2="#3DF5FF" />
      <VBig t={t} at={END} a="WHICH TIP" b="DIDN'T YOU KNOW?" size={115} color2="#FF4FA3" />
      <Arrow t={t} at={END + 1} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};
export const GtaTipsEnThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V><Cine t={1} mood="future" cam={kbV(0, 1.2, 1.2, 1)} bg={DARK} hero={<FocusScene t={13.5} t0={10} />} /></V>
      <VBig t={1} at={0} a="GTA 6" b="SECRET TIPS" size={170} y={150} color="#FF4FA3" color2="#3DF5FF" />
    </AbsoluteFill>
  );
};
