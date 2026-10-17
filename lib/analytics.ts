type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: EventData) => void;
    };
  }
}

/** Sends anonymous product events only when the self-hosted tracker is ready. */
export function trackEvent(name: string, data?: EventData) {
  if (typeof window === "undefined") return;
  window.umami?.track(name, data);
}
