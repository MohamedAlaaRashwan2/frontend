"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Set before first paint. `[data-rise]` content only hides when this class is present, so it can't get stuck hidden. */
export const motionScript = `document.documentElement.classList.add("js")`;

/**
 * Plays each `[data-rise]` and `[data-photo]` element's entrance once as it scrolls into view. The styles live in globals.css
 * and are disabled for prefers-reduced-motion. Runs again on navigation so new pages get the same treatment.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-rise]:not([data-risen]), [data-photo]:not([data-risen]), [data-rule]:not([data-risen]), [data-route]:not([data-risen])");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.setAttribute("data-risen", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-risen", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
