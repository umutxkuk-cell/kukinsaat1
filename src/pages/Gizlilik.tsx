import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

/** Yürürlük tarihi — 28.10.2026 (6698 s. KVKK ve ikincil mevzuat gözden geçirilmiştir). */
const GUNCELLEME = "28.10.2026";

type Madde = { no: string; baslik: string; govde: React.ReactNode };

const maddeler: Madde[] = [
  {
    no: "1",
    baslik: "Aydınlatma Metninin Konusu ve Kapsamı",
    govde: (
      <>
        <p>
          İşbu Gizlilik Politikası ve Kişisel Verilerin İşlenmesine İlişkin Aydınlatma
          Metni (“<strong>Metin</strong>”); 6698 sayılı Kişisel Verilerin Korunması
          Kanunu (“<strong>KVKK</strong>”), 7499 sayılı Kanun ile 9. maddede
          yapılan değişiklikler, 10.07.2024 tarihli ve 32598 sayılı Resmî Gazete’de
          yayımlanan yurt dışına aktarım Yönetmeliği, Kişisel Verileri Koruma Kurulu’nun (“
          <strong>Kurul</strong>”) ikincil düzenlemeleri ile Aydınlatma Yükümlülüğü
          Hakkında Tebliğ (RG 10.03.2018/30364), 18.02.2026 tarihli 2026/347 sayılı
          Kurul İlke Kararı ve ilgili sair mevzuat (5651 sayılı
          Kanun, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, 6502
          sayılı TKHK) uyarınca; <strong>{site.legalName}</strong> (“
          <strong>Şirket</strong>”, “<strong>KUK İnşaat</strong>” veya “
          <strong>Veri Sorumlusu</strong>”) tarafından işletilmekte olan kukinsaat.com
          alan adlı internet sitesi (“<strong>Site</strong>”), Site üzerinden sunulan
          hizmetler ve iletişim kanalları aracılığıyla işlenen kişisel veriler
          bakımından veri sahiplerinin KVKK’nın 10. ve 11. maddeleri kapsamında
          aydınlatılması amacıyla hazırlanmıştır.
        </p>
        <p>
          İşbu Metin; Site’de yer alan harici bağlantılara ve üçüncü taraf
          platformlarına (Instagram, LinkedIn, Facebook/X, Google Maps, görsel CDN
          hizmetleri dâhil ancak bunlarla sınırlı olmamak üzere) ilişkin hüküm
          içermez. Anılan platformlar kendi gizlilik politikalarına tâbi olup;
          üçüncü taraf içeriklerinden ve uygulamalarından Şirketimiz sorumlu
          tutulamaz.
        </p>
        <p>
          Bu metin bir aydınlatma bildirimidir; okunması, Site’nin kullanılması veya
          iletişim formunun açılması, kişisel veri işleme ya da yurt dışına aktarım
          için açık rıza verildiği anlamına gelmez. Açık rıza gereken bir işlem
          bulunması hâlinde rıza, ilgili amaç ve veri aktarımı açıkça belirtilerek
          ayrı ve olumlu bir seçimle alınır. Tüzel kişi yetkilileri ve çalışanları
          bakımından haklar yalnızca gerçek kişiye ait veriler için geçerli olup;
          tüzel kişiye ilişkin bilgiler KVKK kapsamı dışındadır.
        </p>
      </>
    ),
  },
  {
    no: "2",
    baslik: "Veri Sorumlusunun ve Temsilcisinin Kimliği",
    govde: (
      <>
        <p>KVKK’nın 3/1-(ı) maddesi uyarınca kişisel verileriniz bakımından veri sorumlusu sıfatıyla:</p>
        <ul className="mt-3 space-y-1.5 border-l border-line pl-5">
          <li>
            <strong className="text-ink">Unvan:</strong> {site.legalName}
          </li>
          <li>
            <strong className="text-ink">Adres:</strong> {site.contact.address}
          </li>
          <li>
            <strong className="text-ink">Telefon:</strong>{" "}
            <a href={site.contact.phoneHref} className="underline underline-offset-2 hover:text-accent">
              {site.contact.phone}
            </a>
          </li>
          <li>
            <strong className="text-ink">E-posta:</strong>{" "}
            <a href={site.contact.emailHref} className="underline underline-offset-2 hover:text-accent">
              {site.contact.email}
            </a>
          </li>
          <li>
            <strong className="text-ink">Kayıtlı Elektronik Posta (KEP):</strong>{" "}
            <a href={`mailto:${site.kepAddress}`} className="underline underline-offset-2 hover:text-accent">
              {site.kepAddress}
            </a>
            <span className="text-muted">
              {" "}— hukuki bildirim, ihtar ve başvurular için öncelikli resmî kanal
            </span>
          </li>
          <li>
            <strong className="text-ink">Vergi Dairesi / Vergi No:</strong>{" "}
            {site.taxOffice} — <span className="tabular-nums">{site.taxNo}</span>
          </li>
          <li>
            <strong className="text-ink">MERSİS No:</strong>{" "}
            <span className="tabular-nums">{site.mersisNo}</span>
          </li>
          <li>
            <strong className="text-ink">Ticaret Sicili:</strong> {site.registry}
            {" "}nezdinde tescil edilmiştir; sicil bilgileri {site.mersisNo} MERSİS
            numarası üzerinden doğrulanabilir.
          </li>
          <li>
            <strong className="text-ink">Yazılı bildirim:</strong> Başvuru ve ihtar
            niteliğindeki bildirimler için yukarıdaki KEP adresi, noter ve iadeli
            taahhütlü posta kanalları geçerlidir.
          </li>
        </ul>
        <p className="mt-3">
          Şirketimizin Türkiye’de yerleşik olması nedeniyle ayrı bir “Veri Sorumlusu
          Temsilcisi” atanması zorunlu değildir. Yurt dışında ikamet eden veri
          sahipleri, işbu Metin’in 11. bölümünde yer alan iletişim kanallarını
          kullanarak doğrudan Şirketimize başvurabilir.
        </p>
      </>
    ),
  },
  {
    no: "3",
    baslik: "İşlenen Kişisel Veri Kategorileri ve Türleri",
    govde: (
      <>
        <p>
          Şirketimizce Site üzerinden ve iletişim kanalları aracılığıyla işlenen
          kişisel veriler, elde edilme biçimine göre aşağıda sınıflandırılmıştır.
          Şirketimiz, Site üzerinden özel nitelikli kişisel veri (KVKK md.6 — ırk,
          etnik köken, siyasi düşünce, felsefi inanç, din, mezhep, kılık/kıyafet,
          dernek/vakıf/sendika üyeliği, sağlık, cinsel hayat, ceza mahkûmiyeti ve
          güvenlik tedbirleri ile biyometrik ve genetik veriler) toplamayı amaçlamaz
          ve talep etmez. Bu mahiyette verilerin tarafımızca paylaşılması hâlinde,
          söz konusu veriler ancak KVKK md.6/2 ve md.6/3’te sayılan istisnaların
          varlığı hâlinde işlenebilir; aksi hâlde en kısa sürede imha edilir. Özel
          nitelikli kişisel verilerinizi paylaşmamanız önemle rica olunur.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-[0.9rem]">
            <thead className="bg-ink text-white">
              <tr>
                {["Kategori", "Veri türleri", "Toplanma biçimi"].map((h) => (
                  <th
                    key={h}
                    className="border border-ink px-3 py-2 text-left font-mono text-[0.62rem] uppercase tracking-[0.14em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Kimlik",
                  "Ad, soyad",
                  "İletişim formu, e-posta, telefon ve KEP ile iletilenler",
                ],
                [
                  "İletişim",
                  "E-posta adresi, telefon numarası, tercihe bağlı açık adres, iletişim konusu ve mesaj içeriği",
                  "İletişim formu, e-posta yazışmaları, teklif/başvuru iletileri",
                ],
                [
                  "Müşteri / Sözleşme",
                  "Proje, keşif ve teklif değerlendirmesi için paylaşılan arsa, yapı, konum ve bütçe bilgileri",
                  "Tarafınızca iletilen mesaj ve dokümanlar",
                ],
                [
                  "İşlem güvenliği",
                  "IP adresi, tarayıcı türü/sürümü, işletim sistemi, cihaz türü, ziyaret saati ve süresi, yönlendiren sayfa, görüntülenen sayfalar, ekran çözünürlüğü, HTTP istek/yanıt kodları",
                  "Sunucu erişim kayıtları, çerezler, üçüncü taraf analiz ve harita hizmetleri",
                ],
                [
                  "Hukuki işlem / uyum",
                  "Başvuru, şikâyet ve yazışma kayıtları; kimlik tespitine ilişkin bilgiler",
                  "KVKK md.11 başvuruları, şikâyetler, adli/idari mercilerden gelen talepler",
                ],
                [
                  "Pazarlama / tercih",
                  "Bülten ve kampanya tercihleri; ticari elektronik ileti onay/ret kaydı (İYS)",
                  "Yalnızca açık rıza beyanı hâlinde",
                ],
              ].map((r, i) => (
                <tr key={r[0]} className={i % 2 ? "bg-mineral/40" : "bg-paper"}>
                  <td className="border border-line px-3 py-2 align-top font-semibold text-ink">{r[0]}</td>
                  <td className="border border-line px-3 py-2 align-top">{r[1]}</td>
                  <td className="border border-line px-3 py-2 align-top text-muted">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    no: "4",
    baslik: "Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri",
    govde: (
      <>
        <p>
          Kişisel verileriniz; KVKK’nın 5. maddesindeki genel şartlar ve 6.
          maddesindeki özel nitelikli kişisel veri işleme şartları çerçevesinde,
          aşağıdaki amaçlarla bağlantılı, sınırlı ve ölçülü olarak işlenir:
        </p>
        <ul className="mt-4 space-y-3">
          {[
            [
              "Tarafınızca iletilen talep, teklif, şikâyet ve başvuruların değerlendirilmesi, yanıtlanması ve sonuçlandırılması; bu kapsamda sizinle iletişime geçilmesi.",
              "KVKK md.5/2-(e) bir hakkın tesisi, kullanılması veya korunması; md.5/2-(f) ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati.",
            ],
            [
              "İnşaat, mühendislik, proje yönetimi, danışmanlık ve uygulama hizmetlerinin kapsamının belirlenmesi; teklif, keşif ve ön değerlendirme süreçlerinin yürütülmesi; ileride akdedilmesi muhtemel sözleşmelerin kurulması ve ifası.",
              "KVKK md.5/2-(c) sözleşmenin kurulması ve ifası; md.5/2-(ç) veri sorumlusunun hukuki yükümlülüğü.",
            ],
            [
              "Site’nin işletilmesi, bilgi ve işlem güvenliğinin sağlanması; siber tehditlerin, yetkisiz erişimlerin ve kötü niyetli trafiğin tespiti; 5651 sayılı Kanun ve ilgili mevzuattan doğan erişim kayıtlarını tutma yükümlülüğü.",
              "KVKK md.5/2-(ç) hukuki yükümlülük; md.5/2-(a) kanunlarda öngörülmesi.",
            ],
            [
              "Kullanım deneyiminin iyileştirilmesi, ziyaret istatistiklerinin anonim/toplu hâle getirilerek raporlanması; Site performansının ölçülmesi.",
              "KVKK md.5/2-(f) meşru menfaat; açık rıza gerektiren çerezler bakımından md.5/1 açık rıza.",
            ],
            [
              "Mevzuattan kaynaklanan saklama, bildirim, denetim, vergi ve beyanname yükümlülüklerinin (TTK/VUK/5651/KVKK) yerine getirilmesi; adli ve idari mercilerin hukuka uygun taleplerine cevap verilmesi.",
              "KVKK md.5/2-(a) kanunlarda öngörülmesi; md.5/2-(ç) hukuki yükümlülük.",
            ],
            [
              "Şirketimizin hukuki uyuşmazlıklarda haklarını kullanması, savunma yapması ve delil olarak sunması; müşteri ilişkileri, kurumsal iletişim ve itibar yönetimi.",
              "KVKK md.5/2-(e) hakkın tesisi ve korunması; md.5/2-(f) meşru menfaat.",
            ],
            [
              "Açık rıza vermeniz hâlinde tarafınıza ticari elektronik ileti gönderilmesi; kampanya ve bülten iletilmesi.",
              "KVKK md.5/1 açık rıza; 6563 sayılı Kanun’un ticari elektronik ileti hükümleri ve İYS mevzuatı (onayı dilediğiniz zaman ve hiçbir gerekçe göstermeksizin geri alabilirsiniz).",
            ],
          ].map(([amac, sebep]) => (
            <li key={amac} className="flex gap-4">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-hivis" />
              <span>
                <span>{amac}</span>
                <span className="mt-1 block font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.1em] text-muted">
                  Hukuki sebep: {sebep}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    no: "5",
    baslik: "Toplanma Yöntemi ve Otomatik Yollarla İşleme",
    govde: (
      <>
        <p>
          Verileriniz; Site üzerindeki iletişim formu, e-posta adreslerimiz, KEP,
          telefon, sosyal medya doğrudan mesajları ve yazılı/sözlü diğer iletişim
          kanalları aracılığıyla tamamen veya kısmen otomatik yollarla ya da veri
          kayıt sistemimizin parçası olmak kaydıyla otomatik olmayan yollarla elde
          edilir. İşlem güvenliği verileri sunucu günlükleri ve çerezler vasıtasıyla
          otomatik olarak toplanır.
        </p>
        <p>
          Kişisel verileriniz, münhasıran otomatik sistemler vasıtasıyla analiz
          edilmesi suretiyle aleyhinize bir sonucun ortaya çıkarılması amacıyla
          kullanılmaz; profil oluşturma, otomatik karar verme veya puanlama
          yapılmamaktadır. Böyle bir sonuca karşı KVKK md.11/1-(g) kapsamında itiraz
          etme hakkınız saklıdır.
        </p>
      </>
    ),
  },
  {
    no: "6",
    baslik: "Yurt İçinde ve Yurt Dışında Aktarım",
    govde: (
      <>
        <p>
          Kişisel verileriniz; KVKK’nın 8. ve 9. maddeleri ile Veri Sorumluları
          Tarafından Kişisel Verilerin Aktarılmasına İlişkin Usul ve Esaslar Hakkında
          Yönetmelik (RG 10.03.2024/32486) çerçevesinde, yukarıda belirtilen amaçlar
          ve hukuki sebeplerle sınırlı olarak aşağıdaki alıcı gruplarına aktarılabilir:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-warm" />
            <span>
              <strong className="text-ink">Yurt içi alıcı grupları:</strong>{" "}
              Şirketimizin avukatları, mali müşavirleri, vergi ve denetim
              danışmanları, bilgi teknolojileri hizmet sağlayıcıları (e-posta,
              barındırma, sunucu hizmetleri), bankalar ve finans kuruluşları,
              KEP/kargo/posta hizmet sağlayıcıları; hukuki yükümlülük kapsamında
              yetkili kamu kurum ve kuruluşları (mahkemeler, icra daireleri, KVKK
              Kurulu, kolluk, vergi daireleri ve benzerleri).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-warm" />
            <span>
              <strong className="text-ink">Yurt dışı alıcılar:</strong> Site’nin
              çalışması için kullanılan ve sunucuları Türkiye dışında bulunan veya
              veri akışı Türkiye dışına gerçekleşebilecek hizmet sağlayıcılar (Google
              LLC — Analytics/Maps, ABD; Meta/Instagram, ABD/AB; Pexels — görsel CDN,
              AB/ABD; LinkedIn/Microsoft, ABD/AB; e-posta hizmet sağlayıcısı). Bu
              aktarım; (i) açık rızanıza, (ii) md.9/2-(a) yeterli koruma bulunan ülke,
              (iii) md.9/2-(b) Kurul’un onayladığı Standart Sözleşme’nin imzalanması ve
              Kurul’a bildirilmesi, (iv) md.9/2-(ç) şirket grubu/belirlenen şahıs
              grubu için yazılı taahhütname, (v) md.9/2-(d) bağlayıcı kurumsal
              kurallar veya (vi) md.9/2-(e) yazılı sözleşme ile Türkiye’de yetkili
              temsilci ataması suretiyle gerçekleştirilir. Anılan aktarımlarda KVKK
              md.9/3 uyarınca asgari teknik ve idari tedbirler ayrıca alınır; yurt
              dışından Türkiye’ye aktarımlarda md.9/4 ve md.9/5 hükümleri uygulanır.
              Site’yi kullanmakla ve/veya iletişim formu göndermekle bu aktarımlara
              açıkça rıza göstermiş olursunuz; rızanızı dilediğiniz zaman geri
              alabilirsiniz.
            </span>
          </li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          Verileriniz hiçbir koşulda ticari amaçla veri simsarlarına, veri aracı
          platformlarına veya Şirketimizin faaliyet konusuyla doğrudan ilgisi
          bulunmayan üçüncü kişilere satılmaz, kiralanmaz ve kâr paylaşımı karşılığı
          paylaşılmaz.
        </p>
      </>
    ),
  },
  {
    no: "7",
    baslik: "Çerezler (Cookies) ve Benzeri Teknolojiler",
    govde: (
      <>
        <p>
          Site’de zorunlu çerezler (oturum ve güvenlik), işlevsel/tercih çerezleri,
          performans/analiz çerezleri ve üçüncü taraf içerik çerezleri (Google Maps,
          görsel CDN, sosyal medya bileşenleri) kullanılabilir. Zorunlu çerezler KVKK
          md.5/2-(a) ve (ç) uyarınca rızanıza bakılmaksızın kullanılır; performans,
          pazarlama ve üçüncü taraf çerezleri yalnızca açık rızanız hâlinde
          etkinleştirilir. Çerez tercihinizi Site alt bandındaki bildirimden veya
          alt bilgi bölümündeki “Çerez Tercihleri” bağlantısından her zaman
          değiştirebilirsiniz.
        </p>
        <p>
          Tarayıcı ayarlarınızdan çerezleri silebilir, engelleyebilir veya uyarı
          alabilirsiniz; ancak bu durum Site’nin bazı işlevlerinin (harita gömülüsü,
          form oturumu vb.) çalışmamasına yol açabilir. Bu durumdan doğacak
          aksaklıklar Şirketimizin sorumluluğunda değildir.
        </p>
      </>
    ),
  },
  {
    no: "8",
    baslik: "Saklama Süresi, Silinmesi, Yok Edilmesi ve Anonimleştirilmesi",
    govde: (
      <>
        <p>
          Kişisel verileriniz; işleme amaçlarının gerektirdiği süre kadar ve her
          hâlükârda mevzuattan doğan saklama ve zamanaşımı yükümlülükleri süresince
          saklanır:
        </p>
        <ul className="mt-3 space-y-1.5">
          <li>• İletişim, talep ve teklif kayıtları: talebin sonuçlandırılmasını izleyen <strong>2 yıl</strong>; sözleşme kurulması hâlinde genel zamanaşımı süresi olan <strong>10 yıl</strong> (TBK md.146) sonuna kadar.</li>
          <li>• Ticari elektronik ileti onay/ret kayıtları (İYS kayıtları dâhil): 6563 sayılı Kanun ve Yönetmeliği uyarınca mevzuatta öngörülen süre boyunca (en az <strong>3 yıl</strong>).</li>
          <li>• Ticari defter ve belgeler: <strong>10 yıl</strong> (TTK md.82); vergi mevzuatı kapsamındaki belgeler <strong>en az 5 yıl</strong> (VUK md.253).</li>
          <li>• Site erişim ve işlem güvenliği kayıtları: <strong>12 ay</strong>; yer sağlayıcı sıfatının bulunması hâlinde 5651 sayılı Kanun md.5 uyarınca <strong>1 yıl</strong> (kullanıcıya ilişkin bilgiler için <strong>2 yıl</strong>).</li>
          <li>• KVKK md.11 başvuruları ve yanıt kayıtları: <strong>3 yıl</strong>; uyuşmazlık hâlinde zamanaşımı süresince.</li>
          <li>• Hukuki uyuşmazlıklarda delil niteliği taşıyan kayıtlar: kesinleşmiş yargı kararının icrasına kadar.</li>
        </ul>
        <p className="mt-3">
          Saklama sürelerinin sonunda veya işleme amaçlarının ortadan kalkması
          hâlinde kişisel verileriniz, resen veya talebiniz üzerine KVKK md.7 ve
          Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonimleştirilmesi
          Politikaları Hakkında Yönetmelik (RG 28.10.2017/30206) uyarınca silinir,
          yok edilir veya anonim hâle getirilir. Anonimleştirilmiş veriler istatistik
          ve güvenlik amaçlarıyla saklanmaya devam edebilir; bu veriler KVKK kapsamında
          değerlendirilmez.
        </p>
      </>
    ),
  },
  {
    no: "9",
    baslik: "Veri Güvenliği ve Alınan Teknik/İdari Tedbirler",
    govde: (
      <>
        <p>
          Şirketimiz, kişisel verilerin hukuka aykırı işlenmesini, erişilmesini ve
          muhafaza edilmesini önlemek amacıyla KVKK md.12 ve Kurul’un veri güvenliği
          rehberleri çerçevesinde uygun teknik ve idari tedbirleri alır:
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {[
            "Görev bazlı erişim yetkilendirmesi ve en az yetki ilkesi",
            "Sunucularda TLS 1.2+ / HTTPS, güncel şifreleme ve anahtar yönetimi",
            "Periyodik risk değerlendirmesi, sızma testi ve log denetimi",
            "Çalışanlara KVKK ve bilgi güvenliği eğitimi, gizlilik taahhütnamesi",
            "Kişisel veri içeren kayıtların şifreli saklanması ve erişim logları",
            "Üçüncü taraf hizmet sağlayıcılarla sözleşmesel gizlilik/KVKK hükümleri",
            "Kurul’un öngördüğü asgari idari ve teknik tedbirlerin uygulanması",
            "Veri güvenliği ihlali hâlinde KVKK md.12/5 uyarınca en kısa sürede Kurul’a ve ilgili kişiye bildirim prosedürü",
          ].map((m) => (
            <li key={m} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent-warm" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          İnternet ortamının mutlak güvenli bir ortam olmaması nedeniyle Site üzerinden
          iletilen verilerin güvenliği; kullandığınız cihaz, şebeke ve e-posta
          sağlayıcının güvenlik düzeyine de bağlıdır. Cihaz, ağ ve hesap güvenliğiniz
          (parola, iki aşamalı doğrulama vb.) bakımından tarafınız sorumludur.
        </p>
      </>
    ),
  },
  {
    no: "10",
    baslik: "Veri Sahibinin Hakları (KVKK md.11)",
    govde: (
      <>
        <p>KVKK’nın 11. maddesi uyarınca veri sahipleri;</p>
        <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {[
            "Kişisel verilerinin işlenip işlenmediğini öğrenme",
            "İşlenmişse buna ilişkin bilgi talep etme",
            "İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
            "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
            "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
            "KVKK md.7 çerçevesinde silinmesini veya yok edilmesini isteme",
            "Bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme",
            "Münhasıran otomatik sistemlerle analiz sonucu aleyhe sonca itiraz etme",
            "Hukuka aykırı işleme bağlı zararın giderilmesini talep etme",
          ].map((h) => (
            <li key={h} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-hivis" />
              <span>{h}.</span>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Bu haklar yalnızca tarafınıza ait veriler için ve kimliğiniz
          doğrulanmak suretiyle kullanılabilir. Üçüncü kişilere ait veriler bakımından
          başvuru yapılamaz; tüzel kişi adına yapılan başvurularda yetki belgesi
          sunulması zorunludur.
        </p>
      </>
    ),
  },
  {
    no: "11",
    baslik: "Başvuru Usulü, Süre ve Ücret",
    govde: (
      <>
        <p>
          KVKK md.11 kapsamındaki taleplerinizi; (i) kimlik doğrulamaya elverişli
          belge ve tebligata elverişli adres bilgisiyle birlikte yazılı olarak
          Şirketimizin adresine ulaştırarak, (ii){" "}
          <a href={`mailto:${site.kepAddress}`} className="underline underline-offset-2 hover:text-accent">
            {site.kepAddress}
          </a>{" "}
          KEP adresine veya (iii){" "}
          <a href={site.contact.emailHref} className="underline underline-offset-2 hover:text-accent">
            {site.contact.email}
          </a>{" "}
          adresine kayıtlı elektronik imza, mobil imza ya da Kurul tarafından
          belirlenen diğer usullerle gönderebilirsiniz. Başvuruda talebin konusu, ad
          soyad, T.C. kimlik numarası (yabancıiler için uyruk/pasaport no), iletişim
          adresi ve konuya ilişkin bilgi/belge yer almalıdır.
        </p>
        <p>
          Başvurular talebin niteliğine göre en kısa sürede ve en geç{" "}
          <strong className="text-ink">30 gün</strong> içinde ücretsiz olarak
          sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul’un
          belirlediği tarifedeki ücret talep edilebilir. Cevap yazılı veya elektronik
          ortamda bildirilir; reddedilmesi hâlinde gerekçe belirtilir ve karara karşı
          30 gün içinde Kurul’a şikâyet hakkınız bulunur.
        </p>
        <p className="mt-3 text-sm text-muted">
          Tekrarlayan, orantısız, dayanaktan yoksun, kimliği doğrulanamayan veya kötü
          niyetli başvurular; KVKK md.13/3 uyarınca işleme alınmayabilir ya da Kurul’un
          belirlediği tarifeye göre ücretlendirilebilir. Başvurunuz yalnızca tarafınıza
          ait veriler ve talep edilen kapsamla sınırlı olarak değerlendirilir; üçüncü
          kişilerin verileri ile ticari sır kapsamındaki bilgi ve belgeler talep
          kapsamı dışında kalır.
        </p>
      </>
    ),
  },
  {
    no: "12",
    baslik: "Üçüncü Taraf İçerikleri ve Dış Bağlantılar",
    govde: (
      <p>
        Site’de yer verilen Google harita gömülüleri, görsel CDN hizmetleri, sosyal
        medya bağlantıları ve diğer harici bağlantılar; ilgili üçüncü tarafın kendi
        gizlilik politikalarına ve hizmet şartlarına tâbidir. Şirketimiz, anılan
        üçüncü tarafların uygulamalarından, içeriklerinden veya güvenliklerinden
        sorumlu değildir. Dış bağlantılara tıklayarak ulaşacağınız sayfalara ilişkin
        sorumluluk size aittir.
      </p>
    ),
  },
  {
    no: "13",
    baslik: "Ticari Elektronik İletiler ve Pazarlama",
    govde: (
      <p>
        Şirketimizden ticari elektronik ileti (e-posta, SMS, arama vb.) almak
        istemeniz hâlinde; 6563 sayılı Kanun ve Elektronik Ticari İleti İzni İçin
        Onayın Alınmasına Dair Yönetmelik çerçevesinde, elektronik ortamda ve İleti
        Yönetim Sistemi (İYS) nezdinde doğrulanabilir biçimde açık rızanız alınır.
        Onay vermemeniz hâlinde tarafınıza hiçbir pazarlama iletisi gönderilmez ve bu
        durumda hiçbir hakkınız kısıtlanmaz. Vermiş olduğunuz onayı, iletilerde yer
        alan “abonelikten çık” bağlantısı veya{" "}
        <a href={site.contact.emailHref} className="underline underline-offset-2 hover:text-accent">
          {site.contact.email}
        </a>{" "}
        adresine ret bildirimi göndermek suretiyle her zaman ve gerekçe göstermeksizin
        geri alabilirsiniz; ret bildiriminin ulaşmasını takiben en geç 3 iş günü
        içinde iletişim durdurulur. Hizmet ifasına ilişkin bildirimler (teklif
        yanıtları, randevu ve keşif teyidi vb.) ticari elektronik ileti kapsamında
        değildir.
      </p>
    ),
  },
  {
    no: "14",
    baslik: "Çocukların Verileri",
    govde: (
      <p>
        Site genel kullanıma açık olmakla birlikte 18 yaşın altındaki kişilere
        yönelik değildir ve bilerek çocuklardan kişisel veri toplanmaz. 18 yaşın
        altındaki kişilere ait veriler ancak yasal temsilcilerinin açık rızası ve
        yönlendirmesiyle işlenir; aksinin tespiti hâlinde söz konusu veriler derhal
        silinir.
      </p>
    ),
  },
  {
    no: "15",
    baslik: "Sorumluluk Reddi ve Beyanlar",
    govde: (
      <>
        <p>
          Site’deki içerikler, Şirketimizin faaliyet konusu hakkında genel bilgilendirme
          amacıyla sunulur; belirli bir projeye yönelik teklif, sözleşme öncesi beyan,
          taahhüt, garanti veya satış teklifi niteliği taşımaz. Teklifler; keşif,
          zemin/etüt ve ön değerlendirme neticesinde yazılı olarak ve yalnızca yetkili
          kişilerce verilebilir. Site’de yer alabilecek maddi veya yazım hataları ile
          teknik aksaklıklardan Şirketimiz sorumlu tutulamaz. Şirketimiz, Site
          içeriğini ve hizmetlerini önceden bildirimde bulunmaksızın değiştirme,
          durdurma veya yayından kaldırma hakkını saklı tutar.
        </p>
        <p>
          Site üzerinden ilettiğiniz mesaj ve dokümanlarda üçüncü kişilere ait kişisel
          veri bulunması hâlinde, ilgili kişilerden gerekli açık rızaların alınmış
          olması ve KVKK’ya uygun paylaşım yapılması tamamen sizin sorumluluğunuzdadır;
          bu nedenle doğabilecek idari para cezaları ve tazminat talepleri tarafınıza
          aittir. Özel nitelikli kişisel verilerinizi Şirketimizle paylaşmamanız
          tavsiye olunur.
        </p>
      </>
    ),
  },
  {
    no: "16",
    baslik: "Değişiklikler ve Yürürlük",
    govde: (
      <p>
        Şirketimiz işbu Metin’i; mevzuat değişiklikleri, Kurul kararları veya
        hizmetlerindeki değişiklikler doğrultusunda tek taraflı olarak
        güncelleyebilir. Güncellenen Metin, Site’de yayımlandığı tarihte yürürlüğe
        girer ve yürürlükteki son sürüm her zaman bu sayfada yayımlanır. İşbu Metnin{" "}
        <strong className="text-ink">{GUNCELLEME}</strong> tarihli sürümü
        yürürlüktedir.
      </p>
    ),
  },
  {
    no: "17",
    baslik: "Uyuşmazlıkların Çözümü ve Uygulanacak Hukuk",
    govde: (
      <>
        <p>
          İşbu Metin Türkiye Cumhuriyeti hukukuna tâbidir. Bu Metin’den
          kaynaklanabilecek uyuşmazlıkların çözümünde{" "}
          <strong className="text-ink">Kocaeli Mahkemeleri ve İcra Daireleri</strong>{" "}
          münhasıran yetkilidir. Tüketici sıfatı taşıyan kişilere ilişkin
          uyuşmazlıklarda, 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca
          kanunen yetkili Tüketici Hakem Heyetleri ve Tüketici Mahkemelerinin yasal
          yetkisi saklıdır.
        </p>
        <p>
          Veri sahipleri KVKK kapsamında her zaman Kurul’a şikâyet hakkına sahiptir.
          Anılan şikâyet yollarının tüketilmesi, KVKK md.14 uyarınca kişisel verilerin
          işlenmesi hukuka aykırılığından doğan zararlar için maddi ve manevi tazminat
          davası açılmasının ön şartıdır; bu nedenle mahkemeye başvurmadan önce Kurul
          nezdinde idari başvurunun sonuçlandırılması zorunludur. Şikâyet ve
          soruşturma süreci tamamlanmadan tazminat talebi yöneltilemez.
        </p>
      </>
    ),
  },
];

const kayitBilgileri: [string, string][] = [
  ["MERSİS No", site.mersisNo],
  ["Vergi Dairesi / No", `${site.taxOffice} / ${site.taxNo}`],
  ["Ticaret Sicili", site.registry],
  ["Yürürlük", GUNCELLEME],
];

export default function GizlilikPage() {
  return (
    <section className="relative py-20 md:py-28">
      <div
        className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-80 text-ink/[0.045]"
        aria-hidden="true"
      />
      <Container>
        {/* başlık */}
        <Reveal variant="left">
          <div className="max-w-4xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent-warm" /> Yasal / KVKK
            </p>
            <h1 className="mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.04]">
              Gizlilik Politikası &amp; KVKK Aydınlatma Metni
            </h1>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted">
              {site.legalName} olarak kişisel verilerinizin 6698 sayılı KVKK ve
              ikincil mevzuata uygun işlenmesi, korunması ve haklarınızın güvence
              altına alınması için hazırlanan metindir.
            </p>
            <p className="mt-5 inline-flex items-center gap-4 border border-line bg-mineral px-4 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink/80">
              <span>Son güncelleme</span>
              <span className="h-4 w-px bg-line" />
              <time dateTime="2026-10-28">{GUNCELLEME}</time>
            </p>
          </div>
        </Reveal>

        {/* giriş — Reveal kullanılmaz: uzun metin her koşulda görünür */}
        <div className="mt-12 max-w-3xl leading-relaxed text-ink/85">
          <p>
            <strong className="text-ink">{site.legalName}</strong> (“Kuk İnşaat”,
            “Şirket” veya “Veri Sorumlusu”) olarak; web sitemizi ziyaret eden,
            iletişim formumuzu dolduran, teklif ve keşif talebinde bulunan,
            e-posta, telefon, KEP ve sosyal medya kanallarıyla bizimle irtibat kuran
            gerçek kişilere ait kişisel verilerin güvenliği ve hukuka uygun
            işlenmesi, KVKK başta olmak üzere tüm ilgili mevzuat kapsamında öncelikli
            politikamızdır.
          </p>

          {/* bölüm içindekiler */}
          <nav aria-label="Metin içindekiler" className="mt-10 border border-line bg-mineral/60 p-6">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-accent">
              İçindekiler
            </p>
            <ol className="mt-4 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
              {maddeler.map((m) => (
                <li key={m.no} className="flex gap-3 text-ink/75">
                  <span className="font-mono text-[0.68rem] text-muted">
                    {m.no.padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(`madde-${m.no}`);
                      if (!el) return;
                      const reduce = window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches;
                      window.scrollTo({
                        top: el.getBoundingClientRect().top + window.scrollY - 110,
                        behavior: reduce ? "auto" : "smooth",
                      });
                    }}
                    className="link-sweep text-left hover:text-accent"
                  >
                    {m.baslik}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* maddeler — her biri bağımsız, kısa eşikli açılış */}
          {maddeler.map((m) => (
            <article key={m.no} id={`madde-${m.no}`} className="mt-12 scroll-mt-28">
              <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold leading-tight text-ink">
                <span className="font-mono text-[0.68rem] tracking-[0.2em] text-accent">
                  {m.no.padStart(2, "0")}
                </span>
                <span>{m.baslik}</span>
              </h2>
              <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink/85 [&_a:hover]:text-accent [&_a]:underline [&_a]:underline-offset-4">
                {m.govde}
              </div>
            </article>
          ))}

          {/* veri sorumlusu kayıt kutusu */}
          <div className="mt-14 border border-line bg-mineral p-6 md:p-8">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-accent">
              Veri sorumlusu kayıt ve iletişim bilgileri
            </p>
            <p className="mt-3 font-display text-lg font-bold text-ink">{site.legalName}</p>
            <p className="mt-2 text-sm text-ink/80">{site.contact.address}</p>
            <dl className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2">
              {kayitBilgileri.map(([k, v]) => (
                <div key={k} className="bg-paper px-4 py-3">
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted">{k}</dt>
                  <dd className="mt-1.5 break-words text-sm font-medium tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">
              <a href={site.contact.phoneHref} className="hover:text-accent">
                T {site.contact.phone}
              </a>
              <a href={site.contact.emailHref} className="hover:text-accent">
                {site.contact.email}
              </a>
              <a href={`mailto:${site.kepAddress}`} className="hover:text-accent">
                KEP {site.kepAddress}
              </a>
              <span>{site.contact.hours}</span>
            </p>
            <p className="mt-4 text-[0.78rem] leading-relaxed text-muted">
              İşbu metnin <strong className="text-ink">{GUNCELLEME}</strong> tarihli
              sürümü yürürlüktedir; 6698 sayılı Kanun, ikincil düzenlemeler ve Kurul
              kararları doğrultusunda güncellenir.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
