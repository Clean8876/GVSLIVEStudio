export interface StreamEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
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
  startsAt: string;
  isVisible: boolean;
}
export type EventFieldErrors = Partial<Record<keyof EventInput, string>>;
export type ValidatedEventInput = Omit<EventInput, "youtubeUrl"> & {
  youtubeId: string;
};
export type ValidatedEventPatch = ValidatedEventInput | { isVisible: boolean };
