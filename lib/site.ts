// Language-neutral company details. Names, the address and other wording live in lib/i18n/dictionaries.

export const site = {
  // TODO(company-confirm): the email and phone were carried over from the previous site, where they were
  // marked as placeholders. They are not in the business brief. Confirm both, and confirm the WhatsApp number.
  contact: {
    email: "trade@elkhairat.com",
    phone: "+20 114 999 9264",
    phoneHref: "+201149999264",
    // The previous value (20119999264) was one digit short, so the link went nowhere.
    whatsapp: "201149999264",
  },
};

/** Absolute site origin, used for canonical URLs, the sitemap and structured data. */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}

export const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/products", key: "products" },
  { href: "/facility", key: "facility" },
  { href: "/quality", key: "quality" },
  { href: "/contact", key: "contact" },
] as const;
