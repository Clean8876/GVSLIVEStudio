"use client";
import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export function VisitorMonitor() {
  const [visitors, setVisitors] = useState<number | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    apiClient.get<{ visitors: number }>("/analytics/visitors")
      .then(({ data }) => { if (active) setVisitors(data.visitors); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return (
    <section aria-labelledby="visitor-monitor-title" className="mb-7 flex w-full items-center gap-4 rounded-xl border bg-white p-5 sm:w-fit sm:min-w-64">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gold-light text-gold"><UsersRound className="size-5" aria-hidden="true" /></span>
      <div><h2 id="visitor-monitor-title" className="font-body text-sm text-muted-foreground">Website visitors</h2>
        <p className="mt-1 text-xl font-bold text-navy" role="status">{error ? "Unavailable" : visitors === null ? "Loading…" : visitors.toLocaleString()}</p>
      </div>
    </section>
  );
}
