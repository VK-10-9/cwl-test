import { z } from "zod";

// ─── Document Types ──────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  // Contracts
  "nda",
  "mou",
  "consultancy-agreement",
  "service-agreement",
  "saas-agreement",
  "software-license",
  "white-label-agreement",
  "maintenance-agreement",

  // Hiring & HR
  "offer-letter",
  "appointment-letter",
  "relieving-letter",
  "termination-letter",
  "experience-letter",
  "internship-letter",
  "posh-policy",
  "ethics-code",
  "fnf-settlement",

  // Fundraising & Equity
  "payment-reminder",
  "esop-grant",
  "share-allotment",
  "isafe-note",
  "sha",
  "term-sheet",
  "founders-deed",

  // Marketing & Partnerships
  "loi",
  "vendor-onboarding",
  "co-founder-agreement",
  "influencer-agreement",
  "affiliate-agreement",
  "sponsorship-agreement",

  // Real Estate
  "rent-agreement",
  "commercial-lease",
  "leave-license",
  "eviction-notice",

  // Compliance & Legal
  "startup-india",
  "gst-bank-letter",
  "board-resolution",
  "legal-notice",
  "breach-notice",
  "ip-assignment",
  "gpa",
  "data-breach-notice",
  "section-138-notice",
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
    label: "Contracts & IT",
    description: "Core agreements and technology licenses.",
    types: ["nda", "mou", "consultancy-agreement", "service-agreement", "saas-agreement", "software-license", "white-label-agreement", "maintenance-agreement"],
  },
  {
    key: "hiring-hr",
    label: "Hiring & HR",
    description: "Offer to exit, including compliance and settlement.",
    types: ["offer-letter", "appointment-letter", "relieving-letter", "termination-letter", "experience-letter", "internship-letter", "posh-policy", "ethics-code", "fnf-settlement"],
  },
  {
    key: "fundraising",
    label: "Fundraising & Equity",
    description: "iSAFE, SHA, and equity management.",
    types: ["isafe-note", "sha", "term-sheet", "founders-deed", "esop-grant", "share-allotment"],
  },
  {
    key: "marketing",
    label: "Marketing & Sales",
    description: "Influencer, affiliate, and sponsorship deals.",
    types: ["influencer-agreement", "affiliate-agreement", "sponsorship-agreement", "vendor-onboarding", "loi"],
  },
  {
    key: "real-estate",
    label: "Real Estate",
    description: "Rent, lease, and eviction notices.",
    types: ["rent-agreement", "commercial-lease", "leave-license", "eviction-notice"],
  },
  {
    key: "compliance",
    label: "Compliance & Legal",
    description: "Notices, GPA, and regulatory filings.",
    types: ["startup-india", "gst-bank-letter", "board-resolution", "legal-notice", "breach-notice", "ip-assignment", "gpa", "data-breach-notice", "section-138-notice", "payment-reminder"],
  },
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  nda: "Non-Disclosure Agreement",
  mou: "Memorandum of Understanding",
  "consultancy-agreement": "Consultancy Agreement",
  "service-agreement": "Service Agreement",
  "saas-agreement": "SaaS Subscription Agreement",
  "software-license": "Software Licensing Agreement",
  "white-label-agreement": "White-Label Agreement",
  "maintenance-agreement": "AMC / Maintenance Agreement",
  "offer-letter": "Offer Letter",
  "appointment-letter": "Appointment Letter",
  "relieving-letter": "Relieving Letter",
  "termination-letter": "Termination Letter",
  "experience-letter": "Experience Letter",
  "internship-letter": "Internship Offer Letter",
  "posh-policy": "POSH Policy",
  "ethics-code": "Code of Conduct",
  "fnf-settlement": "F&F Settlement Deed",
  "payment-reminder": "Payment Reminder",
  "esop-grant": "ESOP Grant Letter",
  "share-allotment": "Share Allotment Letter",
  "isafe-note": "iSAFE Note",
  sha: "Shareholders Agreement (SHA)",
  "term-sheet": "Investment Term Sheet",
  "founders-deed": "Founders' Deed",
  loi: "Letter of Intent",
  "vendor-onboarding": "Vendor Onboarding Letter",
  "co-founder-agreement": "Co-Founder Agreement",
  "influencer-agreement": "Influencer Agreement",
  "affiliate-agreement": "Affiliate Agreement",
  "sponsorship-agreement": "Sponsorship Agreement",
  "rent-agreement": "Residential Rent Agreement",
  "commercial-lease": "Commercial Lease Deed",
  "leave-license": "Leave & License Agreement",
  "eviction-notice": "Eviction Notice",
  "startup-india": "Startup India Letter",
  "gst-bank-letter": "GST / Bank Letter",
  "board-resolution": "Board Resolution",
  "legal-notice": "Legal Notice",
  "breach-notice": "Breach Notice",
  "ip-assignment": "IP Assignment Agreement",
  gpa: "General Power of Attorney",
  "data-breach-notice": "Data Breach Notification",
  "section-138-notice": "Section 138 Notice",
};

