"""Genera la musica y los efectos (todo sintetizado, sin copyright) y los mezcla con la voz.

Uso: python3 scripts/audio.py   (lee assets/voz_48k.wav, escribe public/mezcla.wav)
"""
import json
import wave
import numpy as np

SR = 48000
DUR = 52.5
N = int(SR * DUR)
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=0.1):
    e = np.ones(n)
    na, nr = min(n, int(SR * a)), min(n, int(SR * r))
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def note(f):  # midi -> Hz
    return 440 * 2 ** ((f - 69) / 12)


def lowpass(x, k=0.1):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc)
        y[i] = acc
    return y


# ---------- instrumentos ----------
def kick(d=0.35):
    t = t_(d)
    f = 50 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def snare(d=0.2):
    t = t_(d)
    return (rng.uniform(-1, 1, len(t)) * 0.7 + np.sin(2 * np.pi * 190 * t) * 0.4) * np.exp(-t * 18)


def hat(d=0.05):
    t = t_(d)
    n = rng.uniform(-1, 1, len(t))
    n = n - lowpass(n, 0.5)
    return n * np.exp(-t * 70)


def pluck(f, d=0.25):
    t = t_(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * 2 * t) * 0.3
    return s * np.exp(-t * 12) * env(len(t), 0.002, 0.03)


def bass(f, d=0.22):
    t = t_(d)
    s = 2 * (t * f % 1) - 1
    s = lowpass(s, 0.08)
    return s * env(len(t), 0.004, 0.05)


def pad(f, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * f * m * t + m) / (i + 1) for i, m in enumerate([1, 1.004, 2, 0.5]))
    return s * env(len(t), 0.6, 0.8) * 0.3


# ---------- musica ----------
music = np.zeros(N)
bpm = 128
beat = 60 / bpm
prog = [57, 53, 60, 55]  # Am F C G (raices)
arp = [0, 3, 7, 12, 7, 3, 0, 7]


