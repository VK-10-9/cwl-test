import { DocumentTemplate } from "@/types";

export const foundersDeedTemplate: DocumentTemplate = {
    type: "founders-deed",
    label: "Founders' Deed",
    description: "A deep-level founder pact focusing on IP assignment, detailed reverse vesting, and long-term commitment.",
    isTwoParty: true,
    fields: [
        {
            name: "initialEquitySplit",
            label: "Proposed Equity Split (%)",
            type: "text",
            required: true,
            placeholder: "e.g. 60-40 or 33-33-33"
        },
        {
            name: "vestingPeriod",
            label: "Vesting Period (Years)",
            type: "number",
            required: true,
            placeholder: "e.g. 4"
        },
        {
            name: "cliffPeriod",
            label: "Cliff Period (Months)",
            type: "number",
            required: true,
            placeholder: "e.g. 12"
        },
        {
            name: "includeIPAssignment",
            label: "Include IP Assignment Clause?",
            type: "checkbox",
            required: false,
            description: "Essential for ensuring the startup owns all code/designs created before incorporation."
        }
    ],
    defaultClauses: [
        "Preamble and Ownership Structure",
        "Reverse Vesting and Cliff",
        "Buyback Rights and Triggers",
        "Intellectual Property Assignment",
        "Long-term Commitment and Time Allocation",
        "Roles and Decision Making",
        "Restricted Actions and Vetoes",
        "Termination and Exit Scenarios",
        "Good Leaver vs Bad Leaver Definitions",
        "Confidentiality and Non-Compete",
        "Dispute Resolution"
    ]
};
