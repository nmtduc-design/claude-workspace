#!/usr/bin/env bash
# Low-res preview: 960x540, all 450 frames, 30 fps, fast x264 + music. ~30-60 s on a laptop.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf out/preview_frames
node scripts/render.mjs --scale 0.5 --out out/preview_frames
bash scripts/music.sh
ffmpeg -hide_banner -loglevel error -y -framerate 30 -i out/preview_frames/f%05d.png -i out/audio/music.wav \
  -c:v libx264 -preset ultrafast -crf 30 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -shortest \
  out/sunhouse_15s_preview_540p30.mp4
echo "-> out/sunhouse_15s_preview_540p30.mp4"
