import React from 'react';
import {FONT, W, pop} from './fx';

export type Word = {text: string; start_ms: number; end_ms: number};

// agrupa palabras en frases cortas (max 3 palabras o corte por pausa/puntuacion)
const groupWords = (words: Word[]): Word[][] => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    const gap = prev ? w.start_ms - prev.end_ms : 0;
    if (cur.length >= 3 || (prev && (gap > 280 || /[.,:!?…]$/.test(prev.text)))) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (i === words.length - 1) groups.push(cur);
  });
  return groups;
};
const cache = new WeakMap<Word[], Word[][]>();

// palabras clave que se pintan de otro color
const DEFAULT_KEY = /60%|10|mentiras|realidad|zas|impecable|volar|suelo|millonario|dinero|fin|mundo|cielo|meteorito|gigante|3|segundos|desapareci|nunca|mentir|mentira|congel|universo|comentarios|tú/i;

export const Captions: React.FC<{t: number; words: Word[]; keys?: RegExp; y?: number; hidden?: boolean}> = ({t, words, keys = DEFAULT_KEY, y = 1430, hidden}) => {
  if (hidden) return null;
  if (!cache.has(words)) cache.set(words, groupWords(words));
  const groups = cache.get(words)!;
  const ms = t * 1000;
  const gi = groups.findIndex((g, i) => {
    const end = i + 1 < groups.length ? groups[i + 1][0].start_ms : g[g.length - 1].end_ms + 600;
    return ms >= g[0].start_ms - 60 && ms < end;
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const gStart = g[0].start_ms / 1000 - 0.06;
  const enter = pop(t, gStart, 11, 260);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        width: W - 80,
        top: y,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 36px',
        transform: `translateY(-50%) scale(${0.85 + 0.15 * enter})`,
      }}
    >
      {g.map((w, i) => {
        const active = ms >= w.start_ms && ms < (g[i + 1]?.start_ms ?? w.end_ms + 400);
        const said = ms >= w.start_ms;
        const key = keys.test(w.text);
        const s = active ? 1 + 0.12 * pop(t, w.start_ms / 1000, 8, 300) : 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontSize: 96,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: active ? (key ? '#FF3B5C' : '#FFE24A') : said ? '#fff' : 'rgba(255,255,255,0.55)',
              WebkitTextStroke: '13px #111',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 0 #111',
              display: 'inline-block',
              transform: `scale(${s}) rotate(${active ? -2 : 0}deg)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
