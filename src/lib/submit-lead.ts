import type { LeadAnswers } from "@/content/types";

type CampaignSlug = "testosterona" | "endometriose";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

function readUtmsFromUrl() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utms: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utms[key] = value;
  }

  return utms;
}

export async function submitLead(
  campaign: CampaignSlug,
  answers: LeadAnswers,
) {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaign,
      name: answers.name,
      phone: answers.phone,
      email: answers.email,
      profession: answers.profession,
      diagnosis: answers.diagnosis,
      symptom: answers.symptom,
      wantsConsultation: answers.wantsConsultation,
      ...readUtmsFromUrl(),
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message || "Não foi possível enviar o lead agora.");
  }
}
