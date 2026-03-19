import type { DocumentTemplate } from "@/types";

export const mouTemplate: DocumentTemplate = {
    type: "mou",
    label: "Memorandum of Understanding",
    description:
        "Establish a formal understanding between organisations outlining shared objectives and responsibilities.",
    isTwoParty: true,
    fields: [
        // 1. Core Structure
        {
            name: "mouType",
            label: "Type of MOU",
            type: "select",
            required: true,
            options: [
                { label: "General Partnership", value: "partnership" },
                { label: "Research Collaboration", value: "research" },
                { label: "Academic Exchange", value: "academic" },
                { label: "Business Joint Venture", value: "joint-venture" },
                { label: "Non-profit Collaboration", value: "nonprofit" },
            ],
            description: "The nature of the collaboration determines specific clauses and obligations.",
        },
        {
            name: "relationshipContext",
            label: "Relationship Context",
            type: "select",
            required: true,
            options: [
                { label: "Corporate-Corporate", value: "corp-corp" },
                { label: "Academic-Industry", value: "academic-industry" },
                { label: "Government-Private", value: "gov-private" },
                { label: "Non-profit-For-profit", value: "nonprofit-profit" },
            ],
            description: "Context affects compliance requirements and standard clauses.",
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
            name: "startDate",
            label: "Effective Start Date",
            type: "date",
            required: true,
        },
        {
            name: "duration",
            label: "Duration of Agreement",
            type: "select",
            required: true,
            options: [
                { label: "6 Months", value: "6-months" },
                { label: "1 Year", value: "1-year" },
                { label: "2 Years", value: "2-years" },
                { label: "3 Years", value: "3-years" },
                { label: "5 Years", value: "5-years" },
                { label: "Indefinite (Until Terminated)", value: "indefinite" },
                { label: "Project-based", value: "project-completion" },
            ],
        },
        {
            name: "renewalTerms",
            label: "Renewal Terms",
            type: "select",
            required: false,
            options: [
                { label: "Auto-renew unless terminated", value: "auto-renew" },
                { label: "Manual renewal required", value: "manual" },
                { label: "No renewal (fixed term)", value: "fixed" },
            ],
            description: "How the agreement renews after the initial term.",
        },
        {
            name: "disputeResolution",
            label: "Dispute Resolution Mode",
            type: "select",
            required: true,
            options: [
                { label: "Arbitration (Private & Faster)", value: "arbitration" },
                { label: "Mediation First, then Arbitration", value: "mediation-arbitration" },
                { label: "Courts (Standard Litigation)", value: "court" },
                { label: "Negotiation then Courts", value: "negotiation-court" },
            ],
        },

        // 3. Purpose and Objectives
        {
            name: "purpose",
            label: "Purpose of the MOU",
            type: "textarea",
            placeholder:
                "e.g., Collaboration on joint research and development of sustainable energy solutions...",
            required: true,
            description: "Clearly state the main purpose and objectives of this collaboration.",
        },
        {
            name: "specificObjectives",
            label: "Specific Objectives",
            type: "textarea",
            placeholder: "List specific measurable objectives (e.g., Develop 3 prototypes, publish 2 joint papers)...",
            required: true,
            description: "Concrete deliverables or milestones expected from this partnership.",
        },

        // 4. Responsibilities
        {
            name: "responsibilitiesA",
            label: "Responsibilities of Party A",
            type: "textarea",
            placeholder: "e.g., Provide research facilities, contribute 2 researchers, share technical resources...",
            required: true,
            description: "Detailed obligations and contributions from Party A.",
        },
        {
            name: "responsibilitiesB",
            label: "Responsibilities of Party B",
            type: "textarea",
            placeholder: "e.g., Provide funding of ₹10,00,000, manage project coordination, share expertise...",
            required: true,
            description: "Detailed obligations and contributions from Party B.",
        },
        {
            name: "keyPersonnelA",
            label: "Key Personnel from Party A",
            type: "text",
            placeholder: "e.g., Dr. Anand Rao (Lead), Priya Singh (Coordinator)",
            required: false,
        },
        {
            name: "keyPersonnelB",
            label: "Key Personnel from Party B",
            type: "text",
            placeholder: "e.g., Dr. Meera Patel (Director), Team Leads...",
            required: false,
        },

        // 5. Risk Controls
        {
            name: "includeConfidentiality",
            label: "Include Confidentiality Clause?",
            type: "checkbox",
            required: false,
            description: "Protect sensitive information shared during the collaboration.",
        },
        {
            name: "includeNonCompete",
            label: "Include Non-Compete Clause?",
            type: "checkbox",
            required: false,
            description: "Prevent parties from using shared knowledge to compete directly.",
        },
        {
            name: "includeIPClause",
            label: "Include IP Ownership Clause?",
            type: "checkbox",
            required: false,
            description: "Define who owns intellectual property created during the collaboration.",
        },
        {
            name: "includeDataProtection",
            label: "Include Data Protection Clause?",
            type: "checkbox",
            required: false,
            description: "Required if personal data will be shared or processed.",
        },
        {
            name: "includeForceMajeure",
            label: "Include Force Majeure Clause?",
            type: "checkbox",
            required: false,
            description: "Covers unforeseeable circumstances that prevent fulfilling obligations.",
        },

        // 6. Financial Terms
        {
            name: "financialTerms",
            label: "Financial Arrangements",
            type: "textarea",
            placeholder: "e.g., Joint funding of ₹20,00,000 (Party A: 60%, Party B: 40%), cost-sharing...",
            required: false,
            description: "Any financial contributions, cost-sharing, or payment terms.",
        },
        {
            name: "budgetCap",
            label: "Total Budget Cap (if applicable)",
            type: "text",
            placeholder: "e.g., ₹50,00,000",
            required: false,
        },

        // 7. Termination
        {
            name: "terminationNotice",
            label: "Termination Notice Period",
            type: "select",
            required: true,
            options: [
                { label: "30 Days", value: "30-days" },
                { label: "60 Days", value: "60-days" },
                { label: "90 Days", value: "90-days" },
                { label: "6 Months", value: "6-months" },
            ],
            description: "Advance notice required to terminate this MOU.",
        },
        {
            name: "terminationConditions",
            label: "Termination Conditions",
            type: "textarea",
            placeholder: "e.g., Material breach, failure to meet obligations, mutual agreement...",
            required: false,
            description: "Specific conditions under which either party can terminate.",
        },

        // 8. Reporting and Communication
        {
            name: "reportingSchedule",
            label: "Reporting Schedule",
            type: "select",
            required: false,
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Semi-annually", value: "semi-annual" },
                { label: "Annually", value: "annual" },
                { label: "As-needed", value: "as-needed" },
            ],
            description: "Frequency of progress reports between parties.",
        },
        {
            name: "steeringCommittee",
            label: "Steering Committee Details",
            type: "textarea",
            placeholder: "e.g., Comprising 2 members from each party, meeting quarterly...",
            required: false,
            description: "If applicable, details of oversight committee.",
        },

        // 9. Exclusivity
        {
            name: "exclusivity",
            label: "Exclusivity Arrangement",
            type: "select",
            required: true,
            options: [
                { label: "Non-exclusive (either party can work with others)", value: "non-exclusive" },
                { label: "Exclusive for this specific area", value: "exclusive-area" },
                { label: "Exclusive for duration of agreement", value: "exclusive-duration" },
            ],
            description: "Whether parties are restricted from similar collaborations.",
        },

        // 10. Publication and Publicity
        {
            name: "publicationRights",
            label: "Publication and Publicity Rights",
            type: "select",
            required: false,
            options: [
                { label: "Joint press releases allowed", value: "joint-pr" },
                { label: "Individual PR with prior approval", value: "individual-approval" },
                { label: "No public disclosure without consent", value: "no-disclosure" },
                { label: "Academic publications allowed", value: "academic-allowed" },
            ],
        },
    ],
    defaultClauses: [
        "Preamble and Recitals",
        "Purpose and Objectives",
        "Scope of Collaboration",
        "Roles and Responsibilities",
        "Financial Arrangements",
        "Term and Duration",
        "Confidentiality",
        "Intellectual Property",
        "Data Protection",
        "Representatives and Communication",
        "Reporting and Monitoring",
        "Amendment Procedure",
        "Termination",
        "Dispute Resolution",
        "Governing Law",
        "Signatures",
    ],
};
