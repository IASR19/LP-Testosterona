"use client";

import { Play } from "lucide-react";
import { type CSSProperties, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// posicao do play desenhado na capa (medido no PNG, apos o object-cover)
const playHotspot: CSSProperties = {
  left: "53.7%",
  top: "49.3%",
  height: "14%",
};

type VerticalClipProps = {
  src: string;
  poster: string;
  endFrame?: string;
  ariaLabel: string;
  className?: string;
};

export function VerticalClip({
  src,
  poster,
  endFrame,
  ariaLabel,
  className,
}: VerticalClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const cover = endFrame ?? poster;

  async function playFromStart() {
    const video = videoRef.current;
    if (!video) return;

    try {
      setEnded(false);
      video.currentTime = 0;
      video.muted = false;
      await video.play();
      setPlaying(true);
      setStarted(true);
    } catch {
      setPlaying(false);
    }
  }

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (ended) {
      await playFromStart();
      return;
    }

    if (video.paused) {
      try {
        video.muted = false;
        await video.play();
        setPlaying(true);
        setStarted(true);
        setEnded(false);
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
      <div className="relative overflow-hidden rounded-2xl bg-[color:var(--ap-cream)] shadow-[0_24px_60px_-28px_rgba(36,26,22,0.45)] ring-1 ring-black/10">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full bg-[color:var(--ap-cream)] object-cover"
            src={src}
            poster={poster}
            playsInline
            preload="metadata"
            controls={started && !ended}
            onPlay={() => {
              setPlaying(true);
              setStarted(true);
              setEnded(false);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setEnded(true);
            }}
            aria-label={ariaLabel}
          />

          {!started ? (
            <>
              <img
                src={poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden
              />
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-10 cursor-pointer"
                aria-label="Reproduzir depoimento"
              >
                <span
                  className="ap-play-pulse ap-play-pulse--wine"
                  style={playHotspot}
                >
                  <Play
                    className="size-1/2 translate-x-[6%]"
                    fill="currentColor"
                  />
                </span>
              </button>
            </>
          ) : null}

          {ended ? (
            <>
              <img
                src={cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden
              />
              <button
                type="button"
                onClick={playFromStart}
                className="absolute inset-0 z-10 cursor-pointer"
                aria-label="Assistir depoimento novamente"
              >
                <span
                  className="ap-play-pulse ap-play-pulse--wine"
                  style={playHotspot}
                >
                  <Play
                    className="size-1/2 translate-x-[6%]"
                    fill="currentColor"
                  />
                </span>
              </button>
            </>
          ) : null}

          {started && !playing && !ended ? (
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
