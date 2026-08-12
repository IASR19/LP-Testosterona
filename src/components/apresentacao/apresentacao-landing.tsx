"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Apple,
  ArrowRight,
  Camera,
  ChevronDown,
  Droplet,
  Dumbbell,
  HeartPulse,
  Leaf,
  MapPin,
  MessageCircle,
  PlayCircle,
  Sparkle,
  Star,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { EvaluationForm } from "@/components/apresentacao/evaluation-form";
import { Parallax, Reveal } from "@/components/apresentacao/motion-layers";
import { PresentationVideo } from "@/components/apresentacao/presentation-video";
import { VerticalClip } from "@/components/apresentacao/vertical-clip";
import { apresentacaoContent } from "@/content/apresentacao";
import { cn } from "@/lib/utils";

const pillarIcons: Record<string, LucideIcon> = {
  heart: HeartPulse,
  zap: Zap,
  droplet: Droplet,
  dumbbell: Dumbbell,
  leaf: Leaf,
  apple: Apple,
  sun: Sun,
};

function Eyebrow({
  children,
  light = false,
  className,
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase",
        light
          ? "text-[color:var(--ap-gold-light)]"
          : "text-[color:var(--ap-gold)]",
        className,
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

function StarDivider({ light = false }: { light?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2",
        light
          ? "text-[color:var(--ap-cream)]"
          : "text-[color:var(--ap-primary)]",
      )}
      aria-hidden
    >
      <span
        className={cn("h-px flex-1 bg-current", light ? "opacity-70" : "opacity-30")}
      />
      <svg
        viewBox="0 0 20 28"
        className={cn("h-4 w-auto fill-current", light ? "" : "opacity-55")}
      >
        <path d="M10 0c.6 9 1.5 12.4 10 14-8.5 1.6-9.4 5-10 14-.6-9-1.5-12.4-10-14 8.5-1.6 9.4-5 10-14Z" />
      </svg>
      <span
        className={cn("h-px flex-1 bg-current", light ? "opacity-70" : "opacity-30")}
      />
    </div>
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
    <div className="border-t border-[color:var(--ap-line)] py-3.5 last:border-b">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[13.5px] font-semibold text-[color:var(--ap-ink)]">
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
        <p className="mt-2 text-[13px] leading-6 text-[color:var(--ap-muted)]">
          {answer}
        </p>
      ) : null}
    </div>
  );
}

