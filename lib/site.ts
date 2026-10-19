// Language-neutral company details. Names, address and other wording live in lib/i18n/dictionaries.
// TODO: replace the placeholder contact details with the company's real ones.
export const site = {
  founded: 1999,
  contact: {
    email: "trade@elkhairat.com",
    phone: "+20 114 999 9264",
    phoneHref: "+201149999264",
    whatsapp: "20119999264",
  },
};

export const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/products", key: "products" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;
