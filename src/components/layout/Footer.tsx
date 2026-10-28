import { Link } from "@/lib/next-shim";
import { COOKIE_PREF_EVENT } from "@/components/layout/CookieConsent";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { LogoStacked } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/Social";

export function Footer() {
  return (
    <footer className="bg-ink text-bg">
      <div className="container-x pb-10 pt-20">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-14 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-bg/50">Bir projeniz mi var?</p>
            <Link href="/iletisim" className="group mt-4 inline-block">
              <span className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
                Birlikte inşa edelim
                <span className="ml-3 inline-block text-accent-soft transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-1">↗</span>
              </span>
            </Link>
          </div>
          <a href={site.contact.emailHref} className="border border-white/25 px-6 py-3 text-sm tracking-wide transition-colors hover:bg-white hover:text-ink">
            {site.contact.email}
          </a>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <LogoStacked variant="light" className="items-start" />
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Kaliteyle Kurulur
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bg/65">{site.description}</p>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.24em] text-bg/45">Takip edin</p>
              <div className="mt-4">
                <SocialLinks variant="footer" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-bg/45">Sayfalar</p>
            <ul className="mt-5 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-bg/75 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.24em] text-bg/45">Hizmetler</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/hizmetler/${s.slug}`} className="text-sm text-bg/75 transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.24em] text-bg/45">İletişim</p>
            <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-bg/75">
              <p>{site.contact.address}</p>
              <p>
                <a href={site.contact.phoneHref} className="text-white underline-offset-4 hover:underline">
                  {site.contact.phone}
                </a>
              </p>
              <p>
                <a href={site.contact.emailHref} className="text-white underline-offset-4 hover:underline">
                  {site.contact.email}
                </a>
              </p>
              <p>{site.contact.hours}</p>
              <p>
                <a href={site.contact.mapsUrl} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  Yol tarifi al →
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Şirket ünvanı — net ve okunur */}
        <div className="border-t border-white/10 pt-7">
          <p className="text-xs uppercase tracking-[0.24em] text-bg/45">Şirket Ünvanı</p>
          <p className="mt-2 text-sm font-medium tracking-wide text-bg/90">
            {site.legalName}
          </p>
        </div>

        <div className="border-t border-white/10 pt-7">
          <p className="text-center font-display text-[clamp(2.2rem,7vw,5.5rem)] font-bold uppercase tracking-[-0.02em] leading-none text-white/[0.06] select-none" aria-hidden="true">
            Kaliteyle Kurulur
          </p>
          <div className="mt-7 flex flex-col gap-3 text-xs text-bg/45 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Kuk İnşaat. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap gap-6">
              <Link href="/gizlilik" className="hover:text-white">Gizlilik &amp; KVKK</Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(COOKIE_PREF_EVENT))}
                className="hover:text-white"
              >
                Çerez Tercihleri
              </button>
              <Link href="/iletisim" className="hover:text-white">İletişim</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}