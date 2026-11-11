import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {StickmanV2, BLUE} from '../../StickmanV2';
import {POSES, Pose, SvgDefs, lerpPose} from '../../Stickman';
import {W, H, FPS, FONT, BigText, Bubble, Burst, Sparkles, Flash, SpeedLines, Wipe, pop, ramp, easeOut, rnd, sumShake} from '../../fx';
import {Captions} from '../../Captions';
import {loadFonts} from '../../fonts';
import words from './words.json';

export const DURATION_S = 48.6;
const GROUND = 1300;
const KEYS = /duplica|segundo|80|copias|estrellas|universo|moneda|pizza|infinita|móvil|perfecto|cara|otro|cuatro|ocho|16|minuto|calle|ciudad|original|millón|verdad|duplicarías/i;

const World: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <SvgDefs />
    {children}
  </svg>
);
const Cam: React.FC<{s?: number; ox?: number; oy?: number; x?: number; y?: number; children: React.ReactNode}> = ({s = 1, ox = W / 2, oy = H / 2, x = 0, y = 0, children}) => (
  <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</AbsoluteFill>
);
const seq = (t: number, keys: [number, Pose][], d = 0.22): Pose => {
  let p = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t >= keys[i][0]) p = lerpPose(p, keys[i][1], easeOut(ramp(t, keys[i][0], keys[i][0] + d)));
  return p;
};
const blink = (t: number, o = 0) => ((t + o) * 1000) % 3500 < 110;
const Hero: React.FC<{x: number; y?: number; s?: number; pose?: Pose; eyes?: any; mouth?: any; t: number; look?: number; flip?: boolean; glow?: boolean}> = ({x, y = GROUND, s = 1.5, pose = POSES.idle, eyes = 'normal', mouth = 'flat', t, look = 0, flip, glow}) => (
  <g>
    {glow && <circle cx={x} cy={y - 200 * s} r={240 * s} fill="#6EF0FF" opacity={0.25 + 0.1 * Math.sin(t * 7)} filter="url(#blurGlow)" />}
    <ellipse cx={x} cy={y + 4} rx={95 * s} ry={14 * s} fill="#000" opacity={0.22} />
    <StickmanV2 x={x} y={y} scale={s} color={BLUE} pose={pose} eyes={eyes} mouth={mouth} look={look} flip={flip} blink={eyes !== 'closed' && blink(t, x / 400)} />
  </g>
);

// muchedumbre de clones (cabezas) que se duplica
const CloneGrid: React.FC<{t: number; n: number; s?: number; y0?: number; hands?: boolean}> = ({t, n, s = 1, y0 = 0, hands}) => {
  const cols = Math.ceil(Math.sqrt(n * (W / H)));
  const rows = Math.ceil(n / cols);
  const cw = W / cols, ch = (H - y0) / rows;
  const r = Math.min(cw, ch) * 0.34 * s;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const cx = (i % cols + 0.5) * cw + Math.sin(t * 3 + i) * 2;
        const cy = y0 + (Math.floor(i / cols) + 0.5) * ch;
        return (
          <g key={i}>
            {hands && <line x1={cx + r * 0.9} y1={cy + r * 0.6} x2={cx + r * 1.3} y2={cy - r * 1.4 + Math.sin(t * 8 + i) * r * 0.2} stroke="#111" strokeWidth={Math.max(2, r * 0.22)} strokeLinecap="round" />}
            <rect x={cx - r * 0.85} y={cy + r * 0.8} width={r * 1.7} height={r * 1.4} rx={r * 0.4} fill={BLUE} stroke="#111" strokeWidth={Math.max(1.5, r * 0.08)} />
            <circle cx={cx} cy={cy} r={r} fill="#111" />
            <ellipse cx={cx - r * 0.36} cy={cy - r * 0.05} rx={r * 0.24} ry={r * 0.2} fill="#fff" />
            <ellipse cx={cx + r * 0.36} cy={cy - r * 0.05} rx={r * 0.24} ry={r * 0.2} fill="#fff" />
          </g>
        );
      })}
    </g>
  );
};

