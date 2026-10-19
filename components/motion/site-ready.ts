"use client";

import { useSyncExternalStore } from "react";

/**
 * "Site ready" signal shared by the intro loader and the entrance animations.
 * When the loader plays, hero animations wait for it to lift instead of finishing unseen behind it.
 * The inline script in the root layout sets html[data-intro] to "play" or "done" before first paint.
 */

let ready = typeof document !== "undefined" && document.documentElement.dataset.intro !== "play";
const listeners = new Set<() => void>();

export function markSiteReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** False while the intro loader covers the page; true otherwise (always false during server render). */
export function useSiteReady() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
}
