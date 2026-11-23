import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY} from '../futuro/kit';
import {Hero, POSES} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, ramp, easeOut} from '../futuro/vkit';
import {shake, Stamp, Money} from '../gtakit';
import {Tower, Nest, EggDrop, JetDog, FFCar, Bigfoot, Chiliad, Years} from './scenes';
import wordsEs from './words.json';

type Wd = {text: string; start_ms: number; end_ms: number};
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const Arrow: React.FC<{t: number; at: number}> = ({t, at}) => t < at ? null : <div style={{position: 'absolute', right: 80, top: 1560 + Math.sin((t - at) * 8) * 18, fontSize: 150, opacity: ramp(t, at, at + 0.3)}}>👇</div>;

type Txt = {hook: [string, string]; hook2: [string, string]; s1: [string, string]; min: [string, string]; nest: [string, string]; drop: [string, string]; nod: [string, string]; s2: [string, string]; real: [string, string]; s3: [string, string]; plate: [string, string]; s4: [string, string]; woods: [string, string]; s5: [string, string]; yrs: [string, string]; end: [string, string]; stampReal: string; thumb: [string, string]};
type A = {U1: number; TAR: number; NID: number; DROP: number; NOD: number; D2: number; REAL: number; T3: number; MIT: number; PLATE: number; C4: number; WOODS: number; C5: number; YRS: number; END: number};

export const buildSecretos = (words: Wd[], A: A, X: Txt, audio: string) => {
  const Caps = makeCaps(words as any, /\d|gta|secret|bigfoot|chiliad|paul|walker|vice|pascua|easter|perro|dog|huevo|egg|dude|almost/i);
  const {U1, TAR, NID, DROP, NOD, D2, REAL, T3, MIT, PLATE, C4, WOODS, C5, YRS, END} = A;
  const SHOTS: Shot[] = [
    [0, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={{...kbV(lt, 1.5, 1.2, 0.6), ...shake(t, 9 - lt * 12)}} bg={<Bigfoot t={t} x={900 + lt * 120} />} /></V>],
    [0.6, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={{...kbV(lt, 1.2, 1.4, 0.6), ...shake(t, 4)}} bg={<EggDrop t={t} k={0.55 + lt * 0.75} />} /></V>],
    [1.2, (lt, t) => <V><Cine t={t} blur={1.2} mood="day" cam={kbV(lt, 1.3, 1.1, 0.6)} bg={<JetDog t={t} />} /></V>],
    [1.8, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={{...kbV(lt, 1.0, 1.3, 0.7), ...shake(t, 3)}} bg={<FFCar t={t} k={0} />} /></V>],
    [2.5, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.1, 1.3, 1.5)} bg={<Chiliad t={t} k={1} />} /></V>],
    [U1, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.2, TAR - U1)} bg={<Tower t={t} k={0.05} />} /></V>],
    [TAR, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.15, NID - TAR, 960, 300)} bg={<Tower t={t} k={easeOut(ramp(t, TAR, NID - 0.2))} />} /></V>],
    [NID, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.1, 1.3, DROP - NID, 960, 600)} bg={<Nest t={t} k={easeOut(ramp(lt, 0, 0.5))} glow={lt > 1.2} />} /></V>],
    [DROP, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={{...kbV(lt, 1.0, 1.2, NOD - DROP), ...shake(t, lt > 1.6 && lt < 2.2 ? 8 : 0)}} bg={<EggDrop t={t} k={ramp(lt, 0.2, 2.4)} />} /></V>],
    [NOD, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.0, 1.15, D2 - NOD)} bg={<Nest t={t} k={1} glow />} /></V>],
    [D2, (lt, t) => <V><Cine t={t} blur={1.2} mood="day" cam={kbV(lt, 1.0, 1.2, REAL - D2)} bg={<JetDog t={t} x={700 + lt * 45} />} /></V>],
    [REAL, (lt, t) => <V><Cine t={t} blur={1.2} mood="day" cam={kbV(lt, 1.25, 1.1, T3 - REAL, 1000, 520)} bg={<JetDog t={t} />} hero={<Stamp k={easeOut(ramp(lt, 0.8, 1.1))} txt={X.stampReal} y={560} />} /></V>],
    [T3, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.15, MIT - T3)} bg={<FFCar t={t} k={0} />} hero={<Hero x={960} y={GY + 40} s={0.9} t={t} pose={POSES.point} eyes="wide" mouth="o" />} /></V>],
    [MIT, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.2, PLATE - MIT)} bg={<FFCar t={t} k={0} />} /></V>],
    [PLATE, (lt, t) => <V><Cine t={t} blur={1.2} mood="dusk" cam={kbV(lt, 1.0, 1.25, C4 - PLATE, 960, 880)} bg={<FFCar t={t} k={easeOut(ramp(lt, 0.2, 0.7))} />} /></V>],
    [C4, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={{...kbV(lt, 1.3, 1.1, WOODS - C4), ...shake(t, lt < 0.5 ? 7 : 0)}} bg={<Bigfoot t={t} x={700 + lt * 120} />} /></V>],
    [WOODS, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.0, 1.2, C5 - WOODS)} bg={<Bigfoot t={t} x={1150 - lt * 80} />} /></V>],
    [C5, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.0, 1.2, YRS - C5, 960, 400)} bg={<Chiliad t={t} k={easeOut(ramp(lt, 0.3, 1.2))} />} /></V>],
    [YRS, (lt, t) => <V><Cine t={t} blur={1.2} mood="future" cam={kbV(lt, 1.1, 1.0, END - YRS)} bg={<Chiliad t={t} k={1} />} hero={<g transform="translate(0 20)"><Years k={ramp(lt, 0, 0.8)} from={2013} to={2026} /></g>} /></V>],
    [END, (lt, t) => <V><Cine t={t} blur={1.2} mood="night" cam={kbV(lt, 1.0, 1.15, 6)} bg={<Nest t={t} k={1} glow />} hero={<Hero x={960} y={GY + 40} s={1.1} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" />} /></V>],
  ];
  const Short: React.FC = () => {
    loadFonts();
    const t = useCurrentFrame() / FPS;
    const big = (at: number, until: number, x: [string, string], size = 130, c = '#fff', c2 = '#FFD23F') => <VBig t={t} at={at} until={until - 0.05} a={x[0]} b={x[1]} size={size} color={c} color2={c2} />;
    return (
      <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
        <Audio src={staticFile(audio)} />
        {pick(t, SHOTS)}
        {SHOTS.map((s, i) => i > 0 && <Flash key={i} t={t} at={s[0]} dur={0.12} max={0.5} />)}
        {big(0.03, 2.5, X.hook, 160, '#FFD23F', '#FF4FA3')}
        {big(2.5, U1, X.hook2, 120, '#fff', '#3DF5FF')}
        {big(U1, TAR, X.s1, 120, '#FFD23F')}
        {big(TAR, NID, X.min, 130)}
        {big(NID, DROP, X.nest, 130, '#fff', '#FF4FA3')}
        {big(DROP, NOD, X.drop, 115, '#fff', '#3DF5FF')}
        {big(NOD, D2, X.nod, 115, '#fff', '#FF4FA3')}
        {big(D2, REAL, X.s2, 110, '#FFD23F', '#3DF5FF')}
        {big(REAL, T3, X.real, 115)}
        {big(T3, PLATE, X.s3, 110, '#FFD23F', '#FF7A1A')}
        {big(PLATE, C4, X.plate, 120, '#fff', '#FF4FA3')}
        {big(C4, WOODS, X.s4, 140, '#FFD23F', '#7BF59A')}
        {big(WOODS, C5, X.woods, 115, '#fff', '#7BF59A')}
        {big(C5, YRS, X.s5, 120, '#FFD23F', '#3DF5FF')}
        {big(YRS, END, X.yrs, 140, '#fff', '#FF4FA3')}
        {big(END, 1e9, X.end, 125, '#fff', '#FF4FA3')}
        <Arrow t={t} at={END + 1} />
        <Caps t={t} />
      </AbsoluteFill>
    );
  };
  const Thumb: React.FC = () => {
    loadFonts();
    return (
      <AbsoluteFill>
        <V><Cine t={1} mood="night" cam={kbV(0, 1.25, 1.25, 1)} bg={<Bigfoot t={1.3} x={960} />} /></V>
        <VBig t={1} at={0} a={X.thumb[0]} b={X.thumb[1]} size={175} y={150} color="#FFD23F" color2="#FF4FA3" />
      </AbsoluteFill>
    );
  };
  return {Short, Thumb};
};

