"use client";

import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { LazyMotion, MotionConfig, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Animation features load after the page renders, keeping them off the critical path.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Site-wide motion setup, kept deliberately gentle.
 * - Lenis smooths wheel and trackpad scrolling. Touch devices keep native scrolling, and reduced motion turns it off.
 * - Motion's LazyMotion supplies the few interface transitions that need to run on exit, such as menus closing.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <ReactLenis
      root
      options={{
        lerp: reduceMotion ? 1 : 0.14,
        smoothWheel: !reduceMotion,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        // Lenis already honours the page's scroll-padding, which keeps anchors clear of the sticky header.
        anchors: { immediate: Boolean(reduceMotion) },
      }}
    >
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
      <ScrollReset />
    </ReactLenis>
  );
}

/** Start each new page at the top, without carrying over Lenis' scroll target from the previous page. */
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
