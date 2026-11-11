import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VWorld, VCam, V2, vseq, makeT, EndV2, ShellV2, ThumbTitle, POSES, W, H, GROUND} from '../../kitV2';
import {BigText, Flash, Sparkles, pop, ramp, easeOut, rnd, sumShake} from '../../fx';
import words from './words.json';

export const DURATION_S = 46.5;
const T = makeT(words as any);
const KEYS = /sol|8|20|minutos|segundos|luz|oscuridad|luna|estrellas|semana|congelarse|-18|-73|volcanes|frío|enorme|ojos/i;

const Stars: React.FC<{n?: number; o?: number}> = ({n = 90, o = 1}) => (
  <g opacity={o}>{Array.from({length: n}).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 3) * H * 0.75} r={1.5 + rnd(i + 7) * 3.5} fill="#fff" opacity={0.4 + rnd(i + 1) * 0.6} />)}</g>
);
const Sun: React.FC<{x: number; y: number; r: number; t: number; k?: number}> = ({x, y, r, t, k = 1}) => (
  <g opacity={k}>
    <circle cx={x} cy={y} r={r * 1.6} fill="#FFB703" opacity={0.35} filter="url(#blurGlow)" />
    <circle cx={x} cy={y} r={r * (1 + Math.sin(t * 4) * 0.02)} fill="#FFD23F" stroke="#111" strokeWidth={8} />
    {Array.from({length: 12}).map((_, i) => (
      <line key={i} x1={x + Math.cos((i * Math.PI) / 6 + t) * r * 1.15} y1={y + Math.sin((i * Math.PI) / 6 + t) * r * 1.15} x2={x + Math.cos((i * Math.PI) / 6 + t) * r * 1.4} y2={y + Math.sin((i * Math.PI) / 6 + t) * r * 1.4} stroke="#111" strokeWidth={9} strokeLinecap="round" />
    ))}
  </g>
);
const Earth: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#2E86DE" stroke="#111" strokeWidth={6} />
    <path d={`M ${x - r * 0.6} ${y - r * 0.2} q ${r * 0.3} ${-r * 0.5} ${r * 0.7} ${-r * 0.1} q ${r * 0.2} ${r * 0.4} ${-r * 0.2} ${r * 0.5} z`} fill="#3FB950" stroke="#111" strokeWidth={4} />
  </g>
);
const Beach: React.FC<{dark?: number; ice?: number}> = ({dark = 0, ice = 0}) => (
  <g>
    <rect width={W} height={H} fill="#8ECAE6" />
    <rect x={0} y={900} width={W} height={300} fill={ice > 0.5 ? '#D8F3FF' : '#2E86DE'} />
    {ice > 0 && Array.from({length: 8}).map((_, i) => <polyline key={i} points={`${i * 140},${930 + rnd(i) * 200} ${i * 140 + 70},${960 + rnd(i + 2) * 200} ${i * 140 + 140},${930 + rnd(i + 4) * 200}`} stroke="#fff" strokeWidth={6} fill="none" opacity={ice} />)}
    <rect x={0} y={1200} width={W} height={H - 1200} fill={ice > 0.5 ? '#EDEDED' : '#F4D35E'} />
    <line x1={0} y1={1200} x2={W} y2={1200} stroke="#111" strokeWidth={8} />
    <g transform="translate(860 1200)">
      <line x1={0} y1={0} x2={-40} y2={-340} stroke="#111" strokeWidth={10} />
      <path d="M -200 -300 Q -40 -470 120 -300 Z" fill="#E63946" stroke="#111" strokeWidth={8} />
    </g>
    <rect width={W} height={H} fill="#02030F" opacity={dark} />
  </g>
);

const S1Hook: React.FC<{t: number}> = ({t}) => {
  if (t < 0.7) {
    const k = 1 - easeOut(ramp(t, 0.05, 0.6));
    return (
      <AbsoluteFill style={{background: '#02030F'}}>
        <VCam s={1.2 - t * 0.2}><VWorld><Stars /><Sun x={540} y={760} r={320 * k + 1} t={t} k={k} /></VWorld></VCam>
        <Flash t={t} at={0} dur={0.25} color="#FFE24A" max={0.9} />
      </AbsoluteFill>
    );
  }
  if (t < 1.4) return <AbsoluteFill style={{background: '#02030F'}}><VCam s={2.6} oy={760}><VWorld><V2 x={540} t={t} eyes="wide" mouth="o" s={1.5} /></VWorld></VCam></AbsoluteFill>;
  // diagrama: la luz viaja del (ya apagado) Sol a la Tierra
  const k = ramp(t, 1.4, 5.8);
  return (
    <AbsoluteFill style={{background: '#02030F'}}>
      <VWorld>
        <Stars />
        <circle cx={200} cy={900} r={110} fill="none" stroke="#FFD23F" strokeWidth={6} strokeDasharray="20 16" />
        <Earth x={900} y={900} r={70} />
        <rect x={200} y={880} width={700 * k} height={40} rx={20} fill="#FFE24A" opacity={0.85} />
        <circle cx={200 + 700 * k} cy={900} r={34} fill="#FFF3A0" filter="url(#blurGlow)" />
      </VWorld>
    </AbsoluteFill>
  );
};

