import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VWorld, VCam, V2, makeT, EndV2, ShellV2, ThumbTitle, POSES, W, H, GROUND} from '../../kitV2';
import {BigText, Flash, SpeedLines, pop, ramp, easeOut, rnd, sumShake} from '../../fx';
import words from './words.json';

export const DURATION_S = 57.5;
const T = makeT(words as any);
const KEYS = /8|días|gta|6|19|noviembre|retrasos|2025|mayo|youtube|90|millones|24|horas|música|leonida|florida|vice|city|lucía|jason|ps5|xbox|pc|nada|caro|historia/i;
const PINK = '#FF4FA3';

// atardecer neon tipo Miami (sin logos de nadie)
const Sunset: React.FC<{t: number; scroll?: number}> = ({t, scroll = 0}) => (
  <g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2B0A5A" /><stop offset="0.55" stopColor="#FF2E88" /><stop offset="1" stopColor="#FFB347" /></linearGradient>
    </defs>
    <rect width={W} height={GROUND} fill="url(#sky)" />
    <circle cx={540} cy={900} r={260} fill="#FFE24A" opacity={0.9} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={260} y={860 + i * 50} width={560} height={14 + i * 4} fill="#FF2E88" />)}
    {Array.from({length: 7}).map((_, i) => {
      const x = ((i * 220 - scroll) % 1540 + 1540) % 1540 - 230;
      const h = 380 + rnd(i) * 300;
      return <rect key={i} x={x} y={GROUND - h} width={150} height={h} fill="#1B0638" stroke="#111" strokeWidth={5} />;
    })}
    {Array.from({length: 4}).map((_, i) => {
      const x = ((i * 380 + 120 - scroll * 1.6) % 1520 + 1520) % 1520 - 200;
      return (
        <g key={i} transform={`translate(${x} ${GROUND})`}>
          <path d="M 0 0 Q 10 -200 -10 -380" stroke="#3A1A0A" strokeWidth={18} fill="none" />
          {[-60, -20, 20, 60, 100].map((a) => <path key={a} d={`M -10 -380 q ${Math.cos((a * Math.PI) / 180) * 110} ${-40 + Math.sin((a * Math.PI) / 180) * 60} ${Math.cos((a * Math.PI) / 180) * 180} 40`} stroke="#0E5A3A" strokeWidth={22} fill="none" strokeLinecap="round" />)}
        </g>
      );
    })}
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#241B2F" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={((i * 260 - scroll * 3) % 2080 + 2080) % 2080 - 200} y={GROUND + 120} width={130} height={18} fill="#FFE24A" />)}
  </g>
);
const Car: React.FC<{x: number; y?: number; t: number; color?: string; s?: number}> = ({x, y = GROUND + 60, t, color = '#FF2E88', s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 0 L -300 -80 Q -290 -110 -220 -120 L -120 -200 L 120 -200 L 210 -120 Q 300 -110 300 -60 L 300 0 Z" fill={color} stroke="#111" strokeWidth={9} strokeLinejoin="round" />
    <path d="M -100 -185 L -10 -185 L -10 -125 L -170 -125 Z M 10 -185 L 110 -185 L 180 -125 L 10 -125 Z" fill="#9BE7FF" stroke="#111" strokeWidth={6} />
    {[-180, 180].map((wx) => (
      <g key={wx} transform={`translate(${wx} 0) rotate(${t * 900})`}>
        <circle r={62} fill="#222" stroke="#111" strokeWidth={8} />
        <circle r={26} fill="#bbb" />
        <line x1={-26} y1={0} x2={26} y2={0} stroke="#555" strokeWidth={6} />
      </g>
    ))}
  </g>
);
const PoliceLights: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: Math.floor(t * 6) % 2 ? 'rgba(255,0,60,0.22)' : 'rgba(0,90,255,0.22)', mixBlendMode: 'screen'}} />
);

