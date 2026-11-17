import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';

export type Pose3 = {armL?: number; armR?: number; legL?: number; legR?: number; lean?: number; reach?: number; walk?: number};
const SKIN = '#1b1b24', JACKET = '#2f6bff', PANTS = '#1d2236', SHOE = '#f1f1f1';

const Limb: React.FC<{len: number; r: number; color: string; rot: number; rx?: number; pos: [number, number, number]}> = ({len, r, color, rot, rx = 0, pos}) => (
  <group position={pos} rotation={[rx, 0, rot]}>
    <mesh position={[0, -len / 2, 0]} castShadow>
      <capsuleGeometry args={[r, len, 8, 16]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  </group>
);

/** personaje 3D estilo juguete: chaqueta azul, cabeza redonda oscura, ojos grandes */
export const Guy: React.FC<{position?: [number, number, number]; rotY?: number; pose?: Pose3; eyes?: 'normal' | 'wide' | 'closed' | 'x'; mouth?: 'flat' | 'o' | 'smile'; squash?: number; scale?: number; tint?: string}> = ({position = [0, 0, 0], rotY = 0, pose = {}, eyes = 'normal', mouth = 'flat', squash = 0, scale = 1, tint = JACKET}) => {
  const {armL = 0.25, armR = -0.25, legL = 0.05, legR = -0.05, lean = 0, reach = 0, walk = 0} = pose;
  const sy = 1 - squash * 0.35, sx = 1 + squash * 0.25;
  const eyeH = eyes === 'closed' ? 0.02 : eyes === 'wide' ? 0.16 : 0.12;
  return (
    <group position={position} rotation={[0, rotY, 0]}><group rotation={[lean, 0, 0]} scale={[sx * scale, sy * scale, sx * scale]}>
      {/* piernas */}
      <Limb len={0.75} r={0.13} color={PANTS} rot={legL} rx={walk} pos={[-0.18, 1.0, 0]} />
      <Limb len={0.75} r={0.13} color={PANTS} rot={legR} rx={-walk} pos={[0.18, 1.0, 0]} />
      {[[-0.18, legL, walk], [0.18, legR, -walk]].map(([x, r, w], i) => (
        <mesh key={i} position={[x + Math.sin(r) * 0.95, 1.0 - Math.cos(r) * Math.cos(w) * 0.95, 0.08 + Math.sin(w) * 0.95]} castShadow>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={SHOE} />
        </mesh>
      ))}
      {/* cuerpo */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <capsuleGeometry args={[0.36, 0.6, 8, 24]} />
        <meshStandardMaterial color={tint} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.55, 0.37]}>
        <boxGeometry args={[0.04, 0.7, 0.02]} />
        <meshStandardMaterial color="#e8eefc" />
      </mesh>
      {/* brazos */}
      <Limb len={0.7} r={0.11} color={tint} rot={-armL - 0.15} rx={-reach - walk * 0.8} pos={[-0.43, 1.85, 0]} />
      <Limb len={0.7} r={0.11} color={tint} rot={-armR + 0.15} rx={-reach + walk * 0.8} pos={[0.43, 1.85, 0]} />
      {/* cabeza */}
      <group position={[0, 2.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.4} />
        </mesh>
        {eyes === 'x'
          ? [-0.17, 0.17].map((x) => <group key={x} position={[x, 0.08, 0.47]}>{[0.8, -0.8].map((r) => <mesh key={r} rotation={[0, 0, r]}><boxGeometry args={[0.2, 0.04, 0.02]} /><meshStandardMaterial color="#fff" /></mesh>)}</group>)
          : [-0.17, 0.17].map((x) => (
              <group key={x} position={[x, 0.08, 0.44]}>
                <mesh scale={[1, eyeH / 0.12, 1]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#fff" /></mesh>
                {eyes !== 'closed' && <mesh position={[0, 0, 0.09]}><sphereGeometry args={[0.055, 12, 12]} /><meshStandardMaterial color="#111" /></mesh>}
              </group>
            ))}
        {mouth === 'o' && <mesh position={[0, -0.2, 0.46]}><torusGeometry args={[0.06, 0.02, 8, 16]} /><meshStandardMaterial color="#fff" /></mesh>}
        {mouth === 'smile' && <mesh position={[0, -0.18, 0.45]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} /><meshStandardMaterial color="#fff" /></mesh>}
        {mouth === 'flat' && <mesh position={[0, -0.2, 0.47]}><boxGeometry args={[0.16, 0.025, 0.02]} /><meshStandardMaterial color="#fff" /></mesh>}
      </group>
    </group></group>
  );
};

/** escenario: luz suave + sombras + suelo */
export const Stage: React.FC<{children: React.ReactNode; cam?: [number, number, number]; look?: [number, number, number]; fov?: number; sky?: string; ground?: string; fog?: number}> = ({children, cam = [0, 3, 9], look = [0, 1.5, 0], fov = 40, sky = '#9fd3ff', ground = '#7cc36b', fog}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{position: cam, fov}} onCreated={({camera}) => camera.lookAt(...look)} style={{background: `linear-gradient(${sky}, #ffffff)`}}>
      <CamLook cam={cam} look={look} fov={fov} />
      <hemisphereLight args={['#ffffff', '#445566', 0.9]} />
      <directionalLight position={[6, 12, 8]} intensity={1.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} />
      {fog && <fog attach="fog" args={[sky, fog, fog * 4]} />}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      {children}
    </ThreeCanvas>
  );
};
import {useThree} from '@react-three/fiber';
const CamLook: React.FC<{cam: [number, number, number]; look: [number, number, number]; fov: number}> = ({cam, look, fov}) => {
  const {camera} = useThree();
  camera.position.set(...cam);
  (camera as any).fov = fov;
  camera.lookAt(...look);
  (camera as any).updateProjectionMatrix();
  return null;
};

/** decorado: arboles y casas de juguete a los lados del camino */
export const Tree: React.FC<{p: [number, number, number]; s?: number}> = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.15, 0.2, 1.2, 8]} /><meshStandardMaterial color="#7a4b2a" /></mesh>
    <mesh position={[0, 1.7, 0]} castShadow><sphereGeometry args={[0.8, 16, 16]} /><meshStandardMaterial color="#3fae55" roughness={0.8} /></mesh>
  </group>
);
export const House: React.FC<{p: [number, number, number]; color?: string; s?: number}> = ({p, color = '#ffd166', s = 1}) => (
  <group position={p} scale={s}>
    <mesh position={[0, 1, 0]} castShadow receiveShadow><boxGeometry args={[2.4, 2, 2]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[1.9, 1.1, 4]} /><meshStandardMaterial color="#e63946" /></mesh>
    <mesh position={[0, 0.6, 1.01]}><boxGeometry args={[0.5, 1.2, 0.02]} /><meshStandardMaterial color="#6b4226" /></mesh>
  </group>
);
