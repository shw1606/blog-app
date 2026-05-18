// Zero-dependency remark plugin: turns a bare YouTube URL that sits alone
// on its own line into a <YouTube /> MDX element, so authors can just
// paste a link in Obsidian and get a responsive embed on the site.
//
// It matches a paragraph whose only child is the URL — either a plain
// text node (default markdown) or a single link node (if remark-gfm
// autolinking is ever enabled). Inline links inside other prose are
// left untouched.

// Minimal mdast-ish node shape; the MDX/remark types are only available
// transitively, so we model just what we touch.
interface MdNode {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
  [key: string]: unknown;
}

function parseTime(t: string): number | undefined {
  if (/^\d+$/.test(t)) return Number(t) || undefined;
  const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return undefined;
  const total =
    (Number(m[1]) || 0) * 3600 +
    (Number(m[2]) || 0) * 60 +
    (Number(m[3]) || 0);
  return total || undefined;
}

function parseYouTube(raw: string): { id: string; start?: number } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id = "";
  if (host === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v") ?? "";
    } else if (
      url.pathname.startsWith("/embed/") ||
      url.pathname.startsWith("/shorts/") ||
      url.pathname.startsWith("/live/")
    ) {
      id = url.pathname.split("/")[2] ?? "";
    }
  }
  if (!/^[\w-]{6,}$/.test(id)) return null;
  const t = url.searchParams.get("start") ?? url.searchParams.get("t");
  return { id, start: t ? parseTime(t) : undefined };
}

function urlFromParagraph(node: MdNode): string | null {
  if (node.type !== "paragraph" || node.children?.length !== 1) return null;
  const child = node.children[0];
  if (child.type === "text" && typeof child.value === "string") {
    return child.value;
  }
  // remark-gfm would autolink the bare URL into a single link node.
  if (child.type === "link" && typeof child.url === "string") {
    return child.url;
  }
  return null;
}

function toYouTubeElement(id: string, start?: number): MdNode {
  const attributes: MdNode[] = [
    { type: "mdxJsxAttribute", name: "id", value: id },
  ];
  if (start !== undefined) {
    attributes.push({
      type: "mdxJsxAttribute",
      name: "start",
      value: String(start),
    });
  }
  return {
    type: "mdxJsxFlowElement",
    name: "YouTube",
    attributes,
    children: [],
    data: { _mdxExplicitJsx: true },
  };
}

function walk(node: MdNode): void {
  if (!Array.isArray(node.children)) return;
  node.children = node.children.map((child) => {
    const raw = urlFromParagraph(child);
    if (raw) {
      const yt = parseYouTube(raw);
      if (yt) return toYouTubeElement(yt.id, yt.start);
    }
    walk(child);
    return child;
  });
}

export function remarkYouTube() {
  return (tree: MdNode): void => {
    walk(tree);
  };
}
