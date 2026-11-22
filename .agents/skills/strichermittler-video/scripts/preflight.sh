#!/usr/bin/env bash
set -eu

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd -P)
ssd_dir=/Volumes/T7
model_dir="$ssd_dir/strichermittler-modelle"
tts_dir="$project_dir/tools/tts-qwen-mac"
missing=0

report_missing() {
    printf 'Fehlt: %s\n' "$1" >&2
    missing=1
}

require_file() {
    test -s "$1" || report_missing "$1"
}

require_executable() {
    test -x "$1" || report_missing "$1"
}

for executable in node npm python3 ffmpeg ffprobe whisper; do
    command -v "$executable" >/dev/null 2>&1 || report_missing "$executable im PATH"
done

for directory in "$ssd_dir" "$ssd_dir/strichermittler-tmp" "$ssd_dir/flow-mcp-out"; do
    if ! test -d "$directory" || ! test -w "$directory"; then
        report_missing "beschreibbarer Ordner $directory"
    fi
done

require_file "$project_dir/PRODUKTION.md"
require_file "$project_dir/figur/master.jpg"
require_file "$project_dir/animationen/public/figur/intro-noir.jpg"
require_file "$tts_dir/vorlage.wav"
require_file "$tts_dir/vorlage-text.txt"
require_executable "$tts_dir/.venv-mlx/bin/python"
require_executable "$project_dir/tools/screenshots/.venv/bin/python"
require_executable "$project_dir/animationen/node_modules/.bin/remotion"

qwen_cache="$model_dir/hub/models--mlx-community--Qwen3-TTS-12Hz-1.7B-Base-8bit"
if test -s "$qwen_cache/refs/main"; then
    revision=$(cat "$qwen_cache/refs/main")
    require_file "$qwen_cache/snapshots/$revision/config.json"
else
    report_missing "Qwen3-TTS 1.7B 8-bit unter $model_dir"
fi

whisper_cache="${XDG_CACHE_HOME:-$HOME/.cache}/whisper"
if ! test -s "$model_dir/whisper/small.pt" && ! test -s "$whisper_cache/small.pt"; then
    report_missing "Whisper small unter $model_dir/whisper oder $whisper_cache"
fi

if (( missing )); then
    exit 1
fi

printf 'Lokale Produktionsdateien vorhanden. Flow-Sitzung mit flow_status prüfen.\n'