const Coin: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={60} ry={60} fill="#FFD23F" stroke="#111" strokeWidth={8} />
    <ellipse rx={42} ry={42} fill="none" stroke="#C9A227" strokeWidth={6} />
    <text y={24} textAnchor="middle" fontFamily={FONT} fontSize={70} fill="#C9A227">$</text>
  </g>
);
const Pizza: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={130} ry={40} fill="#E9C46A" stroke="#111" strokeWidth={7} />
    <ellipse rx={110} ry={30} fill="#E63946" />
    {[-60, -10, 40, 70, -40].map((cx, i) => <ellipse key={i} cx={cx} cy={(i % 2 ? -8 : 6)} rx={14} ry={7} fill="#9A031E" />)}
  </g>
);
const Phone: React.FC<{x: number; y: number; s?: number; r?: number}> = ({x, y, s = 1, r = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${r})`}>
    <rect x={-70} y={-130} width={140} height={260} rx={22} fill="#222" stroke="#111" strokeWidth={7} />
    <rect x={-58} y={-112} width={116} height={222} rx={10} fill="#7BDFF2" />
  </g>
);

const T = (w: string, n = 1) => {
  let k = 0;
  const key = w.toLowerCase();
  for (const x of words as any[]) if (x.text.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, '') === key && ++k === n) return x.start_ms / 1000;
  throw new Error('palabra ' + w);
};

// ---------------- escenas ----------------
const S1Hook: React.FC<{t: number}> = ({t}) => {
  // 0-0,6 muro de clones / 0,6-1,3 cara / 1,3-2,8 la cuadricula se duplica / 2,8+ estrellas
  if (t < 0.6) {
    return (
      <AbsoluteFill style={{background: '#14213D'}}>
        <Cam s={1.6 - t * 0.6}><World><CloneGrid t={t} n={120} /></World></Cam>
        <Flash t={t} at={0} dur={0.15} max={0.4} />
      </AbsoluteFill>
    );
  }
  if (t < 1.3) {
    return (
      <AbsoluteFill style={{background: '#1B263B'}}>
        <Cam s={2.6} oy={760}><World><Hero x={540} t={t} eyes="wide" mouth="o" s={1.5} /></World></Cam>
      </AbsoluteFill>
    );
  }
  if (t < 2.8) {
    const n = Math.min(256, Math.pow(2, Math.floor((t - 1.3) / 0.19) + 1));
    return (
      <AbsoluteFill style={{background: '#003049'}}>
        <World><CloneGrid t={t} n={n} y0={520} /></World>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1B2A6B, #02030F 70%)'}}>
      <World>
        {Array.from({length: Math.floor(40 + (t - 2.8) * 120)}).map((_, i) => (
          <circle key={i} cx={rnd(i) * W} cy={rnd(i + 5) * H} r={1.5 + rnd(i + 2) * 3.5} fill={i % 7 ? '#fff' : '#FFE24A'} opacity={0.5 + rnd(i + 9) * 0.5} />
        ))}
        <g transform={`translate(540 ${1050}) scale(${0.5 + 0.1 * Math.sin(t * 4)})`}><CloneGrid t={t} n={16} /></g>
      </World>
    </AbsoluteFill>
  );
};

const S2Power: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Burst t={t} c1="#003049" c2="#00507A" speed={30} />
    <World>
      <Hero x={540} t={t} pose={POSES.hands} eyes="normal" mouth="flat" glow s={1.6} />
      {[-1, 1].map((d) => <circle key={d} cx={540 + d * 190} cy={GROUND - 520} r={40 + Math.sin(t * 10) * 8} fill="#6EF0FF" opacity={0.7} filter="url(#blurGlow)" />)}
    </World>
  </AbsoluteFill>
);

const Table: React.FC = () => (
  <g>
    <rect width={W} height={GROUND} fill="#FFE8D6" />
    <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#B07940" />
    <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#111" strokeWidth={8} />
    <rect x={560} y={1040} width={480} height={34} rx={8} fill="#8B5A3C" stroke="#111" strokeWidth={7} />
    <rect x={590} y={1074} width={22} height={226} fill="#111" />
    <rect x={990} y={1074} width={22} height={226} fill="#111" />
  </g>
);

const S3Objects: React.FC<{t: number}> = ({t}) => {
  const coin2 = T('dos'), pizzaT = T('pizza', 2), phone2 = T('dos', 2);
  const stage = t < T('toqué', 2) ? 'coin' : t < T('toqué', 3) ? 'pizza' : 'phone';
  const reach: Pose = {...POSES.reach, armR: [100, 0]};
  const pose = seq(t, [[0, POSES.idle], [T('toqué') + 0.1, reach], [coin2, POSES.cheer], [T('toqué', 2), POSES.idle], [T('toqué', 2) + 0.2, reach], [pizzaT, POSES.cheer], [T('toqué', 3), POSES.idle], [T('toqué', 3) + 0.2, reach], [phone2, POSES.cheer]]);
  const sh = sumShake(t, [[coin2, 0.3, 18], [pizzaT, 0.3, 18], [phone2, 0.3, 18]]);
  return (
    <AbsoluteFill>
      <Cam s={1.2} ox={700} oy={1000} x={sh.x} y={sh.y}>
        <World>
          <Table />
          <Hero x={360} t={t} pose={pose} eyes={pose === POSES.cheer ? 'happy' : 'normal'} mouth={t > coin2 ? 'smile' : 'flat'} look={1} s={1.45} />
          {stage === 'coin' && <><Coin x={800} y={990} />{t > coin2 && <Coin x={900} y={990} s={pop(t, coin2)} />}</>}
          {stage === 'pizza' && Array.from({length: t > pizzaT ? Math.min(14, 1 + Math.floor((t - pizzaT) * 12)) : 1}).map((_, i) => <Pizza key={i} x={800} y={1010 - i * 34} />)}
          {stage === 'phone' && <><Phone x={760} y={930} r={-8} />{t > phone2 && <Phone x={900} y={930} r={8} s={pop(t, phone2)} />}</>}
        </World>
      </Cam>
      <BigText y={330} t={t} at={coin2} until={T('toqué', 2) - 0.05} text="×2" size={260} />
      <BigText y={330} t={t} at={pizzaT} until={T('toqué', 3) - 0.05} text={'¡PIZZA\nINFINITA!'} size={150} wiggle />
      <BigText y={330} t={t} at={phone2} text="×2" size={260} color="#6EF0FF" />
      <Sparkles t={t} at={coin2} cx={900} cy={1000} n={14} spread={300} />
      <Sparkles t={t} at={pizzaT} cx={800} cy={900} n={14} spread={300} />
      <Sparkles t={t} at={phone2} cx={900} cy={930} n={14} spread={300} color="#6EF0FF" />
    </AbsoluteFill>
  );
};

const S4Perfect: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Burst t={t} c1="#FFB703" c2="#FFCB47" speed={30} />
    <World>
      {Array.from({length: 24}).map((_, i) => {
        const y = ((t * 600 + rnd(i) * 1900) % 2100) - 150;
        return i % 2 ? <Coin key={i} x={rnd(i + 3) * W} y={y} s={0.7} /> : <Pizza key={i} x={rnd(i + 3) * W} y={y} s={0.6} />;
      })}
      <Hero x={540} t={t} pose={POSES.cheer} eyes="happy" mouth="grin" s={1.6} />
    </World>
  </AbsoluteFill>
);

const S5Face: React.FC<{t: number}> = ({t}) => {
  const touch = T('toqué', 4), clone = T('apareció');
  const pose = seq(t, [[0, POSES.idle], [touch - 0.2, {...POSES.idle, armR: [30, -150]}], [clone, POSES.scared]]);
  const k = easeOut(ramp(t, clone, clone + 0.5));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#1B263B'}} />
      <Cam s={1.7 - 0.6 * k} oy={760} x={sumShake(t, [[clone, 0.5, 30]]).x}>
        <World>
          <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="#111827" />
          <Hero x={540 - 220 * k} t={t} pose={pose} eyes={t > clone ? 'wide' : t > touch ? 'side' : 'normal'} mouth={t > clone ? 'o' : 'flat'} look={1} />
          {t > clone && <Hero x={540 + 220 * k} t={t} pose={POSES.scared} eyes="wide" mouth="o" flip look={1} />}
        </World>
      </Cam>
      <BigText y={330} t={t} at={T('querer')} until={clone - 0.05} text="SIN QUERER..." size={130} color="#fff" />
      <BigText y={330} t={t} at={clone} text="¡OTRO YO!" size={190} color="#FF3B5C" wiggle />
      <Flash t={t} at={clone} dur={0.3} color="#6EF0FF" />
    </AbsoluteFill>
  );
};

const S6Multiply: React.FC<{t: number}> = ({t}) => {
  const n = t < T('cuatro') ? 2 : t < T('ocho') ? 4 : t < T('16') ? 8 : 16;
  const key = t < T('cuatro') ? T('tocó') : t < T('ocho') ? T('cuatro') : t < T('16') ? T('ocho') : T('16');
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#1B263B'}} />
      <Cam x={sumShake(t, [[key, 0.3, 20]]).x}>
        <World>
          {n <= 2 ? (
            <>
              <Hero x={320} t={t} pose={POSES.scared} eyes="wide" mouth="o" look={1} />
              <Hero x={760} t={t} pose={{...POSES.reach, armR: [100, 0]}} eyes="normal" flip look={1} />
            </>
          ) : (
            <g transform={`translate(0 ${300}) scale(1 0.75)`}><CloneGrid t={t} n={n} y0={200} /></g>
          )}
        </World>
      </Cam>
      <BigText t={t} at={key} text={String(n)} size={300} color="#FFE24A" y={300} />
      <Flash t={t} at={key} dur={0.15} color="#6EF0FF" max={0.5} />
    </AbsoluteFill>
  );
};

const S7City: React.FC<{t: number}> = ({t}) => {
  const street = t < T('dos', 3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: street ? '#8ECAE6' : '#0B1026'}} />
      <World>
        {street ? (
          <g>
            {Array.from({length: 8}).map((_, i) => <rect key={i} x={i * 140 - 20} y={300 + rnd(i) * 300} width={130} height={900} fill="#5B6C9E" stroke="#111" strokeWidth={5} />)}
            <rect x={0} y={1100} width={W} height={H - 1100} fill="#4A4E69" />
            <CloneGrid t={t} n={Math.min(220, 40 + Math.floor((t - T('en', 3)) * 120))} y0={900} />
          </g>
        ) : (
          <g>
            {Array.from({length: 600}).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={400 + rnd(i + 4) * 1300} r={3} fill={BLUE} opacity={Math.min(1, (t - T('dos', 3)) * 2)} />)}
            {Array.from({length: 14}).map((_, i) => <rect key={i} x={i * 80} y={1400 - rnd(i) * 500} width={60} height={600} fill="#2a2440" stroke="#111" strokeWidth={3} opacity={0.7} />)}
          </g>
        )}
      </World>
      <BigText y={330} t={t} at={T('calle') - 0.3} until={T('dos', 3) - 0.05} text="¡LA CALLE LLENA!" size={130} />
      <BigText y={330} t={t} at={T('ciudad')} text={'¡LA CIUDAD\nENTERA!'} size={150} color="#6EF0FF" wiggle />
    </AbsoluteFill>
  );
};

const S8Original: React.FC<{t: number}> = ({t}) => {
  const raise = T('levanté'), million = T('junto');
  const out = easeOut(ramp(t, million, million + 1.6));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#14213D'}} />
      <Cam s={1 + (1 - out) * 1.2} oy={900}>
        <World>
          <CloneGrid t={t} n={260} y0={500} hands={t > million} s={0.95} />
          <rect x={300} y={500} width={480} height={900} fill="#14213D" opacity={1 - out} />
          <g opacity={1 - out}>
            <Hero x={540} t={t} pose={t > raise ? {...POSES.idle, armR: [170, 10]} : POSES.idle} eyes={t > raise ? 'normal' : 'side'} mouth="flat" s={1.4} />
          </g>
        </World>
      </Cam>
      <Bubble t={t} at={T('levante') - 0.3} until={raise} text="¡QUE LEVANTE LA MANO EL ORIGINAL!" x={540} y={560} w={760} size={58} shout />
      <BigText y={330} t={t} at={T('millón')} text={'1.000.000\nDE MANOS'} size={150} wiggle />
    </AbsoluteFill>
  );
};

const S9Doubt: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: '#0B1026'}} />
    <Cam s={1.5 + t * 0.03} oy={760}>
      <World>
        {[-1, 1].map((d) => <g key={d} opacity={0.35}><Hero x={540 + d * 300} t={t} eyes="normal" s={1.4} flip={d > 0} /></g>)}
        <Hero x={540} t={t} pose={POSES.hands} eyes="side" mouth="flat" s={1.5} look={Math.sin(t * 2)} />
      </World>
    </Cam>
    <BigText y={330} t={t} at={T('soy') - 0.1} text={'¿SOY EL\nDE VERDAD?'} size={150} color="#FF3B5C" />
  </AbsoluteFill>
);

const S10End: React.FC<{t: number}> = ({t}) => {
  const st = T('qué');
  const cta = st + 1.4;
  return (
    <AbsoluteFill>
      <Burst t={t} c1="#003049" c2="#00507A" speed={20} />
      <World>
        <g opacity={0.5}><CloneGrid t={t} n={40} y0={1300} s={0.8} /></g>
        <Hero x={460} t={t} pose={t > cta ? {...POSES.point, armR: [60, -10]} : POSES.shrug} eyes="normal" mouth="flat" s={1.45} />
        {t > cta && (
          <g transform={`translate(${860 + Math.sin(t * 8) * 12} ${1060 + Math.sin(t * 8) * 12}) scale(${pop(t, cta)}) rotate(-40)`}>
            <path d="M -24 -120 L 24 -120 L 24 0 L 62 0 L 0 80 L -62 0 L -24 0 Z" fill="#FFE24A" stroke="#111" strokeWidth={9} strokeLinejoin="round" />
          </g>
        )}
      </World>
      <BigText t={t} at={st} text={'¿QUÉ\nDUPLICARÍAS TÚ?'} size={120} color="#fff" y={330} />
      {t > cta && (
        <div style={{position: 'absolute', left: 0, width: W, top: 600, display: 'flex', justifyContent: 'center', transform: `scale(${pop(t, cta) * (1 + Math.sin(t * 8) * 0.06)})`}}>
          <div style={{background: '#FF3B5C', border: '8px solid #111', borderRadius: 40, padding: '12px 40px', fontFamily: FONT, fontSize: 80, color: '#fff', WebkitTextStroke: '9px #111', paintOrder: 'stroke fill', boxShadow: '0 12px 0 #111'}}>¡COMÉNTALO!</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SCENES: [number, React.FC<{t: number}>][] = [
  [0, S1Hook],
  [T('y'), S2Power],
  [T('toqué') - 0.3, S3Objects],
  [T('era'), S4Perfect],
  [T('hasta'), S5Face],
  [T('él'), S6Multiply],
  [T('en', 3), S7City],
  [T('entonces'), S8Original],
  [T('y', 4), S9Doubt],
  [T('qué'), S10End],
];

export const DuplicarShort: React.FC = () => {
  loadFonts();
  const t = useCurrentFrame() / FPS;
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i][0]) idx = i;
  const [s0, S] = SCENES[idx];
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <Audio src={staticFile('duplicar/mezcla.wav')} />
      <S t={t - s0 >= 0 ? t : t} />
      {SCENES.slice(1).map(([c], i) => <Wipe key={i} t={t} at={c} />)}
      <BigText t={t} at={0.1} until={2.75} text={'×2\nCADA SEGUNDO'} size={150} y={330} />
      <BigText t={t} at={T('80')} until={T('y') - 0.05} text={'80 SEGUNDOS =\nMÁS COPIAS QUE ESTRELLAS'} size={92} y={330} color="#FFE24A" />
      <Captions t={t} words={words as any} keys={KEYS} />
    </AbsoluteFill>
  );
};

export const DuplicarThumb: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{background: '#003049'}}>
      <World>
        <CloneGrid t={0.3} n={160} y0={700} />
        <rect x={0} y={700} width={W} height={1220} fill="#003049" opacity={0.35} />
        <Hero x={540} y={1500} t={0} pose={POSES.scared} eyes="wide" mouth="o" s={2.4} glow />
      </World>
      <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', transform: 'rotate(-4deg)'}}>
        <div style={{fontFamily: FONT, fontSize: 150, lineHeight: 1, color: '#FFE24A', WebkitTextStroke: '18px #111', paintOrder: 'stroke fill', textShadow: '0 14px 0 #111'}}>DUPLICO</div>
        <div style={{fontFamily: FONT, fontSize: 120, lineHeight: 1.1, color: '#fff', WebkitTextStroke: '16px #111', paintOrder: 'stroke fill', textShadow: '0 12px 0 #111'}}>TODO LO QUE TOCO</div>
      </div>
      <div style={{position: 'absolute', bottom: 230, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{background: '#FF3B5C', border: '10px solid #111', borderRadius: 30, padding: '10px 40px', fontFamily: FONT, fontSize: 104, color: '#fff', WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', transform: 'rotate(3deg)', boxShadow: '0 14px 0 #111'}}>¡Y ME TOQUÉ!</div>
      </div>
    </AbsoluteFill>
  );
};

export {SpeedLines, H};
