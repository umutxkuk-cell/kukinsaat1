import { Hero } from "@/components/home/Hero";
import { Faq } from "@/components/home/Faq";
import { Illustration } from "@/components/ui/Illustration";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { Link } from "@/lib/next-shim";
import "@/components/home/home.css";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function Introduction() {
  return (
    <section className="home-introduction" aria-labelledby="home-introduction-title">
      <div className="home-container">
        <Reveal variant="up">
          <p className="home-eyebrow"><span /> Yaklaşımımız</p>
        </Reveal>
        <div className="home-introduction__grid">
          <Reveal variant="up">
            <h2 id="home-introduction-title">
              Sağlam fikirlerden <span>kalıcı yapılara.</span>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={100} className="home-introduction__text">
            <p>
              KUK İnşaat olarak her projeye aynı yerden başlıyoruz: doğru anlamak,
              dikkatle planlamak ve özenle uygulamak.
            </p>
            <Link href="/kurumsal" className="home-text-link">
              KUK İnşaat&apos;ı tanıyın <Arrow />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="home-services" aria-labelledby="home-services-title">
      <div className="home-container home-services__layout">
        <div className="home-services__intro">
          <Reveal variant="up">
            <p className="home-eyebrow home-eyebrow--light"><span /> Hizmetlerimiz</p>
            <h2 id="home-services-title">Fikirden yapıya, her adımda.</h2>
            <p>
              İhtiyaçlarınıza uygun mühendislik ve uygulama çözümlerini bir arada sunuyoruz.
            </p>
            <Link href="/hizmetler" className="home-text-link home-text-link--light">
              Tüm hizmetler <Arrow />
            </Link>
          </Reveal>
        </div>

        <ol className="home-services__list">
          {services.map((service, index) => (
            <Reveal key={service.slug} variant="up" as="li" delay={index * 60}>
              <Link href={`/hizmetler/${service.slug}`} className="home-service">
                <span className="home-service__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="home-service__body">
                  <span className="home-service__title">{service.title}</span>
                  <span className="home-service__summary">{service.summary}</span>
                </span>
                <span className="home-service__arrow"><Arrow /></span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="home-approach" aria-labelledby="home-approach-title">
      <div className="home-container home-approach__layout">
        <Reveal variant="up" className="home-approach__image-wrap">
          <figure>
            <div className="home-approach__image-frame">
              <Illustration page="kurumsal" fit="slice" className="home-approach__illustration" decorative />
            </div>
            <figcaption>Mühendislik yaklaşımımızdan ilham alan temsili illüstrasyon.</figcaption>
          </figure>
        </Reveal>

        <Reveal variant="up" delay={100} className="home-approach__copy">
          <p className="home-eyebrow"><span /> Çalışma anlayışımız</p>
          <h2 id="home-approach-title">Her detayda aynı özen.</h2>
          <p>
            İlk görüşmeden uygulamaya kadar teknik kararları, kaliteyi ve açık iletişimi
            birlikte ele alıyoruz.
          </p>
          <Link href="/kurumsal" className="home-text-link">
            Yaklaşımımızı keşfedin <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Portfolio() {
  const hasProjects = projects.length > 0;

  return (
    <section className="home-portfolio" aria-labelledby="home-portfolio-title">
      <div className="home-container home-portfolio__layout">
        <Reveal variant="up">
          <p className="home-eyebrow"><span /> Projelerimiz</p>
          <h2 id="home-portfolio-title">
            {hasProjects ? "Fikirden gerçeğe uzanan projeler." : "Proje portföyümüz hazırlanıyor."}
          </h2>
        </Reveal>
        <Reveal variant="up" delay={100} className="home-portfolio__copy">
          <p>
            {hasProjects
              ? "Çalışmalarımızı, proje detaylarını ve güncel portföyümüzü inceleyin."
              : "Yayımlanmış proje kayıtlarımız hazır olduğunda burada paylaşacağız."}
          </p>
          <Link href="/projeler" className="home-text-link">
            Projeler sayfası <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Services />
      <Approach />
      <Portfolio />
      <Faq />
    </>
  );
}