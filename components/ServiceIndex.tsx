"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
 * All services as one index. On desktop the picture beside the list follows the row you point at or focus.
 * On phones the rows stand alone, which keeps the section short.
 */
export function ServiceIndex({ rows, illustrative }: { rows: ServiceRow[]; illustrative: string }) {
  const [active, setActive] = useState(0);
  // Pictures load once the visitor engages with the list, so eight photographs don't weigh down the first view.
  const [engaged, setEngaged] = useState(false);
  const current = rows[active];

  return (
    <div className="grid gap-8 lg:grid-cols-12" onPointerEnter={() => setEngaged(true)} onFocusCapture={() => setEngaged(true)}>
      <ul className="lg:col-span-7">
        {rows.map((row, i) => (
          <li key={row.key} className="border-t-2 border-current">
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
        <div className="sticky top-[calc(var(--header-height)+1.5rem)] aspect-[4/5] overflow-hidden bg-cold-deep">
          {rows.map((row, i) => {
            const on = i === active;
            if (!row.image) {
              return <ColdRoomArt key={row.key} className={`service-photo absolute inset-0 size-full ${on ? "opacity-100" : "opacity-0"}`} />;
            }
            if (!engaged && !on) return null;
            return <Image key={row.key} src={row.image.src} alt={on ? row.image.alt : ""} fill sizes="40vw" className={`service-photo object-cover ${on ? "opacity-100" : "opacity-0"}`} />;
          })}
          {current.image?.illustrative && <span className="absolute start-0 bottom-0 bg-ink/85 px-2.5 py-1 text-[0.875rem] leading-snug text-paper">{illustrative}</span>}
        </div>
      </div>
    </div>
  );
}
