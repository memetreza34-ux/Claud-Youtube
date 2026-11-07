"""Klont eine Stimme lokal mit Chatterbox Multilingual (MIT, ONNX, CPU), ohne Konto.

  chatterbox_onnx.py VORLAGE TEXTDATEI ZIEL.wav [--sprache de] [--emotion 0.5]

Ablauf nach dem offiziellen Beispiel von onnx-community/chatterbox-multilingual-ONNX,
mit dem verkleinerten Sprachmodell (q4). Abschnitte im Text werden mit einer Zeile "---"
getrennt. Fertige Stücke bleiben im Ordner ZIEL-teile, ein neuer Start macht dort weiter.
"""
import argparse
import gc
import os
import re
import subprocess
import time

import librosa
import numpy as np
import onnxruntime
import soundfile as sf
from huggingface_hub import hf_hub_download
from transformers import AutoTokenizer

MODELL = "onnx-community/chatterbox-multilingual-ONNX"
ORDNER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "modelle", "chatterbox")
SR = 24000
START, STOP = 6561, 6562
SCHICHTEN, KOEPFE, KOPF_DIM = 30, 16, 64
STRAFE = 1.2
MAX_TOKENS = 700
MAX_ZEICHEN = 170
VORLAGE_SEKUNDEN = 10
PAUSE_STUECK, PAUSE_ABSCHNITT = 0.3, 0.8

p = argparse.ArgumentParser()
p.add_argument("vorlage")
p.add_argument("textdatei")
p.add_argument("ziel")
p.add_argument("--sprache", default="de")
p.add_argument("--emotion", type=float, default=0.5)
a = p.parse_args()


def laden(name):
    pfad = hf_hub_download(MODELL, filename=f"{name}.onnx", subfolder="onnx", local_dir=ORDNER)
    hf_hub_download(MODELL, filename=f"{name}.onnx_data", subfolder="onnx", local_dir=ORDNER)
    return pfad


def sitzung(pfad):
    o = onnxruntime.SessionOptions()
    o.intra_op_num_threads = 4
    o.enable_cpu_mem_arena = False
    return onnxruntime.InferenceSession(pfad, o, providers=["CPUExecutionProvider"])


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


t0 = time.time()
for datei in ("tokenizer.json", "tokenizer_config.json"):
    hf_hub_download(MODELL, filename=datei, local_dir=ORDNER)
pfad_encoder = laden("speech_encoder")
pfad_embed = laden("embed_tokens")
pfad_decoder = laden("conditional_decoder")
pfad_sprache = laden("language_model_q4")
print(f"Modelle bereit nach {time.time() - t0:.0f} s", flush=True)

teile = os.path.splitext(a.ziel)[0] + "-teile"
os.makedirs(teile, exist_ok=True)
stuecke = stuecke_bilden(open(a.textdatei, encoding="utf-8").read())
pfade = [os.path.join(teile, f"{i:03d}.wav") for i in range(1, len(stuecke) + 1)]
offen = [i for i, x in enumerate(pfade) if not os.path.exists(x)]
print(f"{len(stuecke)} Stücke, davon {len(offen)} offen", flush=True)

