import {
  BRAZIL_PHONE_PLACEHOLDER,
  brazilianPhoneValidationError,
  formatBrazilianPhone,
  formatPersonName,
  isValidEmail,
  normalizeSpaces,
} from "@/lib/form/formatters";
import { situationOptions } from "@/content/apresentacao";
import type { ChatStep, LeadAnswers } from "@/content/types";

function firstName(answers: LeadAnswers) {
  return answers.name.trim().split(" ")[0] || "";
}

function nextAfterKnown(answers: LeadAnswers) {
  if (!answers.phone.trim()) return "phone";
  if (!answers.email.trim()) return "email";
  if (!answers.profession.trim()) return "profession";
  if (!answers.symptom.trim()) return "clinical";
  if (!answers.convenio.trim()) return "convenio";
  return "closing";
}

const clinicalChoices = situationOptions.map((option) => ({
  label: option,
  value: option,
}));

export const chatSteps: ChatStep[] = [
  {
    id: "intro",
    messages: [
      "Olá. Tudo bem com você? 🤎",
      "Vou te conectar com a equipe da Grape Clinic. São só algumas perguntas rápidas.",
      "Qual é o seu nome?",
    ],
    input: {
      kind: "text",
      field: "name",
      placeholder: "Seu nome",
      transform: formatPersonName,
      validate: (value) =>
        normalizeSpaces(value) ? null : "Informe o seu nome.",
    },
    next: nextAfterKnown,
  },
  {
    id: "resume",
    messages: (answers) => [
      `Oi, ${firstName(answers)}. Vou só completar o que falta pra te conectar com a equipe. 🤎`,
    ],
    autoAdvance: true,
    next: nextAfterKnown,
  },
  {
    id: "phone",
    messages: (answers) => [
      `${firstName(answers)}, me passa seu WhatsApp. O +55 já está selecionado; coloque o DDD e o número.`,
    ],
    input: {
      kind: "phone",
      field: "phone",
      placeholder: BRAZIL_PHONE_PLACEHOLDER,
      transform: formatBrazilianPhone,
      validate: brazilianPhoneValidationError,
    },
    next: nextAfterKnown,
  },
  {
    id: "email",
    messages: (answers) => [
      `Perfeito, ${firstName(answers)}. Qual é o seu melhor e-mail?`,
    ],
    input: {
      kind: "email",
      field: "email",
      placeholder: "Digite o seu e-mail",
      transform: (value) => normalizeSpaces(value).toLowerCase(),
      validate: (value) =>
        isValidEmail(value)
          ? null
          : "Acho que faltou alguma coisa nesse e-mail. Pode conferir e mandar de novo?",
    },
    next: nextAfterKnown,
  },
  {
    id: "profession",
    messages: ["Qual é a sua profissão?"],
    input: {
      kind: "text",
      field: "profession",
      placeholder: "Digite a sua profissão",
      transform: normalizeSpaces,
      validate: (value) =>
        normalizeSpaces(value) ? null : "Informe a sua profissão.",
    },
    next: nextAfterKnown,
  },
  {
    id: "clinical",
    messages: ["O que mais impacta sua qualidade de vida hoje?"],
    input: {
      kind: "choice",
      field: "symptom",
      choices: clinicalChoices,
    },
    next: nextAfterKnown,
  },
  {
    id: "convenio",
    messages: ["Você pretende fazer o acompanhamento particular ou por convênio?"],
    input: {
      kind: "choice",
      field: "convenio",
      choices: [
        { label: "Particular", value: "Particular" },
        { label: "Convênio", value: "Convênio" },
        { label: "Ainda não sei", value: "Ainda não sei" },
      ],
    },
    next: "closing",
  },
  {
    id: "closing",
    messages: [
      "Pronto. Vou te encaminhar agora para o WhatsApp da clínica, com o resumo das suas respostas pra equipe já te atender com contexto.",
    ],
    autoAdvance: true,
  },
];
