import { isUpcomingEvent } from "@/features/events/lib/dates";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatEventDate, formatEventTime } from "../data/home-content";
import type { StreamEvent } from "../types/home.types";
export function EventCard({
  event,
  featured = false,
}: {
  event: StreamEvent;
  featured?: boolean;
}) {
  const upcoming = isUpcomingEvent(event.startsAt);
  return (
    <Card
      className={cn(
        "group relative gap-0 overflow-hidden rounded-xl border-0 bg-navy p-0 shadow-none",
        featured
          ? "min-h-[350px] md:min-h-[390px]"
          : "min-h-[290px] md:min-h-[390px]",
      )}
    >
      {event.hasImage && (
        <Image
          src={`https://i.ytimg.com/vi/${event.youtubeId}/hqdefault.jpg`}
          alt=""
          unoptimized
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              : "(min-width:1024px) 300px, (min-width:768px) 25vw, 100vw"
          }
          className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-black/40 [mask-image:linear-gradient(transparent,black_45%)]" />
      <div className="absolute left-5 top-5">
        <Badge className="border-0 bg-white px-3 py-1 text-[11px] text-navy shadow-none">
          {upcoming ? "Upcoming" : "Watch event"}
        </Badge>
      </div>
      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-5 sm:p-6">
        <h3
          className={cn(
            "break-words font-extrabold leading-tight tracking-tight text-white",
            featured ? "text-2xl sm:text-[28px]" : "text-xl",
          )}
        >
          {event.title}
        </h3>
        <p className="mt-3 flex items-center gap-2 font-body text-sm text-white/90">
          <CalendarDays className="size-4 shrink-0" />
          {formatEventDate(event.startsAt)}
        </p>
        <p className="mt-1 flex items-center gap-2 font-body text-sm text-white/80">
          <Clock3 className="size-4 shrink-0" />
          {formatEventTime(event.startsAt)}
        </p>
        <Button
          asChild
          variant={featured ? "secondary" : "outline"}
          className={cn(
            "mt-5 w-fit",
            !featured &&
              "border-white/50 bg-white/10 text-white hover:bg-white hover:text-navy",
          )}
        >
          <Link href={`/events/${event.slug}`}>
            {upcoming ? "View event" : "Watch event"}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
