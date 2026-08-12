"use client";

import { Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { apresentacaoContent } from "@/content/apresentacao";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: "easeInOut" as const },
};

export function PresentationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [entering, setEntering] = useState(false);

  async function playFromStart() {
    const video = videoRef.current;
    if (!video) return;

    try {
      setEntering(true);
      setEnded(false);
      video.currentTime = 0;
      video.muted = false;
      await video.play();
      setPlaying(true);
      setStarted(true);
      window.setTimeout(() => setEntering(false), 450);
    } catch {
      setPlaying(false);
      setEntering(false);
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
        if (!started) setEntering(true);
        video.muted = false;
        await video.play();
        setPlaying(true);
        setStarted(true);
        setEnded(false);
        window.setTimeout(() => setEntering(false), 450);
      } catch {
        setPlaying(false);
        setEntering(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  return (
    <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto lg:max-w-[380px]">
      <div className="relative overflow-hidden rounded-2xl bg-[color:var(--ap-cream)] shadow-[0_24px_60px_-28px_rgba(36,26,22,0.45)] ring-1 ring-black/10">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full bg-black object-contain"
            src={apresentacaoContent.videoSrc}
            poster={apresentacaoContent.videoPoster}
            playsInline
            preload="none"
            controls={started && !ended && !entering}
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

          <AnimatePresence>
            {!started ? (
              <motion.div
                key="entrada"
                className="absolute inset-0 z-10"
                {...fade}
              >
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
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Reproduzir vídeo"
                >
                  <span className="grid size-16 place-items-center rounded-full bg-[color:var(--ap-primary)] text-white shadow-lg transition hover:scale-[1.03] sm:size-[4.25rem]">
                    <Play className="ml-1 size-7 sm:size-8" fill="currentColor" />
                  </span>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {ended ? (
              <motion.div
                key="saida"
                className="absolute inset-0 z-10"
                {...fade}
              >
                <Image
                  src={apresentacaoContent.videoEndFrame}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 360px, 400px"
                  className="object-cover"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={playFromStart}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Assistir novamente"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-[color:var(--ap-primary)] text-white shadow-lg">
                    <Play className="ml-0.5 size-6" fill="currentColor" />
                  </span>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {started && !playing && !ended && !entering ? (
              <motion.button
                key="pause-overlay"
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/20"
                aria-label="Continuar vídeo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="grid size-14 place-items-center rounded-full bg-[color:var(--ap-primary)] text-white">
                  <Play className="ml-0.5 size-6" fill="currentColor" />
                </span>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
