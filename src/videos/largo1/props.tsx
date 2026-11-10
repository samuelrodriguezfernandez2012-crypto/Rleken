import React from 'react';
import {LW, LH, GY, rnd, pop} from './kit';

// ---------- fondos ----------
export const Kitchen: React.FC<{night?: boolean}> = ({night}) => (
  <g>
    <rect width={LW} height={GY} fill={night ? '#2B3150' : '#F7E3C3'} />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={i * 170} y={0} width={70} height={GY} fill="#000" opacity={0.035} />)}
    <rect x={1260} y={180} width={420} height={300} rx={10} fill={night ? '#0B1026' : '#9ED8FF'} stroke="#111" strokeWidth={10} />
    <line x1={1470} y1={180} x2={1470} y2={480} stroke="#111" strokeWidth={8} />
    {night && <circle cx={1580} cy={260} r={36} fill="#F5F3CE" />}
    <rect x={80} y={520} width={520} height={30} fill="#B07940" stroke="#111" strokeWidth={6} />
    <rect x={100} y={320} width={480} height={200} fill="#E8D5B5" stroke="#111" strokeWidth={6} />
    <line x1={340} y1={320} x2={340} y2={520} stroke="#111" strokeWidth={5} />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill={night ? '#3B2A2A' : '#C98B5A'} />
    {Array.from({length: 10}).map((_, i) => <line key={i} x1={i * 210} y1={GY} x2={i * 210 - 80} y2={LH} stroke="#000" strokeOpacity={0.15} strokeWidth={4} />)}
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Table: React.FC<{x: number; w?: number}> = ({x, w = 520}) => (
  <g>
    <rect x={x - w / 2} y={700} width={w} height={36} rx={8} fill="#B07940" stroke="#111" strokeWidth={7} />
    <rect x={x - w / 2 + 30} y={736} width={22} height={164} fill="#7A4E26" stroke="#111" strokeWidth={5} />
    <rect x={x + w / 2 - 52} y={736} width={22} height={164} fill="#7A4E26" stroke="#111" strokeWidth={5} />
  </g>
);

