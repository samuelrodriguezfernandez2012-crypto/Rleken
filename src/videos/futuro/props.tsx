import React from 'react';
import {LW, LH, GY, rnd} from './kit';
import {NPC, Hero, POSES} from '../largo1/kit';

export const VIOLET = '#7B2CBF';
export const GRAY = '#6C757D';

// ---------- personajes ----------
export const Vera: React.FC<{x: number; y?: number; s?: number; pose?: any; eyes?: any; mouth?: any; flip?: boolean; t: number; look?: number}> = ({x, y = GY, s = 1.2, pose = POSES.idle, eyes = 'normal', mouth = 'flat', flip, t, look}) => (
  <g>
    {/* coleta oscura detras de la cabeza */}
    <path d={`M ${x + (flip ? 30 : -30) * s} ${y - 330 * s} q ${(flip ? 70 : -70) * s} ${20 * s} ${(flip ? 50 : -50) * s} ${110 * s}`} stroke="#1A0B2E" strokeWidth={26 * s} fill="none" strokeLinecap="round" />
    <NPC x={x} y={y} s={s} color={VIOLET} pose={pose} eyes={eyes} mouth={mouth} flip={flip} t={t} look={look} />
    <path d={`M ${x - 40 * s} ${y - 340 * s} Q ${x} ${y - 378 * s} ${x + 40 * s} ${y - 340 * s}`} stroke="#1A0B2E" strokeWidth={16 * s} fill="none" strokeLinecap="round" />
  </g>
);
export const Suit: React.FC<{x: number; y?: number; s?: number; pose?: any; flip?: boolean; t: number; eyes?: any}> = ({x, y = GY, s = 1.15, pose, flip, t, eyes = 'angry'}) => (
  <g>
    <NPC x={x} y={y} s={s} color={GRAY} pose={pose} flip={flip} t={t} eyes={eyes} />
    <rect x={x - 34 * s} y={y - 300 * s} width={68 * s} height={14 * s} rx={6} fill="#111" />
  </g>
);
export {Hero, NPC, POSES};

// ---------- fondos ----------
export const CityNight: React.FC<{lights?: boolean; t?: number; noSky?: boolean}> = ({lights = true, noSky}) => (
  <g>
    {!noSky && <rect width={LW} height={LH} fill="#140F2E" />}
    {!noSky && <circle cx={1500} cy={200} r={70} fill="#F4F1DE" opacity={0.9} />}
    {Array.from({length: 16}).map((_, i) => {
      const w = 110 + rnd(i) * 80, h = 260 + rnd(i + 3) * 420, x = i * 125 - 30;
      return (
        <g key={i}>
          <rect x={x} y={GY - h} width={w} height={h + 200} fill={i % 2 ? '#241B47' : '#2E2257'} />
          {lights && Array.from({length: Math.floor(h / 55)}).map((__, j) => Array.from({length: 3}).map((___, k) => (
            rnd(i * 31 + j * 7 + k) > 0.45 ? <rect key={`${j}-${k}`} x={x + 16 + k * (w - 32) / 3} y={GY - h + 22 + j * 55} width={18} height={24} fill="#FFD59A" opacity={0.85} /> : null
          )))}
        </g>
      );
    })}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#0F0B22" />
  </g>
);

export const Room: React.FC<{night?: boolean; wall?: string}> = ({night, wall}) => (
  <g>
    <rect width={LW} height={GY} fill={wall ?? (night ? '#2A2550' : '#E9D8C4')} />
    <rect x={1250} y={170} width={420} height={320} rx={12} fill={night ? '#0B1026' : '#9ED8FF'} stroke="#3A2E2A" strokeWidth={12} />
    <line x1={1460} y1={170} x2={1460} y2={490} stroke="#3A2E2A" strokeWidth={8} />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill={night ? '#2B2238' : '#A9784F'} />
  </g>
);

