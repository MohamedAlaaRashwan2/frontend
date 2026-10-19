"use client";

import { useEffect } from "react";

/** SMIL animations ignore CSS motion preferences, so pause them explicitly for reduced-motion users. */
export function PauseOnReducedMotion({ targetId }: { targetId: string }) {
  useEffect(() => {
    const svg = document.getElementById(targetId);
    if (!(svg instanceof SVGSVGElement)) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (query.matches ? svg.pauseAnimations() : svg.unpauseAnimations());
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [targetId]);

  return null;
}
