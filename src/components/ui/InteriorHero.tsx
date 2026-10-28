import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { InteriorHeroArtwork, type InteriorPage } from "@/components/ui/InteriorHeroArtwork";

export function InteriorHero({
  page,
  label,
  title,
  description,
}: {
  page: InteriorPage;
  label: string;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <InteriorHeroArtwork page={page} />
      </div>
      <div className="interior-hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container className="relative flex min-h-[430px] flex-col justify-center py-20 md:min-h-[520px] md:py-24">
        <p className="hero-anim hero-anim-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
          <span className="h-px w-10 bg-accent-warm" aria-hidden="true" />
          {label}
        </p>
        <h1 className="hero-anim hero-anim-2 mt-6 max-w-4xl text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="hero-anim hero-anim-3 mt-7 max-w-2xl text-base leading-relaxed text-white/82 md:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}