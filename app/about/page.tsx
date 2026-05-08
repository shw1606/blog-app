import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAbout } from "@/lib/about";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  const { content } = getAbout();

  return (
    <article className="prose prose-neutral max-w-none">
      <div className="not-prose mb-10">
        <Image
          src="/profile.jpg"
          alt="서현우"
          width={800}
          height={1000}
          className="w-60 h-auto"
          priority
        />
      </div>
      <MDXRemote source={content} />
    </article>
  );
}