const S2Light: React.FC<{t: number}> = ({t}) => {
  const k = ramp(t, T('eso'), T('yo'));
  return (
    <AbsoluteFill style={{background: '#02030F'}}>
      <VWorld>
        <Stars />
        <Sun x={180} y={900} r={110} t={t} />
        <Earth x={900} y={900} r={70} />
        {Array.from({length: 6}).map((_, i) => <circle key={i} cx={200 + ((k * 700 + i * 120) % 700)} cy={900} r={10} fill="#FFE24A" />)}
      </VWorld>
    </AbsoluteFill>
  );
};

const S3Beach: React.FC<{t: number}> = ({t}) => {
  const left = Math.max(0, 500 - Math.floor((t - T('8', 2)) * 60));
  return (
    <AbsoluteFill>
      <VWorld>
        <Beach />
        <Sun x={830} y={330} r={110} t={t} />
        <V2 x={420} t={t} pose={{...POSES.idle, armL: [-60, 150], armR: [60, -150]}} eyes="closed" mouth="smile" s={1.4} />
      </VWorld>
      {t > T('8', 2) && <BigText t={t} at={T('8', 2)} text={`${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`} size={230} color="#FF3B5C" y={330} />}
      <BigText t={t} at={T('nada')} until={T('8', 2) - 0.05} text="NADA..." size={170} color="#fff" y={330} />
    </AbsoluteFill>
  );
};

const S4Dark: React.FC<{t: number}> = ({t}) => {
  const off = T('oscuridad');
  const dark = t >= off ? 0.96 : 0;
  const moonGone = t >= T('apagó');
  return (
    <AbsoluteFill>
      <VCam x={sumShake(t, [[off, 0.5, 30]]).x}>
        <VWorld>
          <Beach dark={dark} />
          {t < off && <Sun x={830} y={330} r={110} t={t} />}
          {t >= off && !moonGone && <circle cx={300} cy={300} r={60} fill="#F5F3CE" opacity={0.9} />}
          {t >= T('solo') && <Stars o={ramp(t, T('solo'), T('solo') + 0.6)} />}
          {t < off ? <V2 x={420} t={t} pose={POSES.scared} eyes="wide" mouth="o" s={1.4} /> : (
            <g>
              <ellipse cx={407} cy={GROUND - 1.4 * 310} rx={16} ry={18} fill="#fff" />
              <ellipse cx={443} cy={GROUND - 1.4 * 310} rx={16} ry={18} fill="#fff" />
            </g>
          )}
        </VWorld>
      </VCam>
      <BigText t={t} at={off} until={T('sin') - 0.05} text={'¡OSCURIDAD\nTOTAL!'} size={160} color="#fff" y={330} />
      <BigText t={t} at={T('luna')} until={T('solo') - 0.05} text="¡Y LA LUNA TAMBIÉN!" size={110} color="#BDE0FE" y={330} />
      <Flash t={t} at={off} dur={0.12} color="#000" />
    </AbsoluteFill>
  );
};

const S5Freeze: React.FC<{t: number}> = ({t}) => {
  const temp = t < T('-18') ? 25 - ramp(t, T('semana'), T('-18')) * 43 : t < T('-73') ? -18 : -73;
  const ice = ramp(t, T('semana'), T('-18'));
  return (
    <AbsoluteFill>
      <VWorld>
        <Beach dark={0.75} ice={ice} />
        <Stars />
        <V2 x={360} t={t} pose={{...POSES.headHold, legL: [Math.sin(t * 40) * 3, 6], legR: [-Math.sin(t * 40) * 3, -6]}} eyes="wide" mouth="teeth" s={1.4} color="#5D8BD6" />
        <g transform="translate(820 900)">
          <rect x={-40} y={-360} width={80} height={460} rx={40} fill="#fff" stroke="#111" strokeWidth={8} />
          <circle cy={140} r={70} fill="#4CC9F0" stroke="#111" strokeWidth={8} />
          <rect x={-18} y={-320 + (25 - temp) * 3} width={36} height={420 - (25 - temp) * 3} fill="#4CC9F0" />
        </g>
      </VWorld>
      <BigText t={t} at={T('semana')} text={`${Math.round(temp)} °C`} size={230} color="#BDF2FF" y={330} />
    </AbsoluteFill>
  );
};

