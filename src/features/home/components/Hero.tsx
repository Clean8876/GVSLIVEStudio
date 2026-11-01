import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/Parallax";
import { siteConfig } from "@/config/constants";

const eventTypes = [
  {
    title: "Conferences & keynotes",
    description: "Take the conversation beyond the venue.",
  },
  {
    title: "Corporate gatherings",
    description: "Connect teams, partners and people.",
  },
  {
    title: "Private celebrations",
    description: "Share the occasion with those far away.",
  },
];

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="overflow-hidden bg-[#122440] text-white"
    >
      <div className="relative isolate">
        <div className="relative z-10 mx-auto w-full max-w-[1760px] px-5 py-14 sm:px-8 sm:py-20 lg:flex lg:min-h-[650px] lg:items-center lg:px-12 lg:py-24 xl:px-16">
          <div className="max-w-xl lg:max-w-[54%] xl:max-w-[48%]">
            <h1
              id="hero-heading"
              className="max-w-[640px] text-[clamp(3rem,5.7vw,5rem)] font-semibold leading-[1.06] tracking-[-.055em] text-balance"
            >
              Bring your event to every screen.
            </h1>
            <p className="mt-7 max-w-[430px] font-body text-xl leading-relaxed text-[#e0e6ef] sm:text-[22px]">
              Professional live streaming for the moments that deserve a wider
              audience.
            </p>
            <p className="mt-4 max-w-[420px] font-body text-base leading-relaxed text-[#bdcadb] sm:text-lg">
              From the opening keynote to the final celebration, GVS connects
              what happens in the room with the people who can’t be there.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 gap-3 rounded-md bg-[#d7b77c] px-6 text-sm text-[#122440] hover:bg-[#e5c995]"
              >
                <a href={siteConfig.phones[0].href}>
                  Discuss your event
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-12 gap-3 rounded-md px-4 text-sm text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#events">
                  <Play aria-hidden="true" className="size-4" />
                  Explore events
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="relative -mt-2 h-[280px] sm:h-[380px] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[28%] lg:-z-10 lg:mt-0 lg:h-auto">
          <Parallax>
            <Image
              src="/images/corporate-hero.webp"
              alt="Professional broadcast camera filming a speaker and audience at a corporate conference"
              fill
              priority
              sizes="(min-width: 1024px) 72vw, 100vw"
              className="object-cover object-[68%_center] lg:object-center"
            />
          </Parallax>
          <div className="absolute inset-0 bg-linear-to-b from-[#122440] via-transparent to-[#122440]/20 lg:bg-none" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#122440_0%,rgba(18,36,64,0.95)_14%,rgba(18,36,64,0.7)_32%,rgba(18,36,64,0.15)_60%,transparent_100%)] lg:block" />
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto grid w-full max-w-[1760px] gap-6 px-5 py-7 sm:grid-cols-3 sm:gap-8 sm:px-8 sm:py-8 lg:px-12 xl:px-16">
          {eventTypes.map(({ title, description }) => (
            <div key={title}>
              <h2 className="text-sm font-semibold text-[#e3c994]">{title}</h2>
              <p className="mt-2 font-body text-base leading-relaxed text-[#bdcadb]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
