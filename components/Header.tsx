"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeNames, localizePath, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { DUR, EASE, gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
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
  const solutionsMenu = useRef<HTMLDivElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  // Read inside scroll callbacks, which are created once.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = menuOpen || solutionsOpen;
  }, [menuOpen, solutionsOpen]);

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

  // ── Motion ──
  // The header steps out of the way while reading down the page and comes back as soon as you scroll up, reach the
  // top, or tab into it. A thin bar along its edge shows how far through the page you are.
  useGSAP(
    () => {
      const header = bar.current;
      if (!header) return;
      const setProgress = gsap.quickSetter(progress.current, "scaleX");
      const mm = gsap.matchMedia();

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setProgress(self.progress);
          header.toggleAttribute("data-scrolled", self.scroll() > 8);
        },
      });

      mm.add(MQ.motion, () => {
        let hidden = false;
        const show = (visible: boolean) => {
          if (hidden === !visible) return;
          hidden = !visible;
          gsap.to(header, { yPercent: visible ? 0 : -100, duration: visible ? 0.45 : 0.35, ease: visible ? EASE.brand : EASE.exit, overwrite: true });
        };
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            // Keyboard focus keeps it in view; focus left behind by a mouse click doesn't.
            if (openRef.current || header.querySelector(":focus-visible")) return show(true);
            show(self.direction === -1 || self.scroll() < 240);
          },
        });
        const onFocus = () => show(true);
        header.addEventListener("focusin", onFocus);
        return () => header.removeEventListener("focusin", onFocus);
      });
    },
    { scope: bar },
  );

  // The services dropdown: unfolds from under its button, its items following.
  useGSAP(
    () => {
      const menu = solutionsMenu.current;
      if (!menu) return;
      if (solutionsOpen) {
        gsap.set(menu, { display: "block" });
        gsap.fromTo(menu, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: DUR.fast, ease: EASE.brand, overwrite: true });
        gsap.fromTo(menu.querySelectorAll("[data-menu-item]"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.03, delay: 0.04, ease: EASE.brand, overwrite: true });
      } else if (menu.style.display === "block") {
        gsap.to(menu, { autoAlpha: 0, y: -4, duration: 0.15, ease: EASE.exit, overwrite: true, onComplete: () => void gsap.set(menu, { display: "none" }) });
      }
    },
    { dependencies: [solutionsOpen] },
  );

  // The mobile menu: a panel unrolls from the header, then the links rise in order.
  useGSAP(
    () => {
      const menu = mobileMenu.current;
      if (!menu) return;
      const reduce = window.matchMedia(MQ.reduce).matches;
      if (menuOpen) {
        gsap.set(menu, { display: "block" });
        if (reduce) {
          gsap.set(menu, { autoAlpha: 1, clearProps: "clipPath" });
          return;
        }
        gsap.fromTo(menu, { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: EASE.reveal, overwrite: true });
        gsap.fromTo(menu.querySelectorAll("[data-menu-item]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.035, delay: 0.12, ease: EASE.brand, overwrite: true });
      } else if (menu.style.display === "block") {
        gsap.to(menu, { autoAlpha: 0, duration: reduce ? 0 : 0.18, ease: EASE.exit, overwrite: true, onComplete: () => void gsap.set(menu, { display: "none", clearProps: "clipPath" }) });
      }
    },
    { dependencies: [menuOpen] },
  );

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
    <header
      ref={bar}
      className={`header-bar ${menuOpen ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-50"} w-full bg-paper text-ink data-[scrolled]:shadow-[0_1px_0_rgb(21_26_23/0.12)]`}
    >
      <span ref={progress} className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-copper" aria-hidden="true" />
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-3">
        <Link href={home} className="shrink-0">
          <Logo name={brand.name} />
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
                  {/* Always in the DOM so it can animate out; display:none keeps it out of the tab order while closed. */}
                  <div ref={solutionsMenu} id="solutions-menu" style={{ display: "none" }} className="absolute start-0 top-[calc(100%+0.8rem)] w-[34rem] rounded-card bg-paper p-2 shadow-float">
                      <ul>
                        {solutions.map((s) => (
                          <li key={s.href} data-menu-item="">
                            <Link
                              href={to(s.href)}
                              onClick={() => setSolutionsOpen(false)}
                              aria-current={pathname === to(s.href) ? "page" : undefined}
                              className="block rounded-field p-3 transition-colors duration-150 hover:bg-sand aria-[current=page]:bg-sand"
                            >
                              <span className="block font-bold">{s.name}</span>
                              <span className="t-small mt-0.5 block text-ink/80">{s.short}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link data-menu-item="" href={to("/services")} onClick={() => setSolutionsOpen(false)} className="block rounded-field bg-sand p-3 font-bold transition-colors duration-150 hover:bg-sand-deep">
                        {labels.allServices}
                      </Link>
                  </div>
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
          <Link href={to("/contact")} className="press hidden min-h-11 items-center rounded-full bg-ink px-6 font-bold whitespace-nowrap text-paper hover:bg-forest sm:inline-flex">
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

      {/* Always in the DOM so it can animate out; display:none keeps it out of the tab order while closed. */}
      <div
        ref={mobileMenu}
        id="mobile-menu"
        data-lenis-prevent
        style={{ display: "none" }}
        className="h-[calc(100dvh-var(--header-height))] fixed w-full overflow-y-auto bg-forest text-paper on-dark xl:hidden"
      >
          <nav aria-label={labels.main} className="shell pt-4 pb-10">
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    data-menu-item=""
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
                            data-menu-item=""
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
      </div>
    </header>
  );
}