export const WallClock: React.FC<{x: number; y: number; r?: number; sec: number; min?: number; stopped?: boolean}> = ({x, y, r = 80, sec, min = 10}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#fff" stroke="#111" strokeWidth={9} />
    {Array.from({length: 12}).map((_, i) => (
      <line key={i} x1={Math.sin((i * Math.PI) / 6) * r * 0.78} y1={-Math.cos((i * Math.PI) / 6) * r * 0.78} x2={Math.sin((i * Math.PI) / 6) * r * 0.92} y2={-Math.cos((i * Math.PI) / 6) * r * 0.92} stroke="#111" strokeWidth={5} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.55} stroke="#111" strokeWidth={9} strokeLinecap="round" transform={`rotate(${min * 6})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.8} stroke="#E0002A" strokeWidth={5} strokeLinecap="round" transform={`rotate(${sec * 6})`} />
    <circle r={8} fill="#111" />
  </g>
);

export const Glass: React.FC<{x: number; y: number; rot?: number; drops?: number; t?: number; s?: number}> = ({x, y, rot = 0, drops = 0, t = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -30 -50 L 30 -50 L 24 50 L -24 50 Z" fill="#fff" stroke="#111" strokeWidth={6} />
    <path d="M -27 -20 L 27 -20 L 24 50 L -24 50 Z" fill="#F4F4F4" />
    <path d="M -18 -40 L -14 40" stroke="#BFE6FF" strokeWidth={6} strokeLinecap="round" />
    {Array.from({length: drops}).map((_, i) => (
      <ellipse key={i} cx={-60 + rnd(i) * 140} cy={-90 - rnd(i + 3) * 120 + Math.sin(t * 2 + i) * 2} rx={7 + rnd(i + 5) * 8} ry={9 + rnd(i + 5) * 9} fill="#fff" stroke="#111" strokeWidth={3} />
    ))}
  </g>
);

export const Bedroom: React.FC<{night?: boolean}> = ({night = true}) => (
  <g>
    <rect width={LW} height={GY} fill={night ? '#1E2547' : '#BDE0FE'} />
    <rect x={1300} y={160} width={360} height={280} rx={12} fill="#0B1026" stroke="#111" strokeWidth={10} />
    <circle cx={1560} cy={240} r={40} fill="#F5F3CE" />
    {Array.from({length: 14}).map((_, i) => <circle key={i} cx={1320 + rnd(i) * 320} cy={180 + rnd(i + 2) * 240} r={2 + rnd(i) * 2} fill="#fff" />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#3A2E4F" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
    {/* cama */}
    <rect x={200} y={700} width={760} height={200} rx={20} fill="#5E60CE" stroke="#111" strokeWidth={8} />
    <rect x={170} y={600} width={60} height={300} rx={10} fill="#7A4E26" stroke="#111" strokeWidth={7} />
    <rect x={240} y={650} width={180} height={70} rx={30} fill="#fff" stroke="#111" strokeWidth={6} />
  </g>
);

export const Notebook: React.FC<{x: number; y: number; s?: number; lines: string[]; k?: number; red?: boolean}> = ({x, y, s = 1, lines, k = 1, red}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-4)`}>
    <rect x={-300} y={-200} width={600} height={400} rx={14} fill="#FFFBEA" stroke="#111" strokeWidth={9} />
    {Array.from({length: 7}).map((_, i) => <line key={i} x1={-270} y1={-130 + i * 52} x2={270} y2={-130 + i * 52} stroke="#9ED8FF" strokeWidth={3} />)}
    <line x1={-220} y1={-200} x2={-220} y2={200} stroke="#FF8FA3" strokeWidth={3} />
    {Array.from({length: 8}).map((_, i) => <circle key={i} cx={-300} cy={-170 + i * 48} r={10} fill="#ccc" stroke="#111" strokeWidth={3} />)}
    {lines.map((l, i) => {
      const vis = Math.max(0, Math.min(l.length, Math.floor((k * lines.length - i) * l.length)));
      return (
        <text key={i} x={-200} y={-140 + i * 52} fontFamily="Luckiest" fontSize={38} fill={red && i === lines.length - 1 ? '#E0002A' : '#1B263B'}>
          {l.slice(0, vis)}
        </text>
      );
    })}
  </g>
);

export const Classroom: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#F1E3C6" />
    <rect x={460} y={140} width={1000} height={420} rx={14} fill="#2F5D50" stroke="#8B5A3C" strokeWidth={18} />
    <text x={960} y={330} textAnchor="middle" fontFamily="Luckiest" fontSize={90} fill="#fff" opacity={0.9}>EXAMEN DE MATES</text>
    <text x={960} y={460} textAnchor="middle" fontFamily="Luckiest" fontSize={70} fill="#fff" opacity={0.6}>3x + 7 = 22</text>
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#C49A6C" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Desk: React.FC<{x: number; paper?: string}> = ({x, paper}) => (
  <g>
    <rect x={x - 150} y={760} width={300} height={30} rx={6} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <rect x={x - 130} y={790} width={18} height={110} fill="#111" />
    <rect x={x + 112} y={790} width={18} height={110} fill="#111" />
    {paper && (
      <g transform={`translate(${x} 752)`}>
        <rect x={-60} y={-12} width={120} height={14} fill="#fff" stroke="#111" strokeWidth={3} />
        <text y={-20} textAnchor="middle" fontFamily="Luckiest" fontSize={34} fill="#E0002A">{paper}</text>
      </g>
    )}
  </g>
);

export const Yard: React.FC<{track?: boolean}> = ({track}) => (
  <g>
    <rect width={LW} height={GY} fill="#8ECAE6" />
    <circle cx={1650} cy={170} r={80} fill="#FFE24A" stroke="#111" strokeWidth={7} />
    <rect x={0} y={520} width={LW} height={380} fill="#F1C27D" />
    {Array.from({length: 7}).map((_, i) => <rect key={i} x={i * 300 + 40} y={380} width={220} height={140} fill="#E76F51" stroke="#111" strokeWidth={6} />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill={track ? '#C1440E' : '#5BD15B'} />
    {track && [0, 1, 2].map((i) => <line key={i} x1={0} y1={GY + 40 + i * 50} x2={LW} y2={GY + 40 + i * 50} stroke="#fff" strokeWidth={6} />)}
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Street: React.FC<{dusk?: boolean; crosswalk?: boolean}> = ({dusk, crosswalk = true}) => (
  <g>
    <rect width={LW} height={GY} fill={dusk ? '#F4A261' : '#8ECAE6'} />
    {Array.from({length: 11}).map((_, i) => {
      const w = 150 + rnd(i) * 60, h = 200 + rnd(i + 5) * 330, x = i * 180 - 20;
      return (
        <g key={i}>
          <rect x={x} y={640 - h} width={w} height={h} fill={dusk ? '#6D597A' : '#5B6C9E'} stroke="#111" strokeWidth={5} />
          {Array.from({length: Math.floor(h / 70)}).map((__, j) => <rect key={j} x={x + 22} y={640 - h + 25 + j * 70} width={w - 44} height={24} rx={4} fill={dusk ? '#FFD35A' : '#BFE6FF'} opacity={0.85} />)}
        </g>
      );
    })}
    <rect x={0} y={640} width={LW} height={50} fill="#B8C4D0" stroke="#111" strokeWidth={5} />
    <rect x={0} y={690} width={LW} height={LH - 690} fill="#4A4E69" />
    {crosswalk && Array.from({length: 6}).map((_, i) => <rect key={i} x={1180} y={705 + i * 33} width={300} height={20} fill="#fff" />)}
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 260} y={840} width={140} height={12} fill="#FFD166" />)}
  </g>
);

export const Truck: React.FC<{x: number; y?: number; s?: number}> = ({x, y = 880, s = 0.72}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-250} width={420} height={230} rx={12} fill="#E63946" stroke="#111" strokeWidth={8} />
    <path d="M 90 -180 L 210 -180 L 260 -90 L 260 -20 L 90 -20 Z" fill="#F1FAEE" stroke="#111" strokeWidth={8} />
    <rect x={120} y={-160} width={90} height={60} fill="#9ED8FF" stroke="#111" strokeWidth={5} />
    {[-240, -80, 180].map((cx) => <circle key={cx} cx={cx} cy={0} r={44} fill="#222" stroke="#111" strokeWidth={8} />)}
    <circle cx={260} cy={-60} r={16} fill="#FFE24A" stroke="#111" strokeWidth={4} />
  </g>
);

