/**
 * Beş sayfanın anlamsal teknik illüstrasyonları. Yazı içermeyen sahneler,
 * mineral palet + mühendislik mavisi + terracotta vurgusuyla birlikte tasarlandı.
 * Önceki görsel sürümleri ayrı dosyalarda korunur.
 */
export type IllustrationPage = "home" | "kurumsal" | "hizmetler" | "projeler" | "iletisim";

const sources: Record<IllustrationPage, { src: string; alt: string }> = {
  home: {
    src: "/images/hero-section-cut.svg",
    alt: "Radye temel, kolonlar, kat döşemeleri, merdivenler ve ölçülerle binanın mimari kesiti",
  },
  kurumsal: {
    src: "/images/pagehero-kurumsal-plan.svg",
    alt: "Kat planı paftası, T-cetvel ve pergelle mimari proje masası",
  },
  hizmetler: {
    src: "/images/pagehero-hizmetler-site.svg",
    alt: "Kule vincin kiriş indirdiği iskeleli betonarme yapı şantiyesi",
  },
  projeler: {
    src: "/images/pagehero-projeler-facade.svg",
    alt: "Cam cepheli üç kütleli tamamlanmış modern bina çizimi, temsili",
  },
  iletisim: {
    src: "/images/pagehero-iletisim-siteplan.svg",
    alt: "Yollar, bina izleri ve hedef parsel üzerinde konum iğnesiyle temsili vaziyet planı",
  },

};

export function Illustration({
  page,
  className = "h-full w-full object-cover",
  position = "70% 50%",
  priority = false,
  decorative = false,
}: {
  page: IllustrationPage;
  className?: string;
  position?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const art = sources[page];
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={art.src}
      alt={decorative ? "" : art.alt}
      aria-hidden={decorative ? true : undefined}
      className={className}
      style={{ objectPosition: position }}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
