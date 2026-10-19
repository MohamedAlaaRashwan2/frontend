import { fill } from "@/lib/i18n/dictionaries";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { navItems, site } from "@/lib/site";
import { getCategories } from "@/lib/strapi";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { LocaleLink } from "./ui";

export async function Footer() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const categories = await getCategories(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-ink text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div>
          <Logo name={dict.brand.name} tagline={dict.brand.logoTagline} tone="light" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">{fill(dict.footer.about, { year: site.founded })}</p>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase rtl:text-sm">{dict.footer.company}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <LocaleLink href={item.href} className="transition hover:text-accent">
                  {dict.nav[item.key]}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase rtl:text-sm">{dict.footer.products}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <LocaleLink href={`/products/${c.slug}`} className="transition hover:text-accent">
                  {c.name}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase rtl:text-sm">{dict.footer.contact}</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={`mailto:${site.contact.email}`} className="transition hover:text-white">
                <bdi dir="ltr">{site.contact.email}</bdi>
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={`tel:${site.contact.phoneHref}`} className="transition hover:text-white">
                <bdi dir="ltr">{site.contact.phone}</bdi>
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{dict.brand.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <bdi>{year}</bdi> {dict.brand.legalName}. {dict.footer.rights}
          </p>
          <p>{dict.footer.ports}</p>
        </div>
      </div>
    </footer>
  );
}
