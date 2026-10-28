import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";

/**
 * Premium açılış perdesi — ilk karede sayfayı kaplar, logoyu gösterir ve
 * yukarı kayarak açılır. Oturum başına bir kez oynar.
 * prefers-reduced-motion açıkken hareket oynatılmaz, perde hemen kaldırılır.
 */
export function Intro() {
  // İlk karede görünür başlar (SSR + client aynı) — mobilde de garanti görünür.
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen: string | null = null;
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      seen = sessionStorage.getItem("kuk-intro-seen");
    } catch {
      // Depolama erişimi engellenseydi perde yine de güvenle kaldırılır.
      reduce = true;
    }

    if (reduce || seen) {
      // Hareket istenmiyorsa ya da daha önce görüldüyse perdeyi hemen kaldır.
      const id = window.setTimeout(() => setShow(false), 0);
      return () => window.clearTimeout(id);
    }

    document.body.dataset.introLock = "1";
    document.body.style.overflow = "hidden";
    const t1 = window.setTimeout(() => setDone(true), 1450);
    const t2 = window.setTimeout(() => {
      setShow(false);
      delete document.body.dataset.introLock;
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("kuk-intro-seen", "1");
      } catch {
        /* yoksay */
      }
    }, 2200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      delete document.body.dataset.introLock;
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`intro ${done ? "done" : ""}`} aria-hidden="true">
      <div className="flex flex-col items-center">
        <div className="intro-mark">
          <LogoMark variant="light" className="h-24 w-auto sm:h-28" />
        </div>
        <span className="intro-line mt-8" />
        <span className="intro-mark mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.58em] text-white/70">
          Kaliteyle Kurulur
        </span>
      </div>
    </div>
  );
}