import type {
  EventFieldErrors,
  ValidatedEventInput,
  ValidatedEventPatch,
} from "../types/event.types";
import { parseYouTubeId } from "./youtube";
type Result<T> =
  { success: true; data: T } | { success: false; errors: EventFieldErrors };
const allowed = ["title", "description", "youtubeUrl", "startsAt", "isVisible"];
function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.exec(
      value,
    );
  if (!match) return null;
  const [, y, m, d, h, minute, second] = match;
  const year = Number(y),
    month = Number(m),
    day = Number(d);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > days[month - 1] ||
    Number(h) > 23 ||
    Number(minute) > 59 ||
    Number(second ?? 0) > 59
  )
    return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}
function validate(
  input: unknown,
  create: boolean,
): Result<ValidatedEventInput> {
  if (!isObject(input))
    return { success: false, errors: { title: "Enter event details." } };
  const errors: EventFieldErrors = {};
  if (Object.keys(input).some((key) => !allowed.includes(key)))
    errors.title = "Only event details and visibility can be saved.";
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title || title.length > 120)
    errors.title = "Enter a title of 1 to 120 characters.";
  const description = input.description === undefined ? "" : input.description;
  if (typeof description !== "string" || description.length > 2000)
    errors.description = "Use at most 2,000 characters.";
  const youtubeId =
    typeof input.youtubeUrl === "string" && input.youtubeUrl.length <= 2048
      ? parseYouTubeId(input.youtubeUrl)
      : null;
  if (!youtubeId)
    errors.youtubeUrl = "Paste the video's HTTPS YouTube Share link.";
  const startsAt = normalizeDate(input.startsAt);
  if (!startsAt)
    errors.startsAt = "Enter a valid date and time with a timezone.";
  const isVisible =
    create && input.isVisible === undefined ? true : input.isVisible;
  if (typeof isVisible !== "boolean")
    errors.isVisible = "Choose whether to show this event to the public.";
  if (Object.keys(errors).length) return { success: false, errors };
  return {
    success: true,
    data: {
      title,
      description: description as string,
      youtubeId: youtubeId!,
      startsAt: startsAt!,
      isVisible: isVisible as boolean,
    },
  };
}
export function validateEventInput(
  input: unknown,
): Result<ValidatedEventInput> {
  return validate(input, true);
}
export function validateEventPatch(
  input: unknown,
): Result<ValidatedEventPatch> {
  if (
    isObject(input) &&
    Object.keys(input).length === 1 &&
    typeof input.isVisible === "boolean"
  )
    return { success: true, data: { isVisible: input.isVisible } };
  return validate(input, false);
}
