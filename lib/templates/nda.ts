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
            label: "Governing Law / Jurisdiction",
            type: "select",
            required: true,
            options: [
                { label: "India", value: "India" },
                { label: "United States (Delaware)", value: "US-DE" },
                { label: "United States (California)", value: "US-CA" },
                { label: "United Kingdom", value: "UK" },
                { label: "European Union", value: "EU" },
            ],
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
        "Definitions (Confidential Information)",
        " Obligations of Receiving Party",
        "Exceptions to Confidential Information",
        "Term and Termination",
        "Return or Destruction of Materials",
        "Remedies (Injunctions)",
        "Governing Law and Jurisdiction",
    ],
};
