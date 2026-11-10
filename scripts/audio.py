"""Musica y efectos sintetizados por codigo (sin copyright) + mezcla con la voz.

Uso: python3 scripts/audio.py <video>
  lee   assets/<video>/voz_raw.wav  y  src/videos/<video>/words.json
  crea  public/<video>/mezcla.wav   (-14 LUFS)
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


# ---------------- utilidades ----------------
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
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


def lowpass(x, k=0.1):
    """filtro paso bajo de un polo (vectorizado por bloques via lfilter casero)"""
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc)
        y[i] = acc
    return y


def osc(f, d):
    """oscilador seno con frecuencia constante o variable (array)"""
    if np.isscalar(f):
        return np.sin(2 * np.pi * f * t_(d))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def noise(d):
    return rng.uniform(-1, 1, int(SR * d))


# ---------------- instrumentos ----------------
def kick(d=0.35):
    t = t_(d)
    return osc(50 + 110 * np.exp(-t * 30), d) * np.exp(-t * 9)


def snare(d=0.2):
    t = t_(d)
    return (noise(d) * 0.7 + np.sin(2 * np.pi * 190 * t) * 0.4) * np.exp(-t * 18)


def hat(d=0.05):
    t = t_(d)
    n = noise(d)
    return (n - lowpass(n, 0.5)) * np.exp(-t * 70)


def pluck(f, d=0.25, decay=12):
    t = t_(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * 2 * t) * 0.3
    return s * np.exp(-t * decay) * env(len(t), 0.002, 0.03)


def bell(f, d=1.2):
    t = t_(d)
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) + 0.25 * np.sin(2 * np.pi * f * 5.4 * t)
    return s * np.exp(-t * 3.5) * env(len(t), 0.002, 0.05) * 0.5


def bass(f, d=0.22):
    t = t_(d)
    s = lowpass(2 * (t * f % 1) - 1, 0.08)
    return s * env(len(t), 0.004, 0.05)


def pad(f, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * f * m * t + m) / (i + 1) for i, m in enumerate([1, 1.004, 2, 0.5]))
    return s * env(len(t), 0.6, 0.8) * 0.3


def drone(f, d, wob=0.7):
    t = t_(d)
    ff = f * (1 + 0.01 * np.sin(2 * np.pi * wob * t))
    s = osc(ff, d) + 0.6 * osc(ff * 1.06, d) + 0.3 * osc(ff * 0.5, d)
    return s * env(len(t), 0.4, 0.3)


PROG_MINOR = [57, 53, 60, 55]  # Am F C G
ARP = [0, 3, 7, 12, 7, 3, 0, 7]


class Music:
    def __init__(self, n, bpm=128):
        self.b = np.zeros(n)
        self.beat = 60 / bpm

    def loop(self, start, end, fn):
        k, t = 0, start
        while t < end - 0.01:
            fn(k, t)
            k += 1
            t = start + k * self.beat

    def happy(self, s, e, prog=PROG_MINOR):
        B = self.beat

        def f(b, t):
            root = prog[(b // 4) % len(prog)]
            add(self.b, kick(), t, 0.55)
            if b % 2:
                add(self.b, snare(), t, 0.25)
            add(self.b, hat(), t + B / 2, 0.12)
            add(self.b, bass(note(root - 12), B * 0.45), t, 0.35)
            add(self.b, bass(note(root - 12), B * 0.4), t + B / 2, 0.25)
            for k in range(2):
                add(self.b, pluck(note(root + 12 + ARP[(b * 2 + k) % 8])), t + k * B / 2, 0.1)

        self.loop(s, e, f)

    def tense(self, s, e, roots=(45, 45, 46, 44)):
        B = self.beat

        def f(b, t):
            add(self.b, kick(), t, 0.7)
            add(self.b, kick(), t + B / 2, 0.35)
            if b % 2:
                add(self.b, snare(0.25), t, 0.35)
            for k in range(4):
                add(self.b, hat(), t + k * B / 4, 0.09)
            root = roots[(b // 4) % len(roots)]
            for k in range(4):
                add(self.b, bass(note(root), B * 0.22), t + k * B / 4, 0.32)
            if b % 4 == 0:
                add(self.b, pad(note(root + 24), B * 4), t, 0.25)
                add(self.b, pad(note(root + 27), B * 4), t, 0.2)

        self.loop(s, e, f)

    def calm(self, s, e, notes=(60, 64, 67)):
        for i, n in enumerate(notes):
            add(self.b, pad(note(n), e - s), s, 0.3 - i * 0.05)
        k, t = 0, s
        while t < e - 0.2:
            add(self.b, pluck(note([72, 76, 79, 84][k % 4]), 0.6), t, 0.07)
            t += self.beat
            k += 1

    def creepy(self, s, e, root=50, ticks=True):
        add(self.b, drone(note(root), e - s) * np.linspace(0.4, 1, int(SR * (e - s))), s, 0.25)
        t = s
        while t < e:
            add(self.b, kick(0.5), t, 0.6)
            t += self.beat * 2
        if ticks:
            t = s
            while t < e:
                add(self.b, hat(0.03), t, 0.25)
                t += self.beat / 2

    def musicbox(self, s, e, seq=(69, 72, 76, 74, 72, 71, 72, 69, 68, 71, 74, 72), step=None):
        """cajita de musica inquietante (menor)"""
        step = step or self.beat
        k, t = 0, s
        while t < e - 0.1:
            add(self.b, bell(note(seq[k % len(seq)] + 12), 1.0), t, 0.18)
            t += step
            k += 1
        add(self.b, drone(note(45), e - s), s, 0.12)

    def epic(self, s, e, roots=(45, 41, 48, 43)):
        B = self.beat

        def f(b, t):
            root = roots[(b // 4) % len(roots)]
            add(self.b, kick(0.5), t, 0.8)
            if b % 2:
                add(self.b, snare(0.3), t, 0.4)
                add(self.b, snare(0.15), t + B * 0.75, 0.15)
            add(self.b, bass(note(root - 12), B * 0.9), t, 0.4)
            if b % 4 == 0:
                for n in (0, 7, 12, 15):
                    add(self.b, pad(note(root + 12 + n), B * 4), t, 0.16)

        self.loop(s, e, f)

    def outro(self, s, e, prog=PROG_MINOR):
        B = self.beat

        def f(b, t):
            root = prog[(b // 4) % len(prog)]
            add(self.b, kick(), t, 0.4)
            add(self.b, hat(), t + B / 2, 0.1)
            add(self.b, pluck(note(root + 12 + ARP[b % 8])), t, 0.09)
            add(self.b, bass(note(root - 12), B * 0.4), t, 0.25)

        self.loop(s, e, f)

    def tapestop(self, at, length=0.5):
        a, b = int((at - length) * SR), int(at * SR)
        seg = self.b[a:b].copy()
        idx = np.cumsum(np.linspace(1, 0.05, len(seg) * 2))
        idx = idx[idx < len(seg) - 1].astype(int)
        self.b[a:b] = 0
        add(self.b, seg[idx] * np.linspace(1, 0, len(idx)), at - length)

    def silence(self, s, e):
        a, b = int(s * SR), int(e * SR)
        fade = min(int(0.05 * SR), b - a)
        self.b[a : a + fade] *= np.linspace(1, 0, fade)
        self.b[a + fade : b] = 0


# ---------------- efectos ----------------
def whoosh(d=0.45, up=True):
    t = t_(d)
    n = noise(d)
    k = np.linspace(0.02, 0.4, len(t)) if up else np.linspace(0.4, 0.02, len(t))
    y = np.empty_like(n)
    acc = 0.0
    for i in range(len(n)):
        acc += k[i] * (n[i] - acc)
        y[i] = acc
    return y * np.sin(np.pi * t / d) * 1.6


def impact(d=0.8):
    t = t_(d)
    return kick(d) * 1.2 + lowpass(noise(d), 0.05) * np.exp(-t * 6) * 2


def sparkle(d=0.8):
    out = np.zeros(int(SR * d))
    for k in range(10):
        s = osc(note(84 + rng.integers(0, 14)), 0.15) * np.exp(-t_(0.15) * 25)
        i = int(k * len(out) / 12)
        out[i : i + len(s)] += s[: len(out) - i]
    return out * 0.6


def zap(d=0.35):
    t = t_(d)
    return osc(2400 * np.exp(-t * 9) + 200, d) * np.exp(-t * 6)


def rise(d=1.0):
    t = t_(d)
    return osc(300 + 900 * (t / d) ** 2, d) * env(len(t), 0.05, 0.1) * 0.6


def coin():
    a = osc(note(88), 0.08) * np.exp(-t_(0.08) * 10)
    b = osc(note(95), 0.5) * np.exp(-t_(0.5) * 7)
    return np.concatenate([a, b]) * 0.6


def rumble(d=2.0):
    return lowpass(noise(d), 0.01) * 6 * env(int(SR * d), 0.4, 0.3)


def crack():
    t = t_(0.6)
    n = noise(0.6) * (np.exp(-t * 14) + 0.4 * (rng.uniform(0, 1, len(t)) > 0.995))
    return n + kick(0.6) * 0.8


def tick():
    t = t_(0.12)
    return np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 50)


def poof():
    t = t_(1.0)
    return lowpass(noise(1.0), 0.15) * np.exp(-t * 5) * 1.5 + sparkle(1.0) * 0.8


def ding():
    t = t_(1.2)
    return (np.sin(2 * np.pi * note(84) * t) + 0.5 * np.sin(2 * np.pi * note(91) * t)) * np.exp(-t * 4) * 0.5


def glitch(d=0.6):
    out = np.zeros(int(SR * d))
    for _ in range(8):
        s = np.sign(osc(rng.uniform(100, 2000), 0.05))
        i = int(rng.uniform(0, 0.9) * len(out))
        out[i : i + len(s)] += s[: len(out) - i] * 0.5
    return out


def freeze():
    t = t_(1.2)
    return osc(3000 + 2000 * np.sin(2 * np.pi * 9 * t), 1.2) * np.exp(-t * 3) * 0.4


def boom(d=2.0):
    t = t_(d)
    return osc(70 * np.exp(-t * 0.8) + 30, d) * np.exp(-t * 1.5) * 1.4


def pop():
    t = t_(0.12)
    return osc(300 + 1200 * t / 0.12, 0.12) * np.exp(-t * 25)


def heartbeat():
    def thump(f=55):
        t = t_(0.25)
        return osc(f + 40 * np.exp(-t * 30), 0.25) * np.exp(-t * 14)

    out = np.zeros(int(SR * 0.8))
    add(out, thump(), 0.0, 1.0)
    add(out, thump(48), 0.22, 0.7)
    return out * 1.4


def glass(d=1.2):
    out = lowpass(noise(d), 0.6) * np.exp(-t_(d) * 9) * 0.8
    for _ in range(26):
        f = rng.uniform(2500, 7500)
        s = osc(f, 0.25) * np.exp(-t_(0.25) * rng.uniform(15, 40))
        add(out, s, rng.uniform(0, d * 0.7), rng.uniform(0.15, 0.4))
    return out + kick(d) * 0.3


def screech(d=1.0):
    t = t_(d)
    s = osc(1800 - 1500 * (t / d) ** 0.7, d) * 0.5 + noise(d) * 0.3
    return s * env(len(t), 0.01, 0.2) * np.exp(-t * 1.0)


def scratch():
    t = t_(0.5)
    f = 800 + 700 * np.sin(2 * np.pi * 6 * t)
    n = noise(0.5)
    return (osc(f, 0.5) * 0.5 + (n - lowpass(n, 0.3)) * 0.6) * env(len(t), 0.005, 0.1)


def static(d=0.6):
    n = noise(d)
    return (n - lowpass(n, 0.2)) * env(int(SR * d), 0.01, 0.1)


def wind(d=3.0):
    t = t_(d)
    n = noise(d)
    k = 0.03 + 0.03 * (1 + np.sin(2 * np.pi * 0.7 * t))
    y = np.empty_like(n)
    acc = 0.0
    for i in range(len(n)):
        acc += k[i] * (n[i] - acc)
        y[i] = acc
    return y * 5 * env(len(t), 0.4, 0.5)


def schoolbell(d=1.5):
    t = t_(d)
    return osc(1250, d) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 22 * t))) * env(len(t), 0.01, 0.2) * 0.5


def whispers(d=2.0, n=14):
    out = np.zeros(int(SR * d))
    for _ in range(n):
        ln = rng.uniform(0.2, 0.6)
        x = noise(ln)
        x = lowpass(x - lowpass(x, 0.05), 0.4) * np.sin(np.pi * t_(ln) / ln) * (1 + np.sin(2 * np.pi * rng.uniform(4, 9) * t_(ln)))
        add(out, x, rng.uniform(0, d - ln), rng.uniform(0.3, 0.8))
    return out * 1.5


def bark():
    t = t_(0.18)
    s = osc(500 * np.exp(-t * 6) + 250, 0.18) * 0.7 + lowpass(noise(0.18), 0.3) * 0.5
    out = np.zeros(int(SR * 0.5))
    add(out, s * np.exp(-t * 10), 0.0)
    add(out, s * np.exp(-t * 10), 0.26, 0.8)
    return out


def sonicboom():
    return np.concatenate([crack() * 1.2, np.zeros(int(SR * 0.9))]) + boom(1.5)


def wave_(d=2.0):
    t = t_(d)
    return lowpass(noise(d), 0.04) * 4 * np.sin(np.pi * t / d) ** 2


def thud():
    t = t_(0.4)
    return osc(80 * np.exp(-t * 8) + 40, 0.4) * np.exp(-t * 10) * 1.3


def swell(d=1.5):
    t = t_(d)
    return lowpass(noise(d), 0.08) * (t / d) ** 2 * 3


def chime():
    out = np.zeros(int(SR * 1.5))
    for i, n in enumerate([84, 88, 91, 96]):
        add(out, bell(note(n), 1.2), i * 0.07, 0.6)
    return out


SFX = {k: v for k, v in globals().items() if callable(v) and k in {
    'whoosh', 'impact', 'sparkle', 'zap', 'rise', 'coin', 'rumble', 'crack', 'tick', 'poof', 'ding', 'glitch',
    'freeze', 'boom', 'pop', 'heartbeat', 'glass', 'screech', 'scratch', 'static', 'wind', 'schoolbell',
    'whispers', 'bark', 'sonicboom', 'wave_', 'thud', 'swell', 'chime'}}


# ---------------- configuracion por video ----------------
def cfg_mentiras(m):
    m.happy(0.0, 21.7)
    m.tense(21.7, 36.0)
    m.calm(36.0, 41.5)
    m.creepy(41.5, 45.9)
    m.outro(47.0, 52.5)
    m.tapestop(45.9)
    m.silence(46.6, 47.0)
    return 52.5, [
        ('whoosh', 0.0, 0.5), ('impact', 0.2, 0.7), ('sparkle', 5.1, 0.5), ('zap', 6.7, 0.4),
        ('whoosh', 7.5, 0.5), ('pop', 8.0, 0.5), ('zap', 11.2, 0.6), ('sparkle', 11.3, 0.7),
        ('whoosh', 13.1, 0.5), ('pop', 14.0, 0.5), ('rise', 15.9, 0.6),
        ('whoosh', 17.6, 0.5), ('coin', 18.9, 0.7), ('coin', 20.6, 0.5), ('coin', 21.0, 0.5),
        ('whoosh', 21.6, 0.6), ('rumble', 23.8, 0.6), ('impact', 24.8, 0.8),
        ('crack', 26.5, 0.8), ('rumble', 27.5, 0.55),
        ('tick', 31.2, 0.7), ('tick', 32.7, 0.7), ('tick', 34.2, 0.7),
        ('whoosh', 33.7, 0.4), ('poof', 35.9, 0.9),
        ('whoosh', 37.0, 0.4), ('pop', 37.6, 0.4), ('ding', 38.6, 0.6),
        ('boom', 41.6, 0.8), ('glitch', 43.1, 0.5), ('glitch', 44.2, 0.5), ('freeze', 45.9, 0.8),
        ('whoosh', 46.9, 0.5), ('pop', 47.2, 0.6), ('ding', 49.6, 0.4),
    ]


def cfg_reflejo(m):
    m.musicbox(0.0, 12.9)
    m.creepy(12.9, 17.0, root=48)
    m.tense(17.0, 27.0, roots=(44, 44, 45, 43))
    m.epic(27.0, 37.3, roots=(44, 40, 47, 42))
    m.creepy(37.3, 43.2, root=46)
    m.silence(43.2, 43.6)
    m.musicbox(43.6, 50.2, seq=(64, 67, 71, 69, 67, 66, 67, 64), step=m.beat * 1.5)
    m.outro(50.4, 56.5, prog=(52, 48, 55, 50))
    return 56.5, [
        ('whoosh', 0.0, 0.5), ('impact', 0.2, 0.7), ('chime', 1.3, 0.4),
        ('heartbeat', 5.3, 0.9), ('glitch', 5.4, 0.5), ('heartbeat', 6.1, 0.8),
        ('whoosh', 6.8, 0.4), ('heartbeat', 8.7, 0.9), ('heartbeat', 9.5, 0.7),
        ('rise', 10.2, 0.3), ('scratch', 11.6, 0.5), ('heartbeat', 11.8, 0.9),
        ('swell', 13.0, 0.5), ('whispers', 13.5, 0.7), ('impact', 15.8, 0.6),
        ('whoosh', 17.0, 0.5), ('static', 18.6, 0.6), ('pop', 20.4, 0.5), ('static', 20.5, 0.4),
        ('pop', 21.7, 0.5), ('static', 21.8, 0.4),
        ('static', 23.0, 0.3), ('static', 23.6, 0.3), ('static', 24.2, 0.3), ('static', 24.8, 0.3), ('boom', 25.7, 0.8),
        ('whoosh', 27.0, 0.4), ('crack', 27.8, 0.7), ('glass', 28.8, 0.8), ('impact', 30.0, 0.6),
        ('glass', 30.4, 0.6), ('thud', 31.5, 1.0), ('rumble', 33.0, 0.5), ('whoosh', 35.2, 0.6),
        ('glass', 35.4, 0.9), ('impact', 36.3, 0.9),
        ('scratch', 37.4, 0.4), ('glitch', 39.2, 0.5), ('pop', 40.4, 0.5), ('tick', 41.2, 0.6), ('tick', 41.5, 0.6), ('pop', 41.9, 0.5),
        ('boom', 43.4, 0.9), ('heartbeat', 45.1, 1.0), ('thud', 45.6, 0.8), ('thud', 46.1, 0.8),
        ('swell', 46.9, 0.4), ('impact', 48.3, 0.6), ('glass', 49.6, 0.4),
        ('whoosh', 50.2, 0.5), ('pop', 50.5, 0.6), ('thud', 52.0, 0.7), ('ding', 52.8, 0.4),
    ]


def cfg_mentes(m):
    m.happy(0.0, 14.2, prog=(60, 57, 53, 55))
    m.silence(14.2, 14.5)
    m.tense(14.5, 22.8, roots=(45, 46, 45, 44))
    m.creepy(22.8, 33.3, root=47)
    m.epic(33.3, 41.8, roots=(45, 41, 46, 43))
    m.creepy(41.8, 45.6, root=45, ticks=False)
    m.silence(45.6, 46.8)
    m.calm(46.8, 52.0, notes=(57, 60, 64))
    m.outro(52.0, 58.5, prog=(60, 57, 53, 55))
    return 58.5, [
        ('whoosh', 0.0, 0.5), ('impact', 0.2, 0.7), ('tick', 0.4, 0.3), ('tick', 0.6, 0.3), ('tick', 0.8, 0.3), ('ding', 1.2, 0.6),
        ('rise', 2.6, 0.5), ('zap', 3.8, 0.5), ('whispers', 3.9, 0.5),
        ('whoosh', 5.5, 0.4), ('pop', 6.2, 0.6), ('bark', 8.0, 0.8),
        ('whoosh', 9.1, 0.4), ('pop', 9.8, 0.6), ('schoolbell', 11.8, 0.4),
        ('sparkle', 12.8, 0.6), ('scratch', 14.2, 0.8),
        ('whispers', 15.5, 0.6), ('pop', 16.0, 0.5), ('whispers', 17.6, 0.8), ('impact', 17.7, 0.6),
        ('whoosh', 18.4, 0.4), ('whoosh', 19.3, 0.4), ('whoosh', 20.0, 0.4), ('whispers', 18.6, 0.9),
        ('static', 21.2, 0.7), ('whispers', 21.2, 1.0),
        ('boom', 23.4, 0.9), ('impact', 25.6, 0.8),
        ('whoosh', 27.6, 0.5), ('heartbeat', 28.6, 1.0), ('heartbeat', 29.5, 0.9), ('pop', 31.2, 0.5), ('impact', 32.2, 0.5),
        ('whoosh', 33.5, 0.6), ('zap', 34.7, 0.6), ('pop', 35.2, 0.4), ('zap', 36.5, 0.6),
        ('thud', 38.4, 0.9), ('heartbeat', 39.0, 0.8), ('pop', 40.1, 0.5),
        ('swell', 42.0, 0.4), ('whispers', 43.0, 0.6), ('swell', 44.2, 0.6), ('chime', 45.6, 0.5),
        ('swell', 46.8, 0.3), ('boom', 48.4, 0.8), ('ding', 49.1, 0.6), ('impact', 50.4, 0.7),
        ('whoosh', 52.0, 0.5), ('pop', 52.3, 0.6), ('ding', 55.4, 0.4),
    ]


def cfg_tierra(m):
    m.epic(0.0, 7.2, roots=(45, 41, 48, 43))
    m.tapestop(7.2, 0.4)
    m.silence(7.2, 8.1)
    m.tense(8.1, 23.1, roots=(45, 45, 46, 44))
    m.calm(23.1, 31.8, notes=(57, 64, 69))
    m.creepy(31.8, 37.9, root=45, ticks=False)
    m.epic(37.9, 44.8, roots=(45, 41, 43, 40))
    m.silence(44.8, 45.9)
    m.epic(45.9, 52.4, roots=(45, 48, 50, 52))
    m.calm(52.4, 57.2, notes=(60, 64, 67))
    m.outro(57.2, 62.8)
    return 62.8, [
        ('whoosh', 0.0, 0.6), ('impact', 0.3, 0.7), ('wind', 0.0, 0.25),
        ('whoosh', 5.0, 0.4), ('tick', 5.4, 0.5), ('tick', 6.0, 0.5), ('screech', 6.8, 0.8), ('impact', 7.2, 0.9),
        ('wind', 8.2, 0.7), ('wind', 11.0, 0.7), ('whoosh', 11.4, 0.6), ('whoosh', 12.6, 0.6), ('impact', 12.8, 0.4),
        ('whoosh', 13.2, 0.6), ('thud', 13.5, 0.6), ('wave_', 13.9, 0.8), ('whoosh', 15.4, 0.7),
        ('sonicboom', 17.1, 0.9), ('wind', 18.2, 0.8), ('wind', 21.0, 0.8), ('impact', 18.5, 0.5),
        ('rumble', 21.3, 0.6), ('thud', 21.6, 0.5), ('thud', 22.1, 0.5),
        ('swell', 23.2, 0.3), ('ding', 25.0, 0.4), ('tick', 26.6, 0.4), ('tick', 26.9, 0.4), ('tick', 27.2, 0.4), ('tick', 27.5, 0.4), ('impact', 27.6, 0.5),
        ('whoosh', 28.6, 0.4), ('chime', 28.8, 0.4), ('swell', 30.2, 0.4),
        ('wave_', 32.0, 0.7), ('wave_', 34.0, 0.6), ('rumble', 35.5, 0.6), ('impact', 36.3, 0.7),
        ('whoosh', 38.0, 0.4), ('impact', 40.1, 0.8), ('thud', 41.4, 0.6), ('rumble', 43.6, 0.6), ('impact', 43.8, 0.5),
        ('tick', 45.0, 0.6), ('rumble', 46.0, 0.7), ('impact', 46.3, 0.5), ('rumble', 47.7, 0.8), ('boom', 48.2, 0.8),
        ('whoosh', 48.9, 0.5), ('rise', 49.3, 0.6), ('impact', 51.1, 0.7),
        ('swell', 52.5, 0.4), ('chime', 53.0, 0.5), ('sparkle', 55.6, 0.5),
        ('whoosh', 57.2, 0.5), ('pop', 57.5, 0.6), ('ding', 59.7, 0.4),
    ]


CFG = {'mentiras': cfg_mentiras, 'reflejo': cfg_reflejo, 'mentes': cfg_mentes, 'tierra': cfg_tierra}


def read_wav(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        if w.getnchannels() == 2:
            a = a.reshape(-1, 2).mean(1)
    return a


def main(name):
    raw = f'assets/{name}/voz_raw.wav' if name != 'mentiras' else 'assets/mentiras_voz_raw.wav'
    tmp = f'/tmp/voz_{name}_48k.wav'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-ar', str(SR), '-ac', '1', '-af',
                    'highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80', tmp], check=True)
    # duracion primero (la configuracion la devuelve)
    m = Music(int(SR * 90))
    dur, events = CFG[name](m)
    N = int(SR * dur)
    music = m.b[:N]
    sfx = np.zeros(N)
    for nm, at, g in events:
        add(sfx, SFX[nm](), at, g)

    voice = np.zeros(N)
    add(voice, read_wav(tmp), 0.0)
    words = json.load(open(f'src/videos/{name}/words.json'))
    duck = np.ones(N)
    for w in words:
        duck[int(w['start_ms'] / 1000 * SR): int((w['end_ms'] / 1000 + 0.15) * SR)] = 0.45
    duck = lowpass(duck, 0.0008)

    nz = lambda x: x / (np.max(np.abs(x)) + 1e-9)
    mix = nz(voice) * 0.95 + nz(music) * 0.32 * duck + nz(sfx) * 0.45
    mix /= np.max(np.abs(mix)) / 0.95
    pre = f'/tmp/mezcla_{name}.wav'
    with wave.open(pre, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    os.makedirs(f'public/{name}', exist_ok=True)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR),
                    f'public/{name}/mezcla.wav'], check=True)
    print(name, 'ok', dur, 's')


if __name__ == '__main__':
    main(sys.argv[1])
