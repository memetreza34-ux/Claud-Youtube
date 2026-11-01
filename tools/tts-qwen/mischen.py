"""Zwei Stimmen mischen: Stimmfarbe (Sprecher-Embedding) beider Vorlagen mitteln,
Sprechrhythmus von einer der beiden übernehmen. Läuft mit dem kleinen 0.6B-Modell.

  .venv/bin/python mischen.py B.wav C.wav "Text der Vorlagen" "Neuer Text" ausgabe_ordner/
"""
import dataclasses
import os
import sys
import time

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

wav_b, wav_c, vorlagen_text, neuer_text, ziel = sys.argv[1:6]
GEWICHT_B = float(os.environ.get("GEWICHT_B", "0.5"))  # 0 = nur C, 1 = nur B

modell = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-0.6B-Base", device_map="mps", dtype=torch.float32)
pb = modell.create_voice_clone_prompt(ref_audio=wav_b, ref_text=vorlagen_text)[0]
pc = modell.create_voice_clone_prompt(ref_audio=wav_c, ref_text=vorlagen_text)[0]
mix_emb = GEWICHT_B * pb.ref_spk_embedding + (1 - GEWICHT_B) * pc.ref_spk_embedding

os.makedirs(ziel, exist_ok=True)
for name, basis in (("mix-rhythmus-B", pb), ("mix-rhythmus-C", pc)):
    t0 = time.time()
    item = dataclasses.replace(basis, ref_spk_embedding=mix_emb)
    wavs, sr = modell.generate_voice_clone(text=neuer_text, language="German", voice_clone_prompt=[item])
    sf.write(os.path.join(ziel, f"{name}.wav"), wavs[0], sr)
    print(f"{name}: {time.time() - t0:.0f}s", flush=True)
