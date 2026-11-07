"""Erzeugt ein Voiceover mit Kartoffelbox: voiceover.py VORLAGE TEXTDATEI ZIEL.wav

Abschnitte im Text werden mit einer Zeile "---" getrennt. Fertige Stücke bleiben im
Ordner ZIEL-teile liegen, ein neuer Start macht also dort weiter, wo es aufgehört hat.
Exit-Code 2: abgebrochen, z. B. weil das Kontingent der Demo leer ist.
"""
import os
import re
import shutil
import subprocess
import sys

from gradio_client import Client, handle_file

MAX_ZEICHEN = 170
PAUSE_STUECK = 0.3
PAUSE_ABSCHNITT = 0.8

vorlage, textdatei, ziel = sys.argv[1:4]
text = open(textdatei, encoding="utf-8").read()
teile_ordner = os.path.splitext(ziel)[0] + "-teile"
os.makedirs(teile_ordner, exist_ok=True)

stuecke = []  # (Abschnitt, Text)
for a, abschnitt in enumerate(re.split(r"^---\s*$", text, flags=re.M), 1):
    aktuell = ""
    for satz in re.split(r"(?<=[.!?:])\s+", abschnitt.strip()):
        if aktuell and len(aktuell) + len(satz) + 1 > MAX_ZEICHEN:
            stuecke.append((a, aktuell))
            aktuell = satz
        else:
            aktuell = f"{aktuell} {satz}".strip()
    stuecke.append((a, aktuell))

pfade = [os.path.join(teile_ordner, f"{i:03d}.wav") for i in range(1, len(stuecke) + 1)]
offen = [i for i, p in enumerate(pfade) if not os.path.exists(p)]
print(f"{len(stuecke)} Stücke, davon {len(offen)} offen", flush=True)

if offen:
    client = Client("SebastianBodza/Kartoffelbox", verbose=False)
    for i in offen:
        print(f"[{i + 1}/{len(stuecke)}]", flush=True)
        try:
            pfad = client.predict(
                text_input=stuecke[i][1],
                audio_prompt_path_input=handle_file(vorlage),
                exaggeration_input=0.5,
                temperature_input=0.6,
                seed_num_input=42,
                cfgw_input=0.3,
                api_name="/generate_tts_audio",
            )
        except Exception as fehler:
            fertig = sum(os.path.exists(p) for p in pfade)
            meldung = str(fehler).encode("ascii", "replace").decode()
            print(f"ABBRUCH bei Stück {i + 1}: {meldung}\nFertig: {fertig}/{len(stuecke)}", flush=True)
            sys.exit(2)
        shutil.copy(pfad, pfade[i])

args = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
for pfad in pfade:
    args += ["-i", pfad]
filt = ""
for i in range(len(pfade)):
    neuer_abschnitt = i + 1 < len(stuecke) and stuecke[i + 1][0] != stuecke[i][0]
    pause = PAUSE_ABSCHNITT if neuer_abschnitt else PAUSE_STUECK
    filt += f"[{i}:a]apad=pad_dur={pause}[a{i}];"
filt += "".join(f"[a{i}]" for i in range(len(pfade)))
filt += f"concat=n={len(pfade)}:v=0:a=1[out]"
args += ["-filter_complex", filt, "-map", "[out]", ziel]
subprocess.run(args, check=True)
print(f"Fertig: {ziel}", flush=True)
