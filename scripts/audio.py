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



def cfg_largo1(m):
    import unicodedata, re
    words = json.load(open('src/videos/largo1/words.json'))
    chs = json.load(open('src/videos/largo1/chapters.json'))
    S = [c['start'] for c in chs]
    E = [c['start'] + c['dur'] for c in chs]
    def norm(x):
        x = unicodedata.normalize('NFD', x.lower())
        return re.sub(r'[^a-z0-9ñ]', '', ''.join(ch for ch in x if unicodedata.category(ch) != 'Mn'))
    def chap(ms):
        c = 0
        for i, st in enumerate(S):
            if ms / 1000 >= st - 0.05: c = i
        return c
    def W(c, w, n=1):
        k = 0
        for x in words:
            if chap(x['start_ms']) == c and norm(x['text']) == norm(w):
                k += 1
                if k == n: return x['start_ms'] / 1000
        raise KeyError((c, w, n))
    # musica por capitulos
    m.creepy(0, E[0], root=45)
    m.musicbox(S[1], W(1, 'golpe') + 0.3)
    m.creepy(W(1, 'golpe') + 0.3, W(1, 'volvio'), root=50, ticks=False)
    m.calm(W(1, 'volvio'), E[1], notes=(57, 60, 64))
    m.happy(S[2], W(2, 'porque'), prog=(60, 57, 53, 55))
    m.creepy(W(2, 'porque'), E[2], root=47, ticks=False)
    m.tense(S[3], W(3, 'la', 5))
    m.happy(W(3, 'la', 5), W(3, 'pero'), prog=(60, 55, 57, 53))
    m.creepy(W(3, 'pero'), E[3], root=45, ticks=False)
    m.creepy(S[4], E[4], root=44)
    m.happy(S[5], W(5, 'pero'), prog=(60, 57, 53, 55))
    m.creepy(W(5, 'pero'), E[5], root=46, ticks=False)
    m.calm(S[6], W(6, 'pero'), notes=(52, 55, 59))
    m.tense(W(6, 'pero'), E[6], roots=(44, 44, 45, 43))
    m.creepy(S[7], E[7], root=45)
    m.musicbox(S[8], E[8], seq=(64, 67, 71, 69, 67, 66, 67, 64), step=m.beat * 1.5)
    m.tense(S[9], E[9], roots=(45, 46, 45, 44))
    m.creepy(S[10], E[10], root=45)
    m.epic(S[11], W(11, '10'), roots=(45, 41, 48, 43))
    m.silence(W(11, 'blanco'), S[12])
    m.calm(S[12], W(12, 'eso'), notes=(60, 64, 67))
    m.creepy(W(12, 'eso'), W(13, 'dime'), root=47, ticks=False)
    m.outro(W(13, 'dime'), E[13] + 4)
    ev = []
    for i in range(1, 14):
        if i in (11, 13): continue
        ev += [('whoosh', S[i] - 2.35, 0.5), ('tick', S[i] - 1.9, 0.5), ('tick', S[i] - 1.4, 0.5), ('tick', S[i] - 0.9, 0.5), ('impact', S[i] - 2.1, 0.5)]
    fr = lambda t: [('freeze', t, 0.6), ('swell', t - 0.5, 0.4)]
    ev += [('impact', 0.0, 0.7), ('freeze', 0.1, 0.5), ('heartbeat', W(0, 'tengo'), 0.8), ('heartbeat', W(0, 'tengo') + 0.9, 0.7),
           ('boom', W(0, 'culpa'), 0.7), ('whoosh', W(0, 'hace'), 0.5), ('pop', W(0, 'hace') + 0.9, 0.4), ('pop', W(0, 'hace') + 1.8, 0.4),
           ('pop', W(0, 'hace') + 2.7, 0.4), ('rise', W(0, 'cada'), 0.5), ('boom', W(0, 'matando'), 0.8), ('chime', W(0, 'esta', 2), 0.5)]
    ev += fr(W(1, 'golpe') + 0.3) + [('glass', W(1, 'estrello'), 0.8), ('zap', W(1, 'parado', 2), 0.5), ('tick', W(1, 'cuenta'), 0.6), ('tick', W(1, 'cuenta') + 0.5, 0.6)]
    ev += fr(W(2, 'ate')) + [('thud', W(2, 'cayo'), 0.9), ('ding', W(2, 'saque'), 0.6), ('freeze', W(2, 'pare'), 0.4), ('sparkle', W(2, 'flipaba'), 0.5),
           ('freeze', W(2, 'ocho') + 1.5, 0.3), ('scratch', W(2, 'o'), 0.5), ('heartbeat', W(2, 'pelo'), 0.8)]
    ev += [('screech', W(3, 'camion'), 0.5)] + fr(W(3, 'pare') + 0.3) + [('whoosh', W(3, 'cogi'), 0.4), ('whoosh', W(3, 'aparte'), 0.4),
           ('impact', W(3, 'tiempo', 2), 0.7), ('whoosh', W(3, 'tiempo', 2) + 0.2, 0.9), ('coin', W(3, 'millon'), 0.6), ('sparkle', W(3, 'superheroe'), 0.5),
           ('heartbeat', W(3, 'pecho'), 0.9), ('heartbeat', W(3, 'pecho') + 0.9, 0.8)]
    ev += [('boom', W(4, 'alguien'), 0.6), ('tick', W(4, 'cada'), 0.5), ('boom', W(4, 'cada'), 0.6), ('impact', W(4, 'horas'), 0.5), ('heartbeat', W(4, 'tentacion'), 0.8)]
    ev += [('zap', W(5, 'apareci'), 0.6), ('sparkle', W(5, 'publico'), 0.6), ('coin', W(5, '30'), 0.6), ('coin', W(5, '30') + 0.4, 0.5),
           ('freeze', W(5, 'salve'), 0.4), ('freeze', W(5, 'apague'), 0.4), ('sparkle', W(5, 'imparable'), 0.5), ('boom', W(5, 'tenia'), 0.6)]
    ev += [('heartbeat', W(6, 'corazon'), 0.9), ('heartbeat', W(6, 'corazon') + 0.9, 0.8), ('glass', W(6, 'caia'), 0.5), ('screech', W(6, 'freno'), 0.6),
           ('impact', W(6, 'freno') + 0.3, 0.6)] + fr(W(6, 'mundo')) + [('boom', W(6, '50', 4), 0.7)]
    ev += [('thud', W(7, 'portazo'), 1.0), ('freeze', W(7, 'portazo'), 0.3), ('screech', W(7, 'claxon'), 0.4), ('rumble', W(7, 'trueno'), 0.8),
           ('thud', W(7, 'pasos'), 0.6), ('thud', W(7, 'pasos') + 0.5, 0.6), ('thud', W(7, 'pasos') + 1.0, 0.6), ('chime', W(7, 'gire'), 0.5), ('heartbeat', W(7, 'recorde'), 0.7), ('glass', W(7, 'siguiente') + 1.0, 0.4)]
    ev += [('ding', W(8, 'poder'), 0.4), ('ding', W(8, 'dura'), 0.4), ('ding', W(8, '100', 2), 0.4), ('boom', W(8, 'siempre'), 0.7), ('sparkle', W(8, 'entonces') + 1.0, 0.7)]
    ev += [('freeze', W(9, 'acabe'), 0.4), ('chime', W(9, 'guarda'), 0.5), ('freeze', W(9, '85'), 0.5), ('sparkle', W(9, 'hucha'), 0.6), ('boom', W(9, '60'), 0.7)]
    ev += [('freeze', S[10], 0.6), ('heartbeat', W(10, '3'), 0.9), ('heartbeat', W(10, '3') + 0.9, 0.9), ('chime', W(10, 'luz'), 0.6), ('heartbeat', W(10, 'latia'), 0.7)]
    ev += [('tick', S[11], 0.6), ('tick', W(11, '1'), 0.6), ('rise', W(11, 'cogi'), 0.5), ('glass', W(11, 'estampe') + 0.4, 1.0), ('impact', W(11, 'estampe') + 0.4, 0.9),
           ('boom', W(11, 'cristal'), 0.9), ('swell', W(11, 'cristal'), 0.7), ('tick', W(11, '30'), 0.6), ('tick', W(11, '10'), 0.6), ('rise', W(11, 'envolvio'), 0.7)]
    ev += [('chime', S[12], 0.6), ('sparkle', W(12, 'nino'), 0.6), ('ding', W(12, 'recuperado'), 0.6), ('scratch', W(12, 'eso'), 0.5)]
    ev += [('freeze', W(13, 'y'), 0.6), ('chime', W(13, 'reflejo'), 0.6), ('boom', W(13, 'podrias'), 0.7), ('pop', W(13, 'dime'), 0.5), ('ding', W(13, 'quieres'), 0.5)]
    return round(E[13] + 4, 2), ev



