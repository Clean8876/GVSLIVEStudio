import type { StreamEvent } from "@/features/events/types/event.types";
export type { StreamEvent };
export type FeaturedContent =
  { kind: "watch" | "upcoming"; event: StreamEvent } | { kind: "empty" };
