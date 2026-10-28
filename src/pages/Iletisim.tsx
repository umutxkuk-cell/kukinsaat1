import { Container } from "@/components/ui/Container";
import { InteriorHero } from "@/components/ui/InteriorHero";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/brand/Social";
import { site } from "@/data/site";


export default function IletisimPage() {
  return (
    <>
      <InteriorHero
        page="iletisim"
        label="İletişim"
        title={<>Bize <span className="text-accent-soft">ulaşın.</span></>}
        description="Kocaeli ve çevresindeki inşaat, mühendislik ve proje ihtiyaçlarınız için aşağıdaki formu doldurabilir veya doğrudan e-posta gönderebilirsiniz. En kısa sürede size dönüş yaparız."
      />

      <section className="pb-24 pt-16 md:pt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal variant="left">
                <div className="border-t-2 border-ink pt-8">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Ofis</p>
                  <address className="mt-4 space-y-5 text-base not-italic leading-relaxed">
                    <p className="font-display text-2xl leading-snug">{site.contact.address}</p>
                    <p>
                      <a href={site.contact.phoneHref} className="font-medium underline-offset-4 hover:underline">
                        {site.contact.phone}
                      </a>
                    </p>
                    <p>
                      <a href={site.contact.emailHref} className="font-medium underline-offset-4 hover:underline">
                        {site.contact.email}
                      </a>
                    </p>
                    <p className="text-sm text-muted">{site.contact.hours}</p>
                  </address>

                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">Sosyal medya</p>
                    <SocialLinks variant="pill" className="mt-4" />
                  </div>
                  <div className="mt-8">
                    <a
                      href={site.contact.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] underline-offset-4 hover:underline"
                    >
                      Google Maps&apos;te aç / Yol tarifi al →
                    </a>
                  </div>
                  <p className="mt-8 text-xs leading-relaxed text-muted">{site.legalName}</p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal variant="right" delay={100}>
                <div className="bg-white p-6 shadow-[0_20px_50px_rgba(20,20,20,0.07)] md:p-10">
                  <h2 className="font-display text-3xl">Mesaj gönderin</h2>
                  <p className="mt-2 text-sm text-muted">
                    Projenizden kısaca bahsedin; size dönüş yapalım.
                  </p>
                  <div className="mt-8">
                    <ContactForm />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Tam genişlik konum haritası */}
      <section className="pb-24">
        <Container>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent-warm" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Konum</p>
          </div>
          <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)]">Bizi burada bulabilirsiniz.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{site.contact.address}</p>
        </Container>
        <div className="relative mt-8 h-[420px] w-full overflow-hidden border-y border-line bg-bg-2 md:h-[520px]">
          <iframe
            title="Kuk İnşaat konum haritası — Ovacık Mah. Çuhane Cad. No:176 Başiskele, Kocaeli"
            src={site.contact.mapsEmbed}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}