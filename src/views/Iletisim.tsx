import { Container } from "@/components/ui/Container";
import { InteriorHero } from "@/components/ui/InteriorHero";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { SocialLinks } from "@/components/brand/Social";
import { site } from "@/data/site";

function ExternalArrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M4 16 16 4M7 4h9v9" strokeLinecap="square" strokeLinejoin="round" />
    </svg>
  );
}

export default function IletisimPage() {
  return (
    <>
      <InteriorHero
        page="iletisim"
        tone="warm"
        label="İletişim"
        title={<>Bize <span className="text-accent">ulaşın.</span></>}
        description="Projenizle ilgili ihtiyaçlarınızı bize anlatın. Formu doldurabilir ya da telefon ve e-posta üzerinden doğrudan ulaşabilirsiniz."
      />

      <section aria-labelledby="contact-options-title" className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal variant="up">
            <div className="mb-9 grid gap-4 border-b border-line pb-8 md:mb-11 md:grid-cols-12 md:items-end md:gap-8 md:pb-9">
              <div className="md:col-span-7">
                <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                  <span className="h-px w-9 bg-accent-warm" aria-hidden="true" />
                  İletişime başlayın
                </p>
                <h2 id="contact-options-title" className="mt-4 max-w-xl text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.12]">
                  Projenizi konuşalım.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-[1.8] text-muted md:col-span-5 md:justify-self-end md:text-base">
                Size uygun yöntemi seçin: doğrudan ulaşın veya kısa bir mesaj bırakın.
              </p>
            </div>
          </Reveal>

          <div className="grid items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
            <Reveal variant="left" className="lg:col-span-5">
              <div className="relative flex h-full flex-col overflow-hidden border border-ink-2/20 bg-ink-2 p-6 text-bg sm:p-8 lg:p-9 xl:p-10">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/[0.13]" aria-hidden="true" />
                <div className="relative flex h-full flex-col">
                  <div>
                    <p className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent-soft">
                      <span className="h-px w-8 bg-accent-warm" aria-hidden="true" />
                      01 / Doğrudan iletişim
                    </p>
                    <h3 className="mt-5 text-[clamp(1.55rem,2.6vw,2.05rem)] leading-tight text-white">
                      Ofisimize ulaşın.
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-[1.75] text-bg/70">
                      Telefonla görüşmek veya e-posta göndermek isterseniz bize doğrudan ulaşabilirsiniz.
                    </p>
                  </div>

                  <dl className="mt-8">
                    <div className="border-t border-white/15 py-5">
                      <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-bg/55">Telefon</dt>
                      <dd className="mt-2">
                        <a href={site.contact.phoneHref} className="group inline-flex min-h-9 items-center gap-3 font-display text-[clamp(1.05rem,2vw,1.35rem)] font-semibold leading-snug text-white transition-colors hover:text-accent-soft">
                          {site.contact.phone}
                          <ExternalArrow className="h-4 w-4 shrink-0 text-accent-soft transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </dd>
                    </div>
                    <div className="border-t border-white/15 py-5">
                      <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-bg/55">E-posta</dt>
                      <dd className="mt-2">
                        <a href={site.contact.emailHref} className="group inline-flex min-h-9 max-w-full items-center gap-3 break-all font-display text-[clamp(1rem,1.7vw,1.2rem)] font-semibold leading-snug text-white transition-colors hover:text-accent-soft">
                          {site.contact.email}
                          <ExternalArrow className="h-4 w-4 shrink-0 text-accent-soft transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </dd>
                    </div>
                    <div className="border-t border-white/15 py-5">
                      <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-bg/55">Ofis adresi</dt>
                      <dd className="mt-2 max-w-xs text-sm leading-[1.7] text-bg/90">
                        <address className="not-italic">{site.contact.address}</address>
                      </dd>
                    </div>
                    <div className="border-y border-white/15 py-5">
                      <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-bg/55">Çalışma saatleri</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-bg/90">{site.contact.hours}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-7">
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-bg/55">Sosyal medya</p>
                    <SocialLinks variant="footer" className="mt-4 !gap-2" />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={100} className="lg:col-span-7">
              <div className="h-full border border-line bg-surface p-6 shadow-[0_20px_60px_rgba(32,38,43,0.055)] sm:p-8 lg:p-9 xl:p-10">
                <p className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent">
                  <span className="h-px w-8 bg-accent-warm" aria-hidden="true" />
                  02 / Mesaj gönderin
                </p>
                <h3 className="mt-5 text-[clamp(1.55rem,2.6vw,2.05rem)] leading-tight">Projenizden bahsedin.</h3>
                <p className="mt-3 max-w-lg text-sm leading-[1.75] text-muted">
                  İhtiyacınızı ve projenizin kapsamını kısaca yazın; size dönüş yapalım.
                </p>
                <div className="mt-8 border-t border-line pt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="office-location-title" className="border-t border-line bg-bg-2 py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid items-stretch gap-9 lg:grid-cols-12 lg:gap-10">
            <Reveal variant="left" className="lg:col-span-4">
              <div className="flex h-full flex-col border-t-2 border-ink pt-6">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                  03 / Konum
                </p>
                <h2 id="office-location-title" className="mt-5 max-w-sm text-[clamp(1.85rem,3.1vw,2.65rem)] leading-[1.12]">
                  Başiskele&apos;deki ofisimiz.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-[1.8] text-muted md:text-base">
                  Ovacık Mahallesi&apos;ndeki ofisimizin konumunu haritada görebilir veya yol tarifi alabilirsiniz.
                </p>
                <div className="mt-auto pt-8">
                  <p className="border-t border-line pt-5 text-sm leading-relaxed text-ink/80">
                    {site.contact.address}
                  </p>
                  <a href={site.contact.mapsUrl} target="_blank" rel="noreferrer" className="group mt-5 inline-flex min-h-11 items-center gap-3 border-b border-ink pb-2 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent-warm hover:text-accent-warm">
                    Yol tarifi al
                    <ExternalArrow className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal variant="right" delay={100} className="lg:col-span-8">
              <ContactMap />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
