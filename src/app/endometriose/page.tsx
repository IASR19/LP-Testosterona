"use client";

import { CampaignProvider } from "@/components/campaign/campaign-provider";
import { LeadChat } from "@/components/chat/lead-chat";
import { endometrioseCampaign } from "@/content/endometriose";

export default function EndometriosePage() {
  return (
    <CampaignProvider campaign={endometrioseCampaign}>
      <LeadChat />
    </CampaignProvider>
  );
}
