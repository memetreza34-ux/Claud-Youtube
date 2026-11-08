"""Wie qwen_mac.py, aber mit MLX (Apple-eigene Technik) statt PyTorch, meist deutlich schneller.

  qwen_mlx.py --modell 1.7B-8bit --text hook.txt --ziel ergebnis/mlx-hook-1.7B-8bit.wav

Abschnitte im Text werden mit einer Zeile "---" getrennt. Fertige Stücke bleiben im
Ordner ZIEL-teile, ein neuer Start macht dort weiter.
"""
import argparse
import os
import time

import mlx.core as mx
import numpy as np
import soundfile as sf

from qwen_teile import SAMPLERATE, TEMPERATUR, stuecke_bilden, zusammensetzen

ORDNER = os.path.dirname(os.path.abspath(__file__))
MODELLE = {
    "1.7B-8bit": "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit",
    "1.7B-bf16": "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16",
}
VORLAGE = os.path.join(ORDNER, "vorlage.wav")
VORLAGE_TEXT = os.path.join(ORDNER, "vorlage-text.txt")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--modell", choices=MODELLE, required=True)
    p.add_argument("--text", required=True)
    p.add_argument("--ziel", required=True)
    a = p.parse_args()

    teile = os.path.splitext(a.ziel)[0] + "-teile"
    os.makedirs(teile, exist_ok=True)
    with open(a.text, encoding="utf-8") as f:
        stuecke = stuecke_bilden(f.read())
    pfade = [os.path.join(teile, f"{i:03d}.wav") for i in range(1, len(stuecke) + 1)]
    offen = [i for i, x in enumerate(pfade) if not os.path.exists(x)]
    print(f"{len(stuecke)} Stücke, davon {len(offen)} offen", flush=True)

    t0 = time.time()
    if offen:
        from mlx_audio.tts.utils import load_model

        modell = load_model(MODELLE[a.modell])
        print(f"Modell {a.modell} geladen nach {time.time() - t0:.0f} s", flush=True)
        with open(VORLAGE_TEXT, encoding="utf-8") as f:
            vorlage_text = f.read().strip()
        for i in offen:
            t = time.time()
            mx.random.seed(42)
            ergebnisse = modell.generate(
                text=stuecke[i][1],
                ref_audio=VORLAGE,
                ref_text=vorlage_text,
                lang_code="german",
                temperature=TEMPERATUR,
                split_pattern="",
            )
            ergebnisse = list(ergebnisse)
            if ergebnisse[0].sample_rate != SAMPLERATE:
                raise RuntimeError(f"Unerwartete Abtastrate {ergebnisse[0].sample_rate}")
            wav = np.concatenate([np.asarray(r.audio, dtype=np.float32) for r in ergebnisse])
            if not np.isfinite(wav).all() or np.abs(wav).max() < 1e-3:
                raise RuntimeError(f"Stück {i + 1} ist leer oder fehlerhaft")
            zwischen = pfade[i] + ".tmp.wav"
            sf.write(zwischen, wav, SAMPLERATE)
            os.replace(zwischen, pfade[i])
            print(f"[{i + 1}/{len(stuecke)}] {len(wav) / SAMPLERATE:.1f} s Audio in {time.time() - t:.0f} s", flush=True)

    zusammensetzen(stuecke, pfade, a.ziel)
    print(f"Fertig: {a.ziel} (gesamt {time.time() - t0:.0f} s)", flush=True)


if __name__ == "__main__":
    main()
