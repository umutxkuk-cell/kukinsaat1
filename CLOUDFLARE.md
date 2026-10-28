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
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Functions directory:** `functions` (varsayılan; dokunmayın)
   - **Build system version:** `v3` (Node 22)
3. **Save and Deploy** — her `push`'ta otomatik dağıtım + önizleme URL'i.

> **Panelde tek komut yeter.** `package.json` içindeki `prebuild` ve
> `postbuild` kancaları sayesinde `npm run build` sırasıyla şunu çalıştırır:
> `scripts/restore-assets.mjs` → `vite build` → `scripts/prerender.mjs`.
> Panel komutunu elle uzatmaya gerek yoktur.

### ⚠ Bilinen tuzak: `ENOENT: src/assets/hero.webp`

Depoda ikili dosyalar (`src/assets/hero.webp`, 4 adet `.woff2` font,
`public/apple-touch-icon.png`) commit edilmemiştir; yalnızca base64 yedekleri
(`scripts/assets-backup/*.b64`, `scripts/fonts/*.b64`) depodadır. Bu yüzden
Cloudflare'ın temiz derleme ortamında `vite build` şu hatayla kırılır:

```
[vite:asset] Could not load /opt/buildhome/repo/src/assets/hero.webp
  (imported by src/components/home/Hero.tsx): ENOENT: no such file or directory
```

Fontlar da aynı sebeple yalnızca uyarı verir ve sitede yüklenmez:

```
./assets/fonts/inter-latin.woff2 … didn't resolve at build time
```

**Kalıcı çözüm (ikisini birlikte yapın):**

```bash
# 1) prebuild/postbuild kancaları package.json'da tanımlı olsun
#    prebuild : node scripts/restore-assets.mjs
#    build    : vite build
#    postbuild: node scripts/prerender.mjs

# 2) İkili dosyaları bir kez üretip depoya commit edin (toplam ~272 KB)
node scripts/restore-assets.mjs
git add src/assets public/apple-touch-icon.png package.json
git commit -m "fix(build): restore binary assets and wire pre/post build hooks"
git push
```

İkililer depoda olduktan sonra `vite build` doğrudan da çalışır; `prebuild`
kancası ise dosyalar zaten mevcutsa `Zaten mevcut:` deyip atlar
(idempotent — üst üste çalıştırmak güvenlidir).

Depoda `.gitignore` yoktur; bu dosyalar yok sayılmadığı için `git add -f`
gerekmez.

### Seçenek B — Wrangler CLI

