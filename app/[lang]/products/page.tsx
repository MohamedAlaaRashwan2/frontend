import type { Metadata } from "next";
import { ButtonLink, LocaleLink, PageHead, Photo, rise, RuledList, Section } from "@/components/ui";
import { contactHref, productMeta } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import type { InquiryIntent } from "@/lib/inquiry";
import { pageMetadata } from "@/lib/seo";
import { getProductPhotos } from "@/lib/strapi";

// TODO(company-confirm): add confirmed form, season, packaging and specifications per product, and final brand names.
// Product structured data is deliberately absent until those details exist.

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/products", locale, dict.productsPage.metaTitle, dict.productsPage.metaDescription);
}

export default async function ProductsPage() {
  const dict = await getDictionary();
  const photos = await getProductPhotos();
  const t = dict.productsPage;
  const groups = ["fruit", "vegetables"] as const;

  return (
    <>
      <PageHead title={t.title} intro={t.intro} crumbs={[{ label: dict.nav.products, href: "/products" }]} />
      {groups.map((group) => (
        <Section key={group} title={t.groups[group]} tone={group === "fruit" ? "paper" : "sand"}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-7 lg:grid-cols-4">
            {productMeta
              .filter((p) => p.group === group)
              .map((p, i) => (
                <li key={p.slug} id={p.slug} {...rise(i)}>
                  <LocaleLink href={contactHref("export", t.items[p.slug])} className="group block">
                    <Photo id={p.image} src={photos[p.slug]} alt={t.items[p.slug]} sizes="(min-width: 1024px) 24vw, 48vw" className="aspect-[4/5]" />
                    <h3 className="t-sub mt-3 group-hover:underline group-hover:underline-offset-4">{t.items[p.slug]}</h3>
                    <span className="t-small font-semibold">{t.quote}</span>
                  </LocaleLink>
                </li>
              ))}
            {group === "fruit" && (
              <li className="col-span-2 flex items-end border-t-2 border-current pt-3 lg:col-span-4" {...rise()}>
                <LocaleLink href={contactHref("export", t.items["seasonal-fruit"])} className="t-sub inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline">
                  {t.items["seasonal-fruit"]}
                </LocaleLink>
              </li>
            )}
          </ul>
        </Section>
      ))}
      <Section title={t.otherTitle} intro={t.otherBody} tone="ink">
        <RuledList items={t.other} columns={3} />
      </Section>
      {/* The two brand models, each with its own way in. */}
      <section className="grid lg:grid-cols-2">
        {t.models.map((m, i) => (
          <div key={m.title} className={`${i === 0 ? "on-dark bg-forest text-paper" : "bg-amber text-ink"} px-[var(--page-gutter)] py-12 lg:py-20`} {...rise(i)}>
            <h2 className="t-title">{m.title}</h2>
            <p className="t-lead mt-3 max-w-[32rem]">{m.body}</p>
            <div className="mt-6">
              <ButtonLink href={contactHref(m.intent as InquiryIntent)} variant={i === 0 ? "amber" : "ink"}>
                {m.cta}
              </ButtonLink>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
