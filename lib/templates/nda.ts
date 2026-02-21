import type { DocumentTemplate } from "@/types";

export const ndaTemplate: DocumentTemplate = {
    type: "nda",
    label: "Non-Disclosure Agreement",
    description:
        "Create a robust NDA tailored to your specific needs—whether for employees, vendors, or mutual business partnerships.",
    isTwoParty: true,
    fields: [
        // 1. Core Structure
        {
            name: "disclosureType",
            label: "Direction of Disclosure",
            type: "select",
            required: true,
            options: [
                { label: "Unilateral (One-way disclosure)", value: "unilateral" },
                { label: "Mutual (Both parties share info)", value: "mutual" },
            ],
            description: "Is confidential information flowing one way or both ways?",
        },
        {
            name: "relationshipType",
            label: "Relationship Context",
            type: "select",
            required: true,
            options: [
                { label: "General Business / Partnership", value: "general" },
                { label: "Employer - Employee", value: "employee" },
                { label: "Company - Contractor/Vendor", value: "contractor" },
                { label: "Startup - Investor", value: "investor" },
            ],
            description: "The nature of the relationship determines specific clauses.",
        },

        // 2. Key Terms
        {
            name: "jurisdiction",
            label: "Jurisdiction (Courts at)",
            type: "select",
            required: true,
            options: [
                { label: "Mumbai", value: "Mumbai" },
                { label: "Delhi", value: "Delhi" },
                { label: "Bangalore", value: "Bangalore" },
                { label: "Chennai", value: "Chennai" },
                { label: "Hyderabad", value: "Hyderabad" },
                { label: "Kolkata", value: "Kolkata" },
                { label: "Pune", value: "Pune" },
                { label: "Ahmedabad", value: "Ahmedabad" },
            ],
            description: "City whose courts will have jurisdiction. Governed by laws of India.",
        },
        {
            name: "duration",
            label: "Agreement Term", // Renamed for clarity
            type: "select",
            required: true,
            options: [
                { label: "1 Year", value: "1-year" },
                { label: "2 Years", value: "2-years" },
                { label: "3 Years", value: "3-years" },
                { label: "5 Years", value: "5-years" },
                { label: "Indefinite (Until Terminated)", value: "indefinite" },
            ],
            description: "How long the specific relationship/engagement lasts.",
        },
        {
            name: "confidentialityDuration",
            label: "Confidentiality Survival",
            type: "select",
            required: true,
            options: [
                { label: "2 Years", value: "2" },
                { label: "3 Years", value: "3" },
                { label: "5 Years", value: "5" },
                { label: "Perpetual (Forever)", value: "perpetual" },
            ],
            description: "How long secrecy must be maintained after the agreement ends.",
        },
        {
            name: "disputeResolution",
            label: "Dispute Resolution Mode",
            type: "select",
            required: true,
            options: [
                { label: "Arbitration (Private & Faster)", value: "arbitration" },
                { label: "Courts (Standard Litigation)", value: "court" },
            ],
            description: "Arbitration is generally preferred for commercial confidentiality disputes.",
        },

        // 3. Risk Controls (Toggles) - We will implement these as checkboxes in layout
        {
            name: "includeNonCompete",
            label: "Include Non-Compete Clause?",
            type: "checkbox", // New type to handle
            required: false,
            description: "Restrict the receiving party from starting a competing business for a set period.",
        },
        {
            name: "includeNonSolicit",
            label: "Include Non-Solicitation Clause?",
            type: "checkbox",
            required: false,
            description: "Prevent poaching of employees or clients.",
        },
        {
            name: "includeIPAssignment",
            label: "Include IP Assignment?",
            type: "checkbox",
            required: false,
            description: "Ensure all work/inventions created belong to the Disclosing Party (vital for employees/contractors).",
        },
        {
            name: "includeNonCircumvent",
            label: "Include Non-Circumvention?",
            type: "checkbox",
            required: false,
            description: "Prevents bypassing the business relationship to deal directly with introduced contacts.",
        },
        {
            name: "includeIndemnity",
            label: "Include Indemnity Clause?",
            type: "checkbox",
            required: false,
            description: "Receiving party indemnifies for losses arising from breach.",
        },
        {
            name: "includeDataProtection",
            label: "Include Data Protection Clause?",
            type: "checkbox",
            required: false,
            description: "Required if personal data or SPDI is shared (IT Act, 2000 / DPDP Act, 2023).",
        },
        {
            name: "includeTradeSecrets",
            label: "Include Trade Secrets Clause?",
            type: "checkbox",
            required: false,
            description: "Perpetual protection for trade secrets (source code, formulas, processes).",
        },
        {
            name: "includeAuditRights",
            label: "Include Audit Rights?",
            type: "checkbox",
            required: false,
            description: "Right to audit the receiving party's compliance (enterprise NDAs).",
        },

        // 4. Specifics
        {
            name: "confidentialityScope",
            label: "Scope of Confidential Information",
            type: "textarea",
            placeholder:
                "Describe what is being shared (e.g., source code, customer lists, financial models, marketing strategies)...",
            required: true,
        },
        {
            name: "purpose",
            label: "Purpose of Disclosure",
            type: "textarea",
            placeholder:
                "e.g., Evaluating a potential merger, performing software development services, employment duties...",
            required: true,
        },
    ],
    defaultClauses: [
        // Core Structural (1-4)
        "Title and Effective Date",
        "Parties Clause",
        "Recitals / Background",
        "Purpose Clause",
        // Confidentiality Framework (5-7)
        "Definition of Confidential Information",
        "Exclusions from Confidential Information",
        "Obligations of Receiving Party",
        // Term & Survival (8-10)
        "Term of Agreement",
        "Survival of Confidentiality Obligations",
        "Termination",
        // Protective & Enforcement (11-13)
        "Return or Destruction of Information",
        "Remedies",
        // Dispute & Legal (14-16)
        "Governing Law",
        // IP (21)
        "No License",
        // Structural & Safety (24-30)
        "Severability",
        "Entire Agreement",
        "Amendment",
        "Waiver",
        "Assignment",
        "Notices",
        "Counterparts and Electronic Signatures",
    ],
};
