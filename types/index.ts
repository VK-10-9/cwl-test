import { z } from "zod";

// ─── Document Types ──────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  // Contracts
  "nda",
  "pitch-deck-nda",
  "mou",
  "consultancy-agreement",
  "independent-contractor",
  "service-agreement",
  "msa",
  "franchise-agreement",
  "saas-agreement",
  "eula",
  "software-license",
  "white-label-agreement",
  "maintenance-agreement",

  // Hiring & HR
  "offer-letter",
  "appointment-letter",
  "non-compete",
  "non-solicitation",
  "esop-policy",
  "relieving-letter",
  "termination-letter",
  "experience-letter",
  "internship-offer-letter",
  "internship-letter",
  "employee-handbook",
  "remote-work-agreement",
  "warning-letter",
  "promotion-letter",
  "posh-policy",
  "ethics-code",
  "fnf-settlement",

  // Fundraising & Equity
  "term-sheet",
  "safe-note",
  "convertible-note",
  "investor-rights",
  "due-diligence-request",
  "founder-declaration",
  "payment-reminder",
  "esop-grant",
  "share-allotment",
  "cap-table",
  "isafe-note",
  "sha",
  "founders-deed",
  "founder-vesting",
  "founder-exit",
  "buyback-agreement",
  "subscription-agreement",

  // Marketing & Partnerships
  "fast-agreement",
  "advisory-board",
  "loi",
  "vendor-onboarding",
  "co-founder-agreement",
  "reseller-agreement",
  "influencer-agreement",
  "affiliate-agreement",
  "sponsorship-agreement",
  "sales-commission",
  "channel-partner",
  "marketing-retainer",

  // Real Estate
  "rent-agreement",
  "commercial-lease",
  "leave-license",
  "eviction-notice",

  // Compliance & Legal
  "startup-india",
  "gst-bank-letter",
  "founder-minutes",
  "share-transfer",
  "nominee-director",
  "employment-bond",
  "confidentiality-reminder",
  "board-resolution",
  "director-resignation",
  "founder-loan",
  "inter-corporate-loan",
  "loan-acknowledgement",
  "settlement-agreement",
  "arbitration-notice",
  "demand-payment",
  "notice-of-default",
  "legal-notice",
  "breach-notice",
  "cease-and-desist",
  "website-disclaimer",
  "bug-bounty",
  "dmca-takedown",
  "ip-assignment",
  "gpa",
  "data-breach-notice",
  "section-138-notice",

  // Tech & Data
  "data-processing-agreement",
  "software-development",
  "api-usage-agreement",
  "open-source-contribution",
  "tech-transfer",

  // Cross-Border
  "international-nda",
  "export-agreement",
  "cross-border-service",
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
  "pitch-deck-nda": "Pitch Deck NDA",
  mou: "Memorandum of Understanding",
  "consultancy-agreement": "Consultancy Agreement",
  "independent-contractor": "Independent Contractor Agreement",
  "service-agreement": "Service Agreement",
  msa: "Master Service Agreement",
  "franchise-agreement": "Franchise Agreement",
  "saas-agreement": "SaaS Subscription Agreement",
  eula: "End User License Agreement",
  "software-license": "Software Licensing Agreement",
  "white-label-agreement": "White-Label Agreement",
  "maintenance-agreement": "AMC / Maintenance Agreement",
  "offer-letter": "Offer Letter",
  "appointment-letter": "Appointment Letter",
  "non-compete": "Non-Compete Agreement",
  "non-solicitation": "Non-Solicitation Agreement",
  "esop-policy": "ESOP Policy Document",
  "relieving-letter": "Relieving Letter",
  "termination-letter": "Termination Letter",
  "experience-letter": "Experience Letter",
  "internship-offer-letter": "Internship Offer Letter",
  "internship-letter": "Internship Letter",
  "employee-handbook": "Employee Handbook",
  "remote-work-agreement": "Remote Work Agreement",
  "warning-letter": "Warning Letter",
  "promotion-letter": "Promotion Letter",
  "posh-policy": "POSH Policy",
  "ethics-code": "Code of Conduct",
  "fnf-settlement": "F&F Settlement Deed",
  "term-sheet": "Investment Term Sheet",
  "safe-note": "SAFE Note",
  "convertible-note": "Convertible Note",
  "investor-rights": "Investor Rights Agreement",
  "due-diligence-request": "Due Diligence Request Letter",
  "founder-declaration": "Founder Declaration Letter",
  "payment-reminder": "Payment Reminder",
  "esop-grant": "ESOP Grant Letter",
  "share-allotment": "Share Allotment Letter",
  "cap-table": "Cap Table Template",
  "isafe-note": "iSAFE Note",
  sha: "Shareholders Agreement (SHA)",
  "founder-vesting": "Founder Vesting Agreement",
  "founder-exit": "Founder Exit Agreement",
  "buyback-agreement": "Buyback Agreement",
  "subscription-agreement": "Subscription Agreement",
  "founders-deed": "Founders' Deed",
  "fast-agreement": "FAST Agreement",
  "advisory-board": "Advisory Board Agreement",
  loi: "Letter of Intent",
  "vendor-onboarding": "Vendor Onboarding Letter",
  "co-founder-agreement": "Co-Founder Agreement",
  "reseller-agreement": "Reseller Agreement",
  "influencer-agreement": "Influencer Agreement",
  "affiliate-agreement": "Affiliate Agreement",
  "sponsorship-agreement": "Sponsorship Agreement",
  "sales-commission": "Sales Commission Agreement",
  "channel-partner": "Channel Partner Agreement",
  "marketing-retainer": "Marketing Retainer Agreement",
  "rent-agreement": "Residential Rent Agreement",
  "commercial-lease": "Commercial Lease Deed",
  "leave-license": "Leave & License Agreement",
  "eviction-notice": "Eviction Notice",
  "startup-india": "Startup India Letter",
  "gst-bank-letter": "GST / Bank Letter",
  "founder-minutes": "Founders' Meeting Minutes",
  "share-transfer": "Share Transfer Agreement",
  "nominee-director": "Nominee Director Agreement",
  "employment-bond": "Employment Bond Agreement",
  "confidentiality-reminder": "Confidentiality Reminder Notice",
  "board-resolution": "Board Resolution",
  "director-resignation": "Director Resignation Letter",
  "founder-loan": "Founder Loan Agreement",
  "inter-corporate-loan": "Inter-Corporate Loan Agreement",
  "loan-acknowledgement": "Loan Acknowledgement Letter",
  "settlement-agreement": "Settlement Agreement",
  "arbitration-notice": "Arbitration Notice",
  "demand-payment": "Demand for Payment Notice",
  "notice-of-default": "Notice of Default",
  "legal-notice": "Legal Notice",
  "breach-notice": "Breach Notice",
  "cease-and-desist": "Cease & Desist Notice",
  "website-disclaimer": "Website Disclaimer",
  "bug-bounty": "Bug Bounty Policy",
  "dmca-takedown": "DMCA Takedown Notice",
  "ip-assignment": "IP Assignment Agreement",
  gpa: "General Power of Attorney",
  "data-breach-notice": "Data Breach Notification",
  "section-138-notice": "Section 138 Notice",
  "data-processing-agreement": "Data Processing Agreement",
  "software-development": "Software Development Agreement",
  "api-usage-agreement": "API Usage Agreement",
  "open-source-contribution": "Open Source Contribution",
  "tech-transfer": "Technology Transfer Agreement",
  "international-nda": "International NDA",
  "export-agreement": "Export Agreement",
  "cross-border-service": "Cross-Border Service Agreement",
};

