export type ServiceIcon = "build" | "engineer" | "coordinate" | "manage" | "consult";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: ServiceIcon;
  summary: string;
  description: string;
  scope: string[];
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    slug: "insaat-ve-yapi-uygulamalari",
    title: "İnşaat ve Yapı Uygulamaları",
    shortTitle: "İnşaat & Uygulama",
    icon: "build",
    summary:
      "Konut, ticari ve karma kullanımlı yapıların inşaat sürecini baştan sona yürütüyoruz.",
    description:
      "Kaba yapıdan ince işlere kadar uygulama kalemleri, proje kapsamı ve iş programı doğrultusunda ele alınır. Saha organizasyonu, malzeme tedariki ve imalat kalitesi proje başında belirlenen standartlara göre takip edilir. Amaç, projedeki çözümü sahada uygulanabilir biçimde hayata geçirmek ve uzun ömürlü bir yapı teslim etmektir.",
    scope: [
      "Saha organizasyonu ve uygulama planlaması",
      "Yapı elemanlarının imalat ve montaj koordinasyonu",
      "Malzeme ve detay kontrolü",
      "Kalite ve süreç takibi",
    ],
    image:
      "/images/abstract-kurumsal.jpg",
    imageAlt: "Taş kemerler ve grafit kütlelerle soyut mimari kompozisyon",
  },
  {
    slug: "muhendislik-hizmetleri",
    title: "Mühendislik Hizmetleri",
    shortTitle: "Mühendislik",
    icon: "engineer",
    summary:
      "Taşıyıcı sistem ve yapı mühendisliği kararlarını hesaplamalara ve uygulama koşullarına dayandırıyoruz.",
    description:
      "Yapının güvenliği ve performansı, tasarım aşamasında alınan mühendislik kararlarıyla belirlenir. Taşıyıcı sistem tercihleri, detay çözümleri ve uygulama yöntemleri; ilgili yönetmelikler, statik hesaplar ve sahadaki uygulanabilirlik birlikte gözetilerek değerlendirilir.",
    scope: [
      "Teknik değerlendirme ve ön inceleme",
      "Taşıyıcı sistem yaklaşımı",
      "Uygulama detaylarının mühendislik kontrolü",
      "Performans ve güvenlik odaklı kararlar",
    ],
    image:
      "/images/abstract-hizmetler.jpg",
    imageAlt: "Çelik, cam ve beton birleşimini gösteren soyut mühendislik görseli",
  },
  {
    slug: "proje-gelistirme-ve-teknik-koordinasyon",
    title: "Proje Geliştirme ve Teknik Koordinasyon",
    shortTitle: "Proje & Koordinasyon",
    icon: "coordinate",
    summary:
      "Mimari, statik ve mekanik projeleri tek bir uygulama bütünü hâline getiriyoruz.",
    description:
      "Mimari, statik, elektrik ve mekanik projeler çoğu zaman ayrı ekiplerce hazırlanır. Biz bu projeleri uygulama öncesinde karşılaştırır, aralarındaki uyumsuzlukları tespit eder ve çözüme kavuştururuz. Böylece sahada ortaya çıkabilecek değişiklikler, gecikmeler ve ek maliyetler en aza iner.",
    scope: [
      "Disiplinler arası koordinasyon",
      "Uygulama projelerinin teknik gözden geçirilmesi",
      "Detay ve birleşim çözümleri",
      "İmalat öncesi teknik onay",
    ],
    image:
      "/images/abstract-projeler.jpg",
    imageAlt: "Mimari plan üzerinde yükselen çağdaş yapı kütleleri",
  },
  {
    slug: "proje-ve-uygulama-sureclerinin-yonetimi",
    title: "Proje ve Uygulama Süreçlerinin Yönetimi",
    shortTitle: "Süreç Yönetimi",
    icon: "manage",
    summary:
      "Süre, bütçe ve kalite hedeflerini iş programı üzerinden birlikte takip ediyoruz.",
    description:
      "Her projeye başlarken iş programı, bütçe planı ve kalite kontrol noktalarını belirleriz. Süreç boyunca ilerlemeyi bu plan üzerinden izler, iş sahibine düzenli olarak raporlarız. Olası gecikme ve değişiklikler önceden öngörülerek yönetilir.",
    scope: [
      "İş programı ve süreç planlaması",
      "Risk ve değişim yönetimi",
      "Kalite kontrol planı",
      "Raporlama ve şeffaf iletişim",
    ],
    image:
      "/images/hero-architecture.jpg",
    imageAlt: "Mineral tonlarda geometrik cepheli mimari kompozisyon",
  },
  {
    slug: "teknik-danismanlik",
    title: "Teknik Danışmanlık",
    shortTitle: "Danışmanlık",
    icon: "consult",
    summary:
      "Mevcut projelerinizi ve uygulama kararlarınızı bağımsız bir gözle değerlendiriyoruz.",
    description:
      "Yatırım kararı öncesinde ya da devam eden bir işte; projelerin incelenmesi, uygulama yöntemlerinin karşılaştırılması ve olası risklerin tespiti konusunda destek veriyoruz. Hizmet kapsamı, işin aşamasına ve iş sahibinin ihtiyacına göre belirlenir.",
    scope: [
      "Proje ve uygulama gözden geçirme",
      "Teknik risk değerlendirmesi",
      "Alternatif çözüm analizi",
      "Süreç ve kalite önerileri",
    ],
    image:
      "/images/abstract-iletisim.jpg",
    imageAlt: "Topoğrafik çizgiler ve bağlantı noktalarıyla soyut iletişim görseli",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}