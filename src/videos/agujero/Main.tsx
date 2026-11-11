import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VWorld, VCam, V2, makeT, EndV2, ShellV2, ThumbTitle, POSES, W, H, GROUND} from '../../kitV2';
import {BigText, Bubble, Flash, SpeedLines, ramp, easeOut, rnd, sumShake} from '../../fx';
import words from './words.json';

export const DURATION_S = 50.0;
const T = makeT(words as any);
const KEYS = /agujero|tierra|42|minutos|caí|resbalé|montaña|avión|manto|miles|grados|centro|5\.000|gravedad|flotaba|luz|mundo|centímetro|3|días|agárrame/i;

// tunel vertical: paredes de roca que suben (vel = pixeles por segundo)
const Tunnel: React.FC<{t: number; vel: number; c1?: string; c2?: string; glow?: string}> = ({t, vel, c1 = '#3B2416', c2 = '#5C3A21', glow}) => {
  const off = (t * vel) % 240;
  return (
    <g>
      <rect width={W} height={H} fill={c1} />
      {glow && <rect width={W} height={H} fill={glow} opacity={0.35} />}
      <rect x={180} y={0} width={720} height={H} fill="#140C08" />
      {Array.from({length: 11}).map((_, i) => (
        <g key={i}>
          <path d={`M 0 ${i * 240 - off - 120} l 180 40 l 0 120 l -180 30 Z`} fill={c2} stroke="#111" strokeWidth={5} />
          <path d={`M ${W} ${i * 240 - off} l -180 50 l 0 110 l 180 40 Z`} fill={c2} stroke="#111" strokeWidth={5} />
          <circle cx={90 + rnd(i) * 60} cy={i * 240 - off} r={14 + rnd(i + 2) * 14} fill={c1} stroke="#111" strokeWidth={4} />
          <circle cx={W - 90 - rnd(i + 5) * 60} cy={i * 240 - off + 120} r={12 + rnd(i + 9) * 14} fill={c1} stroke="#111" strokeWidth={4} />
        </g>
      ))}
      <line x1={180} y1={0} x2={180} y2={H} stroke="#111" strokeWidth={8} />
      <line x1={900} y1={0} x2={900} y2={H} stroke="#111" strokeWidth={8} />
    </g>
  );
};
const Faller: React.FC<{t: number; y?: number; s?: number; spin?: number; eyes?: any; mouth?: any; pose?: any}> = ({t, y = 1250, s = 1.25, spin = 0, eyes = 'wide', mouth = 'o', pose = POSES.armsUp}) => (
  <V2 x={540 + Math.sin(t * 3) * 30} y={y} t={t} s={s} pose={pose} eyes={eyes} mouth={mouth} rotate={spin} shadow={false} noBlink />
);

const S1Hook: React.FC<{t: number}> = ({t}) => {
  // flash-forward: centro de la Tierra (0-1 s), luego caida con cortes cada 0,6 s
  const ff = t < 1.0;
  const cuts = [1.0, 1.6, 2.2, 2.8, 3.4, 4.0, 4.6, 5.2, 5.8];
  const i = cuts.filter((c) => t >= c).length;
  const pal = [['#3B2416', '#5C3A21'], ['#4A1B0C', '#7A2E12'], ['#3B2416', '#5C3A21'], ['#6A1F06', '#A63A10']];
  if (ff) {
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle, #FFF7C2 0%, #FFB703 45%, #E85D04 100%)'}}>
        <VCam s={1.3 + t * 0.3} r={t * 30}>
          <VWorld><Faller t={t} y={1150} s={1.3} spin={t * 200} pose={POSES.fly} /></VWorld>
        </VCam>
      </AbsoluteFill>
    );
  }
  const [c1, c2] = pal[i % pal.length];
  const sh = sumShake(t, cuts.map((c) => [c, 0.25, 22] as [number, number, number]));
  return (
    <AbsoluteFill>
      <VCam s={1 + ((t - 1) % 0.6) * 0.35} x={sh.x} y={sh.y}>
        <VWorld>
          <Tunnel t={t} vel={2400} c1={c1} c2={c2} />
          <Faller t={t} y={1150} spin={i % 2 ? 28 : -28} />
        </VWorld>
      </VCam>
      <SpeedLines t={t} vertical opacity={0.6} />
    </AbsoluteFill>
  );
};

