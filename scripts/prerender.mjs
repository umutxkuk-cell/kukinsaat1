/**
 * Cloudflare Pages SEO ön üretimi (T-03 / T-06 düzeltmesi)
 * ---------------------------------------------------------
 * `npm run build` sonrasındaki dist/index.html şablonunu kullanarak her rota
 * için ayrı bir statik HTML üretir:
 *
 *   dist/index.html               (ana sayfa — üzerine yazılır)
 *   dist/kurumsal/index.html
 *   dist/hizmetler/index.html
 *   dist/hizmetler/<slug>/index.html
 *   dist/projeler/index.html
 *   dist/iletisim/index.html
 *   dist/gizlilik/index.html
 *
 * Her dosyada rota bazlı <title>, meta description, robots, canonical,
 * Open Graph/Twitter etiketleri ve JSON-LD (BreadcrumbList + Service) HAM
 * HTML'de bulunur — Google'ın Aralık 2025 JS-SEO canonical rehberine uygun
 * biçimde ham HTML ile rendered DOM aynı canonical'i taşır. Sosyal botlar
 * (WhatsApp, LinkedIn, Telegram — JS çalıştırmazlar) doğru kartı görür.
 *
 * Kullanım:  npm run build && node scripts/prerender.mjs
 *
 * Not: Cloudflare Pages /kurumsal isteğinde önce dist/kurumsal/index.html
 * statik dosyasını bulur ve sunar; _routes.json yalnızca /api/* yolunu
 * Functions'a gönderdiği için çakışma yoktur. Bilinmeyen yollar _redirects
 * ile SPA'ya düşer.
 */
import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://kukinsaat.com";

/* Hero görseli Vite buildinde base64 olarak JS içine gömülür. SSR paketinde
   aynı ikili dosya farklı bayt üretmesin diye import bir sentinel ile
   değiştirilir; üretilen HTML'de sentinel gerçek data URI ile eşlenir. */
const stubHeroAsset = {
  name: "stub-hero-asset",
  setup(b) {
    b.onResolve({ filter: /hero\.webp$/ }, (args) => ({
      path: args.path,
      namespace: "hero-stub",
    }));
    b.onLoad({ filter: /.*/, namespace: "hero-stub" }, () => ({
      contents: 'export default "__KUK_HERO_SRC__";',
      loader: "js",
    }));
  },
};

console.log("→ SSR paketi derleniyor…");
await build({
  entryPoints: [path.join(root, "scripts/prerender-entry.tsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  jsx: "automatic",
  outfile: path.join(root, "node_modules/.kuk-ssr-bundle.mjs"),
  alias: { "@": path.join(root, "src") },
  // React çalışma zamanında node_modules'tan çözülür; CJS→ESM sarmalama
  // sorunları (dynamic require) böylece hiç oluşmaz.
  external: ["react", "react-dom", "react-dom/server", "react/jsx-runtime"],
  plugins: [stubHeroAsset],
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});

const mod = await import(
  pathToFileURL(path.join(root, "node_modules/.kuk-ssr-bundle.mjs")).href +
    `?t=${Date.now()}`
);

const template = await readFile(path.join(root, "dist/index.html"), "utf8");
const heroDataUri =
  template.match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/)?.[0] ?? "";
if (!heroDataUri) {
  console.warn("⚠ hero.webp data URI bulunamadı; ana sayfa görseli uzak URL kalır.");
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function setMeta(out, attr, value) {
  // attr: 'name="description"' | 'property="og:title"' | 'name="twitter:image"'
  const re = new RegExp(
    `(<meta\\s+${attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/"/g, '"')}\\s+content=")[^"]*(")`,
    "s",
  );
  if (!re.test(out)) return out;
  return out.replace(re, `$1${esc(value)}$2`);
}

let written = 0;
for (const routePath of mod.paths) {
  const meta = mod.getMeta(routePath);
  let rootHtml = mod.render(routePath);
  if (heroDataUri) rootHtml = rootHtml.replaceAll("__KUK_HERO_SRC__", heroDataUri);

  const url = `${SITE_URL}${routePath}`;
  const robotsContent = meta.indexable
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, follow";

  let out = template;
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  out = setMeta(out, 'name="robots"', robotsContent);
  out = setMeta(out, 'name="description"', meta.description);
  out = setMeta(out, 'property="og:title"', meta.title);
  out = setMeta(out, 'property="og:description"', meta.description);
  out = setMeta(out, 'property="og:url"', url);
  out = setMeta(out, 'property="og:image"', meta.ogImage);
  out = setMeta(out, 'property="og:image:secure_url"', meta.ogImage);
  out = setMeta(out, 'name="twitter:title"', meta.title);
  out = setMeta(out, 'name="twitter:description"', meta.description);
  out = setMeta(out, 'name="twitter:image"', meta.ogImage);

  // Canonical + rota JSON-LD (ham HTML'e, </head> öncesine)
  let headExtra = "";
  if (meta.known) {
    headExtra += `\n    <link rel="canonical" href="${esc(url)}" />`;
  }
  if (meta.jsonLd.length > 0) {
    headExtra += `\n    <script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`;
  }
  out = out.replace("</head>", `${headExtra}\n  </head>`);

  // Önceden render edilmiş DOM — tarayıcı JS'i devralana kadar içerik görünür.
  out = out.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);

  const outFile =
    routePath === "/"
      ? path.join(root, "dist/index.html")
      : path.join(root, "dist", routePath.slice(1), "index.html");
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, out, "utf8");
  written += 1;
  console.log(
    `  ✓ ${routePath}  [${meta.indexable ? "index" : "noindex"}]  ${(out.length / 1024).toFixed(0)} KB`,
  );
}

// Bilinmeyen yollar için özel 404 sayfası — Cloudflare Pages, çıktı kökünde
// 404.html varsa eşleşmeyen istekleri HTTP 404 durum koduyla buna sunar.
// Kabuk ana sayfa HTML'idir; istemci router'ı gerçek pathname'e göre Türkçe
// 404 ekranını çizer. Netlify tarzı `/* /index.html 200` yakalama kuralı
// Cloudflare'da sonsuz döngü sayılıp yok sayıldığı için bu yöntem kullanılır.
const shell404 = await readFile(path.join(root, "dist/index.html"), "utf8");
await writeFile(path.join(root, "dist/404.html"), shell404, "utf8");
written += 1;
console.log("  ✓ 404.html (bilinmeyen yollar için SPA kabuğu)");

console.log(`✔ ${written} dosya ön üretimi tamamlandı.`);
