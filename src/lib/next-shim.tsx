import {
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

/**
 * Next.js yüzeyinin (next/image, next/link, next/navigation) bu statik
 * React + Vite kurulumundaki birebir karşılıkları. Bileşen kodları orijinal
 * depodakiyle aynı kalır; yalnızca içe aktarma yolu değişir.
 */

/* ---------------- yönlendirme (gerçek pathname) ---------------- */
export function normalizePath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0];
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

function readPathFromLocation() {
  if (typeof window === "undefined") return "/";

  // Migrate old shared hash-router URLs to crawlable path URLs once.
  const legacy = window.location.hash.match(/^#(\/[^?]*)/);
  if (legacy) {
    const path = normalizePath(legacy[1]);
    window.history.replaceState(window.history.state, "", path + window.location.search);
    return path;
  }

  return normalizePath(window.location.pathname);
}

let currentPath = readPathFromLocation();
const listeners = new Set<(p: string) => void>();

export function getPathname() {
  return currentPath;
}

export function getCurrentPath() {
  // Ön üretim (scripts/prerender.mjs) sırasında rota bu değişkenle sabitlenir;
  // tarayıcıda undefined olduğu için normal konum okuması yapılır.
  const override = (globalThis as { __KUK_PRERENDER_PATH__?: string })
    .__KUK_PRERENDER_PATH__;
  if (override) return normalizePath(override);
  return readPathFromLocation();
}

export function setPathname(next: string) {
  if (next === currentPath) return;
  currentPath = next;
  listeners.forEach((l) => l(next));
}

export function usePathname() {
  // İlk değer getCurrentPath() ile alınır: prerender sırasında rota override'ı
  // uygulanır, tarayıcıda davranış değişmez.
  const [p, setP] = useState(getCurrentPath);
  useEffect(() => {
    listeners.add(setP);
    return () => {
      listeners.delete(setP);
    };
  }, []);
  return p;
}

export function subscribePathname(fn: (path: string) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Tıklamayla istemci tarafı sayfa geçişi (pushState).
    Sayfa yenilenmez; rota durumu, başlık ve meta verileri Routes tarafından
    uygulanır. Yalnızca aynı origin'deki http(s) yolları yakalanır —
    dış bağlantılar, mailto/tel ve dosya indirmeleri tarayıcıya bırakılır. */
export function navigate(href: string): boolean {
  if (typeof window === "undefined") return false;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const next = normalizePath(url.pathname);
  const current = normalizePath(window.location.pathname);

  if (next === current) {
    // Aynı rota: geçmiş girdisi eklemeden yalnızca üste dön.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    return true;
  }

  window.history.pushState({}, "", url.pathname + url.search);
  setPathname(next); // dinleyiciler geçişi uygular (rota, başlık, meta, kaydırma)
  return true;
}

/* ---------------- 404 ---------------- */
export class NotFoundError extends Error {
  constructor() {
    super("404");
    this.name = "NotFoundError";
  }
}

export function notFound(): never {
  throw new NotFoundError();
}

/* ---------------- next/image ---------------- */
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
};

export function Image({
  src,
  alt,
  fill,
  priority,
  quality: _quality,
  className,
  style,
  ...rest
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={`${fill ? "absolute inset-0 h-full w-full " : ""}${className ?? ""}`}
      style={fill ? { objectFit: "cover", ...style } : style}
      {...rest}
    />
  );
}

/* ---------------- next/link ---------------- */
type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  prefetch?: boolean;
  scroll?: boolean;
  children?: ReactNode;
};

export function Link({
  href,
  prefetch: _prefetch,
  scroll: _scroll,
  onClick,
  target,
  download,
  ...rest
}: LinkProps) {
  // Taranabilir, gerçek yol bağlantıları (href yerinde kalır) + tıklamada
  // istemci tarafı geçiş. Böylece sayfalar, _redirects desteği olmayan
  // statik sunucularda/önizlemelerde de tam sayfa yenilenmeden açılır.
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Yeni sekme, indirme, orta/sağ tık ve değiştirici tuşlar → tarayıcı davranışı.
    if (target || download || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (navigate(href)) e.preventDefault();
  }

  return <a href={href} target={target} download={download} {...rest} onClick={handleClick} />;
}

export default Link;
