import { useRef } from "react";
import type { ReactNode } from "react";

/**
 * İçindeki öğeyi imlece doğru hafifçe çeken "manyetik" etki. Dokunmatik ve
 * reduced-motion durumlarında devre dışı kalır.
 */
export function Magnetic({
  children,
  strength = 18,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`magnetic inline-flex ${className}`}
    >
      {children}
    </span>
  );
}