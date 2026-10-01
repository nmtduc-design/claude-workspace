// Usage: node scripts/render.mjs [--scale 1] [--out out/frames] [--frames 0,225,449 | --from 0 --to 449]
// Writes zero-padded PNGs f00000.png ... one per frame at 30 fps timeline positions.
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { openComposition, ROOT } from './page.mjs';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') && a.push([v.slice(2), arr[i + 1]]), a), []));
const scale = +(args.scale ?? 1);
const out = path.resolve(ROOT, args.out ?? 'out/frames');
mkdirSync(out, { recursive: true });

const { browser, page, meta } = await openComposition(scale);
const frames = args.frames
  ? args.frames.split(',').map(Number)
  : Array.from({ length: (+(args.to ?? meta.FRAMES - 1)) - (+(args.from ?? 0)) + 1 }, (_, i) => i + +(args.from ?? 0));

const t0 = Date.now();
for (const f of frames) {
  if (f < 0 || f >= meta.FRAMES) throw new Error(`frame ${f} outside 0..${meta.FRAMES - 1}`);
  await page.evaluate(n => window.__seek(n), f);
  await page.screenshot({ path: path.join(out, `f${String(f).padStart(5, '0')}.png`), animations: 'disabled' });
}
console.log(`rendered ${frames.length} frame(s) @${1920 * scale}x${1080 * scale} -> ${path.relative(ROOT, out)} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
await browser.close();
