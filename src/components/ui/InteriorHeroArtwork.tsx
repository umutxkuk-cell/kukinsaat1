export type InteriorPage = "kurumsal" | "hizmetler" | "projeler" | "iletisim";

/**
 * İç sayfa kapakları.
 *
 * Görseller marka paletiyle (mineral kırık beyaz, grafit, petrol mavisi ve
 * ölçülü terracotta) üretilmiş soyut mimari kompozisyonlardır. Her biri,
 * üzerine gelen başlığın anlamını görsel olarak destekler:
 *   kurumsal → kemerler ve taş bloklarla kurumsal kalıcılık
 *   hizmetler → çelik, cam ve beton birleşimiyle mühendislik
 *   projeler  → maket/plan üzerinde yükselen yapı kütleleri
 *   iletisim  → topoğrafya ve konum çizgileriyle bağlantı
 */
const artwork: Record<
  InteriorPage,
  { src: string; position: string; alt: string }
> = {
  kurumsal: {
    src: "/images/abstract-kurumsal.jpg",
    position: "center",
    alt: "Taş kemerler ve grafit kütlelerden oluşan soyut kurumsal mimari",
  },
  hizmetler: {
    src: "/images/abstract-hizmetler.jpg",
    position: "62% center",
    alt: "Çelik kiriş, cam ve betonun birleştiği soyut mühendislik kompozisyonu",
  },
  projeler: {
    src: "/images/abstract-projeler.jpg",
    position: "center",
    alt: "Mimari plan üzerinde yükselen çağdaş yapı kütleleri",
  },
  iletisim: {
    src: "/images/abstract-iletisim.jpg",
    position: "center",
    alt: "Topoğrafik çizgiler ve konum iğneleriyle soyut iletişim haritası",
  },
};

export function InteriorHeroArtwork({ page }: { page: InteriorPage }) {
  const art = artwork[page];

  return (
    <div className="interior-hero-art relative h-full w-full overflow-hidden" data-page-art={page}>
      <img
        src={art.src}
        alt={art.alt}
        className="ken-burns h-full w-full object-cover"
        style={{ objectPosition: art.position }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
      {/* Görselin üstüne ince bir mühendislik ızgarası ve petrol mavisi derinlik */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:96px_96px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_85%_20%,transparent_25%,rgba(14,24,31,0.35)_100%)]"
        aria-hidden="true"
      />
    </div>
  );
}
