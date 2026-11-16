"use client";

import { useInView, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { coldStages, stageIds, type StageId } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function Stage({ id, name, body, number }: { id: StageId; name: string; body: string; number: string }) {
  const ref = useRef<HTMLLIElement>(null);
  // Lights up as it crosses the middle of the screen, and stays lit.
  const reached = useInView(ref, { once: true, margin: "0px 0px -42% 0px" });
  const cold = coldStages.includes(id);
  return (
    <li ref={ref} data-on={reached} className="chain-row relative ps-8 pb-7 md:ps-12 md:pb-10">
      <span className={`absolute start-0 top-2 size-3.5 -translate-x-[5px] rtl:translate-x-[5px] ${cold ? "bg-cold-bright" : "bg-amber"}`} aria-hidden="true" />
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="t-small font-bold">{number}</span>
        <h3 className="t-sub">{name}</h3>
      </div>
      <p className="mt-1">{body}</p>
    </li>
  );
}

/** The product's journey. A line fills as you scroll, and each stage lights up when it is reached. */
export function ChainScroll({ stages, locale }: { stages: Dictionary["stages"]; locale: string }) {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 62%", "end 58%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <ol ref={list} className="relative">
      <span className="absolute inset-y-1 start-0 w-1 bg-paper/20" aria-hidden="true" />
      <m.span style={{ scaleY: fill }} className="absolute inset-y-1 start-0 w-1 origin-top bg-amber" aria-hidden="true" />
      {stageIds.map((id, i) => (
        <Stage key={id} id={id} name={stages[id].name} body={stages[id].body} number={(i + 1).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { minimumIntegerDigits: 2, useGrouping: false })} />
      ))}
    </ol>
  );
}
