#!/bin/bash
# Uso: scripts/final.sh <video> <Composicion> <Miniatura>
# Render final 1080x1920 + miniatura en out/<video>/
set -e
B=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
mkdir -p out/$1
npx remotion render $2 /tmp/$1_raw.mp4 --browser-executable=$B --concurrency=4 > /tmp/$1_render.log 2>&1
ffmpeg -loglevel error -y -i /tmp/$1_raw.mp4 -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -color_range tv -movflags +faststart -c:a copy out/$1/chiki_$1_short.mp4
npx remotion still $3 out/$1/miniatura.png --browser-executable=$B > /tmp/$1_thumb.log 2>&1
rm -f /tmp/$1_raw.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/$1/chiki_$1_short.mp4