const Park: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={W} height={GROUND} fill="#8ED1FC" />
    <circle cx={880} cy={220} r={90} fill="#FFE24A" stroke="#111" strokeWidth={7} />
    {[120, 960].map((x, i) => (
      <g key={i}>
        <rect x={x - 22} y={850} width={44} height={GROUND - 850} fill="#8B5A3C" stroke="#111" strokeWidth={6} />
        <circle cx={x} cy={800} r={140} fill="#3FB950" stroke="#111" strokeWidth={7} />
      </g>
    ))}
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#5BBF4A" />
    <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
    <ellipse cx={600} cy={GROUND + 60} rx={230} ry={60} fill="#000" stroke="#111" strokeWidth={8} />
    <ellipse cx={600} cy={GROUND + 70} rx={200} ry={44} fill="#140C08" />
  </g>
);

const S2Park: React.FC<{t: number}> = ({t}) => {
  const peek = T('asomé'), slip = T('resbalé');
  const k = easeOut(ramp(t, slip, slip + 0.7));
  const x = t < peek ? 300 : 300 + 200 * easeOut(ramp(t, peek, peek + 0.6));
  return (
    <AbsoluteFill>
      <VCam s={t > peek ? 1.25 : 1} oy={1300} x={sumShake(t, [[slip, 0.4, 25]]).x}>
        <VWorld>
          <Park t={t} />
          {k < 1 && (
            <V2 x={x + 100 * k} y={GROUND + 40 + 500 * k * k} t={t} s={1.15}
              pose={t > slip ? POSES.armsUp : t > peek ? POSES.pointDown : POSES.idle}
              rotate={t > slip ? -40 * k : t > peek ? 25 : 0} eyes={t > slip ? 'wide' : 'normal'} mouth={t > slip ? 'o' : 'flat'} look={t > peek ? 1 : 0} shadow={false} />
          )}
          {/* tapa la parte de abajo para que "entre" en el agujero */}
          {t > slip && <rect x={0} y={GROUND + 72} width={W} height={H} fill="#5BBF4A" />}
          {t > slip && <ellipse cx={600} cy={GROUND + 60} rx={230} ry={14} fill="none" stroke="#111" strokeWidth={8} />}
        </VWorld>
      </VCam>
      <BigText t={t} at={T('perfecto')} until={peek - 0.05} text={'UN AGUJERO\nPERFECTO'} size={130} y={330} color="#fff" />
      <BigText t={t} at={slip} text="¡RESBALÉ!" size={190} y={330} color="#FF3B5C" wiggle />
    </AbsoluteFill>
  );
};

const S3Fall: React.FC<{t: number}> = ({t}) => {
  const fast = t > T('minuto');
  return (
    <AbsoluteFill>
      <VCam s={fast ? 1.15 : 1} x={fast ? Math.sin(t * 60) * 6 : 0}>
        <VWorld>
          <Tunnel t={t} vel={fast ? 3600 : 1200} />
          <Faller t={t} spin={fast ? 0 : Math.sin(t * 2) * 30} mouth={fast ? 'teeth' : 'grin'} eyes={fast ? 'wide' : 'happy'} />
          {fast && (
            <g transform={`translate(${540 + 260} ${300 + ((t * 2500) % 1700)})`}>
              <path d="M -40 -110 L 40 -110 L 40 60 L 110 100 L 40 100 L 20 140 L -20 140 L -40 100 L -110 100 L -40 60 Z" fill="#fff" stroke="#111" strokeWidth={6} />
            </g>
          )}
        </VWorld>
      </VCam>
      {fast && <SpeedLines t={t} vertical opacity={0.8} />}
      <BigText t={t} at={T('montaña')} until={T('minuto') - 0.05} text={'¡COMO UNA\nMONTAÑA RUSA!'} size={120} y={330} color="#FFE24A" />
      <BigText t={t} at={T('avión')} text={'2.000 KM/H'} size={180} y={330} color="#FF3B5C" wiggle />
      <BigText t={t} at={T('avión')} text={'MÁS QUE UN AVIÓN'} size={80} y={480} color="#fff" />
    </AbsoluteFill>
  );
};

