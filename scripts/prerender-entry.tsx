/**
 * Ön üretim (prerender) giriş noktası — yalnızca scripts/prerender.mjs
 * tarafından esbuild ile Node için paketlenir; tarayıcı paketine girmez.
 *
 * App bileşenini istenen rota için sunucu tarafında render eder ve rota
 * metadata'sını (src/lib/metadata.ts) dışa aktarır.
 */
import { renderToString } from "react-dom/server";
import App from "@/App";
import { allPrerenderPaths, metaFor, type RouteMeta } from "@/lib/metadata";

export function render(path: string): string {
  (globalThis as { __KUK_PRERENDER_PATH__?: string }).__KUK_PRERENDER_PATH__ = path;
  return renderToString(<App />);
}

export function getMeta(path: string): RouteMeta {
  return metaFor(path);
}

export const paths: string[] = allPrerenderPaths();
