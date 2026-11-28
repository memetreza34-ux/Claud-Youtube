#!/usr/bin/env bash
# Kontaktbogen aus einem Video: ein Bild alle N Sekunden, in Spalten nebeneinander.
#   tools/kontaktbogen.sh <video.mp4> [alle_sekunden=3] [spalten=5]
# Ergebnis: <video>-bogen.jpg daneben. Zum Ansehen mit dem Read-Werkzeug.
set -eu
V=${1:?Video fehlt}; ALLE=${2:-3}; SP=${3:-5}
DAUER=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
B=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$V")
W=${B%,*}; H=${B#*,}
# Kachelbreite: Querformat 384 px, Hochformat 216 px
if [ "$H" -gt "$W" ]; then KB=216; else KB=384; fi
N=$(python3 -c "import math; print(max(1, math.ceil($DAUER/$ALLE)))")
ZEILEN=$(python3 -c "import math; print(math.ceil($N/$SP))")
ZIEL="${V%.*}-bogen.jpg"
ffmpeg -v error -y -i "$V" -vf "fps=1/$ALLE,scale=$KB:-1,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=14:fontcolor=white:box=1:boxcolor=black@0.6,tile=${SP}x${ZEILEN}" -frames:v 1 "$ZIEL" 2>/dev/null \
  || ffmpeg -v error -y -i "$V" -vf "fps=1/$ALLE,scale=$KB:-1,tile=${SP}x${ZEILEN}" -frames:v 1 "$ZIEL"
echo "$ZIEL"
