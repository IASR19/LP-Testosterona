"use client";

import { motion } from "motion/react";

import { useCampaign } from "@/components/campaign/campaign-provider";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  text: string;
  from?: "bot" | "user";
};

export function ChatBubble({ text, from = "bot" }: ChatBubbleProps) {
  const { config } = useCampaign();
  const isBot = from === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex max-w-[min(100%,22rem)] items-end gap-2.5",
        isBot ? "self-start" : "self-end",
      )}
    >
      {isBot ? (
        <span className="mb-0.5 inline-flex size-8 shrink-0 overflow-hidden rounded-full bg-[#e8e0d4] ring-1 ring-[#e4e4e4]">
          <img
            src={config.avatarSrc}
            alt={config.doctorName}
            width={32}
            height={32}
            className="size-8 object-cover"
            style={{ objectPosition: config.avatarObjectPosition }}
            decoding="async"
          />
        </span>
      ) : null}

      <div
        className={cn(
          "rounded-md border px-3.5 py-2.5 text-[15px] leading-snug",
          isBot
            ? "border-[#e4e4e4] bg-white text-[#1a1a1a]"
            : "border-transparent bg-[#f05a28] text-white",
        )}
      >
        {text}
      </div>
    </motion.div>
  );
}
