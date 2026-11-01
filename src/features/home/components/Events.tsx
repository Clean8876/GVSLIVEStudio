import { ArrowRight, CalendarClock, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/constants";
import { formatEventDate } from "../data/home-content";
import type { FeaturedContent, StreamEvent } from "../types/home.types";
import { EventCard } from "./EventCard";
export function Events({
  events,
  featured,
}: {
  events: readonly StreamEvent[];
  featured: FeaturedContent;
}) {
  const additional =
    featured.kind === "empty"
      ? []
      : events
          .filter((event) => event.isVisible && event.id !== featured.event.id)
          .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="py-14 sm:py-18"
    >
      <div className="page-container">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="events-heading" className="section-heading">
              Explore our events
            </h2>
            <div className="section-rule" />
          </div>
          <p className="font-body text-sm text-muted-foreground">
            A front-row seat, wherever you are.
          </p>
        </div>
        {featured.kind === "upcoming" && (
          <div
            role="status"
            className="mb-7 flex flex-col gap-3 rounded-lg border border-gold/25 bg-gold-light/55 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-bold">
                  The next celebration is on its way.
                </p>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  Next up: {featured.event.title} on{" "}
                  {formatEventDate(featured.event.startsAt)}.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold underline-offset-4 hover:underline"
            >
              Have an event in mind?
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        )}
        {featured.kind === "empty" ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center">
            <Video className="size-10 text-gold" />
            <h3 className="mt-5 text-xl font-bold">
              No public events right now.
            </h3>
            <p className="mt-3 max-w-md font-body text-base text-muted-foreground">
              We’ll share the next celebration here. Talk to Girish about an
              upcoming broadcast or streaming your own occasion.
            </p>
            <Button asChild className="mt-6">
              <a href={siteConfig.phones[0].href}>Contact</a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div
              className={
                additional.length === 0
                  ? "md:col-span-2 lg:col-span-4"
                  : "md:col-span-2 lg:col-span-2"
              }
            >
              <EventCard event={featured.event} featured />
            </div>
            {additional.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
