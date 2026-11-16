import Image from "next/image";

export function Logo({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image src="/images/logo-khairat-flat.png" alt="" width={48} height={48} className="size-12 shrink-0" />
      <span className="leading-none">
        <span className="block font-display text-[1.3rem] font-extrabold tracking-tight text-ink rtl:font-bold rtl:tracking-normal">{name}</span>
        <span className="mt-1 block text-[0.875rem] leading-tight text-ink/75">{tagline}</span>
      </span>
    </span>
  );
}
