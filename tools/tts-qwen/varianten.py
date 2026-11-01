"""Mehrere Stimm-Beschreibungen mit demselben Testtext vergleichen (Design-Modell nur einmal laden).

  .venv/bin/python varianten.py stimmen/varianten.txt ausgabe/varianten/

varianten.txt: pro Zeile "name | beschreibung"
"""
import os
import sys
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

TEST = (
    "Stell dir vor, dein Handy klingelt. Am anderen Ende: die Polizei. "
    "Dein Sohn hatte einen Unfall, und du sollst sofort zahlen. Klingt echt? Ist es nicht. "
    "Heute decken wir auf, wie diese Masche funktioniert."
)

liste, ziel = sys.argv[1], sys.argv[2]
geraet = os.environ.get("GERAET", "mps")
dtype = torch.float32 if geraet == "mps" else torch.bfloat16
print(f"Lade Design-Modell auf {geraet} …", flush=True)
modell = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map=geraet, dtype=dtype)

os.makedirs(ziel, exist_ok=True)
for zeile in open(liste, encoding="utf-8"):
    if "|" not in zeile:
        continue
    name, beschreibung = (x.strip() for x in zeile.split("|", 1))
    t0 = time.time()
    wavs, sr = modell.generate_voice_design(text=TEST, instruct=beschreibung, language="German")
    sf.write(os.path.join(ziel, f"{name}.wav"), wavs[0], sr)
    print(f"{name}: {time.time() - t0:.0f}s", flush=True)
