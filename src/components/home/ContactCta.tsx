import { Link } from "@/lib/next-shim";
import { Image } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/10410086/pexels-photo-10410086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800"
          alt="Alacakaranlıkta cam ve beton cepheli çağdaş yapı"
          fill
          sizes="100vw"
          className="img-duotone object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
      </div>
      <Container className="relative py-24 md:py-36">
        <Reveal variant="left">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
            <span className="h-px w-10 bg-accent-soft" /> İletişim
          </p>
        </Reveal>
        <Reveal variant="up" delay={120}>
          <h2 className="mt-6 max-w-3xl text-[clamp(2.6rem,5.5vw,4.8rem)]">
            Projenizi <em className="text-accent-soft">konuşalım.</em>
          </h2>
        </Reveal>
        <Reveal variant="up" delay={240}>
          <p className="mt-6 max-w-xl leading-relaxed text-white/75">
            Yeni bir yapı, arsanız için bir fikir ya da devam eden bir iş;
            hangi aşamada olursanız olun bize ulaşın, birlikte değerlendirelim.
          </p>
        </Reveal>
        <Reveal variant="up" delay={360}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/iletisim" className="group inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white">
              İletişim Formu
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <a href={site.contact.emailHref} className="border border-white/50 px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-ink">
              {site.contact.email}
            </a>
          </div>
          <p className="mt-8 text-sm text-white/60">{site.contact.address}</p>
        </Reveal>
      </Container>
    </section>
  );
}