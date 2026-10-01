#!/usr/bin/env bash
# Final master: 1920x1080, 30 fps CFR, 450 frames, H.264 High yuv420p + AAC 48 kHz stereo, faststart.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=out/sunhouse_15s_1080p30.mp4; [ "${ALLOW_SCRATCH_VO:-0}" = 1 ] && OUT=out/sunhouse_15s_1080p30_SCRATCHVO.mp4
rm -rf out/frames
node scripts/render.mjs --scale 1 --out out/frames
bash scripts/music.sh
# Delivery VO must be in vo/final/vo1.wav ... vo5.wav. ALLOW_SCRATCH_VO=1 renders with the robotic guide voice (QA/test only).
if [ "${ALLOW_SCRATCH_VO:-0}" = 1 ]; then python3 scripts/scratch_vo.py vo/vo_script.json out/audio/scratch >/dev/null; python3 scripts/mix.py; else python3 scripts/mix.py --require-final; fi
ffmpeg -hide_banner -loglevel error -y -framerate 30 -i out/frames/f%05d.png -i out/audio/mix.wav \
  -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -r 30 -g 30 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -t 15 -movflags +faststart \
  "$OUT"
echo "-> $OUT"
