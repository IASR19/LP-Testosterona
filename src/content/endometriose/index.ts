import { chatSteps } from "@/content/endometriose/chat-flow";
import { leadMagnetConfig, siteMeta } from "@/content/endometriose/lead-magnet";
import { emptyAnswers, type Campaign } from "@/content/types";

export const endometrioseCampaign: Campaign = {
  slug: "endometriose",
  finish: "whatsapp-group",
  config: leadMagnetConfig,
  siteMeta,
  chatSteps,
  initialAnswers: emptyAnswers,
};
