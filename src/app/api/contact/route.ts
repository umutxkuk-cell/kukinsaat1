import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ── Hız sınırı: IP başına 10 dakikada 5 istek ──
   İki katman: süreç içi bellek (hızlı) + veritabanı sayımı (kalıcı).
   Amaç, form üzerinden toplu spam ve e-posta bombardımanını engellemek. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const memoryHits = new Map<string, number[]>();

function memoryLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (memoryHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    memoryHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  memoryHits.set(ip, recent);
  if (memoryHits.size > 2000) {
    const oldest = memoryHits.keys().next().value;
    if (oldest !== undefined) memoryHits.delete(oldest);
  }
  return false;
}

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

async function sendViaEmailJs(fields: Fields, toEmail: string) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || "service_vbcjk3d";
  const templateId = process.env.EMAILJS_TEMPLATE_ID || "template_hitg8vm";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || "245gQkDPKWRYbzMAe";
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      ...(privateKey?.trim() ? { accessToken: privateKey.trim() } : {}),
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
        subject: fields.subject || "Genel Teklif / Bilgi Talebi",
        message: fields.message,
        to_email: toEmail,
      },
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new Error(`EmailJS ${res.status}: ${detail}`);
  }
}

async function sendViaResend(fields: Fields, toEmail: string, apiKey: string) {
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

  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Kuk İnşaat <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
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

/**
 * Form yalnızca kendi origin'imizden gönderilir; bu yüzden joker CORS
 * başlığı verilmez. Tarayıcılar çapraz origin POST'u engeller, sunucu tarafı
 * hız sınırı ise doğrudan istekleri sınırlar.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}

export async function POST(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = (forwarded.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();

  if (memoryLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot spam protection
  if (String(raw["bot-field"] ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const { fields, errors } = validate(raw);
  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", fields: errors },
      { status: 422 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "umut@kukinsaat.com";
  const emailJsReady = Boolean(
    (process.env.EMAILJS_SERVICE_ID || "service_vbcjk3d") &&
      (process.env.EMAILJS_TEMPLATE_ID || "template_hitg8vm") &&
      (process.env.EMAILJS_PUBLIC_KEY || "245gQkDPKWRYbzMAe"),
  );
  const resendApiKey = process.env.RESEND_API_KEY;

  let emailSent = false;
  let emailProvider = "none";
  let lastError = "";

  // 1. Try sending via EmailJS
  if (emailJsReady) {
    try {
      await sendViaEmailJs(fields, toEmail);
      emailSent = true;
      emailProvider = "emailjs";
    } catch (err) {
      lastError = `EmailJS error: ${String(err)}`;
      // If EmailJS has strict mode without private key or error, attempt Resend fallback if available
      if (resendApiKey) {
        try {
          await sendViaResend(fields, toEmail, resendApiKey);
          emailSent = true;
          emailProvider = "resend";
        } catch (rErr) {
          lastError += ` | Resend error: ${String(rErr)}`;
        }
      }
    }
  } else if (resendApiKey) {
    try {
      await sendViaResend(fields, toEmail, resendApiKey);
      emailSent = true;
      emailProvider = "resend";
    } catch (rErr) {
      lastError = `Resend error: ${String(rErr)}`;
    }
  }

  // 2. Talep her koşulda veritabanına yazılır (e-posta gitmese de kaybolmaz).
  let stored = false;
  try {
    await db.insert(contactSubmissions).values({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      subject: fields.subject,
      message: fields.message,
      status: emailSent ? "sent" : "recorded",
      emailProvider,
      emailSent,
      errorDetails: lastError || null,
      ipAddress: ip.slice(0, 64),
    });
    stored = true;
  } catch (dbErr) {
    console.error("contact: veritabanına yazılamadı:", dbErr);
  }

  if (emailSent) {
    return NextResponse.json({ ok: true, delivered: true, provider: emailProvider });
  }

  if (stored) {
    // E-posta iletilemedi ama talep kaydedildi: kullanıcıya yalan söylenmez,
    // mesajın sistemde olduğu ve ekip tarafından görüleceği bildirilir.
    return NextResponse.json({
      ok: true,
      delivered: false,
      provider: "database",
      message: "Mesajınız kaydedildi; ekibimiz en kısa sürede dönüş yapacak.",
    });
  }

  // Ne e-posta ne veritabanı: gerçek bir arıza var, 502 döndürülür ve
  // istemci e-posta/telefon yedeğine yönlendirilir.
  return NextResponse.json(
    { ok: false, error: "delivery_failed" },
    { status: 502 },
  );
}