export const Library: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#3B2A22" />
    {Array.from({length: 6}).map((_, i) => (
      <g key={i} transform={`translate(${i * 330 - 20} 120)`}>
        <rect width={300} height={700} fill="#5C3D2E" stroke="#2A1A12" strokeWidth={8} />
        {Array.from({length: 6}).map((__, j) => (
          <g key={j}>
            <rect x={10} y={20 + j * 112} width={280} height={8} fill="#2A1A12" />
            {Array.from({length: 9}).map((___, k) => <rect key={k} x={16 + k * 30} y={20 + j * 112 - 70 - rnd(i * 50 + j * 9 + k) * 20} width={24} height={70 + rnd(i * 50 + j * 9 + k) * 20} fill={['#9D0208', '#386641', '#1D3557', '#E9C46A', '#6D597A'][(i + j + k) % 5]} />)}
          </g>
        ))}
      </g>
    ))}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#2A1A12" />
  </g>
);
export const LibTable: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 420} y={700} width={840} height={34} rx={6} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <rect x={x - 390} y={734} width={24} height={166} fill="#6B4226" />
    <rect x={x + 366} y={734} width={24} height={166} fill="#6B4226" />
    <rect x={x - 60} y={600} width={14} height={100} fill="#333" />
    <path d={`M ${x - 110} ${600} L ${x - 10} ${600} L ${x - 30} ${560} L ${x - 90} ${560} Z`} fill="#2D6A4F" stroke="#111" strokeWidth={5} />
    <circle cx={x - 60} cy={606} r={60} fill="#FFE8A3" opacity={0.25} />
  </g>
);

export const Fair: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={LW} height={LH} fill="#1A1033" />
    <g transform="translate(1500 470)">
      <circle r={330} fill="none" stroke="#3A2D5C" strokeWidth={16} />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + t * 0.15;
        return (
          <g key={i}>
            <line x1={0} y1={0} x2={Math.cos(a) * 330} y2={Math.sin(a) * 330} stroke="#3A2D5C" strokeWidth={6} />
            <circle cx={Math.cos(a) * 330} cy={Math.sin(a) * 330} r={22} fill={['#FF4D6D', '#FFD23F', '#4CC9F0'][i % 3]} />
          </g>
        );
      })}
    </g>
    {Array.from({length: 26}).map((_, i) => <circle key={i} cx={i * 78} cy={260 + Math.sin(i) * 30} r={9} fill={['#FFD23F', '#FF4D6D', '#80FFDB'][i % 3]} opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 3 + i))} />)}
    <path d={`M 0 ${260} ${Array.from({length: 26}).map((_, i) => `L ${i * 78} ${260 + Math.sin(i) * 30}`).join(' ')}`} stroke="#333" strokeWidth={3} fill="none" />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#2A1E3F" />
  </g>
);
export const Booth: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 380} y={360} width={760} height={540} fill="#7B1E3A" stroke="#111" strokeWidth={8} />
    {Array.from({length: 8}).map((_, i) => <path key={i} d={`M ${x - 380 + i * 95} 300 l 95 0 l 0 70 q -47 40 -95 0 Z`} fill={i % 2 ? '#fff' : '#E63946'} stroke="#111" strokeWidth={5} />)}
    <rect x={x - 400} y={700} width={800} height={40} fill="#B07940" stroke="#111" strokeWidth={6} />
  </g>
);
export const Roulette: React.FC<{x: number; y: number; r?: number; angle: number; hi?: number}> = ({x, y, r = 220, angle, hi}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r + 18} fill="#3A2E2A" stroke="#111" strokeWidth={8} />
    <g transform={`rotate(${angle})`}>
      {Array.from({length: 16}).map((_, i) => {
        const a0 = (i / 16) * Math.PI * 2, a1 = ((i + 1) / 16) * Math.PI * 2;
        return (
          <g key={i}>
            <path d={`M 0 0 L ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`} fill={hi === i + 1 ? '#FFD23F' : i % 2 ? '#E63946' : '#1D1D1D'} stroke="#111" strokeWidth={3} />
            <text x={Math.cos((a0 + a1) / 2) * r * 0.75} y={Math.sin((a0 + a1) / 2) * r * 0.75 + 12} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#fff" transform={`rotate(${((a0 + a1) / 2) * 57.3 + 90} ${Math.cos((a0 + a1) / 2) * r * 0.75} ${Math.sin((a0 + a1) / 2) * r * 0.75})`}>{i + 1}</text>
          </g>
        );
      })}
    </g>
    <circle r={30} fill="#FFD23F" stroke="#111" strokeWidth={6} />
    <path d={`M -22 ${-r - 40} L 22 ${-r - 40} L 0 ${-r + 6} Z`} fill="#fff" stroke="#111" strokeWidth={5} />
  </g>
);
export const Plush: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-55} cy={-210} r={34} fill="#C68B59" stroke="#111" strokeWidth={6} />
    <circle cx={55} cy={-210} r={34} fill="#C68B59" stroke="#111" strokeWidth={6} />
    <ellipse cx={0} cy={-60} rx={110} ry={90} fill="#C68B59" stroke="#111" strokeWidth={7} />
    <circle cx={0} cy={-170} r={80} fill="#C68B59" stroke="#111" strokeWidth={7} />
    <ellipse cx={0} cy={-145} rx={34} ry={24} fill="#E9C39B" />
    <circle cx={-26} cy={-185} r={8} fill="#111" />
    <circle cx={26} cy={-185} r={8} fill="#111" />
  </g>
);

