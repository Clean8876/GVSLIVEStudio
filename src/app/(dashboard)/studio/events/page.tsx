"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { EventList } from "@/features/events/components/EventList";
import type { StreamEvent } from "@/features/events/types/event.types";
export default function Page() {
  const [events, setEvents] = useState<StreamEvent[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiClient.get<{ events: StreamEvent[] }>("/events").then(({ data }) => setEvents(data.events)).catch(() => setError("Sign in to see your events.")); }, []);
  if (error) return <main id="main-content"><p>{error}</p><Link className="underline" href="/admin/login">Sign in</Link></main>;
  return events ? <EventList events={events} /> : <p>Loading events…</p>;
}
