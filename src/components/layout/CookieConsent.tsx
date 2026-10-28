import { useEffect, useState } from "react";
import { Link, subscribePathname } from "@/lib/next-shim";
import { site } from "@/data/site";
import { LogoMark } from "@/components/brand/Logo";

/**
 * Çerez onay merkezi — KVKK + Google Consent Mode v2 uyumlu.
 *
 * Görsel: sayfanın alt kenarına oturan tam genişlik bar. Üst kenarında petrol
 * mavisi çizgi boyunca yavaş bir ışık dolaşır; zeminde teknik çizim dokusu ve
 * sağda altıgen marka filigranı bulunur. Bar sabit konumlu olduğundan düzende
 * kayma (CLS) oluşturmaz; prerender edilmiş HTML'de yer almaz.
 *
 * Akış (Google'ın zorunlu sıralaması):
 *  1. Sayfa açılır açılmaz gtag kuyruğu kurulur ve consent VARSAYILANLARI
 *     (analitik/reklam = denied) tanımlanır — hiçbir Google etiketi henüz
 *     yüklenmediği için tarayıcıdan veri çıkışı olmaz (KVKK opt-in).
 *  2. Kullanıcı onaylarsa etiket yüklenir ve consent "update" ile genişletilir.
 *  3. Reddedilirse etiket hiç yüklenmez; seçim localStorage'da saklanır ve
 *     sol alttaki altıgen simgeden istendiğinde değiştirilebilir.
 */

const STORAGE_KEY = "kuk-cookie-consent"; // "accepted" | "declined" | "analytics"
export const COOKIE_PREF_EVENT = "kuk:cookie-preferences";

type Choice = "accepted" | "declined" | "analytics";

type Gtag = (...args: any[]) => void;
type GoogleWindow = typeof window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  __kukConsentReady?: boolean;
  __kukGaLoaded?: boolean;
};

function consentState(analytics: boolean, ads: boolean) {
  return {
    ad_storage: ads ? "granted" : "denied",
    ad_user_data: ads ? "granted" : "denied",
    ad_personalization: ads ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  } as const;
}

/** gtag kuyruğunu kurar ve denied varsayılanlarını etiketlerden ÖNCE yazar. */
function ensureConsentDefaults() {
  const w = window as GoogleWindow;
  if (w.__kukConsentReady) return;
  w.dataLayer = w.dataLayer ?? [];
  w.gtag =
    w.gtag ??
    function gtag() {
      w.dataLayer?.push(arguments);
    };
  w.gtag("consent", "default", consentState(false, false));
  w.__kukConsentReady = true;
}

function applyConsent(choice: Choice) {
  ensureConsentDefaults();
  const w = window as GoogleWindow;
  if (choice === "declined") return; // varsayılanlar zaten denied — etiket yok

  const ads = choice === "accepted";
  w.gtag?.("consent", "update", consentState(true, ads));
  if (w.__kukGaLoaded) return;

  w.gtag?.("js", new Date());
  w.gtag?.("config", site.gaId, { anonymize_ip: true, send_page_view: false });

  const script = document.createElement("script");
  script.id = "kuk-ga4-tag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`;
  document.head.appendChild(script);
  w.__kukGaLoaded = true;
}

function sendPageView() {
  const w = window as GoogleWindow;
  if (typeof w.gtag !== "function" || !w.__kukGaLoaded) return;
  w.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    send_to: site.gaId,
  });
}

/**
 * Onayın geçerlilik süresi: 180 gün.
 *
 * KVKK ve GDPR uygulamalarında onay süresiz saklanmaz; makul aralıklarla
 * yeniden teyit istenir. Süre dolduğunda bar ziyaretçiye tekrar gösterilir.
 * Bu aynı zamanda "bir kez tıkladım, bir daha hiç çıkmıyor" sorununu çözer.
 */
const CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;

function isChoice(v: unknown): v is Choice {
  return v === "accepted" || v === "declined" || v === "analytics";
}

/**
 * Saklı kararı okur. İki biçimi de anlar:
 *  - yeni: {"value":"accepted","at":<ms>}  → süresi dolmuşsa null döner
 *  - eski: "accepted" (düz metin)          → zaman damgası olmadığı için
 *    süresi dolmuş kabul edilir ve ziyaretçiye bir kez daha sorulur.
 */
function readStored(): Choice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if (isChoice(raw)) return null; // eski biçim → yeniden sor
    const parsed = JSON.parse(raw) as { value?: unknown; at?: unknown };
    if (!isChoice(parsed?.value)) return null;
    const at = Number(parsed.at) || 0;
    if (Date.now() - at > CONSENT_TTL_MS) return null; // süresi doldu
    return parsed.value;
  } catch {
    return null;
  }
}

