/**
 * Cloudflare Workers giriş noktası (Static Assets + API).
 *
 * `wrangler deploy` bu dosyayı ve `dist/` çıktısını tek bir Worker olarak
 * yayınlar. Sayfalar statik varlıklardan sunulur; `/api/*` istekleri buradaki
 * fonksiyonlara yönlenir. Böylece proje hem Workers Builds (`wrangler deploy`)
 * hem de Pages Functions mimarisiyle uyumlu kalır.
 */

import {
  onRequestOptions as contactOptions,
  onRequestPost as contactPost,
} from "../functions/api/contact";
import { onRequestGet as healthGet } from "../functions/api/health";
// Derlenmiş uygulama kabuğu. Wrangler, .html dosyalarını Text modülü olarak
// paketler; statik sunucuya ek bir istek atılmadan SPA rotaları açılır.
import appShell from "../dist/index.html";

type Fetcher = {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
};

type Env = Record<string, string | undefined> & { ASSETS: Fetcher };

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
} as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

/* SEO: eski İngilizce adresler tek atlamada Türkçe karşılığına taşınır. */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/home": "/",
  "/index.html": "/",
  "/about": "/kurumsal/",
  "/about-us": "/kurumsal/",
  "/corporate": "/kurumsal/",
  "/hakkimizda": "/kurumsal/",
  "/services": "/hizmetler/",
  "/service": "/hizmetler/",
  "/projects": "/projeler/",
  "/project": "/projeler/",
  "/portfolio": "/projeler/",
  "/contact": "/iletisim/",
  "/contact-us": "/iletisim/",
  "/iletisim-bilgileri": "/iletisim/",
  "/privacy": "/gizlilik/",
  "/privacy-policy": "/gizlilik/",
  "/kvkk": "/gizlilik/",
  "/hizmet": "/hizmetler/",
  "/proje": "/projeler/",
};

/* /services/<slug> ve /projects/<slug> gibi eski alt yollar. */
const LEGACY_PREFIXES: [string, string][] = [
  ["/services/", "/hizmetler/"],
  ["/service/", "/hizmetler/"],
  ["/projects/", "/projeler/"],
  ["/project/", "/projeler/"],
  ["/portfolio/", "/projeler/"],
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (method === "OPTIONS" && path.startsWith("/api/")) {
      if (path === "/api/contact") return contactOptions();
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (path === "/api/contact") {
      if (method !== "POST") {
        return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
          status: 405,
          headers: { ...jsonHeaders, Allow: "POST, OPTIONS" },
        });
      }
      return contactPost({ request, env });
    }

    if (path === "/api/health") {
      return healthGet({ env });
    }

    if (path.startsWith("/api/")) {
      return json({ ok: false, error: "not_found" }, 404);
    }

    const redirect = LEGACY_REDIRECTS[url.pathname];
    if (redirect) {
      return Response.redirect(new URL(redirect, url).toString(), 301);
    }

    const legacyPrefix = LEGACY_PREFIXES.find(([from]) => url.pathname.startsWith(from));
    if (legacyPrefix) {
      return Response.redirect(new URL(legacyPrefix[1], url).toString(), 301);
    }

    // Statik varlıklar (mevcut dosyalar) Worker'a ulaşmadan platform
    // tarafından sunulur. Buraya yalnızca eşleşmeyen istekler gelir.
    // Uygulama tek sayfa olduğu için HTML gezinmelerini index.html'e,
    // uzantılı eksik dosyaları ise gerçek 404'e yönlendiriyoruz.
    const looksLikeFile = /\.[a-z0-9]{1,8}$/i.test(url.pathname);
    const acceptsHtml = (request.headers.get("Accept") ?? "").includes("text/html");

    if ((method === "GET" || method === "HEAD") && !looksLikeFile) {
      return new Response(appShell, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    if (acceptsHtml) {
      return new Response("Sayfa bulunamadı.", {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
