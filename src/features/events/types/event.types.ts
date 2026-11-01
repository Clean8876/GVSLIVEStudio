export interface EventStream { name: string; youtubeId: string }
export interface EventStreamInput { name: string; youtubeUrl: string }
export interface StreamEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  streams?: EventStream[];
  startsAt: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  hasImage?: boolean;
}
export interface EventInput {
  title: string;
  description: string;
  youtubeUrl: string;
  streams?: EventStreamInput[];
  startsAt: string;
  isVisible: boolean;
}
export type EventFieldErrors = Partial<Record<keyof EventInput, string>>;
export type ValidatedEventInput = Omit<EventInput, "youtubeUrl" | "streams"> & {
  youtubeId: string;
  streams?: EventStream[];
};
export type ValidatedEventPatch = ValidatedEventInput | { isVisible: boolean };
