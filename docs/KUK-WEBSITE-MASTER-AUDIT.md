# KUK İNŞAAT — MASTER WEBSITE AUDIT

**Denetim tarihi:** 4 Kasım (oturum günü)
**Kapsam:** `kukinsaat.com` (canlı) + yerel çalışma alanı (`src/`, `public/`, `dist/`)
**Denetim türü:** Salt okunur. Bu oturumda hiçbir kaynak dosya, tasarım veya bağımlılık değiştirilmemiştir.
**Çıktı:** Bu rapor dosyası.

---

## 0. DENETİMİN SINIRLARI VE YÖNTEM DÜRÜSTLÜĞÜ

Raporun doğru okunması için neyin ölçüldüğü, neyin ölçülemediği baştan belirtilmelidir.

### 0.1 Doğrulanabilenler

| Yöntem | Kapsam |
|---|---|
| Statik kaynak analizi | `src/` altındaki tüm bileşen, veri ve stil dosyaları; `index.html`; `public/` yapılandırmaları |
| Üretim derlemesi | `npm run build` bir kez çalıştırıldı; `dist/` çıktısı incelendi |
| HTTP durum sondası | Canlı sitede 8 varlık + 6 rota için yalnızca `GET` durum kodu ve ham HTML başlığı |
| Piksel düzeyinde render | Hero SVG sahneleri `resvg` ile rasterleştirilip örneklenerek katman/konum doğrulaması |
| Kontrast hesabı | Bildirilen renk değerlerinden WCAG 2.2 bağıl parlaklık formülüyle hesaplandı |
| Bağımlılık/ölü kod taraması | İçe aktarma grafiği üzerinde referans sayımı |

### 0.2 Doğrulanamayanlar — bu raporda puan üretilmemiştir

Aşağıdaki alanlar **ölçülmemiştir**. Hiçbiri için tahmini skor, sahte Lighthouse puanı veya uydurma metrik verilmemiştir:

- **Lighthouse / PageSpeed Insights** — çalıştırılamadı. Lab puanı yok.
- **Core Web Vitals alan verisi (LCP, INP, CLS)** — CrUX veya RUM erişimi yok. Gerçek ölçüm yok.
- **Gerçek tarayıcıda görsel render** — ortamda headless tarayıcı çalışmıyor (eksik sistem kütüphaneleri). Responsive kırılımlar **görsel olarak doğrulanmadı**; yalnızca kaynak kodundaki Tailwind kırılım sınıfları üzerinden statik çıkarım yapıldı.
- **Konsol/runtime hataları, hydration, bellek sızıntısı** — çalıştırma ortamı olmadığı için gözlemlenemedi.
- **Klavye ile gerçek gezinme ve ekran okuyucu davranışı** — statik analizle işaretlendi, davranışsal test yapılmadı.
- **Form gönderimi uçtan uca** — canlı `/api/contact` uç noktasına **bilinçli olarak POST yapılmadı** (üretim sistemine veri göndermeme kuralı). Yalnızca `GET` ile `405` dönmesi canlı olduğu kanıtı olarak kaydedildi.
- **GA4 / Search Console performansı** — erişim yok. Trafik, dizin kapsamı veya tıklama verisi hakkında hiçbir çıkarım yapılmamıştır.

Bulgularda "doğrulanamadı" ifadesi geçen her madde, kanıt yetersizliği nedeniyle hüküm verilmemiş alandır.

### 0.3 Denetimin en önemli yapısal tespiti

**Yerel çalışma alanı, üretim projesinin eksik bir kopyasıdır.** Bu tek başına birçok bulgunun kök nedenidir ve rapor boyunca "ortam farkı" olarak işaretlenmiştir.

Çalışma alanında **bulunmayan** üretim dosyaları:

| Eksik | Sonucu |
|---|---|
| `scripts/` (prerender.mjs, restore-assets.mjs, seo-check.mjs, shots.mjs, smoke-consent.mjs, prerender-entry.tsx, `fonts/*.b64`, `assets-backup/`) | Prerender yok, font geri yükleme yok, SEO denetim betiği yok |
| `worker/index.ts`, `wrangler.toml` | `/api/contact` ve `/api/health` yerel derlemede yok |
| `DEPLOYMENT.md` | Dağıtım bilgisi yok |
| Tüm `.jpg` görseller (`hero-architecture.jpg`, `abstract-*.jpg`) | Kurumsal sayfasında 2 kırık görsel |
| `apple-touch-icon.png` | Yerel derlemede 404 |

Bu eksiklerin **üretimdeki gerçek durumu** ayrıca sondalanmış ve her bulguda "canlıda var / canlıda da yok" şeklinde ayrılmıştır.

---

## 1. YÖNETİCİ ÖZETİ

KUK İnşaat'ın web sitesi, mimari olarak düşünceli kurulmuş, marka dili tutarlı, erişilebilirlik ve KVKK olgunluğu ortalama bir kurumsal sitenin belirgin biçimde üzerinde olan bir projedir. Kontrast oranlarının CSS içinde yorum olarak belgelenmesi ve bağımsız hesabımın bu değerleri birebir doğrulaması, tasarımın **ölçülerek** yapıldığını gösteriyor. Çerez onayı, Consent Mode v2'yi reddedilmiş varsayılanlarla ve etiketten önce yazarak uyguluyor; bu, Türkiye'deki kurumsal sitelerin çok azında görülen doğru bir kurulumdur. Boş proje portföyü için uydurma referans üretmek yerine dürüst bir "hazırlanıyor" durumu ve `noindex` tercih edilmesi etik açıdan takdire değer.

Buna karşılık denetim, **ziyaretçinin gördüğü çıktıyı doğrudan bozan iki kritik üretim kusuru** ortaya çıkarmıştır:

1. **Canlı sitede dört font dosyasının tamamı HTTP 404 dönüyor.** Site, tipografik kimliğini (Manrope başlık + Inter gövde) hiçbir ziyaretçiye gösteremiyor; tüm site `system-ui` yedeğiyle render ediliyor. `index.html` içindeki "fontlar Vite tarafından CSS içine gömülür" yorumu gerçeği yansıtmıyor — CSS dört dosyayı da harici `url(/fonts/…)` olarak referanslıyor. "Premium" algısının en güçlü taşıyıcısı olan tipografi, şu anda üretimde fiilen devre dışı.

2. **Varsayılan Open Graph görseli (`hero-building-sketch-og.jpg`) canlıda 404.** Ana sayfa kendi `og:image` değerini ayrıca bildirdiği için kurtuluyor; ancak `metadata.ts` içindeki `DEFAULT_OG_IMAGE`'a düşen **tüm rotalar** (kurumsal, hizmetler, projeler, iletişim, gizlilik, 404) sosyal paylaşımlarda görselsiz görünüyor. Ek olarak hizmet detay sayfalarının OG görseli SVG ve imgix tarzı kırpma parametreleriyle süslenmiş; sosyal tarayıcıların çoğu SVG OG görselini render etmez.

Üçüncü yapısal sorun, bakım maliyeti ve tip güvenliği açısından önemlidir: depoda **üç ayrı sayfa ağacı** yaşıyor (`src/pages/` canlı, `src/views/` + `src/app/` ölü) ve `tsconfig.json` bu ölü ağaçları açıkça hariç tuttuğu için **~25 dosya hiç tip denetiminden geçmiyor**. İki ağaç çoktan birbirinden ayrışmış durumda — `views/Iletisim.tsx` (9 KB), canlıdaki `pages/Iletisim.tsx`'ten (4,5 KB) belirgin biçimde daha zengin ve içinde yayımlanmamış gerçek iş var.

**Önceliklendirilmiş özet:** P0 = 2 (font 404, eksik üretim hattı), P1 = 4, P2 = 8, P3 = 6.

---

## 2. GENEL SİTE KALİTE DEĞERLENDİRMESİ

| Boyut | Değerlendirme |
|---|---|
| Mimari olgunluk | Yüksek. Tek kaynak metadata (`lib/metadata.ts`), rota bazlı JSON-LD, canonical politikası bilinçli gerekçelendirilmiş. |
| Marka tutarlılığı | Orta-yüksek. Mineral palet ve mühendislik mavisi disiplinli; terracotta referans marka paletinde yok (bkz. §4.3). |
| Görsel üretim kalitesi | Yüksek özgünlük, ancak üretimde tipografi çöktüğü için potansiyelini gösteremiyor. |
| İçerik dürüstlüğü | Çok yüksek. Sahte proje, sahte referans, sahte sertifika yok. |
| Teknik hijyen | Düşük-orta. Ölü kod hacmi ve üçlü sayfa ağacı ciddi. |
| Erişilebilirlik | İyi. İki somut kontrast/odak kusuru dışında olgun. |
| Üretim güvenilirliği | Zayıf. Font ve OG varlıkları dağıtım hattında kayboluyor. |

**Genel izlenim:** Proje, bir şablon değil; özgün bir tasarım sistemi ve gerekçelendirilmiş mühendislik kararları içeriyor. Sorunların büyük kısmı *tasarım* değil, **dağıtım hattı ve depo hijyeni** kaynaklı. Bu iyi haber: en kritik iki kusur, yeniden tasarım gerektirmeden, derleme öncesi adımların doğru çalıştırılmasıyla giderilebilir.

---

## 3. SAYFA VE ROTA ENVANTERİ

### 3.1 Canlı rotalar (doğrulanmış)

| Rota | HTTP | title | canonical | h1 (ham HTML) | robots |
|---|---|---|---|---|---|
| `/` | 200 | Kuk İnşaat \| Kocaeli İnşaat ve Mühendislik Firması | `/` | 1 | index, follow |
| `/kurumsal/` | 200 | Kuk İnşaat Hakkında \| Kocaeli | `/kurumsal/` | 1 | index, follow |
| `/hizmetler/` | 200 | İnşaat, Mühendislik ve Proje Hizmetleri \| Kuk İnşaat | `/hizmetler/` | 1 | index, follow |
| `/projeler/` | 200 | Proje Portföyü \| Kuk İnşaat | `/projeler/` | 1 | **noindex**, follow |
| `/iletisim/` | 200 | İletişim \| Kuk İnşaat, Başiskele | `/iletisim/` | 1 | index, follow |
| `/gizlilik/` | 200 | Gizlilik Politikası & KVKK Aydınlatma Metni | `/gizlilik/` | 1 | **noindex**, follow |

Canlı site **prerender edilmiş**: ham HTML'de ~10.038 kelime görünür metin, dolu `<div id="root">`, rota bazlı canonical ve doğru `noindex` dağıtımı var. Bu, teknik SEO açısından güçlü bir kurulumdur.

### 3.2 Dinamik rotalar

- `/hizmetler/[slug]` — 5 hizmet (`src/data/services.ts`): `insaat-ve-yapi-uygulamalari`, `muhendislik-hizmetleri`, `proje-gelistirme-ve-teknik-koordinasyon`, `proje-ve-uygulama-sureclerinin-yonetimi`, `teknik-danismanlik`
- `/projeler/[slug]` — **0 kayıt** (`projects: Project[] = []`)
- Bilinmeyen rota → istemci tarafı Türkçe 404 bileşeni (`App.tsx` içinde `NotFound`)

`sitemap.xml` 9 URL listeliyor: 4 statik + 5 hizmet detayı. `/projeler/` ve `/gizlilik/` noindex oldukları için **doğru biçimde hariç tutulmuş**.

### 3.3 Yerel derlemenin canlıdan farkı (ortam farkı)

| Ölçüt | Canlı | Yerel `dist/` |
|---|---|---|
| `<h1>` (ham HTML) | 1 | **0** |
| `<link rel="canonical">` | var | **yok** |
| Görünür metin | ~10.038 kelime | **0** (boş `#root`) |
| `meta description` | var | var (statik, ana sayfa) |
| JSON-LD (head) | 2 | 2 |
| HTML boyutu | 488.334 bayt | 475.037 bayt |
| `/api/contact` | 405 (canlı, POST bekliyor) | **yok** |
| `/api/health` | 200 | **yok** |

**Etki:** Yerel önizleme, üretimin SEO davranışını temsil etmiyor. Yerel derleme üzerinden yapılacak bir SEO değerlendirmesi yanıltıcı olur; bu rapor bu nedenle SEO hükümlerini canlı siteden, kod kalitesi hükümlerini çalışma alanından almıştır.

---

## 4. MARKA VE TASARIM DENETİMİ

### 4.1 İlk 5 saniye izlenimi

Ana sayfa `Hero` bileşeni solda metin, sağda %67 genişliğinde animasyonlu mimari sahne kullanıyor. Başlık üç satıra bölünmüş (`Sağlam yapılar,` / `doğru mühendislik` / `ile yükselir.`), ikinci satır marka mavisiyle vurgulanmış. Bu, jenerik "ortalanmış hero üçlüsü" kalıbından bilinçli olarak kaçınan, asimetrik ve editoryal bir düzen — doğru tercih.

Ancak ilk ziyarette **2,2 saniyelik tam ekran açılış perdesi** (`Intro.tsx`) içeriği örtüyor. `sessionStorage` ile oturum başına bir kez oynatılıyor ve `prefers-reduced-motion` açıkken atlanıyor; bu iki davranış doğru. Yine de ilk izlenim anında markayı değil, bir yükleme ekranını gösteriyor. Prestij hedefi için perde süresi uzundur.

### 4.2 Özgünlük

Site hazır tema veya jenerik kurumsal şablon görünümünde **değil**. Kanıtlar:

- Beş sayfanın hero görseli, harici dosya yerine elle kurulmuş satır içi SVG sahneleri (`HeroScenes.tsx`, 810 satır). Ortak bir görsel dil paylaşıyorlar: mineral zemin, mühendislik mavisi, terracotta vurgu, teknik çizim öğeleri.
- Logo, `public/brand/kuk-monogram.svg` geometrisinin birebir vektör karşılığı olarak satır içi çiziliyor (`Logo.tsx`) — tek dosyalık çıktıda 404 riskini sıfırlamak için alınmış bilinçli bir karar.
- Hareket sistemi tek easing eğrisi ve adlandırılmış zaman ölçeğiyle tanımlanmış (`--t-ink` 180ms … `--t-line` 620ms, `--d-step` 70ms). Bu, profesyonel bir motion spec'in göstergesi.

### 4.3 Renk sistemi — referans palet doğrulaması

Denetim brief'inde verilen marka renklerinin kaynak koddaki gerçek durumu:

| Referans renk | Beklenen | Gerçek durum | Kanıt |
|---|---|---|---|
| Mühendislik mavisi | `#1F435C` | ✅ Kullanılıyor | `--color-accent` ve `--color-ink-2` |
| Mineral kırık beyaz | `#EEEAE2` | ✅ Kullanılıyor | `--color-bg` |
| Grafit | `#20262B` | ✅ Kullanılıyor | `--color-ink` |
| Çelik grisi | `#626B73` | ⚠️ **Kullanılmıyor** | Yalnızca CSS yorumunda geçiyor; `--color-muted` bilinçli olarak `#5A636B`'ye koyulaştırılmış |
| Doğal beton | `#B9B6AE` | ❌ **Hiç yok** | Kaynakta 0 eşleşme |

