import {
  formatBrazilianPhone,
  formatPersonName,
  isValidBrazilianPhone,
  isValidEmail,
  normalizeSpaces,
} from "@/lib/form/formatters";

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

export const initialAnswers: LeadAnswers = {
  name: "",
  phone: "",
  email: "",
  profession: "",
  diagnosis: "",
  symptom: "",
  wantsConsultation: "",
};

export const chatSteps: ChatStep[] = [
  {
    id: "intro",
    messages: [
      "Olá. Tudo bem?",
      'Você está a um passo de baixar o e-book "Testosterona: entenda, previna e retome o controle", direto ao ponto, sem enrolação.',
      "Preciso só de algumas informações rápidas pra liberar o material agora.",
      "Qual é o seu nome?",
    ],
    input: {
      kind: "text",
      field: "name",
      placeholder: "Seu primeiro nome",
      transform: formatPersonName,
      validate: (value) =>
        normalizeSpaces(value) ? null : "Informe seu primeiro nome.",
    },
    next: "phone",
  },
  {
    id: "phone",
    messages: (answers) => [
      `Prazer, ${answers.name}. Agora me diz seu whatsapp com DDD, por favor.`,
    ],
    input: {
      kind: "phone",
      field: "phone",
      placeholder: "Digite o seu telefone com DDD",
      transform: formatBrazilianPhone,
      validate: (value) =>
        isValidBrazilianPhone(value)
          ? null
          : "Esse número não parece estar completo. Digite seu telefone com DDD (ex.: 11987654321).",
    },
    next: "email",
  },
  {
    id: "email",
    messages: (answers) => [
      `${answers.name}. Muito obrigado! Agora me informa o seu melhor e-mail?`,
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
    next: "profession",
  },
  {
    id: "profession",
    messages: ["Perfeito! Última pergunta: qual é a sua profissão?"],
    input: {
      kind: "text",
      field: "profession",
      placeholder: "Digite a sua profissão",
      transform: normalizeSpaces,
      validate: (value) =>
        normalizeSpaces(value) ? null : "Informe a sua profissão.",
    },
    next: "diagnosis",
  },
  {
    id: "diagnosis",
    messages: [
      "Vamos ao que realmente importa: você já fez algum exame para saber como estão os seus níveis de testosterona?",
    ],
    input: {
      kind: "choice",
      field: "diagnosis",
      choices: [
        { label: "Sim", value: "Sim" },
        { label: "Não", value: "Não" },
      ],
    },
    next: (answers) =>
      answers.diagnosis === "Não" ? "diagnosis-no" : "symptom",
  },
  {
    id: "diagnosis-no",
    messages: [
      "Isso é mais comum do que parece. Muitos homens convivem por anos com sintomas de baixa testosterona sem saber. Este guia vai ajudar você a reconhecer esses sinais. Vamos continuar?",
    ],
    autoAdvance: true,
    next: "symptom",
  },
  {
    id: "symptom",
    messages: (answers) => [
      `${answers.name}. Qual desses sintomas mais te incomoda hoje?`,
    ],
    input: {
      kind: "choice",
      field: "symptom",
      choices: [
        { label: "Queda de libido", value: "Queda de libido" },
        { label: "Cansaço constante", value: "Cansaço constante" },
        {
          label: "Perda de massa muscular",
          value: "Perda de massa muscular",
        },
        { label: "Disfunção erétil", value: "Disfunção erétil" },
        { label: "Outros", value: "Outros" },
      ],
    },
    next: "consultation",
  },
  {
    id: "consultation",
    messages: [
      "Entendo. Gostaria de agendar uma consulta individual com a Dr. Thallys para avaliar seu caso e indicar o tratamento mais adequado pra você?",
    ],
    input: {
      kind: "choice",
      field: "wantsConsultation",
      choices: [
        { label: "Sim", value: "Sim" },
        { label: "Não neste momento", value: "Não neste momento" },
      ],
    },
    next: (answers) =>
      answers.wantsConsultation === "Sim" ? "closing-yes" : "closing-no",
  },
  {
    id: "closing-yes",
    messages: [
      "Perfeito! 💪 Seu guia está pronto. Cuidar da sua saúde começa com informação e o acompanhamento certo.",
    ],
    autoAdvance: true,
  },
  {
    id: "closing-no",
    messages: [
      "Sem problemas! Eu vou te mandar o guia agora e, se quiser, posso te avisar quando abrirmos uma turma ao vivo para tratarmos sobre o assunto. Pode ser?",
    ],
    autoAdvance: true,
  },
];

export function getStepById(id: string) {
  return chatSteps.find((step) => step.id === id);
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
