#!/usr/bin/env bash
# Tiefenkarte für die 2,5D-Kamerafahrt:  tools/tiefe.sh <bild> [ziel.png]
set -eu
HF_HOME=/Volumes/T7/strichermittler-modelle HF_HUB_OFFLINE=1 \
  /Volumes/T7/strichermittler-modelle/venv-bild/bin/python "$(cd "$(dirname "$0")" && pwd -P)/tiefe.py" "$@"
