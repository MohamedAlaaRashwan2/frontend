// Locale settings shared by the proxy, server components and client components.

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = { en: "English", ar: "العربية" };

export const isLocale = (value: string | undefined): value is Locale => locales.includes(value as Locale);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Prefixes an internal path with the locale: ("/contact", "ar") → "/ar/contact". */
export function localizePath(path: string, locale: Locale) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/** Swaps the locale segment of a pathname: ("/en/products", "ar") → "/ar/products". */
export function switchLocalePath(pathname: string, locale: Locale) {
  const [, first, ...rest] = pathname.split("/");
  const tail = isLocale(first) ? rest : [first, ...rest].filter(Boolean);
  return `/${[locale, ...tail].filter(Boolean).join("/")}`;
}