export const Cup: React.FC<{x: number; y: number; rot?: number; broken?: number}> = ({x, y, rot = 0, broken = 0}) => (
  broken > 0 ? (
    <g>
      {Array.from({length: 9}).map((_, i) => <path key={i} transform={`translate(${x + (rnd(i) - 0.5) * 300 * broken} ${y + rnd(i + 2) * 30}) rotate(${rnd(i + 4) * 360})`} d="M 0 -14 L 16 0 L 4 14 L -12 4 Z" fill="#fff" stroke="#111" strokeWidth={3} />)}
      <ellipse cx={x} cy={y + 20} rx={160 * broken} ry={20 * broken} fill="#6F4518" opacity={0.85} />
    </g>
  ) : (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M -40 -70 L 40 -70 L 32 0 L -32 0 Z" fill="#fff" stroke="#111" strokeWidth={6} />
      <path d="M 38 -55 q 34 0 28 26 q -4 20 -32 14" stroke="#111" strokeWidth={6} fill="none" />
      <rect x={-34} y={-66} width={68} height={10} fill="#6F4518" />
      <path d="M -10 -90 q 8 -12 0 -24 M 12 -90 q 8 -12 0 -24" stroke="#fff" strokeWidth={4} opacity={0.6} fill="none" />
    </g>
  )
);
export const Door: React.FC<{x: number; open?: number}> = ({x, open = 0}) => (
  <g>
    <rect x={x - 110} y={360} width={220} height={540} fill="#1A1410" stroke="#3A2E2A" strokeWidth={10} />
    <rect x={x - 110} y={360} width={220 * (1 - open * 0.8)} height={540} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <circle cx={x - 110 + 220 * (1 - open * 0.8) - 26} cy={640} r={10} fill="#FFD23F" />
  </g>
);

