"use client";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, LoaderCircle, RotateCcw, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  loadYouTubePlayer,
  type YouTubePlayerHandle,
} from "../lib/youtube-player";
export function YouTubePlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let player: YouTubePlayerHandle | undefined;
    const target = container.current;
    const timer = window.setTimeout(() => {
      if (active) setState("error");
    }, 25000);
    loadYouTubePlayer()
      .then((api) => {
        if (!active || !target) return;
        const element = document.createElement("div");
        target.replaceChildren(element);
        player = new api.Player(element, {
          videoId,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: { playsinline: 1, origin: window.location.origin },
          events: {
            onReady: () => {
              if (!active) return;
              window.clearTimeout(timer);
              const frame = player?.getIframe();
              if (frame) {
                frame.title = title;
                frame.referrerPolicy = "strict-origin-when-cross-origin";
              }
              setState("ready");
            },
            onError: () => {
              if (active) {
                window.clearTimeout(timer);
                setState("error");
              }
            },
          },
        });
      })
      .catch(() => {
        if (active) {
          window.clearTimeout(timer);
          setState("error");
        }
      });
    return () => {
      active = false;
      window.clearTimeout(timer);
      player?.destroy();
      target?.replaceChildren();
    };
  }, [videoId, title, attempt]);
  function retry() {
    setState("loading");
    setAttempt((value) => value + 1);
  }
  return (
    <div>
      <div
        className={
          "relative overflow-hidden rounded-xl bg-[#10203b] " +
          (state === "error"
            ? "min-h-[320px] sm:aspect-video"
            : "aspect-video min-h-[200px]")
        }
      >
        <div
          ref={container}
          className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full"
        />
        {state === "loading" && (
          <div
            role="status"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#10203b] text-white"
          >
            <LoaderCircle className="size-7 animate-spin motion-reduce:animate-none" />
            <p className="font-body text-base">Loading the video…</p>
          </div>
        )}
        {state === "error" && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary p-5 text-center"
          >
            <VideoOff className="size-7 text-gold" />
            <h2 className="text-lg font-bold">
              This video can’t play here right now.
            </h2>
            <p className="max-w-md font-body text-sm text-muted-foreground">
              It may be unavailable or not allow playback on other websites.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" variant="outline" onClick={retry}>
                <RotateCcw className="size-4" />
                Try again
              </Button>
              <Button asChild>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 font-body text-xs text-muted-foreground">
        YouTube shows the waiting screen, live broadcast or available recording.
        Playback begins when you press play.
      </p>
    </div>
  );
}
