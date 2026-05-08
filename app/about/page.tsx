import { MDXRemote } from "next-mdx-remote/rsc";
import { getAbout } from "@/lib/about";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  const { content } = getAbout();

  return (
    <article className="prose prose-neutral max-w-none">
      <MDXRemote source={content} />
    </article>
  );
}
