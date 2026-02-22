const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

const USERS_TABLE = process.env.SUPABASE_USERS_TABLE || "app_users";
const REPORTS_TABLE = process.env.SUPABASE_REPORTS_TABLE || "generated_reports";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

interface SupabaseErrorPayload {
  message?: string;
  error?: string;
  details?: string;
}

interface UserProfileUpsert {
  name: string;
  email: string;
  picture?: string;
}

interface ReportCreateInput {
  userEmail?: string;
  documentType: string;
  reportTitle?: string;
  status: string;
  clauseCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  formData?: Record<string, string | number | boolean>;
  blueprint?: JsonValue;
}

interface ReportUpdateInput {
  status?: string;
  exportFormat?: "pdf" | "docx";
  fullText?: string;
  exportedAt?: string;
}

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

function requireConfig() {
  if (!isConfigured()) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
}

async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  requireConfig();

  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let payload: SupabaseErrorPayload = {};
    try {
      payload = (await res.json()) as SupabaseErrorPayload;
    } catch {
      // ignore JSON parsing errors and fall back to status text
    }
    const detail = payload.message || payload.error || payload.details || res.statusText;
    throw new Error(`Supabase request failed (${res.status}): ${detail}`);
  }

  // Supabase can return empty body for updates
  const text = await res.text();
  if (!text) return [] as T;
  return JSON.parse(text) as T;
}

export function isSupabaseConfigured(): boolean {
  return isConfigured();
}

export async function upsertUserProfile(user: UserProfileUpsert): Promise<void> {
  await supabaseFetch(
    `/rest/v1/${USERS_TABLE}?on_conflict=email`,
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        picture: user.picture || "",
        last_login: new Date().toISOString(),
      }),
    }
  );
}

export async function listUserProfiles(): Promise<
  Array<{
    name: string;
    email: string;
    picture: string;
    last_login: string;
    created_at: string;
  }>
> {
  return supabaseFetch(
    `/rest/v1/${USERS_TABLE}?select=name,email,picture,last_login,created_at&order=last_login.desc`,
    { method: "GET" }
  );
}

export async function createGeneratedReport(input: ReportCreateInput): Promise<string | null> {
  const rows = await supabaseFetch<Array<{ id: string }>>(
    `/rest/v1/${REPORTS_TABLE}?select=id`,
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_email: input.userEmail || null,
        document_type: input.documentType,
        report_title: input.reportTitle || null,
        status: input.status,
        clause_count: input.clauseCount,
        high_risk_count: input.highRiskCount,
        medium_risk_count: input.mediumRiskCount,
        low_risk_count: input.lowRiskCount,
        form_data: input.formData || {},
        blueprint: input.blueprint || null,
      }),
    }
  );

  return rows[0]?.id || null;
}

export async function updateGeneratedReport(
  reportId: string,
  input: ReportUpdateInput
): Promise<void> {
  await supabaseFetch(
    `/rest/v1/${REPORTS_TABLE}?id=eq.${encodeURIComponent(reportId)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.exportFormat !== undefined ? { export_format: input.exportFormat } : {}),
        ...(input.fullText !== undefined ? { full_text: input.fullText } : {}),
        ...(input.exportedAt !== undefined ? { exported_at: input.exportedAt } : {}),
      }),
    }
  );
}

export async function listGeneratedReports(userEmail?: string): Promise<
  Array<{
    id: string;
    user_email: string | null;
    document_type: string;
    report_title: string | null;
    status: string;
    export_format: string | null;
    clause_count: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    created_at: string;
    exported_at: string | null;
  }>
> {
  const emailFilter = userEmail ? `&user_email=eq.${encodeURIComponent(userEmail)}` : "";
  return supabaseFetch(
    `/rest/v1/${REPORTS_TABLE}?select=id,user_email,document_type,report_title,status,export_format,clause_count,high_risk_count,medium_risk_count,low_risk_count,created_at,exported_at&order=created_at.desc${emailFilter}`,
    { method: "GET" }
  );
}

