import { chatSteps } from "@/content/testosterona/chat-flow";
import { leadMagnetConfig, siteMeta } from "@/content/testosterona/lead-magnet";
import { emptyAnswers, type Campaign } from "@/content/types";

export const testosteronaCampaign: Campaign = {
  slug: "testosterona",
  finish: "whatsapp-group",
  config: leadMagnetConfig,
  siteMeta,
  chatSteps,
  initialAnswers: emptyAnswers,
};
