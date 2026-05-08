# Project Rules for Claude Code

## Project Overview

This is the Next.js codebase for `seo-hnoo.me`. Content lives in a separate
private repo (`blog-content`) and is mounted at `content/` via git submodule.

## Stack

- Next.js 16 (App Router) + TypeScript, Turbopack default for dev/build
- pnpm (package manager)
- Tailwind CSS v4 (CSS-first config in `app/globals.css`, `@plugin` for typography)
- next-mdx-remote for content rendering
- gray-matter for frontmatter
- date-fns for date formatting

## Architecture Rules

- All content (posts, about) lives in `content/` (submodule). Do not commit
  content files to this repo directly.
- Routes are defined in `app/`. Keep them minimal: `/`, `/about`,
  `/posts/[slug]`, `/rss.xml`. Do not add new routes without explicit request.
- Design: single column, max-width 680px, system font, white background.
  Do not introduce sidebars, widgets, or complex layouts.

## Code Style

- Server components by default. Add `"use client"` only when necessary
  (e.g., interactive elements).
- Keep dependencies minimal. Justify any new package addition.
- TypeScript strict mode. No `any` without comment explaining why.

## When Modifying Content Loading Logic

Files in `lib/posts.ts` and `lib/about.ts` are stable contracts. Changes here
affect all post rendering. Confirm with user before modifying.

## Tailwind v4 Notes

- No `tailwind.config.ts`; configure via `@theme` and `@plugin` in
  `app/globals.css`.
- Typography plugin is registered with `@plugin "@tailwindcss/typography"`.
- Use `prose` classes for markdown-rendered content.

## Forbidden Patterns

- Do not add analytics, tracking, or third-party widgets without explicit
  request.
- Do not add localStorage/sessionStorage. This site is static-friendly.
- Do not add database, ORM, or backend logic. This is a static site.

## Content Workflow Reminder

To pull new content into the build:

```bash
git submodule update --remote content
git add content
git commit -m "Update content"
git push
```

Vercel rebuilds automatically on push.
