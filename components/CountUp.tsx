"use client";

import { useEffect, useRef, useState } from "react";

/** Counts from zero to `value` once visible. Years (e.g. 2005) count from a nearby start instead. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  console.log(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isYear = value >= 1900 && value <= 2100;
  const start = isYear ? value - 25 : 0;
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const begin = performance.now();
      const duration = 1600;
      const tick = (now: number) => {
        const t = Math.min((now - begin) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(start + (value - start) * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      setDisplay(start);
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [start, value]);

  return (
    <span ref={ref} dir="ltr" className="inline-block tabular-nums">
      {isYear ? display : display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
