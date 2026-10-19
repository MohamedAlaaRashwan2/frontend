import type { IconName } from "@/lib/content";

const paths: Record<IconName | "arrow" | "phone" | "mail" | "pin" | "clock" | "menu" | "close" | "plus", React.ReactNode> = {
  shield: <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Zm-3.2 9 2.3 2.3 4.3-4.6" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5Z" />
    </>
  ),
  ship: <path d="M4 15.5 3 11h18l-2 5.5M6 11V7h12v4M10 7V4h4v3M3 19.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />,
  scale: <path d="M12 4v16M7 20h10M5 7h14M5 7l-2.5 6a3 3 0 0 0 5 0L5 7Zm14 0-2.5 6a3 3 0 0 0 5 0L19 7Z" />,
  chat: <path d="M5 18.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5ZM9 9h6M9 12h4" />,
  document: <path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5A.5.5 0 0 1 6.5 20V4a.5.5 0 0 1 .5-.5ZM14 3.5V8h4M9.5 12h5M9.5 15.5h5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  box: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9M12 12 4 7.5M8 5.2l8 4.6" />,
  leaf: <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19c3-4 6-6.5 9.5-8.5" />,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />,
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.6 2.6-5.3 3.8-8.8 1.9 1.2 2.6 3.1 2.5 4.6 1.5-1 2.3-3 2-5.6 2.9 2 4.7 5.5 4.7 9.4 0 3.8-2.7 6.6-6.5 6.6Z" />,
  wheat: <path d="M12 21V8M12 8c-2-1-3-3-3-5 2 1 3 3 3 5Zm0 0c2-1 3-3 3-5-2 1-3 3-3 5Zm0 4.5c-2.2-.2-3.8-1.6-4.5-3.8 2.2.2 3.8 1.6 4.5 3.8Zm0 0c2.2-.2 3.8-1.6 4.5-3.8-2.2.2-3.8 1.6-4.5 3.8Zm0 4.5c-2.2-.2-3.8-1.6-4.5-3.8 2.2.2 3.8 1.6 4.5 3.8Zm0 0c2.2-.2 3.8-1.6 4.5-3.8-2.2.2-3.8 1.6-4.5 3.8Z" />,
  check: <path d="m4.5 12.5 4.5 4.5 10.5-10.5" />,
  handshake: <path d="m3 11 3.5-4 4 1.5L14 6l7 5-3 3.5M3 11l4.5 5 1.5-1.5M3 11l-.5.5m6.5 3 1.5 1.5 1.5-1.5m-3-1.5 1.5-1.5m1.5 4.5 1.5 1.5 1.5-1.5m-3-1.5 1.5-1.5m1.5 4.5 1.5 1.5 3-3.5M10.5 8.5 8 11.5" />,
  chart: <path d="M4 20h16M7 16.5v-4M11.5 16.5V8.5M16 16.5v-7M5 9l4.5-4 4 3L19 4" />,
  tag: <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-8.6-8ZM8 8h.01" />,
  arrow: <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5" />,
  phone: <path d="M6.6 3.5h2.6l1.4 4-2 1.6a11 11 0 0 0 6.3 6.3l1.6-2 4 1.4v2.6a1.6 1.6 0 0 1-1.7 1.6C11.3 18.5 5.5 12.7 5 5.2a1.6 1.6 0 0 1 1.6-1.7Z" />,
  mail: <path d="M3.5 6h17v12h-17V6Zm0 0 8.5 7 8.5-7" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export type AnyIcon = keyof typeof paths;

export function Icon({ name, className = "size-6", strokeWidth = 1.5 }: { name: AnyIcon; className?: string; strokeWidth?: number }) {
  // Directional icons point the other way in right-to-left layouts.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={name === "arrow" ? `${className} rtl:-scale-x-100` : className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
