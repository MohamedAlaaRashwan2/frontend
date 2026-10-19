"use client";

import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import { EASE_OUT } from "../Reveal";

type Segment = { text: string; className?: string };

const tags = { h1: m.h1, h2: m.h2, p: m.p };

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/**
 * Staggered word-by-word entrance for headings. Splits on whitespace only — never inside a word —
 * so Arabic letters stay joined. `trigger="mount"` plays on load (heroes); "inView" waits for scroll.
 */
export function AnimatedText({
  text,
  segments,
  as = "h2",
  className,
  trigger = "inView",
  delay = 0,
  stagger = 0.055,
}: {
  text?: string;
  segments?: Segment[];
  as?: keyof typeof tags;
  className?: string;
  trigger?: "mount" | "inView";
  /** Seconds before the first word appears. */
  delay?: number;
  stagger?: number;
}) {
  const Tag = tags[as];
  const parts = segments ?? [{ text: text ?? "" }];
  const play = trigger === "mount" ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      {...play}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {parts.flatMap((segment, s) =>
        segment.text.split(/(\s+)/).map((chunk, i) =>
          /^\s+$/.test(chunk) || chunk === "" ? (
            chunk
          ) : (
            <m.span key={`${s}-${i}`} variants={word} className={`inline-block ${segment.className ?? ""}`}>
              {chunk}
            </m.span>
          ),
        ),
      )}
    </Tag>
  );
}