def cfg_duplicar(m):
    m.tense(0.0, 7.0, roots=(45, 45, 46, 44))
    m.happy(7.0, 18.7, prog=(60, 57, 53, 55))
    m.silence(18.7, 19.0)
    m.creepy(19.0, 23.0, root=47)
    m.epic(23.0, 32.6, roots=(45, 41, 48, 43))
    m.tense(32.6, 40.0, roots=(44, 44, 45, 43))
    m.creepy(40.0, 43.2, root=46, ticks=False)
    m.outro(43.2, 48.6)
    ev = [('impact', 0.0, 0.8), ('whoosh', 0.0, 0.5), ('pop', 0.6, 0.5), ('zap', 1.3, 0.4)]
    ev += [('pop', 1.3 + k * 0.19, 0.25) for k in range(8)]
    ev += [('whoosh', 2.8, 0.5), ('sparkle', 5.2, 0.5), ('rise', 7.1, 0.5),
           ('coin', 11.0, 0.7), ('pop', 13.6, 0.5), ('pop', 13.9, 0.4), ('pop', 14.2, 0.4), ('zap', 16.5, 0.5),
           ('sparkle', 17.5, 0.6), ('scratch', 18.8, 0.5), ('swell', 19.6, 0.4), ('boom', 21.6, 0.8), ('glitch', 21.7, 0.4),
           ('zap', 23.4, 0.5), ('impact', 25.0, 0.5), ('impact', 26.0, 0.6), ('impact', 27.0, 0.7),
           ('whoosh', 28.4, 0.6), ('whispers', 28.6, 0.6), ('boom', 30.5, 0.8), ('whispers', 30.6, 0.8),
           ('impact', 34.5, 0.6), ('pop', 36.6, 0.5), ('whispers', 37.9, 0.9), ('swell', 37.9, 0.5),
           ('heartbeat', 40.5, 0.9), ('heartbeat', 41.3, 0.9), ('whoosh', 43.2, 0.5), ('pop', 43.4, 0.6), ('ding', 44.8, 0.4)]
    return 48.6, ev



