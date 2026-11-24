import type { Metadata } from "next";
import { InquirySection, PageHead, Photo, RelatedServices, rise, Section, Steps } from "@/components/ui";
import { serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("business"), locale, dict.business.metaTitle, dict.business.metaDescription);
}

export default async function BusinessStoragePage() {
  const dict = await getDictionary();
  const t = dict.business;

  return (
    <>
      <PageHead
        tone="paper"
        title={t.title}
        intro={t.intro}
        action={{ label: t.cta, anchor: true }}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.business.name, href: serviceHref("business") },
        ]}
      />
      <Photo id="warehouse" priority parallax={6} sizes="100vw" className="aspect-[16/10] md:aspect-[21/8]" />
      <Section title={t.exampleTitle}>
        <Steps columns={3} items={t.example} />
      </Section>
      <section className="on-dark bg-cold py-12 text-paper md:py-20">
        <div className="shell">
          <h2 className="t-sub" {...rise()}>
            {t.benefitTitle}
          </h2>
          <p className="t-title mt-3 max-w-[64rem]" {...rise(1)}>
            {t.benefit}
          </p>
        </div>
      </section>
      <InquirySection intent="cold-storage" title={t.cta} />
      <RelatedServices keys={["coldStorage", "container", "export"]} />
    </>
  );
}