/** Kararı zaman damgasıyla yazar. */
function writeStored(value: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, at: Date.now() }));
  } catch {
    /* depolama engellenmişse yoksay */
  }
}

/** Saklı kararı siler (test ve "sıfırla" bağlantısı için). */
function clearStored() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* yoksay */
  }
}

/**
 * `?consent=reset` — saklı kararı siler ve adres çubuğunu temizler.
 * Site sahibinin barı her zaman ilk ziyaretteki gibi görmesini sağlar.
 */
function consumeResetParam(): boolean {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("consent") !== "reset") return false;
    clearStored();
    url.searchParams.delete("consent");
    window.history.replaceState(
      window.history.state,
      "",
      url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : "") + url.hash,
    );
    return true;
  } catch {
    return false;
  }
}

/* ── Satır içi ikonlar (marka geometrisiyle uyumlu, elle çizildi) ── */

function ShieldHexIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M12 2.6 20.1 7.25v9.5L12 21.4 3.9 16.75v-9.5Z" strokeLinejoin="round" />
      <path d="m8.7 12.15 2.25 2.25 4.4-4.55" strokeLinecap="square" />
    </svg>
  );
}

function CookieHexIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M12 2.6 20.1 7.25v9.5L12 21.4 3.9 16.75v-9.5Z" strokeLinejoin="round" />
      <circle cx="9.2" cy="9.4" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="11.6" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="14.9" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Tercih satırı: ad + açıklama + anahtar ── */