export const Cat: React.FC<{x: number; y: number; s?: number; flip?: boolean; scared?: boolean}> = ({x, y, s = 1, flip, scared}) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
    <path d="M 40 -40 Q 90 -80 70 -120" stroke="#111" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M 40 -40 Q 90 -80 70 -120" stroke="#F4A261" strokeWidth={8} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-35} rx={55} ry={32} fill="#F4A261" stroke="#111" strokeWidth={6} />
    {[-30, -10, 15, 35].map((lx) => <line key={lx} x1={lx} y1={-10} x2={lx} y2={0} stroke="#111" strokeWidth={8} strokeLinecap="round" />)}
    <g transform="translate(-55 -70)">
      <path d="M -30 -20 L -26 -52 L -6 -30 Z M 30 -20 L 26 -52 L 6 -30 Z" fill="#F4A261" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
      <circle r={34} fill="#F4A261" stroke="#111" strokeWidth={6} />
      <ellipse cx={-12} cy={-4} rx={scared ? 9 : 6} ry={scared ? 11 : 8} fill="#fff" />
      <ellipse cx={12} cy={-4} rx={scared ? 9 : 6} ry={scared ? 11 : 8} fill="#fff" />
      <circle cx={-12} cy={-3} r={3} fill="#111" />
      <circle cx={12} cy={-3} r={3} fill="#111" />
      <path d="M -4 10 L 4 10 L 0 15 Z" fill="#E76F51" />
    </g>
  </g>
);

