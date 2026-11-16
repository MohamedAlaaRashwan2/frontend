# KHAIRAT website

Bilingual (English and Arabic) corporate site for KHAIRAT, an Egyptian food supply-chain partner. Built with Next.js App Router and Tailwind CSS.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

This version of Next.js differs from older ones. Read `node_modules/next/dist/docs/` before changing framework-level code (see `AGENTS.md`).

## Environment

| Variable | Purpose | Required |
| --- | --- | --- |
| `QUOTE_WEBHOOK_URL` | Where inquiries are POSTed as JSON (CRM, Zapier/Make, form service) | Yes, otherwise the form tells visitors their request was not sent |
| `NEXT_PUBLIC_SITE_URL` | Public origin, used for canonical URLs and the sitemap | Yes for a custom domain (falls back to Vercel's production URL) |
| `NEXT_PUBLIC_STRAPI_URL` | Strapi host, used for product photos only | No |

## Where things live

| To change | Edit |
| --- | --- |
| Any wording | `lib/i18n/dictionaries/en.ts` and `ar.ts`. TypeScript fails the build if the two drift apart |
| Services, products, stages, images | `lib/content.ts` |
| Form questions per inquiry type | `lib/inquiry.ts`, used by both the form and the server action |
| Contact details | `lib/site.ts` |
| Colours, type scale, motion | `app/globals.css` |

Pages are in `app/[lang]/`. Each service page is under `app/[lang]/services/`, built from the shared sections in `components/ui.tsx`.

## Content accuracy

The site states only what the business brief confirms. Do not add capacities, temperatures, certificates, markets, volumes, client names or equipment until the company confirms them.

- Open items: `docs/KHAIRAT-COMPANY-CONFIRMATION.md`, and `TODO(company-confirm)` comments in the code
- Photography needed: `docs/ASSET-CHECKLIST.md`
- Image licences: `public/images/CREDITS.md`

Strapi text is not used, because the current entries contain unverified claims. See the note in `lib/strapi.ts`.
