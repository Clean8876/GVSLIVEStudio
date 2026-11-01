"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CopyEventLink({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState("");
  async function copy() {
    const url = new URL(`/events/${slug}`, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setFallback("");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFallback(url);
    }
  }
  return (
    <div className="min-w-0">
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={copy}
        aria-label={
          copied ? "Public event link copied" : "Copy public event link"
        }
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Link copied" : compact ? "Copy link" : "Copy public link"}
      </Button>
      <p className="sr-only" role="status">
        {copied ? "Public event link copied." : ""}
      </p>
      {fallback && (
        <p
          role="status"
          className="mt-2 max-w-sm break-all font-body text-xs text-muted-foreground"
        >
          Copy this address: {fallback}
        </p>
      )}
    </div>
  );
}
