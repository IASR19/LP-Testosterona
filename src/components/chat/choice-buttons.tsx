"use client";

import { motion } from "motion/react";

import type { ChoiceOption } from "@/content/chat-flow";

type ChoiceButtonsProps = {
  choices: ChoiceOption[];
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export function ChoiceButtons({
  choices,
  disabled = false,
  onSelect,
}: ChoiceButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex max-w-[min(100%,22rem)] flex-col gap-2 self-start pl-10"
    >
      {choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(choice.value)}
          className="rounded-md border border-[#e4e4e4] bg-white px-3.5 py-2.5 text-left text-[15px] leading-snug text-[#1a1a1a] transition-colors hover:border-[#d0d0d0] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {choice.label}
        </button>
      ))}
    </motion.div>
  );
}
