import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LineReveal } from "@/components/ui/LineReveal";
import { LogoDraw } from "@/components/brand/LogoDraw";

export function SloganBand() {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-24 text-white md:py-36">
      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <Reveal variant="scale">
            <LogoDraw className="h-28 w-auto md:h-36" color="#ffffff" />
          </Reveal>

          <Reveal variant="up" delay={200}>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.42em] text-white/50">
              Sloganımız
            </p>
          </Reveal>

          <LineReveal
            as="h2"
            className="mt-6 font-display text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.02em]"
            stagger={0}
            lines={["Kaliteyle Kurulur"]}
          />

          <Reveal variant="up" delay={320}>
            <p className="mx-auto mt-8 max-w-xl leading-relaxed text-white/65">
              Bir yapının değeri; kullanılan malzemede, işçilikte ve her kararın
              arkasındaki özende saklıdır. Biz işimizi bu inançla yapıyoruz.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}