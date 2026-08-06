"use client";

import Image from "next/image";
import { useState } from "react";

import { leadMagnetConfig } from "@/content/lead-magnet";
import { downloadThenRedirect } from "@/lib/download";
import { cn } from "@/lib/utils";

type EbookFinalScreenProps = {
  className?: string;
};

export function EbookFinalScreen({ className }: EbookFinalScreenProps) {
  const [busy, setBusy] = useState(false);

  function handleDownload() {
    if (busy) return;
    setBusy(true);

    downloadThenRedirect(
      leadMagnetConfig.ebookDownloadUrl,
      leadMagnetConfig.whatsappGroupUrl,
      leadMagnetConfig.redirectDelayMs,
    );
  }

  return (
    <section
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-md items-center justify-center bg-[#2a211c] px-0 sm:bg-[#ebe6dc] sm:px-4 sm:py-4",
        className,
      )}
      aria-label="Acesso ao ebook"
    >
      <div className="relative w-full overflow-hidden sm:rounded-sm">
        <Image
          src={leadMagnetConfig.finalScreenSrc}
          alt="Clique no botão para baixar o ebook gratuito sobre testosterona"
          width={leadMagnetConfig.finalScreenWidth}
          height={leadMagnetConfig.finalScreenHeight}
          quality={95}
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          draggable={false}
          className="pointer-events-none h-auto w-full select-none"
        />

        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className={cn(
            "cta-pulse absolute z-20 flex items-center justify-center rounded-full",
            "bg-[#5c4638] px-2.5 text-center font-semibold uppercase leading-[1.1] tracking-[0.03em] text-white",
            "left-[5%] top-[85%] h-[4.6%] w-[42%]",
            "text-[clamp(0.42rem,1.9vw,0.62rem)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574] focus-visible:ring-offset-2",
            "hover:bg-[#4a382d]",
            busy ? "cursor-wait opacity-90" : "cursor-pointer",
          )}
        >
          {busy ? "Abrindo..." : "Baixe seu ebook gratuitamente"}
        </button>

        {busy ? (
          <a
            href={leadMagnetConfig.whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[3%] left-[5%] z-20 w-[42%] rounded-full bg-[#1a1816]/90 px-2 py-2 text-center text-[11px] font-medium text-[#f2e8d5] backdrop-blur-sm"
          >
            Se o grupo não abriu, toque aqui
          </a>
        ) : null}
      </div>
    </section>
  );
}