```bash
npm install
npm run build   # prebuild + vite build + postbuild(prerender) otomatik
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

## 1b) SEO: sitemap, canonical ve eski URL'ler

### Sitemap koddan üretilir

`sitemap.xml` elle tutulmaz. `scripts/prerender.mjs`, `src/lib/metadata.ts`
içindeki rota listesinden ve her rotanın `indexable` bayrağından sitemap'i
üretip `dist/sitemap.xml`'e yazar. Böylece sitemap, canonical ve robots meta
etiketi **aynı kaynaktan** beslenir ve birbirleriyle çelişemez.

- `noindex` taşıyan rotalar (`/gizlilik` ve portföy boşken `/projeler`)
  sitemap'e **girmez**. noindex bir URL'yi sitemap'e koymak Search Console'da
  "Hariç bırakıldı: 'noindex' etiketi" uyarısı üretir.
- Yeni hizmet/proje eklendiğinde sitemap kendiliğinden güncellenir.
- `public/sitemap.xml` yalnızca prerender'ın çalışmadığı bir derleme için
  yedektir ve aynı kurallara uyar.
- `lastmod` her derlemede değil, içerik değiştiğinde güncellenir
  (`scripts/prerender.mjs` → `SITE_LASTMOD`); sürekli değişen lastmod'a
  Google güvenmez.

### Sonda eğik çizgi kuralı (dizine eklenememenin asıl nedeni)

Cloudflare Pages, prerender edilmiş dizin rotalarını normalize eder:

```
/kurumsal   → 308 →  /kurumsal/   → 200
```

Bu yüzden canonical, og:url, JSON-LD ve sitemap **eğik çizgili** biçimi
kullanır. Eğik çizgisiz biçimde ısrar edilirse iki ayrı hata oluşur:

1. sitemap yönlendiren bir URL listeler → "Sitemap URL is a redirect"
2. canonical yönlendiren bir adresi gösterir → Google kendi canonical'ini
   seçer, sayfa "dizine eklenemedi / yinelenen" olarak işaretlenir

Tek üretici fonksiyon vardır: `src/lib/metadata.ts` → `canonicalUrl(path)`.
Hem prerender (ham HTML) hem `App.tsx` (SPA geçişleri) bunu kullanır; böylece
ham HTML ile rendered DOM aynı canonical'i taşır.

### Eski İngilizce URL'ler → 301

Site Next.js'ten taşındığı için Google'da hâlâ eski İngilizce yollar
taranıyor. `public/_redirects` bunları tek atlamada Türkçe karşılığına 301
ile taşır — 404 ekranına düşmezler, mevcut bağlantı değeri korunur:

| Eski | Yeni |
| --- | --- |
| `/projects`, `/projects/*`, `/portfolio` | `/projeler/` |
| `/services`, `/services/*`, `/service` | `/hizmetler/` |
| `/about`, `/about-us`, `/corporate`, `/hakkimizda` | `/kurumsal/` |
| `/contact`, `/contact-us` | `/iletisim/` |
| `/privacy`, `/privacy-policy`, `/kvkk` | `/gizlilik/` |
| `/home`, `/index.html` | `/` |
| `/hizmet`, `/proje` | `/hizmetler/`, `/projeler/` |

Hedefler eğik çizgili yazılır; aksi hâlde 301 + 308 olmak üzere **iki**
atlama oluşur ve tarama bütçesi boşa gider.

> Netlify tarzı `/* /index.html 200` yakalama kuralı bilinçli olarak
> **kullanılmaz**: Pages bunu sonsuz döngü sayıp yok sayar. Bilinmeyen yollar
> `dist/404.html` üzerinden gerçek **HTTP 404** döner — soft 404 değil.

### Dağıtım sonrası denetim — `scripts/seo-check.mjs`

Yukarıdaki kuralların tamamını tek komutla denetleyen bir betik vardır:

```bash
# Yerel (prerender'lı derlemeye karşı)
npx wrangler pages dev dist &
node scripts/seo-check.mjs http://localhost:8788

# Canlı
node scripts/seo-check.mjs https://kukinsaat.com
```

Betik 6 grupta ~63 denetim yapar ve tümü geçerse `0`, aksi hâlde `1` çıkış
kodu döner (CI'a bağlanabilir):

| Grup | Denetlenen |
| --- | --- |
| 1 | `robots.txt` → 200, `Sitemap:` satırı, `Disallow: /api/` |
| 2 | `sitemap.xml` → 200, mutlak https, tek alan adı, sonda eğik çizgi, mükerrer yok |
| 3 | Her sitemap URL'si → **yönlendirmesiz 200**, öz-referans canonical, `robots: index`, title uzunluğu + **benzersizliği**, description uzunluğu |
| 4 | `noindex` rotalar (`/gizlilik/`, portföy boşken `/projeler/`) sitemap **dışında** |
| 5 | Eski İngilizce yollar → **tek atlamada** 301 |
| 6 | Bilinmeyen yol → gerçek **404** (200 ise soft 404) |

> Betik `<loc>` değerlerini üretim alan adından okur ve yolu verilen köke
> bağlar; bu yüzden yerel sunucuya karşı çalıştırıldığında da canonical'ı
> doğru (üretim) URL ile karşılaştırır. Meta etiketleri çok satıra yayılmış
> olabilir ve Türkçe metinlerde kesme işareti geçer (`Kocaeli'de…`); çıkarıcı
> bunları tırnak türüne dikkat ederek okur.

### `/projeler` neden bazen sitemap'te yok?

`src/lib/metadata.ts` kuralı gereği `/projeler` yalnızca **portföy boşken**
`noindex` taşır; noindex bir URL'yi sitemap'e koymak Search Console'da
"Hariç bırakıldı: 'noindex' etiketi" uyarısı üretir. Sayfa ziyaretçiye her
zaman açıktır, menüde ve ana sayfadaki bağlantılarda durur — yalnızca sitemap
kaydı atlanır.

`src/data/projects.ts` dizisine ilk gerçek proje eklendiğinde:

- `/projeler` kendiliğinden `index` olur,
- proje detay rotaları (`/projeler/<slug>/`) prerender listesine girer,
- sitemap **otomatik** olarak 9 → 11+ URL'ye çıkar (elle düzenleme gerekmez).

Bu davranış örnek bir kayıtla doğrulanmıştır: kayıt eklenince
`✓ /projeler [index]`, `✓ /projeler/ornek-konut-projesi [index]` ve
`sitemap.xml [11 URL]` üretildi.

Search Console'da sitemap'i yeniden gönderdikten sonra **URL Denetimi** ile
tek tek "Dizine eklenmesini iste" demek, yeniden taramayı hızlandırır.
Dizine eklenme anlık değildir; birkaç gün ile birkaç hafta sürebilir.

## 2) İletişim formunun bağlanması

Form, `POST /api/contact` uç noktasına gönderir. Function, e-postaları
**EmailJS** (önerilen) veya **Resend** üzerinden `umut@kukinsaat.com` adresine
iletir. Anahtarlar yalnızca Cloudflare ortam değişkenlerinde durur; istemciye
hiçbir anahtar inmez.

### EmailJS kurulumu — mevcut durum

| Adım | Durum |
| --- | --- |
| Hesap + **Email Services** bağlantısı | ✅ tamam (`service_vbcjk3d`) |
| **Account → API Keys** — Public Key | ✅ tamam, `wrangler.toml`'da |
| **Email Templates** — şablon | ✅ tamam (`template_hitg8vm`), `wrangler.toml`'da |
| Uçtan uca gönderim | ✅ doğrulandı — `POST /api/contact` → `{"ok":true}` (HTTP 200) |
| **Account → Security** — Private Key | ⛔ **tek eksik adım:** panelde Secret olarak girilecek |

> Private Key dışındaki her şey depoda ve doğrulanmış durumda. Yerel
> `wrangler pages dev` testinde form → Function → EmailJS zinciri gerçek bir
> e-posta üretti; alıcı `CONTACT_TO_EMAIL` (`umut@kukinsaat.com`).
> Dağıtımda aynı davranışı görmek için Private Key'in panelde **Secret**
> olarak tanımlanması yeterli.

Şablonu oluştururken hangi alana ne yazacağınız — Subject, To Email, From
Name, Reply To ve Content (düz metin + markaya uygun HTML sürümü) — adım adım
**[`EMAILJS-SABLON.md`](EMAILJS-SABLON.md)** dosyasında hazır. Kopyalayıp
yapıştırmanız yeterli.

Şablonun içeriği keyfi değildir; `functions/api/contact.ts` EmailJS'e tam
olarak şu altı parametreyi gönderir ve şablondaki değişken adları bunlarla
**birebir** aynı olmalıdır:

```
{{from_name}}  {{reply_to}}  {{phone}}  {{subject}}  {{message}}  {{to_email}}
```

> `Reply To` alanını `{{reply_to}}` yapmayı atlamayın: gelen kutusunda
> "Yanıtla" dediğinizde ileti doğrudan müşterinin adresine gider.

### Ortam değişkenleri

Panelde: **Pages projesi → Settings → Environment variables** bölümüne
**Production** (ve isterseniz Preview) için ekleyin:

| Değişken | Durum | Nereden alınır |
| --- | --- | --- |
| `EMAILJS_SERVICE_ID` | ✅ `wrangler.toml`'da | Email Services |
| `EMAILJS_PUBLIC_KEY` | ✅ `wrangler.toml`'da | Account → General (API Keys) |
| `CONTACT_TO_EMAIL` | ✅ `wrangler.toml`'da | — |
| `EMAILJS_TEMPLATE_ID` | ⛔ **eksik** | Email Templates → Create New Template |
| `EMAILJS_PRIVATE_KEY` | ⛔ **panelde Secret** | Account → Security |

> 🔒 **Bu hesap "strict mode"da.** EmailJS'e doğrudan soruldu: Private Key
> gönderilmeden yapılan istek
> `403 — API access in strict mode, but no Private Key was provided`
> yanıtını veriyor. Yani bu hesap için Private Key **zorunludur**.
>
> Function private key'i koşullu gönderir (`accessToken`): doluysa eklenir,
> boşsa hiç gönderilmez — boş dizi göndermek EmailJS'te 400 hatası yaratır.
> Strict mode açık olduğu için sizde mutlaka dolu olmalı.
>
> ⛔ **Private Key asla depoya yazılmaz.** Bu depo halka açık; commit
> edilirse herkes sizin adınıza e-posta gönderebilir. Yalnızca iki yerden
> birinde durur: panelde **Secret** olarak, ya da
> `npx wrangler pages secret put EMAILJS_PRIVATE_KEY`. Yerel geliştirme için
> `.dev.vars` (`.gitignore`'da).

> ✅ **Kimlik bilgileri doğrulandı.** `service_id` + `user_id` + `accessToken`
> üçlüsüyle EmailJS'e yapılan gerçek istek
> `400 — The template ID not found` döndü. Bu yanıt kimlik doğrulamanın
> **başarılı** olduğunu kanıtlar: servis, public key ve private key geçerli.
> Eksik olan tek değer `EMAILJS_TEMPLATE_ID`.
>
> Uçtan uca test (`wrangler pages dev`): form → `/api/contact` → EmailJS
> zinciri çalışıyor; `/api/health` `"configured": true, "provider": "emailjs"`
> döndürüyor. Şablon kimliği girildiğinde başka bir ayar gerekmez.

> 📌 **`EMAILJS_SERVICE_ID` ve `CONTACT_TO_EMAIL` zaten depoda tanımlı.**
> Kök dizindeki `wrangler.toml` içinde `[vars]` bloğunda dururlar ve her
> dağıtımda Function'a otomatik enjekte edilirler — panelde ayrıca
> tanımlamanıza gerek yoktur. Bu iki değer gizli değildir (servis kimliği tek
> başına e-posta göndermeye yetmez). Panelde aynı adla değişken tanımlarsanız
> **panel önceliklidir**.
>
> Yani panelde girilmesi gereken yalnızca **iki** değer kaldı:
> `EMAILJS_TEMPLATE_ID` ve `EMAILJS_PUBLIC_KEY`.

> ⚠️ **Şablon değişken adları birebir uymalı.** Function yalnızca şu
> parametreleri gönderir: `from_name`, `reply_to`, `phone`, `subject`,
> `message`, `to_email`. Şablonda `{{name}}` gibi farklı bir ad kullanırsanız
> EmailJS hata vermez — alanı sessizce **boş** bırakır ve size içeriği eksik
> bir e-posta düşer. Şablonun **To Email** alanı `{{to_email}}` olmalıdır.

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
  **Dikkat:** bu yedek yol "çalışıyor gibi" görünür ama posta kutunuza mail
  düşmez — mailto kullanıcının kendi e-posta istemcisini açar. E-postanın size
  ulaşması için ortam değişkenleri zorunludur.
- Bot tuzağı (`bot-field`) dolu istekler sahte başarıyla sessizce atılır.
- IP başına 10 dakikada 5 deneme sınırı vardır (bellek içi; daha sıkı koruma
  için Cloudflare **Rate Limiting** binding'e yükseltilebilir). Aynı ofis/NAT
  arkasından çok kişi deneme yaparsa bu sınır erken dolabilir.

### Yanıt kodları (`wrangler pages dev` ile doğrulandı)

| Durum | Yanıt | İstemci davranışı |
| --- | --- | --- |
| `200` | `{"ok":true}` | "Talebiniz alındı." ekranı |
| `200` | `{"ok":true}` (bot-field doluyken) | Bot sessizce savuşturulur |
| `400` | `{"ok":false,"error":"invalid_json"}` | mailto yedeği |
| `422` | `{"ok":false,"error":"validation_failed","fields":[...]}` | istemci zaten göndermeden engeller |
| `429` | `{"ok":false,"error":"rate_limited"}` | mailto yedeği |
| `502` | `{"ok":false,"error":"provider_failed","detail":"..."}` | mailto yedeği |
| `503` | `{"ok":false,"error":"not_configured"}` | mailto yedeği |
| `204` | (OPTIONS preflight, `Access-Control-Allow-Origin: *`) | — |

`502` yanıtındaki `detail` alanı sağlayıcının ham hatasını taşır; anahtar
sorunlarını teşhis etmek için ilk bakılacak yer burasıdır. Örnek (sahte
Public Key ile): `EmailJS 400: The Public Key is invalid.`

### Hızlı teşhis komutları

`GET /api/health` artık formun yapılandırma durumunu da raporlar — hangi
değişkenin eksik olduğunu görmek için ilk bakılacak yer burasıdır. Yanıt
yalnızca Boolean değer içerir, hiçbir anahtarın **değeri** dönmez.

```bash
# Function ayakta mı + form yapılandırılmış mı?
curl https://<proje>.pages.dev/api/health
# → {"ok":true,"service":"kukinsaat-web","time":"...",
#    "contact":{"configured":false,"provider":null,
#               "missing":["EMAILJS_TEMPLATE_ID","EMAILJS_PUBLIC_KEY"],
#               "checks":{...},"behavior":"... mailto yedeğine düşüyor ..."}}

# Sağlayıcı yapılandırılmış mı? (503 = değişkenler eksik)
curl -X POST https://<proje>.pages.dev/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Kullanici","email":"t@example.com","message":"On karakterden uzun test mesaji."}'
# → {"ok":true}                          e-posta düştü
# → {"ok":false,"error":"not_configured"} panelde değişken yok
# → {"ok":false,"error":"provider_failed","detail":"..."} anahtar/şablon hatalı
```

Statik sayfalar `_routes.json` sayesinde Function çağırmaz; yalnızca `/api/*`
istekleri kota tüketir. Panelde **Functions → Invocations** sayacından
doğrulanabilir.

## 2b) Çerez onay barı — davranış ve test

Bar istemci tarafında, açılış perdesi (`Intro`) kalktıktan sonra gelir;
prerender edilmiş HTML'de yer almaz (CLS oluşturmaz). Zamanlama: perde
oynuyorsa ~2,6 sn, perde atlandıysa ~1 sn, her durumda en geç 3,4 sn.

Karar `localStorage`'da **zaman damgasıyla** saklanır ve **180 gün** geçerlidir:

```json
{"value":"accepted","at":1792355040000}
```

| Durum | Davranış |
| --- | --- |
| İlk ziyaret | Bar gösterilir |
| Karar verilmiş, süre dolmamış | Bar gösterilmez; sol altta **Çerez Tercihleri** rozeti |
| Süre dolmuş (180 gün) | Bar yeniden gösterilir — onay periyodik teyit edilir |
| Eski biçim (düz metin `accepted`) | Süresi dolmuş sayılır, bar bir kez daha gösterilir |
| Footer → **Çerez Tercihleri** | Bar her zaman yeniden açılır |

### Test etmek için

```
https://kukinsaat.com/?consent=reset
```

`?consent=reset` saklı kararı siler, adres çubuğundan kendini temizler ve barı
ilk ziyaretteki gibi gösterir. Tarayıcı konsolundan da sıfırlanabilir:

```js
localStorage.removeItem("kuk-cookie-consent"); location.reload();
```

> Rozet mineral açık zeminli (`bg-bg`) ve terracotta ikonludur: hem koyu
> footer/hero üzerinde hem açık gövde bölümlerinde okunur. Eski sürümdeki koyu
> grafit rozet koyu footer ile birleşip görünmez oluyordu.

## 3) Yerel test (Functions ile)

```bash
npm run build                    # prebuild + vite build + postbuild(prerender)
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
