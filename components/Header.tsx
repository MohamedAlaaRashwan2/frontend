"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeNames, localizePath, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { navItems } from "@/lib/site";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

type Props = {
  locale: Locale;
  labels: Record<(typeof navItems)[number]["key"] | "allServices" | "main" | "openMenu" | "closeMenu" | "switchTo" | "consult", string>;
  brand: { name: string; tagline: string };
  solutions: { href: string; name: string; short: string }[];
};

export function Header({ locale, labels, brand, solutions }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const solutionsButton = useRef<HTMLButtonElement>(null);
  const solutionsWrap = useRef<HTMLLIElement>(null);
  const lenis = useLenis();

  // Close everything after navigating. Adjusting state during render is React's pattern for this,
  // and avoids a flash of the old menu on the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSolutionsOpen(false);
  }

  // Freeze the page behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // Escape closes whichever is open and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen && !solutionsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      } else {
        setSolutionsOpen(false);
        solutionsButton.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (solutionsOpen && !solutionsWrap.current?.contains(e.target as Node)) setSolutionsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen, solutionsOpen]);

  const to = (path: string) => localizePath(path, locale);
  const home = to("/");
  const isActive = (path: string) => {
    const target = to(path);
    return target === home ? pathname === home : pathname === target || pathname.startsWith(`${target}/`);
  };

  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref = switchLocalePath(pathname, otherLocale);
  // Keep the query string (e.g. a chosen inquiry type) when changing language.
  const onSwitch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { search, hash } = window.location;
    if (search || hash) {
      e.preventDefault();
      router.push(`${switchHref}${search}${hash}`);
    }
  };

  const linkClass = (active: boolean) =>
    `nav-link inline-flex min-h-11 items-center gap-1 px-3 font-semibold whitespace-nowrap ${active ? "nav-link-active" : ""}`;

  return (
    <header className={`${menuOpen ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-50"} w-full bg-paper text-ink`}>
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-3">
        <Link href={home} className="shrink-0">
          <Logo name={brand.name} tagline={brand.tagline} />
        </Link>

        <nav aria-label={labels.main} className="hidden xl:block">
          <ul className="flex items-center">
            {navItems.map((item) =>
              item.key === "services" ? (
                <li key={item.key} ref={solutionsWrap} className="relative">
                  <button
                    ref={solutionsButton}
                    type="button"
                    aria-expanded={solutionsOpen}
                    aria-controls="solutions-menu"
                    onClick={() => setSolutionsOpen((v) => !v)}
                    className={linkClass(isActive(item.href))}
                  >
                    {labels.services}
                    <Icon name="chevron" className={`size-4 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} strokeWidth={2.25} />
                  </button>
                  <AnimatePresence>
                  {solutionsOpen && (
                    <m.div
                      id="solutions-menu"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="absolute start-0 top-[calc(100%+0.8rem)] w-[34rem] bg-paper p-2 shadow-float"
                    >
                      <ul>
                        {solutions.map((s) => (
                          <li key={s.href}>
                            <Link
                              href={to(s.href)}
                              onClick={() => setSolutionsOpen(false)}
                              aria-current={pathname === to(s.href) ? "page" : undefined}
                              className="block p-3 transition-colors duration-150 hover:bg-sand aria-[current=page]:bg-sand"
                            >
                              <span className="block font-bold">{s.name}</span>
                              <span className="t-small mt-0.5 block text-ink/80">{s.short}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={to("/services")} onClick={() => setSolutionsOpen(false)} className="block bg-sand p-3 font-bold transition-colors duration-150 hover:bg-sand-deep">
                        {labels.allServices}
                      </Link>
                    </m.div>
                  )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.key}>
                  <Link href={to(item.href)} aria-current={isActive(item.href) ? "page" : undefined} className={linkClass(isActive(item.href))}>
                    {labels[item.key]}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href={switchHref}
            onClick={onSwitch}
            hrefLang={otherLocale}
            lang={otherLocale}
            title={labels.switchTo}
            className="nav-link inline-flex min-h-11 items-center px-3 font-semibold"
          >
            {localeNames[otherLocale]}
          </Link>
          <Link href={to("/contact")} className="press hidden min-h-11 items-center bg-ink px-5 font-bold whitespace-nowrap text-paper hover:bg-forest sm:inline-flex">
            {labels.consult}
          </Link>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            className="grid size-11 shrink-0 place-items-center xl:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="size-6" strokeWidth={2} />
          </button>
        </div>
      </div>

      <AnimatePresence>
      {menuOpen && (
        <m.div
          id="mobile-menu"
          data-lenis-prevent
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.23, 1, 0.32, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="h-[calc(100dvh-var(--header-height))] fixed w-full overflow-y-auto bg-forest text-paper on-dark xl:hidden"
        >
          <nav aria-label={labels.main} className="shell pt-4 pb-10">
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={to(item.href)}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="t-sub flex min-h-13 items-center py-2 aria-[current=page]:text-amber"
                  >
                    {labels[item.key]}
                  </Link>
                  {item.key === "services" && (
                    <ul className="mb-3 ms-4">
                      {solutions.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={to(s.href)}
                            onClick={() => setMenuOpen(false)}
                            aria-current={pathname === to(s.href) ? "page" : undefined}
                            className="flex min-h-11 items-center py-1 aria-[current=page]:text-amber"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </m.div>
      )}
      </AnimatePresence>
    </header>
  );
}
