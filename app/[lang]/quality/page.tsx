import type { Metadata } from "next";
import { ButtonLink, PageHead, Photo, rise, Rows, Section, SectionHead } from "@/components/ui";
import { contactHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): no certificate is shown as held until its data or a copy is supplied.
// The list to verify is in docs/KHAIRAT-COMPANY-CONFIRMATION.md.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/quality", locale, dict.quality.metaTitle, dict.quality.metaDescription);
}

export default async function QualityPage() {
  const dict = await getDictionary();
  const t = dict.quality;

  return (
    <>
      <PageHead tone="forest" title={t.title} intro={t.intro} crumbs={[{ label: dict.nav.quality, href: "/quality" }]} />
      <Section title={t.pointsTitle}>
        <Rows items={t.points} />
      </Section>
      <Photo id="packingHands" sizes="100vw" className="aspect-[16/9] md:aspect-[3/1]" />
      <section id="certificates" className="chapter on-dark bg-charcoal text-paper">
        <div className="shell">
          <SectionHead title={t.certsTitle} />
          <p className="t-title mt-6 max-w-[70rem] !font-semibold md:!text-[2.5rem]" {...rise()}>
            {t.certsBody}
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end" {...rise(1)}>
            <p className="t-lead lg:col-span-8">{t.certsNote}</p>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <ButtonLink href={contactHref("partnership")}>{t.cta}</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