const T = makeT(wordsEs as any);
export const DURATION_S = 58;
const R = buildSecretos(wordsEs as Wd[], {
  U1: T('uno'), TAR: T('tardas'), NID: T('arriba'), DROP: T('si'), NOD: T('es'), D2: T('dos'), REAL: T('está'), T3: T('tres'), MIT: T('mitsubishi'),
  PLATE: T('dude'), C4: T('cuatro'), WOODS: T('varios'), C5: T('cinco', 2), YRS: T('trece'), END: T('cuál'),
}, {
  hook: ['5 SECRETOS', 'DE GTA 6'], hook2: ['QUE YA', 'HAN ENCONTRADO'], s1: ['SECRETO 1', 'LA TORRE'], min: ['7 MINUTOS', 'SUBIENDO'], nest: ['HUEVOS', 'DE PASCUA'],
  drop: ['TÍRALO A', 'LA CARRETERA'], nod: ['GUIÑO A', 'VICE CITY 2002'], s2: ['SECRETO 2', 'PERRO SOCORRISTA'], real: ['INSPIRADO EN', 'UN PERRO REAL'],
  s3: ['SECRETO 3', 'COCHE DE PAUL WALKER'], plate: ['"DUDE, I', 'ALMOST HAD YOU"'], s4: ['SECRETO 4', 'BIGFOOT'], woods: ['COTTONMOUTH', 'LAKE'],
  s5: ['SECRETO 5', 'MONTE CHILIAD'], yrs: ['13 AÑOS', 'DESPUÉS'], end: ['¿CUÁL BUSCAS', 'PRIMERO?'], stampReal: 'REAL', thumb: ['5 SECRETOS', 'GTA 6'],
}, 'gtasecretos/mezcla.wav');
export const GtaSecretosShort = R.Short;
export const GtaSecretosThumb = R.Thumb;
