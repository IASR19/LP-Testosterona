import type { LeadMagnetConfig, SiteMeta } from "@/content/types";

export const leadMagnetConfig: LeadMagnetConfig = {
  brandName: "Grape Clinic",
  doctorName: "Dra. Marcela",
  instagramHandle: "grapeclinic_",
  instagramHref: "https://www.instagram.com/grapeclinic_/",
  ebookDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1kMbo3Tc1RlbEVUXvHAkfrRlmfyG_JIKo",
  ebookViewUrl:
    "https://drive.google.com/file/d/1kMbo3Tc1RlbEVUXvHAkfrRlmfyG_JIKo/view?usp=drive_link",
  whatsappGroupUrl:
    "https://chat.whatsapp.com/IRX54cUtzbzHyTTUzJqQM7?s=sh&p=a&ilr=0",
  redirectDelayMs: 1200,
  avatarSrc: "/images/endometriose/chat-avatar.png",
  avatarObjectPosition: "center 18%",
  chatBackgroundSrc: "/images/endometriose/chat-bg.webp",
  finalScreenSrc: "/images/endometriose/final-screen.webp",
  finalScreenWidth: 1290,
  finalScreenHeight: 2293,
  finalScreenAlt:
    "Clique no botão para baixar o ebook gratuito sobre endometriose",
  finalScreenBgClassName: "bg-[#1a1816]",
  ctaClassName: [
    "bg-[#7d6448] px-3 text-center font-semibold uppercase leading-[1.15] tracking-[0.03em] text-white",
    "left-[42%] top-[72.5%] h-[6.2%] w-[50%]",
    "text-[clamp(0.5rem,2.45vw,0.72rem)]",
    "hover:bg-[#6e573e]",
  ].join(" "),
  fallbackLinkClassName:
    "absolute bottom-[8%] left-1/2 z-20 w-[80%] -translate-x-1/2 rounded-full bg-[#1a1816]/90 px-3 py-2.5 text-center text-[12px] font-medium text-[#f2e8d5] backdrop-blur-sm",
};

export const siteMeta: SiteMeta = {
  title: "Guia gratuito de Endometriose | Grape Clinic",
  description:
    "Receba o guia gratuito sobre endometriose: sinais, cuidados e tratamento. Captação Grape Clinic.",
  path: "/endometriose",
};
