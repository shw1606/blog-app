import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx";
import { mdxOptions } from "@/lib/mdx-options";

export async function generateStaticParams() {
  // Gate-aware: drafts are included only in local dev, never prerendered
  // in a production build.
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="mb-10">
        <div className="text-sm text-neutral-500 mb-2">
          {format(new Date(post.date), "yyyy.MM.dd")} · {post.readingTime} min
          read
        </div>
        <h1 className="text-2xl font-semibold leading-tight">{post.title}</h1>
      </header>
      <div className="prose prose-neutral max-w-none">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={mdxOptions}
        />
      </div>
    </article>
  );
}
