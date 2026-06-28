import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { loadOgFonts } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Generated on-demand (then CDN-cached), not at build time. The card
// fetches a subsetted Korean font over the network; doing that at request
// time keeps the build hermetic and offline-safe.
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? SITE_NAME;
  const fonts = await loadOgFonts(`${title}${SITE_NAME}글 읽기`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "80px",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 400, color: "#737373" }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#171717",
            display: "flex",
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
