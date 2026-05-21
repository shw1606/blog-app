import { isValidElement, type ReactNode } from "react";

// Recursively flattens a React node tree to its visible text. Used to
// derive heading slugs and the copy-to-clipboard payload for code blocks.
export function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}
