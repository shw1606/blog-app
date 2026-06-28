import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Generated on-demand (then CDN-cached), not at build time — keeps the
// build hermetic since the card fetches a Korean font over the network.
export const dynamic = "force-dynamic";

// Default share card for the home page, About, and any route without its
// own opengraph-image.
const TAGLINE = "Entrepreneur and developer. Notes on what I learn while building.";

export default async function Image() {
  const fonts = await loadOgFonts(`${SITE_NAME}${TAGLINE}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "24px",
          background: "#ffffff",
          padding: "80px",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, color: "#171717" }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#737373",
            display: "flex",
          }}
        >
          {TAGLINE}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
