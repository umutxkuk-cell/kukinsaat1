# KUK İnşaat — aktif görsel yönü

Aktif hero arka planları ve içerik sahneleri **mimari teknik illüstrasyon** ailesindedir. Görsellerde başlık, harf, logo veya pazarlama metni yoktur; ana renkler mineral kırık beyaz (`#EEEAE2`), mühendislik mavisi (`#1F435C`) ve ölçülü terracotta (`#A34E3A`) vurgusudur.

| Sayfa | Aktif dosya | İlk bakışta anlatım |
| --- | --- | --- |
| Ana Sayfa | `public/images/hero-section-cut.svg` | Radye temel, üç kolon aksı, katlar, iç merdivenler ve ölçülerle bina kesiti |
| Kurumsal | `public/images/pagehero-kurumsal-plan.svg` | Plan paftası, T-cetvel ve pergel ile mimari proje masası |
| Hizmetlerimiz | `public/images/pagehero-hizmetler-site.svg` | Kule vinç, donatı, iskele ve yerine indirilen kirişle faal şantiye |
| Projelerimiz | `public/images/pagehero-projeler-facade.svg` | Cam yüzeyli, üç kütleli tamamlanmış modern yapı (temsili) |
| İletişim | `public/images/pagehero-iletisim-siteplan.svg` | Temsili vaziyet planı üzerinde hedef parsel ve konum iğnesi |

Sayfa eşleşmeleri `src/components/ui/Illustration.tsx`; içerik kartları `src/components/ui/SceneArt.tsx` içindedir. Konum kartındaki plan gerçek harita **değildir**; ziyaretçi “Haritayı göster” dediğinde gerçek Google Haritalar içeriği ayrıca yüklenir.

Vinç yükü ve konum nabzı hareketleri `prefers-reduced-motion` tercihinde devre dışıdır. Önceki görsel sürümleri farklı adlarla saklanmıştır, **aktif sayfalarda kullanılmaz**.