if offen:
    t = time.time()
    audio, _ = librosa.load(a.vorlage, sr=SR, duration=VORLAGE_SEKUNDEN)
    encoder = sitzung(pfad_encoder)
    cond_emb, prompt_token, x_vector, prompt_feat = encoder.run(None, {"audio_values": audio[np.newaxis, :].astype(np.float32)})
    del encoder
    gc.collect()
    print(f"Stimme eingelesen in {time.time() - t:.0f} s", flush=True)

    tokenizer = AutoTokenizer.from_pretrained(ORDNER)
    embed = sitzung(pfad_embed)
    sprache = sitzung(pfad_sprache)
    decoder = sitzung(pfad_decoder)
    typen = {e.name: e.type for e in sprache.get_inputs()}
    print(f"Sitzungen bereit nach {time.time() - t0:.0f} s", flush=True)

    for i in offen:
        t = time.time()
        ids = tokenizer(f"[{a.sprache}]{stuecke[i][1]}", return_tensors="np")["input_ids"].astype(np.int64)
        position = np.where(ids >= START, 0, np.arange(ids.shape[1])[np.newaxis, :] - 1)
        eingabe = {"input_ids": ids, "position_ids": position.astype(np.int64), "exaggeration": np.array([a.emotion], dtype=np.float32)}
        erzeugt = np.array([[START]], dtype=np.int64)
        cache = None
        for schritt in range(MAX_TOKENS):
            vektoren = embed.run(None, eingabe)[0]
            if schritt == 0:
                vektoren = np.concatenate((cond_emb, vektoren), axis=1)
                maske = np.ones((1, vektoren.shape[1]), dtype=np.int64)
                cache = {
                    f"past_key_values.{s}.{k}": np.zeros(
                        [1, KOEPFE, 0, KOPF_DIM],
                        dtype=np.float16 if typen[f"past_key_values.{s}.{k}"] == "tensor(float16)" else np.float32,
                    )
                    for s in range(SCHICHTEN) for k in ("key", "value")
                }
            logits, *neu = sprache.run(None, {"inputs_embeds": vektoren, "attention_mask": maske, **cache})
            logits = logits[:, -1, :].copy()
            wert = np.take_along_axis(logits, erzeugt, axis=1)
            np.put_along_axis(logits, erzeugt, np.where(wert < 0, wert * STRAFE, wert / STRAFE), axis=1)
            naechster = np.argmax(logits, axis=-1, keepdims=True).astype(np.int64)
            erzeugt = np.concatenate((erzeugt, naechster), axis=1)
            if naechster.item() == STOP:
                break
            eingabe["input_ids"] = naechster
            eingabe["position_ids"] = np.full((1, 1), schritt + 1, dtype=np.int64)
            maske = np.concatenate([maske, np.ones((1, 1), dtype=np.int64)], axis=1)
            for j, schluessel in enumerate(cache):
                cache[schluessel] = neu[j]
            if schritt == 19:
                print(f"  Tempo: {(time.time() - t) / 20:.1f} s pro Token", flush=True)
        else:
            print(f"  Warnung: Stück {i + 1} hat das Token-Limit erreicht", flush=True)
        sprache_tokens = erzeugt[:, 1:]
        sprache_tokens = sprache_tokens[sprache_tokens < START][np.newaxis, :]
        wav = decoder.run(None, {
            "speech_tokens": np.concatenate([prompt_token, sprache_tokens], axis=1),
            "speaker_embeddings": x_vector,
            "speaker_features": prompt_feat,
        })[0]
        zwischen = pfade[i] + ".tmp.wav"
        sf.write(zwischen, np.squeeze(wav, axis=0), SR)
        os.replace(zwischen, pfade[i])
        print(f"[{i + 1}/{len(stuecke)}] {sprache_tokens.shape[1]} Tokens, {time.time() - t:.0f} s", flush=True)

args = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"]
for pfad in pfade:
    args += ["-i", pfad]
filt = ""
for i in range(len(pfade)):
    neu_abschnitt = i + 1 < len(stuecke) and stuecke[i + 1][0] != stuecke[i][0]
    filt += f"[{i}:a]apad=pad_dur={PAUSE_ABSCHNITT if neu_abschnitt else PAUSE_STUECK}[a{i}];"
filt += "".join(f"[a{i}]" for i in range(len(pfade))) + f"concat=n={len(pfade)}:v=0:a=1[out]"
subprocess.run(args + ["-filter_complex", filt, "-map", "[out]", a.ziel], check=True)
print(f"Fertig: {a.ziel} (gesamt {time.time() - t0:.0f} s)", flush=True)
