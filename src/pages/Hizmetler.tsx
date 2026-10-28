import { Link } from "@/lib/next-shim";
import { Image } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LineReveal } from "@/components/ui/LineReveal";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { services } from "@/data/services";


const approach = [
  {
    k: "Önce anlamak",
    d: "İhtiyacı, koşulları ve beklentiyi net biçimde tanımlarız.",
    icon: (
      <>
        <path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z" />
        <circle cx="24" cy="24" r="5" />
      </>
    ),
  },
  {
    k: "Planlı ilerlemek",
    d: "Her adımı iş programı ve kalite kontrol noktalarıyla yürütürüz.",
    icon: (
      <>
        <path d="M8 40V12M8 12l6-4 10 6 12-6v24l-12 6-10-6-6 4" />
        <path d="M24 14v24" />
      </>
    ),
  },
  {
    k: "Şeffaf raporlamak",
    d: "Süreç, bütçe ve ilerlemeyi düzenli olarak paylaşırız.",
    icon: (
      <>
        <rect x="9" y="7" width="30" height="34" rx="2" />
        <path d="M16 18h16M16 24h16M16 30h10" />
      </>
    ),
  },
];

export default function HizmetlerPage() {
  return (
    <>
      {/* ---------- Header ---------- */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="dot-grid pointer-events-none absolute inset-0 text-ink/[0.05]" aria-hidden="true" />
        <p
          className="pointer-events-none absolute -right-6 top-10 select-none font-display text-[10rem] leading-none text-ink/[0.04] md:text-[16rem]"
          aria-hidden="true"
        >
          KUK
        </p>
        <Container className="relative">
          <Reveal variant="left">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent-warm" /> Hizmetlerimiz
            </p>
          </Reveal>
          <LineReveal
            as="h1"
            className="mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] leading-[1.02]"
            lines={["Fikirden teslime kadar", "uçtan uca çözümler."]}
          />
          <Reveal variant="up" delay={200}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Kocaeli ve çevresinde inşaat, projelendirme ve mühendislik hizmetlerini
              tek çatı altında sunuyoruz. Her çalışma alanımızın kapsamını aşağıda
              bulabilirsiniz.
            </p>
          </Reveal>

          {/* icon quick-nav chips (no numbers) */}
          <Reveal variant="up" delay={300}>
            <div className="mt-10 flex flex-wrap gap-3">
              {services.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="group inline-flex items-center gap-2.5 border border-ink/15 px-4 py-2.5 text-sm transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
                >
                  <span className="text-accent transition-colors duration-300 group-hover:text-white">
                    <ServiceIcon name={s.icon} className="h-[18px] w-[18px]" />
                  </span>
                  {s.shortTitle}
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Ortak yaklaşım bandı (ikonlu, numarasız) ---------- */}
      <section className="border-y border-line bg-bg-2 py-16 md:py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <Reveal variant="left" className="md:col-span-4">
              <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">
                Hangi hizmet olursa olsun, <em className="text-accent">yaklaşımımız aynı.</em>
              </h2>
            </Reveal>
            <div className="md:col-span-8">
              <div className="grid gap-px bg-line sm:grid-cols-3">
                {approach.map((item, i) => (
                  <Reveal key={item.k} variant="up" delay={i * 110}>
                    <div className="group h-full bg-bg-2 p-7 transition-colors duration-500 hover:bg-bg">
                      <span className="svc-icon inline-flex text-accent">
                        <svg
                          viewBox="0 0 48 48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-9 w-9"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </svg>
                      </span>
                      <span className="mt-5 block h-px w-10 bg-accent-warm/50 transition-all duration-500 group-hover:w-20" />
                      <h3 className="mt-5 font-display text-2xl">{item.k}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Editorial service rows (no numbers) ---------- */}
      <section className="pt-14 pb-10 md:pt-20">
        <Container>
          <div className="border-t border-line">
            {services.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <article
                  key={s.slug}
                  id={s.slug}
                  className="group scroll-mt-28 border-b border-line py-14 md:py-20"
                >
                  <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                    {/* Image */}
                    <Reveal
                      variant={flip ? "right" : "left"}
                      className={`md:col-span-6 ${flip ? "md:order-2" : ""}`}
                    >
                      <Link href={`/hizmetler/${s.slug}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={s.image}
                            alt={s.imageAlt}
                            width={1200}
                            height={900}
                            fill
                            sizes="(max-width:768px) 100vw, 50vw"
                            className="img-zoom img-duotone object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                          {/* vertical service name on image */}
                          <span className="vertical-text-up pointer-events-none absolute right-5 top-5 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/85">
                            {s.shortTitle}
                          </span>
                          {/* watermark icon */}
                          <span
                            className="svc-watermark pointer-events-none absolute -bottom-3 left-4 text-white/15"
                            aria-hidden="true"
                          >
                            <ServiceIcon name={s.icon} className="h-28 w-28 md:h-36 md:w-36" />
                          </span>
                          {/* corner icon badge */}
                          <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center bg-white/90 text-ink backdrop-blur-sm transition-colors duration-300 group-hover:bg-ink group-hover:text-white">
                            <ServiceIcon name={s.icon} className="svc-icon h-6 w-6" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>

                    {/* Text */}
                    <div className={`md:col-span-6 ${flip ? "md:order-1" : ""}`}>
                      <Reveal variant={flip ? "left" : "right"} delay={120}>
                        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                          <span className="h-px w-8 bg-accent-warm" />
                          {s.shortTitle}
                        </p>
                        <h2 className="mt-5 text-[clamp(1.9rem,3.5vw,3rem)] leading-tight">
                          <Link href={`/hizmetler/${s.slug}`} className="title-underline">
                            {s.title}
                          </Link>
                        </h2>
                        <p className="mt-5 leading-relaxed text-ink/80">{s.summary}</p>
                      </Reveal>

                      <Reveal variant="up" delay={220}>
                        <ul className="stagger mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                          {s.scope.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-muted">
                              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-warm" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Reveal>

                      <Reveal variant="up" delay={320}>
                        <Link
                          href={`/hizmetler/${s.slug}`}
                          className="group/btn mt-9 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em]"
                        >
                          Hizmeti incele
                          <span className="flex h-10 w-10 items-center justify-center border border-ink transition-all duration-300 group-hover/btn:bg-ink group-hover/btn:text-white">
                            →
                          </span>
                        </Link>
                      </Reveal>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="pb-24 pt-10">
        <Container>
          <Reveal variant="scale">
            <div className="relative overflow-hidden bg-ink px-8 py-16 text-center text-white md:px-16 md:py-20">
              <p
                className="pointer-events-none absolute inset-x-0 top-6 select-none font-display text-[5rem] italic leading-none text-white/[0.06] md:text-[8rem]"
                aria-hidden="true"
              >
                Kaliteyle Kurulur
              </p>
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-[clamp(1.9rem,4vw,3.2rem)]">
                  Aradığınız çözümü birlikte tanımlayalım.
                </h2>
                <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70">
                  Projenizin hangi aşamasında olursanız olun, ihtiyacınıza en uygun
                  hizmeti belirlemek için bize ulaşın.
                </p>
                <Link
                  href="/iletisim"
                  className="btn-sheen group mt-9 inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  İletişime geçin
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}