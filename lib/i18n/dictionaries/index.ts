import type { Locale } from "../config";
import ar from "./ar";
import en, { type Dictionary } from "./en";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export const dictionaryFor = (locale: Locale) => dictionaries[locale];

/** Fills `{name}` placeholders: fill("Since {year}", { year: 2005 }) → "Since 2005". */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
