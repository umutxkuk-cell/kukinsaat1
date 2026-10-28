/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * İletişim formu mesajlarını sunucu tarafında doğrular ve şirket e-posta
 * adresine iletir. API anahtarları Cloudflare Pages ortam değişkenlerinde
 * tutulur; istemci paketine (bundle) hiçbir anahtar girmez.
 *
 * Sağlayıcılar (ilk yapılandırılmış olan kullanılır):
 *   1) EmailJS  → EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY
 *                 (EMAILJS_PRIVATE_KEY isteğe bağlı: hesapta oluşturulduysa
 *                  accessToken olarak eklenir, yoksa gönderilmez)
 *   2) Resend   → RESEND_API_KEY (+ isteğe bağlı CONTACT_FROM_EMAIL)
 *
 * EMAILJS_SERVICE_ID ve CONTACT_TO_EMAIL gizli değildir; wrangler.toml
 * içindeki [vars] bloğunda tutulur ve her dağıtımda otomatik enjekte edilir.
 *
 * Ortak değişkenler:
 *   CONTACT_TO_EMAIL  — alıcı adres (varsayılan: umut@kukinsaat.com)
 *
 * Yanıtlar:
 *   200 {ok:true}                 — mesaj iletildi
 *   400 {error:"invalid_json"}    — gövde JSON değil
 *   422 {error:"validation_failed", fields:[...]} — alan hataları
 *   429 {error:"rate_limited"}    — çok fazla deneme
 *   502 {error:"provider_failed"} — e-posta sağlayıcısı hata verdi
 *   503 {error:"not_configured"}  — sağlayıcı değişkenleri eksik
 *                                   (istemci bu durumda mailto yedeğine düşer)
 */

type Env = {
  EMAILJS_SERVICE_ID?: string;
  EMAILJS_TEMPLATE_ID?: string;
  EMAILJS_PUBLIC_KEY?: string;
  EMAILJS_PRIVATE_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

type Context = {
  request: Request;
  env: Env;
};

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

/* ── Basit bellek içi hız sınırı (izolat başına).
      Güçlendirme yolu: Cloudflare Rate Limiting binding. ── */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 dakika
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) {
    // Bellek şişmesin: en eski kayıtları seyrelt.
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  return false;
}

/* ── Doğrulama (istemci kurallarının sunucu tarafı ikizi) ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/\r?\n{4,}/g, "\n\n\n")
    .trim()
    .slice(0, max);
}

function validate(raw: Record<string, unknown>): { fields: Fields; errors: string[] } {
  const fields: Fields = {
    name: clean(raw.name, 120),
    email: clean(raw.email, 254),
    phone: clean(raw.phone, 40),
    subject: clean(raw.subject, 160),
    message: clean(raw.message, 4000),
  };
  const errors: string[] = [];
  if (fields.name.length < 2) errors.push("name");
  if (!EMAIL_RE.test(fields.email)) errors.push("email");
  if (fields.message.length < 10) errors.push("message");
  return { fields, errors };
}

/* ── Sağlayıcı 1: EmailJS (REST) ── */
async function sendViaEmailJs(env: Env, fields: Fields, toEmail: string) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      // Private Key isteğe bağlıdır: hesapta oluşturulmuşsa EmailJS onu
      // zorunlu tutar ve accessToken olarak gönderilir; yoksa public key
      // tek başına yeterlidir. Boş değer göndermek 400 hatasına yol açar.
      ...(env.EMAILJS_PRIVATE_KEY?.trim()
        ? { accessToken: env.EMAILJS_PRIVATE_KEY.trim() }
        : {}),
      // Değişken adı takma adları (alias) — EmailJS yalnızca şablonda geçen
      // parametreleri yerine koyar, fazlasını sessizce yok sayar. Bu yüzden
      // tüm yaygın adlandırmaları birlikte gönderiyoruz: ister bu depodaki
      // EMAILJS-SABLON.md şablonu, ister EmailJS'in hazır "Contact Us"
      // şablonu kullanılsın, alanlar dolu gelir. Böylece "{{name}} mı
      // {{from_name}} mı?" tuzağı tamamen ortadan kalkar.
      template_params: {
        // Gönderen adı
        from_name: fields.name,
        name: fields.name,
        user_name: fields.name,
        // Gönderen e-postası
        reply_to: fields.email,
        email: fields.email,
        user_email: fields.email,
        from_email: fields.email,
        // Telefon
        phone: fields.phone || "-",
        user_phone: fields.phone || "-",
        // Konu
        subject: fields.subject || "Genel",
        // Mesaj
        message: fields.message,
        // Alıcı (şablonun "To Email" alanı {{to_email}} ise buradan dolar)
        to_email: toEmail,
      },
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new Error(`EmailJS ${res.status}: ${detail}`);
  }
}

/* ── Sağlayıcı 2: Resend ── */
async function sendViaResend(env: Env, fields: Fields, toEmail: string) {
  const text = [
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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL ?? "Kuk İnsaat Web Formu <onboarding@resend.dev>",
      to: [toEmail],
      reply_to: fields.email,
      subject: `Teklif / Bilgi Talebi — ${fields.subject || "Genel"}`,
      text,
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
}

/* ── Preflight ── */
export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestPost = async ({ request, env }: Context) => {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Bot tuzağı dolduysa sahte başarı dön (bot başarı sandığı için durur).
  if (String(raw["bot-field"] ?? "").trim()) return json({ ok: true });

  const { fields, errors } = validate(raw);
  if (errors.length > 0) {
    return json({ ok: false, error: "validation_failed", fields: errors }, 422);
  }

  const toEmail = env.CONTACT_TO_EMAIL?.trim() || "umut@kukinsaat.com";

  // EmailJS için üç değişken zorunlu; Private Key isteğe bağlı.
  const emailJsReady = Boolean(
    env.EMAILJS_SERVICE_ID?.trim() &&
      env.EMAILJS_TEMPLATE_ID?.trim() &&
      env.EMAILJS_PUBLIC_KEY?.trim(),
  );

  try {
    if (emailJsReady) {
      await sendViaEmailJs(env, fields, toEmail);
    } else if (env.RESEND_API_KEY?.trim()) {
      await sendViaResend(env, fields, toEmail);
    } else {
      // Henüz yapılandırılmadı → istemci mailto yedeğine düşer.
      // Yanıt, eksik değişkenleri adlarıyla bildirir (değerlerini değil);
      // böylece `curl` ile hangi anahtarın girilmediği anında görülür.
      const missing = [
        ["EMAILJS_SERVICE_ID", env.EMAILJS_SERVICE_ID],
        ["EMAILJS_TEMPLATE_ID", env.EMAILJS_TEMPLATE_ID],
        ["EMAILJS_PUBLIC_KEY", env.EMAILJS_PUBLIC_KEY],
      ]
        .filter(([, v]) => !String(v ?? "").trim())
        .map(([k]) => k);

      return json(
        {
          ok: false,
          error: "not_configured",
          missing,
          hint:
            "Bu değişkenler wrangler.toml [vars] veya Cloudflare panelinde " +
            "Settings → Environment variables altında tanımlanır; ekledikten " +
            "sonra yeni bir dağıtım tetikleyin. GET /api/health ayrıntı verir.",
        },
        503,
      );
    }
  } catch (err) {
    return json(
      { ok: false, error: "provider_failed", detail: String(err) },
      502,
    );
  }

  return json({ ok: true });
};
