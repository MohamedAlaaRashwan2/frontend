import { serviceHref, serviceKeys } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/server";
import { navItems, site } from "@/lib/site";
import { Icon } from "./Icon";
import { Words } from "./motion/Words";
import { LocaleLink } from "./ui";

export async function Footer() {
  const dict = await getDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="shell pt-12 pb-6 md:pt-16">
        <p data-split="" className="t-title" aria-hidden="true">
          <Words text={dict.brand.name} />
        </p>
        <p className="t-lead mt-3 max-w-text" data-rise="">
          {dict.footer.statement}
        </p>

        <div className="mt-10 grid gap-10 border-t-2 border-paper/30 pt-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-bold">{dict.footer.reach}</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex min-h-11 items-center gap-3 underline underline-offset-4 hover:no-underline">
                  <Icon name="mail" className="size-5 shrink-0 text-amber" />
                  <bdi dir="ltr">{site.contact.email}</bdi>
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phoneHref}`} className="inline-flex min-h-11 items-center gap-3 underline underline-offset-4 hover:no-underline">
                  <Icon name="phone" className="size-5 shrink-0 text-amber" />
                  <bdi dir="ltr">{site.contact.phone}</bdi>
                </a>
              </li>
              <li className="flex items-start gap-3 py-2">
                <Icon name="pin" className="mt-1 size-5 shrink-0 text-amber" />
                <span>{dict.brand.address}</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:col-span-7 lg:col-start-6 lg:gap-10">
            <div>
              <h2 className="font-bold">{dict.footer.company}</h2>
              <ul className="mt-3">
                {navItems
                  .filter((item) => item.key !== "services")
                  .map((item) => (
                    <li key={item.key}>
                      <LocaleLink href={item.href} className="inline-flex min-h-10 items-center underline-offset-4 hover:underline">
                        {dict.nav[item.key]}
                      </LocaleLink>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h2 className="font-bold">{dict.footer.services}</h2>
              <ul className="mt-3">
                {serviceKeys.map((key) => (
                  <li key={key}>
                    <LocaleLink href={serviceHref(key)} className="inline-flex min-h-10 items-center py-1 leading-snug underline-offset-4 hover:underline">
                      {dict.services.items[key].name}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="t-small mt-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p>
              © <bdi>{year}</bdi> {dict.brand.name}. {dict.footer.rights}
            </p>
            {/* TODO(company-confirm): remove this line once real company photography replaces the contextual images. */}
            <p className="mt-1">{dict.footer.photoNote}</p>
          </div>
          <a href="#main" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline">
            {dict.common.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
