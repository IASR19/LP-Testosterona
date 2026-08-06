"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Campaign } from "@/content/types";

const CampaignContext = createContext<Campaign | null>(null);

export function CampaignProvider({
  campaign,
  children,
}: {
  campaign: Campaign;
  children: ReactNode;
}) {
  return (
    <CampaignContext.Provider value={campaign}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const campaign = useContext(CampaignContext);
  if (!campaign) {
    throw new Error("useCampaign deve ser usado dentro de CampaignProvider");
  }
  return campaign;
}
