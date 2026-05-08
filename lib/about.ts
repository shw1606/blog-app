import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ABOUT_PATH = path.join(process.cwd(), "content", "about.md");

export function getAbout(): { content: string } {
  if (!fs.existsSync(ABOUT_PATH)) {
    return { content: "" };
  }
  const raw = fs.readFileSync(ABOUT_PATH, "utf-8");
  const { content } = matter(raw);
  return { content };
}
