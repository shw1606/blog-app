// Quick visual inspection helper. Usage:
//   node scripts/screenshot.mjs [path] [outFile]
// Defaults to /about and /tmp/screenshot.png.
import { chromium } from "playwright";

const path = process.argv[2] || "/about";
const out = process.argv[3] || "/tmp/screenshot.png";
const url = `http://localhost:3000${path}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1024, height: 900 } });
const page = await ctx.newPage();

await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: out, fullPage: true });

await browser.close();
console.log(`saved ${url} → ${out}`);
