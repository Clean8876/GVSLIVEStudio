"use client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventStream } from "../types/event.types";
import { YouTubePlayer } from "./YouTubePlayer";

export function StreamViewer({ streams, title }: { streams: EventStream[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const stream = streams[selected] ?? streams[0];
  return (
    <>
      <YouTubePlayer key={stream.youtubeId} videoId={stream.youtubeId} title={`${title} — ${stream.name}`} />
      {streams.length > 1 && (
        <section className="mt-6" aria-labelledby="stream-heading">
          <h2 id="stream-heading" className="text-lg font-bold">Choose a stream</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {streams.map((item, index) => <Button key={item.youtubeId} type="button" variant={index === selected ? "default" : "outline"} aria-pressed={index === selected} onClick={() => setSelected(index)}>{item.name}</Button>)}
          </div>
        </section>
      )}
      <Button asChild variant="outline" className="mt-5"><a href={`https://www.youtube.com/watch?v=${stream.youtubeId}`} target="_blank" rel="noopener noreferrer">Watch on YouTube <ExternalLink className="size-4" /></a></Button>
    </>
  );
}
