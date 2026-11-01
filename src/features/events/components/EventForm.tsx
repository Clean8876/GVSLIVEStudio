"use client";
import axios from "axios";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import {
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImageIcon,
  LoaderCircle,
  Play,
  Save,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getISTInputs } from "../lib/dates";
import { parseYouTubeId } from "../lib/youtube";
import { validateEventInput } from "../lib/validation";
import type { EventFieldErrors, StreamEvent } from "../types/event.types";
import { VisibilitySwitch } from "./VisibilitySwitch";
import { SavedEvent } from "./SavedEvent";
import { YouTubePlayer } from "./YouTubePlayer";
import { CopyEventLink } from "./CopyEventLink";
function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-2 font-body text-sm text-destructive">
      {message}
    </p>
  ) : null;
}
export function EventForm({ event }: { event?: StreamEvent }) {
  const router = useRouter();
  const requestKey = useRef<string | null>(null);
  const initial = event ? getISTInputs(event.startsAt) : { date: "", time: "" };
  const [title, setTitle] = useState(event?.title ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(
    event ? `https://youtu.be/${event.youtubeId}` : "",
  );
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [description, setDescription] = useState(event?.description ?? "");
  const youtubeId = parseYouTubeId(youtubeUrl);
  const displayedImage = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null;
  const [isVisible, setIsVisible] = useState(event?.isVisible ?? true);
  const [errors, setErrors] = useState<EventFieldErrors>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [created, setCreated] = useState<StreamEvent | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  function preview() {
    const id = parseYouTubeId(youtubeUrl);
    if (!id) {
      setErrors((previous) => ({
        ...previous,
        youtubeUrl: "Paste the video’s YouTube Share link to preview it.",
      }));
      return;
    }
    setErrors((previous) => ({ ...previous, youtubeUrl: undefined }));
    setPreviewId(id);
    setPreviewOpen(true);
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving || visibilitySaving) return;
    const startsAt = date && time ? `${date}T${time}:00+05:30` : "";
    const input = { title, youtubeUrl, description, startsAt, isVisible };
    const checked = validateEventInput(input);
    if (!checked.success) {
      setErrors(checked.errors);
      setSaved(false);
      setMessage("Please check the marked fields.");
      return;
    }
    setErrors({});
    setMessage("");
    setSaved(false);
    setSaving(true);
    if (!event && !requestKey.current) requestKey.current = crypto.randomUUID();
    try {
      const response = await apiClient.request<{ event: StreamEvent }>({
        url: event ? `/events/${event.id}` : "/events",
        method: event ? "PATCH" : "POST",
        headers: !event && requestKey.current
          ? { "Idempotency-Key": requestKey.current }
          : undefined,
        data: input,
      });
      let result = response.data;
      if (
        !event &&
        Object.entries(checked.data).some(
          ([field, value]) => result.event[field as keyof StreamEvent] !== value,
        )
      ) {
        const correction = await apiClient.patch<{ event: StreamEvent }>(
          `/events/${result.event.id}`,
          input,
        );
        result = correction.data;
      }
      if (event) {
        setSaved(true);
        router.refresh();
      } else {
        setCreated(result.event);
        router.refresh();
      }
    } catch (error) {
      const details = axios.isAxiosError<{ message?: string; errors?: EventFieldErrors }>(error)
        ? error.response?.data
        : undefined;
      setErrors(details?.errors ?? {});
      setMessage(
        details?.message ?? "Could not save this event. Your details are still here. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  if (created) return <SavedEvent event={created} />;
  return (
    <>
      <div className="mb-8">
        <Link
          href="/studio/events"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Your events
        </Link>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {event ? "Edit your event." : "Bring your event online."}
        </h1>
        <p className="mt-3 font-body text-lg text-muted-foreground">
          Add the details and your YouTube Share link. Your audience watches
          here.
        </p>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[1.4fr_1fr]">
        <form
          noValidate
          onSubmit={save}
          onChange={() => setSaved(false)}
          className="space-y-6 rounded-xl border bg-white p-5 sm:p-8"
        >
          <fieldset
            disabled={saving || visibilitySaving}
            className="w-full min-w-0 space-y-6"
          >
            <h2 className="text-xl font-bold">Event details</h2>
            {message && (
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {saved && (
              <p
                role="status"
                className="rounded-md bg-emerald-50 p-3 font-body text-sm text-emerald-800"
              >
                Changes saved.
              </p>
            )}
            <div>
              <Label htmlFor="title">Event title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                placeholder="For example, Ananya & Karthik’s wedding"
                className="mt-2 h-12"
              />
              <FieldError id="title-error" message={errors.title} />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">YouTube Share link</Label>
              <Input
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                type="url"
                maxLength={2048}
                aria-invalid={Boolean(errors.youtubeUrl)}
                aria-describedby={
                  errors.youtubeUrl ? "youtube-error" : "youtube-help"
                }
                placeholder="https://youtu.be/..."
                className="mt-2 h-12"
              />
              <p
                id="youtube-help"
                className="mt-2 font-body text-sm text-muted-foreground"
              >
                On YouTube, choose Share and copy the video link. Paste it here.
              </p>
              <FieldError id="youtube-error" message={errors.youtubeUrl} />
            </div>
            <div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date">Event date</Label>
                  <Input
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    aria-invalid={Boolean(errors.startsAt)}
                    aria-describedby={
                      errors.startsAt ? "date-error" : "timezone-help"
                    }
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Start time</Label>
                  <Input
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    type="time"
                    aria-invalid={Boolean(errors.startsAt)}
                    aria-describedby={
                      errors.startsAt ? "date-error" : "timezone-help"
                    }
                    className="mt-2 h-12"
                  />
                </div>
              </div>
              <p
                id="timezone-help"
                className="mt-3 font-body text-sm text-muted-foreground"
              >
                India Standard Time (IST, UTC+05:30)
              </p>
              <FieldError id="date-error" message={errors.startsAt} />
            </div>
            <div>
              <Label htmlFor="description">
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={5}
                className="mt-2 resize-y"
                placeholder="Tell your guests about the occasion."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              <FieldError id="description-error" message={errors.description} />
            </div>
            {!event && (
              <div className="flex items-center justify-between gap-5 rounded-lg border bg-secondary/40 p-4">
                <div>
                  <Label htmlFor="new-visibility">Show to public</Label>
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    {isVisible
                      ? "Your event will appear on the website after saving."
                      : "Save this event without showing it to visitors."}
                  </p>
                </div>
                <Switch
                  id="new-visibility"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  aria-describedby={
                    errors.isVisible ? "visibility-error" : undefined
                  }
                />
              </div>
            )}
            <FieldError id="visibility-error" message={errors.isVisible} />
            <div className="flex flex-wrap gap-3 border-t pt-6">
              <Button type="button" variant="outline" onClick={preview}>
                <Play className="size-4" />
                Preview video
              </Button>
              <Button type="submit" disabled={saving || visibilitySaving}>
                {saving ? (
                  <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
                ) : (
                  <Save className="size-4" />
                )}
                {saving ? "Saving…" : event ? "Save changes" : "Save event"}
              </Button>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Start and end the broadcast on YouTube. Saving here does not
              change the YouTube video.
            </p>
          </fieldset>
        </form>
        <aside className="space-y-6">
          <section className="rounded-xl border bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold">Your event page</h2>
            <div className="relative mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-secondary/60">
              {displayedImage ? (
                <Image
                  src={displayedImage}
                  alt="Event image preview"
                  fill
                  unoptimized
                  sizes="(min-width:1024px) 430px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
                  <ImageIcon className="size-8" strokeWidth={1.5} />
                  <p className="font-body text-sm">
                    Your event image will appear here.
                  </p>
                </div>
              )}
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-tight">
              {title.trim() || "Your event title"}
            </h3>
            <p className="mt-3 font-body text-base text-muted-foreground">
              Easy to open. No viewer account needed.
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
              Guests open your GVS link and watch the video directly on the
              page.
            </p>
            {event && (
              <div className="mt-5">
                <CopyEventLink slug={event.slug} />
              </div>
            )}
          </section>
          {event && (
            <section className="rounded-xl border bg-white p-5 sm:p-6">
              <h2 className="text-base font-bold">Show to public</h2>
              <p className="my-4 font-body text-sm leading-relaxed text-muted-foreground">
                Turn this off to hide the event from visitors. The saved event
                and YouTube video stay unchanged.
              </p>
              <VisibilitySwitch
                key={`${event.id}-${event.isVisible}`}
                eventId={event.id}
                initialVisible={isVisible}
                title={event.title}
                onSaved={(visible) => {
                  setIsVisible(visible);
                  setSaved(false);
                }}
                disabled={saving}
                onPendingChange={setVisibilitySaving}
              />
            </section>
          )}
        </aside>
      </div>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title.trim() || "Video preview"}</DialogTitle>
            <DialogDescription>
              This preview does not save or publish your changes.
            </DialogDescription>
          </DialogHeader>
          {previewId && (
            <YouTubePlayer
              key={previewId}
              videoId={previewId}
              title={title.trim() || "Video preview"}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
