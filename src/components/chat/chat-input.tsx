"use client";

import { FormEvent, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  placeholder: string;
  inputMode?: "text" | "email" | "tel";
  disabled?: boolean;
  error?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({
  value,
  placeholder,
  inputMode = "text",
  disabled = false,
  error,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, placeholder]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!disabled) onSubmit();
  }

  return (
    <div className="w-full max-w-[min(100%,22rem)] self-start pl-10">
      <form
        onSubmit={handleSubmit}
        className="flex items-stretch gap-2"
      >
        <input
          ref={inputRef}
          type={inputMode === "email" ? "email" : "text"}
          inputMode={inputMode}
          autoComplete={
            inputMode === "email"
              ? "email"
              : inputMode === "tel"
                ? "tel"
                : "given-name"
          }
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-md border border-[#e4e4e4] bg-white px-3.5 text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#b0b0b0]",
            "focus:border-[#cfcfcf]",
            "disabled:opacity-60",
          )}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Enviar"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-md bg-[#f05a28] text-white transition-opacity",
            "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <Send className="size-4" strokeWidth={2.25} />
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-sm leading-snug text-[#b45309]">{error}</p>
      ) : null}
    </div>
  );
}
