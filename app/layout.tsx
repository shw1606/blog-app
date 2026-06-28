import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsWithExclusion } from "./analytics";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
              Yule Seo
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
              <a
                href="https://www.threads.com/@yulebuilds"
                className="hover:underline"
              >
                Threads
              </a>
            </div>
          </footer>
        </div>
        <AnalyticsWithExclusion />
      </body>
    </html>
  );
}
