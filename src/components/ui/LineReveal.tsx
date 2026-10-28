import { useEffect, useRef, useState } from "react";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Satır satır maskeli metin açılımı. Her satır alttan yukarı doğru kayarak
 * görünür olur. prefers-reduced-motion'da anında görünür.
 */
export function LineReveal({
  lines,
  as = "h2",
  className = "",
  delay = 0,
  stagger = 70,
}: {
  lines: string[];
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
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
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);

    // Güvenlik ağı: gözlemleyici tetiklenmezse içerik yine de görünür olur.
    const fallback = window.setTimeout(() => setVisible(true), 1600);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const Tag = as;

  return (
    <Tag className={className} aria-label={lines.join(" ")}>
      <span ref={ref} className={visible ? "is-visible" : ""}>
        {lines.map((line, i) => (
          <span key={i} className="line-mask">
            <span
              className="line-mask-inner"
              style={{ transitionDelay: `${delay + i * stagger}ms` }}
            >
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}