export const Bike: React.FC<{x: number; y?: number; t: number; s?: number}> = ({x, y = GY, t, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-110, 110].map((wx) => (
      <g key={wx} transform={`translate(${wx} -70) rotate(${t * 500})`}>
        <circle r={70} fill="none" stroke="#111" strokeWidth={9} />
        <line x1={-70} y1={0} x2={70} y2={0} stroke="#555" strokeWidth={3} />
        <line x1={0} y1={-70} x2={0} y2={70} stroke="#555" strokeWidth={3} />
      </g>
    ))}
    <path d="M -110 -70 L -20 -70 L 40 -170 L -60 -170 Z M 40 -170 L 110 -70 M -20 -70 L -60 -190" stroke="#E63946" strokeWidth={11} fill="none" strokeLinejoin="round" />
    <line x1={40} y1={-170} x2={50} y2={-210} stroke="#111" strokeWidth={9} />
    <line x1={30} y1={-210} x2={80} y2={-210} stroke="#111" strokeWidth={9} strokeLinecap="round" />
  </g>
);
export const Ball: React.FC<{x: number; y: number; r?: number; c?: string}> = ({x, y, r = 36, c = '#FF4D6D'}) => (
  <g><circle cx={x} cy={y} r={r} fill={c} stroke="#111" strokeWidth={6} /><path d={`M ${x - r} ${y} q ${r} ${-r * 0.6} ${2 * r} 0`} stroke="#fff" strokeWidth={5} fill="none" /></g>
);

export const School: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#E8A87C" />
    <rect x={150} y={180} width={1100} height={560} fill="#C38D6B" stroke="#6B4226" strokeWidth={10} />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={200 + (i % 5) * 210} y={230 + Math.floor(i / 5) * 230} width={150} height={150} fill="#9ED8FF" stroke="#6B4226" strokeWidth={8} />)}
    <rect x={0} y={740} width={LW} height={160} fill="#9AA5B1" />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#4A4E69" />
  </g>
);
export const BlackCar: React.FC<{x: number; y?: number; s?: number}> = ({x, y = GY, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -260 -20 L -260 -100 Q -250 -130 -190 -135 L -110 -210 L 120 -210 L 190 -135 Q 260 -130 260 -80 L 260 -20 Z" fill="#111" stroke="#000" strokeWidth={6} />
    <path d="M -95 -195 L -5 -195 L -5 -140 L -160 -140 Z M 15 -195 L 110 -195 L 165 -140 L 15 -140 Z" fill="#2B2D42" />
    {[-160, 160].map((wx) => <circle key={wx} cx={wx} cy={-20} r={52} fill="#222" stroke="#000" strokeWidth={8} />)}
  </g>
);
export const Alley: React.FC = () => (
  <g>
    <rect width={LW} height={LH} fill="#15122A" />
    <path d={`M 0 0 L 620 260 L 620 900 L 0 ${LH} Z`} fill="#2A2342" />
    <path d={`M ${LW} 0 L 1300 260 L 1300 900 L ${LW} ${LH} Z`} fill="#231D3A" />
    <rect x={620} y={260} width={680} height={640} fill="#0D0B1C" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={60 + i * 80} y={300 + i * 20} width={40} height={60} fill="#FFD59A" opacity={0.4} transform={`skewY(${22})`} />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#100D1F" />
  </g>
);
export const Bin: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 170} y={640} width={340} height={260} rx={10} fill="#2D6A4F" stroke="#111" strokeWidth={8} />
    <rect x={x - 185} y={610} width={370} height={40} rx={8} fill="#1B4332" stroke="#111" strokeWidth={8} />
  </g>
);
export const TrafficLight: React.FC<{x: number; red?: boolean}> = ({x, red}) => (
  <g>
    <rect x={x - 10} y={420} width={20} height={480} fill="#333" />
    <rect x={x - 50} y={260} width={100} height={220} rx={20} fill="#222" stroke="#111" strokeWidth={6} />
    <circle cx={x} cy={310} r={32} fill={red ? '#FF2D2D' : '#3a1010'} />
    <circle cx={x} cy={420} r={32} fill={red ? '#103a10' : '#2DFF6A'} />
    {red && <circle cx={x} cy={310} r={70} fill="#FF2D2D" opacity={0.25} />}
  </g>
);

