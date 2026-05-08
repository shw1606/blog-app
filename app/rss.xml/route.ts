import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://seo-hnoo.me";

export async function GET() {
  const posts = getAllPosts();
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
    <title>Seo Hnoo</title>
    <link>${SITE_URL}</link>
    <description>개발자, 창업자의 작업 기록</description>
    <language>ko</language>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
