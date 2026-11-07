"""Klont eine Stimme lokal mit Qwen3-TTS (Apache 2.0), ohne Konto, für Mac mit Apple-Chip.

  qwen_mac.py --modell 0.6B --text hook.txt --ziel ergebnis/test-0.6B.wav [--geraet auto]

Abschnitte im Text werden mit einer Zeile "---" getrennt. Fertige Stücke bleiben im
Ordner ZIEL-teile, ein neuer Start macht dort weiter.
"""
import argparse
import os
import re
import shutil
import subprocess
import time

import numpy as np
import soundfile as sf
import torch

ORDNER = os.path.dirname(os.path.abspath(__file__))
MODELLE = {
    "0.6B": "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
    "1.7B": "Qwen/Qwen3-TTS-12Hz-1.7B-Base",
}
VORLAGE = os.path.join(ORDNER, "vorlage.wav")
VORLAGE_TEXT = os.path.join(ORDNER, "vorlage-text.txt")

# Einstellungen der vom Nutzer gewählten Variante A
MAX_ZEICHEN = 160
TEMPERATUR = 0.6
PAUSE_STUECK, PAUSE_ABSCHNITT = 0.1, 0.6
PAUSEN_FILTER = (
    "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05"
    ":stop_periods=-1:stop_threshold=-40dB:stop_duration=0.3:stop_silence=0.25"
)
LAUTSTAERKE_FILTER = "loudnorm=I=-16:TP=-1.5:LRA=11"
SAMPLERATE = 24000


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


def ffmpeg_pfad():
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        pfad = shutil.which("ffmpeg")
        if not pfad:
            raise SystemExit("ffmpeg wurde nicht gefunden.")
        return pfad


def zusammensetzen(stuecke, pfade, ziel):
    args = [ffmpeg_pfad(), "-y", "-hide_banner", "-loglevel", "error"]
    for pfad in pfade:
        args += ["-i", pfad]
    filt = ""
    for i in range(len(pfade)):
        neu_abschnitt = i + 1 < len(stuecke) and stuecke[i + 1][0] != stuecke[i][0]
        filt += f"[{i}:a]{PAUSEN_FILTER},apad=pad_dur={PAUSE_ABSCHNITT if neu_abschnitt else PAUSE_STUECK}[a{i}];"
    filt += "".join(f"[a{i}]" for i in range(len(pfade)))
    filt += f"concat=n={len(pfade)}:v=0:a=1,{LAUTSTAERKE_FILTER}[out]"
    subprocess.run(args + ["-filter_complex", filt, "-map", "[out]", "-ar", str(SAMPLERATE), ziel], check=True)


def geraet_waehlen(wunsch):
    if wunsch != "auto":
        return wunsch
    return "mps" if torch.backends.mps.is_available() else "cpu"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--modell", choices=MODELLE, required=True)
    p.add_argument("--text", required=True)
    p.add_argument("--ziel", required=True)
    p.add_argument("--geraet", choices=["auto", "mps", "cpu"], default="auto")
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
        from qwen_tts import Qwen3TTSModel

        geraet = geraet_waehlen(a.geraet)
        print(f"Modell {a.modell} auf {geraet}", flush=True)
        modell = Qwen3TTSModel.from_pretrained(MODELLE[a.modell], device_map=geraet, dtype=torch.float32)
        print(f"Modell geladen nach {time.time() - t0:.0f} s", flush=True)
        with open(VORLAGE_TEXT, encoding="utf-8") as f:
            vorlage_text = f.read().strip()
        prompt = modell.create_voice_clone_prompt(ref_audio=VORLAGE, ref_text=vorlage_text)
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
            wav = np.asarray(wavs[0])
            if not np.isfinite(wav).all() or np.abs(wav).max() < 1e-3:
                raise RuntimeError(f"Stück {i + 1} ist leer oder fehlerhaft, Gerät: {geraet}")
            zwischen = pfade[i] + ".tmp.wav"
            sf.write(zwischen, wav, sr)
            os.replace(zwischen, pfade[i])
            print(f"[{i + 1}/{len(stuecke)}] {len(wav) / sr:.1f} s Audio in {time.time() - t:.0f} s", flush=True)

    zusammensetzen(stuecke, pfade, a.ziel)
    print(f"Fertig: {a.ziel} (gesamt {time.time() - t0:.0f} s)", flush=True)


if __name__ == "__main__":
    main()
