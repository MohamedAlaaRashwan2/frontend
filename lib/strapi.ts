import "server-only";
import { productMeta, type ProductSlug } from "./content";

export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");

type StrapiMedia = { url: string };
type StrapiProduct = { name?: string | null; photoproduct?: StrapiMedia[] | null };

function mediaUrl(media?: StrapiMedia | null) {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * The CMS supplies product photographs only: a CMS product named e.g. "Mango" with an uploaded photo replaces the
 * contextual picture for that product, so the company can publish real photography without a code change.
 *
 * CMS text is deliberately not used. The current entries contain claims the company has not confirmed
 * (world regions, IQF, founding years) and another company's name. Clean them up before reading text from Strapi.
 */
export async function getProductPhotos(): Promise<Partial<Record<ProductSlug, string>>> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/products?populate[photoproduct]=true&locale=en&pagination[pageSize]=100`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return {};
    const { data } = (await res.json()) as { data?: StrapiProduct[] };
    const known = new Set<string>(productMeta.map((p) => p.slug));
    const photos: Partial<Record<ProductSlug, string>> = {};
    for (const product of data ?? []) {
      const slug = slugify(product.name ?? "");
      const url = mediaUrl(product.photoproduct?.[0]);
      if (url && known.has(slug)) photos[slug as ProductSlug] = url;
    }
    return photos;
  } catch {
    // CMS offline or unreachable: the built-in pictures are used.
    return {};
  }
}
