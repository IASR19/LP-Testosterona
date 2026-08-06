"use client";

import { CampaignProvider } from "@/components/campaign/campaign-provider";
import { LeadChat } from "@/components/chat/lead-chat";
import { testosteronaCampaign } from "@/content/testosterona";

export default function TestosteronaPage() {
  return (
    <CampaignProvider campaign={testosteronaCampaign}>
      <LeadChat />
    </CampaignProvider>
  );
}
