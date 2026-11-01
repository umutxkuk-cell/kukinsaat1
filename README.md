# Kuk İnşaat — kurumsal web sitesi

Kocaeli merkezli inşaat ve mühendislik firması Kuk İnşaat'ın sitesi.
Next.js (App Router) + PostgreSQL (Drizzle ORM).

## Çalıştırma

```bash
npm install
npx drizzle-kit push --config drizzle.config.json   # tabloları oluşturur
npm run dev                                          # http://localhost:3000
```

Üretim: `npm run build && npm run start`

## Sayfalar

`/` · `/kurumsal` · `/hizmetler` (+ 5 hizmet detayı) · `/projeler` · `/iletisim` · `/gizlilik`

## Uç noktalar

| Uç | Açıklama |
| --- | --- |
| `POST /api/contact` | İletişim formu. Hız sınırı (IP başına 10 dk / 5 istek) + sunucu doğrulaması. Talep **her koşulda** `contact_submissions` tablosuna yazılır; e-posta Resend veya EmailJS ile iletilir. |
| `GET /api/health` | Veritabanı ve e-posta zinciri durumu. Veritabanı erişilemezse 503 döner. |

## Görseller

Tüm illüstrasyonlar satır içi SVG'dir (`src/components/ui/SceneArt.tsx`) veya
`public/images/*.svg` altındadır. Uzak görsel isteği yoktur. Bölüm sahneleri
alacakaranlık dilini paylaşır (derin petrol, sıcak ışıklı cepheler, terracotta vurgu).

## Ortam değişkenleri

`.env.example` dosyasına bakın. `DATABASE_URL` zorunludur; e-posta sağlayıcısı
opsiyoneldir (yoksa talep yalnızca veritabanına kaydedilir ve bu durum
kullanıcıya dürüstçe bildirilir).

Ayrıntılı dağıtım notları: [DEPLOYMENT.md](./DEPLOYMENT.md)
