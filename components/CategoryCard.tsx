import Image from "next/image";
import type { Category } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/server";
import { Icon } from "./Icon";
import { isLocalImage, LocaleLink } from "./ui";

export async function CategoryCard({ category, index }: { category: Category; index: number }) {
  const dict = await getDictionary();
  return (
    <LocaleLink
      href={`/products/${category.slug}`}
      className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-3xl bg-brand-ink p-7 text-white shadow-brand-ink/20 transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-2xl md:p-9"
    >
      <Image
        src={category.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        unoptimized={isLocalImage(category.image)}
        className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-brand-ink via-brand-ink/70 to-brand-ink/5 transition-opacity duration-500 group-hover:opacity-95"
        aria-hidden="true"
      />

      <div className="absolute top-7 right-7 left-7 flex items-start justify-between md:top-9 md:right-9 md:left-9">
        <span className="grid size-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur">
          <Icon name={category.icon} className="size-6" />
        </span>
        <span className="font-display text-sm text-white/60">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-accent/90 px-3 py-1 text-[0.7rem] font-bold tracking-wider uppercase rtl:text-xs">
        <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
        {dict.common.availableForExport}
      </span>
      <h3 className="font-display text-3xl font-medium tracking-tight md:text-4xl">{category.name}</h3>
      <p className="mt-4 max-w-md leading-relaxed text-white/75">{category.summary}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent transition-all group-hover:gap-3">
        {dict.common.exploreRange}
        <Icon name="arrow" className="size-4" strokeWidth={2} />
      </span>
    </LocaleLink>
  );
}
