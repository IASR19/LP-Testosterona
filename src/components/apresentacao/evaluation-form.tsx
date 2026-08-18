"use client";

import { Check, LoaderCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { trackMetaLead } from "@/components/seo/meta-pixel";
import { saveApresentacaoLead } from "@/content/apresentacao/lead-storage";
import { readUtmsFromWindow } from "@/lib/utm";
import {
  MAX_SITUACOES,
  buildWhatsAppHref,
  incomeOptions,
  incomeQuestion,
  initialEvaluationAnswers,
  profissaoOptions,
  situationOptions,
  type EvaluationAnswers,
} from "@/content/apresentacao";
import { PhoneInput } from "@/components/form/phone-input";
import {
  BRAZIL_PHONE_PLACEHOLDER,
  brazilianPhoneValidationError,
  formatBrazilianPhone,
  formatCityName,
  formatPersonName,
  normalizeSpaces,
} from "@/lib/form/formatters";
import { cn } from "@/lib/utils";

type ContactFieldId = "nome" | "whatsapp" | "cidade";
type FieldErrors = Partial<Record<ContactFieldId, string>>;

function validateContactField(fieldId: ContactFieldId, value: string): string {
  if (fieldId === "nome") {
    return normalizeSpaces(value) ? "" : "Informe seu nome.";
  }
  if (fieldId === "whatsapp") {
    return brazilianPhoneValidationError(value) ?? "";
  }
  const v = normalizeSpaces(value);
  if (!v) return "Informe sua cidade.";
  if (/\d/.test(v) || !/[a-zA-ZÀ-ÿ]/.test(v)) {
    return "Informe um nome de cidade válido.";
  }
  return "";
}

const fieldClass =
  "h-12 w-full rounded-lg border border-[color:var(--ap-line)] bg-white px-4 text-[15px] text-[color:var(--ap-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--ap-muted)] focus-visible:border-[color:var(--ap-primary)] focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ap-primary)_18%,transparent)]";

const fieldErrorClass =
  "border-red-500/70 focus-visible:border-red-500 focus-visible:shadow-[0_0_0_3px_rgb(239_68_68/0.15)]";

const chipClass =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-left text-[13px] leading-tight transition-colors disabled:opacity-40";

type ChipProps = {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function Chip({ selected, disabled, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        chipClass,
        selected
          ? "border-[color:var(--ap-primary)] bg-[color:var(--ap-primary)] text-white"
          : "border-[color:var(--ap-line)] bg-white text-[color:var(--ap-ink)] hover:bg-[color:var(--ap-cream-2)]",
      )}
    >
      {selected ? <Check className="size-3 shrink-0" aria-hidden /> : null}
      {children}
    </button>
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
  const [situacoesError, setSituacoesError] = useState("");
  const [rendaError, setRendaError] = useState("");

  const [profissaoOutroDialogOpen, setProfissaoOutroDialogOpen] =
    useState(false);
  const [profissaoOutroDraft, setProfissaoOutroDraft] = useState("");
  const [profissaoOutroConfirmed, setProfissaoOutroConfirmed] = useState("");
  const profissaoOutroInputRef = useRef<HTMLInputElement>(null);

  const [situacaoOutroDialogOpen, setSituacaoOutroDialogOpen] = useState(false);
  const [situacaoOutroDraft, setSituacaoOutroDraft] = useState("");
  const [situacaoOutroConfirmed, setSituacaoOutroConfirmed] = useState("");
  const situacaoOutroInputRef = useRef<HTMLInputElement>(null);

  const progress = useMemo(() => {
    const checks = [
      !validateContactField("nome", answers.nome),
      !validateContactField("whatsapp", answers.whatsapp),
      !validateContactField("cidade", answers.cidade),
      answers.situacoes.length > 0,
      Boolean(answers.renda.trim()),
    ];
    return (checks.filter(Boolean).length / checks.length) * 100;
  }, [answers]);

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
    if (query.length < 2) return;

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

  function toggleSituacao(option: string) {
    setSituacoesError("");
    setSubmitError("");
    if (option === "Outro") {
      const already = answers.situacoes.includes("Outro");
      if (already) {
        setSituacaoOutroConfirmed("");
        setAnswers((currentAnswers) => ({
          ...currentAnswers,
          situacoes: currentAnswers.situacoes.filter((item) => item !== "Outro"),
        }));
        return;
      }
      setSituacaoOutroDraft(situacaoOutroConfirmed);
      setSituacaoOutroDialogOpen(true);
      setAnswers((currentAnswers) => {
        if (currentAnswers.situacoes.includes("Outro")) return currentAnswers;
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
          situacoes: currentAnswers.situacoes.filter((item) => item !== option),
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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSituacoesError("");
    setRendaError("");

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

    if (answers.situacoes.length === 0) {
      setSituacoesError(
        "Selecione pelo menos uma situação que impacta sua qualidade de vida.",
      );
      hasErrors = true;
    }

    if (!answers.renda.trim()) {
      setRendaError("Selecione o valor mensal que faria sentido para você.");
      hasErrors = true;
    }

    if (hasErrors) {
      setSubmitError("Preencha os campos obrigatórios para enviar.");
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
      renda: answers.renda,
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/avaliacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payloadAnswers,
          ...readUtmsFromWindow(),
        }),
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
      saveApresentacaoLead({
        name: payloadAnswers.nome,
        phone: payloadAnswers.whatsapp,
        profession: payloadAnswers.profissao,
        symptom: payloadAnswers.situacoes.join(", "),
      });
      setSubmittedAnswers(payloadAnswers);
      setSubmitted(true);

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
            Avaliação
          </span>
          <span className="rounded-full border border-[color:var(--ap-line)] px-2.5 py-1 text-xs text-[color:var(--ap-muted)]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-4 h-px bg-[color:var(--ap-line)]">
          <div
            className="h-px bg-[color:var(--ap-primary)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="mt-6">
          <h3 className="text-lg font-medium text-[color:var(--ap-ink)]">
            Seus dados
          </h3>
          <p className="mt-1 text-sm text-[color:var(--ap-muted)]">
            Dados básicos para a equipe saber quem deve retornar.
          </p>

          <div className="mt-4 space-y-4">
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
                  placeholder: BRAZIL_PHONE_PLACEHOLDER,
                  type: "tel",
                  autoComplete: "tel-national",
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
                    {field.id === "whatsapp" ? (
                      <span className="ml-1.5 font-normal text-[color:var(--ap-muted)]">
                        · Brasil +55 já selecionado
                      </span>
                    ) : null}
                  </label>
                  {field.id === "whatsapp" ? (
                    <PhoneInput
                      id={`ap-${field.id}`}
                      value={answers.whatsapp}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      aria-invalid={!!error}
                      onChange={(value) => updateField("whatsapp", value)}
                      onBlur={(e) => handleBlur("whatsapp", e.target.value)}
                      className={cn(
                        fieldClass,
                        "px-0 focus-within:border-[color:var(--ap-primary)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ap-primary)_18%,transparent)]",
                        error &&
                          "border-red-500/70 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgb(239_68_68/0.15)]",
                      )}
                      inputClassName="placeholder:text-[color:var(--ap-muted)] text-[color:var(--ap-ink)]"
                    />
                  ) : (
                    <input
                      id={`ap-${field.id}`}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      list={field.id === "cidade" ? "city-suggestions" : undefined}
                      placeholder={field.placeholder}
                      value={answers[field.id]}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      onBlur={(e) => handleBlur(field.id, e.target.value)}
                      aria-invalid={!!error}
                      className={cn(fieldClass, error && fieldErrorClass)}
                    />
                  )}
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
              <p
                id="ap-profissao-label"
                className="mb-2 text-sm font-medium text-[color:var(--ap-ink)]"
              >
                Profissão{" "}
                <span className="font-normal text-[color:var(--ap-muted)]">
                  (opcional)
                </span>
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-labelledby="ap-profissao-label"
              >
                {profissaoOptions.map((option) => {
                  const selected = answers.profissao === option;
                  const label =
                    option === "Outro" && profissaoOutroConfirmed
                      ? `Outro: ${profissaoOutroConfirmed}`
                      : option;
                  return (
                    <Chip
                      key={option}
                      selected={selected}
                      onClick={() => {
                        if (option === "Outro") {
                          if (selected) {
                            setProfissaoOutroConfirmed("");
                            setAnswers((current) => ({
                              ...current,
                              profissao: "",
                            }));
                            return;
                          }
                          setProfissaoOutroDraft(profissaoOutroConfirmed);
                          setProfissaoOutroDialogOpen(true);
                          setAnswers((current) => ({
                            ...current,
                            profissao: "Outro",
                          }));
                          return;
                        }
                        setProfissaoOutroConfirmed("");
                        setAnswers((current) => ({
                          ...current,
                          profissao: current.profissao === option ? "" : option,
                        }));
                      }}
                    >
                      {label}
                    </Chip>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 border-t border-[color:var(--ap-line)] pt-6">
          <h3 className="text-lg font-medium text-[color:var(--ap-ink)]">
            Seu momento
          </h3>
          <p className="mt-1 text-sm text-[color:var(--ap-muted)]">
            A principal situação e o investimento mensal que faz sentido agora.
          </p>

          <div className="mt-4 space-y-5">
            <div>
              <p
                id="ap-situacoes-label"
                className="mb-2 text-sm font-medium text-[color:var(--ap-ink)]"
              >
                Qual dessas situações mais impacta sua qualidade de vida?{" "}
                <span className="font-normal text-[color:var(--ap-muted)]">
                  (até {MAX_SITUACOES})
                </span>
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-labelledby="ap-situacoes-label"
              >
                {situationOptions.map((option) => {
                  const selected = answers.situacoes.includes(option);
                  const label =
                    option === "Outro" && situacaoOutroConfirmed
                      ? `Outro: ${situacaoOutroConfirmed}`
                      : option;
                  return (
                    <Chip
                      key={option}
                      selected={selected}
                      disabled={
                        !selected && answers.situacoes.length >= MAX_SITUACOES
                      }
                      onClick={() => toggleSituacao(option)}
                    >
                      {label}
                    </Chip>
                  );
                })}
              </div>
              {situacoesError ? (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {situacoesError}
                </p>
              ) : null}
            </div>

            <div>
              <p
                id="ap-renda-label"
                className="mb-2 text-sm font-medium text-[color:var(--ap-ink)]"
              >
                {incomeQuestion}
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-labelledby="ap-renda-label"
              >
                {incomeOptions.map((option) => (
                  <Chip
                    key={option}
                    selected={answers.renda === option}
                    onClick={() => {
                      setRendaError("");
                      setSubmitError("");
                      setAnswers((current) => ({
                        ...current,
                        renda: current.renda === option ? "" : option,
                      }));
                    }}
                  >
                    {option}
                  </Chip>
                ))}
              </div>
              {rendaError ? (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {rendaError}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {submitError ? (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {submitError}
          </p>
        ) : null}

        <div className="mt-6 flex items-center border-t border-[color:var(--ap-line)] pt-5">
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
            ) : (
              <>
                Enviar respostas
                <Send className="size-4" aria-hidden />
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
