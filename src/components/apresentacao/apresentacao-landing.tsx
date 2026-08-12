"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { EvaluationForm } from "@/components/apresentacao/evaluation-form";
import { PresentationVideo } from "@/components/apresentacao/presentation-video";
import { apresentacaoContent } from "@/content/apresentacao";
import { cn } from "@/lib/utils";

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase",
        light
          ? "text-[color:var(--ap-gold-light)]"
          : "text-[color:var(--ap-gold)]",
      )}
    >
      <span
        className={cn(
          "h-px w-4",
          light
            ? "bg-[color:var(--ap-gold-light)]"
            : "bg-[color:var(--ap-gold)]",
        )}
        aria-hidden
      />
      {children}
    </span>
  );
}

function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[color:var(--ap-line)] py-4 last:border-b">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[15px] font-semibold text-[color:var(--ap-ink)]">
          {question}
        </span>
        <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[color:var(--ap-gold)] text-[color:var(--ap-gold)]">
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </span>
      </button>
      {open ? (
        <p className="mt-2.5 text-sm leading-6 text-[color:var(--ap-muted)]">
          {answer}
        </p>
      ) : null}
    </div>
  );
}

export function ApresentacaoLanding() {
  const content = apresentacaoContent;

  return (
    <div className="apresentacao-lp min-h-full bg-[color:var(--ap-cream)] text-[color:var(--ap-ink)]">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <a href="#topo" className="block shrink-0" aria-label="Grape Clinic">
          <Image
            src="/brand/grapeclinic-logo-dark.svg"
            alt="Grape Clinic"
            width={148}
            height={45}
            priority
            className="h-9 w-auto"
          />
        </a>
        <a
          href={`#${content.formAnchor}`}
          className="rounded-full bg-[color:var(--ap-primary)] px-4 py-2 text-xs font-semibold text-white"
        >
          {content.ctaLabel}
        </a>
      </header>

      <main id="topo">
        <section className="mx-auto grid max-w-5xl gap-8 px-5 pb-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-16">
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h1 className="mt-4 max-w-xl text-balance text-[clamp(1.75rem,4.6vw,2.85rem)] font-medium leading-[1.14] tracking-[-0.02em] text-[color:var(--ap-primary)]">
              {content.heroTitle}
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-[color:var(--ap-muted)] sm:text-base">
              {content.heroSub}
            </p>
            <div className="mt-6">
              <a
                href={`#${content.formAnchor}`}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-[color:var(--ap-primary)] px-5 text-sm font-semibold text-white"
              >
                {content.ctaLabel}
              </a>
            </div>
          </div>

          <PresentationVideo />
        </section>

        <section className="border-y border-[color:var(--ap-line)] bg-white/70 py-12 sm:py-14">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <Eyebrow>{content.painEyebrow}</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-balance text-2xl font-medium tracking-[-0.02em] text-[color:var(--ap-primary)] sm:text-[1.75rem]">
              {content.painTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[color:var(--ap-muted)]">
              {content.painBody}
            </p>
          </div>
        </section>

        <section className="bg-[color:var(--ap-cream-2)] py-12 sm:py-14">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <Eyebrow>{content.solutionEyebrow}</Eyebrow>
            <h2 className="mt-3 max-w-2xl text-balance text-2xl font-medium tracking-[-0.02em] text-[color:var(--ap-primary)] sm:text-[1.75rem]">
              {content.solutionTitle}
            </h2>
            <div className="mt-4 max-w-2xl space-y-4 text-[15px] leading-7 text-[color:var(--ap-muted)]">
              {content.solutionBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 text-lg font-medium tracking-[-0.01em] text-[color:var(--ap-primary)] sm:text-xl">
              {content.solutionTagline}
            </p>
          </div>
        </section>

        <section
          id={content.formAnchor}
          className="scroll-mt-6 bg-[color:var(--ap-primary)] py-12 text-white sm:py-16"
        >
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <Eyebrow light>{content.formEyebrow}</Eyebrow>
            <h2 className="mt-3 max-w-xl text-balance text-2xl font-medium tracking-[-0.02em] text-[color:var(--ap-cream)] sm:text-[1.85rem]">
              {content.formTitle}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
              {content.formSub}
            </p>
            <div className="mt-8">
              <EvaluationForm />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <Eyebrow>{content.faqEyebrow}</Eyebrow>
            <div className="mt-4">
              {content.faq.map((item, index) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[color:var(--ap-ink)] px-5 py-10 text-[color:var(--ap-cream)] sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Image
            src="/brand/grapeclinic-logo-light.svg"
            alt="Grape Clinic"
            width={140}
            height={42}
            className="h-8 w-auto opacity-90"
          />
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-white/65">
            <a
              href={content.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a
              href={content.youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              YouTube
            </a>
          </div>
          <div className="mt-6 space-y-3 text-[11.5px] leading-5 text-white/40">
            {content.footerLegal.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
