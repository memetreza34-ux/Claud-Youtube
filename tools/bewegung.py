#!/usr/bin/env python3
"""Bewegungsprüfung: macht sichtbar, wie sich ein Video bewegt – ich sehe sonst nur Standbilder.

  python3 tools/bewegung.py <video.mp4> [--von S] [--bis S] [--offset S]

Ergebnis neben dem Video:
  <video>-bewegung.jpg  Zeile pro Sekunde: 10 Bilder (alle 0,1 s) + Bewegungskurve darunter
                        (rot = auffällige Stelle). Mit dem Read-Werkzeug ansehen.
  Bericht in der Konsole: Stillstand, harte Starts/Stopps (fehlendes Easing), Sprünge (Schnitt?),
                        Hektik, Ruckeln.
--offset: Zeit, ab der das Video im Gesamtvideo beginnt (szene.sh setzt sie), damit die
Zeitangaben zum Szenenplan passen.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

KLEIN = 192  # Breite für die Messung (Weichzeichner nimmt das Filmkorn raus)
SCHWELLE = 4  # Grauwert-Änderung, ab der ein Pixel als „bewegt“ zählt


def probe(v):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate", "-of", "json", v],
        capture_output=True, text=True, check=True).stdout
    s = json.loads(out)["streams"][0]
    a, b = s["r_frame_rate"].split("/")
    return s["width"], s["height"], float(a) / float(b)


def frames(v, w, h, breite, von, bis, grau):
    hh = int(round(h * breite / w / 2) * 2)
    args = ["ffmpeg", "-v", "error"]
    if von:
        args += ["-ss", str(von)]
    args += ["-i", v]
    if bis is not None:
        args += ["-t", str(bis - (von or 0))]
    args += ["-vf", f"scale={breite}:{hh}" + (",gblur=sigma=1.5,format=gray" if grau else ",format=rgb24"),
             "-f", "rawvideo", "-"]
    raw = subprocess.run(args, capture_output=True, check=True).stdout
    k = 1 if grau else 3
    n = len(raw) // (breite * hh * k)
    arr = np.frombuffer(raw[: n * breite * hh * k], np.uint8)
    return arr.reshape((n, hh, breite) if grau else (n, hh, breite, 3))


def laeufe(maske, min_len):
    """Zusammenhängende True-Bereiche mit Mindestlänge -> [(start, ende)]"""
    out, start = [], None
    for i, m in enumerate(list(maske) + [False]):
        if m and start is None:
            start = i
        elif not m and start is not None:
            if i - start >= min_len:
                out.append((start, i))
            start = None
    return out


def zeit(t):
    m, s = divmod(t, 60)
    return f"{int(m):02d}:{s:05.2f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--von", type=float, default=0.0)
    ap.add_argument("--bis", type=float, default=None)
    ap.add_argument("--offset", type=float, default=0.0)
    a = ap.parse_args()

    w, h, fps = probe(a.video)
    g = frames(a.video, w, h, KLEIN, a.von, a.bis, True).astype(np.float32)
    if len(g) < 3:
        sys.exit("Zu wenige Bilder.")
    d = np.zeros(len(g))  # mittlere Änderung zum Vorbild in % (für Sprünge/Ruckeln)
    d[1:] = np.abs(np.diff(g, axis=0)).mean(axis=(1, 2)) / 255 * 100
    f1 = np.zeros(len(g))  # bewegte Fläche zum Vorbild in %
    f1[1:] = (np.abs(np.diff(g, axis=0)) > SCHWELLE).mean(axis=(1, 2)) * 100
    L = max(1, int(round(fps / 6)))  # 1/6 s Abstand: macht auch langsame Kamerafahrten sichtbar
    f5 = np.zeros(len(g))  # bewegte Fläche über 1/6 s in % (für Stillstand und Kurve)
    f5[L:] = (np.abs(g[L:] - g[:-L]) > SCHWELLE).mean(axis=(1, 2)) * 100
    f5[:L] = f5[L] if len(g) > L else 0
    t0 = a.offset + a.von
    T = lambda i: t0 + i / fps
    med = float(np.median(d[1:])) or 0.01
    funde = []  # (frame, art, text)

    # 1) Sprünge: ein Bild ändert sich auf einmal stark. 1–2 Bilder = harter Schnitt/Sprung,
    #    länger = schneller Schwenk/Übergang (meist gewollt, Tempo prüfen)
    sp = np.array([d[i] > max(6.0, med * 8) and f1[i] > 15 for i in range(len(d))])
    for s0, s1 in laeufe(sp, 1):
        if s1 - s0 <= 3:
            funde.append((s0, "SPRUNG", f"{f1[s0:s1].max():.0f} % des Bildes auf einmal neu – geplanter Schnitt? Sonst Übergang/Easing fehlt"))
        else:
            funde.append((s0, "SCHWENK", f"{(s1 - s0) / fps:.2f} s schneller Übergang – gewollt? Tempo passend zum Satz?"))
    spr = set(np.nonzero(sp)[0].tolist())

    # 2) Stillstand: im gleitenden 1-s-Median bewegt sich weniger als 1,5 % der Fläche, länger als 2 s
    #    (kurze Untertitel-Wechsel zählen damit nicht als Bewegung)
    k = max(1, int(fps // 2))
    glatt = np.array([np.median(f5[max(0, i - k):i + k + 1]) for i in range(len(f5))])
    for s0, s1 in laeufe(glatt < 1.5, int(2 * fps)):
        funde.append((s0, "STILL", f"{(s1 - s0) / fps:.1f} s steht das Bild (bis {zeit(T(s1))}) – Kamera-Drift, Akzent, neues Bild?"))

    # 3) Harte Starts/Stopps: Bewegung springt von Ruhe direkt auf voll – fehlendes Easing
    for i in range(3, len(f1) - 3):
        if spr & set(range(i - 3, i + 4)):
            continue
        vor, nach = f1[i - 3:i].mean(), f1[i:i + 3].mean()
        if vor < 0.3 and nach > 6 and f1[i] > 0.7 * nach:
            funde.append((i, "HARTSTART", "Bewegung setzt schlagartig ein – weicher anlaufen lassen (spring/Easing)"))
        if nach < 0.3 and vor > 6 and f1[i - 1] > 0.7 * vor:
            funde.append((i, "HARTSTOPP", "Bewegung bricht schlagartig ab – auslaufen lassen"))

    # 4) Hektik: über 1 s bewegt sich mehr als 45 % des Bildes von Bild zu Bild
    for s0, s1 in laeufe(f1 > 45, int(1.0 * fps)):
        funde.append((s0, "HEKTIK", f"{(s1 - s0) / fps:.1f} s sehr viel Bewegung – ruhiger, ist Text lesbar?"))

    # 5) Ruckeln: Bewegung schwankt Bild für Bild (hoch-tief-hoch) – Werte springen statt zu gleiten
    zick = np.zeros(len(f1), bool)
    for i in range(2, len(f1)):
        a1, a2 = f1[i] - f1[i - 1], f1[i - 1] - f1[i - 2]
        zick[i] = a1 * a2 < 0 and min(abs(a1), abs(a2)) > max(3.0, 0.5 * f1[i - 2:i + 1].mean()) and f1[i - 2:i + 1].mean() > 2
    for s0, s1 in laeufe(zick, 4):
        funde.append((s0, "RUCKELN", "Bewegung zuckt Bild für Bild – Werte glätten, Sprünge in der Animation vermeiden"))

    funde.sort()
    print(f"Video {a.video}: {len(g)} Bilder, {fps:.0f} fps, bewegte Fläche im Mittel {f5.mean():.1f} %")
    if not funde:
        print("Keine Auffälligkeiten.")
    for i, k, txt in funde:
        print(f"  {zeit(T(i))}  {k:<9} {txt}")

    # Bild: je Sekunde eine Zeile mit 10 Bildern + Kurve
    hoch = h > w
    kb = 108 if hoch else 192
    c = frames(a.video, w, h, kb, a.von, a.bis, False)
    kh = c.shape[1]
    schritt = max(1, int(round(fps / 10)))
    zeilen = int(np.ceil(len(c) / fps))
    kurve, rand = 44, 4
    zh = kh + kurve + rand * 2
    breite = 10 * kb + 90
    img = Image.new("RGB", (breite, zeilen * zh), (16, 16, 18))
    dr = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 15)
    except OSError:
        font = ImageFont.load_default()
    rot = {i for i, *_ in funde}
    rot_bereich = set()
    for i, k, txt in funde:
        rot_bereich.update(range(max(0, i - 2), min(len(d), i + 3)))
    skala = 40.0  # Kurve: bewegte Fläche, 40 % = volle Höhe
    for z in range(zeilen):
        y = z * zh + rand
        f0 = int(round(z * fps))
        dr.text((6, y + kh / 2 - 8), zeit(T(f0)), fill=(230, 230, 230), font=font)
        for j in range(10):
            fi = f0 + j * schritt
            if fi >= len(c):
                break
            img.paste(Image.fromarray(c[fi]), (90 + j * kb, y))
            if fi in rot_bereich:
                dr.rectangle([90 + j * kb, y, 90 + (j + 1) * kb - 1, y + kh - 1], outline=(239, 68, 68), width=3)
        # Kurve dieser Sekunde
        yb = y + kh + kurve
        dr.line([90, yb, 90 + 10 * kb, yb], fill=(60, 60, 64))
        ry = yb - 1.5 / skala * (kurve - 4)  # grüne Linie = Stillstand-Grenze
        dr.line([90, ry, 90 + 10 * kb, ry], fill=(70, 90, 70))
        n = int(round(fps))
        for j in range(n):
            fi = f0 + j
            if fi >= len(d):
                break
            x = 90 + j * (10 * kb) / n
            hh_ = min(1.0, f5[fi] / skala) * (kurve - 4)
            farbe = (239, 68, 68) if fi in rot_bereich else (255, 138, 31)
            dr.rectangle([x, yb - hh_, x + (10 * kb) / n - 1, yb], fill=farbe)
    ziel = str(Path(a.video).with_suffix("")) + "-bewegung.jpg"
    img.save(ziel, quality=85)
    print(f"Bewegungsbild: {ziel}")


if __name__ == "__main__":
    main()
