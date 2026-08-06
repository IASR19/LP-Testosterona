import type { Metadata } from "next";

import { siteMeta } from "@/content/testosterona/lead-magnet";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: siteMeta.path,
  },
};

export default function TestosteronaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
