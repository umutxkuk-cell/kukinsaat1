import { Link } from "@/lib/next-shim";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light" | "outline-light";
  className?: string;
};

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  const base =
    "btn-sheen group/btn relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-400 focus-visible:outline-none";
  const styles = {
    primary: "bg-ink text-white hover:bg-ink-hover",
    secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
    ghost: "text-ink underline-offset-4 hover:underline normal-case tracking-normal font-medium",
    light: "bg-white text-ink hover:bg-ink hover:text-white",
    "outline-light": "border border-white/70 text-white hover:bg-white hover:text-ink",
  } as const;
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}