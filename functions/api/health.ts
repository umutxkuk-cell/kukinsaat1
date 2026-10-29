/**
 * GET /api/health — dağıtım ve e-posta yapılandırması teşhisi.
 * Hiçbir anahtarın değeri döndürülmez; yalnızca Boolean durum bilgisi verilir.
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
    WEB3FORMS_ACCESS_KEY: has("WEB3FORMS_ACCESS_KEY"),
  };

  const emailJsReady =
    checks.EMAILJS_SERVICE_ID && checks.EMAILJS_TEMPLATE_ID && checks.EMAILJS_PUBLIC_KEY;

  const provider = emailJsReady
    ? "emailjs"
    : checks.RESEND_API_KEY
      ? "resend"
      : checks.WEB3FORMS_ACCESS_KEY
        ? "web3forms"
        : "formsubmit";

  const missing: string[] = [];
  if (!emailJsReady && !checks.RESEND_API_KEY && !checks.WEB3FORMS_ACCESS_KEY) {
    if (!checks.EMAILJS_SERVICE_ID) missing.push("EMAILJS_SERVICE_ID");
    if (!checks.EMAILJS_TEMPLATE_ID) missing.push("EMAILJS_TEMPLATE_ID");
    if (!checks.EMAILJS_PUBLIC_KEY) missing.push("EMAILJS_PUBLIC_KEY");
    missing.push("RESEND_API_KEY veya WEB3FORMS_ACCESS_KEY");
  }

  return new Response(
    JSON.stringify({
      ok: true,
      service: "kukinsaat-web",
      time: new Date().toISOString(),
      contact: {
        configured: provider !== null,
        provider,
        recipient: e.CONTACT_TO_EMAIL?.trim() || "umut@kukinsaat.com",
        missing,
        checks,
        // EmailJS "strict mode" açıkken private key zorunludur. Bu yalnızca
        // teşhis bilgisidir; anahtarın değeri hiçbir zaman dönmez.
        strictModeRisk: emailJsReady && !checks.EMAILJS_PRIVATE_KEY,
        fallback: "formsubmit",
        note:
          emailJsReady && !checks.EMAILJS_PRIVATE_KEY
            ? "EmailJS strict mode nedeniyle private key gerekebilir; bu durumda form anahtarsız FormSubmit yedeğini, ardından e-posta/WhatsApp seçeneklerini kullanır."
            : "Form, yapılandırılmış sağlayıcı üzerinden teslim edilir.",
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};
