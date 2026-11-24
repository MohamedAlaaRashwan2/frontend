import type { Metadata } from "next";
import { Words } from "@/components/motion/Words";
import { InquirySection, PageHead, Photo, RelatedServices } from "@/components/ui";
import { serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): name processing technologies (IQF etc.) only once confirmed.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("processing"), locale, dict.processing.metaTitle, dict.processing.metaDescription);
}

export default async function FoodProcessingPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.processing;

  return (
    <>
      <PageHead
        title={t.title}
        intro={t.intro}
        action={{ label: t.cta, anchor: true }}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.processing.name, href: serviceHref("processing") },
        ]}
      />
      {/* The picture holds still while the stages pass beside it. */}
      <section className="grid lg:grid-cols-2">
        <div className="lg:sticky lg:top-[var(--header-height)] lg:h-[calc(100svh-var(--header-height))]">
          <Photo id="sortingFruit" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/10] lg:aspect-auto lg:h-full" />
        </div>
        <div className="px-[var(--page-gutter)] py-10 lg:py-16">
          <h2 data-split="" className="t-title">
            <Words text={t.stepsTitle} />
          </h2>
          <ol className="mt-6">
            {t.steps.map((step, i) => (
              <li key={step} className="flex items-baseline gap-4 border-t-2 border-current py-3 md:py-4" data-rise="side">
                <span className="t-small font-bold">{(i + 1).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { minimumIntegerDigits: 2, useGrouping: false })}</span>
                <span className="t-sub">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6">{t.note}</p>
        </div>
      </section>
      <InquirySection intent="processing" title={t.formTitle} />
      <RelatedServices keys={["produce", "privateLabel", "coldStorage"]} />
    </>
  );
}
