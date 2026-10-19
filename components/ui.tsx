import Image from "next/image";
import Link from "next/link";
import { getDictionary, href as localeHref } from "@/lib/i18n/server";
import { Icon } from "./Icon";
import { AnimatedText } from "./motion/AnimatedText";
import { Parallax } from "./motion/Parallax";
import { Reveal } from "./Reveal";

/** next/link that prefixes internal paths with the current locale ("/contact" → "/ar/contact"). */
export async function LocaleLink({ href, ...props }: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
  return <Link href={await localeHref(href)} {...props} />;
}

type ButtonVariant = "primary" | "brand" | "outline-light" | "outline-dark";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-white hover:text-brand-ink",
  brand: "bg-brand text-white hover:bg-brand-deep",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white hover:text-brand-ink",
  "outline-dark": "border border-brand/25 text-brand hover:border-brand hover:bg-brand hover:text-white",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
}) {
  return (
    <LocaleLink
      href={href}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] rtl:text-[0.95rem] ${buttonStyles[variant]}`}
    >
      {children}
      {arrow && (
        <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" strokeWidth={2} />
      )}
    </LocaleLink>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "start",
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  align?: "start" | "center";
  tone?: "dark" | "light";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <AnimatedText
        text={title}
        delay={0.1}
        className={`mt-5 font-display text-4xl leading-[1.08] font-medium tracking-tight text-balance md:text-5xl ${
          tone === "light" ? "text-white" : "text-brand-ink"
        }`}
      />
      {intro && (
        <Reveal delay={250}>
          <p className={`mt-6 text-lg leading-relaxed text-pretty ${tone === "light" ? "text-white/70" : "text-muted"}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Dark photographic banner that opens every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-ink pt-40 pb-20 md:pt-48 md:pb-28">
      <Parallax>
        <Image src={image} alt="" fill priority sizes="100vw" className="animate-slow-zoom object-cover opacity-45" />
      </Parallax>
      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-brand-ink via-brand-ink/85 to-brand-ink/30 rtl:bg-linear-to-l"
        aria-hidden="true"
      />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <AnimatedText
          as="h1"
          text={title}
          trigger="mount"
          delay={0.1}
          stagger={0.07}
          className="mt-6 max-w-4xl font-display text-5xl leading-[1.04] font-medium tracking-tight text-balance text-white md:text-7xl"
        />
        {intro && (
          <Reveal delay={350}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-white/75">{intro}</p>
          </Reveal>
        )}
        {children && <Reveal delay={500}>{children}</Reveal>}
      </div>
    </section>
  );
}

export async function CtaBand() {
  const dict = await getDictionary();
  return (
    <section className="container-x py-20 md:py-28">
      <Reveal className="grain relative overflow-hidden rounded-[2rem] bg-brand px-8 py-16 md:px-16 md:py-20">
        <div
          className="absolute -top-32 -end-24 -z-10 size-96 rounded-full bg-accent/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow">{dict.cta.eyebrow}</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.1] font-medium tracking-tight text-balance text-white md:text-5xl">
              {dict.cta.title}
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
            <ButtonLink href="/contact">{dict.common.requestQuote}</ButtonLink>
            <ButtonLink href="/products" variant="outline-light">
              {dict.common.browseProducts}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-start font-display text-xl text-brand-ink transition hover:text-brand [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-brand transition group-open:rotate-45 group-open:bg-brand group-open:text-white">
              <Icon name="plus" className="size-4" strokeWidth={2} />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Next/Image can't optimise images on a local CMS host, so serve those as-is. */
export function isLocalImage(src: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)/.test(src);
}
