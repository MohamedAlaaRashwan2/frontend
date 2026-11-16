import type { MetadataRoute } from "next";
import { serviceHref, serviceKeys } from "@/lib/content";
import { locales, localizePath } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

const paths = ["/", "/about", "/services", ...serviceKeys.map(serviceHref), "/products", "/facility", "/quality", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${origin}${localizePath(path, locale)}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${origin}${localizePath(path, l)}`])) },
    })),
  );
}
