import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import {FPS} from '../../fx';
import {makeT} from '../../kitV2';
import {Cine, Flash, kb, GY} from '../futuro/kit';
import {CityNight} from '../futuro/props';
import {V, VBig, makeCaps, pick, Shot, Stars, Earth, Moon, Meteors, Sea, Volcano, ramp, easeOut} from '../futuro/vkit';
import words from './words.json';

export const DURATION_S = 58.5;
const T = makeT(words as any);
const Caps = makeCaps(words as any, /\d|luna|tierra|mareas|olas|volcanes|anillos|meteoritos|pedazos|eclipses/i);
const kbV = (lt: number, s0: number, s1: number, d = 6, ox = 960, oy = 540) => kb(lt, 1 + (s0 - 1) * 0.3, 1 + (s1 - 1) * 0.3, d, ox, oy);
const shake = (t: number, k: number) => ({x: Math.sin(t * 61) * k, y: Math.cos(t * 53) * k * 0.6});

// cielo nocturno con la Luna enorme sobre la ciudad
const skyMoon = (t: number, lt: number, r: number, crack = 0, k = 0) => (
  <Cine t={t} mood="night" cam={{...kbV(lt, 1.0, 1.15, 4, 960, 500), ...shake(t, k)}} blur={2} bg={<Stars t={t} />} mid={<><Moon x={960} y={300} r={r * 0.85} crack={crack} glow={0.45} /><CityNight lights noSky /></>} />
);

const SHOTS: Shot[] = [
  // gancho: la Luna se rompe sobre la ciudad y llueven meteoritos (avance del final)
  [0, (lt, t) => <V fx={960}>{skyMoon(t, lt, 520, 0.4 + lt * 0.3, 10)}</V>],
  [0.6, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.4, 1.6, 1), ...shake(t, 12)}} blur={2} bg={<Stars t={t} />} mid={<><Moon x={960} y={360} r={480} crack={0.8} /><CityNight lights={false} noSky /></>} hero={<Meteors t={t} n={18} />} /></V>],
  [1.2, (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 2.0, 2.4, 1, 960, 540)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={960} y={560} r={260} t={t} rings={1} fire={0.6} /><Meteors t={t} n={10} /></>} /></V>],
  [1.8, (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.5, 1), ...shake(t, 14)}} bg={<Sea t={t} level={GY - 60} wave={lt * 1.6} night />} /></V>],
  [2.4, (lt, t) => <V fx={960}>{skyMoon(t, lt, 300, 0, 0)}</V>],
  // 384.000 km: la Tierra y la Luna separadas
  [T('y'), (lt, t) => {
    const k = easeOut(ramp(lt, 0, 3));
    return <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 5)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={960} y={760} r={170} t={t} /><Moon x={960} y={300 + k * 160} r={46 + k * 30} glow={0.4} /><line x1={1060} y1={760} x2={1060} y2={320 + k * 160} stroke="#9FFCFF" strokeWidth={3} strokeDasharray="12 10" opacity={0.6} /></>} /></V>;
  }],
  [T('mitad'), (lt, t) => <V fx={760}><Cine t={t} mood="day" cam={kbV(lt, 1.0, 1.2, 4)} blur={2} bg={<Sea t={t} level={GY - 40 - easeOut(ramp(lt, 0.5, 3.5)) * 320} />} /></V>],
  [T('playas'), (lt, t) => <V fx={760}><Cine t={t} mood="cold" cam={kbV(lt, 1.2, 1.35, 3)} blur={2} bg={<Sea t={t} level={GY - 360 + Math.sin(lt * 2.2) * 200} />} /></V>],
  [T('100.000'), (lt, t) => <V fx={1100}><Cine t={t} mood="cold" cam={{...kbV(lt, 1.0, 1.2, 4, 1100, 500), ...shake(t, 4)}} blur={2} bg={<Sea t={t} level={GY - 80} wave={0.15 + lt * 0.28} />} /></V>],
  [T('volcanes'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.15, 2), ...shake(t, 6)}} bg={<><Stars t={t} /><rect y={GY} width={1920} height={200} fill="#1B1412" /></>} hero={<Volcano x={960} t={t} s={1.2} />} /></V>],
  [T('tierra'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.2, 1.4, 2), ...shake(t, 10)}} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={540} r={300} t={t} cracks={Math.min(1, lt)} />} /></V>],
  [T('30.000'), (lt, t) => <V fx={960}>{skyMoon(t, lt, 380 + lt * 40, 0, 2)}</V>],
  [T('entonces'), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.1, 6)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={960} y={700} r={220} t={t} /><circle cx={960} cy={700} r={430} fill="none" stroke="#FF4D6D" strokeWidth={5} strokeDasharray="18 12" opacity={0.85} /><Moon x={960} y={250 + easeOut(ramp(lt, 0, 5)) * 30} r={70} crack={ramp(t, T('pedazos') - 0.6, T('pedazos') + 1.2)} /></>} /></V>],
  [T('durante'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.3, 1.0, 5)} blur={1} bg={<Stars t={t} />} hero={<Earth x={960} y={560} r={250} t={t} rings={easeOut(ramp(lt, 0, 1.5))} />} /></V>],
  [T('hasta'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={{...kbV(lt, 1.0, 1.15, 5), ...shake(t, 8)}} bg={<Stars t={t} />} mid={<CityNight lights={false} noSky />} hero={<Meteors t={t} n={22} />} /></V>],
  [T('millones'), (lt, t) => <V fx={960}><Cine t={t} mood="red" cam={kbV(lt, 1.6, 1.3, 3)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={960} y={600} r={240} t={t} rings={0.6} fire={1} /><Meteors t={t} n={16} /></>} /></V>],
  // giro: en realidad se aleja
  [T('pero'), (lt, t) => {
    const k = easeOut(ramp(lt, 0, 6));
    return <V fx={960}><Cine t={t} mood="future" cam={kbV(lt, 1.0, 1.05, 6)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={960} y={820} r={150} t={t} /><Moon x={960} y={330 - k * 120} r={70 - k * 30} glow={0.4} /></>} /></V>;
  }],
  [T('y', 3), (lt, t) => <V fx={960}><Cine t={t} mood="night" cam={kbV(lt, 1.0, 1.2, 5, 960, 450)} blur={1} bg={<Stars t={t} />} hero={<><circle cx={960} cy={420} r={150} fill="#FFE8A3" filter="url(#blurGlow)" opacity={0.9} /><circle cx={960} cy={420} r={130} fill="#FFD23F" /><Moon x={960 + 40 + lt * 6} y={420} r={118} glow={0} /></>} /></V>],
  [T('prefieres'), (lt, t) => <V fx={960}><Cine t={t} mood="dusk" cam={kbV(lt, 1.1, 1.2, 5)} blur={1} bg={<Stars t={t} />} hero={<><Earth x={960} y={760} r={160} t={t} /><Moon x={960} y={330} r={90} /><g transform={`translate(1150 ${700 + Math.sin(t * 7) * 18})`}><path d="M -34 -120 L 34 -120 L 34 0 L 86 0 L 0 100 L -86 0 L -34 0 Z" fill="#FFD23F" stroke="#111" strokeWidth={7} strokeLinejoin="round" /></g></>} /></V>],
];

