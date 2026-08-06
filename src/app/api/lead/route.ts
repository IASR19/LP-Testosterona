import { NextResponse } from "next/server";

const GRAPEGEST_URL = "https://www.grapegest.com.br/api/webhooks/leads";

const CAMPAIGN_SOURCES = {
  testosterona: "lp-testosterona",
  endometriose: "lp-endometriose",
} as const;

type CampaignSlug = keyof typeof CAMPAIGN_SOURCES;

type LeadPayload = {
  campaign?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  profession?: unknown;
  diagnosis?: unknown;
  symptom?: unknown;
  wantsConsultation?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  utm_id?: unknown;
};

const requiredStringFields = ["name", "phone", "email"] as const;

const optionalUtmFields = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCampaignSlug(value: unknown): value is CampaignSlug {
  return value === "testosterona" || value === "endometriose";
}

function validatePayload(payload: LeadPayload) {
  const missing: string[] = [];

  if (!isCampaignSlug(payload.campaign)) {
    missing.push("campaign");
  }

  for (const field of requiredStringFields) {
    if (!isFilledString(payload[field])) {
      missing.push(field);
    }
  }

  return missing;
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
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
    console.error("[lead] GRAPEGEST_TOKEN não configurado.");
    return NextResponse.json(
      {
        message:
          "Serviço de leads não configurado. Tente novamente mais tarde.",
      },
      { status: 503 },
    );
  }

  const campaign = payload.campaign as CampaignSlug;

  const grapegestPayload: Record<string, string> = {
    name: (payload.name as string).trim(),
    phone: (payload.phone as string).trim(),
    email: (payload.email as string).trim(),
    source: CAMPAIGN_SOURCES[campaign],
  };

  if (isFilledString(payload.profession)) {
    grapegestPayload.profissao = payload.profession.trim();
  }

  if (isFilledString(payload.symptom)) {
    grapegestPayload.dor_principal = payload.symptom.trim();
  }

  if (isFilledString(payload.wantsConsultation)) {
    grapegestPayload.pagaria_consulta = payload.wantsConsultation.trim();
  }

  if (isFilledString(payload.diagnosis)) {
    grapegestPayload.diagnosis = payload.diagnosis.trim();
  }

  for (const field of optionalUtmFields) {
    if (isFilledString(payload[field])) {
      grapegestPayload[field] = payload[field].trim();
    }
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
      console.error("[lead] Token do GrapeGest inválido.");
      return NextResponse.json(
        {
          message:
            "Não foi possível registrar seu lead agora. Tente novamente.",
        },
        { status: 502 },
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[lead] GrapeGest retornou ${response.status}: ${body}`);
      return NextResponse.json(
        {
          message:
            "Não foi possível registrar seu lead agora. Tente novamente.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Lead recebido com sucesso." });
  } catch (error) {
    console.error("[lead] Erro ao contatar GrapeGest:", error);
    return NextResponse.json(
      {
        message: "Não foi possível registrar seu lead agora. Tente novamente.",
      },
      { status: 502 },
    );
  }
}
