import type { Metadata } from "next";
import { Words } from "@/components/motion/Words";
import { Breadcrumbs, CtaBand, Photo, RelatedServices, Section, Steps } from "@/components/ui";
import { contactHref, serviceHref } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";

// TODO(company-confirm): the weekly container count stays off this page until management confirms it.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata(serviceHref("container"), locale, dict.container.metaTitle, dict.container.metaDescription);
}

export default async function ContainerLoadingPage() {
  const dict = await getDictionary();
  const t = dict.container;

  return (
    <>
      {/* The picture comes first here: this page is about the moment the goods leave. */}
      <section data-hero="">
        <Photo bleed id="cranes" priority parallax={6} sizes="100vw" position="50% 45%" className="aspect-[16/10] md:aspect-[21/8]" />
        <div className="shell py-8 md:py-12">
          <div data-hero-item="">
            <Breadcrumbs
              items={[
                { label: dict.nav.services, href: "/services" },
                { label: dict.services.items.container.name, href: serviceHref("container") },
              ]}
            />
          </div>
          <h1 data-hero-title="" className="t-display mt-6">
            <Words text={t.title} />
          </h1>
          <p data-hero-item="" className="t-lead mt-5 max-w-[46rem]">
            {t.intro}
          </p>
        </div>
      </section>
      <Section title={t.stepsTitle} tone="ink">
        <Steps items={t.steps} />
      </Section>
      <CtaBand title={t.whyTitle} body={t.whyBody} href={contactHref("exporter")} label={t.cta} tone="amber" />
      <RelatedServices keys={["export", "coldStorage", "business"]} />
    </>
  );
}