export const LunaShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#05050F', overflow: 'hidden'}}>
      <Audio src={staticFile('luna/mezcla.wav')} />
      {pick(t, SHOTS)}
      {[0, 0.6, 1.2, 1.8, 2.4, T('100.000'), T('pedazos'), T('pero')].map((a, i) => <Flash key={i} t={t} at={a} dur={0.15} max={0.7} />)}
      <VBig t={t} at={0.03} until={T('y') - 0.05} a="¿Y SI LA LUNA" b="SE ACERCARA?" size={130} />
      <VBig t={t} at={T('y')} until={T('mitad') - 0.05} a="384.000 KM" size={150} />
      <VBig t={t} at={T('siete')} until={T('playas') - 0.05} a="MAREAS" b="×7" size={170} color2="#7CF4FF" />
      <VBig t={t} at={T('100.000')} until={T('volcanes') - 0.05} a="100.000 KM" b="OLAS GIGANTES" size={130} />
      <VBig t={t} at={T('30.000')} until={T('entonces') - 0.05} a="30.000 KM" size={150} />
      <VBig t={t} at={T('18.000')} until={T('durante') - 0.05} a="18.000 KM" b="LÍMITE DE ROCHE" size={130} color2="#FF4D6D" />
      <VBig t={t} at={T('anillos')} until={T('hasta') - 0.05} a="ANILLOS" b="COMO SATURNO" size={130} />
      <VBig t={t} at={T('meteoritos')} until={T('pero') - 0.05} a="MILLONES DE" b="METEORITOS" size={130} color2="#FF4D6D" />
      <VBig t={t} at={T('aleja')} until={T('y', 3) - 0.05} a="SE ALEJA" b="+3,8 CM/AÑO" size={140} color2="#7CF4FF" />
      <VBig t={t} at={T('eclipses')} until={T('prefieres') - 0.05} a="ADIÓS A LOS" b="ECLIPSES" size={130} />
      <VBig t={t} at={T('prefieres')} a="¿QUE SE ACERQUE" b="O QUE SE VAYA?" size={110} />
      <Caps t={t} />
    </AbsoluteFill>
  );
};

export const LunaThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill>
      <V fx={960}>{skyMoon(0.5, 0, 520, 0.45, 0)}</V>
      <VBig t={1} at={0} a="¿Y SI LA LUNA" b="SE ACERCARA?" size={140} y={180} />
    </AbsoluteFill>
  );
};
