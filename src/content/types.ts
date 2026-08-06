export type LeadAnswers = {
  name: string;
  phone: string;
  email: string;
  profession: string;
  diagnosis: string;
  symptom: string;
  wantsConsultation: string;
};

export type ChoiceOption = {
  label: string;
  value: string;
};

export type InputKind = "text" | "phone" | "email" | "choice";

export type ChatStep = {
  id: string;
  messages: string[] | ((answers: LeadAnswers) => string[]);
  input?: {
    kind: InputKind;
    field: keyof LeadAnswers;
    placeholder?: string;
    choices?: ChoiceOption[];
    transform?: (value: string) => string;
    validate?: (value: string) => string | null;
  };
  next?: string | ((answers: LeadAnswers) => string);
  autoAdvance?: boolean;
};

export type LeadMagnetConfig = {
  brandName: string;
  doctorName: string;
  instagramHandle: string;
  instagramHref: string;
  ebookDownloadUrl: string;
  ebookViewUrl: string;
  whatsappGroupUrl: string;
  redirectDelayMs: number;
  avatarSrc: string;
  avatarObjectPosition: string;
  finalScreenSrc: string;
  finalScreenWidth: number;
  finalScreenHeight: number;
  finalScreenAlt: string;
  finalScreenBgClassName: string;
  ctaClassName: string;
  fallbackLinkClassName: string;
};

export type SiteMeta = {
  title: string;
  description: string;
  path: string;
};

export type Campaign = {
  slug: "endometriose" | "testosterona";
  config: LeadMagnetConfig;
  siteMeta: SiteMeta;
  chatSteps: ChatStep[];
  initialAnswers: LeadAnswers;
};

export const emptyAnswers: LeadAnswers = {
  name: "",
  phone: "",
  email: "",
  profession: "",
  diagnosis: "",
  symptom: "",
  wantsConsultation: "",
};

export function getStepById(steps: ChatStep[], id: string) {
  return steps.find((step) => step.id === id);
}

export function resolveMessages(
  step: ChatStep,
  answers: LeadAnswers,
): string[] {
  return typeof step.messages === "function"
    ? step.messages(answers)
    : step.messages;
}

export function resolveNextStep(
  step: ChatStep,
  answers: LeadAnswers,
): string | null {
  if (!step.next) return null;
  return typeof step.next === "function" ? step.next(answers) : step.next;
}
