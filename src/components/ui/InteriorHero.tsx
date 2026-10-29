import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { InteriorHeroArtwork, type InteriorPage } from "@/components/ui/InteriorHeroArtwork";

const pageMeta: Record<InteriorPage, { index: string; rail: string }> = {
  kurumsal: { index: "01", rail: "Kurumsal" },
  hizmetler: { index: "02", rail: "Hizmetler" },
  projeler: { index: "03", rail: "Projeler" },
  iletisim: { index: "04", rail: "İletişim" },
};

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
  const meta = pageMeta[page];

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <InteriorHeroArtwork page={page} />
      </div>
      <div className="interior-hero-scrim pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container className="relative flex min-h-[460px] flex-col justify-center py-20 md:min-h-[550px] md:py-24">
        <p className="hero-anim hero-anim-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
          <span className="h-px w-10 bg-accent-warm" aria-hidden="true" />
          {label}
        </p>
        <h1 className="hero-anim hero-anim-2 mt-6 max-w-4xl text-balance text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="hero-anim hero-anim-3 mt-7 max-w-2xl text-base leading-relaxed text-white/82 md:text-lg">
          {description}
        </p>

        <div className="hero-anim hero-anim-4 mt-11 flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/55">
          <span className="text-white/80">Kuk İnşaat</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/25 sm:block" />
          <span>Kaliteyle Kurulur</span>
          <span className="ml-auto hidden items-center gap-3 md:flex">
            <span className="h-px w-8 bg-accent-soft/60" aria-hidden="true" />
            {meta.index} / 04
          </span>
        </div>
      </Container>

      {/* Sağ kenar: sayfa kimliği ve görseli çerçeveleyen ince çizgi. */}
      <span
        className="pointer-events-none absolute bottom-0 right-[var(--gutter)] top-0 hidden w-px bg-gradient-to-b from-white/5 via-white/20 to-transparent xl:block"
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute right-[calc(var(--gutter)+1.25rem)] top-1/2 hidden -translate-y-1/2 xl:block">
        <span className="vertical-text-up text-[0.6rem] font-semibold uppercase tracking-[0.44em] text-white/45">
          {meta.rail} · Kuk İnşaat
        </span>
      </span>
      <span className="pointer-events-none absolute bottom-8 right-[calc(var(--gutter)+1.25rem)] hidden h-16 w-16 border-b border-r border-white/30 xl:block" aria-hidden="true" />
    </section>
  );
}