def section_happy(start, end):
    b = 0
    t = start
    while t < end - 0.01:
        bar = int(b // 4) % 4
        root = prog[bar]
        if b % 1 == 0:
            add(music, kick(), t, 0.55)
        if b % 2 == 1:
            add(music, snare(), t, 0.25)
        add(music, hat(), t + beat / 2, 0.12)
        add(music, bass(note(root - 12), beat * 0.45), t, 0.35)
        add(music, bass(note(root - 12), beat * 0.4), t + beat / 2, 0.25)
        for k in range(2):
            tone = root + 12 + arp[(int(b * 2) + k) % 8] + (0 if bar != 0 else 0)
            add(music, pluck(note(tone)), t + k * beat / 2, 0.1)
        b += 1
        t = start + b * beat


def section_tense(start, end):
    b = 0
    t = start
    while t < end - 0.01:
        add(music, kick(), t, 0.7)
        add(music, kick(), t + beat / 2, 0.35)
        if b % 2 == 1:
            add(music, snare(0.25), t, 0.35)
        for k in range(4):
            add(music, hat(), t + k * beat / 4, 0.09)
        root = [45, 45, 46, 44][int(b // 4) % 4]
        for k in range(4):
            add(music, bass(note(root), beat * 0.22), t + k * beat / 4, 0.32)
        if b % 4 == 0:
            add(music, pad(note(root + 24), beat * 4), t, 0.25)
            add(music, pad(note(root + 27), beat * 4), t, 0.2)
        b += 1
        t = start + b * beat


def section_calm(start, end):
    add(music, pad(note(60), end - start), start, 0.3)
    add(music, pad(note(64), end - start), start, 0.25)
    add(music, pad(note(67), end - start), start, 0.2)
    t = start
    k = 0
    while t < end - 0.2:
        add(music, pluck(note([72, 76, 79, 84][k % 4]), 0.6), t, 0.07)
        t += beat
        k += 1


def section_creepy(start, end):
    d = end - start
    tt = t_(d)
    f = note(50) * (1 + 0.01 * np.sin(2 * np.pi * 0.7 * tt))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.6 * np.sin(2 * np.pi * np.cumsum(f * 1.06) / SR)
    s *= env(len(tt), 0.3, 0.05) * np.linspace(0.4, 1, len(tt))
    add(music, s, start, 0.25)
    t = start
    while t < end:
        add(music, kick(0.5), t, 0.6)
        t += beat * 2
    # tictac de reloj
    t = start
    while t < end:
        add(music, hat(0.03), t, 0.25)
        t += beat / 2


def section_outro(start, end):
    b = 0
    t = start
    while t < end - 0.01:
        root = prog[int(b // 4) % 4]
        add(music, kick(), t, 0.4)
        add(music, hat(), t + beat / 2, 0.1)
        add(music, pluck(note(root + 12 + arp[b % 8])), t, 0.09)
        add(music, bass(note(root - 12), beat * 0.4), t, 0.25)
        b += 1
        t = start + b * beat


section_happy(0.0, 21.7)
section_tense(21.7, 36.0)
section_calm(36.0, 41.5)
section_creepy(41.5, 45.9)
section_outro(47.0, DUR)

# tape stop al congelarse (45.9): ultimo trozo baja de tono
ts = int(45.4 * SR)
seg = music[ts : int(45.9 * SR)].copy()
idx = np.cumsum(np.linspace(1, 0.05, len(seg) * 2))
idx = idx[idx < len(seg) - 1].astype(int)
music[ts : int(45.9 * SR) + 0] = 0
add(music, seg[idx] * np.linspace(1, 0, len(idx)), 45.4, 1.0)
music[int(46.6 * SR) : int(47.0 * SR)] = 0

# ---------- efectos ----------
sfx = np.zeros(N)


def whoosh(d=0.45, up=True):
    t = t_(d)
    n = rng.uniform(-1, 1, len(t))
    k = np.linspace(0.02, 0.4, len(t)) if up else np.linspace(0.4, 0.02, len(t))
    y = np.empty_like(n)
    acc = 0.0
    for i in range(len(n)):
        acc += k[i] * (n[i] - acc)
        y[i] = acc
    return y * np.sin(np.pi * t / d) * 1.6


def impact(d=0.8):
    t = t_(d)
    return (kick(d) * 1.2 + lowpass(rng.uniform(-1, 1, len(t)), 0.05) * np.exp(-t * 6) * 2)


def sparkle(d=0.8):
    out = np.zeros(int(SR * d))
    for k in range(10):
        f = note(84 + rng.integers(0, 14))
        s = np.sin(2 * np.pi * f * t_(0.15)) * np.exp(-t_(0.15) * 25)
        i = int(k * len(out) / 12)
        out[i : i + len(s)] += s[: len(out) - i]
    return out * 0.6


def zap(d=0.35):
    t = t_(d)
    f = 2400 * np.exp(-t * 9) + 200
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)


def rise(d=1.0):
    t = t_(d)
    f = 300 + 900 * (t / d) ** 2
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.05, 0.1) * 0.6


def coin():
    a = np.sin(2 * np.pi * note(88) * t_(0.08)) * np.exp(-t_(0.08) * 10)
    b = np.sin(2 * np.pi * note(95) * t_(0.5)) * np.exp(-t_(0.5) * 7)
    return np.concatenate([a, b]) * 0.6


def rumble(d=2.0):
    t = t_(d)
    n = lowpass(rng.uniform(-1, 1, len(t)), 0.01) * 6
    return n * env(len(t), 0.4, 0.3)


def crack():
    t = t_(0.6)
    n = rng.uniform(-1, 1, len(t)) * (np.exp(-t * 14) + 0.4 * (rng.uniform(0, 1, len(t)) > 0.995))
    return n + kick(0.6) * 0.8


def tick():
    t = t_(0.12)
    return np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 50)


def poof():
    t = t_(1.0)
    return lowpass(rng.uniform(-1, 1, len(t)), 0.15) * np.exp(-t * 5) * 1.5 + sparkle(1.0) * 0.8


def ding():
    t = t_(1.2)
    return (np.sin(2 * np.pi * note(84) * t) + 0.5 * np.sin(2 * np.pi * note(91) * t)) * np.exp(-t * 4) * 0.5


def glitch(d=0.6):
    out = np.zeros(int(SR * d))
    for k in range(8):
        f = rng.uniform(100, 2000)
        s = np.sign(np.sin(2 * np.pi * f * t_(0.05)))
        i = int(rng.uniform(0, 0.9) * len(out))
        out[i : i + len(s)] += s[: len(out) - i] * 0.5
    return out


def freeze():
    t = t_(1.2)
    f = 3000 + 2000 * np.sin(2 * np.pi * 9 * t)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) * 0.4
    return s + crack()[: len(s)] * 0.8 if len(crack()) >= len(s) else s


def boom():
    t = t_(2.0)
    f = 70 * np.exp(-t * 0.8) + 30
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5) * 1.4


