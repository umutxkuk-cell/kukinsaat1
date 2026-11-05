import { LogoMark } from "@/components/brand/Logo";
import { Illustration } from "@/components/ui/Illustration";
import { Link } from "@/lib/next-shim";

export function Hero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__media" aria-hidden="true">
        <Illustration page="home" fit="slice" className="home-hero__scene" decorative />
        <div className="home-hero__shade" aria-hidden="true" />
      </div>

      <div className="home-container home-hero__content">
        <div className="home-hero__copy">
          <div className="home-hero__brand" role="img" aria-label="KUK İnşaat">
            <LogoMark variant="dark" className="home-hero__mark" />
            <span className="home-hero__wordmark" aria-hidden="true">
              <span>KUK</span>
              <span>İNŞAAT</span>
            </span>
          </div>

          <h1 id="home-hero-title" className="home-hero__title">
            Kaliteyle <span>Kurulur.</span>
          </h1>
          <p className="home-hero__description">
            Kocaeli&apos;nde mühendislik ve inşaatı bir araya getirerek,
            geleceğe güvenle taşınacak yapılar için çalışıyoruz.
          </p>

          <Link href="/hizmetler" className="home-hero__button">
            <span>Hizmetlerimizi keşfedin</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}