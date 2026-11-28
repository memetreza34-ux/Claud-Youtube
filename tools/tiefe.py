"""Tiefenkarte aus einem Foto (Depth Anything V2 Small, lokal über onnxruntime).

  tools/tiefe.sh <bild> [ziel.png]      (Standard: <bild>-tiefe.png daneben)

Weiß = nah, Schwarz = fern. Wird für die 2,5D-Kamerafahrt gebraucht (Szenentyp `foto3d`).
Modell: /Volumes/T7/strichermittler-modelle/hub (onnx-community/depth-anything-v2-small).
"""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from PIL import Image, ImageFilter

quelle = Path(sys.argv[1])
ziel = Path(sys.argv[2]) if len(sys.argv) > 2 else quelle.with_name(quelle.stem + "-tiefe.png")

modell = hf_hub_download("onnx-community/depth-anything-v2-small", "onnx/model.onnx", local_files_only=True)
sitzung = ort.InferenceSession(modell, providers=["CPUExecutionProvider"])

bild = Image.open(quelle).convert("RGB")
W, H = bild.size
# Kurze Seite auf 518 (Vielfaches von 14), Seitenverhältnis behalten
k = 518 / min(W, H)
w, h = max(14, round(W * k / 14) * 14), max(14, round(H * k / 14) * 14)
x = np.asarray(bild.resize((w, h), Image.BICUBIC), dtype=np.float32) / 255.0
x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
x = x.transpose(2, 0, 1)[None]
tiefe = sitzung.run(None, {sitzung.get_inputs()[0].name: x})[0][0]
tiefe = (tiefe - tiefe.min()) / (np.ptp(tiefe) + 1e-6)  # 1 = nah
karte = Image.fromarray((tiefe * 255).astype(np.uint8)).resize((min(W, 1920), round(H * min(W, 1920) / W)), Image.BICUBIC)
karte = karte.filter(ImageFilter.GaussianBlur(2))  # weiche Kanten = weniger Verzerrung bei der Kamerafahrt
karte.save(ziel)
print(ziel)
