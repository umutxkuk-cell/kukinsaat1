/**
 * Cloudflare Pages Function — GET /api/health
 * Uptime izleme ve dağıtım doğrulaması için uç nokta
 * (orijinal Next.js sürümündeki /api/health karşılığı).
 */
export const onRequestGet = async () =>
  new Response(
    JSON.stringify({
      ok: true,
      service: "kukinsaat-web",
      time: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
