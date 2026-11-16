import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHead, Photo, Rows, Section } from "@/components/ui";
import { contactHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): replace with real photography: exterior, cold rooms, storage, line, packing, loading, containers, products, team.
// Facility size and room count are added once confirmed.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/facility", locale, dict.facility.metaTitle, dict.facility.metaDescription);
}

export default async function FacilityPage() {
  const dict = await getDictionary();
  const t = dict.facility;
  const mapQuery = encodeURIComponent(`${dict.brand.street}, ${dict.brand.region}, ${dict.brand.country}`);

  return (
    <>
      <PageHead title={t.title} intro={t.intro} crumbs={[{ label: dict.nav.facility, href: "/facility" }]} />
      <section className="bg-amber py-8 text-ink md:py-12">
        <div className="shell flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p className="t-title">{dict.brand.address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 font-bold underline underline-offset-4 hover:no-underline"
          >
            <Icon name="pin" className="size-5" />
            {t.mapLink}
          </a>
        </div>
      </section>
      <Photo id="warehouse" sizes="100vw" className="aspect-[16/10] md:aspect-[21/8]" />
      <Section title={t.zonesTitle}>
        <Rows items={t.zones} />
      </Section>
      <CtaBand title={dict.brand.titleSuffix} href={contactHref("partnership")} label={t.cta} />
    </>
  );
}
