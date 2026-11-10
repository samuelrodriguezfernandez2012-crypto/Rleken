import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ShortShell, World, Shadow, HERO, GROUND} from '../../common';
import {Stickman, POSES} from '../../Stickman';
import {FONT} from '../../fx';
import words from './words.json';
import {R1Hook, R2Brush, R3Fog, R4Screens, R5Doors, R6Grab, R8Reverse, R9Twist, R10End, Face} from './Scenes';

export const DURATION_S = 56.5;
const KEYS = /reflejo|nanosegundos|imitarme|movió|sonrió|déjame|salir|tele|ventana|móvil|pantalla|cristal|puerta|agrietó|brazo|fuerzas|suelo|revés|letras|reloj|nombre|metido|imitarte|ti\.|atreves/i;

export const ReflejoShort: React.FC = () => (
  <ShortShell
    name="reflejo"
    words={words}
    keys={KEYS}
    scenes={[
      [0, 6.9, R1Hook],
      [6.9, 12.9, R2Brush],
      [12.9, 17.0, R3Fog],
      [17.0, 22.9, R4Screens],
      [22.9, 27.0, R5Doors],
      [27.0, 37.3, R6Grab],
      [37.3, 43.2, R8Reverse],
      [43.2, 50.2, R9Twist],
      [50.2, 99, R10End],
    ]}
    cuts={[6.9, 17.0, 22.9, 27.0, 37.3, 50.2]}
  />
);

const Title: React.FC<{a: string; b: string; pill: string}> = ({a, b, pill}) => (
  <>
    <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', transform: 'rotate(-4deg)'}}>
      <div style={{fontFamily: FONT, fontSize: 150, lineHeight: 1, color: '#FFE24A', WebkitTextStroke: '18px #111', paintOrder: 'stroke fill', textShadow: '0 14px 0 #111'}}>{a}</div>
      <div style={{fontFamily: FONT, fontSize: 112, lineHeight: 1.1, color: '#fff', WebkitTextStroke: '16px #111', paintOrder: 'stroke fill', textShadow: '0 12px 0 #111'}}>{b}</div>
    </div>
    <div style={{position: 'absolute', bottom: 260, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{background: '#FF3B5C', border: '10px solid #111', borderRadius: 30, padding: '10px 40px', fontFamily: FONT, fontSize: 104, color: '#fff', WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', transform: 'rotate(3deg)', boxShadow: '0 14px 0 #111'}}>{pill}</div>
    </div>
  </>
);
export {Title};

export const ReflejoThumb: React.FC = () => (
  <AbsoluteFill style={{background: '#111'}}>
    <World>
      <rect width={1080} height={1920} fill="#2A0A14" />
      <rect x={120} y={520} width={840} height={980} rx={40} fill="#E8A0A8" stroke="#C9A227" strokeWidth={26} />
      <Face cx={720} cy={900} s={4.2} id="thface" />
      <g>
        <Shadow x={300} y={1740} w={160} />
        <Stickman x={300} y={1750} scale={2.1} color={HERO} pose={POSES.scared} eyes="scared" mouth="o" look={1} sweat />
      </g>
      <rect x={120} y={520} width={840} height={980} rx={40} fill="none" stroke="#111" strokeWidth={12} />
    </World>
    <AbsoluteFill style={{boxShadow: 'inset 0 0 260px rgba(200,0,30,0.7)'}} />
    <Title a="MI REFLEJO" b="DEJÓ DE IMITARME" pill="¡Y ME ATRAPÓ!" />
  </AbsoluteFill>
);
