"""Text -> deutsche Sprache mit Qwen3-TTS (Apache 2.0).

Zwei Modi:
  klon   (Standard) – schnelles 0.6B-Modell klont die feste Erzählerstimme
                      aus stimmen/erzaehler.wav → in jedem Satz gleich.
  design            – 1.7B-Modell erfindet eine Stimme aus stimme.txt
                      (langsam, nur um eine neue Erzählerstimme zu erzeugen).

Nutzung:
  .venv/bin/python sprechen.py text.txt ausgabe/name.wav
  MODUS=design .venv/bin/python sprechen.py "Ein Satz." ausgabe/test.wav

Umgebungsvariablen:
  MODUS=klon | design
  GERAET=mps | cpu
"""
import os
import re
import sys
import time

import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

MODUS = os.environ.get("MODUS", "klon")
MODELL = {
    "klon": "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
    "design": "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
}[MODUS]
GERAET = os.environ.get("GERAET", "mps")
STIMME_DATEI = "stimme.txt"
VORLAGE_WAV, VORLAGE_TXT = "stimmen/erzaehler.wav", "stimmen/erzaehler.txt"
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
    print(f"Lade {MODELL} auf {GERAET} …", flush=True)
    # float16 auf MPS liefert NaN beim Sampling → float32
    dtype = torch.float32 if GERAET == "mps" else torch.bfloat16
    modell = Qwen3TTSModel.from_pretrained(MODELL, device_map=GERAET, dtype=dtype)

    if MODUS == "klon":
        prompt = modell.create_voice_clone_prompt(
            ref_audio=VORLAGE_WAV,
            ref_text=open(VORLAGE_TXT, encoding="utf-8").read().strip(),
        )
        sprich = lambda s: modell.generate_voice_clone(text=s, language="German", voice_clone_prompt=prompt)
    else:
        stimme = open(STIMME_DATEI, encoding="utf-8").read().strip()
        sprich = lambda s: modell.generate_voice_design(text=s, instruct=stimme, language="German")

    teile, sr = [], None
    liste = stuecke(text)
    for i, s in enumerate(liste, 1):
        t0 = time.time()
        wavs, sr = sprich(s)
        teile += [wavs[0], np.zeros(int(sr * PAUSE_SEK), dtype=wavs[0].dtype)]
        print(f"[{i}/{len(liste)}] {time.time() - t0:.0f}s  {s[:60]}", flush=True)

    os.makedirs(os.path.dirname(ziel) or ".", exist_ok=True)
    sf.write(ziel, np.concatenate(teile), sr)
    print(f"Fertig: {ziel}", flush=True)


if __name__ == "__main__":
    main()