export const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  nda: "Protect trade secrets and proprietary information.",
  "pitch-deck-nda": "Protect startup pitch deck and financials.",
  mou: "Formalise joint ventures and partnerships.",
  "consultancy-agreement": "Engage freelancers and consultants with IP protection.",
  "independent-contractor": "Hire independent professionals securely.",
  "service-agreement": "General service terms with payment schedules.",
  msa: "Overarching terms for master service agreements.",
  "franchise-agreement": "Format for franchising IP and brand.",
  "saas-agreement": "Specific terms for cloud-based software subscriptions.",
  eula: "End-user licensing terms and software limitations.",
  "software-license": "Terms for on-premise or perpetual software licensing.",
  "white-label-agreement": "Reselling rights and rebranding terms for technology.",
  "maintenance-agreement": "Post-delivery support and AMC terms for IT projects.",
  "offer-letter": "Professional job offer with compensation details.",
  "appointment-letter": "Definitive employment contract with full policies.",
  "non-compete": "Restrict employees from joining competitors.",
  "non-solicitation": "Prevent poaching of clients or employees.",
  "esop-policy": "Draft the framework for Employee Stock Options.",
  "relieving-letter": "Confirm an employee's exit and clearance.",
  "termination-letter": "Issue a compliant termination citing grounds.",
  "experience-letter": "Detail role, responsibilities, and tenure.",
  "internship-offer-letter": "Offer an internship with project scope.",
  "internship-letter": "Internship agreement with standard terms.",
  "employee-handbook": "Company policies covering PoSH, IT, and conduct.",
  "remote-work-agreement": "Guidelines and reimbursements for remote work.",
  "warning-letter": "Formal disciplinary warning for misconduct.",
  "promotion-letter": "Official communication for role advancement.",
  "posh-policy": "Mandatory sexual harassment prevention policy (India).",
  "ethics-code": "Corporate ethics and professional code of conduct.",
  "fnf-settlement": "Final waiver signed by departing employees.",
  "term-sheet": "Standardized summary of investment terms for funding.",
  "safe-note": "Simple Agreement for Future Equity.",
  "convertible-note": "Short-term debt instrument converting to equity.",
  "investor-rights": "Grants board seats, pro-rata, and info rights.",
  "due-diligence-request": "Information request letter for VC diligence.",
  "founder-declaration": "Compliance and clean representation letter.",
  "payment-reminder": "Professional follow-up for overdue invoices.",
  "esop-grant": "Issue options with vesting and cliff terms.",
  "share-allotment": "Board-ready share allotment correspondence.",
  "cap-table": "Template for managing ownership equity.",
  "isafe-note": "High-speed fundraising instrument (India SAFE).",
  sha: "Definitive governance agreement for shareholders and founders.",
  "founder-vesting": "Reverse vesting schedules for founder equity.",
  "founder-exit": "Agreement outlining terms when a founder leaves.",
  "buyback-agreement": "Terms for company repurchase of shares.",
  "subscription-agreement": "Commitment from investor to purchase shares.",
  "founders-deed": "Deep-level founder pact focusing on IP and vesting.",
  "fast-agreement": "Standard Founder Institute advisory agreement.",
  "advisory-board": "Agreement to engage industry expert advisors.",
  loi: "Binding/non-binding intent for a deal.",
  "vendor-onboarding": "Formalise vendor scope and compliance.",
  "co-founder-agreement": "Define equity and roles between founders.",
  "reseller-agreement": "Authorize third-party to resell products.",
  "influencer-agreement": "Social media collab terms and usage rights.",
  "affiliate-agreement": "Commission-based referral partnership terms.",
  "sponsorship-agreement": "Corporate sponsorship terms for events/media.",
  "sales-commission": "Structure payouts for sales teams.",
  "channel-partner": "Distribution agreement for startup products.",
  "marketing-retainer": "Ongoing service agreement for marketing agencies.",
  "rent-agreement": "Standard residential rent terms for India.",
  "commercial-lease": "Lease deed for office or commercial spaces.",
  "leave-license": "Specific format used in states like Maharashtra.",
  "eviction-notice": "Formal notice to vacate premises due to breach.",
  "startup-india": "Application for DPIIT recognition.",
  "gst-bank-letter": "Correspondence for bank/GST compliance.",
  "founder-minutes": "Meeting minutes for pre-board decisions.",
  "share-transfer": "Framework for transferring existing shares.",
  "nominee-director": "Appoint investor director to the board.",
  "employment-bond": "Tenure commitment from employees.",
  "confidentiality-reminder": "Periodic reminder of NDA obligations.",
  "board-resolution": "Formal record of corporate actions.",
  "director-resignation": "Formal resignation from the company board.",
  "founder-loan": "Formalize founder lending to the startup.",
  "inter-corporate-loan": "Loan agreement between group companies.",
  "loan-acknowledgement": "Simple letter confirming a debt.",
  "settlement-agreement": "Contract to mutually close disputes.",
  "arbitration-notice": "Invoke arbitration to resolve disputes.",
  "demand-payment": "Final warning letter demanding unpaid dues.",
  "notice-of-default": "Formal notification of loan or service default.",
  "legal-notice": "Advocate-led formal notice for disputes.",
  "breach-notice": "Notify a party of contractual violation.",
  "cease-and-desist": "Demand halt to illegal activity or IP infringement.",
  "website-disclaimer": "Limit legal liability on platform info/services.",
  "bug-bounty": "Policy and scope for ethical hackers.",
  "dmca-takedown": "Request removal of copyrighted content.",
  "ip-assignment": "Transfer IP ownership to the company.",
  gpa: "Delegate authorized signatory powers legally.",
  "data-breach-notice": "Statutory notification under DPDP Act 2023.",
  "section-138-notice": "Mandatory notice for cheque bounce cases.",
  "data-processing-agreement": "DPDP and GDPR compliance for handling user data.",
  "software-development": "Agreement for outsourcing dev services.",
  "api-usage-agreement": "Terms for third-party developers using your API.",
  "open-source-contribution": "Framework for accepting community code.",
  "tech-transfer": "Agreement for licensing core technology/IP.",
  "international-nda": "Cross-border NDA with jurisdiction clauses.",
  "export-agreement": "Terms for selling / exporting goods or services.",
  "cross-border-service": "Service terms tailored for international clients.",
};

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  nda: "🔒", "pitch-deck-nda": "🤫", mou: "🤝", "consultancy-agreement": "💼", "independent-contractor": "👤", "service-agreement": "📄", msa: "📑", "franchise-agreement": "🏪", "saas-agreement": "☁️", eula: "✅", "software-license": "💿", "white-label-agreement": "🏷️", "maintenance-agreement": "🔧",
  "offer-letter": "📨", "appointment-letter": "📋", "non-compete": "🚧", "non-solicitation": "🛑", "esop-policy": "📈", "relieving-letter": "👋", "termination-letter": "✋", "experience-letter": "🏅", "internship-offer-letter": "🎓", "internship-letter": "🎓", "employee-handbook": "📖", "remote-work-agreement": "🏠", "warning-letter": "⚠️", "promotion-letter": "🚀", "posh-policy": "🛡️", "ethics-code": "⚖️", "fnf-settlement": "🤝",
  "term-sheet": "📑", "safe-note": "🚀", "convertible-note": "🔄", "investor-rights": "👁️", "due-diligence-request": "🔍", "founder-declaration": "✋", "payment-reminder": "💸", "esop-grant": "📈", "share-allotment": "🧾", "cap-table": "📊", "isafe-note": "🚀", sha: "📜", "founder-vesting": "⏳", "founder-exit": "🚪", "buyback-agreement": "🔙", "subscription-agreement": "✍️", "founders-deed": "💎",
  "fast-agreement": "⚡", "advisory-board": "🧠", loi: "📜", "vendor-onboarding": "🏪", "co-founder-agreement": "👥", "reseller-agreement": "🔄", "influencer-agreement": "📸", "affiliate-agreement": "🔗", "sponsorship-agreement": "🏟️", "sales-commission": "💰", "channel-partner": "🤝", "marketing-retainer": "📢",
  "rent-agreement": "🏠", "commercial-lease": "🏢", "leave-license": "🔑", "eviction-notice": "🚪",
  "startup-india": "🇮🇳", "gst-bank-letter": "🏦", "founder-minutes": "⏱️", "share-transfer": "🔀", "nominee-director": "👔", "employment-bond": "⛓️", "confidentiality-reminder": "🔔", "board-resolution": "📝", "director-resignation": "📨", "founder-loan": "💸", "inter-corporate-loan": "🏢", "loan-acknowledgement": "✅", "settlement-agreement": "🤝", "arbitration-notice": "⚖️", "demand-payment": "❗", "notice-of-default": "🚨", "legal-notice": "⚖️", "breach-notice": "🚨", "cease-and-desist": "🛑", "website-disclaimer": "⚠️", "bug-bounty": "🐛", "dmca-takedown": "🗑️", "ip-assignment": "🧠", gpa: "✍️", "data-breach-notice": "⚠️", "section-138-notice": "💹",
  "data-processing-agreement": "🛡️", "software-development": "💻", "api-usage-agreement": "🔌", "open-source-contribution": "🌐", "tech-transfer": "📦",
  "international-nda": "🌍", "export-agreement": "🚢", "cross-border-service": "✈️",
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

export type DocumentStatus = "draft" | "approved" | "exported" | "signed";

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
export interface ExportRequest { documentId: string; format: "pdf" | "docx"; watermark?: boolean; targetLanguage?: string; }

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
  watermark: z.boolean().optional(),
  targetLanguage: z.string().optional(),
  consentGiven: z.boolean().optional(),
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
