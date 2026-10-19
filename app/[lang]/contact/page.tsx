import type { Metadata } from "next";
import { Icon, type AnyIcon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";
import { PageHero } from "@/components/ui";
import { alternatesFor } from "@/lib/i18n/metadata";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { getCategories } from "@/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: alternatesFor("/contact", locale),
  };
}

export default async function ContactPage({ searchParams }: PageProps<"/[lang]/contact">) {
  const { product } = await searchParams;
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const categories = await getCategories(locale);
  const productOptions = [...new Set(categories.flatMap((c) => [c.name, ...c.products.map((p) => p.name)]))];
  const t = dict.contact;

  // `ltr` marks values (email, phone) that must keep left-to-right order inside Arabic text.
  const channels: { icon: AnyIcon; label: string; value: string; href?: string; ltr?: boolean }[] = [
    { icon: "mail", label: t.email, value: site.contact.email, href: `mailto:${site.contact.email}`, ltr: true },
    { icon: "phone", label: t.phone, value: site.contact.phone, href: `tel:${site.contact.phoneHref}`, ltr: true },
    { icon: "chat", label: t.whatsapp, value: t.whatsappCta, href: `https://wa.me/${site.contact.whatsapp}` },
    { icon: "pin", label: t.office, value: dict.brand.address },
    { icon: "clock", label: t.hours, value: dict.brand.hours },
  ];

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} intro={t.intro} image="/images/cranes.jpg" />

      <section className="container-x relative z-10 mt-12 grid gap-8 pb-24 md:pb-32 lg:grid-cols-[1fr_2fr]">
        <aside className="order-2 h-fit rounded-3xl bg-brand-ink p-8 text-white md:p-10 lg:sticky lg:top-28 lg:order-none lg:mt-12">
          <p className="eyebrow bg-red">{t.deskEyebrow}</p>
          <h2 className="mt-5 font-display text-3xl">{t.deskTitle}</h2>
          <ul className="mt-10 space-y-6">
            {channels.map((c) => {
              const value = c.ltr ? <bdi dir="ltr">{c.value}</bdi> : c.value;
              return (
                <li key={c.label} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-accent">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-white/50">{c.label}</p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-0.5 block font-semibold break-all transition hover:text-accent"
                        {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-semibold">{value}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="rounded-3xl bg-surface p-8 shadow-xl shadow-brand-ink/5 ring-1 ring-line md:p-12">
          <h2 className="font-display text-3xl text-brand-ink md:text-4xl">{t.formTitle}</h2>
          <p className="mt-3 text-muted">{t.formIntro}</p>
          <div className="mt-10">
            <QuoteForm
              locale={locale}
              labels={t.form}
              products={productOptions}
              defaultProduct={typeof product === "string" ? product : ""}
            />
          </div>
        </div>
      </section>
    </>
  );
}
