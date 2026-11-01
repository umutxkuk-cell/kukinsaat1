import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Illustration, type IllustrationPage } from "@/components/ui/Illustration";

/**
 * Geri getirilen açık mineral illüstrasyonların sayfa başlığı.
 * Masaüstünde görsel sağda ve metin solda; mobilde bütün illüstrasyon
 * kesilmeden başlığın altında kalır. Bu düzen yalnızca iç sayfalar içindir.
 */
export function InteriorHero({
  page,
  label,
  title,
  description,
  tone = "cool",
}: {
  page: Exclude<IllustrationPage, "home">;
  label: string;
  title: ReactNode;
  description: ReactNode;
  tone?: "cool" | "warm" | "stone";
}) {
  return (
    <section className="hero-surface relative isolate overflow-hidden border-b border-line bg-bg text-ink">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block" aria-hidden="true">
        <Illustration page={page} className="h-full w-full object-contain" position="50% 50%" priority decorative />
      </div>
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/50 md:block" aria-hidden="true" />

      <Container className="relative flex min-h-[360px] flex-col justify-center py-20 md:min-h-[440px] md:py-24">
        <p className={`hero-anim hero-anim-1 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] ${tone === "warm" ? "text-accent-warm" : "text-accent"}`}>
          <span className="h-px w-10 bg-accent-warm" aria-hidden="true" />
          {label}
        </p>
        <h1 className="hero-anim hero-anim-2 mt-6 max-w-3xl text-[clamp(2.1rem,4.4vw,3.8rem)] font-semibold leading-[1.06] tracking-[-0.034em] text-ink">
          {title}
        </h1>
        <div className="hero-anim hero-anim-3 mt-6 flex items-start gap-5">
          <span className="mt-2.5 hidden h-px w-10 shrink-0 bg-accent-warm sm:block" aria-hidden="true" />
          <p className="max-w-xl text-[0.98rem] leading-[1.75] text-muted md:text-[1.02rem]">
            {description}
          </p>
        </div>
      </Container>

      <div className="relative h-64 overflow-hidden border-t border-line/60 md:hidden" aria-hidden="true">
        <Illustration page={page} className="h-full w-full object-contain" position="50% 50%" priority decorative />
      </div>
    </section>
  );
}
