import { z } from "zod";

// ─── Document Types ──────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  // Contracts
  "nda",
  "mou",
  "consultancy-agreement",
  "service-agreement",
  // Hiring & HR
  "offer-letter",
  "appointment-letter",
  "relieving-letter",
  "termination-letter",
  "experience-letter",
  "internship-letter",
  // Finance & Banking
  "payment-reminder",
  "esop-grant",
  "share-allotment",
  // Legal Protection
  "legal-notice",
  "breach-notice",
  "ip-assignment",
  // Partnerships
  "loi",
  "vendor-onboarding",
  "co-founder-agreement",
  // Compliance
  "startup-india",
  "gst-bank-letter",
  "board-resolution",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// ─── Category System ─────────────────────────────────────────────────────────

export interface DocumentCategory {
  key: string;
  label: string;
  description: string;
  types: DocumentType[];
}

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    key: "contracts",
    label: "Contracts",
    description: "Core agreements that protect your startup.",
    types: ["nda", "mou", "consultancy-agreement", "service-agreement"],
  },
  {
    key: "hiring-hr",
    label: "Hiring & HR",
    description: "Everything from offer to exit — compliant with Indian labour law.",
    types: ["offer-letter", "appointment-letter", "relieving-letter", "termination-letter", "experience-letter", "internship-letter"],
  },
  {
    key: "finance-banking",
    label: "Finance & Banking",
    description: "Payment follow-ups, ESOP grants, and share allotments.",
    types: ["payment-reminder", "esop-grant", "share-allotment"],
  },
  {
    key: "legal-protection",
    label: "Legal Protection",
    description: "Formal notices and IP protection when things go wrong.",
    types: ["legal-notice", "breach-notice", "ip-assignment"],
  },
  {
    key: "partnerships",
    label: "Partnerships",
    description: "Co-founder pacts, vendor deals, and letters of intent.",
    types: ["loi", "vendor-onboarding", "co-founder-agreement"],
  },
  {
    key: "compliance",
    label: "Compliance",
    description: "Board resolutions, Startup India, GST & bank letters.",
    types: ["startup-india", "gst-bank-letter", "board-resolution"],
  },
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  nda: "Non-Disclosure Agreement",
  mou: "Memorandum of Understanding",
  "consultancy-agreement": "Consultancy Agreement",
  "service-agreement": "Service Agreement",
  "offer-letter": "Offer Letter",
  "appointment-letter": "Appointment Letter",
  "relieving-letter": "Relieving Letter",
  "termination-letter": "Termination Letter",
  "experience-letter": "Experience Letter",
  "internship-letter": "Internship Offer Letter",
  "payment-reminder": "Payment Reminder",
  "esop-grant": "ESOP Grant Letter",
  "share-allotment": "Share Allotment Letter",
  "legal-notice": "Legal Notice",
  "breach-notice": "Breach Notice",
  "ip-assignment": "IP Assignment Agreement",
  loi: "Letter of Intent",
  "vendor-onboarding": "Vendor Onboarding Letter",
  "co-founder-agreement": "Co-Founder Agreement",
  "startup-india": "Startup India Letter",
  "gst-bank-letter": "GST / Bank Letter",
  "board-resolution": "Board Resolution",
};

export const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  nda: "Protect trade secrets, client data, and proprietary information with India-compliant confidentiality clauses.",
  mou: "Formalise joint ventures, partnerships, and collaborations with clearly defined responsibilities and exit terms.",
  "consultancy-agreement": "Engage freelancers and consultants with clear scope, IP ownership, payment terms, and TDS compliance.",
  "service-agreement": "Define SaaS or service terms with SLAs, liability caps, data handling, and payment schedules.",
  "offer-letter": "Send a professional job offer with compensation, role details, and joining conditions — ready to sign.",
  "appointment-letter": "Issue a legally compliant appointment letter covering CTC, probation, notice period, and company policies.",
  "relieving-letter": "Generate a clean relieving letter confirming an employee's exit, tenure, and clearance status.",
  "termination-letter": "Issue a compliant termination letter citing grounds, notice period, and final settlement details.",
  "experience-letter": "Provide a professional experience certificate detailing role, responsibilities, and tenure.",
  "internship-letter": "Offer a startup internship with stipend, project scope, mentor details, and PPO eligibility.",
  "payment-reminder": "Send a firm but professional payment follow-up referencing invoice, amount, and due date.",
  "esop-grant": "Draft an ESOP grant letter with vesting schedule, cliff period, exercise price, and exit terms.",
  "share-allotment": "Issue a board-resolution-ready share allotment letter for founders, investors, or ESOP holders.",
  "legal-notice": "Send a formal legal notice under Section 80 CPC or general civil/commercial disputes.",
  "breach-notice": "Notify a party of contract breach with cure period, consequences, and legal references.",
  "ip-assignment": "Transfer intellectual property ownership from founders, employees, or contractors to the company.",
  loi: "Express intent for a deal, partnership, or investment with key terms and a binding/non-binding framework.",
  "vendor-onboarding": "Formalise a vendor engagement with scope, payment terms, SLAs, and compliance requirements.",
  "co-founder-agreement": "Define equity split, vesting, roles, IP ownership, and exit terms between co-founders.",
  "startup-india": "Draft a Startup India recognition application letter or DPIIT correspondence.",
  "gst-bank-letter": "Generate a letter for GST registration, current account opening, or bank-related compliance.",
  "board-resolution": "Draft a board resolution for funding rounds, ESOP pools, bank accounts, or corporate actions.",
};

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  nda: "🔒",
  mou: "🤝",
  "consultancy-agreement": "💼",
  "service-agreement": "📄",
  "offer-letter": "📨",
  "appointment-letter": "📋",
  "relieving-letter": "👋",
  "termination-letter": "✋",
  "experience-letter": "🏅",
  "internship-letter": "🎓",
  "payment-reminder": "💸",
  "esop-grant": "📈",
  "share-allotment": "🧾",
  "legal-notice": "⚖️",
  "breach-notice": "🚨",
  "ip-assignment": "🧠",
  loi: "📜",
  "vendor-onboarding": "🏪",
  "co-founder-agreement": "👥",
  "startup-india": "🇮🇳",
  "gst-bank-letter": "🏦",
  "board-resolution": "📝",
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
  userEmail: z.string().email().optional(),
  formData: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]).catch("")
  ),
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
  formData: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]).catch("")
  ),
  reportId: z.string().optional(),
  userEmail: z.string().email().optional(),
  fullText: z.string().optional(),
  format: z.enum(["pdf", "docx"]),
});

export const previewSchema = z.object({
  blueprint: blueprintSchema,
  formData: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]).catch("")
  ),
});

// ─── Agent Types ─────────────────────────────────────────────────────────────

export type AgentTaskStatus = "completed" | "in-progress" | "pending" | "failed";

export interface AgentSubtask {
  id: string;
  title: string;
  description: string;
  status: AgentTaskStatus;
  tools?: string[];
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: AgentTaskStatus;
  subtasks: AgentSubtask[];
}

/** Structured sections parsed from agentic AI responses */
export type AgentMessageSection =
  | { type: "thinking"; content: string }
  | { type: "tool_call"; tool: string; input: string; result?: string }
  | { type: "analysis"; content: string }
  | { type: "text"; content: string }
  | { type: "blueprint_update"; clauses: BlueprintClause[]; message: string };
