import { getDictionary } from "@/lib/i18n/server";
import { Icon } from "./Icon";

/** Egypt to each market the brief names, with the line drawing out as it scrolls into view. */
export async function ExportRoutes() {
  const { markets } = await getDictionary();
  return (
    <ul>
      {markets.list.map((market, i) => (
        <li key={market} className="flex items-center gap-3 border-t-2 border-current py-3 md:gap-5 md:py-4">
          <span className="t-sub shrink-0">{markets.origin}</span>
          <span className="flex min-w-6 flex-1 items-center">
            <span data-route="" style={{ "--rise-order": i } as React.CSSProperties} className="rule h-1 flex-1" aria-hidden="true" />
            <Icon name="arrow" className="-ms-1.5 size-5 shrink-0" strokeWidth={4.5} />
          </span>
          <span className="t-sub shrink-0 text-end">{market}</span>
        </li>
      ))}
    </ul>
  );
}
