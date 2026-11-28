#!/usr/bin/env python3
"""Eigene Soundeffekte, lokal erzeugt (kostenlos, ohne Internet, eigene Rechte).

  python3 tools/klang.py <art> [--name NAME] [--dauer S] [--hoehe FAKTOR] [--hall 0..1] [--seed N]
  python3 tools/klang.py --liste          alle Arten
  python3 tools/klang.py --ansehen <wav>  Wellenform + Spektrum als Bild (ich höre nicht – so prüfe ich)

Ergebnis: animationen/public/klang/<name>.wav (48 kHz, Stereo, Spitze −1 dBFS) und <name>.png zum Ansehen
(das Bild liegt unter /Volumes/T7/strichermittler-tmp/klang/).
Im Szenenplan: klaenge: [{ name: "<name>", ab: <Wortzeit> }] oder atmo: { name: "<name>" }.
Für Klänge, die lokal nicht gut genug werden: ElevenLabs (kostet Geld → nur mit Armans OK).
"""
import argparse
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
REPO = Path(__file__).resolve().parent.parent
ZIEL = REPO / "animationen/public/klang"
BILDER = Path("/Volumes/T7/strichermittler-tmp/klang")
rng = np.random.default_rng(7)


# ---------- Grundbausteine ----------
def t_(dauer):
    return np.arange(int(SR * dauer)) / SR


def rauschen(n):
    return rng.standard_normal(n)


def rosa(n):
    w = np.fft.rfft(rauschen(n))
    f = np.maximum(np.fft.rfftfreq(n, 1 / SR), 20)
    return np.fft.irfft(w / np.sqrt(f), n) * 30


def braun(n):
    x = np.cumsum(rauschen(n))
    x -= np.convolve(x, np.ones(4800) / 4800, "same")
    return x / (np.abs(x).max() + 1e-9)


