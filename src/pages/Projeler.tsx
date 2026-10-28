import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";


export default function ProjelerPage() {
  return (
    <>
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Projelerimiz</p>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4rem)]">
              Proje portföyümüz <em className="text-accent">hazırlanıyor.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Proje portföyümüz hazırlanıyor; şu anda yayımlanmış proje kaydı
              bulunmuyor. Kuk İnşaat'ın hizmet kapsamı ve projenize uygun
              çalışma alanları hakkında bilgi almak için bizimle iletişime geçin.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <ProjectsBrowser />
        </Container>
      </section>
    </>
  );
}