import type { Metadata } from "next";
import { localizePath, locales, type Locale } from "./config";

/** Canonical URL plus hreflang alternates for a locale-independent path such as "/about". */
export function alternatesFor(path: string, locale: Locale): Metadata["alternates"] {
  return {
    canonical: localizePath(path, locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizePath(path, l)])),
      "x-default": localizePath(path, "en"),
    },
  };
}
