import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../../fonts';
import words from './words.json';
import {FPS, Wipe} from '../../fx';
import {Captions} from '../../Captions';
import {SceneHook, SceneMom, SceneFly, SceneMoney, SceneAngry, SceneMeteor, SceneCrowd, SceneTwist, SceneEnd} from './Scenes';

export const DURATION_S = 52.5;

loadFonts();

// [inicio, fin) de cada escena en segundos
const SCENES: [number, number, React.FC<{t: number}>][] = [
  [0, 7.6, SceneHook],
  [7.6, 13.2, SceneMom],
  [13.2, 17.6, SceneFly],
  [17.6, 21.7, SceneMoney],
  [21.7, 25.6, SceneAngry],
  [25.6, 37.0, SceneMeteor],
  [37.0, 41.5, SceneCrowd],
  [41.5, 46.9, SceneTwist],
  [46.9, 99, SceneEnd],
];
const CUTS = [7.6, 13.2, 21.7, 25.6, 37.0, 46.9];

export const MentirasShort: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Audio src={staticFile('mentiras/mezcla.wav')} />
      {SCENES.map(([a, b, S], i) => (t >= a && t < b ? <S key={i} t={t} /> : null))}
      {CUTS.map((c) => (
        <Wipe key={c} t={t} at={c} color={c === 46.9 ? '#BDF2FF' : '#111'} />
      ))}
      <Captions t={t} words={words} />
    </AbsoluteFill>
  );
};
