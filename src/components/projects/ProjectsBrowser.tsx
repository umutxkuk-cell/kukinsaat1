import { useMemo, useState } from "react";
import { Link } from "@/lib/next-shim";
import { LogoMark } from "@/components/brand/Logo";
import { Image } from "@/lib/next-shim";
import { projects, getProjectTypes, type Project } from "@/data/projects";

function EmptyState() {
  return (
    <div className="border border-ink/15 bg-bg-2 px-8 py-16 text-center md:px-16 md:py-24">
      <LogoMark className="mx-auto h-20 w-auto opacity-25" />
      <h2 className="mt-8 font-display text-[clamp(1.8rem,3.4vw,2.8rem)]">Proje portföyümüz hazırlanıyor</h2>
      <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
        Şu anda yayımlanmış proje kaydı bulunmuyor. Gerçek proje bilgileri
        paylaşılmaya hazır olduğunda bu bölüm güncellenecektir. Hizmet kapsamımız
        hakkında bilgi almak için bizimle iletişime geçebilirsiniz.
      </p>
      <Link
        href="/iletisim"
        className="group mt-10 inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink-hover"
      >
        Bize ulaşın
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projeler/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.images[0].src}
          alt={project.images[0].alt}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {project.demo && (
          <span className="absolute left-4 top-4 bg-bg/90 px-3 py-1 text-xs text-muted">
            Örnek proje — temsili içerik
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl">{project.name}</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-muted">{project.type}</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {project.location} · {project.year}
      </p>
      <p className="mt-2 text-sm text-ink/70">{project.status}</p>
    </Link>
  );
}

export function ProjectsBrowser() {
  const types = getProjectTypes();
  const [active, setActive] = useState("Tümü");

  const filtered = useMemo(() => {
    if (active === "Tümü") return projects;
    return projects.filter((p) => p.type === active);
  }, [active]);

  if (projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={`border px-4 py-2 text-sm transition-colors ${
              active === t
                ? "border-ink bg-ink text-bg"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
            aria-pressed={active === t}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-muted">Bu kategoriye ait proje bulunmuyor.</p>
      )}
    </>
  );
}