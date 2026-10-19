import { ButtonLink } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = (await getDictionary()).notFound;
  return (
    <section className="grain relative flex min-h-[80vh] items-center overflow-hidden bg-brand-ink pt-32 pb-20 text-white">
      <div className="container-x text-center">
        <p className="font-display text-8xl text-accent md:text-9xl">404</p>
        <h1 className="mt-6 font-display text-4xl md:text-5xl">{t.title}</h1>
        <p className="mx-auto mt-5 max-w-md text-white/70">{t.body}</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">{t.home}</ButtonLink>
          <ButtonLink href="/products" variant="outline-light">
            {t.products}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
