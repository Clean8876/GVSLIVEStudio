import { ArrowUpRight, MessageCircleMore, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/constants";

export function Contact() {
  const whatsapp = `https://wa.me/${siteConfig.phones[0].href.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Girish, I’d like to know more about GVS Live Stream for my event.")}`;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="pb-14 sm:pb-18">
      <div className="page-container">
        <div className="grid overflow-hidden rounded-2xl border border-gold/20 bg-gold-light md:grid-cols-[1fr_auto]">
          <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
            <div aria-hidden="true" className="mb-6 h-1 w-12 rounded-full bg-gold" />
            <h2 id="contact-heading" className="max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Your celebration deserves to be shared.
            </h2>
            <p className="mt-4 max-w-md font-body text-lg leading-relaxed text-muted-foreground">
              Planning an event? Tell Girish what you have in mind. We’d love to help you bring everyone together.
            </p>
          </div>
          <div className="flex flex-col justify-center border-t border-gold/20 bg-white/55 px-6 py-8 sm:px-10 md:min-w-[340px] md:border-l md:border-t-0 lg:px-12">
            <p className="text-lg font-bold">Get in touch with Girish</p>
            <p className="mt-1 font-body text-sm text-muted-foreground">Choose how you’d like to connect.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild size="lg" className="h-12 justify-between gap-5 bg-[#176b46] px-5 text-white hover:bg-[#115438]">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-3"><MessageCircleMore className="size-4" />Message on WhatsApp</span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 justify-between gap-5 border-navy/20 bg-white px-5 text-navy hover:bg-white/70">
                <a href={siteConfig.phones[0].href}>
                  <span className="flex items-center gap-3"><PhoneCall className="size-4" />Call {siteConfig.phones[0].label}</span>
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Also available at <a href={siteConfig.phones[1].href} className="font-semibold text-navy underline underline-offset-4">{siteConfig.phones[1].label}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
