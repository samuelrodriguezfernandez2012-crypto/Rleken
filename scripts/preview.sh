#!/bin/bash
# Uso: scripts/preview.sh <Composicion> <salida.png> <segundo> [segundo...]
# Renderiza un video a baja resolucion y monta una hoja de contacto con esos instantes.
set -e
B=${CHROME:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}
COMP=$1; OUT=$2; shift 2
TMP=$(mktemp -d)
npx remotion render $COMP $TMP/p.mp4 --scale=0.4 --browser-executable=$B --concurrency=4 > $TMP/log 2>&1 || { tail -40 $TMP/log; exit 1; }
i=0; for s in "$@"; do ffmpeg -loglevel error -y -ss $s -i $TMP/p.mp4 -frames:v 1 $TMP/f_$(printf %03d $i).png; i=$((i+1)); done
ffmpeg -loglevel error -y -pattern_type glob -i "$TMP/f_*.png" -vf "scale=216:384,tile=9x$(( (i+8)/9 ))" -frames:v 1 $OUT
rm -rf $TMP
