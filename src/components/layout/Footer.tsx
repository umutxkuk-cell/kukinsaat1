import { useEffect, useRef } from "react";
import { Link } from "@/lib/next-shim";
import { COOKIE_PREF_EVENT } from "@/components/layout/CookieConsent";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { LogoMark, LogoStacked } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/Social";

function CompanySignature() {
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const signature = signatureRef.current;
    if (!signature) return;
    if (typeof IntersectionObserver === "undefined") {
      signature.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          signature.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(signature);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={signatureRef} className="company-signature border-t border-white/10 py-10 md:py-12">
      <div className="grid gap-7 md:grid-cols-12 md:items-center md:gap-12">
        <div className="company-signature-brand flex items-center gap-4 md:col-span-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/15 bg-white/[0.03]">
            <LogoMark variant="light" className="h-8 w-auto opacity-85" />
          </span>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-bg/50">
              Şirket Ünvanı
            </p>
            <p className="mt-2 font-display text-base font-semibold leading-none text-bg">
              Kuk İnşaat
            </p>
          </div>
        </div>

        <div className="md:col-span-8 md:border-l md:border-white/10 md:pl-10">
          <p className="company-signature-name text-balance break-words font-display text-[clamp(0.95rem,1.35vw,1.15rem)] font-semibold leading-relaxed tracking-[0.005em] text-bg/90">
            {site.legalName}
          </p>
          <div className="company-signature-meta mt-3 flex flex-col gap-1.5 text-[0.66rem] uppercase tracking-[0.16em] text-bg/40 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1">
            <span>Mersis No: {site.mersisNo}</span>
            <span aria-hidden="true" className="hidden h-3 w-px self-center bg-white/15 sm:block" />
            <span>{site.registry}</span>
            <span aria-hidden="true" className="hidden h-3 w-px self-center bg-white/15 sm:block" />
            <span>{site.taxOffice}</span>
          </div>
          <span
            aria-hidden="true"
            className="company-signature-rule mt-5 block h-px w-full max-w-sm origin-right bg-gradient-to-r from-accent-soft/70 to-transparent md:ml-auto"
          />
        </div>
      </div>
    </div>
  );
}

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

        <CompanySignature />

        <div className="flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-bg/45 md:flex-row md:items-center md:justify-between">
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
    </footer>
  );
}