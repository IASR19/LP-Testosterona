import { emptyAnswers, type LeadAnswers } from "@/content/types";

export const APRESENTACAO_LEAD_STORAGE_KEY = "grape.apresentacao.lead";

type StoredLead = Partial<
  Pick<LeadAnswers, "name" | "phone" | "profession" | "symptom">
>;

export function saveApresentacaoLead(lead: StoredLead) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(APRESENTACAO_LEAD_STORAGE_KEY, JSON.stringify(lead));
}

export function readApresentacaoLead(): LeadAnswers {
  if (typeof window === "undefined") return emptyAnswers;

  try {
    const raw = sessionStorage.getItem(APRESENTACAO_LEAD_STORAGE_KEY);
    if (!raw) return emptyAnswers;
    const stored = JSON.parse(raw) as StoredLead;
    return {
      ...emptyAnswers,
      name: stored.name?.trim() ?? "",
      phone: stored.phone?.trim() ?? "",
      profession: stored.profession?.trim() ?? "",
      symptom: stored.symptom?.trim() ?? "",
    };
  } catch {
    return emptyAnswers;
  }
}
