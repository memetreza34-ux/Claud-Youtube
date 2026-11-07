"""Erzeugt die Hörprobe mit Kartoffelbox: hoerprobe.py VORLAGE TEXTDATEI ZIEL.wav"""
import os
import re
import shutil
import subprocess
import sys
import tempfile

from gradio_client import Client, handle_file

vorlage, textdatei, ziel = sys.argv[1:4]
text = open(textdatei, encoding="utf-8").read().strip()

# Sätze zu kurzen Stücken bündeln, lange Texte lassen sonst Sätze aus
saetze = re.split(r"(?<=[.!?])\s+", text)
stuecke, aktuell = [], ""
for satz in saetze:
    if aktuell and len(aktuell) + len(satz) + 1 > 170:
        stuecke.append(aktuell)
        aktuell = satz
    else:
        aktuell = f"{aktuell} {satz}".strip()
stuecke.append(aktuell)

client = Client("SebastianBodza/Kartoffelbox", verbose=False)
tmp = tempfile.mkdtemp()
teile = []
for i, stueck in enumerate(stuecke, 1):
    print(f"[{i}/{len(stuecke)}] {stueck}", flush=True)
    pfad = client.predict(
        text_input=stueck,
        audio_prompt_path_input=handle_file(vorlage),
        exaggeration_input=0.5,
        temperature_input=0.6,
        seed_num_input=42,
        cfgw_input=0.3,
        api_name="/generate_tts_audio",
    )
    teil = os.path.join(tmp, f"{i}.wav")
    shutil.copy(pfad, teil)
    teile.append(teil)

# Stücke mit kurzer Pause zusammensetzen
args = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
for teil in teile:
    args += ["-i", teil]
filt = "".join(f"[{i}:a]apad=pad_dur=0.3[a{i}];" for i in range(len(teile)))
filt += "".join(f"[a{i}]" for i in range(len(teile)))
filt += f"concat=n={len(teile)}:v=0:a=1[out]"
args += ["-filter_complex", filt, "-map", "[out]", ziel]
subprocess.run(args, check=True)
print(f"Fertig: {ziel}")
