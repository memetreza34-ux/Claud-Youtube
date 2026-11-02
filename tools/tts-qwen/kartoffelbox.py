"""Deutsche Sprache mit Kartoffelbox (Chatterbox, auf deutschen Sprechern nachtrainiert, MIT)
über die kostenlose Online-Demo. Braucht eine echte Stimmvorlage, die wir nutzen dürfen.

  .venv/bin/python kartoffelbox.py VORLAGE.wav ZIEL.wav [space]
"""
import os
import shutil
import sys

from gradio_client import Client, handle_file

TEXT = os.environ.get("TEXT", (
    "Hacker, Betrüger und Skandale. Ich zeige dir, was wirklich dahintersteckt. "
    "Und glaub mir: Das ist krasser, als du denkst. "
    "Denn diese Masche hat schon tausende Menschen erwischt."
))
EMOTION = float(os.environ.get("EMOTION", "0.6"))

vorlage, ziel = sys.argv[1], sys.argv[2]
space = sys.argv[3] if len(sys.argv) > 3 else "SebastianBodza/Kartoffelbox"
client = Client(space, verbose=False)
pfad = client.predict(
    text_input=TEXT,
    audio_prompt_path_input=handle_file(vorlage),
    exaggeration_input=EMOTION,
    temperature_input=0.6,
    seed_num_input=0,
    cfgw_input=0.3,
    api_name="/generate_tts_audio",
)
os.makedirs(os.path.dirname(ziel) or ".", exist_ok=True)
shutil.copy(pfad, ziel)
print(f"Fertig: {ziel}")
