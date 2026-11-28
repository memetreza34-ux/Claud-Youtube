#!/usr/bin/env bash
# Eine einzelne Szene (Zeitbereich) einer Komposition schnell rendern und als Kontaktbogen ansehen.
#   tools/szene.sh <Komposition> <von_s> <bis_s> [scale=0.5]
# Ergebnis: /Volumes/T7/strichermittler-tmp/szenen/<Komposition>-<von>-<bis>.mp4, …-bogen.jpg (Standbilder)
#           und …-bewegung.jpg (Bewegung, 10 Bilder/s) plus Bewegungsbericht
# Gedacht für die Schleife „bauen → ansehen → besser machen“ pro Szene (planung/regie-system.md).
set -eu
K=${1:?Komposition fehlt}; VON=${2:?von fehlt}; BIS=${3:?bis fehlt}; SCALE=${4:-0.5}
REPO=$(cd "$(dirname "$0")/.." && pwd -P)
OUT=/Volumes/T7/strichermittler-tmp/szenen
mkdir -p "$OUT"
NAME="$K-$VON-$BIS"
F1=$(python3 -c "print(round($VON*30))"); F2=$(python3 -c "print(round($BIS*30)-1)")
cd "$REPO/animationen"
npx remotion render "$K" "$OUT/$NAME.mp4" --frames="$F1-$F2" --scale="$SCALE" --concurrency=3 --timeout=300000 --log=error
"$REPO/tools/kontaktbogen.sh" "$OUT/$NAME.mp4" 0.5 6 >/dev/null
echo "Video:        $OUT/$NAME.mp4"
echo "Kontaktbogen: $OUT/$NAME-bogen.jpg"
# Bewegungsprüfung: 10 Bilder je Sekunde + Kurve, Bericht über Stillstand, harte Starts, Sprünge, Ruckeln
python3 "$REPO/tools/bewegung.py" "$OUT/$NAME.mp4" --offset "$VON"
