"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api-client";
import type { StreamEvent } from "../types/event.types";
export function VisibilitySwitch({
  eventId,
  initialVisible,
  title,
  onSaved,
  disabled = false,
  onPendingChange,
}: {
  eventId: string;
  initialVisible: boolean;
  title: string;
  onSaved?: (visible: boolean) => void;
  disabled?: boolean;
  onPendingChange?: (pending: boolean) => void;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(initialVisible);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  async function change(next: boolean) {
    if (pending || disabled) return;
    const previous = visible;
    setVisible(next);
    setPending(true);
    onPendingChange?.(true);
    setError("");
    setSaved(false);
    try {
      const { data: result } = await apiClient.patch<{ event: StreamEvent }>(
        `/events/${eventId}`,
        { isVisible: next },
      );
      setVisible(result.event.isVisible);
      onSaved?.(result.event.isVisible);
      setSaved(true);
      router.refresh();
    } catch {
      setVisible(previous);
      setError(
        "Could not save. Your previous setting is kept. Try the switch again.",
      );
    } finally {
      setPending(false);
      onPendingChange?.(false);
    }
  }
  return (
    <div>
      <div className="flex items-center gap-3">
        <Switch
          checked={visible}
          onCheckedChange={change}
          disabled={pending || disabled}
          aria-label={`Show ${title} to public`}
        />
        <span className="font-body text-sm text-muted-foreground">
          {pending ? "Saving…" : visible ? "Shown" : "Hidden"}
        </span>
      </div>
      <p role="status" className="mt-1 font-body text-xs text-muted-foreground">
        {saved && !pending && !error ? "Saved" : ""}
      </p>
      {error && (
        <p
          role="alert"
          className="mt-2 max-w-xs font-body text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
