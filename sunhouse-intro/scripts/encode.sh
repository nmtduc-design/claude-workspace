#!/usr/bin/env bash
# Usage: bash scripts/encode.sh preview|final
# Audio inputs (optional, see PLAN.md §3):
#   assets/audio/music.wav  – licensed music bed (≥ 15 s)
#   assets/audio/vo.wav     – Vietnamese narration, starts at 0.50 s
# Final mode refuses to run without music.wav unless ALLOW_SILENT=1.
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:?preview|final}"
DUR=15
MUSIC=assets/audio/music.wav
VO=assets/audio/vo.wav
mkdir -p out

# ---- 1. audio mix → out/mix.wav (48 kHz stereo, exactly 15.000 s) ----
if [[ -f "$MUSIC" ]]; then
  if [[ -f "$VO" ]]; then
    ffmpeg -v error -y -i "$MUSIC" -i "$VO" -filter_complex "\
      [0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${DUR},asetpts=PTS-STARTPTS,afade=t=in:d=0.1,afade=t=out:st=14:d=1[m];\
      [1:a]aresample=48000,aformat=channel_layouts=stereo,adelay=500|500,asplit=2[v][vk];\
      [m][vk]sidechaincompress=threshold=0.05:ratio=6:attack=20:release=300[md];\
      [md][v]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000,apad,atrim=0:${DUR}[a]" \
      -map "[a]" -c:a pcm_s16le out/mix.wav
  else
    ffmpeg -v error -y -i "$MUSIC" -filter_complex "\
      [0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${DUR},asetpts=PTS-STARTPTS,afade=t=in:d=0.1,afade=t=out:st=14:d=1,\
      loudnorm=I=-14:TP=-1:LRA=11,aresample=48000,apad,atrim=0:${DUR}[a]" -map "[a]" -c:a pcm_s16le out/mix.wav
  fi
else
  if [[ "$MODE" == final && "${ALLOW_SILENT:-0}" != 1 ]]; then
    echo "FAIL: $MUSIC missing. Provide licensed music or set ALLOW_SILENT=1." >&2; exit 5
  fi
  echo "WARN: no music provided – using a silent 15.000 s track" >&2
  ffmpeg -v error -y -f lavfi -i "anullsrc=r=48000:cl=stereo" -t ${DUR} -c:a pcm_s16le out/mix.wav
fi

# ---- 2. video encode ----
if [[ "$MODE" == preview ]]; then
  # 15 rendered fps at 960x540, frame-doubled to a 30 fps container
  ffmpeg -v error -y -framerate 15 -i out/preview_frames/f_%04d.png -i out/mix.wav \
    -vf "fps=30,format=yuv420p" -c:v libx264 -preset veryfast -crf 28 \
    -c:a aac -b:a 128k -ar 48000 -t ${DUR} -movflags +faststart out/preview_960x540.mp4
  echo "→ out/preview_960x540.mp4"
else
  ffmpeg -v error -y -framerate 30 -i out/frames/f_%04d.png -i out/mix.wav \
    -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -r 30 -g 30 \
    -c:a aac -b:a 192k -ar 48000 -t ${DUR} -movflags +faststart out/sunhouse_intro_15s_1080p30.mp4
  echo "→ out/sunhouse_intro_15s_1080p30.mp4"
fi
