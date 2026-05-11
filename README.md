# blog-app

Source for [seo-hnoo.me](https://seo-hnoo.me).

## Stack

- Next.js 16 (App Router) · TypeScript
- Tailwind CSS v4 · `@tailwindcss/typography`
- MDX via `next-mdx-remote`
- pnpm · Vercel

## Routes

```
/             home — post list, newest first
/about        bio
/posts/[slug] single post
/rss.xml      RSS feed
```

## Content

Posts and media live in [blog-content](https://github.com/shw1606/blog-content), a private repo mounted here as a git submodule at `content/`.

```
blog-app/                public
└── content/             submodule → blog-content (private)
    ├── about.md
    ├── profile.jpg
    └── posts/
```

Images under `content/` are synced into `public/` at build time so Next can serve them as static assets (`scripts/sync-content-assets.mjs`).

## Local

```bash
pnpm install
git submodule update --init --recursive
pnpm dev
```

If `../blog-content` exists as a sibling clone, the dev server reads from it directly and live-reloads on edits there.
