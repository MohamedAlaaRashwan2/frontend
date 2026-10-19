"use client";

import * as m from "motion/react-m";
import { useSiteReady } from "./motion/site-ready";

const tags = { div: m.div, li: m.li, section: m.section, article: m.article };

export const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

/** Fades its children up into view the first time they scroll into the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  spotlight = false,
}: {
  children: React.ReactNode;
  /** Delay in milliseconds, used to stagger items in a grid. */
  delay?: number;
  className?: string;
  as?: keyof typeof tags;
  /** Adds the cursor-following highlight on hover (see globals.css). */
  spotlight?: boolean;
}) {
  const Tag = tags[as];
  // Hold the entrance until the intro loader has lifted.
  const ready = useSiteReady();
  return (
    <Tag
      data-reveal=""
      data-spotlight={spotlight ? "" : undefined}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={ready ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: delay / 1000 }}
    >
      {children}
    </Tag>
  );
}
