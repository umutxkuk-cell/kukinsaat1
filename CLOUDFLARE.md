# Kuk İnşaat — Cloudflare Pages Dağıtım Rehberi

Site, Cloudflare Pages'e **statik SPA + Pages Functions** mimarisiyle tam uyumlu
hâle getirilmiştir:

| Katman | Konum | Görev |
| --- | --- | --- |
| Statik site | `dist/` (Vite çıktısı) | Tek dosyalık `index.html` + `public/` varlıkları |
| SEO ön üretimi | `dist/<rota>/index.html` | Her rota için title/canonical/OG/JSON-LD'yi **ham HTML'e** basan prerender çıktısı (`scripts/prerender.mjs`) — arama motorları ve sosyal botlar JS çalıştırmadan doğru etiketleri görür |
| 404 fallback | `dist/404.html` | Bilinmeyen yollar HTTP 404 kodu + Türkçe 404 ekranıyla yanıtlanır (prerender bunu otomatik üretir) |
| Function yönlendirme | `public/_routes.json` | Yalnızca `/api/*` istekleri Function çağırır; statik istekler **ücretsiz ve sınırsız** kalır |
| Güvenlik/önbellek | `public/_headers` | `nosniff`, `X-Frame-Options`, varlık önbellek süreleri |
| İletişim formu | `functions/api/contact.ts` | `POST /api/contact` — doğrulama + bot tuzağı + hız sınırı + e-posta iletimi |
| Sağlık kontrolü | `functions/api/health.ts` | `GET /api/health` — uptime izleme için |

## 1) Dağıtım

### Seçenek A — GitHub entegrasyonu (önerilen)

