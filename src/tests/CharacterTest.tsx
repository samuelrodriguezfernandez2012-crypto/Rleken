import React from 'react';
import {AbsoluteFill} from 'remotion';
import {StickmanV2} from '../StickmanV2';
import {POSES, SvgDefs} from '../Stickman';
import {FONT} from '../fx';
import {loadFonts} from '../fonts';

const Label: React.FC<{x: number; y: number; text: string; size?: number}> = ({x, y, text, size = 44}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontSize={size} fill="#fff" stroke="#111" strokeWidth={size / 5} paintOrder="stroke">{text}</text>
);

// hoja de prueba del personaje nuevo
export const CharacterTest: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#DCEBFF, #9EC5FF)'}}>
      <svg width={1080} height={1920}>
        <SvgDefs />
        <Label x={540} y={120} text="PERSONAJE NUEVO" size={90} />
        {/* retrato grande */}
        <circle cx={540} cy={470} r={290} fill="#fff" opacity={0.5} />
        <g>
          <defs>
            <clipPath id="portrait"><circle cx={540} cy={470} r={290} /></clipPath>
          </defs>
          <g clipPath="url(#portrait)">
            <StickmanV2 x={540} y={430 + 308 * 3.6} scale={3.6} pose={POSES.idle} eyes="normal" mouth="flat" />
          </g>
          <circle cx={540} cy={470} r={290} fill="none" stroke="#111" strokeWidth={10} />
        </g>
        {/* cuerpo entero + accion */}
        <ellipse cx={300} cy={1395} rx={130} ry={20} fill="#000" opacity={0.2} />
        <StickmanV2 x={300} y={1390} scale={1.7} pose={POSES.idle} look={0.5} />
        <ellipse cx={790} cy={1395} rx={130} ry={20} fill="#000" opacity={0.2} />
        <StickmanV2 x={790} y={1390} scale={1.7} pose={POSES.point} eyes="angry" mouth="flat" look={1} />
        <Label x={300} y={1460} text="NORMAL" />
        <Label x={790} y={1460} text="EN ACCIÓN" />
        {/* expresiones */}
        {([
          ['SERIO', 'normal', 'flat'],
          ['SORPRESA', 'wide', 'o'],
          ['ENFADO', 'angry', 'teeth'],
          ['CONTENTO', 'happy', 'smile'],
        ] as const).map(([name, e, m], i) => {
          const cx = 150 + i * 260;
          return (
            <g key={name}>
              <defs>
                <clipPath id={'ex' + i}><circle cx={cx} cy={1650} r={105} /></clipPath>
              </defs>
              <circle cx={cx} cy={1650} r={105} fill="#fff" opacity={0.6} />
              <g clipPath={`url(#ex${i})`}>
                <StickmanV2 x={cx} y={1660 + 308 * 1.55} scale={1.55} pose={POSES.idle} eyes={e} mouth={m} />
              </g>
              <circle cx={cx} cy={1650} r={105} fill="none" stroke="#111" strokeWidth={7} />
              <Label x={cx} y={1800} text={name} size={38} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
