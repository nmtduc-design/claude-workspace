// Opens the composition in headless Chromium at 1920x1080 * scale, injects facts, waits for fonts.
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FACTS = JSON.parse(readFileSync(path.join(ROOT, 'facts/sunhouse_facts.json'), 'utf8')).facts;

export async function openComposition(scale = 1) {
  // CHROMIUM_PATH lets you point at a system Chromium if Playwright's bundled one is absent.
  const executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(executablePath && existsSync(executablePath) ? { executablePath } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  await page.addInitScript(f => { window.__FACTS = f; }, FACTS);
  await page.goto(pathToFileURL(path.join(ROOT, 'src/index.html')).href);
  await page.evaluate(() => window.__init());
  const meta = await page.evaluate(() => window.__meta);
  return { browser, page, meta };
}
