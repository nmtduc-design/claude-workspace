#!/usr/bin/env bash
# Stacks the first / middle / last stills (f0, f225, f449) side by side for review.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -hide_banner -loglevel error -y -i out/stills/f00000.png -i out/stills/f00225.png -i out/stills/f00449.png \
  -filter_complex "[0]scale=960:-1,pad=980:560:10:10:white[a];[1]scale=960:-1,pad=980:560:10:10:white[b];[2]scale=960:-1,pad=980:560:10:10:white[c];[a][b][c]hstack=3" \
  out/stills/contact_first_mid_last.png
echo "-> out/stills/contact_first_mid_last.png"
