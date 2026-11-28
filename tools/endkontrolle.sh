#!/usr/bin/env bash
# Technische Endkontrolle eines fertigen Videos.
#   tools/endkontrolle.sh <video.mp4>
# Prüft: Auflösung, Länge, Lautheit (Ziel −14 LUFS), schwarze Stellen, stumme Stellen. Macht einen Kontaktbogen.
set -eu
V=${1:?Video fehlt}
echo "== $V"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of default=nw=1 "$V"
echo "Länge: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V") s"
ffmpeg -i "$V" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | tail -1 | sed 's/^ */Lautheit: /'
echo "Schwarze Stellen (> 0,4 s):"
ffmpeg -v error -i "$V" -vf "blackdetect=d=0.4:pix_th=0.04" -an -f null - 2>&1 | grep -o "black_start:[0-9.]* black_end:[0-9.]*" || echo "  keine"
echo "Stille Stellen (> 1,5 s):"
ffmpeg -i "$V" -af "silencedetect=n=-45dB:d=1.5" -f null - 2>&1 | grep -o "silence_start: [0-9.]*" || echo "  keine"
"$(dirname "$0")/kontaktbogen.sh" "$V" 4 5 | sed 's/^/Kontaktbogen: /'
