"use client";

import { useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";
import { useRef } from "react";

/**
 * The home page hero: one strong photograph with the copy over it. It settles once on load (CSS, so it isn't held up by
 * script) and drifts slightly slower than the page on scroll. Nothing else moves, on purpose.
 */
export function HeroStage({ image, children }: { image: { src: string; alt: string; position?: string }; children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const eased = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 });
  const photoY = useTransform(eased, [0, 1], ["0%", reduceMotion ? "0%" : "10%"]);

  return (
    <section ref={section} className="on-dark relative isolate flex min-h-[calc(100svh-var(--header-height))] overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-10">
        <m.div style={{ y: photoY }} className="absolute inset-x-0 -top-[2%] h-[114%] will-change-transform">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            quality={62}
            sizes="100vw"
            className="hero-photo object-cover"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
        </m.div>
        {/* A neutral scrim, from below on phones and from the reading side on desktop, so the photo keeps its own colour. */}
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/50 to-ink/10 lg:bg-linear-to-r lg:from-ink/80 lg:via-ink/45 lg:to-transparent rtl:lg:bg-linear-to-l" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-linear-to-t from-ink/70 to-transparent lg:block" aria-hidden="true" />
      </div>
      <div className="shell flex flex-col justify-end pt-16 pb-5 lg:pt-20 lg:pb-7">{children}</div>
    </section>
  );
}
