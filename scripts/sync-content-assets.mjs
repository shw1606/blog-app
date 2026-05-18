// Copies media files from the content source into public/ so Next.js
// can serve them as static assets. Runs before `next dev` and `next build`.
// Mirrors directory structure: <src>/foo/bar.jpg → public/foo/bar.jpg.
//
// Content source resolution (matches lib/content-dir.ts):
//   - if ../blog-content exists (local dev with sibling clone), use it
//   - otherwise fall back to ./content (the submodule, used on Vercel)
//
// Draft assets: with DRAFT_PREVIEW=1 (set only by `pnpm dev`, never by
// `pnpm build`) the drafts/ tree is mirrored into the SAME url-space the
// rendered draft page expects — a draft at drafts/foo.md is viewed at
// /posts/foo, so its relative `images/x` resolves to /posts/images/x.
// So drafts/* is copied to public/posts/* (dev preview only).
import { readdir, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STANDALONE = path.resolve(ROOT, "..", "blog-content");
const SUBMODULE = path.join(ROOT, "content");
const SRC_DIR = existsSync(STANDALONE) ? STANDALONE : SUBMODULE;
const DST_DIR = path.join(ROOT, "public");
const DRAFT_PREVIEW = !!process.env.DRAFT_PREVIEW;

const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);

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
      if (entry.name === "docs") continue;
      if (entry.name === "drafts") {
        // Dev preview only: remap drafts/* → posts/* (see header note).
        if (DRAFT_PREVIEW) await walk(srcPath, "posts");
        continue;
      }
      await walk(srcPath, relPath);
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      const dstPath = path.join(DST_DIR, relPath);
      await mkdir(path.dirname(dstPath), { recursive: true });
      await copyFile(srcPath, dstPath);
      console.log(
        `[sync] ${path.relative(SRC_DIR, srcPath)} → public/${relPath}`,
      );
    }
  }
}

if (!existsSync(SRC_DIR)) {
  console.warn(`[sync] ${SRC_DIR} not found; nothing to sync`);
  process.exit(0);
}

await walk(SRC_DIR);
