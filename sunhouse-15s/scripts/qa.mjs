// DOM-level acceptance checks over all 450 frames (no screenshots except a determinism pair).
// Usage: node scripts/qa.mjs dom      -> exit 1 on any failure
import { openComposition, FACTS } from './page.mjs';

const SAFE = { x0: 96, y0: 54, x1: 1824, y1: 1026 };   // 5% title-safe on 1920x1080
const { browser, page, meta } = await openComposition(1);
const fails = [];
const grouped = new Map();   // message -> [firstFrame, lastFrame, count]
const fail = (f, msg) => { const g = grouped.get(msg); g ? (g[1] = f, g[2]++) : grouped.set(msg, [f, f, 1]); };

const fontsOk = await page.evaluate(() =>
  [...document.fonts].every(ff => ff.status === 'loaded' || ff.status === 'unloaded') &&
  ['400', '600', '800'].every(w => document.fonts.check(`${w} 40px "Be Vietnam Pro"`, 'ẬỐẨỆđ')));
if (!fontsOk) fails.push('fonts: Be Vietnam Pro (Vietnamese subset) not loaded');

for (let f = 0; f < meta.FRAMES; f++) {
  const r = await page.evaluate(n => {
    window.__seek(n);
    const vis = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < 0.01) return 0; } let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
    const scenes = [...document.querySelectorAll('.scene')].filter(s => getComputedStyle(s).visibility === 'visible').map(s => s.id);
    const wb = document.getElementById('wipe').getBoundingClientRect();
    const wipe = getComputedStyle(document.getElementById('wipe')).visibility === 'visible' ? (wb.left + wb.right) / 2 : null;
    const texts = [...document.querySelectorAll('.txt')].map(el => {
      const o = vis(el); if (!o) return null;
      const rg = document.createRange(); rg.selectNodeContents(el); const b = rg.getBoundingClientRect();
      return { fact: el.dataset.fact, text: el.textContent, o, counting: el.hasAttribute('data-count'),
               sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight,
               x0: b.left, y0: b.top, x1: b.right, y1: b.bottom };
    }).filter(Boolean);
    return { scenes, wipe, texts };
  }, f);

  const inWipe = meta.CUTS.some(c => Math.abs(f / meta.FPS - c) <= 0.2 + 1e-6);
  if (!(r.scenes.length === 1 || (inWipe && r.scenes.length === 2))) fail(f, `expected 1 visible scene (2 inside a wipe), got [${r.scenes}]`);
  for (const t of r.texts) {
    if (!t.fact) fail(f, `unbound text "${t.text}"`);
    else if (t.fact === 'none') { if (!/^\d{2}$/.test(t.text)) fail(f, `decorative text must be an index numeral, got "${t.text}"`); }
    else if (!FACTS[t.fact]) fail(f, `unknown fact id ${t.fact}`);
    else if (t.o > 0.99 && !(t.counting && t.text !== FACTS[t.fact].display && f < 210) && t.text !== FACTS[t.fact].display)
      fail(f, `text "${t.text}" != fact ${t.fact} "${FACTS[t.fact].display}"`);
    if (t.sw > t.cw + 1 || (t.ch && t.sh > t.ch + 1)) fail(f, `overflow [${t.fact}] "${t.text}" ${t.sw}x${t.sh} > box ${t.cw}x${t.ch}`);
    if (t.o > 0.5 && (t.x0 < SAFE.x0 || t.y0 < SAFE.y0 || t.x1 > SAFE.x1 || t.y1 > SAFE.y1))
      fail(f, `outside title-safe [${t.fact}] "${t.text}" @ ${t.x0.toFixed(0)},${t.y0.toFixed(0)}-${t.x1.toFixed(0)},${t.y1.toFixed(0)}`);
  }
  for (const c of meta.CUTS) if (f === Math.round(c * meta.FPS) && (r.wipe === null || Math.abs(r.wipe - 960) > 2)) fail(f, `wipe bar not at centre on cut ${c}s (x=${r.wipe})`);
}
// Counters must have landed on the exact fact value by 7.0 s (frame 210) and hold to the cut.
for (const f of [210, 269]) {
  const nums = await page.evaluate(n => { window.__seek(n); return [...document.querySelectorAll('[data-count]')].map(e => [e.dataset.fact, e.textContent]); }, f);
  for (const [id, txt] of nums) if (txt !== FACTS[id].display) fail(f, `counter ${id} shows "${txt}", fact is "${FACTS[id].display}"`);
}
// Determinism: same frame rendered twice must be byte-identical.
await page.evaluate(() => window.__seek(225)); const a = await page.screenshot();
await page.evaluate(() => window.__seek(0));   await page.evaluate(() => window.__seek(225)); const b = await page.screenshot();
if (!a.equals(b)) fails.push('determinism: frame 225 differs between two renders');

await browser.close();
for (const [m, [a, b, n]] of grouped) fails.push(`f${a}${b !== a ? '-f' + b : ''} (${n}x): ${m}`);
console.log(`DOM QA: ${meta.FRAMES} frames checked, ${fails.length} failure(s)`);
fails.slice(0, 60).forEach(x => console.log('  FAIL ' + x));
process.exit(fails.length ? 1 : 0);
