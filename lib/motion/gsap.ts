/**
 * The one place GSAP is set up. Every client component imports gsap, ScrollTrigger and useGSAP from here, so plugins are
 * registered once and every animation shares the same timing vocabulary.
 *
 * Motion language: short, confident, decelerating. Things arrive from below or from the reading side and settle;
 * nothing bounces, loops or overshoots. One ease ("brand") matches the CSS --ease-out-strong curve, so CSS hover
 * transitions and GSAP entrances feel like the same hand.
 */
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  CustomEase.create("brand", "0.23, 1, 0.32, 1");
  gsap.defaults({ duration: 0.8, ease: "brand" });
  // Phones resize the viewport when the address bar hides; recalculating then would make triggers jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Development only: lets you inspect live triggers from the console (ScrollTrigger.getAll()). Stripped from production.
  if (process.env.NODE_ENV === "development") Object.assign(window, { gsap, ScrollTrigger });
}

export const EASE = {
  /** Default for entrances. */
  brand: "brand",
  /** Masked text and clip reveals: a longer, calmer tail. */
  reveal: "expo.out",
  /** Leaving: quick and plain. */
  exit: "power2.in",
  /** Scroll-linked motion must be linear so it tracks the scrollbar. */
  scrub: "none",
} as const;

export const DUR = { fast: 0.3, base: 0.8, slow: 1.1, hero: 1.3 } as const;

export const STAGGER = { words: 0.045, items: 0.08, routes: 0.14 } as const;

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  fine: "(hover: hover) and (pointer: fine)",
} as const;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

/** RTL pages move from the right: flip horizontal offsets. */
export const inlineSign = () => (typeof document !== "undefined" && document.documentElement.dir === "rtl" ? -1 : 1);

export { gsap, ScrollTrigger, useGSAP };
