"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { trackMetaLead } from "@/components/seo/meta-pixel";
import {
  MAX_SITUACOES,
  availabilityOptions,
  buildWhatsAppHref,
  incomeOptions,
  initialEvaluationAnswers,
  profissaoOptions,
  situationOptions,
  type EvaluationAnswers,
} from "@/content/apresentacao";
import {
  formatBrazilianPhone,
  formatCityName,
  formatPersonName,
  isValidBrazilianPhone,
  normalizeSpaces,
} from "@/lib/form/formatters";
import { cn } from "@/lib/utils";

const steps = [
  {
    eyebrow: "01",
    title: "Identificação",
    description: "Dados básicos para a equipe saber quem deve retornar.",
  },
  {
    eyebrow: "02",
    title: "Seu momento",
    description: "A principal situação e sua disponibilidade para avaliação.",
  },
] as const;

type ContactFieldId = "nome" | "whatsapp" | "cidade";
type FieldErrors = Partial<Record<ContactFieldId, string>>;

function validateContactField(fieldId: ContactFieldId, value: string): string {
  if (fieldId === "nome") {
    return normalizeSpaces(value) ? "" : "Informe seu nome.";
  }
  if (fieldId === "whatsapp") {
    return isValidBrazilianPhone(value)
      ? ""
      : "Informe um WhatsApp válido com DDD.";
  }
  const v = normalizeSpaces(value);
  if (!v) return "Informe sua cidade.";
  if (/\d/.test(v) || !/[a-zA-ZÀ-ÿ]/.test(v)) {
    return "Informe um nome de cidade válido.";
  }
  return "";
}

function getStepValidationError(
  currentStep: number,
  currentAnswers: EvaluationAnswers,
) {
  if (currentStep === 1) {
    if (currentAnswers.situacoes.length === 0) {
      return "Selecione pelo menos uma situação que impacta sua qualidade de vida.";
    }
    if (!currentAnswers.disponibilidade.trim()) {
      return "Informe sua disponibilidade para uma avaliação estratégica.";
    }
    if (!currentAnswers.renda.trim()) {
      return "Selecione sua faixa de renda mensal.";
    }
  }
  return "";
}

const fieldClass =
  "h-12 w-full rounded-lg border border-[color:var(--ap-line)] bg-white px-4 text-[15px] text-[color:var(--ap-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--ap-muted)] focus-visible:border-[color:var(--ap-primary)] focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ap-primary)_18%,transparent)]";

const optionItemClass =
  "flex items-center gap-2.5 bg-white px-3 py-2.5 text-left text-sm text-[color:var(--ap-ink)] hover:bg-[color:var(--ap-cream-2)]";

const fieldErrorClass =
  "border-red-500/70 focus-visible:border-red-500 focus-visible:shadow-[0_0_0_3px_rgb(239_68_68/0.15)]";

type OptionSelectProps = {
  options: readonly string[];
  placeholder: string;
  value: string;
  outroConfirmed: string;
  onSelect: (option: string) => void;
  error?: string;
  labelId: string;
};

