import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAbout } from "@/lib/about";
import { mdxComponents } from "@/components/mdx";
import { mdxOptions } from "@/lib/mdx-options";
import { SITE_NAME } from "@/lib/site";

const ABOUT_DESCRIPTION = `${SITE_NAME} — entrepreneur and developer. Notes on what I learn while building.`;

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: `About · ${SITE_NAME}`,
    description: ABOUT_DESCRIPTION,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: `About · ${SITE_NAME}`,
    description: ABOUT_DESCRIPTION,
  },
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
