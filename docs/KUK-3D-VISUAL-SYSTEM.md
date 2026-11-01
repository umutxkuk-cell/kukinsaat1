# KUK İnşaat — Ortak 3D Görsel Altyapısı

> **Bu oturumun kapsamı yalnızca altyapıdır.** Beş sayfanın 3D modelleri henüz oluşturulmadı; mevcut SVG posterler, sayfa yerleşimleri, başlıklar, header, footer ve SEO ayarları değişmedi.

## Teknoloji kararı

- **Next.js 16 App Router + React 19 + TypeScript**: mevcut uygulama altyapısı.
- **Three.js 0.187.0**: tek 3D runtime bağımlılığı. React Three Fiber / ek post-processing yüklenmedi; sahneler ve etkileşimler doğrudan Three.js ile yönetiliyor.
- **`@types/three` 0.187.0**: TypeScript bildirimleri.
- **GLB / glTF 2.0**: `GLTFLoader.parseAsync` ile yüklenir. Geliştirme için düz GLB tercih edilir (tek istek, gömülü materyaller/dokular). Draco/meshopt sıkıştırması bu aşamada eklenmedi; kullanılırsa önce ilgili decoder yüklenmelidir.

Resmî API referansları: [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading).

## Dosya mimarisi

| Dosya | Görev |
| --- | --- |
| `src/lib/architecture3d/types.ts` | Beş sahne kimliği, tipli kamera/ışık/hareket ayarları, durumlar ve engine arayüzü. |
| `src/lib/architecture3d/palette.ts` | Merkezi marka renkleri ve PBR malzeme profilleri. |
| `src/lib/architecture3d/scenes.ts` | Beş sayfanın bağımsız kamera, ışık, poster, mobil ve animasyon konfigürasyonu. Model adresleri **şimdilik `null`**. |
| `src/lib/architecture3d/engine.ts` | Tarayıcıda dinamik yüklenen Three.js renderer, glTF yükleyici, kamera/ışık, model normalleştirme, görünürlük ve GPU kaynak temizliği. |
| `src/components/architecture3d/ArchitecturalScene.tsx` | SSR uyumlu poster-first React kapsayıcı, lazy 3D aktivasyonu, mobil/reduced-motion fallback, hata ve animasyon denetimleri. |

## Bir sayfaya model bağlama (sonraki aşama)

1. Blender veya eşdeğer gerçek 3D modelleme aracıyla **fiziksel olarak inandırıcı** sahneyi hazırlayın. Ölçü birimlerini ve Y-up koordinat sistemini kontrol edin; malzeme, gölge ve geometriyi model dosyasında gerçek şekilde üretin. Birkaç primitive kutu kullanıp bitmiş mimari görselleştirme olarak sunmayın.
2. Optimize edilmiş GLB dosyasını örneğin `public/models/kuk-home.glb` konumuna ekleyin. Şu anda `public/models/` altında model yoktur.
3. `src/lib/architecture3d/scenes.ts` içindeki ilgili `modelSrc` alanını `/models/kuk-home.glb` gibi yerel bir URL'ye çevirin. Kurumsal, Hizmetler, Projeler ve İletişim için ayrı dosya ve sahne ayarları kullanın.
4. Mevcut hero görseli yerine (veya onu poster olarak koruyarak) ilgili sayfada aşağıdaki bileşeni **sonraki oturumda** yerleştirin. Bu oturumda sayfalara dokunulmadı:

```tsx
import { ArchitecturalScene } from "@/components/architecture3d/ArchitecturalScene";

<div className="relative h-full w-full">
  <ArchitecturalScene scene="home" className="relative h-full w-full" posterFit="contain" decorative />
</div>
```

Kapsayıcı elementin hesaplanabilir bir yüksekliği olmalıdır. Model yokken bile poster görünür; sayfa metinleri 3D beklemez.

## Kamera ve kompozisyon

`scenes.ts` her sayfa için bağımsız `camera` ve `lighting` tanımlar. İlk model içeriği yüklendikten sonra `Box3` ile sınırları bulunur ve en büyük boyut iki birime normalleştirilir. Kamera başlangıç konumundan son açısına yalnızca kısa süreli, yumuşak bir geçiş yapar. Sonrasında bina otomatik dönmez.

