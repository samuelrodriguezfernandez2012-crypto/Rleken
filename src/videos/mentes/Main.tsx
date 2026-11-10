import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ShortShell, World, Shadow, HERO, GROUND} from '../../common';
import {Stickman, POSES} from '../../Stickman';
import {Burst} from '../../fx';
import {Title} from '../reflejo/Main';
import words from './words.json';
import {M1Hook, M2Dog, M3Class, M4Fun, M5Voices, M6Overload, M7Voice, M8Man, M9Chase, M10Alley, M11Silence, M12Reveal, M13End} from './Scenes';

export const DURATION_S = 58.5;
const KEYS = /6\.000|pensamientos|todos|perro|zapatilla|profe|timbre|increíble|principio|100|voces|1\.000|apagarlo|fuerte|escuchando|gris|único|corrí|paso|callejón|controlarlo|silencio|yo\.|40|años|escuchara|comentarios/i;

export const MentesShort: React.FC = () => (
  <ShortShell
    name="mentes"
    words={words}
    keys={KEYS}
    scenes={[
      [0, 5.5, M1Hook],
      [5.5, 9.1, M2Dog],
      [9.1, 12.6, M3Class],
      [12.6, 15.3, M4Fun],
      [15.3, 21.0, M5Voices],
      [21.0, 22.8, M6Overload],
      [22.8, 27.5, M7Voice],
      [27.5, 33.3, M8Man],
      [33.3, 37.6, M9Chase],
      [37.6, 41.8, M10Alley],
      [41.8, 46.6, M11Silence],
      [46.6, 52.0, M12Reveal],
      [52.0, 99, M13End],
    ]}
    cuts={[5.5, 9.1, 12.6, 15.3, 22.8, 27.5, 37.6, 46.6, 52.0]}
  />
);

export const MentesThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <Burst t={0.3} c1="#240046" c2="#3C096C" />
    <World>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={540} cy={1020} r={160 + i * 120} fill="none" stroke="#C77DFF" strokeWidth={14 - i * 3} opacity={1 - i * 0.2} />)}
      <Shadow x={540} y={1690} w={180} />
      <Stickman x={540} y={1680} scale={2.1} color={HERO} pose={POSES.headHold} eyes="psychic" mouth="o" />
      <Stickman x={930} y={1620} scale={1.4} color="#7D8597" pose={POSES.idle} flip eyes="psychic" hood />
    </World>
    <Title a="PUEDO LEER" b="TUS PENSAMIENTOS" pill="¡Y NO SOY EL ÚNICO!" />
  </AbsoluteFill>
);
