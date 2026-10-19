import { GLOBE, landDots, origin, routes } from "@/lib/globe-data";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getDictionary } from "@/lib/i18n/server";
import { PauseOnReducedMotion } from "./PauseOnReducedMotion";

// Label placement is geographic, so it stays the same in both languages (the SVG is always laid out LTR).
const labels: Record<keyof Dictionary["globe"], { dx: number; dy: number; anchor?: "start" | "end" }> = {
  rotterdam: { dx: -12, dy: -6, anchor: "end" },
  stPetersburg: { dx: 0, dy: -14 },
  jebelAli: { dx: 12, dy: 4, anchor: "start" },
  colombo: { dx: 12, dy: 4, anchor: "start" },
  mombasa: { dx: 12, dy: 6, anchor: "start" },
  dakar: { dx: -12, dy: 4, anchor: "end" },
};

const durations = [9, 11, 8.5, 12, 10, 10.5];

/** Dotted Earth centred on Egypt, with live trade routes to Elkhairat's main destination ports. */
export async function HeroGlobe() {
  const dict = await getDictionary();
  const { size, radius } = GLOBE;
  const c = size / 2;

  return (
    <div className="pointer-events-none relative mx-auto w-full max-w-[640px] select-none" aria-hidden="true">
      <svg id="hero-globe" viewBox={`0 0 ${size} ${size}`} direction="ltr" className="h-auto w-full overflow-visible">
        <defs>
          <filter id="glbGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="glbHalo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#56B11F" stopOpacity="0.32" />
            <stop offset="78%" stopColor="#56B11F" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#56B11F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glbOcean" cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#1f6b49" />
            <stop offset="45%" stopColor="transparent" />
            <stop offset="100%" stopColor="#06180f" />
          </radialGradient>
          <radialGradient id="glbShade" cx="38%" cy="32%" r="72%">
            <stop offset="55%" stopColor="#06180f" stopOpacity="0" />
            <stop offset="100%" stopColor="#06180f" stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id="glbSheen" cx="32%" cy="24%" r="40%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="glbClip">
            <circle cx={c} cy={c} r={radius} />
          </clipPath>
          <path id="glbOrbit" d={`M${c - 286},${c} a286,286 0 1,0 572,0 a286,286 0 1,0 -572,0`} />
        </defs>

        {/* Atmosphere */}
        <circle cx={c} cy={c} r={radius * 1.42} fill="url(#glbHalo)" />

        {/* Orbit rings */}
        <circle
          cx={c}
          cy={c}
          r="258"
          fill="none"
          stroke="rgba(156,224,106,.3)"
          strokeWidth="1.4"
          strokeDasharray="2 12"
          strokeLinecap="round"
        >
          <animateTransform attributeName="transform" type="rotate" from={`0 ${c} ${c}`} to={`360 ${c} ${c}`} dur="70s" repeatCount="indefinite" />
        </circle>
        <circle cx={c} cy={c} r="286" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
        <circle r="3.5" fill="#c9f2a5" filter="url(#glbGlow)">
          <animateMotion dur="38s" repeatCount="indefinite" rotate="auto">
            <mpath href="#glbOrbit" />
          </animateMotion>
        </circle>

        {/* Sphere */}
        <circle cx={c} cy={c} r={radius} fill="url(#glbOcean)" />
        <g clipPath="url(#glbClip)">
          <g fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1">
            {[0.35, 0.7].map((k) => (
              <ellipse key={`v${k}`} cx={c} cy={c} rx={radius * k} ry={radius} />
            ))}
            {[0.35, 0.7].map((k) => (
              <ellipse key={`h${k}`} cx={c} cy={c} rx={radius} ry={radius * k} />
            ))}
            <line x1={c - radius} y1={c} x2={c + radius} y2={c} />
            <line x1={c} y1={c - radius} x2={c} y2={c + radius} />
          </g>
          <g fill="none" strokeLinecap="round">
            <path d={landDots[2]} stroke="#9ce06a" strokeOpacity="0.28" strokeWidth="2.6" />
            <path d={landDots[1]} stroke="#9ce06a" strokeOpacity="0.55" strokeWidth="3" />
            <path d={landDots[0]} stroke="#b8ec8e" strokeOpacity="0.9" strokeWidth="3.3" />
          </g>
          <circle cx={c} cy={c} r={radius} fill="url(#glbShade)" />
          <circle cx={c} cy={c} r={radius} fill="url(#glbSheen)" />
        </g>
        <circle cx={c} cy={c} r={radius} fill="none" stroke="rgba(156,224,106,.4)" strokeWidth="1.2" />

        {/* Trade routes */}
        <g fill="none" strokeLinecap="round">
          {routes.map((r) => (
            <path key={`base-${r.id}`} d={r.d} stroke="rgba(255,255,255,.14)" strokeWidth="1.2" />
          ))}
        </g>
        <g fill="none" stroke="#56B11F" strokeWidth="2.2" strokeLinecap="round" filter="url(#glbGlow)">
          {routes.map((r, i) => (
            <path key={`flow-${r.id}`} id={`glbRoute-${r.id}`} d={r.d} strokeDasharray="5 10">
              <animate attributeName="stroke-dashoffset" from="0" to="-300" dur={`${durations[i]}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
        <g fill="#eafff0" filter="url(#glbGlow)">
        </g>

        {/* Destination ports */}
        {routes.map((r, i) => {
          const id = r.id as keyof Dictionary["globe"];
          const label = labels[id];
          return (
            <g key={`port-${r.id}`}>
              <circle cx={r.x} cy={r.y} r="4.5" fill="#9ce06a" />
              <circle cx={r.x} cy={r.y} r="4.5" fill="none" stroke="#9ce06a" strokeWidth="1.6">
                <animate attributeName="r" values="4.5;18" dur="3.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values=".85;0" dur="3.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </circle>
              {label && (
                <text
                  x={r.x + label.dx}
                  y={r.y + label.dy}
                  textAnchor={label.anchor ?? "middle"}
                  className="fill-white/80 stroke-brand-ink text-[11px] font-semibold tracking-[0.12em] uppercase [paint-order:stroke] rtl:text-[13px]"
                  strokeWidth="4"
                  strokeLinejoin="round"
                >
                  {dict.globe[id]}
                </text>
              )}
            </g>
          );
        })}

        {/* Origin: Egypt */}
        <g>
          <circle cx={origin.x} cy={origin.y} r="7" fill="#56B11F" filter="url(#glbGlow)" />
          <circle cx={origin.x} cy={origin.y} r="3" fill="#ffffff" />
          {[0, 1.3].map((begin) => (
            <circle key={begin} cx={origin.x} cy={origin.y} r="7" fill="none" stroke="#56B11F" strokeWidth="2">
              <animate attributeName="r" values="7;34" dur="2.6s" begin={`${begin}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values=".9;0" dur="2.6s" begin={`${begin}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      </svg>

      {/* Origin badge */}
      <div className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-brand-ink/70 py-2 pr-5 pl-2 ring-1 ring-white/15 backdrop-blur-md">
        <span className="grid size-8 place-items-center rounded-full bg-accent text-[0.65rem] font-bold text-white">EG</span>
        <span className="text-xs font-semibold whitespace-nowrap text-white/80">
          Shipping from Egypt to <span className="text-white">6 world regions</span>
        </span>
      </div>

      <PauseOnReducedMotion targetId="hero-globe" />
    </div>
  );
}
