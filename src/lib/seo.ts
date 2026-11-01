import type { Metadata } from "next";
import { canonicalUrl, INDEX_ROBOTS, metaFor, NOINDEX_ROBOTS } from "@/lib/metadata";

/**
 * Rota metadata'sının Next.js Metadata nesnesine dönüşümü.
 * Tek kaynak: src/lib/metadata.ts (başlık, açıklama, canonical, OG, robots).
 */
export function metadataFor(path: string): Metadata {
  const meta = metaFor(path);
  const url = canonicalUrl(path);

  return {
    title: meta.title,
    description: meta.description,
    ...(meta.known ? { alternates: { canonical: url } } : {}),
    robots: meta.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: "Kuk İnşaat",
      title: meta.title,
      description: meta.description,
      url,
      images: [{ url: meta.ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
  };
}

/** Rota bazlı JSON-LD (breadcrumb vb.) — tek script etiketi olarak basılır. */
export function jsonLdFor(path: string): object[] {
  return metaFor(path).jsonLd;
}
