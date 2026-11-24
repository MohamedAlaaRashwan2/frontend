import type { Metadata } from "next";
import { Words } from "@/components/motion/Words";
import { ExportRoutes } from "@/components/ExportRoutes";
import { InquirySection, PageHead, Photo, RelatedServices, rise, RuledList, Section } from "@/components/ui";
import { serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): add the countries KHAIRAT currently exports to, container capacity, trade terms and export documents once confirmed.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("export"), locale, dict.exportTrade.metaTitle, dict.exportTrade.metaDescription);
}

export default async function ExportSolutionsPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.exportTrade;

  return (
    <>
      <PageHead
        title={t.title}
        intro={t.intro}
        action={{ label: t.cta, anchor: true }}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.export.name, href: serviceHref("export") },
        ]}
      />
      <Photo id="vessel" priority parallax={6} sizes="100vw" position="50% 60%" className="aspect-[16/10] md:aspect-[21/8]" />
      <Section title={dict.markets.label} intro={t.coverTitle}>
        <ExportRoutes locale={locale} />
        <div className="mt-10">
          <RuledList items={t.cover} columns={3} />
        </div>
      </Section>
      <section className="grid lg:grid-cols-2">
        <div className="on-dark bg-forest px-[var(--page-gutter)] py-12 text-paper lg:py-20">
          <h2 data-split="" className="t-title">
            <Words text={t.importersTitle} />
          </h2>
          <ul className="mt-6">
            {t.importers.map((item) => (
              <li key={item} className="border-t border-current/40 py-2.5 font-semibold" {...rise()}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-sand px-[var(--page-gutter)] py-12 lg:py-20">
          <h2 data-split="" className="t-title">
            <Words text={t.exportersTitle} />
          </h2>
          <ul className="mt-6">
            {t.exporters.map((item) => (
              <li key={item} className="border-t border-current/40 py-2.5 font-semibold" {...rise()}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <InquirySection intent="export" title={t.formTitle} tone="paper" aside={<p>{t.termsNote}</p>} />
      <RelatedServices keys={["container", "coldStorage", "privateLabel"]} />
    </>
  );
}
