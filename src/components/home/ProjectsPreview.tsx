import { Link } from "@/lib/next-shim";
import { Image } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LineReveal } from "@/components/ui/LineReveal";
import { projects } from "@/data/projects";

export function ProjectsPreview() {
  const featured = projects.slice(0, 3);
  const hasProjects = featured.length > 0;

  return (
    <section className="overflow-hidden py-24 md:py-36">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal variant="left">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-10 bg-accent-warm" /> Çalışma alanlarımız
              </p>
            </Reveal>
            <LineReveal
              as="h2"
              className="mt-6 max-w-2xl text-[clamp(2.2rem,4.5vw,3.6rem)]"
              lines={["Mühendislik odağında", "çalışma alanlarımız."]}
            />
          </div>
          <Reveal variant="right" delay={120}>
            <Link href="/projeler" className="link-sweep text-sm font-semibold uppercase tracking-[0.14em]">
              Portföy →
            </Link>
          </Reveal>
        </div>

        {hasProjects ? (
          <div className="mt-16 grid gap-6 md:grid-cols-12">
            {featured.map((p, i) => (
              <Reveal
                key={p.slug}
                variant={i === 0 ? "up" : i === 1 ? "scale" : "right"}
                delay={i * 130}
                className={i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-20"}
              >
                <Link href={`/projeler/${p.slug}`} className="group block">
                  <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                    <Image
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      sizes={i === 0 ? "60vw" : "40vw"}
                      className="img-zoom img-duotone object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/70">{p.type} — {p.year}</p>
                        <h3 className="mt-2 font-display text-3xl">{p.name}</h3>
                      </div>
                      <span className="arrow-slide flex h-12 w-12 shrink-0 items-center justify-center border border-white/40 bg-black/20 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-ink">
                        ↗
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            {/* Sol: çalışma alanları — gerçek proje yokken bile dolu ve bilgilendirici */}
            <div className="lg:col-span-7">
              <div className="grid h-full grid-cols-2 gap-px border border-line bg-line">
                {[
                  { k: "Konut Yapıları", d: "Nitelikli ve kalıcı yaşam alanları" },
                  { k: "Ticari Yapılar", d: "İşlevsel ve verimli ticari projeler" },
                  { k: "Karma Kullanım", d: "Çok amaçlı yapı çözümleri" },
                  { k: "Mühendislik", d: "Teknik koordinasyon ve uygulama" },
                ].map((item, i) => (
                  <Reveal key={item.k} variant="up" delay={i * 90}>
                    <div className="group h-full bg-bg p-7 transition-colors hover:bg-bg-2 md:p-9">
                      <span className="font-display text-2xl text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-5 font-sans text-lg font-semibold">{item.k}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Sağ: koyu çağrı bloğu */}
            <Reveal variant="right" delay={120} className="lg:col-span-5">
              <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden bg-ink p-8 text-white md:p-10">
                <span
                  className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[8rem] leading-none text-white/[0.06] select-none"
                  aria-hidden="true"
                >
                  KUK
                </span>
                <div className="relative">
                  <p className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-soft">
                    <span className="h-px w-8 bg-accent-soft" /> Portföy
                  </p>
                  <p className="mt-6 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] font-semibold leading-tight">
                    Proje portföyümüz hazırlanıyor.
                  </p>
                  <p className="mt-4 leading-relaxed text-white/65">
                    Şu anda yayımlanmış proje kaydı bulunmuyor. Hizmet kapsamımız ve
                    çalışma alanlarımız hakkında bilgi almak için bize ulaşabilirsiniz.
                  </p>
                </div>
                <Link
                  href="/iletisim"
                  className="relative mt-8 inline-flex items-center gap-3 border border-white/40 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-ink"
                >
                  İletişime geçin
                  <span className="transition-transform duration-300 hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  );
}