const S1Hook: React.FC<{t: number}> = ({t}) => {
  const cuts = [0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.7, 4.4];
  const i = cuts.filter((c) => t >= c).length - 1;
  const sh = sumShake(t, cuts.map((c) => [c, 0.3, 26] as [number, number, number]));
  const zoom = [1, 1.6, 1.15, 1.8, 1.2, 1.5, 1.1, 1.7][i];
  return (
    <AbsoluteFill>
      <VCam s={zoom + (t - cuts[i]) * 0.15} oy={1250} x={sh.x} y={sh.y}>
        <VWorld>
          <Sunset t={t} scroll={t * 1400} />
          <Car x={540 + Math.sin(t * 12) * 10} t={t} />
          <V2 x={500} y={GROUND - 110} t={t} s={0.75} pose={POSES.cheer} eyes="wide" mouth="grin" shadow={false} />
        </VWorld>
      </VCam>
      <SpeedLines t={t} opacity={0.5} />
      <PoliceLights t={t} />
      <Flash t={t} at={0} dur={0.2} />
      <Flash t={t} at={T('gta')} dur={0.25} color="#FFE24A" />
    </AbsoluteFill>
  );
};

const Cal: React.FC<{x: number; y: number; top: string; big: string; s?: number; state?: 'x' | 'ok' | ''; k?: number}> = ({x, y, top, big, s = 1, state = '', k = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * k})`}>
    <rect x={-210} y={-200} width={420} height={400} rx={26} fill="#fff" stroke="#111" strokeWidth={10} />
    <rect x={-210} y={-200} width={420} height={110} rx={26} fill="#E0002A" stroke="#111" strokeWidth={10} />
    <text textAnchor="middle" y={-122} fontFamily="Luckiest" fontSize={64} fill="#fff">{top}</text>
    <text textAnchor="middle" y={95} fontFamily="Luckiest" fontSize={big.length > 3 ? 120 : 170} fill="#111">{big}</text>
    {state === 'x' && <g stroke="#E0002A" strokeWidth={34} strokeLinecap="round"><line x1={-180} y1={-170} x2={180} y2={170} /><line x1={180} y1={-170} x2={-180} y2={170} /></g>}
    {state === 'ok' && <path transform="translate(170 170) scale(0.55)" d="M -120 20 L -30 110 L 150 -90" stroke="#2DC653" strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </g>
);

const S2Date: React.FC<{t: number}> = ({t}) => {
  const a = T('2025'), b = T('mayo'), c = T('noviembre', 2);
  const phase = t < a - 0.1 ? 0 : t < b ? 1 : t < c ? 2 : 3;
  return (
    <AbsoluteFill style={{background: '#1B0638'}}>
      <VCam s={1 + 0.04 * Math.sin(t * 4)} x={sumShake(t, [[a + 0.6, 0.4, 24], [b + 0.3, 0.4, 24], [c, 0.4, 30]]).x}>
        <VWorld>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#2a2440" />
          {phase === 0 && <Cal x={540} y={620} top="NOV" big="19" s={1.3} k={pop(t, T('sale'))} />}
          {phase === 1 && <Cal x={540} y={620} top="OTOÑO" big="2025" s={1.2} state={t > a + 0.6 ? 'x' : ''} k={pop(t, a - 0.1)} />}
          {phase === 2 && <Cal x={540} y={620} top="MAYO" big="2026" s={1.2} state={t > b + 0.3 ? 'x' : ''} k={pop(t, b)} />}
          {phase === 3 && <Cal x={540} y={620} top="19 NOV" big="2026" s={1.3} state="ok" k={pop(t, c)} />}
          <V2 x={540} t={t} s={1.2} pose={phase === 3 ? POSES.cheer : phase > 0 ? POSES.fists : POSES.point} eyes={phase === 3 ? 'happy' : phase > 0 ? 'angry' : 'normal'} mouth={phase === 3 ? 'grin' : phase > 0 ? 'frown' : 'flat'} />
        </VWorld>
      </VCam>
      <BigText t={t} at={T('dos')} until={c - 0.05} text="¡2 RETRASOS!" size={150} y={250} color="#FF3B5C" wiggle />
      <BigText t={t} at={c} text="¡POR FIN!" size={190} y={250} color="#2DC653" />
    </AbsoluteFill>
  );
};

const S3Trailer: React.FC<{t: number}> = ({t}) => {
  const k = easeOut(ramp(t, T('más'), T('horas') + 0.3));
  const views = Math.floor(k * 90_000_000);
  const rec = t > T('ningún');
  return (
    <AbsoluteFill style={{background: '#0B1026'}}>
      <VCam s={rec ? 1.08 : 1} x={sumShake(t, [[T('ningún'), 0.5, 26]]).x}>
        <VWorld>
          <rect x={90} y={380} width={900} height={560} rx={30} fill="#111" stroke="#444" strokeWidth={12} />
          <rect x={120} y={410} width={840} height={500} rx={16} fill="#FF2E88" /><rect x={120} y={700} width={840} height={210} fill="#2B0A5A" />
          <circle cx={540} cy={660} r={120} fill="#FFE24A" />
          <path d="M 500 600 L 500 720 L 600 660 Z" fill="#E0002A" stroke="#111" strokeWidth={6} />
          <rect x={120} y={890} width={840 * Math.min(1, (t - T('su')) / 6)} height={18} fill="#E0002A" />
          <text x={590} y={1100} textAnchor="middle" fontFamily="Luckiest" fontSize={110} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</text>
          <text x={540} y={1180} textAnchor="middle" fontFamily="Luckiest" fontSize={60} fill="#aaa">VISITAS</text>
          {rec && (
            <g transform={`translate(780 450) rotate(-14) scale(${pop(t, T('ningún'))})`}>
              <rect x={-220} y={-70} width={440} height={140} rx={20} fill="none" stroke="#E0002A" strokeWidth={14} />
              <text textAnchor="middle" y={35} fontFamily="Luckiest" fontSize={100} fill="#E0002A">RÉCORD</text>
            </g>
          )}
          <V2 x={160} y={1300} t={t} s={0.8} pose={POSES.scared} eyes="wide" mouth="o" />
        </VWorld>
      </VCam>
      <BigText t={t} at={T('rompió')} until={T('más') - 0.05} text={'¡ROMPIÓ\nYOUTUBE!'} size={150} y={230} color="#FFE24A" wiggle />
      <BigText t={t} at={T('24')} text="EN SOLO 24 H" size={130} y={230} color="#FF3B5C" />
    </AbsoluteFill>
  );
};

const S4Map: React.FC<{t: number}> = ({t}) => {
  const vice = t > T('vice') - 0.1;
  if (vice) {
    const on = Math.floor(t * 8) % 7 !== 0;
    return (
      <AbsoluteFill>
        <VCam s={1.1 + 0.2 * ramp(t, T('vice'), T('vice') + 1.5)} oy={900}>
          <VWorld>
            <Sunset t={t} scroll={t * 120} />
            <g transform={`translate(540 520) rotate(-6) scale(${pop(t, T('vice') - 0.1)})`} opacity={on ? 1 : 0.5}>
              <text textAnchor="middle" fontFamily="Luckiest" fontSize={190} fill="none" stroke={PINK} strokeWidth={30} filter="url(#blurGlow)">VICE CITY</text>
              <text textAnchor="middle" fontFamily="Luckiest" fontSize={190} fill="#fff" stroke={PINK} strokeWidth={8}>VICE CITY</text>
            </g>
            <V2 x={540} t={t} s={1.2} pose={POSES.cheer} eyes="happy" mouth="grin" />
          </VWorld>
        </VCam>
      </AbsoluteFill>
    );
  }
  const k = easeOut(ramp(t, T('leonida'), T('leonida') + 0.6));
  return (
    <AbsoluteFill style={{background: '#1E88E5'}}>
      <VCam s={1 + 0.5 * k} oy={1000}>
        <VWorld>
          {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${rnd(i) * W} ${rnd(i + 2) * H} q 25 -15 50 0 q 25 15 50 0`} stroke="#90CAF9" strokeWidth={6} fill="none" />)}
          {/* peninsula estilo Florida */}
          <path d="M 120 380 L 820 380 L 850 470 L 690 520 L 720 700 L 790 900 L 840 1120 L 800 1330 L 720 1420 L 640 1360 L 600 1180 L 520 1000 L 430 830 L 360 620 L 300 520 L 120 520 Z" fill="#5BBF4A" stroke="#111" strokeWidth={10} strokeLinejoin="round" />
          <circle cx={780} cy={1260} r={26} fill={PINK} stroke="#111" strokeWidth={6} />
          <V2 x={600} y={900} t={t} s={0.7} pose={POSES.point} shadow={false} />
        </VWorld>
      </VCam>
      <BigText t={t} at={T('leonida')} text="LEONIDA" size={190} y={260} color="#FFE24A" />
      <BigText t={t} at={T('florida')} text={'(UNA FLORIDA\nLOQUÍSIMA)'} size={90} y={1520} color="#fff" />
    </AbsoluteFill>
  );
};

