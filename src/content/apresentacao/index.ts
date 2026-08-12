export const apresentacaoMeta = {
  title: "Apresentação | Grape Clinic",
  description:
    "Seu corpo muda quando hormônio e metabolismo entram em equilíbrio. Avaliação individual na Grape Clinic.",
  path: "/apresentacao",
} as const;

export const apresentacaoContent = {
  eyebrow: "Pouso Alegre, MG",
  heroTitle:
    "Seu corpo muda quando hormônio e metabolismo entram em equilíbrio.",
  heroSub:
    "Na Grape, tratamos a raiz — não o sintoma. Para uma composição corporal que se transforma de forma natural e permanece.",
  ctaLabel: "Agendar minha avaliação",
  formAnchor: "form",
  videoSrc: "/videos/apresentacao.mp4",
  videoPoster: "/videos/apresentacao-poster.png",
  videoEndFrame: "/videos/apresentacao-end.png",
  whatsappPhone: "553531122929",
  whatsappQuickHref:
    "https://api.whatsapp.com/send?phone=553531122929&text=Ol%C3%A1%2C%20vim%20pela%20apresenta%C3%A7%C3%A3o%20da%20Grape%20Clinic%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o!",
  painEyebrow: "O que trava",
  painTitle:
    "Dieta certa, treino em dia, esforço redobrado — e o corpo continua no mesmo lugar.",
  painBody:
    "Às vezes o esforço está certo. O que está desregulado é o hormônio e o metabolismo por trás dele.",
  solutionEyebrow: "O reframe",
  solutionTitle: "Na Grape, olhamos para a causa, não para o resultado isolado.",
  solutionBody: [
    "Seu histórico hormonal e metabólico é avaliado de forma individual, para identificar exatamente o que está travando o seu corpo.",
    "De dentro para fora: quando o equilíbrio interno acontece, a mudança externa é consequência natural.",
  ],
  solutionTagline: "Viver mais. Viver melhor. Viver juntos.",
  formEyebrow: "Avaliação",
  formTitle: "Agendar minha avaliação",
  formSub:
    "Fale com a nossa equipe e descubra o que está por trás do que você sente.",
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
    "Dra. Marcela Ferreira de Oliveira · CRM/MG 55051 · RQE nº 33744",
    "Ginecologia e Obstetrícia · Grape Clinic · CRM/PJ 14610-MG · Diretora Técnica",
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
    answers.situacoes.length > 0 ? answers.situacoes.join(", ") : "—";

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