def cfg_sol(m):
    m.creepy(0.0, 7.6, root=45)
    m.happy(7.6, 14.5, prog=(60, 57, 53, 55))
    m.silence(14.5, 15.2)
    m.creepy(15.2, 28.0, root=44, ticks=False)
    m.tense(28.0, 34.6, roots=(44, 44, 45, 43))
    m.creepy(34.6, 41.0, root=43)
    m.outro(41.0, 46.5)
    return 46.5, [('boom', 0.0, 0.8), ('freeze', 0.1, 0.5), ('whoosh', 0.7, 0.4), ('rise', 1.4, 0.5), ('tick', 3.6, 0.5), ('tick', 4.4, 0.5),
        ('chime', 5.8, 0.4), ('whoosh', 7.7, 0.4), ('wave_', 8.0, 0.5), ('tick', 11.4, 0.5), ('tick', 12.4, 0.5), ('tick', 13.4, 0.5),
        ('boom', 14.6, 1.0), ('impact', 14.6, 0.7), ('swell', 16.3, 0.4), ('sparkle', 18.9, 0.4), ('wind', 21.0, 0.6), ('freeze', 22.8, 0.6),
        ('freeze', 26.6, 0.6), ('rumble', 28.1, 0.6), ('whoosh', 32.0, 0.4), ('heartbeat', 34.7, 0.9), ('heartbeat', 35.5, 0.9),
        ('boom', 36.8, 0.8), ('heartbeat', 38.1, 1.0), ('impact', 40.0, 0.9), ('glitch', 40.0, 0.4), ('whoosh', 41.0, 0.5), ('pop', 41.2, 0.6), ('ding', 42.7, 0.4)]