const Bag: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -50 -90 Q -70 -60 -70 -20 Q -70 30 0 30 Q 70 30 70 -20 Q 70 -60 50 -90 Z" fill="#C9A25E" stroke="#111" strokeWidth={7} />
    <text textAnchor="middle" y={5} fontFamily="Luckiest" fontSize={60} fill="#2D6A4F">$</text>
  </g>
);
const S5Duo: React.FC<{t: number}> = ({t}) => {
  const lu = t > T('lucía') - 0.1, ja = t > T('jason') - 0.1;
  return (
    <AbsoluteFill>
      <VWorld>
        <Sunset t={t} scroll={500} />
        {lu && <V2 x={ja ? 340 : 540} t={t} s={1.3} color={PINK} pose={POSES.hips} eyes="angry" mouth="flat" />}
        {ja && <V2 x={740} t={t} s={1.3} pose={POSES.fists} eyes="angry" mouth="flat" flip />}
        {/* antifaces de ladron */}
        {lu && <rect x={(ja ? 340 : 540) - 34} y={GROUND - 1.3 * 318} width={68} height={22} rx={10} fill="#111" opacity={0.85} />}
        {ja && <rect x={740 - 34} y={GROUND - 1.3 * 318} width={68} height={22} rx={10} fill="#111" opacity={0.85} />}
        {t > T('ladrones') && <><Bag x={220} y={GROUND} /><Bag x={870} y={GROUND} /></>}
        {!lu && <text x={540} y={1000} textAnchor="middle" fontFamily="Luckiest" fontSize={300} fill="#fff" stroke="#111" strokeWidth={12} paintOrder="stroke">?</text>}
      </VWorld>
      <BigText t={t} at={T('primera')} until={T('lucía') - 0.05} text={'POR PRIMERA VEZ\nEN AÑOS...'} size={110} y={250} color="#fff" />
      <BigText t={t} at={T('lucía')} until={T('jason') - 0.05} text="LUCÍA" size={200} y={250} color={PINK} />
      <BigText t={t} at={T('jason')} text={'LUCÍA + JASON'} size={140} y={250} color="#FFE24A" />
      <Flash t={t} at={T('lucía') - 0.1} dur={0.25} color={PINK} max={0.6} />
    </AbsoluteFill>
  );
};

