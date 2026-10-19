import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, CtaBand, isLocalImage, LocaleLink, PageHero, SectionHeading } from "@/components/ui";
import { locales } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/dictionaries";
import { alternatesFor } from "@/lib/i18n/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getCategories, getCategory } from "@/lib/strapi";

export async function generateStaticParams() {
  const slugs = new Set((await Promise.all(locales.map((l) => getCategories(l)))).flat().map((c) => c.slug));
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const category = await getCategory(slug, locale);
  if (!category) return {};
  return { title: category.name, description: category.summary, alternates: alternatesFor(`/products/${slug}`, locale) };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { slug } = await params;
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const [category, all] = await Promise.all([getCategory(slug, locale), getCategories(locale)]);
  if (!category) notFound();

  const t = dict.category;
  const others = all.filter((c) => c.slug !== category.slug);
  const quoteHref = (product: string) => `/contact?product=${encodeURIComponent(product)}`;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={category.name} intro={category.summary} image={category.image}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={quoteHref(category.name)}>{dict.common.requestQuote}</ButtonLink>
          <ButtonLink href="/products" variant="outline-light" arrow={false}>
            {dict.common.allProducts}
          </ButtonLink>
        </div>
      </PageHero>

      {/* Overview */}
      <section className="container-x grid gap-16 py-24 md:py-28 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionHeading eyebrow={t.overviewEyebrow} title={t.overviewTitle} intro={category.intro} />
          <Reveal delay={100} className="mt-10 flex items-start gap-4 rounded-2xl bg-accent-soft p-6">
            <Icon name="clock" className="mt-0.5 size-6 shrink-0 text-brand" />
            <div>
              <p className="font-bold text-brand-ink">{t.availability}</p>
              <p className="mt-1 text-muted">{category.season}</p>
            </div>
          </Reveal>
        </div>

        {category.specs.length > 0 && (
          <Reveal delay={150} className="self-start rounded-3xl bg-brand-ink p-8 text-white md:p-10">
            <p className="eyebrow">{t.specsEyebrow}</p>
            <dl className="mt-8 divide-y divide-white/10">
              {category.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[7rem_1fr] gap-4 py-4">
                  <dt className="text-sm font-semibold text-white/55">{s.label}</dt>
                  <dd className="text-sm leading-relaxed">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </section>

      {/* Range */}
      {category.products.length > 0 && (
        <section className="bg-sand/50 py-24 md:py-28">
          <div className="container-x">
            <SectionHeading
              eyebrow={t.rangeEyebrow}
              title={fill(t.rangeTitle, { name: locale === "en" ? category.name.toLowerCase() : category.name })}
            />
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {category.products.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.name}
                  delay={(i % 3) * 100}
                  spotlight
                  className="group overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-line transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5"
                >
                  {p.image ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        unoptimized={isLocalImage(p.image)}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="grid aspect-[16/10] place-items-center bg-linear-to-br from-brand to-brand-ink text-white/80 rtl:bg-linear-to-bl">
                      <Icon name={category.icon} className="size-14" strokeWidth={1} />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 p-6">
                    <div>
                      <h3 className="font-display text-xl text-brand-ink">{p.name}</h3>
                      {p.note && <p className="mt-1 text-sm text-muted">{p.note}</p>}
                    </div>
                    <LocaleLink
                      href={quoteHref(p.name)}
                      aria-label={`${dict.common.quoteFor} ${p.name}`}
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-brand transition hover:border-brand hover:bg-brand hover:text-white"
                    >
                      <Icon name="arrow" className="size-4" strokeWidth={2} />
                    </LocaleLink>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Other lines */}
      {others.length > 0 && (
        <section className="container-x pt-24 md:pt-28">
          <SectionHeading eyebrow={t.othersEyebrow} title={t.othersTitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {others.map((c, i) => (
              <Reveal key={c.slug} delay={i * 100}>
                <LocaleLink
                  href={`/products/${c.slug}`}
                  className="group flex items-center gap-5 rounded-3xl border border-line bg-surface p-5 transition hover:border-brand"
                >
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image src={c.image} alt="" fill sizes="80px" unoptimized={isLocalImage(c.image)} className="object-cover" />
                  </span>
                  <span className="flex-1 font-display text-xl text-brand-ink">{c.name}</span>
                  <Icon
                    name="arrow"
                    className="size-5 text-accent transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    strokeWidth={2}
                  />
                </LocaleLink>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
