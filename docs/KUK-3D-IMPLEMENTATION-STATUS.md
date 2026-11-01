# KUK İnşaat — 3D Uygulama Durumu

Son güncelleme: ortak 3D altyapı oturumu. Bu dosya model üretimi ve sayfa entegrasyonu sırasında adım adım güncellenmelidir.

## Altyapı kontrol listesi

| Konu | Durum | Kanıt / not |
| --- | --- | --- |
| Next.js/React projesine uyum | PASS | Next.js App Router / React Client Component; TypeScript ve production build. |
| Tekrarlanabilir sahne bileşeni | PASS | `ArchitecturalScene` poster-first bileşeni, beş ayrı sahne anahtarı. |
| Kamera ve ışık presetleri | PASS | `scenes.ts` — beş bağımsız kamera/ışık konfigürasyonu; gerçek sahneler henüz yok. |
| Merkezi marka malzeme profilleri | PASS | `palette.ts`, glTF'de yalnızca açık `KUK_...` etiketiyle uygulanır. |
| GLB/glTF yükleyici | PASS | Three.js `GLTFLoader.parseAsync` ile geçici test GLB'si Chromium'da yüklendi. |
| Sayfa bazlı model varlıkları | NOT STARTED | Her beş `modelSrc` alanı `null`; bu oturumda model üretilmedi. |
| Page hero entegrasyonu | NOT STARTED | Mevcut beş sayfa/arka plan/HTML aynen kaldı. |
| Açılış ve opt-in glTF animasyon kontrolü | PASS | Test GLB animasyonu başlatıldı; Durdur/Oynat kontrolü çalıştı. |
| Kontrollü pointer/scroll kamera hareketi | PARTIAL | Etkileşim kodu ve değer sınırları mevcut; gerçek mimari model üzerindeki sanat yönü model gelince test edilecek. |
| Poster ilk kare ve hata fallback'i | PASS | İlk karede poster; eksik GLB ve WebGL context loss sonrası poster korundu. |
| Görünürlük bazlı lazy load | PASS | Görünür GLB için bir istek; viewport dışındaki eksik model için kaydırmadan önce sıfır istek, sonra bir istek. |
| Ekran görünmüyorken render askıya alma | PARTIAL | IntersectionObserver + visibilitychange ile RAF iptali uygulandı; gerçek modelde GPU profil testi bekliyor. |
| DPR, resize ve mobil kalite | PASS / PARTIAL | ResizeObserver, DPR 1.6/1.25; mobil poster modunda GLB ve canvas isteği **0**. Gerçek mobil GPU ölçümü bekliyor. |
| `prefers-reduced-motion` | PASS | Testte poster, canvas **0**, GLB isteği **0**. |
| WebGL context loss | PASS | Chromium `WEBGL_lose_context`: durum `error`, poster opaklık 1. |
| Bellek temizliği | PARTIAL | Unmount/abort/dispose kodu mevcut; uzun oturum GPU bellek profili gerçek modelle yapılmalı. |
| Mevcut site regresyonu | PASS | Ana Sayfa/Kurumsal masaüstü görüntü farkı sırasıyla yaklaşık %0.69 / %0.27 (mevcut SVG animasyonu/zaman farkı); sayfalarda canvas **0**. |
| Yeni mimari GLB üretimi | NOT STARTED | Görev sınırı gereği bu oturumda üretilmedi. |
| Lighthouse / saha cihaz performansı | BLOCKED | Gerçek modeller ve gerçek kullanıcı cihazları olmadan anlamlı ölçüm yok. |

## Testlerin kapsamı

- Test ortamı: yerel production build + Playwright Chromium (yazılımsal WebGL).
- Kullanılan geometri yalnızca **geçici test GLB** idi; üretim veya müşteri sahnesi değildir. QA rotası ve fixture finalden önce kaldırılır.
- WebGL yoksa, model 404 dönerse veya context kaybı olursa kullanıcı mevcut statik posteri görür.
- `modelSrc: null` olduğundan mevcut sitenin JS bundle'ına Three.js sahnesi eklenmez.
- Üretim bağımlılık denetimi (`npm audit --omit=dev`) 6 bulgu raporladı; bunların arasında Next.js için kritik bulgu var, ancak yeni eklenen `three` / `@types/three` doğrudan listelenmiyor. Bağımlılık güvenliği sürüm değişiklikleri bu oturumun kapsamı dışındadır; yayına çıkmadan ayrıca değerlendirilmelidir.

## Sonraki oturumlar

1. Ana Sayfa için **gerçek** yapısal kesit modeli; beton, temel, döşeme ve merdivenlerin mühendislik kontrolü; poster ve WebGL görüntüsünün kadraj eşleşmesi.
2. Kurumsal için pafta ve çizim aletleri modeli.
3. Hizmetler için fiziksel vinç + kiriş bağlantısı ve opt-in glTF klipleri.
4. Projeler için **temsili** mimari yapı modeli; gerçek referans gibi sunulmayacak.
5. İletişim için **temsili** vaziyet maketi; gerçek harita iddiası olmayacak.
6. Her sahnenin masaüstü/mobil gerçek cihaz performansı, WebGL fallback'i, erişilebilirlik ve görsel sanat yönetimi onayı.
