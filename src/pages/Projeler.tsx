import { Container } from "@/components/ui/Container";
import { InteriorHero } from "@/components/ui/InteriorHero";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";


export default function ProjelerPage() {
  return (
    <>
      <InteriorHero
        page="projeler"
        label="Projelerimiz"
        title={<>Proje portföyümüz <span className="text-accent-soft">hazırlanıyor.</span></>}
        description="Proje portföyümüz hazırlanıyor; şu anda yayımlanmış proje kaydı bulunmuyor. Kuk İnşaat'ın hizmet kapsamı ve projenize uygun çalışma alanları hakkında bilgi almak için bizimle iletişime geçin."
      />

      <section className="py-16 md:py-24">
        <Container>
          <ProjectsBrowser />
        </Container>
      </section>
    </>
  );
}