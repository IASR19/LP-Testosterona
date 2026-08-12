"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type VerticalClipProps = {
  src: string;
  poster: string;
  ariaLabel: string;
  className?: string;
};

export function VerticalClip({
  src,
  poster,
  ariaLabel,
  className,
}: VerticalClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        video.muted = false;
        await video.play();
        setPlaying(true);
        setStarted(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  return (
    <div
      className={cn("mx-auto w-full max-w-[360px] lg:max-w-[400px]", className)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[color:var(--ap-ink)] shadow-[0_24px_60px_-28px_rgba(36,26,22,0.45)] ring-1 ring-black/10">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full bg-black object-contain"
            src={src}
            poster={poster}
            playsInline
            preload="metadata"
            controls={started}
            onPlay={() => {
              setPlaying(true);
              setStarted(true);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            aria-label={ariaLabel}
          />

          {!started ? (
            <>
              <Image
                src={poster}
                alt=""
                fill
                sizes="(max-width: 1024px) 360px, 400px"
                className="object-cover"
                aria-hidden
              />
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent"
                aria-label="Reproduzir depoimento"
              >
                <span className="grid size-16 place-items-center rounded-full bg-[color:var(--ap-primary)] text-white shadow-lg transition hover:scale-[1.03] sm:size-[4.25rem]">
                  <Play className="ml-1 size-7 sm:size-8" fill="currentColor" />
                </span>
              </button>
            </>
          ) : null}

          {started && !playing ? (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/20"
              aria-label="Continuar depoimento"
            >
              <span className="grid size-14 place-items-center rounded-full bg-[color:var(--ap-primary)] text-white">
                <Play className="ml-0.5 size-6" fill="currentColor" />
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
