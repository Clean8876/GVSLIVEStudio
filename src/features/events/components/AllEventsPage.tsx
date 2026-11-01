import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { EventCard } from "@/features/home/components/EventCard";
import type { StreamEvent } from "../types/event.types";

const PAGE_SIZE = 10;

export function AllEventsPage({ events, requestedPage }: { events: StreamEvent[]; requestedPage?: string }) {
  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const parsed = Number(requestedPage);
  const page = Number.isSafeInteger(parsed) && parsed > 0 ? Math.min(parsed, totalPages) : 1;
  const visibleEvents = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <main id="main-content" className="page-container py-10 sm:py-14">
      <Link href="/#events" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-navy"><ArrowLeft className="size-4" /> Back to home</Link>
      <div className="mb-8 mt-7">
        <h1 className="section-heading">All events</h1>
        <div className="section-rule" />
        <p className="mt-4 font-body text-lg text-muted-foreground">Watch and share celebrations from anywhere.</p>
      </div>
      {visibleEvents.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}</div>
      ) : (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed bg-secondary/40 p-8 text-center">
          <Video className="size-10 text-gold" />
          <h2 className="mt-5 text-xl font-bold">No public events right now.</h2>
          <p className="mt-3 font-body text-muted-foreground">Check back for the next celebration.</p>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} basePath="/events" />
    </main>
  );
}
