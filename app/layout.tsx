import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Seo Hnoo",
    template: "%s — Seo Hnoo",
  },
  description: "개발자, 창업자의 작업 기록.",
  metadataBase: new URL("https://seo-hnoo.me"),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <div className="mx-auto max-w-[680px] px-6 py-12">
          <header className="mb-16 flex items-center justify-between">
            <Link href="/" className="text-base font-medium">
              Hyunwoo Seo
            </Link>
            <nav className="text-sm">
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-24 pt-8 border-t border-neutral-200 text-sm text-neutral-500">
            <div className="flex gap-4">
              <a href="/rss.xml" className="hover:underline">
                RSS
              </a>
              <a
                href="https://github.com/shw1606"
                className="hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/hyunwoo-seo/"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
