"use client";

import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";

/**
 * Drifts a hero background slightly slower than the page as it scrolls away.
 * Transform-only (GPU composited); disabled for reduced-motion users.
 */
export function Parallax({ children, distance = 120 }: { children: React.ReactNode; distance?: number }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : distance], { clamp: true });

  return (
    // Taller than its section by `distance`, so the drift never reveals an edge.
    <m.div style={{ y, height: `calc(100% + ${distance}px)` }} className="absolute inset-x-0 top-0 -z-20">
      {children}
    </m.div>
  );
}
