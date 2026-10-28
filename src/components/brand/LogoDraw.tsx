import { useEffect, useRef, useState } from "react";

/**
 * KUK emblemini (orijinal logodan birebir çıkarılan geometri) çizgileri tek tek
 * "çizilerek" ortaya çıkan bir animasyonla gösterir. Görünür alana girince
 * tetiklenir; reduced-motion'da statik gösterilir.
 *
 * Not: Her path'te pathLength="1" kullanılır — böylece stroke-dasharray/offset
 * gerçek piksel uzunluğuna bağlı kalmadan 0–1 aralığında normalize edilir ve
 * çizim animasyonu her path için eksiksiz tamamlanır.
 */
export function LogoDraw({
  className = "h-40 w-auto",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 329.28 372.5"
      fill="none"
      role="img"
      aria-label="KUK İnşaat"
      className={`logo-draw ${visible ? "is-visible" : ""} ${className}`}
      style={{ stroke: color }}
    >
      <path pathLength={1} d="M297.08 261.26 164.79 341.36 31.00 259.41 31.00 113.09 164.79 30.22 297.08 112.63Z" strokeWidth="6" strokeLinejoin="miter" />
      <path pathLength={1} d="M164.79 3.36 6.48 98.83 6.48 273.28 164.79 369.14 321.14 273.28 321.14 98.83Z" strokeWidth="6" strokeLinejoin="miter" />
      <path pathLength={1} d="M67.56 173.29 101.80 109.85 101.80 89.02 74.50 105.22 29.15 187.64 29.61 236.72 53.68 198.29 103.65 282.09 103.65 235.33Z" strokeWidth="6" strokeLinejoin="miter" />
      <path pathLength={1} d="M183.24 62.60 183.24 267.28 164.73 280.24 145.76 267.28 146.69 62.60 120.31 77.91 120.31 289.50 164.27 318.67 208.69 290.43 208.69 76.98Z" strokeWidth="6" strokeLinejoin="miter" />
      <path pathLength={1} d="M253.14 105.22 225.84 89.02 225.84 109.85 260.09 173.29 223.99 235.33 223.99 282.09 273.97 198.29 298.03 236.72 298.49 187.64Z" strokeWidth="6" strokeLinejoin="miter" />
    </svg>
  );
}
