"""Lokales Voiceover: Piper (deutsche Stimme Thorsten, CC0) spricht den Text,
OpenVoice V2 (MIT) überträgt die Klangfarbe der Vorlage. Läuft ohne Konto auf der CPU.

  voiceover_lokal.py VORLAGE TEXTDATEI ZIEL.wav [--tau 0.3] [--tempo 1.0]

Abschnitte im Text werden mit einer Zeile "---" getrennt. Fertige Abschnitte bleiben im
Ordner ZIEL-teile liegen, ein neuer Start macht dort weiter.
"""
import argparse
import os
import re
import subprocess
import sys
import time

HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HIER, "OpenVoice"))

import torch  # noqa: E402
from openvoice.api import OpenVoiceBaseClass, ToneColorConverter  # noqa: E402


class Konverter(ToneColorConverter):
    """Ohne Wasserzeichen-Paket: enable_watermark=False stürzt im Original-Konstruktor ab."""

    def __init__(self, config, device):
        OpenVoiceBaseClass.__init__(self, config, device=device)
        self.watermark_model = None
        self.version = getattr(self.hps, "_version_", "v1")


PIPER_MODELL = os.path.join(HIER, "modelle", "piper", "de_DE-thorsten-high.onnx")
KONVERTER = os.path.join(HIER, "modelle", "converter")
PAUSE_ABSCHNITT = 0.8

p = argparse.ArgumentParser()
p.add_argument("vorlage")
p.add_argument("textdatei")
p.add_argument("ziel")
p.add_argument("--tau", type=float, default=0.3)
p.add_argument("--tempo", type=float, default=1.0, help="Piper length_scale: größer = langsamer")
a = p.parse_args()

torch.set_num_threads(4)
teile = os.path.splitext(a.ziel)[0] + "-teile"
os.makedirs(teile, exist_ok=True)
abschnitte = [s.strip() for s in re.split(r"^---\s*$", open(a.textdatei, encoding="utf-8").read(), flags=re.M) if s.strip()]


def piper(text, ziel):
    subprocess.run(
        [sys.executable, "-m", "piper", "-m", PIPER_MODELL, "-f", ziel,
         "--length-scale", str(a.tempo), "--sentence-silence", "0.35"],
        input=text.encode("utf-8"), check=True, capture_output=True,
    )


t0 = time.time()
konverter = Konverter(os.path.join(KONVERTER, "config.json"), device="cpu")
konverter.load_ckpt(os.path.join(KONVERTER, "checkpoint.pth"))
ziel_se = konverter.extract_se([a.vorlage])

# Klangprofil der Quellstimme aus einem festen, ausreichend langen Text
quelle = os.path.join(HIER, "modelle", "piper", "quelle.wav")
if not os.path.exists(quelle):
    probe = os.path.join(HIER, "..", "voiceover-01-sprechtext.txt")
    piper(open(probe, encoding="utf-8").read().replace("---", "")[:1200], quelle)
quell_se = konverter.extract_se([quelle])
print(f"Modelle geladen nach {time.time() - t0:.0f} s", flush=True)

pfade = []
for i, text in enumerate(abschnitte, 1):
    pfad = os.path.join(teile, f"{i:02d}.wav")
    pfade.append(pfad)
    if os.path.exists(pfad):
        continue
    t = time.time()
    roh = pfad + ".piper.wav"
    piper(text, roh)
    zwischen = pfad + ".tmp.wav"
    konverter.convert(audio_src_path=roh, src_se=quell_se, tgt_se=ziel_se, output_path=zwischen, tau=a.tau)
    os.replace(zwischen, pfad)
    os.remove(roh)
    print(f"[{i}/{len(abschnitte)}] fertig in {time.time() - t:.0f} s", flush=True)

args = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
for pfad in pfade:
    args += ["-i", pfad]
filt = "".join(f"[{i}:a]apad=pad_dur={PAUSE_ABSCHNITT}[a{i}];" for i in range(len(pfade)))
filt += "".join(f"[a{i}]" for i in range(len(pfade))) + f"concat=n={len(pfade)}:v=0:a=1[out]"
subprocess.run(args + ["-filter_complex", filt, "-map", "[out]", a.ziel], check=True)
print(f"Fertig: {a.ziel} (gesamt {time.time() - t0:.0f} s)", flush=True)
