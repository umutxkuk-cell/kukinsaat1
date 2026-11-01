import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-32 md:py-44">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        <span className="h-px w-10 bg-accent-warm" /> 404
      </p>
      <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] leading-[1.03]">
        Aradığınız sayfa bulunamadı.
      </h1>
      <p className="mt-5 max-w-lg leading-relaxed text-muted">
        Bağlantı değişmiş ya da içerik taşınmış olabilir. Ana sayfadan devam edebilir veya
        hizmetlerimize göz atabilirsiniz.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Button href="/">Ana Sayfa</Button>
        <Button href="/hizmetler" variant="secondary">
          Hizmetlerimiz
        </Button>
      </div>
    </Container>
  );
}
