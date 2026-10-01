"""Builds out/audio/mix.wav (15.000 s, 48 kHz stereo): music bed ducked under VO cues placed per vo/vo_script.json.
VO source: vo/final/<cue>.wav (delivery voice) if all present, else out/audio/scratch/<cue>.wav (guide only).
Usage: python3 scripts/mix.py [--require-final]
Fails if any cue's trimmed speech overruns its window.
"""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
cues = json.load(open("vo/vo_script.json"))["cues"]
final = all(os.path.exists(f"vo/final/{c['id']}.wav") for c in cues)
if not final and "--require-final" in sys.argv:
    sys.exit("FAIL: vo/final/<cue>.wav missing — final export needs the delivery voice, not the scratch guide.")
src = "vo/final" if final else "out/audio/scratch"
print(f"VO source: {src}{'' if final else '  (SCRATCH GUIDE — not for delivery)'}")
os.makedirs("out/audio/vo_trim", exist_ok=True)

trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse"
bad = 0
for c in cues:
    out = f"out/audio/vo_trim/{c['id']}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{src}/{c['id']}.wav", "-af", f"{trim},aresample=48000", "-ac", "1", out], check=True)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]))
    win = c["end"] - c["start"]
    ok = d <= win
    bad += not ok
    print(f"  {'PASS' if ok else 'FAIL'} {c['id']} {c['start']:.2f}-{c['start']+d:.2f}s (speech {d:.2f}s / window {win:.2f}s)")
if bad: sys.exit(f"FAIL: {bad} VO cue(s) overrun their window — re-record faster or shorten the line.")

inputs = ["-i", "out/audio/music.wav"]
for c in cues: inputs += ["-i", f"out/audio/vo_trim/{c['id']}.wav"]
n = len(cues)
delays = ";".join(f"[{i+1}]adelay={int(c['start']*1000)}:all=1,apad[v{i}]" for i, c in enumerate(cues))
fc = (f"{delays};{''.join(f'[v{i}]' for i in range(n))}amix=inputs={n}:normalize=0:duration=first,atrim=0:15,pan=stereo|c0=c0|c1=c0,asplit[vo][key];"
      "[0]volume=-3dB[m];[m][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[duck];"
      "[duck][vo]amix=inputs=2:normalize=0:weights=1 1.6,"
      "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,atrim=end_sample=720000,apad=whole_len=720000[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[out]", "-ac", "2", "-c:a", "pcm_s24le", "out/audio/mix.wav"], check=True)
print("-> out/audio/mix.wav", subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "out/audio/mix.wav"]).decode().strip(), "s")
