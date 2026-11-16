import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon, type AnyIcon } from "@/components/Icon";
import { PageHead } from "@/components/ui";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { isInquiryIntent, type InquiryIntent } from "@/lib/inquiry";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return pageMetadata("/contact", locale, dict.contact.metaTitle, dict.contact.metaDescription);
}

export default async function ContactPage({ searchParams }: PageProps<"/[lang]/contact">) {
  const { type, product } = await searchParams;
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.contact;

  const productValue = typeof product === "string" ? product.slice(0, 200) : "";
  // Older links carried only ?product=, which meant a quotation request.
  const intent: InquiryIntent | undefined = isInquiryIntent(type) ? type : productValue ? "export" : undefined;

  // `ltr` marks values (email, phone) that must keep left-to-right order inside Arabic text.
  const channels: { icon: AnyIcon; label: string; value: string; href?: string; ltr?: boolean }[] = [
    { icon: "mail", label: t.email, value: site.contact.email, href: `mailto:${site.contact.email}`, ltr: true },
    { icon: "phone", label: t.phone, value: site.contact.phone, href: `tel:${site.contact.phoneHref}`, ltr: true },
    { icon: "chat", label: t.whatsapp, value: t.whatsappCta, href: `https://wa.me/${site.contact.whatsapp}` },
    { icon: "pin", label: t.location, value: dict.brand.address },
  ];

  return (
    <>
      <PageHead title={t.title} intro={t.intro} crumbs={[{ label: dict.nav.contact, href: "/contact" }]} />
      <section id="inquiry" className="chapter bg-sand">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ContactForm locale={locale} labels={t} initialIntent={intent} initialProduct={productValue} />
          </div>
          <aside className="lg:col-span-3 lg:col-start-10">
            <h2 className="t-sub">{t.directTitle}</h2>
            <ul className="mt-4 space-y-4">
              {channels.map((c) => {
                const value = c.ltr ? <bdi dir="ltr">{c.value}</bdi> : c.value;
                return (
                  <li key={c.label} className="flex gap-3 border-t-2 border-current pt-3">
                    <Icon name={c.icon} className="mt-1 size-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold">{c.label}</p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="break-words underline underline-offset-4 hover:no-underline"
                          {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {value}
                        </a>
                      ) : (
                        <p>{value}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
