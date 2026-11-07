"""Erzeugt kurze Vergleichsvarianten und misst, wie nah sie an der eigenen Aufnahme liegen.

  varianten.py AUFNAHME.wav AUFNAHME-TEXT.txt AUSGABEORDNER
"""
import os
import subprocess
import sys
import time

HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HIER, "OpenVoice"))

import librosa  # noqa: E402
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
import torch  # noqa: E402
from openvoice.api import OpenVoiceBaseClass, ToneColorConverter  # noqa: E402

PIPER_MODELL = os.path.join(HIER, "modelle", "piper", "de_DE-thorsten-high.onnx")
KONVERTER = os.path.join(HIER, "modelle", "converter")
TEST = ("Das ist die Stimme ihres Sohnes. Der Tonfall. Die Art, wie er Mama sagt. Alles stimmt. "
        "Diese Stimme hat eine KI gemacht. Aus drei Sekunden Audio.")
SR = 22050


class Konverter(ToneColorConverter):
    def __init__(self, config, device):
        OpenVoiceBaseClass.__init__(self, config, device=device)
        self.watermark_model = None
        self.version = getattr(self.hps, "_version_", "v1")


def piper(text, ziel, tempo=1.0):
    subprocess.run(
        [sys.executable, "-m", "piper", "-m", PIPER_MODELL, "-f", ziel,
         "--length-scale", str(tempo), "--sentence-silence", "0.35"],
        input=text.encode("utf-8"), check=True, capture_output=True,
    )


def ohne_stille(pfad, ziel):
    y, _ = librosa.load(pfad, sr=SR)
    stuecke = [y[s:e] for s, e in librosa.effects.split(y, top_db=35)]
    y = np.concatenate(stuecke)
    sf.write(ziel, y, SR)
    return len(y) / SR


def grundton(pfad, sekunden=20):
    y, _ = librosa.load(pfad, sr=SR, duration=sekunden)
    f0, stimmhaft, _ = librosa.pyin(y, fmin=60, fmax=400, sr=SR)
    return float(np.nanmedian(f0[stimmhaft]))


def naehe(a, b):
    return float(torch.nn.functional.cosine_similarity(a.flatten(), b.flatten(), dim=0))


aufnahme, aufnahme_text, ausgabe = sys.argv[1:4]
os.makedirs(ausgabe, exist_ok=True)
torch.set_num_threads(4)
t0 = time.time()

ich = os.path.join(ausgabe, "_ich.wav")
thorsten_roh = os.path.join(ausgabe, "_thorsten-roh.wav")
thorsten = os.path.join(ausgabe, "_thorsten.wav")
sek_ich = ohne_stille(aufnahme, ich)
piper(open(aufnahme_text, encoding="utf-8").read(), thorsten_roh)
sek_thorsten = ohne_stille(thorsten_roh, thorsten)
tempo = sek_ich / sek_thorsten
f0_ich, f0_thorsten = grundton(ich), grundton(thorsten)
ton = f0_ich / f0_thorsten
print(f"Sprechzeit gleicher Text: ich {sek_ich:.1f} s, Thorsten {sek_thorsten:.1f} s -> Tempo-Faktor {tempo:.2f}", flush=True)
print(f"Grundton: ich {f0_ich:.0f} Hz, Thorsten {f0_thorsten:.0f} Hz -> Ton-Faktor {ton:.2f}", flush=True)

k = Konverter(os.path.join(KONVERTER, "config.json"), device="cpu")
k.load_ckpt(os.path.join(KONVERTER, "checkpoint.pth"))
se_ich = k.extract_se([ich])
se_thorsten = k.extract_se([thorsten])
print(f"Modell geladen nach {time.time() - t0:.0f} s", flush=True)
print(f"Nähe Thorsten roh zu mir: {naehe(se_thorsten, se_ich):.3f}", flush=True)

VARIANTEN = [
    ("A", 0.3, False, False),
    ("B", 0.1, False, True),
    ("C", 0.1, True, True),
    ("D", 0.0, True, True),
]
for name, tau, ton_an, tempo_an in VARIANTEN:
    t = time.time()
    roh = os.path.join(ausgabe, f"_{name}-roh.wav")
    piper(TEST, roh, tempo if tempo_an else 1.0)
    quelle = roh
    if ton_an:
        quelle = os.path.join(ausgabe, f"_{name}-ton.wav")
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", roh,
                        "-af", f"rubberband=pitch={ton:.4f}:pitchq=quality", quelle], check=True)
    ziel = os.path.join(ausgabe, f"variante-{name}.wav")
    k.convert(audio_src_path=quelle, src_se=se_thorsten, tgt_se=se_ich, output_path=ziel, tau=tau)
    print(f"{name}: tau={tau} ton={ton_an} tempo={tempo_an} | Nähe zu mir {naehe(k.extract_se([ziel]), se_ich):.3f} "
          f"| Grundton {grundton(ziel):.0f} Hz | {time.time() - t:.0f} s", flush=True)

for datei in os.listdir(ausgabe):
    if datei.startswith("_"):
        os.remove(os.path.join(ausgabe, datei))
print(f"Fertig nach {time.time() - t0:.0f} s", flush=True)
