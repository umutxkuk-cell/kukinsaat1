import { HeroScene } from "@/components/ui/HeroScenes";

/**
 * Beş sayfanın animasyonlu hero sahneleri. Yazı içermeyen, satır içi SVG
 * çizimler; mineral palet + mühendislik mavisi + terracotta vurgu.
 * Sahneler HeroScenes.tsx içinde, animasyonlar hero-art.css içindedir.
 */
export type IllustrationPage = "home" | "kurumsal" | "hizmetler" | "projeler" | "iletisim";

const alts: Record<IllustrationPage, string> = {
  home: "Kademeli cepheleri, terasları ve sıcak ışıklarıyla temsili çağdaş bir yapı",
  kurumsal: "KUK logosunu taşıyan kurumsal yapı cephesinin temsili illüstrasyonu",
  hizmetler: "Aynı binanın üç hâli: solda kesikli çizgiyle fikir, ortada vinçle inşaat, sağda ışıkları yanmış teslim",
  projeler: "Işıkları yanan bitmiş yapıların silueti ve aralarında kazıkları çakılmış boş bir parsel",
  iletisim: "Alt kenardan gelip kapısında sıcak ışık yanan binaya varan yol, üzerinde konum iğnesi",
};

export function Illustration({
  page,
  className = "h-full w-full",
  fit = "slice",
  decorative = false,
}: {
  page: IllustrationPage;
  className?: string;
  /** "slice" → hero'yu tamamen kaplar (masaüstü); "meet" → tümü görünür (mobil bant). */
  fit?: "slice" | "meet";
  /** Eski API uyumluluğu için korunur; sahneler kendi hizalamasını yapar. */
  position?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return <HeroScene page={page} className={className} fit={fit} decorative={decorative} alt={alts[page]} />;
}
