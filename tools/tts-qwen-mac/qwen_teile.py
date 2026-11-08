"""Aufteilen und Zusammensetzen für qwen_mlx.py, ohne PyTorch.

Gleiche Werte wie in qwen_mac.py (Variante A). Bei Änderungen beide Dateien anpassen.
"""
import re
import shutil
import subprocess

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


def zusammensetzen(stuecke, pfade, ziel):
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg wurde nicht gefunden.")
    args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error"]
    for pfad in pfade:
        args += ["-i", pfad]
    filt = ""
    for i in range(len(pfade)):
        neu_abschnitt = i + 1 < len(stuecke) and stuecke[i + 1][0] != stuecke[i][0]
        filt += f"[{i}:a]{PAUSEN_FILTER},apad=pad_dur={PAUSE_ABSCHNITT if neu_abschnitt else PAUSE_STUECK}[a{i}];"
    filt += "".join(f"[a{i}]" for i in range(len(pfade)))
    filt += f"concat=n={len(pfade)}:v=0:a=1,{LAUTSTAERKE_FILTER}[out]"
    subprocess.run(args + ["-filter_complex", filt, "-map", "[out]", "-ar", str(SAMPLERATE), ziel], check=True)
