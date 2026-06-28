import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  // Drafts are never syndicated, even in local dev.
  const posts = getAllPosts().filter((post) => !post.draft);
  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid>${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.description ? `<description><![CDATA[${post.description}]]></description>` : ""}
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Yule Seo</title>
    <link>${SITE_URL}</link>
    <description>Notes from a developer and entrepreneur.</description>
    <language>en</language>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
