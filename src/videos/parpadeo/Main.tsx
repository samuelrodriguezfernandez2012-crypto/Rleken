import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VWorld, VCam, V2, makeT, EndV2, ShellV2, ThumbTitle, POSES, W, H, GROUND} from '../../kitV2';
import {BigText, Flash, ramp, easeOut, rnd, sumShake} from '../../fx';
import words from './words.json';

export const DURATION_S = 50.6;
const T = makeT(words as any);
const KEYS = /parpadeo|parpadeé|100|milisegundos|año|años|canas|universidad|10|20|30|ardían|tres|viejo|dormí|8|horas|nadie|ruinas|selva|288\.000/i;

// parpado negro que se cierra (de arriba y abajo)
const Blink: React.FC<{t: number; at: number; dur?: number}> = ({t, at, dur = 0.22}) => {
  if (t < at || t > at + dur) return null;
  const k = 1 - Math.abs((t - at) / dur * 2 - 1);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: (H / 2) * k, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: (H / 2) * k, background: '#000'}} />
    </AbsoluteFill>
  );
};

const Classroom: React.FC = () => (
  <g>
    <rect width={W} height={GROUND} fill="#F1E3C6" />
    <rect x={120} y={360} width={840} height={420} rx={14} fill="#2F5D50" stroke="#8B5A3C" strokeWidth={18} />
    <text x={540} y={600} textAnchor="middle" fontFamily="Luckiest" fontSize={90} fill="#fff" opacity={0.85}>HISTORIA</text>
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#C49A6C" />
    <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
  </g>
);
const Calendar: React.FC<{x: number; y: number; year: string; s?: number}> = ({x, y, year, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-160} width={300} height={320} rx={20} fill="#fff" stroke="#111" strokeWidth={8} />
    <rect x={-150} y={-160} width={300} height={80} rx={20} fill="#E0002A" stroke="#111" strokeWidth={8} />
    <text textAnchor="middle" y={-102} fontFamily="Luckiest" fontSize={46} fill="#fff">AÑO</text>
    <text textAnchor="middle" y={70} fontFamily="Luckiest" fontSize={110} fill="#111">{year}</text>
  </g>
);
const Teacher: React.FC<{t: number; gray: number}> = ({t, gray}) => (
  <g>
    <V2 x={780} t={t} s={1.35} color="#2EC4B6" pose={POSES.point} flip eyes={gray > 0 ? 'wide' : 'normal'} />
    {gray > 0 && <path d={`M ${780 - 40} ${GROUND - 1.35 * 340} q 40 -30 80 0`} stroke="#EDEDED" strokeWidth={12} fill="none" strokeLinecap="round" />}
  </g>
);

const S1Hook: React.FC<{t: number}> = ({t}) => {
  const cuts = [0, 0.6, 1.2, 1.8, 2.4];
  const i = cuts.filter((c) => t >= c).length - 1;
  const year = 2026 + i * 1;
  return (
    <AbsoluteFill style={{background: ['#003049', '#370617', '#14213D', '#240046', '#003049'][i % 5]}}>
      <VCam s={1.6 - (t % 0.6) * 0.4} oy={800}>
        <VWorld>
          <V2 x={540} t={t} s={1.5} eyes={i % 2 ? 'closed' : 'wide'} mouth="o" />
          <Calendar x={760} y={700} year={String(year)} s={0.6} />
        </VWorld>
      </VCam>
      {cuts.map((c) => <Blink key={c} t={t} at={c + 0.45} dur={0.15} />)}
    </AbsoluteFill>
  );
};

const S2Power: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#0B1026'}}>
    <VCam s={2.4} oy={760}><VWorld><V2 x={540} t={t} s={1.5} eyes={Math.floor(t * 1.5) % 2 ? 'closed' : 'normal'} noBlink /></VWorld></VCam>
  </AbsoluteFill>
);

