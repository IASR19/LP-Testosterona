import type { LeadMagnetConfig, SiteMeta } from "@/content/types";

export const leadMagnetConfig: LeadMagnetConfig = {
  brandName: "Grape Clinic",
  doctorName: "Dr. Thalys",
  instagramHandle: "grapeclinic_",
  instagramHref: "https://www.instagram.com/grapeclinic_/",
  ebookDownloadUrl:
    "https://drive.google.com/uc?export=download&id=1gE6YI3tLFKtqFOSnIIZ76gZPru7ZNplT",
  ebookViewUrl:
    "https://drive.google.com/file/d/1gE6YI3tLFKtqFOSnIIZ76gZPru7ZNplT/view?usp=sharing",
  whatsappGroupUrl:
    "https://chat.whatsapp.com/BDjX9xhQObZ8Au6fxnWjnN?s=cl&p=a&ilr=0",
  redirectDelayMs: 1200,
  avatarSrc: "/images/testosterona/chat-avatar.png",
  avatarObjectPosition: "center 12%",
  chatBackgroundSrc: "/images/testosterona/chat-bg.webp",
  finalScreenSrc: "/images/testosterona/final-screen.webp",
  finalScreenWidth: 1290,
  finalScreenHeight: 2293,
  finalScreenAlt:
    "Clique no botão para baixar o ebook gratuito sobre testosterona",
  finalScreenBgClassName: "bg-[#2a211c]",
  ctaClassName: [
    "bg-[#5c4638] px-2.5 text-center font-semibold uppercase leading-[1.1] tracking-[0.03em] text-white",
    "left-[5%] top-[85%] h-[4.6%] w-[42%]",
    "text-[clamp(0.42rem,1.9vw,0.62rem)]",
    "hover:bg-[#4a382d]",
  ].join(" "),
  fallbackLinkClassName:
    "absolute bottom-[3%] left-[5%] z-20 w-[42%] rounded-full bg-[#1a1816]/90 px-2 py-2 text-center text-[11px] font-medium text-[#f2e8d5] backdrop-blur-sm",
};

export const siteMeta: SiteMeta = {
  title: "E-book Testosterona | Grape Clinic",
  description:
    "Baixe o e-book gratuito sobre testosterona masculina: entenda, previna e retome o controle. Captação Grape Clinic.",
  path: "/testosterona",
};
