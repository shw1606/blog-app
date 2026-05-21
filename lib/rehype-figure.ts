// Zero-dependency rehype plugin. Two jobs:
//
//  1. Lazy-load every image except the first (the first is typically
//     above the fold — often the hero — so eager loading helps LCP).
//  2. Promote a standalone captioned image (`<p>` whose only content is
//     an `<img>` with non-empty alt text) into a semantic
//     `<figure><img><figcaption>…`. The very first block is skipped so
//     the hero image keeps its `<p>` wrapper and the float layout in
//     globals.css (`.prose > p:first-child:has(img)`) keeps working.

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

function onlyImageChild(p: HastNode): HastNode | null {
  if (p.tagName !== "p" || !p.children) return null;
  let img: HastNode | null = null;
  for (const child of p.children) {
    if (child.type === "text" && (child.value ?? "").trim() === "") continue;
    if (child.type === "element" && child.tagName === "img" && !img) {
      img = child;
      continue;
    }
    return null; // paragraph carries other content — leave it alone
  }
  return img;
}

export function rehypeFigure() {
  return (tree: HastNode): void => {
    // 1. Lazy-load all images after the first.
    const images: HastNode[] = [];
    const collect = (node: HastNode): void => {
      if (node.tagName === "img") images.push(node);
      node.children?.forEach(collect);
    };
    collect(tree);
    images.forEach((img, i) => {
      if (i === 0) return;
      img.properties ??= {};
      img.properties.loading = "lazy";
    });

    // 2. Promote standalone captioned images to <figure>.
    let firstElementSkipped = false;
    for (const node of tree.children ?? []) {
      if (node.type !== "element") continue;
      if (!firstElementSkipped) {
        firstElementSkipped = true;
        continue;
      }
      const img = onlyImageChild(node);
      if (!img) continue;
      const alt = (img.properties?.alt ?? "").toString().trim();
      if (!alt) continue;

      node.tagName = "figure";
      node.properties = {};
      node.children = [
        img,
        {
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: alt }],
        },
      ];
    }
  };
}
