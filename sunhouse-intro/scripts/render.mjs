// Deterministic frame renderer: loads src/scene.html in headless Chromium,
// seeks to each frame number (pure function of f) and writes PNGs.
//
//   node scripts/render.mjs --frames 0,225,449 --out out/stills
//   node scripts/render.mjs --all --scale 0.5 --step 2 --out out/preview_frames
//   node scripts/render.mjs --all --out out/frames --strict-facts
//   node scripts/render.mjs --all --check-only            (layout QA, no PNGs)
//
// Facts file: $FACTS_PATH (default facts/facts.template.json).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOTAL = 450;

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i < 0 ? def : args[i + 1]; };
const flag = name => args.includes(name);

const scale = Number(opt("--scale", "1"));
const step = Number(opt("--step", "1"));
const outDir = path.resolve(ROOT, opt("--out", "out/frames"));
const checkOnly = flag("--check-only");
const strict = flag("--strict-facts");
const factsPath = path.resolve(ROOT, process.env.FACTS_PATH || "facts/facts.template.json");

let frames;
if (flag("--all")) frames = Array.from({ length: Math.ceil(TOTAL / step) }, (_, i) => i * step);
else frames = opt("--frames", "0").split(",").map(Number);
if (frames.some(f => !Number.isInteger(f) || f < 0 || f >= TOTAL)) throw new Error(`frames must be integers in [0, ${TOTAL - 1}]`);

const facts = JSON.parse(fs.readFileSync(factsPath, "utf8"));
console.log(`facts: ${path.relative(ROOT, factsPath)}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
await page.goto(pathToFileURL(path.join(ROOT, "src/scene.html")).href);
await page.evaluate(f => window.__init(f), facts);
await page.evaluate(() => Promise.all(["400", "600", "800"].map(w => document.fonts.load(`${w} 40px BVP`, "Tập đoàn ABC 123"))));
await page.evaluate(() => document.fonts.ready);
const fontsOk = await page.evaluate(() => ["400", "600", "800"].every(w => document.fonts.check(`${w} 40px BVP`, "Tập đoàn")));
if (!fontsOk) { console.error("FAIL: Be Vietnam Pro not loaded (run npm install)"); process.exit(2); }

const missing = await page.evaluate(() => [...window.__missing]);
if (missing.length) {
  console.warn(`WARN: ${missing.length} unverified facts rendered as magenta placeholders: ${missing.join(", ")}`);
  if (strict) { console.error("FAIL: --strict-facts set; fill and verify every fact first."); await browser.close(); process.exit(3); }
}

if (!checkOnly) fs.mkdirSync(outDir, { recursive: true });
const layoutIssues = [];
for (const f of frames) {
  await page.evaluate(n => window.__seek(n), f);
  layoutIssues.push(...await page.evaluate(n => window.__checkLayout(n), f));
  if (!checkOnly) {
    // numbered sequentially so ffmpeg sees a gapless sequence even with --step
    const idx = String(frames.indexOf(f)).padStart(4, "0");
    const name = flag("--all") ? `f_${idx}.png` : `frame_${String(f).padStart(3, "0")}.png`;
    await page.locator("#stage").screenshot({ path: path.join(outDir, name) });
  }
}
await browser.close();

const report = { factsPath, missingFacts: missing, frames: frames.length, scale, step, layoutIssues };
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "out/layout_report.json"), JSON.stringify(report, null, 2));
const uniq = [...new Map(layoutIssues.map(i => [`${i.id}:${i.issue}`, i])).values()];
console.log(`rendered ${checkOnly ? 0 : frames.length} frame(s) → ${path.relative(ROOT, outDir)}`);
console.log(`layout issues: ${layoutIssues.length} (${uniq.length} unique) → out/layout_report.json`);
for (const i of uniq) console.log("  ", JSON.stringify(i));
if (strict && layoutIssues.length) process.exit(4);
