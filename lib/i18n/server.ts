import { lang } from "next/root-params";
import { defaultLocale, isLocale, localizePath, type Locale } from "./config";
import { dictionaryFor } from "./dictionaries";

/** Current locale from the `[lang]` root segment (Server Components only). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : defaultLocale;
}

export async function getDictionary() {
  return dictionaryFor(await getLocale());
}

/** Locale-prefixed path for the current request: "/contact" → "/ar/contact". */
export async function href(path: string) {
  return localizePath(path, await getLocale());
}
