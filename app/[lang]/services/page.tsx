import type { Metadata } from "next";
import { Words } from "@/components/motion/Words";
import { ChainScroll } from "@/components/ChainScroll";
import { ServiceIndex } from "@/components/ServiceIndex";
import { CtaBand, PageHead, rise } from "@/components/ui";
import { contactHref, serviceHref, serviceKeys, serviceVisual } from "@/lib/content";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/services", locale, dict.services.metaTitle, dict.services.metaDescription);
}

export default async function ServicesPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.services;

  return (
    <>
      <PageHead title={t.title} intro={t.intro} crumbs={[{ label: dict.nav.services, href: "/services" }]} />
      <section className="chapter">
        <div className="shell">
          <ServiceIndex
            illustrative={dict.common.illustrative}
            rows={serviceKeys.map((key) => {
              const { image, art } = serviceVisual(key);
              return {
                key,
                href: localizePath(serviceHref(key), locale),
                name: t.items[key].name,
                short: t.items[key].short,
                image: image && { src: image.src, alt: image[locale], illustrative: image.kind === "operations" },
                art,
              };
            })}
          />
        </div>
      </section>
      <section className="chapter on-dark bg-charcoal text-paper">
        <div className="shell grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <h2 data-split="" className="t-title">
                <Words text={dict.chain.title} />
              </h2>
              <p className="t-lead mt-4" {...rise(1)}>
                {dict.chain.note}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ChainScroll stages={dict.stages} locale={locale} />
          </div>
        </div>
      </section>
      <CtaBand title={t.ctaTitle} body={t.ctaBody} href={contactHref("partnership")} label={dict.common.contactUs} />
    </>
  );
}
