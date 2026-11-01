import { Hero } from "@/components/home/Hero";
import { Approach } from "@/components/home/Approach";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { Process } from "@/components/home/Process";
import { ContactCta } from "@/components/home/ContactCta";
import { SloganBand } from "@/components/home/SloganBand";
import { Faq } from "@/components/home/Faq";




export default function HomePage() {
  return (
    <>
      <Hero />
      <Approach />
      <ServicesPreview />
      <SloganBand />
      <ProjectsPreview />
      <Process />
      <Faq />
      <ContactCta />
    </>
  );
}