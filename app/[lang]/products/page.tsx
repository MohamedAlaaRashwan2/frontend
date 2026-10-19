import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { CtaBand, LocaleLink, PageHero } from "@/components/ui";
import type { IconName } from "@/lib/content";
import { alternatesFor } from "@/lib/i18n/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getCategories } from "@/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.productsPage.metaTitle,
    description: dict.productsPage.metaDescription,
    alternates: alternatesFor("/products", locale),
  };
}

const extraIcons: IconName[] = ["box", "tag", "ship"];

export default async function ProductsPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const categories = await getCategories(locale);
  const t = dict.productsPage;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro} image="/images/vegetables.jpg">
        <ul className="mt-10 flex flex-wrap gap-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <LocaleLink
                href={`/products/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-accent hover:bg-accent hover:text-white"
              >
                <Icon name={c.icon} className="size-4" />
                {c.name}
              </LocaleLink>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="container-x py-24 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 2) * 120}>
              <CategoryCard category={c} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 grid gap-8 rounded-3xl border border-line bg-surface p-8 md:grid-cols-3 md:p-12">
          {t.extras.map((extra, i) => (
            <div key={extra.title} className="flex gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-brand">
                <Icon name={extraIcons[i]} className="size-6" />
              </span>
              <div>
                <p className="font-display text-xl text-brand-ink">{extra.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{extra.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
