"use client";

import { Analytics } from "@vercel/analytics/next";

const VA_EXCLUDE_KEY = "__va_internal_exclude_c4e9a7f2";

function isInternalTraffic(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.localStorage.getItem(VA_EXCLUDE_KEY)
  );
}

export function AnalyticsWithExclusion() {
  return (
    <Analytics
      beforeSend={(event) => {
        if (isInternalTraffic()) {
          return null; // 내부 트래픽 → 전송 차단
        }
        return event;
      }}
    />
  );
}
