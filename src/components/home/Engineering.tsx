import { Image } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";

const pillars = [
  { n: "01", title: "Ön değerlendirme", text: "İşe başlamadan önce zemin, proje ve saha koşullarını inceleriz." },
  { n: "02", title: "Proje koordinasyonu", text: "Mimari, statik ve mekanik projeleri birbiriyle uyumlu hâle getiririz." },
  { n: "03", title: "Detay çözümü", text: "Birleşim ve geçiş detaylarını uygulama öncesinde netleştiririz." },
  { n: "04", title: "Kalite kontrol", text: "İmalat aşamalarını belirlenen kontrol noktalarında denetleriz." },
  { n: "05", title: "İş programı", text: "Süre, bütçe ve iş sıralamasını baştan planlar, süreç boyunca izleriz." },
  { n: "06", title: "Teslim sonrası", text: "Teslim ettiğimiz yapının ardında durur, gerektiğinde destek veririz." },
];

export function Engineering() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-bg md:py-36">
      <p className="pointer-events-none absolute -top-6 right-0 font-display text-[16rem] leading-none text-white/[0.04] select-none" aria-hidden="true">
        KUK
      </p>
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal variant="left">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
                <span className="h-px w-10 bg-accent-soft" /> Çalışma Disiplinimiz
              </p>
              <h2 className="mt-6 text-[clamp(2.2rem,4.5vw,3.6rem)] text-white">
                Her işi aynı <em className="text-accent-soft">titizlikle</em> ele alıyoruz.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-white/68">
                Projenin büyüklüğü ne olursa olsun; değerlendirme, koordinasyon ve
                kalite kontrolü aynı özenle uyguluyoruz. İşte bu yaklaşım,
                sonucun kalitesini belirliyor.
              </p>
            </Reveal>
            <Reveal variant="clip" delay={200} className="mt-10 hidden lg:block">
              <Parallax speed={0.1} className="aspect-[16/10]">
                <Image
                  src="/images/abstract-hizmetler.jpg"
                  alt="Dokulu beton yüzey yakın planı"
                  fill
                  sizes="40vw"
                  className="object-cover opacity-90"
                />
              </Parallax>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2">
              {pillars.map((p, i) => (
                <Reveal key={p.title} variant={i % 2 === 0 ? "up" : "blur"} delay={i * 90}>
                  <div className="group h-full border-t border-white/12 p-6 transition-colors duration-500 hover:bg-white/[0.04] md:p-8">
                    <span className="font-display text-lg text-accent-soft">{p.n}</span>
                    <span className="line-grow mt-4 block h-px bg-accent-soft/70" />
                    <h3 className="mt-5 font-display text-2xl text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/62">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}