export const Studio: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={LW} height={GY} fill="#240046" />
    {Array.from({length: 9}).map((_, i) => (
      <path key={i} d={`M ${200 + i * 200} 0 L ${150 + i * 200 + Math.sin(t + i) * 60} ${GY} L ${250 + i * 200 + Math.sin(t + i) * 60} ${GY} Z`} fill="#FFE24A" opacity={0.08} />
    ))}
    <rect x={560} y={120} width={800} height={260} rx={20} fill="#3C096C" stroke="#111" strokeWidth={8} />
    <text x={960} y={290} textAnchor="middle" fontFamily="Luckiest" fontSize={110} fill="#FFE24A" stroke="#111" strokeWidth={6} paintOrder="stroke">¡EN DIRECTO!</text>
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#10002B" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Crowd: React.FC<{t: number; y?: number; cheer?: boolean; frozen?: boolean; n?: number}> = ({t, y = LH + 40, cheer, frozen, n = 14}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = (i + 0.5) * (LW / n);
      const bob = cheer && !frozen ? Math.abs(Math.sin(t * 7 + i)) * 20 : 0;
      return (
        <g key={i} transform={`translate(${x} ${y - bob})`}>
          <circle cy={-150} r={40} fill="#111" />
          <ellipse cx={-14} cy={-152} rx={7} ry={8} fill="#fff" />
          <ellipse cx={14} cy={-152} rx={7} ry={8} fill="#fff" />
          <rect x={-44} y={-110} width={88} height={130} rx={30} fill={['#E63946', '#F72585', '#06D6A0', '#FFB703', '#8338EC'][i % 5]} stroke="#111" strokeWidth={6} />
          {cheer && <line x1={-40} y1={-100} x2={-70} y2={-190 + (frozen ? 0 : Math.sin(t * 9 + i) * 15)} stroke="#111" strokeWidth={9} strokeLinecap="round" />}
        </g>
      );
    })}
  </g>
);

export const Mirror: React.FC<{x: number; y: number; w?: number; h?: number; children?: React.ReactNode}> = ({x, y, w = 420, h = 520, children}) => (
  <g>
    <defs>
      <clipPath id={`mir${x}`}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={28} />
      </clipPath>
    </defs>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={28} fill="#BFE3EA" />
    <g clipPath={`url(#mir${x})`}>{children}</g>
    <path d={`M ${x - w / 2 + 40} ${y - h / 2 + 120} L ${x - w / 2 + 140} ${y - h / 2 + 20}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={14} strokeLinecap="round" />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={28} fill="none" stroke="#C9A227" strokeWidth={16} />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={28} fill="none" stroke="#111" strokeWidth={6} />
  </g>
);

export const Bathroom: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#BFE3EA" />
    {Array.from({length: 20}).map((_, i) => <line key={'v' + i} x1={i * 100} y1={0} x2={i * 100} y2={GY} stroke="#9CCBD5" strokeWidth={4} />)}
    {Array.from({length: 10}).map((_, i) => <line key={'h' + i} x1={0} y1={i * 100} x2={LW} y2={i * 100} stroke="#9CCBD5" strokeWidth={4} />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#E9D6B9" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Doctor: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#E8F4F8" />
    <rect x={1250} y={150} width={460} height={340} rx={12} fill="#fff" stroke="#111" strokeWidth={8} />
    <polyline points="1280,330 1360,330 1390,250 1430,420 1470,300 1500,330 1680,330" stroke="#E0002A" strokeWidth={8} fill="none" strokeLinejoin="round" />
    <path d="M 140 240 h 70 v -70 h 50 v 70 h 70 v 50 h -70 v 70 h -50 v -70 h -70 Z" fill="#E63946" stroke="#111" strokeWidth={6} />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#B8C4D0" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Paper: React.FC<{x: number; y: number; text: string; s?: number}> = ({x, y, text, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(3)`}>
    <rect x={-220} y={-150} width={440} height={300} rx={10} fill="#fff" stroke="#111" strokeWidth={8} />
    <text y={-80} textAnchor="middle" fontFamily="Luckiest" fontSize={36} fill="#1B263B">EDAD BIOLÓGICA</text>
    <text y={50} textAnchor="middle" fontFamily="Luckiest" fontSize={130} fill="#E0002A">{text}</text>
  </g>
);

