import { Image } from "@/lib/next-shim";
import { Link } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { InteriorHero } from "@/components/ui/InteriorHero";
import { Reveal } from "@/components/ui/Reveal";
import { LineReveal } from "@/components/ui/LineReveal";
import { Counter } from "@/components/ui/Counter";
import { ValueIcon, type ValueIconKey } from "@/components/kurumsal/ValueIcon";
import { services } from "@/data/services";
import { site } from "@/data/site";


const values: { icon: ValueIconKey; t: string; d: string }[] = [
  { icon: "precision", t: "Teknik Yeterlilik", d: "Kararlarımızı statik hesap, yürürlükteki yönetmelikler ve sahadaki uygulanabilirlik ölçütlerine dayandırırız." },
  { icon: "quality", t: "Kalite Anlayışı", d: "Malzemeyi ve işçiliği, proje başında belirlenen standartlara göre denetleriz." },
  { icon: "communication", t: "Açık İletişim", d: "Süre, bütçe ve ilerleme konusunda iş sahibini düzenli olarak bilgilendiririz." },
  { icon: "responsibility", t: "Güvenilirlik", d: "Teslim ettiğimiz işin ardında durur, verdiğimiz sözü tutarız." },
  { icon: "sustainability", t: "Sürdürülebilirlik", d: "Yapıları uzun ömür, verimlilik ve çevresel duyarlılık gözeterek ele alırız." },
  { icon: "vision", t: "Çağdaş Tasarım", d: "Mühendislik disiplinini çağdaş bir tasarım anlayışıyla bir araya getiririz." },
];