def cfg_parpadeo(m):
    m.tense(0.0, 3.0, roots=(45, 45, 46, 44))
    m.musicbox(3.0, 15.4)
    m.tense(15.4, 22.8, roots=(44, 45, 46, 47))
    m.creepy(22.8, 32.7, root=44)
    m.silence(32.7, 33.2)
    m.creepy(33.2, 41.4, root=42, ticks=False)
    m.epic(41.4, 44.0)
    m.outro(44.0, 50.6)
    return 50.6, [('boom', 0.0, 0.9), ('impact', 0.0, 0.7), ('whoosh', 0.45, 0.4), ('glitch', 0.6, 0.4), ('whoosh', 1.05, 0.4), ('glitch', 1.2, 0.4),
        ('whoosh', 1.65, 0.4), ('glitch', 1.8, 0.4), ('whoosh', 2.25, 0.4), ('zap', 2.4, 0.4), ('tick', 3.1, 0.4), ('rise', 4.4, 0.4), ('impact', 5.0, 0.7),
        ('whoosh', 6.4, 0.3), ('glitch', 8.0, 0.5), ('swell', 8.1, 0.5), ('ding', 10.1, 0.4), ('glitch', 11.2, 0.5), ('swell', 11.3, 0.5), ('pop', 13.2, 0.4),
        ('heartbeat', 15.6, 0.8), ('tick', 17.3, 0.6), ('heartbeat', 18.0, 0.8), ('tick', 18.8, 0.6), ('heartbeat', 19.4, 0.9), ('screech', 20.5, 0.3),
        ('tick', 21.6, 0.7), ('glitch', 23.0, 0.6), ('glitch', 23.35, 0.6), ('glitch', 23.7, 0.6), ('impact', 25.1, 0.8), ('bark', 26.7, 0.5),
        ('impact', 31.0, 0.7), ('rumble', 33.0, 0.6), ('rise', 33.2, 0.5), ('wind', 36.3, 0.6), ('boom', 36.3, 0.8), ('whoosh', 38.4, 0.4),
        ('impact', 41.5, 1.0), ('boom', 41.5, 0.9), ('whoosh', 44.0, 0.5), ('pop', 44.2, 0.6), ('ding', 45.6, 0.4)]


def cfg_agujero(m):
    m.epic(0.0, 6.5)
    m.calm(6.5, 12.2)
    m.silence(12.2, 12.6)
    m.tense(12.6, 22.7, roots=(45, 46, 47, 48))
    m.calm(22.7, 28.8)
    m.tense(28.8, 37.6, roots=(43, 44, 45, 46))
    m.silence(37.6, 38.3)
    m.creepy(38.3, 45.5, root=44)
    m.outro(45.5, 50.0)
    return 50.0, [('boom', 0.0, 0.9), ('impact', 0.0, 0.7), ('wind', 0.0, 0.6), ('whoosh', 1.0, 0.5), ('whoosh', 1.6, 0.4), ('impact', 2.2, 0.5),
        ('whoosh', 2.8, 0.4), ('whoosh', 3.4, 0.5), ('tick', 3.4, 0.6), ('whoosh', 4.0, 0.4), ('impact', 4.6, 0.5), ('whoosh', 5.2, 0.4), ('whoosh', 5.8, 0.4),
        ('scratch', 7.5, 0.4), ('pop', 9.0, 0.4), ('swell', 11.1, 0.4), ('screech', 12.3, 0.4), ('whoosh', 12.4, 0.6), ('wind', 13.3, 0.5),
        ('rise', 16.9, 0.5), ('sonicboom', 18.8, 0.8), ('rumble', 19.8, 0.7), ('impact', 21.7, 0.6), ('boom', 22.8, 0.8), ('sparkle', 23.3, 0.5),
        ('impact', 24.6, 0.7), ('chime', 26.6, 0.4), ('sparkle', 27.7, 0.4), ('rise', 28.9, 0.4), ('swell', 32.1, 0.5), ('chime', 33.6, 0.5),
        ('rise', 35.1, 0.5), ('heartbeat', 36.6, 0.9), ('glass', 38.4, 0.4), ('impact', 38.4, 0.7), ('whoosh', 39.7, 0.6), ('screech', 40.0, 0.3),
        ('wind', 41.0, 0.5), ('impact', 42.2, 0.6), ('pop', 44.4, 0.5), ('whoosh', 45.6, 0.5), ('pop', 45.8, 0.6), ('ding', 47.4, 0.4)]


