const paths = {
  arrow: <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m4.5 12.5 4.5 4.5 10.5-10.5" />,
  phone: <path d="M6.6 3.5h2.6l1.4 4-2 1.6a11 11 0 0 0 6.3 6.3l1.6-2 4 1.4v2.6a1.6 1.6 0 0 1-1.7 1.6C11.3 18.5 5.5 12.7 5 5.2a1.6 1.6 0 0 1 1.6-1.7Z" />,
  mail: <path d="M3.5 6h17v12h-17V6Zm0 0 8.5 7 8.5-7" />,
  chat: <path d="M5 18.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5ZM9 9h6M9 12h4" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
} as const;

export type AnyIcon = keyof typeof paths;

export function Icon({ name, className = "size-6", strokeWidth = 1.75 }: { name: AnyIcon; className?: string; strokeWidth?: number }) {
  // The arrow points forward in reading direction, so it flips in right-to-left layouts.
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