1. [Cloudflare paneli](https://dash.cloudflare.com) → **Workers & Pages** →
   **Create** → **Pages** → **Connect to Git** → bu depoyu seçin.
2. Ayarlar:
   - **Framework preset:** `Vite` (otomatik algılanır)
   - **Build command:** `npm run build && node scripts/prerender.mjs`
   - **Build output directory:** `dist`
   - **Functions directory:** `functions` (varsayılan; dokunmayın)
3. **Save and Deploy** — her `push`'ta otomatik dağıtım + önizleme URL'i.

### Seçenek B — Wrangler CLI

```bash
npm install
npm run build && node scripts/prerender.mjs
npx wrangler pages project create kukinsaat --production-branch main
npx wrangler pages deploy dist --project-name kukinsaat
```

## SEO ön üretimi (prerender) — nasıl çalışır?

`scripts/prerender.mjs`, Vite buildinden sonra `dist/index.html` şablonunu
kullanarak 11 rotanın her biri için ayrı statik HTML üretir. Her dosyada:

- rota bazlı `<title>`, meta description, robots (`/gizlilik` ve boşken
  `/projeler` → `noindex, follow`)
- `<link rel="canonical">` — ham HTML ile rendered DOM'da **özdeş**
  (Google'ın Aralık 2025 JS-SEO canonical rehberine uygun)
- Open Graph + Twitter kartları (hizmet sayfalarında hizmet görseliyle)
- BreadcrumbList JSON-LD (hizmet detaylarında Service şemasını sayfa
  bileşeni kendisi render eder; mükerrer işaretleme yoktur)
- React ile önceden render edilmiş sayfa içeriği (tarayıcı JS'i devralana
  kadar metin görünür — FCP hızlanır)

Cloudflare Pages `/kurumsal` isteğinde önce `dist/kurumsal/index.html`
statik dosyasını sunar; `_routes.json` yalnızca `/api/*` yolunu Functions'a
gönderdiğinden çakışma olmaz. Bilinmeyen yollar `_redirects` ile SPA'ya düşer.

> **İkili varlıklar silinirse** (fontlar, hero.webp, apple-touch-icon):
> `node scripts/restore-assets.mjs` komutu `scripts/fonts` ve
> `scripts/assets-backup` içindeki base64 yedeklerden dosyaları yeniden üretir.

## 2) İletişim formunun bağlanması

Form, `POST /api/contact` uç noktasına gönderir. Function, e-postaları
**EmailJS** (önerilen) veya **Resend** üzerinden `umut@kukinsaat.com` adresine
iletir. Anahtarlar yalnızca Cloudflare ortam değişkenlerinde durur; istemciye
hiçbir anahtar inmez.

### EmailJS kurulumu (5 dakika, ücretsiz plân ayda 200 e-posta)

1. [emailjs.com](https://www.emailjs.com)'da hesap açın.
2. **Email Services → Add New Service** ile posta kutunuzu bağlayın
   (Gmail/Outlook/SMTP). `Service ID` değerini not edin.
3. **Email Templates → Create New Template** ile şu gövdeyi oluşturun:

   ```text
   Yeni iletişim formu talebi (kukinsaat.com)

   Ad Soyad : {{from_name}}
   E-posta  : {{reply_to}}
   Telefon  : {{phone}}
   Konu     : {{subject}}

   Mesaj:
   {{message}}
   ```

   `To Email` alanına `{{to_email}}` yazın (Function bu değişkeni doldurur).
   `Template ID` değerini not edin.
4. **Account → API Keys** sayfasından **Public Key** ve **Private Key** alın.

### Ortam değişkenleri

Panelde: **Pages projesi → Settings → Environment variables** bölümüne
**Production** (ve isterseniz Preview) için ekleyin:

| Değişken | Açıklama |
| --- | --- |
| `EMAILJS_SERVICE_ID` | EmailJS servis kimliği |
| `EMAILJS_TEMPLATE_ID` | EmailJS şablon kimliği |
| `EMAILJS_PUBLIC_KEY` | EmailJS Public Key |
| `EMAILJS_PRIVATE_KEY` | EmailJS Private Key (gizli) |
| `CONTACT_TO_EMAIL` | Alıcı — `umut@kukinsaat.com` |

Alternatif olarak **Resend** kullanmak isterseniz yalnızca
`RESEND_API_KEY` (+ isteğe bağlı `CONTACT_FROM_EMAIL`) eklemeniz yeterlidir;
EmailJS değişkenleri boşsa Function otomatik olarak Resend'e geçer.

> Değişkenleri ekledikten sonra **yeni bir dağıtım tetikleyin**
> (Settings → Builds → Retry deployment); Function değişkenleri dağıtımda okur.
>
> ⚠️ Değişkenleri hem **Production** hem **Preview** ortamına ekleyin —
> önizleme dağıtımlarında yoksa form orada mailto yedeğine düşer.

### Davranış

- Başarılı gönderimde kullanıcıya **"Talebiniz alındı."** ekranı gösterilir.
- Function yapılandırılmamışsa (503) veya ağ hatası varsa form, eski davranışa
  — kullanıcının e-posta istemcisini açan **mailto yedek yoluna** — düşer.
  Yani form, değişkenler girilmeden önce de bozulmadan çalışır.
- Bot tuzağı (`bot-field`) dolu istekler sahte başarıyla sessizce atılır.
- IP başına 10 dakikada 5 deneme sınırı vardır (bellek içi; daha sıkı koruma
  için Cloudflare **Rate Limiting** binding'e yükseltilebilir).

## 3) Yerel test (Functions ile)

```bash
npm run build && node scripts/prerender.mjs
cp .dev.vars.example .dev.vars   # anahtarları doldurun
npx wrangler pages dev dist
# http://localhost:8788 → /iletisim formunu deneyin
# http://localhost:8788/api/health → {"ok":true,...}
```

Bu komut, Cloudflare'ın üretimdeki `workerd` çalışma zamanının aynısını
yerelde çalıştırır — routing, `_routes.json`, `_headers` ve Functions
davranışı birebirdir. (Eski bir wrangler sürümü "compatibility date" hatası
verirse `--compatibility-date=2026-05-03` ekleyin veya wrangler'ı güncelleyin.)

### Netlify'den geçiş notu

- Netlify Forms'a ait `__forms.html` kaldırıldı; form artık **Cloudflare
  Pages Function**'a (`/api/contact`) gönderiyor.
- Netlify tarzı `/* /index.html 200` SPA yakalama kuralı Cloudflare'da
  **sonsuz döngü** sayılıp yok sayılır; bu yüzden kullanılmıyor. Bunun
  yerine tüm rotalar prerender'lı + `404.html` fallback var (doğrulanmış).
- Geçiş: Cloudflare panelinde özel alan adını (`kukinsaat.com`) bağladıktan
  sonra DNS'teki Netlify kaydını Cloudflare'a çevirin. Google Search Console
  doğrulama dosyası (`googledc….html`) ve meta etiketi kodda durduğu için
  doğrulama kesintisiz sürer.

## 4) Özel alan adı (kukinsaat.com)

**Pages projesi → Custom domains → Set up a custom domain** → `kukinsaat.com`.
Alan adı Cloudflare'de ise DNS ve SSL otomatik yapılandırılır. `index.html`
içindeki OG/canonical meta etiketleri ve `public/sitemap.xml` zaten
`https://kukinsaat.com` için hazırdır.

## 5) Doğrulama kontrol listesi

- [ ] `https://<proje>.pages.dev/` açılıyor (ana sayfa + intro animasyonu)
- [ ] `https://<proje>.pages.dev/kurumsal` doğrudan açılıyor (SPA fallback)
- [ ] Ham HTML kontrolü: `curl -s https://<proje>.pages.dev/kurumsal | grep canonical`
      → `<link rel="canonical" href="https://kukinsaat.com/kurumsal" />`
      (prerender çalışıyor demektir)
- [ ] `https://<proje>.pages.dev/api/health` → `{"ok":true,...}`
- [ ] `/iletisim` formu doldurulunca **"Talebiniz alındı."** görünüyor ve
      `umut@kukinsaat.com` adresine e-posta düşüyor
- [ ] Panelde **Functions → Invocations**: yalnızca `/api/*` istekleri sayılıyor
      (statik sayfalar Function çağrısı tüketmiyor)
