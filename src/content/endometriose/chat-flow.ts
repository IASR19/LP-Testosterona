import {
  formatBrazilianPhone,
  formatPersonName,
  isValidBrazilianPhone,
  isValidEmail,
  normalizeSpaces,
} from "@/lib/form/formatters";
import type { ChatStep } from "@/content/types";

export const chatSteps: ChatStep[] = [
  {
    id: "intro",
    messages: [
      "Olá. Tudo bem com você? 🤎",
      "Você está a um passo de receber meu Guia gratuito sobre Endometriose, como identificar os sinais e parar de conviver com a dor como se fosse normal.",
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
      "Vamos ao que mais importa. Você já recebeu diagnóstico de endometriose?",
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
      "Entendo, muitas mulheres passam anos com sintomas antes de ter um diagnóstico fechado. O guia te ajuda justamente a reconhecer os sinais. Vamos continuar?",
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
        { label: "Cólicas fortes", value: "Cólicas fortes" },
        {
          label: "Dor durante a relação íntima",
          value: "Dor durante a relação íntima",
        },
        {
          label: "Dificuldade para engravidar",
          value: "Dificuldade para engravidar",
        },
        { label: "Sangramento intenso", value: "Sangramento intenso" },
        { label: "Outros", value: "Outros" },
      ],
    },
    next: "consultation",
  },
  {
    id: "consultation",
    messages: [
      "Entendo. Gostaria de agendar uma consulta individual com a Dra. Marcela para avaliar seu caso e indicar o tratamento mais adequado pra você?",
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
      "Perfeito! 🤎 Seu guia está pronto. Cuidar da sua saúde começa com informação e o acompanhamento certo.",
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
