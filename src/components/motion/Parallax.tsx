"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Parallax({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const layer = layerRef.current;
    if (!viewport || !layer) return;

    const motion = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      const bounds = viewport.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

      const offset = Math.max(-36, Math.min(36, -bounds.top * 0.08));
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const syncMotion = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      frame = 0;
      layer.style.transform = "";
      layer.style.willChange = motion.matches ? "transform" : "auto";

      if (motion.matches) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();
      }
    };

    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", syncMotion);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={layerRef}
        className="absolute inset-x-0 -inset-y-10 motion-reduce:inset-y-0 max-lg:inset-y-0"
      >
        {children}
      </div>
    </div>
  );
}
