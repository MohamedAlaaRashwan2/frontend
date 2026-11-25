import type { Metadata } from "next";
import { Words } from "@/components/motion/Words";
import { CtaBand, PageHead, Photo, rise, Rows, Section, Steps } from "@/components/ui";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): the founding year, management names and portraits can be added once supplied.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/about", locale, dict.about.metaTitle, dict.about.metaDescription);
}

export default async function AboutPage() {
  const dict = await getDictionary();
  const t = dict.about;

  return (
    <>
      <PageHead tone="forest" title={t.title} intro={t.intro} crumbs={[{ label: dict.nav.about, href: "/about" }]} />
      <Photo bleed id="wheatSunset" priority parallax={6} sizes="100vw" className="aspect-[16/10] md:aspect-[21/8]" />
      <section className="chapter bg-amber text-ink">
        <div className="shell">
          <h2 className="t-sub" {...rise()}>
            {t.positionTitle}
          </h2>
          <p data-read="" className="t-title mt-3 max-w-[70rem]">
            <Words text={t.position} />
          </p>
        </div>
      </section>
      <Section title={t.combineTitle}>
        <Steps columns={6} items={t.combine.map((name) => ({ name }))} />
      </Section>
      <Section title={t.whyTitle} tone="sand">
        <Rows items={t.why} />
      </Section>
      <CtaBand title={dict.brand.titleSuffix} href="/contact" label={t.cta} tone="ink" />
    </>
  );
}
