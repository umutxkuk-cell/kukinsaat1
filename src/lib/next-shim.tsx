"use client";

import NextLink from "next/link";
import { usePathname as useNextPathname, notFound as nextNotFound } from "next/navigation";
import {
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
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

export function setPathname(_next: string) {
  // Managed by Next.js router
}

export function usePathname() {
  const p = useNextPathname();
  return p ? normalizePath(p) : "/";
}

export function subscribePathname(fn: (path: string) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => fn(getPathname());
  window.addEventListener("popstate", handler);
  return () => window.removeEventListener("popstate", handler);
}

export function navigate(href: string): boolean {
  if (typeof window === "undefined") return false;
  window.location.href = href;
  return true;
}

export class NotFoundError extends Error {
  constructor() {
    super("404");
    this.name = "NotFoundError";
  }
}

export function notFound(): never {
  nextNotFound();
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
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
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

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  prefetch?: boolean;
  scroll?: boolean;
  children?: ReactNode;
};

export function Link({
  href,
  prefetch,
  scroll,
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
    <NextLink href={href} prefetch={prefetch} scroll={scroll} className={className} onClick={onClick} {...rest}>
      {children}
    </NextLink>
  );
}

export default Link;
