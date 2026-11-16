import type { Metadata } from "next";
import { ArrowLink, InquirySection, PageHead, RelatedServices, rise, RuledList, Section, Steps } from "@/components/ui";
import { serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("privateLabel"), locale, dict.privateLabel.metaTitle, dict.privateLabel.metaDescription);
}

export default async function PrivateLabelPage() {
  const dict = await getDictionary();
  const t = dict.privateLabel;

  return (
    <>
      <PageHead
        tone="amber"
        title={t.title}
        intro={t.intro}
        action={{ label: t.cta, anchor: true }}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: dict.services.items.privateLabel.name, href: serviceHref("privateLabel") },
        ]}
      />
      <Section title={t.flowTitle}>
        <Steps columns={6} highlight={3} items={t.flow.map((name) => ({ name }))} />
      </Section>
      <Section title={t.includesTitle} tone="ink">
        <RuledList items={t.includes} columns={3} />
      </Section>
      <Section title={t.modelsTitle} tone="sand">
        <div className="grid gap-8 md:grid-cols-2">
          {t.models.map((model, i) => (
            <div key={model.title} {...rise(i)}>
              <h3 className="t-sub">{model.title}</h3>
              <p className="t-lead mt-2">{model.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <ArrowLink href="/products">{dict.nav.products}</ArrowLink>
        </div>
      </Section>
      <InquirySection intent="private-label" title={t.formTitle} tone="paper" />
      <RelatedServices keys={["sourcing", "processing", "export"]} />
    </>
  );
}
