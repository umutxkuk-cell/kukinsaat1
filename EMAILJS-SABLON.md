# EmailJS şablonu — kopyala/yapıştır rehberi

## Kısa yol: EmailJS'in hazır şablonunu kullanın

Panelde zaten bir **"Contact Us"** şablonu görüyorsanız (EmailJS yeni
hesaplarda örnek olarak oluşturur) onu **silebilir ya da olduğu gibi
kullanabilirsiniz.** Function artık tüm yaygın değişken adlarını birlikte
gönderdiği için şablondaki adların bizimkilerle birebir uyuşması gerekmiyor.

Hazır şablonu kullanacaksanız kontrol etmeniz gereken **tek alan** var:

| Alan | Ne olmalı | Neden |
| --- | --- | --- |
| **To Email** | `{{to_email}}` veya `umut@kukinsaat.com` | Boşsa e-posta kimseye gitmez |
| Reply To | `{{reply_to}}` veya `{{email}}` | "Yanıtla" düğmesi müşteriye gitsin |
| Subject / Content | olduğu gibi kalabilir | Alanlar otomatik dolar |

Sonra şablonun **Template ID**'sini kopyalayıp `wrangler.toml`'a yazmanız
yeterli. Bu kadar — başka ayara dokunmanız gerekmez.

Markaya uygun, biçimlendirilmiş bir e-posta isterseniz aşağıdaki
**B) HTML sürümü** ile yeni bir şablon oluşturun.

---

## Function'ın gönderdiği değişkenler

`functions/api/contact.ts` aynı veriyi birden çok adla gönderir; EmailJS
yalnızca şablonda geçenleri yerine koyar, fazlasını sessizce yok sayar:

| Veri | Kabul edilen adlar | Örnek değer |
| --- | --- | --- |
| Ad Soyad | `{{from_name}}` `{{name}}` `{{user_name}}` | `Umut Kuk` |
| E-posta | `{{reply_to}}` `{{email}}` `{{user_email}}` `{{from_email}}` | `musteri@firma.com` |
| Telefon | `{{phone}}` `{{user_phone}}` (boşsa `-`) | `+90 543 741 05 41` |
| Konu | `{{subject}}` (boşsa `Genel`) | `Villa projesi` |
| Mesaj | `{{message}}` | `Başiskele'de 250 m²…` |
| Alıcı | `{{to_email}}` | `umut@kukinsaat.com` |

> Aşağıdaki hazır şablonlarda bu depoya özgü adlar (`from_name`, `reply_to`)
> kullanılmıştır; ama elinizdeki şablon `{{name}}`/`{{email}}` yazıyorsa da
> çalışır — değiştirmeniz şart değil.

---

## Adım adım: EmailJS panelinde şablon oluşturma

**Email Templates → Create New Template** deyip aşağıdaki alanları doldurun.

### 1. Template Name

```
İletişim Formu — kukinsaat.com
```

### 2. Subject

```
Teklif / Bilgi Talebi — {{subject}}
```

### 3. To Email

```
{{to_email}}
```

Böylece alıcı adresi koddan gelir; ileride `CONTACT_TO_EMAIL`'i
değiştirdiğinizde şablona dokunmanız gerekmez.
(Sabit tutmak isterseniz doğrudan `umut@kukinsaat.com` da yazabilirsiniz.)

### 4. From Name

```
{{from_name}} — kukinsaat.com formu
```

Gelen kutunuzda kimin yazdığını ilk bakışta görürsünüz.

### 5. Reply To

```
{{reply_to}}
```

**Bu alanı boş bırakmayın.** Dolu olduğunda gelen kutusunda "Yanıtla"
dediğinizde ileti doğrudan müşterinin adresine gider — adresi elle
kopyalamanız gerekmez.

### 6. Content

İki seçenek var. **A) düz metin** her istemcide sorunsuz çalışır;
**B) HTML** markaya uygun görünür (EmailJS'te *HTML Content* anahtarını
açmanız gerekir). İkisi de aynı değişkenleri kullanır.

---

## A) Düz metin sürümü (Content alanına yapıştırın)

```text
Yeni iletişim formu talebi — kukinsaat.com

Ad Soyad : {{from_name}}
E-posta  : {{reply_to}}
Telefon  : {{phone}}
Konu     : {{subject}}

Mesaj:
{{message}}

—
Bu ileti kukinsaat.com iletişim formundan gönderilmiştir.
Yanıtlamak için bu e-postayı doğrudan cevaplayabilirsiniz.
```

---

## B) HTML sürümü (önce *HTML Content* anahtarını açın)

