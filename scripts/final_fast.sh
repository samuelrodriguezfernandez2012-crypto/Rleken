#!/bin/bash
# Como final.sh pero renderiza a 3/4 de resolucion y reescala a 1080x1920 (aprox. 2x mas rapido)
set -e
B=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
mkdir -p out/$1
npx remotion render $2 /tmp/$1_raw.mp4 --browser-executable=$B --concurrency=4 --gl=swangle --scale=0.75 > /tmp/$1_render.log 2>&1
ffmpeg -loglevel error -y -i /tmp/$1_raw.mp4 -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.6" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -color_range tv -movflags +faststart -c:a copy out/$1/chiki_$1_short.mp4
npx remotion still $3 out/$1/miniatura.png --browser-executable=$B --gl=swangle > /tmp/$1_thumb.log 2>&1
rm -f /tmp/$1_raw.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/$1/chiki_$1_short.mp4
