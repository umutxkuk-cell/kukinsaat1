import { notFound } from "@/lib/next-shim";
import { Link } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Illustration } from "@/components/ui/Illustration";
import { SceneArt } from "@/components/ui/SceneArt";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { services, getService } from "@/data/services";

const siteUrl = "https://kukinsaat.com";


export default function ServiceDetailPage({ slug }: { slug: string }) {
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === slug);
  const next = services[(index + 1) % services.length];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    url: `${siteUrl}/hizmetler/${service.slug}`,
    provider: { "@type": "GeneralContractor", name: "Kuk İnşaat", url: siteUrl },
    areaServed: { "@type": "AdministrativeArea", name: "Kocaeli" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Hizmetlerimiz", item: `${siteUrl}/hizmetler` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${siteUrl}/hizmetler/${service.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Header: hizmetler sayfasındaki açık illüstrasyon ailesi. */}
      <section className="hero-surface relative isolate overflow-hidden border-b border-line bg-bg text-ink">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block" aria-hidden="true">
          <Illustration page="hizmetler" className="h-full w-full object-contain" position="50% 50%" priority decorative />
        </div>
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/50 md:block" aria-hidden="true" />
        <Container className="relative flex min-h-[320px] flex-col justify-center py-16 md:min-h-[390px] md:py-20">
          <nav className="hero-anim hero-anim-1 flex items-center gap-2 text-[0.67rem] uppercase tracking-[0.2em] text-muted">
            <Link href="/hizmetler" className="transition-colors hover:text-accent">
              Hizmetler
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent">{service.shortTitle}</span>
          </nav>

          <div className="hero-anim hero-anim-2 mt-6 flex items-start gap-5">
            <span className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center border border-ink/20 bg-white/80 text-accent">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="max-w-2xl text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] tracking-[-0.032em] text-ink">
              {service.title}
            </h1>
          </div>

          <div className="hero-anim hero-anim-3 mt-7 flex items-start gap-5">
            <span className="mt-2.5 hidden h-px w-12 shrink-0 bg-accent-warm sm:block" aria-hidden="true" />
            <p className="max-w-xl text-[0.98rem] leading-[1.8] text-muted md:text-[1.02rem]">
              {service.summary}
            </p>
          </div>
        </Container>
        <div className="relative h-64 overflow-hidden border-t border-line/60 md:hidden" aria-hidden="true">
          <Illustration page="hizmetler" className="h-full w-full object-contain" position="50% 50%" priority decorative />
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SceneArt
                  kind={service.scene}
                  alt={service.imageAlt}
                  priority
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
            <Reveal variant="right" delay={120} className="md:col-span-5">
              <p className="leading-relaxed text-ink/80">{service.description}</p>
              <h2 className="mt-9 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                <span className="h-px w-8 bg-accent-warm" /> Kapsam
              </h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {service.scope.map((item) => (
                  <li key={item} className="group flex items-center gap-4 py-4 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-accent transition-transform duration-300 group-hover:translate-x-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                    <span className="text-ink/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href="/iletisim" variant="primary">
                  İletişime geçin
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Next service */}
      <section className="pb-24">
        <Container>
          <Reveal variant="up">
            <Link
              href={`/hizmetler/${next.slug}`}
              className="group flex items-center justify-between gap-6 border-t border-ink py-8"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Sonraki hizmet</p>
                <p className="mt-2 font-display text-[clamp(1.6rem,3vw,2.6rem)] transition-colors group-hover:text-accent">
                  {next.title}
                </p>
              </div>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white">
                →
              </span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}