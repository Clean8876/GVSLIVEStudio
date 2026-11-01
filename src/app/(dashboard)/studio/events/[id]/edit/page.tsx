"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { EventForm } from "@/features/events/components/EventForm";
import type { StreamEvent } from "@/features/events/types/event.types";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<StreamEvent | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiClient.get<{ event: StreamEvent }>(`/events/${id}`).then(({ data }) => setEvent(data.event)).catch(() => setError("Could not load this event. Sign in and try again.")); }, [id]);
  if (error) return <main id="main-content"><p>{error}</p><Link className="underline" href="/admin/login">Sign in</Link></main>;
  return <main id="main-content">{event ? <EventForm event={event} /> : <p>Loading event…</p>}</main>;
}
