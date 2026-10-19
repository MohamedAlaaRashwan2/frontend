"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { markSiteReady, useSiteReady } from "./motion/site-ready";

export const INTRO_STORAGE_KEY = "alkhairat:intro";

const LAYERS = ["/images/loader/sun.png", "/images/loader/green.png", "/images/loader/blue.png"];

const MIN_MS = 1200; // the logo finishes assembling (~1s) and holds briefly, so it never flashes
const MAX_MS = 2500; // never hold visitors longer than this, even on a slow connection
const EXIT_MS = 800;

/**
 * Runs before first paint (inlined in the root layout): plays the intro only on the first visit of a
 * browser session. Returning visitors never see the loader, not even for a frame.
 * Adding `?intro` to any URL replays it, for reviewing the animation.
 */
export const introScript = `try{document.documentElement.dataset.intro=/[?&]intro\\b/.test(location.search)||!sessionStorage.getItem("${INTRO_STORAGE_KEY}")?"play":"done"}catch(e){document.documentElement.dataset.intro="done"}`;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

/** Resolves when an image has loaded (or failed — a broken image shouldn't hold the loader). */
const imageReady = (img: HTMLImageElement) =>
  img.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });

/**
 * Full-screen brand intro shown while the essentials load: fonts and the above-the-fold
 * (priority) images. Holds for at least MIN_MS and at most MAX_MS from navigation start.
 * The logo assembly is pure CSS (see globals.css), so it animates before JavaScript arrives.
 */
export function SiteLoader({ name, tagline, label }: { name: string; tagline: string; label: string }) {
  // Preload the three logo layers from <head> so the assembly starts with all of them in hand.
  LAYERS.forEach((href) => preload(href, { as: "image", fetchPriority: "high" }));

  const lenis = useLenis();
  const barRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  // Already ready on mount means this isn't the session's first visit: no intro.
  const ready = useSiteReady();
  const skipped = ready && phase === "loading";

  // Hold the page still while the intro covers it.
  useEffect(() => {
    if (phase === "done") lenis?.start();
    else if (document.documentElement.dataset.intro === "play") lenis?.stop();
  }, [lenis, phase]);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") return;

    let cancelled = false;
    const bar = barRef.current;
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      // Above-the-fold priority images, including the loader's own logo layers.
      ...Array.from(document.querySelectorAll<HTMLImageElement>('img[fetchpriority="high"], .site-loader__logo img'), imageReady),
    ];

    // Real progress takes over from the CSS "creep" animation once JavaScript is running.
    let done = 0;
    const setProgress = (value: number) => {
      if (!bar) return;
      bar.dataset.live = "";
      bar.style.transform = `scaleX(${Math.max(0.08, value)})`;
    };
    setProgress(0.15);
    tasks.forEach((task) => task.then(() => !cancelled && setProgress(0.15 + (0.75 * ++done) / tasks.length)));

    (async () => {
      // performance.now() counts from navigation start, so slow script loading is included in the budget.
      await Promise.race([Promise.all(tasks), wait(MAX_MS - performance.now())]);
      await wait(MIN_MS - performance.now());
      if (cancelled) return;

      setProgress(1);
      await wait(280);
      if (cancelled) return;

      setPhase("leaving");
      // Let the hero start its entrance as the curtain lifts, so the two motions overlap.
      setTimeout(markSiteReady, 180);
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {}

      await wait(EXIT_MS);
      if (cancelled) return;
      root.dataset.intro = "done";
      setPhase("done");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "done" || skipped) return null;

  return (
    <div id="site-loader" data-phase={phase} role="status" aria-live="polite" className="site-loader">
      <span className="sr-only">{label}</span>
      <div className="site-loader__brand" aria-hidden="true">
        <span className="site-loader__ring" />
        {/* Logo split into three layers so the sun and leaves can assemble independently. */}
        <span className="site-loader__logo">
          {/* eslint-disable-next-line @next/next/no-img-element -- must render before JS/next/image is ready */}
          <img src={LAYERS[0]} alt="" className="site-loader__sun" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LAYERS[1]} alt="" className="site-loader__leaf-green" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LAYERS[2]} alt="" className="site-loader__leaf-blue" />
        </span>
        <span className="site-loader__name font-display">{name}</span>
        <span className="site-loader__tagline">{tagline}</span>
        <span className="site-loader__track">
          <span ref={barRef} className="site-loader__bar" />
        </span>
      </div>
    </div>
  );
}
