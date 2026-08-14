import type { Metadata } from "next";

import { apresentacaoChatCampaign } from "@/content/apresentacao/campaign";

const { siteMeta } = apresentacaoChatCampaign;

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: siteMeta.path,
  },
};

export default function AtendimentoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
