// Single source of truth for site-wide identity used by metadata,
// structured data (JSON-LD), RSS, and OG image generation.
export const SITE_URL = "https://seo-hnoo.me";
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
