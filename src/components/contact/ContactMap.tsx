"use client";

import { useState } from "react";
import { Illustration } from "@/components/ui/Illustration";
import { site } from "@/data/site";

/**
 * Gerçek harita ancak ziyaretçi istediğinde yüklenir. Önizleme, adresin
 * gerçek haritası olduğu iddia edilmeyen temsili vaziyet planıdır.
 */
export function ContactMap() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="relative h-[320px] min-w-0 overflow-hidden border border-line bg-bg-2 text-ink sm:h-[390px] lg:h-full lg:min-h-[410px]">
      {showMap ? (
        <>
          <iframe
            title="Kuk İnşaat ofis konumu — Başiskele, Kocaeli"
            src={site.contact.mapsEmbed}
            className="absolute inset-0 h-full w-full border-0 bg-bg-2"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <button
            type="button"
            onClick={() => setShowMap(false)}
            className="absolute right-3 top-3 z-10 inline-flex min-h-11 items-center gap-2 bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-ink-2 focus-visible:outline-white"
            aria-label="Haritayı kapat"
          >
            Kapat <span aria-hidden="true">×</span>
          </button>
          <a
            href={site.contact.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-ink-2 focus-visible:outline-white"
          >
            Yol tarifi ↗
          </a>
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Illustration page="iletisim" className="h-full w-full object-cover" position="64% 50%" priority decorative />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/75 to-bg/10" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-accent">
                <span className="h-px w-8 bg-accent-warm" aria-hidden="true" />
                Kocaeli / Başiskele
              </p>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-9 w-9 shrink-0 text-accent" aria-hidden="true">
                <path d="M16 29s10-9.5 10-17a10 10 0 0 0-20 0c0 7.5 10 17 10 17Z" />
                <circle cx="16" cy="12" r="3.5" />
              </svg>
            </div>
            <div>
              <h3 className="max-w-md text-[clamp(1.5rem,2.9vw,2.3rem)] leading-[1.12] text-ink">
                Ofis konumunu görüntüleyin.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-[1.65] text-muted">
                Haritayı burada açabilir veya doğrudan yol tarifi alabilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="group mt-6 inline-flex min-h-11 items-center gap-3 bg-ink px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-bg transition-colors hover:bg-accent focus-visible:outline-accent"
              >
                Haritayı göster
                <span aria-hidden="true" className="text-base leading-none transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
                Bu işlem Google Haritalar içeriğini yükler.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
