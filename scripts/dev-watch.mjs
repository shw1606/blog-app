// Watches the content source directory and triggers Next dev refresh
// when files change. lib/content-dir.ts is touched so Turbopack sees a
// dependency mtime change, recompiles, and refreshes the browser.
// For images, sync-content-assets is invoked to copy into public/.
import chokidar from "chokidar";
import { existsSync } from "node:fs";
import { utimes } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const STANDALONE = path.resolve(ROOT, "..", "blog-content");
const SUBMODULE = path.join(ROOT, "content");
const CONTENT_DIR = existsSync(STANDALONE) ? STANDALONE : SUBMODULE;
const TRIGGER_FILE = path.join(ROOT, "lib", "content-dir.ts");

const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);

function runSync() {
  return new Promise((resolve) => {
    const proc = spawn("node", ["scripts/sync-content-assets.mjs"], {
      stdio: "inherit",
      cwd: ROOT,
    });
    proc.on("exit", resolve);
  });
}

async function trigger() {
  const now = new Date();
  try {
    await utimes(TRIGGER_FILE, now, now);
  } catch (e) {
    console.error(`[dev-watch] touch failed: ${e.message}`);
  }
}

const watcher = chokidar.watch(CONTENT_DIR, {
  ignored: (file) =>
    /(\/|^)(\.git|\.obsidian|node_modules|drafts)(\/|$)/.test(file),
  ignoreInitial: true,
  persistent: true,
});

watcher.on("all", async (event, file) => {
  if (event === "addDir" || event === "unlinkDir") return;
  const rel = path.relative(CONTENT_DIR, file);
  console.log(`[dev-watch] ${event}: ${rel}`);

  if (IMAGE_EXTS.has(path.extname(file).toLowerCase())) {
    await runSync();
  }
  await trigger();
});

console.log(`[dev-watch] watching ${CONTENT_DIR}`);
