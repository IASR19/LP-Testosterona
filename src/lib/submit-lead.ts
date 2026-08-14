import type { LeadAnswers } from "@/content/types";
import { readUtmsFromWindow } from "@/lib/utm";

type CampaignSlug = "testosterona" | "endometriose" | "apresentacao";

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
      convenio: answers.convenio,
      ...readUtmsFromWindow(),
    }),
    keepalive: true,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(data?.message || "Não foi possível enviar o lead agora.");
  }
}
