import type { Metadata } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { MotionDirector, motionScript } from "@/components/motion/MotionDirector";
import { JsonLd } from "@/components/ui";
import { serviceHref, serviceKeys } from "@/lib/content";
import { dirOf, locales } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { organizationJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

// Arabic faces carry only the Arabic subset; Latin words inside Arabic text fall back to Manrope.
const plexArabic = IBM_Plex_Sans_Arabic({ variable: "--font-plex-arabic", subsets: ["arabic"], weight: ["400", "500", "700"], display: "swap" });
const alexandria = Alexandria({ variable: "--font-alexandria", subsets: ["arabic"], display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${dict.brand.name}: ${dict.brand.titleSuffix}`, template: `%s · ${dict.brand.name}` },
    description: dict.brand.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const fonts = [manrope.variable, ...(locale === "ar" ? [plexArabic.variable, alexandria.variable] : [])];

  return (
    // suppressHydrationWarning: the script below adds a class to <html> before React hydrates.
    <html lang={locale} dir={dirOf(locale)} className={`${fonts.join(" ")} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-svh flex-col">
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <a href="#main" className="sr-only z-[60] rounded-full bg-ink px-5 py-3 font-bold text-paper focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
          {dict.nav.skip}
        </a>
        <MotionProvider>
          <Header
            locale={locale}
            labels={dict.nav}
            brand={{ name: dict.brand.name, tagline: dict.brand.tagline }}
            solutions={serviceKeys.map((key) => ({
              href: serviceHref(key),
              name: dict.services.items[key].name,
              short: dict.services.items[key].short,
            }))}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <MotionDirector />
        <JsonLd data={organizationJsonLd(locale)} />
      </body>
    </html>
  );
}
