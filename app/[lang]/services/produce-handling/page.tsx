import type { Metadata } from "next";
import { CtaBand, PageHead, Photo, RelatedServices, Section, Steps } from "@/components/ui";
import { contactHref, serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("produce"), locale, dict.produce.metaTitle, dict.produce.metaDescription);
}

export default async function ProduceHandlingPage() {
  const dict = await getDictionary();
  const t = dict.produce;

  return (
    <>
      <PageHead
        tone="forest"
        title={t.title}
        intro={t.intro}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.produce.name, href: serviceHref("produce") },
        ]}
      />
      <Photo id="greensHarvest" priority parallax={6} sizes="100vw" position="50% 30%" className="aspect-[16/10] md:aspect-[21/8]" />
      <Section title={t.stepsTitle} intro={t.note}>
        <Steps columns={3} items={t.steps} />
      </Section>
      <CtaBand title={dict.services.items.produce.name} body={dict.services.items.produce.short} href={contactHref("processing")} label={t.cta} />
      <RelatedServices keys={["processing", "coldStorage", "sourcing"]} />
    </>
  );
}
