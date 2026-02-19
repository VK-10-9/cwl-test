import { z } from "zod";

// ─── Document Types ──────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  "nda",
  "mou",
  "request-letter",
  "internship-cert",
  "sponsorship-letter",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  nda: "Non-Disclosure Agreement",
  mou: "Memorandum of Understanding",
  "request-letter": "Official Request Letter",
  "internship-cert": "Internship Certificate",
  "sponsorship-letter": "Sponsorship Letter",
};

export const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  nda: "Protect confidential information shared between parties with a legally binding agreement.",
  mou: "Establish a formal understanding between organisations outlining shared objectives and responsibilities.",
  "request-letter": "Draft a professional request letter for official purposes with proper formatting.",
  "internship-cert": "Generate a formal internship completion certificate with all required details.",
  "sponsorship-letter": "Create a compelling sponsorship request or confirmation letter.",
};

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  nda: "🔒",
  mou: "🤝",
  "request-letter": "📝",
  "internship-cert": "🎓",
  "sponsorship-letter": "💼",
};

// ─── Blueprint Types ─────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high";

export interface BlueprintClause {
  id: string;
  title: string;
  description: string;
  content?: string;
  included: boolean;
  risk: RiskLevel;
}

export interface Blueprint {
  title?: string;
  documentType: DocumentType;
  clauses: BlueprintClause[];
  summary: string;
}

// ─── Organisation Types ──────────────────────────────────────────────────────

export interface OrganisationData {
  id?: string;
  name: string;
  address?: string;
  jurisdiction?: string;
  signatoryName?: string;
}

// ─── Document Status ─────────────────────────────────────────────────────────

export type DocumentStatus = "draft" | "approved" | "exported";

// ─── Workflow Stage ──────────────────────────────────────────────────────────

export type WorkflowStage =
  | "select"
  | "form"
  | "blueprint"
  | "iteration"
  | "preview"
  | "export";

// ─── Form Field Types ────────────────────────────────────────────────────────

export type FieldType = "text" | "textarea" | "select" | "date" | "number" | "checkbox";

export interface FormFieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface DocumentTemplate {
  type: DocumentType;
  label: string;
  description: string;
  isTwoParty: boolean;
  fields: FormFieldDefinition[];
  defaultClauses: string[];
}

// ─── API Types ───────────────────────────────────────────────────────────────

export interface GenerateRequest {
  documentType: DocumentType;
  orgA: OrganisationData;
  orgB?: OrganisationData;
  formData: Record<string, string | number | boolean>;
}

export interface GenerateResponse {
  documentId: string;
  blueprint: Blueprint;
}

export interface IterateRequest {
  documentId: string;
  message: string;
}

export interface IterateResponse {
  blueprint: Blueprint;
  aiMessage: string;
}

export interface ExportRequest {
  documentId: string;
  format: "pdf" | "docx";
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const organisationSchema = z.object({
  name: z.string().min(1, "Organisation name is required"),
  address: z.string().optional(),
  jurisdiction: z.string().optional(),
  signatoryName: z.string().optional(),
});

export const generateRequestSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES),
  orgA: organisationSchema,
  orgB: organisationSchema.optional(),
  formData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export const blueprintClauseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  included: z.boolean(),
  risk: z.enum(["low", "medium", "high"]),
});

export const blueprintSchema = z.object({
  title: z.string().optional(),
  documentType: z.enum(DOCUMENT_TYPES),
  clauses: z.array(blueprintClauseSchema),
  summary: z.string(),
});

export const iterateRequestSchema = z.object({
  blueprint: blueprintSchema,
  message: z.string().min(1, "Message is required"),
});

export const exportRequestSchema = z.object({
  blueprint: blueprintSchema,
  formData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  fullText: z.string().optional(),
  format: z.enum(["pdf", "docx"]),
});

export const previewSchema = z.object({
  blueprint: blueprintSchema,
  formData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});