function PrefRow({
  name,
  desc,
  checked,
  locked = false,
  onToggle,
}: {
  name: string;
  desc: string;
  checked: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[0.8rem] font-semibold text-white">{name}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={name}
        disabled={locked}
        onClick={onToggle}
        className={`consent-toggle mt-0.5${locked ? " cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

/** Kenarlıklı, markayla uyumlu ikon kutusu. */
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-11 w-11 flex-none items-center justify-center border border-white/12 bg-white/[0.04] text-accent-soft">
      {children}
    </div>
  );
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. adım: etiketlerden önce consent varsayılanları (denied).
    ensureConsentDefaults();

    // `?consent=reset` varsa saklı karar silinir; bar ilk ziyaretteki gibi
    // gösterilir. Site sahibinin kurulumu denetlemesi için kaçış yolu.
    consumeResetParam();

    const stored = readStored();
    if (stored) {
      setDecided(true);
      setAnalyticsOn(stored !== "declined");
      if (stored !== "declined") {
        applyConsent(stored);
        sendPageView();
      }
    }

    // Barı, açılış perdesi (intro) kalkar kalkmaz göster — sabit zamanlayıcı
    // yerine DOM gerçeğine bakılır: perde yoksa ~550ms'de, perde oynuyorsa
    // perde biter bitmez (~2,7sn) gelir. 3,4sn'lik emniyet sınırı vardır.
    let shown = false;
    const showIfUndecided = () => {
      shown = true;
      if (!readStored()) setOpen(true);
    };
    const cap = window.setTimeout(() => {
      window.clearInterval(poll);
      if (!shown) showIfUndecided();
    }, 3400);
    const poll = window.setInterval(() => {
      if (document.querySelector(".intro")) return; // perde hâlâ sahnede
      window.clearInterval(poll);
      window.clearTimeout(cap);
      if (!shown) window.setTimeout(showIfUndecided, stored ? 0 : 350);
    }, 200);

    // SPA geçişlerinde (pushState + popstate) sayfa görüntüleme ölçümü.
    const unsubscribe = subscribePathname(() => {
      const c = readStored();
      if (c === "accepted" || c === "analytics") window.setTimeout(sendPageView, 0);
    });
    const reopen = () => {
      setLeaving(false);
      setAnalyticsOn(readStored() !== "declined");
      setOpen(true);
    };
    window.addEventListener(COOKIE_PREF_EVENT, reopen);
    return () => {
      window.clearTimeout(cap);
      window.clearInterval(poll);
      unsubscribe();
      window.removeEventListener(COOKIE_PREF_EVENT, reopen);
    };
  }, []);

  function choose(value: Choice) {
    writeStored(value);
    applyConsent(value);
    if (value !== "declined") sendPageView();
    setDecided(true);
    setLeaving(true);
    window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
      setPrefs(false);
    }, 320);
  }

  function reopen() {
    setAnalyticsOn(readStored() !== "declined");
    setLeaving(false);
    setOpen(true);
  }

  // Prerender/SSR çıktısına bar girmez — yalnızca istemci.
  if (!mounted) return null;

  return (
    <>
      {/* Tam genişlik onay barı: sayfanın alt kenarına oturur; üst çizgisinde
          yavaş bir ışık dolaşır. Giriş/çıkış dikey kaymayla, içerik değişimi
          (özet ↔ tercihler) yumuşak geçişle olur. */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-[70]"
          role="dialog"
          aria-label="Çerez tercihleri"
          aria-describedby="consent-desc"
        >
          <div className={`consent-bar relative overflow-hidden border-t border-white/10 text-white${leaving ? " is-leaving" : ""}`}>
            <span className="consent-edge" aria-hidden="true" />
            {/* Altıgen marka filigranı */}
            <div className="pointer-events-none absolute -bottom-24 -right-12 hidden opacity-[0.05] md:block" aria-hidden="true">
              <LogoMark variant="light" className="h-72 w-auto -rotate-6" />
            </div>

            <div className="container-x relative">
              {prefs ? (
                <div key="prefs" className="consent-view flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:gap-10">
                  <div className="flex items-center gap-4">
                    <IconBox>
                      <CookieHexIcon className="h-5 w-5" />
                    </IconBox>
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/40">
                        Çerez Kategorileri
                      </p>
                      <h2 className="mt-1 font-display text-lg font-bold tracking-tight">
                        Seçiminizi yapın
                      </h2>
                    </div>
                  </div>
                  <div className="grid flex-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                    <PrefRow
                      name="Zorunlu çerezler"
                      desc="Sitenin güvenli çalışması için gereklidir; kapatılamaz."
                      checked
                      locked
                    />
                    <PrefRow
                      name="Analitik — Google Analytics"
                      desc="Ziyaretleri anonim ölçmemizi sağlar; IP adresleri kısaltılır."
                      checked={analyticsOn}
                      onToggle={() => setAnalyticsOn((v) => !v)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => choose(analyticsOn ? "analytics" : "declined")}
                      className="bg-white px-6 py-2.5 text-[0.8rem] font-semibold text-ink transition-colors hover:bg-accent-soft"
                    >
                      Seçimi kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefs(false)}
                      className="px-2 py-2.5 text-[0.8rem] text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              ) : (
                <div key="summary" className="consent-view flex flex-col gap-4 py-5 sm:gap-5 lg:flex-row lg:items-center lg:gap-8 lg:py-6">
                  <div className="flex items-center gap-4">
                    <IconBox>
                      <ShieldHexIcon className="h-5 w-5" />
                    </IconBox>
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/40">
                        KVKK · Çerez Politikası
                      </p>
                      <h2 className="mt-1 font-display text-lg font-bold tracking-tight">
                        Çerez tercihleriniz
                      </h2>
                    </div>
                  </div>
                  <p id="consent-desc" className="max-w-2xl text-[0.82rem] leading-relaxed text-white/60 lg:flex-1">
                    Deneyimi ölçmek için yalnızca Google Analytics kullanırız; onayınız
                    olmadan hiçbir izleme çerezi yerleştirilmez. Seçiminizi dilediğiniz an
                    sol alttaki simgeden değiştirebilirsiniz.{" "}
                    <Link
                      href="/gizlilik"
                      className="font-medium text-white underline decoration-accent-soft/60 underline-offset-2 transition-colors hover:decoration-accent-soft"
                    >
                      Gizlilik &amp; KVKK metni
                    </Link>
                  </p>
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => choose("accepted")}
                      className="bg-white px-6 py-2.5 text-[0.8rem] font-semibold text-ink transition-colors hover:bg-accent-soft"
                    >
                      Tümünü kabul et
                    </button>
                    <button
                      type="button"
                      onClick={() => choose("declined")}
                      className="border border-white/25 px-6 py-2.5 text-[0.8rem] font-medium text-white/80 transition-colors hover:border-white hover:text-white"
                    >
                      Yalnızca zorunlu
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefs(true)}
                      className="px-2 py-2.5 text-[0.8rem] text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Tercihler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Karar sonrası: tercihleri yeniden açan etiketli rozet.
          Yalnızca ikon olduğunda gözden kaçıyordu; yazı keşfedilebilirliği
          garantiler, hover'da petrol mavisine döner. */}
      {decided && !open && (
        <button
          type="button"
          onClick={reopen}
          aria-label="Çerez tercihlerini değiştir"
          className="consent-fab group fixed bottom-4 left-4 z-[60] flex items-center gap-2.5 border border-line-2 bg-bg py-2.5 pl-3 pr-4 text-ink shadow-[0_10px_30px_rgba(8,10,12,0.38)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-warm"
        >
          {/* Mineral açık zemin: hem koyu footer/hero üstünde hem açık gövde
              bölümlerinde okunur. Koyu zeminli eski sürüm footer ile
              birleşip görünmez oluyordu. */}
          <CookieHexIcon className="h-[17px] w-[17px] flex-none text-accent-warm transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
            Çerez Tercihleri
          </span>
        </button>
      )}
    </>
  );
}