Ek olarak, referans paletinde **olmayan** bir renk sisteme dördüncü ana renk olarak girmiş: **terracotta `#A34E3A`** (`--color-accent-warm`, `--color-hivis`). CSS yorumu bunu "SADECE mikro detay" olarak sınırlıyor ve kullanım gerçekten disiplinli (kicker çizgileri, aktif menü, form CTA, sahne vurguları).

**Değerlendirme:** `#626B73` → `#5A636B` değişikliği bir hata değil, **doğru bir erişilebilirlik kararı**: hesabım `#5A636B`'nin mineral zemin üzerinde 5.10:1 verdiğini gösteriyor; `#626B73` yaklaşık 4.2:1 ile AA sınırının altında kalırdı. Yine de bu, marka paleti dokümantasyonu ile kod arasında **kayda geçmiş bir sapma** ve marka rehberi güncellenmediği sürece tekrar tekrar sorun üretir. `#B9B6AE`'nin hiç kullanılmaması ise paletin eksik uygulandığını gösteriyor.

Terracotta kararı tasarım açısından tartışmalıdır: mineral kırık beyaz + terracotta + koyu grafit birleşimi, brief'te de uyarısı yapılan "cream-beige + terracotta" kalıbına yaklaşıyor. Burada serif tipografi kullanılmadığı ve terracotta gerçekten mikro ölçekte tutulduğu için kalıba düşülmüyor; ancak marka mavisi ile terracotta arasındaki rekabet, kurumsal bir inşaat-mühendislik kimliğinde mavi lehine daraltılabilir.

### 4.4 Tipografi

- **İki aile:** Manrope (600–800, `--font-display`) + Inter (400–700, `--font-sans`). Bu, brief'in istediği "ayırt edici display + okunabilir gövde" eşleşmesini sağlıyor. Tek aileli Inter/Roboto kullanımından kaçınılmış. ✅
- **Ölçekleme:** `clamp()` ile akıcı — örn. `text-[clamp(1.85rem,4.8vw,4.3rem)]` (hero), `clamp(2.2rem,4.6vw,4rem)` (footer CTA). Güçlü boyut kontrastı var: 0.54rem mikro etiketten 4.3rem başlığa kadar geniş bir aralık. ✅
- **Türkçe karakter desteği:** `unicode-range` içinde `U+0131` (ı), `U+0152-0153` (œ), Latin Extended-A aralığı tanımlı. ✅
- **İzleme/hiza:** Gövdede `letter-spacing: -0.006em`, başlıklarda `-0.034em` / `-0.038em`, mikro etiketlerde `0.26em`–`0.58em`. Editoryal bir hiyerarşi kurulmuş. ✅
- **`font-feature-settings: "ss01","cv01","cv11"`** — Inter'in alternatif glifleri açılmış. Detay seviyesi yüksek. ✅

**Ancak:** bu tipografik sistemin **tamamı üretimde çalışmıyor** (bkz. P0-1). Ziyaretçi Manrope veya Inter görmüyor; `-apple-system / system-ui` görüyor. Yukarıdaki tüm olumlu tespitler, kodda tanımlı **potansiyel**dir, kullanıcının gördüğü **gerçeklik** değil. Bu, denetimin en ciddi tasarım bulgusudur.

### 4.5 Görsel dil

**Olumlu:**
- Beş hero sahnesi ortak alacakaranlık/mineral dili paylaşıyor, metin içermiyor ve dekoratif olarak `aria-hidden` işaretli.
- Satır içi SVG tercihi uzak görsel isteğini sıfırlıyor (doğrulandı: derlenmiş HTML'de `https://` kaynaklı `src`/`href` yok).
- Görseller gerçek faaliyeti yansıtıyor: şantiye, karkas, kat planı, vaziyet planı, kolonad — jenerik stok "el sıkışan iş insanları" görseli yok.

**Olumsuz:**

| Bulgu | Kanıt | Etki |
|---|---|---|
| Kurumsal sayfasında 2 kırık görsel (yerel) | `pages/Kurumsal.tsx:111` → `/images/hero-architecture.jpg`; `:190` → `/images/abstract-projeler.jpg`. Yerel `dist/`'te ikisi de yok. **Canlıda ikisi de HTTP 200.** | Ortam farkı — yerel önizlemede Kurumsal sayfası iki boş görsel alanıyla bozuk görünüyor |
| 18/23 SVG görsel kullanılmıyor | 482 KB referanssız varlık (`abstract-*.svg`, `pagehero-*` varyantları, `hero-illustration.svg`) | Yalnızca dağıtım şişkinliği; tarayıcı istemediği için kullanıcıya maliyeti yok. Hangi varlığın canlı olduğunu belirsizleştiriyor |
| Fotoğraf hiç yok | `public/images` içinde yalnızca SVG (ve üretimde 5 JPG) | Tamamen illüstratif dil tutarlı, ancak bir inşaat firmasında **gerçek şantiye/fotoğraf kanıtı yokluğu** güven dönüşümünü sınırlıyor (bkz. §14) |
| Aynı görselin tekrarı | `pagehero-kurumsal-plan.svg` iki farklı hizmette (`proje-gelistirme…` ve `teknik-danismanlik`) kullanılıyor | Hizmet detay sayfaları görsel olarak ayırt edilemiyor |

---

## 5. UI/UX BULGULARI

### 5.1 Navigasyon

- Masaüstü: 5 ana madde (`Ana Sayfa, Kurumsal, Hizmetlerimiz, Projelerimiz, İletişim`) + "Teklif Alın" CTA. Kalabalık değil. ✅
- Aktif durum: `aria-current="page"` + `data-active` → CSS'te `.link-sweep[data-active="true"]::after` ve `header.text-ink .link-sweep[data-active="true"] { color: var(--color-accent-warm) }`. Aktif sayfa görsel olarak belirgin. ✅
- Mobil menü: `aria-expanded`, `aria-label` durumu değişiyor ("Menüyü aç/kapat"), 60ms kademeli giriş, `overscroll-contain`, gövde kaydırma kilidi `Intro` kilidiyle çakışmayacak şekilde yönetilmiş. Kod kalitesi yüksek. ✅
- `ScrollProgress` üstte kaydırma göstergesi sağlıyor. ✅

**Kusurlar:**

| # | Bulgu | Kanıt | Etki |
|---|---|---|---|
| UX-1 | Mobil menü kapalıyken bağlantılar odaklanabilir kalıyor | Kapalı durum sınıfı: `max-h-0 overflow-hidden opacity-0` — `visibility`, `display:none` veya `inert` yok | Klavye kullanıcısı içeriğe ulaşmadan önce 5 görünmez menü bağlantısı + telefon/e-posta üzerinden sekiyor. WCAG 2.4.3 odak sırası sorunu |
| UX-2 | Hamburger düğmesinde `aria-controls` yok | `Header.tsx:69-75` — yalnızca `aria-expanded` | Ekran okuyucu, düğmenin hangi bölgeyi kontrol ettiğini bildiremiyor (WCAG 4.1.2 için önerilen) |
| UX-3 | "Projelerimiz" ana menüde ama hedefi boş | `site.nav` içinde; sayfa `EmptyState` render ediyor; canlıda `noindex` | Bir inşaat firmasında portföy birincil güven sinyalidir. Menüden tıklanan ilk iki şeyden birinin boş çıkması dönüşüm hunisinde kırılma yaratıyor |
| UX-4 | Menü öğesi etiket tutarsızlığı | Nav: "Hizmetlerimiz" / "Projelerimiz"; footer kart başlığı: "Hizmetlerimiz"; `NAV_LABEL` (metadata): "Hizmetlerimiz", "Projelerimiz" — breadcrumb'ta da aynı | Tutarlı ✅ (olumlu tespit) |

### 5.2 Etkileşim ve geri bildirim

- `ContactForm` durum makinesi eksiksiz: `idle / sending / sent / failed / error`. Alan bazlı doğrulama (`name`, `email`, `message`), `aria-invalid`, `aria-describedby`, ilk hatalı alana programatik odak (`document.getElementById('field-…').focus()`) — WCAG 3.3.1/3.3.3 uyumu bilinçli kurulmuş. ✅
- Başarısızlık nedenleri kullanıcı diline çevriliyor (`explain()`): `not_configured`, `provider_failed`, `rate_limited`, `validation_failed`, `delivery_failed`, ağ hatası, 404/405. Her durumda **mailto yedeği + telefon** sunuluyor. Bu, dürüst hata iletişiminde örnek düzeyde bir tasarım. ✅
- Bot tuzağı (`bot-field`) sessizce başarılı yanıt veriyor. ✅
- "Talebiniz alındı" ekranı, e-postanın gerçekten iletilip iletilmediğini sunucudan gelen `delivered` bayrağıyla ayırıyor ve kullanıcıya **yanlış bilgi vermiyor**. ✅
- `Magnetic` bileşeni ile butonlarda manyetik hover, `btn-sheen` ile ışık geçişi, `img-zoom` ile görsel yakınlaşması. Mikro etkileşim yoğunluğu iyi. ✅

**Kusur — UX-5 (P1):** Form, canlıda var olan `/api/contact`'a POST ediyor; ancak **yerel derlemede bu uç nokta yok**. Yerel önizlemede her gönderim `404` → `explain()` "İletişim servisi şu anda erişilebilir değil" → mailto yedeği. Yani form yerel ortamda **hiç çalışmıyor**. Üretimde `405` (GET'e) dönmesi uç noktanın canlı olduğunu kanıtlıyor; ancak **uçtan uca gönderim test edilmedi** (üretim sistemine veri göndermeme kuralı gereği). Formun üretimde gerçekten kayıt oluşturup oluşturmadığı **doğrulanamadı**.

### 5.3 Kullanıcı yolculuğu

`İlk ziyaret → tanıma → güven → iletişim` zinciri:

| Aşama | Durum | Not |
|---|---|---|
| Firmayı tanıma | İyi | `Kurumsal` sayfası 6 değer (Teknik Yeterlilik, Kalite Anlayışı, Açık İletişim, Güvenilirlik, Sürdürülebilirlik, Çağdaş Tasarım) + hizmet alanı/bölgesi sunuyor |
| Hizmetleri anlama | İyi | 5 hizmet, her biri `summary` + `description` + 4 maddelik `scope` ile; detay sayfaları ayrı rotada |
| Güven oluşturma | **Zayıf** | Kanıtlanmış iş yok (portföy boş), fotoğraf yok, ekip yok, sertifika/belge yok, müşteri beyanı yok. Footer'daki MERSİS/vergi/KEP bilgileri güçlü bir resmi kimlik sinyali — bu iyi |
| İletişime geçme | İyi | Header'da kalıcı "Teklif Alın", footer'da dev "Birlikte inşa edelim ↗" CTA + telefon + e-posta, `ContactCta` bölümü, `Iletisim` sayfasında form + harita + çalışma saatleri |
| Gereksiz adım | Var | 2,2 sn açılış perdesi; ana gezinimde boş portföy sayfası |

CTA yerleşimi doğru: hem sabit header'da hem içerik akışında hem footer'da. Dil ("Teklif Alın", "Birlikte inşa edelim") satış odaklı ama abartısız.

---

## 6. RESPONSIVE VE MOBİL DENETİMİ

> **Yöntem uyarısı:** Ortamda tarayıcı çalıştırılamadığı için istenen 7 çözünürlükte (360×800 … 1920×1080) **görsel test yapılamamıştır**. Aşağıdaki tespitler kaynak kodundaki Tailwind kırılım sınıfları ve CSS üzerinden statik analizdir. Yatay taşma, kırpılan metin veya bozulan grid gibi görsel kusurlar **doğrulanamamıştır**; var ya da yok denemez.

### 6.1 Kod düzeyinde doğrulanan davranışlar

| Alan | Bulgu | Değerlendirme |
|---|---|---|
| Yatay taşma koruması | `html` ve `body`'de `overflow-x: hidden` + `overflow-x: clip` (clip, `hidden`'ın sticky'yi bozmasını engellediği için; yorum bunu açıklıyor) | Bilinçli ve doğru ✅ |
| Reveal animasyonlarının taşması | Yorum: "transform ile öğeleri sağa kaydırır; bu documentElement'in scrollWidth'ini büyütür" → `clip` ile gerçekten kırpılıyor | Sorun önceden teşhis edilip çözülmüş ✅ |
| Masaüstü/mobil menü eşiği | `lg:flex` (1024px) — 768px tablette hamburger | 768–1023 aralığında 5 maddelik menü hamburger'a düşüyor; tablet için savunulabilir ama 1024px'te sıkışma riski **doğrulanamadı** |
| Hero yüksekliği | `md:min-h-[calc(100svh-5rem)]`; mobilde `h-80` illüstrasyon bandı + `pt-20` | `svh` kullanımı mobil tarayıcı adres çubuğu sorununu doğru ele alıyor ✅ |
| Ölü CSS | `.hero-min-h { min-height: 108svh }` + `@supports not (height:1svh)` yedeği tanımlı ama **hiçbir `.tsx` içinde kullanılmıyor** | Hero bunun yerine Tailwind arbitrary değer kullanıyor → `.hero-min-h` ve `@supports` yedeği ölü kod |
| Dokunma hedefleri | `h-11 w-11` (44px) hamburger; `min-h-11`/`min-w-11` form ve 3D kontrollerinde; `min-h-12` form alanlarında | WCAG 2.5.8 hedef boyutu karşılanıyor ✅ |
| Hero görsel davranışı | Masaüstünde sağda `%67` genişlik + soldan karartan gradyan; mobilde tam genişlik `h-80` bant | Mobil için ayrı kompozisyon düşünülmüş, masaüstünün küçültülmüş kopyası değil ✅ |
| Footer grid | `md:grid-cols-2 lg:grid-cols-12`, kartlar `lg:col-span-4` / `lg:col-span-8` | 3 kırılımlı, duyarlı ✅ |
| Gizlilik tablosu/satırları | 739 satırlık sayfa; zebra satır ve `--color-mineral` yasal kutu tanımlı | Uzun yasal metin için okunabilirlik düşünülmüş ✅ |

### 6.2 Statik analizle tespit edilen mobil riskler