function OptionSelect({
  options,
  placeholder,
  value,
  outroConfirmed,
  onSelect,
  error,
  labelId,
}: OptionSelectProps) {
  const [open, setOpen] = useState(false);
  const displayValue =
    value === "Outro" && outroConfirmed ? `Outro: ${outroConfirmed}` : value;

  return (
    <div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          fieldClass,
          "flex items-center justify-between text-left",
          !value && "text-[color:var(--ap-muted)]",
          error && fieldErrorClass,
          open && "rounded-b-none border-b-0",
        )}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <ChevronDown
          className={cn(
            "ml-2 size-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden rounded-b-lg border border-t-0 border-[color:var(--ap-line)] bg-white"
            role="listbox"
            aria-labelledby={labelId}
          >
            <div className="grid max-h-56 grid-cols-1 gap-px overflow-y-auto bg-[color:var(--ap-line)] sm:grid-cols-2">
              {options.map((option) => {
                const isSelected = value === option;
                const label =
                  option === "Outro" && outroConfirmed
                    ? `Outro: ${outroConfirmed}`
                    : option;
                return (
                  <button
                    type="button"
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (option !== "Outro") setOpen(false);
                      onSelect(option);
                    }}
                    className={cn(
                      optionItemClass,
                      isSelected && "font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded border",
                        isSelected
                          ? "border-[color:var(--ap-primary)] bg-[color:var(--ap-primary)] text-white"
                          : "border-[color:var(--ap-line)]",
                      )}
                      aria-hidden
                    >
                      {isSelected ? <Check className="size-2.5" /> : null}
                    </span>
                    <span className="truncate text-[color:var(--ap-ink)]">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type MultiOptionSelectProps = {
  options: readonly string[];
  placeholder: string;
  value: string[];
  max: number;
  outroConfirmed: string;
  onToggle: (option: string) => void;
  error?: string;
  labelId: string;
};

function MultiOptionSelect({
  options,
  placeholder,
  value,
  max,
  outroConfirmed,
  onToggle,
  error,
  labelId,
}: MultiOptionSelectProps) {
  const [open, setOpen] = useState(false);
  const displayValue =
    value.length === 0
      ? ""
      : value.length === 1
        ? value[0] === "Outro" && outroConfirmed
          ? `Outro: ${outroConfirmed}`
          : value[0]
        : `${value.length} selecionadas`;
  const limitReached = value.length >= max;

  return (
    <div>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          fieldClass,
          "flex items-center justify-between text-left",
          !displayValue && "text-[color:var(--ap-muted)]",
          error && fieldErrorClass,
          open && "rounded-b-none border-b-0",
        )}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <ChevronDown
          className={cn(
            "ml-2 size-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden rounded-b-lg border border-t-0 border-[color:var(--ap-line)] bg-white"
            role="listbox"
            aria-multiselectable="true"
            aria-labelledby={labelId}
          >
            <div className="grid max-h-56 grid-cols-1 gap-px overflow-y-auto bg-[color:var(--ap-line)] sm:grid-cols-2">
              {options.map((option) => {
                const isSelected = value.includes(option);
                const isDisabled = !isSelected && limitReached;
                const label =
                  option === "Outro" && outroConfirmed
                    ? `Outro: ${outroConfirmed}`
                    : option;
                return (
                  <button
                    type="button"
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    disabled={isDisabled}
                    onClick={() => onToggle(option)}
                    className={cn(
                      optionItemClass,
                      "disabled:opacity-40",
                      isSelected && "font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded border",
                        isSelected
                          ? "border-[color:var(--ap-primary)] bg-[color:var(--ap-primary)] text-white"
                          : "border-[color:var(--ap-line)]",
                      )}
                      aria-hidden
                    >
                      {isSelected ? <Check className="size-2.5" /> : null}
                    </span>
                    <span className="truncate text-[color:var(--ap-ink)]">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="border-t border-[color:var(--ap-line)] bg-white px-3 py-2 text-xs text-[color:var(--ap-muted)]">
              Selecione até {max} opções.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type OutroDialogProps = {
  open: boolean;
  title: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

function OutroDialog({
  open,
  title,
  description,
  placeholder,
  value,
  onChange,
  onConfirm,
  onClose,
  inputRef,
}: OutroDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="outro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[color:var(--ap-line)] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="outro-dialog-title"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h4
                  id="outro-dialog-title"
                  className="text-base font-semibold text-[color:var(--ap-ink)]"
                >
                  {title}
                </h4>
                <p className="mt-1 text-sm text-[color:var(--ap-muted)]">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="rounded-lg p-1 text-[color:var(--ap-muted)] hover:bg-[color:var(--ap-cream-2)]"
              >
                <X className="size-4" />
              </button>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              maxLength={120}
              className={fieldClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") onConfirm();
                if (e.key === "Escape") onClose();
              }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[color:var(--ap-line)] px-4 py-2 text-sm font-medium text-[color:var(--ap-muted)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={!value.trim()}
                className="rounded-lg bg-[color:var(--ap-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function EvaluationForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedAnswers, setSubmittedAnswers] =
    useState<EvaluationAnswers | null>(null);
  const [answers, setAnswers] = useState<EvaluationAnswers>(
    initialEvaluationAnswers,
  );
  const [citySuggestions, setCitySuggestions] = useState<
    { id: string; label: string }[]
  >([]);
  const visibleCitySuggestions =
    answers.cidade.trim().length >= 2 ? citySuggestions : [];
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [profissaoError, setProfissaoError] = useState("");
  const [situacoesError, setSituacoesError] = useState("");

  const [profissaoOutroDialogOpen, setProfissaoOutroDialogOpen] =
    useState(false);
  const [profissaoOutroDraft, setProfissaoOutroDraft] = useState("");
  const [profissaoOutroConfirmed, setProfissaoOutroConfirmed] = useState("");
  const profissaoOutroInputRef = useRef<HTMLInputElement>(null);

  const [situacaoOutroDialogOpen, setSituacaoOutroDialogOpen] = useState(false);
  const [situacaoOutroDraft, setSituacaoOutroDraft] = useState("");
  const [situacaoOutroConfirmed, setSituacaoOutroConfirmed] = useState("");
  const situacaoOutroInputRef = useRef<HTMLInputElement>(null);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const isLastStep = step === steps.length - 1;
  const current = steps[step];

  useEffect(() => {
    if (!profissaoOutroDialogOpen) return;
    const frame = requestAnimationFrame(() =>
      profissaoOutroInputRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [profissaoOutroDialogOpen]);

  useEffect(() => {
    if (!situacaoOutroDialogOpen) return;
    const frame = requestAnimationFrame(() =>
      situacaoOutroInputRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [situacaoOutroDialogOpen]);

  useEffect(() => {
    const query = answers.cidade.trim();
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/cidades?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) return;
        const data = (await response.json()) as {
          cities?: { id: string; label: string }[];
        };
        setCitySuggestions(data.cities ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setCitySuggestions([]);
      }
    }, 160);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [answers.cidade]);

  function updateField(fieldId: ContactFieldId, value: string) {
    setSubmitError("");
    const formatted =
      fieldId === "whatsapp" ? formatBrazilianPhone(value) : value;
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [fieldId]: formatted,
    }));
    setFieldErrors((prev) => {
      if (prev[fieldId] === undefined) return prev;
      return { ...prev, [fieldId]: validateContactField(fieldId, formatted) };
    });
  }

  function handleBlur(fieldId: ContactFieldId, rawValue: string) {
    if (fieldId === "nome") {
      setAnswers((currentAnswers) => ({
        ...currentAnswers,
        nome: formatPersonName(currentAnswers.nome),
      }));
    }
    if (fieldId === "cidade") {
      setAnswers((currentAnswers) => ({
        ...currentAnswers,
        cidade: formatCityName(currentAnswers.cidade),
      }));
    }
    setFieldErrors((prev) => ({
      ...prev,
      [fieldId]: validateContactField(fieldId, rawValue),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSituacoesError("");

    if (step === 0) {
      const fields: ContactFieldId[] = ["nome", "whatsapp", "cidade"];
      const newErrors: FieldErrors = {};
      let hasErrors = false;

      for (const fieldId of fields) {
        const error = validateContactField(fieldId, answers[fieldId]);
        if (error) {
          newErrors[fieldId] = error;
          hasErrors = true;
        }
      }
      setFieldErrors(newErrors);

      if (!answers.profissao.trim()) {
        setProfissaoError("Selecione sua profissão para continuar.");
        hasErrors = true;
      }

      if (hasErrors) return;
      setStep(1);
      return;
    }

    const validationError = getStepValidationError(step, answers);
    if (validationError) {
      if (answers.situacoes.length === 0) {
        setSituacoesError(validationError);
      }
      setSubmitError(validationError);
      return;
    }

    if (!isLastStep) {
      setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
      return;
    }

    const payloadAnswers: EvaluationAnswers = {
      nome: formatPersonName(answers.nome),
      whatsapp: formatBrazilianPhone(answers.whatsapp),
      cidade: formatCityName(answers.cidade),
      profissao:
        answers.profissao === "Outro" && profissaoOutroConfirmed
          ? profissaoOutroConfirmed
          : answers.profissao,
      situacoes: answers.situacoes.map((s) =>
        s === "Outro" && situacaoOutroConfirmed ? situacaoOutroConfirmed : s,
      ),
      disponibilidade: answers.disponibilidade,
      renda: answers.renda,
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/avaliacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadAnswers),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          data?.message || "Não foi possível enviar suas respostas agora.",
        );
      }

      trackMetaLead();
      setSubmittedAnswers(payloadAnswers);
      setSubmitted(true);

      // Dar tempo do Meta Pixel flushar o Lead antes de sair da página.
      const href = buildWhatsAppHref(payloadAnswers);
      window.setTimeout(() => {
        window.location.assign(href);
      }, 1200);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar suas respostas agora.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted && submittedAnswers) {
    return (
      <div className="rounded-2xl border border-[color:var(--ap-line)] bg-white p-6 text-[color:var(--ap-ink)] sm:p-8">
        <p className="text-sm font-medium text-[color:var(--ap-gold)]">
          Avaliação enviada
        </p>
        <h3 className="mt-3 text-2xl font-medium text-[color:var(--ap-ink)]">
          Recebemos suas respostas.
        </h3>
        <p className="mt-3 text-sm leading-6 text-[color:var(--ap-muted)]">
          Estamos abrindo o WhatsApp da clínica com suas informações para a
          equipe dar continuidade.
        </p>
        <a
          href={buildWhatsAppHref(submittedAnswers)}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[#25D366] px-5 text-sm font-semibold text-white"
        >
          Abrir WhatsApp agora
        </a>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-[color:var(--ap-line)] bg-white p-5 text-[color:var(--ap-ink)] sm:p-7"
        noValidate
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[color:var(--ap-muted)]">
            {current.eyebrow} / 0{steps.length}
          </span>
          <span className="rounded-full border border-[color:var(--ap-line)] px-2.5 py-1 text-xs text-[color:var(--ap-muted)]">
            {Math.round(progress)}%
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-medium text-[color:var(--ap-ink)]">
          {current.title}
        </h3>
        <p className="mt-2 text-sm text-[color:var(--ap-muted)]">
          {current.description}
        </p>
        <div className="mt-5 h-px bg-[color:var(--ap-line)]">
          <div
            className="h-px bg-[color:var(--ap-primary)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 space-y-4">
          {step === 0 ? (
            <>
              {(
                [
                  {
                    id: "nome" as const,
                    label: "Nome",
                    placeholder: "Seu nome",
                    type: "text",
                    autoComplete: "name",
                  },
                  {
                    id: "whatsapp" as const,
                    label: "WhatsApp",
                    placeholder: "(00) 00000-0000",
                    type: "tel",
                    autoComplete: "tel",
                  },
                  {
                    id: "cidade" as const,
                    label: "Cidade",
                    placeholder: "Onde você mora",
                    type: "text",
                    autoComplete: "address-level2",
                  },
                ] as const
              ).map((field) => {
                const error = fieldErrors[field.id];
                return (
                  <div key={field.id}>
                    <label
                      htmlFor={`ap-${field.id}`}
                      className="mb-1.5 block text-sm font-medium text-[color:var(--ap-ink)]"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`ap-${field.id}`}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      inputMode={
                        field.id === "whatsapp" ? "numeric" : undefined
                      }
                      maxLength={field.id === "whatsapp" ? 16 : undefined}
                      list={
                        field.id === "cidade" ? "city-suggestions" : undefined
                      }
                      placeholder={field.placeholder}
                      value={answers[field.id]}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      onBlur={(e) => handleBlur(field.id, e.target.value)}
                      aria-invalid={!!error}
                      className={cn(fieldClass, error && fieldErrorClass)}
                    />
                    {error ? (
                      <p role="alert" className="mt-2 text-xs text-red-600">
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <datalist id="city-suggestions">
                {visibleCitySuggestions.map((city) => (
                  <option key={city.id} value={city.label} />
                ))}
              </datalist>
              <div>
                <label
                  id="ap-profissao-label"
                  className="mb-1.5 block text-sm font-medium text-[color:var(--ap-ink)]"
                >
                  Profissão
                </label>
                <OptionSelect
                  options={profissaoOptions}
                  placeholder="Selecione sua profissão"
                  value={answers.profissao}
                  outroConfirmed={profissaoOutroConfirmed}
                  labelId="ap-profissao-label"
                  error={profissaoError}
                  onSelect={(option) => {
                    setProfissaoError("");
                    if (option === "Outro") {
                      setProfissaoOutroDraft(profissaoOutroConfirmed);
                      setProfissaoOutroDialogOpen(true);
                      setAnswers((currentAnswers) => ({
                        ...currentAnswers,
                        profissao: "Outro",
                      }));
                      return;
                    }
                    setProfissaoOutroConfirmed("");
                    setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      profissao: option,
                    }));
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  id="ap-situacoes-label"
                  className="mb-1.5 block text-sm font-medium text-[color:var(--ap-ink)]"
                >
                  Qual dessas situações mais impacta sua qualidade de vida?{" "}
                  <span className="font-normal text-[color:var(--ap-muted)]">
                    (até {MAX_SITUACOES})
                  </span>
                </label>
                <MultiOptionSelect
                  options={situationOptions}
                  placeholder="Selecione as situações"
                  value={answers.situacoes}
                  max={MAX_SITUACOES}
                  outroConfirmed={situacaoOutroConfirmed}
                  labelId="ap-situacoes-label"
                  error={situacoesError}
                  onToggle={(option) => {
                    setSituacoesError("");
                    setSubmitError("");
                    if (option === "Outro") {
                      const already = answers.situacoes.includes("Outro");
                      if (already) {
                        setSituacaoOutroConfirmed("");
                        setAnswers((currentAnswers) => ({
                          ...currentAnswers,
                          situacoes: currentAnswers.situacoes.filter(
                            (item) => item !== "Outro",
                          ),
                        }));
                        return;
                      }
                      setSituacaoOutroDraft(situacaoOutroConfirmed);
                      setSituacaoOutroDialogOpen(true);
                      setAnswers((currentAnswers) => {
                        if (currentAnswers.situacoes.includes("Outro")) {
                          return currentAnswers;
                        }
                        if (currentAnswers.situacoes.length >= MAX_SITUACOES) {
                          return currentAnswers;
                        }
                        return {
                          ...currentAnswers,
                          situacoes: [...currentAnswers.situacoes, "Outro"],
                        };
                      });
                      return;
                    }

                    setAnswers((currentAnswers) => {
                      if (currentAnswers.situacoes.includes(option)) {
                        return {
                          ...currentAnswers,
                          situacoes: currentAnswers.situacoes.filter(
                            (item) => item !== option,
                          ),
                        };
                      }
                      if (currentAnswers.situacoes.length >= MAX_SITUACOES) {
                        return currentAnswers;
                      }
                      return {
                        ...currentAnswers,
                        situacoes: [...currentAnswers.situacoes, option],
                      };
                    });
                  }}
                />
              </div>

              <div>
                <label
                  id="ap-disponibilidade-label"
                  className="mb-1.5 block text-sm font-medium text-[color:var(--ap-ink)]"
                >
                  Disponibilidade
                </label>
                <p className="mb-2 text-sm text-[color:var(--ap-muted)]">
                  Caso seu perfil seja compatível com nossa metodologia, você
                  teria disponibilidade para uma avaliação estratégica?
                </p>
                <OptionSelect
                  options={availabilityOptions}
                  placeholder="Selecione sua disponibilidade"
                  value={answers.disponibilidade}
                  outroConfirmed=""
                  labelId="ap-disponibilidade-label"
                  onSelect={(option) => {
                    setSubmitError("");
                    setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      disponibilidade: option,
                    }));
                  }}
                />
              </div>

              <div>
                <label
                  id="ap-renda-label"
                  className="mb-1.5 block text-sm font-medium text-[color:var(--ap-ink)]"
                >
                  Pensando na sua saúde e qualidade de vida, qual faixa de
                  investimento faz sentido para você neste momento?
                </label>
                <OptionSelect
                  options={incomeOptions}
                  placeholder="Selecione a faixa de investimento"
                  value={answers.renda}
                  outroConfirmed=""
                  labelId="ap-renda-label"
                  onSelect={(option) => {
                    setSubmitError("");
                    setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      renda: option,
                    }));
                  }}
                />
              </div>
            </>
          )}
        </div>

        {submitError ? (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {submitError}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3 border-t border-[color:var(--ap-line)] pt-5">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setSubmitError("");
                setStep(0);
              }}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-[color:var(--ap-line)] px-5 text-sm font-medium text-[color:var(--ap-muted)]"
            >
              <ChevronLeft className="size-4" aria-hidden />
              Voltar
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="ml-auto inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--ap-cta)] px-6 text-sm font-semibold text-[color:var(--ap-ink)] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden />
                Enviando…
              </>
            ) : isLastStep ? (
              <>
                Enviar respostas
                <Send className="size-4" aria-hidden />
              </>
            ) : (
              <>
                Continuar
                <ChevronRight className="size-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>

      <OutroDialog
        open={profissaoOutroDialogOpen}
        title="Qual é a sua profissão?"
        description="Descreva em poucas palavras."
        placeholder="Ex.: Designer, Contador(a)…"
        value={profissaoOutroDraft}
        onChange={setProfissaoOutroDraft}
        inputRef={profissaoOutroInputRef}
        onClose={() => {
          setProfissaoOutroDialogOpen(false);
          if (!profissaoOutroConfirmed) {
            setAnswers((currentAnswers) => ({
              ...currentAnswers,
              profissao: "",
            }));
          }
        }}
        onConfirm={() => {
          const value = normalizeSpaces(profissaoOutroDraft);
          if (!value) return;
          setProfissaoOutroConfirmed(value);
          setAnswers((currentAnswers) => ({
            ...currentAnswers,
            profissao: "Outro",
          }));
          setProfissaoOutroDialogOpen(false);
        }}
      />

      <OutroDialog
        open={situacaoOutroDialogOpen}
        title="Qual outra situação?"
        description="Descreva o que mais impacta sua qualidade de vida."
        placeholder="Descreva em poucas palavras"
        value={situacaoOutroDraft}
        onChange={setSituacaoOutroDraft}
        inputRef={situacaoOutroInputRef}
        onClose={() => {
          setSituacaoOutroDialogOpen(false);
          if (!situacaoOutroConfirmed) {
            setAnswers((currentAnswers) => ({
              ...currentAnswers,
              situacoes: currentAnswers.situacoes.filter(
                (item) => item !== "Outro",
              ),
            }));
          }
        }}
        onConfirm={() => {
          const value = normalizeSpaces(situacaoOutroDraft);
          if (!value) return;
          setSituacaoOutroConfirmed(value);
          setSituacaoOutroDialogOpen(false);
        }}
      />
    </>
  );
}
