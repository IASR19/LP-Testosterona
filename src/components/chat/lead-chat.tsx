"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCampaign } from "@/components/campaign/campaign-provider";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ChoiceButtons } from "@/components/chat/choice-buttons";
import { EbookFinalScreen } from "@/components/final/ebook-final-screen";
import { WhatsAppFinalScreen } from "@/components/final/whatsapp-final-screen";
import {
  getStepById,
  resolveMessages,
  resolveNextStep,
  type LeadAnswers,
} from "@/content/types";
import { formatBrazilianPhone } from "@/lib/form/formatters";
import { readApresentacaoLead } from "@/content/apresentacao/lead-storage";

type VisibleMessage = {
  id: string;
  text: string;
  from: "bot" | "user";
};

const MESSAGE_STAGGER_MS = 1100;
const AUTO_ADVANCE_MS = 1600;
const FIRST_MESSAGE_DELAY_MS = 500;

export function LeadChat() {
  const campaign = useCampaign();
  const { config, chatSteps, initialAnswers, finish } = campaign;
  const [answers, setAnswers] = useState<LeadAnswers>(() =>
    finish === "whatsapp" ? readApresentacaoLead() : initialAnswers,
  );
  const [stepId, setStepId] = useState(() => {
    if (finish !== "whatsapp") return "intro";
    return answers.name ? "resume" : "intro";
  });
  const [messages, setMessages] = useState<VisibleMessage[]>([]);
  const [revealing, setRevealing] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const messageSeqRef = useRef(0);
  const revealedStepsRef = useRef(new Set<string>());
  const answersRef = useRef(answers);

  const step = getStepById(chatSteps, stepId);

  const nextMessageId = useCallback(() => {
    messageSeqRef.current += 1;
    return `msg-${messageSeqRef.current}`;
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = scrollRef.current;
    const bottom = bottomRef.current;

    const run = () => {
      if (bottom) {
        bottom.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
    const id = window.setTimeout(() => scrollToBottom(true), 380);
    return () => window.clearTimeout(id);
  }, [messages, revealing, error, scrollToBottom]);

  useEffect(() => {
    if (revealing) return;
    const id = window.setTimeout(() => scrollToBottom(true), 100);
    return () => window.clearTimeout(id);
  }, [revealing, stepId, scrollToBottom]);

  const beginStep = useCallback((nextStepId: string) => {
    setError(null);
    setInputValue("");
    setRevealing(true);
    setStepId(nextStepId);
  }, []);

  useEffect(() => {
    if (!step || finished) return;

    if (revealedStepsRef.current.has(step.id)) {
      const inputVisible = window.setTimeout(() => setRevealing(false), 0);
      return () => window.clearTimeout(inputVisible);
    }

    const runId = ++runIdRef.current;
    const currentAnswers = answersRef.current;
    const botMessages = resolveMessages(step, currentAnswers);
    const addedIds: string[] = [];

    let cancelled = false;
    let stepCompleted = false;
    let index = 0;
    const timeouts: number[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timeouts.push(id);
    };

    const tick = () => {
      if (cancelled || runId !== runIdRef.current) return;

      if (index >= botMessages.length) {
        stepCompleted = true;
        revealedStepsRef.current.add(step.id);
        setRevealing(false);

        if (step.autoAdvance) {
          schedule(() => {
            if (cancelled || runId !== runIdRef.current) return;
            const next = resolveNextStep(step, answersRef.current);
            if (next) {
              beginStep(next);
            } else {
              setFinished(true);
            }
          }, AUTO_ADVANCE_MS);
        }
        return;
      }

      const text = botMessages[index];
      const id = nextMessageId();
      addedIds.push(id);
      index += 1;

      setMessages((prev) => [...prev, { id, text, from: "bot" }]);
      schedule(tick, MESSAGE_STAGGER_MS);
    };

    schedule(tick, FIRST_MESSAGE_DELAY_MS);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
      if (!stepCompleted && addedIds.length > 0) {
        const abortIds = new Set(addedIds);
        setMessages((prev) =>
          prev.filter((message) => !abortIds.has(message.id)),
        );
      }
    };
  }, [step, finished, beginStep, nextMessageId]);

  function advanceWithAnswer(field: keyof LeadAnswers, rawValue: string) {
    if (!step?.input || revealing) return;

    const transformed = step.input.transform
      ? step.input.transform(rawValue)
      : rawValue.trim();

    const validationError = step.input.validate?.(transformed) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    const nextAnswers = { ...answers, [field]: transformed };
    setAnswers(nextAnswers);

    const id = nextMessageId();
    setMessages((prev) => [
      ...prev,
      {
        id,
        text: transformed,
        from: "user",
      },
    ]);

    const next = resolveNextStep(step, nextAnswers);
    if (next) {
      beginStep(next);
    } else {
      setFinished(true);
    }
  }

  function handleTextSubmit() {
    if (!step?.input) return;
    advanceWithAnswer(step.input.field, inputValue);
  }

  function handleChoice(value: string) {
    if (!step?.input) return;
    advanceWithAnswer(step.input.field, value);
  }

  if (finished) {
    if (finish === "whatsapp") {
      return <WhatsAppFinalScreen answers={answers} />;
    }
    return <EbookFinalScreen answers={answers} />;
  }

  const showInput =
    !revealing &&
    step?.input &&
    step.input.kind !== "choice" &&
    !step.autoAdvance;

  const showChoices =
    !revealing && step?.input?.kind === "choice" && step.input.choices;

  const inputMode =
    step?.input?.kind === "email"
      ? "email"
      : step?.input?.kind === "phone"
        ? "tel"
        : "text";

  return (
    <div
      className={
        finish === "whatsapp"
          ? "apresentacao-lp relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[color:var(--ap-cream)]"
          : "relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-[#1a1512]"
      }
    >
      {config.chatBackgroundSrc ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={config.chatBackgroundSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-cover object-center scale-110 blur-[2.5px]"
          />
          <div className="absolute inset-0 bg-[#1a1512]/62" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/35 via-transparent to-[#1a1512]/75" />
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="relative z-10 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain px-4 pb-8 pt-8"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            text={message.text}
            from={message.from}
          />
        ))}

        {showInput && step.input ? (
          <ChatInput
            value={inputValue}
            placeholder={step.input.placeholder ?? ""}
            inputMode={inputMode}
            error={error}
            onChange={(value) => {
              setInputValue(
                step.input?.kind === "phone"
                  ? formatBrazilianPhone(value)
                  : value,
              );
              if (error) setError(null);
            }}
            onSubmit={handleTextSubmit}
          />
        ) : null}

        {showChoices && step.input?.choices ? (
          <ChoiceButtons
            choices={step.input.choices}
            onSelect={handleChoice}
          />
        ) : null}

        <div ref={bottomRef} className="h-px w-full shrink-0" aria-hidden />
      </div>
    </div>
  );
}