const Box: React.FC<{x: number; y: number; label: string; ok: boolean | null; k: number}> = ({x, y, label, ok, k}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-150} y={-110} width={300} height={220} rx={26} fill={ok === false ? '#3A0008' : '#111'} stroke="#fff" strokeWidth={8} />
    <text textAnchor="middle" y={-10} fontFamily="Luckiest" fontSize={label.length > 3 ? 72 : 96} fill="#fff">{label}</text>
    {ok === true && <path d="M -50 50 L -10 85 L 60 15" stroke="#2DC653" strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    {ok === false && <g stroke="#E0002A" strokeWidth={20} strokeLinecap="round"><line x1={-40} y1={20} x2={40} y2={95} /><line x1={40} y1={20} x2={-40} y2={95} /></g>}
  </g>
);
const S6Plat: React.FC<{t: number}> = ({t}) => {
  const pc = T('pc'), no = T('nada');
  return (
    <AbsoluteFill style={{background: '#14213D'}}>
      <VCam x={sumShake(t, [[no, 0.5, 30]]).x}>
        <VWorld>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#2a2440" />
          <Box x={290} y={420} label="PS5" ok={true} k={pop(t, T('ps5'))} />
          {t > T('xbox') - 0.1 && <Box x={790} y={420} label="XBOX" ok={true} k={pop(t, T('xbox') - 0.1)} />}
          {t > pc - 0.1 && <Box x={540} y={720} label="PC" ok={t > no ? false : null} k={pop(t, pc - 0.1) * (t > no ? 1 + 0.05 * Math.sin(t * 20) : 1)} />}
          <V2 x={540} t={t} s={1.15} pose={t > no ? POSES.headHold : t > pc ? POSES.shrug : POSES.cheer} eyes={t > no ? 'scared' : 'happy'} mouth={t > no ? 'frown' : 'grin'} />
        </VWorld>
      </VCam>
      <BigText t={t} at={pc} until={no - 0.05} text="¿Y EN PC?" size={150} y={1000} color="#fff" />
      <BigText t={t} at={no} text="NADA... 😭" size={160} y={1000} color="#FF3B5C" wiggle />
    </AbsoluteFill>
  );
};

