import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Intro } from "@/components/layout/Intro";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getService } from "@/data/services";
import { getProject } from "@/data/projects";
import {
  canonicalUrl,
  INDEX_ROBOTS,
  metaFor,
  NOINDEX_ROBOTS,
} from "@/lib/metadata";
import {
  getCurrentPath,
  NotFoundError,
  setPathname,
  subscribePathname,
} from "@/lib/next-shim";
import Gizlilik from "@/pages/Gizlilik";
import HizmetDetay from "@/pages/HizmetDetay";
import Hizmetler from "@/pages/Hizmetler";
import Home from "@/pages/Home";
import Iletisim from "@/pages/Iletisim";
import Kurumsal from "@/pages/Kurumsal";
import ProjeDetay from "@/pages/ProjeDetay";
import Projeler from "@/pages/Projeler";

function renderRoute(path: string) {
  switch (path) {
    case "/":
      return <Home />;
    case "/kurumsal":
      return <Kurumsal />;
    case "/hizmetler":
      return <Hizmetler />;
    case "/projeler":
      return <Projeler />;
    case "/iletisim":
      return <Iletisim />;
    case "/gizlilik":
      return <Gizlilik />;
    default: {
      const hs = path.match(/^\/hizmetler\/([^/]+)$/);
      if (hs) {
        const slug = decodeURIComponent(hs[1]);
        return getService(slug) ? <HizmetDetay params={{ slug }} /> : <NotFound />;
      }
      const ps = path.match(/^\/projeler\/([^/]+)$/);
      if (ps) {
        const slug = decodeURIComponent(ps[1]);
        return getProject(slug) ? <ProjeDetay params={{ slug }} /> : <NotFound />;
      }
      return <NotFound />;
    }
  }
}

function NotFound() {
  return (
    <Container className="py-32 md:py-44">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-10 bg-accent-warm" /> 404
      </p>
      <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] leading-[1.03]">
        Aradığınız sayfa bulunamadı.
      </h1>
      <p className="mt-5 max-w-lg leading-relaxed text-muted">
        Bağlantı değişmiş ya da içerik taşınmış olabilir. Ana sayfadan devam edebilir veya
        hizmetlerimize göz atabilirsiniz.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Button href="/">Ana Sayfa</Button>
        <Button href="/hizmetler" variant="secondary">
          Hizmetlerimiz
        </Button>
      </div>
    </Container>
  );
}

/** Rota bazlı JSON-LD'yi tek bir script etiketinde tutar (S-02). */
function applyRouteJsonLd(jsonLd: object[]) {
  const id = "kuk-route-jsonld";
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (jsonLd.length === 0) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
}

function Routes() {
  const [path, setPath] = useState(() => getCurrentPath());

  useEffect(() => {
    const apply = (initial: boolean) => {
      const next = getCurrentPath();
      // Boş portföy sayfası, gerçek proje kayıtları yayımlanana dek arama
      // motorlarına gönderilmez (T-02); ziyaretçilere açık kalır.
      const meta = metaFor(next);
      setPath(next);
      setPathname(next);
      document.title = meta.title;

      const robots = document.querySelector('meta[name="robots"]');
      if (robots) {
        robots.setAttribute(
          "content",
          meta.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
        );
      }

      const setMeta = (selector: string, value: string) => {
        const element = document.querySelector(selector);
        if (element) element.setAttribute("content", value);
      };

      // Ham HTML'deki canonical ile birebir aynı biçim (eğik çizgili):
      // SPA geçişlerinde de canonical, 200 dönen URL'yi göstermeli.
      const url = canonicalUrl(next);
      setMeta('meta[name="description"]', meta.description);
      setMeta('meta[property="og:title"]', meta.title);
      setMeta('meta[property="og:description"]', meta.description);
      setMeta('meta[property="og:url"]', url);
      setMeta('meta[property="og:image"]', meta.ogImage);
      setMeta('meta[property="og:image:secure_url"]', meta.ogImage);
      setMeta('meta[name="twitter:title"]', meta.title);
      setMeta('meta[name="twitter:description"]', meta.description);
      setMeta('meta[name="twitter:image"]', meta.ogImage);

      // Canonical, prerender edilmiş HTML'de zaten bulunur; SPA geçişlerinde
      // burada güncellenir (Aralık 2025 Google JS-SEO rehberiyle uyumlu:
      // ham HTML ve rendered DOM'da aynı canonical).
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (meta.known) {
        if (!canonical) {
          canonical = document.createElement("link");
          canonical.rel = "canonical";
          document.head.appendChild(canonical);
        }
        canonical.href = url;
      } else {
        canonical?.remove();
      }

      applyRouteJsonLd(meta.jsonLd);

      if (!initial) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }
    };
    const onPopState = () => apply(true);
    // İstemci tarafı geçişler (Link → navigate): rota, başlık ve meta uygulanır.
    const onNavigate = () => apply(false);
    apply(true);
    window.addEventListener("popstate", onPopState);
    const unsubscribe = subscribePathname(onNavigate);
    return () => {
      window.removeEventListener("popstate", onPopState);
      unsubscribe();
    };
  }, []);

  try {
    return <>{renderRoute(path)}</>;
  } catch (err) {
    if (err instanceof NotFoundError) return <NotFound />;
    throw err;
  }
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        İçeriğe atla
      </a>
      <div className="grain-overlay" aria-hidden="true" />
      <Intro />
      <Header />
      <main id="main" className="pt-20">
        <Routes />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
