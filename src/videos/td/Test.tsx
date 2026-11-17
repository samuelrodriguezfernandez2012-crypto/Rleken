import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {RealStage, Human, Grass, BlobTree, useModels, retargetTo} from './real';
export const Test3D: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const m = useModels(['rpm', 'Xbot', 'Michelle']);
  return (
    <AbsoluteFill>
      {m.rpm && <RealStage cam={[1.5, 1.2, 4.2]} look={[0, 1.0, 0]} fov={38}>
        <Grass t={t} size={30} count={40000} />
        {[[-6, -14], [3, -18], [10, -12], [-12, -20]].map(([x, z], i) => <BlobTree key={i} p={[x, 0, z]} s={1.2} />)}
        <Human glb={m.rpm} anims={retargetTo(m.rpm, m.Xbot, 'run')} clip="run" time={t + 0.3} position={[0, 0, 0]} rotY={0.9} /><Human glb={m.Michelle} clip="SambaDance" time={t + 2} position={[-1.3, 0, -1]} rotY={0.3} />
        <mesh position={[1.2, 0.2, 0.6]} castShadow><boxGeometry args={[0.8, 0.25, 0.5]} /><meshStandardMaterial color="#e05a4f" /></mesh>
      </RealStage>}
    </AbsoluteFill>
  );
};
