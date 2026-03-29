import { DocumentTemplate } from "@/types";

export const shaTemplate: DocumentTemplate = {
    type: "sha",
    label: "Shareholders Agreement (SHA)",
    description: "The definitive governance agreement for shareholders, covering veto rights, exit clauses, and board seats.",
    isTwoParty: true,
    fields: [
        {
            name: "investorEntity",
            label: "Investor Entity Name",
            type: "text",
            required: true,
            placeholder: "e.g. Peak XV Partners"
        },
        {
            name: "investmentRound",
            label: "Investment Round",
            type: "select",
            required: true,
            options: [
                { label: "Seed", value: "seed" },
                { label: "Series A", value: "series_a" },
                { label: "Series B", value: "series_b" },
                { label: "Angel", value: "angel" }
            ]
        },
        {
            name: "boardSeats",
            label: "Number of Board Seats",
            type: "number",
            required: true,
            placeholder: "e.g. 3"
        },
        {
            name: "reservedMatters",
            label: "Include Veto/Reserved Matters?",
            type: "checkbox",
            required: false,
            description: "List of actions requiring majority investor consent."
        },
        {
            name: "liquidationPreference",
            label: "Liquidation Preference",
            type: "select",
            required: true,
            options: [
                { label: "1x Non-Participating", value: "1x_non_participation" },
                { label: "1x Participating", value: "1x_participation" }
            ]
        }
    ],
    defaultClauses: [
        "Confidentiality & Privilege Notice",
        "Definitions and Interpretation",
        "Board of Directors and Governance",
        "Reserved Matters and Veto Rights",
        "Transfer of Shares (ROFR and ROFO)",
        "Tag-Along and Drag-Along Rights",
        "Pre-Emptive Rights",
        "Liquidation Preference",
        "Information and Inspection Rights",
        "Exit Rights and IPO Timeline",
        "Representations and Warranties",
        "Non-Compete and Non-Solicit",
        "Dispute Resolution and Jurisdiction"
    ]
};
