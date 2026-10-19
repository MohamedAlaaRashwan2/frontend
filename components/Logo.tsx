import Image from "next/image";
export function Logo({ name, tagline, tone = "dark" }: { name: string; tagline: string; tone?: "dark" | "light" }) {
  const text = tone === "light" ? "text-white" : "text-brand-ink";
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill={tone === "light" ? "#ffffff" : "#14543a"} />
        <path
          d="M20 31V15m0 0c-2.6-1.2-4-3.6-4-6.4 2.6 1.2 4 3.6 4 6.4Zm0 0c2.6-1.2 4-3.6 4-6.4-2.6 1.2-4 3.6-4 6.4Zm0 5.6c-2.8-.3-4.9-2.1-5.8-4.8 2.8.3 4.9 2.1 5.8 4.8Zm0 0c2.8-.3 4.9-2.1 5.8-4.8-2.8.3-4.9 2.1-5.8 4.8Zm0 5.6c-2.8-.3-4.9-2.1-5.8-4.8 2.8.3 4.9 2.1 5.8 4.8Zm0 0c2.8-.3 4.9-2.1 5.8-4.8-2.8.3-4.9 2.1-5.8 4.8Z"
          fill="none"
          stroke={tone === "light" ? "#14543a" : "#ffffff"}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="15.5" fill="none" stroke="#56b11f" strokeWidth="1" strokeDasharray="2 3" />
      </svg> */}
      <Image src="/images/logo.png" alt="" width={36} height={36} className="shrink-0" />
      <span className="leading-none">
        <span className={`block font-display text-[1.35rem] font-semibold tracking-tight ${text}`}>{name}</span>
        <span className={`mt-1 block text-[0.6rem] font-bold rtl:mt-0.5 rtl:text-[0.7rem] uppercase tracking-[0.28em] ${tone === "light" ? "text-white/60" : "text-muted"}`}>
          {tagline}
        </span>
      </span>
    </span>
  );
}
