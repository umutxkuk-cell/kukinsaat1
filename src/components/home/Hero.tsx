"use client";

import { Link } from "@/lib/next-shim";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { Illustration } from "@/components/ui/Illustration";
import { SocialLinks } from "@/components/brand/Social";
import { Magnetic } from "@/components/ui/Magnetic";

/** Ana sayfa: radye temelden parapete kadar görülen yapı kesiti. */
export function Hero() {
  return (
    <section className="hero-surface relative isolate -mt-20 overflow-hidden border-b border-line bg-bg text-ink">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[67%] md:block" aria-hidden="true">
        <Illustration page="home" className="h-full w-full object-contain" position="50% 50%" priority decorative />
      </div>
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/45 md:block" aria-hidden="true" />

      {/* Mobilde kesitin radye temeli ve çatı ölçüsü birlikte görünür. */}
      <div className="relative h-80 overflow-hidden border-b border-line/60 pt-20 md:hidden" aria-hidden="true">
        <Illustration page="home" className="h-full w-full object-contain" position="50% 50%" priority decorative />
      </div>

      <div className="container-x relative flex flex-col justify-start pb-16 pt-8 md:min-h-[calc(100svh-5rem)] md:justify-center md:pb-20 md:pt-24">
        <div className="max-w-3xl">
          <div className="hero-anim hero-anim-1 flex items-center gap-3.5">
            <span className="h-1.5 w-1.5 bg-accent-warm" aria-hidden="true" />
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-accent sm:text-[0.64rem] sm:tracking-[0.36em]">
              {site.name} · {site.locationLabel}
            </p>
          </div>

          <h1
            aria-label="Sağlam yapılar, doğru mühendislik ile yükselir."
            className="mt-5 text-[clamp(1.85rem,4.8vw,4.3rem)] font-bold leading-[1.05] tracking-[-0.038em] text-ink md:mt-6"
          >
            <span className="hero-anim hero-anim-2 block">Sağlam yapılar,</span>
            <span className="hero-anim hero-anim-3 block text-accent">doğru mühendislik</span>
            <span className="hero-anim hero-anim-3 block">ile yükselir.</span>
          </h1>

          <div className="hero-anim hero-anim-4 mt-7 flex items-center gap-4">
            <span className="h-px w-14 bg-line-2/70" aria-hidden="true" />
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-muted">
              Kaliteyle Kurulur
            </span>
          </div>

          <p className="hero-anim hero-anim-4 mt-5 max-w-xl text-[0.9rem] leading-[1.75] text-ink/75 md:mt-7 md:text-[1.05rem]">
            Kuk İnşaat, Kocaeli merkezli bir inşaat ve mühendislik firmasıdır. Konut, ticari ve
            karma kullanımlı yapılarda projenin değerlendirilmesinden teslimine kadar her aşamayı
            tek elden yürütürüz.
          </p>

          <div className="hero-anim hero-anim-5 mt-6 flex flex-wrap items-center gap-3 md:mt-8">
            <Magnetic>
              <Link
                href="/hizmetler"
                className="btn-sheen group inline-flex items-center gap-3 bg-ink px-7 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.15em] text-bg transition-colors hover:bg-accent"
              >
                Hizmetlerimizi Keşfedin
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/iletisim"
                className="group inline-flex items-center gap-3 border border-ink/25 bg-white/20 px-7 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink hover:bg-white"
              >
                Bize Ulaşın
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="hero-anim hero-anim-5 mt-8 hidden gap-8 border-t border-line pt-5 sm:grid sm:grid-cols-3 md:mt-10 md:pt-6">
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-muted/75">Merkez</p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/80">Başiskele — Kocaeli</p>
          </div>
          <div className="sm:border-l sm:border-line sm:pl-8">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-muted/75">Uzmanlık</p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/80">İnşaat · Proje · Mühendislik</p>
          </div>
          <div className="sm:border-l sm:border-line sm:pl-8">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-muted/75">Çalışma</p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/80">Pazartesi–Cumartesi, 09:00–18:00</p>
          </div>
        </div>

        <ul className="hero-anim hero-anim-5 -mx-5 mt-6 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 md:mt-7 md:gap-2" aria-label="Hizmet alanları">
          {services.map((s, i) => (
            <li key={s.slug} className="hero-chip shrink-0" style={{ animationDelay: `${520 + i * 70}ms` }}>
              <Link href={`/hizmetler/${s.slug}`} className="hero-chip-link">
                <span className="hero-chip-dot" aria-hidden="true" />
                {s.shortTitle}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hero-anim hero-anim-5 mt-7 flex flex-col gap-4 border-t border-line pt-5 text-[0.62rem] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:border-t-0 sm:pt-0 sm:tracking-[0.24em]">
          <span className="sm:hidden">İnşaat · Proje · Mühendislik</span>
          <span className="hidden sm:inline">Kuk İnşaat</span>
          <SocialLinks variant="ghost" className="text-ink/70" />
        </div>
      </div>
    </section>
  );
}
