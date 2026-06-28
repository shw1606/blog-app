// Single source of truth for site-wide identity used by metadata,
// structured data (JSON-LD), RSS, and OG image generation.
// www is the primary domain on Vercel (apex 301-redirects to www), so
// every canonical/OG/sitemap URL must be www to match.
export const SITE_URL = "https://www.seo-hnoo.me";
export const SITE_NAME = "Yule Seo";
export const SITE_DESCRIPTION = "Notes from a developer and entrepreneur.";

export const AUTHOR = {
  name: "Yule Seo",
  url: SITE_URL,
  // Profiles that establish the same identity across the web. Used as
  // schema.org `sameAs` so search engines can reconcile the author.
  sameAs: [
    "https://github.com/shw1606",
    "https://www.linkedin.com/in/hyunwoo-seo/",
    "https://www.threads.com/@yulebuilds",
  ],
};
