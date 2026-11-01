import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "../data/home-content";
export function Faq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-border/60 py-14 sm:py-16"
    >
      <div className="page-container grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-16">
        <div>
          <h2 id="faq-heading" className="section-heading">
            A few things
            <br />
            you might ask.
          </h2>
          <div className="section-rule" />
          <p className="body-copy mt-5 max-w-xs">
            Watching should be the easy part. Here’s what you need to know.
          </p>
        </div>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="py-5 text-left text-sm font-bold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-base leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
