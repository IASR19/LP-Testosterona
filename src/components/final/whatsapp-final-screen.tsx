"use client";

import { useEffect, useRef, useState } from "react";

import { useCampaign } from "@/components/campaign/campaign-provider";
import { trackMetaLead } from "@/components/seo/meta-pixel";
import { apresentacaoContent } from "@/content/apresentacao";
import type { LeadAnswers } from "@/content/types";
import { submitLead } from "@/lib/submit-lead";

function buildHandoffHref(answers: LeadAnswers) {
  const text = [
    "Olá! Vim pela apresentação da Grape Clinic e gostaria de agendar uma avaliação.",
    "",
    `Nome: ${answers.name}`,
    `WhatsApp: ${answers.phone}`,
    `E-mail: ${answers.email}`,
    `Profissão: ${answers.profession || "—"}`,
    `Situação: ${answers.symptom || "—"}`,
    `Convênio: ${answers.convenio || "—"}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${apresentacaoContent.whatsappPhone}&text=${encodeURIComponent(text)}`;
}

export function WhatsAppFinalScreen({ answers }: { answers: LeadAnswers }) {
  const { slug } = useCampaign();
  const href = buildHandoffHref(answers);
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
        console.error("[whatsapp-final-screen] Falha ao enviar lead:", error);
        setFailed(true);
      })
      .finally(() => {
        window.setTimeout(() => {
          window.location.assign(href);
        }, 900);
      });
  }, [answers, href, slug]);

  return (
    <section className="apresentacao-lp flex min-h-dvh flex-col items-center justify-center bg-[color:var(--ap-cream)] px-6 text-center text-[color:var(--ap-ink)]">
      <p className="text-sm font-medium text-[color:var(--ap-gold)]">
        Atendimento
      </p>
      <h1 className="mt-3 max-w-sm text-2xl font-medium leading-snug text-[color:var(--ap-primary)]">
        Conectando você com a equipe da Grape Clinic.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--ap-muted)]">
        {failed
          ? "Não conseguimos registrar agora, mas você já pode falar com a equipe no WhatsApp."
          : "Abrindo o WhatsApp com o resumo das suas respostas."}
      </p>
      <a
        href={href}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white"
      >
        Abrir WhatsApp agora
      </a>
    </section>
  );
}