const S6Cave: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <VWorld>
      <rect width={W} height={H} fill="#2B1A12" />
      <path d={`M 0 600 Q 540 300 ${W} 600 L ${W} 0 L 0 0 Z`} fill="#1A0F0A" />
      <ellipse cx={540} cy={1350} rx={600} ry={160} fill="#FF5A1F" opacity={0.5 + 0.1 * Math.sin(t * 4)} filter="url(#blurGlow)" />
      <path d="M 200 1500 Q 540 1250 880 1500 Z" fill="#FF7A1A" stroke="#111" strokeWidth={8} />
      {[250, 820].map((x, i) => <V2 key={i} x={x} y={1240} t={t} s={1.0} color={['#E63946', '#06D6A0'][i]} pose={POSES.headHold} eyes="closed" flip={i === 1} />)}
      <V2 x={540} y={1200} t={t} s={1.3} pose={POSES.hands} eyes="normal" glow="#FF7A1A" />
    </VWorld>
    <BigText t={t} at={T('volcanes')} text={'¡BAJO TIERRA,\nJUNTO A LOS VOLCANES!'} size={96} y={330} />
  </AbsoluteFill>
);

const S7Eyes: React.FC<{t: number}> = ({t}) => {
  const look = T('donde'), shape = T('algo'), eyes = T('ojos');
  const s = t < look ? 1 : 1 + 0.5 * easeOut(ramp(t, look, look + 1.5));
  const open = ramp(t, eyes, eyes + 0.35);
  return (
    <AbsoluteFill style={{background: '#02030F'}}>
      <VCam s={s} oy={500} x={sumShake(t, [[eyes, 0.6, 25]]).x}>
        <VWorld>
          <Stars />
          {t > shape && <circle cx={540} cy={420} r={330 * easeOut(ramp(t, shape, shape + 1.5))} fill="#000" stroke="#1B263B" strokeWidth={10} />}
          {open > 0 && [-1, 1].map((d) => (
            <g key={d}>
              <ellipse cx={540 + d * 130} cy={420} rx={95} ry={70 * open} fill="#FF3B1F" filter="url(#blurGlow)" />
              <ellipse cx={540 + d * 130} cy={420} rx={80} ry={56 * open} fill="#FFE24A" />
              <ellipse cx={540 + d * 130} cy={420} rx={14} ry={50 * open} fill="#111" />
            </g>
          ))}
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#111" />
          <V2 x={540} t={t} pose={t > eyes ? POSES.scared : {...POSES.idle, head: -10}} eyes={t > eyes ? 'wide' : 'normal'} mouth={t > eyes ? 'o' : 'flat'} s={1.3} />
        </VWorld>
      </VCam>
      <BigText t={t} at={shape} until={eyes - 0.05} text="ALGO ENORME..." size={150} color="#fff" y={1000} />
      <BigText t={t} at={eyes} text={'¡Y TENÍA\nOJOS!'} size={170} color="#FF3B5C" y={1000} wiggle />
      <Flash t={t} at={eyes} dur={0.2} color="#FF3B1F" max={0.5} />
    </AbsoluteFill>
  );
};

const S8End: React.FC<{t: number}> = ({t}) => (
  <EndV2 t={t} at={T('qué')} question={'¿QUÉ HARÍAS TÚ\nSIN SOL?'} c1="#02030F" c2="#14213D">
    <Stars />
  </EndV2>
);

const Overlay: React.FC<{t: number}> = ({t}) => (
  <>
    <BigText t={t} at={0.15} until={1.35} text={'¿Y SI EL SOL\nDESAPARECE?'} size={140} y={330} color="#FFE24A" />
    <BigText t={t} at={1.4} until={T('eso') - 0.05} text={'NO TE ENTERARÍAS\nHASTA DENTRO DE'} size={90} y={300} color="#fff" />
    <BigText t={t} at={T('8')} until={T('eso') - 0.05} text="8 MIN 20 S" size={190} y={560} color="#FFE24A" wiggle />
    <BigText t={t} at={T('eso')} until={T('yo') - 0.05} text={'LO QUE TARDA\nSU LUZ'} size={130} y={330} color="#FFE24A" />
  </>
);

export const SolShort: React.FC = () => (
  <ShellV2 name="sol" words={words as any} keys={KEYS} overlay={Overlay} scenes={[
    [0, S1Hook], [T('eso'), S2Light], [T('yo'), S3Beach], [T('y', 2), S4Dark], [T('semana') - 0.3, S5Freeze],
    [T('corrimos'), S6Cave], [T('noche') - 0.4, S7Eyes], [T('qué'), S8End],
  ]} />
);

export const SolThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#02030F'}}>
    <VWorld>
      <Stars n={140} />
      <circle cx={540} cy={820} r={330} fill="#000" stroke="#1B263B" strokeWidth={10} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <ellipse cx={540 + d * 130} cy={820} rx={95} ry={70} fill="#FF3B1F" filter="url(#blurGlow)" />
          <ellipse cx={540 + d * 130} cy={820} rx={80} ry={56} fill="#FFE24A" />
          <ellipse cx={540 + d * 130} cy={820} rx={14} ry={50} fill="#111" />
        </g>
      ))}
      <V2 x={540} y={1620} t={0} pose={POSES.scared} eyes="wide" mouth="o" s={1.6} />
    </VWorld>
    <ThumbTitle a="EL SOL DESAPARECIÓ" b="Y VI ESTO EN EL CIELO" pill="¡8 MINUTOS!" />
  </AbsoluteFill>
);

export {pop, Sparkles};
