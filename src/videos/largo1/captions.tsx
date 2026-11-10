import React from 'react';
import {FONT, pop} from '../../fx';
import {LW, WORDS, Word} from './kit';

// subtitulos karaoke apaisados (frases de max 4 palabras)
const groups: Word[][] = [];
{
  let cur: Word[] = [];
  WORDS.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= 4 || (prev && (w.start_ms - prev.end_ms > 300 || /[.,:!?…»]$/.test(prev.text)))) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (i === WORDS.length - 1) groups.push(cur);
  });
}
const KEY = /\d|tiempo|segundo|vida|poder|mentir|congel|relojera|reloj|hucha|años|edad|muriendo|matando|gato|camión|cien|siempre|nunca|solo|luz/i;

export const LCaptions: React.FC<{t: number; hidden?: boolean}> = ({t, hidden}) => {
  if (hidden) return null;
  const ms = t * 1000;
  let gi = -1;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const end = i + 1 < groups.length ? Math.min(groups[i + 1][0].start_ms, g[g.length - 1].end_ms + 900) : g[g.length - 1].end_ms + 900;
    if (ms >= g[0].start_ms - 60 && ms < end) gi = i;
  }
  if (gi < 0) return null;
  const g = groups[gi];
  const enter = pop(t, g[0].start_ms / 1000 - 0.06, 11, 260);
  return (
    <div style={{position: 'absolute', left: 100, width: LW - 200, top: 975, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 26px', transform: `translateY(-50%) scale(${0.88 + 0.12 * enter})`}}>
      {g.map((w, i) => {
        const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
        const said = ms >= w.start_ms;
        return (
          <span key={i} style={{fontFamily: FONT, fontSize: 66, lineHeight: 1.1, textTransform: 'uppercase', color: active ? (KEY.test(w.text) ? '#FF3B5C' : '#FFE24A') : said ? '#fff' : 'rgba(255,255,255,0.6)', WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', textShadow: '0 6px 0 #111', display: 'inline-block', transform: `scale(${active ? 1 + 0.1 * pop(t, w.start_ms / 1000, 8, 300) : 1})`}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
