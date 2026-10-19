// Built-in content. Strapi data takes priority wherever it exists (see lib/strapi.ts);
// these values keep every page complete while the CMS is empty or offline.
// Text lives in lib/i18n/dictionaries — this file holds the language-neutral parts (slugs, images, icons, order).

import type { Dictionary } from "./i18n/dictionaries";
import { site } from "./site";

export type IconName =
  | "shield"
  | "globe"
  | "ship"
  | "scale"
  | "chat"
  | "document"
  | "search"
  | "box"
  | "leaf"
  | "snow"
  | "flame"
  | "wheat"
  | "check"
  | "handshake"
  | "chart"
  | "tag";

export type Product = {
  name: string;
  note?: string;
  image?: string;
};

export type Category = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  icon: IconName;
  intro: string;
  products: Product[];
  specs: { label: string; value: string }[];
  season: string;
};

type CategorySlug = keyof Dictionary["categories"];

const categoryMeta: { slug: CategorySlug; image: string; icon: IconName; productImages: Record<number, string> }[] = [
  {
    slug: "agricultural-commodities",
    image: "/images/commodities.jpg",
    icon: "wheat",
    productImages: { 0: "/images/rice.jpg" },
  },
  {
    slug: "fresh-produce",
    image: "/images/fresh-produce.jpg",
    icon: "leaf",
    productImages: { 0: "/images/fresh-produce.jpg", 1: "/images/onions.jpg", 2: "/images/pomegranates.jpg", 4: "/images/carrots.jpg" },
  },
  {
    slug: "frozen-products",
    image: "/images/frozen-products.jpg",
    icon: "snow",
    productImages: { 0: "/images/frozen-products.jpg" },
  },
  {
    slug: "export-grade-charcoal",
    image: "/images/charcoal.jpg",
    icon: "flame",
    productImages: { 0: "/images/charcoal.jpg" },
  },
];

export function buildCategories(dict: Dictionary): Category[] {
  return categoryMeta.map((meta) => {
    const text = dict.categories[meta.slug];
    return {
      slug: meta.slug,
      name: text.name,
      summary: text.summary,
      intro: text.intro,
      image: meta.image,
      icon: meta.icon,
      products: text.products.map((p, i) => ({ ...p, image: meta.productImages[i] })),
      specs: text.specs,
      season: text.season,
    };
  });
}

export function buildStats(dict: Dictionary) {
  const values = [site.founded, 6, 4, new Date().getFullYear() - site.founded];
  return dict.stats.map((label, i) => ({ label, value: values[i], suffix: i === 3 ? dict.common.yearsSuffix : undefined }));
}

const pillarIcons: IconName[] = ["shield", "globe", "ship", "scale", "chat", "document"];
const serviceIcons: IconName[] = ["search", "shield", "box", "ship", "document", "chart"];
const valueIcons: IconName[] = ["handshake", "check", "leaf", "chat"];

/** Localised company content, paired with its icons and ordering. */
export function buildContent(dict: Dictionary) {
  return {
    pillars: dict.pillars.map((p, i) => ({ ...p, icon: pillarIcons[i] })),
    process: dict.process.map((p, i) => ({ ...p, step: String(i + 1).padStart(2, "0") })),
    markets: dict.markets,
    faqs: dict.faqs,
    services: dict.services.map((s, i) => ({ ...s, icon: serviceIcons[i] })),
    values: dict.values.map((v, i) => ({ ...v, icon: valueIcons[i] })),
    documents: dict.documents,
  };
}
