import React from 'react';
import {LW, LH, GY, rnd} from '../futuro/kit';

export const Hallway: React.FC<{graffiti?: 'monstruo' | 'heroe' | ''}> = ({graffiti = ''}) => (
  <g>
    <rect width={LW} height={GY} fill="#CFC6B8" />
    {Array.from({length: 12}).map((_, i) => (
      <g key={i} transform={`translate(${60 + i * 150} 260)`}>
        <rect width={136} height={640} fill={i === 6 ? '#4A6FA5' : '#5C7FB0'} stroke="#2B3A55" strokeWidth={6} />
        {[0, 1, 2].map((j) => <rect key={j} x={40} y={30 + j * 14} width={56} height={6} fill="#2B3A55" />)}
        <rect x={108} y={300} width={10} height={50} rx={4} fill="#2B3A55" />
      </g>
    ))}
    {graffiti && (
      <g transform="translate(968 520) rotate(-8) scale(2.4)">
        <text textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#D90429">MONSTRUO</text>
        {graffiti === 'heroe' && <><line x1={-100} y1={-12} x2={100} y2={-8} stroke="#111" strokeWidth={8} /><text textAnchor="middle" y={60} fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#1D3557">NUESTRO</text><text textAnchor="middle" y={92} fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#1D3557">HÉROE ♥</text></>}
      </g>
    )}
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#9C8F7D" />
  </g>
);
export const Office: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#6B4E3D" />
    <rect x={1250} y={150} width={420} height={300} fill="#9ED8FF" stroke="#3A2E2A" strokeWidth={12} />
    <rect x={300} y={200} width={300} height={200} fill="#F1E3C6" stroke="#3A2E2A" strokeWidth={8} />
    <text x={450} y={315} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#3A2E2A">DIRECTOR</text>
    <rect x={560} y={660} width={800} height={40} fill="#4A3426" stroke="#111" strokeWidth={6} />
    <rect x={600} y={700} width={720} height={200} fill="#5C4033" />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#3B2A22" />
  </g>
);
export const Egg: React.FC<{x: number; y: number; s?: number; broken?: boolean}> = ({x, y, s = 1, broken}) => (
  broken ? (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={60} ry={14} fill="#FFF3B0" opacity={0.9} />
      <circle cx={6} cy={-2} r={16} fill="#FFB703" />
      <path d="M -40 -4 l 10 -22 l 10 18 l 10 -20 l 8 22" fill="#FAF3E3" stroke="#111" strokeWidth={3} />
    </g>
  ) : (
    <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx={0} cy={-34} rx={26} ry={34} fill="#FAF3E3" stroke="#111" strokeWidth={4} /><ellipse cx={-8} cy={-46} rx={6} ry={10} fill="#fff" /></g>
  )
);
export const Bus: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-230} y={-150} width={460} height={140} rx={18} fill="#FFB703" stroke="#111" strokeWidth={7} />
    {Array.from({length: 5}).map((_, i) => <g key={i}><rect x={-205 + i * 84} y={-130} width={66} height={56} rx={6} fill="#9ED8FF" stroke="#111" strokeWidth={4} /><circle cx={-172 + i * 84} cy={-96} r={12} fill="#111" /></g>)}
    <rect x={-230} y={-50} width={460} height={14} fill="#111" />
    {[-150, 150].map((wx) => <circle key={wx} cx={wx} cy={-8} r={34} fill="#222" stroke="#111" strokeWidth={6} />)}
  </g>
);
/** puente sobre el rio; crack 0..1 separa los dos tramos; hold eleva el tramo derecho */
export const Bridge: React.FC<{crack?: number; t: number; bus?: boolean; shake?: number}> = ({crack = 0, t, bus = true, shake = 0}) => {
  const sx = Math.sin(t * 60) * shake;
  const drop = crack * 70;
  return (
    <g>
      <rect width={LW} height={LH} fill="#1B1B3A" />
      <circle cx={1550} cy={170} r={60} fill="#F4F1DE" opacity={0.8} />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={i * 170 - 20} y={230 - rnd(i) * 140} width={130} height={500} fill="#252047" />)}
      <rect x={0} y={700} width={LW} height={LH - 700} fill="#1E3A5F" />
      {Array.from({length: 9}).map((_, i) => <path key={i} d={`M ${i * 230 - ((t * 30) % 230)} ${780 + (i % 3) * 70} q 50 -14 100 0`} stroke="#4C7DB0" strokeWidth={5} fill="none" opacity={0.6} />)}
      <g transform={`translate(${sx} 0)`}>
        <rect x={-20} y={430} width={960} height={70} fill="#7D7F8C" stroke="#111" strokeWidth={6} />
        <rect x={240} y={500} width={70} height={240} fill="#5E6070" stroke="#111" strokeWidth={6} />
        <g transform={`rotate(${crack * 8} 1880 470) translate(0 ${drop})`}>
          <rect x={960} y={430} width={980} height={70} fill="#7D7F8C" stroke="#111" strokeWidth={6} />
          <rect x={1620} y={500} width={70} height={240} fill="#5E6070" stroke="#111" strokeWidth={6} />
          {bus && <Bus x={1180} y={432} s={0.75} />}
        </g>
        {crack > 0 && <path d={`M 950 430 l 14 20 l -10 18 l 14 20 l -8 12`} stroke="#111" strokeWidth={5} fill="none" />}
      </g>
    </g>
  );
};
export const Sign: React.FC<{x: number; y: number; text: string; c?: string; rot?: number}> = ({x, y, text, c = '#fff', rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-6} y={0} width={12} height={170} fill="#8B5A3C" />
    <rect x={-120} y={-80} width={240} height={110} rx={8} fill={c} stroke="#111" strokeWidth={5} />
    <text textAnchor="middle" y={-10} fontFamily="Montserrat" fontWeight={900} fontSize={44} fill="#1D3557">{text}</text>
  </g>
);
export const Drawing: React.FC<{x: number; y: number; s?: number; bridge?: boolean}> = ({x, y, s = 1, bridge}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-4)`}>
    <rect x={-150} y={-110} width={300} height={220} fill="#FFFDF5" stroke="#111" strokeWidth={4} />
    <circle cx={0} cy={-40} r={22} fill="none" stroke="#111" strokeWidth={5} />
    <path d="M 0 -18 L 0 40 M -30 0 L 30 0 M 0 40 L -20 80 M 0 40 L 20 80" stroke="#2D6CDF" strokeWidth={6} />
    <path d="M -6 -10 Q -60 30 -40 80 L 10 20 Z" fill="#E63946" opacity={0.85} />
    {bridge && <rect x={-130} y={-96} width={260} height={18} fill="#7D7F8C" />}
    <path d="M -130 95 q 30 -12 60 0 q 30 12 60 0 q 30 -12 60 0" stroke="#4C7DB0" strokeWidth={4} fill="none" />
  </g>
);
export const Cake: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-90} y={-90} width={180} height={90} rx={10} fill="#F4A6C1" stroke="#111" strokeWidth={5} />
    <path d="M -90 -70 q 22 20 45 0 q 22 20 45 0 q 22 20 45 0 q 22 20 45 0" fill="#fff" stroke="#111" strokeWidth={3} />
    {[-40, 0, 40].map((cx) => <g key={cx}><rect x={cx - 5} y={-130} width={10} height={40} fill="#4CC9F0" /><ellipse cx={cx} cy={-138} rx={6} ry={10} fill="#FFD23F" /></g>)}
  </g>
);
export const HospitalRoom: React.FC = () => (
  <g>
    <rect width={LW} height={GY} fill="#CFE3EA" />
    <rect x={1250} y={150} width={420} height={300} fill="#9ED8FF" stroke="#7A8C99" strokeWidth={12} />
    <rect x={500} y={620} width={760} height={60} rx={12} fill="#fff" stroke="#111" strokeWidth={6} />
    <rect x={480} y={520} width={60} height={380} fill="#B0BEC5" stroke="#111" strokeWidth={5} />
    <rect x={500} y={680} width={760} height={30} fill="#8EA6B4" />
    <rect x={0} y={GY} width={LW} height={LH - GY} fill="#A7BCC6" />
  </g>
);
export const Well: React.FC<{x: number}> = ({x}) => (
  <g>
    <ellipse cx={x} cy={820} rx={200} ry={50} fill="#111" stroke="#555" strokeWidth={14} />
    <rect x={x - 200} y={820} width={400} height={80} fill="#6C757D" stroke="#111" strokeWidth={6} />
  </g>
);
export const Fence: React.FC<{fixed?: number}> = ({fixed = 1}) => (
  <g>
    {Array.from({length: 12}).map((_, i) => {
      const broken = i > 4 && i < 8 && fixed < 0.5;
      return <rect key={i} x={200 + i * 130} y={broken ? 700 : 560} width={40} height={broken ? 200 : 340} fill="#E9D8A6" stroke="#111" strokeWidth={5} transform={broken ? `rotate(${(i - 6) * 25} ${220 + i * 130} 900)` : undefined} />;
    })}
    <rect x={180} y={620} width={1580} height={24} fill="#D4B483" stroke="#111" strokeWidth={4} />
  </g>
);
export const Lamp: React.FC<{x: number; fall?: number}> = ({x, fall = 0}) => (
  <g transform={`rotate(${fall * 75} ${x} 900)`}>
    <rect x={x - 8} y={380} width={16} height={520} fill="#444" />
    <path d={`M ${x} 380 q 60 -30 90 10`} stroke="#444" strokeWidth={12} fill="none" />
    <ellipse cx={x + 92} cy={398} rx={26} ry={12} fill="#FFD59A" />
  </g>
);
