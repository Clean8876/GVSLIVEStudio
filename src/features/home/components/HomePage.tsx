import { About } from "./About";
import { Contact } from "./Contact";
import { Events } from "./Events";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { getFeaturedContent } from "../data/home-content";
import type { StreamEvent } from "../types/home.types";
export function HomePage({ events = [] }: { events?: readonly StreamEvent[] }) {
  const featured = getFeaturedContent(events);
  return (
    <main id="main-content">
      <Hero />
      <Features />
      <Events events={events} featured={featured} />
      <About />
      <HowItWorks />
      <Faq />
      <Contact />
    </main>
  );
}
