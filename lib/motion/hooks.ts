"use client";

import { useSyncExternalStore } from "react";
import { MQ } from "./gsap";

const subscribe = (query: string) => (onChange: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};

/** Live media-query match. Renders `serverValue` on the server and during hydration, so markup always matches. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery(MQ.reduce);
