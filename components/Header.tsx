"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, type Variants } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeNames, localizePath, switchLocalePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { navItems } from "@/lib/site";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const EASE = [0.2, 0.7, 0.2, 1] as const;

// Mobile menu: the panel unrolls from the header, then its contents rise in one after another.
// On close everything leaves together, quickly, so the menu never feels like it's in the way.
const panel: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.45, ease: EASE, staggerChildren: 0.055, delayChildren: 0.12 },
  },
  exit: { opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: 0.3, ease: EASE } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type Props = {
  locale: Locale;
  labels: Dictionary["nav"] & { requestQuote: string };
  brand: { name: string; tagline: string };
  contact: { email: string; phone: string };
};

// Every page opens on a dark hero, so the header starts transparent and turns solid on scroll.
export function Header({ locale, labels, brand, contact }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const pausedScroll = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Freeze the page (and Lenis' smooth scroll) behind the open mobile menu; Escape closes it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // Only resume scrolling we paused ourselves (the intro loader may also be holding it).
    if (open && lenis) {
      lenis.stop();
      pausedScroll.current = true;
    } else if (!open && pausedScroll.current) {
      lenis?.start();
      pausedScroll.current = false;
    }
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const solid = scrolled || open;
  const to = (path: string) => localizePath(path, locale);
  const home = to("/");
  const isActive = (path: string) => {
    const target = to(path);
    return target === home ? pathname === home : pathname.startsWith(target);
  };

  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref = switchLocalePath(pathname, otherLocale);
  const onSwitch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    // Keep query strings (e.g. a pre-selected product on the contact form) when changing language.
    const { search, hash } = window.location;
    if (search || hash) {
      e.preventDefault();
      router.push(`${switchHref}${search}${hash}`);
    }
  };

  const languageLink = (className: string) => (
    <Link
      href={switchHref}
      onClick={onSwitch}
      hrefLang={otherLocale}
      lang={otherLocale}
      aria-label={labels.switchTo}
      className={className}
    >
      <Icon name="globe" className="size-4 shrink-0" />
      <span>{localeNames[otherLocale]}</span>
    </Link>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-background/95 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className={`container-x flex items-center justify-between gap-4 transition-all duration-300 ${solid ? "h-18" : "h-24"}`}>
        <Link href={home} aria-label={labels.homeLabel} className="relative z-10">
          <Logo name={brand.name} tagline={brand.tagline} tone={solid ? "dark" : "light"} />
        </Link>

        <nav aria-label={labels.main} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={to(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`group relative rounded-full px-4 py-2 text-sm font-semibold transition-colors rtl:text-[0.95rem] ${
                    solid ? "text-brand-ink/75 hover:text-brand" : "text-white/80 hover:text-white"
                  } ${isActive(item.href) ? (solid ? "!text-brand" : "!text-white") : ""}`}
                >
                  {labels[item.key]}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-center rounded-full bg-accent transition-transform duration-300 ease-out ${
                      isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {languageLink(
            `inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
              solid ? "border-line text-brand-ink hover:border-brand hover:text-brand" : "border-white/30 text-white hover:border-white"
            }`,
          )}
          <Link
            href={to("/contact")}
            className="hidden h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-brand sm:inline-flex"
          >
            {labels.requestQuote}
            <Icon name="arrow" className="size-4" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border transition lg:hidden ${
              solid ? "border-line text-brand-ink" : "border-white/30 text-white"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={open ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="grid place-items-center"
              >
                <Icon name={open ? "close" : "menu"} className="size-5" strokeWidth={2} />
              </m.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            data-lenis-prevent
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-background lg:hidden"
          >
            <nav aria-label={labels.mobile} className="container-x py-8">
              <ul className="divide-y divide-line">
                {navItems.map((navItem) => (
                  <m.li key={navItem.href} variants={item}>
                    <Link
                      href={to(navItem.href)}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(navItem.href) ? "page" : undefined}
                      className={`group flex items-center justify-between py-4 font-display text-2xl transition-colors hover:text-brand ${
                        isActive(navItem.href) ? "text-brand" : "text-brand-ink"
                      }`}
                    >
                      {labels[navItem.key]}
                      <Icon
                        name="arrow"
                        className="size-5 text-accent transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                      />
                    </Link>
                  </m.li>
                ))}
              </ul>
              <m.div variants={item}>
                <Link
                  href={to("/contact")}
                  onClick={() => setOpen(false)}
                  className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-bold text-white transition active:scale-[0.98]"
                >
                  {labels.requestQuote}
                  <Icon name="arrow" className="size-4" strokeWidth={2} />
                </Link>
              </m.div>
              <m.div variants={item} className="mt-8 space-y-2 text-sm text-muted">
                <p>
                  <bdi dir="ltr">{contact.email}</bdi>
                </p>
                <p>
                  <bdi dir="ltr">{contact.phone}</bdi>
                </p>
              </m.div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
