"use client";

import { Play, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { apresentacaoContent } from "@/content/apresentacao";

// posicao do botao de play que ja vem desenhado na capa (medido no PNG, apos o object-cover)
const playHotspot: CSSProperties = {
  left: "51.4%",
  top: "86.8%",
  height: "8%",
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: "easeInOut" as const },
};

export function PresentationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayCancelledRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [entering, setEntering] = useState(false);
  const [muted, setMuted] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (cancelled || autoplayCancelledRef.current) return;

      void (async () => {
        video.volume = 1;
        video.muted = false;
        video.defaultMuted = false;

        try {
          await video.play();
          if (cancelled || autoplayCancelledRef.current) {
            video.pause();
            return;
          }
          setMuted(false);
          setPlaying(true);
          setStarted(true);
          return;
        } catch {
          // Mobile/Safari bloqueia autoplay com áudio; tenta mudo.
        }

        if (cancelled || autoplayCancelledRef.current) return;

        video.muted = true;
        video.defaultMuted = true;
        try {
          await video.play();
          if (cancelled || autoplayCancelledRef.current) {
            video.pause();
            return;
          }
          setMuted(true);
          setPlaying(true);
          setStarted(true);
        } catch {
          if (!cancelled && !autoplayCancelledRef.current) {
            setAutoplayFailed(true);
          }
        }
      })();
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  function unmute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
  }

  async function playFromStart(withSound = true) {
    const video = videoRef.current;
    if (!video) return;

    try {
      autoplayCancelledRef.current = true;
      setEntering(true);
      setEnded(false);
      video.currentTime = 0;
      video.muted = !withSound;
      setMuted(!withSound);
      await video.play();
      setPlaying(true);
      setStarted(true);
      window.setTimeout(() => setEntering(false), 450);
    } catch {
      setPlaying(false);
      setEntering(false);
      setAutoplayFailed(true);
    }
  }

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (ended) {
      await playFromStart(true);
      return;
    }

    if (video.paused) {
      try {
        if (!started) setEntering(true);
        await video.play();
        setPlaying(true);
        setStarted(true);
        setEnded(false);
        window.setTimeout(() => setEntering(false), 450);
      } catch {
        setPlaying(false);
        setEntering(false);
        setAutoplayFailed(true);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  const showCover = !started && !ended;

  return (
    <div className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto lg:max-w-[380px]">
      <div className="relative overflow-hidden rounded-2xl bg-[color:var(--ap-cream)] shadow-[0_24px_60px_-28px_rgba(36,26,22,0.45)] ring-1 ring-black/10">
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full bg-[color:var(--ap-cream)] object-cover"
            src={apresentacaoContent.videoSrc}
            poster={apresentacaoContent.videoPoster}
            playsInline
            muted={muted}
            preload="metadata"
            controls={started && !ended && !entering}
            onPlay={() => {
              setPlaying(true);
              setStarted(true);
              setEnded(false);
            }}
            onPause={() => setPlaying(false)}
            onVolumeChange={() => {
              const video = videoRef.current;
              if (!video) return;
              setMuted(video.muted || video.volume === 0);
            }}
            onEnded={() => {
              setPlaying(false);
              setEnded(true);
            }}
            aria-label="Vídeo de apresentação da Grape Clinic"
          />

          <AnimatePresence>
            {showCover ? (
              <motion.div
                key="entrada"
                className="absolute inset-0 z-10"
                {...fade}
              >
                <img
                  src={apresentacaoContent.videoPoster}
                  alt=""
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => void playFromStart(true)}
                  className="absolute inset-0 cursor-pointer"
                  aria-label="Reproduzir vídeo"
                >
                  <span className="ap-play-pulse" style={playHotspot}>
                    <Play
                      className="size-1/2 translate-x-[6%]"
                      fill="currentColor"
                    />
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
                <img
                  src={apresentacaoContent.videoEndFrame}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => void playFromStart(true)}
                  className="absolute inset-0 cursor-pointer"
                  aria-label="Assistir novamente"
                >
                  <span className="ap-play-pulse" style={playHotspot}>
                    <Play
                      className="size-1/2 translate-x-[6%]"
                      fill="currentColor"
                    />
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
                onClick={() => void togglePlay()}
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

          <AnimatePresence>
            {started && playing && muted && !ended ? (
              <motion.button
                key="unmute"
                type="button"
                onClick={unmute}
                className="absolute top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
                aria-label="Ativar som"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <VolumeX className="size-4" aria-hidden />
                Ativar som
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