const S4Mantle: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <VCam s={1.1} x={Math.sin(t * 45) * 7}>
      <VWorld>
        <Tunnel t={t} vel={3000} c1="#9D0208" c2="#E85D04" glow="#FFBA08" />
        {Array.from({length: 8}).map((_, i) => (
          <circle key={i} cx={200 + rnd(i) * 680} cy={H - ((t * 900 + i * 260) % (H + 200))} r={20 + rnd(i + 4) * 30} fill="#FFBA08" stroke="#111" strokeWidth={4} opacity={0.85} />
        ))}
        <Faller t={t} eyes="scared" mouth="teeth" pose={POSES.scared} />
        {[0, 1, 2].map((j) => <path key={j} d={`M ${470 + j * 60} ${700 - ((t * 200 + j * 40) % 160)} q 15 -25 0 -50 q -15 -25 0 -50`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.7} />)}
      </VWorld>
    </VCam>
    <BigText t={t} at={T('manto')} until={T('miles') - 0.05} text="EL MANTO" size={150} y={330} color="#fff" />
    <BigText t={t} at={T('miles')} text={'¡MILES DE\nGRADOS!'} size={160} y={330} color="#FFE24A" wiggle />
  </AbsoluteFill>
);

const S5Core: React.FC<{t: number}> = ({t}) => {
  const zero = t > T('ninguna');
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #FFFDE8 0%, #FFD60A 35%, #F48C06 70%, #9D0208 100%)'}}>
      <VCam s={1 + 0.05 * Math.sin(t * 2)}>
        <VWorld>
          {Array.from({length: 14}).map((_, i) => (
            <circle key={i} cx={rnd(i) * W} cy={rnd(i + 8) * H + Math.sin(t + i) * 40} r={8 + rnd(i + 3) * 18} fill="#fff" opacity={0.6} />
          ))}
          <V2 x={540} y={1200 + Math.sin(t * 1.6) * 60} t={t} s={1.3} pose={zero ? POSES.fly : POSES.scared} rotate={zero ? (t - T('ninguna')) * 40 : 0} eyes={zero ? 'happy' : 'wide'} mouth={zero ? 'grin' : 'o'} shadow={false} noBlink />
        </VWorld>
      </VCam>
      <BigText t={t} at={T('centro')} until={T('5.000') - 0.05} text={'EL CENTRO\nDE LA TIERRA'} size={130} y={330} color="#fff" />
      <BigText t={t} at={T('5.000')} until={T('ninguna') - 0.05} text={'+5.000 °C'} size={200} y={330} color="#FF3B5C" wiggle />
      <BigText t={t} at={T('ninguna')} until={T('flotaba') - 0.05} text={'GRAVEDAD:\n0'} size={170} y={330} color="#6EF0FF" />
      <BigText t={t} at={T('flotaba')} text="FLOTABA..." size={170} y={330} color="#fff" />
      <Flash t={t} at={T('centro')} dur={0.4} />
    </AbsoluteFill>
  );
};

const S6Rise: React.FC<{t: number}> = ({t}) => {
  const st = T('luego');
  const vel = Math.max(80, 1500 - (t - st) * 340);
  const light = ramp(t, T('vi'), T('mundo'));
  return (
    <AbsoluteFill>
      <VWorld>
        <Tunnel t={-t} vel={vel} />
        <ellipse cx={540} cy={0} rx={360 * (0.3 + light)} ry={200 * (0.3 + light)} fill="#FFF7C2" opacity={light} filter="url(#blurGlow)" />
        <rect x={180} y={0} width={720} height={500 * light} fill="#FFF7C2" opacity={light * 0.5} />
        <V2 x={540} y={1250} t={t} s={1.25} pose={light > 0 ? POSES.reach : POSES.armsUp} eyes="wide" mouth={light > 0.5 ? 'grin' : 'o'} shadow={false} noBlink />
      </VWorld>
      <BigText t={t} at={T('despacio') - 0.3} until={T('vi') - 0.05} text={'CADA VEZ MÁS\nDESPACIO...'} size={120} y={560} color="#fff" />
      <BigText t={t} at={T('lado', 2)} text={'¡EL OTRO LADO\nDEL MUNDO!'} size={120} y={560} color="#FFE24A" />
    </AbsoluteFill>
  );
};

