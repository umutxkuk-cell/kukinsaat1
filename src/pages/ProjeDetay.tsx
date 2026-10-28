import { notFound } from "@/lib/next-shim";
import { Image } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getProject } from "@/data/projects";


export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{project.type}</p>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4rem)]">{project.name}</h1>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted">
              <span>{project.location}</span>
              <span>{project.year}</span>
              <span>{project.status}</span>
              <span>Rol: {project.role}</span>
            </div>
            {project.demo && (
              <p className="mt-6 inline-block bg-bg-2 px-3 py-1 text-xs text-muted">
                Örnek proje — temsili içerik
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          {project.images[0] && (
            <Reveal>
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={project.images[0].src}
                  alt={project.images[0].alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          <div className="grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)]">Proje hakkında</h2>
              <p className="mt-6 text-base leading-relaxed text-ink/80">{project.description}</p>
              <ul className="mt-8 space-y-3">
                {project.details.map((d) => (
                  <li key={d} className="flex gap-3 text-sm text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-accent-warm" />
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="md:col-span-5">
              <div className="border-t border-line pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Bilgiler</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Tür</dt>
                    <dd>{project.type}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Konum</dt>
                    <dd>{project.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Yıl</dt>
                    <dd>{project.year}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Durum</dt>
                    <dd>{project.status}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Rol</dt>
                    <dd>{project.role}</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-8">
                <Button href="/projeler" variant="secondary">
                  Projelere dön
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {project.images.length > 1 && (
        <section className="pb-24">
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              {project.images.slice(1).map((img) => (
                <Reveal key={img.src}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={img.src} alt={img.alt} fill sizes="50vw" className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}