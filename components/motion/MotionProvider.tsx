"use client";

import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { LazyMotion, MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SpotlightTracker } from "./SpotlightTracker";

/**
 * App-wide motion setup:
 * - Lenis smooths wheel/trackpad scrolling (touch devices keep native scrolling, and it switches
 *   itself off for prefers-reduced-motion).
 * - LazyMotion loads only the DOM animation features; `strict` keeps us on the lightweight `m.*` components.
 * - MotionConfig drops transform animations for reduced-motion users (fades remain).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.11, allowNestedScroll: true, stopInertiaOnNavigate: true }}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
      <ScrollReset />
      <SpotlightTracker />
    </ReactLenis>
  );
}

// Animation features are fetched after the page renders, keeping them off the critical path.
const loadFeatures = () => import("./features").then((mod) => mod.default);

/** Start each new page at the top without carrying over Lenis' scroll target from the previous one. */
function ScrollReset() {
  const lenis = useLenis();
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [lenis, pathname]);

  return null;
}
