"use client";

import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/components/Reveal";

// Set after the first page has hydrated. The initial load renders without a transition
// (so server HTML is visible immediately and LCP isn't delayed); later navigations fade in.
let hasHydrated = false;

/** Re-mounts on every navigation, giving each new page a short fade-and-rise entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animateIn] = useState(() => typeof window !== "undefined" && hasHydrated);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <m.div
      initial={animateIn ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
