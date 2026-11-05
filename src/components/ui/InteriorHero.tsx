import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Illustration, type IllustrationPage } from "@/components/ui/Illustration";
import "./page-hero.css";
export function InteriorHero({
  page,
  label,
  title,
  description,
  tone = "cool",
}: {
  page: Exclude<IllustrationPage, "home">;
  label: string;
  title: ReactNode;
  description: ReactNode;
  tone?: "cool" | "warm" | "stone";
}) {
  return (
    <section className="hero-surface page-hero">
      <div className="page-hero__art" aria-hidden="true">
        <Illustration page={page} fit="slice" className="page-hero__scene" priority decorative />
      </div>
      <div className="page-hero__veil" aria-hidden="true" />

      <Container className="page-hero__container">
        <div className="page-hero__copy">
          <p className={`page-hero__label hero-anim hero-anim-1 ${tone === "warm" ? "page-hero__label--warm" : ""}`}>
            <span aria-hidden="true" />
            {label}
          </p>
          <h1 className="page-hero__title hero-anim hero-anim-2">{title}</h1>
          <p className="page-hero__description hero-anim hero-anim-3">{description}</p>
        </div>
      </Container>

      <div className="page-hero__mobile-art" aria-hidden="true">
        <Illustration page={page} fit="meet" className="page-hero__scene" priority decorative />
      </div>
    </section>
  );
}