const S7Edge: React.FC<{t: number}> = ({t}) => {
  const fall = T('volví');
  const k = easeOut(ramp(t, fall, fall + 0.8));
  const reach = easeOut(ramp(t, T('estiré'), T('borde')));
  // vista desde arriba: borde del agujero en un desierto, mano que sube
  return (
    <AbsoluteFill style={{background: '#F4D58D'}}>
      <VCam s={1 + 0.4 * ramp(t, T('faltó'), T('centímetro'))} oy={760} x={sumShake(t, [[fall, 0.5, 30]]).x}>
        <VWorld>
          <rect width={W} height={H} fill="#F4D58D" />
          {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${rnd(i) * W} ${rnd(i + 4) * H} q 30 -20 60 0`} stroke="#C9A25E" strokeWidth={6} fill="none" />)}
          <circle cx={540} cy={1000} r={420} fill="#140C08" stroke="#111" strokeWidth={12} />
          <g transform={`translate(540 1000) scale(${(1 - k * 0.95) * (0.75 + 0.25 * reach)})`}>
            <V2 x={0} y={320} t={t} s={1.0} pose={POSES.armsUp} eyes={k > 0 ? 'scared' : 'wide'} mouth="o" shadow={false} noBlink />
          </g>
          {/* el borde del suelo */}
          <circle cx={540} cy={1000} r={420} fill="none" stroke="#8B5A3C" strokeWidth={22} />
          {t > T('faltó') && t < fall && (
            <g>
              <line x1={540} y1={580} x2={540} y2={540} stroke="#FF3B5C" strokeWidth={10} />
              <line x1={510} y1={580} x2={570} y2={580} stroke="#FF3B5C" strokeWidth={8} />
              <line x1={510} y1={540} x2={570} y2={540} stroke="#FF3B5C" strokeWidth={8} />
            </g>
          )}
        </VWorld>
      </VCam>
      <BigText t={t} at={T('agarrarme')} until={T('faltó') - 0.05} text="¡CASI!" size={200} y={300} color="#fff" />
      <BigText t={t} at={T('centímetro')} until={fall - 0.05} text={'FALTÓ\n1 CM'} size={200} y={300} color="#FF3B5C" wiggle />
      <BigText t={t} at={fall} text="¡NOOOO!" size={200} y={300} color="#FF3B5C" wiggle />
    </AbsoluteFill>
  );
};

const S8Loop: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <VWorld>
      <Tunnel t={t} vel={1800} />
      <Faller t={t} eyes="normal" mouth="flat" pose={POSES.hips} spin={Math.sin(t) * 15} />
    </VWorld>
    <SpeedLines t={t} vertical opacity={0.4} />
    <BigText t={t} at={T('días')} text="DÍA 3" size={200} y={330} color="#FFE24A" />
    <Bubble t={t} at={T('agárrame')} text="¡AGÁRRAME!" x={700} y={820} w={420} size={70} shout />
  </AbsoluteFill>
);

const S9End: React.FC<{t: number}> = ({t}) => <EndV2 t={t} at={T('te')} question={'¿TE TIRARÍAS\nPOR EL\nAGUJERO?'} c1="#3B2416" c2="#6A1F06" />;

const Overlay: React.FC<{t: number}> = ({t}) => (
  <>
    <BigText t={t} at={0.05} until={T('42') - 0.05} text={'¡ME CAÍ POR\nLA TIERRA!'} size={150} y={330} color="#FFE24A" wiggle />
    <BigText t={t} at={T('42')} until={T('yo') - 0.05} text={'42\nMINUTOS'} size={220} y={360} color="#FF3B5C" />
    <BigText t={t} at={T('caí')} until={T('era') - 0.05} text={'...Y LO PEOR\nLLEGÓ AL FINAL'} size={110} y={360} color="#fff" />
  </>
);

export const AgujeroShort: React.FC = () => (
  <ShellV2 name="agujero" words={words as any} keys={KEYS} overlay={Overlay} scenes={[
    [0, S1Hook], [T('era'), S2Park], [T('los'), S3Fall], [T('atravesé'), S4Mantle], [T('y', 2), S5Core],
    [T('luego'), S6Rise], [T('estiré'), S7Edge], [T('y', 5), S8Loop], [T('te'), S9End],
  ]} />
);

export const AgujeroThumb: React.FC = () => (
  <AbsoluteFill>
    <VWorld>
      <Tunnel t={0.3} vel={0} c1="#9D0208" c2="#E85D04" glow="#FFBA08" />
      <circle cx={540} cy={1500} r={300} fill="#FFF7C2" filter="url(#blurGlow)" />
      <V2 x={540} y={1250} t={0} s={2.0} pose={POSES.armsUp} eyes="wide" mouth="o" shadow={false} />
    </VWorld>
    <ThumbTitle a="ME CAÍ POR" b="UN AGUJERO EN LA TIERRA" pill="42 MINUTOS CAYENDO" />
  </AbsoluteFill>
);
