import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { buildContent } from "@/lib/content";
import { alternatesFor } from "@/lib/i18n/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.servicesPage.metaTitle,
    description: dict.servicesPage.metaDescription,
    alternates: alternatesFor("/services", locale),
  };
}

export default async function ServicesPage() {
  const dict = await getDictionary();
  const { documents, process, services } = buildContent(dict);
  const t = dict.servicesPage;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro} image="/images/port.jpg" />

      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow={t.listEyebrow} title={t.listTitle} intro={t.listIntro} />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.title}
              spotlight
              delay={(i % 3) * 100}
              className="group flex flex-col rounded-3xl border border-line bg-surface p-8 transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-brand text-white transition duration-300 group-hover:-rotate-6 group-hover:bg-accent">
                <Icon name={s.icon} className="size-7" />
              </span>
              <h3 className="mt-7 font-display text-2xl text-brand-ink">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm font-semibold text-brand-ink/80">
                    <Icon name="check" className="size-4 shrink-0 text-accent" strokeWidth={2.4} />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Incoterms */}
      <section className="grain relative overflow-hidden bg-brand-ink py-24 text-white md:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading tone="light" eyebrow={t.termsEyebrow} title={t.termsTitle} intro={t.termsIntro} />
          <div className="space-y-4">
            {t.incoterms.map((term, i) => (
              <Reveal
                key={term.term}
                spotlight
                delay={i * 100}
                className="flex gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-[border-color] duration-300 [--spot-color:rgb(156_224_106/0.14)] hover:border-accent/40 md:p-8"
              >
                <span lang="en" dir="ltr" className="font-display text-4xl font-medium text-accent md:text-5xl">
                  {term.term}
                </span>
                <div>
                  <p className="font-bold">{term.name}</p>
                  <p className="mt-2 leading-relaxed text-white/65">{term.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process + documents */}
      <section className="container-x grid items-start gap-16 py-24 md:py-32 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t.processEyebrow} title={t.processTitle} />
          <ol className="mt-12 space-y-8 border-s border-line ps-8">
            {process.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 100} className="relative">
                <span className="absolute top-0 -start-[3.15rem] grid size-10 place-items-center rounded-full bg-brand font-display text-sm text-white ring-8 ring-background">
                  {p.step}
                </span>
                <h3 className="font-display text-2xl text-brand-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal delay={150} className="overflow-hidden rounded-[2rem] bg-sand/70">
          <div className="relative aspect-[16/9]">
            <Image src="/images/warehouse.jpg" alt={t.imageAlt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
          <div className="p-8 md:p-10">
            <p className="font-display text-2xl text-brand-ink">{t.docsTitle}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {documents.map((d) => (
                <li key={d} className="flex items-center gap-3 text-sm font-semibold text-brand-ink/80">
                  <Icon name="document" className="size-5 shrink-0 text-brand" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
