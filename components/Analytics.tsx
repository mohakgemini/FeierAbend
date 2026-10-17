"use client";

import { useEffect } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/analytics";

const host = process.env.NEXT_PUBLIC_UMAMI_HOST;
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function Analytics() {
  useEffect(() => {
    const onShare = (event: Event) => {
      const detail = (event as CustomEvent<{ mood?: string; method?: string }>).detail;
      trackEvent("mood_share", {
        mood: detail?.mood ?? "unknown",
        method: detail?.method ?? "unknown",
      });
    };

    window.addEventListener("feierabend:share", onShare);
    return () => window.removeEventListener("feierabend:share", onShare);
  }, []);

  if (!host || !websiteId) return null;

  return (
    <Script
      src={`${host.replace(/\/$/, "")}/script.js`}
      data-website-id={websiteId}
      data-domains="feierabend.live"
      strategy="afterInteractive"
    />
  );
}