def cfg_gta6(m):
    m.epic(0.0, 5.4)
    m.tense(5.4, 16.4, roots=(45, 45, 43, 44))
    m.happy(16.4, 26.4, prog=(60, 57, 53, 55))
    m.epic(26.4, 39.6)
    m.calm(39.6, 47.9)
    m.epic(47.9, 52.4)
    m.outro(52.4, 57.5)
    return 57.5, [('boom', 0.0, 0.9), ('screech', 0.0, 0.5), ('whoosh', 0.6, 0.4), ('impact', 1.2, 0.5), ('whoosh', 1.8, 0.4), ('boom', 1.5, 0.8),
        ('whoosh', 2.4, 0.4), ('impact', 3.0, 0.5), ('whoosh', 3.7, 0.4), ('whoosh', 4.4, 0.4), ('pop', 5.5, 0.5), ('impact', 9.0, 0.6),
        ('crack', 11.0, 0.6), ('crack', 13.2, 0.6), ('ding', 15.2, 0.5), ('sparkle', 15.3, 0.5), ('whoosh', 16.5, 0.4), ('glitch', 17.9, 0.5),
        ('rise', 19.0, 0.5), ('coin', 20.0, 0.3), ('coin', 21.0, 0.3), ('coin', 22.0, 0.3), ('impact', 23.0, 0.8), ('whoosh', 26.5, 0.4),
        ('pop', 27.4, 0.5), ('zap', 30.6, 0.5), ('sparkle', 30.8, 0.5), ('swell', 32.1, 0.4), ('impact', 35.3, 0.6), ('impact', 36.7, 0.6),
        ('coin', 38.6, 0.4), ('whoosh', 39.7, 0.4), ('pop', 40.3, 0.5), ('pop', 41.5, 0.5), ('tick', 43.2, 0.5), ('glass', 45.4, 0.5),
        ('scratch', 45.5, 0.4), ('whoosh', 48.0, 0.4), ('coin', 49.5, 0.4), ('coin', 50.2, 0.4), ('boom', 51.0, 0.7), ('whoosh', 52.5, 0.5),
        ('pop', 52.7, 0.6), ('ding', 53.9, 0.4)]


