"use client";

import type { ReactNode } from "react";
import { Link } from "@/lib/next-shim";
import { COOKIE_PREF_EVENT } from "@/components/layout/CookieConsent";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { LogoMark } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/Social";

/* ─────────────────────────── kart ─────────────────────────── */

function Card({
  kicker,
  title,
  children,
  className = "",
  delay = 0,
  accent = "cool",
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  accent?: "cool" | "warm";
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      data-accent={accent}
      className={`footer-card relative flex h-full flex-col overflow-hidden border border-white/[0.09] bg-white/[0.04] p-7 backdrop-blur-xl md:p-8 ${className}`}
    >
      <span aria-hidden="true" className="footer-card-glow" />
      <span aria-hidden="true" className="footer-card-edge" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="footer-kicker">
            <span aria-hidden="true" className="footer-kicker-dot" />
            {kicker}
          </p>
          <h3 className="mt-2.5 font-display text-[1.08rem] font-semibold tracking-[-0.01em] text-white">
            {title}
          </h3>
        </div>
      </div>

      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const external = href?.startsWith("http");
  const inner = (
    <>
      <span className="footer-row-label">{label}</span>
      <span className="footer-row-value">{value}</span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="footer-row footer-row-link"
      >
        {inner}
      </a>
    );
  }
  return <div className="footer-row">{inner}</div>;
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────── footer ─────────────────────────── */

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-bg">
      {/* Atmosfer: yumuşak ışık, desen yok */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="footer-glow absolute -top-40 left-[8%] h-[30rem] w-[30rem] rounded-full bg-[#1f435c]/50 blur-[120px]" />
        <div className="footer-glow footer-glow-slow absolute -bottom-40 right-[4%] h-[26rem] w-[26rem] rounded-full bg-accent-warm/20 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-[#0c1115]" />
      </div>

      <div className="container-x relative pb-10 pt-20 md:pt-24">
        {/* ── Çağrı ── */}
        <div className="footer-cta grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="footer-kicker">
              <span aria-hidden="true" className="footer-kicker-dot" />
              Bir projeniz mi var?
            </p>
            <Link href="/iletisim" className="group mt-5 inline-block">
              <span className="font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.03em]">
                Birlikte inşa edelim
                <span className="ml-3 inline-block text-accent-soft transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-1">
                  ↗
                </span>
              </span>
              <span className="mt-4 block h-px w-0 bg-accent-soft/70 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <a
              href={site.contact.phoneHref}
              className="footer-btn footer-btn-ghost"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 3.5h3l1.3 3.4-1.9 1.3a10 10 0 0 0 5.4 5.4l1.3-1.9 3.4 1.3v3a1.7 1.7 0 0 1-1.9 1.7A14.4 14.4 0 0 1 2.3 5.4 1.7 1.7 0 0 1 4 3.5Z" strokeLinejoin="round" />
              </svg>
              {site.contact.phone}
            </a>
            <a href={site.contact.emailHref} className="footer-btn footer-btn-solid">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="2.4" y="4.4" width="15.2" height="11.2" />
                <path d="m3 5.2 7 5.3 7-5.3" />
              </svg>
              {site.contact.email}
            </a>
          </div>
        </div>

        {/* ── Kartlar: 12 kolon, iki eşit satır ── */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {/* Satır 1 */}
          <Card kicker="Kuk İnşaat" title="Kaliteyle Kurulur" className="lg:col-span-4" delay={0}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/15 bg-white/[0.05]">
                <LogoMark variant="light" className="h-8 w-auto opacity-90" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[1.3rem] font-extrabold tracking-[0.16em] text-white">KUK</span>
                <span className="mt-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.5em] text-bg/55">İnşaat</span>
              </span>
            </div>
            <p className="mt-6 text-[0.84rem] leading-[1.75] text-bg/62">
              Kocaeli merkezli inşaat ve mühendislik firması. Konut, ticari ve karma kullanımlı
              yapılarda projelendirmeden teslime kadar tek elden hizmet.
            </p>
            <div className="mt-auto pt-7">
              <p className="footer-row-label mb-3">Takip edin</p>
              <SocialLinks variant="footer" />
            </div>
          </Card>

          <Card kicker="Kurumsal" title="Şirket Bilgileri" className="lg:col-span-4" delay={90}>
            <div className="footer-rows">
              <InfoRow label="Ünvan" value={site.legalName} />
              <InfoRow label="MERSİS" value={site.mersisNo} />
              <InfoRow label="Vergi No" value={`${site.taxNo} · ${site.taxOffice}`} />
              <InfoRow label="Sicil" value={site.registry} />
              <InfoRow label="KEP" value={site.kepAddress} href={`mailto:${site.kepAddress}`} />
            </div>
          </Card>

          <Card kicker="İletişim" title="Bize Ulaşın" className="lg:col-span-4" delay={180} accent="warm">
            <address className="footer-rows not-italic">
              <InfoRow label="Adres" value={site.contact.address} />
              <InfoRow label="Telefon" value={site.contact.phone} href={site.contact.phoneHref} />
              <InfoRow label="E-posta" value={site.contact.email} href={site.contact.emailHref} />
              <InfoRow label="Çalışma" value={site.contact.hours} />
            </address>
            <a
              href={site.contact.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-inline-link mt-6"
            >
              Yol tarifi al <Arrow />
            </a>
          </Card>

          {/* Satır 2 */}
          <Card kicker="Keşfet" title="Sayfalar" className="lg:col-span-4" delay={120}>
            <ul className="footer-list">
              {site.nav.map((item, i) => (
                <li key={item.href} style={{ animationDelay: `${260 + i * 50}ms` }}>
                  <Link href={item.href} className="footer-list-link">
                    <span>{item.label}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
              <li style={{ animationDelay: `${260 + site.nav.length * 50}ms` }}>
                <Link href="/gizlilik" className="footer-list-link">
                  <span>Gizlilik &amp; KVKK</span>
                  <Arrow />
                </Link>
              </li>
            </ul>
          </Card>

          <Card kicker="Uzmanlık" title="Hizmetlerimiz" className="md:col-span-2 lg:col-span-8" delay={210}>
            <ul className="footer-list footer-list-2col">
              {services.map((s, i) => (
                <li key={s.slug} style={{ animationDelay: `${300 + i * 50}ms` }}>
                  <Link href={`/hizmetler/${s.slug}`} className="footer-list-link">
                    <span className="footer-list-index">0{i + 1}</span>
                    <span className="flex-1">{s.title}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* ── Alt şerit ── */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-7 text-[0.72rem] text-bg/42 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Kuk İnşaat. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/gizlilik" className="footer-inline-muted">Gizlilik &amp; KVKK</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(COOKIE_PREF_EVENT))}
              className="footer-inline-muted"
            >
              Çerez Tercihleri
            </button>
            <Link href="/iletisim" className="footer-inline-muted">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
