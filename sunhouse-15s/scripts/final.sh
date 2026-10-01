#!/usr/bin/env bash
# Final master: 1920x1080, 30 fps CFR, 450 frames, H.264 High yuv420p + AAC 48 kHz stereo, faststart.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf out/frames
node scripts/render.mjs --scale 1 --out out/frames
bash scripts/music.sh
ffmpeg -hide_banner -loglevel error -y -framerate 30 -i out/frames/f%05d.png -i out/audio/music.wav \
  -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -r 30 -g 30 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -t 15 -movflags +faststart \
  out/sunhouse_15s_1080p30.mp4
echo "-> out/sunhouse_15s_1080p30.mp4"