- **R-1 (P2):** Footer alt şeridi `text-[0.72rem]` (≈11,5 px) ve `text-bg/42`. Mobilde bu boyut + bu kontrast birleşimi yasal bağlantıları okunması zor hâle getiriyor (kontrast hesabı §11'de).
- **R-2 (P2):** `İnşaat` alt etiketi `text-[0.54rem]` (≈8,6 px) ve `tracking-[0.5em]`. 8,6 px hiçbir kırılımda makul bir minimum değil; mobilde fiilen okunamaz.
- **R-3 (P3):** `Intro` perdesi mobilde de 2,2 sn gövde kilidi uyguluyor. Küçük ekranda ve yavaş ağda algılanan gecikmeyi büyütür.
- **R-4 (doğrulanamadı):** `clamp()` tabanlı başlıklar 360px genişlikte satır sonu kırılması açısından test edilmedi. `overflow-x: clip` taşmayı gizleyeceği için bir taşma varsa **sessizce kırpılır** — bu, taşmayı görünmez kıldığı için avantaj olduğu kadar, gerçek bir içerik kaybını da maskeler. Görsel doğrulama gerekiyor.

---

## 7. ANİMASYON VE 3D DEĞERLENDİRMESİ

### 7.1 3D / WebGL sistemi — **UYGULANMAMIŞTIR**

Bu bölüm brief'in "henüz uygulanmamış animasyonları uygulanmış gibi raporlama" uyarısı kapsamında özellikle netleştirilmelidir.

**Durum: 3D sistem tasarlanmış, kodlanmış, ancak hiçbir sayfaya bağlanmamıştır.**

| Kanıt | Değer |
|---|---|
| `ARCHITECTURE_SCENES` içinde 5 sahnenin tamamı | `modelSrc: null`, `mobileModelSrc: null`, `mobileMode: "poster"` |
| `ArchitecturalScene` bileşeninin import edildiği yer sayısı | **0** (kendi klasörü dışında) |
| `three` paketi derlenmiş HTML'de | **yok** (doğrulandı: `THREE` / `WebGLRenderer` izi 0) |
| `package.json` bağımlılıkları | `three` ve `@types/three` **kullanılmadığı hâlde** listede |

Kod kalitesi notu: `ArchitecturalScene.tsx`'in kendi içindeki yorum dürüst — *"Nothing in the existing site mounts this component yet: all five pages retain their original DOM and artwork."* Bileşen poster-first, `IntersectionObserver` ile viewport dışında render etmiyor, `AbortController` ile iptal ediyor, reduced-motion ve mobil yetenek kontrolü yapıyor, hata durumunda "yeniden dene" düğmesi sunuyor. **Mimari olarak doğru tasarlanmış bir iskelet**; yalnızca 3B varlık (GLB) ve montaj yok.

**Sonuç:** WebGL sahne yüklemesi, kamera hareketi, mobil performans yükü, fallback davranışı gibi brief'teki 3D sorularının **hiçbiri üretimde geçerli değildir**, çünkü ortada çalışan bir 3D sahne yoktur. Değerlendirilecek tek şey, kullanılmayan bir alt sistemin depo maliyetidir.

### 7.2 CSS/SVG animasyon sistemi

`hero-art.css` (168 satır) + `index.css` içindeki hareket sistemi, 5 hero sahnesini ve sayfa geçişlerini yönetiyor.

**Güçlü yönler:**
- **Tek easing, tek zaman ölçeği.** `--ease-out: cubic-bezier(0.22,1,0.36,1)` ve adlandırılmış süre tokenları (`--t-ink` … `--t-hero`, `--d-step`). Animasyonlar rastgele değil, bir spec'e bağlı.
- **`prefers-reduced-motion` iki katmanda:** `index.css`'te 2 ayrı `reduce` bloğu (satır 351 ve 697) reveal/ken-burns/marquee/magnetic/btn-sheen'i kapatıyor; `hero-art.css`'te `.hv-svg *` üzerinde `animation: none !important`. Hero sahneleri ayrıca **`backwards` dolgusu** kullanıyor, yani taban durum her zaman "tamamlanmış çizim" — hareket kapatıldığında sahne bozulmuyor, statik ve eksiksiz görünüyor. Bu, reduced-motion desteğinde doğru ve az görülen bir teknik.
- **Sahne görünür değilken render yok:** 3D iskeletinde `IntersectionObserver` + `setVisible`; CSS animasyonları ise `will-change` ile GPU'ya alınmış.
- **Kayma/takılma riski yönetilmiş:** `overflow-x: clip`, `svh` birimi, `contain` benzeri izole katmanlar (`isolate`, `-z-10`).

**Zayıf yönler:**

| # | Bulgu | Kanıt | Etki |
|---|---|---|---|
| AN-1 (P2) | Beş hero sahnesinin tamamı her sayfaya gönderiliyor | `HeroScenes.tsx` 810 satır; `App.tsx` ve `Illustration.tsx` içinde `lazy`/`Suspense` **0** | Ziyaretçi yalnızca 1 sahne görüyor ama 5'inin kodu (projeler sahnesi tek başına 216 SVG öğesi üretiyor) 375 KB'lik JS'in içinde geliyor |
| AN-2 (P3) | `hv-draw` tekniği `pathLength`'e bağımlı | `.hv-draw { stroke-dasharray: 1 }` + `pathLength={1}` | `pathLength` `<path>` üzerinde SVG 1.1 ve evrensel; `<line>`/`<circle>` üzerinde SVG 2 ve destek evrensel değil. Bu oturumda tüm `hv-draw` öğeleri `<path>`'e dönüştürüldü (11 öğe) — **mevcut durumda risk giderilmiş**, ancak kural kodda belgelenmediği için yeni eklenen bir `<line>` aynı hatayı yeniden üretebilir |
| AN-3 (P3) | Açılış perdesi + hero giriş animasyonları üst üste biniyor | `Intro` 2200ms; hero `hero-anim-1..5` kademeli | İlk ziyarette içerik ~2,2 sn örtülü, ardından hero animasyonu başlıyor. Toplam algılanan yerleşme süresi uzun |
| AN-4 (doğrulanamadı) | Animasyon sırasında kayma/takılma | Gerçek tarayıcı ölçümü yapılamadı | INP/CLS etkisi **ölçülemedi** |

**Dekorasyon dengesi:** Brief'in "aşırı minimalizm nedeniyle karakterini kaybetmiş bölümler" ve "gereksiz görsel efektler" soruları için: site ne aşırı minimal ne de aşırı süslü. Ancak **footer, sitenin geri kalanından farklı bir malzeme dili konuşuyor** — `bg-white/[0.04]` + `backdrop-blur-xl` kartlar ve `blur-[120px]` renkli ışık küreleri (`bg-[#1f435c]/50`, `bg-accent-warm/20`). Gövde boyunca mineral/düz/mimari bir dil varken footer'da cam efekti ve bulanık blob'lar var. Bu bir stil kopukluğu; "aurora blob" kalıbına kısmi bir yaklaşma. Footer'ın koyu zemini bunu taşıyor, ancak tutarlılık adına gözden geçirilmeli (P3).

---

## 8. İÇERİK VE METİN DEĞERLENDİRMESİ

### 8.1 Dil ve anlatım

İncelenen metinlerde (hero, hizmetler, kurumsal, iletişim, footer, boş durum) **yazım veya noktalama hatası tespit edilmedi**. Türkçe karakterler doğru; `&apos;` / `&amp;` gibi HTML varlıkları yerinde kullanılmış (`Google Maps&apos;te aç`, `Gizlilik &amp; KVKK`).

Anlatım, jenerik kurumsal dilden belirgin biçimde uzak:

- Somut ve ölçülü: *"Mimari, statik, elektrik ve mekanik projeler çoğu zaman ayrı ekiplerce hazırlanır. Biz bu projeleri uygulama öncesinde karşılaştırır, aralarındaki uyumsuzlukları tespit ederiz."* — süreç anlatıyor, sıfat yığmıyor.
- Abartı yok: "sektör lideri", "en iyi", "20 yıllık deneyim", "500+ proje" türü kanıtsız iddialar **hiçbir yerde yok**. Bu, brief'in "gereksiz iddialar" sorusuna güçlü bir olumlu yanıttır.
- Boş portföy metni dürüst: *"Şu anda yayımlanmış proje kaydı bulunmuyor. Gerçek proje bilgileri paylaşılmaya hazır olduğunda bu bölüm güncellenecektir."*

### 8.2 Marka anlatısı

| Soru | Yanıt | Kanıt |
|---|---|---|
| KUK'ın kim olduğu net mi? | Evet | Kocaeli/Başiskele merkezli, konut + ticari + karma yapı, projelendirmeden teslime tek elden |
| Mühendislik yetkinliği aktarılıyor mu? | Evet | 5 hizmetin `scope` listeleri teknik ve ayrışmış; `process` ve `engineering` bölümleri var |
| Güven oluşturuyor mu? | Kısmen | Resmi kimlik bilgileri güçlü (MERSİS, vergi, sicil, KEP); **kanıtlanmış iş yok** |
| Her sayfanın kendine özgü mesajı var mı? | Evet | `metadata.ts` içinde sayfa + hizmet bazında ayrı title/description; hizmet başlıklarına yerel niyet için "Kocaeli" niteleyicisi eklenmiş (kodda İ-02 olarak işaretli) |

### 8.3 Tespit edilen içerik kusurları

| # | Bulgu | Kanıt | Etki |
|---|---|---|---|
| CT-1 (P1) | **Portföy tamamen boş** | `projects: Project[] = []`; yorum: "Örnek kayıtlar kullanıcı talebiyle kaldırılmıştır" | Bir inşaat firmasının birincil ikna aracı yok. `/projeler` hem `noindex` hem ana menüde |
| CT-2 (P2) | İki hizmet aynı görseli paylaşıyor | `proje-gelistirme…` ve `teknik-danismanlik` → aynı `pagehero-kurumsal-plan.svg` | Hizmetler görsel olarak ayırt edilemiyor |
| CT-3 (P2) | `views/Iletisim.tsx` daha zengin ama yayımlanmıyor | views: 9.021 bayt ("İletişime başlayın" bölümü, `ContactMap`, `ExternalArrow`); canlı pages: 4.483 bayt | Yazılmış gerçek içerik/UX işi depoda duruyor, kullanıcıya ulaşmıyor |
| CT-4 (P3) | Slogan tekrarı | `site.slogan` = "Kaliteyle Kurulur", `site.tagline` = "Kaliteyle Kurulur." — iki ayrı alan, aynı metin | Veri modeli tekrarı; noktalama farkı tutarsızlık üretiyor |
| CT-5 (P3) | `metadata.ts` içinde `ogCrop()` fonksiyonunda ölü dal | `if (url.startsWith("/")) return …` aynı koşulla **iki kez** yazılmış (ikincisi `kukinsaat.com` sabitiyle, erişilemez) | Kod kokusu; davranışı etkilemiyor |
| CT-6 (P3) | FAQ içeriği incelenemedi | `data/faq.ts` 1.437 bayt; ana sayfada `Faq` bölümü render ediliyor | Soru sayısı ve niteliği **doğrulanamadı** |

### 8.4 Gizlilik metni

`pages/Gizlilik.tsx` 739 satır. KVKK kavram kapsaması (kelime sayısı):

`başvuru` 14 · `açık rıza` 10 · `veri sorumlusu` 9 · `çerez` 8 · `yurt dışı` 6 · `aydınlatma` 5 · `saklama` 4 · `imha` 1 · **`VERBİS` 0**

Bu, gerçek bir aydınlatma metni hacminde ve doğru kavramları içeriyor. `VERBİS` geçmemesi bir eksik olabilir; ancak VERBİS kayıt yükümlülüğünün KUK için geçerli olup olmadığı **hukuki değerlendirme gerektirir** ve bu rapor hüküm vermez (bkz. §13).

---

## 9. TEKNİK SEO SONUÇLARI

### 9.1 Doğrulanan güçlü yanlar (canlı site)

| Öğe | Durum | Kanıt |
|---|---|---|
| Prerender | ✅ Tüm rotalarda ham HTML'de içerik | `/` → h1:1, ~10.038 kelime; 6 rotanın 6'sında h1:1 |
| Rota bazlı title | ✅ Özgün ve açıklayıcı | Tablo §3.1 |
| Canonical | ✅ Her rotada kendine işaretli, **sonda eğik çizgili** | `/kurumsal/` → `canonical:/kurumsal/` |
| Canonical politikası | ✅ Gerekçelendirilmiş | `metadata.ts` uzun bir yorumla Cloudflare Pages 308 "pretty URL" davranışını açıklıyor: canonical yönlendiren değil 200 dönen URL'yi göstermeli |
| robots.txt | ✅ Doğru kurgu | `Disallow: /api/`; yasal sayfalar robots ile **engellenmemiş** — dosya bunu açıklıyor: "engellenen sayfanın noindex etiketi okunamaz" |
| noindex dağıtımı | ✅ Doğru | `/projeler/` ve `/gizlilik/` → `noindex, follow`; sitemap bu ikisini **içermiyor** |
| JSON-LD | ✅ 2 blok ham HTML'de | `GeneralContractor` (adres, geo, saat, `knowsAbout`, `sameAs`, `areaServed`, `legalName`) + `WebSite` |
| BreadcrumbList | ✅ Rota bazlı, runtime注入 | `App.tsx` → `applyRouteJsonLd()`, tek script etiketinde; mükerrer işaretleme yaratmamak için `HizmetDetay` kendi JSON-LD'sini DOM içinde render ediyor ve `metadata.ts` bilinçli olarak boş dizi döndürüyor |
| Yerel SEO | ✅ Kapsamlı | `geo.region TR-41`, `geo.placename`, `geo.position 40.725542;29.9999255`, `ICBM`, `hasMap`, `areaServed: Kocaeli`, hizmet title'larında "Kocaeli" |
| sitemap | ✅ 9 URL, doğru filtre | Yedek dosya; prerender'ın ürettiği sürüm canlıda |
| 301 miras yönlendirmeleri | ✅ Kapsamlı | `/about`, `/corporate`, `/hakkimizda`, `/services/*`, `/projects`, `/contact-us`, `/kvkk`, `/privacy-policy` → Türkçe karşılıkları; çoğul/yazım varyantları dahil |
| Heading hiyerarşisi | ✅ Tek h1 | Her rotada h1:1 doğrulandı |
| Görsel alt metinleri | ✅ | Hero sahneleri `decorative` → `alt=""` + `aria-hidden`; `Illustration.tsx` içinde 5 sayfa için ayrıntılı Türkçe alt metin tanımlı |
| `lang` | ✅ | `<html lang="tr">`, `og:locale tr_TR` |

### 9.2 SEO kusurları

| # | Öncelik | Bulgu | Kanıt | Etki | Çözüm | Karmaşıklık |
|---|---|---|---|---|---|---|
| SEO-1 | **P1** | Varsayılan OG görseli üretimde 404 | `metadata.ts`: `DEFAULT_OG_IMAGE = "…/images/hero-building-sketch-og.jpg"` → canlıda **HTTP 404**. `src/app/layout.tsx` içinde 3 kez daha referanslı | `og:image`'ı bu değere düşen tüm rotalar (kurumsal, hizmetler, projeler, iletişim, gizlilik, 404) sosyal paylaşımda görselsiz. Ana sayfa kendi `og:image`'ını ayrıca bildirdiği için kurtuluyor | Var olan bir görselden 1200×630 OG türetip `public/images/`'a koymak; `DEFAULT_OG_IMAGE`'ı ona指向 | Düşük |
| SEO-2 | **P1** | Hizmet detay OG görselleri SVG + anlamsız kırpma parametreleri | `ogCrop(service.image)` → `service.image` = `/images/pagehero-*.svg`; fonksiyon `?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630` ekliyor (imgix/Pexels sözdizimi, yerel SVG'de etkisiz) | 5 hizmet detay sayfası sosyal önizlemede büyük olasılıkla görselsiz. Ayrıca `/` ile başlayan yerel yollar `ogCrop` içinde `${SITE_URL}${url}`'e çevriliyor — bu kısım doğru | `ogCrop`'u yalnızca uzak URL'lere uygulamak; hizmetler için gerçek 1200×630 JPG/PNG üretmek | Orta |
| SEO-3 | **P2** | `noindex` sayfa ana gezinimde | `/projeler/` robots `noindex, follow` + `site.nav` içinde | Tarama bütçesi ve iç bağlantı değeri noindex bir sayfaya akıyor; kullanıcı boş sayfaya düşüyor. Karar kodda "T-02" olarak belgelenmiş, yani bilinçli | Portföy dolana dek menüden çıkarmak veya menüde tutup `/hizmetler`'e yönlendirmek; portföy gelince `noindex`'i kaldırmak | Düşük |
| SEO-4 | **P2** | Yerel derlemede canonical ve prerender yok | `dist/index.html`: canonical **YOK**, h1 **0**, boş `#root` | Bu çalışma alanından yapılacak bir dağıtım, canlıdaki tüm prerender/SEO kazanımlarını **siler**. Şu anki en yüksek operasyonel risk | `scripts/prerender.mjs` + `postbuild` adımını depoya geri kazandırmak | Orta |
| SEO-5 | **P3** | `dist/404.html` yok | `_redirects` yorumu "bilinmeyen yollar `dist/404.html`'e düşer → HTTP 404" diyor; dosya derlenmiyor | Bilinmeyen URL'ler 200 + `index.html` dönerse Search Console'da **soft 404** riski. Sunucu davranışı **doğrulanamadı** | Prerender adımına 404 çıktısı eklemek | Düşük |
| SEO-6 | **P3** | `_redirects` kendi belgelenmiş kuralıyla çelişiyor | Dosyanın başındaki yorum, `/* /index.html 200` kuralının **bilinçli olarak kullanılmadığını** ve Pages'in sonsuz döngü algılayıp kuralı yok saydığını açıklıyor; dosyanın **sonuna** tam olarak bu kural eklenmiş | Cloudflare Pages'te kural ya yok sayılır (etkisiz) ya da uygulanırsa tüm 404'leri 200'e çevirir — her iki durumda da belgelenmiş niyetle çelişiyor | Satırı kaldırmak ve 404 davranışını prerender ile çözmek | Düşük |
| SEO-7 | **P3** | `sitemap.xml` `lastmod` değerleri sabit | 9 URL'nin tamamı `2026-10-28` | İçerik değiştiğinde `lastmod` bayatlıyor; prerender çalışmadığı için otomatik güncellenmiyor | Prerender hattını geri getirmek (SEO-4 ile aynı çözüm) | Düşük |
| SEO-8 | **P3** | `google-site-verification` hem meta hem dosya ile | `index.html` meta + `public/googledc53ece4919de5fe.html` | Zararsız tekrar; tek yöntem yeterli | Birini kaldırmak | Çok düşük |

### 9.3 İçerik SEO değerlendirmesi

- **Anahtar kelime çakışması yok.** 5 hizmet detay sayfasının title/description'ı ayrı ve ayrışmış; hepsi "Kocaeli" yerel niteleyicisini farklı hizmet bağlamlarında kullanıyor. Bu, cannibalization riskini düşürüyor. ✅
- **Arama niyeti uyumu iyi.** `/hizmetler/[slug]` title'ları "İnşaat ve Yapı Uygulamaları — Kocaeli | Kuk İnşaat" biçiminde; yerel arama kalıbıyla uyumlu.
- **İç bağlantı yoğun.** Footer'da 5 nav + 5 hizmet + gizlilik; hero'da hizmet çipleri; hizmet detayında ilgili hizmetler. ✅
- **İçerik derinliği orta.** Hizmet açıklamaları 2 paragraf + 4 maddelik kapsam. Teknik olarak doğru ama bir mühendislik firmasının uzmanlığını kanıtlayacak derinlikte (ör. yönetmelik referansı, yöntem karşılaştırması, süreç detayı) değil. `Gizlilik` sayfası 739 satır — en derin içerik orada, bu da önceliklerin yasal tarafa kaydığını gösteriyor.
- **Search Console / Analytics performansı:** erişim yok, **değerlendirilemedi**.

---

## 10. PERFORMANS VE CORE WEB VITALS

> **Ölçüm uyarısı:** Lighthouse çalıştırılamadı, CrUX/RUM verisi yok. **LCP, INP ve CLS için hiçbir sayısal değer üretilemez** ve üretilmemiştir. Aşağıdakiler dosya boyutu, istek sayısı ve yüklenme stratejisi gibi **doğrudan ölçülebilen** statik metriklerdir.

### 10.1 Ölçülen değerler

| Metrik | Değer | Not |
|---|---|---|
| `dist/index.html` | **475.037 bayt** (ham) / **130,37 KB gzip** | `vite-plugin-singlefile` ile tek dosya |
| — içinde JS | 374.841 bayt (**%79**) | Satır içi, bölünmemiş |
| — içinde CSS | 95.968 bayt (**%20**) | Satır içi |
| Canlı HTML | 488.334 bayt | Prerender edilmiş içerik dahil |
| Harici HTTP isteği (HTML içinde) | **0** | `https://` kaynaklı `src`/`href` yok |
| `preload` / `preconnect` | 2 | `index.html` yorumu font preload'unu bilinçli olarak gereksiz sayıyor |
| Fontlar | 4 dosya, ~172 KB | **Canlıda 4'ü de 404** |
| `public/images` | 564 KB (23 SVG) | 482 KB'ı referanssız |
| `public/fonts` | 192 KB | |
| three.js | **Paket içinde yok** | Dinamik import yalnızca hiç monte edilmeyen bileşenden |

### 10.2 Değerlendirme

**Güçlü:**
- **Sıfır üçüncü taraf istek.** GA4 yalnızca açık onaydan sonra yükleniyor (`CookieConsent`), font ve görsel harici CDN'den gelmiyor. Bu, hem performans hem gizlilik açısından nadir görülen bir disiplin.
- **Render-blocking kaynak yok.** CSS ve JS satır içi; ayrı dosya isteği, dolayısıyla ek round-trip yok.
- **Kullanılmayan ağır bağımlılık pakete sızmamış.** `three` (~600 KB) dinamik import sayesinde tree-shake edilmiş; doğrulandı.
- **Görsel optimizasyonu yapısal olarak çözülmüş.** Tüm hero görselleri satır içi SVG → istek yok, boyut küçük, ölçekten bağımsız keskin.
- `loading="lazy"` / `priority` ayrımı `Image` sarmalayıcısında uygulanmış; `fetchPriority="high"` hero için.

**Zayıf:**

| # | Öncelik | Bulgu | Etki |
|---|---|---|---|
| PF-1 (P1) | 375 KB bölünmemiş JS her rotaya gidiyor | Tek dosya mimarisi code-splitting'i imkânsız kılıyor. 5 hero sahnesinin 5'i de pakette (yalnızca 1'i render ediliyor). Gizlilik sayfası 739 satır bileşen kodu da her sayfada | İlk yükleme ayrıştırma/çalıştırma maliyeti; mobil düşük uç cihazda belirgin. INP'ye etkisi **ölçülemedi** |
| PF-2 (P2) | Önbellek ayrıştırması yok | Tek HTML dosyası: bir yazım hatası düzeltmesi bile 475 KB'lik belgeyi ve tüm CSS/JS'i geçersiz kılıyor. Font ve görseller ayrı olsa da kod ayrı değil | Tekrar ziyaretlerde ve içerik güncellemelerinde gereksiz transfer |
| PF-3 (P2) | Fontlar üretimde 404 → fallback zinciri | `font-display: swap` tanımlı, bu yüzden metin **görünür** kalıyor (iyi) ama sistem fontuyla render ediliyor. FOUT/FCLS yerine kalıcı yanlış tipografi | Tipografik kimlik kaybı (bkz. P0-1). CLS'ye etkisi `swap` nedeniyle düşük |
| PF-4 (P3) | 2,2 sn gövde kilidi | `Intro` ilk ziyarette `overflow: hidden` uyguluyor | Etkileşim gecikmesi; algılanan hız |
| PF-5 (P3) | 482 KB referanssız görsel dağıtıma gidiyor | Yalnızca depo/dağıtım boyutu; tarayıcı istemediği için kullanıcıya maliyeti yok | Düşük |

**WebP/AVIF:** Kullanılmıyor, çünkü raster görsel neredeyse yok (üretimde 5 JPG). SVG-first tercih bu soruyu büyük ölçüde geçersiz kılıyor; ancak Kurumsal sayfasındaki 2 fotoğraf JPG ve bunların WebP/AVIF türevi yok (P3).

---

## 11. ERİŞİLEBİLİRLİK SONUÇLARI (WCAG 2.2 AA)

### 11.1 Hesaplanan kontrast oranları

WCAG 2.2 bağıl parlaklık formülüyle, kaynakta bildirilen renk değerlerinden bağımsız olarak hesaplandı:

| Kombinasyon | Oran | Hüküm |
|---|---|---|
| `ink #20262B` / `bg #EEEAE2` (gövde metni) | **12.74:1** | ✅ AAA |
| `muted #5A636B` / `bg #EEEAE2` (ikincil metin) | **5.10:1** | ✅ AA |
| `muted #5A636B` / `bg-2 #E5E1D9` | **4.69:1** | ✅ AA |
| `accent #1F435C` / `bg` (bağlantı/vurgu) | **8.68:1** | ✅ AAA |
| `accent-warm #A34E3A` / `bg` | **4.72:1** | ✅ AA |
| `accent-soft #8BB2CC` / `ink` (koyu zemin) | **6.80:1** | ✅ AA |
| `line-2 #9C9384` / `surface #FFF` (form kenarlığı) | **3.03:1** | ✅ WCAG 1.4.11 bileşen sınırı (3:1) |
| `bg #EEEAE2` / `ink` (buton) | **12.74:1** | ✅ AAA |
| **footer `text-bg/42`** (alt şerit) / `#20262B` | **3.45:1** | ❌ **AA başarısız** |
| **footer `text-bg/42`** / `#0C1115` (gradyan alt ucu) | **3.60:1** | ❌ **AA başarısız** |
| footer `text-bg/55` / `#20262B` | 4.89:1 | ✅ AA (ama 8,6 px — bkz. A11Y-3) |
| footer `text-bg/62` / `#20262B` | 5.83:1 | ✅ AA |

**Önemli doğrulama:** CSS içindeki yorumlar bu oranları iddia ediyor (`accent-warm` için "beyazla 5.66:1", `accent-soft` için "grafit üstü 6.80:1", `line-2` için "3:1 sınır kontrastı"). Bağımsız hesabım `accent-soft/ink` = 6.80:1 ve `line-2/surface` = 3.03:1 değerlerini **birebir doğruladı**. Yani palet tahminle değil, ölçülerek kurulmuş. Bu, erişilebilirlik olgunluğunun güçlü bir göstergesi.

### 11.2 Doğrulanan olumlu uygulamalar

- **Skip link:** `App.tsx:186` → `<a href="#main" className="skip-link">İçeriğe atla</a>`; CSS'te ekran dışına konumlanmış, `:focus` ile görünür oluyor. ✅
- **Global focus-visible:** `outline: 2px solid var(--color-ink); outline-offset: 3px` — tutarlı ve görünür. Ayrıca bileşen bazında `focus-visible:outline-2 focus-visible:outline-offset-2` kullanımı yaygın. ✅
- **Semantik HTML:** `<header>`, `<main id="main">`, `<footer>`, `<nav aria-label>` (iki ayrı etiket: "Ana navigasyon" / "Mobil navigasyon"), `<address>`, `<ul>/<li>`. ✅
- **ARIA kullanımı ölçülü ve doğru:** 87 `aria-hidden` (hepsi dekoratif SVG/gradyan), 23 `aria-label`, 4 `aria-describedby`, 3 `aria-invalid`, 2 `aria-pressed`, 2 `aria-labelledby`, 2 `aria-expanded`, 1 `aria-current`. ARIA spam'i yok; çoğunluk dekoratif öğeleri doğru biçimde gizliyor. ✅
- **Form erişilebilirliği:** 6 `<label>`, `htmlFor` ↔ `id="field-*"` eşleşmesi, `aria-invalid`, hata metinleri `aria-describedby` ile bağlı, ilk hatalı alana programatik odak, `role="status"` (başarı) / `role="alert"` (hata). WCAG 3.3.1 + 3.3.3 bilinçli uygulanmış. ✅
- **Hareket azaltma:** `index.css`'te 2 ayrı `reduce` bloğu + `hero-art.css`'te `.hv-svg *` kapsayıcı kuralı. JS tarafında da `matchMedia("(prefers-reduced-motion: reduce)")` ile `Intro`, `Magnetic`, `Parallax`, kaydırma davranışı ve 3D iskeleti kontrol ediliyor. ✅
- **Dokunma hedefleri:** hamburger 44×44 px, form alanları `min-h-12` (48 px), 3D kontrol düğmeleri `min-h-11 min-w-11`. WCAG 2.5.8 ✅
- **Dekoratif görsel alt metinleri:** `decorative` modda `alt=""` + `aria-hidden="true"`; anlamlı modda 5 sayfa için ayrıntılı Türkçe açıklama. ✅
- **İmleç özelleştirmesi devre dışı bırakma:** `CustomCursor` `(hover: none), (pointer: coarse)` ve `prefers-reduced-motion` durumlarında hiç monte edilmiyor; sistem imleci korunuyor. ✅

### 11.3 Erişilebilirlik kusurları

| # | Öncelik | Bulgu | Kanıt | Etki | Çözüm | Karmaşıklık |
|---|---|---|---|---|---|---|
| A11Y-1 | **P2** | Footer alt şeridi AA kontrastını geçemiyor | `Footer.tsx:222` → `text-[0.72rem] text-bg/42`. Hesaplanan 3.45:1 / 3.60:1 (gerekli 4.5:1) | © satırı, **Gizlilik & KVKK**, **Çerez Tercihleri** ve İletişim bağlantıları 11,5 px boyutta ve yetersiz kontrastta. Yasal olarak önemli bağlantılar en zor okunan öğeler | Opaklığı `/42`'den ≥`/62`'ye çıkarmak (5.83:1) veya `--color-muted`'in açık zemin karşılığını tanımlamak | Çok düşük |
| A11Y-2 | **P2** | Kapalı mobil menü bağlantıları odaklanabilir | `Header.tsx:89-91` → kapalı durum `max-h-0 overflow-hidden opacity-0`; `visibility:hidden`, `display:none` veya `inert` yok | Klavye ile gezen kullanıcı, ana içeriğe ulaşmadan önce görünmeyen 5 menü bağlantısı + telefon + e-posta + sosyal bağlantılar üzerinde duruyor. WCAG 2.4.3 | Kapalı durumda `inert` özniteliği veya `visibility: hidden` (geçişle uyumlu biçimde) | Düşük |
| A11Y-3 | **P2** | 8,6 px metin | `Footer.tsx:146` → `text-[0.54rem] tracking-[0.5em]` ("İnşaat" etiketi); ayrıca `0.58rem` (Hero alt bilgi etiketleri), `0.6rem`/`0.62rem`/`0.68rem` yaygın | Kontrast geçse bile bu boyutlar okunabilir değil; `0.5em` harf aralığı küçük puntoyu daha da zorlaştırıyor. Düşük görme keskinliği ve yaşlı kullanıcılar için engel | Mikro etiketlerde tabanı ~0.68rem (≈11 px) altına indirmemek; 0.54rem'i kaldırmak | Düşük |
| A11Y-4 | **P3** | Hamburger'de `aria-controls` yok | `Header.tsx:69-75` | Ekran okuyucu düğme ile kontrol edilen bölgeyi ilişkilendiremiyor | `id` + `aria-controls` eklemek | Çok düşük |
| A11Y-5 | **P3** | `::selection` rengi kontrast denetimi dışında | `index.css:144` → `background: var(--color-ink); color: #fff` | Bu kombinasyon 12.74:1 → **sorun yok** (olumlu tespit) | — | — |
| A11Y-6 | **doğrulanamadı** | Ekran okuyucu ve gerçek klavye davranışı | Ortamda tarayıcı/AT yok | Odak tuzağı, canlı bölge duyuruları ve okuma sırası **test edilmedi** | Gerçek AT ile doğrulama gerekiyor | — |
| A11Y-7 | **doğrulanamadı** | 3D sahne duraklatma düğmesi erişilebilirliği | `ArchitecturalScene` içinde `aria-pressed`, `aria-label`, `role="status"` doğru yazılmış, ancak bileşen **hiçbir yerde monte edilmiyor** | Kullanıcıya etkisi yok (özellik canlı değil) | — | — |

---

## 12. GÜVENLİK VE YAZILIM ALTYAPISI

### 12.1 Güvenlik

> Üretim sistemine saldırı testi, veri gönderimi veya yıkıcı test **yapılmamıştır**. Aşağıdakiler statik analiz ve zararsız `GET` sondalarıdır.

**Olumlu:**

| Alan | Durum | Kanıt |
|---|---|---|
| Güvenlik başlıkları | ✅ Tanımlı | `public/_headers`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| Önbellek politikası | ✅ | `/fonts/*` → `immutable, 1 yıl`; `/brand/*`, `/favicon.svg` → 7 gün |
| Gizli bilgi sızıntısı | ✅ Temiz | Kaynakta API anahtarı, parola, bağlantı dizesi veya `.env` içeriği **yok**. `site.gaId` (ölçüm kimliği) ve `searchConsoleToken` istemci tarafında olması **normaldir** — bunlar gizli değildir |
| İstemci-taraflı veri sızıntısı | ✅ | `DATABASE_URL`, `RESEND_API_KEY` vb. yalnızca `src/app/api/*` ve `src/db/*` içinde — bunlar derlemeye girmiyor (tsconfig hariç + Vite kapsamı dışında) |
| XSS yüzeyi | ✅ Dar | `dangerouslySetInnerHTML` **kullanılmıyor**. Tek dinamik HTML yazımı `applyRouteJsonLd()` içinde `script.textContent = JSON.stringify(...)` — bu, `innerHTML` yerine `textContent` kullandığı için enjeksiyona kapalı ve doğru tercih |
| Form tarafı doğrulama | ✅ (kod düzeyinde) | `ContactForm` istemci doğrulaması yapıyor; `src/app/api/contact/route.ts` sunucu doğrulaması + IP hız sınırı (10 dk / 5 istek) içeriyor. **Ancak bu uç nokta yerel derlemede yok** |
| Bağımlılık uyarıları | ⚠️ | `npm install` çıktısı: **2 zafiyet (1 düşük, 1 yüksek)**. `npm audit fix` öneriliyor. Paket adları bu denetimde çıkarılmadı — **doğrulanamadı** |

**Riskler:**

| # | Öncelik | Bulgu | Kanıt | Etki | Çözüm |
|---|---|---|---|---|---|
| SEC-1 | **P2** | `Content-Security-Policy` tanımlı değil | `public/_headers` içinde CSP yok | Satır içi `<style>` ve `<script>` kullanan tek dosya mimarisinde CSP eklemek zordur (nonce/hash gerekir), bu yüzden yokluğu anlaşılır; yine de XSS'e karşı en etkili katman eksik. GA4 yalnızca onay sonrası `googletagmanager.com`'dan yükleniyor — CSP olsaydı bunun `script-src`'de açıkça izinli olması gerekirdi | `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com` ile başlayıp nonce'a geçmek | 
| SEC-2 | **P2** | `Strict-Transport-Security` (HSTS) yok | `_headers` içinde tanımlı değil | HTTPS'e zorlama ve downgrade koruması başlık düzeyinde sağlanmıyor. Cloudflare düzeyinde etkin olabilir — **doğrulanamadı** | `_headers`'a `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| SEC-3 | **P2** | Hız sınırı ve sunucu doğrulaması yerel derlemede devre dışı | `worker/` ve `src/app/api/*` derlemeye girmiyor | Bu çalışma alanından dağıtım yapılırsa form uç noktası tamamen kaybolur; form mailto'ya düşer. Veri kaybı riski yok (form zaten DB'ye yazmıyor) ama dönüşüm kaybı var | P0-2 ile aynı çözüm: üretim hattını geri kazandırmak |
| SEC-4 | **P3** | `npm audit` 2 zafiyet bildiriyor | Kurulum çıktısı | Geliştirme bağımlılığı olabilir; üretim etkisi **doğrulanamadı** | `npm audit` çıktısını inceleyip `npm audit fix` |

### 12.2 Yazılım kalitesi

**Mimari:**
- Veri katmanı doğru soyutlanmış: `data/site.ts`, `data/services.ts`, `data/projects.ts`, `data/faq.ts` tek kaynak. İçerik kodla karışmamış. ✅
- `lib/metadata.ts` tek kaynak olarak 3 tüketiciyi besliyor (istemci rota yöneticisi, prerender, sitemap) ve bu tasarımı yorumla belgeliyor. ✅
- Bileşen organizasyonu anlamlı: `brand/`, `layout/`, `home/`, `contact/`, `services/`, `projects/`, `kurumsal/`, `ui/`. ✅
- Yorum kalitesi alışılmadık derecede yüksek: kararların **neden**'i yazılmış (canonical eğik çizgi gerekçesi, `overflow-x: clip` nedeni, `@supports` kullanım nedeni, mükerrer JSON-LD'den kaçınma nedeni). Bu, bakım açısından büyük değer. ✅

**Kritik kalite sorunu — SW-1 (P2): üç paralel sayfa ağacı ve tip denetimsiz ~25 dosya**

| Ağaç | Dosya | Satır | Durum |
|---|---|---|---|
| `src/pages/` | 8 | 1.687 | ✅ **Canlı** — `App.tsx` bunu import ediyor |
| `src/views/` | 8 | 1.712 | ❌ Ölü — yalnızca `src/app/*` import ediyor |
| `src/app/` | 15 | — | ❌ Ölü — Next.js App Router, Vite derlemesinde yok |
| `src/db/` | 2 | — | ❌ Ölü — Drizzle/pg |
| `src/lib/seo.ts` | 1 | — | ❌ Ölü — yalnızca `src/app/*` kullanıyor |

`tsconfig.json` şu yolları **açıkça hariç tutuyor**: `src/app`, `src/db`, `src/lib/seo.ts`, `src/views`.

**Sonuçlar:**
1. ~25 dosya hiç tip denetiminden geçmiyor. `npx tsc --noEmit` temiz dönüyor, ama bu **kapsamın dar olmasından** — kodun doğru olmasından değil. Nitekim hariç tutulan dosyalarda `next`, `next/server`, `next/navigation`, `drizzle-orm`, `pg` modülleri çözümlenemiyor (bu paketler kurulu değil).
2. İki ağaç **zaten ayrışmış**: `views/Iletisim.tsx` 9.021 bayt, `pages/Iletisim.tsx` 4.483 bayt. views sürümünde `ContactMap`, `ExternalArrow` bileşeni ve "İletişime başlayın" başlıklı ek bir bölüm var; canlı sürümde yok. Yani yayımlanmamış gerçek iş depoda duruyor.
3. Yeni katkıda bulunan birinin hangi ağacı düzenleyeceğini belirlemesinin güvenilir bir yolu yok.

**Diğer kalite bulguları:**

| # | Öncelik | Bulgu | Kanıt |
|---|---|---|---|
| SW-2 (P2) | 3B alt sistemi tamamen ölü | `architecture3d/` 4 dosya + `ArchitecturalScene.tsx`; 0 monte edilme; 5 sahnede `modelSrc: null` |
| SW-3 (P2) | Kullanılmayan bileşenler | `components/contact/ContactMap.tsx`, `components/ui/InteriorHeroArtwork.tsx`, `components/ui/Marquee.tsx`, `components/home/Engineering.tsx` |
| SW-4 (P2) | Kullanılmayan bağımlılıklar | `three` + `@types/three` (yalnızca ölü `engine.ts` import ediyor); `clsx` + `tailwind-merge` (yalnızca `utils/cn.ts` import ediyor ve `cn.ts` **hiç kullanılmıyor**) → **4 ölü bağımlılık** |
| SW-5 (P3) | Ölü CSS | `.hero-min-h` + `@supports not (height:1svh)` yedeği hiçbir `.tsx`'te kullanılmıyor; `hv-seam`, `hv-compass` gibi sınıflar bu oturumda temizlendi |
| SW-6 (P3) | CSS yapısal kırılganlık | `index.css:71` `:root {` bloğu, satır 78'de `.hero-min-h` ve satır 81'de `@supports` bloğu **iç içe** gelecek biçimde kapatılmamış; blok satır 102'de, özel özellikler iç içe kurallardan **sonra** gelerek kapanıyor. Derlenmiş çıktıda `--ease-out`, `--t-ink`, `--d-step` **doğrulandı: mevcut** → pratikte çalışıyor, ancak native CSS nesting semantiğine ve özellik sırasına bağımlı. Farklı bir minifier sıralamayı değiştirirse tokenlar sessizce kaybolabilir |
| SW-7 (P3) | Yinelenen bildirim | `body` içinde `overflow-x` üç kez (`hidden`, `clip`, sonra tekrar `hidden` — satır 117, 118, 127) | 
| SW-8 (P3) | Ölü kod dalı | `metadata.ts` `ogCrop()`: `if (url.startsWith("/"))` aynı koşulla iki kez; ikincisi erişilemez |
| SW-9 (doğrulanamadı) | Konsol/runtime hataları, hydration, bellek sızıntısı, gereksiz render | Çalıştırma ortamı yok. `CustomCursor` içinde `requestAnimationFrame` döngüsü `useEffect` cleanup'ında `cancelAnimationFrame` ile temizleniyor ve olay dinleyicileri kaldırılıyor → statik olarak sızıntı riski **görünmüyor**, ama davranışsal doğrulama yapılmadı |

**Ortam yapılandırması:** `vite.config.ts` içinde `@` → `src` alias, `react()`, `tailwindcss()`, `viteSingleFile()`. `.env.example` bu çalışma alanında **yok** (orijinal depoda vardı) — ortam değişkeni belgelenmesi eksik. Build yapılandırması temiz; `postbuild` adımı **yok** (prerender'ın kaybolma nedeni).

---

## 13. KVKK VE YASAL BİLGİLENDİRME

### 13.1 Teknik tespitler

| Alan | Durum | Kanıt |
|---|---|---|
| Gizlilik politikası | ✅ Var, kapsamlı | `/gizlilik` — 739 satır; ziyaretçiye açık, `noindex` (doğru: yasal metin dizine girmesin ama erişilebilir olsun) |
| KVKK aydınlatma metni | ✅ Var | Aynı sayfa; `aydınlatma` 5, `veri sorumlusu` 9, `açık rıza` 10, `başvuru` 14, `saklama` 4, `imha` 1, `yurt dışı` 6, `çerez` 8 geçiyor |
| Çerez politikası + yönetimi | ✅ Var | `CookieConsent.tsx`; `localStorage` anahtarı `kuk-cookie-consent`; 3 durum: `accepted` / `declined` / `analytics`; footer'da "Çerez Tercihleri" düğmesi `COOKIE_PREF_EVENT` ile yeniden açıyor |
| Consent Mode v2 | ✅ **Doğru uygulanmış** | Sayfa açılışında `gtag("consent","default", …)` ile `analytics_storage`/`ad_storage` **denied** yazılıyor — bu, etiketler yüklenmeden **önce** yapılıyor. Onay verilince `consent update` + `config`. Reddedilirse `googletagmanager.com` script'i **hiç yüklenmiyor** |
| Açık rıza mekanizması | ✅ Ayrıştırılmış | "Analitik" ayrı bir seçim; yalnızca gerekli çerezler için rıza aranmıyor (doğru yaklaşım) |
| Üçüncü taraf izleme | ✅ Minimal | Tek üçüncü taraf: GA4 (`G-JM9SZ63YJ5`), onaya bağlı. `anonymize_ip: true` ve `send_page_view: false` ayarlanmış. Font ve görsel için harici CDN yok |
| Form veri işleme bilgilendirmesi | ⚠️ Kısmi | Form alanları ve hata durumları açık; ancak formun **hemen yanında** hangi verinin ne amaçla işlendiğine dair kısa bir aydınlatma notu ve gizlilik sayfasına bağlantı **doğrulanamadı** (`ContactForm` içinde `Link` import ediliyor, yani bir bağlantı var; metni ve konumu bu denetimde çıkarılmadı) |
| Veri saklama/imha | ✅ Metinde var | `saklama` 4, `imha` 1 geçiyor; ancak `index.html`'deki iletişim formu açıklaması talebin "her koşulda `contact_submissions` tablosuna yazıldığını" belirtiyor — saklama süresi ve imha politikasının bu tablo için net olup olmadığı **doğrulanamadı** |
| Resmi kimlik bilgileri | ✅ Eksiksiz | Footer'da ünvan (tam ticari unvan), MERSİS `0590139659500001`, Vergi No + dairesi, sicil müdürlüğü, **KEP adresi**. `index.html`'de `author`, `publisher`, `dcterms.rightsHolder` |
| İleti şeması | ✅ | `GeneralContractor` JSON-LD içinde `legalName`, `address`, `geo`, `openingHoursSpecification`, `email`, `telephone` |

### 13.2 Hukuki değerlendirme gerektiren alanlar (bu rapor hüküm vermez)

Aşağıdakiler **teknik tespit değil**, uzman görüşü gerektiren konulardır:

1. **VERBİS kaydı:** Gizlilik metninde `VERBİS` geçmiyor. KUK'ın VERBİS kayıt yükümlülüğü kapsamında olup olmadığı (çalışan sayısı, ciro, ana faaliyet konusu) hukuki değerlendirme gerektirir.
2. **Açık rızanın kapsamı:** İletişim formu gönderiminin hukuki dayanağının (açık rıza mı, sözleşmenin kurulması için zorunlu işleme mi, meşru menfaat mi) metinde doğru sınıflandırıldığı ancak bir hukukçu tarafından teyit edilebilir.
3. **Yurt dışı aktarım:** GA4 kullanımı bir yurt dışı aktarımıdır ve metinde `yurt dışı` 6 kez geçiyor. Aktarımın KVKK m.9 mekanizmalarından hangisine dayandırıldığı hukuki inceleme konusudur.
4. **`contact_submissions` saklama süresi:** Talebin her koşulda veritabanına yazılması, saklama ve imha politikasında bu kategori için belirlenmiş bir süre gerektirir.
5. **Çerez sınıflandırması:** Zorunlu/işlevsel/analitik ayrımının Türkiye mevzuatına ve Kişisel Verileri Koruma Kurulu rehberine uygunluğu hukuki değerlendirmedir.

### 13.3 KVKK bulguları

| # | Öncelik | Bulgu | Etki |
|---|---|---|---|
| KV-1 (P3) | Çerez tercihlerine erişim tek noktadan | Footer'daki "Çerez Tercihleri" düğmesi çalışıyor, ancak gizlilik sayfasından doğrudan bir bağlantı **doğrulanamadı** | Kullanıcı çerez seçimini sonradan değiştirmek istediğinde yolu bulamayabilir |
| KV-2 (P2) | Form yanında kısa aydınlatma notu belirsiz | `ContactForm` içinde gizlilik bağlantısı import ediliyor ama metnin görünürlüğü/yerleşimi doğrulanamadı | Veri sahibi, verisini göndermeden önce işleme amacı hakkında yeterli bilgilendirme alıp almadığını bilemiyor. **İçerik denetimi gerekiyor** |
| KV-3 (bilgi) | Consent Mode kurulumu örnek düzeyde iyi | Olumlu tespit — düzeltme gerektirmiyor |

---

## 14. GÜVEN, KURUMSALLIK VE DÖNÜŞÜM

### 14.1 Mevcut güven unsurları

| Unsur | Durum | Değerlendirme |
|---|---|---|
| Resmi kimlik bilgileri | ✅ Güçlü | Tam ticari ünvan, MERSİS, vergi no + dairesi, ticaret sicili müdürlüğü, **KEP adresi**. BirLtd.Şti.'nin doğrulanabilir tüm kayıtları footer'da. Bu, Türkiye'de kurumsal güven için etkili ve az görülen bir şeffaflık |
| Fiziksel adres + harita | ✅ | `Ovacık Mah. Çuhane Cad. No:176 Başiskele, Kocaeli`; Google Maps gömme + yol tarifi bağlantısı; JSON-LD'de `geo` ve `hasMap` |
| Çalışma saatleri | ✅ | Pazartesi–Cumartesi 09:00–18:00; hem sitede hem JSON-LD'de |
| Doğrudan iletişim | ✅ | Telefon `tel:` ve e-posta `mailto:` bağlantıları header, footer, mobil menü, hero ve iletişim sayfasında |
| Sosyal kanıt | ⚠️ Zayıf | 4 sosyal bağlantı (`sameAs` içinde de) var, ancak **takipçi/içerik kanıtı yok** |
| Hizmet şeffaflığı | ✅ İyi | 5 hizmet, her biri kapsam maddeleriyle; ne yapıldığı net, abartı yok |
| Kanıtlanmış iş | ❌ **Yok** | Portföy boş. Referans, tamamlanmış proje, vaka çalışması yok |
| Fotoğraf | ❌ Yok | Tüm görseller illüstrasyon. Gerçek şantiye, ekip veya tamamlanmış yapı fotoğrafı yok |
| Ekip / insan | ❌ Yok | Kurucu, mühendis kadrosu, organizasyon hakkında hiçbir bilgi yok |
| Sertifika / yetkinlik belgesi | ❌ Yok | ISO, TSE, yapı müteahhitliği belge/yetki sınıfı, İSG, oda kaydı belirtilmemiş |
| Müşteri beyanı | ❌ Yok | (Doğru karar: uydurma beyan eklenmemiş) |
| SSS | ✅ Var | Ana sayfada `Faq` bölümü; içerik niteliği **doğrulanamadı** |
| CTA dili | ✅ İyi | "Teklif Alın", "Birlikte inşa edelim", "Bize ulaşın", "Projenizi konuşalım" — net, satış baskısı yok |
| Dürüstlük | ✅ **Çok güçlü** | Sahte proje, sahte referans, sahte sertifika, sahte istatistik **yok**. Boş portföy için "hazırlanıyor" + `noindex`. Bu, güven inşa etmek için uydurma kanıt üretmeme tercihi ve etik açıdan doğru |

### 14.2 Değerlendirme

Site, **doğrulanabilir resmi kimlik** ile güçlü bir güven temeli kuruyor: bir ziyaretçi MERSİS numarasını Ticaret Sicili'nden, KEP adresini KEP dizininden, adresi haritadan doğrulayabilir. Bu gerçek ve denetlenebilir bir güvendir — çoğu kurumsal sitenin sahip olmadığı türden.

Ancak inşaat sektöründe satın alma kararını belirleyen kanıt türü **yapılmış iştir**. Bir müşteri "bu firma benim ölçekteki işimi daha önce yaptı mı?" sorusuna yanıt arar. Şu anda bu soruya sitede hiçbir yanıt yok. Üstelik bu eksiklik, ana gezinimde "Projelerimiz" başlığıyla **her sayfada görünür** durumda — yani ziyaretçi eksikliği aramak zorunda değil, menüden bir tıkla karşısına çıkıyor.

**Gerçek faaliyetlerle uyumlu, uydurma içermeyen güven fırsatları** (brief'in "olmayan referans/sertifika/deneyim iddialarını önermeye çalışma" kuralına uygun olarak, yalnızca KUK'ın kendi gerçekliğinden üretilebilecekler):

1. **Portföy yerine "çalışma alanları" çerçevelemesi.** Boş bir "Projelerimiz" sayfası yerine, `services.ts`'te zaten var olan teknik kapsamı görselleştiren bir "çalışma alanları / yetkinlik alanları" sayfası. Mevcut veriden üretilir, sahte iddia içermez. (Kodda bu ayrım zaten düşünülmüş: `metadata.ts` boş portföyde `noindex` uyguluyor.)
2. **Belgelenebilir yetkinliklerin yayımlanması.** KUK'ın gerçekten sahip olduğu belge/kayıt varsa (ticaret odası, meslek odası, yapı müteahhitliği yetki belgesi, İSG, kalite belgesi) bunların **gerçek** numaralarıyla yayımlanması. Hiçbiri yoksa hiçbir şey eklenmemeli.
3. **Ekip/kurucu anlatımı.** `Kurumsal` sayfası şu anda 6 soyut değer sunuyor (Teknik Yeterlilik, Kalite Anlayışı…). Gerçek bir kurucu/kadro anlatımı ve gerçek bir fotoğraf, değer listelerinden daha fazla güven üretir. Yalnızca gerçek kişiler ve gerçek fotoğraflarla.
4. **Süreç şeffaflığı.** `Process` bölümü var. Bir projenin KUK'ta nasıl yürüdüğünü aşama aşama anlatmak, kanıtlanmış iş olmadan da teknik yeterlilik sinyali verir — çünkü **yöntem** doğrulanabilir bir uzmanlık göstergesidir.
5. **Menüden "Projelerimiz"i geçici olarak çıkarmak** (SEO-3 ile aynı çözüm). Portföy hazır olana dek boş sayfaya işaret eden bir ana menü öğesi, güven üretmek yerine güven tüketiyor.

---

## 15. P0–P3 ÖNCELİKLİ SORUN LİSTESİ

### P0 — Kritik

| ID | Sayfa/Kapsam | Sorun | Kanıt | Etki | Çözüm | Karmaşıklık |
|---|---|---|---|---|---|---|
| **P0-1** | **Tüm site (üretim)** | **Dört font dosyasının tamamı canlıda HTTP 404.** Manrope ve Inter hiç yüklenmiyor; tüm site `system-ui` yedeğiyle render ediliyor | `https://kukinsaat.com/fonts/{inter-latin-ext,inter-latin,manrope-latin-ext,manrope-latin}.woff2` → 4'ü de **404, 9 bayt**. Canlı CSS'te 4 `@font-face` + 4 harici `url(/fonts/…)`, 0 base64. `index.html` yorumu "Vite tarafından CSS içine gömülür" iddia ediyor — **yanlış** | "Premium" algısının birincil taşıyıcısı olan tipografik kimlik hiçbir ziyaretçiye ulaşmıyor. Başlık/gövde kontrastı, harf aralığı ayarları ve tüm `clamp()` ölçeği yanlış font üzerinde çalışıyor | Kök neden: fontlar depoda base64 olarak `scripts/fonts/*.b64` içinde ve `scripts/restore-assets.mjs` ile geri yükleniyor; bu adım üretim derlemesinde çalıştırılmamış. Çözüm: restore adımını `prebuild`'e bağlamak **veya** woff2 dosyalarını doğrudan `public/fonts/`'a commit etmek **veya** CSS içine base64 gömmek. Sonra `index.html`'deki yanlış yorumu düzeltmek | **Düşük** |
| **P0-2** | **Depo / dağıtım hattı** | **Çalışma alanı, üretim projesinin eksik kopyası.** Prerender ve API hattı yok | Eksik: `scripts/` (prerender.mjs, restore-assets.mjs, seo-check.mjs, shots.mjs, smoke-consent.mjs, prerender-entry.tsx, `fonts/*.b64`, `assets-backup/`), `worker/index.ts`, `wrangler.toml`, `DEPLOYMENT.md`, `.env.example`. Sonuç: yerel `dist/` → h1 **0**, canonical **yok**, görünür metin **0**; canlı → h1 **1**, canonical **var**, **10.038 kelime**. `/api/contact` canlıda 405 (var), yerelde yok | Bu çalışma alanından yapılacak bir dağıtım, canlı sitenin **tüm prerender/SEO kazanımlarını ve form uç noktasını siler**. Ayrıca yerel önizleme üretimi temsil etmediği için tasarım/SEO kararları yanlış veriyle verilir | Eksik dosyaları depodan geri kazandırmak; `package.json`'a `prebuild: restore-assets` ve `postbuild: prerender` adımlarını eklemek. Geri kazandırılana dek bu çalışma alanından **dağıtım yapılmamalı** | **Orta** |

### P1 — Yüksek

| ID | Sayfa | Sorun | Kanıt | Etki | Çözüm | Karmaşıklık |
|---|---|---|---|---|---|---|
| **P1-1** | Site geneli (sosyal) | Varsayılan OG görseli üretimde 404 | `metadata.ts` → `DEFAULT_OG_IMAGE = "…/images/hero-building-sketch-og.jpg"`; canlıda **404**; `src/app/layout.tsx` içinde 3 referans daha | `og:image`'ı bu değere düşen **tüm** rotalar (kurumsal, hizmetler, projeler, iletişim, gizlilik, 404) WhatsApp/LinkedIn/X/Facebook'ta görselsiz paylaşılıyor | Var olan bir görselden 1200×630 JPG üretip `DEFAULT_OG_IMAGE`'ı ona指向 | Düşük |
| **P1-2** | 5 hizmet detayı | OG görseli SVG + etkisiz kırpma parametreleri | `ogCrop(service.image)`; `service.image` = `/images/pagehero-*.svg`; eklenen `?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630` imgix/Pexels sözdizimi, yerel SVG'de etkisiz | Sosyal tarayıcıların çoğu SVG OG görselini render etmez → 5 hizmet sayfası görselsiz paylaşılıyor | `ogCrop`'u yalnızca uzak URL'lere uygulamak; hizmetler için gerçek 1200×630 raster üretmek | Orta |
| **P1-3** | `/projeler` | Portföy tamamen boş ama ana gezinimde | `projects: Project[] = []`; canlıda `noindex, follow`; `site.nav` içinde "Projelerimiz" | İnşaat firmasının birincil güven sinyali yok; menüden tıklayan ziyaretçi boş sayfaya düşüyor; tarama değeri noindex sayfaya akıyor | Portföy hazır olana dek menüden çıkarmak veya "çalışma alanları" çerçevelemesine geçmek (§14.2). Gerçek proje kaydı geldiğinde `noindex` kaldırılmalı | Düşük |
| **P1-4** | Tüm site | 375 KB bölünmemiş JS her rotaya gönderiliyor | `dist/index.html` 475 KB; JS %79; `lazy`/`Suspense` **0**; 5 hero sahnesinin 5'i pakette, 1'i render ediliyor | İlk yükleme ayrıştırma maliyeti; düşük uç mobil cihazda belirgin. LCP/INP'ye etkisi **ölçülemedi** | `viteSingleFile`'ı bırakıp kod bölmeye geçmek veya en azından hero sahnelerini rota bazında bölmek; `Gizlilik` (739 satır) için `lazy` | Orta |
| **P1-5** | İlk ziyaret | 2,2 sn tam ekran açılış perdesi içeriği örtüyor | `Intro.tsx:33,39` → 1450ms `done`, 2200ms kaldırma; `body.style.overflow = "hidden"` | İlk ve en değerli ziyarette marka yerine yükleme ekranı görülüyor; algılanan hız düşüyor. `prefers-reduced-motion` ve tekrar ziyaretlerde atlanıyor (doğru) | Süreyi ~900–1200ms'ye indirmek veya perdeyi içeriğin üzerine bindirmek yerine bir kenar animasyonuna dönüştürmek | Düşük |

### P2 — Orta

| ID | Kapsam | Sorun | Kanıt | Etki | Çözüm |
|---|---|---|---|---|---|
| **P2-1** | Depo | 3 paralel sayfa ağacı; ~25 dosya tip denetimi dışında | `pages/` (canlı, 1.687 satır) · `views/` (ölü, 1.712 satır) · `app/` (ölü, 15 dosya) · `db/` (ölü) · `lib/seo.ts` (ölü); `tsconfig.json` dördünü açıkça `exclude` ediyor | `tsc --noEmit` temiz dönüyor ama **kapsam dar olduğu için**. Hariç dosyalarda `next`, `drizzle-orm`, `pg` çözümlenemiyor. İki ağaç ayrışmış (`views/Iletisim` 9 KB vs `pages/Iletisim` 4,5 KB) — yayımlanmamış gerçek iş var | Tek ağaca karar vermek (mevcut derleme Vite/SPA olduğu için `pages/`), diğerlerini kaldırmak veya ayrı bir dala taşımak; `tsconfig` `exclude`'unu daraltmak |
| **P2-2** | Depo | 3B alt sistemi tamamen ölü | `architecture3d/` 4 dosya + `ArchitecturalScene.tsx`; 0 monte edilme; 5 sahnede `modelSrc: null`; `three` pakette **yok** (doğrulandı) | ~1.000 satır hiç çalıştırılmamış kod; özellik varmış gibi algılanma riski. **Bu rapor 3B'yi canlı bir özellik olarak değerlendirmemiştir** | Ya GLB varlıklarıyla tamamlamak ya da kaldırmak. Ara durum (kod var, özellik yok) en pahalısı |
| **P2-3** | `package.json` | 4 kullanılmayan bağımlılık | `three` + `@types/three` (yalnızca ölü `engine.ts`); `clsx` + `tailwind-merge` (yalnızca `utils/cn.ts`, o da **hiç kullanılmıyor**) | Kurulum süresi, kilit dosyası gürültüsü, tedarik zinciri yüzeyi | Dördünü kaldırmak veya `cn.ts`'i gerçekten kullanmak |
| **P2-4** | `public/images` | 482 KB referanssız görsel (18/23 dosya) | `abstract-*.svg` (128+104+92+76 KB), `hero-building-sketch.svg`, `hero-illustration.svg`, 12 `pagehero-*` varyantı | Dağıtım şişkinliği; hangi varlığın canlı olduğunun belirsizleşmesi. Tarayıcı istemediği için kullanıcıya doğrudan maliyeti yok | Kullanılmayanları kaldırmak veya `assets-backup`'a taşımak |
| **P2-5** | Footer | Alt şerit WCAG AA kontrastını geçemiyor | `Footer.tsx:222` `text-[0.72rem] text-bg/42`; hesaplanan **3.45:1** (`#20262B`) / **3.60:1** (`#0C1115`); gerekli 4.5:1 | © satırı + **Gizlilik & KVKK** + **Çerez Tercihleri** + İletişim bağlantıları 11,5 px ve yetersiz kontrastta. Yasal olarak en önemli bağlantılar en zor okunanlar | Opaklığı ≥`/62`'ye çıkarmak (5.83:1 doğrulandı) |
| **P2-6** | Mobil menü | Kapalı menü bağlantıları odaklanabilir kalıyor | `Header.tsx:89-91` `max-h-0 overflow-hidden opacity-0`; `visibility`/`display:none`/`inert` yok | Klavye kullanıcısı içeriğe ulaşmadan önce görünmeyen 5 nav + telefon + e-posta + sosyal üzerinde sekiyor (WCAG 2.4.3) | Kapalı durumda `inert` veya geçişle uyumlu `visibility: hidden` |
| **P2-7** | Footer, hero | 8,6 px metin | `Footer.tsx:146` `text-[0.54rem]`; Hero'da `0.58rem`, `0.6rem` | Kontrast geçse bile okunabilir değil; `0.5em` harf aralığı durumu ağırlaştırıyor | Mikro etiket tabanını ~0.68rem altına indirmemek |
| **P2-8** | `index.css` | `:root` bloğu iç içe kurallarla kapatılmamış | Satır 71 `:root {` → satır 78 `.hero-min-h` ve satır 81 `@supports` **iç içe** → blok satır 102'de, özel özellikler iç içe kurallardan **sonra** kapanıyor | Derlenmiş çıktıda `--ease-out`, `--t-ink`, `--d-step` **doğrulandı: mevcut** → bugün çalışıyor. Ama native CSS nesting semantiğine ve bildirim sırasına bağımlı; farklı bir minifier tokenları sessizce düşürebilir. Ayrıca `.hero-min-h` hiç kullanılmıyor (ölü CSS) | `:root`'u satır 74'te kapatmak, `.hero-min-h`/`@supports` bloklarını dışarı almak, kullanılmayan `.hero-min-h`'i kaldırmak |
| **P2-9** | Güvenlik başlıkları | CSP ve HSTS tanımlı değil | `public/_headers` içinde yok | XSS'e karşı en etkili katman ve HTTPS zorlama başlığı eksik. Satır içi script/style kullanan tek dosya mimarisi CSP'yi zorlaştırıyor (nonce gerekir) | `_headers`'a HSTS eklemek (düşük risk); CSP'yi `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com` ile başlatmak |
| **P2-10** | Bağımlılıklar | `npm audit` → 2 zafiyet (1 düşük, 1 yüksek) | Kurulum çıktısı | Paket adları ve üretim etkisi **doğrulanamadı** | `npm audit` çıktısını incelemek, `npm audit fix` |
| **P2-11** | `/kurumsal` | 2 kırık görsel (yalnızca yerel derlemede) | `pages/Kurumsal.tsx:111` `/images/hero-architecture.jpg`, `:190` `/images/abstract-projeler.jpg` → yerel `dist/`'te yok. **Canlıda ikisi de 200** | Ortam farkı. Yerel önizlemede Kurumsal sayfası iki boş görsel alanıyla bozuk | P0-2 ile aynı çözüm (varlıkları geri kazandırmak) |
| **P2-12** | Hizmet detayları | Aynı görsel iki hizmette tekrar ediyor | `proje-gelistirme-ve-teknik-koordinasyon` ve `teknik-danismanlik` → aynı `pagehero-kurumsal-plan.svg` | Hizmetler görsel olarak ayırt edilemiyor | Her hizmete ayrı sahne/görsel |

### P3 — Düşük

| ID | Kapsam | Sorun | Kanıt | Çözüm |
|---|---|---|---|---|
| **P3-1** | `public/_redirects` | Catch-all kuralı, dosyanın kendi belgelenmiş gerekçesiyle çelişiyor | Dosya başı yorumu `/* /index.html 200` kuralının **bilinçli olarak kullanılmadığını**, Pages'in sonsuz döngü algılayıp yok saydığını açıklıyor; dosyanın sonuna tam olarak bu kural eklenmiş | Satırı kaldırmak; 404 davranışını prerender ile çözmek |
| **P3-2** | Derleme çıktısı | `dist/404.html` yok | `_redirects` yorumu "bilinmeyen yollar `dist/404.html`'e düşer → HTTP 404" diyor; dosya üretilmiyor | Soft 404 riski. Prerender'a 404 çıktısı eklemek |
| **P3-3** | `sitemap.xml` | `lastmod` 9 URL'de sabit `2026-10-28` | Elle yönetilen yedek dosya; prerender çalışmadığı için güncellenmiyor | P0-2 çözümü bunu da giderir |
| **P3-4** | `metadata.ts` | `ogCrop()` içinde erişilemez ölü dal | `if (url.startsWith("/"))` aynı koşulla iki kez; ikincisi hiç çalışmaz | Ölü dalı silmek |
| **P3-5** | `data/site.ts` | `slogan` ve `tagline` aynı metin, farklı noktalama | `"Kaliteyle Kurulur"` vs `"Kaliteyle Kurulur."` | Tek alana indirmek |
| **P3-6** | `index.css` | `body` içinde `overflow-x` üç kez bildiriliyor | Satır 117 `hidden`, 118 `clip`, 127 `hidden` | Üçüncüyü kaldırmak |
| **P3-7** | Footer | Malzeme dili site geneliyle uyumsuz | Gövde boyunca mineral/düz/mimari dil; footer'da `bg-white/[0.04]` + `backdrop-blur-xl` + `blur-[120px]` renkli ışık küreleri | Cam efekti ve blob'ları sitenin mineral diline yaklaştırmak |
| **P3-8** | `index.html` | Doğrulama iki yöntemle tekrar ediyor | `google-site-verification` meta + `googledc53ece4919de5fe.html` | Birini kaldırmak |
| **P3-9** | `Header.tsx` | Hamburger'de `aria-controls` yok | Satır 69-75, yalnızca `aria-expanded` | `id` + `aria-controls` |
| **P3-10** | Marka dokümantasyonu | Palet kod ile marka referansı arasında sapma | `#626B73` yalnızca yorumda (kod `#5A636B` kullanıyor — kontrast için doğru karar); `#B9B6AE` hiç yok; `#A34E3A` (terracotta) referans paletinde yok ama dördüncü ana renk | Marka rehberini koddaki gerçek paletle güncellemek. `#5A636B` tercihi **korunmalı** (5.10:1 vs ~4.2:1) |
| **P3-11** | `hero-art.css` | `pathLength` bağımlılığı belgelenmemiş | `.hv-draw { stroke-dasharray: 1 }` yalnızca `pathLength` desteklenirse doğru çalışır. Bu oturumda 11 öğe `<path>`'e dönüştürüldü, ancak kural yorum olarak yazılmadı | Dosya başına "`hv-draw` yalnızca `<path>` üzerinde kullanılmalıdır" notu eklemek |
| **P3-12** | `.env.example` | Ortam değişkeni belgelenmesi çalışma alanında yok | Orijinal depoda vardı | P0-2 ile geri kazandırmak |

---

## 16. ÖNERİLEN REVİZYON YOL HARİTASI

Sıralama üç ilkeye göre kuruldu: **(1)** ziyaretçinin gördüğü çıktıyı bozanlar önce, **(2)** yanlış dağıtım riskini ortadan kaldıranlar ikinci, **(3)** kod hijyeni ve iyileştirmeler sonra.

### Faz 0 — Dağıtımı güvenli hâle getir (yarım gün)

Bu faz tamamlanmadan **hiçbir şey dağıtılmamalı**. Şu anki çalışma alanından yapılacak bir dağıtım, canlı sitedeki prerender'ı, canonical'ları, form uç noktasını ve görselleri siler.

1. **P0-2** — `scripts/`, `worker/`, `wrangler.toml`, `DEPLOYMENT.md`, `.env.example` ve tüm `.jpg`/`apple-touch-icon.png` varlıklarını geri kazandır. `package.json`'a `prebuild` (restore-assets) ve `postbuild` (prerender) ekle.
2. Dağıtım öncesi doğrulama: yerel `dist/` içinde `<h1>` sayısı > 0, `rel="canonical"` mevcut, `dist/404.html` var, `dist/fonts/*.woff2` 4 dosya.
3. **P3-1** — `_redirects`'in sonundaki `/* /index.html 200` satırını kaldır (dosyanın kendi gerekçesiyle çelişiyor).

### Faz 1 — Ziyaretçinin gördüğü kusurlar (1 gün)

4. **P0-1** — Font dağıtımını düzelt. En sağlam çözüm: woff2 dosyalarını doğrudan `public/fonts/`'a commit etmek ve base64/restore dolaylılığını kaldırmak. Sonra canlıda 4 URL'nin de 200 döndüğünü doğrula. `index.html`'deki yanlış "CSS içine gömülür" yorumunu düzelt.
5. **P1-1** — Gerçek bir 1200×630 OG görseli üret; `DEFAULT_OG_IMAGE`'ı ve `src/app/layout.tsx` referanslarını güncelle.
6. **P1-2** — `ogCrop()`'u yalnızca uzak URL'lere uygula; hizmet detayları için raster OG üret. (Bu adım **P3-4** ölü dalını da temizler.)
7. **P2-5** — Footer alt şerit opaklığını `/42` → `/62`. Tek satırlık değişiklik, yasal bağlantıları AA'ya taşır.
8. **P2-7** — `text-[0.54rem]` kullanımını kaldır veya ≥0.68rem'e çek.

### Faz 2 — Dönüşüm ve güven (2–4 gün)

9. **P1-3** — Portföy hazır olana dek "Projelerimiz"i ana menüden çıkar; yerine §14.2'deki "çalışma alanları" çerçevelemesini değerlendir. Bu, mevcut `services.ts` verisinden üretilebilir ve **sahte iddia içermez**.
10. **CT-3 / P2-12** — `views/Iletisim.tsx`'teki yayımlanmamış zengin sürümü (ContactMap, "İletişime başlayın" bölümü) gözden geçir; canlı ağaca taşımaya değer mi karar ver. Hizmet detay görsellerini ayrıştır.
11. **P1-5** — Intro perdesini ~1 sn'ye indir.
12. **P2-6** — Mobil menüye kapalı durumda `inert` ekle.
13. **§14.2** — Gerçek belge/kayıt, gerçek ekip fotoğrafı ve süreç şeffaflığı ekle. **Yalnızca doğrulanabilir olanlar**; hiçbir şey uydurulmamalı.

### Faz 3 — Performans (1–2 hafta)

14. **P1-4** — `viteSingleFile`'ı gözden geçir. Kod bölme, rota bazlı `lazy` (özellikle 739 satırlık `Gizlilik` ve 810 satırlık `HeroScenes`), önbellek ayrıştırması. Bu adım **P2-4** (482 KB ölü görsel) ve **AN-1** (5 sahnenin 5'i pakette) bulgularını da çözer.
15. **Ölçüm altyapısı kur** — Bu denetimde Lighthouse ve CWV **ölçülemedi**. Değişikliklerden önce ve sonra lab + alan verisi toplanmalı; aksi hâlde iyileştirmelerin etkisi kanıtlanamaz.
16. **P2-9** — HSTS ekle; CSP'yi kademeli olarak uygula.
17. **P2-10** — `npm audit` çıktısını gider.

### Faz 4 — Kod hijyeni (1 hafta, dağıtımı engellemez)

18. **P2-1** — Tek sayfa ağacına karar ver, diğer ikisini kaldır, `tsconfig` `exclude`'unu daralt. Bu, ~25 dosyayı tip denetimi kapsamına alır.
19. **P2-2** — 3B alt sistemi için karar: tamamla veya kaldır.
20. **P2-3** — 4 ölü bağımlılığı temizle.
21. **P2-8 / P3-6** — `:root` bloğunu düzgün kapat, ölü `.hero-min-h`'i kaldır, yinelenen `overflow-x`'i temizle.
22. **P3-5, P3-7, P3-8, P3-9, P3-11** — Küçük tutarlılık ve belgeleme düzeltmeleri.
23. **P3-10** — Marka rehberini koddaki gerçek paletle eşitle (`#5A636B` kararını **koru**, gerekçesi kontrast).

### Faz 5 — Doğrulanamayan alanları kapat

24. Gerçek tarayıcıda 7 çözünürlükte görsel responsive testi (R-1…R-4, §6).
25. Klavye ile tam gezinme + ekran okuyucu testi (A11Y-6).
26. Form gönderiminin uçtan uca testi — **üretimde değil, bir hazırlık ortamında** (UX-5).
27. KV-1/KV-2 için içerik denetimi; §13.2'deki 5 hukuki konu için uzman görüşü.

---

## 17. GENEL PUANLAMA

Her puan somut bulgulara dayanıyor. **Ölçülemeyen alanlarda puan üretilmemiştir** — bu alanlar ayrıca işaretlenmiştir.

| Alan | Puan | Gerekçe (bulgu referanslarıyla) |
|---|---|---|
| **Marka ve kurumsal kimlik** | **68/100** | Özgün, şablonsuz, gerekçelendirilmiş bir sistem (satır içi logo, tutarlı mineral palet, disiplinli terracotta kullanımı). Kırılan: tipografi üretimde çalışmıyor (**P0-1**) — marka kimliğinin birincil taşıyıcısı fiilen yok. Ayrıca palet kod ile marka referansından sapmış (**P3-10**) ve footer malzeme dili kopuk (**P3-7**). Kod düzeyinde 85+, ziyaretçinin gördüğü gerçeklikte ~55; ağırlıklı ortalama 68 |
| **UI/UX tasarımı** | **76/100** | Asimetrik editoryal hero, eksiksiz form durum makinesi, dürüst hata iletişimi, iyi CTA yerleşimi, mikro etkileşim zenginliği, `ScrollProgress`. Kırılan: boş portföy ana menüde (**P1-3**), 2,2 sn perde (**P1-5**), odak sırası kusuru (**P2-6**), 8,6 px metin (**P2-7**) |
| **Görsel kalite** | **74/100** | 5 özgün animasyonlu satır içi SVG sahne, ortak görsel dil, sıfır jenerik stok görsel, gerçek faaliyeti yansıtan kompozisyonlar. Kırılan: hiç fotoğraf yok (**§14.1**), 482 KB ölü varlık (**P2-4**), bir görsel iki hizmette tekrar (**P2-12**), OG görselleri kırık/SVG (**P1-1, P1-2**) |
| **İçerik kalitesi** | **72/100** | Yazım hatası yok, abartısız ve somut anlatım, kanıtsız iddia yok, dürüst boş durum metni, 739 satırlık gerçek KVKK metni, hizmet bazlı ayrışmış SEO metinleri. Kırılan: portföy boş (**CT-1**), hizmet içerikleri uzmanlık derinliğinden uzak (**§9.3**), yayımlanmamış zengin içerik depoda duruyor (**CT-3**) |
| **SEO** | **71/100** | Canlı sitede güçlü: tam prerender (6/6 rotada h1:1), rota bazlı canonical (eğik çizgi politikası gerekçelendirilmiş), doğru noindex dağıtımı, sitemap'te doğru filtreleme, 2 JSON-LD + rota bazlı BreadcrumbList, kapsamlı yerel SEO sinyalleri, 20+ miras 301 yönlendirmesi, heading hiyerarşisi temiz. Kırılan: OG görsel zinciri bozuk (**P1-1, P1-2**) — sosyal paylaşım çoğu rotada görselsiz; noindex sayfa ana menüde (**P1-3/P2 düzeyi SEO etkisi**); soft 404 riski (**P3-2**); `_redirects` çelişkisi (**P3-1**). *Not: Search Console verisi olmadığı için dizin kapsamı ve sıralama performansı puanlanmadı* |
| **Performans** | **63/100** | Ölçülebilen statik metrikler üzerinden. Güçlü: sıfır üçüncü taraf istek, render-blocking kaynak yok, `three` pakete sızmamış, satır içi SVG ile görsel isteği sıfır, 130 KB gzip. Kırılan: 375 KB bölünmemiş JS (**P1-4**), code-splitting ve önbellek ayrıştırması yok (**PF-2**), 5 hero sahnesinin 5'i her sayfada (**AN-1**), 2,2 sn gövde kilidi (**P1-5**). **LCP / INP / CLS ölçülemedi — bu puan alan verisini yansıtmıyor, yalnızca yapısal maliyeti yansıtıyor** |
| **Mobil uyumluluk** | **70/100 (statik analiz; görsel doğrulama YAPILAMADI)** | Kod düzeyinde olgun: `svh` birimi, `overflow-x: clip` (taşma nedeni yorumla belgelenmiş), mobil için ayrı hero kompozisyonu, 44–48 px dokunma hedefleri, 3 kırılımlı footer grid, `overscroll-contain`. Kırılan: 8,6–11,5 px metinler (**P2-7**), footer kontrastı (**P2-5**), perde mobilde de 2,2 sn (**R-3**). **Taşma/kırpılma/grid bozulması gerçek cihazda test edilmedi; `overflow-x: clip` gerçek bir içerik kaybını maskeliyor olabilir (R-4)** |
| **Erişilebilirlik** | **81/100** | En güçlü alanlardan biri. Kontrast paleti **ölçülerek** kurulmuş (bağımsız hesabım CSS'teki iddia edilen 6.80:1 ve 3.03:1 değerlerini birebir doğruladı), skip link, global focus-visible, 87 doğru `aria-hidden`, semantik HTML, örnek düzeyde form erişilebilirliği (3.3.1 + 3.3.3), iki katmanda `prefers-reduced-motion`, 44–48 px hedefler. Kırılan: footer alt şeridi AA başarısız 3.45:1 (**P2-5**), kapalı menü odaklanabilir (**P2-6**), 8,6 px metin (**P2-7**), `aria-controls` eksik (**P3-9**). *Ekran okuyucu ve gerçek klavye testi yapılmadı* |
| **Teknik yazılım kalitesi** | **54/100** | En zayıf alan. Olumlu: temiz veri soyutlaması, tek kaynak metadata mimarisi, alışılmadık derecede yüksek yorum kalitesi (kararların nedeni belgelenmiş), anlamlı klasör yapısı, doğru XSS kaçınması (`textContent`, `dangerouslySetInnerHTML` yok). Kırılan: 3 paralel sayfa ağacı ve tip denetimi dışında ~25 dosya (**P2-1**), tamamen ölü 3B alt sistemi (**P2-2**), 4 ölü bağımlılık (**P2-3**), 482 KB ölü varlık (**P2-4**), ölü CSS ve iç içe `:root` kırılganlığı (**P2-8**), ölü kod dalları (**P3-4**) |
| **Güvenlik** | **70/100** | Statik analiz ve zararsız sondalar üzerinden. Güçlü: `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, kısıtlayıcı `Permissions-Policy`, `immutable` font önbelleği, kaynakta gizli bilgi yok, `dangerouslySetInnerHTML` yok, form uç noktasında sunucu doğrulaması + IP hız sınırı tasarlanmış, GA4 onaya bağlı. Kırılan: CSP ve HSTS yok (**P2-9**), 2 bağımlılık zafiyeti (**P2-10**), yerel derlemede uç nokta yok (**SEC-3**). *Sızma testi yapılmadı; canlı uç nokta davranışı yalnızca `405` durum koduyla doğrulandı* |
| **Güven ve dönüşüm** | **58/100** | Güçlü: doğrulanabilir resmi kimlik (MERSİS, vergi, sicil, **KEP**), fiziksel adres + harita + `geo`/`hasMap`, çalışma saatleri, çok noktadan doğrudan telefon/e-posta, net ve baskısız CTA dili, SSS bölümü, **ve hiçbir uydurma kanıt yok**. Kırılan: kanıtlanmış iş yok (**CT-1**), fotoğraf yok, ekip yok, sertifika/yetkinlik belgesi yok, müşteri beyanı yok — ve bu eksiklik ana menüden bir tıkla görünür durumda (**P1-3**). İnşaat sektöründe satın alma kararını belirleyen kanıt türü tam olarak budur |

### Ölçülemeyen alanlar — puan verilmemiştir

- **Core Web Vitals alan verisi (LCP / INP / CLS)** — CrUX/RUM erişimi yok
- **Lighthouse lab puanları** — çalıştırılamadı
- **Search Console dizin kapsamı ve arama performansı** — erişim yok
- **GA4 dönüşüm hunisi** — erişim yok
- **Gerçek cihaz/tarayıcı responsive davranışı** — ortamda tarayıcı yok
- **Ekran okuyucu ve klavye davranışı** — test edilmedi
- **Form uçtan uca gönderimi** — üretim sistemine veri gönderilmedi

---

## 18. SON DEĞERLENDİRME

> ### "KUK İnşaat'ın web sitesi bugün yüksek prestijli ve profesyonel bir inşaat-mühendislik şirketinin dijital vitrini olabilecek seviyede mi?"

**Kısmen — evet ama kritik bir şartla.**

**Tasarım niyeti ve mühendislik disiplini açısından: evet.** Bu bir şablon değil. Kararlar gerekçelendirilmiş ve belgelenmiş: canonical'ın neden sonda eğik çizgi taşıdığı, `overflow-x: hidden` yerine neden `clip` kullanıldığı, neden mükerrer JSON-LD basılmadığı, neden yasal sayfaların robots.txt ile değil `noindex` ile yönetildiği — hepsi kodda açıklanmış. Kontrast paleti tahminle değil ölçülerek kurulmuş ve bağımsız hesabım bu ölçümleri birebir doğruladı. Erişilebilirlik, KVKK ve Consent Mode v2 uygulaması, Türkiye'deki kurumsal inşaat sitelerinin büyük çoğunluğunun belirgin biçimde üzerinde. İçerik dürüstlüğü örnek düzeyde: boş bir portföy için uydurma proje, referans veya istatistik üretilmemiş; bunun yerine sayfa `noindex`'e alınmış. Hero görselleri, jenerik stok fotoğraf yerine elle kurulmuş, ortak bir dil paylaşan animasyonlu mimari sahneler. Bu, "premium" hedefine bilinçli olarak çalışılmış bir projedir.

**Ziyaretçinin fiilen gördüğü çıktı açısından: hayır, bugün değil.** Çünkü sitenin prestij algısını taşıyan **birincil kanal üretimde çalışmıyor**. Dört font dosyasının tamamı canlıda 404 dönüyor; Manrope ve Inter hiçbir ziyaretçiye ulaşmıyor. Tipografi, "yüksek prestij" algısının en güçlü ve en ucuz taşıyıcısıdır — tüm `clamp()` ölçeği, harf aralığı ayarları ve başlık/gövde kontrastı doğru font varsayımıyla tasarlanmış ve şu anda yanlış font üzerinde render ediliyor. Yani ekip doğru işi yapmış ama doğru iş ziyaretçiye ulaşmıyor. Buna varsayılan OG görselinin de 404 olması ekleniyor: site sosyal medyada paylaşıldığında çoğu rota görselsiz görünüyor — ilk izlenimin oluştuğu ikinci kanal da kırık.

**Üçüncü ve yapısal engel: kanıt yokluğu.** İnşaat sektöründe prestij, iddiayla değil yapılmış işle kanıtlanır. Sitede tamamlanmış proje, gerçek şantiye fotoğrafı, ekip, sertifika veya müşteri beyanı yok. Buna karşılık resmi kimlik bilgileri (MERSİS, vergi, sicil, KEP) eksiksiz ve doğrulanabilir — bu gerçek bir güven temeli. Yani site "yasal olarak güvenilir" ama "mesleki olarak kanıtlanmış" değil. Üstelik bu boşluk gizlenmemiş: ana menüdeki "Projelerimiz" her sayfadan bir tıkla boş duruma götürüyor.

**Özet hüküm:** Vitrinin **iskeleti ve malzemesi** prestijli bir inşaat-mühendislik firmasını taşıyabilecek kalitede; **teslimatı** bozuk ve **içindeki kanıt** eksik. İyi haber şu ki en kritik iki kusur yeniden tasarım gerektirmiyor — dağıtım hattının doğru çalıştırılmasıyla gideriliyor.

### En mantıklı revizyon sıralaması

**Önce (bu hafta):**
1. **Dağıtımı kilitle.** Çalışma alanı üretim hattının eksik kopyası; şu an dağıtım yapmak canlıdaki prerender'ı, canonical'ları ve form uç noktasını siler (**P0-2**, ardından **P3-1**).
2. **Fontları düzelt.** Tek değişiklik, en yüksek görsel etki (**P0-1**).
3. **OG görsel zincirini onar** (**P1-1**, **P1-2**) — düşük maliyet, sosyal ilk izlenimi doğrudan etkiler.
4. **Footer kontrastı ve 8,6 px metin** (**P2-5**, **P2-7**) — birkaç satırlık değişiklik, yasal bağlantıları okunabilir yapar.

**Sonra (2–4 hafta):**
5. **Portföy boşluğunu stratejik olarak ele al** (**P1-3** + §14.2): menüden çıkar veya "çalışma alanları" çerçevelemesine geç. Gerçek proje kaydı geldiğinde `noindex`'i kaldır.
6. **Güven kanıtı ekle — yalnızca gerçek olanları** (§14.2): belgelenebilir yetkinlikler, gerçek ekip, süreç şeffaflığı. Hiçbir şey uydurulmamalı.
7. **Intro perdesini kısalt** (**P1-5**) ve **mobil menü odağını düzelt** (**P2-6**).
8. **Yayımlanmamış içeriği değerlendir** (**CT-3**): `views/` ağacındaki zengin İletişim sürümü canlıya taşınmaya değer mi?

**Daha sonra (1–2 ay):**
9. **Performans mimarisi** (**P1-4**): tek dosya yaklaşımını gözden geçir, kod böl, ölü varlıkları temizle (**P2-4**).
10. **Ölçüm altyapısı kur:** Lighthouse + CWV alan verisi. Bu denetimde ölçülemedi; ölçüm olmadan iyileştirmelerin etkisi kanıtlanamaz.
11. **Güvenlik başlıkları** (**P2-9**) ve **bağımlılık zafiyetleri** (**P2-10**).

**En son (sürekli bakım):**
12. **Depo hijyeni** (**P2-1**, **P2-2**, **P2-3**, **P2-8**): tek sayfa ağacı, ölü 3B kararı, ölü bağımlılıklar, CSS yapısı. Dağıtımı engellemez ama her sonraki değişikliğin maliyetini ve hata riskini düşürür.
13. **Doğrulanamayan alanları kapat** (Faz 5): gerçek tarayıcıda responsive test, klavye/ekran okuyucu testi, hazırlık ortamında form testi, KVKK hukuki incelemesi.

**Bu sıralamanın mantığı:** 1–4 dağıtımı güvenli hâle getirir ve ziyaretçinin gördüğü çıktıyı düzeltir (düşük maliyet, yüksek etki). 5–8 dönüşüm hunisini onarır. 9–11 ölçeklenebilirlik ve ölçülebilirlik sağlar. 12–13 uzun vadeli bakım maliyetini düşürür. Ters sıralama — önce kod hijyeni, sonra font — en yaygın hatadır: depo temizlenirken ziyaretçi yanlış fontla siteyi görmeye devam eder.

---

*Bu rapor salt okunur bir denetim ürünüdür. Denetim sırasında hiçbir kaynak dosya, tasarım, bağımlılık veya canlı sistem değiştirilmemiştir. Üretim sistemine yalnızca zararsız `GET` istekleri gönderilmiş; `/api/contact` uç noktasına veri gönderilmemiştir. Ölçülemeyen alanlar için puan veya metrik üretilmemiş, "doğrulanamadı" olarak işaretlenmiştir.*
