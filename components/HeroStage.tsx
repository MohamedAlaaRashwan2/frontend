import Image from "next/image";

/**
 * The home page hero: one strong photograph with the copy over it. Motion is declared here and run by MotionDirector:
 * on load the photograph settles while the headline rises word by word; on scroll the photograph drifts slower than
 * the page and the copy lifts slightly faster, which gives the opening its depth. The photograph is never hidden,
 * so it paints immediately as the page's largest element.
 */
export function HeroStage({ image, children }: { image: { src: string; alt: string; position?: string }; children: React.ReactNode }) {
  return (
    <section data-hero="" className="on-dark relative isolate flex min-h-[calc(100svh-var(--header-height))] overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-10">
        <div data-parallax="7" className="absolute inset-x-0 -top-[10%] h-[120%]">
          <div data-hero-photo="" className="absolute inset-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              quality={62}
              sizes="100vw"
              className="object-cover"
              style={image.position ? { objectPosition: image.position } : undefined}
            />
          </div>
        </div>
        {/* A neutral scrim, from below on phones and from the reading side on desktop, so the photo keeps its own colour. */}
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/50 to-ink/10 lg:bg-linear-to-r lg:from-ink/80 lg:via-ink/45 lg:to-transparent rtl:lg:bg-linear-to-l" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-linear-to-t from-ink/70 to-transparent lg:block" aria-hidden="true" />
      </div>
      <div data-depth="-70" className="shell flex flex-col justify-end pt-16 pb-5 lg:pt-20 lg:pb-7">
        {children}
      </div>
    </section>
  );
}
