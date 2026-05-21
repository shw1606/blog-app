"use client";

// MDX `pre` override for fenced code blocks. Renders a header bar with
// the language label and a copy button, then the Shiki-highlighted
// `<pre>` itself. Shiki's own props (theme classes, background `style`,
// `data-language`) are spread through so highlighting stays intact.

import { useState, type ComponentProps } from "react";
import { extractText } from "@/lib/node-text";

export function CodeBlock({ children, ...preProps }: ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);

  const lang =
    (preProps as Record<string, unknown>)["data-language"]?.toString() ?? "";
  const code = extractText(children).replace(/\n+$/, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{lang || "text"}</span>
        <button
          type="button"
          onClick={copy}
          className="code-block__copy"
          aria-label="Copy code to clipboard"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre {...preProps}>{children}</pre>
    </div>
  );
}
