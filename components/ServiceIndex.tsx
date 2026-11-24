"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/motion/gsap";
import { ColdRoomArt } from "./ColdRoomArt";
import { Icon } from "./Icon";

export type ServiceRow = {
  key: string;
  href: string;
  name: string;
  short: string;
  image?: { src: string; alt: string; illustrative: boolean };
};

/**
 * All services as one index. On desktop the picture beside the list follows the row you point at or focus: the new
 * picture is uncovered over the previous one while it settles, so the change reads as a cut, not a flicker.
 * On phones the rows stand alone, which keeps the section short.
 */
export function ServiceIndex({ rows, illustrative }: { rows: ServiceRow[]; illustrative: string }) {
  const [active, setActive] = useState(0);
  // Pictures load once the visitor engages with the list, so eight photographs don't weigh down the first view.
  const [engaged, setEngaged] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const previous = useRef(0);
  const current = rows[active];

  useGSAP(
    () => {
      const from = previous.current;
      previous.current = active;
      if (from === active) return;
      const panes = gsap.utils.toArray<HTMLElement>("[data-pane]", stage.current);
      const incoming = panes[active];
      const outgoing = panes[from];
      if (!incoming) return;

      // Only the new picture and the one it covers are visible; everything else is out of the way.
      panes.forEach((pane, i) => gsap.set(pane, { zIndex: i === active ? 2 : i === from ? 1 : 0, autoAlpha: i === active || i === from ? 1 : 0 }));
      if (prefersReducedMotion()) {
        if (outgoing) gsap.set(outgoing, { autoAlpha: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });
      tl.fromTo(incoming, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75 }, 0);
      tl.fromTo(incoming.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 1.1 }, 0);
      if (outgoing) tl.to(outgoing.firstElementChild, { scale: 0.96, duration: 0.75 }, 0).set(outgoing, { autoAlpha: 0 }).set(outgoing.firstElementChild, { scale: 1 });
    },
    { dependencies: [active], scope: stage },
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12" onPointerEnter={() => setEngaged(true)} onFocusCapture={() => setEngaged(true)}>
      <ul className="lg:col-span-7">
        {rows.map((row, i) => (
          <li key={row.key} className="border-t-2 border-current" data-rise="">
            <Link href={row.href} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} className="arrow-nudge group flex items-center justify-between gap-4 py-4 md:py-5">
              <span>
                <span className="t-sub block transition-colors duration-200 group-hover:text-leaf">{row.name}</span>
                <span className="mt-1 block">{row.short}</span>
              </span>
              <Icon name="arrow" className="size-6 shrink-0" strokeWidth={2.25} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="hidden lg:col-span-5 lg:block">
        <div ref={stage} data-photo="" className="sticky top-[calc(var(--header-height)+1.5rem)] aspect-[4/5] overflow-hidden bg-cold-deep">
          {rows.map((row, i) => {
            const on = i === active;
            return (
              // Each pane is clipped as a whole; its first child is the layer that scales.
              <div key={row.key} data-pane="" className={`absolute inset-0 overflow-hidden ${on ? "z-[2]" : "invisible opacity-0"}`}>
                {row.image ? (
                  engaged || on ? (
                    <Image src={row.image.src} alt={on ? row.image.alt : ""} fill sizes="40vw" className="object-cover" />
                  ) : (
                    <span />
                  )
                ) : (
                  <ColdRoomArt className="absolute inset-0 size-full" />
                )}
              </div>
            );
          })}
          {current.image?.illustrative && <span className="absolute start-0 bottom-0 z-[3] bg-ink/85 px-2.5 py-1 text-[0.875rem] leading-snug text-paper">{illustrative}</span>}
        </div>
      </div>
    </div>
  );
}