İsteğe bağlı masaüstü pointer ve scroll perspektif sapmaları küçük değerlerle sınırlıdır. Mobilde pointer hareketi uygulanmaz. Kullanıcının hareketi yoksa ve oynayan bir glTF klibi bulunmuyorsa tekrar render planlanmaz.

### Sayfa bağlamları

| Sahne | İlk poster | Kamera niyeti | Mobil |
| --- | --- | --- | --- |
| `home` | `/images/hero-section-cut.svg` | 3/4 kesit, güçlü temel ve taşıyıcı sistem | Poster |
| `kurumsal` | `/images/pagehero-kurumsal-plan.svg` | Yüksekten proje stüdyosu | Poster |
| `hizmetler` | `/images/pagehero-hizmetler-site.svg` | Şantiye ve vinç ilişkisi | Poster |
| `projeler` | `/images/pagehero-projeler-facade.svg` | Cephe/kütle ilişkisi, temsili | Poster |
| `iletisim` | `/images/pagehero-iletisim-siteplan.svg` | Vaziyet maketi, temsili | Poster |

## Malzeme sistemi

Marka renkleri `palette.ts` içinde merkezi olarak tanımlıdır. Beton, brüt beton, taş, çelik, alüminyum, grafit, terracotta ve cam için ayrı roughness/metalness profilleri vardır. Cam için `MeshPhysicalMaterial` transmission/IOR kullanılır.

**Önemli:** Modelden gelen gerçek dokular **otomatik olarak silinmez**. Yalnızca sanatçı tarafından `KUK_CONCRETE`, `KUK_STONE`, `KUK_STEEL`, `KUK_GLASS`, `KUK_TERRACOTTA` gibi açıkça adlandırılan malzemelere marka profili uygulanır. Fotoğrafik kalite için uygun PBR doku ve ışık kurulumu yine gerçek modelleme aşamasında gereklidir.

## Yükleme ve performans

- Poster SSR çıktısında hazırdır. Model adresi boşsa **canvas ve Three.js isteği yoktur**.
- Model tanımlandığında `IntersectionObserver` ile sahne görünür hâle gelince 3D engine ayrı bir JS paketinde dinamik içe aktarılır. Model `fetch` üzerinden aynı origin'den istenir; GLB/glTF parse edilir.
- İlk 3D kare çizilmeden poster kaybolmaz. WebGL veya model yükleme hatasında poster kalır, yeniden deneme kontrolü sunulur.
- Masaüstü DPR **1.6**, isteğe bağlı düşük kaliteli mobil WebGL DPR **1.25** ile sınırlanır. Mobilde varsayılan `mobileMode: "poster"`dır.
- Renderer yalnızca açılış hareketi, kullanıcı etkileşimi veya sanatçının opt-in glTF animasyon klibi sırasında kare çizer. `IntersectionObserver` ve `visibilitychange` görünmeyen sahneyi durdurur.
- Oynayan glTF klibi varsa görünür **Durdur/Oynat** butonu vardır. Otomatik bina rotasyonu yoktur.
- `prefers-reduced-motion: reduce` durumunda 3D yüklenmez; statik poster görünür.
- `webglcontextlost` olayında poster geri gelir. Unmount/abort sırasında ağ isteği iptal edilir, ResizeObserver/dinleyiciler kaldırılır, geometri/malzeme/doku ve renderer dispose edilir.

## Testler ve sınırlar

Geçici bir test sayfası ve **test amaçlı üçgen GLB** ile Chromium'da gerçek WebGL yükleme, poster-first geçiş, glTF animasyon durdur/oynat, eksik model fallback, context-loss fallback, mobil ve reduced-motion isteksiz poster davranışı denetlendi. Test sayfası ve GLB final teslimattan önce kaldırılır; hiçbir müşteri sayfasında test modeli sunulmaz.

**Henüz yapılmadı:** Beş mimari 3D model, gerçek mimari malzeme dokuları, mobil optimize model ve sayfa entegrasyonu. Bu alanlar model üretim sürecine bağlıdır; bugünkü altyapı bunları varmış gibi göstermez. Gerçek cihaz GPU performansı bu sandbox'ta doğrulanamaz.
