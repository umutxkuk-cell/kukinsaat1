/**
 * POST /api/contact — iletişim formunu e-posta sağlayıcısına iletir.
 *
 * Sağlayıcı zinciri (ilk başarılı olan kullanılır):
 *   1) EmailJS  EMAILJS_SERVICE_ID + EMAILJS_TEMPLATE_ID + EMAILJS_PUBLIC_KEY
 *               (EMAILJS_PRIVATE_KEY varsa accessToken olarak gönderilir)
 *   2) Resend   RESEND_API_KEY (+ isteğe bağlı CONTACT_FROM_EMAIL)
 *   3) Web3Forms WEB3FORMS_ACCESS_KEY
 *   4) FormSubmit — anahtar gerektirmez, alıcı adresine gönderir.
 *      İlk gönderimde alıcıya bir kez etkinleştirme e-postası gelir.
 *
 * Hiçbir gizli anahtar istemciye gönderilmez. Sağlayıcı yapılandırılmadıysa
 * 503 döner; form bu durumda kullanıcıya e-posta/WhatsApp yedeğini sunar.
 */

type Env = {
  EMAILJS_SERVICE_ID?: string;
  EMAILJS_TEMPLATE_ID?: string;
  EMAILJS_PUBLIC_KEY?: string;
  EMAILJS_PRIVATE_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  WEB3FORMS_ACCESS_KEY?: string;
};

type Ctx = { request: Request; env: Env };

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

/* ── Basit bellek içi hız sınırı (izolat başına) ── */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
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
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/\r/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
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

function envelope(fields: Fields, toEmail: string) {
  return {
    subject: `Teklif / Bilgi Talebi — ${fields.subject || "Genel"}`,
    text: [
      `Ad Soyad : ${fields.name}`,
      `E-posta  : ${fields.email}`,
      `Telefon  : ${fields.phone || "-"}`,
      `Konu     : ${fields.subject || "-"}`,
      `Alıcı    : ${toEmail}`,
      "",
      "Mesaj:",
      fields.message,
      "",
      "— Bu ileti kukinsaat.com iletişim formundan gönderilmiştir.",
    ].join("\n"),
  };
}

async function sendViaEmailJs(env: Env, fields: Fields, toEmail: string) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      ...(env.EMAILJS_PRIVATE_KEY?.trim()
        ? { accessToken: env.EMAILJS_PRIVATE_KEY.trim() }
        : {}),
      // Yaygın şablon değişken adlarının tamamı gönderilir; EmailJS yalnızca
      // şablonda kullanılanları yerine koyar.
      template_params: {
        from_name: fields.name,
        name: fields.name,
        user_name: fields.name,
        reply_to: fields.email,
        email: fields.email,
        user_email: fields.email,
        from_email: fields.email,
        phone: fields.phone || "-",
        user_phone: fields.phone || "-",
        subject: fields.subject || "Genel",
        message: fields.message,
        to_email: toEmail,
      },
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 240);
    throw new Error(`EmailJS ${res.status}: ${detail}`);
  }
}

async function sendViaResend(env: Env, fields: Fields, toEmail: string) {
  const body = envelope(fields, toEmail);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL?.trim() || "Kuk Insaat Web <onboarding@resend.dev>",
      to: [toEmail],
      reply_to: fields.email,
      subject: body.subject,
      text: body.text,
    }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 240);
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
}

async function sendViaWeb3Forms(env: Env, fields: Fields) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_ACCESS_KEY,
      subject: `Teklif / Bilgi Talebi — ${fields.subject || "Genel"}`,
      name: fields.name,
      email: fields.email,
      phone: fields.phone || "-",
      message: fields.message,
      from_name: "kukinsaat.com",
    }),
  });
  const payload = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || payload?.success !== true) {
    throw new Error(`Web3Forms ${res.status}: ${payload?.message ?? "gönderilemedi"}`);
  }
}

