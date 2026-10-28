import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { n: "01", title: "Görüşme ve Keşif", text: "İhtiyaçlarınızı dinler, arsa ve yapı koşullarını yerinde inceleriz." },
  { n: "02", title: "Değerlendirme", text: "İşin yapılabilirliğini, bütçesini ve olası risklerini birlikte ele alırız." },
  { n: "03", title: "Projelendirme", text: "Mimari, statik ve mekanik projeleri uyumlu biçimde hazırlatır ve kontrol ederiz." },
  { n: "04", title: "Uygulama", text: "İnşaatı iş programına göre yürütür, her aşamayı denetleriz." },
  { n: "05", title: "Teslim", text: "Yapıyı teslim eder, sonrasında da yanınızda oluruz." },
];

export function Process() {
  return (
    <section className="py-24 md:py-36">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal variant="left">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-10 bg-accent-warm" /> Nasıl Çalışıyoruz
            </p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.2rem,4.5vw,3.6rem)]">
              İlk görüşmeden teslime, <em className="text-accent">beş adım.</em>
            </h2>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Hangi aşamada ne yaptığımızı baştan paylaşıyoruz. Böylece süreç
              boyunca nerede olduğunuzu her zaman bilirsiniz.
            </p>
          </Reveal>
        </div>

        <Reveal variant="up" className="relative mt-16">
          <span className="line-grow absolute left-0 right-0 top-7 hidden h-px bg-ink/20 lg:block" aria-hidden="true" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {steps.map((s, i) => (
              <li key={s.n} className="group relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center border border-ink bg-bg font-display text-xl transition-all duration-500 group-hover:bg-ink group-hover:text-white">
                  {s.n}
                </span>
                <span className="line-grow-y mt-6 block h-10 w-px bg-accent-warm/60 lg:hidden" aria-hidden="true" />
                <h3 className="mt-2 font-sans text-base font-semibold tracking-normal lg:mt-6">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                {i < steps.length - 1 && (
                  <span className="mt-5 block text-accent lg:hidden">↓</span>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}