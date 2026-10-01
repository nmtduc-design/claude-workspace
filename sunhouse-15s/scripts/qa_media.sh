#!/usr/bin/env bash
# Media-level acceptance checks on the exported MP4.  Usage: bash scripts/qa_media.sh out/sunhouse_15s_1080p30.mp4
set -uo pipefail
cd "$(dirname "$0")/.."
F="${1:-out/sunhouse_15s_1080p30.mp4}"
FAILS=0; ok(){ echo "  PASS $*"; }; bad(){ echo "  FAIL $*"; FAILS=$((FAILS+1)); }
[ -f "$F" ] || { echo "missing $F"; exit 1; }
p(){ ffprobe -v error -select_streams "$1" -show_entries "$2" -of default=nw=1:nk=1 "$F" | head -1; }

echo "Export / size"
W=$(p v:0 stream=width); H=$(p v:0 stream=height)
[ "$W" = 1920 ] && [ "$H" = 1080 ] && ok "1920x1080" || bad "size ${W}x${H}"
[ "$(p v:0 stream=codec_name)" = h264 ] && ok "h264" || bad "codec $(p v:0 stream=codec_name)"
[ "$(p v:0 stream=pix_fmt)" = yuv420p ] && ok "yuv420p" || bad "pix_fmt $(p v:0 stream=pix_fmt)"
BYTES=$(stat -c %s "$F"); [ "$BYTES" -le 26214400 ] && ok "file size $((BYTES/1024)) KiB <= 25 MiB" || bad "file size $BYTES > 25 MiB"

echo "Frame rate / count / duration"
[ "$(p v:0 stream=r_frame_rate)" = 30/1 ] && [ "$(p v:0 stream=avg_frame_rate)" = 30/1 ] && ok "30/1 CFR" || bad "fps r=$(p v:0 stream=r_frame_rate) avg=$(p v:0 stream=avg_frame_rate)"
N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$F")
[ "$N" = 450 ] && ok "450 frames" || bad "frame count $N (want 450)"
VD=$(p v:0 stream=duration); python3 -c "import sys;sys.exit(0 if abs($VD-15.0)<=1/30 else 1)" && ok "video duration $VD" || bad "video duration $VD"

echo "Audio"
[ "$(p a:0 stream=codec_name)" = aac ] && ok "aac" || bad "audio codec '$(p a:0 stream=codec_name)'"
[ "$(p a:0 stream=sample_rate)" = 48000 ] && [ "$(p a:0 stream=channels)" = 2 ] && ok "48 kHz stereo" || bad "audio $(p a:0 stream=sample_rate) Hz / $(p a:0 stream=channels) ch"
AD=$(p a:0 stream=duration); python3 -c "import sys;sys.exit(0 if abs(${AD:-0}-15.0)<=1/30 else 1)" && ok "audio duration $AD (±1 frame)" || bad "audio duration $AD"
LOUD=$(ffmpeg -hide_banner -nostats -i "$F" -map 0:a:0 -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary)
I=$(echo "$LOUD" | awk '/I:/{print $2; exit}'); TP=$(echo "$LOUD" | awk '/Peak:/{print $2; exit}')
python3 -c "import sys;sys.exit(0 if -17.5<=$I<=-14.5 else 1)" && ok "integrated ${I} LUFS (target -16 ±1.5)" || bad "integrated ${I} LUFS"
python3 -c "import sys;sys.exit(0 if $TP<=-1.0 else 1)" && ok "true peak ${TP} dBTP <= -1.0" || bad "true peak ${TP} dBTP"

echo "Blank / frozen frames"
# a frame is 'blank' if luma range (YMAX-YMIN) < 12, i.e. a flat single-colour image
BLANK=$(ffprobe -v error -f lavfi -i "movie=$F,signalstats" -show_entries frame_tags=lavfi.signalstats.YMAX,lavfi.signalstats.YMIN -of csv=p=0 \
        | awk -F, '{ d=$1-$2; if (d<0) d=-d; if (d < 12) c++ } END { print c+0 }')
[ "$BLANK" = 0 ] && ok "no flat/blank frames" || bad "$BLANK flat/blank frame(s)"
BLACK=$(ffmpeg -hide_banner -nostats -i "$F" -vf blackdetect=d=0.03:pix_th=0.10 -an -f null - 2>&1 | grep -c black_start)
[ "$BLACK" = 0 ] && ok "no black segments" || bad "$BLACK black segment(s)"

echo "Frame consistency vs approved stills"
for f in 0 225 449; do
  S=out/stills/f$(printf %05d $f).png; [ -f "$S" ] || { bad "missing approved still $S"; continue; }
  PS=$(ffmpeg -hide_banner -nostats -i "$F" -i "$S" -filter_complex "[0:v]select=eq(n\,$f),format=rgb24[a];[1:v]format=rgb24[b];[a][b]psnr" -frames:v 1 -f null - 2>&1 | grep -o 'average:[0-9.inf]*' | cut -d: -f2)
  python3 -c "import sys;v='$PS';sys.exit(0 if v=='inf' or (v and float(v)>=38) else 1)" && ok "frame $f matches still (PSNR $PS dB)" || bad "frame $f differs from approved still (PSNR $PS dB)"
done

echo; [ $FAILS = 0 ] && { echo "MEDIA QA: all checks passed"; exit 0; } || { echo "MEDIA QA: $FAILS failure(s)"; exit 1; }
