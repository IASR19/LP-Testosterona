import type { Metadata } from "next";

import { apresentacaoMeta } from "@/content/apresentacao";

export const metadata: Metadata = {
  title: apresentacaoMeta.title,
  description: apresentacaoMeta.description,
  openGraph: {
    title: apresentacaoMeta.title,
    description: apresentacaoMeta.description,
    url: apresentacaoMeta.path,
  },
};

export default function ApresentacaoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
