import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/data/faq";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal variant="left">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-10 bg-accent-warm" /> Sık Sorulanlar
              </p>
              <h2 className="mt-6 text-[clamp(2rem,4vw,3.2rem)]">
                Aklınızdaki <em className="text-accent">sorular.</em>
              </h2>
              <p className="mt-6 leading-relaxed text-muted">
                Çalışma şeklimize dair en çok merak edilenleri derledik. Burada
                yanıtını bulamadığınız her şey için bize ulaşabilirsiniz.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-line">
              {faqs.map((item, i) => {
                const active = open === i;
                return (
                  <Reveal key={item.q} variant="up" delay={i * 60} as="li">
                    <div className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setOpen(active ? null : i)}
                        aria-expanded={active}
                        className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-accent"
                      >
                        <span className="font-display text-xl md:text-2xl">{item.q}</span>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center border border-current text-sm transition-transform duration-500 ${
                            active ? "rotate-45 bg-ink text-white" : ""
                          }`}
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </button>
                      <div
                        className={`grid transition-all duration-500 ease-out ${
                          active ? "grid-rows-[1fr] pb-7 opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-2xl leading-relaxed text-muted">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}