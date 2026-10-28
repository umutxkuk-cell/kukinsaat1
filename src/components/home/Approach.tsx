import { Image } from "@/lib/next-shim";
import { Link } from "@/lib/next-shim";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const values = [
  { n: "01", t: "Teknik yeterlilik", d: "Kararları statik hesap, detay çözümü ve sahadaki uygulanabilirliğe dayandırırız." },
  { n: "02", t: "Uygulama kalitesi", d: "Malzeme ve işçiliği, proje başında belirlenen standartlara göre denetleriz." },
  { n: "03", t: "Açık iletişim", d: "İş sahibini süreç, bütçe ve ilerleme konusunda düzenli olarak bilgilendiririz." },
];

export function Approach() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* iki sütun eşit yükseklikte — boşluk kalmaz */}
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          {/* SOL: metin + değerler */}
          <div className="flex flex-col">
            <Reveal variant="left">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-10 bg-accent-warm" /> Hakkımızda
              </p>
              <h2 className="mt-6 text-[clamp(2.2rem,4.5vw,3.4rem)] leading-tight">
                İnşaata mühendislik <em className="text-accent">gözüyle</em> bakıyoruz.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink/80">
                KUK İnşaat; mühendislik disiplini, kalite anlayışı ve güvenilirlik
                ilkeleriyle inşaat sektöründe değer üretmeyi hedefler. Teknik uzmanlığı,
                çağdaş tasarım yaklaşımını ve sürdürülebilirliği bir araya getirerek her
                projede nitelikli ve kalıcı çözümler geliştirmeyi amaçlar.
              </p>
            </Reveal>

            {/* değerler — kalan alanı doldurur */}
            <div className="mt-8 flex-1 border-t border-line">
              {values.map((v, i) => (
                <Reveal key={v.n} variant="up" delay={i * 110}>
                  <div className="group flex gap-5 border-b border-line py-5 transition-colors hover:bg-bg-2/60">
                    <span className="font-display text-2xl text-accent">{v.n}</span>
                    <div>
                      <h3 className="font-sans text-base font-semibold">{v.t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{v.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal variant="up" delay={200}>
              <Link href="/kurumsal" className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em]">
                Firmamızı tanıyın
                <span className="flex h-10 w-10 items-center justify-center border border-ink transition-all group-hover:bg-ink group-hover:text-white">→</span>
              </Link>
            </Reveal>
          </div>

          {/* SAĞ: görsel + altında koyu imza kartı (animasyonsuz — her zaman görünür) */}
          <div className="flex flex-col">
            <div className="group relative flex-1">
              <div className="relative h-full min-h-[340px] overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/9683985/pexels-photo-9683985.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1500&w=1100"
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

            {/* koyu imza kartı — görselin altını kapatır, sağ sütunu dengeler */}
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
  );
}
