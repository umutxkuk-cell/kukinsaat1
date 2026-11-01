# Dağıtım Notları — Kuk İnşaat

Next.js 16 (App Router) + PostgreSQL (Drizzle ORM). Node.js 22 (`.nvmrc`).

## Kurulum

```bash
npm ci
npx drizzle-kit push --config drizzle.config.json
npm run build
npm run start        # PORT ortam değişkeni sunucu tarafından verilir
```

## Ortam değişkenleri

```env
DATABASE_URL=postgresql://kullanici:sifre@host:5432/veritabani  # zorunlu
CONTACT_TO_EMAIL=umut@kukinsaat.com
# E-posta (opsiyonel; yoksa talep yalnızca veritabanına kaydedilir)
RESEND_API_KEY=
CONTACT_FROM_EMAIL="Kuk İnşaat <web@kukinsaat.com>"
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
```

> **EmailJS notu:** Hesap "strict mode"da ise `EMAILJS_PRIVATE_KEY` olmadan
> yapılan istekler `403 API access in strict mode, but no Private Key was
> provided` döner. Bu yüzden private key tanımlı değilse EmailJS çağrısı
> denenmez; Resend tercih edilir. Her iki sağlayıcı da yoksa mesaj veritabanına
> kaydedilir ve kullanıcıya e-posta gitmediği açıkça söylenir.

## Form akışı

`POST /api/contact`:
1. Hız sınırı — IP başına 10 dakikada 5 istek (`429` + `Retry-After`).
2. Bot tuzağı (`bot-field` doluysa sahte başarı).
3. Sunucu tarafı doğrulama (`422` + alan listesi).
4. E-posta: EmailJS (private key varsa) → Resend.
5. Kayıt: her durumda `contact_submissions` tablosuna yazılır.
6. Yanıt: `delivered: true` (e-posta gitti) veya `delivered: false` (yalnızca
   kaydedildi). İkisi de başarısızsa `502 delivery_failed` — istemci e-posta /
   telefon yedeğine yönlendirir.

## Barındırma

Node.js çalıştırabilen herhangi bir ortam (VPS, Render, Railway, Docker, Vercel).
Cloudflare Pages'in statik `wrangler pages deploy` akışı bu proje için uygun
değildir: sunucu rotaları ve PostgreSQL bağlantısı gerekir.

## Doğrulama

```bash
npx next typegen
npx tsc --noEmit
npm run lint
npm run build
curl -s localhost:3000/api/health
```
