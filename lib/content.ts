// Language-neutral structure of the site: which services, products, stages and images exist.
// Wording lives in lib/i18n/dictionaries. Nothing here may state a capacity, temperature, certificate, destination
// country or specification that management has not confirmed. See docs/KHAIRAT-COMPANY-CONFIRMATION.md.

import type { InquiryIntent } from "./inquiry";

// ——— Images ———
// Every picture below is temporary and contextual, not KHAIRAT's own: see docs/ASSET-CHECKLIST.md.
// `operations` pictures always carry a visible "illustrative image" label, so a visitor never takes them for the
// company's facility or team. When the real photograph arrives, replace `src` and set `kind` to "company".
export type ImageKind = "operations" | "product" | "place" | "company";

export const images = {
  greensRows: { src: "/images/greens-rows.jpg", kind: "place", en: "Rows of leafy greens growing in a field", ar: "صفوف من الخضراوات الورقية في حقل مفتوح" },
  wheatSunset: { src: "/images/wheat-sunset.jpg", kind: "place", en: "Farmland at sunset", ar: "أرض زراعية عند الغروب" },
  port: { src: "/images/port.jpg", kind: "place", en: "Aerial view of a busy container port", ar: "منظر جوي لميناء حاويات مزدحم" },
  cranes: { src: "/images/cranes.jpg", kind: "place", en: "Container vessel under port cranes", ar: "سفينة حاويات تحت رافعات الميناء" },
  vessel: { src: "/images/vessel.jpg", kind: "place", en: "Container vessel at sea", ar: "سفينة حاويات في عرض البحر" },
  harvest: { src: "/images/harvest.jpg", kind: "operations", en: "Field workers carrying crates of harvested produce", ar: "عمال في الحقل يحملون صناديق المحصول" },
  greensHarvest: { src: "/images/greens-harvest.jpg", kind: "operations", en: "A grower carrying a crate of freshly cut greens", ar: "مزارع يحمل صندوقًا من الخضراوات المقطوفة حديثًا" },
  sortingFruit: { src: "/images/produce-line.jpg", kind: "operations", en: "Fresh citrus running along a grading and packing line", ar: "حمضيات طازجة على خط الفرز والتعبئة" },
  processingLine: { src: "/images/processing-line.jpg", kind: "operations", en: "A worker in gloves and a hairnet preparing produce on a processing line", ar: "عاملة بقفازات وغطاء شعر تجهّز المنتجات على خط التصنيع" },
  containerLoading: { src: "/images/container-loading.jpg", kind: "operations", en: "A forklift loading a shipping container onto a truck", ar: "رافعة شوكية تحمّل حاوية شحن على شاحنة" },
  packingHands: { src: "/images/packing-hands.jpg", kind: "operations", en: "Hands checking produce on a packing table", ar: "أيدٍ تفحص المنتج على طاولة التعبئة" },
  warehouse: { src: "/images/warehouse.jpg", kind: "operations", en: "Warehouse aisles stacked with packed goods", ar: "ممرات مستودع مرصوصة بالبضائع المعبأة" },
  mango: { src: "/images/mango.jpg", kind: "product", en: "A ripening mango on the tree", ar: "ثمرة مانجا تنضج على الشجرة" },
  strawberries: { src: "/images/strawberries.jpg", kind: "product", en: "Fresh strawberries", ar: "فراولة طازجة" },
  figs: { src: "/images/figs.jpg", kind: "product", en: "Fresh figs, one cut open", ar: "تين طازج وثمرة مفتوحة" },
  pomegranates: { src: "/images/pomegranates.jpg", kind: "product", en: "Whole and opened pomegranates", ar: "رمان كامل ومفتوح" },
  greensClose: { src: "/images/greens-close.jpg", kind: "product", en: "Close view of fresh leafy greens", ar: "لقطة قريبة لخضراوات ورقية طازجة" },
  vegetables: { src: "/images/vegetables.jpg", kind: "product", en: "A mix of seasonal vegetables", ar: "تشكيلة من الخضراوات الموسمية" },
} as const satisfies Record<string, { src: string; kind: ImageKind; en: string; ar: string }>;

export type ImageId = keyof typeof images;

// ——— Supply-chain stages, in the order given by the brief ———
export const stageIds = ["source", "receive", "inspect", "prepare", "package", "cool", "store", "orders", "containerPrep", "load", "export"] as const;
export type StageId = (typeof stageIds)[number];

/** Blue only ever means the cold chain. */
export const coldStages: StageId[] = ["cool", "store"];

// ——— Services ———
export const serviceMeta = {
  coldStorage: { slug: "cold-storage", intent: "cold-storage" },
  produce: { slug: "produce-handling", intent: "processing" },
  processing: { slug: "food-processing", intent: "processing" },
  privateLabel: { slug: "private-label", intent: "private-label" },
  export: { slug: "export-solutions", intent: "export" },
  container: { slug: "container-loading", intent: "exporter" },
  business: { slug: "business-storage", intent: "cold-storage" },
  sourcing: { slug: "product-sourcing", intent: "export" },
} as const satisfies Record<string, { slug: string; intent: InquiryIntent }>;

export type ServiceKey = keyof typeof serviceMeta;
export const serviceKeys = Object.keys(serviceMeta) as ServiceKey[];
export const serviceHref = (key: ServiceKey) => `/services/${serviceMeta[key].slug}`;

/**
 * Picture for each service, chosen to show what the service's title says. Two are drawn instead of photographed:
 * cold storage (no honest photograph exists yet) and Private Label (stock packaging always shows someone else's brand).
 */
export const serviceArt = { coldStorage: "cold", privateLabel: "label" } as const satisfies Partial<Record<ServiceKey, string>>;
export type ServiceArt = (typeof serviceArt)[keyof typeof serviceArt];

export const serviceImage: Record<Exclude<ServiceKey, keyof typeof serviceArt>, ImageId> = {
  produce: "sortingFruit",
  processing: "processingLine",
  export: "vessel",
  container: "containerLoading",
  business: "warehouse",
  sourcing: "harvest",
};

/** The photograph or drawing that represents a service. */
export function serviceVisual(key: ServiceKey): { image?: (typeof images)[ImageId]; art?: ServiceArt } {
  if (key in serviceArt) return { art: serviceArt[key as keyof typeof serviceArt] };
  return { image: images[serviceImage[key as keyof typeof serviceImage]] };
}

// ——— Products ———
// TODO(company-confirm): management approves the final product list, plus form, season and packaging per product.
export const productMeta = [
  { slug: "mango", image: "mango", group: "fruit" },
  { slug: "strawberries", image: "strawberries", group: "fruit" },
  { slug: "figs", image: "figs", group: "fruit" },
  { slug: "pomegranates", image: "pomegranates", group: "fruit" },
  { slug: "leafy-greens", image: "greensClose", group: "vegetables" },
  { slug: "vegetables", image: "vegetables", group: "vegetables" },
] as const satisfies readonly { slug: string; image: ImageId; group: "fruit" | "vegetables" }[];

export type ProductSlug = (typeof productMeta)[number]["slug"];

/** Contact-form deep link, e.g. contactHref("export", "Mango") → "/contact?type=export&product=Mango#inquiry". */
export function contactHref(intent: InquiryIntent, product?: string) {
  const query = new URLSearchParams({ type: intent });
  if (product) query.set("product", product);
  return `/contact?${query.toString()}#inquiry`;
}
