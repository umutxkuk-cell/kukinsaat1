import { useState } from "react";
import { Link } from "@/lib/next-shim";
import { Image } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { services } from "@/data/services";

export function ServicesPreview() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section className="bg-bg-2 py-24 md:py-36">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant="left">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent-warm" /> Hizmetlerimiz
            </p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.2rem,4.5vw,3.6rem)]">
              Fikirden teslime, <em className="text-accent">tek çatı altında.</em>
            </h2>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <Link href="/hizmetler" className="link-sweep text-sm font-semibold uppercase tracking-[0.14em]">
              Tüm hizmetler →
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Interactive list */}
          <div className="lg:col-span-7">
            {services.map((s, i) => (
              <Reveal key={s.slug} variant="up" delay={i * 70}>
                <Link
                  href={`/hizmetler/${s.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group relative flex items-center gap-5 overflow-hidden border-t border-ink/12 py-6 transition-all duration-500 last:border-b md:gap-7 md:py-7 ${
                    active === i ? "pl-5 md:pl-7" : "pl-0"
                  }`}
                >
                  {/* sliding accent fill */}
                  <span
                    className={`absolute left-0 top-0 h-full bg-white/70 transition-all duration-500 ${
                      active === i ? "w-full" : "w-0"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute left-0 top-0 h-full w-[3px] bg-accent transition-all duration-500 ${
                      active === i ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />

                  <span
                    className={`relative z-10 transition-colors duration-500 ${
                      active === i ? "text-accent" : "text-ink/35"
                    }`}
                  >
                    <ServiceIcon name={s.icon} className="h-9 w-9" />
                  </span>

                  <span className="relative z-10 flex-1">
                    <span className="flex items-baseline gap-3">
                      <span className={`font-display text-sm transition-colors ${active === i ? "text-accent" : "text-muted"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`block font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-tight transition-colors ${active === i ? "text-ink" : "text-ink/65"}`}>
                        {s.title}
                      </span>
                    </span>
                    <span
                      className={`block overflow-hidden text-sm leading-relaxed text-muted transition-all duration-500 ${
                        active === i ? "mt-2 max-h-16 opacity-100" : "mt-0 max-h-0 opacity-0"
                      }`}
                    >
                      {s.summary}
                    </span>
                  </span>

                  <span className={`arrow-slide relative z-10 flex h-11 w-11 shrink-0 items-center justify-center border transition-all duration-500 ${active === i ? "border-ink bg-ink text-white" : "border-ink/20 text-muted"}`}>
                    ↗
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Preview image that follows selection */}
          <Reveal variant="clip" delay={150} className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden">
                {services.map((s, i) => (
                  <Image
                    key={s.slug}
                    src={s.image}
                    alt={s.imageAlt}
                    width={1200}
                    height={900}
                    fill
                    sizes="38vw"
                    className={`img-duotone object-cover transition-all duration-[1100ms] ${active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center border border-white/40 text-white backdrop-blur-sm">
                  <ServiceIcon name={current.icon} className="h-7 w-7" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                    {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-display text-2xl leading-tight">{current.title}</p>
                  <div className="mt-4 h-px w-full bg-white/20">
                    <div
                      className="h-px bg-accent-soft transition-all duration-500"
                      style={{ width: `${((active + 1) / services.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}