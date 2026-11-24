"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { gsap, MQ, useGSAP } from "@/lib/motion/gsap";
import { useMediaQuery } from "@/lib/motion/hooks";

// ─── Content ───────────────────────────────────────────────────────────────────────────────────────────────────────
// TODO(company-confirm): every country, port and transit time below is a PLACEHOLDER supplied for layout. Confirm each
// with KHAIRAT before launch; lib/content.ts rules out stating destinations or capacities management hasn't confirmed.

type Text = Record<Locale, string>;
type Market = { id: string; title: Text; countries: Text[]; meta: Text };

const MARKETS: Market[] = [
  {
    id: "europe",
    title: { en: "Europe", ar: "أوروبا" },
    countries: [
      { en: "Germany", ar: "ألمانيا" },
      { en: "Netherlands", ar: "هولندا" },
      { en: "Italy", ar: "إيطاليا" },
      { en: "Spain", ar: "إسبانيا" },
    ],
    meta: { en: "7–14 days", ar: "٧–١٤ يومًا" },
  },
  {
    id: "arab",
    title: { en: "Arab countries", ar: "الدول العربية" },
    countries: [
      { en: "Saudi Arabia", ar: "السعودية" },
      { en: "UAE", ar: "الإمارات" },
      { en: "Kuwait", ar: "الكويت" },
      { en: "Jordan", ar: "الأردن" },
    ],
    meta: { en: "4–10 days", ar: "٤–١٠ أيام" },
  },
  {
    id: "international",
    title: { en: "International markets", ar: "الأسواق الدولية" },
    countries: [
      { en: "USA", ar: "الولايات المتحدة" },
      { en: "Canada", ar: "كندا" },
      { en: "UK", ar: "المملكة المتحدة" },
      { en: "East Asia", ar: "شرق آسيا" },
    ],
    meta: { en: "18–35 days", ar: "١٨–٣٥ يومًا" },
  },
];

const PORTS: Text[] = [
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Sokhna", ar: "السخنة" },
];

const LABELS = {
  origin: { en: "Origin", ar: "المنشأ" },
  egypt: { en: "Egypt", ar: "مصر" },
  ports: { en: "Export ports", ar: "موانئ التصدير" },
  transit: { en: "Transit", ar: "مدة الشحن" },
} satisfies Record<string, Text>;

// ─── Desktop geometry ──────────────────────────────────────────────────────────────────────────────────────────────
// The SVG column is exactly SVG_W px wide and each row exactly ROW_H px tall (lg), so the viewBox maps 1:1.
const ROW_H = 140;
const SVG_W = 180;
const NODE_X = SVG_W - 8;
const H = ROW_H * MARKETS.length;
const rowY = (i: number) => ROW_H * i + ROW_H / 2;
const curve = (i: number) => `M0 ${H / 2} C ${SVG_W * 0.55} ${H / 2}, ${SVG_W * 0.45} ${rowY(i)}, ${NODE_X} ${rowY(i)}`;

const pad = (n: number, locale: Locale) => (n + 1).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { minimumIntegerDigits: 2, useGrouping: false });

function Pin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function Arrow({ className }: { className?: string }) {
  // Points along the reading direction, so it flips in Arabic.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className={`${className} rtl:-scale-x-100`} aria-hidden="true">
      <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5" />
    </svg>
  );
}

/**
 * One origin (Egypt) branching out to several markets.
 * - Phones and tablets: the origin card, then a vertical route that draws as it scrolls in, with a shipment dot
 *   travelling down it; the row nearest the middle of the screen is highlighted (or the one tapped).
 * - Desktop (lg): card, a 180px column of curves drawn from the card's edge to each market, and the rows. Pointing at
 *   a row lights its curve and dims the others (rows are not links, so there is nothing to focus; all content is visible anyway).
 * Reduced motion: everything is drawn from the start, nothing travels, nothing slides.
 */
