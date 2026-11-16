import type { Metadata } from "next";
import { ColdRoomArt } from "@/components/ColdRoomArt";
import { InquirySection, PageHead, RelatedServices, RuledList, Section, Steps } from "@/components/ui";
import { serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): facility size, capacity, number of rooms, temperatures and cooling systems stay off this page until confirmed.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("coldStorage"), locale, dict.coldStorage.metaTitle, dict.coldStorage.metaDescription);
}

export default async function ColdStoragePage() {
  const dict = await getDictionary();
  const t = dict.coldStorage;

  return (
    <>
      <PageHead
        tone="cold"
        title={t.title}
        intro={t.intro}
        action={{ label: t.cta, anchor: true }}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.coldStorage.name, href: serviceHref("coldStorage") },
        ]}
      />
      <ColdRoomArt className="block aspect-[16/9] w-full md:aspect-[21/7]" />
      <Section title={t.howTitle}>
        <Steps columns={3} items={t.how} />
      </Section>
      <Section title={t.productsTitle} intro={t.productsBody} tone="sand">
        <RuledList items={t.products} large />
      </Section>
      <Section title={t.opsTitle} intro={t.opsBody} tone="cold">
        <RuledList items={t.ops} columns={3} />
      </Section>
      <Section title={t.fromTitle}>
        <RuledList items={t.from} columns={3} />
      </Section>
      <InquirySection intent="cold-storage" title={t.formTitle} />
      <RelatedServices keys={["business", "processing", "container"]} />
    </>
  );
}
