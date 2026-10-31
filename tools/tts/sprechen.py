"""Text -> deutsche Sprache mit Chatterbox Multilingual (MIT).

Nutzung:
  .venv/bin/python sprechen.py text.txt ausgabe/name.wav
  .venv/bin/python sprechen.py "Ein kurzer Satz." ausgabe/test.wav

Optionen über Umgebungsvariablen:
  STIMME=stimmen/thorsten-referenz.wav   Referenzstimme (nur Stimmen, die man nutzen darf!)
  EMOTION=0.5                            0.25 ruhig ... 1.0 sehr emotional
  TEMPO=0.5                              niedriger = langsamer, deutlicher
"""
import os
import re
import sys
import time

import torch
import torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

STIMME = os.environ.get("STIMME", "stimmen/thorsten-referenz.wav")
EMOTION = float(os.environ.get("EMOTION", "0.5"))
TEMPO = float(os.environ.get("TEMPO", "0.5"))
PAUSE_SEK = 0.35


def saetze(text: str) -> list[str]:
    # Lange Texte in Stücke teilen, Chatterbox klingt bei kurzen Stücken besser.
    teile = re.split(r"(?<=[.!?…])\s+", text.strip())
    stuecke, aktuell = [], ""
    for t in teile:
        if len(aktuell) + len(t) < 150:
            aktuell = f"{aktuell} {t}".strip()
        else:
            if aktuell:
                stuecke.append(aktuell)
            aktuell = t
    if aktuell:
        stuecke.append(aktuell)
    return stuecke


def main() -> None:
    quelle, ziel = sys.argv[1], sys.argv[2]
    text = open(quelle, encoding="utf-8").read() if os.path.isfile(quelle) else quelle

    # Auf 16-GB-Macs lief MPS voll und wurde vom System beendet → Standard CPU.
    geraet = os.environ.get("GERAET", "cpu")
    print(f"Lade Modell auf {geraet} …", flush=True)
    try:
        modell = ChatterboxMultilingualTTS.from_pretrained(device=geraet)
    except Exception as e:  # MPS macht bei manchen Versionen Probleme
        print(f"MPS fehlgeschlagen ({e}), nehme CPU", flush=True)
        modell = ChatterboxMultilingualTTS.from_pretrained(device="cpu")

    stille = torch.zeros(1, int(modell.sr * PAUSE_SEK))
    teile = []
    stuecke = saetze(text)
    for i, s in enumerate(stuecke, 1):
        t0 = time.time()
        wav = modell.generate(
            s,
            language_id="de",
            audio_prompt_path=STIMME,
            exaggeration=EMOTION,
            cfg_weight=TEMPO,
        )
        teile += [wav.cpu(), stille]
        print(f"[{i}/{len(stuecke)}] {time.time() - t0:.0f}s  {s[:60]}", flush=True)

    os.makedirs(os.path.dirname(ziel) or ".", exist_ok=True)
    ta.save(ziel, torch.cat(teile, dim=1), modell.sr)
    print(f"Fertig: {ziel}", flush=True)


if __name__ == "__main__":
    main()
