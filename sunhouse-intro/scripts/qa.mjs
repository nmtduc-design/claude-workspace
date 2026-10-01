// Acceptance checks for the final MP4. Usage: node scripts/qa.mjs out/sunhouse_intro_15s_1080p30.mp4
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";

const file = process.argv[2] || "out/sunhouse_intro_15s_1080p30.mp4";
const SPEC = { w: 1920, h: 1080, fps: "30/1", frames: 450, dur: 15.0, maxMB: 30,
               cuts: [60, 135, 210, 405], endHoldStart: 420, lufs: [-15, -13], tpMax: -1.0 };
const results = [];
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`); };
const ff = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8", maxBuffer: 1 << 28 }).stderr;

// 1. Export size / format
const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8" }));
const v = probe.streams.find(s => s.codec_type === "video"), a = probe.streams.find(s => s.codec_type === "audio");
check("video 1920x1080", v.width === SPEC.w && v.height === SPEC.h, `${v.width}x${v.height}`);
check("video 30 fps CFR", v.r_frame_rate === SPEC.fps && v.avg_frame_rate === SPEC.fps, `r=${v.r_frame_rate} avg=${v.avg_frame_rate}`);
check("frame count = 450", Number(v.nb_read_frames) === SPEC.frames, `${v.nb_read_frames}`);
check("h264 / yuv420p", v.codec_name === "h264" && v.pix_fmt === "yuv420p", `${v.codec_name}/${v.pix_fmt}`);
check("container duration 15.000 s ±1 frame", Math.abs(Number(probe.format.duration) - SPEC.dur) <= 1 / 30, `${probe.format.duration}`);
const mb = fs.statSync(file).size / 1e6;
check(`file size ≤ ${SPEC.maxMB} MB`, mb <= SPEC.maxMB, `${mb.toFixed(2)} MB`);

// 2. Audio duration + loudness
check("audio stream present (AAC 48 kHz)", !!a && a.codec_name === "aac" && a.sample_rate === "48000", a ? `${a.codec_name} ${a.sample_rate}` : "none");
if (a) {
  check("audio duration 15.000 s ±0.05", Math.abs(Number(a.duration) - SPEC.dur) <= 0.05, `${a.duration}`);
  const eb = ff(["-i", file, "-map", "0:a", "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const I = Number((eb.match(/I:\s+(-?[\d.]+|-inf) LUFS/g) || []).pop()?.match(/(-?[\d.]+|-inf)/)[0]);
  const tp = Number((eb.match(/Peak:\s+(-?[\d.]+|-inf) dBFS/g) || []).pop()?.match(/(-?[\d.]+|-inf)/)[0]);
  if (!Number.isFinite(I)) check("loudness (silent track)", process.env.ALLOW_SILENT === "1", "track is silent");
  else {
    check(`integrated loudness ${SPEC.lufs.join("..")} LUFS`, I >= SPEC.lufs[0] && I <= SPEC.lufs[1], `${I} LUFS`);
    check(`true peak ≤ ${SPEC.tpMax} dBTP`, tp <= SPEC.tpMax, `${tp} dBTP`);
  }
}

// 3. Blank frames: luma range < 12 (flat field) or black/white
const sst = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vf", "signalstats,metadata=print:file=-", "-an", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 });
const frames = sst.split(/frame:/).slice(1).map(b => ({ n: Number(b.match(/^(\d+)/)[1]),
  min: Number(b.match(/YMIN=(\d+)/)[1]), max: Number(b.match(/YMAX=(\d+)/)[1]) }));
const blank = frames.filter(f => f.max - f.min < 12);
check("no blank frames", blank.length === 0 && frames.length === SPEC.frames, blank.length ? `blank: ${blank.map(f => f.n).slice(0, 20)}` : `${frames.length} frames inspected`);

// 4. Frame consistency: hard cuts only on planned frames; no unplanned freezes > 1 s
const sc = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vf", "select='gt(scene,0.30)',metadata=print:file=-", "-an", "-f", "null", "-"], { encoding: "utf8" });
const cutFrames = [...sc.matchAll(/frame:\d+\s+pts:(\d+)/g)].map(m => Math.round(Number(m[1]) / (Number(v.time_base.split("/")[1]) / 30)));
const unplanned = cutFrames.filter(c => !SPEC.cuts.some(p => Math.abs(p - c) <= 1));
check("scene changes only at planned cuts", unplanned.length === 0, `detected ${JSON.stringify(cutFrames)}; planned ${JSON.stringify(SPEC.cuts)}`);
const fz = ff(["-i", file, "-vf", "freezedetect=n=-60dB:d=1", "-an", "-f", "null", "-"]);
const freezes = [...fz.matchAll(/freeze_start: ([\d.]+)/g)].map(m => Number(m[1]));
const badFreeze = freezes.filter(t => Math.round(t * 30) < SPEC.endHoldStart - 1);
check("no unplanned static stretch > 1 s", badFreeze.length === 0, `freeze starts (s): ${JSON.stringify(freezes)}`);
const ps = ff(["-i", file, "-framerate", "30", "-i", "out/frames/f_%04d.png", "-lavfi", "[0:v]format=yuv420p[a];[1:v]format=yuv420p[b];[a][b]psnr", "-f", "null", "-"]);
const psnr = Number((ps.match(/average:([\d.]+|inf)/) || [])[1]);
check("encode matches rendered frames (PSNR ≥ 38 dB)", psnr >= 38 || ps.includes("average:inf"), `${psnr} dB`);

// 5. Text overflow + facts (from the render pass)
const lr = JSON.parse(fs.readFileSync("out/layout_report.json", "utf8"));
check("render covered all 450 frames at scale 1", lr.frames === 450 && lr.scale === 1 && lr.step === 1, `frames=${lr.frames} scale=${lr.scale} step=${lr.step}`);
check("no text overflow / title-safe violations", lr.layoutIssues.length === 0, `${lr.layoutIssues.length} issue(s)`);
check("every on-screen fact verified", lr.missingFacts.length === 0, lr.missingFacts.join(", ") || "all verified");

fs.writeFileSync("out/qa_report.json", JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed → out/qa_report.json`);
process.exit(failed ? 1 : 0);