def pop():
    t = t_(0.12)
    f = 300 + 1200 * t / 0.12
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 25)


ev = [
    (whoosh(), 0.0, 0.5), (impact(), 0.2, 0.7),
    (sparkle(), 5.1, 0.5), (zap(), 6.7, 0.4),
    (whoosh(), 7.5, 0.5), (pop(), 8.0, 0.5), (zap(), 11.2, 0.6), (sparkle(1.2), 11.3, 0.7),
    (whoosh(), 13.1, 0.5), (pop(), 14.0, 0.5), (rise(1.3), 15.9, 0.6),
    (whoosh(), 17.6, 0.5), (coin(), 18.9, 0.7), (coin(), 20.6, 0.5), (coin(), 21.0, 0.5),
    (whoosh(0.4, False), 21.6, 0.6), (rumble(1.6), 23.8, 0.6), (impact(), 24.8, 0.8),
    (crack(), 26.5, 0.8), (rumble(8.5), 27.5, 0.55),
    (tick(), 31.2, 0.7), (tick(), 32.7, 0.7), (tick(), 34.2, 0.7),
    (whoosh(0.9, True), 33.7, 0.4), (poof(), 35.9, 0.9),
    (whoosh(), 37.0, 0.4), (pop(), 37.6, 0.4), (ding(), 38.6, 0.6),
    (boom(), 41.6, 0.8), (glitch(), 43.1, 0.5), (glitch(0.8), 44.2, 0.5), (freeze(), 45.9, 0.8),
    (whoosh(), 46.9, 0.5), (pop(), 47.2, 0.6), (ding(), 49.6, 0.4),
]
for sig, at, g in ev:
    add(sfx, sig, at, g)


# ---------- voz y mezcla ----------
def read_wav(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if w.getnchannels() == 2:
            a = a.reshape(-1, 2).mean(1)
    return a


voice = np.zeros(N)
v = read_wav("assets/voz_48k.wav")
add(voice, v, 0.0, 1.0)

# ducking: baja la musica cuando habla la voz
words = json.load(open("src/words.json"))
duck = np.ones(N) * 1.0
for w_ in words:
    a, b = int(w_["start_ms"] / 1000 * SR), int((w_["end_ms"] / 1000 + 0.15) * SR)
    duck[a:b] = 0.45
duck = lowpass(duck, 0.0008)

music /= np.max(np.abs(music)) + 1e-9
sfx /= np.max(np.abs(sfx)) + 1e-9
voice /= np.max(np.abs(voice)) + 1e-9
mix = voice * 0.95 + music * 0.32 * duck + sfx * 0.45
mix /= np.max(np.abs(mix)) / 0.95

with wave.open("assets/mezcla_pre.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", len(mix) / SR)