export default function KurumsalPage() {
  return (
    <>
      <InteriorHero
        page="kurumsal"
        label="Kurumsal"
        title={
          <>
            İnşaata mühendislik<br className="hidden md:block" />{" "}
            <span className="text-accent-soft">gözüyle</span> bakan bir firma.
          </>
        }
        description="KUK İnşaat — Kaliteyle Kurulur"
      />

      <section className="pt-10 md:pt-14">
        <Container>
          <Reveal variant="up" delay={120}>
            <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
              {[
                { v: <Counter to={5} />, l: "Hizmet alanı" },
                { v: "Kocaeli", l: "Hizmet bölgesi" },
                { v: "Tek Elden", l: "Proje yönetimi" },
                { v: "Uçtan Uca", l: "Fikirden teslime" },
              ].map((s, i) => (
                <div key={i} className="bg-bg p-6 md:p-8">
                  <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-ink">{s.v}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- Hakkımızda ---------- */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
            {/* SOL: metin + bilgi tablosu (ana sayfa düzeniyle aynı) */}
            <div className="flex flex-col">
              <Reveal variant="left">
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  <span className="h-px w-10 bg-accent-warm" /> Hakkımızda
                </p>
                <h2 className="mt-6 text-[clamp(2.2rem,4.5vw,3.4rem)] leading-tight">
                  Kocaeli&apos;de değer üreten, kalıcı çözümler geliştiren bir yapı firması.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-ink/80">
                  Kocaeli merkezli inşaat ve mühendislik firması Kuk İnşaat; mühendislik
                  disiplini, kalite anlayışı ve güvenilirlik ilkeleriyle inşaat sektöründe
                  değer üretmeyi hedefler. Teknik uzmanlığı, çağdaş tasarım yaklaşımını ve
                  sürdürülebilirliği bir araya getirerek her projede nitelikli ve kalıcı
                  çözümler geliştirmeyi amaçlar.
                </p>
              </Reveal>

              {/* bilgi tablosu — kalan alanı doldurur */}
              <Reveal variant="up" delay={160} className="mt-8 flex-1">
                <dl className="grid h-full grid-cols-2 gap-px bg-line text-sm">
                  <div className="flex flex-col justify-center bg-bg p-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted">Hizmet Bölgesi</dt>
                    <dd className="mt-2 font-medium">Kocaeli ve çevresi</dd>
                  </div>
                  <div className="flex flex-col justify-center bg-bg p-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted">Faaliyet</dt>
                    <dd className="mt-2 font-medium">İnşaat · Proje · Mühendislik</dd>
                  </div>
                  <div className="flex flex-col justify-center bg-bg p-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted">E-posta</dt>
                    <dd className="mt-2 font-medium break-all">{site.contact.email}</dd>
                  </div>
                  <div className="flex flex-col justify-center bg-bg p-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted">Sosyal</dt>
                    <dd className="mt-2 font-medium">Instagram · LinkedIn — @kukinsaat</dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal variant="up" delay={240}>
                <p className="mt-6 text-xs leading-relaxed text-muted">{site.legalName}</p>
              </Reveal>
            </div>

            {/* SAĞ: görsel + koyu imza kartı (ana sayfa düzeniyle aynı) */}
            <div className="flex flex-col">
              <div className="group relative flex-1">
                <div className="relative h-full min-h-[340px] overflow-hidden">
                  <Image
                    src="/images/hero-architecture.jpg"
                    alt="Beton ve cam detaylı modern yapı cephesi"
                    fill
                    sizes="(max-width:1024px) 100vw, 46vw"
                    className="img-zoom img-duotone object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="pointer-events-none absolute inset-4 border border-white/15" aria-hidden="true" />
                  <span className="pointer-events-none absolute left-5 top-5 vertical-text text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-white/85">
                    Kaliteyle Kurulur
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 bg-ink p-7 text-white md:p-8">
                <div>
                  <p className="font-display text-xl font-semibold leading-tight md:text-2xl">
                    Fikirden teslime, tek elden.
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/55">
                    Projelendirme · Mühendislik · Uygulama
                  </p>
                </div>
                <span className="shrink-0 font-display text-5xl font-bold leading-none text-accent-soft">05</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Değerlerimiz (dark, icon cards) ---------- */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <p
          className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[12rem] leading-none text-white/[0.04] md:text-[18rem]"
          aria-hidden="true"
        >
          KUK
        </p>
        <Container className="relative">
          <div className="max-w-2xl">
            <Reveal variant="left">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
                <span className="h-px w-10 bg-accent-soft" /> Değerlerimiz
              </p>
            </Reveal>
            <LineReveal
              as="h2"
              className="mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-tight text-white"
              lines={["Her işte gözettiğimiz", "altı temel ilke."]}
            />
          </div>

          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} variant="up" delay={i * 80}>
                <div className="group relative h-full overflow-hidden bg-ink p-8 transition-colors duration-500 hover:bg-white/[0.05] md:p-10">
                  <span className="absolute right-6 top-6 font-display text-2xl text-white/15 transition-colors group-hover:text-accent-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex text-accent-soft transition-transform duration-500 group-hover:-translate-y-1">
                    <ValueIcon name={v.icon} className="h-10 w-10" />
                  </span>
                  <span className="line-grow mt-6 block h-px w-full bg-accent-soft/50" />
                  <h3 className="mt-6 font-display text-2xl">{v.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Kalite Anlayışımız ---------- */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal variant="left" className="lg:col-span-6">
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src="/images/abstract-projeler.jpg"
                  alt="Yapı planı üzerinde teknik değerlendirme"
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="img-duotone object-cover"
                />
              </div>
            </Reveal>
            <div className="lg:col-span-6">
              <Reveal variant="right">
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  <span className="h-px w-10 bg-accent-warm" /> Kalite Anlayışımız
                </p>
                <h2 className="mt-6 text-[clamp(1.9rem,3.5vw,3.1rem)] leading-tight">
                  Kalite, detaylara gösterilen özenle başlar.
                </h2>
                <p className="mt-6 leading-relaxed text-ink/80">
                  Malzeme seçiminden işçiliğe, imalat aşamalarından teslim öncesi son
                  kontrole kadar her adımı belirli ölçütlere göre denetliyoruz. Aldığımız
                  kararları ve yaptığımız kontrolleri kayıt altına alıyor, böylece işin
                  her aşamasını geriye dönük olarak takip edebiliyoruz.
                </p>
                <Link
                  href="/iletisim"
                  className="group mt-9 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em]"
                >
                  Bizimle çalışın
                  <span className="flex h-10 w-10 items-center justify-center border border-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white">
                    →
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Hizmet köprüsü ---------- */}
      <section className="pb-24">
        <Container>
          <Reveal variant="scale">
            <div className="relative overflow-hidden border border-line">
              <div className="dot-grid pointer-events-none absolute inset-0 text-ink/[0.05]" aria-hidden="true" />
              <div className="relative grid gap-8 p-8 md:grid-cols-12 md:items-center md:p-14">
                <div className="md:col-span-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Hizmetlerimiz</p>
                  <h2 className="mt-5 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight">
                    İnşaattan mühendisliğe, beş alanda hizmet veriyoruz.
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/hizmetler/${s.slug}`}
                        className="border border-ink/15 px-4 py-2 text-sm transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
                      >
                        {s.shortTitle}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-5 md:text-right">
                  <Link
                    href="/hizmetler"
                    className="btn-sheen group inline-flex items-center gap-3 bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink-hover"
                  >
                    Tüm hizmetler
                    <span className="nudge-x">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}