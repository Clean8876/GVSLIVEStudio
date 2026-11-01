import { ArrowRight, Link2, MonitorPlay, Video } from "lucide-react";
const steps = [
  {
    icon: Video,
    title: "We stream your event",
    copy: "Talk to Girish, plan the day, and let us bring your occasion online.",
  },
  {
    icon: Link2,
    title: "Share the event link",
    copy: "Send your event page to family and friends. One link brings everyone together.",
  },
  {
    icon: MonitorPlay,
    title: "Watch from anywhere",
    copy: "Your loved ones can open the page and join the live celebration.",
  },
];
export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="py-14 sm:py-16">
      <div className="page-container">
        <h2
          id="how-heading"
          className="text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          How it works
        </h2>
        <div className="section-rule" />
        <ol className="mt-9 grid gap-8 md:grid-cols-3 md:gap-12">
          {steps.map(({ icon: Icon, title, copy }, index) => (
            <li key={title} className="relative flex gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold font-body text-lg font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <Icon className="mb-4 size-7 text-gold" strokeWidth={1.6} />
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="mt-2 max-w-[255px] font-body text-base leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </div>
              {index < 2 && (
                <ArrowRight className="absolute -right-6 top-8 hidden size-5 text-gold/70 md:block" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