export function ExportRoutes({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const desktop = useMediaQuery(MQ.desktop);
  const reduce = useMediaQuery(MQ.reduce);
  const [active, setActive] = useState<number | null>(null);
  // useId() returns ":r1:"-style ids, which aren't valid inside url()/href references.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const t = (text: Text) => text[locale];

  // Phones and tablets: the row crossing the middle of the viewport is the active one. Off on desktop (hover only).
  useEffect(() => {
    if (desktop) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, [desktop]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (context) => {
        const { motion, desktop: wide } = context.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const ease = "brand";
        const trigger = { trigger: root.current, start: "top 75%", once: true };

        if (!wide) {
          // The route draws downward (one stretch per row, so it reads as one line), then a shipment travels along it
          // from the origin to the last market's node.
          const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", root.current);
          const last = nodes[nodes.length - 1];
          const travel = () => (last ? (last.parentElement?.offsetTop ?? 0) + last.offsetTop + last.offsetHeight / 2 - 4 : 0);
          const tl = gsap.timeline({ scrollTrigger: trigger });
          tl.fromTo("[data-line]", { scaleY: 0 }, { scaleY: 1, duration: 0.9 / nodes.length, stagger: 0.9 / nodes.length, ease: "none" });
          tl.fromTo("[data-node]", { scale: 0 }, { scale: 1, duration: 0.4, stagger: 0.15, ease }, 0.25);
          tl.add(() => {
            gsap.fromTo(
              "[data-shipment]",
              { y: 0, autoAlpha: 0 },
              {
                keyframes: { y: [0, travel()], autoAlpha: [0, 1, 1, 0], easeEach: "none" },
                duration: 4.5,
                ease: "none",
                repeat: -1,
                repeatDelay: 0.6,
              },
            );
          });
          return;
        }

        // Desktop: each curve draws out of the origin in turn, its node lands, then the shipments set off.
        const tl = gsap.timeline({ scrollTrigger: trigger });
        tl.fromTo("[data-curve]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.15, ease });
        tl.fromTo("[data-end]", { scale: 0 }, { scale: 1, duration: 0.4, stagger: 0.15, ease, transformOrigin: "50% 50%" }, 0.6);
        tl.fromTo("[data-ship]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
      });
    },
    { scope: root },
  );

  const lit = (i: number) => active === i;
  const dim = (i: number) => active !== null && active !== i;

  return (
    <div
      ref={root}
      style={{ "--row-h": `${ROW_H}px` } as React.CSSProperties}
      className="grid lg:grid-cols-[minmax(0,5fr)_180px_minmax(0,7fr)]"
      onPointerLeave={() => desktop && setActive(null)}
    >
      {/* ── Origin ── */}
      <div className="on-dark relative flex min-h-[200px] flex-col justify-between gap-8 bg-forest bg-[radial-gradient(rgb(247_244_237/0.08)_1px,transparent_1.5px)] bg-[length:18px_18px] p-6 text-paper sm:min-h-[260px] sm:p-8 lg:min-h-0">
        <div className="flex items-center gap-2.5">
          <Pin className="size-5 text-amber" />
          <span className="text-xs font-semibold tracking-widest uppercase opacity-60 rtl:tracking-normal">{t(LABELS.origin)}</span>
        </div>
        <div>
          <p className="font-display text-5xl leading-none font-semibold tracking-tight sm:text-6xl rtl:tracking-normal">{t(LABELS.egypt)}</p>
          <p className="mt-5 text-xs font-semibold tracking-widest uppercase opacity-60 rtl:tracking-normal">{t(LABELS.ports)}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {PORTS.map((port) => (
              <li key={port.en} className="rounded-full border border-paper/25 px-2.5 py-0.5 text-sm">
                {t(port)}
              </li>
            ))}
          </ul>
        </div>
        {/* Origin dot: on the bottom edge above the route on phones, on the end edge facing the curves on desktop. */}
        <span
          aria-hidden="true"
          className="absolute start-[calc(1.25rem-6px)] bottom-0 z-10 size-3.5 translate-y-1/2 rounded-full bg-amber ring-3 ring-paper lg:start-auto lg:end-0 lg:bottom-auto lg:top-1/2 lg:translate-x-1/2 lg:-translate-y-1/2 rtl:lg:-translate-x-1/2"
        />
      </div>

      {/* ── Desktop curves ── */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${SVG_W} ${H}`}
        width={SVG_W}
        height={H}
        className="hidden self-center overflow-visible text-forest lg:block rtl:-scale-x-100"
      >
        {MARKETS.map((market, i) => (
          <g key={market.id}>
            <path
              id={`${uid}-route-${i}`}
              data-curve=""
              d={curve(i)}
              pathLength={1}
              strokeDasharray="1"
              fill="none"
              className={`transition-[stroke,stroke-width,opacity] duration-300 ${lit(i) ? "stroke-copper" : "stroke-current"} ${dim(i) ? "opacity-25" : "opacity-100"}`}
              style={{ strokeWidth: lit(i) ? 2.5 : 1.5 }}
            />
            <circle
              data-end=""
              cx={NODE_X}
              cy={rowY(i)}
              r={6}
              style={{ strokeWidth: lit(i) ? 2.5 : 1.5 }}
              className={`transition-[fill,stroke,stroke-width,opacity] duration-300 ${lit(i) ? "fill-amber stroke-copper" : "fill-paper stroke-current"} ${dim(i) ? "opacity-25" : ""}`}
            />
            {!reduce && (
              <circle data-ship="" r={3.5} className="fill-amber" style={{ visibility: "hidden" }}>
                <animateMotion dur={`${3.2 + i * 0.5}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${uid}-route-${i}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        ))}
      </svg>

      {/* ── Markets ── */}
      <div className="relative">
        {/* Phones and tablets: the shipment that travels down the route once it has drawn. */}
        {!reduce && <span data-shipment="" aria-hidden="true" className="invisible absolute start-[calc(1.25rem-3px)] top-0 z-10 size-2 rounded-full bg-amber lg:hidden" />}

        <ul>
          {MARKETS.map((market, i) => (
            <li
              key={market.id}
              ref={(el) => {
                rows.current[i] = el;
              }}
              data-index={i}
              onClick={() => !desktop && setActive(i)}
              onPointerEnter={() => desktop && setActive(i)}
              className={`relative border-b border-black/10 py-6 ps-12 pe-2 transition-colors duration-300 last:border-b-0 sm:ps-14 lg:flex lg:h-[var(--row-h)] lg:flex-col lg:justify-center lg:py-0 lg:ps-6 ${lit(i) ? "bg-forest/[0.04]" : ""}`}
            >
              {/* This row's stretch of the route: the last one stops at its node. */}
              <span
                data-line=""
                aria-hidden="true"
                className={`absolute start-5 top-0 w-0.5 origin-top bg-forest lg:hidden ${i === MARKETS.length - 1 ? "h-[2.55rem] sm:h-[2.85rem]" : "bottom-0"}`}
              />
              <span
                data-node=""
                aria-hidden="true"
                className={`absolute start-[calc(1.25rem-6px)] top-[2.1rem] size-3.5 rounded-full border-2 transition-colors duration-300 sm:top-[2.4rem] lg:hidden ${lit(i) ? "border-copper bg-amber" : "border-forest bg-paper"}`}
              />
              <div className={`flex items-baseline gap-3 transition-transform duration-300 ${lit(i) ? "motion-safe:translate-x-1 motion-safe:rtl:-translate-x-1" : ""}`}>
                <span className="text-sm font-bold text-gold-ink tabular-nums">{pad(i, locale)}</span>
                <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight min-[400px]:text-3xl sm:text-4xl rtl:tracking-normal">{t(market.title)}</h3>
              </div>
              <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <p className="text-sm text-ink/70">{market.countries.map(t).join(" · ")}</p>
                <p className="inline-flex items-center gap-2 rounded-full bg-sand px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap sm:ms-auto sm:rounded-none sm:bg-transparent sm:px-0">
                  {t(LABELS.transit)} {t(market.meta)}
                  <Arrow className={`hidden size-4 transition-transform duration-300 sm:block ${lit(i) ? "motion-safe:translate-x-1 motion-safe:rtl:-translate-x-1" : ""}`} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
