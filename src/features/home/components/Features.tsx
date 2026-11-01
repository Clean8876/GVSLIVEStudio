import { MonitorPlay, Share2, Youtube } from "lucide-react";
const benefits = [
  {
    icon: MonitorPlay,
    title: "Simple to watch",
    text: "No account or special app needed",
  },
  { icon: Youtube, title: "Live on YouTube", text: "Your event, easy to join" },
  { icon: Share2, title: "Share with family", text: "Keep everyone connected" },
];
export function Features() {
  return (
    <section
      aria-label="Watching with GVS"
      className="border-y border-border/60 bg-secondary/60"
    >
      <div className="page-container grid gap-5 py-6 sm:grid-cols-3 sm:gap-0 sm:py-7">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-center gap-4 sm:justify-center sm:px-4 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-border"
          >
            <Icon className="size-8 shrink-0 text-gold" strokeWidth={1.6} />
            <div>
              <h2 className="text-sm font-bold">{title}</h2>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
