"""Sprechpausen kürzen und Wortzeiten für Remotion-Untertitel holen.

  python3 pausen_und_untertitel.py QUELLE.wav ZIEL.wav ZIEL.json ARBEITSORDNER

1. Sucht Pausen über 0,45 s (ffmpeg silencedetect, -40 dB) und kürzt jede auf etwa 0,35 s.
2. Lässt Whisper (small, Deutsch) über den gekürzten Ton laufen.
3. Schreibt die Wortzeiten als Remotion-Captions: {text, startMs, endMs, timestampMs, confidence}.

Danach die JSON-Datei kurz gegenlesen: Whisper verschreibt manchmal Namen und Zahlen.
Braucht ffmpeg und das whisper-Programm (z. B. über Homebrew).
"""
import json
import os
import re
import subprocess
import sys

quelle, ziel_wav, ziel_json, arbeits = sys.argv[1:5]
os.makedirs(arbeits, exist_ok=True)

aus = subprocess.run(
    ["ffmpeg", "-hide_banner", "-nostats", "-i", quelle, "-af", "silencedetect=n=-40dB:d=0.45", "-f", "null", "-"],
    capture_output=True,
    text=True,
).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", aus)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", aus)]
h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", aus).groups()
dauer = 3600 * int(h) + 60 * int(m) + float(s)

schnitte = []
for i, a in enumerate(starts):
    e = ends[i] if i < len(ends) else dauer
    if a < 0.05:  # Stille am Anfang fast ganz weg
        schnitte.append((0.0, max(0.0, e - 0.05)))
    elif e >= dauer - 0.01:  # Stille am Ende auf 0,4 s
        schnitte.append((a + 0.4, e))
    else:  # Pause in der Mitte auf etwa 0,35 s
        schnitte.append((a + 0.17, e - 0.18))

if schnitte:
    ausdruck = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in schnitte)
    filter_ = f"aselect='not({ausdruck})',asetpts=N/SR/TB"
else:
    filter_ = "anull"
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", quelle, "-af", filter_, ziel_wav], check=True)
print("Pausen gekürzt:", len(schnitte), "· gespart:", round(sum(b - a for a, b in schnitte), 2), "s")

subprocess.run(
    ["whisper", ziel_wav, "--model", "small", "--language", "de", "--word_timestamps", "True",
     "--output_format", "json", "--output_dir", arbeits, "--fp16", "False", "--verbose", "False"],
    check=True,
    capture_output=True,
)
daten = json.load(open(os.path.join(arbeits, os.path.splitext(os.path.basename(ziel_wav))[0] + ".json")))
woerter = [w for seg in daten["segments"] for w in seg.get("words", [])]
caps = [
    {
        "text": w["word"],
        "startMs": round(w["start"] * 1000),
        "endMs": round(w["end"] * 1000),
        "timestampMs": round(w["start"] * 1000),
        "confidence": None,
    }
    for w in woerter
]
json.dump(caps, open(ziel_json, "w"), ensure_ascii=False)
for i, c in enumerate(caps):
    print(f"{i:3d} {c['startMs'] / 1000:6.2f} {c['text']}")
neu = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", ziel_wav], capture_output=True, text=True)
print("Dauer:", round(float(neu.stdout.strip()), 2), "s")
