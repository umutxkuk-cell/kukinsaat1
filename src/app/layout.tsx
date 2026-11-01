import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { site } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.siteUrl,
    siteName: site.name,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/images/hero-building-sketch-og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/hero-building-sketch-og.jpg"],
  },
  verification: { google: site.searchConsoleToken },
};

/**
 * Kuruluş yapılandırılmış verisi.
 * Yalnızca doğrulanabilir kurumsal bilgiler (ünvan, adres, telefon, e-posta,
 * vergi bilgileri) işaretlenir; puan, yorum veya proje iddiası eklenmez.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${site.siteUrl}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: `${site.siteUrl}/`,
  logo: `${site.siteUrl}/brand/kuk-monogram.svg`,
  image: `${site.siteUrl}/images/hero-building-sketch-og.jpg`,
  description: site.description,
  telephone: site.contact.phone,
  email: site.contact.email,
  taxID: site.taxNo,
  vatID: site.taxNo,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ovacık Mah. Çuhane Cad. No:176",
    addressLocality: "Başiskele",
    addressRegion: "Kocaeli",
    addressCountry: "TR",
  },
  areaServed: { "@type": "AdministrativeArea", name: "Kocaeli" },
  sameAs: site.social.map((s) => s.href),
  openingHours: "Mo-Sa 09:00-18:00",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-bg text-ink font-sans antialiased selection:bg-ink selection:text-white">
        <a href="#main" className="skip-link">
          İçeriğe atla
        </a>
        <Header />
        <main id="main" className="pt-20">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
