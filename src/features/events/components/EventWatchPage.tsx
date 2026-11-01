import Link from "next/link";
import { ArrowLeft, CalendarDays, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/constants";
import {
  formatEventDate,
  formatEventTime,
  isUpcomingEvent,
} from "../lib/dates";
import type { StreamEvent } from "../types/event.types";
import { StreamViewer } from "./StreamViewer";
import { CopyEventLink } from "./CopyEventLink";
export function EventWatchPage({ event }: { event: StreamEvent }) {
  const upcoming = isUpcomingEvent(event.startsAt);
  return (
    <main id="main-content" className="page-container py-9 sm:py-12">
      <Link
        href="/#events"
        className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        All events
      </Link>
      <div className="mb-7 mt-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="max-w-4xl break-words text-3xl font-extrabold tracking-tight sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 font-body text-base text-muted-foreground">
            <CalendarDays className="size-4" />
            {formatEventDate(event.startsAt)} ·{" "}
            {formatEventTime(event.startsAt)}
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {upcoming ? "Upcoming" : "Watch event"}
        </Badge>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[1fr_300px]">
        <div>
          <StreamViewer streams={event.streams?.length ? event.streams : [{ name: "Main stream", youtubeId: event.youtubeId }]} title={event.title} />
          <div className="my-6 flex flex-wrap gap-3"><CopyEventLink slug={event.slug} /></div>
          {event.description && (
            <section className="border-t pt-6">
              <h2 className="text-xl font-bold">About this event</h2>
              <p className="mt-4 whitespace-pre-wrap break-words font-body text-lg leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </section>
          )}
        </div>
        <aside className="rounded-xl border bg-secondary/60 p-6">
          <h2 className="text-xl font-bold">Event details</h2>
          <p className="mt-5 font-body text-sm text-muted-foreground">
            Scheduled for
          </p>
          <p className="mt-2 font-body text-lg font-semibold">
            {formatEventDate(event.startsAt)}
            <br />
            {formatEventTime(event.startsAt)}
          </p>
          <div className="my-6 border-t" />
          <h3 className="font-bold">Need a hand?</h3>
          <p className="mt-3 font-body text-base leading-relaxed text-muted-foreground">
            For viewing help or event enquiries, contact Girish.
          </p>
          <div className="mt-4 space-y-2">
            {siteConfig.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="block font-body text-base font-semibold"
              >
                {phone.label}
              </a>
            ))}
          </div>
          <Button asChild className="mt-5 w-full">
            <a href={siteConfig.phones[0].href}>
              <Phone className="size-4" />
              Contact
            </a>
          </Button>
          <p className="mt-4 font-body text-xs text-muted-foreground">
            No GVS account is needed to watch.
          </p>
        </aside>
      </div>
    </main>
  );
}
export function UnavailableEvent() {
  return (
    <main
      id="main-content"
      className="page-container flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center"
    >
      <h1 className="text-2xl font-bold sm:text-3xl">
        This event is not currently available.
      </h1>
      <p className="max-w-md font-body text-lg text-muted-foreground">
        You can explore the other events on our website.
      </p>
      <Button asChild>
        <Link href="/#events">Browse events</Link>
      </Button>
    </main>
  );
}
