"""Scratch (guide) VO with espeak-ng — robotic, for TIMING ONLY, never for delivery.
Usage: python3 scripts/scratch_vo.py vo/vo_script.json out/audio/scratch
Requires: pip install espeakng-loader
"""
import ctypes, json, os, sys, wave, array
import espeakng_loader as E

script, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
lib = ctypes.cdll.LoadLibrary(E.get_library_path())
SYNTH_CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)
buf = array.array('h')
@SYNTH_CB
def cb(wav, n, events):
    if wav and n > 0: buf.extend(wav[:n])
    return 0
sr = lib.espeak_Initialize(0x02, 0, E.get_data_path().encode(), 0)   # AUDIO_OUTPUT_SYNCHRONOUS
lib.espeak_SetSynthCallback(cb)
lib.espeak_SetVoiceByName(b"vi")
lib.espeak_SetParameter(1, 165, 0)  # espeakRATE (wpm)
for cue in json.load(open(script))["cues"]:
    del buf[:]
    t = cue["text"].encode("utf-8")
    lib.espeak_Synth(t, len(t) + 1, 0, 0, 0, 0x01, None, None)  # espeakCHARS_UTF8
    lib.espeak_Synchronize()
    with wave.open(os.path.join(outdir, cue["id"] + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(buf.tobytes())
    print(f'{cue["id"]}: {len(buf)/sr:.2f}s spoken, window {cue["end"]-cue["start"]:.2f}s')
