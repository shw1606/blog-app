import { existsSync } from "node:fs";
import path from "node:path";

// In local dev the user keeps a sibling clone of blog-content next to
// blog-app so they can edit content (e.g. via Obsidian) without going
// through the submodule's working tree. When that sibling exists we
// read from it directly so edits show up live. On Vercel only the
// submodule is present, so we fall back to ./content.
const STANDALONE = path.resolve(process.cwd(), "..", "blog-content");
const SUBMODULE = path.join(process.cwd(), "content");

export const CONTENT_DIR = existsSync(STANDALONE) ? STANDALONE : SUBMODULE;
