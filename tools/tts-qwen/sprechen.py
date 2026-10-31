"""Text -> deutsche Sprache mit Qwen3-TTS VoiceDesign (Apache 2.0).

Die Stimme wird nur per Beschreibung erfunden (stimme.txt) – keine fremde Stimme nötig.

Nutzung:
  .venv/bin/python sprechen.py text.txt ausgabe/name.wav
  .venv/bin/python sprechen.py "Ein kurzer Satz." ausgabe/test.wav

Umgebungsvariablen:
  MODELL=Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign
  GERAET=cpu | mps
  STIMME_DATEI=stimme.txt
"""
import os
import re
import sys
import time

import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

MODELL = os.environ.get("MODELL", "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign")
GERAET = os.environ.get("GERAET", "cpu")
STIMME_DATEI = os.environ.get("STIMME_DATEI", "stimme.txt")
PAUSE_SEK = 0.3


def stuecke(text: str, max_len: int = 160) -> list[str]:
    saetze = re.split(r"(?<=[.!?…])\s+", text.strip())
    out, akt = [], ""
    for s in saetze:
        if len(akt) + len(s) < max_len:
            akt = f"{akt} {s}".strip()
        else:
            if akt:
                out.append(akt)
            akt = s
    if akt:
        out.append(akt)
    return out


def main() -> None:
    quelle, ziel = sys.argv[1], sys.argv[2]
    text = open(quelle, encoding="utf-8").read() if os.path.isfile(quelle) else quelle
    stimme = open(STIMME_DATEI, encoding="utf-8").read().strip()

    print(f"Lade {MODELL} auf {GERAET} …", flush=True)
    dtype = torch.float16 if GERAET == "mps" else torch.bfloat16
    modell = Qwen3TTSModel.from_pretrained(MODELL, device_map=GERAET, dtype=dtype)

    teile, sr = [], None
    liste = stuecke(text)
    for i, s in enumerate(liste, 1):
        t0 = time.time()
        wavs, sr = modell.generate_voice_design(text=s, instruct=stimme, language="German")
        teile += [wavs[0], np.zeros(int(sr * PAUSE_SEK), dtype=wavs[0].dtype)]
        print(f"[{i}/{len(liste)}] {time.time() - t0:.0f}s  {s[:60]}", flush=True)

    os.makedirs(os.path.dirname(ziel) or ".", exist_ok=True)
    sf.write(ziel, np.concatenate(teile), sr)
    print(f"Fertig: {ziel}", flush=True)


if __name__ == "__main__":
    main()
