"""Erzeugt mit Qwen3-TTS 0.6B kurze Varianten desselben Satzpaars, um Einstellungen zu vergleichen.

  qwen_varianten.py ORDNER

Pausen werden gekürzt und die Lautstärke angeglichen. Fertige Varianten werden übersprungen.
"""
import os
import subprocess
import sys
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

MODELL = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"
TEXT = "Nur: Ihr Sohn sitzt in diesem Moment ganz entspannt bei der Arbeit. Diese Stimme hat eine KI gemacht."
FILTER = (
    "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05"
    ":stop_periods=-1:stop_threshold=-40dB:stop_duration=0.3:stop_silence=0.25,"
    "loudnorm=I=-16:TP=-1.5:LRA=11"
)

ordner = sys.argv[1]
VORLAGE_1 = ("../vorlage.wav", "../vorlage-text.txt")
VORLAGE_2 = ("../vorlage-2.wav", "../vorlage-2-text.txt")
VARIANTEN = [
    ("A-ruhig", VORLAGE_1, 0.6),
    ("B-sehr-ruhig", VORLAGE_1, 0.3),
    ("C-andere-vorlage", VORLAGE_2, 0.6),
]

torch.set_num_threads(4)
t0 = time.time()
modell = Qwen3TTSModel.from_pretrained(MODELL, device_map="cpu", dtype=torch.bfloat16)
print(f"Modell geladen nach {time.time() - t0:.0f} s", flush=True)

prompts = {}
for name, (audio, text_datei), temperatur in VARIANTEN:
    ziel = os.path.join(ordner, f"variante-{name}.wav")
    if os.path.exists(ziel):
        continue
    if audio not in prompts:
        text = open(text_datei, encoding="utf-8").read().strip()
        prompts[audio] = modell.create_voice_clone_prompt(ref_audio=audio, ref_text=text)
    t = time.time()
    torch.manual_seed(42)
    wavs, sr = modell.generate_voice_clone(
        text=TEXT,
        language="German",
        voice_clone_prompt=prompts[audio],
        temperature=temperatur,
        subtalker_temperature=temperatur,
    )
    roh = ziel + ".roh.wav"
    sf.write(roh, wavs[0], sr)
    zwischen = ziel + ".tmp.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", roh, "-af", FILTER, "-ar", str(sr), zwischen],
        check=True,
    )
    os.replace(zwischen, ziel)
    os.remove(roh)
    print(f"{name}: {len(wavs[0]) / sr:.1f} s Audio in {time.time() - t:.0f} s", flush=True)

print(f"Fertig (gesamt {time.time() - t0:.0f} s)", flush=True)
