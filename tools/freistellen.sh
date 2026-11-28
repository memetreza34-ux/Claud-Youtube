#!/usr/bin/env bash
# Freistellen (macOS Vision): Objekt/Motiv aus einem Foto ausschneiden, Hintergrund transparent.
#   tools/freistellen.sh <bild> <ziel.png> [--zuschneiden]
# Das Swift-Programm wird beim ersten Aufruf auf die SSD übersetzt (/Volumes/T7/strichermittler-tmp/bin).
set -eu
HIER=$(cd "$(dirname "$0")" && pwd -P)
BIN=/Volumes/T7/strichermittler-tmp/bin/freistellen
mkdir -p "$(dirname "$BIN")"
if [ ! -x "$BIN" ] || [ "$HIER/freistellen.swift" -nt "$BIN" ]; then
  swiftc -O "$HIER/freistellen.swift" -o "$BIN" -module-cache-path /Volumes/T7/strichermittler-tmp/bin/cache
fi
"$BIN" "$@"
