import { notFound } from "@/lib/next-shim";
import { Image } from "@/lib/next-shim";
import { Link } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { services, getService } from "@/data/services";

const siteUrl = "https://kukinsaat.com";


export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
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
      {/* Header — markanın soyut mimari görseliyle uyumlu kapak */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={service.image}
            alt=""
            className="ken-burns h-full w-full scale-105 object-cover saturate-[0.94]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/72 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/45" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:96px_96px]" />
        </div>

        <Container className="relative flex min-h-[440px] flex-col justify-center py-20 md:min-h-[500px] md:py-24">
          <Reveal variant="left">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <Link href="/hizmetler" className="transition-colors hover:text-white">Hizmetler</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/90">{service.shortTitle}</span>
            </nav>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <div className="mt-8 flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/35 text-white">
                <ServiceIcon name={service.icon} className="h-8 w-8" />
              </span>
              <h1 className="max-w-3xl text-balance text-[clamp(2.25rem,5vw,4rem)] leading-tight">
                {service.title}
              </h1>
            </div>
          </Reveal>
          <Reveal variant="up" delay={200}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80">{service.summary}</p>
          </Reveal>
          <Reveal variant="up" delay={280}>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/55">
              <span className="text-white/85">Kuk İnşaat</span>
              <span aria-hidden="true" className="hidden h-3 w-px bg-white/25 sm:block" />
              <span>Kaliteyle Kurulur</span>
              <span className="ml-auto hidden items-center gap-3 md:flex">
                <span className="h-px w-8 bg-accent-soft/60" aria-hidden="true" />
                Hizmet 0{index + 1} / 0{services.length}
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Content */}
      <section className="pt-14 pb-20 md:pt-20">
        <Container>
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={1200}
                  height={900}
                  fill
                  sizes="(max-width:768px) 100vw, 60vw"
                  className="img-duotone object-cover"
                  priority
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