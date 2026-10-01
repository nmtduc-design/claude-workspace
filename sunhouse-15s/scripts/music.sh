#!/usr/bin/env bash
# Procedural 15.000 s music bed, 120 BPM (beat = 0.5 s = 15 frames), composed in-house -> no third-party licence.
# Bars of 2 s: C major / A minor / F major / G major pad + soft kick on every beat + accent on scene cuts.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/audio
# chord root freqs per 2 s bar (C3, A2, F2, G2), repeating every 8 s
R='if(lt(mod(t,8),2),130.81,if(lt(mod(t,8),4),110.00,if(lt(mod(t,8),6),87.31,98.00)))'
# minor third for A minor bar, major third otherwise
T="if(between(mod(t,8),2,4),1.1892,1.2599)"
PAD="0.10*(sin(2*PI*$R*t)+0.7*sin(2*PI*$R*$T*t)+0.6*sin(2*PI*$R*1.4983*t)+0.25*sin(2*PI*$R*2*t))"
KICK="0.35*sin(2*PI*(48+60*exp(-mod(t,0.5)*30))*mod(t,0.5))*exp(-mod(t,0.5)*12)"
# accents on cuts 2.5 / 5.0 / 9.0 / 12.0 s (bright chime, 0.4 s decay) + final chord sting at 12.0
ACC="0"; for c in 2.5 5.0 9.0 12.0; do ACC="$ACC+0.18*gte(t,$c)*sin(2*PI*1046.5*(t-$c))*exp(-(t-$c)*8)"; done
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "aevalsrc=exprs='$PAD+$KICK+$ACC|$PAD+$KICK+$ACC':s=48000:d=15" \
  -af "afade=t=in:st=0:d=0.3,afade=t=out:st=13.5:d=1.5,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,atrim=end_sample=720000,apad=whole_len=720000" \
  -c:a pcm_s24le out/audio/music.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 out/audio/music.wav
