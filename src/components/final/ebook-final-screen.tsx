"use client";

import Image from "next/image";
import { useState } from "react";

import { useCampaign } from "@/components/campaign/campaign-provider";
import { downloadThenRedirect } from "@/lib/download";
import { cn } from "@/lib/utils";

type EbookFinalScreenProps = {
  className?: string;
};

export function EbookFinalScreen({ className }: EbookFinalScreenProps) {
  const { config } = useCampaign();
  const [busy, setBusy] = useState(false);

  function handleDownload() {
    if (busy) return;
    setBusy(true);

    downloadThenRedirect(
      config.ebookDownloadUrl,
      config.whatsappGroupUrl,
      config.redirectDelayMs,
    );
  }

  return (
    <section
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-md items-center justify-center px-0 sm:bg-[#ebe6dc] sm:px-4 sm:py-4",
        config.finalScreenBgClassName,
        className,
      )}
      aria-label="Acesso ao ebook"
    >
      <div className="relative w-full overflow-hidden sm:rounded-sm">
        <Image
          src={config.finalScreenSrc}
          alt={config.finalScreenAlt}
          width={config.finalScreenWidth}
          height={config.finalScreenHeight}
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
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574] focus-visible:ring-offset-2",
            config.ctaClassName,
            busy ? "cursor-wait opacity-90" : "cursor-pointer",
          )}
        >
          {busy ? "Abrindo..." : "Baixe seu ebook gratuitamente"}
        </button>

        {busy ? (
          <a
            href={config.whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={config.fallbackLinkClassName}
          >
            Se o grupo não abriu, toque aqui
          </a>
        ) : null}
      </div>
    </section>
  );
}
