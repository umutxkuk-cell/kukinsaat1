import { useState } from "react";
import { Link } from "@/lib/next-shim";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "ready" | "error";

/** Alan bazlı doğrulama hataları — WCAG 3.3.1 (hata tanımı) ve 3.3.3 (öneri). */
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(fields: Record<string, string>): FieldErrors {
  const e: FieldErrors = {};
  if (fields.name.length < 2) e.name = "Lütfen adınızı ve soyadınızı yazın.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email))
    e.email = "Geçerli bir e-posta adresi girin (örn. ad@firma.com).";
  if (fields.message.length < 10)
    e.message = "Projenizi kısaca anlatın (en az 10 karakter).";
  return e;
}

/* Kırık beyaz zeminde alanlar beyaz yüzeyde yükselir; kenarlık beyaz üstünde
   3:1 kontrastlı line-2 (WCAG 1.4.11). Odak durumunda grafit sınır. */
const inputClass =
  "mt-2 w-full border border-line-2 bg-surface px-4 py-3 text-sm transition-colors focus:border-ink focus:outline-none";

/** Form verisini düz metin e-posta gövdesine çevirir. */
function buildMailto(fields: Record<string, string>) {
  const subject = `Teklif / Bilgi Talebi — ${fields.subject || "Genel"}`;
  const body = [
    `Ad Soyad : ${fields.name}`,
    `E-posta  : ${fields.email}`,
    `Telefon  : ${fields.phone || "-"}`,
    `Konu     : ${fields.subject || "-"}`,
    "",
    "Mesaj:",
    fields.message,
    "",
    "— Bu ileti kukinsaat.com iletişim formundan gönderilmiştir.",
  ].join("\n");

  return `${site.contact.emailHref}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [mailto, setMailto] = useState(site.contact.emailHref);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Bot tuzağı dolduysa işlemi sessizce sonlandır.
    if (String(data.get("bot-field") ?? "")) {
      form.reset();
      setStatus("ready");
      return;
    }

    const fields: Record<string, string> = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    // Alan bazlı doğrulama — her alanın kendi hata mesajı olur.
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("error");
      // Klavye kullanıcısını ilk hatalı alana yönlendir (WCAG 3.3.1).
      const first = Object.keys(errs)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    setStatus("sending");

    // Cloudflare Pages Function (/api/contact) sunucu tarafında gönderir.
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, "bot-field": "" }),
      });
      if (res.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      // 503 (sağlayıcı yapılandırılmadı) veya diğer hatalar → mailto yedeği.
    } catch {
      // Ağ hatası (ör. işlev dağıtılmamış) → mailto yedeği.
    }

    const href = buildMailto(fields);
    setMailto(href);

    // Yedek yol: yerleşik e-posta istemcisini açar.
    window.location.href = href;
    window.setTimeout(() => setStatus("ready"), 700);
  }

  if (status === "sent") {
    return (
      <div className="border border-line bg-bg-2 p-8" role="status">
        <p className="flex items-center gap-3 font-display text-2xl">
          <svg viewBox="0 0 20 20" className="h-6 w-6 text-accent" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5 8 15.5 17 5" strokeLinecap="square" />
          </svg>
          Talebiniz alındı.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Mesajınız tarafımıza iletildi; en kısa sürede size dönüş yapacağız.
          Acil konular için bizi doğrudan arayabilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={site.contact.phoneHref}
            className="inline-flex items-center bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-ink-hover"
          >
            {site.contact.phone}
          </a>
          <button
            type="button"
            onClick={() => { setErrors({}); setStatus("idle"); }}
            className="inline-flex items-center px-5 py-2.5 text-sm text-ink underline-offset-4 hover:underline"
          >
            Yeni talep oluştur
          </button>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <div className="border border-line bg-bg-2 p-8">
        <p className="font-display text-2xl">E-posta uygulamanız açıldı.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Talebiniz, tarafımıza iletilmek üzere e-posta uygulamanızda hazır
          hâle getirildi. Uygulama açılmadıysa veya gönderemediyseniz, aşağıdaki
          bağlantıyı kullanarak aynı içeriği yeniden gönderebilir ya da bizi
          doğrudan arayabilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={mailto}
            className="inline-flex items-center bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-ink-hover"
          >
            E-postayı tekrar aç
          </a>
          <a
            href={site.contact.phoneHref}
            className="inline-flex items-center border border-ink/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink"
          >
            {site.contact.phone}
          </a>
          <button
            type="button"
            onClick={() => { setErrors({}); setStatus("idle"); }}
            className="inline-flex items-center px-5 py-2.5 text-sm text-ink underline-offset-4 hover:underline"
          >
            Yeni talep oluştur
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* bot tuzağı */}
      <p className="hidden" aria-hidden="true">
        <label>
          Boş bırakın: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Ad Soyad</span>
          <input
            id="field-name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={`${inputClass}${errors.name ? " border-red-600 focus:border-red-600" : ""}`}
          />
          {errors.name && (
            <span id="err-name" className="mt-1.5 block text-xs text-red-700">
              {errors.name}
            </span>
          )}
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">E-posta</span>
          <input
            id="field-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
            className={`${inputClass}${errors.email ? " border-red-600 focus:border-red-600" : ""}`}
          />
          {errors.email && (
            <span id="err-email" className="mt-1.5 block text-xs text-red-700">
              {errors.email}
            </span>
          )}
        </label>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            Telefon (isteğe bağlı)
          </span>
          <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Konu (isteğe bağlı)</span>
          <input name="subject" className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Mesaj</span>
        <textarea
          id="field-message"
          name="message"
          required
          minLength={10}
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className={`${inputClass}${errors.message ? " border-red-600 focus:border-red-600" : ""}`}
        />
        {errors.message && (
          <span id="err-message" className="mt-1.5 block text-xs text-red-700">
            {errors.message}
          </span>
        )}
      </label>

      {status === "error" && Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-700" role="alert">
          Formda {Object.keys(errors).length} alan eksik veya hatalı. İlgili
          alanlar kırmızı kenarlıkla işaretlendi.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center bg-accent-warm px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-warm-hover disabled:opacity-60"
      >
        {status === "sending" ? "Gönderiliyor..." : "Talebi gönder"}
      </button>

      <p className="text-xs leading-relaxed text-muted">
        “Talebi gönder” düğmesine bastığınızda mesajınız doğrudan tarafımıza
        iletilir; iletim başarısız olursa yedek olarak tarayıcınızın e-posta
        uygulaması açılır. Paylaştığınız bilgiler yalnızca talebinizin
        değerlendirilmesi amacıyla işlenir. Ayrıntılar için{" "}
        <Link href="/gizlilik" className="underline underline-offset-2 hover:text-ink">
          Gizlilik ve KVKK Aydınlatma Metni
        </Link>
        ’ni inceleyebilirsiniz.
      </p>
    </form>
  );
}
