import { useEffect, useRef } from "react";
import heroSrc from "@/assets/hero.webp";
import { Image } from "@/lib/next-shim";
import { Link } from "@/lib/next-shim";
import { site } from "@/data/site";
import { LogoMark } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/Social";
import { Magnetic } from "@/components/ui/Magnetic";

export function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Azaltılmış hareket tercihinde paralaks tamamen devre dışı.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = imgRef.current;
    if (!el) return;

    // transform/opacity dışında hiçbir özellik değişmez; rAF ile sınırlıdır.
    let raf = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      el.style.transform = `translate3d(0, ${window.scrollY * 0.22}px, 0) scale(1.18)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative isolate -mt-20 hero-min-h overflow-hidden bg-ink text-white">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <div className="ken-burns relative h-full w-full">
          <Image
            src={heroSrc}
            alt="Alacakaranlıkta geometrik cepheli çağdaş yapı"
            fill
            priority
            width={1920}
            height={1280}
            sizes="100vw"
            className="img-duotone object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/40" />
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_15%_85%,transparent_35%,rgba(15,17,20,0.55)_100%)]" />

      {/* oversized watermark */}
      <div className="pointer-events-none absolute right-6 top-24 hidden opacity-[0.12] lg:block hero-anim hero-anim-5 xl:right-20" aria-hidden="true">
        <div className="float-slow">
          <LogoMark variant="light" className="h-[24rem] w-auto" />
        </div>
      </div>

      <div className="container-x relative flex hero-min-h flex-col justify-end pb-14 pt-36">
        <div className="hero-anim hero-anim-1 flex items-center gap-4">
          <span className="h-px w-12 bg-accent-soft" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-white/85">
            {site.name}
          </p>
        </div>

        <h1
          aria-label="Sağlam yapılar, doğru mühendislik ile yükselir."
          className="mt-8 max-w-4xl text-[clamp(2.6rem,6vw,4.75rem)] font-bold leading-[1.04] tracking-[-0.03em]"
        >
          <span className="hero-anim hero-anim-2 block">Sağlam yapılar,</span>{" "}
          <span className="hero-anim hero-anim-3 block text-accent-soft">doğru mühendislik</span>{" "}
          <span className="hero-anim hero-anim-3 block">ile yükselir.</span>
        </h1>

        <div className="hero-anim hero-anim-4 mt-6 flex items-center gap-3">
          <span className="h-px w-8 bg-white/40" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/90">
            Kaliteyle Kurulur
          </span>
        </div>

        <div className="mt-9 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="hero-anim hero-anim-4 max-w-xl text-base leading-relaxed text-white/82 md:text-lg">
            Kuk İnşaat, Kocaeli merkezli bir inşaat ve mühendislik firmasıdır.
            Konut, ticari ve karma kullanımlı yapılarda; projenin değerlendirilmesinden
            teslimine kadar her aşamayı tek elden, planlı bir biçimde yürütürüz.
          </p>

          <div className="hero-anim hero-anim-5 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/hizmetler" className="btn-sheen group inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white">
                Hizmetlerimizi Keşfedin
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/iletisim" className="group inline-flex items-center gap-3 border border-white/60 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-ink">
                Bize Ulaşın
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="hero-anim hero-anim-5 mt-14 flex items-center justify-between gap-4 border-t border-white/20 pt-6 text-[0.7rem] uppercase tracking-[0.24em] text-white/65">
          <div className="flex items-center gap-6">
            <span className="hidden sm:block">İnşaat · Proje · Mühendislik</span>
            <SocialLinks variant="ghost" className="text-white/80" />
          </div>
          <span className="flex items-center gap-3">
            <span className="hidden h-9 w-6 items-start justify-center rounded-full border border-white/35 p-1.5 sm:flex">
              <span className="scroll-dot h-2 w-1 rounded-full bg-white" />
            </span>
            <span className="hidden md:inline">Keşfetmek için kaydırın</span>
          </span>
        </div>
      </div>
    </section>
  );
}