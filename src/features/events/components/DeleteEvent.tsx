"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { StreamEvent } from "../types/event.types";

export function DeleteEvent({ event, onDeleted }: { event: StreamEvent; onDeleted: (id: string) => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await apiClient.delete(`/events/${encodeURIComponent(event.id)}`);
      setOpen(false);
      onDeleted(event.id);
      router.refresh();
    } catch {
      setError("Could not delete this event. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!pending) { setOpen(next); setError(""); } }}>
      <DialogTrigger asChild>
        <Button type="button" size="icon" variant="ghost" className="size-8 text-destructive" aria-label={`Delete ${event.title}`}>
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!pending} onEscapeKeyDown={(e) => { if (pending) e.preventDefault(); }} onPointerDownOutside={(e) => { if (pending) e.preventDefault(); }}>
        <DialogHeader>
          <DialogTitle>Delete this event?</DialogTitle>
          <DialogDescription>This permanently removes “{event.title}” from the website. Your YouTube video will stay on YouTube.</DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="button" variant="destructive" disabled={pending} onClick={remove}>{pending ? "Deleting…" : "Delete event"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
