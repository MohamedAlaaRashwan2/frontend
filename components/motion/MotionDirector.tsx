"use client";

import { usePathname } from "next/navigation";
import { DUR, EASE, gsap, MQ, ScrollTrigger, STAGGER, useGSAP } from "@/lib/motion/gsap";

/**
 * Runs before first paint. Hidden starting states in globals.css only apply under `html.js`, and if the animation layer
 * hasn't confirmed it is running (`motion-ready`) within four seconds, the class is dropped so nothing can stay hidden.
 */
export const motionScript = `(function(d){d.classList.add("js");setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("js")},4000)})(document.documentElement)`;

type Q = <T extends HTMLElement = HTMLElement>(selector: string, root?: Element) => T[];
const q: Q = (selector, root) => gsap.utils.toArray(selector, root ?? document);

/**
 * Once an element has arrived, mark it and hand styling back to CSS. The hidden states in globals.css only match
 * elements without `data-risen`, so clearing the inline values afterwards can't make anything jump back.
 */
const settle = (els: Element[], clear: Element[] = els, props = "opacity,visibility,transform,clipPath") => () => {
  els.forEach((el) => el.setAttribute("data-risen", ""));
  gsap.set(clear, { clearProps: props });
};

/**
 * The site's single animation director. Pages stay Server Components and only mark elements with data attributes;
 * this reads them on each route and builds the matching GSAP timelines and ScrollTriggers:
 *
 * - `[data-hero]`          page-opening timeline: `[data-hero-title]` words, then `[data-hero-item]`s, `[data-hero-photo]` settles
 * - `[data-split]`         heading revealed word by word as it enters (words come from <Words>)
 * - `[data-read]`          large statement whose words brighten with scroll (scrubbed, reversible)
 * - `[data-rise]`          block rises into place; `="side"` arrives from the reading side; batched so neighbours stagger
 * - `[data-rule]`          section rule draws from the reading side
 * - `[data-route]`         export lines draw from Egypt to each market, one after another
 * - `[data-photo]`         photograph uncovered by a clip-path while it settles; `="wide"` opens from the centre on desktop
 * - `[data-parallax]`      layer drifts against the scroll (strength in %, halved on phones)
 * - `[data-depth]`         hero copy lifts slightly faster than the page (desktop only)
 *
 * Everything sits inside gsap.matchMedia: with reduced motion none of it is created and CSS shows everything as-is,
 * and crossing the desktop breakpoint rebuilds the layout-specific parts. All of it is reverted on navigation.
 */
export function MotionDirector() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (context) => {
        const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        // ── Page opening ──
        q("[data-hero]").forEach((hero) => {
          const tl = gsap.timeline({ defaults: { ease: EASE.brand }, delay: 0.05 });
          // A banner photograph can be its own hero (it opens the page right under the title).
          const frames = hero.matches("[data-hero-photo]") ? [hero] : q("[data-hero-photo]", hero);
          const photos = frames.flatMap((frame) => q("img", frame));
          const titles = q("[data-hero-title]", hero);
          const words = titles.flatMap((title) => q(".wi", title));
          const items = q("[data-hero-item]", hero);

          if (photos.length) tl.to(photos, { scale: 1, duration: 2.2, ease: EASE.reveal }, 0);
          if (words.length) tl.to(words, { y: 0, opacity: 1, duration: DUR.hero, ease: EASE.reveal, stagger: STAGGER.words }, 0.1);
          if (items.length) tl.to(items, { y: 0, opacity: 1, duration: DUR.base, stagger: 0.09 }, words.length ? 0.35 : 0.1);
          tl.eventCallback("onComplete", () => {
            settle(titles, words)();
            settle(items)();
            settle(frames, photos, "transform")();
          });
        });

        // Wide banners and the home hero drift against the scroll. The layer is taller than its frame, so it never shows an edge.
        q("[data-parallax]").forEach((layer) => {
          const strength = (Number(layer.dataset.parallax) || 6) * (desktop ? 1 : 0.5);
          gsap.fromTo(
            layer,
            { yPercent: -strength },
            { yPercent: strength, ease: EASE.scrub, scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        if (desktop) {
          q("[data-depth]").forEach((layer) => {
            gsap.to(layer, { y: Number(layer.dataset.depth) || -80, ease: EASE.scrub, scrollTrigger: { trigger: layer.closest("section") ?? layer, start: "top top", end: "bottom top", scrub: true } });
          });
        }

        // ── Headings, word by word ──
        q("[data-split]:not([data-risen])").forEach((heading) => {
          const words = q(".wi", heading);
          gsap.to(words, {
            y: 0,
            opacity: 1,
            duration: DUR.slow,
            ease: EASE.reveal,
            stagger: STAGGER.words,
            scrollTrigger: { trigger: heading, start: "top 88%", once: true },
            onComplete: settle([heading], words),
          });
        });

        // ── Statements that are read as you scroll ──
        q("[data-read]").forEach((statement) => {
          gsap.fromTo(
            q(".wi", statement),
            { opacity: 0.16 },
            { opacity: 1, ease: EASE.scrub, stagger: 0.1, scrollTrigger: { trigger: statement, start: "top 85%", end: "bottom 55%", scrub: 0.6 } },
          );
        });

        // ── Blocks: batched, so items that arrive together stagger as a group ──
        ScrollTrigger.batch(
          q("[data-rise]:not([data-risen])").filter((el) => !el.closest("[data-hero]")),
          {
            start: "top 90%",
            once: true,
            onEnter: (batch) => gsap.to(batch, { x: 0, y: 0, opacity: 1, duration: DUR.base, stagger: STAGGER.items, overwrite: true, onComplete: settle(batch) }),
          },
        );

        // ── Rules and routes draw in ──
        ScrollTrigger.batch(q("[data-rule]:not([data-risen])"), {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: DUR.slow, ease: EASE.reveal, onComplete: settle(batch) }),
        });
        ScrollTrigger.batch(q("[data-route]:not([data-risen])"), {
          start: "top 90%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.2, ease: EASE.reveal, stagger: STAGGER.routes, onComplete: settle(batch) }),
        });

        // ── Photographs ──
        q("[data-photo]:not([data-risen])").forEach((frame) => {
          const img = frame.querySelector("img");
          const wide = frame.dataset.photo === "wide" && desktop;
          const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 88%", once: true } });
          tl.fromTo(
            frame,
            { clipPath: wide ? "inset(14% 10% 14% 10%)" : "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: wide ? 1.4 : 1.1, ease: EASE.reveal },
          );
          if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: EASE.reveal }, 0);
          tl.eventCallback("onComplete", settle([frame], img ? [frame, img] : [frame]));
        });
      });

      document.documentElement.classList.add("motion-ready");

      // Web fonts change line lengths, and so trigger positions: measure again once they're in.
      let live = true;
      document.fonts?.ready.then(() => live && ScrollTrigger.refresh());
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        live = false;
        cancelAnimationFrame(frame);
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
