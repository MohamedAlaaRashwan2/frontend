import { ButtonLink } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = (await getDictionary()).notFound;
  return (
    <section className="chapter on-dark flex min-h-[70svh] items-center bg-charcoal text-paper">
      <div className="shell">
        <h1 className="t-display max-w-[60rem]">{t.title}</h1>
        <p className="t-lead mt-5">{t.body}</p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/">{t.home}</ButtonLink>
          <ButtonLink href="/services" variant="outline-light">
            {t.services}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
