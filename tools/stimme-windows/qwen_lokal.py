"""Klont eine Stimme lokal mit Qwen3-TTS 0.6B (Apache 2.0) auf der CPU, ohne Konto.

  qwen_lokal.py VORLAGE VORLAGE-TEXT.txt TEXTDATEI ZIEL.wav

Abschnitte im Text werden mit einer Zeile "---" getrennt. Fertige Stücke bleiben im
Ordner ZIEL-teile, ein neuer Start macht dort weiter.
"""
import os
import re
import subprocess
import sys
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

MODELL = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"
MAX_ZEICHEN = 160
PAUSE_STUECK, PAUSE_ABSCHNITT = 0.1, 0.6
TEMPERATUR = 0.6
PAUSEN_FILTER = (
    "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05"
    ":stop_periods=-1:stop_threshold=-40dB:stop_duration=0.3:stop_silence=0.25"
)
LAUTSTAERKE_FILTER = "loudnorm=I=-16:TP=-1.5:LRA=11"

vorlage, vorlage_text, textdatei, ziel = sys.argv[1:5]
torch.set_num_threads(4)


def stuecke_bilden(text):
    ergebnis = []
    for nr, abschnitt in enumerate(re.split(r"^---\s*$", text, flags=re.M), 1):
        aktuell = ""
        for satz in re.split(r"(?<=[.!?:])\s+", abschnitt.strip()):
            if aktuell and len(aktuell) + len(satz) + 1 > MAX_ZEICHEN:
                ergebnis.append((nr, aktuell))
                aktuell = satz
            else:
                aktuell = f"{aktuell} {satz}".strip()
        ergebnis.append((nr, aktuell))
    return ergebnis


teile = os.path.splitext(ziel)[0] + "-teile"
os.makedirs(teile, exist_ok=True)
stuecke = stuecke_bilden(open(textdatei, encoding="utf-8").read())
pfade = [os.path.join(teile, f"{i:03d}.wav") for i in range(1, len(stuecke) + 1)]
offen = [i for i, x in enumerate(pfade) if not os.path.exists(x)]
print(f"{len(stuecke)} Stücke, davon {len(offen)} offen", flush=True)

t0 = time.time()
if offen:
    modell = Qwen3TTSModel.from_pretrained(MODELL, device_map="cpu", dtype=torch.bfloat16)
    print(f"Modell geladen nach {time.time() - t0:.0f} s", flush=True)
    prompt = modell.create_voice_clone_prompt(
        ref_audio=vorlage,
        ref_text=open(vorlage_text, encoding="utf-8").read().strip(),
    )
    print(f"Stimme eingelesen nach {time.time() - t0:.0f} s", flush=True)
    for i in offen:
        t = time.time()
        torch.manual_seed(42)
        wavs, sr = modell.generate_voice_clone(
            text=stuecke[i][1],
            language="German",
            voice_clone_prompt=prompt,
            temperature=TEMPERATUR,
            subtalker_temperature=TEMPERATUR,
        )
        zwischen = pfade[i] + ".tmp.wav"
        sf.write(zwischen, wavs[0], sr)
        os.replace(zwischen, pfade[i])
        sekunden = len(wavs[0]) / sr
        print(f"[{i + 1}/{len(stuecke)}] {sekunden:.1f} s Audio in {time.time() - t:.0f} s", flush=True)

args = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
for pfad in pfade:
    args += ["-i", pfad]
filt = ""
for i in range(len(pfade)):
    neu_abschnitt = i + 1 < len(stuecke) and stuecke[i + 1][0] != stuecke[i][0]
    filt += f"[{i}:a]{PAUSEN_FILTER},apad=pad_dur={PAUSE_ABSCHNITT if neu_abschnitt else PAUSE_STUECK}[a{i}];"
filt += "".join(f"[a{i}]" for i in range(len(pfade))) + f"concat=n={len(pfade)}:v=0:a=1,{LAUTSTAERKE_FILTER}[out]"
subprocess.run(args + ["-filter_complex", filt, "-map", "[out]", "-ar", "24000", ziel], check=True)
print(f"Fertig: {ziel} (gesamt {time.time() - t0:.0f} s)", flush=True)
