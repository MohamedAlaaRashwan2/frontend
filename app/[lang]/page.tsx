import type { Metadata } from "next";
import { ChainScroll } from "@/components/ChainScroll";
import { ExportRoutes } from "@/components/ExportRoutes";
import { HeroStage } from "@/components/HeroStage";
import { Icon } from "@/components/Icon";
import { ServiceIndex } from "@/components/ServiceIndex";
import { ArrowLink, ButtonLink, LocaleLink, Photo, rise, Section, SectionHead, Steps, RuledList } from "@/components/ui";
import { contactHref, images, productMeta, serviceHref, serviceImage, serviceKeys } from "@/lib/content";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import type { InquiryIntent } from "@/lib/inquiry";
import { pageMetadata } from "@/lib/seo";
import { getProductPhotos } from "@/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/", locale, dict.home.metaTitle, dict.brand.description);
}

export default async function Home() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const photos = await getProductPhotos();
  const t = dict.home;

  return (
    <>
      {/* 1. What KHAIRAT is, and the facts behind it. */}
      <HeroStage image={{ src: images.greensRows.src, alt: images.greensRows[locale], position: "50% 75%" }}>
        <div className="max-w-[60rem] pb-8 lg:pb-12">
          <h1 className="hero-rise t-display" style={{ "--hero-delay": "80ms" } as React.CSSProperties}>
            {t.heroTitle}
          </h1>
          <p className="hero-rise t-lead mt-5 max-w-[38rem]" style={{ "--hero-delay": "180ms" } as React.CSSProperties}>
            {t.heroBody}
          </p>
          <div className="hero-rise mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap" style={{ "--hero-delay": "280ms" } as React.CSSProperties}>
            <ButtonLink href="/services">{dict.common.exploreServices}</ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              {dict.common.contactUs}
            </ButtonLink>
          </div>
        </div>
        <dl className="hero-rise grid grid-cols-2 gap-x-6 gap-y-4 border-t-4 border-paper pt-4 lg:grid-cols-4" style={{ "--hero-delay": "380ms" } as React.CSSProperties}>
          {t.facts.map((fact) => (
            <div key={fact.title}>
              <dt className="font-display leading-snug font-bold md:text-xl">{fact.title}</dt>
              <dd className="t-small mt-0.5">{fact.body}</dd>
            </div>
          ))}
        </dl>
      </HeroStage>

      {/* 2. Importers first: markets, then products with a direct way to ask for a quote. */}
      <Section title={t.exportTitle} intro={t.exportBody} head={<ButtonLink href={contactHref("export")} variant="forest">{dict.common.exportQuote}</ButtonLink>}>
        <div {...rise()}>
          <ExportRoutes />
        </div>
        <div className="mt-10 flex items-end justify-between gap-4 md:mt-14">
          <h3 className="t-sub">{t.productsLabel}</h3>
          <ArrowLink href="/products">{t.productsAll}</ArrowLink>
        </div>
        {/* Swipes sideways on phones, which keeps the section short. */}
        <ul tabIndex={0} aria-label={t.productsLabel} className="-mx-[var(--page-gutter)] mt-4 flex snap-x gap-2 overflow-x-auto px-[var(--page-gutter)] pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
          {productMeta.map((p, i) => {
            const name = dict.productsPage.items[p.slug];
            return (
              <li key={p.slug} className="w-[42vw] shrink-0 snap-start sm:w-[28vw] lg:w-auto" {...rise(i)}>
                <LocaleLink href={contactHref("export", name)} className="group block">
                  <Photo id={p.image} src={photos[p.slug]} alt={name} sizes="(min-width: 1024px) 16vw, 42vw" className="aspect-[4/5]" />
                  <span className="mt-2 block font-display font-bold group-hover:underline group-hover:underline-offset-4">{name}</span>
                  <span className="t-small block">{t.productQuote}</span>
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* 3. The chain: the line fills as you scroll. */}
      <section className="chapter on-dark bg-charcoal text-paper">
        <div className="shell grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <span data-rule="" className="rule" aria-hidden="true" />
              <h2 className="t-title mt-5" {...rise()}>
                {dict.chain.title}
              </h2>
              <p className="t-lead mt-4" {...rise(1)}>
                {dict.chain.intro}
              </p>
              <p className="mt-4" {...rise(2)}>
                {dict.chain.note}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ChainScroll stages={dict.stages} locale={locale} />
          </div>
        </div>
      </section>

      {/* 4. All services, one index. */}
      <Section title={t.servicesTitle} intro={t.servicesBody}>
        <ServiceIndex
          illustrative={dict.common.illustrative}
          rows={serviceKeys.map((key) => {
            const image = key === "coldStorage" ? undefined : images[serviceImage[key]];
            return {
              key,
              href: localizePath(serviceHref(key), locale),
              name: dict.services.items[key].name,
              short: dict.services.items[key].short,
              image: image && { src: image.src, alt: image[locale], illustrative: image.kind === "operations" },
            };
          })}
        />
      </Section>

      {/* 5. The two brand models. */}
      <Section title={t.modelsTitle} tone="amber">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {[
            { ...t.privateLabel, href: serviceHref("privateLabel") },
            { ...t.khairatBrand, href: "/products" },
          ].map((model, i) => (
            <div key={model.title} {...rise(i)}>
              <h3 className="t-title" dir="ltr" style={{ textAlign: "start" }}>
                {model.title}
              </h3>
              <p className="t-lead mt-3 max-w-[32rem]">{model.body}</p>
              <div className="mt-5">
                <ButtonLink href={model.href} variant={i === 0 ? "ink" : "outline-dark"}>
                  {model.cta}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 md:mt-14">
          <Steps columns={6} highlight={3} items={t.flow.map((name) => ({ name }))} />
        </div>
      </Section>

      {/* 6. Facility and quality together: the physical proof. */}
      <section className="on-dark bg-forest text-paper">
        <div className="grid lg:grid-cols-2">
          <Photo id="warehouse" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] lg:aspect-auto lg:min-h-[44rem]" />
          <div className="px-[var(--page-gutter)] py-12 lg:py-20">
            <span data-rule="" className="rule" aria-hidden="true" />
            <h2 className="t-title mt-5" {...rise()}>
              {t.facilityTitle}
            </h2>
            <p className="t-lead mt-4 max-w-[36rem]" {...rise(1)}>
              {t.facilityBody}
            </p>
            <div className="mt-3" {...rise(2)}>
              <ArrowLink href="/facility">{t.facilityLink}</ArrowLink>
            </div>
            <h3 className="t-sub mt-10">{t.qualityTitle}</h3>
            <div className="mt-3">
              <RuledList items={dict.quality.points.map((p) => p.title)} />
            </div>
            <div className="mt-3">
              <ArrowLink href="/quality">{t.qualityLink}</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Every visitor's next step. */}
      <section className="chapter bg-sand text-ink">
        <div className="shell">
          <SectionHead title={t.routesTitle} />
          <ul className="mt-6">
            {t.routes.map((route, i) => (
              <li key={route.intent} className="border-t-2 border-current first:border-t-0" {...rise(i)}>
                <LocaleLink href={contactHref(route.intent as InquiryIntent)} className="arrow-nudge flex items-center justify-between gap-6 py-4 md:py-5">
                  <span className="t-title !font-bold md:!text-[2.5rem]">{route.label}</span>
                  <Icon name="arrow" className="size-7 shrink-0" strokeWidth={2.25} />
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