export function ApresentacaoLanding() {
  const content = apresentacaoContent;
  const year = new Date().getFullYear();

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
          className="rounded-full bg-[color:var(--ap-cta)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--ap-ink)]"
        >
          {content.ctaLabel}
        </a>
      </header>

      <main id="topo">
        <section className="relative mx-auto grid max-w-5xl gap-8 px-5 pb-8 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12 lg:pb-10">
          <Parallax
            className="ap-mark left-[3%] top-[2%] h-[92%]"
            distance={60}
            aboveFold
          >
            <Image
              src="/brand/grapeclinic-grape-watermark.svg"
              alt=""
              width={376}
              height={527}
              aria-hidden
              className="h-full w-auto opacity-[0.07]"
            />
          </Parallax>

          <div className="relative min-w-0">
            <p className="text-sm font-semibold text-[color:var(--ap-gold)]">
              {content.eyebrow}
            </p>
            <h1 className="mt-9 text-[clamp(1.6rem,3.6vw,2.4rem)] font-normal leading-[1.28] tracking-[-0.015em] text-[color:var(--ap-primary)]">
              <span className="block">{content.heroTitleBefore}</span>
              <span className="block font-semibold">
                {content.heroTitleAccent}
              </span>
              <span className="block">{content.heroTitleAfter}</span>
            </h1>
            <p className="mt-6 max-w-xl text-justify text-[15px] leading-7 text-[color:var(--ap-muted)]">
              {content.heroSub}
            </p>
            <div className="mt-7">
              <a
                href={`#${content.formAnchor}`}
                className="ap-cta inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--ap-cta)] px-7 text-sm font-semibold uppercase tracking-wide text-[color:var(--ap-ink)]"
              >
                {content.ctaLabel}
              </a>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[color:var(--ap-line)] pt-5 sm:gap-6">
              {content.stats.map((stat) => (
                <div key={stat.value}>
                  <p className="text-xl font-semibold tracking-tight text-[color:var(--ap-primary)] sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-[color:var(--ap-muted)] sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-1.5 text-[10.5px] leading-4 text-[color:var(--ap-muted)]/80 sm:text-[11px]">
              {content.heroLegal.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <Parallax distance={18} aboveFold>
            <PresentationVideo />
          </Parallax>
        </section>

        <section className="bg-[color:var(--ap-primary)] py-12 text-[color:var(--ap-cream)] sm:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <Parallax className="w-full" distance={26}>
              <Image
                src="/brand/grapeclinic-grape-seal-light.svg"
                alt=""
                width={60}
                height={90}
                className="mx-auto h-[5.5rem] w-auto"
              />
            </Parallax>
            <Reveal>
              <h2 className="mt-9 text-[clamp(1.2rem,2.5vw,1.7rem)] font-normal leading-[1.32] tracking-[-0.015em]">
                {content.methodHeadline}
              </h2>
              <p className="mt-4 text-justify text-sm leading-6 text-white/70 sm:text-[15px]">
                {content.methodSub}
              </p>
            </Reveal>

            <div className="mx-auto mt-9 max-w-[10rem]">
              <StarDivider light />
            </div>

            <Reveal delay={0.08}>
              <p className="mt-9 text-justify text-sm leading-7 text-white/78 sm:text-[15px]">
                {content.methodBody}
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 lg:gap-2.5">
              {content.pillars.map((pillar, index) => {
                const Icon = pillarIcons[pillar.icon] ?? Sparkle;
                return (
                  <Reveal key={pillar.id} delay={index * 0.07} distance={22}>
                    <span className="mx-auto grid size-11 place-items-center rounded-full border border-white/30">
                      <Icon
                        className="size-[1.15rem] text-[color:var(--ap-cream)]"
                        strokeWidth={1.5}
                      />
                    </span>
                    <div className="mt-4 flex min-h-[5.25rem] flex-col justify-between rounded-md border border-white/12 bg-white/[0.08] p-2.5">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-medium text-white/55">
                          {pillar.id}
                        </span>
                        <span
                          className="mt-1 size-1 rounded-full bg-white/45"
                          aria-hidden
                        />
                      </span>
                      <p className="text-[11px] font-medium leading-tight text-[color:var(--ap-cream)] sm:text-xs">
                        {pillar.title}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id={content.formAnchor}
          className="ap-grapes-on-dark scroll-mt-6 border-t border-white/10 bg-[color:var(--ap-primary)] py-10 text-white sm:py-14"
        >
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12">
            <div>
              <Parallax distance={22}>
                <Image
                  src="/brand/grapeclinic-grape-seal-light.svg"
                  alt=""
                  width={52}
                  height={78}
                  className="h-[4.5rem] w-auto"
                />
              </Parallax>
              <p className="mt-7 text-sm font-semibold text-[color:var(--ap-cream)]">
                {content.formEyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3.2vw,2.1rem)] font-normal leading-[1.24] tracking-[-0.015em] text-[color:var(--ap-cream)]">
                <span className="block">{content.formTitleBefore}</span>
                <span className="block font-semibold">
                  {content.formTitleAccent}
                </span>
                <span className="block">{content.formTitleAfter}</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                {content.formSub}
              </p>
              <p className="mt-9 text-center text-[15px] text-[color:var(--ap-cream)] lg:max-w-md">
                {content.formTagline}
              </p>
            </div>
            <EvaluationForm />
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12">
            <div>
              <Parallax distance={20}>
                <Image
                  src="/brand/grapeclinic-grape-seal-dark.svg"
                  alt=""
                  width={48}
                  height={72}
                  className="h-[4.25rem] w-auto"
                />
              </Parallax>
              <h2 className="mt-7 text-[clamp(1.5rem,3.1vw,2.05rem)] font-normal leading-[1.26] tracking-[-0.015em] text-[color:var(--ap-primary)]">
                <span className="block">{content.testimonialTitleBefore}</span>
                <span className="block font-semibold">
                  {content.testimonialTitleAccent}
                </span>
              </h2>
              <p className="mt-5 text-justify text-[15px] leading-7 text-[color:var(--ap-muted)]">
                {content.testimonialBody}
              </p>

              <div className="mx-auto mt-8 max-w-[10rem]">
                <StarDivider />
              </div>

              <p className="mt-5 text-right text-sm text-[color:var(--ap-muted)]">
                <span className="block">{content.testimonialEyebrow}</span>
                <span className="mt-1 block text-[color:var(--ap-primary)]">
                  {content.testimonialNames}
                </span>
              </p>

              <div className="ap-grapes-on-light mt-10 rounded-lg px-4 py-5 sm:px-5">
                <Eyebrow>{content.faqEyebrow}</Eyebrow>
                <div className="mt-3">
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
            </div>

            <Parallax className="lg:justify-self-end" distance={28}>
              <VerticalClip
                src={content.testimonialSrc}
                poster={content.testimonialPoster}
                endFrame={content.testimonialEndFrame}
                ariaLabel={`Depoimento em vídeo de ${content.testimonialNames}`}
                className="mx-0 max-w-none lg:max-w-[400px]"
              />
            </Parallax>
          </div>
        </section>
      </main>

      <footer className="bg-[color:var(--ap-primary)] text-[color:var(--ap-cream)]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-end lg:gap-10">
            <div>
              <Image
                src="/brand/grapeclinic-logo-light.svg"
                alt="Grape Clinic"
                width={140}
                height={42}
                className="h-8 w-auto opacity-95"
              />
              <p className="mt-7 max-w-2xl text-balance text-[clamp(1.65rem,5vw,2.75rem)] font-medium leading-[1.08]">
                {content.footerCtaTitle}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                {content.footerCtaSub}
              </p>
            </div>

            <aside className="flex w-full flex-col gap-4 lg:justify-self-end">
              <a
                href={content.siteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[3.75rem] items-center justify-between gap-4 rounded-xl bg-white px-4 py-3.5 text-[color:var(--ap-primary)] sm:min-h-[4.25rem] sm:px-5 sm:py-4"
              >
                <span className="min-w-0">
                  <span className="block text-base font-medium leading-tight sm:text-lg">
                    {content.footerCtaLabel}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-[color:var(--ap-primary)]/70">
                    {content.footerCtaHint}
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[color:var(--ap-primary)] text-white sm:size-11">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </a>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 sm:overflow-hidden sm:rounded-xl sm:border sm:border-white/14 sm:divide-x sm:divide-white/14">
                {(
                  [
                    {
                      label: "Instagram",
                      href: content.instagramHref,
                      icon: Camera,
                    },
                    {
                      label: "YouTube",
                      href: content.youtubeHref,
                      icon: PlayCircle,
                    },
                    {
                      label: "WhatsApp",
                      href: content.whatsappQuickHref,
                      icon: MessageCircle,
                    },
                    {
                      label: "Google",
                      href: content.reviewsHref,
                      icon: Star,
                    },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-center transition-colors hover:bg-white/10 sm:min-h-[4.25rem] sm:rounded-none sm:px-3"
                    >
                      <Icon className="size-4 text-white/88" aria-hidden />
                      <span className="text-xs font-medium leading-none text-white/76">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-6 border-t border-white/14 pt-6 sm:grid-cols-2 lg:items-start">
            <nav aria-label="Páginas do site">
              <p className="text-sm font-medium text-white">Navegação</p>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                <li>
                  <a
                    href={content.siteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center py-1 text-sm text-white/66 transition-colors hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href={content.hubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center py-1 text-sm text-white/66 transition-colors hover:text-white"
                  >
                    Hub
                  </a>
                </li>
              </ul>
            </nav>

            <address className="text-sm not-italic leading-6 text-white/72 sm:text-right">
              <p className="font-medium text-white">{content.footerCity}</p>
              <p className="mt-2 text-pretty">{content.footerAddress}</p>
              <a
                href={content.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-white transition-colors hover:text-white/82"
              >
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                Como chegar
                <ArrowRight className="size-3.5" aria-hidden />
              </a>
            </address>
          </div>
        </div>

        <div className="border-t border-white/14">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-4 text-xs text-white/58 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© {year} Grape Clinic. Todos os direitos reservados.</p>
            <p>CNPJ {content.footerCnpj}</p>
            <div className="sm:text-right">
              {content.footerDoctor.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
