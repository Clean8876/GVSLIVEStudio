"use client";
export interface YouTubePlayerHandle {
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
}
export interface YouTubeAPI {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host: string;
      width: string;
      height: string;
      playerVars: { playsinline: number; origin: string };
      events: {
        onReady: () => void;
        onError: (event: { data: number }) => void;
      };
    },
  ) => YouTubePlayerHandle;
}
declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let loading: Promise<YouTubeAPI> | null = null;
export function loadYouTubePlayer(): Promise<YouTubeAPI> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (loading) return loading;
  loading = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.id = "gvs-youtube-player-api";
    const timer = window.setTimeout(() => fail(), 15000);
    function cleanup() {
      window.clearTimeout(timer);
      script.removeEventListener("error", fail);
      window.onYouTubeIframeAPIReady = previous;
    }
    function fail() {
      cleanup();
      script.remove();
      reject(new Error("YouTube could not load."));
    }
    window.onYouTubeIframeAPIReady = () => {
      cleanup();
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("The player is unavailable."));
    };
    script.addEventListener("error", fail, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}
