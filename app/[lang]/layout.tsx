import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans_Arabic, Manrope, Noto_Naskh_Arabic } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { introScript, SiteLoader } from "@/components/SiteLoader";
import { dirOf, locales } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/i18n/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Arabic faces carry only the Arabic subset; Latin words inside Arabic text fall back to Manrope / Fraunces.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const naskhArabic = Noto_Naskh_Arabic({
  variable: "--font-naskh-arabic",
  subsets: ["arabic"],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const title = `${dict.brand.name} — ${dict.brand.titleSuffix}`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: title, template: `%s · ${dict.brand.name}` },
    description: dict.brand.description,
    alternates: alternatesFor("/", locale),
    openGraph: {
      type: "website",
      siteName: dict.brand.name,
      title,
      description: dict.brand.description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: ["/images/hero.jpg"],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const fonts = [manrope.variable, fraunces.variable, ...(locale === "ar" ? [plexArabic.variable, naskhArabic.variable] : [])];

  return (
    // suppressHydrationWarning: the intro script sets html[data-intro] before React hydrates.
    <html lang={locale} dir={dirOf(locale)} className={`${fonts.join(" ")} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {/* Decides before first paint whether this visit plays the intro loader. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`[data-reveal],[data-reveal] span{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-brand px-5 py-3 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {dict.nav.skip}
        </a>
        <MotionProvider>
          <SiteLoader name={dict.brand.name} tagline={dict.brand.logoTagline} label={dict.loader.label} />
          <Header
            locale={locale}
            labels={{ ...dict.nav, requestQuote: dict.common.requestQuote }}
            brand={{ name: dict.brand.name, tagline: dict.brand.logoTagline }}
            contact={site.contact}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
