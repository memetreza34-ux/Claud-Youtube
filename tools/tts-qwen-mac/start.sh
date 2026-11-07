#!/bin/bash
# Richtet Qwen3-TTS beim ersten Start ein und erzeugt Test oder Voiceover.
#   bash start.sh      zeigt das Menü
#   bash start.sh 1    startet direkt Punkt 1 (auch 2 oder 3)
cd "$(dirname "$0")" || exit 1

if [ "$(uname -s)" != "Darwin" ] || [ "$(uname -m)" != "arm64" ]; then
  echo "Dieses Paket ist für einen Mac mit Apple-Chip gedacht."
  exit 1
fi

if [ ! -f vorlage.wav ]; then
  echo "vorlage.wav fehlt. Bitte deine Vorlage in diesen Ordner legen, siehe LIES-MICH.txt."
  exit 1
fi

export PATH="$HOME/.local/bin:$PATH"
export HF_HOME="$PWD/modelle"
export HF_HUB_DISABLE_SYMLINKS_WARNING=1
export PYTORCH_ENABLE_MPS_FALLBACK=1
export PYTHONUTF8=1

einrichten() {
  if ! command -v uv >/dev/null 2>&1; then
    echo "Installiere uv (Python-Werkzeug von astral.sh) ..."
    curl -LsSf https://astral.sh/uv/install.sh | sh || return 1
  fi
  if [ ! -x .venv/bin/python ]; then
    echo "Richte Python und Qwen3-TTS ein, das dauert einige Minuten ..."
    uv venv --python 3.12 .venv || return 1
    uv pip install --python .venv/bin/python qwen-tts==0.1.1 torch==2.15.0 torchaudio==2.11.1 imageio-ffmpeg ||
      uv pip install --python .venv/bin/python qwen-tts==0.1.1 torch torchaudio imageio-ffmpeg || return 1
  fi
}

erzeugen() { # Modell Textdatei Ziel
  echo
  echo "=== $3 mit Modell $1 ==="
  caffeinate -i .venv/bin/python qwen_mac.py --modell "$1" --text "$2" --ziel "$3" && return 0
  echo "Mit der Mac-Grafik ging es nicht. Neuer Versuch mit dem Prozessor ..."
  caffeinate -i .venv/bin/python qwen_mac.py --modell "$1" --text "$2" --ziel "$3" --geraet cpu
}

wahl="$1"
if [ -z "$wahl" ]; then
  echo "1) Test: kurzer Hook mit beiden Modellen (zum Vergleichen)"
  echo "2) Volles Voiceover mit Modell 0.6B"
  echo "3) Volles Voiceover mit Modell 1.7B"
  printf "Deine Wahl (1, 2 oder 3): "
  read -r wahl
fi

einrichten || { echo "Einrichtung fehlgeschlagen."; exit 1; }
mkdir -p ergebnis

case "$wahl" in
  1)
    erzeugen 0.6B hook.txt ergebnis/test-0.6B.wav &&
      erzeugen 1.7B hook.txt ergebnis/test-1.7B.wav
    ;;
  2) erzeugen 0.6B voiceover-01-sprechtext.txt ergebnis/voiceover-01-0.6B.wav ;;
  3) erzeugen 1.7B voiceover-01-sprechtext.txt ergebnis/voiceover-01-1.7B.wav ;;
  *) echo "Bitte 1, 2 oder 3 wählen."; exit 1 ;;
esac
status=$?

if [ "$status" -eq 0 ]; then
  echo
  echo "Fertig. Die Dateien liegen im Ordner: $PWD/ergebnis"
  open ergebnis
else
  echo
  echo "Es gab einen Fehler (Code $status). Bitte die Meldungen oben an Claude schicken."
fi
exit "$status"
