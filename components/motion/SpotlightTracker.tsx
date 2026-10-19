"use client";

import { useEffect } from "react";

/**
 * One delegated pointer listener drives the soft "spotlight" hover on every `[data-spotlight]` card,
 * by writing the pointer position into CSS variables (see globals.css). Mouse/trackpad only.
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      const card = (last?.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card || !last) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${last.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${last.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
