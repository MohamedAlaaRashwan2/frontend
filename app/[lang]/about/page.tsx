import type { Metadata } from "next";
import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { buildContent } from "@/lib/content";
import { fill } from "@/lib/i18n/dictionaries";
import { alternatesFor } from "@/lib/i18n/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { getStats } from "@/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.about.metaTitle,
    description: fill(dict.about.metaDescription, { year: site.founded }),
    alternates: alternatesFor("/about", locale),
  };
}

export default async function AboutPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const stats = await getStats(locale);
  const { markets, values } = buildContent(dict);
  const t = dict.about;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={fill(t.intro, { year: site.founded })} image="/images/wheat-sunset.jpg" />

      {/* Story */}
      <section className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionHeading eyebrow={t.storyEyebrow} title={t.storyTitle} />
          <Reveal delay={100} className="mt-8 space-y-6 text-lg leading-relaxed text-muted">
            {t.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{fill(paragraph, { year: site.founded })}</p>
            ))}
          </Reveal>
        </div>
        <Reveal delay={150} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image src="/images/crops.jpg" alt={t.storyImageAlt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
          <blockquote className="absolute inset-x-6 -bottom-8 rounded-2xl bg-brand p-7 text-white shadow-2xl shadow-brand/30 md:start-auto md:-end-6 md:max-w-sm">
            <p className="font-display text-xl leading-snug">{t.quote}</p>
            <footer className="mt-4 text-xs font-semibold tracking-wider text-white/60 uppercase rtl:text-sm">{t.quoteBy}</footer>
          </blockquote>
        </Reveal>
      </section>

      {/* Numbers */}
      <section className="border-y border-line bg-surface">
        <dl className="container-x grid grid-cols-2 divide-line py-14 lg:grid-cols-4 lg:divide-x">
          {stats.slice(0, 4).map((s) => (
            <div key={s.label} className="px-4 py-4 text-center lg:px-8">
              <dd className="font-display text-5xl font-medium text-brand md:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-3 text-xs font-bold tracking-wider text-muted uppercase rtl:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Mission & vision */}
      <section className="container-x grid gap-6 py-24 md:grid-cols-2 md:py-32">
        {[
          { label: t.mission, text: t.missionText },
          { label: t.vision, text: t.visionText },
        ].map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 120}
            className={`rounded-[2rem] p-10 md:p-14 ${i === 0 ? "bg-brand-ink text-white" : "bg-sand/70 text-brand-ink"}`}
          >
            <p className="eyebrow">{item.label}</p>
            <p className="mt-6 font-display text-3xl leading-snug text-balance md:text-4xl">{item.text}</p>
          </Reveal>
        ))}
      </section>

      {/* Values */}
      <section className="bg-sand/50 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow={t.valuesEyebrow} title={t.valuesTitle} />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                spotlight
                delay={i * 100}
                className="group rounded-3xl bg-surface p-8 shadow-sm ring-1 ring-line transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon name={v.icon} className="size-7" />
                </span>
                <h3 className="mt-7 font-display text-2xl text-brand-ink">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footprint */}
      <section className="container-x grid items-center gap-16 py-24 md:py-32 lg:grid-cols-2">
        <Reveal className="relative aspect-[16/11] overflow-hidden rounded-[2rem]">
          <Image src="/images/warehouse.jpg" alt={t.footprintImageAlt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
        </Reveal>
        <div>
          <SectionHeading eyebrow={t.footprintEyebrow} title={t.footprintTitle} intro={t.footprintIntro} />
          <Reveal delay={100}>
            <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {markets.map((m) => (
                <li key={m.region} className="flex items-center gap-3 font-semibold text-brand-ink">
                  <Icon name="check" className="size-5 text-accent" strokeWidth={2.2} />
                  {m.region}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
