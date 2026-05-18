import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CONTENT_DIR } from "./content-dir";

const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");

// Draft posts — frontmatter `draft: true`, or any file living under
// content/drafts/ — are visible ONLY when running locally with
// `next dev`. They are never included in a production build and never on
// Vercel (NODE_ENV is "production" there), so unpublished drafts cannot
// leak. This lets the author preview a draft locally exactly as it will
// render once published.
const DRAFT_PREVIEW =
  process.env.NODE_ENV === "development" && !process.env.VERCEL;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

// Estimated minutes to read. Mixed Korean/English: Hangul syllables read
// at ~500/min, latin words at ~200/min. Markdown punctuation is close
// enough to ignore. Always at least 1.
export function estimateReadingTime(content: string): number {
  const hangul = (content.match(/[가-힣]/g) ?? []).length;
  const latinWords = (content.match(/[A-Za-z0-9]+/g) ?? []).length;
  const minutes = Math.ceil(hangul / 500 + latinWords / 200);
  return Math.max(1, minutes);
}

function listSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""));
}

export function getAllPostSlugs(): string[] {
  const slugs = listSlugs(POSTS_DIR);
  if (!DRAFT_PREVIEW) return slugs;
  // Local dev: also surface drafts. Published posts win on slug collision.
  const seen = new Set(slugs);
  for (const slug of listSlugs(DRAFTS_DIR)) {
    if (!seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  }
  return slugs;
}

function resolveFile(dir: string, slug: string): string | null {
  const md = path.join(dir, `${slug}.md`);
  const mdx = path.join(dir, `${slug}.mdx`);
  return fs.existsSync(md) ? md : fs.existsSync(mdx) ? mdx : null;
}

export function getPostBySlug(slug: string): Post | null {
  // Published location first; fall back to drafts/ only in dev preview.
  let filePath = resolveFile(POSTS_DIR, slug);
  let inDraftsDir = false;
  if (!filePath && DRAFT_PREVIEW) {
    filePath = resolveFile(DRAFTS_DIR, slug);
    inDraftsDir = filePath !== null;
  }
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const isDraft = data.draft === true || inDraftsDir;
  if (isDraft && !DRAFT_PREVIEW) return null;

  return {
    slug,
    title: data.title,
    date: new Date(data.date).toISOString(),
    description: data.description,
    tags: data.tags ?? [],
    draft: isDraft,
    readingTime: estimateReadingTime(content),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}
