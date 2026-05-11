// Copies media files from content/ (submodule) into public/ so Next.js
// can serve them as static assets. Runs before `next dev` and `next build`.
// Mirrors directory structure: content/foo/bar.jpg → public/foo/bar.jpg.
import { readdir, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "content");
const DST_DIR = path.join(ROOT, "public");

const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);

const SKIP_DIRS = new Set(["drafts", "docs"]);

async function walk(dir, rel = "") {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const srcPath = path.join(dir, entry.name);
    const relPath = rel ? path.join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(srcPath, relPath);
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      const dstPath = path.join(DST_DIR, relPath);
      await mkdir(path.dirname(dstPath), { recursive: true });
      await copyFile(srcPath, dstPath);
      console.log(`[sync] content/${relPath} → public/${relPath}`);
    }
  }
}

if (!existsSync(SRC_DIR)) {
  console.warn(`[sync] ${SRC_DIR} not found; submodule may not be initialized`);
  process.exit(0);
}

await walk(SRC_DIR);
