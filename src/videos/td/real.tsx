import React, {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const cache: Record<string, Promise<{scene: THREE.Group; animations: THREE.AnimationClip[]}>> = {};
const loadGLB = (url: string) => (cache[url] ??= new Promise((res, rej) => new GLTFLoader().load(url, (g) => res({scene: g.scene, animations: g.animations}), undefined, rej)));

export type GLB = {scene: THREE.Group; animations: THREE.AnimationClip[]};
/** carga modelos GLB FUERA del canvas (delayRender) y los devuelve listos */
export const useModels = (names: string[]) => {
  const [data, setData] = useState<Record<string, GLB>>({});
  const [handle] = useState(() => delayRender('glb ' + names.join(',')));
  useEffect(() => {
    Promise.all(names.map((n) => loadGLB(staticFile(`models/${n}.glb`)).then((d) => [n, d] as const)))
      .then((arr) => { setData(Object.fromEntries(arr)); setTimeout(() => continueRender(handle), 200); })
      .catch((e) => { (window as any).__glbErr = String(e && (e.message || e)); setData({__err: String(e && (e.message || e))} as any); continueRender(handle); });
  }, []);
  return data;
};

/** persona realista (modelo GLB con esqueleto); la animacion se fija con el tiempo exacto del fotograma */
export const Human: React.FC<{glb?: GLB; anims?: THREE.AnimationClip[]; clip: string; time: number; position?: [number, number, number]; rotY?: number; rot?: [number, number, number]; scale?: number; tint?: string; id?: string}> = ({glb, anims, clip, time, position = [0, 0, 0], rotY = 0, rot = [0, 0, 0], scale = 1, tint}) => {
  const inst = useMemo(() => {
    if (!glb) return null;
    const scene = SkeletonUtils.clone(glb.scene) as THREE.Group;
    scene.traverse((o: any) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; if (tint && o.material) { o.material = o.material.clone(); o.material.color = new THREE.Color(tint); } } });
    const mixer = new THREE.AnimationMixer(scene);
    return {scene, mixer};
  }, [glb, tint]);
  if (!inst || !glb) return null;
  const list = anims ?? glb.animations;
  const c = list.find((a) => a.name === clip) ?? list[0];
  inst.mixer.stopAllAction();
  inst.mixer.clipAction(c).reset().play();
  inst.mixer.setTime(time % c.duration);
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <group rotation={rot} scale={scale}><primitive object={inst.scene} /></group>
    </group>
  );
};

/** cesped: miles de briznas instanciadas con un poco de viento */
export const Grass: React.FC<{t: number; size?: number; count?: number; center?: [number, number]}> = ({t, size = 40, count = 40000, center = [0, 0]}) => {
  const {mesh, base} = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.05, 0.35, 1, 3);
    g.translate(0, 0.175, 0);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); pos.setX(i, pos.getX(i) * (1 - y / 0.4)); }
    const m = new THREE.MeshStandardMaterial({color: '#4caf3a', side: THREE.DoubleSide, roughness: 0.9});
    const mesh = new THREE.InstancedMesh(g, m, count);
    mesh.receiveShadow = true;
    const base: number[][] = [];
    let s = 1;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      base.push([(rnd() - 0.5) * size, (rnd() - 0.5) * size, rnd() * Math.PI, 0.6 + rnd() * 0.9, rnd()]);
      col.setHSL(0.27 + rnd() * 0.05, 0.6, 0.28 + rnd() * 0.18);
      mesh.setColorAt(i, col);
    }
    return {mesh, base};
  }, [count, size]);
  const o = useMemo(() => new THREE.Object3D(), []);
  base.forEach(([x, z, r, h, ph], i) => {
    o.position.set(center[0] + x, 0, center[1] + z);
    o.rotation.set(Math.sin(t * 1.6 + ph * 6 + x * 0.3) * 0.18, r, 0);
    o.scale.set(1, h, 1);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

export const BlobTree: React.FC<{p: [number, number, number]; s?: number}> = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <mesh position={[0, 1.5, 0]} castShadow><cylinderGeometry args={[0.12, 0.18, 3, 8]} /><meshStandardMaterial color="#6b4a2f" /></mesh>
    {[[0, 3.4, 0, 1.1], [0.8, 3.0, 0.2, 0.8], [-0.8, 3.1, -0.1, 0.85], [0.2, 4.1, -0.2, 0.8]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} castShadow><sphereGeometry args={[r, 20, 16]} /><meshStandardMaterial color="#3e8a43" roughness={0.9} /></mesh>)}
  </group>
);

const Cam: React.FC<{cam: [number, number, number]; look: [number, number, number]; fov: number}> = ({cam, look, fov}) => {
  const {camera} = useThree();
  camera.position.set(...cam);
  (camera as any).fov = fov;
  camera.lookAt(...look);
  (camera as any).updateProjectionMatrix();
  return null;
};

/** escena realista: cielo, niebla de profundidad, luz de sol suave, suelo verde */
export const RealStage: React.FC<{children: React.ReactNode; cam: [number, number, number]; look: [number, number, number]; fov?: number; fog?: [number, number]; ground?: string; sky?: string}> = ({children, cam, look, fov = 35, fog = [14, 45], ground = '#4f9a3f', sky = '#a9c9e8'}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping}} style={{background: `linear-gradient(#5d7fa8, ${sky} 45%, #dfe9f2)`}}>
      <Cam cam={cam} look={look} fov={fov} />
      <fog attach="fog" args={['#c5d8e6', fog[0], fog[1]]} />
      <hemisphereLight args={['#dfefff', '#4a6a3a', 1.1]} />
      <directionalLight position={[8, 14, 6]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0005} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[400, 400]} /><meshStandardMaterial color={ground} roughness={1} /></mesh>
      {children}
    </ThreeCanvas>
  );
};

/** reutiliza animaciones Mixamo (Xbot/Soldier) en modelos con huesos sin prefijo */
export const retarget = (clips: THREE.AnimationClip[] | undefined) =>
  (clips ?? []).map((c) => new THREE.AnimationClip(c.name, c.duration, c.tracks.filter((tr) => tr.name.endsWith('.quaternion')).map((tr) => { const t2 = tr.clone(); t2.name = tr.name.replace('mixamorig:', '').replace('mixamorig', ''); return t2; })));

/** retarget de verdad (corrige poses de reposo distintas) */
const rtCache = new Map<string, THREE.AnimationClip>();
export const retargetTo = (target: GLB | undefined, source: GLB | undefined, clipName: string) => {
  if (!target || !source) return undefined;
  const key = clipName;
  if (rtCache.has(key)) return [rtCache.get(key)!];
  let tMesh: any = null, sMesh: any = null;
  target.scene.traverse((o: any) => { if (o.isSkinnedMesh && !tMesh) tMesh = o; });
  source.scene.traverse((o: any) => { if (o.isSkinnedMesh && !sMesh) sMesh = o; });
  const clip = source.animations.find((a) => a.name === clipName);
  if (!tMesh || !sMesh || !clip) return undefined;
  const names: Record<string, string> = {};
  tMesh.skeleton.bones.forEach((b: any) => { names[b.name] = 'mixamorig' + b.name; });
  const out = (SkeletonUtils as any).retargetClip(tMesh, sMesh, clip, {names, hip: 'Hips', useFirstFramePosition: true, preserveBonePositions: true, fps: 30});
  out.name = clipName;
  rtCache.set(key, out);
  return [out];
};
