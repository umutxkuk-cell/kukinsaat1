import { getService, services } from "@/data/services";
import { getProject, projects } from "@/data/projects";

/**
 * Rota metadata'sının TEK KAYNAĞI.
 *
 * Üç tüketici aynı veriyi kullanır:
 *  1. App.tsx (istemci) — SPA geçişlerinde title/description/robots/canonical/OG
 *     ve rota bazlı JSON-LD'yi canlı DOM'a yazar (T-01 düzeltmesi).
 *  2. scripts/prerender.mjs — derleme sonrasında her rota için statik HTML
 *     üretir; tarayıcılar ve sosyal botlar bu etiketleri JS çalıştırmadan görür
 *     (T-03/T-06 düzeltmesi, Google JS-SEO canonical rehberi, Ara 2025).
 *  3. Sitemap ve OG görsel üretimi.
 */

export const SITE_URL = "https://kukinsaat.com";

export const INDEX_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex, follow";

const DEFAULT_OG_IMAGE =
  "https://images.pexels.com/photos/3939978/pexels-photo-3939978.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630";

export type Crumb = { name: string; path: string };

export type RouteMeta = {
  /** Rota sitede bilinen bir sayfa mı (false → 404 ekranı + noindex)? */
  known: boolean;
  title: string;
  description: string;
  indexable: boolean;
  ogImage: string;
  breadcrumb: Crumb[] | null;
  jsonLd: object[];
};

/* ---------------- statik rota metinleri (özgün kopya korunur) ---------------- */

const titles: Record<string, string> = {
  "/": "Kuk İnşaat | Kocaeli İnşaat ve Mühendislik Firması",
  "/kurumsal": "Kuk İnşaat Hakkında | Kocaeli",
  "/hizmetler": "İnşaat, Mühendislik ve Proje Hizmetleri | Kuk İnşaat",
  "/projeler": "Proje Portföyü | Kuk İnşaat",
  "/iletisim": "İletişim | Kuk İnşaat, Başiskele",
  "/gizlilik": "Gizlilik Politikası & KVKK Aydınlatma Metni | Kuk İnşaat",
};

const descriptions: Record<string, string> = {
  "/":
    "Kocaeli inşaat ve mühendislik firması Kuk İnşaat: konut, ticari ve karma yapıların projelendirme, mühendislik ve inşaat süreçlerini tek elden yürütür.",
  "/kurumsal":
    "Kuk İnşaat'ın mühendislik yaklaşımı, değerleri ve kalite anlayışı. Kocaeli merkezli inşaat ve mühendislik firması — Kaliteyle Kurulur.",
  "/hizmetler":
    "Kocaeli'de inşaat ve yapı uygulamaları, mühendislik, proje geliştirme, süreç yönetimi ve teknik danışmanlık hizmetlerimiz.",
  "/projeler":
    "Kuk İnşaat'ın çalışma alanları ve proje portföyü. Şu anda yayımlanmış proje kaydı bulunmuyor; gerçek kayıtlar hazır olduğunda bu sayfa güncellenecektir.",
  "/iletisim":
    "Ovacık Mah. Çuhane Cad. No:176 Başiskele, Kocaeli. Projeniz için teklif alın: umut@kukinsaat.com",
  "/gizlilik":
    "Kuk İnşaat'ın kişisel verilerin işlenmesi, korunması, saklama süreleri ve KVKK kapsamındaki başvuru haklarına ilişkin aydınlatma metni.",
};

/**
 * Hizmet detay SEO metinleri.
 * İ-02: Yerel arama niyeti ("kocaeli inşaat ...") için başlıklara konum
 * niteleyicisi eklendi; açıklamalarda Kocaeli bağlamı tamamlandı.
 */
const serviceSeo: Record<string, { title: string; description: string }> = {
  "insaat-ve-yapi-uygulamalari": {
    title: "İnşaat ve Yapı Uygulamaları — Kocaeli | Kuk İnşaat",
    description:
      "Kocaeli'de konut, ticari ve karma yapılar için saha organizasyonu, imalat koordinasyonu, malzeme kontrolü ve yapı uygulama hizmetleri.",
  },
  "muhendislik-hizmetleri": {
    title: "Mühendislik Hizmetleri — Kocaeli | Kuk İnşaat",
    description:
      "Taşıyıcı sistem, yapı performansı ve uygulama detaylarına yönelik mühendislik değerlendirmesi. Kocaeli ve çevresinde proje görüşmesi için ulaşın.",
  },
  "proje-gelistirme-ve-teknik-koordinasyon": {
    title: "Proje Geliştirme ve Teknik Koordinasyon — Kocaeli | Kuk İnşaat",
    description:
      "Kocaeli'de mimari, statik, elektrik ve mekanik projelerin uygulama öncesi koordinasyonu, teknik gözden geçirme ve detay çözümü.",
  },
  "proje-ve-uygulama-sureclerinin-yonetimi": {
    title: "İnşaat Proje ve Uygulama Yönetimi — Kocaeli | Kuk İnşaat",
    description:
      "Kocaeli ve çevresindeki inşaat projelerinde iş programı, bütçe, risk ve kalite kontrol adımlarının planlanması, takibi ve raporlanması.",
  },
  "teknik-danismanlik": {
    title: "İnşaat Teknik Danışmanlığı — Kocaeli | Kuk İnşaat",
    description:
      "Kocaeli'de mevcut yapı projeleri ve uygulama kararları için teknik inceleme, risk değerlendirmesi ve alternatif çözüm danışmanlığı.",
  },
};

