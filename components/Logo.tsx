import Image from "next/image";

/**
 * The El Kheirat lockup: the mark with the Arabic and Latin names inside the copper outline. The name is part of the
 * artwork, so it is the image's alt text (and the header link's accessible name). Made for light backgrounds only;
 * its green lettering disappears on the dark brand greens.
 */
export function Logo({ name }: { name: string }) {
  return <Image src="/images/logo-elkheirat.png" alt={name} width={560} height={210} priority className="h-11 w-auto shrink-0 sm:h-12" />;
}
