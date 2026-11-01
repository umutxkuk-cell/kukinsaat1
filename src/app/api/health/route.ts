import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/health — dağıtım sonrası kontrol ucu.
 *
 * Veritabanı erişilemezse 503 döner; böylece izleme sistemleri gerçek
 * kesintiyi "sağlıklı" olarak raporlamaz. E-posta zincirinin durumu
 * anahtar değerleri sızdırılmadan özetlenir.
 */
export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await db.execute(sql`SELECT 1`);
    dbOk = true;
  } catch (error) {
    dbError = error instanceof Error ? error.message.slice(0, 160) : "unknown_error";
  }

  const emailjsConfigured = Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_TEMPLATE_ID &&
      process.env.EMAILJS_PUBLIC_KEY,
  );
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  return NextResponse.json(
    {
      ok: dbOk,
      service: "kukinsaat-web",
      status: dbOk ? "healthy" : "degraded",
      database: dbOk ? "connected" : "error",
      ...(dbError ? { databaseError: dbError } : {}),
      time: new Date().toISOString(),
      contact: {
        configured: emailjsConfigured || resendConfigured,
        provider: emailjsConfigured ? "emailjs" : resendConfigured ? "resend" : "database_only",
        // Mesaj her koşulda veritabanına yazılır; e-posta yapılandırılmasa da
        // talep kaybolmaz.
        fallback: "database",
      },
    },
    {
      status: dbOk ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
