// Shared MDX component overrides for posts and the about page.
//
//  - h2/h3/h4 get a slug `id` and become self-linking anchors.
//  - external links open in a new tab with a safe `rel`.
//  - tables are wrapped so they can scroll horizontally on narrow screens.
//  - `pre` is rendered by CodeBlock (language label + copy button).

import type { ComponentProps } from "react";
import { extractText } from "@/lib/node-text";
import { CodeBlock } from "@/components/code-block";
import { YouTube } from "@/components/youtube";

// Slug from heading text. `\p{L}` keeps Hangul and other letters intact.
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function heading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  return function Heading({ children, ...props }: ComponentProps<"h2">) {
    const id = slugify(extractText(children));
    return (
      <Tag id={id} {...props}>
        <a href={`#${id}`} className="heading-anchor">
          {children}
        </a>
      </Tag>
    );
  };
}

function Anchor({ href = "", children, ...props }: ComponentProps<"a">) {
  const isExternal = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

export const mdxComponents = {
  YouTube,
  pre: CodeBlock,
  a: Anchor,
  table: Table,
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
};
