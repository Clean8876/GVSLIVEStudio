import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  EventWatchPage,
  UnavailableEvent,
} from "@/features/events/components/EventWatchPage";
import { getEventRepository } from "@/features/events/services/event-repository";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventRepository().getPublicBySlug(slug);
  return {
    title: event?.title ?? "Event unavailable",
    robots: event ? undefined : { index: false, follow: false },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const event = await getEventRepository().getBySlug(slug);
  if (!event) notFound();
  if (!event.isVisible) return <UnavailableEvent />;
  return <EventWatchPage event={event} />;
}
