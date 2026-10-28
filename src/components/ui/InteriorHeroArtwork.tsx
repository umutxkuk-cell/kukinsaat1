export type InteriorPage = "kurumsal" | "hizmetler" | "projeler" | "iletisim";

const artwork: Record<InteriorPage, string> = {
  kurumsal: "/images/abstract-kurumsal.svg",
  hizmetler: "/images/abstract-hizmetler.svg",
  projeler: "/images/abstract-projeler.svg",
  iletisim: "/images/abstract-iletisim.svg",
};

export function InteriorHeroArtwork({ page }: { page: InteriorPage }) {
  return (
    <div className="interior-hero-art h-full w-full" data-page-art={page}>
      <img
        src={artwork[page]}
        alt=""
        className="ken-burns h-full w-full object-cover"
        style={{ objectPosition: "70% center" }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}