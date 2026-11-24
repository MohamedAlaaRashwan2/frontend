"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/hooks";

/**
 * Site-wide motion setup.
 * - Lenis smooths wheel and trackpad scrolling. Touch devices keep native scrolling, and reduced motion turns it off.
 * - GSAP's ticker drives Lenis, and every Lenis scroll updates ScrollTrigger, so smooth scrolling and scroll-linked
 *   animation are computed in the same frame and never drift apart.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: reduceMotion ? 1 : 0.14,
        smoothWheel: !reduceMotion,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        // Lenis already honours the page's scroll-padding, which keeps anchors clear of the sticky header.
        anchors: { immediate: reduceMotion },
      }}
    >
      {children}
      <ScrollSync />
    </ReactLenis>
  );
}

/** Keeps ScrollTrigger in step with Lenis, and starts each new page at the top. */
function ScrollSync() {
  const lenis = useLenis(ScrollTrigger.update);
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [lenis, pathname]);

  return null;
}
