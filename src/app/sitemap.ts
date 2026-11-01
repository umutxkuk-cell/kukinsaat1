import type { MetadataRoute } from "next";
import { allPrerenderPaths, canonicalUrl, metaFor } from "@/lib/metadata";

/**
 * Yalnızca dizine eklenebilir (index) rotalar listelenir.
 * `/gizlilik` ve portföyü boşken `/projeler` noindex taşıdığı için yer almaz;
 * noindex bir URL'yi sitemap'e koymak Search Console'da uyarı üretir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return allPrerenderPaths()
    .filter((path) => metaFor(path).known && metaFor(path).indexable)
    .map((path) => ({
      url: canonicalUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? "monthly" : "yearly",
      priority: path === "/" ? 1 : path === "/iletisim" ? 0.8 : 0.6,
    }));
}