export const PowerPlant: React.FC<{dark?: number; t: number}> = ({dark = 0, t}) => (
  <g>
    <rect width={LW} height={LH} fill="#0E0B20" />
    {[300, 640].map((x, i) => (
      <g key={i}>
        <path d={`M ${x - 140} ${GY} Q ${x - 90} ${GY - 280} ${x - 110} ${GY - 520} L ${x + 110} ${GY - 520} Q ${x + 90} ${GY - 280} ${x + 140} ${GY} Z`} fill="#3D3B57" stroke="#111" strokeWidth={6} />
        {Array.from({length: 4}).map((_, j) => <circle key={j} cx={x + Math.sin(t * 0.5 + j) * 30} cy={GY - 560 - j * 60 - ((t * 30) % 60)} r={60 + j * 18} fill="#6C6A85" opacity={0.25 - j * 0.04} />)}
      </g>
    ))}
    {Array.from({length: 5}).map((_, i) => (
      <g key={i} transform={`translate(${1000 + i * 180} ${GY})`}>
        <path d="M -40 0 L 0 -420 L 40 0 M -70 -300 L 70 -300 M -55 -200 L 55 -200" stroke="#555A7A" strokeWidth={8} fill="none" />
        <circle cx={0} cy={-420} r={10} fill={dark > 0.5 ? '#333' : '#FFD23F'} />
      </g>
    ))}
    <path d={`M 1000 ${GY - 300} ${Array.from({length: 5}).map((_, i) => `Q ${1090 + i * 180} ${GY - 250} ${1180 + i * 180} ${GY - 300}`).join(' ')}`} stroke="#222" strokeWidth={4} fill="none" />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#16132A" />
  </g>
);
export const Rooftop: React.FC<{dark?: number}> = ({dark = 0}) => (
  <g>
    <CityNight lights={dark < 0.5} />
    <rect x={0} y={760} width={LW} height={LH - 760} fill="#2B2640" />
    <rect x={0} y={740} width={LW} height={30} fill="#3D3757" stroke="#111" strokeWidth={4} />
  </g>
);
export const Panel: React.FC<{x: number; y?: number; sparks?: number; t: number; on?: boolean}> = ({x, y = 760, sparks = 0, t, on = true}) => (
  <g>
    <rect x={x - 150} y={y - 360} width={300} height={360} rx={12} fill="#495057" stroke="#111" strokeWidth={8} />
    {Array.from({length: 6}).map((_, i) => <circle key={i} cx={x - 90 + (i % 3) * 90} cy={y - 290 + Math.floor(i / 3) * 70} r={16} fill={on ? ['#2DFF6A', '#FFD23F', '#FF4D6D'][i % 3] : '#222'} />)}
    <rect x={x - 100} y={y - 140} width={200} height={70} fill="#212529" />
    <path d={`M ${x + 150} ${y - 200} C ${x + 300} ${y - 200} ${x + 260} ${y - 40} ${x + 420} ${y - 20}`} stroke="#111" strokeWidth={16} fill="none" />
    {sparks > 0 && Array.from({length: 14}).map((_, i) => {
      const a = rnd(i) * Math.PI * 2, d = (40 + rnd(i + 3) * 160) * sparks;
      return <line key={i} x1={x + 150} y1={y - 200} x2={x + 150 + Math.cos(a) * d} y2={y - 200 + Math.sin(a) * d} stroke="#FFE45C" strokeWidth={5} opacity={1 - sparks * 0.5 + 0.2 * Math.sin(t * 40 + i)} />;
    })}
  </g>
);
export const Cap: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 0 Q -90 -100 0 -100 Q 90 -100 90 0 Z" fill="#E63946" stroke="#111" strokeWidth={7} />
    <path d="M 60 0 L 170 10 Q 170 20 60 18 Z" fill="#C1121F" stroke="#111" strokeWidth={6} />
    {Array.from({length: 5}).map((_, i) => <rect key={i} x={-60 + i * 26} y={-30 - (i % 2) * 14} width={30} height={40} fill="#FFF8E7" stroke="#111" strokeWidth={3} transform={`rotate(${(i - 2) * 12} ${-45 + i * 26} -10)`} />)}
  </g>
);
export const Note: React.FC<{x: number; y: number; text: string; k?: number; s?: number}> = ({x, y, text, k = 1, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * (0.3 + 0.7 * k)}) rotate(${-4 + 4 * k})`}>
    <rect x={-260} y={-120} width={520} height={240} fill="#FFF8E7" stroke="#111" strokeWidth={6} />
    {Array.from({length: 4}).map((_, i) => <line key={i} x1={-230} y1={-60 + i * 50} x2={230} y2={-60 + i * 50} stroke="#9ED8FF" strokeWidth={3} />)}
    <text textAnchor="middle" y={30} fontFamily="Montserrat" fontWeight={900} fontSize={110} fill="#111" opacity={k}>{text}</text>
  </g>
);
export const Screen: React.FC<{x: number; y: number; s?: number; children?: React.ReactNode; glow?: string}> = ({x, y, s = 1, children, glow = '#4CC9F0'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-260} width={840} height={520} rx={26} fill="#0A0A12" stroke="#2B2D42" strokeWidth={16} />
    <rect x={-390} y={-230} width={780} height={460} rx={10} fill={glow} opacity={0.25} />
    {children}
  </g>
);
export const PhoneV: React.FC<{x: number; y: number; s?: number; views: string; t: number}> = ({x, y, s = 1, views}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-6)`}>
    <rect x={-160} y={-300} width={320} height={600} rx={40} fill="#1B1B2F" stroke="#111" strokeWidth={10} />
    <rect x={-138} y={-270} width={276} height={420} rx={14} fill="#2B2D42" />
    <path d="M -30 -110 L -30 -10 L 50 -60 Z" fill="#fff" opacity={0.85} />
    <text textAnchor="middle" y={215} fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">{views}</text>
    <text textAnchor="middle" y={262} fontFamily="Montserrat" fontWeight={800} fontSize={24} fill="#aaa">VISITAS</text>
  </g>
);
export const Clock2: React.FC<{x: number; y: number; r?: number; sec: number}> = ({x, y, r = 120, sec}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#F8F9FA" stroke="#111" strokeWidth={10} />
    {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-r * 0.8} x2={0} y2={-r * 0.92} stroke="#111" strokeWidth={6} transform={`rotate(${i * 30})`} />)}
    <line x1={0} y1={0} x2={0} y2={-r * 0.8} stroke="#E63946" strokeWidth={6} strokeLinecap="round" transform={`rotate(${sec * 6})`} />
    <circle r={10} fill="#111" />
  </g>
);
export const Tunnel: React.FC<{dark?: number}> = ({dark = 0}) => (
  <g>
    <rect width={LW} height={LH} fill="#0D0B16" />
    <ellipse cx={LW / 2} cy={560} rx={760} ry={520} fill="#22202E" />
    <ellipse cx={LW / 2} cy={560} rx={560} ry={380} fill="#0D0B16" />
    <rect x={300} y={560} width={1320} height={420} fill="#3D3B57" />
    <rect x={420} y={420} width={1080} height={300} rx={40} fill="#6C757D" stroke="#111" strokeWidth={8} />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={470 + i * 170} y={460} width={120} height={110} rx={10} fill={dark > 0.5 ? '#111' : '#FFE8A3'} />)}
  </g>
);
export const Hospital: React.FC<{dark?: number}> = ({dark = 0}) => (
  <g>
    <rect width={LW} height={LH} fill="#0E1A2B" />
    <rect x={460} y={160} width={1000} height={740} fill="#DDE5ED" stroke="#111" strokeWidth={8} />
    <rect x={880} y={210} width={160} height={160} fill="#E63946" />
    <rect x={930} y={230} width={60} height={120} fill="#fff" /><rect x={900} y={260} width={120} height={60} fill="#fff" />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={520 + (i % 6) * 150} y={420 + Math.floor(i / 6) * 200} width={100} height={130} fill={dark > 0.5 ? '#1B263B' : '#FFE8A3'} />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#16132A" />
  </g>
);
