// Loads a Korean-capable font (Noto Sans KR) subsetted to exactly the
// glyphs we need, for use with next/og ImageResponse (satori). satori
// cannot parse woff2, so we send an old User-Agent that makes Google
// Fonts serve TrueType instead. Subsetting by `text=` keeps each font
// payload to a few KB, which matters because OG images are generated
// per-post on demand.

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Version/5.1 Safari/534.30";

async function fetchSubsetFont(
  text: string,
  weight: number,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (
    await fetch(url, { headers: { "User-Agent": LEGACY_UA } })
  ).text();
  const src = css.match(/src:\s*url\((.+?)\)\s*format/);
  if (!src) throw new Error("Could not extract font URL from Google Fonts CSS");
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

// Returns both a regular and bold cut covering `text`, so the OG layout
// can mix label and title weights.
export async function loadOgFonts(text: string): Promise<OgFont[]> {
  const [regular, bold] = await Promise.all([
    fetchSubsetFont(text, 400),
    fetchSubsetFont(text, 700),
  ]);
  return [
    { name: "Noto Sans KR", data: regular, weight: 400, style: "normal" },
    { name: "Noto Sans KR", data: bold, weight: 700, style: "normal" },
  ];
}