def cfg_futuro(m):
    import json as _j
    st = [c['start'] for c in _j.load(open('assets/futuro/starts.json'))]
    ws = _j.load(open('src/videos/futuro/words.json'))
    def at(c, word, n=1):
        import unicodedata, re
        nm = lambda x: re.sub(r'[^a-z0-9ñ]', '', ''.join(ch for ch in unicodedata.normalize('NFD', x.lower()) if unicodedata.category(ch) != 'Mn'))
        end = st[c + 1] - 0.3 if c + 1 < len(st) else 1e9
        k = 0
        for w in ws:
            s0 = w['start_ms'] / 1000
            if st[c] - 0.3 <= s0 < end and nm(w['text']) == nm(word):
                k += 1
                if k == n:
                    return s0
        raise KeyError(word)
    dur = round(ws[-1]['end_ms'] / 1000 + 3, 2)
    E = st + [dur]
    m.tense(0, E[1], roots=(44, 44, 45, 43))
    m.calm(E[1], E[2])
    m.happy(E[2], E[3], prog=(60, 57, 53, 55))
    m.happy(E[3], at(3, 'esa'), prog=(62, 59, 55, 57))
    m.creepy(at(3, 'esa'), E[4], root=45)
    m.tense(E[4], at(4, 'gente'), roots=(45, 46, 47, 48))
    m.epic(at(4, 'gente'), E[5])
    m.creepy(E[5], E[6], root=44)
    m.tense(E[6], E[7], roots=(43, 44, 45, 46))
    m.creepy(E[7], E[8], root=42, ticks=False)
    m.tense(E[8], E[9], roots=(42, 42, 43, 41))
    m.calm(E[9], at(9, '859'))
    m.tense(at(9, '859'), E[10], roots=(44, 45, 46, 47))
    m.epic(E[10], at(10, 'vera', 2))
    m.creepy(at(10, 'vera', 2), E[11], root=44)
    m.calm(E[11], at(11, 'comentarios'))
    m.outro(at(11, 'comentarios'), dur)
    ev = [('boom', 0.0, 0.9), ('rise', 0.0, 0.5), ('glitch', 0.1, 0.5), ('tick', at(0, 'nueve'), 0.8), ('tick', at(0, 'ocho'), 0.8), ('tick', at(0, 'siete'), 0.8),
          ('impact', at(0, 'nueve'), 0.6), ('impact', at(0, 'ocho'), 0.6), ('impact', at(0, 'siete'), 0.7), ('whoosh', at(0, 'hace'), 0.6), ('swell', at(0, 'historia') - 0.4, 0.6),
          ('glitch', at(1, 'vi'), 0.5), ('glass', at(1, 'vi') + 1.0, 0.6), ('whoosh', at(1, 'pegue'), 0.4), ('glass', at(1, 'resbalo') + 0.4, 0.8), ('freeze', at(1, 'helado'), 0.5),
          ('glitch', at(1, 'luego'), 0.5), ('sparkle', at(1, 'entendi'), 0.5), ('tick', at(1, 'exactamente', 2), 0.6),
          ('pop', at(2, 'gane'), 0.4), ('whoosh', at(2, 'patio'), 0.4), ('impact', at(2, 'patio') + 1.4, 0.6), ('ding', at(2, 'ganamos'), 0.5), ('zap', at(2, 'videojuegos'), 0.4), ('boom', at(2, 'ahi'), 0.6),
          ('tick', at(3, 'siete', 3) - 0.4, 0.5), ('ding', at(3, 'siete', 3), 0.6), ('ding', at(3, '12', 2), 0.6), ('coin', at(3, 'ganamos'), 0.5), ('scratch', at(3, 'hombre'), 0.4), ('impact', at(3, 'pinchazo'), 0.8), ('heartbeat', at(3, 'pinchazo') + 0.4, 0.8),
          ('glitch', at(4, 'nina'), 0.5), ('screech', at(4, 'coche'), 0.4), ('wind', at(4, 'pedalee'), 0.6), ('whoosh', at(4, 'coche', 2), 0.7), ('pop', at(4, 'pelota', 2), 0.6), ('swell', at(4, 'gente'), 0.5), ('coin', at(4, 'millones'), 0.4), ('chime', at(4, 'siempre', 2), 0.5),
          ('heartbeat', at(5, 'pero'), 0.8), ('impact', at(5, 'sangraba'), 0.6), ('glitch', at(5, 'apagarlo'), 0.6), ('tick', at(5, '12'), 0.6), ('tick', at(5, '15'), 0.6), ('rise', at(5, 'poder'), 0.5), ('crack', at(5, 'rompiendo'), 0.6),
          ('rumble', at(6, 'coche'), 0.5), ('glitch', at(6, 'segundos'), 0.5), ('whoosh', at(6, 'asi'), 0.6), ('whoosh', at(6, 'escondi'), 0.4), ('static', at(6, 'toco'), 0.4), ('boom', at(6, 'ella', 2), 0.7),
          ('chime', at(7, 'hola'), 0.4), ('impact', at(7, 'vera'), 0.7), ('pop', at(7, 'jugamos'), 0.4), ('boom', at(7, 'juntos'), 0.5),
          ('glitch', at(8, 'horrible'), 0.6), ('rumble', at(8, 'central'), 0.6), ('boom', at(8, 'apagaban'), 0.9), ('whispers', at(8, 'oscuridad'), 0.5), ('heartbeat', at(8, 'abri'), 0.9),
          ('sparkle', at(9, 'escribi'), 0.4), ('wind', at(9, '859'), 0.6), ('tick', at(9, 'nueve'), 0.8), ('tick', at(9, 'ocho'), 0.8), ('tick', at(9, 'siete'), 0.8), ('impact', at(9, 'tampoco'), 0.8),
          ('swell', at(10, 'desdoble'), 0.5), ('zap', at(10, 'cable', 2), 0.9), ('boom', at(10, 'cable', 2), 0.8), ('scratch', at(10, 'vera'), 0.4), ('tick', at(10, 'seis'), 0.7), ('tick', at(10, 'cinco'), 0.7), ('tick', at(10, 'cuatro'), 0.7), ('rumble', at(10, 'veo'), 0.6),
          ('chime', at(11, 'ayer'), 0.4), ('glitch', at(11, 'era', 4), 0.6), ('impact', at(11, 'tu'), 0.7), ('pop', at(11, 'comentarios'), 0.6), ('ding', at(11, 'porque'), 0.5)]
    return dur, ev


CFG = {'futuro': cfg_futuro, 'gta6': cfg_gta6, 'agujero': cfg_agujero, 'parpadeo': cfg_parpadeo, 'sol': cfg_sol, 'duplicar': cfg_duplicar, 'largo1': cfg_largo1, 'mentiras': cfg_mentiras, 'reflejo': cfg_reflejo, 'mentes': cfg_mentes, 'tierra': cfg_tierra}


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
    m = Music(int(SR * 900))
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
