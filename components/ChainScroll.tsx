"use client";

import { useRef } from "react";
import { coldStages, stageIds, type StageId } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

function Stage({ id, name, body, number }: { id: StageId; name: string; body: string; number: string }) {
  const cold = coldStages.includes(id);
  return (
    <li data-stage="" className="chain-row relative ps-8 pb-7 md:ps-12 md:pb-10">
      <span className={`chain-dot absolute start-0 top-2 size-3.5 -translate-x-[5px] rtl:translate-x-[5px] ${cold ? "bg-cold-bright" : "bg-amber"}`} aria-hidden="true" />
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="t-small font-bold">{number}</span>
        <h3 className="t-sub">{name}</h3>
      </div>
      <p className="mt-1">{body}</p>
    </li>
  );
}

/**
 * The product's journey. The line fills in step with the scroll, and each stage lights up (and stays lit) as the line
 * reaches it. With reduced motion the line is simply full and every stage is lit.
 */
export function ChainScroll({ stages, locale }: { stages: Dictionary["stages"]; locale: string }) {
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(".chain-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: list.current, start: "top 62%", end: "bottom 58%", scrub: 0.4 },
        });
        gsap.utils.toArray<HTMLElement>("[data-stage]", list.current).forEach((stage) => {
          ScrollTrigger.create({ trigger: stage, start: "top 58%", once: true, onEnter: () => stage.setAttribute("data-on", "true") });
        });
      });
    },
    { scope: list },
  );

  return (
    <ol ref={list} className="relative">
      <span className="absolute inset-y-1 start-0 w-1 bg-paper/20" aria-hidden="true" />
      <span className="chain-fill absolute inset-y-1 start-0 w-1 origin-top bg-amber" aria-hidden="true" />
      {stageIds.map((id, i) => (
        <Stage key={id} id={id} name={stages[id].name} body={stages[id].body} number={(i + 1).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { minimumIntegerDigits: 2, useGrouping: false })} />
      ))}
    </ol>
  );
}
