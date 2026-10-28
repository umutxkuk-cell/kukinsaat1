/**
 * SEO dağıtım denetimi — `node scripts/seo-check.mjs [temelURL]`
 *
 * Varsayılan hedef https://kukinsaat.com; yerel denetim için
 * `node scripts/seo-check.mjs http://localhost:8788` kullanılabilir.
 *
 * Denetlenenler (Google Search Console'daki "dizine eklenemedi"
 * bildirimlerinin gerçek nedenlerine karşılık gelir):
 *
 *   1. robots.txt          → 200, Sitemap satırı, /api/ engeli
 *   2. sitemap.xml         → 200, mutlak https URL'ler, sonda eğik çizgi,
 *                            mükerrer kayıt yok
 *   3. Her sitemap URL'si  → YÖNLENDİRMESİZ 200 (308/301 olmamalı),
 *                            canonical kendini göstermeli, robots=index,
 *                            title ve description boş olmamalı,
 *                            title'lar benzersiz olmalı
 *   4. noindex rotalar     → sitemap'te YER ALMAMALI (çelişki uyarısı)
 *   5. Eski İngilizce yollar → TEK atlamada 301 ile doğru rotaya
 *   6. Bilinmeyen yol      → gerçek 404 (200 ise soft 404 vardır)
 *
 * Çıkış kodu: tüm denetimler geçerse 0, aksi hâlde 1 — CI'a bağlanabilir.
 */

const BASE = (process.argv[2] ?? "https://kukinsaat.com").replace(/\/+$/, "");

const OK = "✓";
const NO = "✗";
const UYARI = "!";

let pass = 0;
let fail = 0;
let warn = 0;

function report(ok, label, detail = "") {
  if (ok) pass += 1;
  else fail += 1;
  console.log(`  ${ok ? OK : NO} ${label}${detail ? `  —  ${detail}` : ""}`);
  return ok;
}

function note(label, detail = "") {
  warn += 1;
  console.log(`  ${UYARI} ${label}${detail ? `  —  ${detail}` : ""}`);
}

function group(title) {
  console.log(`\n${title}`);
}

async function get(url, redirect = "manual") {
  const res = await fetch(url, { redirect, headers: { "User-Agent": "kuk-seo-check/1.0" } });
  const body = await res.text();
  return { res, body, status: res.status };
}

