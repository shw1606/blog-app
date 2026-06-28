import Link from "next/link";
import { format } from "date-fns";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR } from "@/lib/site";

export default function Home() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "ko",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR.name,
        url: AUTHOR.url,
        sameAs: AUTHOR.sameAs,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mb-12">
        <p className="text-base text-neutral-700 leading-relaxed">
          Entrepreneur and developer. Notes on what I learn while building.
        </p>
      </section>
      <section>
        <h2 className="text-sm font-medium text-neutral-500 mb-6">Posts</h2>
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`} className="block group">
                <div className="text-sm text-neutral-500 mb-1">
                  {format(new Date(post.date), "yyyy.MM.dd")} ·{" "}
                  {post.readingTime} min read
                </div>
                <h3 className="text-lg font-medium mb-2 group-hover:underline">
                  {post.title}
                  {post.draft && (
                    <span className="ml-2 align-middle text-xs font-normal uppercase tracking-wide text-neutral-400">
                      Draft
                    </span>
                  )}
                </h3>
                {post.description && (
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {post.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
