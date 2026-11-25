import Image from "next/image";
import Link from "next/link";
import { images, serviceHref, type ImageId, type ServiceKey } from "@/lib/content";
import { getDictionary, getLocale, href as localeHref } from "@/lib/i18n/server";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ContactForm } from "./ContactForm";
import { Icon } from "./Icon";
import { Words } from "./motion/Words";
import type { InquiryIntent } from "@/lib/inquiry";

/** next/link that prefixes internal paths with the current locale ("/contact" → "/ar/contact"). */
export async function LocaleLink({ href, ...props }: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
  return <Link href={await localeHref(href)} {...props} />;
}

type ButtonVariant = "amber" | "ink" | "forest" | "paper" | "outline-light" | "outline-dark";

const buttonStyles: Record<ButtonVariant, string> = {
  amber: "bg-amber text-ink hover:bg-paper",
  ink: "bg-ink text-paper hover:bg-forest",
  forest: "bg-forest text-paper hover:bg-ink",
  paper: "bg-paper text-ink hover:bg-amber",
  "outline-light": "text-paper ring-2 ring-inset ring-paper hover:bg-paper hover:text-ink",
  "outline-dark": "text-ink ring-2 ring-inset ring-ink hover:bg-ink hover:text-paper",
};

const buttonClass = (variant: ButtonVariant) =>
  `press arrow-nudge inline-flex min-h-13 items-center justify-center gap-3 rounded-full px-7 py-3 text-center font-bold ${buttonStyles[variant]}`;

export function ButtonLink({ href, children, variant = "amber" }: { href: string; children: React.ReactNode; variant?: ButtonVariant }) {
  return (
    <LocaleLink href={href} className={buttonClass(variant)}>
      {children}
      <Icon name="arrow" className="size-5 shrink-0" strokeWidth={2.25} />
    </LocaleLink>
  );
}

/** A button that jumps to the form further down the same page. */
export function AnchorButton({ href = "#inquiry", children, variant = "amber" }: { href?: string; children: React.ReactNode; variant?: ButtonVariant }) {
  return (
    <a href={href} className={buttonClass(variant)}>
      {children}
      <Icon name="arrow" className="size-5 shrink-0" strokeWidth={2.25} />
    </a>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <LocaleLink href={href} className={`arrow-nudge inline-flex min-h-11 items-center gap-2 font-bold whitespace-nowrap ${className}`}>
      <span className="link-line">{children}</span>
      <Icon name="arrow" className="size-5 shrink-0" strokeWidth={2.25} />
    </LocaleLink>
  );
}

/**
 * A picture from the registry in lib/content.ts. Food-industry "operations" pictures always carry a visible label,
 * so nobody takes a stock photograph for KHAIRAT's own facility or team.
 */
export async function Photo({
  id,
  className = "",
  sizes,
  priority,
  src,
  alt,
  position,
  reveal = "rise",
  parallax,
  bleed = false,
}: {
  id: ImageId;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** A CMS photograph that replaces the built-in one. */
  src?: string;
  alt?: string;
  position?: string;
  /**
   * How the photograph arrives. "rise" uncovers it from below as it scrolls in, "wide" opens it from the centre (for
   * full-width banners), "hero" settles it on load (for a banner that opens the page; it is never hidden, so it can be
   * the page's largest paint). Priority photos default to "hero".
   */
  reveal?: "rise" | "wide" | "hero";
  /** Drift strength in percent for full-width banners. */
  parallax?: number;
  /** Runs to the screen edge (banners, half-screen panels): keeps square corners. Everything else is rounded. */
  bleed?: boolean;
}) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const image = images[id];
  const mode = priority ? "hero" : reveal;
  const motion =
    mode === "hero" ? { "data-hero": "", "data-hero-photo": "" } : { "data-photo": mode === "wide" ? "wide" : "" };
  const picture = (
      <Image
        src={src ?? image.src}
        alt={alt ?? image[locale]}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={Boolean(src && /^https?:\/\/(localhost|127\.0\.0\.1)/.test(src))}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
  );
  return (
    <div {...motion} className={`zoom-frame relative overflow-hidden bg-sand-deep ${bleed ? "" : "rounded-card"} ${className}`}>
      {parallax ? (
        // Taller than the frame, so the drift never shows an edge.
        <div data-parallax={parallax} className="absolute inset-x-0 -top-[10%] h-[120%]">
          {picture}
        </div>
      ) : (
        picture
      )}
      {!src && image.kind === "operations" && (
        <span className={`absolute bottom-0 bg-ink/85 px-2.5 py-1 text-[0.875rem] leading-snug text-paper ${bleed ? "start-0 rounded-se-lg" : "start-2 bottom-2 rounded-full"}`}>{dict.common.illustrative}</span>
      )}
    </div>
  );
}

