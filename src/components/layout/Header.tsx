"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/next-shim";
import { usePathname } from "@/lib/next-shim";
import { site } from "@/data/site";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/Social";
import { ScrollProgress } from "./ScrollProgress";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ana sayfa eskizi de iç sayfalar gibi açık zemindedir. Bu yüzden logo,
  // menü ve teklif düğmesi her rotada koyu metinli, okunaklı header kullanır.

  useEffect(() => {
    // Açılış perdesi hâlâ ekranı kilitliyse kilidi devralmıyoruz; aksi hâlde
    // menü kapanınca perdenin kilidi de yanlışlıkla kaldırılır.
    if (open) {
      document.body.style.overflow = "hidden";
    } else if (!document.body.dataset.introLock) {
      document.body.style.overflow = "";
    }
    return () => {
      if (!document.body.dataset.introLock) document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/92 text-ink shadow-[0_1px_0_rgba(20,20,20,0.04)] backdrop-blur-md"
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="Kuk İnşaat ana sayfa" onClick={() => setOpen(false)} className="shrink-0 transition-opacity hover:opacity-85">
            <Logo variant="dark" />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Ana navigasyon">
            {site.nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className="link-sweep text-[0.82rem] font-medium uppercase tracking-[0.14em] opacity-90 transition-opacity hover:opacity-100"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-bg transition-all duration-300 hover:bg-transparent hover:text-ink"
            >
              Teklif Alın
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" />
              ) : (
                <>
                  <path d="M3 7h18M3 12h12M3 17h18" stroke="currentColor" strokeWidth="1.6" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div
          className={`overflow-y-auto overscroll-contain transition-[max-height,opacity] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            open ? "max-h-[85vh] opacity-100" : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <nav className="container-x border-t border-line bg-bg pb-8 pt-2 text-ink" aria-label="Mobil navigasyon">
            {site.nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                className={`flex items-center justify-between border-b border-line/70 py-4 font-display text-3xl transition-[transform,opacity] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                {item.label}
                <span className="text-base text-accent">→</span>
              </Link>
            ))}
            <div className="pt-6 text-sm text-muted">
              <a href={site.contact.phoneHref} onClick={() => setOpen(false)} className="block py-1 text-ink">{site.contact.phone}</a>
              <a href={site.contact.emailHref} onClick={() => setOpen(false)} className="block py-1 text-ink">{site.contact.email}</a>
              <p className="py-1">{site.contact.addressShort}</p>
              <SocialLinks variant="ghost" className="mt-4 text-ink" />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}