export const Restaurant: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#FFE8D6" />
    {Array.from({length: 10}).map((_, i) => <rect key={i} x={i * 200} y={0} width={100} height={GY} fill="#E63946" opacity={0.08} />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#8D5B4C" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Fire: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${-70 + i * 50} 0 Q ${-90 + i * 50} ${-120 - Math.sin(t * 12 + i) * 20} ${-40 + i * 50} ${-200 - Math.sin(t * 9 + i) * 30} Q ${0 + i * 50} ${-100} ${-20 + i * 50} 0 Z`} fill={['#FF4D1A', '#FFB31A', '#FFE24A'][i]} stroke="#111" strokeWidth={5} />
    ))}
  </g>
);

export const BusInside: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#D9DEE8" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={80 + i * 460} y={150} width={400} height={300} rx={30} fill="#8ECAE6" stroke="#111" strokeWidth={8} />
        <rect x={80 + i * 460} y={150} width={400} height={300} rx={30} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={4} />
      </g>
    ))}
    {[300, 760, 1220, 1680].map((x) => <rect key={x} x={x - 8} y={0} width={16} height={GY} fill="#FFD166" stroke="#111" strokeWidth={4} />)}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#5C677D" />
    <line x1={0} y1={GY} x2={LW} y2={GY} stroke="#111" strokeWidth={8} />
  </g>
);

export const Plaza: React.FC<{storm?: boolean; t?: number}> = ({storm}) => (
  <g>
    <rect width={LW} height={GY} fill={storm ? '#3D405B' : '#A8DADC'} />
    {/* torre del reloj */}
    <rect x={1380} y={120} width={240} height={560} fill="#C9ADA7" stroke="#111" strokeWidth={8} />
    <path d="M 1360 130 L 1500 20 L 1640 130 Z" fill="#9A031E" stroke="#111" strokeWidth={8} />
    <circle cx={1500} cy={260} r={90} fill="#FFFBEA" stroke="#111" strokeWidth={8} />
    <line x1={1500} y1={260} x2={1500} y2={190} stroke="#111" strokeWidth={9} strokeLinecap="round" />
    <line x1={1500} y1={260} x2={1555} y2={260} stroke="#111" strokeWidth={9} strokeLinecap="round" />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={1420 + (i % 2) * 110} y={400 + Math.floor(i / 2) * 90} width={50} height={60} fill="#5C677D" stroke="#111" strokeWidth={4} />)}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 330} y={300} width={300} height={380} fill={storm ? '#4A4E69' : '#F1FAEE'} stroke="#111" strokeWidth={6} />)}
    <rect x={0} y={680} width={LW} height={LH - 680} fill={storm ? '#6B705C' : '#DDBEA9'} />
    {Array.from({length: 12}).map((_, i) => <line key={i} x1={i * 170} y1={680} x2={i * 170 - 200} y2={LH} stroke="#000" strokeOpacity={0.12} strokeWidth={4} />)}
    {/* fuente */}
    <ellipse cx={700} cy={830} rx={220} ry={50} fill="#9ED8FF" stroke="#111" strokeWidth={7} />
    <rect x={680} y={700} width={40} height={120} fill="#B8C4D0" stroke="#111" strokeWidth={5} />
    <line x1={0} y1={680} x2={LW} y2={680} stroke="#111" strokeWidth={6} />
  </g>
);

export const Bench: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 150} y={780} width={300} height={22} rx={6} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <rect x={x - 150} y={720} width={300} height={20} rx={6} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
    <rect x={x - 130} y={802} width={14} height={98} fill="#111" />
    <rect x={x + 116} y={802} width={14} height={98} fill="#111" />
  </g>
);

export const Rain: React.FC<{t: number; frozen?: boolean; n?: number}> = ({t, frozen, n = 90}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = rnd(i) * LW;
      const sp = 1400 + rnd(i + 3) * 700;
      const y = frozen ? rnd(i + 7) * LH : ((t * sp + rnd(i + 7) * LH) % (LH + 100)) - 50;
      return frozen ? (
        <ellipse key={i} cx={x} cy={y} rx={4} ry={9} fill="#BDE0FE" stroke="#fff" strokeWidth={1.5} opacity={0.9} />
      ) : (
        <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 34} stroke="#BDE0FE" strokeWidth={3} opacity={0.7} />
      );
    })}
  </g>
);

