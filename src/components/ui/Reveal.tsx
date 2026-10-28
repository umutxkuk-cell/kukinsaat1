import { useEffect, useRef, useState, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale" | "clip" | "blur";

const variantClass: Record<Variant, string> = {
  up: "reveal-up",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
  clip: "reveal-clip",
  blur: "reveal-blur",
};

/**
 * Görünür alana girince içerik açılan sarmalayıcı.
 *
 * Uzun içerikler için (ör. tüm yasal metin) IntersectionObserver'ın oran
 * eşiği hiçbir zaman yakalanamayabilir; bu durumda içerik sonsuza dek
 * `opacity: 0` kalır. Bu yüzden:
 *  - eşik, eleman yüksekliğine göre ölçeklenir,
 *  - IntersectionObserver yoksa/çalışmazsa içerik anında gösterilir,
 *  - son çare olarak kısa bir güvenlik zamanlayıcısı içeriği açar.
 */
export function Reveal({
  children,
  variant = "up",
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  variant?: Variant;
  as?: "div" | "li" | "section" | "span" | "article";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      const id = window.setTimeout(() => setVisible(true), delay);
      timers.current.push(id);
    };

    // IntersectionObserver desteklenmiyorsa içerik doğrudan gösterilir.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Eşik, eleman yüksekliğine göre ölçeklenir: eleman viewport'tan
    // yüksekse bile küçük bir orandan itibaren tetiklenebilir olur.
    const h = el.getBoundingClientRect().height || 1;
    const viewport = window.innerHeight || 1;
    const threshold = Math.max(0.01, Math.min(0.12, (viewport * 0.4) / h));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(el);

    // Güvenlik ağı: her koşulda içeriğin görünür olmasını garanti eder.
    const fallback = window.setTimeout(() => setVisible(true), 1400 + delay);
    timers.current.push(fallback);

    return () => {
      observer.disconnect();
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [delay]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${variantClass[variant]} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
