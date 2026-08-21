import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import Selvoria from "@/components/sections/Selvoria";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <Selvoria />
      <Experience />
      <About />
      <Skills />
      <Contact />
    </>
  );
}
