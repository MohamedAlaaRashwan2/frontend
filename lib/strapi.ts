import "server-only";
import { buildCategories, buildStats, type Category, type Product } from "./content";
import { defaultLocale, type Locale } from "./i18n/config";
import { dictionaryFor } from "./i18n/dictionaries";

export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

type StrapiMedia = { url: string; alternativeText?: string | null };

type Localized = { locale?: string | null };

type StrapiCategory = Localized & {
  documentId: string;
  Name?: string | null;
  description?: string | null;
  link?: string | null;
  photo?: StrapiMedia | null;
  products?: { documentId: string; name?: string | null; photoproduct?: StrapiMedia[] | null }[] | null;
};

type StrapiNumber = Localized & { Name?: string | null; Value?: number | string | null };

async function strapiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return json.data ?? null;
  } catch {
    // CMS offline or unreachable — callers fall back to built-in content.
    return null;
  }
}

/**
 * Entries Strapi returns for the requested locale. For other locales, entries that come back in a
 * different language (no translation yet) are dropped, so untranslated English text never appears
 * on a translated page — callers fall back to the built-in translation instead.
 */
async function strapiLocalized<T extends Localized>(path: string, locale: Locale): Promise<T[] | null> {
  const sep = path.includes("?") ? "&" : "?";
  const data = await strapiGet<T[]>(`${path}${sep}locale=${locale}`);
  if (!data?.length) return null;
  // Content types without i18n return no locale; treat them as English.
  const localized = data.filter((d) => (d.locale ?? defaultLocale) === locale);
  return localized.length ? localized : null;
}

export function mediaUrl(media?: StrapiMedia | null) {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categorySlug(c: StrapiCategory) {
  // The CMS "link" field holds paths like "product/fresh-produce"; use its last segment.
  const fromLink = c.link?.split("/").filter(Boolean).pop();
  return slugify(fromLink || c.Name || c.documentId);
}

const CATEGORIES_PATH = "/product-categories?populate[photo]=true&populate[products][populate][photoproduct]=true&sort=id:asc";

/**
 * Categories are built from the English (default-locale) Strapi entries, which define the list, slugs and
 * images — so every language shows the same pictures. Text comes from the entry in the requested locale
 * (same documentId); if that translation is missing, the built-in copy for that locale is used instead.
 */
export async function getCategories(locale: Locale): Promise<Category[]> {
  const dict = dictionaryFor(locale);
  const fallback = buildCategories(dict);
  const english = await strapiGet<StrapiCategory[]>(`${CATEGORIES_PATH}&locale=${defaultLocale}`);
  if (!english?.length) return fallback;

  const translated =
    locale === defaultLocale ? english : ((await strapiLocalized<StrapiCategory>(CATEGORIES_PATH, locale)) ?? []);
  const byDocument = new Map(translated.map((c) => [c.documentId, c]));
  // Product photos are shared too: look them up on the English product with the same documentId.
  const englishPhotos = new Map(
    english.flatMap((c) => c.products ?? []).map((p) => [p.documentId, mediaUrl(p.photoproduct?.[0])]),
  );

  return english.map((source) => {
    const slug = categorySlug(source);
    const base = fallback.find((f) => f.slug === slug);
    const text = byDocument.get(source.documentId);
    const cmsProducts: Product[] = (text?.products ?? [])
      .filter((p) => p.name)
      .map((p) => ({ name: p.name!, image: englishPhotos.get(p.documentId) ?? mediaUrl(p.photoproduct?.[0]) }));

    return {
      slug,
      name: text?.Name || base?.name || dict.category.fallbackName,
      summary: text?.description || base?.summary || "",
      intro: base?.intro || text?.description || "",
      image: mediaUrl(source.photo) || base?.image || "/images/fields.jpg",
      icon: base?.icon || "leaf",
      products: cmsProducts.length ? cmsProducts : (base?.products ?? []),
      specs: base?.specs ?? [],
      season: base?.season ?? dict.category.fallbackSeason,
    };
  });
}

export async function getCategory(slug: string, locale: Locale) {
  const all = await getCategories(locale);
  return all.find((c) => c.slug === slug) ?? null;
}

export type Stat = { label: string; value: number; suffix?: string };

export async function getStats(locale: Locale): Promise<Stat[]> {
  const data = await strapiLocalized<StrapiNumber>("/company-numbers?sort=id:asc", locale);
  const stats = (data ?? [])
    .filter((n) => n.Name && n.Value !== null && n.Value !== undefined)
    .map((n) => ({ label: n.Name!, value: Number(n.Value) }))
    .filter((n) => Number.isFinite(n.value));
  return stats.length ? stats : buildStats(dictionaryFor(locale));
}

export async function getCompanyDescription(locale: Locale) {
  const fallback = dictionaryFor(locale).brand.description;
  if (locale === defaultLocale) {
    const data = await strapiGet<{ description?: string | null }>("/description");
    return data?.description || fallback;
  }
  const data = await strapiGet<Localized & { description?: string | null }>(`/description?locale=${locale}`);
  return data?.locale === locale && data.description ? data.description : fallback;
}