export const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  nda: "Protect trade secrets and proprietary information.",
  mou: "Formalise joint ventures and partnerships.",
  "consultancy-agreement": "Engage freelancers and consultants with IP protection.",
  "service-agreement": "General service terms with payment schedules.",
  "saas-agreement": "Specific terms for cloud-based software subscriptions.",
  "software-license": "Terms for on-premise or perpetual software licensing.",
  "white-label-agreement": "Reselling rights and rebranding terms for technology.",
  "maintenance-agreement": "Post-delivery support and AMC terms for IT projects.",
  "offer-letter": "Professional job offer with compensation details.",
  "appointment-letter": "Definitive employment contract with full policies.",
  "relieving-letter": "Confirm an employee's exit and clearance.",
  "termination-letter": "Issue a compliant termination citing grounds.",
  "experience-letter": "Detail role, responsibilities, and tenure.",
  "internship-letter": "Offer an internship with project scope.",
  "posh-policy": "Mandatory sexual harassment prevention policy (India).",
  "ethics-code": "Corporate ethics and professional code of conduct.",
  "fnf-settlement": "Final waiver signed by departing employees.",
  "payment-reminder": "Professional follow-up for overdue invoices.",
  "esop-grant": "Issue options with vesting and cliff terms.",
  "share-allotment": "Board-ready share allotment correspondence.",
  "isafe-note": "High-speed fundraising instrument (India SAFE).",
  sha: "Definitive governance agreement for shareholders and founders.",
  "term-sheet": "Standardized summary of investment terms for funding.",
  "founders-deed": "Deep-level founder pact focusing on IP and vesting.",
  loi: "Binding/non-binding intent for a deal.",
  "vendor-onboarding": "Formalise vendor scope and compliance.",
  "co-founder-agreement": "Define equity and roles between founders.",
  "influencer-agreement": "Social media collab terms and usage rights.",
  "affiliate-agreement": "Commission-based referral partnership terms.",
  "sponsorship-agreement": "Corporate sponsorship terms for events/media.",
  "rent-agreement": "Standard residential rent terms for India.",
  "commercial-lease": "Lease deed for office or commercial spaces.",
  "leave-license": "Specific format used in states like Maharashtra.",
  "eviction-notice": "Formal notice to vacate premises due to breach.",
  "startup-india": "Application for DPIIT recognition.",
  "gst-bank-letter": "Correspondence for bank/GST compliance.",
  "board-resolution": "Formal record of corporate actions.",
  "legal-notice": "Advocate-led formal notice for disputes.",
  "breach-notice": "Notify a party of contractual violation.",
  "ip-assignment": "Transfer IP ownership to the company.",
  gpa: "Delegate authorized signatory powers legally.",
  "data-breach-notice": "Statutory notification under DPDP Act 2023.",
  "section-138-notice": "Mandatory notice for cheque bounce cases.",
};

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  nda: "🔒", mou: "🤝", "consultancy-agreement": "💼", "service-agreement": "📄",
  "saas-agreement": "☁️", "software-license": "💿", "white-label-agreement": "🏷️", "maintenance-agreement": "�️",
  "offer-letter": "📨", "appointment-letter": "📋", "relieving-letter": "👋", "termination-letter": "✋",
  "experience-letter": "🏅", "internship-letter": "🎓", "posh-policy": "🛡️", "ethics-code": "⚖️", "fnf-settlement": "🤝",
  "payment-reminder": "💸", "esop-grant": "📈", "share-allotment": "🧾", "isafe-note": "🚀",
  sha: "📜", "term-sheet": "�", "founders-deed": "💎",
  loi: "📜", "vendor-onboarding": "🏪", "co-founder-agreement": "👥",
  "influencer-agreement": "📸", "affiliate-agreement": "🔗", "sponsorship-agreement": "🏟️",
  "rent-agreement": "🏠", "commercial-lease": "🏢", "leave-license": "🔑", "eviction-notice": "🚪",
  "startup-india": "🇮🇳", "gst-bank-letter": "🏦", "board-resolution": "📝",
  "legal-notice": "⚖️", "breach-notice": "🚨", "ip-assignment": "🧠",
  gpa: "✍️", "data-breach-notice": "⚠️", "section-138-notice": "💹",
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

/**
 * Validates if an enterprise document should show Party B fields.
 */
export function isEnterpriseDocument(type: DocumentType): boolean {
  const nonEnterprise: DocumentType[] = [
    "offer-letter", "appointment-letter", "relieving-letter", "termination-letter",
    "experience-letter", "internship-letter", "posh-policy", "ethics-code",
    "startup-india", "gst-bank-letter", "board-resolution", "payment-reminder",
    "data-breach-notice", "gpa", "section-138-notice", "fnf-settlement"
  ];
  return !nonEnterprise.includes(type);
}

// ─── Document Status ─────────────────────────────────────────────────────────

export type DocumentStatus = "draft" | "approved" | "exported";

// ─── Workflow Stage ──────────────────────────────────────────────────────────

export type WorkflowStage = "select" | "form" | "blueprint" | "iteration" | "preview" | "export";

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

export interface IterateRequest { documentId: string; message: string; }
export interface IterateResponse { blueprint: Blueprint; aiMessage: string; }
export interface ExportRequest { documentId: string; format: "pdf" | "docx"; }

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
  formData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]).catch("")),
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
  formData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]).catch("")),
  reportId: z.string().optional(),
  userEmail: z.string().email().optional(),
  fullText: z.string().optional(),
  format: z.enum(["pdf", "docx"]),
});

export const previewSchema = z.object({
  blueprint: blueprintSchema,
  formData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]).catch("")),
});

// ─── Agent Types ─────────────────────────────────────────────────────────────

export type AgentTaskStatus = "completed" | "in-progress" | "pending" | "failed";
export interface AgentSubtask { id: string; title: string; description: string; status: AgentTaskStatus; tools?: string[]; }
export interface AgentTask { id: string; title: string; description: string; status: AgentTaskStatus; subtasks: AgentSubtask[]; }

export type AgentMessageSection =
  | { type: "thinking"; content: string }
  | { type: "tool_call"; tool: string; input: string; result?: string }
  | { type: "analysis"; content: string }
  | { type: "text"; content: string }
  | { type: "blueprint_update"; clauses: BlueprintClause[]; message: string };
