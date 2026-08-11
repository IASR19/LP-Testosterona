export const apresentacaoMeta = {
  title: "Apresentação | Grape Clinic",
  description:
    "Conheça a Grape Clinic e solicite uma avaliação individual em Pouso Alegre, MG.",
  path: "/apresentacao",
} as const;

export const apresentacaoContent = {
  eyebrow: "Pouso Alegre, MG",
  heroTitle: "Sua jornada para a melhor versão de você.",
  heroHighlight: "melhor",
  heroSub:
    "Ciência, estética e bem-estar em um cuidado clínico feito para o seu momento — sem protocolo genérico.",
  ctaLabel: "Agende sua avaliação",
  formAnchor: "form",
  videoSrc: "/videos/apresentacao.mp4",
  videoPoster: "/videos/apresentacao-poster.png",
  videoEndFrame: "/videos/apresentacao-end.png",
  whatsappPhone: "553531122929",
  whatsappQuickHref:
    "https://api.whatsapp.com/send?phone=553531122929&text=Ol%C3%A1%2C%20vim%20pela%20apresenta%C3%A7%C3%A3o%20da%20Grape%20Clinic%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o!",
  reasonsTitle: "Cuidado clínico, não pacote de estética.",
  reasonsEyebrow: "Por que a Grape Clinic",
  reasons: [
    {
      title: "Avaliação médica de verdade",
      body: "A equipe investiga a causa antes de indicar qualquer tratamento.",
    },
    {
      title: "Plano feito para você",
      body: "Nada de protocolo padrão — o plano é construído a partir da sua avaliação.",
    },
    {
      title: "Acompanhamento contínuo",
      body: "A equipe segue com você, presencialmente, em Pouso Alegre.",
    },
  ],
  processEyebrow: "Como funciona",
  processTitle: "3 passos até o seu plano",
  process: [
    {
      title: "Avaliação individual",
      body: "Conversa com a equipe sobre seu momento e histórico.",
    },
    {
      title: "Protocolo sob medida",
      body: "Plano específico construído a partir da sua leitura clínica.",
    },
    {
      title: "Acompanhamento",
      body: "Retornos e ajustes ao longo da jornada.",
    },
  ],
  formEyebrow: "Comece por aqui",
  formTitle: "Uma avaliação individual é o melhor começo.",
  formSub: "A equipe entende seu momento e indica o próximo passo.",
  faqEyebrow: "Dúvidas rápidas",
  faq: [
    {
      question: "Preciso já saber o que tratar?",
      answer: "Não. A avaliação existe para descobrir isso com a equipe.",
    },
    {
      question: "O atendimento é presencial?",
      answer: "Sim, na Grape Clinic em Pouso Alegre, MG.",
    },
    {
      question: "Quanto tempo até ser atendido?",
      answer: "A equipe responde pelo WhatsApp e orienta o agendamento.",
    },
  ],
  footerLegal: [
    "Dra. Marcela Ferreira de Oliveira — CRM/MG: 55051 - RQE Nº: 33744 — Ginecologia e Obstetrícia — Grape Clinic — CRM/PJ: 14610-MG — Diretora Técnica.",
    "Conteúdo educativo. Resultados variam por pessoa e dependem de avaliação médica individual.",
    "© 2026 Grape Clinic. CNPJ 21.762.194/0001-32. R. Cel. Brito Filho, nº461, Fátima, Pouso Alegre - MG.",
  ],
  instagramHref: "https://www.instagram.com/grapeclinic_/",
  youtubeHref: "https://www.youtube.com/channel/UCjaaFEZQH5Ef8D9g-OJCTfw",
} as const;

export const MAX_SITUACOES = 3;

export const incomeOptions = [
  "Até R$ 10.000",
  "R$ 10.000 a R$ 20.000",
  "R$ 20.000 a R$ 40.000",
  "R$ 40.000 a R$ 80.000",
  "Acima de R$ 80.000",
] as const;

export const situationOptions = [
  "Falta de energia",
  "Dificuldade para emagrecer",
  "Alterações hormonais",
  "Menopausa ou pós-parto",
  "Sono e ansiedade",
  "Performance física ou mental",
  "Inflamação e endometriose",
  "Outro",
] as const;

export const availabilityOptions = ["Sim", "Talvez", "Não"] as const;

export const profissaoOptions = [
  "Médico(a)",
  "Advogado(a)",
  "Engenheiro(a)",
  "Empreendedor(a)",
  "Executivo(a) / Gestor(a)",
  "Professor(a) / Educador(a)",
  "Profissional de Saúde",
  "Psicólogo(a)",
  "Servidor(a) Público",
  "Autônomo(a)",
  "Estudante",
  "Outro",
] as const;

export type EvaluationAnswers = {
  nome: string;
  whatsapp: string;
  cidade: string;
  profissao: string;
  situacoes: string[];
  disponibilidade: string;
  renda: string;
};

export const initialEvaluationAnswers: EvaluationAnswers = {
  nome: "",
  whatsapp: "",
  cidade: "",
  profissao: "",
  situacoes: [],
  disponibilidade: "",
  renda: "",
};

export function buildWhatsAppHref(answers: EvaluationAnswers) {
  const situacoes =
    answers.situacoes.length > 0
      ? answers.situacoes.join(", ")
      : "—";

  const text = [
    "Olá! Vim pela apresentação da Grape Clinic e gostaria de agendar uma avaliação.",
    "",
    `Nome: ${answers.nome}`,
    `WhatsApp: ${answers.whatsapp}`,
    `Cidade: ${answers.cidade}`,
    `Profissão: ${answers.profissao || "—"}`,
    `Situações: ${situacoes}`,
    `Disponibilidade: ${answers.disponibilidade}`,
    `Investimento: ${answers.renda}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${apresentacaoContent.whatsappPhone}&text=${encodeURIComponent(text)}`;
}
