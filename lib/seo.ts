import type { Metadata } from "next";
import { localizePath, type Locale } from "./i18n/config";
import { dictionaryFor } from "./i18n/dictionaries";
import { alternatesFor } from "./i18n/metadata";
import { siteUrl } from "./site";

export const ogImage = (locale: Locale) => `/images/og-${locale}.jpg`;

/** Unique title, description, canonical, hreflang and Open Graph data for one page. */
export function pageMetadata(path: string, locale: Locale, title: string, description: string): Metadata {
  const brand = dictionaryFor(locale).brand.name;
  return {
    // The home page sits at the same level as the title template, so it needs the brand added explicitly.
    title: path === "/" ? { absolute: `${brand}: ${title}` } : title,
    description,
    alternates: alternatesFor(path, locale),
    openGraph: {
      type: "website",
      siteName: brand,
      title: `${title} · ${brand}`,
      description,
      url: localizePath(path, locale),
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [{ url: ogImage(locale), width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${brand}`, description, images: [ogImage(locale)] },
  };
}

/**
 * Organization data uses only what the business brief confirms: name, site, logo, description and address.
 * TODO(company-confirm): add telephone, email, legal name and founding date once confirmed.
 */
export function organizationJsonLd(locale: Locale) {
  const dict = dictionaryFor(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.brand.name,
    url: `${siteUrl()}${localizePath("/", locale)}`,
    logo: `${siteUrl()}/images/logo-elkheirat-mark.png`,
    description: dict.brand.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: dict.brand.street,
      addressRegion: dict.brand.region,
      addressCountry: "EG",
    },
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${siteUrl()}${localizePath(item.href, locale)}`,
    })),
  };
}
