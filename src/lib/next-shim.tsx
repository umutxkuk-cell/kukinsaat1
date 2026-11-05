"use client";

import {
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
  createElement,
} from "react";

export function normalizePath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0];
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export function getPathname() {
  if (typeof window === "undefined") return "/";
  return normalizePath(window.location.pathname);
}

export function getCurrentPath() {
  return getPathname();
}

// Simple pub-sub for path changes
type PathListener = (path: string) => void;
const listeners = new Set<PathListener>();

export function setPathname(next: string) {
  // Called by App.tsx after applying route; no-op here (navigation is handled via navigate())
}

export function subscribePathname(fn: PathListener): () => void {
  if (typeof window === "undefined") return () => {};
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function navigate(href: string): boolean {
  if (typeof window === "undefined") return false;
  window.history.pushState({}, "", href);
  const next = getPathname();
  listeners.forEach((l) => l(next));
  return true;
}

export class NotFoundError extends Error {
  constructor() {
    super("404");
    this.name = "NotFoundError";
  }
}

export function notFound(): never {
  throw new NotFoundError();
}

// usePathname hook for header active state
export function usePathname() {
  const [path, setPath] = useState(() => getPathname());
  useEffect(() => {
    const handler = () => setPath(getPathname());
    window.addEventListener("popstate", handler);
    const unsub = subscribePathname(() => handler());
    return () => {
      window.removeEventListener("popstate", handler);
      unsub();
    };
  }, []);
  return path;
}

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
  return createElement("img", {
    src,
    alt: alt ?? "",
    loading: priority ? "eager" : "lazy",
    decoding: priority ? "sync" : "async",
    fetchPriority: priority ? "high" : undefined,
    className: `${fill ? "absolute inset-0 h-full w-full " : ""}${className ?? ""}`,
    style: fill ? { objectFit: "cover", ...style } : style,
    ...rest,
  });
}

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
  children,
  className,
  ...rest
}: LinkProps) {
  if (
    target ||
    download ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return (
      <a href={href} target={target} download={download} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (e.defaultPrevented) return;
        // Let browser handle modified clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        window.history.pushState({}, "", href);
        const next = getPathname();
        listeners.forEach((l) => l(next));
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export default Link;
