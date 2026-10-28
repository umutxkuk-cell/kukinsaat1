/**
 * Cloudflare Pages Function — GET /api/health
 *
 * Uptime izleme, dağıtım doğrulama ve iletişim formu yapılandırma teşhisi.
 *
 * `contact` bloğu yalnızca Boolean değer ve alıcı adresini döndürür — hiçbir
 * ortam değişkeninin DEĞERİ (anahtarlar, kimlikler) yanıtta yer almaz.
 * Böylece bu uç nokta herkese açık kalabilir.
 */

type Env = Record<string, string | undefined>;

type Ctx = { env?: Env };

export const onRequestGet = async ({ env }: Ctx) => {
  const e: Env = env ?? {};
  const has = (k: string) => Boolean(e[k]?.trim());

  const checks = {
    EMAILJS_SERVICE_ID: has("EMAILJS_SERVICE_ID"),
    EMAILJS_TEMPLATE_ID: has("EMAILJS_TEMPLATE_ID"),
    EMAILJS_PUBLIC_KEY: has("EMAILJS_PUBLIC_KEY"),
    EMAILJS_PRIVATE_KEY: has("EMAILJS_PRIVATE_KEY"),
    RESEND_API_KEY: has("RESEND_API_KEY"),
  };

  // contact.ts ile aynı mantık: EmailJS için üç zorunlu değişken yeterli,
  // private key isteğe bağlı (varsa accessToken olarak gönderilir).
  const emailJsReady =
    checks.EMAILJS_SERVICE_ID && checks.EMAILJS_TEMPLATE_ID && checks.EMAILJS_PUBLIC_KEY;

  const provider = emailJsReady ? "emailjs" : checks.RESEND_API_KEY ? "resend" : null;

  const missing = provider
    ? []
    : (Object.keys(checks) as (keyof typeof checks)[])
        .filter((k) => !checks[k])
        .filter((k) => k !== "EMAILJS_PRIVATE_KEY" && k !== "RESEND_API_KEY");

  return new Response(
    JSON.stringify({
      ok: true,
      service: "kukinsaat-web",
      time: new Date().toISOString(),
      contact: {
        configured: Boolean(provider),
        provider,
        to: e.CONTACT_TO_EMAIL?.trim() || "umut@kukinsaat.com",
        missing,
        checks,
        // Form bu durumda ne yapar — paneldeki kurulumu doğrulamak için.
        behavior: provider
          ? "Mesajlar sunucu tarafında e-posta ile iletiliyor."
          : "Sağlayıcı yapılandırılmadığı için form mailto yedeğine düşüyor (size e-posta gelmez).",
      },
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
};
