/**
 * Flat drawing for Private Label, where no honest photograph exists and stock photos would show other companies'
 * brands: cartons and jars on a shelf, each with an empty label waiting for the client's brand. The labels use the
 * logo's pill outline in copper, so the idea reads as "your brand, our packing".
 */
export function PrivateLabelArt({ className = "" }: { className?: string }) {
  const kraft = "#c99c66";
  const kraftDark = "#a97c47";
  const cream = "#f7f4ed";
  const copper = "#be7d3c";
  const forest = "#0b3a26";
  const leaf = "#0d5436";
  const gold = "#d8a03f";

  // An empty label: a cream panel, the copper pill outline, a gold mark and two lines where the name would go.
  const label = (x: number, y: number, w: number, h: number) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h * 0.12} fill={cream} />
      <rect x={x + w * 0.08} y={y + h * 0.2} width={w * 0.84} height={h * 0.6} rx={h * 0.3} fill="none" stroke={copper} strokeWidth={Math.max(2, h * 0.04)} />
      <circle cx={x + w * 0.24} cy={y + h / 2} r={h * 0.17} fill={gold} />
      <rect x={x + w * 0.42} y={y + h * 0.38} width={w * 0.38} height={h * 0.08} rx={h * 0.04} fill={leaf} />
      <rect x={x + w * 0.42} y={y + h * 0.54} width={w * 0.26} height={h * 0.06} rx={h * 0.03} fill={leaf} opacity={0.5} />
    </g>
  );

  const carton = (x: number, y: number, w: number, h: number) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={kraft} />
      <rect x={x} y={y} width={w} height={h * 0.14} rx={10} fill={kraftDark} />
      <rect x={x + w / 2 - 6} y={y} width={12} height={h * 0.14} fill="#e6d3b3" opacity={0.7} />
      {label(x + w * 0.12, y + h * 0.34, w * 0.76, h * 0.36)}
    </g>
  );

  const jar = (x: number, y: number) => (
    <g>
      <rect x={x + 14} y={y} width={92} height={34} rx={8} fill={forest} />
      <rect x={x} y={y + 30} width={120} height={170} rx={22} fill="#e9dcc2" />
      <rect x={x} y={y + 30} width={120} height={170} rx={22} fill="url(#pl-glass)" />
      {label(x + 8, y + 86, 104, 70)}
    </g>
  );

  return (
    <svg viewBox="0 0 800 1000" className={className} preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="pl-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="#e9e2d3" />
      {/* Back wall and shelf */}
      <rect y="0" width="800" height="420" fill="#dcd3bf" />
      <rect y="400" width="800" height="22" fill={forest} />
      <rect y="760" width="800" height="22" fill={forest} />
      <rect y="782" width="800" height="218" fill="#d5cab2" />

      {/* Top shelf: jars */}
      <g>{jar(70, 200)}</g>
      <g>{jar(240, 200)}</g>
      <g>{jar(410, 200)}</g>
      <g>{jar(580, 200)}</g>

      {/* Lower shelf: cartons */}
      <g>{carton(60, 520, 300, 240)}</g>
      <g>{carton(400, 470, 340, 290)}</g>
    </svg>
  );
}
