import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ShortShell, World} from '../../common';
import {Stickman, POSES} from '../../Stickman';
import {Title} from '../reflejo/Main';
import words from './words.json';
import {T1Hook, T2Stop, T3Fly, T4Boom, T5Antenna, T6Sun, T7Split, T8Oceans, T9Push, T10Reverse, T11West, T12End, Globe} from './Scenes';
import {HERO} from '../../common';

export const DURATION_S = 62.8;
const KEYS = /1\.000|km|hora|notas|tierra|paró|segundo|disparado|coches|casas|mar|sonido|antena|fuerzas|viento|asfalto|sol|quieto|6|meses|día|noche|océanos|polos|continente|gigante|empujar|empujé|nada|algo|girar|lado|oeste|único|comentarios/i;

export const TierraShort: React.FC = () => (
  <ShortShell
    name="tierra"
    words={words}
    keys={KEYS}
    scenes={[
      [0, 5.0, T1Hook],
      [5.0, 8.1, T2Stop],
      [8.1, 16.3, T3Fly],
      [16.3, 18.2, T4Boom],
      [18.2, 23.1, T5Antenna],
      [23.1, 28.4, T6Sun],
      [28.4, 31.8, T7Split],
      [31.8, 37.9, T8Oceans],
      [37.9, 48.9, T9Push],
      [48.9, 52.4, T10Reverse],
      [52.4, 57.2, T11West],
      [57.2, 99, T12End],
    ]}
    cuts={[5.0, 23.1, 28.4, 31.8, 37.9, 48.9, 52.4, 57.2]}
  />
);

export const TierraThumb: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #1B2A6B, #02030F 70%)'}}>
    <World>
      {Array.from({length: 60}).map((_, i) => <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1920} r={2 + (i % 3)} fill="#fff" opacity={0.7} />)}
      <Globe cx={540} cy={1080} r={420} rot={1.2} id="gth" />
      {/* señal de STOP sobre el planeta */}
      <g transform="translate(540 1080) rotate(-8)">
        <polygon points="-120,-290 120,-290 290,-120 290,120 120,290 -120,290 -290,120 -290,-120" fill="#E0002A" stroke="#fff" strokeWidth={22} opacity={0.92} />
        <text textAnchor="middle" y={60} fontFamily="Luckiest" fontSize={190} fill="#fff" stroke="#111" strokeWidth={8} paintOrder="stroke">STOP</text>
      </g>
      <Stickman x={190} y={960} scale={1.2} color={HERO} pose={POSES.scared} rotate={-30} eyes="scared" mouth="open" />
    </World>
    <Title a="¿Y SI LA TIERRA" b="SE PARA?" pill="¡Y SE PARÓ!" />
  </AbsoluteFill>
);
