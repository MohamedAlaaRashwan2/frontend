import type { Metadata } from "next";
import { ButtonLink, PageHead, Photo, RelatedServices, rise, Section, Steps } from "@/components/ui";
import { contactHref, serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("sourcing"), locale, dict.sourcing.metaTitle, dict.sourcing.metaDescription);
}

export default async function ProductSourcingPage() {
  const dict = await getDictionary();
  const t = dict.sourcing;

  return (
    <>
      <PageHead
        tone="amber"
        title={t.title}
        intro={t.intro}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.sourcing.name, href: serviceHref("sourcing") },
        ]}
      />
      <Photo id="harvest" priority parallax={6} sizes="100vw" position="50% 35%" className="aspect-[16/10] md:aspect-[21/8]" />
      {/* The page's shape is the relationship: two sides, each with its own way in. */}
      <section className="grid lg:grid-cols-2">
        <div className="on-dark bg-forest px-[var(--page-gutter)] py-12 text-paper lg:py-20" {...rise()}>
          <h2 className="t-title">{t.farmsTitle}</h2>
          <p className="t-lead mt-4 max-w-[34rem]">{t.farmsBody}</p>
          <div className="mt-6">
            <ButtonLink href={contactHref("supplier")}>{t.farmsCta}</ButtonLink>
          </div>
        </div>
        <div className="bg-sand px-[var(--page-gutter)] py-12 lg:py-20" {...rise(1)}>
          <h2 className="t-title">{t.buyersTitle}</h2>
          <p className="t-lead mt-4 max-w-[34rem]">{t.buyersBody}</p>
          <div className="mt-6">
            <ButtonLink href={contactHref("export")} variant="forest">
              {t.buyersCta}
            </ButtonLink>
          </div>
        </div>
      </section>
      <Section title={t.afterTitle}>
        <Steps columns={5} items={t.after.map((name) => ({ name }))} />
      </Section>
      <RelatedServices keys={["produce", "export", "privateLabel"]} />
    </>
  );
}
