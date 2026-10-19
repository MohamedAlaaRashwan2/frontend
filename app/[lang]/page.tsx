import Image from "next/image";
import { CategoryCard } from "@/components/CategoryCard";
import { CountUp } from "@/components/CountUp";
import { HeroGlobe } from "@/components/HeroGlobe";
import { Icon } from "@/components/Icon";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, CtaBand, Faq, LocaleLink, SectionHeading } from "@/components/ui";
import { buildContent } from "@/lib/content";
import { fill } from "@/lib/i18n/dictionaries";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { getCategories, getCompanyDescription, getStats } from "@/lib/strapi";

export default async function Home() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const [categories, stats, description] = await Promise.all([
    getCategories(locale),
    getStats(locale),
    getCompanyDescription(locale),
  ]);
  const { documents, faqs, markets, pillars, process } = buildContent(dict);
  const t = dict.home;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-brand-ink text-white">
        <Parallax distance={160}>
          <Image src="/images/hero.jpg" alt={t.heroImageAlt} fill priority sizes="100vw" className="animate-slow-zoom object-cover" />
        </Parallax>
        <div
          className="absolute inset-0 -z-10 bg-linear-to-r from-brand-ink/95 via-brand-ink/70 to-brand-ink/10 lg:via-brand-ink/85 lg:to-brand-ink/75 rtl:bg-linear-to-l"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-brand-ink to-transparent" aria-hidden="true" />

        <div className="container-x grid flex-1 items-center gap-8 pt-36 pb-16 lg:grid-cols-[1.1fr_1fr] lg:pt-32 lg:pb-10">
          <div>
            <Reveal>
              <p className="eyebrow">{fill(t.heroEyebrow, { year: site.founded })}</p>
            </Reveal>
            <AnimatedText
              as="h1"
              trigger="mount"
              delay={0.15}
              stagger={0.06}
              segments={[{ text: t.heroTitleStart }, { text: t.heroTitleAccent, className: "text-accent" }, { text: t.heroTitleEnd }]}
              className="mt-7 max-w-4xl font-display text-[2.9rem] leading-[1.02] font-medium tracking-tight text-balance sm:text-6xl xl:text-[5.25rem]"
            />
            <Reveal delay={450}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-pretty text-white/75">{description}</p>
            </Reveal>
            <Reveal delay={600} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/contact">{dict.common.requestQuote}</ButtonLink>
              <ButtonLink href="/products" variant="outline-light">
                {dict.common.exploreProducts}
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={300} className="hidden lg:block">
            <HeroGlobe />
          </Reveal>
        </div>

        <Reveal delay={750} className="container-x pb-10">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md lg:grid-cols-4">
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} className="bg-brand-ink/40 px-6 py-6  md:px-8">
                <dt className="text-xs font-semibold tracking-wider text-white/60 uppercase rtl:text-sm">{s.label}</dt>
                <dd className="mt-2 font-display text-4xl font-medium md:text-5xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                 
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Markets ticker */}
      <section aria-label={t.marketsLabel} className="overflow-hidden border-b border-line bg-surface py-6">
        <div className="animate-marquee flex w-max gap-12 pe-12">
          {[...markets, ...markets].map((m, i) => (
            <span
              key={i}
              aria-hidden={i >= markets.length || undefined}
              className="flex items-center gap-12 font-display text-xl whitespace-nowrap text-brand-ink/70"
            >
              {m.region}
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="container-x grid items-center gap-16 py-24 md:py-32 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:me-24">
            <Image src="/images/fields.jpg" alt={t.aboutImageAlt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div className="absolute end-0 -bottom-10 hidden aspect-square w-60 overflow-hidden rounded-3xl border-8 border-background sm:block">
            <Image src="/images/port.jpg" alt={t.portImageAlt} fill sizes="240px" className="object-cover" />
          </div>
          <div className="absolute top-8 -start-4 rounded-2xl bg-brand px-6 py-5 text-white shadow-2xl shadow-brand/30 md:-start-8">
            <p className="font-display text-4xl font-medium">
              <bdi dir="ltr">
                {new Date().getFullYear() - site.founded}
                {dict.common.yearsSuffix}
              </bdi>
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-white/70 uppercase rtl:text-sm">{t.yearsExporting}</p>
          </div>
        </Reveal>

        <div>
          <SectionHeading eyebrow={t.aboutEyebrow} title={t.aboutTitle} intro={t.aboutIntro} />
          <Reveal delay={100}>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3">
              {t.aboutPoints.map((point) => (
                <li key={point.title} className="border-t-2 border-accent pt-5">
                  <p className="font-bold text-brand-ink">{point.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <ButtonLink href="/about" variant="outline-dark">
                {dict.common.ourStory}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product lines */}
      <section className="bg-sand/60 py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={t.linesEyebrow} title={fill(t.linesTitle, { count: categories.length })} intro={t.linesIntro} />
            <Reveal>
              <ButtonLink href="/products" variant="outline-dark">
                {dict.common.allProducts}
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 2) * 120}>
                <CategoryCard category={c} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="grain relative overflow-hidden bg-brand-ink py-24 text-white md:py-32">
        <div className="absolute top-0 -start-40 -z-10 size-[32rem] rounded-full bg-brand/60 blur-3xl" aria-hidden="true" />
        <div className="container-x">
          <SectionHeading tone="light" align="center" eyebrow={t.whyEyebrow} title={t.whyTitle} />
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal
                key={p.title}
                spotlight
                delay={(i % 3) * 100}
                className="group bg-brand-ink p-8 transition-colors [--spot-color:rgb(156_224_106/0.13)] hover:bg-brand-deep md:p-10"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-accent/15 text-accent transition duration-300 group-hover:-translate-y-1 group-hover:bg-accent group-hover:text-white">
                  <Icon name={p.icon} className="size-7" />
                </span>
                <h3 className="mt-7 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-white/65">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow={t.processEyebrow} title={t.processTitle} intro={t.processIntro} />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <span className="absolute inset-x-0 top-7 hidden h-px bg-line lg:block" aria-hidden="true" />
          {process.map((p, i) => (
            <Reveal as="li" key={p.step} delay={i * 120} className="relative">
              <span className="relative grid size-14 place-items-center rounded-full bg-brand font-display text-lg text-white ring-8 ring-background transition duration-300 hover:scale-110 hover:bg-accent">
                {p.step}
              </span>
              <h3 className="mt-7 font-display text-2xl text-brand-ink">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Markets */}
      <section className="relative isolate overflow-hidden bg-brand py-24 text-white md:py-32">
        <Image src="/images/cranes.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-20 mix-blend-luminosity" />
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading tone="light" eyebrow={t.reachEyebrow} title={t.reachTitle} intro={t.reachIntro} />
            <Reveal delay={100} className="mt-10">
              <ButtonLink href="/services">{dict.common.logisticsServices}</ButtonLink>
            </Reveal>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {markets.map((m, i) => (
              <Reveal
                as="li"
                key={m.region}
                spotlight
                delay={(i % 2) * 100}
                className="rounded-2xl border border-white/15 bg-brand-ink/30 p-6 backdrop-blur-sm transition-[translate,border-color] duration-300 [--spot-color:rgb(156_224_106/0.16)] hover:-translate-y-1 hover:border-accent/60"
              >
                <div className="flex items-center gap-3">
                  <Icon name="globe" className="size-5 text-accent" />
                  <h3 className="font-display text-xl">{m.region}</h3>
                </div>
                <p className="mt-3 text-sm text-white/60">{m.hubs}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Documentation */}
      <section className="border-b border-line bg-surface">
        <div className="container-x flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:gap-16">
          <div className="shrink-0">
            <p className="eyebrow">{t.docsEyebrow}</p>
            <p className="mt-3 font-display text-3xl text-brand-ink">{t.docsTitle}</p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {documents.map((d) => (
              <li
                key={d}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-brand-ink/80 transition hover:border-accent hover:bg-accent-soft"
              >
                <Icon name="check" className="size-4 text-accent" strokeWidth={2.2} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading eyebrow={t.faqEyebrow} title={t.faqTitle} intro={t.faqIntro} />
          <Reveal delay={100} className="mt-10 rounded-3xl bg-sand/70 p-8">
            <p className="font-display text-2xl text-brand-ink">{t.deskTitle}</p>
            <div className="mt-6 space-y-4 text-sm">
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 font-semibold text-brand hover:text-accent">
                <Icon name="mail" className="size-5" />
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
              <a href={`tel:${site.contact.phoneHref}`} className="flex items-center gap-3 font-semibold text-brand hover:text-accent">
                <Icon name="phone" className="size-5" />
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>
            </div>
            <LocaleLink href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:text-accent">
              {t.openForm} <Icon name="arrow" className="size-4" strokeWidth={2} />
            </LocaleLink>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <Faq items={faqs} />
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