def band(x, lo, hi):
    """Bandpass per FFT (lo/hi in Hz, None = offen)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


def gleitfilter(x, fc):
    """Zeitvariabler Tiefpass (1. Ordnung, fc als Array je Sample)."""
    a = np.exp(-2 * np.pi * np.asarray(fc) / SR)
    y = np.zeros_like(x)
    z = 0.0
    for i in range(len(x)):
        z = (1 - a[i]) * x[i] + a[i] * z
        y[i] = z
    return y


def huelle(n, an=0.01, ab=0.2, form=1.0):
    e = np.ones(n)
    na, nb = int(an * SR), int(ab * SR)
    if na:
        e[:na] = np.linspace(0, 1, na) ** form
    if nb:
        e[-nb:] *= np.linspace(1, 0, nb) ** 2
    return e


def abklingen(n, zeit):
    return np.exp(-np.arange(n) / (SR * zeit))


def sinus(f, dauer, phase=0):
    f = np.broadcast_to(np.asarray(f, float), (int(SR * dauer),))
    return np.sin(2 * np.pi * np.cumsum(f) / SR + phase)


def mische(n, *teile):
    out = np.zeros(n)
    for start, x in teile:
        s = int(start * SR)
        if s >= n:
            continue
        k = min(len(x), n - s)
        out[s:s + k] += x[:k]
    return out


def hall(x, menge, laenge=1.6):
    if menge <= 0:
        return np.stack([x, x])
    n = int(SR * laenge)
    ir_l = rauschen(n) * abklingen(n, laenge / 6)
    ir_r = rauschen(n) * abklingen(n, laenge / 6)
    ir_l[: int(0.012 * SR)] = 0
    ir_r[: int(0.017 * SR)] = 0
    pad = np.concatenate([x, np.zeros(n)])
    wl = np.fft.irfft(np.fft.rfft(pad) * np.fft.rfft(ir_l, len(pad)), len(pad))
    wr = np.fft.irfft(np.fft.rfft(pad) * np.fft.rfft(ir_r, len(pad)), len(pad))
    s = np.abs(pad).max() / (max(np.abs(wl).max(), np.abs(wr).max()) + 1e-9)
    return np.stack([pad + menge * 0.5 * wl * s, pad + menge * 0.5 * wr * s])


def panorama(x, von=-0.6, bis=0.6):
    p = np.linspace(von, bis, len(x))
    return np.stack([x * np.sqrt((1 - p) / 2), x * np.sqrt((1 + p) / 2)]) * 1.4


# ---------- Arten ----------
def whoosh(d=0.9, h=1.0):
    n = int(SR * d)
    x = rosa(n)
    bogen = np.sin(np.linspace(0, np.pi, n)) ** 2
    fc = 150 + 2600 * h * bogen
    y = gleitfilter(gleitfilter(gleitfilter(x, fc), fc), fc * 1.5)  # steiler Tiefpass, der mitfährt
    y = y * np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return panorama(band(y, 120, None), -0.7, 0.7)


def riser(d=3.0, h=1.0):
    n = int(SR * d)
    t = np.linspace(0, 1, n)
    rausch = gleitfilter(rosa(n), 200 + 8000 * h * t ** 2) * t ** 2
    ton = sum(sinus(110 * h * k * (1 + 1.5 * t ** 2), d) / k for k in (1, 2, 3)) * t ** 3 * 0.4
    y = (rausch + ton) * huelle(n, 0.0, 0.02)
    return np.stack([y, y])


def einschlag(d=2.0, h=1.0):
    n = int(SR * d)
    f = 90 * h * np.exp(-t_(d) * 6) + 32 * h
    tief = sinus(f, d) * abklingen(n, 0.45)
    knall = band(rauschen(n), 60, 3000) * abklingen(n, 0.03)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * abklingen(n, 0.9) * 0.5
    y = np.tanh((tief + knall * 0.8 + sub) * 1.6)
    return np.stack([y, y])


def brummen(d=6.0, h=1.0):
    """Kühlregal/Serverraum: Netzbrummen + Lüfter, schleifenfähig."""
    n = int(SR * d)
    t = t_(d)
    netz = sum(np.sin(2 * np.pi * 50 * h * k * t) / k ** 1.3 for k in (1, 2, 3, 4, 6))
    luefter = band(rosa(n), 150, 1800) * (1 + 0.15 * np.sin(2 * np.pi * 0.4 * t)) * 0.6
    y = netz * 0.35 + luefter
    ueberblend = int(0.3 * SR)  # Anfang/Ende weich, damit die Schleife nicht klickt
    y[:ueberblend] *= np.linspace(0, 1, ueberblend)
    y[-ueberblend:] *= np.linspace(1, 0, ueberblend)
    return np.stack([y, np.roll(y, 240)])


def alarm(d=2.4, h=1.0):
    t = t_(d)
    f = np.where((t * 2.5) % 1 < 0.5, 880 * h, 660 * h)
    roh = np.sign(sinus(f, d)) * 0.5 + sinus(f, d) * 0.5
    y = band(roh, 300, 4000) * huelle(len(t), 0.01, 0.05)
    return np.stack([y, y])


def piepen(d=0.25, h=1.0):
    y = sinus(1000 * h, d) * huelle(int(SR * d), 0.005, 0.03)
    return np.stack([y, y])


def klick(d=0.12, h=1.0):
    n = int(SR * d)
    y = band(rauschen(n), 1500 * h, 9000) * abklingen(n, 0.004) + sinus(2200 * h, d) * abklingen(n, 0.006) * 0.5
    return np.stack([y, y])


def tippen(d=2.0, h=1.0):
    """Tastatur: einzelne Anschläge in unregelmäßigem Takt, Leertaste tiefer."""
    n = int(SR * d)
    out = np.zeros(n)
    t = 0.05
    while t < d - 0.1:
        tief = rng.random() < 0.12
        k = int(0.05 * SR)
        ton = band(rauschen(k), (600 if tief else 1800) * h, (3000 if tief else 8000) * h)
        anschlag = ton * abklingen(k, 0.008 if not tief else 0.015) * rng.uniform(0.6, 1.0)
        s = int(t * SR)
        out[s:s + k] += anschlag[: n - s]
        t += rng.uniform(0.06, 0.16) + (0.25 if rng.random() < 0.08 else 0)
    p = rng.uniform(-0.2, 0.2)
    return np.stack([out * (1 - p), out * (1 + p)])


def glitch(d=0.6, h=1.0):
    n = int(SR * d)
    out = np.zeros(n)
    pos = 0
    while pos < n:
        k = int(rng.uniform(0.015, 0.07) * SR)
        art = rng.integers(3)
        if art == 0:
            seg = np.sign(sinus(rng.uniform(200, 2500) * h, k / SR))
        elif art == 1:
            seg = np.round(rauschen(k) * 3) / 3
        else:
            seg = np.zeros(k)
        seg = np.resize(seg, k)
        out[pos:pos + k] = seg[: n - pos] * rng.uniform(0.3, 1)
        pos += k
    out = np.repeat(out[::6], 6)[:n]  # Bitcrusher
    return np.stack([out, np.roll(out, 90)]) * 0.6


def herzschlag(d=2.0, h=1.0):
    n = int(SR * d)
    schlag = lambda: sinus(55 * h, 0.25) * abklingen(int(0.25 * SR), 0.06)
    teile = []
    t = 0.0
    while t < d - 0.3:
        teile += [(t, schlag()), (t + 0.22, schlag() * 0.7)]
        t += 0.9
    y = np.tanh(mische(n, *teile) * 2)
    return np.stack([y, y])


def kasse(d=1.4, h=1.0):
    n = int(SR * d)
    glocke = sum(sinus(1318 * h * r, d) * abklingen(n, 0.5 / r) / r for r in (1, 2.01, 2.76, 4.07))
    lade = band(rauschen(n), 200, 2500) * abklingen(n, 0.05)
    y = mische(n, (0, lade), (0.08, glocke * 0.5))
    return np.stack([y, y])


def spannung(d=8.0, h=1.0):
    """Dunkler Teppich unter Enthüllungen, schleifenfähig."""
    n = int(SR * d)
    t = t_(d)
    y = np.zeros(n)
    for f, v in ((55, 1), (55.4, 1), (82.4, 0.6), (110.3, 0.35)):
        saege = 2 * ((t * f * h) % 1) - 1
        y += saege * v
    y = band(y, 30, 400) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.11 * t))
    y += band(rosa(n), 2000, 6000) * 0.05
    u = int(0.5 * SR)
    y[:u] *= np.linspace(0, 1, u)
    y[-u:] *= np.linspace(1, 0, u)
    return np.stack([y, np.roll(y, 480)])


def raum(d=6.0, h=1.0):
    n = int(SR * d)
    y = band(braun(n), 40, 500 * h) * 0.5
    return np.stack([y, np.roll(y, 960)])


def zischen(d=1.2, h=1.0):
    n = int(SR * d)
    y = band(rauschen(n), 3000 * h, 12000) * huelle(n, 0.05, 0.6)
    return np.stack([y, y])


def papier(d=0.8, h=1.0):
    n = int(SR * d)
    out = np.zeros(n)
    for _ in range(int(25 * d)):
        k = int(rng.uniform(0.005, 0.03) * SR)
        s = rng.integers(0, max(1, n - k))
        out[s:s + k] += band(rauschen(k), 1000 * h, 9000) * rng.uniform(0.2, 1)
    out *= huelle(n, 0.03, 0.2)
    return np.stack([out, np.roll(out, 60)])


def kamera(d=0.35, h=1.0):
    n = int(SR * d)
    a = band(rauschen(n), 800 * h, 7000) * abklingen(n, 0.006)
    b = band(rauschen(n), 400 * h, 5000) * abklingen(n, 0.01)
    y = mische(n, (0, a), (0.09, b * 0.8))
    return np.stack([y, y])


def stempel(d=0.7, h=1.0):
    n = int(SR * d)
    y = np.tanh((sinus(120 * h * np.exp(-t_(d) * 8) + 60 * h, d) * abklingen(n, 0.08) + band(rauschen(n), 100, 2500) * abklingen(n, 0.015)) * 2)
    return np.stack([y, y])


ARTEN = {
    "whoosh": (whoosh, "Luftzug für Bildwechsel, Kamerafahrt"),
    "riser": (riser, "Spannung baut sich auf, vor einer Enthüllung"),
    "einschlag": (einschlag, "tiefer Treffer: Enthüllung, große Zahl, Titel"),
    "brummen": (brummen, "Kühlregal/Serverraum, als Atmo schleifenfähig"),
    "alarm": (alarm, "Warnung, Angriff erkannt"),
    "piepen": (piepen, "kurzer Piep: Gerät, Scanner, Zensur"),
    "klick": (klick, "Mausklick, Schalter"),
    "tippen": (tippen, "Tastatur, Hacker tippt, Terminal"),
    "glitch": (glitch, "digitale Störung, Hack, Datenleck"),
    "herzschlag": (herzschlag, "Anspannung, Countdown"),
    "kasse": (kasse, "Geld, Lösegeld, Kosten"),
    "spannung": (spannung, "dunkler Teppich, als Atmo schleifenfähig"),
    "raum": (raum, "leiser Raumton gegen digitale Stille"),
    "zischen": (zischen, "Gas/Kältemittel, Druck entweicht"),
    "papier": (papier, "Akte blättern, Dokument"),
    "kamera": (kamera, "Beweisfoto, Screenshot"),
    "stempel": (stempel, "Stempel auf Akte"),
}


def speichern(st, pfad):
    # Gleich laut wie die anderen: Mittel auf −20 dBFS (RMS), Spitze nie über −1 dBFS.
    # So bedeutet laut: 0.3 im Plan bei jedem Klang ungefähr dasselbe.
    rms = np.sqrt(np.mean(st[:, np.abs(st).max(axis=0) > np.abs(st).max() * 0.05] ** 2)) + 1e-9
    st = st * min(10 ** (-20 / 20) / rms, 10 ** (-1 / 20) / (np.abs(st).max() + 1e-9))
    laut = np.nonzero(np.abs(st).max(axis=0) > 0.01)[0]  # Stille am Anfang weg: Klang sitzt genau auf „ab“
    if len(laut):
        st = st[:, max(0, laut[0] - int(0.002 * SR)):]
    daten = (st.T * 32767).astype("<i2")
    with wave.open(str(pfad), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(daten.tobytes())


def ansehen(wav):
    BILDER.mkdir(parents=True, exist_ok=True)
    ziel = BILDER / (Path(wav).stem + ".png")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-filter_complex",
         "[0:a]showwavespic=s=1200x200:colors=#ff8a1f:split_channels=0[w];"
         "[0:a]showspectrumpic=s=1200x300:legend=1:scale=log:fscale=log:color=fire[s];"
         "[s]scale=1400:360[s2];[w]pad=1400:200:100:0[w2];[w2][s2]vstack", str(ziel)], check=True)
    return ziel


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("art", nargs="?")
    ap.add_argument("--name")
    ap.add_argument("--dauer", type=float)
    ap.add_argument("--hoehe", type=float, default=1.0, help="Tonhöhe/Helligkeit, 1 = normal")
    ap.add_argument("--hall", type=float, default=0.0)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--ziel", help="anderer Ordner (Standard animationen/public/klang)")
    ap.add_argument("--ueberschreiben", action="store_true")
    ap.add_argument("--liste", action="store_true")
    ap.add_argument("--ansehen")
    a = ap.parse_args()
    if a.liste or not (a.art or a.ansehen):
        for k, (_, txt) in ARTEN.items():
            print(f"  {k:<11} {txt}")
        return
    if a.ansehen:
        print(ansehen(a.ansehen))
        return
    if a.art not in ARTEN:
        sys.exit(f"Unbekannt: {a.art}. --liste zeigt alle.")
    global rng
    rng = np.random.default_rng(a.seed)
    fn = ARTEN[a.art][0]
    st = fn(a.dauer, a.hoehe) if a.dauer else fn(h=a.hoehe)
    if a.hall > 0:
        st = np.stack([hall(st[0], a.hall)[0], hall(st[1], a.hall)[1]])
    ordner = Path(a.ziel) if a.ziel else ZIEL
    ordner.mkdir(parents=True, exist_ok=True)
    pfad = ordner / f"{a.name or a.art}.wav"
    if pfad.exists() and not a.ueberschreiben:
        sys.exit(f"{pfad} gibt es schon – anderen --name wählen oder --ueberschreiben.")
    speichern(st, pfad)
    print(pfad)
    print(ansehen(pfad))


if __name__ == "__main__":
    main()
