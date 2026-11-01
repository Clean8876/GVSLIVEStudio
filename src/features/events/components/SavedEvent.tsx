import Link from "next/link";
import { CheckCircle2, EyeOff, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StreamEvent } from "../types/event.types";
import { CopyEventLink } from "./CopyEventLink";
export function SavedEvent({ event }: { event: StreamEvent }) {
  return (
    <section className="mx-auto max-w-xl rounded-xl border bg-white p-7 sm:p-10">
      <CheckCircle2 className="size-10 text-emerald-700" />
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
        {event.isVisible
          ? "Your event is ready to share."
          : "Your event is saved."}
      </h1>
      <p className="mt-4 font-body text-lg text-muted-foreground">
        {event.title}
      </p>
      {!event.isVisible && (
        <p className="mt-4 flex items-center gap-2 font-body text-sm text-muted-foreground">
          <EyeOff className="size-4" />
          This event is hidden from the public.
        </p>
      )}
      <p className="mt-4 break-all rounded-md bg-muted px-4 py-3 font-body text-sm">
        /events/{event.slug}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <CopyEventLink slug={event.slug} />
        {event.isVisible && (
          <Button asChild>
            <Link href={`/events/${event.slug}`}>
              View event
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href={`/studio/events/${event.id}/edit`}>Edit event</Link>
        </Button>
      </div>
      <Link
        href="/studio/events"
        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft className="size-4" />
        Back to your events
      </Link>
    </section>
  );
}
