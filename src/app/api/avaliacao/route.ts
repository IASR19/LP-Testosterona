import { NextResponse } from "next/server";

const GRAPEGEST_URL = "https://www.grapegest.com.br/api/webhooks/leads";
const SOURCE = "lp-grapeclinic";

type EvaluationLeadPayload = {
  nome?: unknown;
  whatsapp?: unknown;
  cidade?: unknown;
  profissao?: unknown;
  renda?: unknown;
  situacoes?: unknown;
  disponibilidade?: unknown;
};

const requiredStringFields = [
  "nome",
  "whatsapp",
  "cidade",
  "disponibilidade",
  "renda",
] as const;

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function validatePayload(payload: EvaluationLeadPayload) {
  const missing: string[] = requiredStringFields.filter(
    (field) => !isFilledString(payload[field]),
  );
  const hasSituation =
    Array.isArray(payload.situacoes) &&
    payload.situacoes.some((item) => isFilledString(item));

  if (!hasSituation) {
    missing.push("situacoes");
  }

  return missing;
}

export async function POST(request: Request) {
  let payload: EvaluationLeadPayload;

  try {
    payload = (await request.json()) as EvaluationLeadPayload;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível ler os dados do formulário." },
      { status: 400 },
    );
  }

  const missing = validatePayload(payload);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        message: "Preencha todos os campos antes de enviar.",
        missing,
      },
      { status: 400 },
    );
  }

  const token = process.env.GRAPEGEST_TOKEN;

  if (!token) {
    console.error("[avaliacao] GRAPEGEST_TOKEN não configurado.");
    return NextResponse.json(
      {
        message:
          "Serviço de leads não configurado. Tente novamente mais tarde.",
      },
      { status: 503 },
    );
  }

  const situacoes = Array.isArray(payload.situacoes)
    ? (payload.situacoes as string[]).filter(isFilledString)
    : [];

  const grapegestPayload: Record<string, string> = {
    name: (payload.nome as string).trim(),
    phone: digitsOnly((payload.whatsapp as string).trim()),
    localizacao: (payload.cidade as string).trim(),
    dor_principal: situacoes.join(", "),
    disponibilidade: (payload.disponibilidade as string).trim(),
    valor_disposto: (payload.renda as string).trim(),
    source: SOURCE,
  };

  if (isFilledString(payload.profissao)) {
    grapegestPayload.profissao = payload.profissao.trim();
  }

  try {
    const response = await fetch(GRAPEGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(grapegestPayload),
    });

    if (response.status === 401) {
      console.error("[avaliacao] Token do GrapeGest inválido.");
      return NextResponse.json(
        {
          message:
            "Não foi possível registrar sua avaliação agora. Tente novamente.",
        },
        { status: 502 },
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[avaliacao] GrapeGest retornou ${response.status}: ${body}`,
      );
      return NextResponse.json(
        {
          message:
            "Não foi possível registrar sua avaliação agora. Tente novamente.",
        },
        { status: 502 },
      );
    }

    const result = (await response.json().catch(() => null)) as {
      success?: boolean;
      duplicate?: boolean;
      leadId?: string;
    } | null;

    console.info("[avaliacao] GrapeGest ok", {
      source: SOURCE,
      leadId: result?.leadId,
      duplicate: result?.duplicate ?? false,
    });

    return NextResponse.json({
      message: "Avaliação recebida com sucesso.",
      duplicate: result?.duplicate ?? false,
    });
  } catch (error) {
    console.error("[avaliacao] Erro ao contatar GrapeGest:", error);
    return NextResponse.json(
      {
        message:
          "Não foi possível registrar sua avaliação agora. Tente novamente.",
      },
      { status: 502 },
    );
  }
}
