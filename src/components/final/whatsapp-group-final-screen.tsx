"use client";

import { useEffect, useRef, useState } from "react";

import { useCampaign } from "@/components/campaign/campaign-provider";
import { trackMetaLead } from "@/components/seo/meta-pixel";
import type { LeadAnswers } from "@/content/types";
import { submitLead } from "@/lib/submit-lead";

export function WhatsAppGroupFinalScreen({
  answers,
}: {
  answers: LeadAnswers;
}) {
  const { slug, config } = useCampaign();
  const href = config.whatsappGroupUrl;
  const [failed, setFailed] = useState(false);
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    void submitLead(slug, answers)
      .then(() => {
        trackMetaLead();
      })
      .catch((error) => {
        console.error(
          "[whatsapp-group-final-screen] Falha ao enviar lead:",
          error,
        );
        setFailed(true);
      })
      .finally(() => {
        window.setTimeout(() => {
          window.location.assign(href);
        }, config.redirectDelayMs);
      });
  }, [answers, config.redirectDelayMs, href, slug]);

  return (
    <section className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-[#1a1512] px-6 text-center text-[#f2e8d5]">
      <p className="text-sm font-medium text-[#c4a574]">Grupo no WhatsApp</p>
      <h1 className="mt-3 max-w-sm text-2xl font-medium leading-snug">
        Entrando no grupo para você baixar o guia.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#d9cbb8]">
        {failed
          ? "Não conseguimos registrar agora, mas você já pode entrar no grupo. O ebook estará disponível lá para download."
          : "O ebook será disponibilizado no grupo para download."}
      </p>
      <a
        href={href}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white"
      >
        Entrar no grupo agora
      </a>
    </section>
  );
}