export const Birds: React.FC<{t: number; frozen?: boolean}> = ({t, frozen}) => (
  <g>
    {Array.from({length: 7}).map((_, i) => {
      const x = 200 + i * 230 + (frozen ? 0 : (t * 80) % 200);
      const y = 140 + rnd(i) * 220;
      const f = frozen ? 0.6 : Math.sin(t * 12 + i);
      return <path key={i} d={`M ${x - 30} ${y - 12 * f} Q ${x - 14} ${y - 20 * f - 6} ${x} ${y} Q ${x + 14} ${y - 20 * f - 6} ${x + 30} ${y - 12 * f}`} stroke="#111" strokeWidth={6} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

export const PocketWatch: React.FC<{x: number; y: number; s?: number; open?: boolean; light?: number; broken?: number; t?: number}> = ({x, y, s = 1, open, light = 0, broken = 0, t = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {light > 0 && <circle r={160 + Math.sin(t * 6) * 15} fill="#FFE24A" opacity={0.35 * light} filter="url(#blurGlow)" />}
    <path d="M 0 -100 Q -40 -160 0 -200 Q 40 -160 0 -100" stroke="#C9A227" strokeWidth={8} fill="none" />
    <circle cy={-104} r={16} fill="#E9C46A" stroke="#111" strokeWidth={5} />
    {open && <circle cx={-95} cy={-60} r={88} fill="#E9C46A" stroke="#111" strokeWidth={7} />}
    <circle r={92} fill="#E9C46A" stroke="#111" strokeWidth={8} />
    <circle r={74} fill={open && light > 0 ? '#FFF3A0' : '#FFFBEA'} stroke="#111" strokeWidth={5} />
    {!(open && light > 0) && (
      <g>
        <line x1={0} y1={0} x2={0} y2={-50} stroke="#111" strokeWidth={7} strokeLinecap="round" />
        <line x1={0} y1={0} x2={36} y2={10} stroke="#111" strokeWidth={7} strokeLinecap="round" />
      </g>
    )}
    {open && light > 0 && <circle r={40 + Math.sin(t * 6) * 8} fill="#FFE24A" />}
    {broken > 0 && (
      <g stroke="#111" strokeWidth={5} fill="none">
        {Array.from({length: 7}).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          return <polyline key={i} points={`0,0 ${Math.cos(a) * 40 * broken},${Math.sin(a + 0.3) * 40 * broken} ${Math.cos(a) * 80 * broken},${Math.sin(a) * 80 * broken}`} />;
        })}
      </g>
    )}
  </g>
);

export const Phone: React.FC<{x: number; y: number; s?: number; t: number; views: number}> = ({x, y, s = 1, views}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-5)`}>
    <rect x={-170} y={-320} width={340} height={640} rx={40} fill="#222" stroke="#111" strokeWidth={10} />
    <rect x={-145} y={-290} width={290} height={580} rx={20} fill="#fff" />
    <rect x={-145} y={-290} width={290} height={300} fill="#8ECAE6" />
    <path d="M -30 -180 L 40 -140 L -30 -100 Z" fill="#fff" stroke="#111" strokeWidth={5} />
    <text x={0} y={60} textAnchor="middle" fontFamily="Luckiest" fontSize={34} fill="#111">EL CHICO QUE SE</text>
    <text x={0} y={100} textAnchor="middle" fontFamily="Luckiest" fontSize={34} fill="#111">TELETRANSPORTA</text>
    <text x={0} y={190} textAnchor="middle" fontFamily="Luckiest" fontSize={54} fill="#E0002A">{views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</text>
    <text x={0} y={235} textAnchor="middle" fontFamily="Luckiest" fontSize={30} fill="#555">VISITAS</text>
  </g>
);

export const CityFrozen: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#C9D6DF" />
    {Array.from({length: 11}).map((_, i) => {
      const w = 150 + rnd(i + 2) * 60, h = 260 + rnd(i + 9) * 380, x = i * 180 - 20;
      return <rect key={i} x={x} y={700 - h} width={w} height={h} fill="#8D99AE" stroke="#111" strokeWidth={5} />;
    })}
    <rect x={0} y={700} width={LW} height={LH - 700} fill="#4A4E69" />
    {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 260} y={850} width={140} height={12} fill="#FFD166" />)}
  </g>
);

export const Car: React.FC<{x: number; y: number; c?: string; s?: number}> = ({x, y, c = '#4361EE', s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-60} width={240} height={70} rx={22} fill={c} stroke="#111" strokeWidth={7} />
    <path d="M -70 -60 L -45 -110 L 55 -110 L 85 -60 Z" fill={c} stroke="#111" strokeWidth={7} />
    <rect x={-40} y={-100} width={45} height={34} fill="#BDE0FE" stroke="#111" strokeWidth={4} />
    <circle cx={-70} cy={10} r={28} fill="#222" stroke="#111" strokeWidth={6} />
    <circle cx={70} cy={10} r={28} fill="#222" stroke="#111" strokeWidth={6} />
  </g>
);

export const Calendar: React.FC<{x: number; y: number; day: string; s?: number}> = ({x, y, day, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-150} width={260} height={300} rx={20} fill="#fff" stroke="#111" strokeWidth={8} />
    <rect x={-130} y={-150} width={260} height={80} rx={20} fill="#E0002A" stroke="#111" strokeWidth={8} />
    <text textAnchor="middle" y={-92} fontFamily="Luckiest" fontSize={46} fill="#fff">DÍA</text>
    <text textAnchor="middle" y={80} fontFamily="Luckiest" fontSize={140} fill="#111">{day}</text>
  </g>
);

export const Sofa: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 300} y={660} width={600} height={240} rx={40} fill="#C44569" stroke="#111" strokeWidth={8} />
    <rect x={x - 340} y={700} width={80} height={200} rx={30} fill="#A3345A" stroke="#111" strokeWidth={7} />
    <rect x={x + 260} y={700} width={80} height={200} rx={30} fill="#A3345A" stroke="#111" strokeWidth={7} />
  </g>
);

export const Diary: React.FC<{x: number; y: number; s?: number; k?: number}> = ({x, y, s = 1, k = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-240} width={840} height={480} rx={20} fill="#6B4226" stroke="#111" strokeWidth={10} />
    <rect x={-400} y={-220} width={390} height={440} fill="#F3E5C0" stroke="#111" strokeWidth={5} />
    <rect x={10} y={-220} width={390} height={440} fill="#F3E5C0" stroke="#111" strokeWidth={5} />
    {Array.from({length: 6}).map((_, i) => <line key={i} x1={-370} y1={-150 + i * 60} x2={-50} y2={-150 + i * 60} stroke="#A68A64" strokeWidth={4} opacity={0.6} />)}
    <text x={205} y={-60} textAnchor="middle" fontFamily="Luckiest" fontSize={44} fill="#3D2B1F" opacity={Math.min(1, k * 2)}>EL PODER</text>
    <text x={205} y={0} textAnchor="middle" fontFamily="Luckiest" fontSize={44} fill="#3D2B1F" opacity={Math.min(1, k * 2 - 0.4)}>NO ROBA</text>
    <text x={205} y={60} textAnchor="middle" fontFamily="Luckiest" fontSize={44} fill="#3D2B1F" opacity={Math.min(1, k * 2 - 0.8)}>EL TIEMPO.</text>
    <text x={205} y={150} textAnchor="middle" fontFamily="Luckiest" fontSize={60} fill="#9A031E" opacity={Math.min(1, k * 2 - 1.2)}>LO GUARDA.</text>
  </g>
);

export const Piggy: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={150} ry={110} fill="#FFAFCC" stroke="#111" strokeWidth={8} />
    <circle cx={-150} cy={-10} r={40} fill="#FFAFCC" stroke="#111" strokeWidth={7} />
    <circle cx={-160} cy={-14} r={7} fill="#111" />
    <circle cx={-140} cy={-14} r={7} fill="#111" />
    <rect x={-30} y={-118} width={60} height={14} rx={6} fill="#111" />
    {[-80, -30, 30, 80].map((lx) => <rect key={lx} x={lx - 15} y={90} width={30} height={50} rx={8} fill="#FFAFCC" stroke="#111" strokeWidth={6} />)}
    <circle cx={-90} cy={-50} r={10} fill="#111" />
  </g>
);

export {pop};
