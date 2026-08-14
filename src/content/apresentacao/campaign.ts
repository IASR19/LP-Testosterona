import { chatSteps } from "@/content/apresentacao/chat-flow";
import { apresentacaoMeta } from "@/content/apresentacao";
import { emptyAnswers, type Campaign, type LeadMagnetConfig } from "@/content/types";

const chatConfig: LeadMagnetConfig = {
  brandName: "Grape Clinic",
  doctorName: "Grape Clinic",
  instagramHandle: "grapeclinic_",
  instagramHref: "https://www.instagram.com/grapeclinic_/",
  ebookDownloadUrl: "",
  ebookViewUrl: "",
  whatsappGroupUrl: "",
  redirectDelayMs: 1200,
  avatarSrc: "/brand/grapeclinic-grape-seal-dark.svg",
  avatarObjectPosition: "center",
  chatBackgroundSrc: "",
  finalScreenSrc: "",
  finalScreenWidth: 0,
  finalScreenHeight: 0,
  finalScreenAlt: "",
  finalScreenBgClassName: "",
  ctaClassName: "",
  fallbackLinkClassName: "",
};

export const apresentacaoChatCampaign: Campaign = {
  slug: "apresentacao",
  finish: "whatsapp",
  config: chatConfig,
  siteMeta: {
    title: "Iniciar atendimento | Grape Clinic",
    description: apresentacaoMeta.description,
    path: "/apresentacao/atendimento",
  },
  chatSteps,
  initialAnswers: emptyAnswers,
};
