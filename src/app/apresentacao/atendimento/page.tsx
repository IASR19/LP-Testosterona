"use client";

import { CampaignProvider } from "@/components/campaign/campaign-provider";
import { LeadChat } from "@/components/chat/lead-chat";
import { apresentacaoChatCampaign } from "@/content/apresentacao/campaign";

export default function ApresentacaoAtendimentoPage() {
  return (
    <CampaignProvider campaign={apresentacaoChatCampaign}>
      <LeadChat />
    </CampaignProvider>
  );
}