const S3Class: React.FC<{t: number}> = ({t}) => {
  const b1 = T('parpadeé'), b2 = T('parpadeé', 2);
  const friendsGone = t > b2 + 0.2;
  return (
    <AbsoluteFill>
      <VWorld>
        <Classroom />
        <Teacher t={t} gray={t > b1 + 0.2 ? 1 : 0} />
        {!friendsGone && [150, 330].map((x, i) => <V2 key={i} x={x} y={GROUND + 60} t={t} s={0.95} color={['#E63946', '#FFB703'][i]} />)}
        {friendsGone && <text x={250} y={1150} textAnchor="middle" fontFamily="Luckiest" fontSize={60} fill="#999">(VACÍO)</text>}
        <V2 x={540} y={GROUND + 80} t={t} s={1.1} eyes={t > b1 + 0.2 ? 'wide' : 'normal'} mouth={t > b1 + 0.2 ? 'o' : 'flat'} look={1} />
        <Calendar x={860} y={250} year={t > b2 + 0.2 ? '2028' : t > b1 + 0.2 ? '2027' : '2026'} s={0.6} />
      </VWorld>
      <Blink t={t} at={b1} dur={0.3} />
      <Blink t={t} at={b2} dur={0.3} />
      <BigText t={t} at={T('canas')} until={b2 - 0.05} text="¡+1 AÑO!" size={180} y={330} />
      <BigText t={t} at={T('universidad')} text={'¡MIS AMIGOS EN\nLA UNIVERSIDAD!'} size={110} y={330} color="#6EF0FF" />
    </AbsoluteFill>
  );
};

const S4Stare: React.FC<{t: number}> = ({t}) => {
  const n = t < T('20') ? 10 : t < T('30') ? 20 : 30;
  const red = ramp(t, T('intenté'), T('30'));
  return (
    <AbsoluteFill style={{background: `rgb(${20 + red * 120},10,20)`}}>
      <VCam s={2.6 + red * 0.6} oy={760} x={Math.sin(t * 50) * red * 8}>
        <VWorld>
          <V2 x={540} t={t} s={1.5} eyes="wide" mouth="teeth" noBlink />
          {/* venitas rojas */}
          {red > 0.3 && [-1, 1].map((d) => <g key={d} stroke="#E0002A" strokeWidth={2} opacity={red}><line x1={540 + d * 19 - 8} y1={GROUND - 466} x2={540 + d * 19} y2={GROUND - 462} /><line x1={540 + d * 19 + 8} y1={GROUND - 470} x2={540 + d * 19} y2={GROUND - 462} /></g>)}
        </VWorld>
      </VCam>
      <BigText t={t} at={T('10')} text={`${n} S SIN PARPADEAR`} size={110} y={330} color="#fff" />
      <BigText t={t} at={T('ardían')} until={T('30') - 0.05} text="¡ME ARDÍAN!" size={160} y={1000} color="#FF3B5C" wiggle />
    </AbsoluteFill>
  );
};

const S5Triple: React.FC<{t: number}> = ({t}) => {
  const b = T('parpadeé', 3);
  const years = t < b ? 2028 : Math.min(2031, 2028 + Math.floor((t - b) / 0.35) + 1);
  return (
    <AbsoluteFill style={{background: '#14213D'}}>
      <VWorld>
        <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#2a2440" />
        <Calendar x={540} y={520} year={String(years)} s={1.4} />
        {t > T('perro') - 0.2 && (
          <g transform="translate(700 1290)">
            <ellipse cx={0} cy={-70} rx={90} ry={46} fill="#B07940" stroke="#111" strokeWidth={7} />
            <circle cx={-90} cy={-110} r={46} fill="#B07940" stroke="#111" strokeWidth={7} />
            <path d="M -110 -86 q 20 14 40 0" stroke="#EDEDED" strokeWidth={8} fill="none" />
            <ellipse cx={-100} cy={-118} rx={8} ry={4} fill="#111" />
            <ellipse cx={-76} cy={-118} rx={8} ry={4} fill="#111" />
            {[-50, 40].map((lx) => <line key={lx} x1={lx} y1={-40} x2={lx} y2={0} stroke="#111" strokeWidth={9} />)}
          </g>
        )}
        <V2 x={300} t={t} s={1.3} pose={POSES.scared} eyes="wide" mouth="o" noBlink />
      </VWorld>
      {[0, 0.35, 0.7].map((d) => <Blink key={d} t={t} at={b + d} dur={0.25} />)}
      <BigText t={t} at={T('tres', 2)} until={T('perro') - 0.05} text="¡3 AÑOS!" size={200} y={1050} color="#FF3B5C" />
      <BigText t={t} at={T('viejo')} text="MI PERRO... VIEJO" size={110} y={1050} color="#fff" />
    </AbsoluteFill>
  );
};

