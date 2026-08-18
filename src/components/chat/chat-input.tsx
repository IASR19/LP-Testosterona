"use client";

import { FormEvent, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import { PhoneInput } from "@/components/form/phone-input";
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
        {inputMode === "tel" ? (
          <PhoneInput
            inputRef={inputRef}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            onChange={onChange}
            className={cn(
              "h-11 min-w-0 flex-1 rounded-md border border-[#e4e4e4]/90 bg-white/95 text-[#1a1a1a] shadow-sm backdrop-blur-[2px]",
              "focus-within:border-[#cfcfcf]",
              disabled && "opacity-60",
            )}
            inputClassName="placeholder:text-[#b0b0b0]"
          />
        ) : (
          <input
            ref={inputRef}
            type={inputMode === "email" ? "email" : "text"}
            inputMode={inputMode}
            autoComplete={
              inputMode === "email" ? "email" : "given-name"
            }
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className={cn(
              "h-11 min-w-0 flex-1 rounded-md border border-[#e4e4e4]/90 bg-white/95 px-3.5 text-[15px] text-[#1a1a1a] shadow-sm outline-none backdrop-blur-[2px] placeholder:text-[#b0b0b0]",
              "focus:border-[#cfcfcf]",
              "disabled:opacity-60",
            )}
          />
        )}
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
      {inputMode === "tel" && !error ? (
        <p className="mt-1.5 inline-flex rounded-md bg-white/92 px-2 py-1 text-[11px] font-medium leading-snug text-[#1a1a1a]">
          Brasil +55 já está selecionado. Digite só o DDD e o número.
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 rounded-md bg-[#1a1512]/70 px-2 py-1 text-sm leading-snug text-[#fbbf24]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
