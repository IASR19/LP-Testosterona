import {
  BRAZIL_PHONE_PLACEHOLDER,
  brazilianPhoneValidationError,
  formatBrazilianPhone,
  formatPersonName,
  isValidEmail,
  normalizeSpaces,
} from "@/lib/form/formatters";
import { incomeChoices, incomeQuestion } from "@/content/apresentacao";
import type { ChatStep } from "@/content/types";

export const chatSteps: ChatStep[] = [
  {
    id: "intro",
    messages: [
      "Olá. Tudo bem com você?",
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
    next: "phone",
  },
  {
    id: "phone",
    messages: (answers) => [
      `${answers.name}. Agora me diz seu WhatsApp. O +55 já está selecionado; coloque o DDD e o número.`,
    ],
    input: {
      kind: "phone",
      field: "phone",
      placeholder: BRAZIL_PHONE_PLACEHOLDER,
      transform: formatBrazilianPhone,
      validate: brazilianPhoneValidationError,
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
    messages: ["Perfeito! Qual é a sua profissão?"],
    input: {
      kind: "text",
      field: "profession",
      placeholder: "Digite a sua profissão",
      transform: normalizeSpaces,
      validate: (value) =>
        normalizeSpaces(value) ? null : "Informe a sua profissão.",
    },
    next: "income",
  },
  {
    id: "income",
    messages: [incomeQuestion],
    input: {
      kind: "choice",
      field: "renda",
      choices: incomeChoices,
    },
    next: (answers) =>
      answers.wantsConsultation === "Sim" ? "closing-yes" : "closing-no",
  },
  {
    id: "closing-yes",
    messages: [
      "Perfeito! 💪 Vou te levar agora para o grupo no WhatsApp, onde você baixa o guia. Cuidar da sua saúde começa com informação e o acompanhamento certo.",
    ],
    autoAdvance: true,
  },
  {
    id: "closing-no",
    messages: [
      "Sem problemas! Vou te levar agora para o grupo no WhatsApp, onde você baixa o guia. Se quiser, posso te avisar quando abrirmos uma turma ao vivo para tratarmos sobre o assunto. Pode ser?",
    ],
    autoAdvance: true,
  },
];
