"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { apresentacaoContent } from "@/content/apresentacao";

export function PresentationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);

  async function playFromStart() {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      video.muted = false;
      await video.play();
      setEnded(false);
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
    <div className="mx-auto w-full max-w-[360px] lg:max-w-[400px]">
      <div className="relative overflow-hidden rounded-2xl bg-[color:var(--ap-ink)] shadow-[0_24px_60px_-28px_rgba(36,26,22,0.55)] ring-1 ring-black/10">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full bg-black object-contain"
            src={apresentacaoContent.videoSrc}
            poster={apresentacaoContent.videoPoster}
            playsInline
            preload="none"
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
            aria-label="Vídeo de apresentação da Grape Clinic"
          />

          {!started ? (
            <>
              <Image
                src={apresentacaoContent.videoPoster}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 360px, 400px"
                className="object-cover"
                aria-hidden
              />
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                aria-label="Reproduzir vídeo"
              >
                <span className="grid size-16 place-items-center rounded-full bg-white/95 text-[color:var(--ap-primary)] shadow-lg transition hover:scale-[1.03] sm:size-[4.25rem]">
                  <Play className="ml-1 size-7 sm:size-8" fill="currentColor" />
                </span>
              </button>
            </>
          ) : null}

          {ended ? (
            <>
              <Image
                src={apresentacaoContent.videoEndFrame}
                alt=""
                fill
                sizes="(max-width: 1024px) 360px, 400px"
                className="z-[5] object-cover"
                aria-hidden
              />
              <button
                type="button"
                onClick={playFromStart}
                className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/35 via-transparent to-transparent"
                aria-label="Assistir novamente"
              >
                <span className="grid size-14 place-items-center rounded-full bg-white/95 text-[color:var(--ap-primary)] shadow-lg">
                  <Play className="ml-0.5 size-6" fill="currentColor" />
                </span>
              </button>
            </>
          ) : null}

          {started && !playing && !ended ? (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/20"
              aria-label="Continuar vídeo"
            >
              <span className="grid size-14 place-items-center rounded-full bg-white/95 text-[color:var(--ap-primary)]">
                <Play className="ml-0.5 size-6" fill="currentColor" />
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
