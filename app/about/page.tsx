import { MDXRemote } from "next-mdx-remote/rsc";
import { getAbout } from "@/lib/about";
import { mdxComponents } from "@/components/mdx";
import { mdxOptions } from "@/lib/mdx-options";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  const { content } = getAbout();

  return (
    <article className="prose prose-neutral max-w-none">
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={mdxOptions}
      />
    </article>
  );
}
