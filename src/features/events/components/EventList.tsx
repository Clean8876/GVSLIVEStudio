import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  EyeOff,
  ImageIcon,
  Plus,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { StreamEvent } from "../types/event.types";
import { formatEventDate, formatEventTime } from "../lib/dates";
import { CopyEventLink } from "./CopyEventLink";
import { VisibilitySwitch } from "./VisibilitySwitch";
import { DeleteEvent } from "./DeleteEvent";
function Actions({ event, onDeleted }: { event: StreamEvent; onDeleted: (id: string) => void }) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/studio/events/${event.id}/edit`}>Edit</Link>
      </Button>
      <CopyEventLink slug={event.slug} compact />
      <DeleteEvent event={event} onDeleted={onDeleted} />
      {event.isVisible && (
        <Button asChild size="icon" variant="ghost" className="size-8">
          <Link
            href={`/events/${event.slug}`}
            aria-label={`View ${event.title}`}
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
export function EventList({ events, onDeleted }: { events: StreamEvent[]; onDeleted: (id: string) => void }) {
  const visible = events.filter((event) => event.isVisible).length;
  return (
    <main id="main-content">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your events
          </h1>
          <p className="mt-3 font-body text-lg text-muted-foreground">
            Add your YouTube link. Choose what your visitors can see.
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/studio/events/new">
            <Plus className="size-4" />
            Add event
          </Link>
        </Button>
      </div>
      {events.length === 0 ? (
        <section className="flex min-h-[330px] flex-col items-center justify-center rounded-xl border border-dashed bg-white p-8 text-center">
          <Video className="size-10 text-gold" />
          <h2 className="mt-5 text-xl font-bold">
            Your first event starts here.
          </h2>
          <p className="mt-3 max-w-md font-body text-base text-muted-foreground">
            Paste a YouTube Share link, add the details, and we’ll create a page
            you can share.
          </p>
          <Button asChild className="mt-6">
            <Link href="/studio/events/new">
              <Plus className="size-4" />
              Add your first event
            </Link>
          </Button>
        </section>
      ) : (
        <>
          <p className="mb-5 font-body text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "event" : "events"} ·{" "}
            {visible} shown to public · {events.length - visible} hidden
          </p>
          <div className="hidden overflow-hidden rounded-xl border bg-white md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-5">Event</TableHead>
                  <TableHead>Scheduled time</TableHead>
                  <TableHead>Show to public</TableHead>
                  <TableHead className="w-[275px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="p-5">
                      <Link
                        href={`/studio/events/${event.id}/edit`}
                        className="flex items-center gap-4"
                      >
                        <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md">
                          {event.hasImage ? (
                            <Image
                              src={`https://i.ytimg.com/vi/${event.youtubeId}/hqdefault.jpg`}
                              alt=""
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-secondary">
                              <ImageIcon className="size-5 text-muted-foreground" />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-[300px] break-words text-sm font-bold">
                            {event.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className="mt-2 text-[10px]"
                          >
                            {event.isVisible ? "Shown to public" : "Hidden"}
                          </Badge>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-body text-sm">
                        {formatEventDate(event.startsAt)}
                      </p>
                      <p className="mt-1 font-body text-xs text-muted-foreground">
                        {formatEventTime(event.startsAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <VisibilitySwitch
                        key={`${event.id}-${event.isVisible}`}
                        eventId={event.id}
                        initialVisible={event.isVisible}
                        title={event.title}
                      />
                    </TableCell>
                    <TableCell>
                      <Actions event={event} onDeleted={onDeleted} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-4 md:hidden">
            {events.map((event) => (
              <article
                key={event.id}
                className="space-y-5 rounded-xl border bg-white p-5"
              >
                <Link
                  href={`/studio/events/${event.id}/edit`}
                  className="block text-lg font-bold"
                >
                  {event.title}
                </Link>
                <p className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                  <CalendarDays className="mt-0.5 size-4 shrink-0" />
                  {formatEventDate(event.startsAt)} ·{" "}
                  {formatEventTime(event.startsAt)}
                </p>
                <div className="flex items-start justify-between gap-4 border-y py-4">
                  <span className="text-sm font-semibold">Show to public</span>
                  <VisibilitySwitch
                    key={`${event.id}-${event.isVisible}`}
                    eventId={event.id}
                    initialVisible={event.isVisible}
                    title={event.title}
                  />
                </div>
                <Actions event={event} onDeleted={onDeleted} />
              </article>
            ))}
          </div>
        </>
      )}
      <div className="mt-7 flex items-start gap-3 rounded-lg border border-gold/20 bg-gold-light/60 p-5">
        <EyeOff className="mt-1 size-5 shrink-0 text-gold" />
        <p className="font-body text-sm leading-relaxed text-muted-foreground">
          Hidden events stay saved here. Visitors can’t watch them on your
          website until you turn “Show to public” on again. YouTube handles
          starting and ending each broadcast.
        </p>
      </div>
    </main>
  );
}