const NAV_LABEL: Record<string, string> = {
  "/kurumsal": "Kurumsal",
  "/hizmetler": "Hizmetlerimiz",
  "/projeler": "Projelerimiz",
  "/iletisim": "İletişim",
  "/gizlilik": "Gizlilik Politikası",
};

/* ---------------- yapılandırılmış veri üreticileri ---------------- */

function breadcrumbLd(crumbs: Crumb[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/** Pexels URL'sini 1200x630 OG kırpımına dönüştürür. */
function ogCrop(url: string): string {
  if (/[?&]fit=crop&h=\d+&w=\d+/.test(url)) {
    return url.replace(/([?&])fit=crop&h=\d+&w=\d+/, "$1fit=crop&w=1200&h=630");
  }
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630`;
}

/* ---------------- çözümleyici ---------------- */

export function metaFor(path: string): RouteMeta {
  const home = NAV_LABEL["/"] ?? "Ana Sayfa";

  // Statik rotalar
  if (titles[path]) {
    const known = true;
    const indexable =
      path !== "/gizlilik" && !(path === "/projeler" && projects.length === 0);
    const breadcrumb: Crumb[] | null =
      path === "/" ? null : [{ name: home, path: "/" }, { name: NAV_LABEL[path], path }];
    return {
      known,
      title: titles[path],
      description: descriptions[path],
      indexable,
      ogImage: DEFAULT_OG_IMAGE,
      breadcrumb,
      jsonLd: breadcrumb ? [breadcrumbLd(breadcrumb)] : [],
    };
  }

  // Hizmet detayı
  const hs = path.match(/^\/hizmetler\/([^/]+)$/);
  if (hs) {
    const slug = decodeURIComponent(hs[1]);
    const service = getService(slug);
    if (service) {
      const seo = serviceSeo[slug];
      const breadcrumb: Crumb[] = [
        { name: home, path: "/" },
        { name: "Hizmetlerimiz", path: "/hizmetler" },
        { name: service.title, path },
      ];
      // NOT: HizmetDetay bileşeni Service + BreadcrumbList JSON-LD'yi kendi
      // içinde (DOM içinde, SSR'da da çıktılanır) render eder. Burada ayrıca
      // head'e basmak mükerrer işaretleme yaratır — Google bunu önermez.
      return {
        known: true,
        title: seo?.title ?? `${service.title} | Kuk İnşaat`,
        description: seo?.description ?? service.summary,
        indexable: true,
        ogImage: ogCrop(service.image),
        breadcrumb,
        jsonLd: [],
      };
    }
  }

  // Proje detayı
  const ps = path.match(/^\/projeler\/([^/]+)$/);
  if (ps) {
    const project = getProject(decodeURIComponent(ps[1]));
    if (project) {
      const breadcrumb: Crumb[] = [
        { name: home, path: "/" },
        { name: "Projelerimiz", path: "/projeler" },
        { name: project.name, path },
      ];
      return {
        known: true,
        title: `${project.name} | Kuk İnşaat`,
        description: project.description,
        indexable: true,
        ogImage: project.images[0] ? ogCrop(project.images[0].src) : DEFAULT_OG_IMAGE,
        breadcrumb,
        jsonLd: [breadcrumbLd(breadcrumb)],
      };
    }
  }

  // 404
  return {
    known: false,
    title: "Sayfa Bulunamadı | Kuk İnşaat",
    description: "Aradığınız sayfa bulunamadı.",
    indexable: false,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumb: null,
    jsonLd: [],
  };
}

/** Ön üretim (prerender) yapılacak tüm rotalar. */
export function allPrerenderPaths(): string[] {
  return [
    "/",
    "/kurumsal",
    "/hizmetler",
    "/projeler",
    "/iletisim",
    "/gizlilik",
    ...services.map((s) => `/hizmetler/${s.slug}`),
    ...projects.map((p) => `/projeler/${p.slug}`),
  ];
}
