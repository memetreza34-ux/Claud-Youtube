#!/usr/bin/env python3
"""Tonprüfung durch Abschrift: Versteht man jedes Wort? (Ersatz für mein fehlendes Gehör)

  python3 tools/tonpruefung.py <video.mp4|ton.wav> <sprechtext.txt> [--stimme audio.wav]

Schreibt den fertigen Ton mit Whisper ab und vergleicht ihn Wort für Wort mit dem Skript.
  FEHLT       Wort aus dem Skript ist im Ton nicht zu verstehen
  FALSCH      etwas anderes zu hören (Aussprache der KI-Stimme oder überdeckt)
  ÜBERDECKT   nur mit --stimme: in der reinen Stimme verständlich, im Mix nicht → Klang/Musik zu laut
Zahlen in Ziffern und zusammengeschriebene Wörter zählen als richtig.
Whisper-Modell: /Volumes/T7/strichermittler-modelle/whisper (small). Zwischendateien: /Volumes/T7/strichermittler-tmp/tonpruefung.
"""
import argparse
import difflib
import json
import re
import subprocess
import sys
from pathlib import Path

TMP = Path("/Volumes/T7/strichermittler-tmp/tonpruefung")
MODELLE = "/Volumes/T7/strichermittler-modelle/whisper"


def norm(w):
    w = w.lower().replace("ß", "ss")
    return re.sub(r"[^0-9a-zäöü]", "", w)


def skript_woerter(pfad):
    text = Path(pfad).read_text(encoding="utf-8")
    text = "\n".join(z for z in text.splitlines() if z.strip() != "---" and not z.strip().startswith("#"))
    text = re.sub(r"\[[^\]]*\]", " ", text)  # Regieanweisungen in [ ] ignorieren
    return [n for n in (norm(w) for w in text.split()) if n]


def abschrift(quelle, name):
    TMP.mkdir(parents=True, exist_ok=True)
    wav = TMP / f"{name}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(quelle), "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
    befehl = ["whisper", str(wav), "--model", "small", "--language", "de", "--word_timestamps", "True",
              "--output_format", "json", "--output_dir", str(TMP), "--fp16", "False", "--verbose", "False"]
    if Path(MODELLE).exists():
        befehl += ["--model_dir", MODELLE]
    subprocess.run(befehl, check=True, capture_output=True)
    daten = json.loads((TMP / f"{name}.json").read_text())
    woerter = []
    for seg in daten.get("segments", []):
        for w in seg.get("words", []):
            n = norm(w["word"])
            if n:
                woerter.append((n, w["start"], w["word"].strip()))
    return woerter


def vergleiche(skript, gehoert):
    """-> Liste (art, skript_text, gehört_text, zeit) und Anteil verstandener Wörter"""
    g = [w for w, *_ in gehoert]
    sm = difflib.SequenceMatcher(a=skript, b=g, autojunk=False)
    funde, ok = [], 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            ok += i2 - i1
            continue
        a, b = skript[i1:i2], g[j1:j2]
        zeit = gehoert[min(j1, len(gehoert) - 1)][1] if gehoert else 0
        if tag == "replace":
            if "".join(a) == "".join(b) or (b and all(re.fullmatch(r"[0-9]+", x) for x in b)):
                ok += len(a)  # zusammengeschrieben/getrennt oder Zahl als Ziffern
                continue
            if difflib.SequenceMatcher(a="".join(a), b="".join(b)).ratio() >= 0.8:
                ok += len(a)
                funde.append(("ÄHNLICH", " ".join(a), " ".join(w for *_, w in gehoert[j1:j2]), zeit))
                continue
            funde.append(("FALSCH", " ".join(a), " ".join(w for *_, w in gehoert[j1:j2]), zeit))
        elif tag == "delete":
            funde.append(("FEHLT", " ".join(a), "", zeit))
        elif tag == "insert":
            if all(re.fullmatch(r"[0-9]+", x) for x in b):
                continue
            funde.append(("EXTRA", "", " ".join(w for *_, w in gehoert[j1:j2]), zeit))
    return funde, ok / max(1, len(skript))


def zeit(t):
    m, s = divmod(t, 60)
    return f"{int(m):02d}:{s:05.2f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ton")
    ap.add_argument("sprechtext")
    ap.add_argument("--stimme", help="reine Stimme (audio.wav) zum Vergleich: zeigt, was Klänge/Musik überdecken")
    a = ap.parse_args()
    skript = skript_woerter(a.sprechtext)
    mix = abschrift(a.ton, Path(a.ton).stem + "-mix")
    funde, quote = vergleiche(skript, mix)
    print(f"Verständlich im fertigen Ton: {quote * 100:.1f} % der {len(skript)} Skript-Wörter")
    stimme_ok = None
    if a.stimme:
        st = abschrift(a.stimme, Path(a.stimme).stem + "-stimme")
        f2, q2 = vergleiche(skript, st)
        print(f"Verständlich in der reinen Stimme: {q2 * 100:.1f} %")
        stimme_ok = {(f[1]) for f in f2 if f[0] in ("FEHLT", "FALSCH")}
    if not funde:
        print("Alles verstanden.")
    for art, s, h, t in funde:
        if stimme_ok is not None and art in ("FEHLT", "FALSCH") and s not in stimme_ok:
            art = "ÜBERDECKT"
        if art == "ÄHNLICH":
            print(f"  {zeit(t)}  ähnlich    „{s}“ ≈ „{h}“ (Whisper-Schreibweise, meist ok)")
        elif art == "EXTRA":
            print(f"  {zeit(t)}  extra      „{h}“ (nicht im Skript – Versprecher der Stimme?)")
        else:
            print(f"  {zeit(t)}  {art:<10} Skript „{s}“ → gehört „{h}“")
    print("\nFALSCH = Aussprache prüfen (Wort im Sprechtext lautgetreu schreiben, neu vertonen).")
    print("ÜBERDECKT/FEHLT im Mix = Klang oder Musik an der Stelle leiser.")


if __name__ == "__main__":
    main()
