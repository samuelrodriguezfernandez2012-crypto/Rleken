import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Guy, Stage} from './kit3d';
export const Test3D: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage cam={[0, 2.8, 8]} look={[0, 1.6, 0]}>
        <Guy position={[-1.2, 0, 0]} rotY={0.4} pose={{armL: 2.6, armR: -2.6}} eyes="wide" mouth="o" />
        <Guy position={[1.4, 0, -1]} rotY={-0.5} eyes="normal" mouth="smile" tint="#ff4fa3" />
        <mesh position={[3, 0.75, -3]} castShadow><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color="#ffb703" /></mesh>
      </Stage>
    </AbsoluteFill>
  );
};
