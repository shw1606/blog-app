import rehypeShiki from "@shikijs/rehype";
import type { ShikiTransformer } from "shiki";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { remarkYouTube } from "@/lib/remark-youtube";
import { rehypeFigure } from "@/lib/rehype-figure";

// Shiki drops the original `language-*` class, so we stash the resolved
// language on the <pre> for the CodeBlock header to read back.
const exposeLanguage: ShikiTransformer = {
  name: "expose-language",
  pre(node) {
    node.properties["data-language"] = this.options.lang;
  },
};

// Shared MDXRemote options for posts and the about page. Keeping this in
// one place ensures both render markdown identically.
export const mdxOptions: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkYouTube],
    rehypePlugins: [
      rehypeFigure,
      [
        rehypeShiki,
        {
          theme: "github-dark",
          defaultLanguage: "text",
          fallbackLanguage: "text",
          transformers: [exposeLanguage],
        },
      ],
    ],
  },
};