/** Marks an element for the scroll entrance; `order` staggers siblings. */
export const rise = (order = 0) => ({ "data-rise": "", style: { "--rise-order": order } as React.CSSProperties });

/** `items` runs from the first level below home to the current page, which is shown without a link. */
export async function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const trail = [{ label: dict.nav.home, href: "/" }, ...items];
  return (
    <nav aria-label={dict.nav.breadcrumb} className="t-small">
      <ol className="flex flex-wrap items-center gap-x-2">
        {trail.map((item, i) => (
          <li key={item.label} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i < trail.length - 1 ? (
              <LocaleLink href={item.href} className="inline-block py-1 underline underline-offset-2 hover:no-underline">
                {item.label}
              </LocaleLink>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbJsonLd(locale, trail)} />
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export type Tone = "paper" | "sand" | "ink" | "forest" | "amber" | "cold";

export const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  sand: "bg-sand text-ink",
  ink: "on-dark bg-charcoal text-paper",
  forest: "on-dark bg-forest text-paper",
  amber: "bg-amber text-ink",
  cold: "on-dark bg-cold text-paper",
};

const reachedTone = (tone: Tone) => (tone === "ink" || tone === "forest" || tone === "cold" ? "amber" : tone === "amber" ? "ink" : "forest");

/** The top of an inner page: breadcrumb, a large title, one sentence and one action. */
export async function PageHead({
  crumbs,
  title,
  intro,
  tone = "ink",
  action,
}: {
  crumbs: { label: string; href: string }[];
  title: string;
  intro?: string;
  tone?: Tone;
  action?: { label: string; href?: string; anchor?: boolean };
}) {
  const variant = reachedTone(tone) as ButtonVariant;
  return (
    <section data-hero="" className={toneClass[tone]}>
      <div className="shell pt-8 pb-10 md:pt-10 md:pb-16">
        <div data-hero-item="">
          <Breadcrumbs items={crumbs} />
        </div>
        <h1 data-hero-title="" className="t-display mt-8 max-w-[70rem] md:mt-14">
          <Words text={title} />
        </h1>
        <div className="mt-6 grid gap-6 md:mt-10 lg:grid-cols-12 lg:items-end">
          {intro && (
            <p data-hero-item="" className="t-lead max-w-[46rem] lg:col-span-8">
              {intro}
            </p>
          )}
          {action && (
            <div data-hero-item="" className="lg:col-span-4 lg:flex lg:justify-end">
              {action.anchor ? <AnchorButton variant={variant}>{action.label}</AnchorButton> : <ButtonLink href={action.href ?? "/contact"} variant={variant}>{action.label}</ButtonLink>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Every section opens the same way: a heavy rule, the title, and any short intro on the far side. */
export function SectionHead({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div>
      <span data-rule="" className="rule" aria-hidden="true" />
      <div className="mt-5 grid gap-4 lg:grid-cols-12 lg:gap-8">
        <h2 data-split="" className="t-title lg:col-span-7">
          <Words text={title} />
        </h2>
        {(intro || children) && (
          <div className="lg:col-span-4 lg:col-start-9" {...rise(1)}>
            {intro && <p className="t-lead">{intro}</p>}
            {children && <div className={intro ? "mt-4" : ""}>{children}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export function Section({ title, intro, tone = "paper", head, children, id }: { title: string; intro?: string; tone?: Tone; head?: React.ReactNode; children?: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={`chapter ${toneClass[tone]}`}>
      <div className="shell">
        <SectionHead title={title} intro={intro}>
          {head}
        </SectionHead>
        {children && <div className="mt-8 md:mt-12">{children}</div>}
      </div>
    </section>
  );
}

const pad = (n: number, locale: string) => (n + 1).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { minimumIntegerDigits: 2, useGrouping: false });

/** An ordered process, read across on desktop and as a compact list on phones. */
export async function Steps({ items, highlight, columns = 4 }: { items: { name: string; body?: string }[]; highlight?: number; columns?: 3 | 4 | 5 | 6 }) {
  const locale = await getLocale();
  const cols = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" }[columns];
  return (
    <ol className={`grid gap-x-6 sm:grid-cols-2 ${items.every((step) => !step.body) ? "grid-cols-2" : ""} ${cols}`}>
      {items.map((step, i) => (
        <li key={step.name} className="border-t-2 border-current py-4 lg:pb-8" {...rise(i)}>
          <span className="t-small font-bold">{pad(i, locale)}</span>
          <h3 className={`t-sub mt-1 w-fit ${i === highlight ? "rounded-md bg-ink px-2 text-paper" : ""}`}>{step.name}</h3>
          {step.body && <p className="mt-1.5">{step.body}</p>}
        </li>
      ))}
    </ol>
  );
}

/** A plain two-column list with a rule above each item. Replaces rows of boxed cards. */
export function RuledList({ items, columns = 2, large = false }: { items: string[]; columns?: 2 | 3; large?: boolean }) {
  return (
    <ul className={`grid gap-x-8 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((item, i) => (
        <li key={item} className={`border-t border-current/40 py-3 font-semibold ${large ? "t-sub" : ""}`} {...rise(i % 3)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A heading with a body per row, for things with no order. */
export function Rows({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.title} className="grid gap-1 border-t-2 border-current py-4 md:grid-cols-12 md:gap-6 md:py-6" data-rise="side">
          <h3 className="t-sub md:col-span-5">{item.title}</h3>
          <p className="md:col-span-7">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ title, body, href, label, tone = "forest" }: { title: string; body?: string; href: string; label: string; tone?: Tone }) {
  return (
    <section className={`py-12 md:py-20 ${toneClass[tone]}`}>
      <div className="shell grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 data-split="" className="t-title">
            <Words text={title} />
          </h2>
          {body && (
            <p className="t-lead mt-3 max-w-[44rem]" {...rise()}>
              {body}
            </p>
          )}
        </div>
        <div className="lg:col-span-4 lg:flex lg:justify-end" {...rise(1)}>
          <ButtonLink href={href} variant={reachedTone(tone) as ButtonVariant}>
            {label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Heading plus the inquiry form, fixed to one inquiry type. */
export async function InquirySection({ intent, title, aside, tone = "sand" }: { intent: InquiryIntent; title: string; aside?: React.ReactNode; tone?: Tone }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <section id="inquiry" className={`chapter ${toneClass[tone]}`}>
      <div className="shell grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-split="" className="t-title">
            <Words text={title} />
          </h2>
          {aside && (
            <div className="mt-6" {...rise()}>
              {aside}
            </div>
          )}
        </div>
        <div className="lg:col-span-7 lg:col-start-6" {...rise(1)}>
          <ContactForm locale={locale} labels={dict.contact} initialIntent={intent} fixed />
        </div>
      </div>
    </section>
  );
}

/** Links to the services that connect to this one. */
export async function RelatedServices({ keys }: { keys: ServiceKey[] }) {
  const dict = await getDictionary();
  return (
    <section className="chapter bg-sand text-ink">
      <div className="shell">
        <SectionHead title={dict.common.related} />
        <ul className="mt-6">
          {keys.map((k) => (
            <li key={k} className="border-t-2 border-current first:border-t-0" data-rise="side">
              <LocaleLink href={serviceHref(k)} className="arrow-nudge flex items-center justify-between gap-6 py-5">
                <span>
                  <span className="t-sub block">{dict.services.items[k].name}</span>
                  <span className="mt-1 block">{dict.services.items[k].short}</span>
                </span>
                <Icon name="arrow" className="size-6 shrink-0" strokeWidth={2.25} />
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