```html
<div style="background:#eeeae2;padding:28px 16px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #d8d3ca;">

    <!-- Başlık şeridi -->
    <tr>
      <td style="background:#1f435c;padding:22px 28px;">
        <div style="color:#ffffff;font-size:19px;font-weight:bold;letter-spacing:-0.3px;">
          KUK <span style="color:#8bb2cc;font-weight:normal;">İnşaat</span>
        </div>
        <div style="color:#8bb2cc;font-size:10px;letter-spacing:2.4px;
                    text-transform:uppercase;margin-top:6px;">
          Kaliteyle Kurulur
        </div>
      </td>
    </tr>

    <!-- Terracotta vurgu çizgisi -->
    <tr>
      <td style="background:#a34e3a;height:3px;line-height:3px;font-size:0;">&nbsp;</td>
    </tr>

    <tr>
      <td style="padding:28px;">
        <div style="color:#a34e3a;font-size:11px;font-weight:bold;letter-spacing:1.8px;
                    text-transform:uppercase;">
          Yeni talep
        </div>
        <div style="color:#20262b;font-size:22px;font-weight:bold;margin-top:8px;
                    line-height:1.25;">
          {{subject}}
        </div>

        <!-- Kimlik bilgileri -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="margin-top:24px;border-top:1px solid #d8d3ca;">
          <tr>
            <td style="padding:11px 0;border-bottom:1px solid #d8d3ca;width:120px;
                       color:#5a636b;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">
              Ad Soyad
            </td>
            <td style="padding:11px 0;border-bottom:1px solid #d8d3ca;
                       color:#20262b;font-size:14px;font-weight:bold;">
              {{from_name}}
            </td>
          </tr>
          <tr>
            <td style="padding:11px 0;border-bottom:1px solid #d8d3ca;
                       color:#5a636b;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">
              E-posta
            </td>
            <td style="padding:11px 0;border-bottom:1px solid #d8d3ca;font-size:14px;">
              <a href="mailto:{{reply_to}}" style="color:#1f435c;text-decoration:none;">
                {{reply_to}}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:11px 0;border-bottom:1px solid #d8d3ca;
                       color:#5a636b;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">
              Telefon
            </td>
            <td style="padding:11px 0;border-bottom:1px solid #d8d3ca;font-size:14px;">
              <a href="tel:{{phone}}" style="color:#1f435c;text-decoration:none;">{{phone}}</a>
            </td>
          </tr>
        </table>

        <!-- Mesaj -->
        <div style="color:#5a636b;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;
                    margin-top:26px;">
          Mesaj
        </div>
        <div style="margin-top:10px;padding:18px 20px;background:#eeeae2;
                    border-left:3px solid #a34e3a;color:#20262b;font-size:14px;
                    line-height:1.7;white-space:pre-wrap;">{{message}}</div>

        <!-- Yanıt düğmesi -->
        <div style="margin-top:26px;">
          <a href="mailto:{{reply_to}}?subject=Re:%20{{subject}}"
             style="display:inline-block;background:#20262b;color:#ffffff;
                    font-size:13px;font-weight:bold;text-decoration:none;
                    padding:13px 26px;">
            Talebi yanıtla &rarr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Alt bilgi -->
    <tr>
      <td style="background:#20262b;padding:18px 28px;">
        <div style="color:#8bb2cc;font-size:11px;line-height:1.6;">
          Bu ileti kukinsaat.com iletişim formundan otomatik gönderilmiştir.
        </div>
        <div style="color:#5a636b;font-size:11px;margin-top:6px;">
          +90 543 741 05 41 &nbsp;·&nbsp; Ovacık Mah. Çuhane Cad. No:176, Başiskele — Kocaeli
        </div>
      </td>
    </tr>
  </table>
</div>
```

HTML sürümü sitenin kendi paletiyle kuruludur: mineral kırık beyaz zemin
(`#eeeae2`), derin mühendislik mavisi başlık şeridi (`#1f435c`), grafit metin
(`#20262b`) ve terracotta vurgu (`#a34e3a`). E-posta istemcileri dış
biçem sayfalarını ve `flex`/`grid` düzenlerini desteklemediği için tüm stiller
satır içi (inline) ve yerleşim tablolarla yapılmıştır — Outlook dahil her
istemcide aynı görünür. Harici görsel yüklenmez, dolayısıyla "resimleri
göster" uyarısı çıkmaz.

---

## Şablonu kaydettikten sonra

1. **Save** deyin. Template ID şablon listesinde ve editörün üstünde görünür:
   `template_xxxxxxx` biçiminde.
2. Bu kimliği kök dizindeki `wrangler.toml` → `[vars]` bloğuna yazın:

   ```toml
   EMAILJS_TEMPLATE_ID = "template_xxxxxxx"
   ```

3. `EMAILJS_PRIVATE_KEY` panelde **Secret** olarak tanımlı olmalı
   (hesabınız strict mode'da — zorunlu). Depoya yazmayın.
4. Değişiklikleri push edin, sonra **Deployments → Retry deployment**.

## Doğrulama

```bash
# Yapılandırma tamam mı?
curl https://<proje>.pages.dev/api/health
# → "contact": { "configured": true, "provider": "emailjs", "missing": [] }

# Gerçek bir deneme gönder (posta kutunuza düşmeli)
curl -X POST https://<proje>.pages.dev/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Deneme Kullanici","email":"deneme@example.com",
       "phone":"+905551112233","subject":"Kurulum denemesi",
       "message":"EmailJS sablonu dogrulama testi. Bu mesaj gorunuyorsa kurulum tamam."}'
# → {"ok":true}
```

| Yanıt | Anlamı |
| --- | --- |
| `{"ok":true}` | Kurulum tamam, e-posta düştü |
| `502 … The template ID not found` | Template ID yanlış veya şablon kaydedilmemiş |
| `502 … template ID … invalid` | Şablon başka bir hesaba ait |
| `503 not_configured` + `missing:[…]` | Yanıtta listelenen değişkenler eksik |
| `403 … strict mode` | Private Key tanımlı değil |

Alanları boş gelen bir e-posta alırsanız değişken adlarını yukarıdaki tabloyla
karşılaştırın — EmailJS bu durumda hata vermez, sessizce boş bırakır.
