/**
 * İçerik bölümlerindeki görseller, sayfa hero'larıyla aynı teknik çizim
 * ailesini kullanır. Böylece eskide kalan alacakaranlık SVG'leri kartlarda
 * tekrar görünmez; SceneArt'ın mevcut prop arayüzü korunur.
 */
export type SceneKind = "site" | "structure" | "levels" | "detail" | "facade" | "skyline";

type Props = {
  kind: SceneKind;
  className?: string;
  alt?: string;
  priority?: boolean;
  orient?: "wide" | "portrait";
};

const scenes: Record<SceneKind, { src: string; alt: string }> = {
  site: {
    src: "/images/pagehero-hizmetler-site.svg",
    alt: "Kule vinç ve iskeleli betonarme yapı şantiyesi",
  },
  structure: {
    src: "/images/hero-section-cut.svg",
    alt: "Radye temelli, kat döşemeli ve merdivenli bina kesiti",
  },
  levels: {
    src: "/images/pagehero-kurumsal-plan.svg",
    alt: "Kat planı ve mimari çizim araçları",
  },
  detail: {
    src: "/images/pagehero-kurumsal-plan.svg",
    alt: "Duvarlar, kapı açılımları ve ölçülerle kat planı",
  },
  facade: {
    src: "/images/pagehero-projeler-facade.svg",
    alt: "Üç kademeli kütlenin tamamlanmış modern cephe çizimi",
  },
  skyline: {
    src: "/images/pagehero-projeler-facade.svg",
    alt: "Cam cepheli modern bina çizimi",
  },
};

export function SceneArt({ kind, className = "h-full w-full", alt, priority = false, orient = "wide" }: Props) {
  const scene = scenes[kind];
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={scene.src}
      alt={alt ?? scene.alt}
      className={className}
      style={{ objectFit: "cover", objectPosition: orient === "portrait" ? "48% 50%" : "50% 50%" }}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
