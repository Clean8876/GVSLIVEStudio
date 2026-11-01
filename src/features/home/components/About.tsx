import Image from "next/image";
import { ArrowRight, Camera, Heart, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/constants";
const values = [
  {
    icon: Camera,
    title: "Thoughtful coverage",
    copy: "Your occasion, carefully shared",
  },
  {
    icon: UsersRound,
    title: "Special moments",
    copy: "Weddings, celebrations and more",
  },
  {
    icon: Heart,
    title: "Together, always",
    copy: "Bring your loved ones closer",
  },
];
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-secondary/65 py-14 sm:py-18"
    >
      <div className="page-container grid items-center gap-9 md:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <div className="relative aspect-[1.12] overflow-hidden rounded-xl">
          <Image
            src="/images/about-videographer.webp"
            alt="A videographer recording a wedding celebration with a professional camera"
            fill
            sizes="(min-width: 1280px) 490px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute bottom-5 left-5 rounded-md border border-white/30 bg-navy/90 px-4 py-3 text-white">
            <Camera className="mb-2 size-5 text-[#d6b577]" />
            <p className="text-xs font-semibold">
              Your story. Shared with care.
            </p>
          </div>
        </div>
        <div>
          <div className="mb-4 h-[3px] w-12 rounded-full bg-gold" />
          <h2 id="about-heading" className="section-heading leading-tight">
            About GVS Live Stream
          </h2>
          <p className="body-copy mt-5">
            We help bring family and friends together through live event
            streaming. Girish and the GVS team share your special moments with
            people near and far.
          </p>
          <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
            From weddings and engagements to family celebrations, we make it
            easy for the people who can’t be there to still be part of your day.
          </p>
          <Button asChild className="mt-6 h-11 gap-5 px-6">
            <a href={siteConfig.phones[0].href}>
              Get in touch
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <div className="mt-9 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-start gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/50">
                  <Icon className="size-4 text-gold" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[11px] font-bold leading-relaxed">
                    {title}
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