const S6Sleep: React.FC<{t: number}> = ({t}) => {
  const sleep = T('dormí');
  const closed = t > sleep;
  const yr = closed ? Math.floor(2031 + Math.pow(ramp(t, sleep, T('cuando')), 2) * 288000) : 2031;
  return (
    <AbsoluteFill style={{background: '#0B1026'}}>
      <VWorld>
        <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#2a2440" />
        <rect x={150} y={1100} width={780} height={200} rx={20} fill="#5E60CE" stroke="#111" strokeWidth={8} />
        <V2 x={closed ? 560 : 540} y={closed ? 1110 : GROUND} t={t} s={1.2} pose={closed ? POSES.idle : POSES.headHold} rotate={closed ? -80 : 0} eyes={closed ? 'closed' : 'normal'} mouth="frown" noBlink />
        {closed && <text x={760} y={900} fontFamily="Luckiest" fontSize={90} fill="#fff" opacity={0.7 + 0.3 * Math.sin(t * 3)}>Z z z</text>}
      </VWorld>
      <BigText t={t} at={T('peor')} until={sleep - 0.05} text="EL PEOR ERROR..." size={130} y={330} color="#FF3B5C" />
      {closed && <BigText t={t} at={sleep} text={'AÑO ' + String(yr).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} size={130} y={330} color="#FFE24A" />}
    </AbsoluteFill>
  );
};

const S7Ruins: React.FC<{t: number}> = ({t}) => {
  const k = easeOut(ramp(t, T('cuando'), T('cuando') + 1.2));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#90BE6D, #F9C74F)'}}>
      <VCam s={1.3 - 0.3 * k} oy={900} x={sumShake(t, [[T('288.000'), 0.5, 20]]).x}>
        <VWorld>
          {Array.from({length: 6}).map((_, i) => (
            <g key={i}>
              <rect x={40 + i * 175} y={500 + rnd(i) * 300} width={140} height={900} fill="#8D99AE" stroke="#111" strokeWidth={6} />
              {Array.from({length: 6}).map((__, j) => <path key={j} d={`M ${40 + i * 175 + rnd(i * 7 + j) * 140} ${600 + j * 130} q 30 -40 60 0 q -30 40 -60 0`} fill="#3FB950" stroke="#111" strokeWidth={3} />)}
            </g>
          ))}
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#43AA8B" />
          {Array.from({length: 10}).map((_, i) => <path key={i} d={`M ${i * 110} ${GROUND} q 20 -120 40 0`} fill="#2D6A4F" stroke="#111" strokeWidth={4} />)}
          <V2 x={540} y={GROUND + 20} t={t} s={1.3} pose={POSES.scared} eyes="wide" mouth="o" />
        </VWorld>
      </VCam>
      <BigText t={t} at={T('nadie')} until={T('288.000') - 0.05} text="NO HABÍA NADIE" size={140} y={330} color="#fff" />
      <BigText t={t} at={T('288.000')} text={'288.000\nAÑOS'} size={210} y={360} color="#FF3B5C" wiggle />
      <Flash t={t} at={T('cuando')} dur={0.4} />
    </AbsoluteFill>
  );
};

const S8End: React.FC<{t: number}> = ({t}) => <EndV2 t={t} at={T('qué')} question={'¿Y SI CADA\nPARPADEO FUERA\nUN AÑO?'} c1="#240046" c2="#3C096C" />;

const Overlay: React.FC<{t: number}> = ({t}) => (
  <>
    <BigText t={t} at={0.1} until={2.95} text={'1 PARPADEO\n= 1 AÑO'} size={160} y={330} color="#FFE24A" />
    <BigText t={t} at={T('100')} until={T('para') - 0.05} text={'UN PARPADEO:\n0,1 SEGUNDOS'} size={110} y={1000} color="#fff" />
    <BigText t={t} at={T('año')} until={T('lo') - 0.05} text={'PARA MÍ:\n¡1 AÑO!'} size={160} y={330} color="#FF3B5C" wiggle />
  </>
);

export const ParpadeoShort: React.FC = () => (
  <ShellV2 name="parpadeo" words={words as any} keys={KEYS} overlay={Overlay} scenes={[
    [0, S1Hook], [3.0, S2Power], [T('lo'), S3Class], [T('intenté'), S4Stare], [T('y', 3), S5Triple],
    [T('estaba'), S6Sleep], [T('cuando'), S7Ruins], [T('qué'), S8End],
  ]} />
);

export const ParpadeoThumb: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(#90BE6D, #F9C74F)'}}>
    <VWorld>
      {Array.from({length: 5}).map((_, i) => <rect key={i} x={40 + i * 210} y={700 + rnd(i) * 300} width={170} height={1300} fill="#8D99AE" stroke="#111" strokeWidth={6} />)}
      <V2 x={540} y={1600} t={0} pose={POSES.scared} eyes="wide" mouth="o" s={2.2} />
    </VWorld>
    <ThumbTitle a="PARPADEÉ..." b="Y PASARON 288.000 AÑOS" pill="¡1 PARPADEO = 1 AÑO!" />
  </AbsoluteFill>
);