const S7Money: React.FC<{t: number}> = ({t}) => {
  const st = T('y', 7);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle, #2D6A4F 0%, #081C15 100%)'}}>
      <VWorld>
        {Array.from({length: 26}).map((_, i) => {
          const y = ((t - st) * (300 + rnd(i) * 400) + rnd(i + 5) * H) % (H + 200) - 100;
          return (
            <g key={i} transform={`translate(${rnd(i + 1) * W} ${y}) rotate(${(t * 90 + i * 40) % 360})`}>
              <rect x={-70} y={-34} width={140} height={68} rx={8} fill="#52B788" stroke="#111" strokeWidth={5} />
              <text textAnchor="middle" y={18} fontFamily="Luckiest" fontSize={48} fill="#1B4332">$</text>
            </g>
          );
        })}
        <V2 x={540} t={t} s={1.3} pose={POSES.armsUp} eyes="wide" mouth="o" />
      </VWorld>
      <BigText t={t} at={st} until={T('dicen') - 0.05} text={'Y LO MÁS\nLOCO...'} size={150} y={300} color="#fff" />
      <BigText t={t} at={T('caro')} text={'EL JUEGO MÁS\nCARO DE LA\nHISTORIA'} size={130} y={330} color="#FFE24A" wiggle />
    </AbsoluteFill>
  );
};

const S8End: React.FC<{t: number}> = ({t}) => <EndV2 t={t} at={T('lo', 3)} question={'¿LO JUGARÁS\nEL PRIMER\nDÍA?'} c1="#2B0A5A" c2="#FF2E88" />;

const Overlay: React.FC<{t: number}> = ({t}) => (
  <>
    <BigText t={t} at={0.05} until={T('gta') - 0.05} text={'FALTAN\n8 DÍAS'} size={210} y={340} color="#FFE24A" wiggle />
    <BigText t={t} at={T('gta')} until={T('y') - 0.05} text="GTA 6" size={260} y={340} color="#fff" />
    <BigText t={t} at={T('y')} until={T('sale') - 0.05} text={'LO QUE CASI\nNADIE SABE 🤫'} size={120} y={340} color="#fff" />
  </>
);

export const Gta6Short: React.FC = () => (
  <ShellV2 name="gta6" words={words as any} keys={KEYS} overlay={Overlay} scenes={[
    [0, S1Hook], [T('sale'), S2Date], [T('su'), S3Trailer], [T('la'), S4Map], [T('y', 4), S5Duo],
    [T('saldrá'), S6Plat], [T('y', 7), S7Money], [T('lo', 3), S8End],
  ]} />
);

export const Gta6Thumb: React.FC = () => (
  <AbsoluteFill>
    <VWorld>
      <Sunset t={0} scroll={300} />
      <Car x={540} y={GROUND + 120} t={0} s={1.2} />
      <V2 x={540} y={GROUND - 60} t={0} s={1.3} pose={POSES.cheer} eyes="wide" mouth="grin" shadow={false} />
    </VWorld>
    <ThumbTitle a="GTA 6" b="FALTAN 8 DÍAS" pill="¡19 DE NOVIEMBRE!" />
  </AbsoluteFill>
);