function pick(body, re) {
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

/**
 * Etiket içindeki bir özniteliğin değerini, değeri saran tırnak türüne
 * dikkat ederek çıkarır. Türkçe metinlerde kesme işareti sık geçer
 * ("Kocaeli'de…"); hem ' hem " dışlayan bir kalıp değeri orada kesip
 * sahte "description çok kısa" uyarısı üretiyordu.
 */
function attrFrom(tag, name) {
  const dq = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  if (dq) return dq[1].trim();
  const sq = tag.match(new RegExp(`${name}\\s*=\\s*'([^']*)'`, "i"));
  return sq ? sq[1].trim() : "";
}

/** Verilen ipuçlarının tümünü içeren ilk <meta>/<link> etiketini bulur
    (etiketler birden çok satıra yayılmış olabilir). */
function tagWith(body, needles) {
  const tags = body.match(/<(?:meta|link)\b[^>]*>/gi) ?? [];
  const lower = needles.map((n) => n.toLowerCase());
  return tags.find((t) => lower.every((n) => t.toLowerCase().includes(n))) ?? "";
}

const canonicalOf = (b) => attrFrom(tagWith(b, ['rel="canonical"']), "href");
const robotsOf = (b) => attrFrom(tagWith(b, ['name="robots"']), "content");
const descOf = (b) => attrFrom(tagWith(b, ['name="description"']), "content");
const titleOf = (b) => pick(b, /<title>([^<]*)<\/title>/i);

console.log(`SEO denetimi → ${BASE}`);

/* ── 1. robots.txt ─────────────────────────────────────────── */
group("1) robots.txt");
let robotsOk = false;
try {
  const { res, body } = await get(`${BASE}/robots.txt`);
  robotsOk = report(res.status === 200, `HTTP ${res.status}`, res.status === 200 ? "erişilebilir" : "robots.txt okunamadı");
  if (res.status === 200) {
    // robots.txt içindeki Sitemap satırı her zaman üretim alan adını taşır;
    // denetim yerel sunucuya karşı çalıştığında da bu doğru kalır.
    const sitemapLine = pick(body, /^\s*Sitemap:\s*(\S+)/mi);
    report(
      /^https:\/\/[^/]+\/sitemap\.xml$/.test(sitemapLine),
      "Sitemap bildirimi",
      sitemapLine || "robots.txt içinde Sitemap satırı yok",
    );
    report(body.includes("Disallow: /api/"), "Disallow: /api/", "tarama bütçesi korunuyor");
  }
} catch (e) {
  report(false, "robots.txt", String(e.message));
}

/* ── 2. sitemap.xml ────────────────────────────────────────── */
group("2) sitemap.xml");
let locs = [];
try {
  const { res, body } = await get(`${BASE}/sitemap.xml`);
  const okStatus = report(res.status === 200, `HTTP ${res.status}`, res.headers.get("content-type") ?? "");
  if (okStatus) {
    locs = [...body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    report(locs.length > 0, `${locs.length} URL bulundu`);
    // <loc> değerleri üretim alan adıyla mutlaktır; denetim yerel bir sunucuya
    // karşı çalışsa da bu değişmez. Kural: https + tek ve tutarlı alan adı.
    const origins = new Set(
      locs.map((u) => {
        try {
          return new URL(u).origin;
        } catch {
          return "geçersiz-url";
        }
      }),
    );
    report(
      origins.size === 1 && locs.every((u) => u.startsWith("https://")),
      "Tümü mutlak, https ve tek alan adında",
      [...origins].join(", ") || "URL yok",
    );
    report(
      locs.every((u) => u.endsWith("/")),
      "Tümü sonda eğik çizgili",
      "eğik çizgisiz URL yönlendirme üretir: " + (locs.find((u) => !u.endsWith("/")) ?? "yok"),
    );
    report(
      new Set(locs).size === locs.length,
      "Mükerrer kayıt yok",
      new Set(locs).size === locs.length ? "" : "yinelenen URL var",
    );
  }
} catch (e) {
  report(false, "sitemap.xml", String(e.message));
}

/* ── 3. Her sitemap URL'si ─────────────────────────────────── */
group("3) Sitemap URL'leri — yönlendirmesiz 200 + öz-referans canonical");
const titles = new Map();
// Sitemap'teki <loc> değerleri her zaman üretim alan adıyla mutlaktır
// (https://kukinsaat.com/…). Denetim yerel bir sunucuya karşı çalıştırıldığında
// yol korunur, kök BASE ile değiştirilir; canonical ise yine üretim URL'siyle
// karşılaştırılır — çünkü canonical her ortamda mutlak ve aynı olmalıdır.
const ORIGIN = new URL(BASE).origin;
for (const loc of locs) {
  try {
    const path = loc.replace(/^https?:\/\/[^/]+/, "") || "/";
    const target = `${ORIGIN}${path}`;
    const { res, body } = await get(target);
    if (!report(res.status === 200, `${path} → HTTP ${res.status}`, res.status === 200 ? "" : "yönlendirme ya da hata: sitemap'te yönlendiren URL olmamalı")) continue;

    const can = canonicalOf(body);
    report(can === loc, `${path} canonical`, can ? (can === loc ? "kendini gösteriyor" : `BEKLENEN ${loc}, BULUNAN ${can}`) : "canonical YOK");

    const rob = robotsOf(body);
    report(
      rob.startsWith("index"),
      `${path} robots`,
      rob || "robots meta yok",
    );

    const t = titleOf(body);
    report(t.length > 10 && t.length < 70, `${path} title (${t.length} kr)`, t.slice(0, 52));
    if (t) {
      if (titles.has(t)) report(false, `${path} title benzersiz`, `"${t.slice(0, 40)}" ${titles.get(t)} ile aynı`);
      else titles.set(t, path);
    }

    const d = descOf(body);
    report(d.length >= 50, `${path} description (${d.length} kr)`, d.length >= 50 ? "" : "çok kısa veya yok");
  } catch (e) {
    report(false, loc, String(e.message));
  }
}

/* ── 4. noindex rotalar sitemap'te olmamalı ────────────────── */
group("4) noindex rotalar sitemap dışında mı");
for (const path of ["/gizlilik/", "/projeler/"]) {
  try {
    const { res, body } = await get(`${BASE}${path}`);
    if (res.status !== 200) {
      note(`${path} HTTP ${res.status}`, "rota prerender edilmemiş olabilir");
      continue;
    }
    const rob = robotsOf(body);
    const listed = locs.includes(`${BASE}${path}`);
    if (rob.startsWith("noindex")) {
      report(!listed, `${path} noindex + sitemap dışında`, listed ? "ÇELİŞKİ: noindex URL sitemap'te listelenmiş" : "doğru");
    } else {
      report(listed, `${path} index + sitemap'te`, listed ? "doğru" : "indexlenebilir sayfa sitemap'te yok");
    }
  } catch (e) {
    note(`${path} denetlenemedi`, String(e.message));
  }
}

/* ── 5. Eski İngilizce yollar ──────────────────────────────── */
group("5) Eski URL'ler → tek atlamalı 301");
const aliases = [
  ["/projects", "/projeler/"],
  ["/portfolio", "/projeler/"],
  ["/services", "/hizmetler/"],
  ["/about", "/kurumsal/"],
  ["/contact", "/iletisim/"],
  ["/privacy", "/gizlilik/"],
  ["/home", "/"],
];
for (const [from, to] of aliases) {
  try {
    const first = await get(`${BASE}${from}`);
    const target = first.res.headers.get("location") ?? "";
    const isRedirect = [301, 302, 307, 308].includes(first.status);
    if (!isRedirect) {
      report(false, `${from}`, `HTTP ${first.status} — 301 bekleniyordu (eski URL 404 ekranına düşüyor olabilir)`);
      continue;
    }
    const resolved = new URL(target, `${BASE}${from}`).pathname;
    const hop = await get(`${BASE}${resolved}`);
    report(
      first.status === 301 && resolved === to && hop.status === 200,
      `${from} → ${resolved}`,
      `${first.status}, hedef ${hop.status}${resolved === to ? "" : ` (beklenen ${to})`}`,
    );
  } catch (e) {
    report(false, from, String(e.message));
  }
}

/* ── 6. Soft 404 denetimi ──────────────────────────────────── */
group("6) Bilinmeyen yol — gerçek 404 (soft 404 denetimi)");
const bogus = `/seo-denetim-${Date.now()}`;
try {
  const { res } = await get(`${BASE}${bogus}`);
  report(
    res.status === 404,
    `${bogus} → HTTP ${res.status}`,
    res.status === 404 ? "doğru" : "SOFT 404: olmayan sayfa 200 dönüyor, Google tüm siteyi güvenilmez sayar",
  );
} catch (e) {
  report(false, bogus, String(e.message));
}

/* ── Özet ──────────────────────────────────────────────────── */
console.log(`\n${"─".repeat(64)}`);
console.log(`  GEÇEN: ${pass}   KALAN: ${fail}   UYARI: ${warn}`);
if (fail === 0) console.log("  ✔ Search Console'a gönderilmeye hazır.");
else console.log("  ✗ Kalan maddeler düzeltilmeden sitemap göndermeyin.");
console.log(`${"─".repeat(64)}\n`);

process.exit(fail === 0 ? 0 : 1);
