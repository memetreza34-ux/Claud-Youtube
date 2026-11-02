"""Stimmen über die kostenlose Qwen-Online-Demo erfinden (kein lokales Modell nötig).

  .venv/bin/python online.py stimmen/varianten-erklaer.txt ZIELORDNER

Liste: pro Zeile "name | beschreibung". Testtext über Umgebungsvariable TEST.
"""
import os
import shutil
import sys
import time

from gradio_client import Client

TEST = os.environ.get("TEST", (
    "Hacker, Betrüger und Skandale. Ich zeige dir, was wirklich dahintersteckt. "
    "Und glaub mir: Das ist krasser, als du denkst. "
    "Denn diese Masche? Die hat schon tausende Menschen erwischt."
))

liste, ziel = sys.argv[1], sys.argv[2]
os.makedirs(ziel, exist_ok=True)
# Die Haupt-Demo erlaubt die Sprache Deutsch fest einzustellen; die reine Voice-Design-Demo warf Fehler.
client = Client("Qwen/Qwen3-TTS", verbose=False)

for zeile in open(liste, encoding="utf-8"):
    if "|" not in zeile:
        continue
    name, beschreibung = (x.strip() for x in zeile.split("|", 1))
    t0 = time.time()
    try:
        pfad, _status = client.predict(
            text=TEST, language="German", voice_description=beschreibung, api_name="/generate_voice_design"
        )
    except Exception as e:  # Demo kann überlastet sein → nächste Stimme versuchen
        print(f"{name}: FEHLER {e}", flush=True)
        continue
    endung = os.path.splitext(pfad)[1] or ".wav"
    shutil.copy(pfad, os.path.join(ziel, name + endung))
    print(f"{name}: {time.time() - t0:.0f}s", flush=True)