/* ── Sağlayıcı 4: FormSubmit (anahtarsız yedek) ── */
async function sendViaFormSubmit(fields: Fields, toEmail: string) {
  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Teklif / Bilgi Talebi — ${fields.subject || "Genel"}`,
        _template: "table",
        _captcha: "false",
        _replyto: fields.email,
        name: fields.name,
        email: fields.email,
        phone: fields.phone || "-",
        subject: fields.subject || "Genel",
        message: fields.message,
        page: "kukinsaat.com/iletisim",
      }),
    },
  );
  const payload = (await res.json().catch(() => null)) as
    | { success?: boolean | string; message?: string }
    | null;
  const ok = payload?.success === true || payload?.success === "true";
  if (!res.ok || !ok) {
    throw new Error(`FormSubmit ${res.status}: ${payload?.message ?? "gönderilemedi"}`);
  }
}

export const onRequestOptions = async () => new Response(null, { status: 204, headers: CORS });

export const onRequestPost = async ({ request, env }: Ctx) => {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Bot tuzağı doldurulduysa sahte başarı dön.
  if (String(raw["bot-field"] ?? "").trim()) return json({ ok: true });

  const { fields, errors } = validate(raw);
  if (errors.length > 0) {
    return json({ ok: false, error: "validation_failed", fields: errors }, 422);
  }

  const toEmail = env.CONTACT_TO_EMAIL?.trim() || "umut@kukinsaat.com";
  const attempts: { provider: string; error: string }[] = [];

  const emailJsReady = Boolean(
    env.EMAILJS_SERVICE_ID?.trim() &&
      env.EMAILJS_TEMPLATE_ID?.trim() &&
      env.EMAILJS_PUBLIC_KEY?.trim(),
  );

  if (emailJsReady) {
    try {
      await sendViaEmailJs(env, fields, toEmail);
      return json({ ok: true, provider: "emailjs" });
    } catch (err) {
      attempts.push({ provider: "emailjs", error: String(err).slice(0, 300) });
    }
  }

  if (env.RESEND_API_KEY?.trim()) {
    try {
      await sendViaResend(env, fields, toEmail);
      return json({ ok: true, provider: "resend" });
    } catch (err) {
      attempts.push({ provider: "resend", error: String(err).slice(0, 300) });
    }
  }

  if (env.WEB3FORMS_ACCESS_KEY?.trim()) {
    try {
      await sendViaWeb3Forms(env, fields);
      return json({ ok: true, provider: "web3forms" });
    } catch (err) {
      attempts.push({ provider: "web3forms", error: String(err).slice(0, 300) });
    }
  }

  // Anahtarsız son çare: alıcı adresine doğrudan iletir.
  try {
    await sendViaFormSubmit(fields, toEmail);
    return json({ ok: true, provider: "formsubmit" });
  } catch (err) {
    attempts.push({ provider: "formsubmit", error: String(err).slice(0, 300) });
  }

  if (attempts.length > 0) {
    return json(
      {
        ok: false,
        error: "provider_failed",
        attempts,
        hint:
          "E-posta sağlayıcısı isteği reddetti. Anahtar/şablon değerlerini ve " +
          "EmailJS şablonunun var olduğunu kontrol edin.",
      },
      502,
    );
  }

  const configured = {
    EMAILJS_SERVICE_ID: Boolean(env.EMAILJS_SERVICE_ID?.trim()),
    EMAILJS_TEMPLATE_ID: Boolean(env.EMAILJS_TEMPLATE_ID?.trim()),
    EMAILJS_PUBLIC_KEY: Boolean(env.EMAILJS_PUBLIC_KEY?.trim()),
    EMAILJS_PRIVATE_KEY: Boolean(env.EMAILJS_PRIVATE_KEY?.trim()),
    RESEND_API_KEY: Boolean(env.RESEND_API_KEY?.trim()),
    WEB3FORMS_ACCESS_KEY: Boolean(env.WEB3FORMS_ACCESS_KEY?.trim()),
  };

  return json(
    {
      ok: false,
      error: "not_configured",
      configured,
      hint:
        "wrangler.jsonc [vars] veya Cloudflare panelindeki environment " +
        "variables bölümünden bir e-posta sağlayıcısı tanımlayın.",
    },
    503,
  );
};
